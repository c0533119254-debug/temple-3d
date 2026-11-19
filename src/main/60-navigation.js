// ==== v59 phase B: Earth-style navigation — drag pans, right/Ctrl drag turns, zoom to cursor, keys, double-click fly ====
(function(){
const el=renderer.domElement;
controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};
controls.touches={ONE:THREE.TOUCH.PAN,TWO:THREE.TOUCH.DOLLY_ROTATE};
controls.screenSpacePanning=false;controls.panSpeed=1;
el.addEventListener("contextmenu",e=>e.preventDefault());
// where the ray under the cursor meets the ground / buildings / temple boxes
const rc=new THREE.Raycaster(),m2=new THREE.Vector2(),tmp=new THREE.Vector3();
function rayAt(cx,cy){const r=el.getBoundingClientRect();m2.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);rc.setFromCamera(m2,camera);return rc.ray}
function groundHit(ray,max){const o=ray.origin,d=ray.direction;let t=0.5,prev=0;max=max||7000;
  while(t<max){tmp.copy(o).addScaledVector(d,t);const g=floorAt(tmp.x,tmp.z);if(tmp.y<=g){let a=prev,b=t;for(let k=0;k<8;k++){const mm=(a+b)/2;tmp.copy(o).addScaledVector(d,mm);if(tmp.y<=floorAt(tmp.x,tmp.z))b=mm;else a=mm}return o.clone().addScaledVector(d,b)}
    for(const c of COL){if(c.y1-c.y0<2||tmp.x<c.x0||tmp.x>c.x1||tmp.z<c.z0||tmp.z>c.z1||tmp.y<c.y0||tmp.y>c.y1)continue;return tmp.clone()}
    prev=t;t+=Math.max(0.4,t*0.015)}return null}
function sceneHit(ray){try{rc.ray.copy(ray);rc.near=0;rc.far=8000;const objs=[];if(group)objs.push(group);const h=rc.intersectObjects(objs,true).find(h=>{for(let q=h.object;q;q=q.parent)if(!q.visible)return false;return !(h.object.material&&h.object.material.transparent&&h.object.material.opacity<0.5)});const g=groundHit(ray);if(h&&(!g||h.distance<g.distanceTo(ray.origin)))return h.point.clone();return g}catch(e){return groundHit(ray)}}
/* 126.1 (בדיקה חוזרת, ו): לבדיקת מסלולי העיר — האם נקודה נראית מהמצלמה, או שקיר או בניין מסתירים אותה */
if(window.__GA)window.__GA.seen=(x,y,z)=>{const o=camera.position.clone(),d=new THREE.Vector3(x,y,z).sub(o),L=d.length();d.normalize();const r2=new THREE.Raycaster(o,d,0.3,L);r2.camera=camera;const objs=[];scene.children.forEach(c=>{if(c.visible&&!c.isLight)objs.push(c)});
  const objs2=[];objs.forEach(o=>o.traverse(q=>{if(q.isMesh&&!q.isInstancedMesh&&!q.isSkinnedMesh&&q.visible)objs2.push(q)}));const h=r2.intersectObjects(objs2,false).find(h=>{if(h.object.isSprite||h.object.isPoints||h.object.isLine)return false;for(let q=h.object;q;q=q.parent)if(!q.visible)return false;const m=h.object.material;return !(m&&(m.colorWrite===false||m.transparent&&m.opacity<0.6))});return{dist:+L.toFixed(1),hit:h?+h.distance.toFixed(1):null,seen:!h||h.distance>L-2.5}};
const busy=()=>WALK||DRONE||(TRN&&TRN.riding);
// zoom toward the cursor
let zAcc=0,zPt=null,zT=0;
stage.addEventListener("wheel",e=>{if(e.target!==el||busy())return;e.preventDefault();e.stopPropagation();tween=null;if(STORY&&STORY.pause)STORY.pause();const now=performance.now();
  if(!zPt||now-zT>250){const g=groundHit(rayAt(e.clientX,e.clientY));zPt=g||controls.target.clone()}zT=now;
  const dy=e.deltaMode===1?e.deltaY*33:e.deltaY;zAcc+=Math.max(-400,Math.min(400,dy))},{passive:false,capture:true});
function zoomTick(dt){if(Math.abs(zAcc)<0.5||!zPt){zAcc=0;return}const step=zAcc*Math.min(1,dt*14);zAcc-=step;
  const cp=camera.position,t=controls.target;const f=Math.exp(step*0.0011);const dist=cp.distanceTo(zPt);
  if(f<1&&dist*f<2.2)return;if(f>1&&cp.distanceTo(t)*f>controls.maxDistance)return;
  let np=zPt.clone().add(cp.clone().sub(zPt).multiplyScalar(f)),nt=zPt.clone().add(t.clone().sub(zPt).multiplyScalar(f));
  // item 29: zooming in never passes through a wall: stop 0.6 m before it, and drop the rest of the wheel
  if(f<1){const h=segHit(cp,np);if(h<1){zAcc=0;const L=cp.distanceTo(np),k=(h*L-0.6)/L;if(k<=0.02)return;np=cp.clone().lerp(np,k);nt=t.clone().lerp(nt,k)}}
  const g=floorAt(np.x,np.z);if(np.y<g+1.6)np.y=g+1.6;const gt=floorAt(nt.x,nt.z);if(nt.y<gt-0.5)nt.y=gt;
  cp.copy(np);t.copy(nt);camSaved=false;camLim=1e9;controls.update();
  // near the ground the view levels toward the horizon, like Earth
  const h=np.y-g,dd=np.distanceTo(nt);if(f<1&&h<40){const dir=nt.clone().sub(np);const flat=Math.hypot(dir.x,dir.z),want=Math.max(0.05,h/45)*flat;if(-dir.y>want){const ny=np.y-want;t.y+=(ny-t.y)*0.35;controls.update()}}}
// keyboard: WASD/arrows move, Q/E turn, R/F tilt, +/- zoom, Shift fast
const K={};
const typing=()=>{const a=document.activeElement;return a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)};
window.addEventListener("keydown",e=>{if(busy()||typing()||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(["w","a","s","d","q","e","r","f","arrowup","arrowdown","arrowleft","arrowright","+","=","-","shift"].includes(k)){K[k]=true;if(k.startsWith("arrow"))e.preventDefault();if(STORY&&STORY.pause&&k!=="shift")STORY.pause()}});
window.addEventListener("keyup",e=>{K[e.key.toLowerCase()]=false});{const rel=()=>{for(const k in K)K[k]=false;VJ.lx=VJ.ly=VJ.rx=VJ.ry=0;document.querySelectorAll(".vjoy i").forEach(k=>k.style.transform="")};window.addEventListener("blur",rel);window.addEventListener("pagehide",rel);document.addEventListener("visibilitychange",()=>{if(document.hidden)rel()})}
const VJ={lx:0,ly:0,rx:0,ry:0};
function keyTick(dt){if(busy()||typing())return;const f=Math.max(-1,Math.min(1,(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0)-VJ.ly)),r=Math.max(-1,Math.min(1,(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+VJ.lx)),up=(K.e?1:0)-(K.q?1:0),turn=VJ.rx,tilt=(K.r?1:0)-(K.f?1:0)-VJ.ry,zm=(K["+"]||K["="]?1:0)-(K["-"]?1:0);
  if(!f&&!r&&!turn&&!tilt&&!zm&&!up)return;tween=null;if(STORY&&STORY.pause&&!STORY_API.S.paused)STORY.pause();const cp=camera.position,t=controls.target;const dist=cp.distanceTo(t),sp=Math.max(6,dist*0.9)*(K.shift?2.5:1)*dt;
  const fw=t.clone().sub(cp);fw.y=0;if(fw.lengthSq()<1e-6)fw.set(0,0,-1);fw.normalize();const rt=new THREE.Vector3(-fw.z,0,fw.x);
  const mv=fw.multiplyScalar(f*sp).addScaledVector(rt,r*sp);mv.y+=up*Math.max(4,dist*0.6)*(K.shift?2.5:1)*dt;cp.add(mv);t.add(mv);
  if(turn){const off=cp.clone().sub(t).applyAxisAngle(new THREE.Vector3(0,1,0),-turn*1.4*dt);cp.copy(t).add(off)}
  if(tilt){const off=cp.clone().sub(t),sph=new THREE.Spherical().setFromVector3(off);sph.phi=Math.max(0.05,Math.min(controls.maxPolarAngle,sph.phi-tilt*0.9*dt));off.setFromSpherical(sph);cp.copy(t).add(off)}
  if(zm){const off=cp.clone().sub(t).multiplyScalar(Math.exp(-zm*1.4*dt));if(off.length()>2)cp.copy(t).add(off)}
  const g=floorAt(cp.x,cp.z);if(cp.y<g+1.6){const d=g+1.6-cp.y;cp.y+=d;if(up<0)t.y+=d}const gt=floorAt(t.x,t.z);if(t.y<gt)t.y=gt;camSaved=false;camLim=1e9;controls.update()}
// two on-screen sticks for touch screens: left moves, right turns and tilts
{const touch=matchMedia("(pointer: coarse)").matches||"ontouchstart" in window;if(touch){
  const hud=document.getElementById("hud");const jb=document.createElement("button");jb.type="button";jb.className="hb";jb.id="joyB";jb.setAttribute("aria-label","ג׳ויסטיקים");jb.setAttribute("aria-pressed","false");jb.innerHTML='<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>';hud.appendChild(jb);
  const mkJ=(side)=>{const d=document.createElement("div");d.className="vjoy "+side;d.hidden=true;d.innerHTML="<i></i>";stage.appendChild(d);const k=d.firstChild;let id=null;
    const set=(e)=>{const r=d.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=(e.clientX-cx)/(r.width/2),y=(e.clientY-cy)/(r.height/2);const L=Math.hypot(x,y);if(L>1){x/=L;y/=L}k.style.transform="translate("+x*35+"px,"+y*35+"px)";if(side==="l"){VJ.lx=x;VJ.ly=y}else{VJ.rx=x;VJ.ry=y}};
    const end=()=>{id=null;k.style.transform="";if(side==="l"){VJ.lx=VJ.ly=0}else{VJ.rx=VJ.ry=0}};
    d.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;d.setPointerCapture(id);set(e)});d.addEventListener("pointermove",e=>{if(e.pointerId===id)set(e)});d.addEventListener("pointerup",end);d.addEventListener("pointercancel",end);d.addEventListener("lostpointercapture",end);return d};
  const jl=mkJ("l"),jr=mkJ("r");jb.onclick=()=>{const on=jl.hidden;jl.hidden=jr.hidden=!on;jb.setAttribute("aria-pressed",on?"true":"false")}}}
// double click: fly there
el.addEventListener("dblclick",e=>{if(busy())return;e.preventDefault();const p=sceneHit(rayAt(e.clientX,e.clientY));if(!p)return;if(STORY)STORY.stop();
  const cp=camera.position,d0=cp.distanceTo(p),nd=Math.max(14,Math.min(d0*0.45,400));const dir=cp.clone().sub(p).normalize();if(dir.y<0.25){dir.y=0.25;dir.normalize()}
  const np=p.clone().addScaledVector(dir,nd);const g=floorAt(np.x,np.z);if(np.y<g+2)np.y=g+2;try{safeCam(np,p)}catch(err){}
  document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  if(reduce){camAt(np,p);return}tween={p0:cp.clone(),t0:controls.target.clone(),p1:np,t1:p,start:performance.now(),dur:1500,arc:true}});
// first-drag hint
{let shown=false;el.addEventListener("pointerdown",()=>{if(shown||busy())return;shown=true;try{if(localStorage.getItem("tm_navhint"))return;localStorage.setItem("tm_navhint","1")}catch(e){}setTimeout(()=>toast(isTouchUI()?"כמו בגוגל מפות: אצבע אחת מזיזה, צביטה מקרבת, סיבוב שתי אצבעות מסובב, ושתי אצבעות למעלה או למטה מטות את המבט. נגיעה כפולה טסה אל המקום.":"גרירה מזיזה את המפה. לסיבוב: גרירה ימנית, או Ctrl וגרירה. גלגלת מקרבת. לחיצה כפולה טסה אל המקום."),400)})}
/* 128.2 (שמואל: "שיטוט רגיל כמו בגוגל מפות"): צביטה מקרבת, סיבוב האצבעות מסובב את המפה, והמקום שבין האצבעות נשאר מתחתן.
   שתי אצבעות שזזות יחד למעלה או למטה מטות את המבט (בדיוק כמו בגוגל מפות; שמואל: "תעשה את הדבר הכי אינטואיטיבי"). קודם גרירה בשתי אצבעות סובבה והטתה יחד, וזה בלבל */
controls.touches.TWO=-1; // OrbitControls לא נוגע בשתי אצבעות; הכול כאן
{const T={on:false},AX=new THREE.Vector3(0,1,0);
  const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
  const geo=e=>{const a=e.touches[0],b=e.touches[1];return{d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),a:Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX),m:[(a.clientX+b.clientX)/2,(a.clientY+b.clientY)/2],y0:a.clientY,y1:b.clientY}};
  const planeAt=(cx,cy,y)=>{const r=rayAt(cx,cy);if(Math.abs(r.direction.y)<1e-4)return null;const k=(y-r.origin.y)/r.direction.y;return k>0?r.origin.clone().addScaledVector(r.direction,k):null};
  el.addEventListener("touchstart",e=>{if(e.touches.length!==2||busy()||!controls.enabled){T.on=false;return}tween=null;if(STORY&&STORY.pause)STORY.pause();const g=geo(e);T.P=groundHit(rayAt(g.m[0],g.m[1]))||controls.target.clone();T.on=true;T.mode=null;T.g0=g;T.last=g},{passive:true});
  el.addEventListener("touchmove",e=>{if(!T.on||e.touches.length!==2||busy())return;e.preventDefault();const g=geo(e),L=T.last;
    if(!T.mode){const dy0=g.y0-T.g0.y0,dy1=g.y1-T.g0.y1,dd=Math.abs(g.d-T.g0.d),da=Math.abs(ad(g.a,T.g0.a)),dm=Math.hypot(g.m[0]-T.g0.m[0],g.m[1]-T.g0.m[1]);
      if(Math.abs(dy0)>10&&Math.abs(dy1)>10&&Math.sign(dy0)===Math.sign(dy1)&&dd<18&&da<0.12&&Math.abs(g.m[0]-T.g0.m[0])<Math.abs(g.m[1]-T.g0.m[1]))T.mode="tilt";else if(dd>12||da>0.08||dm>12)T.mode="zoom";else return}
    T.last=g;const cp=camera.position,t=controls.target;
    if(T.mode==="tilt"){const off=cp.clone().sub(t),s=new THREE.Spherical().setFromVector3(off);s.phi=Math.max(0.02,Math.min(controls.maxPolarAngle,s.phi-(g.m[1]-L.m[1])*0.006));off.setFromSpherical(s);cp.copy(t).add(off)}
    else{const P=T.P,da=ad(g.a,L.a);if(da){cp.sub(P).applyAxisAngle(AX,da).add(P);t.sub(P).applyAxisAngle(AX,da).add(P)}
      let f=L.d>1&&g.d>1?L.d/g.d:1;const dist=cp.distanceTo(P);if(f<1&&dist*f<3)f=Math.min(1,3/dist);if(f>1&&cp.distanceTo(t)*f>controls.maxDistance)f=1;
      if(f!==1){cp.sub(P).multiplyScalar(f).add(P);t.sub(P).multiplyScalar(f).add(P)}
      controls.update();camera.updateMatrixWorld();const Q=planeAt(g.m[0],g.m[1],P.y);if(Q&&Q.distanceTo(P)<2000){const dx=P.x-Q.x,dz=P.z-Q.z;cp.x+=dx;cp.z+=dz;t.x+=dx;t.z+=dz}}
    const gy=floorAt(cp.x,cp.z);if(cp.y<gy+1.6)cp.y=gy+1.6;camSaved=false;camLim=1e9;controls.update()},{passive:false});
  el.addEventListener("touchend",e=>{if(e.touches.length<2)T.on=false},{passive:true});el.addEventListener("touchcancel",()=>{T.on=false},{passive:true})}
/* 128.2: כפתור ״מפה״ — מבט מלמעלה, הצפון למעלה, מעל המקום שבמרכז המסך. לחיצה נוספת כשכבר מלמעלה — חזרה למבט באלכסון */
function mapView(){try{if(STORY)STORY.stop()}catch(e){}try{endModes()}catch(e){}try{closeInfo()}catch(e){}
  const t=controls.target.clone(),cp=camera.position,off=cp.clone().sub(t),s=new THREE.Spherical().setFromVector3(off);t.y=Math.max(t.y,floorAt(t.x,t.z));
  const top=s.phi<0.3,d=Math.max(top?120:180,Math.min(900,off.length()*(top?1:1.15)));let p;
  if(top){s.radius=d;s.phi=0.95;p=t.clone().add(new THREE.Vector3().setFromSpherical(s))}
  else{const nW=new THREE.Vector3(0,0,1).applyAxisAngle(AXY,-THETA),phi=0.12;p=t.clone().addScaledVector(nW,d*Math.sin(phi));p.y=t.y+d*Math.cos(phi)}
  document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  if(reduce){camAt(p,t);return}tween={p0:cp.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:1200}}
const AXY=new THREE.Vector3(0,1,0);
/* 128.2: גרירת המצפן בעיגול מסובבת את המפה סביב מרכז המסך (גם באצבע אחת); נגיעה בלי גרירה עדיין מחזירה את הצפון למעלה */
const freeOK=()=>!busy()&&controls.enabled;
function orbitBy(dAz,dPhi){const cp=camera.position,t=controls.target;tween=null;if(STORY&&STORY.pause)STORY.pause();if(dAz)cp.sub(t).applyAxisAngle(AXY,dAz).add(t);
  if(dPhi){const off=cp.clone().sub(t),s=new THREE.Spherical().setFromVector3(off);s.phi=Math.max(0.02,Math.min(controls.maxPolarAngle,s.phi+dPhi));off.setFromSpherical(s);cp.copy(t).add(off)}
  const gy=floorAt(cp.x,cp.z);if(cp.y<gy+1.6)cp.y=gy+1.6;camSaved=false;camLim=1e9;controls.update()}
{const cmp=document.getElementById("compass");
  if(cmp){let cd=null;const ang=e=>{const r=cmp.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))};
    cmp.addEventListener("pointerdown",e=>{if(!freeOK())return;cd={id:e.pointerId,a:ang(e),x:e.clientX,y:e.clientY,moved:false};try{cmp.setPointerCapture(e.pointerId)}catch(_){}});
    cmp.addEventListener("pointermove",e=>{if(!cd||e.pointerId!==cd.id)return;if(!cd.moved&&Math.hypot(e.clientX-cd.x,e.clientY-cd.y)<6)return;cd.moved=true;const a=ang(e);let d=a-cd.a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;cd.a=a;orbitBy(d,0)});
    const cEnd=e=>{if(!cd||e.pointerId!==cd.id)return;if(cd.moved){const stop=ev=>{ev.stopImmediatePropagation();ev.preventDefault()};cmp.addEventListener("click",stop,{capture:true,once:true});setTimeout(()=>cmp.removeEventListener("click",stop,{capture:true}),400)}cd=null};
    cmp.addEventListener("pointerup",cEnd);cmp.addEventListener("pointercancel",cEnd);cmp.style.touchAction="none"}}
let last=performance.now();
function navTick(){requestAnimationFrame(navTick);const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;if(busy()){zAcc=0;return}zoomTick(dt);keyTick(dt)}
requestAnimationFrame(navTick);
window.__NAV={groundHit,sceneHit,rayAt,mapView};
})();

