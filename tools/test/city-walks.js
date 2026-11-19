// עשרת מסלולי ההליכה בעיר (ביקורת 124.8, ז27 ועמוד 18).
// לכל מסלול: מחפשים דרך הליכה אמיתית (חיפוש A* על רשת של מטר) לפי אותם כללים שההליכה באתר משתמשת בהם:
// בלי לעבור דרך בניין, חומה או קיר, בלי לטפס על קיר (עלייה של יותר מ־1.2 מ׳ בצעד של 0.3 מ׳) ובלי ליפול (ירידה של יותר מ־2.2 מ׳).
// אם אין דרך, נקודת התקלה הראשונה היא הנקודה הקרובה ביותר ליעד שאפשר להגיע אליה.
// אחר כך הולכים בדרך שנמצאה בצעדים של 0.3 מ׳, כמו בהליכה באתר, ומצלמים מגובה העיניים באמצע הדרך ובסופה.
//
// 126.1 (בדיקה חוזרת, ו+ז): מסלול מקבל ✅ רק אם גם:
//   • נקודות היעד לא זזו יותר מ־12 מ׳ (נקודות קבועות),
//   • הליכה אמיתית בפקדים (מקש W) בסוף המסלול מזיזה את ההולך, וגובה העיניים נשאר 1.3–2.1 מ׳ מעל הרצפה,
//   • בצילום הסוף היעד מסומן בעמוד אור ונראה (שום קיר או בניין לא מסתיר אותו),
//   • ניסיון ללכת ישר דרך חומת העיר או דרך בניין סמוך נחסם (בדיקה שלילית),
//   • אין שגיאת JavaScript, וכל צילום נשמר.
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
  { k: 1, n: "שער יפו ← המצודה ← רחוב דוד", check: "פנייה פנימה וחיבור בין המפלסים", pts: [[-770, -150], [-700, -161], [-568.5, -139.7], [-428.7, -133.3]] },
  { k: 2, n: "שער שכם ← חאן א־זית ← השווקים", check: "מדרגות כניסה, קמרונות והולכי רגל", pts: [[-470.7, 455], [-424, 80], [-404.3, -113.1]] },
  { k: 3, n: "שער ציון ← הרובע היהודי ← החורבה", check: "סיבוב בשער ושיפוע הסמטה", pts: [[-552, -590], [-387.5, -290]] },
  { k: 4, n: "שער האשפות ← רחבת הכותל", check: "מעבר מכביש למדרכה וממדרכה לרחבה", pts: [[-112, -380], [-140, -175]] },
  { k: 5, n: "שער האריות ← ויה דולורוזה", check: "מקטעי מדרגות ורחובות צרים", pts: [[175, 318], [-120, 296]] },
  { k: 6, n: "שער הפרחים ← סמטאות הרובע המוסלמי", check: "קירות, צמתים ויכולת למצוא את היציאה", pts: [[-160, 575], [-260.6, 327.2], [-160, 575]] },
  { k: 7, n: "השער החדש ← הרובע הנוצרי ← המוריסטן", check: "מפלס הכניסה, סמטאות ושוק", pts: [[-885, 161], [-539, 33.8], [-516.6, -58.6]] },
  { k: 8, n: "הר הזיתים ← קדרון ← מול שער הרחמים", check: "ירידה תלולה וחיבור שביל לקרקע", pts: [[700, 40], [323, 90], [215, 106]] },
  { k: 9, n: "עיר דוד ← השילוח", check: "קרקע משתנה, שולי הכביש וגישה לבריכה", pts: [[40, -600], [-15, -825]] },
  { k: 10, n: "הר ציון ← הרובע הארמני ← שער יפו", check: "הליכה רציפה בין שלושה אזורים", pts: [[-600, -680], [-601.6, -395.5], [-770, -150]] },
  // 125.3: עוד שתי בדיקות, כדי שהחסימות החדשות לא יסגרו את הדרך מהעיר אל הר הבית
  { k: 11, n: "רחבת הכותל ← שער קיפונוס ← הר הבית", check: "העלייה במעבר המקורה", pts: [[-140, -175], [-40, -150]] },
  { k: 12, n: "שער האשפות ← שערי חולדה ← הר הבית", check: "המדרגות הדרומיות והמעבר בתוך ההר", pts: [[-112, -380], [0, -200]] },
  // 125.5: המדרגות החדשות מהרובע היהודי אל רחבת הכותל ואזור התפילה (לפי תמונות Mapillary)
  { k: 13, n: "הרובע היהודי ← המדרגות הדרומיות ← רחבת הכותל ← אזור התפילה", check: "המדרגות, המעקות והפתח בגדר אזור התפילה", pts: [[-207, -238], [-150, -258], [-115, -140]] },
  { k: 14, n: "בתי מחסה ← המדרגות הצפוניות ← הרחבה הדרומית", check: "גרם המדרגות השני והירידה אל הרחבה", pts: [[-184, -250], [-150, -232]] },
  // 126.1 (בדיקה חוזרת 35): הירידה מהרחוב אל רצפת הקרדו החפור
  { k: 15, n: "רחוב היהודים ← המדרגות ← רצפת הקרדו", check: "הירידה במדרגות, המעקה והעמודים במפלס החפירה", pts: [[-414, -309], [-418, -336]] },
  // 126.6 (תוכנית רחבת הכותל, סעיף ז): הדרך הראשית משער האשפות, שני הענפים שלה, והשביל בגן הארכאולוגי
  { k: 16, n: "שער האשפות ← הטיילת ← הרחבה הדרומית", check: "טיילת כמעט שטוחה, בלי לולאת הכביש", pts: [[-112, -380], [-130, -310], [-150, -258]] },
  { k: 17, n: "שער האשפות ← לאורך החומה ← רחבת שערי חולדה", check: "הענף המזרחי עד הרחבה שלמרגלות המדרגות", pts: [[-112, -380], [-45, -326], [2, -280]] },
  { k: 18, n: "הרחבה הדרומית ← רחוב קשת רובינסון ← שער חולדה המערבי", check: "השביל בגן הארכאולוגי", pts: [[-134, -262], [-82, -271], [-40, -275]] },
  // 126.8: רחוב העולים בעיר דוד, מבריכת השילוח עד כביש גבעתי (מסלולים 19-22 שמורים לרחבת הכותל)
  { k: 23, n: "בריכת השילוח ← רחוב העולים ← גבעתי", check: "המדרגות לאורך הרחוב, אבני השפה והמעקה סביב הבריכה", pts: [[-60, -874], [-105, -720], [-60, -556], [1, -423]] },
  // 127.2: מדרחוב ממילא, מקצהו הצפון־מערבי עד שער יפו
  { k: 24, n: "מדרחוב ממילא ← שער יפו", check: "החנויות המקושתות, הפנסים, האדניות ובתי הקפה במדרחוב", pts: [[-893, -77], [-850, -118], [-806, -158], [-760, -150]] },
];

const report = [];
let failed = false, warned = 0;

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
      const orig = R.pts.map((p) => p.slice());
      R.pts = R.pts.map(snap);
      const moved = R.pts.map((p, i) => Math.round(Math.hypot(p[0] - orig[i][0], p[1] - orig[i][1])));
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
      // negative test: a straight walk from a free street point into the nearest building must be stopped
      let neg = null;
      const B0 = R.pts[R.pts.length - 1];
      // the city gates are passages through a building on purpose: test a building away from them
      const GT = G.cityGates ? G.cityGates() || [] : [];
      const gp = (Array.isArray(GT) ? GT : Object.values(GT)).map((g) => Array.isArray(g) ? g : (g && (g.p || g.at || [g.x, g.n]))).filter((g) => g && isFinite(g[0]));
      const nearGate = (q) => gp.some((g) => Math.hypot(g[0] - q[0], g[1] - q[1]) < 30);
      outer: for (let r = 4; r <= 40; r += 2) for (let k = 0; k < 24; k++) {
        const a = k * Math.PI / 12, q = [B0[0] + Math.cos(a) * r, B0[1] + Math.sin(a) * r];
        if (!nearGate(q) && G.bldTop && G.bldTop(q[0], q[1]) > ground(q[0], q[1]) + 4 && !(G.onRoad && G.onRoad(q[0], q[1]))) {
          // the last free point on the straight line from the target toward the building
          let px = B0[0], pn = B0[1], blockedAt = null; const L = Math.hypot(q[0] - B0[0], q[1] - B0[1]), ns = Math.ceil(L / 0.3);
          for (let t = 1; t <= ns + 6; t++) { const qx = B0[0] + (q[0] - B0[0]) * t / ns, qn = B0[1] + (q[1] - B0[1]) * t / ns; if (!step(px, pn, qx, qn)) { blockedAt = [qx, qn]; break } px = qx; pn = qn }
          neg = { bld: [Math.round(q[0]), Math.round(q[1])], blocked: !!blockedAt };
          break outer;
        }
      }
      return { legs, first, total: Math.round(total), ms: Math.round(performance.now() - T0), moved, neg, pts: R.pts.map((p) => p.map((v) => Math.round(v * 10) / 10)) };
    }, R);

    // eye-level photos: in the middle of the walk, and at the end from a spot on the path where the target is seen
    const all = res.legs.flatMap((l) => l.path);
    const shots = [], probs = [];
    const END = R.pts[R.pts.length - 1];
    const pose = (p, q, goal) => pg.evaluate(([p, q, goal]) => {
      const G = window.__GA, TH = 0.13538, c = Math.cos(TH), s = Math.sin(TH), g2s = (x, n) => [x * c + n * s, -x * s + n * c];
      const a = g2s(p[0], p[1]), b = g2s(q[0], q[1]);
      G.walkPose(a[0], -a[1], b[0], -b[1]);
      const cam = G.getCam(), eye = cam.position.y - G.groundAt(a[0], -a[1]); // the walk itself keeps the eyes 1.65 m over groundAt
      if (!goal) return { eye };
      const e = g2s(goal[0], goal[1]); G.goal(e[0], -e[1]);
      return { eye, see: G.seen(e[0], G.floorAt(e[0], -e[1]) + 1.2, -e[1]) };
    }, [p, q, goal || null]);
    const snapShot = async (tag) => {
      const f2 = path.join(OUT, `route${R.k}-${tag}.png`);
      try { await pg.screenshot({ path: f2, timeout: 180000 }); shots.push(path.basename(f2)); }
      catch (e) { probs.push(`הצילום ${tag} לא נשמר`); }
    };
    let endSeen = null, eye = null;
    if (all.length >= 3) {
      const i = Math.floor((all.length - 1) / 2);
      eye = (await pose(all[i], all[Math.min(all.length - 1, i + 3)])).eye;
      await pg.waitForTimeout(2500);
      await snapShot("mid");
      // the end: step back along the path (6 to 30 m) until the target, marked by a blue beam, is in plain view
      for (const back of [2, 3, 4, 6, 8, 10]) {
        const j = Math.max(0, all.length - 1 - back);
        const r = await pose(all[j], END, END);
        endSeen = { back: back * 3, ...r.see };
        if (r.see.seen) break;
      }
      // not seen from the path: try free street spots around the target (8 to 24 m), as a visitor standing nearby would
      if (!endSeen.seen) {
        const ring = await pg.evaluate((E) => {
          const G = window.__GA, TH = 0.13538, c = Math.cos(TH), s = Math.sin(TH), g2s = (x, n) => [x * c + n * s, -x * s + n * c];
          const ok = (x, n) => { const a = g2s(x, n); return [[1, 0], [-1, 0], [0, 1], [0, -1]].every((d) => { const b = g2s(x + d[0], n + d[1]); return G.canStep(a[0], -a[1], b[0], -b[1]); }); };
          const out = []; for (const r of [8, 12, 16, 24]) for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, q = [E[0] + Math.cos(a) * r, E[1] + Math.sin(a) * r]; if (ok(q[0], q[1])) out.push(q); } return out;
        }, END);
        for (const q of ring.slice(0, 24)) { const r = await pose(q, END, END); if (r.see.seen) { endSeen = { back: Math.round(Math.hypot(q[0] - END[0], q[1] - END[1])), ...r.see, ring: true }; break; } }
      }
      await pg.waitForTimeout(2500);
      await snapShot("end");
      // real controls: hold W for 3 seconds from that spot, toward the target
      const before = await pg.evaluate(() => { const c = window.__GA.getCam().position; return [c.x, c.y, c.z]; });
      await pg.keyboard.down("w"); await pg.waitForTimeout(3000); await pg.keyboard.up("w"); await pg.waitForTimeout(600);
      const after = await pg.evaluate(() => { const G = window.__GA, c = G.getCam().position; return [c.x, c.y, c.z, c.y - G.groundAt(c.x, c.z)]; });
      const walked = Math.hypot(after[0] - before[0], after[2] - before[2]);
      res.walk = { walked: +walked.toFixed(1), eye: +after[3].toFixed(2) };
      if (walked < 0.4 && (endSeen && endSeen.dist > 3)) probs.push(`הליכה במקש W לא הזיזה את ההולך (${walked.toFixed(1)} מ׳)`);
      if (after[3] < 1.3 || after[3] > 2.1) probs.push(`גובה העיניים אחרי ההליכה ${after[3].toFixed(2)} מ׳`);
    }
    if (eye != null && (eye < 1.3 || eye > 2.1)) probs.push(`גובה העיניים באמצע ${eye.toFixed(2)} מ׳`);
    // ⚠ = the walk itself works, but the photo check is not confirmed: the route is NOT marked as checked (✅), and the reason is written
    const warns = [];
    if (!endSeen || !endSeen.seen) warns.push("היעד לא נראה בצילום הסוף" + (endSeen ? ` (מוסתר ${endSeen.hit} מ׳ מהמצלמה, היעד ב־${endSeen.dist} מ׳)` : ""));
    if (res.moved.some((m) => m > 12)) warns.push(`נקודת מסלול זזה ${Math.max(...res.moved)} מ׳ מהמקום שהוגדר`);
    if (res.neg && !res.neg.blocked) probs.push(`בדיקה שלילית: אפשר ללכת ישר לתוך הבניין ב־(${res.neg.bld.join(", ")})`);
    res.endSeen = endSeen;

    const ok = !res.first && res.legs.every((l) => l.found) && probs.length === 0;
    if (!ok) failed = true;
    if (ok && warns.length) warned++;
    const notes = res.legs.map((l, i) => `קטע ${i + 1}: ${l.found ? "נמצאה דרך" : "אין דרך"}, ${l.len} מ׳ (בקו ישר ${l.direct}), עלייה מרבית בצעד ${l.rise} מ׳, ירידה ${l.drop} מ׳${l.inB ? `, ${l.inB} מ׳ מתחת לבניינים (מעבר מקורה)` : ""}`).join(" · ");
    const fp = res.first ? `נקודת התקלה הראשונה: (${res.first.at.join(", ")}) בקטע ${res.first.leg}, ${res.first.left} מ׳ לפני היעד` : "";
    const extra = [`נקודות זזו: ${res.moved.join("/")} מ׳`, endSeen ? `יעד נראה מ־${endSeen.back} מ׳: ${endSeen.seen ? "כן" : "לא"}` : "", res.walk ? `הליכה ב־W: ${res.walk.walked} מ׳, עיניים ${res.walk.eye} מ׳` : "", res.neg ? `בניין חוסם: ${res.neg.blocked ? "כן" : "לא"}` : "", ...probs.map((p) => "❌ " + p), ...warns.map((p) => "⚠ " + p)].filter(Boolean).join(" · ");
    report.push(`| ${R.k} | ${!ok ? "❌" : warns.length ? "⚠" : "✅"} | ${R.n} | ${R.check} | ${notes}${fp ? " · " + fp : ""} · ${extra} | ${shots.join(", ")} |`);
    console.log(`route ${R.k} ${!ok ? "FAIL" : warns.length ? "WARN" : "OK"} ${res.ms}ms ${notes} ${fp} ${extra}`);
    fs.writeFileSync(path.join(OUT, `route${R.k}.json`), JSON.stringify(res));
  }
  // negative test: walking straight across the Old City wall, away from its gates, must be stopped
  if (!ONLY) {
    const wl = await pg.evaluate(() => {
      const G = window.__GA, W = G.wallLine(), GT = G.cityGates() || [], TH = 0.13538, c = Math.cos(TH), s = Math.sin(TH), g2s = (x, n) => [x * c + n * s, -x * s + n * c];
      const gp = (Array.isArray(GT) ? GT : Object.values(GT)).map((g) => Array.isArray(g) ? g : (g && (g.p || g.at || [g.x, g.n]))).filter((g) => g && isFinite(g[0]));
      const step = (x0, n0, x1, n1) => { const a = g2s(x0, n0), b = g2s(x1, n1); return G.canStep(a[0], -a[1], b[0], -b[1]); };
      const free = (x, n) => [[1, 0], [-1, 0], [0, 1], [0, -1]].every((d) => step(x, n, x + d[0], n + d[1]));
      const out = []; const n = W.length; let tried = 0;
      for (let k = 0; k < n - 1 && out.length < 8; k += Math.max(1, Math.floor(n / 24))) {
        const a = W[k], b = W[k + 1]; if (!a || !b) continue; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 6) continue;
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (gp.some((g) => Math.hypot(g[0] - m[0], g[1] - m[1]) < 40)) continue;
        // the wall is not drawn in front of the Huldah gates plaza on purpose (14-mount-walls.js farM, a model choice since v116)
        if (m[0] > -70 && m[0] < 70 && m[1] > -285 && m[1] < -225) continue;
        // where the city wall meets the Temple compound, the compound's own walls and rules take over (not the city wall)
        { const C = G.getCOMP(), A = G.getA(), q = g2s(m[0], m[1]); if (C) { const u = (q[0] - C.X0) / A, v = (C.N0 - q[1]) / A; if (u >= -20 && u <= 520 && v >= -20 && v <= 520) continue; } }
        const nx = -(b[1] - a[1]) / L, nn = (b[0] - a[0]) / L, P = [m[0] + nx * 7, m[1] + nn * 7], Q = [m[0] - nx * 7, m[1] - nn * 7];
        if (!free(P[0], P[1]) || !free(Q[0], Q[1])) continue; tried++;
        let ok = true, px = P[0], pn = P[1]; const ns = 50;
        for (let t = 1; t <= ns; t++) { const qx = P[0] + (Q[0] - P[0]) * t / ns, qn = P[1] + (Q[1] - P[1]) * t / ns; if (!step(px, pn, qx, qn)) { ok = false; break } px = qx; pn = qn }
        out.push({ at: m.map(Math.round), crossed: ok });
      }
      return { tried, out };
    });
    const bad = wl.out.filter((o) => o.crossed);
    if (!wl.out.length || bad.length) failed = true;
    report.push(`| חומה | ${!wl.out.length || bad.length ? "❌" : "✅"} | ניסיון ללכת ישר דרך חומת העיר | בדיקה שלילית | ${wl.out.length} קטעי חומה נבדקו${bad.length ? "; אפשר לעבור ב: " + bad.map((o) => "(" + o.at.join(", ") + ")").join(" ") : ", בכולם ההליכה נעצרה"} | |`);
    console.log("wall", JSON.stringify(wl));
  }
  if (errs.length) failed = true;
  const md = ["# מסלולי ההליכה בעיר", "", "✅ נבדק: דרך, הליכה בפקדים, גובה עיניים, יעד נראה בצילום, בניין חוסם · ⚠ ההליכה עובדת אבל היעד לא אומת בצילום (לא נחשב בדוק) · ❌ נכשל", "", "| # | | מסלול | מה לבדוק | תוצאה | צילומים |", "|---|---|---|---|---|---|", ...report, "", errs.length ? "שגיאות: " + errs.slice(0, 3).join(" · ") : "בלי שגיאות JavaScript", ""].join("\n");
  fs.writeFileSync(path.join(OUT, "report.md"), md);
  await browser.close();
  console.log(failed ? "\nנכשל" : warned ? `\nעבר, אבל ב־${warned} מסלולים היעד לא אומת בצילום (⚠)` : "\nהכול עבר");
  process.exit(failed ? 1 : 0);
})();
