// ==== v60: distance LOD for big instanced crowds (trees, people, graves, lamps): near = full, far = a box, small parts (heads, trunks) hidden far ====
(function(){
const E=[],done=new WeakSet(),cam=new THREE.Vector3(),last=new THREE.Vector3(1e9,0,0),wp=new THREE.Vector3(),mw=new THREE.Matrix4();
const KQ=QL==="low"?0.6:1;let lastT=0,changed=false,shT=0;
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
  fresh.forEach(e=>{const o=e.o,t=tris(e.g);e.rn=Math.max(250,e.r*120)*KQ;e.rp=Math.max(220,e.r*900)*KQ;
    if(!e.part&&t>16){const bb=e.g.boundingBox,sz=bb.getSize(new THREE.Vector3()),ce=bb.getCenter(new THREE.Vector3());let fg;
      if(e.g.type==="BoxGeometry"){fg=new THREE.PlaneGeometry(sz.x,sz.z);fg.rotateX(-Math.PI/2);fg.translate(ce.x,bb.max.y,ce.z)}else{fg=new THREE.BoxGeometry(Math.max(sz.x,0.01),Math.max(sz.y,0.01),Math.max(sz.z,0.01));fg.translate(ce.x,ce.y,ce.z)}
      const f=new THREE.InstancedMesh(fg,o.material,e.n);f.count=0;f.castShadow=false;f.receiveShadow=o.receiveShadow;f.frustumCulled=false;f.userData=o.userData;f.matrixAutoUpdate=o.matrixAutoUpdate;f.position.copy(o.position);f.quaternion.copy(o.quaternion);f.scale.copy(o.scale);f.matrix.copy(o.matrix);f.renderOrder=o.renderOrder;
      if(e.C){f.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(e.n*3),3)}
      Object.defineProperty(f,"__lodFar",{value:true});o.parent.add(f);e.far=f;if(cPick.includes(o))cPick.push(f);if(PICK.includes(o))PICK.push(f)}
    E.push(e)});
  last.set(1e9,0,0);upd(true)}
function revert(e){const o=e.o;o.instanceMatrix.array.set(e.M);if(e.C&&o.instanceColor)o.instanceColor.array.set(e.C);o.count=e.n;o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;if(e.far){e.far.parent&&e.far.parent.remove(e.far);e.far.geometry.dispose()}o.userData.noLOD=true}
function upd(force){cam.copy(camera.position);if(!force&&cam.distanceToSquared(last)<64)return;last.copy(cam);
  for(let j=E.length-1;j>=0;j--){const e=E[j],o=e.o;
    if(!inScene(o)){if(e.far){e.far.parent&&e.far.parent.remove(e.far);e.far.geometry.dispose()}E.splice(j,1);continue}
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
// ==== v60: quality setting (auto / high / saver) in the View drawer, Shift+P perf box ====
(function(){const $=id=>document.getElementById(id);const d=$("dr-view");if(!d)return;
  const w=document.createElement("div");w.className="ctl";w.innerHTML='<div class="cl">איכות</div><div class="seg" role="group" aria-label="איכות" id="qSeg"><button type="button" data-q="auto">אוטומטי</button><button type="button" data-q="high">גבוהה</button><button type="button" data-q="low">חסכונית</button></div><p class="ch" id="qNote"></p>';
  d.insertBefore(w,d.children[2]||null);
  const cur=QSET;w.querySelectorAll("button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.q===cur?"true":"false");b.onclick=()=>{if(b.dataset.q===QSET)return;try{localStorage.setItem("tm_q",b.dataset.q)}catch(e){}toast("טוען מחדש באיכות החדשה…");setTimeout(()=>location.reload(),600)}});
  $("qNote").textContent="עכשיו: "+(QL==="low"?"חסכונית":"גבוהה")+(QSET==="auto"?" (נבחר אוטומטית לפי המכשיר)":"")+".";
  window.addEventListener("keydown",e=>{const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(e.shiftKey&&e.key.toLowerCase()==="p"){e.preventDefault();$("perfbtn").click()}});
})();

// ==== v77: review mode ("מצב בדיקה") — low quality + a fixed-camera tour of every gate, opening and room ====
(function(){
const V3=THREE.Vector3;
// small corner button (normal mode) — switches on review mode and reloads
if(!REVIEW){const b=document.createElement("button");b.type="button";b.id="revBtn";b.className="ui";b.textContent="מצב בדיקה";b.title="מצב בדיקה: איכות נמוכה וסיור קבוע בכל השערים";
  b.onclick=()=>{try{sessionStorage.setItem("tm_review","1")}catch(e){}try{location.hash="review=1"}catch(e){}location.reload()};stage.appendChild(b);return}
document.body.classList.add("review");
// ---- low quality: no people, no transit, no city, no moving smoke/fire ----
try{LIFE.visible=false}catch(e){}try{SHOW_TR=false;if(TRN){TRN.visible=false;TRN.stopRide&&TRN.stopRide()}}catch(e){}
["oP","oT"].forEach(id=>{const b=document.getElementById(id);if(b)b.setAttribute("aria-pressed","false")});
const CITYN=/^(בתי העיר|כבישים|מדרחובות|חומות העיר העתיקה)$/;
let HID=[],DOCC=[],CITYON=false;
function hideCity(){CITYON=false;const off=c=>{if(c.visible){c.visible=false;HID.push(c)}};
  WG.children.forEach(c=>{const m=c.material||{},n=c.userData&&c.userData.n||"";if(c.isInstancedMesh){off(c);return}
  if(PICK.includes(c)){if(CITYN.test(n)){off(c);return}const bb=new THREE.Box3().setFromObject(c),q=bb.getCenter(new V3());if(q.x<-240||q.x>270||q.z<-310||q.z>340)off(c);return}
  if(c.isMesh&&!m.map&&!m.vertexColors){const bb=new THREE.Box3().setFromObject(c),s=bb.getSize(new V3());if(s.x>90||s.z>90)off(c)}});
  const C0=new V3(COMP.X0+250*A,0,-(COMP.N0-250*A));labels.forEach(L=>{if(!L.c&&!cLabels.includes(L)&&!L.docc&&Math.hypot(L.v.x-C0.x,L.v.z-C0.z)>320){L.docc=true;DOCC.push(L)}});
  RT=null;renderer.shadowMap.needsUpdate=true}
// the gates of the Old City need the city around them: show it for those stops only
function showCity(){if(CITYON)return;CITYON=true;HID.forEach(c=>c.visible=true);HID=[];DOCC.forEach(L=>L.docc=false);DOCC=[];RT=null}
const SKIN=new Set(["e0b896","c99a74","a7764f","7b5236","f0cfb2","b38b6d"]);
// people: animated figures (attribute lg), heads in skin colours, and every instanced part that goes with those heads (same parent, same count)
function hidePeople(){try{const keys=new Set();group.traverse(o=>{if(o.isInstancedMesh&&o.material&&o.material.color&&SKIN.has(o.material.color.getHexString()))keys.add((o.parent&&o.parent.uuid)+"|"+o.count)});
  group.traverse(o=>{if(!o.visible||!o.geometry)return;if(o.geometry.attributes.lg||o.material===M.people||(o.isInstancedMesh&&keys.has((o.parent&&o.parent.uuid)+"|"+o.count)))o.visible=false})}catch(e){}}
function calm(){hidePeople();try{if(ksm)ksm.visible=false}catch(e){}try{if(smoke)smoke.visible=false}catch(e){}try{PFX.forEach(S=>{if(S.pts)S.pts.visible=false})}catch(e){}}
// ---- overlay ----
const ov=document.createElement("div");ov.id="revOv";ov.innerHTML='<div id="rvTop"><div id="rvN"></div><div id="rvM"></div><div id="rvH"></div></div><div id="rvBar"><button type="button" id="rvPrev">→ הקודם</button><button type="button" id="rvStop">עצור</button><button type="button" id="rvNext">הבא ←</button><button type="button" id="rvExit">יציאה ממצב בדיקה</button></div>';stage.appendChild(ov);
const $=id=>document.getElementById(id);
$("rvExit").onclick=()=>{try{sessionStorage.setItem("tm_review","0")}catch(e){}try{if(/review=1/.test(location.hash))location.hash=""}catch(e){}
  try{if(/[?&]review=1/.test(location.search)){location.href=location.href.replace(/([?&])review=1&?/,"$1").replace(/[?&]$/,"");return}}catch(e){}location.reload()};
// ---- measuring: floor height under a point, and the steps built along a line ----
const RC=new THREE.Raycaster(),DOWN=new V3(0,-1,0);let RT=null,RTsig="";
function targets(){const sig=PLAN+"|"+group.children.length;if(RT&&RTsig===sig)return RT;RTsig=sig;const out=[];
  const vis=o=>{for(let q=o;q;q=q.parent){if(!q.visible&&q!==WG)return false}return true};
  [group,WG].forEach(r=>r.traverse(o=>{if(!o.isMesh||!o.geometry)return;const m=o.material;if(m&&!Array.isArray(m)&&m.transparent&&m.opacity<0.6)return;if(!vis(o))return;if(!CITYON&&PICK.includes(o)&&!/רחבת|שער|גשר|פתח|מעבר|^הר הבית$|מדרגות|מעקה/.test(o.userData&&o.userData.n||""))return;out.push(o)}));return RT=out}
function hitsAt(x,z){RC.set(new V3(x,500,z),DOWN);RC.far=1200;const ys=[];RC.intersectObjects(targets(),false).forEach(h=>{const y=h.point.y;if(!ys.length||ys[ys.length-1]-y>0.03)ys.push(y)});return ys}
// a floor = a surface with at least 1.9 m free above it; ref=null takes the topmost, otherwise the one closest to ref
function floorY(x,z,ref){const ys=hitsAt(x,z);if(!ys.length&&ref==null){try{const g=groundAt(x,z);if(isFinite(g))return g}catch(e){}}let best=null,bd=1e9;for(let i=0;i<ys.length;i++){const cl=i?ys[i-1]-ys[i]:1e9;if(cl<1.9)continue;if(ref==null){let g=-1e9;try{g=groundAt(x,z)}catch(e){}return(isFinite(g)&&g>ys[i]+0.3&&g<ys[i]+40)?g:ys[i]}const d=Math.abs(ys[i]-ref);if(d<bd){bd=d;best=ys[i]}}return best}
function countSteps(a,b,y0){const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1,n=Math.max(2,Math.ceil(L/0.1)),px=-dz/L,pz=dx/L;let prev=y0,up=0,down=0;
  // three parallel lines 1 m apart; the lowest floor wins, so a lamp base or a basin is not counted as a step. A step = a sudden rise of 9 cm or more.
  for(let i=1;i<=n;i++){const t=i/n,x=a[0]+dx*t,z=a[1]+dz*t;let y=null;for(const o of [0,-1,1]){const q=floorY(x+px*o,z+pz*o,prev);if(q!=null&&Math.abs(q-prev)<=0.8&&(y==null||q<y))y=q}
    if(y==null)continue;const d=y-prev;if(d>0.09)up++;else if(d<-0.09)down++;prev=y}return{up,down}}
// ---- the stop list ----
const HF=()=>(PLAN==="ez"?13.56:22)*A,OC=()=>3.5*A;   // OC: the floor inside the outer gates   // house floor and outer-court floor (m), as references for roofed places
const GN={"250,25":"השער החיצוני הצפוני","250,475":"השער החיצוני הדרומי","475,250":"השער החיצוני המזרחי (הסגור)","250,175":"השער הפנימי הצפוני","250,325":"השער הפנימי הדרומי","325,250":"השער הפנימי המזרחי"};
const W2=(u,v)=>[COMP.X0+u*A,-(COMP.N0-v*A)];
const findL=re=>labels.find(L=>L.txt&&re.test(L.txt));
// all the pieces that carry one name (a gate made of several leaves), as one box
function pickAll(re){const bb=new THREE.Box3();let k=0;cPick.forEach(o=>{const d=o.userData;if(!d||!d.n||!re.test(d.n))return;const b=new THREE.Box3().setFromObject(o);if(!b.isEmpty()){bb.union(b);k++}});return k?bb:null}
function pickBox(re,near){let best=null,bd=1e9;cPick.forEach(o=>{const d=o.userData;if(!d||!d.n||!re.test(d.n))return;const bb=new THREE.Box3().setFromObject(o);if(bb.isEmpty())return;const c=bb.getCenter(new V3());const dd=near?Math.hypot(c.x-near[0],c.z-near[1]):0;if(dd<bd){bd=dd;best=bb}});return best}
function allPickBox(re){const bb=new THREE.Box3();let n=0;cPick.forEach(o=>{const d=o.userData;if(d&&d.n&&re.test(d.n)){bb.expandByObject(o);n++}});return n?bb:null}
// gate stop: G = the gate face on the outer side; dir = unit vector pointing out; inner = a point on the far side of the passage
function gStop(name,G,dir,inner,o){o=o||{};const od=o.od||15,out=[G[0]+dir[0]*od,G[1]+dir[1]*od],It=o.It||[G[0],G[1]];
  // floors are measured right beside the gate: 1 m inside the inner face, and (for a closed gate) 2 m outside it
  return{name,kind:"gate",G,dir,hw:o.hw||3,od,O:out,I:inner,Ot:[G[0],G[1]],It,oRef:o.oRef==null?null:o.oRef,iRef:o.iRef==null?null:o.iRef,stepTo:o.stepTo||G,
    iM:o.iM||[It[0]-dir[0]*1,It[1]-dir[1]*1],oM:o.oM||(o.closed?[G[0]+dir[0]*2,G[1]+dir[1]*2]:out),closed:o.closed||null,lines:o.lines||[G,It]}}
function stopsFor(mode){const S=[];const rb=mode==="rambam";
  GLIST.forEach(g=>{const k=g.cu+","+g.cv;let nm=g.nm||GN[k]||"שער";if(rb&&k==="325,250")nm="השער הפנימי המזרחי (שער ניקנור)";const cl=!g.nm&&k==="475,250";if(cl)nm="השער החיצוני המזרחי = שער שושן";
    const ax=g.axis==="e"?[1,0]:[0,1],sg=g.axis==="e"?g.outward:g.outward,dir=g.axis==="e"?[sg,0]:[0,sg];   // u→x (east), v→z (south)
    const c=W2(g.cu,g.cv),half=g.L/2*A,G=[c[0]+dir[0]*half,c[1]+dir[1]*half],inEnd=[c[0]-dir[0]*half,c[1]-dir[1]*half];
    S.push(gStop(nm,G,dir,[inEnd[0]-dir[0]*5,inEnd[1]-dir[1]*5],{It:inEnd,hw:(g.hw||12.5)*A,closed:cl?"סגור (יחזקאל מד, ב)":null}));S[S.length-1].design={n:g.n,y0:g.y0,fl:g.floor}});
  // gates of Har HaBayit (only where the model builds them)
  const mg=(re,dir,inRe,nm)=>{const L=findL(re);if(!L)return;const G=[L.v.x,L.v.z];let I=[G[0]-dir[0]*10,G[1]-dir[1]*10],It=G;const E=inRe&&findL(inRe);if(E){I=[E.v.x-dir[0]*8,E.v.z-dir[1]*8];It=[E.v.x,E.v.z]}S.push(gStop(nm||L.txt,G,dir,I,{It}))};
  const MG=window.__MG||[];
  const mgate=(re,inRe,iRef,o2)=>{const g=MG.find(q=>re.test(q.n));if(!g||!g.w_)return;const w=g.w_,p=G2S(w.x,w.n),o=G2S(w.ox,w.on),G=[p[0],-p[1]],dir=[o[0],-o[1]],ln=Math.hypot(dir[0],dir[1])||1;dir[0]/=ln;dir[1]/=ln;
    let I=[G[0]-dir[0]*10,G[1]-dir[1]*10],It=G;const E=inRe&&findL(inRe);if(E){const e=[E.v.x,E.v.z],ex=G[0]-e[0],ez=G[1]-e[1],el=Math.hypot(ex,ez)||1;I=[e[0]-ex/el*8,e[1]-ez/el*8];It=e}
    const tu=g.T_?{iM:I,stepTo:[G[0]+dir[0]*3.4,G[1]+dir[1]*3.4]}:{};
    S.push(gStop(g.n,G,dir,I,Object.assign({It,iRef:iRef==null?0:iRef,hw:(g.w+4)/2},tu,o2||{})))};
  mgate(/^שער טדי$/,null,null,{closed:"לא משמש (מידות א, ג)"});
  // שער שושן is the outer face of the closed east gate of the 500-amah wall, so it is not a separate stop
  mgate(/^שער חולדה המערבי/,/^ירידה לשער היציאה/);mgate(/^שער חולדה המזרחי/,/^יציאה מהמעבר/);mgate(/^שער קיפונוס$/,/^המעבר מקיפונוס/);
  if(!rb){
    // today's gates of Har HaBayit (same in both plans, so they are shown once)
    MG.filter(g=>!g.five).forEach(g=>mgate(new RegExp("^"+g.n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"$")));
    // gates in a wall polygon (geo coords): the gate point is the nearest point on the wall, "out" points away from the polygon
    const polyGate=(re,poly,nm,city,o2)=>{const L0=findL(re);if(!L0)return;let L=L0,hd=0;{const bb=new THREE.Box3();let k=0;PICK.forEach(o=>{if(o.userData&&re.test(o.userData.n||"")){bb.expandByObject(o);k++}});if(k){const c=bb.getCenter(new V3()),sz=bb.getSize(new V3());if(sz.x<120&&sz.z<120){L={v:c,txt:L0.txt};hd=Math.min(15,Math.max(sz.x,sz.z)/2)}}}const P=poly.map(q=>{const s2=G2S(q[0],q[1]);return[s2[0],-s2[1]]});let best=null,bd=1e9;
      for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],dx=b[0]-a[0],dz=b[1]-a[1],l2=dx*dx+dz*dz||1,t=Math.max(0,Math.min(1,((L.v.x-a[0])*dx+(L.v.z-a[1])*dz)/l2)),px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(L.v.x-px,L.v.z-pz);if(d<bd){bd=d;best=[px,pz,dx,dz]}}
      if(!best||bd>40)return;let n=[best[3],-best[2]];const nl=Math.hypot(n[0],n[1])||1;n=[n[0]/nl,n[1]/nl];let cx=0,cz=0;P.forEach(q=>{cx+=q[0]/P.length;cz+=q[1]/P.length});if((best[0]-cx)*n[0]+(best[1]-cz)*n[1]<0)n=[-n[0],-n[1]];
      const G=[best[0],best[1]],st=gStop(nm||L.txt,G,n,[G[0]-n[0]*(12+hd),G[1]-n[1]*(12+hd)],Object.assign({od:15+hd,hw:Math.max(3,hd)},o2||{}));st.city=!!city;S.push(st)};
    polyGate(/^שער הרחמים$/,MOUNT,"שער הרחמים (שער הזהב)",false,{closed:"סגור (היום)",od:8});
    ["שער האריות","שער הפרחים","שער שכם","השער החדש","שער יפו","שער ציון","שער האשפות"].forEach(n=>polyGate(new RegExp("^"+n+"$"),OLD,n+" (חומת העיר)",true))}
  // openings of the House
  {const d=pickAll(/^שער ההיכל$/);if(d){const c=d.getCenter(new V3());S.push(gStop("שער ההיכל",[d.max.x,c.z],[1,0],[d.min.x-8,c.z],{od:24,It:[d.min.x,c.z],iRef:HF(),hw:d.getSize(new V3()).z/2}))}}
  {const d=pickBox(/^הפתח לקודש הקודשים$/)||pickBox(/^שתי הפרוכות$/);if(d){const c=d.getCenter(new V3());S.push(gStop("הפתח לקודש הקודשים",[d.max.x,c.z],[1,0],[d.min.x-7,c.z],{It:[d.min.x,c.z],oRef:HF(),iRef:HF()}))}}
  {const d=pickBox(/^פתחי הצלעות$/,[0,-1e4]);if(d){const c=d.getCenter(new V3());S.push(gStop("פתח הצלעות (צפון)",[c.x,d.min.z],[0,-1],[c.x,d.min.z+1.4],{od:8,It:[c.x,d.min.z],oRef:7.5*A,iRef:HF(),oM:[c.x,d.min.z-1],hw:1}))}}
  // rooms: the chambers, the Kotel, the Ulam, the Heikhal, the Kodesh HaKodashim
  const C0=W2(250,250),seen=new Set();
  const room=(name,c,hx,hz,o)=>{o=o||{};let dir=o.dir;if(!dir){const dx=C0[0]-c[0],dz=C0[1]-c[1];dir=Math.abs(dx)>Math.abs(dz)?[Math.sign(dx)||1,0]:[0,Math.sign(dz)||1]}
    const h=dir[0]?hx:hz,door=[c[0]+dir[0]*h,c[1]+dir[1]*h];
    S.push({name,kind:"room",G:door,O:[door[0]+dir[0]*15,door[1]+dir[1]*15],Ot:door,I:[c[0]-dir[0]*h*0.6,c[1]-dir[1]*h*0.6],It:[door[0]+dir[0]*6,door[1]+dir[1]*6],iM:[c[0],c[1]],oRef:o.oRef==null?null:o.oRef,iRef:o.iRef==null?"o":o.iRef,stepTo:door})};
  (window.__CHD||[]).forEach(d=>{if(!d.nm||seen.has(d.nm))return;seen.add(d.nm);const p=W2(d.u,d.v),dir=d.ax==="u"?[d.s,0]:[0,d.s],dp=Math.max(1.5,d.dp*A-1.6);
    const st=gStop(d.nm,p,dir,[p[0]-dir[0]*dp,p[1]-dir[1]*dp],{It:[p[0]+dir[0]*3,p[1]+dir[1]*3],iM:[p[0]-dir[0]*1.2,p[1]-dir[1]*1.2],oRef:d.yo*A,iRef:d.y*A,hw:d.w/2*A,od:14});st.kind="room";S.push(st)});
  const CH=/לשכ|בית המוקד|בית אבטינס|בית הטבילה/;
  labels.forEach(L=>{if(!L.c||!L.txt||!CH.test(L.txt+" "+(L.info&&L.info.n||"")))return;const nm=L.txt;if(seen.has(nm)||[...seen].some(x=>nm.startsWith(x+" —"))||S.some(q=>q.name===nm))return;seen.add(nm);
    const bb=pickBox(/./,[L.v.x,L.v.z]);let hx=4,hz=4;if(bb){const s=bb.getSize(new V3());if(s.x<40&&s.z<40){hx=Math.max(2,s.x/2);hz=Math.max(2,s.z/2)}}room(nm,[L.v.x,L.v.z],hx,hz)});
  {const done=new Set(labels.filter(L=>L.c&&L.info&&L.info.n).map(L=>L.info.n));const grp={};cPick.forEach(o=>{const n=o.userData&&o.userData.n;if(!n||!/^לשכ/.test(n)||done.has(n)||seen.has(n))return;(grp[n]=grp[n]||[]).push(o)});
    Object.keys(grp).forEach(n=>{const bb=new THREE.Box3().setFromObject(grp[n][0]),c=bb.getCenter(new V3()),s=bb.getSize(new V3());room(n,[c.x,c.z],Math.max(2,s.x/2),Math.max(2,s.z/2))})}
  {const L=findL(/^הכותל המערבי$/);if(L)S.push(gStop("הכותל המערבי",[L.v.x-3,L.v.z],[-1,0],[L.v.x+12,L.v.z],{od:18,It:[L.v.x-3,L.v.z]}))}
  {const d=pickAll(/^שער ההיכל$/),k=pickBox(/^הפתח לקודש הקודשים$/)||pickBox(/^שתי הפרוכות$/);if(d&&k){const z=d.getCenter(new V3()).z,dx=d.max.x;
    // the Ulam front: first wall met by a ray from the east, beside the opening
    let fx=dx+6.3;{RC.set(new V3(dx+60,HF()+1.6,z-5.5),new V3(-1,0,0));RC.far=80;const h=RC.intersectObjects(targets(),false)[0];if(h&&h.point.x>dx+1)fx=h.point.x}
    S.push({name:"האולם",kind:"room",G:[fx,z],O:[fx+15,z],Ot:[fx,z],I:[fx-3.2,z],It:[dx,z],oRef:null,iRef:HF(),stepTo:[fx,z]});
    S.push({name:"ההיכל",kind:"room",G:[dx,z],O:[dx+24,z],Ot:[dx,z],I:[dx-3.6,z],It:[k.max.x,z],oRef:null,iRef:HF(),stepTo:[dx,z]});
    S.push({name:"קודש הקודשים",kind:"room",G:[k.max.x,z],O:[k.max.x+15,z],Ot:[k.max.x,z],I:[k.min.x-1.2,z],It:[k.min.x-11,z],oRef:HF(),iRef:HF(),stepTo:[k.max.x,z]})}}
  S.forEach(s=>s.mode=mode);return S}
// ---- tour state ----
let LIST=[],idx=0,PLAYING=true,timer=0,shownAt=0,busyM=false;
const MODEN={ez:"יחזקאל (מלבי״ם)",rambam:"הרמב״ם"};
function setMode(m){if(PLAN===m)return false;const b=$(m==="ez"?"plEz":"plRb");if(b)b.click();RT=null;return true}
function solidAt(x,y,z,fl){for(const c of COL){if(x>c.x0&&x<c.x1&&z>c.z0&&z<c.z1&&y>c.y0&&y<c.y1)return true}const ys=hitsAt(x,z);for(const q of ys){if(q>fl+0.35&&q<y+0.6)return true}return false}
function gnd(x,z){try{const g=groundAt(x,z);return isFinite(g)?g:null}catch(e){return null}}
function measure(s){if(s.m)return s.m;const oP=s.oM||s.O,iP=s.iM||s.I;
  // in the city, floors are taken on the ground, not on the top of the wall
  const oref=s.city&&s.oRef==null?gnd(oP[0],oP[1]):s.oRef;const oy=floorY(oP[0],oP[1],oref);
  let iref=s.iRef==="o"?oy:s.iRef;if(s.city&&iref==null)iref=gnd(iP[0],iP[1]);const iy=floorY(iP[0],iP[1],iref);
  const ocy=oP===s.O?oy:floorY(s.O[0],s.O[1],s.city?gnd(s.O[0],s.O[1]):s.oRef),icy=iP===s.I?iy:floorY(s.I[0],s.I[1],iy==null?iref:iy);
  const st=(oy==null||s.closed)?null:countSteps(s.O,s.stepTo,ocy==null?oy:ocy);return s.m={oy,iy,ocy,icy,st,walls:wallSides(s,Math.max(oy==null?-1e9:oy,iy==null?-1e9:iy))}}
// is the gate joined to a wall on each side? a wall = something at least 2.5 m above the floor, 1.5 m and 5 m beyond the gate's side
function wallSides(s,fl){if(s.kind!=="gate"||!s.dir||!isFinite(fl))return null;const p=[-s.dir[1],s.dir[0]],res=[];
  for(const sd of [1,-1]){let ok=false;for(const Lp of s.lines){let both=true;for(const e of [1.5,5]){const x=Lp[0]-s.dir[0]*0.6+p[0]*sd*(s.hw+e),z=Lp[1]-s.dir[1]*0.6+p[1]*sd*(s.hw+e),ys=hitsAt(x,z);if(!ys.length||ys[0]-fl<2.5){both=false;break}}if(both){ok=true;break}}res.push(ok)}return res}
const fm=y=>y==null?"?":(y>=0?"":"−")+Math.abs(y).toFixed(2)+" מ׳ ("+(Math.abs(y/A)<0.05?"0":(y/A).toFixed(1))+" אמה)";
function show(){const v=LIST[idx];if(!v)return;const s=v.s;
  if(setMode(s.mode)){busyM=true;$("rvH").textContent="בונה את מצב "+MODEN[s.mode]+"…";setTimeout(()=>{busyM=false;rebuildAfterMode();show()},60);return}
  const inside=v.k==="I";if(s.city)showCity();else if(CITYON)hideCity();calm();
  $("rvN").textContent=s.name+(s.closed?" 🔒":"");$("rvM").innerHTML='<span class="rvk">'+MODEN[s.mode]+'</span> · <b><bdi>'+(v.si+1)+"/"+STOPS+'</bdi></b> · '+(inside?"מבט מבפנים":"מבט מבחוץ, כ־15 מ׳")+' <small>('+(v.k==="O"?1:2)+"/2)</small>";
  $("rvH").textContent="מודד…";
  const place=m=>{const p=inside?s.I:s.O,t=inside?s.It:s.Ot;let fy=inside?(m.icy!=null?m.icy:m.iy):(m.ocy!=null?m.ocy:m.oy);if(fy==null)fy=inside?(m.oy||0):0;if(!inside&&s.eyeO!=null)fy=s.eyeO-1.65;if(inside&&s.eyeI!=null)fy=s.eyeI-1.65;let eye=fy+1.65;
    const cp=new V3(p[0],eye,p[1]);
    // never leave the camera inside a wall, a roof or a dome: step back (outside views) or forward (inside views) until it is free
    {const dx=t[0]-p[0],dz=t[1]-p[1],dl=Math.hypot(dx,dz)||1,sg=inside?0.5:-0.5;for(let k=0;k<40&&solidAt(cp.x,cp.y,cp.z,fy);k++){cp.x+=dx/dl*sg;cp.z+=dz/dl*sg;const f2=floorY(cp.x,cp.z,fy);if(f2!=null&&Math.abs(f2-fy)<3){fy=f2;cp.y=f2+1.65}}}
    eye=cp.y;const tgY=inside?eye:eye+1.2;let tp=new V3(t[0],tgY,t[1]);if(cp.distanceTo(tp)<2)tp=cp.clone().add(tp.clone().sub(cp).setLength(2).add(new V3(0.001,0,0)));
    tween=null;camAt(cp,tp)};
  // quick placement first (old numbers or a guess), then measure and place exactly
  if(s.m)place(s.m);else{place({oy:floorY(s.O[0],s.O[1],s.city?gnd(s.O[0],s.O[1]):s.oRef),iy:floorY(s.I[0],s.I[1],s.iRef==="o"?null:(s.city&&s.iRef==null?gnd(s.I[0],s.I[1]):s.iRef))})}
  shownAt=performance.now();
  setTimeout(()=>{if(LIST[idx]!==v)return;const m=measure(s);place(m);
    let t="רצפה בחוץ: "+fm(m.oy)+" · בפנים: "+fm(m.iy);if(m.oy!=null&&m.iy!=null)t+=" · הפרש "+(m.iy-m.oy).toFixed(2)+" מ׳";
    t+="\n"+(s.closed?"🔒 "+s.closed+" — המדרגות לא נספרות, הרצפה בחוץ נמדדת 2 מ׳ מהשער":!m.st?"מדרגות: לא נמדדו":"מדרגות בנויות לפני "+(s.kind==="room"?"הפתח":"השער")+": "+m.st.up+" עולות"+(m.st.down?", "+m.st.down+" יורדות":""));
    if(m.walls)t+=" · חומה מחוברת: "+(m.walls[0]&&m.walls[1]?"כן, משני הצדדים":m.walls[0]||m.walls[1]?"רק מצד אחד":"לא");
    $("rvH").textContent=t;shownAt=performance.now()},30)}
function rebuildAfterMode(){hideCity();calm()}
function go(d){idx=(idx+d+LIST.length)%LIST.length;show()}
function setPlay(p){PLAYING=p;$("rvStop").textContent=p?"עצור":"המשך";shownAt=performance.now()}
$("rvPrev").onclick=()=>go(-1);$("rvNext").onclick=()=>go(1);$("rvStop").onclick=()=>setPlay(!PLAYING);
addEventListener("keydown",e=>{const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;
  if(e.key==="ArrowLeft"||e.key==="ArrowDown"){go(1)}else if(e.key==="ArrowRight"||e.key==="ArrowUp"){go(-1)}else if(e.key===" "){setPlay(!PLAYING)}else return;e.preventDefault();e.stopImmediatePropagation()},true);
let STOPS=0;
(function tick(){requestAnimationFrame(tick);if(!LIST.length||busyM)return;if(PLAYING&&performance.now()-shownAt>6000){if(idx>=LIST.length-1){setPlay(false);$("rvH").textContent+="\n— סוף הסיור —"}else go(1)}})();
// build the two lists (Malbim first, then Rambam), then start
function start(){const ld=document.getElementById("loading");if(ld){setTimeout(start,300);return}
  const intro=$("intro");if(intro)intro.hidden=true;try{closeInfo()}catch(e){}
  hideCity();calm();const m0=PLAN;
  setMode("ez");const A1=stopsFor("ez");setMode("rambam");hideCity();const A2=stopsFor("rambam");setMode("ez");hideCity();
  const all=A1.concat(A2).filter(s=>s);
  // item 30: hand-set camera distances where the automatic view lands in a wall, a roof or the market
  {const OV={"שער סוחרי הכותנה":{od:8},"שער המועצה":{od:4,eyeO:1},"שער הרחמים (שער הזהב)":{od:39,eyeO:2},"שער יפו (חומת העיר)":{O:[-757,30],eyeO:39.5},"שער האשפות (חומת העיר)":{od:12},
     "שער ההיכל":{ez:1,set:{G:[20.8,-3.3],Ot:[20.8,-3.3],It:[17.7,-3.3],O:[60,-3.3],I:[0,-3.3]}},"ההיכל":{ez:1,set:{O:[60,-3.3],Ot:[20.8,-3.3],I:[15,-3.3],It:[-3.3,-3.3]}}};
   all.forEach(s=>{const o=OV[s.name];if(!o||!s.G||(o.ez&&s.mode!=="ez"))return;if(o.set)Object.assign(s,o.set);let d=s.dir;if(!d){const dx=s.O[0]-s.G[0],dz=s.O[1]-s.G[1],l=Math.hypot(dx,dz)||1;d=[dx/l,dz/l]}
     if(o.od){s.O=[s.G[0]+d[0]*o.od,s.G[1]+d[1]*o.od];s.od=o.od}if(o.O)s.O=o.O;if(o.eyeO!=null)s.eyeO=o.eyeO})}STOPS=all.length;LIST=[];all.forEach((s,i)=>{LIST.push({s,k:"O",si:i});LIST.push({s,k:"I",si:i})});
  window.__REVIEW={list:all,go:i=>{idx=i;show()},stop:()=>setPlay(false),prof:i=>{const s=all[i],a=s.O,b=s.stepTo,oy=floorY(a[0],a[1],s.oRef),L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(L/0.15),out=[];let prev=oy;for(let k=1;k<=n;k++){const t=k/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,y=floorY(x,z,prev);out.push([+(t*L).toFixed(2),y==null?null:+y.toFixed(3),hitsAt(x,z).slice(0,5).map(v=>+v.toFixed(2))]);if(y!=null&&Math.abs(y-prev)<=0.8)prev=y}return out}};
  idx=0;setPlay(true);show()}
setTimeout(start,500);
})();

__DONE=true;__Q.splice(0).forEach(f=>{try{f()}catch(e){console.warn(e)}});
frame();
})();

