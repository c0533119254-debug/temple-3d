/* TempleMusic — מוזיקת רקע למסך הטעינה ולסיורים של בית המקדש התלת־ממדי.
   בלי תלויות. לא מאחסן שמע מוגן: «והראנו בבנינו» רק בהטמעת יוטיוב רשמית.
   נגן מוסתר, start=260 end=300 (בית המקהלה). נפילה: niggun-baal-shem-tov.ogg. */
(function (global) {
  "use strict";

  var VIDEO_ID = "QiadgWV4YxI";
  var START = 260;
  var END = 300;
  var FADE_IN_MS = 800;
  var FADE_OUT_MS = 1200;
  var YT_VOL = 80;
  var AUDIO_VOL = 0.8;
  var MUTE_KEY = "temple-music-muted";
  var YT_CREDIT = "לחן: שלמה יהודה רכניץ · וידאו: Project Productions (YouTube)";
  var FALLBACK_CREDIT = "ניגון הבעל שם טוב · ביצוע: ניצן צבי כהן · CC BY 4.0";
  var API_TIMEOUT_MS = 8000;
  var PLAYING_GRACE_MS = 1500; /* אם הפזמון ביוטיוב לא מנגן בפועל תוך זמן קצר מהלחיצה, עוברים לניגון הגיבוי */

  var cfg = {
    root: null,
    fallbackSrc: null,
    forceFallback: false
  };

  var ytPlayer = null;
  var ytReady = false;
  var ytFailed = false;
  var ytWrap = null;
  var audioEl = null;
  /* ביום ששמע צריך מחווה (iOS/Android): נפתחים בתוך הלחיצה על «כניסה» */
  var actx = null;          /* AudioContext שנוצר ושוחרר בתוך המחווה (מאפשר דעיכה גם ב־iOS, שם audio.volume לקריאה בלבד) */
  var fbEl = null;          /* אלמנט הניגון הגיבוי, מנוגן בשקט בתוך המחווה ולכן מותר לו להתחיל מאוחר יותר */
  var narrPool = [];        /* אלמנטי audio ששוחררו בתוך המחווה, לקריינות (iOS משחרר כל אלמנט בנפרד) */
  var narrIdx = 0;
  var unlocked = false;
  var SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  var muteBtn = null;
  var creditEl = null;
  var styleEl = null;

  var phase = "idle"; /* idle | loading | file | silent */
  var source = null;  /* yt | fallback | file */
  var muted = false;
  var gen = 0;
  var fadeTimer = 0;
  var endTimer = 0;
  var playWatch = 0;
  var pendingLoading = false;
  var silenced = false;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function scriptDir() {
    var scripts = document.getElementsByTagName("script");
    var i, src;
    for (i = scripts.length - 1; i >= 0; i--) {
      src = scripts[i].src || "";
      if (/music\.js(\?|#|$)/.test(src)) return src.replace(/[^/]+$/, "");
    }
    return "";
  }

  function defaultFallback() {
    return (cfg.fallbackSrc || (scriptDir() + "niggun-baal-shem-tov.ogg"));
  }

  function readMuted() {
    try { return global.localStorage.getItem(MUTE_KEY) === "1"; }
    catch (e) { return false; }
  }

  function writeMuted(on) {
    try {
      if (on) global.localStorage.setItem(MUTE_KEY, "1");
      else global.localStorage.removeItem(MUTE_KEY);
    } catch (e) {}
  }

  function bump() {
    gen += 1;
    return gen;
  }

  function rootEl() {
    if (cfg.root) {
      if (typeof cfg.root === "string") return $(cfg.root) || document.body;
      return cfg.root;
    }
    return $("#stage") || document.body;
  }

  function injectStyle() {
    if (styleEl) return;
    styleEl = document.createElement("style");
    styleEl.id = "temple-music-style";
    styleEl.textContent = [
      "#temple-yt-wrap{position:fixed;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);bottom:0;left:0;pointer-events:none}",
      "#temple-music-mute{position:absolute;top:12px;inset-inline-start:12px;z-index:60;width:36px;height:36px;border-radius:50%;border:1px solid rgba(245,239,224,.35);background:rgba(10,14,22,.55);color:#F5EFE0;font-size:16px;line-height:1;cursor:pointer;direction:rtl;padding:0;display:flex;align-items:center;justify-content:center}",
      "#temple-music-mute:focus-visible{outline:2px solid #F0D58C;outline-offset:2px}",
      "#temple-music-mute[hidden]{display:none!important}",
      "#temple-music-credit{position:absolute;bottom:10px;inset-inline-start:12px;inset-inline-end:12px;z-index:60;text-align:center;font:400 11px/1.4 Assistant,Arial,sans-serif;color:rgba(245,239,224,.72);direction:rtl;pointer-events:none;text-shadow:0 1px 8px rgba(0,0,0,.45)}",
      "#temple-music-credit[hidden]{display:none!important}",
      ".stage{position:relative}"
    ].join("");
    document.head.appendChild(styleEl);
  }

  function ensureUi() {
    injectStyle();
    var root = rootEl();
    if (getComputedStyle(root).position === "static" && root !== document.body) {
      root.style.position = "relative";
    }
    if (!muteBtn) {
      muteBtn = document.getElementById("temple-music-mute");
      if (!muteBtn) {
        muteBtn = document.createElement("button");
        muteBtn.type = "button";
        muteBtn.id = "temple-music-mute";
        root.appendChild(muteBtn);
      }
      muteBtn.addEventListener("click", toggleMute);
    }
    if (!creditEl) {
      creditEl = document.getElementById("temple-music-credit");
      if (!creditEl) {
        creditEl = document.createElement("div");
        creditEl.id = "temple-music-credit";
        creditEl.setAttribute("aria-hidden", "true");
        root.appendChild(creditEl);
      }
    }
    paintMute();
  }

  function paintMute() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-label", muted ? "הפעלת מוזיקה" : "השתקת מוזיקה");
    muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
    muteBtn.title = muted ? "הפעלת מוזיקה" : "השתקת מוזיקה";
  }

  function showChrome(credit) {
    ensureUi();
    muteBtn.hidden = false;
    if (credit) {
      creditEl.textContent = credit;
      creditEl.hidden = false;
    }
  }

  function hideChromeIfIdle() {
    if (phase !== "idle" && phase !== "silent") return;
    if (typeof TR !== "undefined" && TR.def) return;
    if (creditEl) creditEl.hidden = true;
    if (muteBtn) muteBtn.hidden = true;
  }

  function applyMuteToOutputs() {
    if (ytReady && ytPlayer) {
      try {
        if (muted) ytPlayer.mute();
        else ytPlayer.unMute();
      } catch (e) {}
    }
    if (audioEl) {
      if (audioEl._gain) setAudioLevel(audioEl._lvl || 0);
      else audioEl.muted = muted;
    }
  }

  /* עוצמת ניגון הקובץ: דרך GainNode כשאפשר (עובד גם ב־iOS), אחרת audio.volume */
  function setAudioLevel(v) {
    if (!audioEl) return;
    v = Math.max(0, Math.min(1, v));
    audioEl._lvl = v;
    if (audioEl._gain) {
      try { audioEl._gain.gain.value = muted ? 0 : v; } catch (e) {}
    } else {
      try { audioEl.volume = v; } catch (e2) {}
    }
  }

  function getAudioLevel() {
    if (!audioEl) return AUDIO_VOL;
    if (audioEl._gain) return audioEl._lvl == null ? AUDIO_VOL : audioEl._lvl;
    return audioEl.volume;
  }

  function toggleMute() {
    setMuted(!muted);
    /* ביטול השתקה הוא מחווה של המשתמש — אם חיכינו לכניסה, מתחילים כאן */
    if (!muted && pendingLoading && phase === "idle") {
      pendingLoading = false;
      beginLoadingPlayback();
    }
  }

  function setMuted(on) {
    muted = !!on;
    writeMuted(muted);
    applyMuteToOutputs();
    paintMute();
  }

  function loadYouTubeApi() {
    return new Promise(function (resolve, reject) {
      if (global.YT && YT.Player) { resolve(); return; }
      var settled = false;
      var prev = global.onYouTubeIframeAPIReady;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error("yt-api-timeout"));
      }, API_TIMEOUT_MS);
      global.onYouTubeIframeAPIReady = function () {
        if (typeof prev === "function") {
          try { prev(); } catch (e) {}
        }
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        tag.onerror = function () {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(new Error("yt-api"));
        };
        document.head.appendChild(tag);
      }
    });
  }

  function ensureYtWrap() {
    if (ytWrap && document.body.contains(ytWrap)) return;
    ytWrap = document.getElementById("temple-yt-wrap");
    if (!ytWrap) {
      ytWrap = document.createElement("div");
      ytWrap.id = "temple-yt-wrap";
      ytWrap.setAttribute("aria-hidden", "true");
      var inner = document.createElement("div");
      inner.id = "temple-yt-player";
      ytWrap.appendChild(inner);
      document.body.appendChild(ytWrap);
    }
  }

  function createYtPlayer() {
    return new Promise(function (resolve, reject) {
      ensureYtWrap();
      try {
        ytPlayer = new YT.Player("temple-yt-player", {
          width: 1,
          height: 1,
          videoId: VIDEO_ID,
          playerVars: {
            start: START,
            end: END,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            autoplay: 0,
            origin: location.origin
          },
          events: {
            onReady: function () {
              ytReady = true;
              applyMuteToOutputs();
              resolve(ytPlayer);
            },
            onError: function () {
              ytFailed = true;
              ytReady = false;
              reject(new Error("yt-error"));
              if (phase === "loading" && source === "yt") startFallback();
            },
            onStateChange: function (e) {
              if (!global.YT) return;
              if (e.data === YT.PlayerState.ENDED) {
                if (phase === "loading" && source === "yt") finishOut(true);
              }
            }
          }
        });
      } catch (err) {
        ytFailed = true;
        reject(err);
      }
    });
  }

  function preloadYt() {
    if (cfg.forceFallback || ytFailed || ytReady) return Promise.resolve();
    return loadYouTubeApi().then(createYtPlayer).catch(function () {
      ytFailed = true;
    });
  }

  function fadeYt(from, to, ms, token, done) {
    if (!ytPlayer || typeof ytPlayer.setVolume !== "function") {
      if (done) done();
      return;
    }
    var t0 = performance.now();
    function step(now) {
      if (token !== gen) return;
      var p = Math.min(1, (now - t0) / ms);
      try { ytPlayer.setVolume(Math.round(from + (to - from) * p)); } catch (e) {}
      if (p < 1) fadeTimer = requestAnimationFrame(step);
      else if (done) done();
    }
    fadeTimer = requestAnimationFrame(step);
  }

  function fadeAudio(from, to, ms, token, done) {
    if (!audioEl) {
      if (done) done();
      return;
    }
    var t0 = performance.now();
    function step(now) {
      if (token !== gen) return;
      var p = Math.min(1, (now - t0) / ms);
      setAudioLevel(from + (to - from) * p);
      if (p < 1) fadeTimer = requestAnimationFrame(step);
      else if (done) done();
    }
    fadeTimer = requestAnimationFrame(step);
  }

  function clearWatchers() {
    if (fadeTimer) cancelAnimationFrame(fadeTimer);
    fadeTimer = 0;
    if (endTimer) clearInterval(endTimer);
    endTimer = 0;
    if (playWatch) clearTimeout(playWatch);
    playWatch = 0;
  }

  function watchYtEnd(token) {
    if (endTimer) clearInterval(endTimer);
    var fadeAt = END - FADE_OUT_MS / 1000;
    endTimer = setInterval(function () {
      if (token !== gen || source !== "yt" || !ytPlayer) return;
      try {
        var t = ytPlayer.getCurrentTime();
        if (typeof t === "number" && t >= fadeAt) {
          clearInterval(endTimer);
          endTimer = 0;
          finishOut(false);
        }
      } catch (e) {}
    }, 200);
  }

  function startYtFromGesture() {
    if (!ytReady || !ytPlayer || typeof ytPlayer.playVideo !== "function") return false;
    phase = "loading";
    source = "yt";
    silenced = false;
    var token = bump();
    showChrome(YT_CREDIT);
    try {
      ytPlayer.setVolume(0);
      if (muted) ytPlayer.mute();
      else ytPlayer.unMute();
      ytPlayer.seekTo(START, true);
      ytPlayer.playVideo();
    } catch (e) {
      return false;
    }
    fadeYt(0, muted ? 0 : YT_VOL, FADE_IN_MS, token);
    watchYtEnd(token);
    if (playWatch) clearTimeout(playWatch);
    playWatch = setTimeout(function () {
      if (token !== gen || source !== "yt") return;
      var ok = false;
      try {
        var st = ytPlayer.getPlayerState();
        var t = ytPlayer.getCurrentTime();
        ok = (st === YT.PlayerState.PLAYING) && t >= START - 1;
      } catch (e) {}
      if (!ok) startFallback();
      else if (fbEl && audioEl !== fbEl) { try { fbEl.pause(); } catch (e) {} }
    }, PLAYING_GRACE_MS);
    return true;
  }

  function killAudio() {
    if (!audioEl) return;
    try { audioEl.pause(); } catch (e) {}
    if (audioEl === fbEl) { /* משאירים את האלמנט ששוחרר במחווה, לשימוש חוזר */
      try { audioEl._lvl = 0; if (audioEl._gain) audioEl._gain.gain.value = 0; } catch (e1) {}
      audioEl = null;
      return;
    }
    try { audioEl.removeAttribute("src"); audioEl.load(); } catch (e2) {}
    audioEl = null;
  }

  function pauseYt() {
    if (!ytPlayer) return;
    try { ytPlayer.pauseVideo(); } catch (e) {}
    try { ytPlayer.setVolume(0); } catch (e2) {}
  }

  function startFallback() {
    clearWatchers();
    var token = bump();
    if (source === "yt") pauseYt();
    killAudio();
    phase = "loading";
    source = "fallback";
    silenced = false;
    if (ytPlayer) { try { ytPlayer.mute(); ytPlayer.pauseVideo(); } catch (e) {} }
    resumeCtx();
    if (fbEl) {
      audioEl = fbEl;
      try { audioEl.currentTime = 0; } catch (e) {}
    } else {
      audioEl = new Audio(defaultFallback());
      audioEl.preload = "auto";
      audioEl.loop = true;
    }
    if (audioEl._gain) audioEl.muted = false; else audioEl.muted = muted;
    setAudioLevel(0);
    showChrome(FALLBACK_CREDIT + (/\.m4a(\?|#|$)/.test(audioEl.src || "") ? " · הומר ל־AAC" : ""));
    var p = audioEl.play();
    if (p && typeof p.then === "function") {
      p.catch(function () {
        /* נפילה שקטה: בלי הודעת שגיאה על המסך (הכניסה לא תלויה בשמע) */
        phase = "idle";
        source = null;
        hideChromeIfIdle();
      });
    }
    fadeAudio(0, muted ? 0 : AUDIO_VOL, FADE_IN_MS, token);
  }

  function beginLoadingPlayback() {
    if (muted) {
      pendingLoading = true;
      phase = "idle";
      if (fbEl) { try { fbEl.pause(); } catch (e) {} }
      ensureUi();
      muteBtn.hidden = false;
      return;
    }
    pendingLoading = false;
    if (cfg.forceFallback || ytFailed || !ytReady) {
      startFallback();
      return;
    }
    if (!startYtFromGesture()) startFallback();
  }

  function finishOut(immediate, then) {
    clearWatchers();
    var token = bump();
    var after = function () {
      if (token !== gen) return;
      pauseYt();
      killAudio();
      phase = "idle";
      source = null;
      hideChromeIfIdle();
      if (then) then();
    };
    if (immediate || (source !== "yt" && source !== "fallback" && source !== "file")) {
      after();
      return;
    }
    if (source === "yt") {
      var from = YT_VOL;
      try { from = ytPlayer.getVolume(); } catch (e) {}
      fadeYt(from, 0, FADE_OUT_MS, token, after);
    } else {
      var aFrom = audioEl ? getAudioLevel() : AUDIO_VOL;
      fadeAudio(aFrom, 0, FADE_OUT_MS, token, after);
    }
  }

  function init(opts) {
    opts = opts || {};
    if (opts.root) cfg.root = opts.root;
    if (opts.fallbackSrc) cfg.fallbackSrc = opts.fallbackSrc;
    if (opts.forceFallback) cfg.forceFallback = true;
    muted = readMuted();
    ensureUi();
    muteBtn.hidden = true;
    creditEl.hidden = true;
    if (!cfg.forceFallback) { preloadYt(); prepareTours(); }
  }

  /* לקרוא מתוך מאורע הלחיצה על «כניסה», לא אחרי setTimeout */
  function startLoading() {
    if (phase === "loading") return;
    pendingLoading = true;
    beginLoadingPlayback();
  }

  function resumeCtx() {
    try { if (actx && actx.state === "suspended") actx.resume(); } catch (e) {}
  }

  function fallbackUrl() {
    var u = defaultFallback();
    if (cfg.fallbackSrc) return u;
    try {
      var a = document.createElement("audio");
      var ogg = a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"');
      /* ב־Safari ישן (iOS לפני 18.4) אין Ogg: אותו ניגון מומר ל־AAC (CC BY 4.0, ראו ASSETS_LICENSES.md) */
      if (!ogg) return u.replace(/\.ogg(\?|#|$)/, ".m4a$1");
    } catch (e) {}
    return u;
  }

  /* שחרור כל מה ששמע צריך מחווה בשבילו. לקרוא באופן סינכרוני מתוך הלחיצה. לעולם לא זורק. */
  function unlockAudio() {
    if (unlocked) { resumeCtx(); return; }
    unlocked = true;
    var AC = global.AudioContext || global.webkitAudioContext;
    try {
      if (AC) {
        actx = new AC();
        resumeCtx();
        var b = actx.createBuffer(1, 1, 22050), n = actx.createBufferSource();
        n.buffer = b; n.connect(actx.destination); n.start(0);
      }
    } catch (e) { actx = null; }
    /* ניגון גיבוי: מתחיל בשקט כבר עכשיו (בתוך המחווה), עוצמה 0 */
    try {
      fbEl = new Audio();
      fbEl.preload = "auto";
      fbEl.loop = true;
      fbEl.setAttribute("playsinline", "");
      fbEl.src = fallbackUrl();
      if (actx) {
        try {
          var src = actx.createMediaElementSource(fbEl), g = actx.createGain();
          g.gain.value = 0;
          src.connect(g); g.connect(actx.destination);
          fbEl._gain = g; fbEl._lvl = 0;
        } catch (e1) { fbEl._gain = null; }
      }
      if (!fbEl._gain) { fbEl.volume = 0; fbEl.muted = muted; }
      var pf = fbEl.play();
      if (pf && pf.catch) pf.catch(function () {});
    } catch (e2) { fbEl = null; }
    /* קריינות: כמה אלמנטים משוחררים לשימוש חוזר */
    try {
      for (var i = 0; i < 3; i++) {
        var el = new Audio();
        el.preload = "auto";
        el.setAttribute("playsinline", "");
        el.src = SILENT_WAV;
        var pp = el.play();
        if (pp && pp.catch) pp.catch(function () {});
        narrPool.push(el);
      }
    } catch (e3) {}
    /* קול המכשיר (חלופה לקריינות) */
    try {
      if (global.speechSynthesis && global.SpeechSynthesisUtterance) {
        var u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        global.speechSynthesis.speak(u);
      }
    } catch (e4) {}
  }

  /* אלמנט audio משוחרר לקריינות. null אם לא שוחרר במחווה: ואז הקורא משתמש ב־new Audio כרגיל */
  function narrEl(src) {
    if (!narrPool.length) return null;
    var el = narrPool[narrIdx++ % narrPool.length];
    try {
      el.pause();
      el.onended = null; el.onerror = null;
      el.loop = false;
      el.src = src;
    } catch (e) { return null; }
    return el;
  }

  /* הכניסה: לקרוא סינכרונית מתוך הלחיצה. משחרר שמע ומתחיל את מקהלת הכניסה. לעולם לא זורק. */
  function enter() {
    try { unlockAudio(); } catch (e) {}
    try { startLoading(); } catch (e2) {}
  }

  function status() {
    var st = -9;
    try { st = ytPlayer.getPlayerState(); } catch (e) {}
    return { phase: phase, source: source, muted: muted, ytReady: ytReady, ytFailed: ytFailed, ytState: st,
             unlocked: unlocked, ctx: actx ? actx.state : null,
             fbPlaying: !!(fbEl && !fbEl.paused), fbLevel: fbEl ? (fbEl._lvl == null ? fbEl.volume : fbEl._lvl) : null,
             fbSrc: fbEl ? fbEl.src.split("/").pop() : null, narrPool: narrPool.length };
  }

  function endLoading() {
    pendingLoading = false;
    if (phase !== "loading") {
      if (phase === "idle") hideChromeIfIdle();
      return;
    }
    finishOut(false);
  }

  function play(src) {
    if (!src) return;
    pendingLoading = false;
    function go() {
      clearWatchers();
      var token = bump();
      pauseYt();
      killAudio();
      phase = "file";
      source = "file";
      silenced = false;
      audioEl = new Audio(src);
      audioEl.preload = "auto";
      audioEl.loop = true;
      audioEl.muted = muted;
      audioEl.volume = 0;
      showChrome("");
      if (creditEl) creditEl.hidden = true;
      var p = audioEl.play();
      if (p && typeof p.then === "function") {
        p.catch(function () {
          phase = "idle";
          source = null;
          hideChromeIfIdle();
        });
      }
      fadeAudio(0, muted ? 0 : AUDIO_VOL, FADE_IN_MS, token);
    }
    if (phase === "loading" || phase === "file") finishOut(false, go);
    else go();
  }

  function stop() {
    pendingLoading = false;
    silenced = false;
    if (phase === "idle") {
      hideChromeIfIdle();
      return;
    }
    finishOut(false);
  }

  function silence() {
    pendingLoading = false;
    if (phase === "idle" || phase === "silent") {
      phase = "silent";
      silenced = true;
      return;
    }
    var token = bump();
    silenced = true;
    var after = function () {
      if (token !== gen) return;
      pauseYt();
      if (audioEl) {
        try { audioEl.pause(); } catch (e) {}
      }
      phase = "silent";
    };
    if (source === "yt") {
      var from = YT_VOL;
      try { from = ytPlayer.getVolume(); } catch (e) {}
      fadeYt(from, 0, FADE_OUT_MS, token, after);
    } else {
      var aFrom = audioEl ? getAudioLevel() : AUDIO_VOL;
      fadeAudio(aFrom, 0, FADE_OUT_MS, token, after);
    }
  }


  /* ================================================================
     שכבת מוזיקה לסיורים (נוספה בלילה של 12.11.2026)
     - הטמעות יוטיוב רשמיות בלבד, שני נגנים מוסתרים (A/B) לחיבורים חלקים.
     - הכול מונע מאירועי תחנה (onStation) ומזמן הנגן (getCurrentTime), לא משעון קבוע.
     - כל כניסה, יציאה, שקט וחזרה בהדרגה (עמעום שווה־הספק). אין שום מעבר חד.
     - הנמכה מתחת לקריינות: duck() ל־25%, unduck() חזרה ב־1.5 ש׳.
     הנתונים בין הסמנים הם JSON תקני; סקריפט התצוגה המקדימה קורא אותם מכאן.
     ================================================================ */
  var TOUR_MAP = /*TOUR_MAP_BEGIN*/{
  "oldcity": {
    "credit": "«בשערייך ירושלים» · יהורם גאון (YouTube)",
    "segs": {"main": {"v": "xql0wVmZ-ks", "at": 0.4, "vol": 70, "fadeIn": 4000}},
    "st": [{"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"},
           {"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main", "lv": 0.7}]
  },
  "tamid": {
    "credit": "«ותערב» · לחן: שלמה יהודה רכניץ (YouTube)",
    "segs": {"main": {"v": "Hz1wM-uxnwo", "at": 38, "vol": 70, "fadeIn": 4000}},
    "st": [{"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"},
           {"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"},
           {"seg": "main"}, {"seg": "main", "lv": 0.35}, {"seg": "main", "lv": 1.15}]
  },
  "yk": {
    "credit": "«והכהנים» · ישעיהו גופין; «מראה כהן» · אברהם פריד (YouTube)",
    "segs": {
      "niggun": {"v": "HuO517YcLhs", "at": 0.6, "vol": 65, "fadeIn": 4000},
      "niggun2": {"v": "HuO517YcLhs", "at": 130, "vol": 65, "fadeIn": 6000},
      "mareh": {"v": "SCRxUU5HcNA", "at": 10, "vol": 70, "fadeIn": 4000}
    },
    "st": [{"seg": "niggun"}, {"seg": "niggun"}, {"seg": "niggun"}, {"seg": "niggun"}, {"seg": "niggun"},
           {"seg": "niggun"}, {"seg": "niggun", "endFade": 4500},
           {"seg": null}, {"seg": null},
           {"seg": "niggun2"}, {"seg": "niggun2", "endFade": 5000},
           {"seg": "mareh"}]
  },
  "pilgrim": {
    "credit": "«שיר חדש» · שלומי גרטנר (YouTube)",
    "segs": {
      "city": {"v": "mOzuGXNNlt8", "at": 278.686, "vol": 100, "fadeIn": 4000,
               "loops": [{"at": 310.683, "to": 278.686, "xfade": 4830, "whileBefore": 3}]},
      "mount": {"v": "mOzuGXNNlt8", "at": 0.557, "vol": 50, "fadeIn": 4830,
                "loops": [{"at": 113.778, "to": 59.606, "xfade": 4830}]}
    },
    "st": [{"seg": "city"}, {"seg": "city"}, {"seg": "city"},
           {"seg": "city", "join": {"to": "mount", "xfade": 4830, "minWait": 3,
                                    "cands": [281.147, 295.938, 303.322, 320.978]}},
           {"seg": "mount"}, {"seg": "mount"}, {"seg": "mount"}, {"seg": "mount"}, {"seg": "mount"},
           {"seg": "mount"}, {"seg": "mount"}, {"seg": "mount"}, {"seg": "mount"}]
  },
  "pesach": {
    "credit": "«מה אשיב לה׳» · גלעד פוטולסקי ותזמורת שלהבת (YouTube)",
    "segs": {"main": {"v": "i2GN1HiQgwg", "at": 138, "vol": 70, "fadeIn": 4000}},
    "st": [{"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"},
           {"seg": "main", "lv": 1.15}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"}]
  },
  "sukkot": {
    "credit": "«מחרוזת ושמחת» · מקהלת מלכות (YouTube)",
    "segs": {"main": {"v": "5TCV0Wc2rvo", "at": 30, "vol": 70, "fadeIn": 4000}},
    "st": [{"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main"},
           {"seg": "main", "endFade": 6000}, {"seg": null}]
  },
  "hakhel": {
    "credit": "«הקהל» · שמחה פרידמן ועמי כהן (YouTube)",
    "segs": {
      "main": {"v": "Yd4Onv0BAtg", "at": 20, "vol": 70, "fadeIn": 4000},
      "back": {"v": "Yd4Onv0BAtg", "at": 45, "vol": 70, "fadeIn": 6000}
    },
    "st": [{"seg": "main"}, {"seg": "main"}, {"seg": "main"}, {"seg": "main", "endFade": 6000},
           {"seg": null}, {"seg": null}, {"seg": "back"}]
  }
}/*TOUR_MAP_END*/;

  var DUCK_LEVEL = 0.25, DUCK_IN_MS = 700, DUCK_OUT_MS = 1500;
  var CHANGE_OUT_MS = 4000;   /* שיר אחר: הראשון דועך עד הסוף, ורק אז השני עולה */
  var SILENCE_MS = 6000;      /* מעבר לשקט */
  var END_MS = 6000;          /* סוף סיור, גם בסגירה באמצע (כלל של שמואל) */
  var LEVEL_MS = 2500;        /* שינוי עוצמה בין תחנות */
  var PREROLL_LEAD = 10;      /* כמה שניות לפני לולאה לטעון את הנגן השני */
  var TICK = 80;

  var TR = { id: null, def: null, idx: -1, cur: null, duck: 1, duckTw: null,
             timer: 0, joinArm: null, slots: [], ready: false, wantStart: false, paused: false };

  function tnow() { return (global.performance && performance.now) ? performance.now() : Date.now(); }
  function mkTw(from, to, ms, done) { return { from: from, to: to, t0: tnow(), ms: Math.max(1, ms), done: done || null }; }
  /* עמעום שווה־הספק: עלייה = sin, ירידה = cos */
  function twAt(tw) {
    var k = Math.min(1, (tnow() - tw.t0) / tw.ms);
    var sh = tw.to >= tw.from ? Math.sin(k * Math.PI / 2) : 1 - Math.cos(k * Math.PI / 2);
    return { v: tw.from + (tw.to - tw.from) * sh, end: k >= 1 };
  }

  function makeSlot(n) {
    var s = { n: n, p: null, ok: false, vid: null, seg: null, segKey: null, gain: 0, tw: null, base: 0,
              lv: 1, lvTw: null, playing: false, hold: false, lastVol: -1, preKey: null };
    ensureYtWrap();
    var host = document.createElement("div");
    host.id = "temple-tour-yt-" + n;
    ytWrap.appendChild(host);
    try {
      s.p = new YT.Player(host.id, {
        width: 1, height: 1,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, disablekb: 1, fs: 0,
                      iv_load_policy: 3, playsinline: 1, autoplay: 0, origin: location.origin },
        events: {
          onReady: function () { s.ok = true; try { s.p.setVolume(0); } catch (e) {} tourReadyCheck(); },
          onError: function () { s.ok = false; s.playing = false; },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING && s.hold) { s.hold = false; try { s.p.pauseVideo(); } catch (er) {} }
          }
        }
      });
    } catch (err) { s.p = null; }
    return s;
  }

  function prepareTours() {
    if (TR.slots.length || cfg.forceFallback) return;
    loadYouTubeApi().then(function () {
      if (TR.slots.length) return;
      TR.slots = [makeSlot(0), makeSlot(1)];
    }).catch(function () {});
  }

  function tourReadyCheck() {
    TR.ready = TR.slots.length === 2 && TR.slots[0].ok && TR.slots[1].ok;
    if (TR.ready && TR.wantStart && TR.def) { TR.wantStart = false; applyStation(TR.idx, true); }
  }

  function slotTime(s) { try { var t = s.p.getCurrentTime(); return isFinite(t) ? t : 0; } catch (e) { return 0; } }
  function slotLive(s) { try { return s.p.getPlayerState() === 1; } catch (e) { return false; } }

  function slotCue(s, seg, key, at, hold) {
    s.hold = !!hold;
    s.base = seg.vol; s.seg = seg; s.segKey = key;
    try {
      s.p.setVolume(0); s.lastVol = 0;
      if (s.vid !== seg.v) { s.p.loadVideoById({ videoId: seg.v, startSeconds: at }); s.vid = seg.v; }
      else { s.p.seekTo(at, true); if (!hold) s.p.playVideo(); else s.p.pauseVideo(); }
    } catch (e) {}
  }

  function freeSlot(except) {
    var i, s;
    for (i = 0; i < TR.slots.length; i++) { s = TR.slots[i]; if (s !== except && !s.playing) return s; }
    for (i = 0; i < TR.slots.length; i++) { s = TR.slots[i]; if (s !== except && s.tw && s.tw.to === 0) return s; }
    return null;
  }

  function slotStop(s) {
    s.playing = false; s.tw = null; s.gain = 0; s.preKey = null; s.waitPlay = false; s.onStart = null;
    try { s.p.setVolume(0); s.p.pauseVideo(); } catch (e) {}
    s.lastVol = 0;
  }

  function slotFadeOut(s, ms, then) {
    if (!s || !s.playing) { if (then) then(); return; }
    s.waitPlay = false; s.onStart = null;
    s.tw = mkTw(s.gain, 0, ms, function () { slotStop(s); if (then) then(); });
  }

  function startSeg(key, fadeMs, atOverride, slot) {
    var seg = TR.def.segs[key];
    if (!seg) return null;
    var s = slot || null, at = atOverride != null ? atOverride : seg.at;
    if (!s) { /* נגן שכבר הוכן מראש לאותו קטע */
      for (var i = 0; i < TR.slots.length; i++) if (!TR.slots[i].playing && TR.slots[i].preKey === key + "@" + at) s = TR.slots[i];
    }
    if (!s) s = freeSlot(TR.cur);
    if (!s) return null;
    if (s.playing) slotStop(s);
    if (s.preKey === key + "@" + at) {
      s.hold = false; s.base = seg.vol; s.seg = seg; s.segKey = key;
      try { s.p.seekTo(at, true); s.p.playVideo(); } catch (e) {}
    } else {
      slotCue(s, seg, key, at, false);
    }
    s.preKey = null; s.playing = true; s.gain = 0; s.loopArm = null; s.tw = null;
    /* העמעום מתחיל רק כשהנגן באמת מנגן (PLAYING), כדי שהכניסה לא תתקצר בזמן טעינה */
    s.waitPlay = true; s.waitT0 = tnow(); s.onStart = null;
    s.pendFade = fadeMs != null ? fadeMs : (seg.fadeIn || 4000);
    return s;
  }

  function preroll(key, at) {
    var seg = TR.def && TR.def.segs[key];
    if (!seg) return;
    at = at != null ? at : seg.at;
    var tag = key + "@" + at, i;
    for (i = 0; i < TR.slots.length; i++) if (TR.slots[i].preKey === tag) return;
    var s = freeSlot(TR.cur);
    if (!s || s.playing) return;
    slotCue(s, seg, key, at, true);
    s.preKey = tag;
  }

  function stLevel(i) { var st = TR.def.st[i]; return st && st.lv != null ? st.lv : 1; }

  /* מצב המוזיקה לתחנה i. jump=true כשהגיעו לתחנה בדילוג או בהתחלה */
  function applyStation(i, jump) {
    if (!TR.def || !TR.ready) { TR.wantStart = true; return; }
    var st = TR.def.st[i] || { seg: null }, want = st.seg, cur = TR.cur;
    TR.joinArm = null;
    var curKey = cur && cur.playing && !(cur.tw && cur.tw.to === 0) ? cur.segKey : null;
    if (want && want === curKey) {
      cur.lvTw = mkTw(cur.lv, stLevel(i), LEVEL_MS);
    } else if (!want) {
      if (cur) slotFadeOut(cur, SILENCE_MS);
      TR.cur = null;
    } else {
      var go = function () {
        if (!TR.def || TR.idx !== i) return;
        var s = startSeg(want);
        if (s) { s.lv = stLevel(i); s.lvTw = null; TR.cur = s; }
      };
      if (curKey) { var old = cur; TR.cur = null; slotFadeOut(old, CHANGE_OUT_MS, go); }
      else {
        /* אם שיר קודם עוד דועך (למשל אחרי endFade), מחכים שייגמר: אף פעם לא שני שירים יחד */
        var fading = null;
        TR.slots.forEach(function (x) { if (x.playing && x.tw && x.tw.to === 0) fading = x; });
        if (fading) { var d0 = fading.tw.done; fading.tw.done = function () { if (d0) d0(); go(); }; }
        else go();
      }
    }
    if (st.join) TR.joinArm = { j: st.join, t0: tnow(), decided: null };
    /* הכנה מראש: הקטע של התחנה הבאה, או יעד החיבור */
    var nx = TR.def.st[i + 1];
    if (st.join) preroll(st.join.to);
    else if (nx && nx.seg && nx.seg !== want) preroll(nx.seg);
  }

  function doJoin(fromSlot, toKey, xfade) {
    var s = startSeg(toKey, xfade, null, null);
    if (!s) return;
    s.lv = 1; TR.cur = s;
    /* עמעום־הצלב מתחיל ברגע שהנגן החדש מנגן בפועל */
    s.onStart = function () { slotFadeOut(fromSlot, xfade); };
  }

  function tourTick() {
    if (!TR.def) return;
    var i, s, r;
    if (TR.duckTw) { r = twAt(TR.duckTw); TR.duck = r.v; if (r.end) TR.duckTw = null; }
    /* חיבור (עולה רגל): מחכים לנקודה מתואמת בנגן הנוכחי */
    if (TR.joinArm && TR.cur && TR.cur.playing && !TR.cur.waitPlay && slotLive(TR.cur) && !TR.paused) {
      var ja = TR.joinArm, t = slotTime(TR.cur);
      if (ja.decided == null && tnow() - ja.t0 >= (ja.j.minWait || 0) * 1000) {
        for (i = 0; i < ja.j.cands.length; i++) if (ja.j.cands[i] >= t + 0.3) { ja.decided = ja.j.cands[i]; break; }
        if (ja.decided == null) ja.decided = t; /* אין נקודה קדימה: מחברים מיד */
      }
      if (ja.decided != null && t >= ja.decided - 0.04) { TR.joinArm = null; doJoin(TR.cur, ja.j.to, ja.j.xfade); }
    }
    for (i = 0; i < TR.slots.length; i++) {
      s = TR.slots[i];
      if (s.waitPlay && s.playing) {
        var ps = -9; try { ps = s.p.getPlayerState(); } catch (e) {}
        if (ps === 1 || tnow() - s.waitT0 > 3000) {
          s.waitPlay = false; s.tw = mkTw(0, 1, s.pendFade);
          if (s.onStart) { var os = s.onStart; s.onStart = null; os(); }
        }
      }
      if (s.tw) { r = twAt(s.tw); s.gain = r.v; if (r.end) { var d = s.tw.done; s.tw = null; if (d) d(); } }
      if (s.lvTw) { r = twAt(s.lvTw); s.lv = r.v; if (r.end) s.lvTw = null; }
      /* לולאות מיושרות לתיבה, בתוך אותו שיר */
      if (s === TR.cur && s.playing && !s.waitPlay && s.seg && s.seg.loops && !TR.paused && slotLive(s)) {
        var tt = slotTime(s);
        for (var L = 0; L < s.seg.loops.length; L++) {
          var lp = s.seg.loops[L];
          if (lp.whileBefore != null && TR.idx >= lp.whileBefore) continue;
          if (tt >= lp.at - PREROLL_LEAD && tt < lp.at) preroll(s.segKey, lp.to);
          if (tt >= lp.at - 0.04 && tt < lp.at + 1.5) {
            var ns = startSeg(s.segKey, lp.xfade, lp.to, null);
            if (ns) { ns.lv = s.lv; TR.cur = ns; (function (o, ms) { ns.onStart = function () { slotFadeOut(o, ms); }; })(s, lp.xfade); }
            break;
          }
        }
      }
      if (!s.ok || !s.p) continue;
      var vol = (muted || !s.playing) ? 0 : Math.round(Math.max(0, Math.min(100, s.base * s.lv * s.gain * TR.duck)));
      if (vol !== s.lastVol) { try { s.p.setVolume(vol); } catch (e) {} s.lastVol = vol; }
    }
  }

  function startTour(id) {
    var def = TOUR_MAP[id];
    endTourNow();
    if (!def) return;
    TR.id = id; TR.def = def; TR.idx = 0; TR.cur = null; TR.duck = 1; TR.duckTw = null; TR.paused = false;
    ensureUi(); showChrome(def.credit);
    if (!TR.slots.length) prepareTours();
    /* מחוות משתמש: פותחים את שני הנגנים (חשוב ב־iOS) */
    for (var i = 0; i < TR.slots.length; i++) { var s = TR.slots[i]; if (s.ok && !s.playing && s.vid) { s.hold = true; try { s.p.setVolume(0); s.p.playVideo(); } catch (e) {} } }
    clearInterval(TR.timer); TR.timer = setInterval(tourTick, TICK);
    applyStation(0, true);
  }

  function onStation(id, idx) {
    if (!TR.def || (id && id !== TR.id)) return;
    var prev = TR.idx; TR.idx = idx;
    applyStation(idx, Math.abs(idx - prev) !== 1);
  }

  function duck() {
    if (!TR.def) return;
    TR.duckTw = mkTw(TR.duck, DUCK_LEVEL, DUCK_IN_MS);
  }

  function unduck() {
    if (!TR.def) return;
    var st = TR.def.st[TR.idx];
    if (st && st.endFade && TR.cur) {
      /* דעיכה לשקט מהמפלס המונמך עצמו, בלי לעלות קודם */
      var c = TR.cur; TR.cur = null;
      slotFadeOut(c, st.endFade, function () { if (TR.def) { TR.duckTw = null; TR.duck = 1; } });
      return;
    }
    TR.duckTw = mkTw(TR.duck, 1, DUCK_OUT_MS);
  }

  function pauseTour() {
    if (!TR.def || TR.paused) return;
    TR.paused = true;
    TR.slots.forEach(function (s) { if (s.playing) s.tw = mkTw(s.gain, 0, 1500, function () { try { s.p.pauseVideo(); } catch (e) {} }); });
  }

  function resumeTour() {
    if (!TR.def || !TR.paused) return;
    TR.paused = false;
    if (TR.cur && TR.cur.playing) { try { TR.cur.p.playVideo(); } catch (e) {} TR.cur.tw = mkTw(0, 1, 2500); }
  }

  function endTourNow() {
    clearInterval(TR.timer); TR.timer = 0;
    TR.slots.forEach(function (s) { if (s.playing || s.preKey) slotStop(s); });
    TR.def = null; TR.id = null; TR.cur = null; TR.joinArm = null; TR.wantStart = false;
  }

  /* סוף סיור או סגירה: תמיד דעיכה של 6 ש׳ */
  function endTour(ms) {
    if (!TR.def) return;
    ms = ms || END_MS;
    var playing = TR.slots.filter(function (s) { return s.playing; });
    TR.def = null; TR.id = null; TR.cur = null; TR.joinArm = null; TR.wantStart = false;
    TR.slots.forEach(function (s) { if (!s.playing && s.preKey) slotStop(s); });
    var left = playing.length;
    var fin = function () { left -= 1; if (left <= 0) { clearInterval(TR.timer); TR.timer = 0; hideChromeIfIdle(); } };
    /* ממשיכים לתקתק עד סוף הדעיכה */
    var keep = TR.timer;
    if (!left) { clearInterval(keep); TR.timer = 0; hideChromeIfIdle(); return; }
    clearInterval(TR.timer);
    TR.timer = setInterval(function () {
      TR.slots.forEach(function (s) {
        if (s.tw) { var r = twAt(s.tw); s.gain = r.v; if (r.end) { var d = s.tw.done; s.tw = null; if (d) d(); } }
        if (s.ok) { var v = (muted || !s.playing) ? 0 : Math.round(s.base * s.lv * s.gain * TR.duck); if (v !== s.lastVol) { try { s.p.setVolume(v); } catch (e) {} s.lastVol = v; } }
      });
    }, TICK);
    playing.forEach(function (s) { slotFadeOut(s, ms, fin); });
  }

  function tourActive() { return !!TR.def; }

  global.TempleMusic = {
    init: init,
    startLoading: startLoading,
    enter: enter,
    unlockAudio: unlockAudio,
    narrEl: narrEl,
    status: status,
    endLoading: endLoading,
    play: play,
    stop: stop,
    silence: silence,
    setMuted: setMuted,
    isMuted: function () { return muted; },
    toggleMute: toggleMute,
    VIDEO_ID: VIDEO_ID,
    START: START,
    END: END,
    /* סיורים */
    TOUR_MAP: TOUR_MAP,
    prepareTours: prepareTours,
    startTour: startTour,
    onStation: onStation,
    duck: duck,
    unduck: unduck,
    pauseTour: pauseTour,
    resumeTour: resumeTour,
    endTour: endTour,
    tourActive: tourActive,
    /* לבדיקות בלבד (test.html) */
    debug: function () {
      return { id: TR.id, idx: TR.idx, duck: +TR.duck.toFixed(2), ready: TR.ready, paused: TR.paused,
               cur: TR.cur ? TR.cur.n : null,
               slots: TR.slots.map(function (s) {
                 var st = -9; try { st = s.p.getPlayerState(); } catch (e) {}
                 return { n: s.n, ok: s.ok, vid: s.vid, seg: s.segKey, playing: s.playing, gain: +s.gain.toFixed(2),
                          lv: +s.lv.toFixed(2), vol: s.lastVol, t: s.ok ? +slotTime(s).toFixed(2) : null, state: st, pre: s.preKey };
               }) };
    }
  };
})(typeof window !== "undefined" ? window : this);
