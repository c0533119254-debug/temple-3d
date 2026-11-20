// סדר התמיד: 14 תחנות לפי הכותרת, הטלה בברקאי ובשחיטה, נשיאת כפיים בברכה, בלי שגיאת מצלמה.
//
//   python3 -m http.server 8765
//   node tools/test/tamid-scene.js http://localhost:8765/ tamid-out
//   SHOTS=1 node tools/test/tamid-scene.js http://localhost:8765/ tamid-out phone
const { chromium } = require("playwright");
const fs = require("fs");
const URL = process.argv[2] || "http://localhost:8765/";
const OUT = process.argv[3] || "tamid-out";
const PHONE = process.argv[4] === "phone";
const SHOTS = process.env.SHOTS === "1";
fs.mkdirSync(OUT, { recursive: true });
const ARGS = { args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] };
const TITLES = ["לילה — השומרים והמפתחות", "הפיס הראשון", "תרומת הדשן", "סידור המערכה", "הפיס השני — 13 כהנים", "ברקאי — האיר המזרח", "השחיטה והזריקה", "דישון המזבח הפנימי והמנורה", "הולכת האיברים לכבש", "קריאת שמע בלשכת הגזית", "הפיס השלישי והרביעי", "הקטורת", "ברכת כהנים", "ניסוך, שיר ותקיעות"];
const KEYS = ["night", "pais1", "deshen", "wood", "pais2", "lamb", "shechita", "heikhal", "limbs", "shema", "pais4", "ketoret", "birkat", "shir"];

(async () => {
  const browser = await chromium.launch(ARGS);
  const ctx = await browser.newContext({ locale: "he-IL", viewport: PHONE ? { width: 390, height: 844 } : { width: 1280, height: 800 }, isMobile: PHONE, hasTouch: PHONE });
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 400)));
  await pg.addInitScript(() => { try { localStorage.setItem("tm_intro", "1"); } catch (e) {} });
  await pg.goto(URL, { timeout: 120000, waitUntil: "domcontentloaded" });
  await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
  await pg.click("#enterBtn");
  await pg.waitForTimeout(800);
  const audio = await pg.evaluate(async () => {
    const j = await (await fetch("audio/index.json")).json();
    return j.tamid;
  });
  if (!audio || audio.length !== 14) throw new Error("מיפוי הקריינות אינו 14 קבצים: " + JSON.stringify(audio));
  if (audio[10] !== "tamid_11b.mp3") throw new Error("תחנה 11 צריכה tamid_11b, יש " + audio[10]);
  await pg.evaluate(() => window.__STORY.start("tamid"));
  await pg.waitForFunction(() => window.__TOURFIGS_READY && window.__TAMID && window.__STORY && window.__STORY.S.def && window.__STORY.S.def.steps.length === 14, null, { timeout: 120000 });
  const titles = await pg.evaluate(() => window.__STORY.S.def.steps.map((s) => s.title));
  if (JSON.stringify(titles) !== JSON.stringify(TITLES)) throw new Error("סדר הכותרות השתנה:\n" + titles.join(" | "));
  const rows = [];
  async function shot(name) {
    if (!SHOTS) return;
    await pg.evaluate(() => { const box = document.getElementById("story"), b = document.getElementById("stFold"); if (box && b && !box.classList.contains("fold")) b.click(); });
    await pg.waitForTimeout(400);
    await pg.screenshot({ path: OUT + "/" + name, timeout: 120000 });
  }
  for (let i = 0; i < 14; i++) {
    await pg.evaluate((n) => window.__STORY.go(n), i);
    await pg.waitForFunction((n) => window.__STORY.S.i === n && window.__TAMID.key() === ["night", "pais1", "deshen", "wood", "pais2", "lamb", "shechita", "heikhal", "limbs", "shema", "pais4", "ketoret", "birkat", "shir"][n], i, { timeout: 30000 });
    await pg.waitForTimeout(500);
    const info = await pg.evaluate(() => {
      const c = window.__GA && window.__GA.getCam && window.__GA.getCam();
      const p = c && c.position, t = window.__GA.getControls && window.__GA.getControls().target;
      const fin = (v) => v && [v.x, v.y, v.z].every((n) => Number.isFinite(n));
      return { key: window.__TAMID.key(), title: window.__STORY.S.def.steps[window.__STORY.S.i].title, lamb: window.__TAMID.lamb(), cam: fin(p) && fin(t), cast: window.__TOURFIG.cast() };
    });
    if (!info.cam) throw new Error("מצלמה לא תקינה בתחנה " + (i + 1) + " " + info.title);
    if (info.key !== KEYS[i] || info.title !== TITLES[i]) throw new Error("קישור לפי אינדקס ולא לפי כותרת: " + JSON.stringify(info));
    const lay = await pg.evaluate(() => {
      const F = window.__TOURFIG;
      return (F.lay ? F.lay() : []).filter((f) => (f.kind === "pilgrim" || f.kind === "pilgrim2") && F.offLimits(f.u, f.v));
    });
    if (lay.length) throw new Error("מי שאינו כהן באזור האסור («" + info.title + "»): " + JSON.stringify(lay));
    if (i === 11) {
      const p = await pg.evaluate(() => window.__TOURFIG.lay().filter((f) => f.kind === "pilgrim" || f.kind === "pilgrim2"));
      if (p.length) throw new Error("בקטורת עומד מי שאינו כהן: " + JSON.stringify(p));
    }
    if (i === 12 || i === 13) {
      const p = await pg.evaluate(() => window.__TOURFIG.lay().filter((f) => f.kind === "pilgrim"));
      if (p.length < 4 || p.some((f) => f.u < 285)) throw new Error("העם אינו מזרחית למזבח: " + JSON.stringify(p));
    }
    if ((i === 5 || i === 6) && !info.lamb) throw new Error("הטלה לא נראה ב«" + info.title + "»");
    if (i !== 5 && i !== 6 && info.lamb) throw new Error("הטלה נראה מחוץ לברקאי ולשחיטה: " + info.title);
    rows.push(`${i + 1}. ${info.title} — ${info.key}, דמויות ${info.cast.length}` + (info.lamb ? ", טלה" : ""));
    if (SHOTS && i === 1) { await pg.evaluate(() => window.__TAMID.seek(0.7)); await pg.waitForTimeout(700); await shot((PHONE ? "phone" : "desktop") + "-pais.png"); }
    if (SHOTS && i === 5) { await pg.evaluate(() => window.__TAMID.seek(7.2)); await pg.waitForTimeout(700); await shot((PHONE ? "phone" : "desktop") + "-lamb.png"); }
    if (SHOTS && i === 6) { await pg.evaluate(() => window.__TAMID.seek(3.2)); await pg.waitForTimeout(700); await shot((PHONE ? "phone" : "desktop") + "-shechita.png"); }
    if (SHOTS && i === 7) { await pg.evaluate(() => window.__TAMID.seek(6)); await pg.waitForTimeout(700); await shot((PHONE ? "phone" : "desktop") + "-menorah.png"); }
    if (SHOTS && i === 12) {
      await pg.waitForFunction(() => window.__TOURFIG.cast().some((c) => c.clip === "HandsUp"), null, { timeout: 20000 });
      await pg.evaluate(() => window.__TAMID.seek(1.2));
      await pg.waitForTimeout(800);
      const h = await pg.evaluate(() => window.__TOURFIG.hands());
      if (!h || h.n < 5 || h.up < h.n) throw new Error("נשיאת כפיים לא מעל הראש: " + JSON.stringify(h));
      rows.push("ברכה: ידיים מעל הראש " + h.up + "/" + h.n);
      await shot((PHONE ? "phone" : "desktop") + "-birkat.png");
    }
    if (SHOTS && i === 13) { await pg.evaluate(() => window.__TAMID.seek(2.5)); await pg.waitForTimeout(700); await shot((PHONE ? "phone" : "desktop") + "-song.png"); }
  }
  if (!SHOTS) {
    await pg.evaluate(() => window.__STORY.go(12));
    await pg.waitForFunction(() => window.__TOURFIG.cast().some((c) => c.clip === "HandsUp"), null, { timeout: 20000 });
    await pg.waitForTimeout(600);
    const h = await pg.evaluate(() => window.__TOURFIG.hands());
    if (!h || h.n < 5 || h.up < h.n) throw new Error("נשיאת כפיים לא מעל הראש: " + JSON.stringify(h));
    rows.push("ברכה: ידיים מעל הראש " + h.up + "/" + h.n);
  }
  await browser.close();
  const report = ["# סדר התמיד", "", `- קריינות 11: ${audio[10]}`, ...rows.map((r) => "- " + r), `- שגיאות: ${errs.length ? errs.join(" | ") : "אין"}`, ""].join("\n");
  fs.writeFileSync(OUT + "/report.md", report);
  console.log(report);
  if (errs.length) { console.error(errs); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
