// ==== 130.0: קולות רקע — המולה שעולה כשמתקרבים לרחובות, לשוק, לכותל ולהר הבית (תוכנית: ambient-sound/תוכנית-קולות-רקע.md) ====
// על אותו מנוע Web Audio של הסיורים (SND), בהקשר שמע משלו; לא נוגע בקריינות ובמוזיקה (audio/, music-module/). הקבצים ב־sfx/ ורשימת הקרדיטים ב־sfx/CREDITS.md.
// 📜/⚖️/💡: ראו הערות ליד כל אזור. העוצמות עצמן 💡.
(function(){
const AMB={on:true,ready:false,loading:false,lv:{},why:""};window.__AMB=AMB;
try{AMB.on=localStorage.getItem("tm_amb")!=="0"}catch(e){}
const FILES={city:"sfx/crowd-city.mp3",market:"sfx/crowd-market.mp3",quiet:"sfx/crowd-quiet.mp3",stream:"sfx/stream.mp3",birds:"sfx/birds.mp3",night:"sfx/crickets.mp3",steps:"sfx/steps.mp3",sheep:"sfx/sheep.mp3",coins:"sfx/coins.mp3"};
const LOOPS=["city","market","quiet","stream","birds","night","steps"];
/* נקודות הנקישה בקובץ המטבעות (שניות: התחלה, אורך) */
const CLINKS=[[0,1.5],[1.6,1.5],[3.2,1.5],[4.8,1.5],[6.4,1.5]];
let ctx=null,out=null,bufs={},gains={},pans={},started=false;
/* 130.2: הנקודה הקרובה של כל מקור (בעולם: x, z) ומרחקה, מהחישוב האחרון של המצלמה */
let NP=null,SRC={};
function ensureCtx(){if(ctx)return ctx;try{ctx=new (window.AudioContext||window.webkitAudioContext)();out=ctx.createGain();out.gain.value=0;out.connect(ctx.destination)}catch(e){ctx=null}return ctx}
/* iOS/Android: הקשר השמע נפתח רק בתוך מחווה של המשתמש (הלחיצה על «כניסה» או כל נגיעה) */
const unlock=()=>{if(!AMB.on)return;ensureCtx();if(ctx&&ctx.state==="suspended")ctx.resume().catch(()=>{})};
["pointerdown","keydown","touchend"].forEach(t=>document.addEventListener(t,unlock,{capture:true,passive:true}));
document.addEventListener("visibilitychange",()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(AMB.on)ctx.resume().catch(()=>{})});
function load(){if(AMB.loading||!ensureCtx())return;AMB.loading=true;
  Promise.all(Object.entries(FILES).map(([k,u])=>fetch(u).then(r=>r.ok?r.arrayBuffer():Promise.reject(u)).then(ab=>new Promise((res,rej)=>ctx.decodeAudioData(ab,res,rej))).then(b=>{bufs[k]=b}).catch(e=>console.warn("amb load",k,e))))
  .then(()=>{LOOPS.forEach(k=>{if(!bufs[k])return;const s=ctx.createBufferSource();s.buffer=bufs[k];s.loop=true;const g=ctx.createGain();g.gain.value=0;s.connect(g);/* 130.2: כל קול עם כיוון (ימין/שמאל) משלו */const pn=ctx.createStereoPanner?ctx.createStereoPanner():null;if(pn){g.connect(pn);pn.connect(out);pans[k]=pn}else g.connect(out);
      /* כל לולאה מתחילה במקום אחר, כדי שלא יישמעו יחד אותן נקודות */s.start(0,Math.random()*b0(bufs[k]));gains[k]=g});started=true;AMB.ready=true})}
const b0=b=>Math.max(0,b.duration-0.1);
// ---- אזורים ----
const sat=v=>v<0?0:v>1?1:v;
const near=(d,full,zero)=>sat((zero-d)/(zero-full));
function segD(x,n,a,b){const dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=sat(((x-a[0])*dx+(n-a[1])*dn)/l2),px=a[0]+dx*t,pq=a[1]+dn*t;segD.p=[px,pq];return Math.hypot(px-x,pq-n)}
function polyD(x,n,P){NP=null;if(!P||P.length<3)return 1e9;if(inPoly(x,n,P)){NP=[x,n];return 0}let d=1e9;for(let i=0;i<P.length;i++){const e=segD(x,n,P[i],P[(i+1)%P.length]);if(e<d){d=e;NP=segD.p}}return d}
/* השוק: החנויות שבנויות ברחובות השוק (125.5, לפי תמונות רחוב), והשווקים המקורים. רשת של 24 מ׳ כדי לחפש מהר */
let MG=null;function mktGrid(){if(MG)return MG;const P=window.__MKTP;if(!P||!P.length)return null;MG=new Map();P.forEach(p=>{const k=Math.floor(p[0]/24)+"_"+Math.floor(p[1]/24);let L=MG.get(k);if(!L)MG.set(k,L=[]);L.push(p)});return MG}
function mktD(x,n){NP=null;/* השווקים המקורים: מלבן; מחוץ לו — המרחק לשפה הקרובה */const bx=Math.max(-442,Math.min(-384,x)),bn=Math.max(-140,Math.min(22,n));let d=Math.hypot(x-bx,n-bn);NP=[bx,bn];if(d===0)return 0;const G=mktGrid();if(!G)return d;const cx=Math.floor(x/24),cn=Math.floor(n/24);for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const L=G.get((cx+i)+"_"+(cn+j));if(L)for(const p of L){const e=Math.hypot(p[0]-x,p[1]-n);if(e<d){d=e;NP=p}}}return d}
function rivD(x,z){const P=window.__RIVPTS;if(!P||typeof SHOW_RIVER!=="undefined"&&!SHOW_RIVER)return 1e9;let d=1e9;NP=null;for(let i=0;i<P.length-1;i+=2){const a=P[i],b=P[Math.min(i+2,P.length-1)],e=segD(x,z,[a[0],a[2]],[b[0],b[2]]);if(e<d){d=e;NP=segD.p}}return d}
/* השולחנים (שקלים א, ג): שש שולחנות בהר הבית, מרכז השורה u 220, v 58.8 בשרטוט הצפוני, שמשתקף לדרום (v -> 500-v) */
function changersXZ(){if(!COMP)return null;return[COMP.X0+220*A,-(COMP.N0-(500-58.8)*A)]}
let nextClink=0,nextBaa=0;
/* 130.3: עולי הרגל והכבשים שהולכים במודל (24-transport). כמה עולים יש עד 30 מ׳, והכבש הקרוב (בעולם: x, z) */
const BAAS=[[0,0.9],[1.0,1.0],[2.1,1.7],[3.9,1.9]];
function pilgrims(x,n){const M=window.__PGM;if(!M)return{c:0,sd:1e9,sp:null};let c=0,sd=1e9,sp=null;
  const scan=(m,f)=>{const a=m.instanceMatrix.array,N=m.count,w=m.matrixWorld.elements;for(let i=0;i<N;i++){const o=i*16;if(Math.hypot(a[o],a[o+1],a[o+2])<0.05)continue;const lx=a[o+12],ly=a[o+13],lz=a[o+14],px=w[0]*lx+w[4]*ly+w[8]*lz+w[12],pz=w[2]*lx+w[6]*ly+w[10]*lz+w[14],d=Math.hypot(px-x,pz-n);if(d<30)f(d,px,pz)}};
  try{scan(M.b,d=>{c+=d<10?1:0.5});scan(M.s,(d,px,pn)=>{if(d<sd){sd=d;sp=[px,pn]}})}catch(e){}
  return{c,sd,sp}}
function baa(vol,pan){if(!bufs.sheep||!ctx)return;const c=BAAS[Math.floor(Math.random()*BAAS.length)];if(c[0]+c[1]>bufs.sheep.duration)return;const s=ctx.createBufferSource(),g=ctx.createGain(),p=ctx.createStereoPanner?ctx.createStereoPanner():null;s.buffer=bufs.sheep;s.playbackRate.value=0.9+Math.random()*0.2;g.gain.value=vol;s.connect(g);if(p){p.pan.value=pan;g.connect(p);p.connect(out)}else g.connect(out);s.start(ctx.currentTime+0.02,c[0],c[1])}
function clink(vol){if(!bufs.coins||!ctx)return;const c=CLINKS[Math.floor(Math.random()*CLINKS.length)];if(c[0]+c[1]>bufs.coins.duration)return;const s=ctx.createBufferSource(),g=ctx.createGain(),p=ctx.createStereoPanner?ctx.createStereoPanner():null;s.buffer=bufs.coins;s.playbackRate.value=0.92+Math.random()*0.16;g.gain.value=vol;s.connect(g);if(p){p.pan.value=Math.max(-1,Math.min(1,((AMB.pan&&AMB.pan.market)||0)+Math.random()*0.4-0.2));g.connect(p);p.connect(out)}else g.connect(out);s.start(ctx.currentTime+0.02,c[0],c[1])}
function levels(P){const L={city:0,market:0,quiet:0,stream:0,birds:0,night:0,coins:0,steps:0,sheep:0};
  const cp=P||camera.position;let gy=0;try{gy=groundAt(cp.x,cp.z)}catch(e){}if(!isFinite(gy))gy=0;
  const h=Math.max(1,cp.y-gy);if(!P)AMB.h=h;
  /* גובה: עד 30 מ׳ מלא, מעל 250 מ׳ שקט, וביניהם בהדרגה (לוגריתמית) 💡 */
  const hf=(WALK&&!P)?1:sat((Math.log(250)-Math.log(h))/(Math.log(250)-Math.log(30)));
  if(hf<=0.001)return L;
  const g=S2G(cp.x,-cp.z),x=g[0],n=g[1];
  const night=TIME==="night",eve=TIME==="evening",shab=DAY==="shabbat";
  const fest=typeof FEST!=="undefined"&&DOY!==FEST.chol.doy;
  const sukNight=fest&&DOY===FEST.sukkot.doy&&night;
  const inOld=inPoly(x,n,OLD);
  const W=q=>{if(!q)return null;const w=G2S(q[0],q[1]);return[w[0],-w[1]]};
  const dMount=polyD(x,n,MOUNT_BIG),npM=W(NP),dPlaza=polyD(x,n,PLAZA),npP=W(NP),dMkt=mktD(x,n),npK=W(NP),dRiv=rivD(cp.x,cp.z),npR=NP;
  if(!P)SRC={market:[npK,dMkt],quiet:dMount<=dPlaza?[npM,dMount]:[npP,dPlaza],stream:[npR,dRiv]};
  const inHouse=INTBOX&&cp.x>INTBOX.x0&&cp.x<INTBOX.x1&&cp.z>INTBOX.z0&&cp.z<INTBOX.z1&&cp.y<INTBOX.y1;
  const mount=near(dMount,0,45),plaza=near(dPlaza,0,40),mkt=near(dMkt,5,45);
  /* העיר: המולה קלה בכל רחוב; בעיר העתיקה יותר. בשבת אין תנועה ואין מסחר, והרחוב שקט יותר 💡 */
  let city=(inOld?0.55:0.3)*(1-mount*0.9);
  /* השוק ⚖️: בשבת ובחג אין מקח וממכר (נחמיה יג, טו-יט; ביצה ה, ב), ובלילה החנויות סגורות 💡 */
  let market=mkt*(1-mount);
  /* הר הבית והעזרות ⚖️: מורא מקדש — "לא יקל אדם את ראשו כנגד שער המזרח" (ברכות ט, ה; רמב״ם בית הבחירה ז). רק המולה שקטה, בלי קולות שוק.
     בכותל: המולה שקטה של תפילה 💡 */
  let quiet=Math.max(mount*0.85,plaza*0.75);
  /* 📜 בשבת יש עבודה במקדש (במדבר כח, ט-י), ולכן ההמולה בהר נשארת. בחג: עלייה לרגל, "עומדים צפופים" (אבות ה, ה) */
  if(fest)quiet=Math.min(1,quiet*1.6);
  if(shab){city*=0.55;market=0}
  if(fest&&!sukNight)market=0;
  if(night){city*=0.15;market=0;quiet*=sukNight?1.2:0.15} /* בלילה: רק שומרי המקדש (תמיד א, א); בסוכות בלילה שמחת בית השואבה (סוכה ה, ב-ד) */
  else if(eve){city*=0.75;market*=0.6}
  /* 📜 הנחל של יחזקאל (מז, א-ט) זורם תמיד */
  const stream=near(dRiv,4,70);
  /* ציפורים ביום ובמקום פתוח, צרצרים בלילה 💡 */
  const open=inOld?0.3:1;
  const birds=night?0:(TIME==="morning"?0.7:eve?0.45:0.35)*open*(1-mount*0.5);
  const nightL=night?0.5*open:0;
  L.city=city;L.market=market;L.quiet=quiet;L.stream=stream;L.birds=birds;L.night=nightL;
  /* השולחנים: נקישות מטבעות ומיקוח, עד כ־30 מ׳. לא בשבת ולא בחג ⚖️ */
  const ch=changersXZ();if(ch&&!shab&&!fest&&!night){const d=Math.hypot(cp.x-ch[0],cp.z-ch[1]);if(!P)SRC.coins=[ch,d];L.coins=near(d,4,32);L.market=Math.max(L.market,L.coins*0.45)}
  /* 130.1: במצב הליכה — צעדים על אבן כשהולכים (לא כשעומדים). מהר יותר = חזק יותר 💡 */
  if(!P&&WALK){const sp=AMB.spd||0;L.steps=sat((sp-0.15)/0.8)*(inHouse?0.6:1)}
  /* 130.3: עולי רגל בדרך להר: ההמולה לפי כמה עולים הולכים ליד המצלמה. הכבשים לקרבן (📜 שמות יב, ג-ו; ⚖️ פסחים ה) פועים מדי פעם */
  {const pg=pilgrims(cp.x,cp.z),pv=0.75*sat(pg.c/14)*(night?0.3:1);/* ⚖️ על הר הבית גם עולי הרגל רק בהמולה שקטה */if(mount>0.5)L.quiet=Math.max(L.quiet,pv*0.85);else L.city=Math.max(L.city,pv*(1-mount));if(pg.sp&&!night){L.sheep=near(pg.sd,3,30);if(!P)SRC.sheep=[pg.sp,pg.sd]}}
  for(const k in L)L[k]*=hf;
  if(inHouse)for(const k in L)L[k]*=0.12; /* בתוך ההיכל כמעט שקט 💡 */
  return L}
/* עוצמת בסיס לכל קובץ (אחרי נרמול), כדי שהשכבות יישבו יחד 💡 */
const BASE={city:0.5,market:0.6,quiet:0.45,stream:0.55,birds:0.35,night:0.3,steps:0.55};
function tick(){if(!AMB.on||!ctx){return}
  if(typeof camera==="undefined"||!camera||!window.__LOADT)return;
  /* מהירות ההולך: הדמות במצב «הולך», אחרת המצלמה. קפיצה או טיסה (מעל 8 מ׳ לשנייה) אינה הליכה */
  {const cp=(typeof PER!=="undefined"&&PER.on&&PER.p)?PER.p:camera.position,t=performance.now(),H=AMB._hist||(AMB._hist=[]);H.push([t,cp.x,cp.z]);while(H.length>2&&t-H[1][0]>=1000)H.shift();/* מהירות לאורך כשנייה, כי בטלפון איטי הדמות זזה רק בכל פריים */const o=H[0],dt=(t-o[0])/1000,v=dt>0.2?Math.hypot(cp.x-o[1],cp.z-o[2])/dt:0;AMB.spd=v>8?0:v}
  let L;try{L=levels()}catch(e){AMB.why=String(e);return}AMB.lv=L;
  const any=Object.values(L).some(v=>v>0.01);
  if(any&&!AMB.loading)load();
  if(!started)return;
  const now=ctx.currentTime;
  /* בסיור הקריינות קודמת: הרקע יורד ל־40% */
  const duck=(typeof STORY!=="undefined"&&STORY)?0.4:1;
  out.gain.setTargetAtTime(0.9*duck,now,0.3);
  /* 130.2: כיוון — המקור משמאל או מימין למצלמה. כשעומדים בתוכו, הקול מכל הצדדים (באמצע) */
  {const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,cp=camera.position;
   for(const k in pans){const S=SRC[k==="market"&&L.coins>L.market*0.9?"coins":k];let v=0;if(S&&S[0]){const dx=S[0][0]-cp.x,dz=S[0][1]-cp.z,dl=Math.hypot(dx,dz);if(dl>0.5)v=(dx*rx+dz*rz)/(dl*rl)*0.8*sat((S[1]-3)/20)}AMB.pan=AMB.pan||{};AMB.pan[k]=v;pans[k].pan.setTargetAtTime(v,now,0.25)}}
  LOOPS.forEach(k=>{if(gains[k])gains[k].gain.setTargetAtTime(L[k]*BASE[k],now,k==="steps"?0.2:0.6)});
  if(L.sheep>0.05&&performance.now()>nextBaa){const S=SRC.sheep;let pn=0;if(S&&S[0]){const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,dx=S[0][0]-camera.position.x,dz=S[0][1]-camera.position.z,dl=Math.hypot(dx,dz)||1;pn=(dx*rx+dz*rz)/(dl*rl)*0.8*sat((S[1]-2)/10)}baa(0.55*L.sheep,pn);nextBaa=performance.now()+3500+Math.random()*7000}
  if(L.coins>0.02&&performance.now()>nextClink){clink(0.5*L.coins);nextClink=performance.now()+1800+Math.random()*4200}}
setInterval(tick,250);
AMB.set=v=>{AMB.on=!!v;try{localStorage.setItem("tm_amb",v?"1":"0")}catch(e){}if(v){unlock();tick()}else if(ctx&&out){out.gain.setTargetAtTime(0,ctx.currentTime,0.15)}};
AMB.levels=()=>{try{return levels()}catch(e){return{err:String(e)}}};
/* לבדיקה: העוצמות בנקודה (x מזרח, n צפון במטרים מנקודת הייחוס של המפה), בגובה h מעל הקרקע */
AMB.at=(gx,gn,h)=>{try{const s=G2S(gx,gn),x=s[0],z=-s[1];let gy=0;try{gy=groundAt(x,z)}catch(e){}return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
AMB.atS=(x,z,h)=>{let gy=0;try{gy=groundAt(x,z)}catch(e){}try{return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
AMB.w=(gx,gn)=>{const s=G2S(gx,gn);return[s[0],-s[1]]};AMB.src=()=>SRC;AMB.g=()=>S2G(camera.position.x,-camera.position.z);
AMB.atU=(u,v,h)=>{try{const x=COMP.X0+u*A,z=-(COMP.N0-v*A);let gy=0;try{gy=groundAt(x,z)}catch(e){}return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
})();
