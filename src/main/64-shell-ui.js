// ==== v61: Google Maps / Earth style shell — search pill, icon rail, place panel, chips that light up the model, share link, intro flight ====
await __Y(98);var UIPT=null;
(function(){
const $=id=>document.getElementById(id);
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
// line icons (one stroke family)
const P={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 tour:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14"/><path d="M12 17.5v.01"/>',
 gate:'<path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7M3 21h18"/>',room:'<path d="M3 10 12 4l9 6"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',fire:'<path d="M12 21c-4 0-6-2.7-6-6 0-4 4-6 4-10 2 1 5 4 5 7 1-1 1-2 1-3 2 2 2 4 2 6 0 3.3-2 6-6 6z"/>',
 vessel:'<path d="M12 3v18M6 21h12"/><path d="M5 6v3a7 7 0 0 0 14 0V6"/><path d="M8.5 6v3a3.5 3.5 0 0 0 7 0V6"/>',house:'<path d="M4 21V9l8-5 8 5v12z"/><path d="M9 21v-6h6v6"/>',city:'<path d="M3 21V8l5-3 5 3v13M13 21V11h8v10M3 21h18"/>',
 fly:'<path d="M2 16 22 8l-6 12-3-6z"/>',door:'<path d="M5 21V4h11v17M16 7l3 1v12l-3 1"/><path d="M12 12v.01"/>',near:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',size:'<path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',joy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',diamond:'<path d="m12 3 8 9-8 9-8-9z"/>',walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2-6 3 3v3M10 12l2-4 4 3 2 1M12 8l-3 1-2 3"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>'};
const I=(k,c)=>'<svg class="ico'+(c?" "+c:"")+'" viewBox="0 0 24 24" aria-hidden="true">'+(P[k]||P.diamond)+'</svg>';
// --- Hebrew-forgiving search ---
const norm=s=>String(s||"").replace(/<[^>]+>/g," ").replace(/[֑-ׇ]/g,"").replace(/["'״׳`’]/g,"").toLowerCase();
const words=s=>norm(s).split(/[^א-תa-z0-9]+/).filter(Boolean).map(w=>w.length>2&&w[0]==="ה"?w.slice(1):w);
/* 125.0 (ביקורת 23, 24): חיפוש שסולח לשגיאות כתיב. משווים צורה "רכה": אותיות סופיות, כתיב חסר (בלי ו/י), ט/ת, ח/כ, ס/ש, א/ה בסוף, ומרחק של אות אחת במילים ארוכות */
const fz=w=>w.replace(/[ךםןףץ]/g,c=>({"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"})[c]).replace(/[וי]/g,"").replace(/ט/g,"ת").replace(/ח/g,"כ").replace(/ס/g,"ש").replace(/ק/g,"כ").replace(/א$/,"ה");
const lev1=(a,b)=>{if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;return a.slice(i+1)===b.slice(i+1)||a.slice(i)===b.slice(i+1)||a.slice(i+1)===b.slice(i)};
const CATS=[["שערים","gate",/שער|פתח/],["לשכות","room",/לשכ|תאים|בית המוקד|בית החליפות|בית הטבילה|בית אבטינס/],["מזבח","fire",/מזבח|כבש|סובב|יסוד|קרנ|מערכה|שיתין/],["כלים","vessel",/מנור|שולחן|כיור|ארון|מכונ|כלי|חצוצר|מחת|ציץ|לחם הפנים|קטורת|פרוכת|אבן השתי|דוכן/],["הבית","house",/היכל|אולם|קודש|הבית|צלע|עליי/]];
const catOf=(n,city)=>{if(city)return["מקומות בעיר","city"];for(const c of CATS)if(c[2].test(n))return[c[0],c[1]];return["חלקי המקדש","diamond"]};
const isCity=L=>!L.c&&!cLabels.includes(L);
// area of a place, for the Places drawer (compound units: u east, v south; house 100-200, inner court 200-300)
function areaOf(L){if(isCity(L))return"העיר";const n=L.txt||"";if(/שער/.test(n))return"שערים";if(!COMP)return"עזרה חיצונה";const u=(L.v.x-COMP.X0)/A,v=(COMP.N0+L.v.z)/A;
  if(/היכל|אולם|קודש|הבית|תאים|צלע|כרוב|פרוכת|מנורה|שולחן|מזבח הזהב|אבן השתי/.test(n)&&u<206)return"הבית";if(u>=95&&u<=306&&v>=165&&v<=335)return"עזרה פנימית";return"עזרה חיצונה"}
function buildIndex(){const out=[],seen=new Set();
  labels.forEach(L=>{if(!L.txt||!L.el||!L.el.isConnected)return;const k=norm(L.txt);if(seen.has(k))return;seen.add(k);const c=catOf(L.txt+" "+(L.info&&L.info.n||""),isCity(L));out.push({n:L.txt,sub:L.info&&L.info.r||"",cat:c[0],ic:c[1],L,w:words(L.txt+" "+(L.info?L.info.n:"")),w2:words(L.info?L.info.t:""),go:()=>pickLabel(L)})});
  const shown=o=>{for(let q=o;q;q=q.parent){if(!q.visible&&!q.userData.hid)return false}return true};
  cPick.concat(PICK).forEach(o=>{const d=o.userData;if(!d||!d.n||d.train||o.isInstancedMesh||o.__lodFar||!shown(o))return;const k=norm(d.n);if(seen.has(k))return;seen.add(k);const c=catOf(d.n,PICK.includes(o));out.push({n:d.n,sub:d.r||"",cat:c[0],ic:c[1],w:words(d.n),w2:words(d.t),go:()=>pickObj(o)})});
  Object.keys(STORIES).forEach(key=>{const S=STORIES[key];out.push({n:"סיור: "+S.title,sub:S.steps.length+" תחנות",cat:"סיורים",ic:"tour",w:words(S.title+" סיור"),w2:words(S.steps.map(s=>s.title).join(" ")),go:()=>startTour(key)})});
  /* 125.0 (ביקורת 24): "היכל" ו"אולם" מובילים לחלל עצמו, לפני שער ההיכל ואולם השער */
  out.push({n:"ההיכל (מבפנים)",sub:"יחזקאל מא, א–ב",cat:"הבית",ic:"house",b:3,w:["יכל","היכל"],w2:words("מנורה שולחן מזבח הזהב"),go:()=>{pushView();const b=$("vIn");if(b)b.click()}});
  out.push({n:"אולם הבית",sub:"יחזקאל מ, מח–מט",cat:"הבית",ic:"house",b:3,w:["אולם","אלם","ולם"],w2:words("עמודים פתח"),go:()=>{if(STORY)STORY.stop();if(WALK)stopWalk();pushView();const pt=AP(228,250,10,200,250,22)();routeTo(pt[0],pt[1],2600)}});
  Object.keys(HELP).forEach(k=>{const d=HELP[k];if(!d||!d.n)return;out.push({n:d.n,sub:"הסבר",cat:"הסברים",ic:"help",w:words(d.n),w2:words(d.t),go:()=>{UIPT=null;showInfo(d)}})});
  return out}
function score(it,q){if(!q.length)return 1;let s=0;for(const w of q){let best=0;for(const x of it.w){if(x===w)best=Math.max(best,10);else if(x.startsWith(w))best=Math.max(best,7);else if(x.includes(w))best=Math.max(best,4)}
    if(!best&&w.length>=3){const fw=fz(w);for(const x of it.w){const fx=fz(x);if(fx===fw)best=Math.max(best,8);else if(fw.length>=3&&fx.startsWith(fw))best=Math.max(best,5);else if(Math.max(w.length,x.length)>=4&&(lev1(w,x)||(fw.length>=3&&lev1(fw,fx))))best=Math.max(best,3)}}
    if(!best)for(const x of it.w2){if(x.startsWith(w)){best=1.5;break}}if(!best)return 0;s+=best}return s+(it.b||0)}
// --- search pill ---
const sbox=mk("div","ui");sbox.id="sbox";sbox.innerHTML='<div class="row1"><button type="button" class="ib2 go" id="sgo" aria-label="חיפוש">'+I("search")+'</button><input id="sq" type="search" autocomplete="off" placeholder="חיפוש במקדש ובעיר" aria-label="חיפוש במודל"><button type="button" class="ib2" id="sx" aria-label="ניקוי" hidden>'+I("x")+'</button></div><div id="chips" role="group" aria-label="סינון מהיר"></div><div id="sres" hidden role="listbox"></div>';
stage.appendChild(sbox);
const sq=$("sq"),sres=$("sres"),chipBox=$("chips");let CHIP=null,IDX=null,SEL=-1,ROWS=[];
CATS.forEach(c=>{const b=mk("button",null,I(c[1])+esc(c[0]));b.type="button";b.dataset.c=c[0];b.setAttribute("aria-pressed","false");b.onclick=()=>chip(CHIP===c[0]?null:c[0]);chipBox.appendChild(b)});
function chip(c){CHIP=c;chipBox.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.c===CHIP?"true":"false"));IDX=buildIndex();
  labels.forEach(L=>{if(L.force){L.force=false;L.el.classList.remove("hl")}});
  if(CHIP)IDX.filter(it=>it.cat===CHIP&&it.L).forEach(it=>{it.L.force=true;it.L.el.classList.add("hl")});run()}
function run(){const q=words(sq.value);$("sx").hidden=!sq.value&&!CHIP;if(!q.length&&!CHIP){sres.hidden=true;return}IDX=IDX||buildIndex();
  let r=IDX.map(it=>[it,score(it,q)]).filter(a=>a[1]>0&&(!CHIP||a[0].cat===CHIP));r.sort((a,b)=>b[1]-a[1]||a[0].n.length-b[0].n.length);r=r.slice(0,40);
  sres.innerHTML="";ROWS=[];SEL=-1;if(!r.length){sres.innerHTML='<div class="none">לא נמצא. נסו מילה אחרת, למשל "שער", "לשכה" או "מזבח".</div>';sres.hidden=false;return}
  const groups={};r.forEach(a=>{(groups[a[0].cat]=groups[a[0].cat]||[]).push(a[0])});
  Object.keys(groups).forEach(g=>{sres.appendChild(mk("h4",null,esc(g)));groups[g].forEach(it=>{const b=mk("button",null,'<span class="ri">'+I(it.ic)+'</span><span class="rt"><b>'+esc(it.n)+'</b>'+(it.sub?'<small>'+esc(it.sub)+'</small>':'')+'</span>');b.type="button";b.setAttribute("role","option");b.onclick=()=>choose(it);sres.appendChild(b);ROWS.push([b,it])})});sres.hidden=false}
function choose(it){sres.hidden=true;sq.blur();closeDr();try{it.go()}catch(e){console.warn(e)}}
sq.addEventListener("input",()=>{IDX=null;run()});sq.addEventListener("focus",()=>{IDX=null;if(sq.value||CHIP)run()});
sq.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!ROWS.length)return;SEL=(SEL+(e.key==="ArrowDown"?1:-1)+ROWS.length)%ROWS.length;ROWS.forEach((r,i)=>r[0].classList.toggle("on",i===SEL));ROWS[SEL][0].scrollIntoView({block:"nearest"})}else if(e.key==="Enter"){if(ROWS.length)choose(ROWS[Math.max(0,SEL)][1])}else if(e.key==="Escape"){sq.value="";run();sq.blur()}e.stopPropagation()});
sq.addEventListener("keyup",e=>e.stopPropagation());
$("sgo").onclick=()=>{if(ROWS.length)choose(ROWS[0][1]);else sq.focus()};
$("sx").onclick=()=>{sq.value="";chip(null);sres.hidden=true;sq.focus()};
document.addEventListener("pointerdown",e=>{if(!sbox.contains(e.target))sres.hidden=true},true);
window.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==sq&&!/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName)){e.preventDefault();sq.focus()}});
// --- going to things ---
function hl(el){document.querySelectorAll(".lbl.hl").forEach(x=>{if(!labels.find(L=>L.el===x&&L.force))x.classList.remove("hl")});if(!el)return;el.classList.add("hl");clearTimeout(hl._t);hl._t=setTimeout(()=>{if(!labels.find(L=>L.el===el&&L.force))el.classList.remove("hl")},8000)}
function pickLabel(L){goLabel(L);hl(L.el);L.pin=performance.now()}
const _goLabel=goLabel;goLabel=function(L){UIPT=L.v.clone();UIPT._L=L;_goLabel(L);UIPT=null};
function flyToPoint(c,r){if(STORY)STORY.stop();if(WALK)stopWalk();if(DRONE){droneFly(c.clone());return}
  const [p,t]=frameView(c,Math.min(r,220),16);
  document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  if(reduce){camAt(p,t);return}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:1600,arc:true}}
function objCenter(o){const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return null;const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());return[c,Math.max(3,0.5*Math.hypot(s.x,s.y*0.7,s.z))]}
function pickObj(o){const cr=objCenter(o);if(!cr)return;UIPT=cr[0].clone();showInfo(o.userData);if(o.userData.cam&&!DRONE){try{if(STORY)STORY.stop();if(WALK)stopWalk();const [p,t]=o.userData.cam();tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:reduce?1:1600,arc:true};return}catch(e){}}flyToPoint(cr[0],cr[1])}
  /* 125.2 (ביקורת, אמת מידה מוזיאלית: "איך חוזרים למבט הקודם"): כל טיסה אל מקום שומרת את המבט שלפניה, וכפתור החזרה מחזיר אליו */
let pushView=()=>{}; /* 125.9 (בדיקה חוזרת, ד): גם יעדי החיפוש "היכל" ו"אולם" שומרים את המבט הקודם */
{const hud=$("hud");if(hud&&!$("backB")){const bb=document.createElement("button");bb.type="button";bb.className="hb";bb.id="backB";bb.style.display="none";bb.setAttribute("aria-label","חזרה למבט הקודם");bb.title="חזרה למבט הקודם";
    bb.innerHTML='<svg class="ico" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';
    const VS=[];let lastP=0;const push=()=>{try{if(STORY||WALK||DRONE)return;const n=performance.now();if(n-lastP<400)return;lastP=n;VS.push([camera.position.clone(),controls.target.clone()]);if(VS.length>10)VS.shift();bb.style.display=""}catch(e){}};
    const wrap=f=>function(){push();return f.apply(this,arguments)};pickLabel=wrap(pickLabel);pickObj=wrap(pickObj);flyToPoint=wrap(flyToPoint);pushView=push;
    bb.onclick=()=>{const v=VS.pop();bb.style.display=VS.length?"":"none";if(!v)return;try{if(STORY)STORY.stop();if(WALK)stopWalk();closeInfo()}catch(e){}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:v[0],t1:v[1],start:performance.now(),dur:reduce?1:1400,arc:true};lastP=performance.now()};
    const hm=$("homeB");if(hm&&hm.nextSibling)hud.insertBefore(bb,hm.nextSibling);else hud.appendChild(bb)}}
function startTour(key){closeInfo();closeDr();if(STORY)STORY.stop();if(WALK)stopWalk();try{stopDrone()}catch(e){}STORY_API.start(key)}
// --- icon rail + drawers ---
const rail=mk("nav","gl ui dim");rail.id="rail";rail.setAttribute("aria-label","תפריט");stage.appendChild(rail);
const DR={};
[["tours","tour","סיורים"],["places","pin","מקומות"],["method","ruler","שיטה"],["view","layers","תצוגה"],["help","help","עזרה"]].forEach(a=>{
  const b=mk("button",null,I(a[1]));b.type="button";b.dataset.tip=a[2];b.setAttribute("aria-pressed","false");b.setAttribute("aria-label",a[2]);b.onclick=()=>toggleDr(a[0]);rail.appendChild(b);
  const d=mk("section","dr gl ui",'<div class="grab"></div><button type="button" class="x" aria-label="סגירה">'+I("x")+'</button><h2>'+a[2]+'</h2>');d.id="dr-"+a[0];d.setAttribute("aria-label",a[2]);d.querySelector(".x").onclick=closeDr;stage.appendChild(d);DR[a[0]]={b,d}});
function drMore(d){d.classList.toggle("more",d.classList.contains("open")&&d.scrollHeight-d.scrollTop-d.clientHeight>12)}
Object.values(DR).forEach(x=>{x.d.addEventListener("scroll",()=>drMore(x.d),{passive:true});window.addEventListener("resize",()=>drMore(x.d))});
function closeDr(refocus){let last=null;document.body.classList.remove("drawer");Object.values(DR).forEach(x=>{if(x.d.classList.contains("open"))last=x.b;x.d.classList.remove("open","full","more");x.b.setAttribute("aria-pressed","false")});if(refocus===true&&last)try{last.focus()}catch(e){}return !!last}
// v108 card 16: one closing behaviour for every drawer: ✕, Escape, swipe down, the same rail button, or a tap (not a drag) on the 3D view
{let t0=null;stage.addEventListener("pointerdown",e=>{t0=(e.target&&e.target.tagName==="CANVAS"&&document.body.classList.contains("drawer"))?[e.clientX,e.clientY]:null},true);
  stage.addEventListener("pointerup",e=>{if(!t0)return;const m=Math.hypot(e.clientX-t0[0],e.clientY-t0[1]);t0=null;if(m<6)closeDr()},true)}
function toggleDr(k){const was=DR[k].d.classList.contains("open");closeDr();if(was)return;sres.hidden=true;document.body.classList.add("drawer");if(DR[k].fill)DR[k].fill();DR[k].d.classList.add("open");DR[k].d.scrollTop=0;DR[k].b.setAttribute("aria-pressed","true");requestAnimationFrame(()=>drMore(DR[k].d));setTimeout(()=>drMore(DR[k].d),260);try{DR[k].d.querySelector(".x").focus({preventScroll:true})}catch(e){}if(window.innerWidth<=700)closeInfo()}
// 125.9 (בדיקה חוזרת, ג): Escape מטופל במקום אחד, שכבה אחת בכל לחיצה: מגירה ← כרטיס מידע ← סיור ← יציאה מהליכה/רחפן
window.addEventListener("keydown",e=>{if(e.key!=="Escape"||e.defaultPrevented)return;const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;e.preventDefault();
  if(closeDr(true))return;
  const ic=document.getElementById("infocard");if(ic&&!ic.hidden){closeInfo();return}
  if(STORY){STORY_API.stop();return}
  if(WALK||DRONE||(TRN&&TRN.riding)){const h=document.getElementById("homeB");if(h)h.click()}});
const grabSwipe=(g,el,close)=>{let y0=null;g.addEventListener("pointerdown",e=>{y0=e.clientY;g.setPointerCapture(e.pointerId)});g.addEventListener("pointerup",e=>{if(y0==null)return;const dy=e.clientY-y0;y0=null;if(dy>40){if(el.classList.contains("full"))el.classList.remove("full");else close()}else if(dy<-40)el.classList.add("full");else el.classList.toggle("full")})};
Object.values(DR).forEach(x=>grabSwipe(x.d.querySelector(".grab"),x.d,closeDr));
// tours drawer: cards with picture tile, length and stations
const TICON={oldcity:"🏛",pilgrim:"🚶",yk:"🕯",tamid:"🐑",pesach:"🍷",shavuot:"🌾",sukkot:"🌿",hakhel:"📖"};
DR.tours.fill=()=>{const d=DR.tours.d;d.querySelectorAll(".tcard,.tnote").forEach(x=>x.remove());
  Object.keys(STORIES).forEach(k=>{const S=STORIES[k];const min=S.min||Math.max(2,Math.round(S.steps.reduce((a,s)=>a+(s.cap||"").length,0)/14/60+S.steps.length*0.15));const b=mk("button","tcard",'<span class="tim">'+(TICON[k]||"🧭")+'</span><span><b>'+esc(S.title)+'</b><small>'+S.steps.length+' תחנות · כ־<bdi class="n">'+min+'</bdi> דקות</small></span>');b.type="button";b.onclick=()=>startTour(k);d.appendChild(b)});
  d.appendChild(mk("p","tnote ch",'נגיעה במודל עוצרת את הסיור לרגע, ו"המשך סיור" מחזיר אותו. Esc יוצא מהסיור.'))};
// places drawer: views, then places by area
{const d=DR.places.d;d.appendChild(mk("h3",null,"נקודות מבט"));const vs=$("viewSeg");vs.classList.add("vseg");d.appendChild(vs);const pl=mk("div","plist");pl.id="plist";d.appendChild(pl);
  DR.places.fill=()=>{pl.innerHTML="";const g={};buildIndex().filter(it=>it.L).forEach(it=>{const a=areaOf(it.L);(g[a]=g[a]||[]).push(it)});
    ["הבית","עזרה פנימית","עזרה חיצונה","שערים","העיר"].forEach(c=>{if(!g[c])return;pl.appendChild(mk("h3",null,esc(c)));g[c].sort((a,b)=>a.n.localeCompare(b.n,"he")).forEach(it=>{const b=mk("button",null,I(it.ic)+esc(it.n));b.type="button";b.onclick=()=>{if(window.innerWidth<=700)closeDr();it.go()};pl.appendChild(b)})})}}
// method drawer
{const d=DR.method.d;/* 125.9 (בדיקה חוזרת 2, 3, 13, 34): היקף הפרויקט מוצג למבקר בראש מגירת השיטה, במפורש */
  d.appendChild(mk("div","scope",'<p class="ch" style="margin:0 0 6px"><b>מה מוצג כאן.</b> הבסיס הוא בית המקדש של <b>יחזקאל לפי המלבי״ם</b>. האפשרויות "לפי מידות" ו"הרמב״ם" הן השוואה ללימוד, ולא הדגם העיקרי.</p><p class="ch" style="margin:0 0 6px">המתחם המצויר הוא 500 × 500 אמה. ההיקף העתידי הגדול (יחזקאל מב, טו–כ) לא מצויר.</p><p class="ch" style="margin:0 0 10px">העיר היא <b>ירושלים של היום</b>. מה שעוד לא נבנה (רכבת, רכבל) מסומן "עתידי". 💡 בניינים גבוהים ליד ההר <b>הונמכו</b> כדי שלא יעברו את ההיכל: זה עיבוד, ולא העתק מדויק של קו הרקיע.</p>'));
  const grp=[...document.querySelectorAll(".controls .cgroup")];const m=grp.find(g=>g.querySelector("#facSeg"));if(m)m.querySelectorAll(".ctl").forEach(c=>d.appendChild(c));
  d.appendChild(mk("p","ch",'המודל מראה שיטה אחת בכל פעם. הכפתור i ליד כל אפשרות מסביר את המחלוקת ואת המקור.'));const fit=$("fit");if(fit)d.appendChild(fit)}
// view drawer: hour slider (עלות השחר until the night), day type, festival, background, layers
{const d=DR.view.d;const HMIN=4.5,HMAX=23.5,SPAN=HMAX-HMIN;
  const fmtH=h=>{let H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H+=1;M=0}H=((H%24)+24)%24;return (H<10?"0":"")+H+":"+(M<10?"0":"")+M};
  const bucket=h=>{const sp=sunAt(h);return sp.el<=-7?"night":h<10.5?"morning":h>14.5?"evening":"noon"};
  const BN={morning:"בוקר",noon:"צהריים",evening:"ערב",night:"לילה"};
  const w=mk("div","ctl hourctl",'<div class="cl">שעה ביום: <b id="hsv"></b></div><div class="hslide"><div class="hmarks" id="hmarks" aria-hidden="true"></div><input type="range" id="hslider" min="4.5" max="23.5" step="0.05" aria-label="שעה ביום"></div><div class="hcap" id="hcap" aria-live="polite"></div><div class="hlist" id="hlist"></div>');d.appendChild(w);
  const hsl=$("hslider"),hsv=$("hsv"),hcap=$("hcap"),hmarks=$("hmarks"),hlist=$("hlist");
  let zKey=null,zs=[];
  function marks(){if(zKey===DOY)return;zKey=DOY;zs=zmanim(DOY);const bits=[];
    zs.forEach(z=>{const p=(z.h-HMIN)/SPAN;if(p<0||p>1)return;bits.push('<i style="right:'+(p*100).toFixed(2)+'%" title="'+esc(z.n)+'"></i>')});
    hmarks.innerHTML=bits.join("");
    hlist.innerHTML=zs.map(z=>'<span>'+esc(z.n)+'</span>').join('<span class="dot" aria-hidden="true">·</span>')}
  function readout(h){const z=zmanAt(h,DOY),t=bucket(h);
    hsv.innerHTML='<bdi class="n">'+fmtH(h)+'</bdi> · '+BN[t];
    hcap.textContent=z?z.n:"";
    hsl.setAttribute("aria-valuetext",fmtH(h)+" "+BN[t]+(z?" "+z.n:""));
    hsl.setAttribute("aria-valuenow",String(Math.round(h*20)/20));
    hlist.querySelectorAll("span:not(.dot)").forEach(s=>s.classList.toggle("on",!!(z&&s.textContent===z.n)));
    hmarks.querySelectorAll("i").forEach(el=>el.classList.toggle("on",!!(z&&el.title===z.n)))}
  let raf=0;
  function applyH(h){setHour(h);document.querySelectorAll("#timeSeg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===bucket(h)?"true":"false"))}
  hsl.addEventListener("input",()=>{const h=+hsl.value;marks();readout(h);if(!raf)raf=requestAnimationFrame(()=>{raf=0;applyH(+hsl.value)})});
  hsl.addEventListener("change",()=>{if(raf){cancelAnimationFrame(raf);raf=0}const h=+hsl.value;readout(h);applyH(h)});
  ["tM","tN","tE","tL"].forEach(id=>$(id).addEventListener("click",()=>{if(raf){cancelAnimationFrame(raf);raf=0}const h=TIMES[$(id).dataset.t].h;hsl.value=String(h);marks();readout(h)}));
  hsl.value=String(Math.max(HMIN,Math.min(HMAX,HOUR!=null?HOUR:TIMES[TIME].h)));marks();readout(+hsl.value);
  const days=[["chol","חול"],["shabbat","שבת"],["rosh","ראש חודש"]];
  const dw=mk("div","ctl",'<div class="cl">סוג היום</div><div class="seg tap" id="daySeg" role="group" aria-label="סוג היום">'+days.map(([k,n])=>'<button type="button" data-day="'+k+'" aria-pressed="'+(DAY===k?"true":"false")+'">'+n+'</button>').join("")+'</div>');d.appendChild(dw);
  dw.querySelector("#daySeg").addEventListener("click",e=>{const b=e.target.closest("button[data-day]");if(!b)return;dw.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));setDay(b.dataset.day)});
  // 122.6: "יום רגיל" (FEST.chol) is the default and the way back from a festival
  const fests=[["chol","יום רגיל"],["pesach","פסח"],["shavuot","שבועות"],["sukkot","סוכות"],["yk","יום הכיפורים"]]; /* 125.0 (ביקורת 39): יום הכיפורים פותח את הסיור שלו */
  const curF=Object.keys(FEST).find(k=>FEST[k].doy===DOY)||"";
  const fw=mk("div","ctl",'<div class="cl">חג</div><div class="seg tap" id="festSeg" role="group" aria-label="חג">'+fests.map(([k,n])=>'<button type="button" data-fest="'+k+'" aria-pressed="'+(curF===k?"true":"false")+'">'+n+'</button>').join("")+'</div>');d.appendChild(fw);
  fw.querySelector("#festSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-fest]");if(!b)return;if(b.dataset.fest==="yk"){closeDr();startTour("yk");return}fw.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));setFest(b.dataset.fest);zKey=null;marks();readout(+hsl.value)});

  /* גרסה 118: בורר ימי סוכות (ט״ו עד כ״ב) ומתג יום ולילה. מופיע רק כשנבחר «חג ← סוכות» */
  {const sdays=[[15,"ט״ו"],[16,"ט״ז"],[17,"י״ז"],[18,"י״ח"],[19,"י״ט"],[20,"כ׳"],[21,"כ״א"],[22,"כ״ב"]];
    const sw=mk("div","ctl",'<div class="cl">ימי סוכות (תשרי)</div><div class="seg tap" id="sukSeg" role="group" aria-label="יום בחג הסוכות" style="flex-wrap:wrap">'+sdays.map(([k,n])=>'<button type="button" data-sd="'+k+'" aria-pressed="'+(SUKDAY===k?"true":"false")+'">'+n+'</button>').join("")+'</div><div class="seg tap" id="sukDN" role="group" aria-label="יום או לילה" style="margin-top:6px"><button type="button" data-dn="d">יום</button><button type="button" data-dn="n">לילה</button></div><div class="cl" id="sukNote" style="opacity:.85;margin-top:4px"></div>');d.appendChild(sw);
    const dayCard=k=>{const b={15:13,16:12,17:11,18:10,19:9,20:8,21:7}[k],nm=SUK?SUK.DN[k]:"";
      const t=k===22?"⚖️ שמיני עצרת הוא רגל בפני עצמו. מוסף: פר, איל, שבעה כבשים ושעיר. אין ערבה, אין ניסוך המים ואין שמחת בית השואבה.":"⚖️ מוסף היום: "+b+" פרים, שני אילים, ארבעה עשר כבשים ושעיר. 📜 ערבות זקופות בצדי המזבח, "+(k===21?"ושבע הקפות סביב המזבח בלולבים":"והקפה אחת סביב המזבח בלולבים")+". 📜 בבוקר: ניסוך המים מן השילוח"+(DAY==="shabbat"?" (⚖️ בשבת לא יורדים לשילוח: ממלאים מערב שבת חבית של זהב ומניחים אותה בלשכה, סוכה ד, י)":"")+". 📜 לולב ניטל במקדש כל שבעה"+(DAY==="shabbat"?(k===15?" (📜 יום טוב הראשון שחל בשבת: כל העם מוליכים את לולביהם להר הבית, סוכה ד, ד)":" (⚖️ בשבת שאינה היום הראשון אין נוטלים לולב, סוכה ד, ב. בהדמיה אין לולבים, אין ערבה ואין הקפה, חוץ מהיום השביעי, שבו הערבה דוחה שבת, סוכה ד, ג)"):"")+". 📜 החליל של שמחת בית השואבה אינו דוחה שבת ויום טוב (סוכה ה, א). ניסוך המים נעשה גם בשבת (סוכה ד, ט–י). "+(k===15?"שמחת בית השואבה מתחילה בליל ט״ז.":"בלילה: שמחת בית השואבה, חוץ משבת.")+" 💡 צפיפות הקהל, מספר הסוכות והלפידים ומקום הדיר הם הצעות לתצוגה.";
      showInfo({n:"סוכות · "+nm,r:"סוכה ד, א; ד, ה; ד, ט; ה, א-ו; רמב״ם, הלכות תמידין ומוספין י, ג-ה",t})};
    const sukUI=()=>{const on=DOY===FEST.sukkot.doy;sw.style.display=on?"":"none";sw.querySelectorAll("#sukSeg button").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.sd===SUKDAY?"true":"false"));const ng=TIME==="night";sw.querySelectorAll("#sukDN button").forEach(x=>x.setAttribute("aria-pressed",(x.dataset.dn==="n")===ng?"true":"false"));
      sw.querySelector("#sukNote").textContent=!ng?"":(DAY==="shabbat"?"בשבת אין שמחת בית השואבה.":(SUKDAY===15||SUKDAY===22)?"בלילה הזה אין שמחת בית השואבה. היא בלילות ט״ז עד כ״א.":"שמחת בית השואבה: ליל "+sdays.find(q=>q[0]===SUKDAY)[1]+" בתשרי.")};
    sw.querySelector("#sukSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-sd]");if(!b)return;SUKDAY=+b.dataset.sd;sukUI();dayCard(SUKDAY)});
    sw.querySelector("#sukDN").addEventListener("click",e=>{const b=e.target.closest("button[data-dn]");if(!b)return;$(b.dataset.dn==="n"?"tL":"tM").click();setTimeout(sukUI,0)});
    fw.querySelector("#festSeg").addEventListener("click",()=>setTimeout(sukUI,0));["tM","tN","tE","tL"].forEach(id=>$(id).addEventListener("click",()=>setTimeout(sukUI,0)));hsl.addEventListener("change",()=>setTimeout(sukUI,0));dw.querySelector("#daySeg").addEventListener("click",()=>setTimeout(sukUI,0));sukUI();window.__sukUI=sukUI}
  /* גרסה 121 · משימה 2: בורר ימי הפסח. מופיע רק אחרי שבוחרים «חג ← פסח» */
  {const pdays=[["14am","י״ד בוקר"],["14pm","י״ד אחר הצהריים"],["15n","ליל ט״ו"],["15","ט״ו"],["16n","ליל ט״ז"],["16","ט״ז"],["chm","חול המועד"],["21","כ״א"]],PT={"14am":"tM","14pm":"tE","15n":"tL","15":"tM","16n":"tL","16":"tM","chm":"tN","21":"tM"};
    const pw=mk("div","ctl",'<div class="cl">ימי הפסח (ניסן)</div><div class="seg tap" id="pesSeg" role="group" aria-label="יום בחג הפסח" style="flex-wrap:wrap">'+pdays.map(([k,n])=>'<button type="button" data-pd="'+k+'" aria-pressed="false">'+n+'</button>').join("")+'</div>');d.appendChild(pw);
    const pesUI=()=>{const on=PESPICK&&DOY===FEST.pesach.doy;pw.style.display=on?"":"none";pw.querySelectorAll("#pesSeg button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.pd===PESDAY?"true":"false"))};
    pw.querySelector("#pesSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-pd]");if(!b)return;PESDAY=b.dataset.pd;$(PT[PESDAY]).click();pesUI();if(PES&&PES.dayCard)PES.dayCard(PESDAY)});
    fw.querySelector("#festSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-fest]");if(!b)return;PESPICK=b.dataset.fest==="pesach";pesUI()});pesUI();window.__pesUI=pesUI}

  /* גרסה 122 · משימה 3: בורר ימי שבועות. מופיע רק אחרי שבוחרים «חג ← שבועות» */
  {const sdays=[["eve","ערב שבועות"],["6","ו׳ בסיוון"],["tash","תשלומין, ז׳-י״ב"]],ST={eve:"tN","6":"tM",t:"tM"},tsub=[["t7","ז׳"],["t8","ח׳"],["t9","ט׳"],["t10","י׳"],["t11","י״א"],["t12","י״ב"]];
    const sw2=mk("div","ctl",'<div class="cl">ימי שבועות (סיוון)</div><div class="seg tap" id="shvSeg" role="group" aria-label="יום בחג שבועות" style="flex-wrap:wrap">'+sdays.map(([k,n])=>'<button type="button" data-sd2="'+k+'" aria-pressed="false">'+n+'</button>').join("")+'</div><div class="seg tap" id="shvSub" role="group" aria-label="יום בתשלומין" style="flex-wrap:wrap;margin-top:6px">'+tsub.map(([k,n])=>'<button type="button" data-st="'+k+'" aria-pressed="false">'+n+'</button>').join("")+'</div>');d.appendChild(sw2);
    const shvUI=()=>{const on=SHVPICK&&DOY===FEST.shavuot.doy,ts=SHVDAY[0]==="t";sw2.style.display=on?"":"none";sw2.querySelectorAll("#shvSeg button").forEach(x=>x.setAttribute("aria-pressed",(ts?"tash":SHVDAY)===x.dataset.sd2?"true":"false"));const sb=sw2.querySelector("#shvSub");sb.style.display=ts?"":"none";sb.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.st===SHVDAY?"true":"false"))};
    const pickD=k=>{SHVDAY=k;$(ST[k[0]==="t"?"t":k]).click();shvUI();if(SHV&&SHV.dayCard)SHV.dayCard(SHVDAY)};
    sw2.querySelector("#shvSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-sd2]");if(!b)return;pickD(b.dataset.sd2==="tash"?(SHVDAY[0]==="t"?SHVDAY:"t7"):b.dataset.sd2)});
    sw2.querySelector("#shvSub").addEventListener("click",e=>{const b=e.target.closest("button[data-st]");if(!b)return;pickD(b.dataset.st)});
    fw.querySelector("#festSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-fest]");if(!b)return;SHVPICK=b.dataset.fest==="shavuot";shvUI()});shvUI();window.__shvUI=shvUI}
  const ts=$("timeSeg");if(ts)ts.closest(".ctl").style.display="none";
  const v=[...document.querySelectorAll(".controls .cgroup")].find(g=>g.querySelector("#floorSeg"));if(v)v.querySelectorAll(".ctl").forEach(c=>{if(!c.querySelector("#timeSeg"))d.appendChild(c)})}
// help drawer
{const d=DR.help.d;d.appendChild(mk("div",null,'<h3>איך זזים</h3><ul class="plain"><li>גרירה: הזזת המפה.</li><li>גרירה ימנית, או <kbd>Ctrl</kbd> וגרירה: סיבוב והטיה.</li><li>גלגלת או צביטה: זום אל המקום שמתחת לסמן.</li><li>לחיצה כפולה: טיסה אל הנקודה.</li><li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> או החצים: תנועה. <kbd>Q</kbd>/<kbd>E</kbd>: למטה ולמעלה. <kbd>Shift</kbd>: מהר.</li><li><kbd>/</kbd>: חיפוש. <kbd>Esc</kbd>: סגירה.</li><li>המצפן: לחיצה מפנה צפונה, ולחיצה כפולה מיישרת את המבט.</li></ul><h3>הסימנים</h3><p>📜 מפורש במקור · ⚖️ לפי ההלכה · 💡 הצעה שלנו</p>'));
  /* 125.2 (ביקורת, עומס מסך): השיתוף נשאר בכפתור שבפס הצד ובכרטיס המקום, ולא כאן פעם שלישית */
  const intro=mk("button","tcard",'<span class="tim">'+I("chat")+'</span><span><b>מדריך קצר</b><small>להציג שוב את כרטיסי הפתיחה</small></span>');intro.type="button";intro.onclick=()=>{closeDr();showIntro(0)};d.appendChild(intro);
  const about=[...document.querySelectorAll(".grid .panel")].find(p=>!p.id);if(about)d.appendChild(about);const f=document.querySelector("footer.foot");if(f)d.appendChild(f)}
// --- the place panel (left, like Google Maps) ---
const card=$("infocard");card.classList.add("ui");$("infoX").innerHTML=I("x");$("infoX").setAttribute("aria-label","סגירה");
const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.id="icline";svg.innerHTML='<line stroke="#C9A24B" stroke-width="1.6" stroke-dasharray="4 4"/><circle r="6" fill="none" stroke="#C9A24B" stroke-width="2"/>';stage.appendChild(svg);svg.style.display="none";
const CUR={pt:null,d:null,dist0:0};
function dimsOf(t){const s=norm(t).replace(/,/g,".");const m=s.match(/(\d+(?:\.\d+)?)\s*(?:×|x|על)\s*(\d+(?:\.\d+)?)(?:\s*(?:×|x|על)\s*(\d+(?:\.\d+)?))?\s*אמ/);const fm=v=>(Math.round(v*A*10)/10).toString();
  if(m){const a=[m[1],m[2],m[3]].filter(Boolean).map(Number);return'<bdi class="n">'+a.join(" × ")+'</bdi> אמה ≈ <bdi class="n">'+a.map(fm).join(" × ")+'</bdi> מ׳'}
  const g=s.match(/(\d+(?:\.\d+)?)\s*אמה/);if(g)return'<bdi class="n">'+g[1]+'</bdi> אמה ≈ <bdi class="n">'+fm(+g[1])+'</bdi> מ׳';return""}
function tagsOf(t){const s=String(t||"");const o=[];if(s.includes("📜"))o.push('<span class="ic-tag">📜 מפורש</span>');if(s.includes("⚖"))o.push('<span class="ic-tag" title="⚖️ הלכה או פירוש של חז״ל והמפרשים: לא כתוב במפורש בפסוק">⚖️ הלכה ופירוש</span>');if(s.includes("💡"))o.push('<span class="ic-tag s">💡 הצעה</span>');return o.join("")}
const near=(pt,n)=>labels.filter(L=>L.el&&L.el.isConnected&&L.txt&&L.v.distanceTo(pt)>0.5).map(L=>[L,L.v.distanceTo(pt)]).sort((a,b)=>a[1]-b[1]).slice(0,n);
const _show=showInfo;
const SECT={rib:{svg:"<svg viewBox=\"0 0 300 310\" width=\"100%\" role=\"img\" aria-label=\"חתך הצלעות\" style=\"max-width:340px;direction:ltr\"><rect x=\"20\" y=\"258\" width=\"140\" height=\"42\" fill=\"#cdbb95\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"160.0\" y=\"261.5\" width=\"4.0\" height=\"38.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"163.5\" y=\"265.0\" width=\"4.0\" height=\"35.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"167.0\" y=\"268.5\" width=\"4.0\" height=\"31.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"170.5\" y=\"272.0\" width=\"4.0\" height=\"28.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"174.0\" y=\"275.5\" width=\"4.0\" height=\"24.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"177.5\" y=\"279.0\" width=\"4.0\" height=\"21.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"181.0\" y=\"282.5\" width=\"4.0\" height=\"17.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"184.5\" y=\"286.0\" width=\"4.0\" height=\"14.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"188.0\" y=\"289.5\" width=\"4.0\" height=\"10.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"191.5\" y=\"293.0\" width=\"4.0\" height=\"7.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"195.0\" y=\"296.5\" width=\"4.0\" height=\"3.5\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"198.5\" y=\"300.0\" width=\"4.0\" height=\"0.0\" fill=\"#d9c9a4\" stroke=\"none\"/><rect x=\"20\" y=\"209\" width=\"42\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"62\" y=\"209\" width=\"28\" height=\"49\" fill=\"#f7f1e3\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><text x=\"76.0\" y=\"235.60000000000002\" font-size=\"10\" text-anchor=\"middle\" fill=\"#5a4320\">4</text><rect x=\"90\" y=\"209\" width=\"35\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"20\" y=\"160\" width=\"35\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"55\" y=\"160\" width=\"35\" height=\"49\" fill=\"#f7f1e3\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><text x=\"72.5\" y=\"186.60000000000002\" font-size=\"10\" text-anchor=\"middle\" fill=\"#5a4320\">5</text><rect x=\"90\" y=\"160\" width=\"35\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"20\" y=\"111\" width=\"28\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"48\" y=\"111\" width=\"42\" height=\"49\" fill=\"#f7f1e3\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><text x=\"69.0\" y=\"137.6\" font-size=\"10\" text-anchor=\"middle\" fill=\"#5a4320\">6</text><rect x=\"90\" y=\"111\" width=\"35\" height=\"49\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"20\" y=\"20\" width=\"28\" height=\"91\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"90\" y=\"226.5\" width=\"35\" height=\"31.5\" fill=\"#f7f1e3\" stroke=\"none\"/><path d=\"M223 295.8 L167 253.8 L132 249.6 L76 249.6 M76 247.5 L76 132\" fill=\"none\" stroke=\"#b5452b\" stroke-width=\"2\" stroke-dasharray=\"5 3\" marker-end=\"url(#ah)\"/><defs><marker id=\"ah\" viewBox=\"0 0 10 10\" refX=\"6\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"#b5452b\"/></marker></defs><text x=\"48\" y=\"13\" font-size=\"10\" text-anchor=\"start\" fill=\"#3d2d14\">קיר הבית</text><text x=\"107.5\" y=\"100.5\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">קיר חיצון 5</text><text x=\"142.5\" y=\"247.5\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">מנח 5</text><text x=\"90\" y=\"279\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">יסוד 6 אמות</text><text x=\"195\" y=\"240.5\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">מהחצר</text><text x=\"55\" y=\"90\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">מוסבה ↑</text></svg>",t:"📜 \"ורחב הצלע ארבע אמות\" ו\"עבי הקיר אשר לצלע אל החוץ חמש אמות\" (מ״א, ה; ט). ⚖️ לפי המלבי״ם (מ״א, ו–ז) קיר הבית נגרע באמה בכל קומה, ולכן הצלע רחבה 4, 5 ו־6 אמות מלמטה למעלה, ועולים בה במוסבה. 📜 היסוד 6 אמות (מ״א, ח), והמנח 5 אמות לפני פתח הצלע (מ״א, יא). 💡 גובה הקומות (7 אמות) ומספר המדרגות מהחצר הם הצעה. הקו האדום: מסלול הכניסה."},lish:{svg:"<svg viewBox=\"0 -10 300 190\" width=\"100%\" role=\"img\" aria-label=\"חתך לשכות הכהנים\" style=\"max-width:340px;direction:ltr\"><rect x=\"10.0\" y=\"114\" width=\"64.0\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"10.0\" y=\"78\" width=\"54.400000000000006\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"10.0\" y=\"42\" width=\"44.800000000000004\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"106.0\" y=\"114\" width=\"64.0\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"115.60000000000001\" y=\"78\" width=\"54.400000000000006\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"125.2\" y=\"42\" width=\"44.800000000000004\" height=\"36\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"74.0\" y=\"148.4\" width=\"32.0\" height=\"1.6\" fill=\"#cdbb95\"/><text x=\"90.0\" y=\"164.0\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">מהלך 10</text><text x=\"42.0\" y=\"32.0\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">שורה מול הבית</text><text x=\"138.0\" y=\"32.0\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">שורה מול החצר</text><text x=\"90.0\" y=\"70\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">אתיקים</text><text x=\"90.0\" y=\"180.0\" font-size=\"10\" text-anchor=\"middle\" fill=\"#3d2d14\">הקומה העליונה צרה: \"כי יוכלו אתיקים מהנה\"</text><path d=\"M70.80000000000001 94 L83.60000000000001 82 M109.2 94 L96.4 82\" stroke=\"#b5452b\" stroke-width=\"1.5\" fill=\"none\"/></svg>",t:"📜 שתי שורות לשכות ומהלך של 10 אמות ביניהן, ושלוש קומות. \"והלשכות העליונות קצרות, כי יוכלו אתיקים מהנה\" (מ״ב, ה–ו): הקומה העליונה צרה, כי המרפסות (האתיקים) לוקחות ממנה. 📜 \"המבוא מהקדים\" (מ״ב, ט). 💡 רוחב השורות וגובה הקומות בהערכה."}};
SECT.alt={svg:"<svg viewBox=\"0 0 300 150\" width=\"100%\" role=\"img\" aria-label=\"חתך המזבח\" style=\"max-width:340px;direction:ltr\"><rect x=\"47.599999999999994\" y=\"114\" width=\"204.8\" height=\"16\" fill=\"#cdbb95\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"54.0\" y=\"82\" width=\"192.0\" height=\"32\" fill=\"#e9dfc8\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"60.39999999999999\" y=\"58\" width=\"179.20000000000002\" height=\"24\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"60.39999999999999\" y=\"50\" width=\"6.4\" height=\"8\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"233.2\" y=\"50\" width=\"6.4\" height=\"8\" fill=\"#f2e9d5\" stroke=\"#7a5c2e\" stroke-width=\"1\"/><rect x=\"73.19999999999999\" y=\"56.0\" width=\"153.60000000000002\" height=\"2.0\" fill=\"#c0612b\"/><path d=\"M73.19999999999999 42 L73.19999999999999 53.2 M226.8 42 L226.8 53.2 M73.19999999999999 45.2 L226.8 45.2\" stroke=\"#b5452b\" fill=\"none\"/><text x=\"150.0\" y=\"39.599999999999994\" font-size=\"9.5\" text-anchor=\"middle\" fill=\"#3d2d14\">מקום המערכה (אריאל) 24 × 24</text><text x=\"150.0\" y=\"125.2\" font-size=\"9.5\" text-anchor=\"middle\" fill=\"#3d2d14\">יסוד (חיק) 32 · גובה 2</text><text x=\"150.0\" y=\"101.2\" font-size=\"9.5\" text-anchor=\"middle\" fill=\"#3d2d14\">עזרה תחתונה 30 · גובה 4</text><text x=\"150.0\" y=\"72.4\" font-size=\"9.5\" text-anchor=\"middle\" fill=\"#3d2d14\">עזרה גדולה 28 · עוד 4 עם הקרנות</text><text x=\"44.39999999999999\" y=\"51.599999999999994\" font-size=\"9.5\" text-anchor=\"middle\" fill=\"#3d2d14\">קרן</text></svg>",t:"📜 המידות לפי יחזקאל מ״ג, יג–יז. ⚖️ לפי המלבי״ם: יסוד 32 אמות וגובהו 2, עזרה תחתונה 30 וגובהה 4, עזרה גדולה 28 ועוד 4 אמות עד ראש הקרנות, ובסך הכול 10 אמות. מקום המערכה (האריאל) 24 × 24, כי מורידים מסביב את מקום הקרנות ואת מקום הילוך הכהנים. 💡 הציור פשוט, והקנה־מידה בגובה מוגדל."};
showInfo=function(d){if(!d)return;_show(d);const pt=UIPT;UIPT=null;CUR.d=d;CUR.pt=pt?pt.clone():null;if(pt&&pt._L)CUR.pt._L=pt._L;CUR.dist0=pt?camera.position.distanceTo(pt):0;
  const city=pt&&pt._L?isCity(pt._L):false;const c=catOf(d.n||"",city);const t=d.t||"";const long=norm(t).length>340;
  const src=(d.r||"").split(/[;؛]| · /).map(x=>x.trim()).filter(Boolean);
  const inner=/היכל|קודש הקודשים|הבית$/.test(d.n||"");
  let h='<div class="ic-grab"></div><div class="ic-hero">'+I(c[1])+'</div><div class="ic-head"><h2>'+esc(d.n)+'</h2><div class="ic-type"><span>'+esc(c[0])+'</span>'+tagsOf(t)+'</div></div>';
  h+='<div class="ic-btns">'+(CUR.pt?'<button type="button" data-a="fly"><span class="c">'+I("fly")+'</span>טוס לשם</button>':'')+(inner?'<button type="button" data-a="in"><span class="c">'+I("door")+'</span>היכנס</button>':'')+(CUR.pt?'<button type="button" data-a="near"><span class="c">'+I("near")+'</span>מה בסביבה</button><button type="button" data-a="walk"><span class="c">'+I("walk")+'</span>הליכה מכאן</button>':'')+'<button type="button" data-a="share"><span class="c">'+I("share")+'</span>שתף</button></div><div class="ic-body">';
  if(t)h+='<div class="ic-txt'+(long?' short':'')+'">'+t+'</div>'+(long?'<button type="button" class="ic-more">עוד</button>':'');
  /* 125.4 (ביקורת, "קריאת מקור במקום"): אותו טקסט, מסודר לפי שלוש דרגות הוודאות: מה כתוב במקור, איך מפרשים, ומה נבחר להמחשה */
  {const parts={"📜":[],"⚖️":[],"💡":[]};const tt=t.replace(/⚖(?!️)/g,"⚖️");const re=/(📜|⚖️|💡)/g;let m,last=null,pos=0;while((m=re.exec(tt))){if(last)parts[last].push(tt.slice(pos,m.index).trim());last=m[1];pos=m.index+m[1].length}if(last)parts[last].push(tt.slice(pos).trim());
    const kinds=Object.keys(parts).filter(k=>parts[k].filter(Boolean).length);if(kinds.length>=2){const L={"📜":"מה כתוב במקור","⚖️":"איך מפרשים","💡":"מה נבחר להמחשה"};
      h+='<button type="button" class="ic-read" aria-expanded="false">קריאת מקור: מה כתוב, איך מפרשים, מה הוספנו</button><div class="ic-rd" hidden>'+kinds.map(k=>'<div class="ic-row"><div><b>'+k+' '+L[k]+'</b><ul style="margin:4px 0 0;padding-inline-start:18px">'+parts[k].filter(Boolean).map(x=>'<li>'+x+'</li>').join("")+'</ul></div></div>').join("")+'</div>'}}
  /* 125.3 (ביקורת, שיפור 15): חתך מצויר של הצלעות ושל לשכות הכהנים, עם הקומות ומסלול הכניסה */
  {const sk=/צלע/.test(d.n||"")?"rib":/^לשכות הכהנים/.test(d.n||"")?"lish":d.n==="המזבח"?"alt":null;if(sk){const q=SECT[sk];h+='<details class="ic-sec" open><summary><b>חתך</b></summary>'+q.svg+'<div class="ic-txt" style="font-size:13px">'+q.t+'</div></details>'}}
  const dm=dimsOf(t);if(dm)h+='<div class="ic-row">'+I("size")+'<div>'+dm+'<br><small class="ch">אמה של <bdi class="n">'+Math.round(A*1000)/10+'</bdi> ס״מ</small></div></div>';
  if(src.length)h+='<div class="ic-row">'+I("book")+'<div class="ic-src">'+src.map(x=>'<a href="https://www.sefaria.org.il/search?q='+encodeURIComponent(x.replace(/[֑-ׇ]/g,""))+'&tab=text" target="_blank" rel="noopener">'+esc(x)+'</a>').join("")+'</div></div>';
  h+='<div class="ic-row ic-near" hidden></div></div>';
  $("infobody").innerHTML=h;card.hidden=false;card.classList.remove("full");card.scrollTop=0;document.body.classList.add("pane");
  sheetOpen()};
// ---- phone: the info card is a bottom sheet, like a map app. Drag it (anywhere on it) down to a strip with the name, or up to the buttons, half, or full screen; it snaps to the nearest; the model stays visible above it ----
const SHEET={st:1,nc:0},isPhone=()=>window.innerWidth<=700;
function sheetSnaps(){const H=stage.clientHeight,ch=card.offsetHeight,hd=card.querySelector(".ic-head"),bt=card.querySelector(".ic-btns");
  const mini=Math.min(H*0.3,(hd?hd.offsetTop+hd.offsetHeight:90)+4),peek=Math.max(mini+40,Math.min(H*0.4,bt?bt.offsetTop+bt.offsetHeight+4:200)),half=Math.max(peek+40,Math.min(ch,H*0.58));return[mini,peek,half,ch]}
function sheetPos(v){const ch=card.offsetHeight;card.style.transform="translateY("+Math.round(ch-v)+"px)";card.dataset.vis=Math.round(v)}
function sheetSet(i){const s=sheetSnaps();SHEET.st=Math.max(0,Math.min(s.length-1,i));const full=SHEET.st===s.length-1;card.classList.toggle("full",full);card.style.overflowY=full?"auto":"hidden";if(!full)card.scrollTop=0;sheetPos(s[SHEET.st])}
function sheetOpen(){if(!isPhone()){card.style.transform="";card.style.overflowY="";delete card.dataset.vis;return}
  card.classList.add("drag");sheetPos(0);void card.offsetHeight;card.classList.remove("drag");sheetSet(1)}
window.addEventListener("resize",()=>{if(card.hidden)return;if(isPhone())sheetSet(SHEET.st);else{card.style.transform="";card.style.overflowY="";delete card.dataset.vis}});
{let dr=null;
  const start=(y,tg)=>{if(!isPhone()||card.hidden)return;const full=SHEET.st===sheetSnaps().length-1;dr={y0:y,v0:+card.dataset.vis||0,st0:SHEET.st,moved:false,ok:!full||card.scrollTop<=0||!!tg.closest(".ic-grab,.ic-head"),h:[[y,performance.now()]]}};
  const move=(y,ev)=>{if(!dr)return;const dy=y-dr.y0;if(!dr.moved){if(Math.abs(dy)<7)return;const full=SHEET.st===sheetSnaps().length-1;if(full&&!(dr.ok&&dy>0)){dr=null;return}dr.moved=true;card.classList.add("drag")}
    if(ev.cancelable)ev.preventDefault();const s=sheetSnaps();sheetPos(Math.max(s[0]*0.4,Math.min(s[s.length-1],dr.v0-dy)));dr.h.push([y,performance.now()]);if(dr.h.length>5)dr.h.shift()};
  const end=()=>{if(!dr)return;const d=dr;dr=null;if(!d.moved)return;card.classList.remove("drag");SHEET.nc=performance.now();
    const a=d.h[0],b=d.h[d.h.length-1],vel=(b[0]-a[0])/Math.max(1,b[1]-a[1]),s=sheetSnaps(),v=+card.dataset.vis;
    if(v<s[0]*(d.st0===0?0.75:0.45)){closeInfo();return}
    let i=0;s.forEach((x,k)=>{if(Math.abs(x-v)<Math.abs(s[i]-v))i=k});
    if(vel>0.45){i=-1;s.forEach((x,k)=>{if(x<v-8)i=k});if(i<0){if(d.st0===0){closeInfo();return}i=0}}else if(vel<-0.45){i=s.length-1;for(let k=s.length-1;k>=0;k--)if(s[k]>v+8)i=k}
    sheetSet(i)};
  card.addEventListener("touchstart",e=>{if(e.touches.length===1)start(e.touches[0].clientY,e.target);else dr=null},{passive:true});
  card.addEventListener("touchmove",e=>{if(e.touches.length===1)move(e.touches[0].clientY,e)},{passive:false});
  card.addEventListener("touchend",end);card.addEventListener("touchcancel",end);
  card.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.target.closest(".ic-grab,.ic-head")){start(e.clientY,e.target);const mv=ev=>move(ev.clientY,ev),up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);end()};window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up)}});
  // a drag is not a tap on a button; a tap on the handle moves the sheet one step up (from full: back to the buttons)
  card.addEventListener("click",e=>{if(performance.now()-SHEET.nc<350){e.stopPropagation();e.preventDefault();return}if(isPhone()&&e.target.closest(".ic-grab")){const n=sheetSnaps().length;sheetSet(SHEET.st<n-1?SHEET.st+1:1)}},true)}
const _close=closeInfo;try{closeInfo=function(){_close();document.body.classList.remove("pane");CUR.pt=null}}catch(e){}
new MutationObserver(()=>{document.body.classList.toggle("pane",!card.hidden)}).observe(card,{attributes:true,attributeFilter:["hidden"]});
card.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.classList.contains("ic-read")){const x=card.querySelector(".ic-rd");if(x){x.hidden=!x.hidden;b.setAttribute("aria-expanded",x.hidden?"false":"true")}return}
  if(b.classList.contains("ic-more")){const x=card.querySelector(".ic-txt");const s=x.classList.toggle("short");b.textContent=s?"עוד":"פחות";return}
  const a=b.dataset.a;if(!a)return;e.stopPropagation();
  if(a==="fly"&&CUR.pt){const L=CUR.pt._L;if(L)goLabel(L);else flyToPoint(CUR.pt,20);CUR.dist0=0}
  else if(a==="in"){const k=/קודש הקודשים/.test(CUR.d.n)?"vKd":"vIn";$(k).click()}
  else if(a==="near"&&CUR.pt){const box=card.querySelector(".ic-near");box.hidden=!box.hidden;if(!box.hidden){box.innerHTML=I("near")+'<div><b>בסביבה</b></div>';const w=box.lastChild;near(CUR.pt,6).forEach(([L,dd])=>{const q=mk("button",null,esc(L.txt)+' <small class="ch">(<bdi class="n">'+Math.round(dd/A)+'</bdi> אמה)</small>');q.type="button";q.onclick=()=>pickLabel(L);w.appendChild(q)})}}
  else if(a==="walk"&&CUR.pt){const pt=CUR.pt.clone();try{closeInfo()}catch(e){}startWalk(pt)}
  else if(a==="share")share()});
// click on the sky closes the panel
const tv=new THREE.Vector3();
function cardTick(){requestAnimationFrame(cardTick);
  if(card.hidden||!CUR.pt||window.innerWidth<=700){svg.style.display="none";return}
  const dd=camera.position.distanceTo(CUR.pt);if(CUR.dist0&&dd>Math.max(900,CUR.dist0*4)&&!STORY){closeInfo();return}
  tv.copy(CUR.pt).project(camera);if(tv.z>1||Math.abs(tv.x)>1.1||Math.abs(tv.y)>1.1){svg.style.display="none";return}
  const sr=stage.getBoundingClientRect(),cr=card.getBoundingClientRect();const x=(tv.x+1)/2*sr.width,y=(1-tv.y)/2*sr.height;const cx=cr.right-sr.left,cy=Math.max(140,Math.min(sr.height-40,y));
  if(x<cx+8){svg.style.display="none";return}
  svg.style.display="";const ln=svg.firstChild,ci=svg.lastChild;ln.setAttribute("x1",cx);ln.setAttribute("y1",cy);ln.setAttribute("x2",x);ln.setAttribute("y2",y);ci.setAttribute("cx",x);ci.setAttribute("cy",y)}
requestAnimationFrame(cardTick);
// --- share link ---
function shareURL(){const p=camera.position,t=controls.target,f=v=>v.toFixed(1);const q=["v="+[p.x,p.y,p.z,t.x,t.y,t.z].map(f).join(","),"a="+A,"f="+FMODE,"l="+LOC,"g="+GATE,"t="+TIME,"d="+DAY,"s="+FLOOR,"y="+DOY];if(PESPICK)q.push("pp="+PESDAY);if(SHVPICK)q.push("sp="+SHVDAY);if(DOY===FEST.sukkot.doy)q.push("kd="+SUKDAY);if(HOUR!=null)q.push("h="+HOUR.toFixed(2));if(CUR.d&&!card.hidden)q.push("o="+encodeURIComponent(CUR.d.n));q.push("ly="+["oP","oT","oL","oW","oF","oM","oS"].map(id=>{const b=$(id);return b&&b.getAttribute("aria-pressed")==="true"?"1":"0"}).join(""));return location.href.split("#")[0]+"#"+q.join("&")}
function share(){const u=shareURL();try{history.replaceState(null,"",u)}catch(e){}const done=()=>toast("הקישור הועתק. מי שיפתח אותו יראה בדיוק את המבט הזה.");if(navigator.share&&window.innerWidth<=700){navigator.share({title:"הדמיית המקדש",url:u}).catch(()=>{})}else if(navigator.clipboard)navigator.clipboard.writeText(u).then(done,()=>toast(u));else toast(u)}
function restore(){const h=location.hash.slice(1);if(!h||!/v=/.test(h))return false;const Q={};h.split("&").forEach(kv=>{const i=kv.indexOf("=");if(i>0)Q[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1))});
  const click=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
  if(Q.a){const m={"0.48":"a48","0.525":"a525","0.576":"a576"}[Q.a];if(m)click(m)}if(Q.f==="mid")click("fMid");if(Q.g==="high")click("gH");if(Q.l==="altar")click("lA");
  // מכונות מצב: הקישור שומר גם שיטה, שעה, סוג יום, חג ורצפה
  if(Q.y){const f=Object.keys(FEST).find(k=>String(FEST[k].doy)===Q.y);if(f){const b=document.querySelector('#festSeg button[data-fest="'+f+'"]');if(b)b.click()}}
  /* 121: קישור שיתוף מפעיל את שכבת הפסח רק אם היא הייתה פעילה */PESPICK=!!(Q.pp&&/^(14am|14pm|15n|15|16n|16|chm|21)$/.test(Q.pp)&&DOY===FEST.pesach.doy);if(PESPICK)PESDAY=Q.pp;if(window.__pesUI)window.__pesUI();SHVPICK=!!(Q.sp&&/^(eve|6|t7|t8|t9|t10|t11|t12)$/.test(Q.sp)&&DOY===FEST.shavuot.doy);if(SHVPICK)SHVDAY=Q.sp;if(window.__shvUI)window.__shvUI();/* 125.0 (ביקורת 27): גם היום בסוכות נשמר בקישור */if(Q.kd&&/^(1[5-9]|2[0-2])$/.test(Q.kd)&&DOY===FEST.sukkot.doy){SUKDAY=+Q.kd;if(window.__sukUI)window.__sukUI()}
  if(Q.h&&isFinite(+Q.h)){const s=$("hslider");if(s){s.value=Q.h;s.dispatchEvent(new Event("change"))}}else if(Q.t){const id={morning:"tM",noon:"tN",evening:"tE",night:"tL"}[Q.t];if(id)click(id)}
  if(Q.d){const b=document.querySelector('#daySeg button[data-day="'+Q.d+'"]');if(b)b.click()}
  if(Q.s){const id={sat:"sS",satm:"sM",model:"sD"}[Q.s];if(id)click(id)}if(Q.ly){const ids=["oP","oT","oL","oW","oF","oM","oS"];[...Q.ly].forEach((ch,i)=>{const b=$(ids[i]);if(!b)return;const want=ch==="1";const cur=b.getAttribute("aria-pressed")==="true";if(cur!==want)b.click()})}closeInfo();
  const v=(Q.v||"").split(",").map(Number);if(v.length===6&&v.every(isFinite)){tween=null;camAt(new THREE.Vector3(v[0],v[1],v[2]),new THREE.Vector3(v[3],v[4],v[5]));document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"))}
  /* 122.6: after a quality switch, go back into the same tour at the same station. Only once: the mark is taken off the link */if(Q.tr){const m=/^([a-z]+)\.(\d+)$/.exec(Q.tr);try{history.replaceState(null,"",location.href.replace(/&tr=[^&]*/,""))}catch(e){}const SA=window.__STORY;if(m&&SA){setTimeout(()=>{try{closeInfo();SA.start(m[1]);const d=SA.S.def;if(d&&SA.S.key===m[1]){const i=Math.min(+m[2],d.steps.length-1);if(i>0)SA.go(i)}}catch(e){console.warn("tr",e)}},300);return true}}
  if(Q.o){const L=labels.find(L=>L.txt===Q.o);if(L){UIPT=L.v.clone();UIPT._L=L;showInfo(L.info||{n:L.txt})}else{const o=cPick.concat(PICK).find(o=>o.userData&&o.userData.n===Q.o);if(o){const cr=objCenter(o);UIPT=cr?cr[0]:null;showInfo(o.userData)}}}
  return true}
// --- corner controls: compass, home, zoom, full screen ---
{const hud=$("hud");hud.classList.add("ui","dim");
  const zg=mk("div","zgrp");const zin=mk("button",null,I("plus")),zout=mk("button",null,I("minus"));zin.type=zout.type="button";zin.setAttribute("aria-label","התקרבות");zout.setAttribute("aria-label","התרחקות");zg.append(zin,zout);
  const zoom=f=>{if(WALK||DRONE)return;tween=null;const t=controls.target,p=camera.position,np=t.clone().add(p.clone().sub(t).multiplyScalar(f));if(np.distanceTo(t)<3)return;tween={p0:p.clone(),t0:t.clone(),p1:np,t1:t.clone(),start:performance.now(),dur:350}};
  zin.onclick=()=>zoom(0.6);zout.onclick=()=>zoom(1.6);
  const fs=mk("button","hb",I("full"));fs.type="button";fs.id="fsB";fs.setAttribute("aria-label","מסך מלא");fs.onclick=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen).call(document.documentElement)}catch(e){toast("הדפדפן לא מאפשר מסך מלא כאן.")}};
  hud.insertBefore(zg,hud.firstChild);hud.appendChild(fs);
  $("homeB").innerHTML=I("house");
  $("compass").addEventListener("dblclick",e=>{e.preventDefault();if(WALK)return;const t=controls.target,p=camera.position,d=p.distanceTo(t),f=p.clone().sub(t);f.y=0;if(f.length()<1)f.set(0,0,1);f.normalize();const np=t.clone().addScaledVector(f,d*Math.cos(0.42));np.y=t.y+d*Math.sin(0.42);tween={p0:p.clone(),t0:t.clone(),p1:np,t1:t.clone(),start:performance.now(),dur:700}});
  ["mini","exitB","perfbox","attrib","fastB"].forEach(id=>{const e=$(id);if(e)e.classList.add("ui")})}
// --- idle: the controls fade a little after 5 s ---
{let t=null;const wake=()=>{document.body.classList.remove("idle");clearTimeout(t);t=setTimeout(()=>document.body.classList.add("idle"),5000)};["pointermove","pointerdown","keydown","wheel","touchstart"].forEach(ev=>window.addEventListener(ev,wake,{passive:true,capture:true}));wake()}
// --- first visit: fly in from the Mount of Olives, then 3 short cards ---
const IN=[["move","גוררים כדי לזוז","גרירה מזיזה את המפה, גלגלת או צביטה מקרבות, וגרירה ימנית מסובבת. לחיצה כפולה טסה אל המקום."],["pin","לוחצים על כל חלק","לחיצה על חלק במקדש פותחת כרטיס עם השם, המקור והמידות. 📜 מפורש · ⚖️ הלכה ופירוש · 💡 הצעה."],["search","מחפשים או יוצאים לסיור","אפשר לחפש למעלה (למשל \"גזית\"), או לבחור סיור מודרך בתפריט."]];
P.move='<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>';
const intro=mk("div","ui");intro.id="intro";intro.hidden=true;intro.innerHTML='<div class="box gl" role="dialog" aria-modal="true" aria-labelledby="inH"><div class="ill"></div><div class="dots"><i></i><i></i><i></i></div><h2 id="inH"></h2><p id="inP"></p><div class="ib"></div></div>';stage.appendChild(intro);
function showIntro(i){intro.hidden=false;intro.querySelector(".ill").innerHTML=I(IN[i][0]);intro.querySelectorAll(".dots i").forEach((d,k)=>d.classList.toggle("on",k===i));$("inH").textContent=IN[i][1];$("inP").textContent=IN[i][2];const ib=intro.querySelector(".ib");ib.innerHTML="";
  const B=(t,pri,fn)=>{const b=mk("button",pri?"pri":null,t);b.type="button";b.onclick=fn;ib.appendChild(b);return b};
  const end=()=>{intro.hidden=true;LS.set("tm_intro","1")};
  if(i<2){B("דלג",0,end);B("הבא",1,()=>showIntro(i+1)).focus()}else{B("✈ חקירה חופשית",0,end);B("🧭 סיור היכרות",1,()=>{end();startTour("pilgrim")}).focus()}}
const dismissIntro=()=>{if(!intro.hidden){intro.hidden=true;LS.set("tm_intro","1")}};intro.addEventListener("click",e=>{if(e.target===intro)dismissIntro()});(document.querySelector("#stage canvas")||(typeof renderer!=="undefined"&&renderer.domElement))&&(document.querySelector("#stage canvas")||renderer.domElement).addEventListener("pointerdown",dismissIntro,{passive:true});
function flyIn(then){try{const [p,t]=viewPose("olives");if(camera.position.distanceTo(p)>5)camAt(p,t);
  // מכונות מצב: מי שעוצר את טיסת הפתיחה (נגיעה, גלגלת, מקש) כבר מתחיל לטייל, ולכן כרטיסי הפתיחה לא קופצים לו באמצע. אפשר לפתוח אותם מהעזרה ("מדריך קצר")
  let cut=false;const stop=()=>{cut=true};const evs=["pointerdown","wheel","keydown","touchstart"];evs.forEach(ev=>addEventListener(ev,stop,{capture:true,passive:true}));
  setTimeout(()=>{flyTo("home",4200);setTimeout(()=>{evs.forEach(ev=>removeEventListener(ev,stop,{capture:true}));if(!cut)then()},4300)},400)}catch(e){then()}}
{const t0=performance.now();const wait=()=>{if($("loading")&&performance.now()-t0<240000){setTimeout(wait,200);return}const r=restore();if(!r&&!LS.get("tm_intro")&&!window.__EV){LS.set("tm_intro","1");if(window.__TOUCHED)showIntro(0);else flyIn(()=>showIntro(0))}};setTimeout(wait,300)}
window.__UI={buildIndex,run,toggleDr,showIntro,share,shareURL,restore,closeDr,chip,flyIn};
})();
// the stage must never scroll (focus on an off-screen item scrolled it sideways and showed a blue strip)
{const st=document.getElementById("stage");const fix=()=>{if(st.scrollLeft||st.scrollTop){st.scrollLeft=0;st.scrollTop=0}};st.addEventListener("scroll",fix,{passive:true});setInterval(fix,500)}


