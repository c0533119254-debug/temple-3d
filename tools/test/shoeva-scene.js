// בדיקה קלה: שמחת בית השואבה נטענת בלי שגיאת JavaScript, הריקוד והאורות בתוך התקרה,
// וניסוך המים מגיע לשלב שפיכה. לא בודקת את כל מטריצת החג.
//
//   python3 -m http.server 8765
//   node tools/test/shoeva-scene.js http://localhost:8765/ shoeva-out
const { chromium } = require("playwright");
const fs = require("fs");
const URL = process.argv[2] || "http://localhost:8765/";
const OUT = process.argv[3] || "shoeva-out";
fs.mkdirSync(OUT, { recursive: true });
const ARGS = { args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] };

(async () => {
  const browser = await chromium.launch(ARGS);
  const ctx = await browser.newContext({ locale: "he-IL", viewport: { width: 1280, height: 800 } });
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 400)));
  await pg.addInitScript(() => { try { localStorage.setItem("tm_intro", "1"); } catch (e) {} });
  await pg.goto(URL, { timeout: 120000, waitUntil: "domcontentloaded" });
  await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
  await pg.click("#enterBtn");
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => window.__STORY.start("sukkot"));
  await pg.waitForTimeout(800);
  await pg.evaluate(() => window.__STORY.go(4));
  await pg.waitForFunction(() => { const v = window.__sukVis && window.__sukVis(); return v && v.on && v.shoeva; }, null, { timeout: 60000 });
  await pg.waitForTimeout(1500);
  const shoe = await pg.evaluate(() => ({ v: window.__sukVis(), s: window.__SHOE && window.__SHOE() }));
  if (!shoe.s || !(shoe.s.dancers >= 40) || shoe.s.torches < shoe.s.dancers) throw new Error("סצנת השואבה לא נבנתה: " + JSON.stringify(shoe.s));
  if (!(shoe.s.crowd >= 400)) throw new Error("הקהל דליל: " + shoe.s.crowd);
  if (!(shoe.s.levites >= 24)) throw new Error("מעט לוויים: " + shoe.s.levites);
  if (shoe.s.lights > shoe.s.cap) throw new Error("יותר מדי אורות: " + shoe.s.lights + " > " + shoe.s.cap);
  await pg.screenshot({ path: OUT + "/shoeva.png" });
  await pg.evaluate(() => window.__STORY.go(3));
  await pg.waitForFunction(() => { const v = window.__sukVis && window.__sukVis(); return v && v.on && v.nisuch; }, null, { timeout: 30000 });
  await pg.waitForFunction(() => { const q = window.__SHOE && window.__SHOE(); return q && (q.phase === "pour" || q.phase === "turn" || q.phase === "climb"); }, null, { timeout: 20000 });
  await pg.waitForTimeout(2500);
  const phase = await pg.evaluate(() => window.__SHOE().phase);
  await pg.screenshot({ path: OUT + "/nisuch.png" });
  await browser.close();
  const report = ["# שמחת בית השואבה", "", `- מרקדים: ${shoe.s.dancers}`, `- לוליינים: ${shoe.s.jugglers}`, `- אבוקות: ${shoe.s.torches}`, `- קהל: ${shoe.s.crowd}`, `- לוויים: ${shoe.s.levites}`, `- אורות: ${shoe.s.lights} / תקרה ${shoe.s.cap}`, `- שלב ניסוך: ${phase}`, `- שגיאות: ${errs.length ? errs.join(" | ") : "אין"}`, ""].join("\n");
  fs.writeFileSync(OUT + "/report.md", report);
  console.log(report);
  if (errs.length) { console.error(errs); process.exit(1); }
  if (phase !== "pour" && phase !== "turn" && phase !== "climb") { console.error("phase", phase); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
