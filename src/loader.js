/* Loads the program parts listed in src/parts.txt, in that order, and runs them as ONE script.
   The parts are pieces of one big function (they share its variables), so none of them runs alone.
   tools/build.py joins them the same way into dist/temple-3d.html. */
(function () {
  var base = "src/";
  function get(p) {
    return fetch(base + p, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(p + ": " + r.status);
      return r.text();
    });
  }
  function fail(e) {
    var el = document.getElementById("loading");
    if (el) el.textContent = "לא הצלחתי לטעון את קבצי ההדמיה (" + (e && e.message || e) + "). צריך לפתוח דרך שרת, לא בלחיצה כפולה על הקובץ.";
    console.error(e);
  }
  get("parts.txt").then(function (list) {
    var parts = list.split(/\r?\n/).map(function (l) { return l.trim(); })
      .filter(function (l) { return l && l.charAt(0) !== "#"; });
    return Promise.all(parts.map(get)).then(function (texts) {
      var body = texts.map(function (t) { return t.slice(-1) === "\n" ? t.slice(0, -1) : t; }).join("\n");
      var s = document.createElement("script");
      s.text = body + "\n//# sourceURL=temple-main.js";
      document.body.appendChild(s);
    });
  }).catch(fail);
})();
