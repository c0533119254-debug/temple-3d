// תקציב ציור: משולשים וקריאות ציור בשלושה מבטים, במחשב ובטלפון.
// רץ ב־CI בלי כרטיס מסך (SwiftShader). שם האיכות יורדת ל«חסכונית» כי המנוע מזהה ציור תוכנתי,
// ולכן הבדיקה לא שופטת פריימים לשנייה. היא שומרת שהציור לא יחזור להיות כבד, ושהקהל של השואבה נשאר.
//
//   python3 -m http.server 8765
//   node tools/test/perf-probe.js http://localhost:8765/ perf-out
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://127.0.0.1:8765/?perf=1";
const OUT = process.argv[3] || "perf-out";
fs.mkdirSync(OUT, { recursive: true });
const ARGS = { args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] };

// תקרות שנמדדו אחרי האופטימיזציה (2026-11-20), עם מרווח לסטייה קטנה של המצלמה.
// כולן מתחת לבסיס שלפני השינוי במשולשים.
const BUDGET = {
  phone: {
    opening: { triangles: 1500000, calls: 750 },
    shoeva: { triangles: 920000, calls: 560 },
    city: { triangles: 1280000, calls: 680 },
  },
  desktop: {
    opening: { triangles: 2450000, calls: 880 },
    shoeva: { triangles: 1650000, calls: 680 },
    city: { triangles: 2300000, calls: 980 },
  },
};
const CROWD = {
  phone: { crowd: 2000, dancers: 40, levites: 24 },
  desktop: { crowd: 6000, dancers: 140, levites: 48 },
};

const base = URL.includes("?") ? URL : URL.replace(/\/?$/, "/") + "?perf=1";

async function sample(pg) {
  await pg.evaluate(() => { const c = window.__GA && window.__GA.getCam(); if (c) c.position.x += 0.02; });
  await pg.waitForTimeout(700);
  return pg.evaluate(() => {
    const d = window.__PERFDUMP ? window.__PERFDUMP() : null;
    const res = performance.getEntriesByType("resource").filter((r) => /\/audio\/|\/sfx\/|\.mp3|chars\/.+\.glb/.test(r.name));
    return {
      calls: d && d.calls,
      triangles: d && d.triangles,
      dpr: d && d.dpr,
      ql: d && d.ql,
      small: d && d.small,
      shadow: d && d.shadow,
      map: d && d.map,
      shoe: d && d.shoe,
      audio: res.length,
      glb: res.filter((r) => /\.glb/.test(r.name)).length,
    };
  });
}

async function views(pg, dev) {
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const b = document.querySelector("#intro button:not(.pri)"); if (b) b.click(); });
  await pg.evaluate(() => window.__flyTo("home", 0));
  await pg.waitForTimeout(1200);
  const opening = await sample(pg);
  await pg.screenshot({ path: path.join(OUT, dev + "-opening.png") });
  await pg.evaluate(() => { window.__STORY.start("sukkot"); window.__STORY.go(4); });
  await pg.waitForFunction(() => { const v = window.__sukVis && window.__sukVis(); return v && v.shoeva; }, null, { timeout: 90000 });
  await pg.waitForTimeout(1600);
  const shoeva = await sample(pg);
  await pg.screenshot({ path: path.join(OUT, dev + "-shoeva.png") });
  await pg.evaluate(() => { window.__STORY.start("oldcity"); window.__STORY.go(2); });
  await pg.waitForFunction(() => { const s = window.__STORY && window.__STORY.S; return s && s.key === "oldcity" && s.i === 2 && !s.move; }, null, { timeout: 90000 });
  await pg.waitForTimeout(1000);
  const city = await sample(pg);
  await pg.screenshot({ path: path.join(OUT, dev + "-city.png") });
  return { opening, shoeva, city };
}

function check(dev, data, fails) {
  const b = BUDGET[dev], c = CROWD[dev];
  for (const k of ["opening", "shoeva", "city"]) {
    const m = data[k], lim = b[k];
    if (!(m && m.triangles > 0 && m.calls > 0)) { fails.push(dev + " " + k + " בלי מדידה"); continue; }
    if (m.triangles > lim.triangles) fails.push(dev + " " + k + " משולשים " + m.triangles + " > " + lim.triangles);
    if (m.calls > lim.calls) fails.push(dev + " " + k + " קריאות " + m.calls + " > " + lim.calls);
  }
  const s = data.shoeva && data.shoeva.shoe;
  if (!s || s.crowd < c.crowd) fails.push(dev + " קהל שואבה " + (s && s.crowd));
  if (!s || s.dancers < c.dancers) fails.push(dev + " מרקדים " + (s && s.dancers));
  if (!s || s.levites < c.levites) fails.push(dev + " לוויים " + (s && s.levites));
  if (s && s.lights > s.cap) fails.push(dev + " אורות " + s.lights + " > " + s.cap);
  if (dev === "phone" && data.opening && data.opening.dpr > 1.05) fails.push("טלפון יחס פיקסלים " + data.opening.dpr);
}

async function run(dev, q) {
  const browser = await chromium.launch(ARGS);
  const ctx = dev === "phone"
    ? await browser.newContext({ ...devices["iPhone 13"], locale: "he-IL" })
    : await browser.newContext({ viewport: { width: 1366, height: 800 }, locale: "he-IL", deviceScaleFactor: 1 });
  await ctx.addInitScript((qq) => { try { localStorage.setItem("tm_intro", "1"); if (qq) localStorage.setItem("tm_q", qq); } catch (e) {} }, q || "");
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
  const t0 = Date.now();
  await pg.goto(base, { timeout: 120000, waitUntil: "domcontentloaded" });
  await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
  const enterMs = Date.now() - t0;
  await pg.click("#enterBtn");
  const v = await views(pg, q ? dev + "-high" : dev);
  await browser.close();
  return { dev, q: q || "auto", enterMs, errs, ...v };
}

(async () => {
  const fails = [];
  const phone = await run("phone", "");
  const desktop = await run("desktop", "");
  const high = await run("phone", "high");
  for (const r of [phone, desktop]) {
    if (r.errs.length) fails.push(r.dev + " שגיאת JS: " + r.errs[0]);
    check(r.dev, r, fails);
  }
  if (high.errs.length) fails.push("טלפון גבוה שגיאת JS: " + high.errs[0]);
  if (!(high.opening && high.opening.dpr <= 1.05)) fails.push("באיכות גבוהה בטלפון יחס הפיקסלים " + (high.opening && high.opening.dpr) + " (התקרה היא 1)");
  if (!(high.opening && high.opening.map <= 512)) fails.push("מפת צל בטלפון " + (high.opening && high.opening.map));
  const hs = high.shoeva && high.shoeva.shoe;
  if (!hs || hs.crowd < CROWD.phone.crowd) fails.push("קהל שואבה באיכות גבוהה " + (hs && hs.crowd));
  const all = { phone, desktop, high, fails };
  fs.writeFileSync(path.join(OUT, "perf.json"), JSON.stringify(all, null, 2));
  const line = (dev, r) => ["opening", "shoeva", "city"].map((k) => `| ${dev} | ${k} | ${r[k].triangles} | ${r[k].calls} | ${r[k].dpr} | ${r[k].ql} |`).join("\n");
  const report = ["# תקציב ציור", "", "בלי כרטיס מסך. לא נמדדו כאן פריימים לשנייה של טלפון אמיתי.", "", "| מכשיר | מבט | משולשים | קריאות | פיקסלים | איכות |", "|---|---|---:|---:|---:|---|", line("טלפון", phone), line("מחשב", desktop), line("טלפון גבוה", high), "", "קהל שואבה בטלפון: " + (phone.shoeva.shoe && phone.shoeva.shoe.crowd) + ", במחשב: " + (desktop.shoeva.shoe && desktop.shoeva.shoe.crowd), "כניסה עד הכפתור, שניות: טלפון " + Math.round(phone.enterMs / 1000) + ", מחשב " + Math.round(desktop.enterMs / 1000), fails.length ? "\nחריגות:\n- " + fails.join("\n- ") : "\nבתוך התקציב.", ""].join("\n");
  fs.writeFileSync(path.join(OUT, "report.md"), report);
  console.log(report);
  if (fails.length) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });
