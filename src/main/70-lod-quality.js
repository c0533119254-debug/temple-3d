// ==== v60: distance LOD for big instanced crowds (trees, people, graves, lamps): near = full, far = a box, small parts (heads, trunks) hidden far ====
(function(){
const E=[],done=new WeakSet(),cam=new THREE.Vector3(),last=new THREE.Vector3(1e9,0,0),wp=new THREE.Vector3(),mw=new THREE.Matrix4();
const KQ=QL==="low"?0.6:SMALL?0.7:1;let lastT=0,changed=false,shT=0;
const tris=g=>(g.index?g.index.count:g.attributes.position.count)/3;
const inScene=o=>{for(let q=o;q;q=q.parent)if(q===scene)return true;return false};
function scan(){const c=[];scene.traverse(o=>{if(o.isInstancedMesh&&!done.has(o)&&o.count>=60&&!o.userData.train&&!o.userData.noLOD&&!o.__lodFar)c.push(o)});if(!c.length)return;
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
  cam.copy(camera.position);if(!force&&cam.distanceToSquared(last)<64)return;last.copy(cam);
  for(let j=E.length-1;j>=0;j--){const e=E[j],o=e.o;
    if(!inScene(o)){if(e.far){e.far.parent&&e.far.parent.remove(e.far);if(e.far.geometry!==o.userData.farGeo)e.far.geometry.dispose()}E.splice(j,1);continue}
    if(e.ver>=0&&o.instanceMatrix.version!==e.ver){revert(e);E.splice(j,1);continue}
    const A=o.instanceMatrix.array,CA=o.instanceColor&&o.instanceColor.array,R2=(e.part?e.rp:e.rn)**2;let k=0,kf=0;const F=e.far,FA=F&&F.instanceMatrix.array,FC=F&&F.instanceColor&&F.instanceColor.array;
    for(let i=0;i<e.n;i++){const dx=e.P[i*3]-cam.x,dy=e.P[i*3+1]-cam.y,dz=e.P[i*3+2]-cam.z,d2=dx*dx+dy*dy+dz*dz;
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
/* 127.1: אנשים רחוקים (FIG.LOD) — רק בציור של המצלמה הראשית */
{const R0=renderer.render.bind(renderer);renderer.render=function(s,c){const go=s===scene&&c===camera;if(go)try{FIG.LOD.pre(c)}catch(e){console.warn("flod",e)}try{R0(s,c)}finally{if(go)FIG.LOD.post()}};window.__FLOD=FIG.LOD}
// ==== v60: quality setting (auto / high / saver) in the View drawer, Shift+P perf box ====
(function(){const $=id=>document.getElementById(id);const d=$("dr-view");if(!d)return;
  const w=document.createElement("div");w.className="ctl";w.innerHTML='<div class="cl">איכות</div><div class="seg" role="group" aria-label="איכות" id="qSeg"><button type="button" data-q="auto">אוטומטי</button><button type="button" data-q="high">גבוהה</button><button type="button" data-q="low">חסכונית</button></div><p class="ch" id="qNote"></p>';
  d.insertBefore(w,d.children[2]||null);
  const cur=QSET;w.querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.q===cur?"true":"false");b.onclick=()=>{if(b.dataset.q===QSET)return;try{localStorage.setItem("tm_q",b.dataset.q)}catch(e){}/* 122.6: a tour survives the reload: stop it first (so the link saves the view from before the tour), then the link carries the tour and its station */let tr="";try{const SA=window.__STORY;if(SA&&SA.S.key&&document.body.classList.contains("touring")){tr="&tr="+SA.S.key+"."+Math.max(0,SA.S.i);SA.stop()}}catch(e){}try{const su=typeof shareURL==="function"?shareURL:(window.__UI&&window.__UI.shareURL);history.replaceState(null,"",su()+tr)}catch(e){console.warn("q link",e)}toast("טוען מחדש באיכות החדשה — המבט והשעה נשמרים…");setTimeout(()=>location.reload(),600)}});
  $("qNote").textContent="עכשיו: "+(QL==="low"?"חסכונית":"גבוהה")+(QSET==="auto"?" (נבחר אוטומטית לפי המכשיר)":"")+".";
  window.addEventListener("keydown",e=>{const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(e.shiftKey&&e.key.toLowerCase()==="p"){e.preventDefault();$("perfbtn").click()}});
})();

