// עשרת מסלולי ההליכה בעיר (ביקורת 124.8, ז27 ועמוד 18).
// לכל מסלול: מחפשים דרך הליכה אמיתית (חיפוש A* על רשת של מטר) לפי אותם כללים שההליכה באתר משתמשת בהם:
// בלי לעבור דרך בניין, חומה או קיר, בלי לטפס על קיר (עלייה של יותר מ־1.2 מ׳ בצעד של 0.3 מ׳) ובלי ליפול (ירידה של יותר מ־2.2 מ׳).
// אם אין דרך, נקודת התקלה הראשונה היא הנקודה הקרובה ביותר ליעד שאפשר להגיע אליה.
// אחר כך הולכים בדרך שנמצאה בצעדים של 0.3 מ׳, כמו בהליכה באתר, ומצלמים מגובה העיניים באמצע הדרך ובסופה.
//
//   python3 -m http.server 8765 &      (מתוך תיקיית האתר)
//   node tools/test/city-walks.js http://localhost:8765/ out-dir [מספר מסלול]
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:8765/";
const OUT = process.argv[3] || "city-walks-out";
const ONLY = process.argv[4] ? +process.argv[4] : 0;
fs.mkdirSync(OUT, { recursive: true });

// נקודות בקואורדינטות גאוגרפיות של המודל (x מזרח, n צפון, במטרים מכיפת הסלע). התחלה מחוץ לשער, יעד, ונקודות ביניים שהמסלול חייב לעבור בהן.
const ROUTES = [
  { k: 1, n: "שער יפו ← המצודה ← רחוב דוד", check: "פנייה פנימה וחיבור בין המפלסים", pts: [[-770, -150], [-700, -170], [-560, -125], [-440, -122]] },
  { k: 2, n: "שער שכם ← חאן א־זית ← השווקים", check: "מדרגות כניסה, קמרונות והולכי רגל", pts: [[-462, 450], [-424, 80], [-411, -88]] },
  { k: 3, n: "שער ציון ← הרובע היהודי ← החורבה", check: "סיבוב בשער ושיפוע הסמטה", pts: [[-552, -590], [-387.5, -290]] },
  { k: 4, n: "שער האשפות ← רחבת הכותל", check: "מעבר מכביש למדרכה וממדרכה לרחבה", pts: [[-112, -380], [-140, -175]] },
  { k: 5, n: "שער האריות ← ויה דולורוזה", check: "מקטעי מדרגות ורחובות צרים", pts: [[175, 318], [-120, 296]] },
  { k: 6, n: "שער הפרחים ← סמטאות הרובע המוסלמי", check: "קירות, צמתים ויכולת למצוא את היציאה", pts: [[-160, 575], [-250, 330], [-160, 575]] },
  { k: 7, n: "השער החדש ← הרובע הנוצרי ← המוריסטן", check: "מפלס הכניסה, סמטאות ושוק", pts: [[-885, 160], [-545, 56], [-518, -60]] },
  { k: 8, n: "הר הזיתים ← קדרון ← מול שער הרחמים", check: "ירידה תלולה וחיבור שביל לקרקע", pts: [[700, 40], [323, 90], [215, 106]] },
  { k: 9, n: "עיר דוד ← השילוח", check: "קרקע משתנה, שולי הכביש וגישה לבריכה", pts: [[40, -600], [-15, -825]] },
  { k: 10, n: "הר ציון ← הרובע הארמני ← שער יפו", check: "הליכה רציפה בין שלושה אזורים", pts: [[-600, -680], [-598, -382], [-770, -150]] },
  // 125.3: עוד שתי בדיקות, כדי שהחסימות החדשות לא יסגרו את הדרך מהעיר אל הר הבית
  { k: 11, n: "רחבת הכותל ← שער קיפונוס ← הר הבית", check: "העלייה במעבר המקורה", pts: [[-140, -175], [-40, -150]] },
  { k: 12, n: "שער האשפות ← שערי חולדה ← הר הבית", check: "המדרגות הדרומיות והמעבר בתוך ההר", pts: [[-112, -380], [0, -200]] },
];

const report = [];
let failed = false;

(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 640 }, locale: "he-IL" });
  await ctx.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (r) => r.abort());
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
  await pg.goto(URL, { timeout: 120000, waitUntil: "domcontentloaded" });
  await pg.waitForSelector("#enterBtn", { state: "visible", timeout: 600000 });
  await pg.click("#enterBtn");
  await pg.waitForSelector("#intro:not([hidden])", { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector("#intro button:not(.pri)"); if (b) b.click(); });
  await pg.waitForSelector("#intro", { state: "hidden", timeout: 10000 }).catch(() => {});
  await pg.waitForTimeout(2000);

  for (const R of ROUTES) {
    if (ONLY && R.k !== ONLY) continue;
    const res = await pg.evaluate((R) => {
      const G = window.__GA, TH = 0.13538, c = Math.cos(TH), s = Math.sin(TH);
      const g2s = (x, n) => [x * c + n * s, -x * s + n * c]; // geo -> scene (x, n); scene z = -n
      const s2g = (x, n) => [x * c - n * s, x * s + n * c];
      const ground = (x, n) => { const q = g2s(x, n); return G.groundAt(q[0], -q[1]); };
      // the same rule the walk uses: G.canStep when it exists (125.3), else only "blocked"
      const step = (x0, n0, x1, n1) => {
        const a = g2s(x0, n0), b = g2s(x1, n1);
        if (G.canStep) return G.canStep(a[0], -a[1], b[0], -b[1]);
        return !G.blocked(b[0], -b[1], G.groundAt(a[0], -a[1]));
      };
      // a place (a gate, a synagogue) is a building: walk to the nearest free spot in front of it (up to 25 m)
      const free = (x, n) => [[1, 0], [-1, 0], [0, 1], [0, -1]].every((d) => step(x, n, x + d[0], n + d[1]) && step(x + d[0], n + d[1], x, n));
      const snap = (p) => { for (const want of [true, false]) { if (free(p[0], p[1]) && (!want || G.onStreet(p[0], p[1]))) return p; for (let r = 1; r <= 30; r += 1) for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12, q = [p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r]; if (free(q[0], q[1]) && (!want || G.onStreet(q[0], q[1]))) return q } } return p }; // a street in front of the place first, so a closed courtyard is not the goal
      R.pts = R.pts.map(snap);
      const T0 = performance.now();
      const legs = [];
      let first = null, total = 0;
      for (let li = 0; li < R.pts.length - 1; li++) {
        const A = R.pts[li], B = R.pts[li + 1], M = 120;
        const x0 = Math.min(A[0], B[0]) - M, x1 = Math.max(A[0], B[0]) + M, n0 = Math.min(A[1], B[1]) - M, n1 = Math.max(A[1], B[1]) + M;
        const st = 1, nx = Math.ceil((x1 - x0) / st) + 1, nn = Math.ceil((n1 - n0) / st) + 1, N = nx * nn;
        const gs = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), done = new Uint8Array(N);
        const id = (i, j) => j * nx + i, XY = (k) => [x0 + (k % nx) * st, n0 + Math.floor(k / nx) * st];
        const ci = (p) => [Math.round((p[0] - x0) / st), Math.round((p[1] - n0) / st)];
        const sI = ci(A), eI = ci(B), sK = id(sI[0], sI[1]), eK = id(eI[0], eI[1]);
        const h = (k) => { const p = XY(k); return Math.hypot(p[0] - B[0], p[1] - B[1]); };
        // binary heap
        const heap = [], push = (k, f) => { heap.push([f, k]); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p } };
        const pop = () => { const t = heap[0], l = heap.pop(); if (heap.length) { heap[0] = l; let i = 0; for (;;) { const a = 2 * i + 1, b = a + 1; let m = i; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m } } return t };
        gs[sK] = 0; push(sK, h(sK));
        let best = sK, bestH = h(sK), found = false, it = 0;
        const D8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
        while (heap.length && it < 1.2e6) {
          it++;
          const [, k] = pop(); if (done[k]) continue; done[k] = 1;
          const hk = h(k); if (hk < bestH) { bestH = hk; best = k }
          if (hk < 1.6) { found = true; best = k; break }
          const i = k % nx, j = Math.floor(k / nx), p = XY(k);
          for (const [di, dj, w] of D8) {
            const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= nx || jj >= nn) continue;
            const q = id(ii, jj); if (done[q]) continue;
            const g2 = gs[k] + w * st; if (g2 >= gs[q]) continue;
            // walk the step in the site's own sub-steps (at most 0.3 m)
            const P2 = XY(q); let ok = true, px = p[0], pn = p[1];
            const ns = Math.ceil(w * st / 0.3);
            for (let t = 1; t <= ns; t++) { const qx = p[0] + (P2[0] - p[0]) * t / ns, qn = p[1] + (P2[1] - p[1]) * t / ns; if (!step(px, pn, qx, qn)) { ok = false; break } px = qx; pn = qn }
            if (!ok) continue;
            gs[q] = g2; from[q] = k; push(q, g2 + h(q));
          }
        }
        const path = []; for (let k = best; k >= 0; k = from[k]) path.push(XY(k)); path.reverse();
        let len = 0, rise = 0, drop = 0, inB = 0;
        for (let i = 1; i < path.length; i++) {
          len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
          const d = ground(path[i][0], path[i][1]) - ground(path[i - 1][0], path[i - 1][1]); rise = Math.max(rise, d); drop = Math.max(drop, -d);
          if (G.bldTop && G.bldTop(path[i][0], path[i][1]) > ground(path[i][0], path[i][1]) + 2.5 && !(G.onRoad && G.onRoad(path[i][0], path[i][1]))) inB++;
        }
        const direct = Math.hypot(B[0] - A[0], B[1] - A[1]);
        legs.push({ found, len: Math.round(len), direct: Math.round(direct), rise: +rise.toFixed(2), drop: +drop.toFixed(2), inB, path: path.filter((_, i) => i % 3 === 0 || i === path.length - 1) });
        total += len;
        if (!found && !first) { const p = XY(best); first = { leg: li + 1, at: [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10], left: Math.round(bestH) }; break }
      }
      return { legs, first, total: Math.round(total), ms: Math.round(performance.now() - T0) };
    }, R);

    // eye-level photos: in the middle of the walk and at its end, looking the way one walks
    const all = res.legs.flatMap((l) => l.path);
    const shots = [];
    for (const [tag, f] of [["mid", 0.5], ["end", 1]]) {
      if (all.length < 3) break;
      const i = tag === "end" ? Math.max(0, all.length - 5) : Math.floor((all.length - 1) * f);
      const p = all[i], q = all[Math.min(all.length - 1, i + (tag === "end" ? 4 : 3))];
      await pg.evaluate(([p, q]) => {
        const G = window.__GA, TH = 0.13538, c = Math.cos(TH), s = Math.sin(TH), g2s = (x, n) => [x * c + n * s, -x * s + n * c];
        const a = g2s(p[0], p[1]), b = g2s(q[0], q[1]);
        G.walkPose(a[0], -a[1], b[0], -b[1]);
      }, [p, q]);
      await pg.waitForTimeout(2500);
      const f2 = path.join(OUT, `route${R.k}-${tag}.png`);
      await pg.screenshot({ path: f2, timeout: 180000 }).catch(() => {});
      shots.push(path.basename(f2));
    }

    const ok = !res.first && res.legs.every((l) => l.found);
    if (!ok) failed = true;
    const notes = res.legs.map((l, i) => `קטע ${i + 1}: ${l.found ? "נמצאה דרך" : "אין דרך"}, ${l.len} מ׳ (בקו ישר ${l.direct}), עלייה מרבית בצעד ${l.rise} מ׳, ירידה ${l.drop} מ׳${l.inB ? `, ${l.inB} מ׳ מתחת לבניינים (מעבר מקורה)` : ""}`).join(" · ");
    const fp = res.first ? `נקודת התקלה הראשונה: (${res.first.at.join(", ")}) בקטע ${res.first.leg}, ${res.first.left} מ׳ לפני היעד` : "";
    report.push(`| ${R.k} | ${ok ? "✅" : "❌"} | ${R.n} | ${R.check} | ${notes}${fp ? " · " + fp : ""} | ${shots.join(", ")} |`);
    console.log(`route ${R.k} ${ok ? "OK" : "FAIL"} ${res.ms}ms ${notes} ${fp}`);
    fs.writeFileSync(path.join(OUT, `route${R.k}.json`), JSON.stringify(res));
  }
  const md = ["# עשרת מסלולי ההליכה בעיר", "", "| # | | מסלול | מה לבדוק | תוצאה | צילומים |", "|---|---|---|---|---|---|", ...report, "", errs.length ? "שגיאות: " + errs.slice(0, 3).join(" · ") : "בלי שגיאות JavaScript", ""].join("\n");
  fs.writeFileSync(path.join(OUT, "report.md"), md);
  await browser.close();
  console.log(failed ? "\nנכשל" : "\nהכול עבר");
  process.exit(failed ? 1 : 0);
})();
