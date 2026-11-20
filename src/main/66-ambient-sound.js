// ==== 130.0: קולות רקע — המולה שעולה כשמתקרבים לרחובות, לשוק, לכותל ולהר הבית (תוכנית: ambient-sound/תוכנית-קולות-רקע.md) ====
// על אותו מנוע Web Audio של הסיורים (SND), בהקשר שמע משלו; לא נוגע בקריינות ובמוזיקה (audio/, music-module/). הקבצים ב־sfx/ ורשימת הקרדיטים ב־sfx/CREDITS.md.
// 📜/⚖️/💡: ראו הערות ליד כל אזור. העוצמות עצמן 💡.
(function(){
const AMB={on:true,ready:false,loading:false,lv:{},why:""};window.__AMB=AMB;
try{AMB.on=localStorage.getItem("tm_amb")!=="0"}catch(e){}
/* 136.3: עוצמה כללית (0.1–1), מפס העוצמה בתפריט. ברירת מחדל 70% */AMB.v=0.7;try{const q=parseInt(localStorage.getItem("tm_ambv"),10);if(q>=10&&q<=100)AMB.v=q/100}catch(e){}
const FILES={cattle:"sfx/cattle.mp3",city:"sfx/crowd-city.mp3",market:"sfx/crowd-market.mp3",quiet:"sfx/crowd-quiet.mp3",stream:"sfx/stream.mp3",birds:"sfx/birds.mp3",night:"sfx/crickets.mp3",steps:"sfx/steps.mp3",sheep:"sfx/sheep.mp3",coins:"sfx/coins.mp3"};
const LOOPS=["city","market","quiet","stream","birds","night","steps","spring","laver"];
/* 136.2: לולאה שמשתמשת בקובץ של לולאה אחרת (140.2: הכיור — אותם מים, מהר יותר ודק יותר) */const LBUF={spring:"stream",laver:"stream"},LRATE={laver:1.4};
/* נקודות הנקישה בקובץ המטבעות (שניות: התחלה, אורך) */
const CLINKS=[[0,1.5],[1.6,1.5],[3.2,1.5],[4.8,1.5],[6.4,1.5]];
let ctx=null,out=null,bufs={},gains={},pans={},lps={},started=false;
/* 130.2: הנקודה הקרובה של כל מקור (בעולם: x, z) ומרחקה, מהחישוב האחרון של המצלמה */
let NP=null,SRC={};
function ensureCtx(){if(ctx)return ctx;try{ctx=new (window.AudioContext||window.webkitAudioContext)();out=ctx.createGain();out.gain.value=0;out.connect(ctx.destination)}catch(e){ctx=null}return ctx}
/* 136.0: הד במקום מקורה (רחוב מקומר, שוק מקורה, מעבר שער, מנהרה, ההיכל). תגובת חדר מחושבת (רעש שדועך), בלי קובץ. שני חדרים: מעבר צר (כשנייה) ואולם גבוה (כשלוש שניות) 💡
   הממיר מחובר רק כשנמצאים במקום מקורה, כדי לא לבזבז מעבד בטלפון */
let REV=null;
function mkIR(sec,pre){const sr=ctx.sampleRate,N=Math.floor(sr*sec),b=ctx.createBuffer(2,N,sr);for(let c=0;c<2;c++){const d=b.getChannelData(c);let lp=0;for(let i=0;i<N;i++){const t=i/sr;lp=lp*0.6+(Math.random()*2-1)*0.4;d[i]=t<pre?0:lp*Math.exp(-6.9*t/sec)}}return b}
function mkRev(){const mk=(sec,pre)=>{const cv=ctx.createConvolver();cv.normalize=true;cv.buffer=mkIR(sec,pre);const g=ctx.createGain();g.gain.value=0;cv.connect(g);g.connect(ctx.destination);return{cv,g,on:false}};REV={lane:mk(1.1,0.012),hall:mk(3.2,0.03)};AMB.revOK=true}
function revSet(k,v,now){const R=REV[k];if(v>0.01){R.off=0;if(!R.on){out.connect(R.cv);R.on=true}}else if(R.on){if(!R.off)R.off=now;/* ההד דועך כשלוש שניות, ואז מנתקים */else if(now-R.off>4){try{out.disconnect(R.cv)}catch(e){}R.on=false;R.off=0}}R.g.gain.setTargetAtTime(v,now,0.35)}
/* iOS/Android: הקשר השמע נפתח רק בתוך מחווה של המשתמש (הלחיצה על «כניסה» או כל נגיעה) */
const unlock=()=>{if(!AMB.on)return;ensureCtx();if(ctx&&ctx.state==="suspended")ctx.resume().catch(()=>{})};
["pointerdown","keydown","touchend"].forEach(t=>document.addEventListener(t,unlock,{capture:true,passive:true}));
document.addEventListener("visibilitychange",()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(AMB.on)ctx.resume().catch(()=>{})});
function load(){if(AMB.loading||!ensureCtx())return;AMB.loading=true;
  Promise.all(Object.entries(FILES).map(([k,u])=>fetch(u).then(r=>r.ok?r.arrayBuffer():Promise.reject(u)).then(ab=>new Promise((res,rej)=>ctx.decodeAudioData(ab,res,rej))).then(b=>{bufs[k]=b}).catch(e=>console.warn("amb load",k,e))))
  .then(()=>{LOOPS.forEach(k=>{const bk=LBUF[k]||k;if(!bufs[bk])return;const s=ctx.createBufferSource();s.buffer=bufs[bk];if(LRATE[k])s.playbackRate.value=LRATE[k];s.loop=true;const g=ctx.createGain();g.gain.value=0;s.connect(g);/* 140.1: מסנן — קול רחוק עמום יותר */const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=16000;lp.Q.value=0.5;g.connect(lp);lps[k]=lp;/* 130.2: כל קול עם כיוון (ימין/שמאל) משלו */const pn=ctx.createStereoPanner?ctx.createStereoPanner():null;if(pn){lp.connect(pn);pn.connect(out);pans[k]=pn}else lp.connect(out);
      /* כל לולאה מתחילה במקום אחר, כדי שלא יישמעו יחד אותן נקודות */s.start(0,Math.random()*b0(bufs[bk]));gains[k]=g});try{mkVeh()}catch(e){console.warn("amb veh",e)}try{mkWind()}catch(e){console.warn("amb wind",e)}started=true;AMB.ready=true})}
/* 130.4: רכבת קלה ואוטובוס חשמלי — קול מסונתז (בלי קובץ): זמזום מנוע שעולה עם המהירות, ורעש גלגלים. 💡 */
let VEH=null;
function mkVeh(){const sr=ctx.sampleRate,b=ctx.createBuffer(1,sr*2,sr),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+0.04*(Math.random()*2-1))/1.04;d[i]=l*4}
  const ns=ctx.createBufferSource();ns.buffer=b;ns.loop=true;const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=420;const rg=ctx.createGain();rg.gain.value=0.9;ns.connect(lp);lp.connect(rg);
  const os=ctx.createOscillator();os.type="sawtooth";os.frequency.value=200;const o2=ctx.createOscillator();o2.type="triangle";o2.frequency.value=400;const wl=ctx.createBiquadFilter();wl.type="bandpass";wl.frequency.value=600;wl.Q.value=2;const wg=ctx.createGain();wg.gain.value=0.06;os.connect(wl);o2.connect(wl);wl.connect(wg);
  const g=ctx.createGain();g.gain.value=0;rg.connect(g);wg.connect(g);const pn=ctx.createStereoPanner?ctx.createStereoPanner():null;if(pn){g.connect(pn);pn.connect(out)}else g.connect(out);
  ns.start();os.start();o2.start();VEH={g,pn,os,o2,wg,prev:new Map()};AMB.vehOK=true}
const b0=b=>Math.max(0,b.duration-0.1);
/* 136.2: רוח — רעש מסונן שמשתנה לאט (משבים), בלי קובץ 💡 */
let WIND=null;
function mkWind(){const sr=ctx.sampleRate,N=sr*4,b=ctx.createBuffer(1,N,sr),d=b.getChannelData(0);let b0_=0,b1=0,b2=0;for(let i=0;i<N;i++){const w=Math.random()*2-1;b0_=0.99765*b0_+w*0.099;b1=0.963*b1+w*0.2965;b2=0.57*b2+w*1.0526;d[i]=(b0_+b1+b2+w*0.1848)*0.18}
  /* קצוות הלולאה מתמזגים */const F=Math.floor(sr*0.3);for(let i=0;i<F;i++){const t=i/F;d[N-F+i]=d[N-F+i]*(1-t)+d[i]*t}
  const s=ctx.createBufferSource();s.buffer=b;s.loop=true;s.loopStart=F/sr;s.loopEnd=N/sr;const bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=450;bp.Q.value=0.6;const g=ctx.createGain();g.gain.value=0;s.connect(bp);bp.connect(g);g.connect(out);s.start();WIND={g,bp,gu:0.5};AMB.windOK=true}
/* 136.1: געיות בקר — קטעים בקובץ (שניות: התחלה, אורך) */
const MOOS=[[0,2.45],[2.6,1.45],[4.2,1.2],[5.55,1.55],[7.25,1.2],[8.6,1.6],[10.35,2.15],[12.65,2.19]];
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
function moo(vol,pan){if(!bufs.cattle||!ctx)return;const c=MOOS[Math.floor(Math.random()*MOOS.length)];if(c[0]+c[1]>bufs.cattle.duration+0.05)return;const s=ctx.createBufferSource(),g=ctx.createGain(),p=ctx.createStereoPanner?ctx.createStereoPanner():null;s.buffer=bufs.cattle;s.playbackRate.value=0.88+Math.random()*0.2;g.gain.value=vol;s.connect(g);if(p){p.pan.value=pan;g.connect(p);p.connect(out)}else g.connect(out);s.start(ctx.currentTime+0.02,c[0],Math.min(c[1],bufs.cattle.duration-c[0]))}
function panOf(S,near0,span){if(!S||!S[0])return 0;const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,dx=S[0][0]-camera.position.x,dz=S[0][1]-camera.position.z,dl=Math.hypot(dx,dz)||1;return(dx*rx+dz*rz)/(dl*rl)*0.8*sat((S[1]-near0)/span)}
let nextMoo=0;
function clink(vol){if(!bufs.coins||!ctx)return;const c=CLINKS[Math.floor(Math.random()*CLINKS.length)];if(c[0]+c[1]>bufs.coins.duration)return;const s=ctx.createBufferSource(),g=ctx.createGain(),p=ctx.createStereoPanner?ctx.createStereoPanner():null;s.buffer=bufs.coins;s.playbackRate.value=0.92+Math.random()*0.16;g.gain.value=vol;s.connect(g);if(p){p.pan.value=Math.max(-1,Math.min(1,((AMB.pan&&AMB.pan.market)||0)+Math.random()*0.4-0.2));g.connect(p);p.connect(out)}else g.connect(out);s.start(ctx.currentTime+0.02,c[0],c[1])}
/* 136.0: האם המצלמה במקום מקורה? מחזיר {lane, hall} (0..1): lane = מעבר צר ונמוך, hall = חלל גבוה.
   הרשימות: רחובות מקורים (__COVL, 18-old-city-areas), מעברי שערי העיר (__GPAS, gatePass), המעברים שמתחת להר (TUNS: חולדה וקיפונוס), שערי העזרות (GLIST), וההיכל (INTBOX) */
function encl(cp,x,n){const R={lane:0,hall:0,k:""};let gy=0;try{gy=groundAt(cp.x,cp.z)}catch(e){}const ha=cp.y-gy;
  if(INTBOX&&cp.x>INTBOX.x0&&cp.x<INTBOX.x1&&cp.z>INTBOX.z0&&cp.z<INTBOX.z1&&cp.y<INTBOX.y1){R.hall=1;R.k="היכל";return R}
  for(const L of (window.__COVL||[])){if(ha>L.h)continue;const P=L.p;for(let i=0;i<P.length-1;i++){if(segD(x,n,P[i],P[i+1])<=L.r+0.2){R.lane=1;R.k="רחוב מקורה";return R}}}
  for(const G of (window.__GPAS||[])){const dx=x-G.x,dn=n-G.n,c=Math.cos(G.rot),s=Math.sin(G.rot),a=dx*c+dn*s,b=-dx*s+dn*c;if(ha<G.ph+1&&G.cor.some(q=>a>q[0]-0.3&&a<q[1]+0.3&&b>q[2]-0.3&&b<q[3]+0.3)){R.lane=1;R.k="שער העיר";return R}}
  try{const T=tunAt(x,n,0);if(T){const dx=x-T.w.x,dn=n-T.w.n,dd=-(dx*T.w.ox+dn*T.w.on);/* המעבר מתחת לרחבה: אחרי פתח של כמה מטרים */if(dd>2&&cp.y<-0.5){R.lane=sat((dd-2)/6);R.k="מעבר "+T.nm;return R}}}catch(e){}
  if(COMP&&GLIST.length){const u=(cp.x-COMP.X0)/A,v=(COMP.N0+cp.z)/A;for(const g of GLIST){const a=g.axis==="e"?u-g.cu:v-g.cv,w=g.axis==="e"?v-g.cv:u-g.cu;if(Math.abs(w)>g.pass/2)continue;const d=a*g.outward-g.L/2;if(d<-1&&d>-g.L+1&&cp.y<(g.floor+18)*A){R.hall=0.55;R.lane=0.35;R.k="שער העזרה";return R}}}
  return R}
/* 140.0: כמה אנשים יש באמת סביב המצלמה: כל ההולכים, העומדים והקהל שבמודל (FIG.LOD.G, 20-living-city), עד 30 מ׳.
   הספירה כבדה, ולכן פעם בשנייה, וחוזרת אותה תוצאה בין לבין. קרוב (עד 8 מ׳) נספר כאדם שלם, רחוק פחות */
let PPL={t:0,x:1e9,z:1e9,c:0};
function people(x,y,z,force){const now=performance.now();if(!force&&now-PPL.t<1500&&Math.hypot(PPL.x-x,PPL.z-z)<6)return PPL.c;
  let c=0;try{const G=typeof FIG!=="undefined"&&FIG.LOD&&FIG.LOD.G;if(G)for(const e of G){const b=e.body;if(!b||!b.parent)continue;let q=b,vis=true;while(q){if(!q.visible){vis=false;break}q=q.parent}if(!vis)continue;
    const W=b.matrixWorld.elements,S=(e.swapped&&e.A[0].src)||b.instanceMatrix.array,N=Math.min(e.n,(e.cnt&&e.cnt[0])||b.count);
    /* קודם בודקים אם הקבוצה בכלל קרובה (לפי האדם הראשון והאחרון אין דרך; לכן סורקים, אבל במחיר נמוך) */
    for(let i=0;i<N;i++){const o=i*16;if(S[o]*S[o]+S[o+1]*S[o+1]+S[o+2]*S[o+2]<1e-4)continue;const lx=S[o+12],ly=S[o+13],lz=S[o+14],wx=W[0]*lx+W[4]*ly+W[8]*lz+W[12];if(Math.abs(wx-x)>30)continue;const wz=W[2]*lx+W[6]*ly+W[10]*lz+W[14];if(Math.abs(wz-z)>30)continue;const wy=W[1]*lx+W[5]*ly+W[9]*lz+W[13];if(Math.abs(wy-y)>20)continue;const d=Math.hypot(wx-x,wz-z);if(d<8)c+=1;else if(d<30)c+=(30-d)/22}}}catch(e){}
  if(!force)PPL={t:now,x,z,c};return c}
/* 136.1: בעלי החיים של המקדש (BEAST.HERDS, 30-temple-life): העדר הקרוב מכל סוג. כבשים ועזים פועים, בקר גועה 💡 */
const FLOCK={sheep:1,ram:1,goat:1,kid:1},CATTLE={bull:1,calf:1};let hwp=null;
function herds(cp){const H=window.__BEAST&&window.__BEAST.HERDS;const R={fd:1e9,fp:null,fn:0,cd:1e9,cp:null,cn:0};if(!H||typeof THREE==="undefined")return R;hwp=hwp||new THREE.Vector3();
  for(const h of H){if(!h.g.parent||!h.near||!h.near.count)continue;let q=h.g,vis=true;while(q){if(!q.visible){vis=false;break}q=q.parent}if(!vis)continue;
    hwp.copy(h.c);h.g.localToWorld(hwp);const d=Math.max(0,Math.hypot(hwp.x-cp.x,hwp.z-cp.z)-h.r*0.7);
    if(FLOCK[h.kind]){if(d<R.fd){R.fd=d;R.fp=[hwp.x,hwp.z]}if(d<30)R.fn+=h.near.count}
    else if(CATTLE[h.kind]){if(d<R.cd){R.cd=d;R.cp=[hwp.x,hwp.z]}if(d<40)R.cn+=h.near.count}}
  return R}
/* 136.2: מים: מעיין הגיחון (📜 מלכים א א, לג) ובריכת השילוח (📜 "מי השלח ההלכים לאט", ישעיה ח, ו) */
function waterD(x,n){let best=1e9,np=null,k="";const P=COD8&&COD8.pool;if(P){const dx=x-P.c[0],dn=n-P.c[1],a=dx*P.A[0]+dn*P.A[1],b=dx*P.U[0]+dn*P.U[1],ea=Math.max(0,Math.abs(a)-P.hl),eb=Math.max(0,Math.abs(b)-P.hw),d=Math.hypot(ea,eb);const ca=Math.max(-P.hl,Math.min(P.hl,a)),cb=Math.max(-P.hw,Math.min(P.hw,b));best=d;np=[P.c[0]+P.A[0]*ca+P.U[0]*cb,P.c[1]+P.A[1]*ca+P.U[1]*cb];k="pool"}
  for(const W of (window.__WATERS||[])){const d=Math.max(0,Math.hypot(x-W.x,n-W.n)-Math.max(W.hw,W.hl));if(d<best){best=d;np=[W.x,W.n];k=W.k}}
  return{d:best,np,k}}
function levels(P){const L={city:0,market:0,quiet:0,stream:0,birds:0,night:0,coins:0,steps:0,sheep:0,cattle:0,spring:0,wind:0,lane:0,hall:0,laver:0};
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
  /* 140.0: ההמולה לפי האנשים שבאמת סביבך: רחוב ריק = שקט יחסית, רחוב מלא = המולה. בסיס קטן נשאר תמיד (העיר שמסביב) 💡 */
  let gy0=0;try{gy0=groundAt(cp.x,cp.z)}catch(e){}const ppl=people(cp.x,gy0+1,cp.z,!!P),crowd=sat(ppl/25);if(!P)AMB.ppl=+ppl.toFixed(1);
  /* ברחבת הכותל ההמולה היא של תפילה (השכבה השקטה), ולא המולת רחוב */city=Math.max(city*0.45,Math.min(1,city*0.45+crowd*0.75*(1-mount*0.9)*(1-plaza*0.6)));
  /* השוק ⚖️: בשבת ובחג אין מקח וממכר (נחמיה יג, טו-יט; ביצה ה, ב), ובלילה החנויות סגורות 💡 */
  let market=mkt*(1-mount);
  /* הר הבית והעזרות ⚖️: מורא מקדש — "לא יקל אדם את ראשו כנגד שער המזרח" (ברכות ט, ה; רמב״ם בית הבחירה ז). רק המולה שקטה, בלי קולות שוק.
     בכותל: המולה שקטה של תפילה 💡 */
  let quiet=Math.max(mount*0.85,plaza*0.75);
  /* 140.0: גם בהר ובכותל — לפי הקהל שסביבך (בחג הקהל גדול יותר, וכך גם הקול) */quiet=Math.min(1,quiet*(0.6+0.6*crowd));
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
  /* 130.4: כלי הרכב שנוסעים במודל (24-transport). בשבת הרכבות לא נוסעות, וכך גם הקול */
  if(!P&&window.__VEH&&VEH){let best=null;const now=performance.now(),np=new Map();try{window.__VEH().forEach((v,i)=>{const key=v[2]+":"+i,pr=VEH.prev.get(key);np.set(key,[v[0],v[1],now]);const d=Math.hypot(v[0]-cp.x,-v[1]-cp.z);if(d>80||!pr)return;const dt=(now-pr[2])/1000,sp=dt>0?Math.hypot(v[0]-pr[0],v[1]-pr[1])/dt:0;if(sp<0.3||sp>40)return;const w=near(d,6,70)*(v[2]?1:0.7);if(!best||w>best.w)best={w,sp,x:v[0],z:-v[1],d}})}catch(e){}VEH.prev=np;
    if(best){L.veh=best.w*(1-mount*0.6);SRC.veh=[[best.x,best.z],best.d];AMB.vsp=best.sp}}
  /* 136.1: עדרי המקדש (במחנה הבדיקה, בדרך לעזרה, בלשכות). ⚖️ בשבת אין קרבנות יחיד (תמורה ב, א), ולכן העדרים עצמם קטנים; הקול הולך אחרי מה שיש במודל */
  {const hd=herds(cp),qn=night?0.35:1;if(hd.fp){const v=near(hd.fd,3,32)*sat(0.35+hd.fn/12)*qn;if(v>L.sheep){L.sheep=v;if(!P)SRC.sheep=[hd.fp,hd.fd]}AMB.fn=hd.fn}
    if(hd.cp){L.cattle=near(hd.cd,4,45)*sat(0.4+hd.cn/6)*qn;if(!P)SRC.cattle=[hd.cp,hd.cd];AMB.cn=hd.cn}}
  /* 136.2: מים: הגיחון נובע חזק יותר, השילוח רגוע ("ההלכים לאט") 💡 */
  {const w=waterD(x,n);if(w.np){const v=w.k==="gihon"?near(w.d,2,28)*0.9:near(w.d,2,34)*0.5;L.spring=v;if(!P)SRC.spring=[W(w.np),w.d]}}
  /* 140.2: הכיור שבעזרה: 📜 "בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים" (יומא ג, י) — הכהנים מקדשים ממנו ידיים ורגליים לפני העבודה (שמות ל, יט-כא). מים זורמים ביום, עד כ־18 מ׳ 💡 */
  {const LV=window.__LAVER;if(LV&&!night){const d=Math.max(0,Math.hypot(cp.x-LV[0],cp.z-LV[2])-1.5);L.laver=near(d,1,18)*(Math.abs(cp.y-LV[1])<12?1:0.3);if(!P)SRC.laver=[[LV[0],LV[2]],d]}}
  /* 136.2: רוח בגבהים פתוחים (הר הזיתים, הר הצופים): לפי גובה הקרקע מעל הר הבית, ורק מחוץ לעיר העתיקה 💡 */
  {let gy=0;try{gy=groundAt(cp.x,cp.z)}catch(e){}/* רק ברכס שממזרח לעיר (הר הזיתים), לא ברחובות העיר החדשה */L.wind=(inOld||x<150)?0:sat((gy-WIND0)/30)*(night?0.8:1)*(1-mount);AMB.gy=gy}
  /* 136.0: במקום מקורה: הד, וקולות של שטח פתוח (ציפורים, צרצרים, רוח, רכב) כמעט לא נשמעים */
  {const E=encl(cp,x,n);L.lane=E.lane;L.hall=E.hall;if(!P)AMB.encl=E.k;const ins=Math.max(E.lane,E.hall);if(ins>0){const f=1-0.8*ins;L.birds*=f;L.night*=f;L.wind*=1-ins;if(L.veh)L.veh*=f}}
  for(const k in L)if(k!=="lane"&&k!=="hall")L[k]*=hf;
  if(inHouse)for(const k in L)if(k!=="lane"&&k!=="hall"&&k!=="steps")L[k]*=0.12; /* בתוך ההיכל כמעט שקט 💡 (הצעדים וההד נשארים) */
  return L}
/* עוצמת בסיס לכל קובץ (אחרי נרמול), כדי שהשכבות יישבו יחד 💡 */
/* 136.2: מעל גובה זה (גובה קרקע בעולם; רחבת הכותל ‎-13, שער יפו 39, ראש הר הזיתים 61) מתחילה רוח */const WIND0=30;
const BASE={laver:0.4,spring:0.5,city:0.5,market:0.6,quiet:0.45,stream:0.55,birds:0.35,night:0.3,steps:0.55};
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
  out.gain.setTargetAtTime(1.25*AMB.v*duck,now,0.3);
  /* 130.2: כיוון — המקור משמאל או מימין למצלמה. כשעומדים בתוכו, הקול מכל הצדדים (באמצע) */
  {const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,cp=camera.position;
   for(const k in pans){const S=SRC[k==="market"&&L.coins>L.market*0.9?"coins":k];let v=0;if(S&&S[0]){const dx=S[0][0]-cp.x,dz=S[0][1]-cp.z,dl=Math.hypot(dx,dz);if(dl>0.5)v=(dx*rx+dz*rz)/(dl*rl)*0.8*sat((S[1]-3)/20)}AMB.pan=AMB.pan||{};AMB.pan[k]=v;pans[k].pan.setTargetAtTime(v,now,0.25)}}
  LOOPS.forEach(k=>{if(gains[k])gains[k].gain.setTargetAtTime(L[k]*BASE[k],now,k==="steps"?0.2:0.6)});
  /* 140.1: עמעום לפי מרחק: הגבוהים נבלעים באוויר ובקירות. צמוד = צלול, 60 מ׳ = עמום. ומלמעלה (מעל 30 מ׳) הכול קצת עמום 💡 */
  {const hm=Math.sqrt(Math.min(1,30/Math.max(30,AMB.h||1)));AMB.lp={};for(const k in lps){const S=SRC[k==="market"&&L.coins>L.market*0.9?"coins":k];const d=S&&S[0]?Math.max(0,S[1]):k==="steps"?0:4;const f=Math.max(700,Math.min(16000,16000*Math.exp(-d/22)))*hm;AMB.lp[k]=Math.round(f);lps[k].frequency.setTargetAtTime(f,now,0.5)}}
  if(VEH){const v=L.veh||0,sp=AMB.vsp||0;VEH.g.gain.setTargetAtTime(0.5*v,now,0.4);VEH.os.frequency.setTargetAtTime(120+sp*18,now,0.5);VEH.o2.frequency.setTargetAtTime(240+sp*36,now,0.5);
    if(VEH.pn){const S=SRC.veh;let pv=0;if(S&&S[0]&&v>0){const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,dx=S[0][0]-camera.position.x,dz=S[0][1]-camera.position.z,dl=Math.hypot(dx,dz)||1;pv=(dx*rx+dz*rz)/(dl*rl)*0.85*sat((S[1]-2)/12)}VEH.pn.pan.setTargetAtTime(pv,now,0.2)}}
  /* 136.0: הד */
  if(!REV){try{mkRev()}catch(e){REV=null;console.warn("amb rev",e)}}
  if(REV){revSet("lane",0.55*L.lane,now);revSet("hall",0.75*L.hall,now)}
  /* 136.2: רוח במשבים */
  if(WIND){WIND.gu=Math.max(0,Math.min(1,WIND.gu+(Math.random()-0.5)*0.18));WIND.g.gain.setTargetAtTime(0.32*(L.wind||0)*(0.45+0.55*WIND.gu),now,0.9);WIND.bp.frequency.setTargetAtTime(300+WIND.gu*550,now,1.2)}
  /* 136.1: בקר גועה מדי פעם; ככל שיש יותר בקר קרוב, לעתים קרובות יותר */
  if(L.cattle>0.05&&performance.now()>nextMoo){moo(0.6*L.cattle,panOf(SRC.cattle,2,12));nextMoo=performance.now()+(5000+Math.random()*10000)/Math.sqrt(Math.max(1,(AMB.cn||1)/2))}
  if(L.sheep>0.05&&performance.now()>nextBaa){const S=SRC.sheep;let pn=0;if(S&&S[0]){const e=camera.matrixWorld.elements,rx=e[0],rz=e[2],rl=Math.hypot(rx,rz)||1,dx=S[0][0]-camera.position.x,dz=S[0][1]-camera.position.z,dl=Math.hypot(dx,dz)||1;pn=(dx*rx+dz*rz)/(dl*rl)*0.8*sat((S[1]-2)/10)}baa(0.55*L.sheep,pn);nextBaa=performance.now()+(3500+Math.random()*7000)/Math.sqrt(Math.max(1,(AMB.fn||1)/4))}
  if(L.coins>0.02&&performance.now()>nextClink){clink(0.5*L.coins);nextClink=performance.now()+1800+Math.random()*4200}}
setInterval(tick,250);
AMB.set=v=>{AMB.on=!!v;try{localStorage.setItem("tm_amb",v?"1":"0")}catch(e){}if(v){unlock();tick()}else if(ctx&&out){out.gain.setTargetAtTime(0,ctx.currentTime,0.15)}};
/* לבדיקה (136.x) */AMB.tun=()=>TUNS().map(T=>({nm:T.nm,x:T.w.x,n:T.w.n,ox:T.w.ox,on:T.w.on,D:T.D}));AMB.gl=()=>GLIST.map(g=>({axis:g.axis,cu:g.cu,cv:g.cv,o:g.outward,L:g.L,f:g.floor}));AMB.gp=()=>(window.__GPAS||[]).map(G=>({x:G.x,n:G.n,rot:G.rot,c:G.cor[0]}));AMB.rev=()=>REV&&{lane:REV.lane.on,hall:REV.hall.on,lg:REV.lane.g.gain.value,hg:REV.hall.g.gain.value};
AMB.vol=v=>{AMB.v=Math.max(0.1,Math.min(1,+v||0.7));try{localStorage.setItem("tm_ambv",String(Math.round(AMB.v*100)))}catch(e){}if(AMB.on&&ctx&&out)out.gain.setTargetAtTime(1.25*AMB.v,ctx.currentTime,0.1)};
AMB.levels=()=>{try{return levels()}catch(e){return{err:String(e)}}};
/* לבדיקה: העוצמות בנקודה (x מזרח, n צפון במטרים מנקודת הייחוס של המפה), בגובה h מעל הקרקע */
AMB.at=(gx,gn,h)=>{try{const s=G2S(gx,gn),x=s[0],z=-s[1];let gy=0;try{gy=groundAt(x,z)}catch(e){}return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
AMB.atS=(x,z,h)=>{let gy=0;try{gy=groundAt(x,z)}catch(e){}try{return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
AMB.w=(gx,gn)=>{const s=G2S(gx,gn);return[s[0],-s[1]]};AMB.src=()=>SRC;AMB.g=()=>S2G(camera.position.x,-camera.position.z);
AMB.atU=(u,v,h)=>{try{const x=COMP.X0+u*A,z=-(COMP.N0-v*A);let gy=0;try{gy=groundAt(x,z)}catch(e){}return levels({x,y:gy+(h||2),z})}catch(e){return{err:String(e)}}};
})();
