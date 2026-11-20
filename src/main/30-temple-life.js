// ---- 133.0: one library for every animal in the model (sheep with a fat tail and wool, ram, goat, kid, bull, calf). Head toward +x, feet at y=0.
// Legs, head and tail move in the vertex shader, so a walking flock costs nothing on the CPU. Near = full shape, far = a simple shape of the same animal.
// 📜 the sheep of the land have a fat tail (אליה, ויקרא ג, ט). 💡 colors, wool and sizes are a proposal for the display.
const BEAST=(function(){const U=THREE.BufferGeometryUtils,cache={},HERDS=[],cp=new THREE.Vector3(),wp=new THREE.Vector3();
  const VS="attribute float blg;attribute vec2 bpv;attribute float btn;attribute float iph;attribute float iam;attribute float isp;attribute vec3 icol;uniform float uT;\n";
  const rot="float c_=cos(a_),s_=sin(a_);transformed.xy-=bpv;transformed.xy=vec2(c_*transformed.x-s_*transformed.y,s_*transformed.x+c_*transformed.y);transformed.xy+=bpv;";
  // ST: for an InstancedMesh made elsewhere without per-animal attributes: phase from the place, one coat color, a fixed walk amount
  const mk=(st,col,walk)=>{const m=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:0.93,metalness:0}),cc=new THREE.Color(col||0xffffff).convertSRGBToLinear();
    m.onBeforeCompile=sh=>{sh.uniforms.uT=FIG.U.uT;sh.uniforms.uCol={value:cc};sh.uniforms.uWalk={value:walk||0};
      const hd=st?"attribute float blg;attribute vec2 bpv;attribute float btn;uniform float uT;uniform vec3 uCol;uniform float uWalk;\n":VS;
      const pre=st?"\n#ifdef USE_INSTANCING\nfloat iph=fract(sin(dot(instanceMatrix[3].xz,vec2(12.9898,78.233)))*43758.5)*6.283;\n#else\nfloat iph=0.0;\n#endif\nfloat iam=uWalk,isp=1.0;vec3 icol=uCol;\n":"";
      sh.vertexShader=hd+sh.vertexShader.replace("void main() {","void main() {"+pre)
      .replace("#include <color_vertex>","#include <color_vertex>\nvColor.rgb=mix(color.rgb,color.rgb*icol,btn);")
      .replace("#include <begin_vertex>","#include <begin_vertex>\n{float ph=uT*6.2*isp+iph,L=abs(blg),a_=0.0;\n"+
      "if(L>0.5&&L<2.5){a_=sin(ph+(L>1.5?3.1416:0.0))*iam*0.42*sign(blg);"+rot+"}\n"+
      "else if(L>2.5&&L<3.5){float idle=1.0-clamp(iam,0.0,1.0);a_=sin(ph*2.0)*0.05*iam-idle*max(0.0,sin(uT*0.13+iph*5.0)-0.55)*2.4;"+rot+
        "float y_=idle*sin(uT*0.37+iph*3.0)*0.32;float c2=cos(y_),s2=sin(y_);transformed.x-=bpv.x;transformed.xz=vec2(c2*transformed.x-s2*transformed.z,s2*transformed.x+c2*transformed.z);transformed.x+=bpv.x;}\n"+
      "else if(L>3.5){float y_=sin(uT*2.6+iph)*0.35;float c2=cos(y_),s2=sin(y_);transformed.x-=bpv.x;transformed.xz=vec2(c2*transformed.x-s2*transformed.z,s2*transformed.x+c2*transformed.z);transformed.x+=bpv.x;}\n"+
      "transformed.y+=abs(sin(ph))*0.018*iam;}")};
    m.customProgramCacheKey=()=>"beast133"+(st?"s":"");return m};
  const mat=mk(false),SM={};
  const smat=(col,walk)=>{const k=col+"|"+(walk||0);return SM[k]||(SM[k]=mk(true,col,walk))};
  // one part: geometry, place, scale, rotation, color, motion code (0 body, ±1 front leg, ±2 back leg, 3 head and neck, 4 tail), pivot, tinted by the coat color or not
  function build(kind,L,H,lo){const parts=[],rs=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
    const S=(w,n,m)=>{const g=new THREE.SphereGeometry(1,lo?6:(n||10),lo?4:(m||7));if(w&&!lo){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+0.075*Math.sin(x*9.1+y*3.3)*Math.sin(y*8.3+z*2.1)*Math.sin(z*9.7+x*1.7)+0.03*Math.sin(x*23+z*19);p.setXYZ(i,x*k,y*k,z*k)}g.computeVertexNormals()}return g};
    const C=(r0,r1,h,n)=>new THREE.CylinderGeometry(r1,r0,h,lo?4:(n||8));
    const tube=(pts,r,n)=>{const c=new THREE.CatmullRomCurve3(pts.map(q=>new THREE.Vector3(q[0],q[1],q[2])));const g=new THREE.TubeGeometry(c,lo?4:(n||14),r,lo?3:6,false);
      const p=g.attributes.position,seg=(lo?4:(n||14))+1,ring=(lo?3:6)+1;for(let i=0;i<p.count;i++){const t=Math.floor(i/ring)/(seg-1),q=c.getPointAt(Math.min(1,t)),f=1-0.75*t;p.setXYZ(i,q.x+(p.getX(i)-q.x)*f,q.y+(p.getY(i)-q.y)*f,q.z+(p.getZ(i)-q.z)*f)}g.computeVertexNormals();return g};
    const put=(geo,x,y,z,sx,sy,sz,rx,ry,rz,col,code,pv,tint)=>{const m=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx||1,sy||1,sz||1));
      let g=geo.index?geo.toNonIndexed():geo.clone();if(g.attributes.uv)g.deleteAttribute("uv");if(g.attributes.uv2)g.deleteAttribute("uv2");g.applyMatrix4(m);const n=g.attributes.position.count,cc=new Float32Array(n*3),lg=new Float32Array(n),pa=new Float32Array(n*2),tn=new Float32Array(n);
      const cl=col.map(v=>Math.pow(v,2.2));for(let i=0;i<n;i++){const j=lo?1:0.93+rs()*0.12;cc[i*3]=cl[0]*j;cc[i*3+1]=cl[1]*j;cc[i*3+2]=cl[2]*j;lg[i]=code||0;pa[i*2]=pv?pv[0]:0;pa[i*2+1]=pv?pv[1]:0;tn[i]=tint===false?0:1}
      g.setAttribute("color",new THREE.BufferAttribute(cc,3));g.setAttribute("blg",new THREE.BufferAttribute(lg,1));g.setAttribute("bpv",new THREE.BufferAttribute(pa,2));g.setAttribute("btn",new THREE.BufferAttribute(tn,1));parts.push(g)};
    const W=[1,1,1],DK=[0.13,0.11,0.1],bull=kind==="bull"||kind==="calf",sheep=kind==="sheep"||kind==="ram",goat=kind==="goat"||kind==="kid",young=kind==="calf"||kind==="kid";
    const FACE=sheep?(kind==="ram"?[0.55,0.42,0.32]:[0.62,0.47,0.35]):W,HORN=kind==="ram"?[0.74,0.66,0.55]:goat?[0.36,0.33,0.3]:[0.86,0.8,0.68];
    const by=H*(sheep?0.6:bull?0.62:0.63),dep=H*(sheep?0.25:bull?0.27:0.21),wid=H*(sheep?0.23:bull?0.24:0.17),hipY=by-dep*0.3,lh=by-dep*0.55;
    // body: barrel, chest and rump (wool on the sheep)
    put(S(sheep,16,10),0,by,0,L*0.47,dep,wid,0,0,0,W,0);
    put(S(sheep,12,9),L*0.2,by+dep*0.1,0,L*0.27,dep*1.02,wid*0.98,0,0,0,W,0);
    put(S(sheep,12,9),-L*0.24,by+dep*0.06,0,L*0.25,dep*0.97,wid*0.97,0,0,0,W,0);
    if(!sheep)put(S(0),0,by-dep*0.18,0,L*0.36,dep*0.86,wid*1.04,0,0,0,W,0);                       // belly
    if(kind==="bull")put(S(0),L*0.3,by+dep*0.88,0,L*0.12,dep*0.3,wid*0.55,0,0,0,W,0);          // small hump over the shoulders
    if(sheep)put(S(1,12,9),-L*0.47,by-dep*0.42,0,L*0.1,dep*0.85,wid*0.72,0,0,0.12,W,0);          // 📜 the fat tail (alya), hanging over the hind legs
    // neck and head (code 3: nods while walking; while standing it looks around and sometimes lowers the head)
    const nx=L*0.46,ny=by+dep*(sheep?0.35:0.5),hl=H*(bull?0.31:sheep?0.27:0.27),hx=L*0.5+hl*(sheep?0.5:0.6),hy=ny+H*(bull?0.04:sheep?0.1:0.17),PV=[L*0.36,ny-dep*0.2];
    put(C(wid*(sheep?0.8:0.66),wid*0.44,hl*1.05,10),nx,ny,0,1,1,1,0,0,sheep?-0.85:-1.0,sheep?W:W,3,PV);
    if(bull&&!lo)put(S(0),nx+0.02,ny-dep*0.5,0,L*0.08,dep*0.45,wid*0.3,0,0,0,W,3,PV);           // dewlap
    put(S(0,12,9),hx,hy,0,hl*0.36,hl*0.31,wid*(goat?0.46:0.5),0,0,0,FACE,3,PV,!sheep);              // skull
    put(C(wid*0.42,wid*(bull?0.36:0.26),hl*(goat?0.62:0.55),10),hx+hl*0.3,hy-hl*0.14,0,1,1,1,0,0,-2.05,FACE,3,PV,!sheep); // face down to the muzzle
    put(S(0),hx+hl*(goat?0.56:0.52),hy-hl*(goat?0.36:0.32),0,hl*0.11,hl*0.1,wid*(bull?0.34:0.26),0,0,0,DK,3,PV,false);   // nose
    if(!lo)[1,-1].forEach(j=>put(S(0),hx+hl*0.2,hy+hl*0.08,j*wid*0.36,hl*0.035,hl*0.035,hl*0.035,0,0,0,DK,3,PV,false)); // eyes
    [1,-1].forEach(j=>{
      if(lo){}else if(sheep)put(S(0),hx-hl*0.12,hy-hl*0.02,j*wid*0.62,hl*0.09,hl*0.24,hl*0.05,j*0.35,0,0.5,FACE,3,PV,false);        // long drooping ears of the local sheep
      else if(goat)put(S(0),hx-hl*0.08,hy-hl*0.12,j*wid*0.6,hl*0.08,hl*0.3,hl*0.04,j*0.25,0,0.25,W,3,PV);             // long hanging ears of the goat
      else put(S(0),hx-hl*0.12,hy+hl*0.12,j*wid*0.52,hl*0.14,hl*0.06,hl*0.2,j*0.5,0,0,W,3,PV);
      if(kind==="bull")put(tube([[hx-hl*0.12,hy+hl*0.24,j*wid*0.35],[hx-hl*0.1,hy+hl*0.34,j*wid*0.75],[hx+hl*0.05,hy+hl*0.52,j*wid*0.92]],wid*0.075,8),0,0,0,1,1,1,0,0,0,HORN,3,PV,false);
      if(kind==="ram")put(tube([[hx-hl*0.1,hy+hl*0.28,j*wid*0.2],[hx-hl*0.42,hy+hl*0.42,j*wid*0.48],[hx-hl*0.55,hy+hl*0.05,j*wid*0.72],[hx-hl*0.25,hy-hl*0.3,j*wid*0.8],[hx+hl*0.02,hy-hl*0.1,j*wid*0.9],[hx-hl*0.05,hy+hl*0.12,j*wid*0.98]],wid*0.13,22),0,0,0,1,1,1,0,0,0,HORN,3,PV,false); // curled horns
      if(kind==="goat")put(tube([[hx-hl*0.12,hy+hl*0.3,j*wid*0.2],[hx-hl*0.3,hy+hl*0.62,j*wid*0.28],[hx-hl*0.62,hy+hl*0.72,j*wid*0.36]],wid*0.07,8),0,0,0,1,1,1,0,0,0,HORN,3,PV,false);
      // legs (two parts and a hoof). Diagonal pairs move together, like a real walk
      [1,-1].forEach(i=>{const lx=i*L*0.31,lz=j*wid*0.55,code=(i>0?1:2)*j,col=sheep?FACE:W;
        if(lo){put(C(H*(bull?0.07:0.055),H*0.035,lh,4),lx,lh*0.5,lz,1,1,1,0,0,0,col,code,[lx,hipY],!sheep);return}
        put(C(H*(bull?0.075:0.06),H*0.042,lh*0.62,8),lx,lh*0.69,lz,1,1,1,0,0,0,W,code,[lx,hipY]);
        put(C(H*0.04,H*(bull?0.034:0.028),lh*0.56,8),lx+(i>0?0:-H*0.015),lh*0.28,lz,1,1,1,0,0,0,col,code,[lx,hipY],!sheep);
        put(C(H*0.036,H*0.042,H*0.05,8),lx,H*0.025,lz,1,1,1,0,0,0,DK,code,[lx,hipY],false)})});
    if(goat&&!lo)put(new THREE.ConeGeometry(wid*0.12,hl*0.35,6),hx+hl*0.3,hy-hl*0.56,0,1,1,1,Math.PI,0,0,W,3,PV); // beard
    if(goat)put(C(H*0.03,H*0.012,H*0.16,6),-L*0.49,by+dep*0.75,0,1,1,1,0,0,0.7,W,4,[-L*0.47,0]);          // short tail, up
    if(bull){put(C(H*0.022,H*0.012,H*0.55,6),-L*0.5,by-dep*0.1,0,1,1,1,0,0,-0.08,W,4,[-L*0.5,0]);if(!lo)put(S(0),-L*0.52,by-dep*1.05,0,H*0.04,H*0.08,H*0.04,0,0,0,DK,4,[-L*0.5,0],false)}
    const geo=U.mergeBufferGeometries(parts,false);geo.computeBoundingSphere();return geo}
  // where the head is (for things put on the head: the gold on the horns and the olive crown of the bikkurim ox)
  function dims(kind,L,H){const bull=kind==="bull"||kind==="calf",sheep=kind==="sheep"||kind==="ram",by=H*(sheep?0.6:bull?0.62:0.63),dep=H*(sheep?0.25:bull?0.27:0.21),wid=H*(sheep?0.23:bull?0.24:0.17),ny=by+dep*(sheep?0.35:0.5),hl=H*(bull?0.31:sheep?0.27:0.27);
    return{hx:L*0.5+hl*(sheep?0.5:0.6),hy:ny+H*(bull?0.04:sheep?0.1:0.17),hl,wid}}
  function hornGeo(L,H,k){const d=dims("bull",L,H),{hx,hy,hl,wid}=d,a=[];[1,-1].forEach(j=>{const c=new THREE.CatmullRomCurve3([[hx-hl*0.12,hy+hl*0.24,j*wid*0.35],[hx-hl*0.1,hy+hl*0.34,j*wid*0.75],[hx+hl*0.05,hy+hl*0.52,j*wid*0.92]].map(q=>new THREE.Vector3(q[0],q[1],q[2])));const g=new THREE.TubeGeometry(c,10,wid*0.075*(k||1.2),6,false);g.deleteAttribute("uv");a.push(g)});return U.mergeBufferGeometries(a,false)}
  // a still copy (nothing moves): for a carcass carried home on the shoulder
  function still(kind,L,H,lo){const b=geo(kind,L,H,lo),g=new THREE.BufferGeometry();for(const k in b.attributes)g.setAttribute(k,(k==="position"||k==="normal")?b.attributes[k].clone():b.attributes[k]);g.setAttribute("blg",new THREE.BufferAttribute(new Float32Array(b.attributes.position.count),1));return g}
  function geo(kind,L,H,lo){const k=kind+"|"+L+"|"+H+"|"+(lo?1:0);return cache[k]||(cache[k]=build(kind,L,H,lo))}
  // a view of the shared geometry with its own per-animal attributes (phase, walk amount, step rate, coat color)
  function view(base,attrs){const g=new THREE.BufferGeometry();for(const k in base.attributes)g.setAttribute(k,base.attributes[k]);for(const k in attrs)g.setAttribute(k,attrs[k]);g.boundingSphere=base.boundingSphere;return g}
  // one animal as a normal object (for the Yom Kippur actors and the tamid lamb)
  function one(kind,col,L,H){const b=geo(kind,L,H),n=b.attributes.position.count,c=new THREE.Color(col).convertSRGBToLinear(),ar=(k,v)=>{const a=new Float32Array(n*k);for(let i=0;i<n;i++)for(let q=0;q<k;q++)a[i*k+q]=v[q];return new THREE.BufferAttribute(a,k)};
    const ph=Math.random()*6.28,a=new THREE.Group(),m=new THREE.Mesh(view(b,{iph:ar(1,[ph]),iam:ar(1,[0]),isp:ar(1,[1]),icol:ar(3,[c.r,c.g,c.b])}),mat);m.castShadow=true;a.add(m);
    a.walk=v=>{const at=m.geometry.attributes.iam;if(at.array[0]===v)return;at.array.fill(v);at.needsUpdate=true};return a}
  // a group of animals of one kind: near (full) + far (simple), the same places, colors and steps
  function herd(kind,L,H,n,cols,o){o=o||{};const g=new THREE.Group(),ph=new Float32Array(n),am=new Float32Array(n),sp=new Float32Array(n),ic=new Float32Array(n*3),c=new THREE.Color();
    for(let i=0;i<n;i++){ph[i]=Math.random()*6.283;sp[i]=1;c.setHex(cols[i%cols.length]).convertSRGBToLinear();const j=0.85+Math.random()*0.25;ic[i*3]=c.r*j;ic[i*3+1]=c.g*j;ic[i*3+2]=c.b*j}
    const A_={iph:new THREE.InstancedBufferAttribute(ph,1),iam:new THREE.InstancedBufferAttribute(am,1),isp:new THREE.InstancedBufferAttribute(sp,1),icol:new THREE.InstancedBufferAttribute(ic,3)};
    const near=new THREE.InstancedMesh(view(geo(kind,L,H),A_),mat,n),far=new THREE.InstancedMesh(view(geo(kind,L,H,true),A_),mat,n);far.instanceMatrix=near.instanceMatrix;
    [near,far].forEach(m=>{m.userData.noLOD=true;m.frustumCulled=false;m.castShadow=o.shadow!==false;g.add(m)});far.castShadow=false;far.visible=false;
    const d=new THREE.Object3D(),h={g,near,far,n,kind,c:new THREE.Vector3(),r:1,dirty:true,
      set(i,x,y,z,ry,s){d.position.set(x,y,z);d.rotation.set(0,ry||0,0);d.scale.setScalar(s||1);d.updateMatrix();near.setMatrixAt(i,d.matrix);near.instanceMatrix.needsUpdate=true;h.dirty=true},
      walk(i,amt,rate){if(am[i]!==amt){am[i]=amt;A_.iam.needsUpdate=true}const q=Math.max(0.3,Math.min(2,rate||1));if(Math.abs(sp[i]-q)>0.02){sp[i]=q;A_.isp.needsUpdate=true}},
      color(i,hex){c.setHex(hex).convertSRGBToLinear();ic[i*3]=c.r;ic[i*3+1]=c.g;ic[i*3+2]=c.b;A_.icol.needsUpdate=true},
      get count(){return near.count},set count(v){near.count=far.count=Math.max(0,Math.min(n,v))},
      pick(f){[near,far].forEach(m=>{f(m);m.userData=Object.assign({},m.userData,{noLOD:true})});return h}};
    HERDS.push(h);return h}
  // near or far by the distance of the camera from the group (checked a few times a second)
  let acc=0;const NEAR=(typeof SMALL!=="undefined"&&SMALL)?38:60;
  function tick(dt){acc+=dt;if(acc<0.25)return;acc=0;if(typeof camera==="undefined")return;cp.copy(camera.position);
    for(const h of HERDS){if(!h.g.parent)continue;if(h.dirty){h.dirty=false;let n=h.near.count,sx=0,sy=0,sz=0;const a=h.near.instanceMatrix.array;for(let i=0;i<n;i++){sx+=a[i*16+12];sy+=a[i*16+13];sz+=a[i*16+14]}n=Math.max(1,n);h.c.set(sx/n,sy/n,sz/n);let r=0;for(let i=0;i<h.near.count;i++)r=Math.max(r,Math.hypot(a[i*16+12]-h.c.x,a[i*16+14]-h.c.z));h.r=r+2}
      wp.copy(h.c);h.g.localToWorld(wp);const dd=wp.distanceTo(cp)-h.r,nr=dd<NEAR;if(h.near.visible!==nr){h.near.visible=nr;h.far.visible=!nr}}}
  return{geo,mat,smat,one,herd,tick,dims,hornGeo,still,HERDS}})();
function mkBeast(kind,col,L,H){return BEAST.one(kind,col,L,H)}
// ---- Yom Kippur actors: the High Priest, the bull, the two goats, the lottery box, incense ----
function buildYK(W){const g=new THREE.Group();g.visible=false;group.add(g);const P=(u,v,y)=>{const p=W(u,v);return new THREE.Vector3(p[0],y*A,p[1])};
  const gold=new THREE.MeshStandardMaterial({color:0xd8b04a,roughness:0.45,metalness:0.35}),linen=new THREE.MeshStandardMaterial({color:0xfbfaf3,roughness:0.85});
  const hp=FIG.mesh(1,FIG.mat(0xffffff));hp.frustumCulled=false;g.add(hp);const hpMat=hp.material;
  const head=new THREE.Mesh(FIG.head(),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}));const mit=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.14,0.17,10),linen);const tz=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.04,0.26),gold);
  const ephod=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.24,0.26),new THREE.MeshStandardMaterial({color:0x2a3f8a,roughness:0.6,metalness:0.2}));
  [head,mit,tz,ephod].forEach(m=>g.add(m));
  const tool=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.08,0.12,10),gold);g.add(tool);
  const mkAnimal=(col,L,Hh,hd,kind)=>mkBeast(kind||(L>1.5?"bull":"goat"),col,L,Hh);
  const bull=mkAnimal(0x3a2618,2.2,1.5,0.55,"bull"),gA=mkAnimal(0x2b2622,1.0,0.75,0.28),gB=mkAnimal(0x2b2622,1.0,0.75,0.28);
  const thread=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.06,0.3),new THREE.MeshStandardMaterial({color:0xb3261e}));gB.add(thread);thread.position.set(0.75,0.75,0);
  const kalpi=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.55,0.35),gold);[bull,gA,gB,kalpi].forEach(m=>g.add(m));
  const cloud=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshBasicMaterial({color:0xd8d2c8,transparent:true,opacity:0.08,depthWrite:false}),18);cloud.frustumCulled=false;g.add(cloud);cloud.visible=false;
  const tag=label("הכהן הגדול",0,0,0,"c",{n:"הכהן הגדול",r:"משנה יומא",t:"⚖️ ביום הכיפורים הכהן הגדול עושה לבדו את כל עבודת היום (יומא ג–ז). 📜 לעבודות של כל יום הוא לובש בגדי זהב, שמונה בגדים: כתונת, מכנסיים, מצנפת, אבנט, חושן, אפוד, מעיל וציץ (שמות כח). 📜 לעבודות המיוחדות של יום הכיפורים הוא לובש בגדי לבן, ארבעה בגדים של בד: כתונת, מכנסיים, אבנט ומצנפת (ויקרא טז, ד). ⚖️ האבנט של כל השנה הוא של צמר צבוע ופשתן, ושל יום הכיפורים כולו בוץ לבן (רמב״ם, הלכות כלי המקדש ח, א–ג). ⚖️ כהן הדיוט עובד בארבעה בגדים: כתונת, מכנסיים, מגבעת ואבנט."});tag.yk=1;tag.m=false;cLabels.push(tag);
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.45,0.62,24),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:0.75,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;g.add(ring);
  const st={pos:P(170,200,7.5),from:null,to:null,t0:0,dur:1,face:0,act:0,garb:"gold",cloud:null,goat:null};
  const placeA=(o,u,v,y,face)=>{o.position.copy(P(u,v,y));o.rotation.y=face};
  placeA(bull,214,248,7.5,Math.PI/2);placeA(gA,272,228,7.5,Math.PI);placeA(gB,272,236,7.5,Math.PI);placeA(kalpi,276,232,7.5+0.6/A*0+0.0,0);kalpi.position.y+=0.28;
  const STEPS={parh:[276.5,157.2,3.5,-Math.PI/2,0],park:[228,224,7.5,0,0],mikve:[200,214,7.5,0,0],laver:[224.5,266,7.5,Math.PI/2,0.3],altar:[250,262,16.5,Math.PI/2,0.4],bull1:[220,248,7.5,Math.PI,0.2],lots:[278,232,7.5,Math.PI,0.6],bull2:[220,248,7.5,Math.PI,0.2],kodesh:[127,250,13.56,Math.PI,0.15],sprinkle:[127,250,13.56,Math.PI,0.9],parochet:[140,250,13.56,Math.PI,0.9],goldalt:[152,252,13.56,Math.PI,0.7],azazel:[276,232,7.5,Math.PI,0.3],end:[226,264,7.5,Math.PI/2,0.1]};
  const api={g,hp,head,mit,tz,ephod,show(v){g.visible=v;if(!v){cloud.visible=false;st.goat=null;placeA(gB,272,236,7.5,Math.PI)}},
    set(key,garb){const s=STEPS[key];if(!s)return;st.from=st.pos.clone();st.to=P(s[0],s[1],s[2]);if(key==="parh"){st.pos.copy(st.to);st.from=st.pos.clone()}else{const dd=st.from.distanceTo(st.to);if(dd>12)st.from.lerpVectors(st.to,st.from,12/dd)} /* 117: הליכה רגילה, אבל רק 12 המטרים האחרונים, כדי שיגיע בזמן שהקריין מדבר */st.t0=performance.now();st.dur=Math.max(1200,st.from.distanceTo(st.to)/1.3*1000);st.face=s[3];st.act=s[4];st.garb=garb;hpMat.color.setHex(garb==="gold"?0xd8b04a:0xfbfaf3);tz.visible=ephod.visible=garb==="gold";tool.visible=key==="kodesh"||key==="sprinkle"||key==="parochet"||key==="goldalt";
      cloud.visible=key==="kodesh";if(key==="azazel")st.goat={t0:performance.now(),path:[P(272,236,7.5),P(292,296,7.5),P(250,312,7.5),P(250,345,3.5),P(250,470,3.5),P(250,520,3.5)]};if(key==="lots"){placeA(gB,272,236,7.5,Math.PI);st.goat=null}},
    pose(key,cam){const s=STEPS[key],p=P(s[0],s[1],s[2]);return p},
    tick(dt,tt){if(!g.visible)return;const now=performance.now();let walking=false;if(st.to){const k=Math.min(1,(now-st.t0)/st.dur);st.pos.lerpVectors(st.from,st.to,k);walking=k<1;if(k>=1){st.from=null;st.to=null}}
      const p=st.pos,ang=walking&&st.from?Math.atan2(-(st.to.z-st.from.z),st.to.x-st.from.x):st.face;const D=new THREE.Object3D();D.position.copy(p);D.rotation.set(0,ang,0);D.updateMatrix();hp.setMatrixAt(0,D.matrix);hp.instanceMatrix.needsUpdate=true;hp.setAmp(0,walking?1:st.act*(0.6+0.4*Math.sin(tt*2)));
      tag.v.set(p.x,p.y+2.5,p.z);ring.position.set(p.x,p.y+0.04,p.z);ring.material.opacity=0.5+0.3*Math.sin(tt*3);
      head.position.set(p.x,p.y+1.56,p.z);mit.position.set(p.x,p.y+1.7,p.z);const fx=Math.cos(ang),fz=-Math.sin(ang);tz.position.set(p.x+fx*0.13,p.y+1.66,p.z+fz*0.13);tz.rotation.y=ang;ephod.position.set(p.x+fx*0.2,p.y+1.12,p.z+fz*0.2);ephod.rotation.y=ang;tool.position.set(p.x+fx*0.35,p.y+1.0,p.z+fz*0.35);
      if(cloud.visible){const c=P(123,250,13.56),D2=new THREE.Object3D();for(let i=0;i<18;i++){const a=i*2.4+tt*0.2,r=(i%6)*0.35+0.3;D2.position.set(c.x+Math.cos(a)*r*0.7,c.y+4.2+(i%5)*0.45+Math.sin(tt*0.6+i)*0.15,c.z+Math.sin(a)*r*0.7);D2.scale.setScalar(0.45+(i%4)*0.18);D2.updateMatrix();cloud.setMatrixAt(i,D2.matrix)}cloud.instanceMatrix.needsUpdate=true}
      if(st.goat){const q=st.goat.path,T=(now-st.goat.t0)/1000*1.4;let s=T,k=0;while(k<q.length-2&&s>q[k].distanceTo(q[k+1])){s-=q[k].distanceTo(q[k+1]);k++}const a=q[k],b=q[k+1],f=Math.min(1,s/a.distanceTo(b));gB.position.lerpVectors(a,b,f);gB.rotation.y=Math.atan2(-(b.z-a.z),b.x-a.x);gB.visible=!(k===q.length-2&&f>=1)}else gB.visible=true}};
  return api}

// ---- life in the courts: priests at the altar, Levites on the platform, doves, people walking in the courts ----
// ---- stage 9: the daily service (Mishnah Tamid), 13 priests that walk between places step by step ----
function buildTM(W){const g=new THREE.Group();g.visible=false;group.add(g);const P=(u,v,y)=>{const p=W(u,v);return new THREE.Vector3(p[0],y*A,p[1])};
  const N=13,fig=FIG.mesh(N,FIG.mat(0xfbfaf4));fig.frustumCulled=false;g.add(fig);
  const head=new THREE.InstancedMesh(FIG.head(),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}),N),hat=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12,0.135,0.15,10),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.85}),N);
  [head,hat].forEach(m=>{m.frustumCulled=false;g.add(m)});
  const info={n:"הכהנים בסדר התמיד",r:"משנה תמיד; רמב״ם, הלכות תמידין ומוספין ו",t:"📜 כהן הדיוט לובש ארבעה בגדים: כתונת, מכנסיים ומגבעת של פשתן לבן, ואבנט (שמות כח, מ–מב). ⚖️ האבנט שלו של צמר צבוע ופשתן, ולא לבן כולו (רמב״ם, הלכות כלי המקדש ח, א–ב). לכהן הגדול שמונה בגדים, וביום הכיפורים בגדי לבן מיוחדים (ויקרא טז, ד). ⚖️ הכהנים עובדים יחפים על רצפת האבן. כל אחד עושה את העבודה שזכה בה בפיס. 💡 מספר הדמויות הוא המחשה."};fig.userData=head.userData=info;cPick.push(fig);
  const silver=new THREE.MeshStandardMaterial({color:0xd9dde2,metalness:0.9,roughness:0.25}),fleece=new THREE.MeshStandardMaterial({color:0xf1ece2,roughness:1}),meat=new THREE.MeshStandardMaterial({color:0x9b3b32,roughness:0.7});
  const lamb=mkBeast("sheep",0xf1ece2,0.9,0.7);
  lamb.traverse(o=>{if(o.isMesh){o.userData={n:"כבש התמיד",r:"במדבר כח, ג-ח; תמיד ג, ג-ד; ד, א",t:"📜 \"את הכבש אחד תעשה בבקר ואת הכבש השני תעשה בין הערבים\". ⚖️ מביאים אותו מלשכת הטלאים, בודקים אותו לאור האבוקות ומשקים אותו בכוס של זהב. שוחטים אותו בצפון המזבח, בקרן מזרחית־צפונית, ובערב — בקרן מערבית־צפונית."};cPick.push(o)}});g.add(lamb);
  const mkLimbMesh=()=>{const grp=new THREE.Group();const meatM=new THREE.MeshStandardMaterial({color:0x6e3a2c,roughness:0.84,metalness:0.02});const boneM=new THREE.MeshStandardMaterial({color:0xe6d7b8,roughness:0.55});const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.075,0.48,12),meatM);sh.rotation.z=Math.PI/2;const jt=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),meatM);jt.position.x=0.20;const bn=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.022,0.11,8),boneM);bn.rotation.z=Math.PI/2;bn.position.x=0.30;grp.add(sh,jt,bn);return grp};
  const limbs=[];for(let i=0;i<6;i++){const m=mkLimbMesh();m.userData={n:"הולכת האיברים",r:"תמיד ד, ג",t:"📜 שישה כהנים מוליכים את האיברים לכבש: הראש והרגל, שתי הידיים, העוקץ והרגל, החזה והגרה, שתי הדפנות, והקרביים. הם נותנים אותם בחצי התחתון של הכבש, במערבו, ומולחים אותם."};m.traverse(o=>{if(o.isMesh){o.userData=m.userData;cPick.push(o)}});limbs.push(m);g.add(m)}
  const trumpets=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.75,10,1,true),silver);m.userData={n:"שתי חצוצרות של כסף",r:"תמיד ז, ג; במדבר י, י",t:"📜 \"ושני כהנים עומדים על שולחן החלבים ושתי חצוצרות בידן. תקעו, והריעו, ותקעו\". בכל פרק של השיר תוקעים, ובכל תקיעה העם משתחווה."};cPick.push(m);g.add(m);return m});
  const flag=new THREE.Group();{const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,1.4,6),M.wood);st.position.y=0.7;flag.add(st);const cl=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.4),new THREE.MeshStandardMaterial({color:0xffffff,side:THREE.DoubleSide,roughness:0.9}));cl.position.set(0.28,1.2,0);flag.add(cl);flag.userData.cloth=cl}
  flag.traverse(o=>{if(o.isMesh){o.userData={n:"הסגן והסודרין",r:"תמיד ז, ג",t:"📜 \"הסגן עומד על הקרן והסודרין בידו... הניף הסגן בסודרין, והקיש בן ארזא בצלצל, ודברו הלוים בשיר\" — הנפת הבד היא הסימן ללוויים להתחיל לשיר."};cPick.push(o)}});g.add(flag);
  // places: [u,v,y, face-u, face-v, act(0..1)]
  const circ=(cu,cv,y,r,n,act)=>Array.from({length:n},(_,k)=>{const a=k/n*Math.PI*2;return[cu+Math.cos(a)*r,cv+Math.sin(a)*r,y,cu,cv,act||0.1]});
  const line=(u0,v0,u1,v1,y0,y1,n,fu,fv,act)=>Array.from({length:n},(_,k)=>{const t=n>1?k/(n-1):0;return[u0+(u1-u0)*t,v0+(v1-v0)*t,y0+(y1-y0)*t,fu,fv,act||0]});
  const ramp=v=>7.5+(296-v)*0.3;
  const GZ=[310,295.2,7.56];
  const ST={
    night:line(222,186,238,186,3.5,3.5,13,230,175,0),
    pais1:[[GZ[0],GZ[1],GZ[2],GZ[0]+1,GZ[1],0.6]].concat(circ(GZ[0],GZ[1],GZ[2],2.8,12,0.15)),
    deshen:[[250,258,16.5,250,250,0.8],[222.3,265.2,7.5,222,263,0.4]].concat(line(226,270,240,270,7.5,7.5,11,250,250,0)),
    wood:line(244,247,256,253,16.5,16.5,4,250,250,0.9).concat(line(226,272,244,272,7.5,7.5,9,250,262,0)),
    pais2:circ(GZ[0],GZ[1],GZ[2],2.9,13,0.15), /* 125.0: שלושה עשר הזוכים במעגל (משנה תמיד ג, א). הממונה לא מוצג */
    pais4:[[GZ[0],GZ[1],GZ[2],GZ[0]+1,GZ[1],0.6]].concat(circ(GZ[0],GZ[1],GZ[2],3.6,12,0.15)), /* 126.1: הפיס הרביעי — חדשים עם ישנים (13 דמויות בסיור), מעגל רחב סביב הממונה (תמיד ה, ב) */
    lamb:[[250,166,27.6,300,140,0.5],[250.6,201,7.5,250,203,0.3],[249.4,201,7.5,250,203,0.3]].concat(line(236,197,264,197,3.5,3.5,10,250,205,0)),
    shechita:[[244.6,214.6,7.5,244,216,0.8],[245.6,217.6,7.5,244,216,0.6]].concat(line(234,224,260,224,7.5,7.5,11,244,216,0)),
    heikhal:[[154,250,13.56,152,250,0.6],[151,256,13.56,150,257.5,0.6]].concat(line(206,240,206,260,10.5,10.5,11,180,250,0)),
    limbs:line(247,292,247,282,ramp(292),ramp(282),6,247,270,0).concat(line(234,226,262,226,7.5,7.5,7,244,216,0)),
    shema:line(283,293,299,293,7.56,7.56,7,292,290,0.2).concat(line(284,297.5,298,297.5,7.56,7.56,6,292,290,0.2)),
    ketoret:[[154,250,13.56,152,250,0.7],[176,247,13.56,152,250,0.1],[176,253,13.56,152,250,0.1]].concat(line(206,238,206,262,10.5,10.5,10,180,250,0)),
    birkat:line(203.5,241,203.5,259,11.5,11.5,9,240,250,1).concat(line(210,244,210,256,7.5,7.5,4,200,250,0)),
    shir:[[238,262,16.5,234,266,0.7],[240.5,263,16.5,250,280,0.3],[250,267,16.5,250,280,0.3],[239.3,268.2,8.6,250,268,0.4],[239.3,270.4,8.6,250,268,0.4]].concat(line(247,286,247,270,ramp(286),ramp(270),8,250,262,0))};
  const st=Array.from({length:N},(_,i)=>({pos:P(222+i*1.2,186,3.5),from:null,to:null,t0:0,dur:1,f:null,act:0,ff:null}));let key=null;
  const api={g,fig,head,hat,show(v){g.visible=v},
    set(k){const L=ST[k];if(!L)return;key=k;const now=performance.now();st.forEach((o,i)=>{const q=L[i]||L[L.length-1];o.from=o.pos.clone();o.to=P(q[0],q[1],q[2]);o.t0=now+i*90;o.dur=Math.min(4000,Math.max(900,o.from.distanceTo(o.to)/4*1000));o.ff=P(q[3],q[4],q[2]);o.act=q[5]});
      lamb.visible=k==="lamb"||k==="shechita";if(k==="lamb"){lamb.position.copy(P(250,203,7.5));lamb.rotation.y=Math.PI/2}if(k==="shechita"){lamb.position.copy(P(244,216.3,7.5));lamb.rotation.y=0;lamb.rotation.z=0}
      limbs.forEach((m,i)=>{const show=(k==="limbs"||k==="shir")&&i<3;m.visible=show;const spots=[[246.3,287.5],[246.85,287.1],[246.4,286.7]];const sp=spots[i]||spots[0];m.position.copy(P(sp[0],sp[1],ramp(sp[1])+0.08));m.rotation.set(0.15,0.4+i*0.7,0.2)});trumpets.forEach(m=>m.visible=k==="shir");flag.visible=k==="shir"},
    tick(dt,tt){if(!g.visible)return;const now=performance.now(),D=new THREE.Object3D();
      st.forEach((o,i)=>{let walking=false;if(o.to&&now>=o.t0){const k=Math.min(1,(now-o.t0)/o.dur);o.pos.lerpVectors(o.from,o.to,k);walking=k<1;if(k>=1){o.from=null;o.to=null}}
        const p=o.pos;let ang;if(walking){const d=o.to.clone().sub(o.from);ang=Math.atan2(-d.z,d.x)}else if(o.ff){ang=Math.atan2(-(o.ff.z-p.z),o.ff.x-p.x)}else ang=0;
        D.position.copy(p);D.rotation.set(0,ang,0);D.scale.setScalar(1);D.updateMatrix();fig.setMatrixAt(i,D.matrix);fig.setAmp(i,walking?1:o.act*(0.6+0.4*Math.sin(tt*2+i)));
        D.position.y=p.y+1.56;D.updateMatrix();head.setMatrixAt(i,D.matrix);D.position.y=p.y+1.69;D.updateMatrix();hat.setMatrixAt(i,D.matrix);
        const fx=Math.cos(ang),fz=-Math.sin(ang);
        /* v106: deposited limbs stay on the west lower ramp (Tamid 4:3); they no longer follow the old instanced figures */
        if(key==="shir"&&(i===3||i===4)){const m=trumpets[i-3];m.position.set(p.x+fx*0.45,p.y+1.45,p.z+fz*0.45);m.rotation.set(0,0,0);m.rotation.z=-Math.PI/2+0.25;m.rotation.y=ang;m.rotateZ(0)}
        if(key==="shir"&&i===1){flag.position.set(p.x+fx*0.25,p.y+0.6,p.z+fz*0.25);flag.rotation.y=ang;flag.userData.cloth.rotation.y=Math.sin(tt*5)*0.6}});
      fig.instanceMatrix.needsUpdate=head.instanceMatrix.needsUpdate=hat.instanceMatrix.needsUpdate=true;
      if(lamb.visible&&key==="lamb"){const t=(now/1000)%1;lamb.position.y=7.5*A+Math.abs(Math.sin(t*Math.PI*2))*0.03}}};
  return api}
function buildActors(W,y0A){const r=rng(777),d=new THREE.Object3D(),c=new THREE.Color(),ACT={tick(){}};
  const P=(u,v,y)=>{const p=W(u,v);return[p[0],y*A,p[1]]};
  // priests: wash at the laver, walk to the ramp, climb, serve at the fire, come down
  const loop=[[222,266,7.5],[236,286,7.5],[250,298,7.5],[250,282,12],[250,268,16.5],[246,262,16.5],[254,256,16.5],[250,268,16.5],[250,298,7.5],[232,290,7.5],[222,266,7.5]].map(q=>P(...q));
  const segL=[];let tot=0;for(let i=0;i<loop.length-1;i++){const l=Math.hypot(loop[i+1][0]-loop[i][0],loop[i+1][1]-loop[i][1],loop[i+1][2]-loop[i][2]);segL.push(l);tot+=l}
  const NPr=SMALL?10:18,pr=FIG.mesh(NPr,FIG.mat(0xf7f5ee)),prH=new THREE.InstancedMesh(FIG.head(),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}),NPr),prT=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12,0.13,0.14,8),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.8}),NPr);
  const PRS=[];for(let i=0;i<NPr;i++)PRS.push({s:i/NPr*tot,v:0.9+r()*0.3});for(let i=0;i<NPr;i++)pr.setSp(i,PRS[i].v);
  pr.userData=prH.userData={n:"כהנים בעבודה",r:"משנה תמיד; רמב״ם, הלכות תמידין ומוספין",t:"כהנים בבגדי לבן: מקדשים ידיים ורגליים בכיור, עולים בכבש אל המזבח, מסדרים את העצים ומקריבים, ויורדים. הם הולכים יחפים על רצפת האבן."};[pr,prH,prT].forEach(m=>{m.frustumCulled=false;group.add(m)});cPick.push(pr);
  // Levites on the duchan, singing and playing
  const LV=[];[[214,258],[273,287]].forEach(([a,b])=>{for(let v=a;v<=b;v+=2.2)LV.push(P(285.5,v,9))});
  const lv=FIG.mesh(LV.length,FIG.mat(0xe8e2cf)),lvH=new THREE.InstancedMesh(FIG.head(),prH.material,LV.length);
  LV.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.set(0,Math.PI,0);d.scale.setScalar(1);d.updateMatrix();lv.setMatrixAt(i,d.matrix);d.position.y=p[1]+1.56;d.updateMatrix();lvH.setMatrixAt(i,d.matrix);lv.setAmp(i,0.25)});
  lv.userData={n:"הלוויים על הדוכן",r:"מידות ב, ו; ערכין יא ע״ב",t:"לוויים עומדים על הדוכן ושרים את שיר של יום, בכינורות ובנבלים, בשעה שמנסכים את היין על המזבח. \"ואין פוחתין משנים עשר לויים עומדין על הדוכן\"."};[lv,lvH].forEach(m=>{m.frustumCulled=false;group.add(m)});cPick.push(lv);
  // doves
  const ND=SMALL?14:30,dv=new THREE.InstancedMesh((()=>{const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute([0,0,0,-0.15,0,0.45,0.12,0,0, 0,0,0,0.12,0,0,-0.15,0,-0.45, 0.25,0.02,0,-0.25,0.02,0.06,-0.25,0.02,-0.06],3));g.computeVertexNormals();return g})(),new THREE.MeshStandardMaterial({color:0xf2f0ea,side:THREE.DoubleSide,roughness:0.9}),ND);
  const DV=[];for(let i=0;i<ND;i++)DV.push({c:P(230+r()*60,230+r()*60,0),R:6+r()*16,h:22+r()*18,w:(0.35+r()*0.4)*(r()<0.5?1:-1),ph:r()*6});dv.frustumCulled=false;dv.visible=false;group.add(dv);
  // water in the laver
  const wt=new THREE.Mesh(new THREE.CircleGeometry(1.3*A*1.1,24),new THREE.MeshStandardMaterial({color:0x6f9fb8,roughness:0.05,metalness:0.3,emissive:0x0a1a24}));{const p=P(222,263,9.45);wt.position.set(p[0],p[1],p[2]);wt.rotation.x=-Math.PI/2;group.add(wt)}
  // incense: thin wisps from the doorway of the Heikhal
  const NI=14,inc=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),M.smoke,NI),IN=[];for(let i=0;i<NI;i++)IN.push({t:i/NI,s:r()});const ib=P(197,250,13.56+20);inc.frustumCulled=false;group.add(inc);
  ACT.tick=(dt,tt)=>{
    PRS.forEach((o,i)=>{o.s=(o.s+o.v*dt)%tot;let s=o.s,k=0;while(k<segL.length-1&&s>segL[k]){s-=segL[k];k++}const a=loop[k],b=loop[k+1],f=Math.min(1,s/(segL[k]||1));const x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f,z=a[2]+(b[2]-a[2])*f,ang=Math.atan2(-(b[2]-a[2]),b[0]-a[0]);
      d.position.set(x,y,z);d.rotation.set(0,HD(o,ang,dt),0);d.scale.setScalar(1);d.updateMatrix();pr.setMatrixAt(i,d.matrix);d.position.y=y+1.56;d.updateMatrix();prH.setMatrixAt(i,d.matrix);d.position.y=y+1.7;d.updateMatrix();prT.setMatrixAt(i,d.matrix)});
    pr.instanceMatrix.needsUpdate=prH.instanceMatrix.needsUpdate=prT.instanceMatrix.needsUpdate=true;
    DV.forEach((o,i)=>{const a=tt*o.w+o.ph,x=o.c[0]+Math.cos(a)*o.R,z=o.c[2]+Math.sin(a)*o.R,y=o.h+Math.sin(tt*0.7+o.ph)*2;d.position.set(x,y,z);d.rotation.set(0,-a+(o.w>0?0:Math.PI),Math.sin(tt*14+o.ph)*0.6);d.scale.setScalar(1);d.updateMatrix();dv.setMatrixAt(i,d.matrix)});dv.instanceMatrix.needsUpdate=true;
    wt.material.emissiveIntensity=0.8+0.2*Math.sin(tt*3);wt.scale.setScalar(1+0.01*Math.sin(tt*5));
    IN.forEach((o,i)=>{o.t=(o.t+dt*0.06)%1;const h=o.t*30,sz=(0.3+o.t*2.2)*A;d.position.set(ib[0]+Math.sin(o.s*30+tt*0.5)*o.t*1.5,ib[1]+h,ib[2]+Math.cos(o.s*20+tt*0.4)*o.t*1.5);d.rotation.set(0,0,0);d.scale.setScalar(sz);d.updateMatrix();inc.setMatrixAt(i,d.matrix)});inc.instanceMatrix.needsUpdate=true};
  ACT.yk=buildYK(W);ACT.tm=buildTM(W);ACT.amb=[pr,prH,prT];const tk0=ACT.tick;ACT.tick=(dt,tt)=>{tk0(dt,tt);ACT.yk.tick(dt,tt);ACT.tm.tick(dt,tt)};
  return ACT}

