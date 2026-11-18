// בדיקת משתמש אוטומטית: עוברת על האתר כמו משתמש חדש, במחשב ובטלפון.
// כניסה, כרטיסי פתיחה, סיור, חיפוש וכרטיס מידע, הליכה ויציאה ממנה.
// נכשלת אם יש שגיאת JavaScript, אם צעד לא עובד, או אם כפתורים עולים זה על זה.
//
//   python3 -m http.server 8765 &      (מתוך תיקיית האתר)
//   node tools/test/user-path.js http://localhost:8765/ out-dir
//
// צריך playwright (npm i playwright). צילומי המסך נשמרים ב-out-dir, וגם report.md.
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:8765/";
const OUT = process.argv[3] || "user-test-out";
fs.mkdirSync(OUT, { recursive: true });

// UI pieces that must never cover each other (fixed controls on top of the scene)
const NO_OVERLAP = ["#sbox", "#temple-music-mute", "#hud", "#rail button", "#cta", "#verTag",
  "#temple-music-credit", "#modeExit", "#mpTime"];

const report = [];
let failed = false;
const log = (dev, ok, step, note) => {
  report.push(`| ${dev} | ${ok ? "✅" : "❌"} | ${step} | ${(note || "").replace(/\|/g, "/")} |`);
  console.log(`${dev} ${ok ? "OK " : "FAIL"} ${step} ${note || ""}`);
  if (!ok) failed = true;
};

async function overlaps(pg) {
  return pg.evaluate((sels) => {
    // for text-only strips (credit, version) measure the text itself, not the full-width box
    const TEXT = ["temple-music-credit", "verTag"];
    const vis = (e) => { if (!e || e.hidden) return null; const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return null; let r = e.getBoundingClientRect(); if (TEXT.includes(e.id) && e.firstChild) { const g = document.createRange(); g.selectNodeContents(e); r = g.getBoundingClientRect(); } return r.width > 2 && r.height > 2 ? r : null; };
    const items = sels.flatMap((s) => [...document.querySelectorAll(s)].map((e, k, a) => [a.length > 1 ? `${s}[${k}]` : s, e])).map(([s, e]) => [s, e, vis(e)]).filter((x) => x[2]);
    const bad = [];
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const [sa, ea, a] = items[i], [sb, eb, b] = items[j];
      if (ea.contains(eb) || eb.contains(ea)) continue;
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 6 && h > 6) bad.push(`${sa} ↔ ${sb} (${Math.round(w)}×${Math.round(h)})`);
    }
    return bad;
  }, NO_OVERLAP);
}

async function run(dev) {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = dev === "phone"
    ? await browser.newContext({ ...devices["iPhone 13"], locale: "he-IL" })
    : await browser.newContext({ viewport: { width: 1366, height: 800 }, locale: "he-IL" });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
  // the music module loads YouTube; a test machine without it is not a site error
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const shot = (n) => pg.screenshot({ path: path.join(OUT, `${dev}-${n}.png`), timeout: 180000 }).catch(() => {});
  const ovl = async (where) => { const b = await overlaps(pg); log(dev, b.length === 0, `אין חפיפות: ${where}`, b.join("; ")); };
  const step = async (name, fn) => { try { const note = await fn(); log(dev, true, name, note); return true; } catch (e) { log(dev, false, name, String(e.message || e).split("\n")[0].slice(0, 200)); await shot("fail-" + name.replace(/\s+/g, "_")); return false; } };

  const t0 = Date.now();
  await step("טעינה עד כפתור הכניסה", async () => {
    await pg.goto(URL, { timeout: 120000, waitUntil: "domcontentloaded" });
    await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
    return `${Math.round((Date.now() - t0) / 1000)} שניות (במכונת בדיקה בלי כרטיס מסך)`;
  });
  await step("כניסה וכרטיסי פתיחה", async () => {
    await pg.click("#enterBtn");
    await pg.waitForSelector("#intro:not([hidden])", { timeout: 60000 });
    await pg.waitForTimeout(1500);
    const r = await pg.evaluate(() => { const b = document.querySelector("#intro .box").getBoundingClientRect(); const s = document.getElementById("stage").getBoundingClientRect(); return { top: b.top - s.top, h: s.height }; });
    await shot("1-intro");
    if (r.top < r.h * 0.4) throw new Error(`כרטיס הפתיחה גבוה מדי (מתחיל ב-${Math.round(r.top)} מתוך ${Math.round(r.h)}) ומסתיר את בית המקדש`);
  });
  await step("דילוג על כרטיסי הפתיחה", async () => {
    await pg.click("#intro button:not(.pri)");
    await pg.waitForSelector("#intro", { state: "hidden", timeout: 10000 });
    await pg.waitForTimeout(2500);
    await shot("2-overview");
  });
  await ovl("מבט כללי");
  // 126.1 (בדיקה חוזרת, א): חלופת הקריאה (tours/reading.json) זהה לסיורים שהאתר מציג
  if (dev === "desktop") await step("חלופת הקריאה זהה לכל הסיורים באתר", async () => {
    const r = await pg.evaluate(async () => { const live = window.__toursText(); const f = await (await fetch("tours/reading.json", { cache: "no-store" })).json(); return { same: JSON.stringify(live) === JSON.stringify(f.tours), n: live.length, s: live.reduce((a, t) => a + t.steps.length, 0) }; });
    if (!r.same) throw new Error("tours/reading.json לא מעודכן. להריץ: node tools/test/reading-dump.js");
    return `${r.n} סיורים, ${r.s} תחנות`;
  });

  // In walk and tour modes the page draws every frame; on a test machine without a graphics card
  // one frame can take seconds, so Playwright's own clicks wait for frames that come late.
  // These helpers press the same buttons from inside the page and check on a timer instead.
  const tap = (sel, text) => pg.evaluate(([sel, text]) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const el = [...document.querySelectorAll(sel)].find((e) => vis(e) && (!text || e.textContent.includes(text)));
    if (!el) throw new Error(`לא נמצא כפתור גלוי: ${sel} ${text || ""}`);
    el.click(); return true;
  }, [sel, text || ""]);
  const until = (fn, ms, arg) => pg.waitForFunction(fn, arg, { timeout: ms, polling: 500 });
  const cam = () => pg.evaluate(() => (window.__UI.shareURL().split("#")[1] || "").split("&")[0]);
  const stNum = () => pg.evaluate(() => (document.getElementById("story").innerText.match(/(\d+)\s*\/\s*\d+/) || [])[1]);

  await step("סיור יום הכיפורים: פתיחה ומעבר תחנות", async () => {
    await tap("#rail button[aria-label='סיורים']");
    await until(() => [...document.querySelectorAll(".dr button, .dr [role=button], .dr li, .dr div")].some((e) => e.offsetParent && e.textContent.includes("סדר העבודה ביום הכיפורים")), 20000);
    await pg.evaluate(() => { const c = [...document.querySelectorAll(".dr *")].filter((e) => e.offsetParent && e.textContent.trim().startsWith("סדר העבודה ביום הכיפורים")); const el = c[c.length - 1]; (el.closest("button,[role=button],li,.card") || el).click(); });
    await until(() => document.body.classList.contains("touring"), 60000);
    await pg.waitForTimeout(4000);
    const n1 = await stNum();
    await shot("3-tour-1");
    await tap("#stNext");
    await until((n) => { const m = document.getElementById("story").innerText.match(/(\d+)\s*\/\s*\d+/); return m && +m[1] > +n; }, 30000, n1);
    const n2 = await stNum();
    await shot("4-tour-next");
    return `תחנה ${n1} → ${n2}`;
  });
  await ovl("בתוך סיור");
  await step("יציאה מהסיור", async () => {
    await tap("#stX");
    await until(() => !document.body.classList.contains("touring"), 30000);
  });

  await step("חיפוש «גזית» ופתיחת כרטיס מידע", async () => {
    await pg.fill("#sq", "גזית");
    await until(() => [...document.querySelectorAll("#sres button")].some((b) => b.textContent.includes("לשכת הגזית")), 20000);
    await tap("#sres button", "לשכת הגזית");
    await until(() => document.body.classList.contains("pane"), 30000);
    await pg.waitForTimeout(4000);
    await shot("5-info");
    const t = await pg.evaluate(() => document.body.innerText.includes("סנהדרין"));
    if (!t) throw new Error("בכרטיס המידע אין את ההסבר על הסנהדרין");
  });
  await ovl("כרטיס מידע");
  await step("סגירת כרטיס המידע", async () => {
    await pg.keyboard.press("Escape");
    await pg.waitForTimeout(1000);
    if (await pg.evaluate(() => document.body.classList.contains("pane"))) await tap("#infoX");
    await until(() => !document.body.classList.contains("pane"), 15000);
  });

  // 125.2 (ביקורת, כיסוי בדיקות): חזרה למבט הקודם, וחיפוש עם שגיאת כתיב
  await step("חזרה למבט הקודם", async () => {
    await until(() => { const e = document.getElementById("backB"); return e && getComputedStyle(e).display !== "none"; }, 15000);
    const v1 = await cam();
    await tap("#backB");
    await pg.waitForTimeout(3000);
    const v2 = await cam();
    if (v1 === v2) throw new Error("המצלמה לא זזה אחרי «חזרה»");
  });
  await step("חיפוש עם שגיאת כתיב («מזבך»)", async () => {
    await pg.fill("#sq", "מזבך");
    await until(() => { const b = document.querySelector("#sres button b"); return b && b.textContent.includes("מזבח"); }, 20000);
    await pg.fill("#sq", "");
    await pg.keyboard.press("Escape");
  });

  // 126.1 (בדיקה חוזרת, ד): גם יעד החיפוש «אולם הבית» שומר את המבט הקודם
  await step("חיפוש «אולם» ואז חזרה למבט הקודם", async () => {
    await pg.fill("#sq", "אולם");
    await until(() => [...document.querySelectorAll("#sres button")].some((b) => b.textContent.includes("אולם הבית")), 20000);
    const v0 = await cam();
    await tap("#sres button", "אולם הבית");
    // the flight can start late on a slow test machine: wait up to 15 s for the camera to move
    let v1 = v0; for (let t = 0; t < 15 && v1 === v0; t++) { await pg.waitForTimeout(1000); v1 = await cam(); }
    if (v0 === v1) { const st = await pg.evaluate(() => ({ pane: document.body.classList.contains("pane"), res: document.querySelectorAll("#sres button").length, q: document.getElementById("sq").value })); throw new Error("החיפוש לא הזיז את המצלמה " + JSON.stringify(st)); }
    await pg.waitForTimeout(3000);
    await until(() => { const e = document.getElementById("backB"); return e && getComputedStyle(e).display !== "none"; }, 15000);
    await tap("#backB");
    const d = (a, b) => { const x = a.replace("v=", "").split(",").map(Number), y = b.replace("v=", "").split(",").map(Number); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
    // 126.6: the flight back is slow on a test machine without a graphics card (CI stopped it 18-61 m short after a fixed 4 s): wait up to 15 s for it to land
    let v2 = await cam(); for (let t = 0; t < 15 && d(v2, v0) > 3; t++) { await pg.waitForTimeout(1000); v2 = await cam(); }
    if (d(v2, v0) > 3) throw new Error(`«חזרה» לא החזירה למבט שלפני החיפוש (${Math.round(d(v2, v0))} מ׳ ממנו)`);
  });
  // 126.1 (בדיקה חוזרת, ה): המפה הקטנה נגישה למקלדת
  if (dev === "desktop") await step("מפה קטנה במקלדת: Tab, חצים ו־Enter", async () => {
    // the mini map is a layer that starts off: turn it on as a user would
    const ti = await pg.evaluate(() => { const m = document.getElementById("mini"); if (m && m.hidden) { const b = document.querySelector("[data-o=mini]"); if (b) b.click(); } return m && !m.hidden ? m.tabIndex : null; });
    if (ti === null) throw new Error("לא הצלחתי להדליק את המפה הקטנה");
    if (ti !== 0) throw new Error("למפה אין tabindex");
    const v0 = await cam();
    await pg.focus("#mini");
    for (let i = 0; i < 4; i++) await pg.keyboard.press("ArrowUp");
    await pg.keyboard.press("Enter");
    // 126.6: poll up to 15 s instead of a fixed 4 s (slow CI machine)
    let v1 = v0; for (let t = 0; t < 15 && v1 === v0; t++) { await pg.waitForTimeout(1000); v1 = await cam(); }
    if (v0 === v1) throw new Error("Enter במפה לא הזיז את המבט");
    await pg.evaluate(() => { const b = document.querySelector("[data-o=mini]"); if (b) b.click(); });
  });

  // 126.1 (בדיקה חוזרת, ב+ג): מקש שנשאר לחוץ כשהחלון מאבד מיקוד, ו־Escape שסוגר שכבה אחת בלבד
  await step("הליכה: Escape סוגר מגירה בלי לצאת מההליכה", async () => {
    await pg.evaluate(() => { const b = [...document.querySelectorAll("#cta button")].find((x) => !x.classList.contains("pri")); b.click(); });
    await until(() => document.body.classList.contains("busy3d"), 30000);
    await pg.waitForTimeout(2000);
    await tap("#rail button[aria-label='סיורים']");
    await until(() => document.body.classList.contains("drawer"), 15000);
    await pg.keyboard.press("Escape");
    await pg.waitForTimeout(1500);
    const st = await pg.evaluate(() => ({ dr: document.body.classList.contains("drawer"), walk: document.body.classList.contains("busy3d") }));
    if (st.dr) throw new Error("Escape לא סגר את המגירה");
    if (!st.walk) throw new Error("Escape סגר את המגירה וגם יצא מההליכה");
    if (dev === "desktop") {
      await pg.keyboard.down("w");
      await pg.waitForTimeout(800);
      await pg.evaluate(() => window.dispatchEvent(new Event("blur")));
      await pg.waitForTimeout(1500);
      const a = await cam();
      await pg.waitForTimeout(3000);
      const b = await cam();
      await pg.keyboard.up("w");
      if (a !== b) throw new Error("אחרי איבוד מיקוד ההליכה ממשיכה לבד (מקש W נשאר לחוץ)");
    }
    await pg.keyboard.press("Escape");
    await until(() => !document.body.classList.contains("busy3d"), 30000);
  });

  await step("הליכה ויציאה בכפתור «יציאה»", async () => {
    await pg.evaluate(() => { const b = [...document.querySelectorAll("#cta button")].find((x) => !x.classList.contains("pri")); b.click(); });
    await until(() => document.body.classList.contains("busy3d"), 30000);
    await pg.waitForTimeout(3000);
    await shot("6-walk");
    await until(() => { const e = document.getElementById("modeExit"); return e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0; }, 15000);
    await tap("#modeExit");
    await until(() => !document.body.classList.contains("busy3d"), 30000);
  });
  await ovl("אחרי הליכה");

  if (dev === "desktop") await step("בלי תלת־ממד: הודעה וקריאת הסיורים", async () => {
    const c2 = await browser.newContext({ viewport: { width: 1000, height: 700 }, locale: "he-IL" });
    await c2.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
    await c2.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (/webgl/.test(t)) return null; return g.call(this, t, ...a); }; });
    const p2 = await c2.newPage();
    await p2.goto(URL, { waitUntil: "domcontentloaded" });
    await p2.waitForSelector(".ldfail", { timeout: 60000 });
    await p2.click("#glRead");
    await p2.waitForFunction(() => document.querySelectorAll("#glText h3").length >= 9 && document.getElementById("glText").textContent.includes("מקור:"), null, { timeout: 30000 });
    await c2.close();
  });
  const inPage = await pg.evaluate(() => window.__ERRS || []).catch(() => []);
  const all = [...errs, ...inPage];
  log(dev, all.length === 0, "בלי שגיאות JavaScript", all.slice(0, 3).join(" · "));
  await browser.close();
}

(async () => {
  for (const dev of ["desktop", "phone"]) {
    try { await run(dev); } catch (e) { log(dev, false, "הבדיקה נעצרה", String(e).slice(0, 200)); }
  }
  const md = ["# בדיקת משתמש", "", "| מכשיר | | צעד | הערה |", "|---|---|---|---|", ...report, ""].join("\n");
  fs.writeFileSync(path.join(OUT, "report.md"), md);
  console.log(failed ? "\nנכשל" : "\nהכול עבר");
  process.exit(failed ? 1 : 0);
})();
