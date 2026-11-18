// 126.1: יוצר את tours/reading.json — הטקסט של כל הסיורים לחלופת הקריאה (כשאין תלת־ממד) — מתוך STORIES של האתר עצמו.
//   python3 -m http.server 8765 &   (מתוך תיקיית האתר)
//   node tools/test/reading-dump.js http://localhost:8765/
// הבדיקה האוטומטית (user-path.js) נכשלת אם הקובץ לא זהה למה שהאתר מציג, ולכן אחרי שינוי טקסט בסיור מריצים את זה שוב.
const { chromium } = require("playwright");
const fs = require("fs");
const URL = process.argv[2] || "http://localhost:8765/";
const NOTE = "זה הטקסט של הסיורים באתר. המודל מראה את בית המקדש של יחזקאל לפי המלבי״ם; בכל תחנה כתוב המקור, ומה שאינו מפורש מסומן.";
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 1000, height: 700 }, locale: "he-IL" });
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  await pg.goto(URL, { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => typeof window.__toursText === "function", null, { timeout: 600000, polling: 1000 });
  const tours = await pg.evaluate(() => window.__toursText());
  fs.mkdirSync("tours", { recursive: true });
  fs.writeFileSync("tours/reading.json", JSON.stringify({ note: NOTE, tours }, null, 1) + "\n");
  console.log(tours.length + " סיורים, " + tours.reduce((a, t) => a + t.steps.length, 0) + " תחנות");
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
