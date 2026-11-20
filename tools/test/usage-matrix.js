// 126.1 (בדיקה חוזרת 125.5): סדרת שימוש רחבה, בנוסף ל־user-path.js.
//  1. סוכות: 8 ימים × חול/שבת × בוקר/לילה. בודקים את הדין (טבלה נפרדת כאן, לפי המשנה) מול מה שמוצג בפועל.
//  2. פסח ביום ובלילה.
//  3. סיור יום הכיפורים: כל 13 התחנות. סדר התמיד: כל 16 התחנות, כולל הפיס השלישי והרביעי.
//  4. 20 חיפושים, עם שגיאות כתיב: התוצאה הראשונה, והמצלמה זזה אליה. גם חיפוש שטות שאסור שיחזיר תוצאה.
//  5. 20 החלפות מצבים מהירות, הסתרת הלשונית וחזרה, שיתוף ופתיחה מחדש, רענון באמצע סיור.
//  6. מסכים: טלפון קטן, טלפון גדול וטאבלט, לאורך ולרוחב, עם סיור פעיל, מגירה פתוחה וכרטיס מקור מורחב.
// נכשלת על כל שגיאת JavaScript ועל כל צעד שלא עבר.
//
//   python3 -m http.server 8765 &      (מתוך תיקיית האתר)
//   node tools/test/usage-matrix.js http://localhost:8765/ out-dir
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:8765/";
const OUT = process.argv[3] || "usage-matrix-out";
fs.mkdirSync(OUT, { recursive: true });
const report = [];
let failed = false;
const log = (where, ok, step, note) => {
  report.push(`| ${where} | ${ok ? "✅" : "❌"} | ${step} | ${String(note || "").replace(/\|/g, "/")} |`);
  console.log(`${where} ${ok ? "OK " : "FAIL"} ${step} ${note || ""}`);
  if (!ok) failed = true;
};
const ARGS = { args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] };
const NO_OVERLAP = ["#sbox", "#temple-music-mute", "#hud", "#rail button", "#cta", "#verTag", "#modeExit", "#mpTime", "#story"];

async function open(browser, ctxOpts, url) {
  const ctx = await browser.newContext({ locale: "he-IL", ...ctxOpts });
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
  await pg.goto(url || URL, { timeout: 120000, waitUntil: "domcontentloaded" });
  await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
  await pg.click("#enterBtn");
  await pg.waitForSelector("#intro:not([hidden])", { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(1200);
  await pg.evaluate(() => { const b = document.querySelector("#intro button:not(.pri)"); if (b && b.offsetParent) b.click(); });
  await pg.waitForTimeout(2000);
  return { ctx, pg, errs };
}
const step = async (where, name, fn) => { try { const n = await fn(); log(where, true, name, n); } catch (e) { log(where, false, name, String(e.message || e).split("\n")[0].slice(0, 220)); } };
const click = (pg, sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) throw new Error("לא נמצא " + sel); e.click(); }, sel);
const cam = (pg) => pg.evaluate(() => (window.__UI.shareURL().split("#")[1] || "").split("&")[0]);

// ---- the law, written here on its own (not copied from the site) ----
// 📜 לולב: ביום הראשון גם בשבת; בשבת של חול המועד לא (סוכה ד, ב). ערבה והקפה: שבעה ימים; בשבת רק כשהיא היום השביעי (סוכה ד, ג; ד, ה).
// 📜 ניסוך המים: שבעה ימים, גם בשבת; בשבת שואבים מערב שבת, ולכן אין תהלוכת שאיבה בשבת (סוכה ד, ט–י).
// 📜 שמחת בית השואבה: בלילות של חול המועד (ט״ז–כ״א), לא בשבת, כי החליל אינו דוחה שבת (סוכה ה, א). שמיני עצרת (כ״ב): אין ערבה, אין ניסוך המים.
function sukLaw(day, shab, night) {
  const week = day <= 21;
  return {
    arava: week && (!shab || day === 21),
    lulav: week && !night && (!shab || day === 15), // 📜 נטילת לולב ביום בלבד ("ולקחתם לכם ביום הראשון"; מגילה כ ע״ב)
    hakafa: week && !night && (!shab || day === 21),
    water: week && !night && !shab,
    nisuch: week && !night,
    shoeva: week && night && day >= 16 && !shab,
  };
}

const SEARCHES = [
  ["גזית", "הגזית"], ["לשכת הגזיט", "הגזית"], ["מזבך", "מזבח"], ["מנורא", "מנורה"], ["היכל", "ההיכל"], ["אולם", "אולם"],
  ["שולחנות השחיטה", "שולחנות"], ["שולחנת השחיטה", "שולחנות"], ["לשכת העץ", "העץ"], ["פרהדרין", "פרהדרין"], ["כיור", "כיור"],
  ["קודש הקדשים", "קודש"], ["צלעות", "צלעות"], ["הכותל", "כותל"], ["שער שכם", "שער שכם"], ["שער יפו", "שער יפו"],
  ["החורבה", "החורבה"], ["קרדו", "הקרדו"], ["הקרדו", "הקרדו"], ["שער המזרח", "שער"],
];

(async () => {
  const browser = await chromium.launch(ARGS);

  // ===== desktop: law matrix, tours, searches, fast use =====
  {
    const W = "מחשב";
    const { ctx, pg, errs } = await open(browser, { viewport: { width: 1366, height: 800 } });
    const setFest = (k) => pg.evaluate((k) => { const b = document.querySelector(`#festSeg button[data-fest=${k}]`); b.click(); }, k);
    const setDay = (k) => pg.evaluate((k) => document.querySelector(`#daySeg button[data-day=${k}]`).click(), k);

    await step(W, "סוכות: 8 ימים × חול/שבת × בוקר/לילה (דין מול תצוגה)", async () => {
      await setFest("sukkot"); await pg.waitForTimeout(1500);
      const bad = []; let n = 0;
      for (const shab of [false, true]) {
        await setDay(shab ? "shabbat" : "chol");
        for (const night of [false, true]) {
          await click(pg, night ? "#tL" : "#tM");
          for (let day = 15; day <= 22; day++) {
            await pg.evaluate((d) => document.querySelector(`#sukSeg button[data-sd="${d}"]`).click(), day);
            await pg.evaluate(() => { const c = document.getElementById("infoX"); if (c && document.body.classList.contains("pane")) c.click(); });
            await pg.waitForFunction(() => { const v = window.__sukVis && window.__sukVis(); return v && v.on; }, null, { timeout: 30000, polling: 300 });
            await pg.waitForTimeout(700);
            const v = await pg.evaluate(() => window.__sukVis());
            const law = sukLaw(day, shab, night); n++;
            for (const k of Object.keys(law)) if (!!v[k] !== law[k]) bad.push(`${day}${shab ? " שבת" : ""}${night ? " לילה" : " בוקר"}: ${k} מוצג=${!!v[k]} דין=${law[k]}`);
          }
        }
      }
      await setDay("chol"); await click(pg, "#tM");
      if (bad.length) throw new Error(`${bad.length} אי־התאמות: ` + bad.slice(0, 6).join("; "));
      return `${n} שילובים, כולם לפי הדין`;
    });
    await step(W, "פסח ביום ובלילה", async () => {
      await setFest("pesach"); await click(pg, "#tM"); await pg.waitForTimeout(2500);
      await click(pg, "#tL"); await pg.waitForTimeout(2500);
      const t = await pg.evaluate(() => document.body.innerText);
      if (!/פסח/.test(t)) throw new Error("אין סימן לפסח במסך");
      await click(pg, "#tM"); await setFest("chol"); await pg.waitForTimeout(1500);
    });

    const runTour = async (title, n) => {
      await pg.evaluate(() => { const b = document.querySelector("#rail button[aria-label='סיורים']"); b.click(); });
      await pg.waitForTimeout(1500);
      await pg.evaluate((title) => { const c = [...document.querySelectorAll(".dr *")].filter((e) => e.offsetParent && e.textContent.trim().startsWith(title)); const el = c[c.length - 1]; (el.closest("button,[role=button],li,div") || el).click(); }, title);
      await pg.waitForFunction(() => document.body.classList.contains("touring"), null, { timeout: 60000 });
      const seen = [];
      for (let i = 0; i < n; i++) {
        await pg.waitForTimeout(1200);
        const m = await pg.evaluate(() => (document.getElementById("story").innerText.match(/(\d+)\s*\/\s*(\d+)/) || []).slice(1).map(Number));
        seen.push(m[0]);
        if (m[1] !== n) throw new Error(`בסיור ${m[1]} תחנות, ציפינו ל־${n}`);
        if (i < n - 1) { await click(pg, "#stNext"); await pg.waitForFunction((k) => { const q = document.getElementById("story").innerText.match(/(\d+)\s*\/\s*\d+/); return q && +q[1] === k; }, i + 2, { timeout: 30000, polling: 300 }); }
      }
      await click(pg, "#stX"); await pg.waitForFunction(() => !document.body.classList.contains("touring"), null, { timeout: 30000 });
      return `תחנות ${seen.join(",")}`;
    };
    // 126.1 (בדיקה חוזרת 44): במכונת הבדיקה אין קול עברי. הסיור הקצר לא נשאר שקט וריק: הכתוביות מתחלפות לבד
    await step(W, "הסיור הקצר בלי קול עברי: הכתוביות מתקדמות", async () => {
      await pg.evaluate(() => { const b = document.querySelector("#rail button[aria-label='סיורים']"); b.click(); });
      await pg.waitForTimeout(1500);
      await pg.evaluate(() => { const c = [...document.querySelectorAll(".dr *")].filter((e) => e.offsetParent && e.textContent.trim().startsWith("המקדש בשתי דקות")); const el = c[c.length - 1]; (el.closest("button,[role=button],li,div") || el).click(); });
      await pg.waitForFunction(() => document.body.classList.contains("touring"), null, { timeout: 60000 });
      const snap = () => pg.evaluate(() => { const t = document.getElementById("stText"); return [t.innerText.trim(), t.innerHTML, (document.getElementById("story").innerText.match(/(\d+)\s*\/\s*\d+/) || [])[1]]; });
      await pg.waitForTimeout(2500); const a = await snap();
      // each caption piece stays length×70 ms (a long sentence can pass 10 s), so wait up to 25 s for the first change
      let b = a; for (let t = 0; t < 25 && b[0] === a[0] && b[1] === a[1] && b[2] === a[2]; t++) { await pg.waitForTimeout(1000); b = await snap(); }
      await click(pg, "#stX"); await pg.waitForFunction(() => !document.body.classList.contains("touring"), null, { timeout: 30000 });
      if (!a[0]) throw new Error("אין כתובית בתחנה הראשונה");
      if (a[0] === b[0] && a[1] === b[1] && a[2] === b[2]) throw new Error("הכתובית לא התקדמה ב־25 שניות");
      return `תחנה ${a[2]} → ${b[2]}`;
    });
    await step(W, "סיור יום הכיפורים: כל 13 התחנות", () => runTour("סדר העבודה ביום הכיפורים", 13));
    await step(W, "סדר התמיד: כל 16 התחנות (כולל הפיס השלישי והרביעי)", () => runTour("סדר התמיד", 16));

    await step(W, "20 חיפושים עם שגיאות כתיב: תוצאה ראשונה ומצלמה", async () => {
      const bad = [];
      for (const [q, want] of SEARCHES) {
        await pg.fill("#sq", ""); await pg.fill("#sq", q);
        const first = await pg.waitForFunction(() => { const b = document.querySelector("#sres button"); return b && b.offsetParent ? b.textContent : null; }, null, { timeout: 15000, polling: 300 }).then((h) => h.jsonValue()).catch(() => null);
        if (!first || !first.includes(want)) { bad.push(`«${q}» → ${first ? first.slice(0, 30) : "אין תוצאה"}`); continue; }
        const v0 = await cam(pg);
        await pg.keyboard.press("Enter");
        // a slow test machine can start the flight late: wait up to 15 s for the camera to move (like the «חזרה» step in user-path)
        let v1 = v0; for (let k = 0; k < 15 && v1 === v0; k++) { await pg.waitForTimeout(1000); v1 = await cam(pg); }
        if (v0 === v1 && !(await pg.evaluate(() => document.body.classList.contains("touring")))) bad.push(`«${q}»: המצלמה לא זזה`);
        await pg.evaluate(() => { if (document.body.classList.contains("pane")) document.getElementById("infoX").click(); });
      }
      await pg.fill("#sq", "קסקסקסקס");
      await pg.waitForTimeout(1500);
      const junk = await pg.evaluate(() => [...document.querySelectorAll("#sres button")].filter((b) => b.offsetParent).length);
      if (junk) bad.push(`חיפוש שטות החזיר ${junk} תוצאות`);
      await pg.fill("#sq", ""); await pg.keyboard.press("Escape");
      if (bad.length) throw new Error(bad.join("; "));
      return `${SEARCHES.length} חיפושים, וחיפוש שטות בלי תוצאות`;
    });

    await step(W, "20 החלפות מצבים מהירות", async () => {
      const seq = ["#tM", "#tL", "#tE", "#tN"];
      for (let i = 0; i < 20; i++) {
        await click(pg, seq[i % 4]);
        if (i % 5 === 0) await setFest(["sukkot", "pesach", "shavuot", "chol"][(i / 5) % 4]);
        if (i % 3 === 0) await setDay(["shabbat", "chol", "rosh"][i % 3]);
        await pg.evaluate(() => { const b = document.querySelector("[data-o=labels]"); if (b) b.click(); });
        await pg.waitForTimeout(150);
      }
      await setFest("chol"); await setDay("chol"); await click(pg, "#tM");
      await pg.evaluate(() => { const b = document.querySelector("[data-o=labels]"); if (b && b.getAttribute("aria-pressed") === "false") b.click(); });
      await pg.waitForTimeout(2500);
      const ok = await pg.evaluate(() => typeof window.__UI.shareURL() === "string");
      if (!ok) throw new Error("האתר לא מגיב אחרי ההחלפות");
    });
    await step(W, "הסתרת הלשונית וחזרה", async () => {
      await pg.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
      await pg.waitForTimeout(1500);
      await pg.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
      await pg.waitForTimeout(1500);
    });

    let shared = null;
    await step(W, "שיתוף: סוכות, יום כ׳, שבת, לילה", async () => {
      await setFest("sukkot"); await setDay("shabbat"); await click(pg, "#tL");
      await pg.evaluate(() => document.querySelector('#sukSeg button[data-sd="20"]').click());
      await pg.waitForTimeout(1500);
      shared = await pg.evaluate(() => window.__UI.shareURL());
      for (const k of ["kd=20", "d=shabbat", "t=night"]) if (!shared.includes(k)) throw new Error(`בקישור חסר ${k}: ${shared.split("#")[1]}`);
      return shared.split("#")[1].slice(0, 120);
    });
    if (errs.length) log(W, false, "בלי שגיאות JavaScript", errs.slice(0, 3).join(" · ")); else log(W, true, "בלי שגיאות JavaScript");
    await ctx.close();

    if (shared) {
      const local = URL.replace(/\/?$/, "/") + "#" + shared.split("#")[1];
      const o = await open(browser, { viewport: { width: 1200, height: 760 } }, local);
      await step(W, "פתיחה מחדש מהקישור ששותף", async () => {
        await o.pg.waitForTimeout(3000);
        const u = await o.pg.evaluate(() => window.__UI.shareURL());
        const bad = ["kd=20", "d=shabbat", "t=night"].filter((k) => !u.includes(k));
        if (bad.length) throw new Error("לא שוחזר: " + bad.join(", "));
      });
      await step(W, "רענון באמצע סיור", async () => {
        await o.pg.evaluate(() => { const b = document.querySelector("#rail button[aria-label='סיורים']"); b.click(); });
        await o.pg.waitForTimeout(1500);
        await o.pg.evaluate(() => { const c = [...document.querySelectorAll(".dr *")].filter((e) => e.offsetParent && e.textContent.trim().startsWith("עולה רגל")); const el = c[c.length - 1]; (el.closest("button,[role=button],li,div") || el).click(); });
        await o.pg.waitForFunction(() => document.body.classList.contains("touring"), null, { timeout: 60000 });
        await o.pg.reload({ waitUntil: "domcontentloaded" });
        await o.pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
        await o.pg.click("#enterBtn");
        await o.pg.waitForTimeout(4000);
        const st = await o.pg.evaluate(() => ({ ok: typeof window.__UI.shareURL() === "string" }));
        if (!st.ok) throw new Error("האתר לא חזר אחרי רענון");
      });
      if (o.errs.length) log(W, false, "בלי שגיאות JavaScript (פתיחה מחדש)", o.errs.slice(0, 3).join(" · "));
      await o.ctx.close();
    }
  }

  // ===== screens: small phone, large phone, tablet; portrait and landscape =====
  for (const [name, dev] of [["טלפון קטן (iPhone SE)", devices["iPhone SE"]], ["טלפון גדול (Pixel 7)", devices["Pixel 7"]], ["טאבלט (iPad Mini)", devices["iPad Mini"]]]) {
    const { ctx, pg, errs } = await open(browser, { ...dev });
    const tag = name.split(" ")[0] + (name.includes("גדול") ? "-גדול" : name.includes("קטן") ? "-קטן" : "");
    for (const orient of ["לאורך", "לרוחב"]) {
      if (orient === "לרוחב") { const v = dev.viewport; await pg.setViewportSize({ width: v.height, height: v.width }); await pg.waitForTimeout(2500); }
      await step(name, `${orient}: סיור פעיל, מגירה וכרטיס מקור`, async () => {
        const probs = [];
        await pg.evaluate(() => { const b = document.querySelector("#rail button[aria-label='סיורים']"); b.click(); });
        await pg.waitForTimeout(1200);
        await pg.evaluate(() => { const c = [...document.querySelectorAll(".dr *")].filter((e) => e.offsetParent && e.textContent.trim().startsWith("עולה רגל")); const el = c[c.length - 1]; (el.closest("button,[role=button],li,div") || el).click(); });
        await pg.waitForFunction(() => document.body.classList.contains("touring"), null, { timeout: 60000 });
        await pg.waitForTimeout(3000);
        const fit = await pg.evaluate(() => { const s = document.getElementById("story").getBoundingClientRect(); return { b: s.bottom, t: s.top, h: innerHeight, w: innerWidth, r: s.right, l: s.left, share: (s.height * s.width) / (innerWidth * innerHeight) }; });
        if (fit.b > fit.h + 1 || fit.t < -1 || fit.l < -1 || fit.r > fit.w + 1) probs.push("כרטיס הסיור יוצא מהמסך");
        if (fit.share > 0.5) probs.push(`כרטיס הסיור מכסה ${Math.round(fit.share * 100)}% מהמסך`);
        await pg.screenshot({ path: path.join(OUT, `${tag}-${orient}-tour.png`) }).catch(() => probs.push("צילום לא נשמר"));
        await click(pg, "#stX"); await pg.waitForFunction(() => !document.body.classList.contains("touring"), null, { timeout: 30000 });
        // a place card, opened to the source reading
        await pg.fill("#sq", "גזית");
        await pg.waitForFunction(() => [...document.querySelectorAll("#sres button")].some((b) => b.textContent.includes("לשכת הגזית")), null, { timeout: 20000 });
        await pg.evaluate(() => [...document.querySelectorAll("#sres button")].find((b) => b.textContent.includes("לשכת הגזית")).click());
        await pg.waitForFunction(() => document.body.classList.contains("pane"), null, { timeout: 30000 });
        await pg.evaluate(() => { const b = [...document.querySelectorAll("#infocard button, #infocard summary")].find((x) => /קריאת מקור|מקור/.test(x.textContent)); if (b) b.click(); });
        await pg.waitForTimeout(1500);
        // on a phone the card is a bottom sheet that opens at the buttons; a tap on its handle raises it a step, up to full screen
        for (let i = 0; i < 3; i++) { const st = await pg.evaluate(() => { const c = document.getElementById("infocard"); return c.dataset.vis != null && !c.classList.contains("full"); }); if (!st) break; await pg.evaluate(() => document.querySelector("#infocard .ic-grab").click()); await pg.waitForTimeout(700); }
        const card = await pg.evaluate(() => { const ic = document.getElementById("infocard"), c = ic.getBoundingClientRect(), vis = ic.dataset.vis != null ? +ic.dataset.vis : null, sb = document.getElementById("stage").getBoundingClientRect().bottom, h2 = ic.querySelector("h2"), hr = h2 && h2.getBoundingClientRect(), top = hr && document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2); return { cov: !!(hr && top && !ic.contains(top)), b: vis != null ? sb : c.bottom, h: innerHeight, t: vis != null ? sb - vis : c.top, scroll: document.getElementById("infocard").scrollHeight > document.getElementById("infocard").clientHeight + 2, ov: getComputedStyle(document.getElementById("infocard")).overflowY }; });
        if (card.b > card.h + 1 || card.t < -1) probs.push("כרטיס המקום יוצא מהמסך"); if (card.cov) probs.push("שם המקום בכרטיס מוסתר מתחת לכפתורים אחרים");
        if (card.scroll && !/auto|scroll/.test(card.ov)) probs.push("כרטיס המקום ארוך ואי אפשר לגלול אותו");
        await pg.screenshot({ path: path.join(OUT, `${tag}-${orient}-card.png`) }).catch(() => probs.push("צילום לא נשמר"));
        await click(pg, "#infoX");
        // an open drawer
        await pg.evaluate(() => document.querySelector("#rail button[aria-label='תצוגה']").click());
        await pg.waitForTimeout(1200);
        const dr = await pg.evaluate(() => { const d = document.getElementById("dr-view").getBoundingClientRect(); return { b: d.bottom, t: d.top, h: innerHeight, l: d.left, r: d.right, w: innerWidth }; });
        if (dr.t < -1 || dr.l < -1 || dr.r > dr.w + 1) probs.push("המגירה יוצאת מהמסך");
        await pg.keyboard.press("Escape").catch(() => {});
        await pg.evaluate(() => { if (document.body.classList.contains("drawer")) document.querySelector("#rail button[aria-label='תצוגה']").click(); });
        if (probs.length) throw new Error(probs.join("; "));
      });
    }
    if (errs.length) log(name, false, "בלי שגיאות JavaScript", errs.slice(0, 3).join(" · ")); else log(name, true, "בלי שגיאות JavaScript");
    await ctx.close();
  }

  const md = ["# סדרת שימוש רחבה (126.1)", "", "| איפה | | צעד | הערה |", "|---|---|---|---|", ...report, ""].join("\n");
  fs.writeFileSync(path.join(OUT, "report.md"), md);
  await browser.close();
  console.log(failed ? "\nנכשל" : "\nהכול עבר");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
