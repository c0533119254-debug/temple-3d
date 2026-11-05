// ---- terrain ----
(function(){
  const X0=-2200,X1=2400,N0=-1800,N1=2200,SX=260,SN=230;
  const g=new THREE.PlaneGeometry(X1-X0,N1-N0,SX,SN);g.rotateX(-Math.PI/2);
  const p=g.attributes.position,col=[],uv=g.attributes.uv;
  const cRock=new THREE.Color(0xb3a588),cDry=new THREE.Color(0xa59a74),cGreen=new THREE.Color(0x7f8556),cUrban=new THREE.Color(0xc4baa4);
  for(let i=0;i<p.count;i++){
    const x=p.getX(i)+(X0+X1)/2,z=p.getZ(i)-(N0+N1)/2,n=-z;let h=H(x,n);h=underMount(x,n,h);h=roadAdj(x,n,h);
    p.setX(i,x);p.setZ(i,z);p.setY(i,h-0.8);uv.setXY(i,x/260,n/260);
    const kd=segDist(x,n,KIDRON)[0],hd=segDist(x,n,HINNOM)[0];
    const c=cRock.clone().lerp(cDry,0.5+0.2*Math.sin(x*0.009)*Math.cos(n*0.007));
    const veg=Math.max(Math.exp(-Math.pow(kd/170,2)),Math.exp(-Math.pow(hd/120,2))*0.8,(x>500&&x<900)?0.45:0);
    c.lerp(cGreen,veg*0.7);if(inPoly(x,n,OLD))c.lerp(cUrban,0.6);
    col.push(c.r,c.g,c.b);
  }
  g.setAttribute("color",new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();
  const tm=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,normalMap:T.ground,normalScale:new THREE.Vector2(0.3,0.3)});
  const idx=g.index.array,inn=[],out=[];for(let t=0;t<idx.length;t+=3){const a=idx[t],b=idx[t+1],c=idx[t+2];(inSat(p.getX(a),-p.getZ(a))&&inSat(p.getX(b),-p.getZ(b))&&inSat(p.getX(c),-p.getZ(c))?inn:out).push(a,b,c)}
  const g2=g.clone();g.setIndex(out);g2.setIndex(inn);
  const m=new THREE.Mesh(g,tm);m.receiveShadow=true;WG.add(m);const m2=new THREE.Mesh(g2,tm);m2.receiveShadow=true;CITYSAT.add(m2);
})();

const RING=new THREE.Mesh(new THREE.RingGeometry(1750,55000,96,1),new THREE.MeshBasicMaterial({color:0x8a8a80}));RING.rotation.x=-Math.PI/2;RING.position.set(100,6,-200);scene.add(RING);
// ---- satellite floor (Esri World Imagery, georeferenced corners) ----
const satTex={};
function loadSat(b){if(satTex[b.img])return satTex[b.img];const t=new THREE.TextureLoader().load(b.img);t.encoding=THREE.sRGBEncoding;t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;satTex[b.img]=t;return t}
if(!SMALL){T19.forEach((t,i)=>{SATB["t"+i]=Object.assign({st:8},t)});Object.assign(SATB.old,{w:T19[0].w,e:T19[3].e,nn:T19[0].nn,s:T19[15].s})}

// ---- the ground: painted from map data (no satellite photo) ----
const GROUND=(function(){const b=SATB.old,X0=(b.w-LON0)*94630,X1=(b.e-LON0)*94630,N0=(b.s-LAT0)*110574,N1=(b.nn-LAT0)*110574,S=SMALL?1024:2048;
  const cvs=document.createElement("canvas");cvs.width=cvs.height=S;const x=cvs.getContext("2d");
  const lo=256,sm=document.createElement("canvas");sm.width=sm.height=lo;const sx=sm.getContext("2d"),img=sx.createImageData(lo,lo),r=rng(1717);
  const vh=(i,j)=>{const t=Math.sin(i*127.1+j*311.7)*43758.5453;return t-Math.floor(t)},vn=(u,v)=>{const i=Math.floor(u),j=Math.floor(v),f=u-i,g=v-j,a=f*f*(3-2*f),c=g*g*(3-2*g);return(vh(i,j)*(1-a)+vh(i+1,j)*a)*(1-c)+(vh(i,j+1)*(1-a)+vh(i+1,j+1)*a)*c};
  const C1=[176,158,124],C2=[203,193,168],C3=[152,145,100],C4=[118,120,78];
  for(let j=0;j<lo;j++)for(let i=0;i<lo;i++){const u=i/lo*22,v=j/lo*22,n1=vn(u*0.35,v*0.35),n2=vn(u*1.3+5,v*1.3+9),n3=vn(u*4+2,v*4+7);
    const rock=Math.min(1,Math.max(0,(n1-0.42)*2.2)),veg=Math.min(1,Math.max(0,(n2-0.58)*3))*(1-rock*0.6);let c=C1.map((q,k)=>q*(1-rock)+C2[k]*rock);c=c.map((q,k)=>q*(1-veg*0.7)+(n3>0.5?C3[k]:C4[k])*veg*0.7);const k=(0.93+n3*0.12),o=(j*lo+i)*4;img.data[o]=c[0]*k;img.data[o+1]=c[1]*k;img.data[o+2]=c[2]*k;img.data[o+3]=255}
  sx.putImageData(img,0,0);x.imageSmoothingEnabled=true;x.drawImage(sm,0,0,S,S);
  const fine=document.createElement("canvas");fine.width=fine.height=128;const fx=fine.getContext("2d");for(let i=0;i<2600;i++){fx.fillStyle="rgba("+(r()<0.5?"60,50,35":"255,250,235")+","+(0.05+r()*0.1)+")";fx.fillRect(r()*128,r()*128,1+r()*2,1+r()*2)}x.fillStyle=x.createPattern(fine,"repeat");x.fillRect(0,0,S,S);
  const P=(gx,gn)=>[(gx-X0)/(X1-X0)*S,(N1-gn)/(N1-N0)*S],poly=(pts,style)=>{x.fillStyle=style;x.beginPath();pts.forEach((q,i)=>{const p=P(q[0],q[1]);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])});x.closePath();x.fill()};
  const tex=new THREE.CanvasTexture(cvs);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=8;tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
  const forTile=t=>{const c=tex.clone();c.repeat.set((t.e-t.w)/(b.e-b.w),(MERC(t.nn)-MERC(t.s))/(MERC(b.nn)-MERC(b.s)));c.offset.set((t.w-b.w)/(b.e-b.w),(MERC(t.s)-MERC(b.s))/(MERC(b.nn)-MERC(b.s)));c.needsUpdate=true;CL.push(c);return c},CL=[];
  return{x,P,poly,S,forTile,update(){CL.forEach(c=>c.needsUpdate=true)}}})();
(function(){
  (SMALL?[["old",-1],["mt",-3]]:T19.map((t,i)=>["t"+i,0])).forEach(([k,po])=>{const b=SATB[k];
    const x0=(b.w-LON0)*94630,x1=(b.e-LON0)*94630,n0=(b.s-LAT0)*110574,n1=(b.nn-LAT0)*110574,sx=Math.round((x1-x0)/b.st),sn=Math.round((n1-n0)/b.st);
    const g=new THREE.PlaneGeometry(x1-x0,n1-n0,sx,sn);g.rotateX(-Math.PI/2);const p=g.attributes.position,uv=g.attributes.uv;
    for(let i=0;i<p.count;i++){const x=p.getX(i)+(x0+x1)/2,z=p.getZ(i)-(n0+n1)/2,n=-z;let h=H(x,n);h=underMount(x,n,h);h=roadAdj(x,n,h);p.setX(i,x);p.setZ(i,z);p.setY(i,h-(k==="mt"?0.12:0.25));const q=satUV(b,x,n);uv.setXY(i,q[0],q[1])}
    g.computeVertexNormals();
    if(k==="old"){const B=SATB.mt,mx0=(B.w-LON0)*94630+b.st,mx1=(B.e-LON0)*94630-b.st,mn0=(B.s-LAT0)*110574+b.st,mn1=(B.nn-LAT0)*110574-b.st,ins=v=>{const x=p.getX(v),n=-p.getZ(v);return x>mx0&&x<mx1&&n>mn0&&n<mn1};
      const idx=g.index.array,keep=[];for(let t=0;t<idx.length;t+=3)if(!(ins(idx[t])&&ins(idx[t+1])&&ins(idx[t+2])))keep.push(idx[t],idx[t+1],idx[t+2]);g.setIndex(keep)}
    const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:GROUND.forTile(b),roughness:1,metalness:0,envMapIntensity:0.2,polygonOffset:po<0,polygonOffsetFactor:po,polygonOffsetUnits:po}));m.receiveShadow=true;SATG.add(m)}); /* ריצודים: בשוליים האריח של הר הבית חופף לאריח העיר (13 ס״מ ביניהם); polygonOffset שומר שהפנימי תמיד מעל */
  const sh=new THREE.Shape();MOUNT.forEach((q,i)=>i?sh.lineTo(q[0],q[1]):sh.moveTo(q[0],q[1]));sh.closePath();
  const g=new THREE.ShapeGeometry(sh),uv=g.attributes.uv,p=g.attributes.position;for(let i=0;i<p.count;i++){const q=satUV(SATB.mt,p.getX(i),p.getY(i));uv.setXY(i,q[0],q[1])}
  g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:loadSat(SATB.mt),roughness:1,envMapIntensity:0.2}));m.position.y=0;m.receiveShadow=true;SATTOP.add(m);
})();
let MENORAH=null,OLIVE=null,PLATTOP=null,SATPH=null;const inBB=(x,n)=>x>-984&&x<1390&&n>-1440&&n<774;const satOK=(x,n)=>SATPH===null||(SATPH===1?inSat(x,n)&&!inBB(x,n):!inSat(x,n)),TGRP=()=>SATPH===1?CITYSAT:WG;

const PICK=[];
