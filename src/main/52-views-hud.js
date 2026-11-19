// ---- views & tour ----
function mizY(u,v){const R=AMZR;if(!R)return null;
  /* v102 · משימה 12: רצפת המזבח והכבש מאותם משטחים בנויים — בלי טווחים מקוצרים נפרדים. רוחבים לפי ב, ז (כניסת 5 טפחים). */
  const{AU,AV,y0,yY,yS,yH,Y,h0,hY,hS,rampU0,rampU1,rampV0,rampV1,RL}=R,W=y=>(y+Y)*A;
  const rampH=vv=>y0+(yH-y0)*(rampV1-vv)/RL;
  if(u>=rampU0&&u<=rampU1&&v>=rampV0&&v<=rampV1)return W(rampH(v));
  if(R.kw)for(const k of R.kw){if(u>=k.u0&&u<=k.u1&&v>=k.v0&&v<=k.v1){const t=Math.max(0,Math.min(1,(k.uRamp-u)/(k.uRamp-k.uLed)));return W(rampH(v)+(k.yLed-rampH(v))*t)}}
  const du=u-AU,dv=v-AV,adu=Math.abs(du),adv=Math.abs(dv);
  if(adu<=hS&&adv<=hS)return W(yH);
  if(adu<=hY&&adv<=hY)return W(yS);
  if((du>=-h0&&du<=-hY&&v>=AV-h0&&v<=AV+h0)||(dv>=-h0&&dv<=-hY&&u>=AU-h0&&u<=AU+h0)||(v>=AV+hY&&v<=AV+h0&&u>=AU-h0&&u<=AU-h0+1)||(u>=AU+hY&&u<=AU+h0&&v>=AV-h0&&v<=AV-h0+1))return W(yY);
  return null}
function tunFloor(x,n){if(typeof GATEG!=="undefined"&&!GATEG.visible)return null;const g=S2G(x,n),T=tunAt(g[0],g[1],0);if(!T)return null;
  /* v101 · משימה 01: רצפת המעבר המקורה (חולדה, קיפונוס) מאותה רשומת TUNS שבונה את המדרגות: סף, מדרגה i בגובה thr+(i+1)h לאורך run(i), רחבות כל FL מדרגות */
  const dx=g[0]-T.w.x,dn=g[1]-T.w.n,al=dx*T.fx+dn*T.fn,d=-(dx*T.w.ox+dn*T.w.on);if(Math.abs(al)>T.tw/2||d<0||d>T.tot)return null;if(d<0.4)return T.thr;
  for(let i=0;i<T.N;i++){const d0=T.run(i),dd=T.tread+((i%T.FL===T.FL-1)&&i<T.N-1?T.LAND:0);if(d>=d0&&d<d0+dd)return T.thr+(i+1)*T.h}return T.thr+T.N*T.h}
function groundAt(x,z){const n=-z;
  if(COMP){const u=(x-COMP.X0)/A,v=(COMP.N0-n)/A;
    for(const g of GLIST){const a=g.axis==="e"?u-g.cu:v-g.cv,w=g.axis==="e"?v-g.cv:u-g.cu;if(Math.abs(w)>g.pass/2+1)continue;const d=a*g.outward-g.L/2;
      if(d>=0&&d<=g.n)return(g.y0+(g.n-d)*0.5)*A;if(d<0&&d>=-g.L&&g.floor>4&&Math.abs(w)<=g.pass/2)return g.floor*A}
    if(u>=0&&u<=500&&v>=0&&v<=500){
      if(u>=203&&u<=203+COMP.nst&&v>=236&&v<=264)return(13.5-6*(u-203)/COMP.nst)*A;
      if(u>=242&&u<=258&&v>=264&&v<=296.1)return(7.5+Math.min(9,9*(296.1-v)/32))*A;
      if(u>=236&&u<=264&&v>=236&&v<=264)return 16.5*A;
      /* 125.0 (ביקורת 32): המדרגות אל המנח (12 של חצי אמה, בצפון ובדרום) הן גם הרצפה של ההולך, באותו פרופיל כמו האבנים */
      if(COMP.nst===10&&u>=137&&u<=143){const d=v<COMP.vmin?COMP.vmin-v:v>COMP.vmax?v-COMP.vmax:-1;if(d>=0&&d<=12)return(13.5-0.5*Math.ceil(d))*A}
      if(u>=98&&u<=203&&v>=COMP.vmin&&v<=COMP.vmax)return 13.56*A;if(u<=300&&v>=200&&v<=300)return 7.5*A;return 3.5*A}}
  {const tf=tunFloor(x,n);if(tf!=null)return tf}if(inPoly(x,n,MOUNT_S))return 0;{const g=S2G(x,n),cy=cardoY(g[0],g[1]);if(cy!=null)return cy;const dl=DUNG.lotY(g[0],g[1]);return dl!=null?dl:surfY(g[0],g[1])}}
function inCompBox(x,z){if(!COMP)return false;const u=(x-COMP.X0)/A,v=(COMP.N0+z)/A;return u>=-3&&u<=503&&v>=-3&&v<=503}
/* 125.3 (ביקורת ז27, עשרת המסלולים): צעד אחד בהליכה. חוץ מחסימה, מחוץ למתחם לא מטפסים על קיר (עלייה של יותר מ־1.2 מ׳ בתת־צעד של 0.3 מ׳ — שפת כביש או מדרגה גבוהה עוד עוברות)
   ולא נופלים מקצה (ירידה של יותר מ־2.2 מ׳). מדרגות ושיפועים רגילים עולים פחות מזה. בתוך המתחם הכללים הקודמים נשארים בדיוק כמו שהם */
function canStep(x0,z0,x1,z1){const feet=groundAt(x0,z0);if(blocked(x1,z1,feet))return false;if(inCompBox(x1,z1)&&inCompBox(x0,z0))return true;
  const g=groundAt(x1,z1);if(!isFinite(g))return false;return !(g-feet>1.2||feet-g>2.2)}
function blocked(x,z,feet){
  // Keep walking on the altar/ramp surface, not inside its solid tiers.
  // The 0.55 m drop limit also protects the ramp sides below altar-top height.
  if(COMP&&feet>7.5*A+0.55){const u=(x-COMP.X0)/A,v=(COMP.N0+z)/A;
    if(u>=232&&u<=268&&v>=232&&v<=300&&feet-groundAt(x,z)>0.55)return true}
  /* 125.3 (ביקורת 30): מחוץ למתחם — בתי העיר, חומת העיר ומגדליה חוסמים */
  if(!inCompBox(x,z)){const g=S2G(x,-z);if(cityHit(g[0],g[1],feet))return true}
  const r=0.6;for(const c of COL){if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&c.y1>feet+0.55&&c.y0<feet+1.7)return true}
  /* v101 · משימה 08: דלתות השער הפנימי המזרחי — אותו מצב (EGATE.visible, לפי gateDoors: יום ושעה) קובע גם נראות וגם חסימה. דלת סגורה עוצרת את הגוף; פתוחה — מעבר חופשי */
  if(EGATE&&EGATE[0]&&EGATE[0].visible){if(!EGATE._c)EGATE._c=EGATE.map(m=>new THREE.Box3().setFromObject(m));for(const b of EGATE._c){if(x>b.min.x-r&&x<b.max.x+r&&z>b.min.z-r&&z<b.max.z+r&&b.max.y>feet+0.55&&b.min.y<feet+1.7)return true}}return false}
const JOY={x:0,y:0};
// מכונות מצב (7.11.2026): יציאה אחת מכל מצבי המצלמה — סיור מסופר, רכיבה ברכבת, הליכה, רחפן וטיסה. כל כניסה למצב חדש עוברת כאן, כדי ששני מצבים לא יפעלו יחד
function endModes(keepStory){if(STORY&&!keepStory)STORY.stop();if(TRN&&TRN.riding)TRN.stopRide();if(WALK)stopWalk();if(DRONE)stopDrone();tween=null}
let DRONE=false,WALK=false,yaw=0,pitch=0;const keys={};
function syncWalkHud(){const off=WALK||DRONE,zg=document.querySelector(".zgrp");if(zg)zg.querySelectorAll("button").forEach(b=>{b.disabled=off;b.setAttribute("aria-disabled",off?"true":"false");b.title=off?"בהליכה וברחפן כפתורי הזום אינם פעילים. בהליכה גובה העין קבוע, ומתקרבים בצעידה.":(b.getAttribute("aria-label")||"")});const c=document.getElementById("compass");if(c){const t=WALK?"בהליכה: לחצו כדי לפנות צפונה":"צפון — לחצו כדי לפנות צפונה";c.title=t;c.setAttribute("aria-label",t)}}
/* 125.0 (ביקורת 40): במסך מגע לא מזכירים מקלדת */
/* 126.1 (בדיקה חוזרת 40): במכשיר משולב (מסך מגע עם עכבר או מקלדת) ההוראות לפי מה שהמשתמש עושה בפועל: הנגיעה האחרונה או המקש האחרון, ולא לפי סוג המסך בלבד */
let LASTPT=null,USEDKB=false;addEventListener("pointerdown",e=>{LASTPT=e.pointerType},{capture:true,passive:true});addEventListener("keydown",e=>{if(/^(w|a|s|d|arrow)/i.test(e.key))USEDKB=true},{capture:true,passive:true});
const isTouchUI=()=>{try{if(LASTPT)return LASTPT==="touch"||LASTPT==="pen";return matchMedia("(pointer:coarse)").matches&&!matchMedia("(pointer:fine)").matches}catch(e){return false}};
const kbToo=()=>{try{return USEDKB||matchMedia("(any-pointer:fine)").matches}catch(e){return USEDKB}};
/* 126.1 (בדיקה חוזרת 28): כשמתחילים ללכת ליד יעד מסמנים את היעד בעמוד אור ובשורה בהוראות: כמה מטרים ולאן, עד שמגיעים אליו */
let WGOAL=null;function clearGoal(){if(WGOAL){clearInterval(WGOAL.t);scene.remove(WGOAL.m);WGOAL.m.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});WGOAL=null}}
function WALKGOAL(at,best){clearGoal();const m=new THREE.Group();const mat=new THREE.MeshBasicMaterial({color:0x3b82f6,transparent:true,opacity:0.45,depthWrite:false});
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,14,12,1,true),mat);beam.position.y=7;m.add(beam);const ring=new THREE.Mesh(new THREE.RingGeometry(1.4,1.9,32),mat.clone());ring.rotation.x=-Math.PI/2;ring.position.y=0.08;m.add(ring);
  m.position.set(at.x,floorAt(at.x,at.z),at.z);m.renderOrder=5;scene.add(m);
  const msg=()=>{const d=Math.hypot(camera.position.x-at.x,camera.position.z-at.z);return d};const say=d=>{const wh=document.getElementById("walkhint");if(wh&&!wh.hidden&&wh.dataset.base)wh.textContent=(d<5?"הגעת ליעד. ":"היעד מסומן בעמוד אור כחול, "+Math.round(d)+" מ׳ ממך. ")+wh.dataset.base};
  WGOAL={m,t:setInterval(()=>{if(!WALK){clearGoal();return}const d=msg();beam.material.opacity=0.3+0.2*Math.sin(performance.now()/300);say(d);if(d<5){setTimeout(clearGoal,2500);clearInterval(WGOAL.t)}},400)};
  if(!best){const wh=document.getElementById("walkhint");if(wh)wh.dataset.pre="לא נמצא מקום פנוי ממש ליד היעד, לכן ההליכה מתחילה בכניסה. "}}
/* 125.0 (ביקורת 28): startWalk(נקודה) — «התחל הליכה כאן» מכרטיס מקום. מחפשים סביב היעד מקום פנוי לעמוד בו, בצד שממנו מסתכלים, ופונים אל היעד */
function startWalk(at){const intro=document.getElementById("intro");if(intro)intro.hidden=true;const cam0=camera.position.clone();camSaved=false;endModes(true);try{closeDr()}catch(e){}WALK=true;controls.enabled=false;clearGoal();let p=COMP?(([COMP.X0+250*A,-(COMP.N0+30*A)])):[100,-300],face=null;
  if(at&&at.isVector3){const a0=Math.atan2(cam0.z-at.z,cam0.x-at.x);let best=null;
    find:for(const r of[5,8,12,17,24,32,44])for(let k=0;k<16;k++){const a=a0+(k%2?1:-1)*Math.ceil(k/2)*Math.PI/8,x=at.x+Math.cos(a)*r,z=at.z+Math.sin(a)*r,g=groundAt(x,z);if(!isFinite(g))continue;if(!blocked(x,z,g)){best=[x,z];break find}}
    if(best){p=best;face=at}WALKGOAL(at,best)}
  camera.position.set(p[0],groundAt(p[0],p[1])+1.65,p[1]);yaw=face?Math.atan2(-(face.x-p[0]),-(face.z-p[1])):Math.PI;pitch=0.02;camera.rotation.order="YXZ";camera.rotation.set(pitch,yaw,0);
  document.getElementById("pad").hidden=false;D.fast=false;{const fb=document.getElementById("fastB");fb.hidden=false;fb.setAttribute("aria-pressed","false")}const wh=document.getElementById("walkhint");wh.textContent=isTouchUI()?"גוררים באצבע כדי להסתכל מסביב · העיגול למטה כדי ללכת · דחיפה עד הסוף או כפתור ״מהר״ — הליכה מהירה"+(kbToo()?" · עם מקלדת: W A S D או החצים":""):"גוררים כדי להסתכל מסביב · העיגול (או W A S D / החצים) כדי ללכת · Shift או כפתור ״מהר״ — הליכה מהירה";wh.dataset.base=wh.textContent;if(wh.dataset.pre){wh.textContent=wh.dataset.pre+wh.textContent;wh.dataset.pre=""}wh.hidden=false;syncWalkHud()}
const D={h:20,vx:0,vz:0,fast:false,tw:null,pinch:0};
function startDrone(){camSaved=false;endModes(true);DRONE=true;controls.enabled=false;syncWalkHud();const fw=new THREE.Vector3();camera.getWorldDirection(fw);yaw=Math.atan2(-fw.x,-fw.z);pitch=-0.5;D.vx=D.vz=0;D.h=20;
  const cp=camera.position,lim=380;cp.x=Math.max(C.x-lim,Math.min(C.x+lim,cp.x));cp.z=Math.max(C.z-lim,Math.min(C.z+lim,cp.z));if(camera.position.distanceTo(C)>300||!COMP){if(COMP){const W2=(u,v)=>[COMP.X0+u*A,-(COMP.N0-v*A)],q=W2(300,470),h=W2(200,250);cp.set(q[0],0,q[1]);yaw=Math.atan2(-(h[0]-q[0]),-(h[1]-q[1]))}else{cp.set(C.x+170,0,C.z+210);yaw=Math.atan2(170,210)}}cp.y=floorAt(cp.x,cp.z)+D.h;
  document.getElementById("pad").hidden=false;document.getElementById("fastB").hidden=false;const wh=document.getElementById("walkhint");wh.textContent=isTouchUI()?"רחפן: העיגול — קדימה, אחורה ופנייה · גרירה — מבט · צביטה — גובה · נגיעה במבנה — טיסה אליו":"רחפן: W/S או העיגול — קדימה ואחורה · A/D — פנייה · גרירה — מבט · גלגלת או צביטה — גובה · לחיצה על מבנה — טיסה אליו";wh.hidden=false}
function stopDrone(){if(TRN&&TRN.riding)TRN.stopRide();if(!DRONE)return;DRONE=false;syncWalkHud();D.tw=null;controls.enabled=true;const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));controls.target.copy(camera.position).addScaledVector(f,40);controls.target.y=camera.position.y-25;controls.update();document.getElementById("pad").hidden=true;document.getElementById("fastB").hidden=true;document.getElementById("walkhint").hidden=true}
function droneFly(pt){const cp=camera.position,dx=pt.x-cp.x,dz=pt.z-cp.z,L=Math.hypot(dx,dz)||1,back=Math.max(30,D.h*1.6);const p1=new THREE.Vector3(pt.x-dx/L*back,0,pt.z-dz/L*back);p1.y=Math.max(floorAt(p1.x,p1.z)+D.h,pt.y+6);let y1=Math.atan2(-dx,-dz);while(y1-yaw>Math.PI)y1-=2*Math.PI;while(y1-yaw<-Math.PI)y1+=2*Math.PI;D.vx=D.vz=0;D.tw={p0:cp.clone(),p1,y0:yaw,y1,s:performance.now()}}
function droneTick(dt){const cp=camera.position;
  if(D.tw){const k=Math.min(1,(performance.now()-D.tw.s)/2000),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;cp.lerpVectors(D.tw.p0,D.tw.p1,e);cp.y+=Math.sin(Math.PI*e)*8;yaw=D.tw.y0+(D.tw.y1-D.tw.y0)*e;pitch+=((-0.45)-pitch)*Math.min(1,dt*3);if(k>=1){D.tw=null;D.h=Math.max(8,Math.min(60,cp.y-floorAt(cp.x,cp.z)))}}
  else{const fw=Math.max(-1,Math.min(1,(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-JOY.y)),tr=Math.max(-1,Math.min(1,(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+JOY.x));
    yaw-=tr*1.3*dt;const sp=(3+D.h*0.55)*((keys.shift||D.fast)?2:1),tvx=-Math.sin(yaw)*fw*sp,tvz=-Math.cos(yaw)*fw*sp,a=1-Math.exp(-dt/0.13);D.vx+=(tvx-D.vx)*a;D.vz+=(tvz-D.vz)*a;
    const lim=420,hit=(x,z)=>{for(const c of COL){if(x>c.x0-1.2&&x<c.x1+1.2&&z>c.z0-1.2&&z<c.z1+1.2&&c.y1>cp.y-1.5&&c.y0<cp.y+1)return true}return false};
    let nx=Math.max(C.x-lim,Math.min(C.x+lim,cp.x+D.vx*dt)),nz=Math.max(C.z-lim,Math.min(C.z+lim,cp.z+D.vz*dt));
    if(!hit(nx,nz)){cp.x=nx;cp.z=nz}else if(!hit(nx,cp.z)){cp.x=nx;D.vz*=0.3}else if(!hit(cp.x,nz)){cp.z=nz;D.vx*=0.3}else{D.vx=D.vz=0}
    const gy=floorAt(cp.x,cp.z)+D.h;cp.y+=(gy-cp.y)*Math.min(1,dt*3)}
  pitch=Math.max(-1.047,Math.min(-0.175,pitch));camera.rotation.order="YXZ";camera.rotation.set(pitch,yaw,0)}
renderer.domElement.addEventListener("touchstart",e=>{if(DRONE&&e.touches.length===2)D.pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
renderer.domElement.addEventListener("touchmove",e=>{if(DRONE&&e.touches.length===2&&D.pinch){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);D.h=Math.max(8,Math.min(60,D.h*D.pinch/d));D.pinch=d}},{passive:true});
document.getElementById("fastB").addEventListener("click",e=>{D.fast=!D.fast;e.currentTarget.setAttribute("aria-pressed",D.fast?"true":"false")});
function stopWalk(){if(!WALK)return;WALK=false;if(PER.on){PER.on=false;if(PER.g)PER.g.visible=false;clearTimeout(PER.ht)}controls.enabled=true;syncWalkHud();const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));controls.target.copy(camera.position).addScaledVector(f,25);controls.update();document.getElementById("pad").hidden=true;document.getElementById("fastB").hidden=true;D.fast=false;document.getElementById("walkhint").hidden=true}
window.addEventListener("keydown",e=>{if(!WALK&&!DRONE)return;const k=e.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","shift"].includes(k)){keys[k]=true;e.preventDefault()}});
window.addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false});
(function(){const pad=document.getElementById("pad"),knob=document.getElementById("knob");let id=null;
  const set=e=>{const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2-14;let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l}JOY.x=dx/R;JOY.y=dy/R;knob.style.transform="translate("+dx+"px,"+dy+"px)"};
  pad.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;try{pad.setPointerCapture(id)}catch(_){}set(e)});
  pad.addEventListener("pointermove",e=>{if(e.pointerId===id)set(e)});
  const end=e=>{if(e.pointerId!==id)return;id=null;JOY.x=JOY.y=0;knob.style.transform=""};pad.addEventListener("pointerup",end);pad.addEventListener("pointercancel",end)
  /* 126.1 (בדיקה חוזרת, ב): כשהחלון מאבד מיקוד או הדף מוסתר, שום מקש או ג׳ויסטיק לא נשארים "לחוצים" */
  const release=()=>{for(const k in keys)keys[k]=false;id=null;JOY.x=JOY.y=0;knob.style.transform=""};
  window.addEventListener("blur",release);window.addEventListener("pagehide",release);document.addEventListener("visibilitychange",()=>{if(document.hidden)release()});pad.addEventListener("lostpointercapture",end)})();
let look=null;renderer.domElement.addEventListener("pointerdown",e=>{if(WALK||DRONE){look=[e.clientX,e.clientY,yaw,pitch,e.pointerId]}});
renderer.domElement.addEventListener("pointermove",e=>{if((WALK||DRONE)&&look&&e.pointerId===look[4]&&!(DRONE&&D.pinch&&e.pointerType==="touch"&&e.isPrimary===false)&&!(PER.pinch&&e.pointerType==="touch")){yaw=look[2]+(e.clientX-look[0])*0.005;pitch=Math.max(-1.1,Math.min(1.1,look[3]+(e.clientY-look[1])*0.004))}});
window.addEventListener("pointerup",e=>{if(look&&e.pointerId===look[4])look=null});
/* 128.3 · הולך (שמואל: "בגובה בן אדם בכל המודל, כמו GTA"): דמות שהולכת, ומצלמה מאחוריה. משתמש באותה הליכה (WALK): אותם מקשים, אותו עיגול, אותם כללי חסימה (canStep).
   ההבדל: העיגול מזיז את הדמות ביחס לכיוון המצלמה, הדמות פונה לכיוון ההליכה, וגרירה מסובבת את המצלמה סביבה. גלגלת או צביטה: מצלמה קרובה או רחוקה, עד מבט מהעיניים.
   קיר בין המצלמה לדמות מקרב את המצלמה, כדי שהיא לא תיכנס לתוך קיר או בית */
const PER={on:false,p:new THREE.Vector3(),hd:0,D:4.5,cd:4.5,g:null,b:null,h:null,pinch:0,o:new THREE.Object3D()};
function perMesh(){if(PER.g)return;const g=new THREE.Group(),b=FIG.mesh(1,FIG.mat(0xffffff)),h=new THREE.InstancedMesh(FIG.head(),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.8}),1);
  b.setColorAt(0,new THREE.Color(0x3e5c7a));h.setColorAt(0,new THREE.Color(0xc99a74));b.frustumCulled=h.frustumCulled=false;b.userData.noLOD=h.userData.noLOD=true;b.castShadow=h.castShadow=true;g.add(b,h);g.visible=false;scene.add(g);PER.g=g;PER.b=b;PER.h=h}
function perSpot(at){for(const r of[0,1.5,3,5,8,12,17,24,34,48,66])for(let k=0;k<(r?16:1);k++){const a=k*Math.PI/8,x=at.x+Math.cos(a)*r,z=at.z+Math.sin(a)*r,g=groundAt(x,z);if(isFinite(g)&&!blocked(x,z,g))return[x,z]}return null}
function startPerson(at){const intro=document.getElementById("intro");if(intro)intro.hidden=true;const fw=new THREE.Vector3();camera.getWorldDirection(fw);
  if(!at){try{const r=renderer.domElement.getBoundingClientRect(),N=window.__NAV;at=N.groundHit(N.rayAt(r.left+r.width/2,r.top+r.height*0.55))}catch(e){}if(!at)at=controls.target.clone()}
  let sp=perSpot(at);if(!sp&&COMP)sp=[COMP.X0+250*A,-(COMP.N0+30*A)];if(!sp)sp=[100,-300];
  camSaved=false;endModes(true);try{closeDr()}catch(e){}try{closeInfo()}catch(e){}perMesh();WALK=true;PER.on=true;controls.enabled=false;clearGoal();
  PER.p.set(sp[0],groundAt(sp[0],sp[1]),sp[1]);yaw=Math.atan2(-fw.x,-fw.z);pitch=0;PER.hd=Math.atan2(Math.cos(yaw),-Math.sin(yaw));PER.D=PER.cd=4.5;camera.rotation.order="YXZ";
  document.getElementById("pad").hidden=false;D.fast=false;{const fb=document.getElementById("fastB");fb.hidden=false;fb.setAttribute("aria-pressed","false")}
  const wh=document.getElementById("walkhint");wh.textContent=isTouchUI()?"העיגול — הליכה (עד הסוף — ריצה) · גרירה — סיבוב המצלמה · צביטה — קרוב או רחוק":"W A S D או החצים — הליכה · Shift — ריצה · גרירה — סיבוב המצלמה · גלגלת — קרוב או רחוק";wh.dataset.base=wh.textContent;wh.hidden=false;clearTimeout(PER.ht);PER.ht=setTimeout(()=>{if(PER.on)wh.hidden=true},9000);
  syncWalkHud();perTick(0.016,0.016)}
PER.rc=new THREE.Raycaster();let PCL=null;
function perCols(){const now=performance.now();if(PCL&&now-PCL.t<4000)return PCL.a;const a=[];scene.traverseVisible(o=>{if(!o.isMesh||o===PER.b||o===PER.h||o.isSkinnedMesh)return;const g=o.geometry,m=o.material;if(!g||!g.attributes||!g.attributes.position||g.attributes.lg||!m||Array.isArray(m))return;if((m.transparent&&m.opacity<0.6)||m.colorWrite===false||m.depthWrite===false)return;const n=g.attributes.position.count;if(o.isInstancedMesh?n>300:n>6000)return;a.push(o)});PCL={t:now,a};return a}
function perCamHit(q){const fl=floorAt(q.x,q.z);if(q.y<fl+0.25)return true;for(const c of COL){if(q.x>c.x0-0.25&&q.x<c.x1+0.25&&q.z>c.z0-0.25&&q.z<c.z1+0.25&&q.y>c.y0-0.25&&q.y<c.y1+0.25)return true}
  if(!inCompBox(q.x,q.z)){const g=S2G(q.x,-q.z);if(cityHit(g[0],g[1],q.y-1.2))return true}return false}
function perTick(dt,rawdt){const fwI=Math.max(-1,Math.min(1,(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-JOY.y)),stI=Math.max(-1,Math.min(1,(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+JOY.x));
  const nm=Math.hypot(fwI,stI),fwN=nm>1?fwI/nm:fwI,stN=nm>1?stI/nm:stI,run=keys.shift||D.fast||Math.hypot(JOY.x,JOY.y)>0.92,sp=(run?6.5:2.5)*Math.min(0.5,rawdt);
  const mvx=(-Math.sin(yaw)*fwN+Math.cos(yaw)*stN)*sp,mvz=(-Math.cos(yaw)*fwN-Math.sin(yaw)*stN)*sp,p=PER.p,x0=p.x,z0=p.z;
  {const ml=Math.hypot(mvx,mvz),ns=Math.min(40,Math.max(1,Math.ceil(ml/0.3))),sx=mvx/ns,sz=mvz/ns;for(let i=0;i<ns;i++){if(canStep(p.x,p.z,p.x+sx,p.z+sz)){p.x+=sx;p.z+=sz}else if(canStep(p.x,p.z,p.x+sx,p.z)){p.x+=sx}else if(canStep(p.x,p.z,p.x,p.z+sz)){p.z+=sz}else break}}
  const moved=Math.hypot(p.x-x0,p.z-z0),v=rawdt>0?moved/rawdt:0;
  if(nm>0.05){const want=Math.atan2(-mvz,mvx);let d=want-PER.hd;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;PER.hd+=d*Math.min(1,dt*10)}
  const gy=groundAt(p.x,p.z);p.y+=(gy-p.y)*Math.min(1,dt*9);if(Math.abs(gy-p.y)>3)p.y=gy;
  const b=PER.b,h=PER.h,o=PER.o;b.setAmp(0,moved>0.002?1:0);b.setSp(0,Math.max(1,v));o.position.copy(p);o.rotation.set(0,PER.hd,0);o.scale.setScalar(1);o.updateMatrix();b.setMatrixAt(0,o.matrix);b.instanceMatrix.needsUpdate=true;o.position.y+=1.56;o.updateMatrix();h.setMatrixAt(0,o.matrix);h.instanceMatrix.needsUpdate=true;
  if(PER.D<0.8){PER.g.visible=false;camera.position.set(p.x,p.y+1.65,p.z);camera.rotation.set(pitch,yaw,0);return}
  PER.g.visible=true;const head=new THREE.Vector3(p.x,p.y+1.55,p.z),e=Math.max(-0.3,Math.min(1.3,0.22-pitch)),DW=PER.D*(camera.aspect<1?1.35:1),dir=new THREE.Vector3(Math.sin(yaw)*Math.cos(e),Math.sin(e),Math.cos(yaw)*Math.cos(e)),q=new THREE.Vector3();
  let dd=DW;for(let s=0.35;s<=DW+0.01;s+=0.25){q.copy(head).addScaledVector(dir,s);if(perCamHit(q)){dd=Math.max(0.35,s-0.3);break}}
  /* גם קרן אמיתית אל המבנים המצוירים (חומות, מגדלים, בתים קטנים), כי לא לכל מבנה יש תיבת חסימה. כל פריים שני, רק עצמים קטנים ותיבות מרובות (לא הרשתות הגדולות המאוחדות) */
  if((PER.f=(PER.f||0)+1)%2===0||PER.rh==null){PER.rc.set(head,dir);PER.rc.far=DW+0.4;const hs=PER.rc.intersectObjects(perCols(),false);PER.rh=hs.length?hs[0].distance:1e9}if(PER.rh<1e8)dd=Math.min(dd,Math.max(0.35,PER.rh-0.4));
  PER.cd=dd<PER.cd?dd:PER.cd+(dd-PER.cd)*Math.min(1,dt*2.5);camera.position.copy(head).addScaledVector(dir,PER.cd);camera.lookAt(head.x,head.y+0.6,head.z);
  PER.g.visible=PER.cd>0.6}
function perExit(){if(!PER.on){const h=document.getElementById("homeB");if(h)h.click();return}const p=PER.p.clone(),f=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));stopWalk();
  const t=p.clone();t.y+=1;const np=p.clone().addScaledVector(f,55);np.y=p.y+55;try{safeCam(np,t)}catch(e){}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:np,t1:t,start:performance.now(),dur:reduce?1:1400}}
renderer.domElement.addEventListener("wheel",e=>{if(!PER.on)return;e.preventDefault();const dy=e.deltaMode===1?e.deltaY*33:e.deltaY;let d=PER.D;if(d<0.8&&dy>0)d=1.2;else d=d*Math.exp(Math.max(-200,Math.min(200,dy))*0.0018);PER.D=d<0.9?0:Math.min(9,d)},{passive:false});
renderer.domElement.addEventListener("touchstart",e=>{if(PER.on&&e.touches.length===2){PER.pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);look=null}},{passive:true});
renderer.domElement.addEventListener("touchmove",e=>{if(PER.on&&e.touches.length===2&&PER.pinch){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);let v=PER.D<0.8?(d<PER.pinch?1.2:0):PER.D*PER.pinch/d;PER.D=v<0.9?0:Math.min(9,v);PER.pinch=d}},{passive:true});
renderer.domElement.addEventListener("touchend",e=>{if(e.touches.length<2)PER.pinch=0},{passive:true});
window.__PERSON={start:startPerson,exit:perExit,on:()=>PER.on,state:()=>({x:+PER.p.x.toFixed(2),y:+PER.p.y.toFixed(2),z:+PER.p.z.toFixed(2),D:PER.D,cd:+PER.cd.toFixed(2),vis:!!(PER.g&&PER.g.visible),cam:camera.position.toArray().map(v=>+v.toFixed(1))})};
// #18 B1: OrbitControls holds the camera at most 80° from straight up when far (over 160 m) and just under level when near (core/31).
// A pose past that limit was pulled up by the controls the moment a flight ended (olives 34 m, city 56 m). Here the pose itself is moved to the limit, keeping its distance.
function fixPhi(p,t){const o=p.clone().sub(t),L=o.length();if(L<1e-6)return[p,t];const lim=L>160?THREE.MathUtils.degToRad(79.5):Math.PI*0.495,phi=Math.acos(Math.max(-1,Math.min(1,o.y/L)));
  if(phi>lim){const hz=Math.hypot(o.x,o.z)||1,k=L*Math.sin(lim)/hz;p.set(t.x+o.x*k,t.y+L*Math.cos(lim),t.z+o.z*k)}return[p,t]}
function camAt(p,t){fixPhi(p,t);camSaved=false;camLim=1e9;try{tween=null}catch(e){}try{if(window.__STORY&&window.__STORY.S)window.__STORY.S.move=null}catch(e){}camera.position.copy(p);controls.target.copy(t);controls.update()}
const PG=(x,n,dy)=>{const q=G2S(x,n);return new THREE.Vector3(q[0],H(x,n)+dy,-q[1])};
function viewPose(v){const r=viewPose0(v);return r?fixPhi(r[0],r[1]):r}
function viewPose0(v){
  const t=C.clone(),s=500*A;
  if(v==="top")return[new THREE.Vector3(t.x+1,t.y+720,t.z+40),t];
  if(v==="olives")return[PG(640,-20,64),new THREE.Vector3(t.x+20,22,t.z)];
  if(v==="inside"){const ih=interiorPose();return ih}
  if(v==="kodesh"&&KDS)return[KDS.p.clone(),KDS.t.clone()];
  if(v==="city")return[PG(-330,-215,26),new THREE.Vector3(t.x,30,t.z)];
  if(v==="kotel"){const tg=PG(-90,-178,0);tg.y=PLZ+11;const p=PG(-180,-205,0);p.y=PLZ+5;return[p,tg]}
  ;
  if(v==="court")return[new THREE.Vector3(t.x+0.4*s,3.5*A+1.7,t.z+0.06*s),new THREE.Vector3(t.x-0.17*s,24,t.z)];
  if(v==="far"){const a=PG(-1500,-150,0),b=PG(-250,-120,0);a.y=260;b.y=40;return[a,b]}
  if(v==="gateN")return[new THREE.Vector3(t.x+40,22,t.z-0.5*s-70),new THREE.Vector3(t.x,18,t.z-0.5*s+20)];
  if(v==="altar")return[new THREE.Vector3(t.x+40,22,t.z+38),new THREE.Vector3(t.x,8,t.z)];
  /* 124.6: מבט הפתיחה נמוך וקרוב יותר, מדרום־מזרח, ובית המקדש עם המזבח במרכז התמונה. קודם הבית היה קטן בצד, ורוב התמונה הייתה רחבה ריקה */
  return[new THREE.Vector3(t.x+0.72*s,84,t.z+0.37*s),new THREE.Vector3(t.x-0.0716*s,14,t.z)];
}
let tween=null;
function inHouseP(q){return INTBOX&&q.x>INTBOX.x0-1&&q.x<INTBOX.x1+1&&q.z>INTBOX.z0-1&&q.z<INTBOX.z1+1&&q.y<INTBOX.y1}
function routeTo(p,t,dur){if(!COMP){camAt(p,t);return}const Wq=(u,w,y)=>new THREE.Vector3(COMP.X0+u*A,y,-(COMP.N0-w*A)),fy=13.56*A+((0))+1.7;
  const pts=[camera.position.clone()],tgs=[controls.target.clone()];const a=inHouseP(camera.position),b=inHouseP(p);
  if(a){pts.push(Wq(178,250,fy),Wq(214,250,fy+1));tgs.push(Wq(230,250,fy),Wq(260,250,fy))}
  if(b){if(!a){pts.push(Wq(268,250,fy+30));tgs.push(Wq(200,250,fy+8))}pts.push(Wq(222,250,fy+2),Wq(184,250,fy));tgs.push(Wq(170,250,fy),Wq(137,250,fy+1))}
  pts.push(p);tgs.push(t);tween={path:pts,tpath:tgs,start:performance.now(),dur:Math.max(1600,(dur||1200)*1.6),p0:pts[0],t0:tgs[0],p1:p,t1:t}}
function needFade(p0,p1){const inH=q=>INTBOX&&q.x>INTBOX.x0-2&&q.x<INTBOX.x1+2&&q.z>INTBOX.z0-2&&q.z<INTBOX.z1+2&&q.y<INTBOX.y1;return inH(p0)||inH(p1)}
function flyTo(v,dur){const [p,t]=viewPose(v);if(reduce||!dur){camAt(p,t);return}if(needFade(camera.position,p)){routeTo(p,t,dur);return}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:dur}}
let OCCF=0,HUDF=0; // מכונות מצב: TOUR הישן לא קיבל ערך אף פעם (סיור ישן שהוסר), ולכן הוסר
function segHit(a,b){const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;let best=1;for(const c of COL){if(c.y1-c.y0<2.6||(c.x1-c.x0<1.6&&c.z1-c.z0<1.6))continue;if(a.x>c.x0-0.3&&a.x<c.x1+0.3&&a.z>c.z0-0.3&&a.z<c.z1+0.3&&a.y>c.y0-0.3&&a.y<c.y1+0.3)continue;let t0=0,t1=1;const sl=(o,d,lo,hi)=>{if(Math.abs(d)<1e-9)return o>=lo&&o<=hi;let u=(lo-o)/d,v=(hi-o)/d;if(u>v){const q=u;u=v;v=q}t0=Math.max(t0,u);t1=Math.min(t1,v);return t0<=t1};
  if(sl(a.x,dx,c.x0-0.25,c.x1+0.25)&&sl(a.y,dy,c.y0-0.25,c.y1+0.25)&&sl(a.z,dz,c.z0-0.25,c.z1+0.25)&&t0<best)best=t0}return best}
try{__v6=Object.assign(__v6||{},{trees:TREECLEAR()})}catch(e){console.warn("trees",e)}
function floorAt(x,z){let g=groundAt(x,z);const q=S2G(x,-z),b=bldTop(q[0],q[1]);return Math.max(g,b)}window.__GA={groundAt,mizY,blocked,canStep,onStreet,floorAt,wallLine:()=>WALL_LINE,cityGates:()=>GATES,goal:(x,z)=>WALKGOAL(new THREE.Vector3(x,0,z),true),walkPose:(x,z,tx,tz)=>{startWalk();camera.position.set(x,groundAt(x,z)+1.65,z);yaw=Math.atan2(-(tx-x),-(tz-z));pitch=0.02;camera.rotation.set(pitch,yaw,0)},bldTop,onRoad,S2G,G2S,camAt,getA:()=>A,getCOMP:()=>COMP,getPLAN:()=>PLAN,getCam:()=>camera,getControls:()=>controls,getDAY:()=>DAY,setDay,setFest,sunAt,getHOUR:()=>HOUR,setHOUR:h=>{HOUR=h;applyTime()},getTIME:()=>TIME,getDOY:()=>DOY,gateDoors,egate:()=>!EGATE?null:{n:EGATE.length,visible:EGATE.filter(m=>m.visible).length,closed:EGATE.some(m=>m.visible),open:EGATE.every(m=>!m.visible)}};
let camLim=1e9,camSaved=false;const camDesired=new THREE.Vector3();
function fadeJump(fn){const f=document.getElementById("fade");f.classList.add("on");const off=()=>{if(f)f.classList.remove("on")};const delay=reduce?0:320;setTimeout(()=>{try{fn()}catch(e){}const t0=performance.now();let n=0;const wait=()=>{if(++n<12&&performance.now()-t0<700)requestAnimationFrame(wait);else off()};requestAnimationFrame(wait);setTimeout(off,800)},delay);setTimeout(off,delay+1400)}
// #12: the old tour (TOUR_STEPS) never ran (the tour button starts STORIES.pilgrim); removed
function stPose(s){const yr=(0),Wq=(u,w,y)=>new THREE.Vector3(COMP.X0+u*A,(y+yr)*A,-(COMP.N0-w*A));return fixPhi(Wq(...s.p),Wq(...s.t))}
document.getElementById("ykBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("yk")});
document.getElementById("tmBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("tamid")});
document.getElementById("tourBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("pilgrim")});
renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();if(STORY&&STORY.pause)STORY.pause();if(DRONE){D.h=Math.max(8,Math.min(60,D.h+e.deltaY*0.02))}},{passive:false});
stage.addEventListener("pointerdown",e=>{;},true);

// ---- help for the method buttons ----
const HELP={fac:{n:"חזית — איך נראה הבית מבחוץ",r:"יחזקאל מ״א; מסכת מידות ד, ז",t:"<b>יחזקאל:</b> הבית עם הצלעות רוחבו 50 אמה, והאולם באותו רוחב. <b>מידות:</b> הבית 70 אמה והאולם 100 — \"צר מאחוריו ורחב מלפניו, ודומה לארי\". הגובה של 100 אמה לקוח ממסכת מידות, כי יחזקאל לא נותן גובה לבית — לכן בחזית של יחזקאל הבית נראה צר וגבוה."},
 loc:{n:"על הסלע — מה עומד על אבן השתייה",r:"משנה יומא ה, ב; רמב״ם, הלכות בית הבחירה ד, א",t:"הסלע שבתוך כיפת הסלע של היום. <b>קודש הקודשים</b> (ברירת המחדל): לפי המסורת הרווחת, אבן השתייה היא המקום שעליו עמד הארון — \"אבן היתה שם... ושתייה היתה נקראת\". <b>המזבח:</b> לפי דעת חוקרים אחדים (כמו דלמן) הסלע הוא מקום המזבח. ההבדל הוא כ־60 מטר מזרחה או מערבה. הלחיצה מעבירה למבט מלמעלה כדי לראות את ההבדל, והחלון \"התאמה להר\" שמתחת לתלת־ממד מראה כמה המתחם חורג מהחומה."},
 amah:{n:"אמה — כמה סנטימטר",r:"שיעורי תורה",t:"<b>48</b> ס״מ לפי הגר״ח נאה, <b>57.6</b> לפי החזון איש, ו־<b>52.5</b> באמצע. כל המתחם — 500 × 500 אמה — גדל או קטן לפי הבחירה (240 עד 288 מטר)."},
 gate:{n:"שיטה — המלבי״ם או רש״י והרמח״ל",r:"יחזקאל מ׳, יד; מ׳, מח-מט; רש״י, מלבי״ם, משכני עליון לרמח״ל",t:"\"ויעש את אילים ששים אמה\". <b>המלבי״ם:</b> 60 אמה היא מידה לאורך הקיר, והשער בגובה רגיל (כאן כ־20 אמה, בהערכה). <b>רש״י והרמח״ל:</b> האילים הם עמודים עגולים \"כמין אילנות\", גבוהים 60 אמה, וגם שני העמודים לפני האולם גבוהים 60 אמה, ובראשם צורת דקל."},
 river:{n:"הנהר — המים שיוצאים מהמקדש",r:"יחזקאל מ״ז, א-יב",t:"\"והנה מים יוצאים מתחת מפתן הבית קדימה... מימין הבית מנגב למזבח\". המים יוצאים מתחת לבית, עוברים מדרום למזבח בתעלה, יוצאים מתחת לשער המזרח, יורדים אל נחל קדרון וזורמים לים המלח — \"ונרפאו המים\". הנהר מתרחב בדרך: עד הקרסוליים, עד הברכיים, עד המותניים, ובסוף נחל שאי אפשר לעבור. על שפתו עצי מאכל. זה חזון לעתיד, ולכן הוא מוסתר כברירת מחדל."},
 wall:{n:"חומת הר הבית של היום",r:"OpenStreetMap; סעיף 15.3",t:"הקו האדום מראה איפה עוברת היום החומה של הר הבית, רק במקומות שהמתחם של יחזקאל (500 × 500 אמה) עובר אותה. כך רואים בדיוק כמה המתחם יוצא מעבר להר הקיים. זה נובע מהמידות שבפסוקים, לא מטעות בהדמיה. כשהכפתור דלוק רואים גם את המילוי והקיר התומך שיצטרכו לבנות שם, ובחלון \"התאמה להר\" למטה — טבלה של החריגה בכל גודל אמה ובשתי האפשרויות על הסלע."},
 lines:{n:"שכבות — מה אפשר להדליק ולכבות",r:"",t:"<b>אנשים</b>, <b>תחבורה</b>, <b>שמות</b> — דלוקים בהתחלה. <b>חומת ההר היום</b> — קו אדום של החומה הנוכחית במקומות שהמתחם חורג ממנה, עם המילוי והקיר התומך; כבוי בהתחלה. <b>חג</b> — מנורות, ריקודים, הקהל והבאת ביכורים. <b>מפה קטנה</b> — מפה בפינה. <b>איכות גבוהה</b> — צללים רכים (כבד יותר). הנהר שיוצא מתחת לבית (יחזקאל מ״ז) מוצג תמיד, ואין לו כפתור."},
 transit:{n:"תחבורה ציבורית — כאילו הכול כבר פועל",r:"תוכנית האב לתחבורה בירושלים 2050 ותחנות הרכבת הקלה (data.gov.il); קווי האוטובוס והתחנות — משרד התחבורה (GTFS); הרכבל — משוער לפי מפות שפורסמו",t:"זה דגם של העתיד, לכן כל התוכניות מוצגות כאילו כבר נבנו, בשעת עומס: קווי הרכבת הקלה (כל קו בצבע שלו), כניסות למטרו (שנוסע מתחת לאדמה), רכבל להר ציון ולשער האשפות, ואוטובוסים בקווים הראשיים. בתחנות שליד העיר העתיקה עולי רגל יורדים מהרכבת והולכים בסמטאות אל הר הבית. <b>לוחצים על רכבת כדי לרכוב עליה.</b><br>הקו הצהוב: 💡 לפי ויקיפדיה, מקטע שער האשפות–הר ציון מתוכנן אולי כמנהרה תחת מעלה השלום. אין תוכנית מאושרת, ולכן מוצג במפלס הרחוב."},
 scope:{n:"מה מוצג כאן — היקף ההדמיה",r:"יחזקאל מ–מח; מלבי״ם",t:"<b>הבית:</b> בית המקדש של יחזקאל לפי המלבי״ם הוא הבסיס. \"לפי מידות\" ו\"הרמב״ם\" הם השוואה ללימוד בלבד. <b>המתחם:</b> 500 × 500 אמה; ההיקף העתידי הגדול (יחזקאל מב, טו–כ) לא מצויר. <b>העיר:</b> ירושלים של היום. מה שעוד לא נבנה (רכבת קלה, מטרו, רכבל) מסומן \"עתידי\" גם בשם הקצר. 💡 <b>קו הרקיע:</b> מגדלים וכיפות גבוהים ליד ההר הונמכו בהדמיה כדי שלא יעברו את גובה ההיכל. זה עיבוד חזותי מכוון, ולא העתק של ירושלים."},
 floor:{n:"רצפה — מה רואים על הקרקע",r:"OpenStreetMap; צילום ההר היום — Esri, Maxar",t:"<b>קרקע:</b> הקרקע מצוירת לפי נתוני המפה — אדמה וסלע, גינות, חורשות ובתי קברות, וריצוף בין הבתים ובעיר העתיקה — בלי צילום לוויין. <b>ההר היום:</b> מסתיר את המקדש ומראה את ההר כמו שהוא היום — הצילום, כיפת הסלע ואל־אקצא — להשוואה בלבד. <b>מודל פשוט:</b> בלי צילום."}};
document.querySelectorAll("button.help").forEach(b=>b.addEventListener("click",()=>showInfo(HELP[b.dataset.help])));
document.getElementById("perfbtn").addEventListener("click",()=>{PERF.on=!PERF.on;document.getElementById("perfbox").hidden=!PERF.on;document.getElementById("perfbox").textContent="מודד…"});
renderer.domElement.addEventListener("webglcontextlost",e=>{e.preventDefault();const l=document.createElement("div");l.className="loading";l.id="ctxlost";l.textContent="הדפדפן עצר את התלת־ממד (זיכרון). טוען מחדש…";stage.appendChild(l)});renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload());
// ---- break up the repeating paving with a large-scale world tint ----
function antiTile(m){if(!m||m.userData.at)return;m.userData.at=true;m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;").replace("#include <worldpos_vertex>","#include <worldpos_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;");
  sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;\nfloat hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hh(i),hh(i+vec2(1,0)),f.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),f.x),f.y);}").replace("#include <map_fragment>","#include <map_fragment>\nfloat nz=vn(vWP.xz*0.045)*0.6+vn(vWP.xz*0.13)*0.4;diffuseColor.rgb*=0.86+0.24*nz;")};m.needsUpdate=true}
antiTile(M.pave);if(PLATTOP)antiTile(PLATTOP);
// ---- HUD: compass, home, mini-map, exit ----
// a drawn street map (not the satellite photo), prepared once; it shows about 1.6 km around the camera
const MAPR=2000,MAPS=2048,MAPK=MAPS/(2*MAPR),MAPC=(function(){const c=document.createElement("canvas");c.width=c.height=MAPS;const x=c.getContext("2d"),P=q=>[(q[0]+MAPR)*MAPK,(MAPR-q[1])*MAPK];
  const path=(pts,close)=>{x.beginPath();pts.forEach((q,i)=>{const p=P(q);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])});if(close)x.closePath()};
  x.fillStyle="#efe9dc";x.fillRect(0,0,MAPS,MAPS);
  if(GEO.OLD){path(GEO.OLD,true);x.fillStyle="#e2d7c0";x.fill()}
  x.lineCap="round";x.lineJoin="round";ROADS.forEach(rd=>{path(rd.p,false);x.strokeStyle=rd.c===4?"#d8cfbf":"#ffffff";x.lineWidth=Math.max(2,(rd.w+(rd.c>=1&&rd.c<4?3:1))*MAPK);x.stroke()});
  ROADS.forEach(rd=>{if(rd.c>=1&&rd.c<4){path(rd.p,false);x.strokeStyle="#f3c96a";x.lineWidth=Math.max(1.5,rd.w*MAPK*0.7);x.stroke()}});
  if(GEO.KIDRON){path(GEO.KIDRON,false);x.strokeStyle="#6fa6d6";x.lineWidth=5;x.stroke()}
  if(GEO.WALL){path(GEO.WALL,false);x.strokeStyle="#8c7a5c";x.lineWidth=6;x.stroke()}
  path(GEO.MOUNT,true);x.fillStyle="#d9c9a3";x.fill();x.strokeStyle="#7d6b4c";x.lineWidth=4;x.stroke();
  x.fillStyle="#5d4e36";x.font="bold 40px sans-serif";x.textAlign="center";x.direction="rtl";
  const lab=(t,q)=>{const p=P(q);x.lineWidth=8;x.strokeStyle="rgba(255,255,255,.85)";x.strokeText(t,p[0],p[1]);x.fillText(t,p[0],p[1])};
  {let sx=0,sn=0;GEO.OLD&&GEO.OLD.forEach(q=>{sx+=q[0];sn+=q[1]});if(GEO.OLD)lab("העיר העתיקה",[sx/GEO.OLD.length-250,sn/GEO.OLD.length])}
  lab("הר הזיתים",[900,80]);return c})();
const MB=SATB.old;const MINIV={cx:0,cy:0,span:0};
function hudTick(){const fw=new THREE.Vector3();camera.getWorldDirection(fw);const nW=new THREE.Vector3(0,0,-1).applyAxisAngle(new THREE.Vector3(0,1,0),-THETA);const ang=Math.atan2(fw.x*nW.z-fw.z*nW.x,fw.x*nW.x+fw.z*nW.z);document.getElementById("needle").style.transform="rotate("+(ang*180/Math.PI)+"deg)";
  const c=document.getElementById("mini");if(c.hidden)return;const x=c.getContext("2d"),l=WG.worldToLocal(camera.position.clone()),gx=l.x,gn=-l.z,S=c.width,span=1600*MAPK;
  const px0=(gx+MAPR)*MAPK,py0=(MAPR-gn)*MAPK,cx=Math.max(span/2,Math.min(MAPS-span/2,px0)),cy=Math.max(span/2,Math.min(MAPS-span/2,py0));MINIV.cx=cx;MINIV.cy=cy;MINIV.span=span;const M2=q=>[(q[0]-cx)/span*S+S/2,(q[1]-cy)/span*S+S/2];
  x.save();x.beginPath();x.arc(S/2,S/2,S/2,0,7);x.clip();x.drawImage(MAPC,cx-span/2,cy-span/2,span,span,0,0,S,S);
  // the Temple compound, drawn from the model itself
  /* 125.0 (ביקורת 25): המתחם במפה מצויר באותה אמה של הדגם (A), לא ב־0.576 קבוע */if(COMP){const co=[[0,0],[500,0],[500,500],[0,500]].map(([u,v])=>{const w=WG.worldToLocal(new THREE.Vector3(COMP.X0+u*A,0,-(COMP.N0-v*A)));return M2([(w.x+MAPR)*MAPK,(MAPR+w.z)*MAPK])});
    x.beginPath();co.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle="rgba(201,162,74,.55)";x.fill();x.strokeStyle="#8a6a1f";x.lineWidth=1.5;x.stroke();
    const hp=WG.worldToLocal(new THREE.Vector3(COMP.X0+150*A,0,-(COMP.N0-250*A))),h=M2([(hp.x+MAPR)*MAPK,(MAPR+hp.z)*MAPK]);x.fillStyle="#7a5a12";x.fillRect(h[0]-2.5,h[1]-1.5,5,3)}
  const p=M2([px0,py0]),hd=ang;x.translate(p[0],p[1]);x.rotate(hd);x.fillStyle="rgba(232,88,74,.35)";x.beginPath();x.moveTo(0,0);x.arc(0,0,20,-Math.PI/2-0.5,-Math.PI/2+0.5);x.closePath();x.fill();x.fillStyle="#e8584a";x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.arc(0,0,4.5,0,7);x.fill();x.stroke();x.restore();
  if(MINIV.kb){const kx=MINIV.kx*S,ky=MINIV.ky*S;x.save();x.strokeStyle="#1d4ed8";x.lineWidth=2.5;x.beginPath();x.arc(kx,ky,9,0,7);x.moveTo(kx-15,ky);x.lineTo(kx-5,ky);x.moveTo(kx+5,ky);x.lineTo(kx+15,ky);x.moveTo(kx,ky-15);x.lineTo(kx,ky-5);x.moveTo(kx,ky+5);x.lineTo(kx,ky+15);x.stroke();x.restore()}}
/* 125.0 (ביקורת 26): לחיצה על המפה הקטנה טסה למקום שנלחץ */
{const mc=document.getElementById("mini");mc.style.cursor="pointer";mc.title="לחצו על המפה כדי לטוס לשם";mc.setAttribute("role","button");
  /* 126.1 (בדיקה חוזרת, ה): המפה נגישה למקלדת: Tab מגיע אליה, החצים מזיזים סמן כחול, Enter או רווח טסים אליו */
  mc.tabIndex=0;mc.setAttribute("aria-label","מפה קטנה. החצים מזיזים סמן, Enter או רווח טסים אליו. אפשר גם לחפש מקום בשורת החיפוש");MINIV.kx=MINIV.ky=0.5;
  mc.addEventListener("focus",()=>{if(mc.matches(":focus-visible")){MINIV.kb=true;MINIV.kx=MINIV.ky=0.5}});mc.addEventListener("blur",()=>{MINIV.kb=false});
  mc.addEventListener("keydown",e=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(d){e.preventDefault();e.stopPropagation();MINIV.kb=true;let nx=MINIV.kx+d[0]*0.05,ny=MINIV.ky+d[1]*0.05;const L=Math.hypot(nx-0.5,ny-0.5);if(L>0.46){nx=0.5+(nx-0.5)*0.46/L;ny=0.5+(ny-0.5)*0.46/L}MINIV.kx=nx;MINIV.ky=ny;return}
    if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();MINIV.kb=true;goMini(MINIV.kx,MINIV.ky);MINIV.kx=MINIV.ky=0.5}});
  const goMini=(sx,sy)=>{if(!MINIV.span)return;
    const px=MINIV.cx+(sx-0.5)*MINIV.span,py=MINIV.cy+(sy-0.5)*MINIV.span,gx=px/MAPK-MAPR,gn=MAPR-py/MAPK,w=WG.localToWorld(new THREE.Vector3(gx,0,-gn));w.y=groundAt(w.x,w.z);
    try{window.__flyToPoint(w,60)}catch(err){console.warn(err)}};
  mc.addEventListener("click",e=>{const r=mc.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width,sy=(e.clientY-r.top)/r.height;if(Math.hypot(sx-0.5,sy-0.5)>0.5)return;goMini(sx,sy)})}
document.getElementById("homeB").addEventListener("click",()=>{endModes();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v==="home"?"true":"false"));flyTo("home",1600)});
document.getElementById("exitB").addEventListener("click",()=>{endModes();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v==="court"?"true":"false"));flyTo("court",1600)});
document.getElementById("compass").addEventListener("click",()=>{const nW=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),-THETA);if(WALK){yaw=Math.atan2(nW.x,nW.z);pitch=0.02;camera.rotation.order="YXZ";camera.rotation.set(pitch,yaw,0);return}const t=controls.target,d=camera.position.distanceTo(t);const h=Math.max(20,camera.position.y-t.y);const p=t.clone().addScaledVector(nW,Math.sqrt(Math.max(1,d*d-h*h)));p.y=t.y+h;tween={p0:camera.position.clone(),t0:t.clone(),p1:p,t1:t.clone(),start:performance.now(),dur:900}});
// ---- info card ----
function showInfo(d){if(!d)return;const h="<h2>"+d.n+"</h2>"+(d.r?"<div class='ref'>"+d.r+"</div>":"")+(d.t?"<p class='note'>"+d.t+"</p>":"");document.getElementById("info").innerHTML=h;document.getElementById("infobody").innerHTML=h;document.getElementById("infocard").hidden=false}
let closeInfo=()=>{ // let: core/32 עוטף אותה (כש־const העטיפה נכשלה בשקט)
  document.getElementById("infocard").hidden=true};["click","pointerdown"].forEach(ev=>document.getElementById("infoX").addEventListener(ev,e=>{e.stopPropagation();e.preventDefault();closeInfo()}));
// ---- labels fly to their place ----
function goLabel(L){if(STORY)STORY.stop();if(TRN&&TRN.riding)TRN.stopRide();if(DRONE){droneFly(L.v.clone());showInfo(L.info);return}if(WALK)stopWalk();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  showInfo(L.info);
  /* 125.1: מקום שהמצלמה לא מוצאת אליו דרך לבד (פתח בתוך קיר) נותן לה נקודת מבט קבועה */
  if(L.info&&L.info.cam){try{const [p,t]=L.info.cam();tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:reduce?1:1600,arc:true};return}catch(e){}}
  // the object behind the label, whole and in the middle of the free part of the screen
  try{if(!L.inh){const b=lblBox(L);let c,r;if(b){c=b.getCenter(new THREE.Vector3());const z=b.getSize(new THREE.Vector3());r=Math.max(3,0.5*Math.hypot(z.x,z.y*0.7,z.z))}
    else{c=L.v.clone();const g=floorAt(c.x,c.z);if(isFinite(g)&&g<c.y&&c.y-g<45){r=Math.max(L.c?5:20,(c.y-g)*0.8);c.y=(c.y+g)/2}else r=L.c?8:40}
    let od=null;if(/^(שער|פשפש)/.test(L.txt||"")){r=Math.max(r,24);if(COMP){od=new THREE.Vector3(c.x-(COMP.X0+250*A),0,c.z+(COMP.N0-250*A));if(od.length()<5)od=null}}r=Math.max(r,L.c?10:20);const [p,t]=frameView(c,r,L.c?10:30,b,od);if(needFade(camera.position,p))routeTo(p,t,1600);else tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:reduce?1:1600,arc:true};return}}catch(e){console.warn(e)}
  const t=L.v.clone(),cp=camera.position.clone(),dir=cp.sub(t);dir.y=0;if(dir.length()<1)dir.set(1,0,1);dir.normalize();const dist=L.c?85:200;
  const tg=t.clone();tg.y=t.y-(L.c?1:10);for(const c of COL){if(tg.x>c.x0&&tg.x<c.x1&&tg.z>c.z0&&tg.z<c.z1&&tg.y<c.y1+1&&tg.y>c.y0)tg.y=c.y1+1.5}let p=null;
  for(let k=0;k<16&&!p;k++){const an=(k%2?1:-1)*Math.ceil(k/2)*Math.PI/8,d=dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0),an);for(const hf of[0.45,0.8]){const q=t.clone().addScaledVector(d,dist);q.y=t.y+dist*hf;if(segHit(tg,q)>=1&&q.y>floorAt(q.x,q.z)+3){p=q;break}}}
  if(!p){p=t.clone().addScaledVector(dir,dist);p.y=t.y+dist*1.2}
  if(needFade(camera.position,p))routeTo(p,tg,1600);else tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:tg,start:performance.now(),dur:reduce?1:1600,arc:true}}
// meshes that carry the label's info, near the label (one kitchen of four, not all of them)
function lblBox(L){const I=L.info;if(!I)return null;const b=new THREE.Box3(),tb=new THREE.Box3(),m4=new THREE.Matrix4(),c=new THREE.Vector3();let n=0;
  const near=q=>Math.hypot(q.x-L.v.x,q.z-L.v.z)<45;const shown=o=>{for(let q=o;q;q=q.parent)if(!q.visible&&!(q.userData&&q.userData.hid))return false;return true};
  const add=()=>{tb.getCenter(c);if(near(c)){b.union(tb);n++}};
  cPick.concat(PICK).forEach(o=>{if(o.userData!==I||!o.geometry||!shown(o))return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();o.updateWorldMatrix(true,false);
    if(o.isInstancedMesh){for(let i=0;i<Math.min(o.count,500);i++){o.getMatrixAt(i,m4);m4.premultiply(o.matrixWorld);tb.copy(o.geometry.boundingBox).applyMatrix4(m4);add()}}
    else{tb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);add()}});
  if(!n)return null;const z=b.getSize(c);return Math.max(z.x,z.z)>500?null:b}
// the camera must not aim at a point inside a wall (the wall guard then pulls the camera into it): aim at the spot where the line of sight first meets the object; the picture stays the same
function outTarget(p,c,box){const t=c.clone(),ray=new THREE.Ray(),v=new THREE.Vector3(),bx=new THREE.Box3();
  for(let k=0;k<4;k++){let B=null;if(box&&box.containsPoint(t))B=bx.copy(box).expandByScalar(0.4);else for(const q of COL)if(t.x>q.x0&&t.x<q.x1&&t.z>q.z0&&t.z<q.z1&&t.y>q.y0&&t.y<q.y1){B=bx.set(v.set(q.x0-0.4,q.y0-0.4,q.z0-0.4),new THREE.Vector3(q.x1+0.4,q.y1+0.4,q.z1+0.4));break}
    if(!B)break;ray.set(p,t.clone().sub(p).normalize());if(B.containsPoint(p)||!ray.intersectBox(B,v))break;t.copy(v);box=null}
  return t}
// gates are seen from outside, from the side people come to them (od = that direction)
// a camera pose that shows a ball (centre c, radius r) whole, from above at an angle, centred in the screen part that the info card and search bar leave free
function frameView(c,r,dmin,box,od){const sr=stage.getBoundingClientRect(),W=sr.width,H=sr.height;let x0=0,x1=W,y0=0,y1=H;
  const card=document.getElementById("infocard");if(card&&!card.hidden){const k=card.getBoundingClientRect();if(k.width>2&&k.height>2){if(k.height>H*0.8&&!card.dataset.vis){if(k.left-sr.left<W/2)x0=Math.min(W*0.6,k.right-sr.left);else x1=Math.max(W*0.4,k.left-sr.left)}else y1=Math.max(H*0.45,H-(+card.dataset.vis||k.height))}}
  const sb=document.getElementById("sbox");if(sb&&!sb.hidden){const k=sb.getBoundingClientRect();if(k.width>W*0.6)y0=Math.min(H*0.3,k.bottom-sr.top)}
  const tanV=Math.tan(camera.fov*Math.PI/360),fr=Math.min(x1-x0,y1-y0)/H,d=Math.max(dmin||12,Math.min(700,r*1.2/(tanV*fr)));
  const el=r>60?0.8:0.62,dir=od?od.clone():camera.position.clone().sub(c);dir.y=0;if(dir.length()<1)dir.set(1,0,1);dir.normalize();
  const p=c.clone().addScaledVector(dir,d*Math.cos(el));p.y+=d*Math.sin(el);let t=outTarget(p,c,box);try{safeCam(p,t)}catch(e){}t=outTarget(p,c,box);
  {const g=floorAt(p.x,p.z);if(isFinite(g)&&p.y<g+2)p.y=g+2}
  const f=t.clone().sub(p),dd=f.length();f.normalize();const rt=new THREE.Vector3().crossVectors(f,new THREE.Vector3(0,1,0)).normalize(),up=new THREE.Vector3().crossVectors(rt,f);
  const wpp=2*dd*tanV/H,ox=(x0+x1)/2-W/2,oy=(y0+y1)/2-H/2,sh=rt.multiplyScalar(-ox*wpp).addScaledVector(up,oy*wpp);
  return [p.add(sh),t.add(sh)]}
// ---- picking ----
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY];if(STORY&&STORY.pause)STORY.pause()});
document.addEventListener("click",e=>{if(STORY&&e.target.closest&&e.target.closest("#facSeg button,#locSeg button,#amahSeg button,#gateSeg button,#floorSeg button,#optSeg button[data-o=people]"))STORY.stop()},true);
renderer.domElement.addEventListener("pointerup",e=>{
  if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;down=null;{const el=document.elementFromPoint(e.clientX,e.clientY);if(el&&el.closest&&el.closest(".lbl,.story,.infocard,.hud,#sbox,#rail,.dr,#intro"))return}
  const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
  ray.setFromCamera(mv,camera);const shown=o=>{for(let q=o;q;q=q.parent){if(!q.visible&&!q.userData.hid)return false}return true};const hit=ray.intersectObjects(cPick.concat(PICK),false).find(h=>h.object.userData&&h.object.userData.n&&shown(h.object));
  if(hit&&hit.object.userData.train){TRN.ride(hit.instanceId);return}
  if(hit){showInfo(hit.object.userData.inst?hit.object.userData.inst(hit):hit.object.userData);if(DRONE)droneFly(hit.point)}else document.getElementById("infocard").hidden=true;
});

