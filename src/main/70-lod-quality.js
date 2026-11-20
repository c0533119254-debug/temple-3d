// ==== v60: distance LOD for big instanced crowds (trees, people, graves, lamps): near = full, far = a box, small parts (heads, trunks) hidden far ====
(function(){
const E=[],done=new WeakSet(),cam=new THREE.Vector3(),last=new THREE.Vector3(1e9,0,0),wp=new THREE.Vector3(),mw=new THREE.Matrix4();
const frC=new THREE.Frustum(),pmC=new THREE.Matrix4(),spC=new THREE.Sphere(),lastQ=new THREE.Quaternion();
const KQ=QL==="low"?0.6:SMALL?0.7:1;let lastT=0,changed=false,shT=0;
const tris=g=>(g.index?g.index.count:g.attributes.position.count)/3;
const inScene=o=>{for(let q=o;q;q=q.parent)if(q===scene)return true;return false};
function scan(){const c=[];scene.traverse(o=>{if(o.isInstancedMesh&&!done.has(o)&&o.count>=60&&!o.userData.train&&!o.userData.noLOD&&!o.__lodFar&&!o.__icull)c.push(o)});if(!c.length)return;
  const v0=c.map(o=>o.instanceMatrix.version);c.forEach(o=>done.add(o));
  setTimeout(()=>{const ok=c.filter((o,i)=>o.instanceMatrix.version===v0[i]&&inScene(o));add(ok)},1200)}
function add(list){const fresh=[];
  list.forEach(o=>{const g=o.geometry,n=o.count;if(!g.boundingBox)g.computeBoundingBox();if(!g.boundingSphere)g.computeBoundingSphere();o.updateMatrixWorld(true);
    const M=o.instanceMatrix.array.slice(0,n*16),C=o.instanceColor?o.instanceColor.array.slice(0,n*3):null,P=new Float32Array(n*3);
    const sx=new THREE.Vector3();o.matrixWorld.decompose(wp,new THREE.Quaternion(),sx);const sc=Math.max(sx.x,sx.y,sx.z);
    let s0=0;for(let i=0;i<n;i++){mw.fromArray(M,i*16);wp.setFromMatrixPosition(mw).applyMatrix4(o.matrixWorld);P[i*3]=wp.x;P[i*3+1]=wp.y;P[i*3+2]=wp.z;if(i<8){const e=M,k=i*16;s0+=Math.hypot(e[k],e[k+1],e[k+2])}}
    const r=g.boundingSphere.radius*sc*(s0/Math.min(8,n)||1);
    fresh.push({o,n,M,C,P,r,far:null,part:false,ver:-1,g})});
  // parts: same parent, same count, same first/last positions -> the biggest is the body, the rest are parts
  fresh.forEach(a=>{fresh.forEach(b=>{if(a===b||a.o.parent!==b.o.parent||a.n!==b.n||a.part)return;const d0=Math.hypot(a.P[0]-b.P[0],a.P[2]-b.P[2]),d1=Math.hypot(a.P[a.n*3-3]-b.P[b.n*3-3],a.P[a.n*3-1]-b.P[b.n*3-1]);if(d0<Math.max(0.6,b.r)&&d1<Math.max(0.6,b.r)&&a.r<b.r*0.8)a.part=true})});
  fresh.forEach(e=>{const o=e.o,t=tris(e.g);e.rn=(o.userData.lodR||Math.max(250,e.r*120))*KQ;e.rp=Math.max(220,e.r*900)*KQ;
    if(!e.part&&t>16){const bb=e.g.boundingBox,sz=bb.getSize(new THREE.Vector3()),ce=bb.getCenter(new THREE.Vector3());let fg;
      if(o.userData.farGeo){fg=o.userData.farGeo}else if(e.g.type==="BoxGeometry"){fg=new THREE.PlaneGeometry(sz.x,sz.z);fg.rotateX(-Math.PI/2);fg.translate(ce.x,bb.max.y,ce.z)}else{fg=new THREE.BoxGeometry(Math.max(sz.x,0.01),Math.max(sz.y,0.01),Math.max(sz.z,0.01));fg.translate(ce.x,ce.y,ce.z)}
      const f=new THREE.InstancedMesh(fg,o.material,e.n);f.count=0;f.castShadow=false;f.receiveShadow=o.receiveShadow;f.frustumCulled=false;f.userData=o.userData;f.matrixAutoUpdate=o.matrixAutoUpdate;f.position.copy(o.position);f.quaternion.copy(o.quaternion);f.scale.copy(o.scale);f.matrix.copy(o.matrix);f.renderOrder=o.renderOrder;
      if(e.C){f.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(e.n*3),3)}
      Object.defineProperty(f,"__lodFar",{value:true});o.parent.add(f);e.far=f;if(cPick.includes(o))cPick.push(f);if(PICK.includes(o))PICK.push(f)}
    E.push(e)});
  last.set(1e9,0,0);upd(true)}
function revert(e){const o=e.o;o.instanceMatrix.array.set(e.M);if(e.C&&o.instanceColor)o.instanceColor.array.set(e.C);o.count=e.n;o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;if(e.far){e.far.parent&&e.far.parent.remove(e.far);if(e.far.geometry!==o.userData.farGeo)e.far.geometry.dispose()}o.userData.noLOD=true}
function upd(force){
  /* v101 · משימה 06: בדיקת שינוי מטריצות לפני היציאה המוקדמת — סימולציה שכותבת לפי אינדקס מקורי לא תפגוש רשימה דחוסה גם כשהמצלמה עומדת */
  for(let j=E.length-1;j>=0;j--){const e=E[j];if(e.ver>=0&&e.o.instanceMatrix.version!==e.ver){revert(e);E.splice(j,1)}}
  cam.copy(camera.position);const turned=1-Math.abs(camera.quaternion.dot(lastQ))>0.0002;if(!force&&!turned&&cam.distanceToSquared(last)<64)return;last.copy(cam);lastQ.copy(camera.quaternion);
  camera.updateMatrixWorld();pmC.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frC.setFromProjectionMatrix(pmC);
  for(let j=E.length-1;j>=0;j--){const e=E[j],o=e.o;
    if(!inScene(o)){if(e.far){e.far.parent&&e.far.parent.remove(e.far);if(e.far.geometry!==o.userData.farGeo)e.far.geometry.dispose()}E.splice(j,1);continue}
    if(e.ver>=0&&o.instanceMatrix.version!==e.ver){revert(e);E.splice(j,1);continue}
    const A=o.instanceMatrix.array,CA=o.instanceColor&&o.instanceColor.array,R2=(e.part?e.rp:e.rn)**2;let k=0,kf=0;const F=e.far,FA=F&&F.instanceMatrix.array,FC=F&&F.instanceColor&&F.instanceColor.array;
    for(let i=0;i<e.n;i++){spC.center.set(e.P[i*3],e.P[i*3+1],e.P[i*3+2]);spC.radius=Math.max(8,e.r*4);if(!frC.intersectsSphere(spC))continue;const dx=e.P[i*3]-cam.x,dy=e.P[i*3+1]-cam.y,dz=e.P[i*3+2]-cam.z,d2=dx*dx+dy*dy+dz*dz;
      if(d2<R2){if(k!==i||!e.ok){for(let q=0;q<16;q++)A[k*16+q]=e.M[i*16+q];if(CA)for(let q=0;q<3;q++)CA[k*3+q]=e.C[i*3+q]}k++}
      else if(F){for(let q=0;q<16;q++)FA[kf*16+q]=e.M[i*16+q];if(FC)for(let q=0;q<3;q++)FC[kf*3+q]=e.C[i*3+q];kf++}}
    e.ok=(k===e.n);if(o.count!==k)changed=true;o.count=k;o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;e.ver=o.instanceMatrix.version;
    if(F){F.count=kf;F.visible=o.visible;F.instanceMatrix.needsUpdate=true;if(F.instanceColor)F.instanceColor.needsUpdate=true}}}
let t0=performance.now();
function tick(){requestAnimationFrame(tick);const now=performance.now();if(now-t0<2500)return;
  if(now-lastT>2000){lastT=now;scan()}
  if(now-(tick._u||0)>250){tick._u=now;upd(false);E.forEach(e=>{if(e.far)e.far.visible=e.o.visible})}
  if(changed&&now-lastMove>600&&now-shT>3000){changed=false;shT=now;renderer.shadowMap.needsUpdate=true}}
requestAnimationFrame(tick);
window.__ILOD=E;
})();
/* 131.3: מופעים שהרשת שלהם מכסה את כל העיר (עצים, סוכות) לא נחתכים לפי המסך. בזמן הציור נשארים רק מי שבתוך הפריים, ומיד אחר כך הרשימה חוזרת — כדי שההנפשה תמשיך לכתוב למקום שלה. */
const ICULL=(function(){const list=[],seen=new WeakSet(),fr=new THREE.Frustum(),pm=new THREE.Matrix4(),sph=new THREE.Sphere(),mw=new THREE.Matrix4(),wp=new THREE.Vector3();let tScan=0;
  const figSet=()=>{const s=new Set();const F=window.__FLOD;if(F&&F.G)F.G.forEach(e=>{e.parts.forEach(m=>s.add(m));if(e.far)s.add(e.far);(e.fol||[]).forEach(m=>s.add(m))});return s};
  function collect(){const fig=figSet(),il=new Set();(window.__ILOD||[]).forEach(e=>{if(e&&e.o)il.add(e.o);if(e&&e.far)il.add(e.far)});
    if(SMALL&&!collect._sh){collect._sh=1;scene.traverse(o=>{if(o.isInstancedMesh)o.castShadow=false})}
    scene.traverse(o=>{if(!o.isInstancedMesh||seen.has(o)||fig.has(o)||il.has(o)||o.__lodFar||o.__icull||o.count<40)return;const ud=o.userData||{};if(o.count>=60&&!ud.noLOD&&!ud.train)return;seen.add(o);o.__icull=1;if(SMALL)o.castShadow=false;
      const n=o.count,base=o.instanceMatrix.array;list.push({o,n,base,P:null,v:-1,scratch:new Float32Array(base.length),cscratch:o.instanceColor?new Float32Array(o.instanceColor.array.length):null,csrc:o.instanceColor?o.instanceColor.array:null,on:false})})}
  function tile(name,cell){const o=scene.getObjectByName(name);if(!o||!o.isMesh||!o.parent||!o.geometry||!o.geometry.index||o.userData.tiled)return;o.userData.tiled=1;const geo=o.geometry,idx=geo.index.array,pos=geo.attributes.position,B=new Map();
    for(let t=0;t<idx.length;t+=3){const a=idx[t],b=idx[t+1],c=idx[t+2],x=(pos.getX(a)+pos.getX(b)+pos.getX(c))/3,z=(pos.getZ(a)+pos.getZ(b)+pos.getZ(c))/3,k=Math.floor(x/cell)+":"+Math.floor(z/cell);let L=B.get(k);if(!L)B.set(k,L=[]);L.push(a,b,c)}
    B.forEach(arr=>{const gg=new THREE.BufferGeometry();["position","normal","uv","color"].forEach(k=>{if(geo.attributes[k])gg.setAttribute(k,geo.attributes[k])});gg.setIndex(arr);gg.computeBoundingSphere();const m=new THREE.Mesh(gg,o.material);m.name=name+"Tile";m.userData=o.userData;m.receiveShadow=o.receiveShadow;m.castShadow=SMALL?false:o.castShadow;m.renderOrder=o.renderOrder;m.position.copy(o.position);m.quaternion.copy(o.quaternion);m.scale.copy(o.scale);m.matrix.copy(o.matrix);m.matrixAutoUpdate=o.matrixAutoUpdate;o.parent.add(m)});o.parent.remove(o)}
  function pre(cam){const now=performance.now();if(now-tScan>2000){tScan=now;try{tile("rail",700)}catch(e){console.warn("rail tile",e)}collect()}if(!list.length)return;
    cam.updateMatrixWorld();pm.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);fr.setFromProjectionMatrix(pm);
    for(const e of list){const o=e.o;if(!o.parent)continue;const attr=o.instanceMatrix;if(attr.array!==e.base){e.base=attr.array;e.v=-1}if(e.v!==attr.version||!e.P){e.P=new Float32Array(e.n*3);o.updateMatrixWorld(true);for(let i=0;i<e.n;i++){mw.fromArray(e.base,i*16);wp.setFromMatrixPosition(mw).applyMatrix4(o.matrixWorld);e.P[i*3]=wp.x;e.P[i*3+1]=wp.y;e.P[i*3+2]=wp.z}e.v=attr.version}
      const S=e.scratch,col=o.instanceColor,CS=e.cscratch,CA=e.csrc;let k=0;for(let i=0;i<e.n;i++){sph.center.set(e.P[i*3],e.P[i*3+1],e.P[i*3+2]);sph.radius=5;if(!fr.intersectsSphere(sph))continue;const a=i*16,d=k*16;for(let t=0;t<16;t++)S[d+t]=e.base[a+t];if(CA){const c=i*3,cd=k*3;CS[cd]=CA[c];CS[cd+1]=CA[c+1];CS[cd+2]=CA[c+2]}k++}
      attr.array=S;o.count=k;attr.needsUpdate=true;if(col&&CS){col.array=CS;col.needsUpdate=true}e.on=true;e.v=attr.version}}
  function post(){for(const e of list){if(!e.on)continue;const o=e.o;o.instanceMatrix.array=e.base;o.count=e.n;if(o.instanceColor&&e.csrc)o.instanceColor.array=e.csrc;e.on=false;e.v=o.instanceMatrix.version}}
  return{pre,post,list}})();
/* 127.6: אנשים רחוקים (FIG.LOD) — רק בציור של המצלמה הראשית */
{const R0=renderer.render.bind(renderer);renderer.render=function(s,c){const go=s===scene&&c===camera;if(go){try{FIG.LOD.pre(c)}catch(e){console.warn("flod",e)}try{ICULL.pre(c)}catch(e){console.warn("icull",e)}}try{R0(s,c)}finally{if(go){try{ICULL.post()}catch(e){}try{FIG.LOD.post()}catch(e){}}}};window.__FLOD=FIG.LOD;window.__ICULL=ICULL}
// ==== v60: quality setting (auto / high / saver) in the View drawer, Shift+P perf box ====
(function(){const $=id=>document.getElementById(id);const d=$("dr-view");if(!d)return;
  const w=document.createElement("div");w.className="ctl";w.innerHTML='<div class="cl">איכות</div><div class="seg" role="group" aria-label="איכות" id="qSeg"><button type="button" data-q="auto">אוטומטי</button><button type="button" data-q="high">גבוהה</button><button type="button" data-q="low">חסכונית</button></div><p class="ch" id="qNote"></p>';
  d.insertBefore(w,d.children[2]||null);
  const cur=QSET;w.querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.q===cur?"true":"false");b.onclick=()=>{if(b.dataset.q===QSET)return;try{localStorage.setItem("tm_q",b.dataset.q)}catch(e){}/* 122.6: a tour survives the reload: stop it first (so the link saves the view from before the tour), then the link carries the tour and its station */let tr="";try{const SA=window.__STORY;if(SA&&SA.S.key&&document.body.classList.contains("touring")){tr="&tr="+SA.S.key+"."+Math.max(0,SA.S.i);SA.stop()}}catch(e){}try{const su=typeof shareURL==="function"?shareURL:(window.__UI&&window.__UI.shareURL);history.replaceState(null,"",su()+tr)}catch(e){console.warn("q link",e)}toast("טוען מחדש באיכות החדשה — המבט והשעה נשמרים…");setTimeout(()=>location.reload(),600)}});
  $("qNote").textContent="עכשיו: "+(QL==="low"?"חסכונית":"גבוהה")+(QSET==="auto"?" (נבחר אוטומטית לפי המכשיר)":"")+".";
  window.addEventListener("keydown",e=>{const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(e.shiftKey&&e.key.toLowerCase()==="p"){e.preventDefault();$("perfbtn").click()}});
})();

