await __Y(8);function demAt(x,n){const D=DEM,fx=(x-D.x0)/D.st,fn=(n-D.n0)/D.st;if(fx<0||fn<0||fx>D.nx-1.001||fn>D.nn-1.001)return null;const i=Math.floor(fx),j=Math.floor(fn),tx=fx-i,tn=fn-j,a=D.a,k=j*D.nx+i;return((a[k]*(1-tx)+a[k+1]*tx)*(1-tn)+(a[k+D.nx]*(1-tx)+a[k+D.nx+1]*tx)*tn)/10}
function demW(x,n){const D=DEM,e=Math.min(x-D.x0,D.x0+(D.nx-1)*D.st-x,n-D.n0,D.n0+(D.nn-1)*D.st-n);return Math.max(0,Math.min(1,e/140))}
// v80: covered passages inside the mount behind the Huldah gates and Kiponus (items 9). The platform gets a notch for each passage, and the ground under the mount is dropped there.
let TUNS_=null;
function TUNS(){if(TUNS_)return TUNS_;TUNS_=[];
  [["חולדה המערבי",-35.1,-251.3,14,"S"],["חולדה המזרחי",30,-239.8,16,"S"],["קיפונוס",-90,-175.1,10,"K"]].forEach(([nm,x,n,gw,k])=>{
    let best=[1e9,0,0,0,0,0];for(let i=0;i<MOUNT.length;i++){const a=MOUNT[i],b=MOUNT[(i+1)%MOUNT.length],dx=b[0]-a[0],dn=b[1]-a[1],L2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-a[0])*dx+(n-a[1])*dn)/L2)),px=a[0]+dx*t,pn=a[1]+dn*t,e=Math.hypot(px-x,pn-n);if(e<best[0])best=[e,px,pn,Math.atan2(dn,dx),i,t]}
    let ox=-Math.sin(best[3]),on=Math.cos(best[3]);if(inPoly(best[1]+ox*3,best[2]+on*3,MOUNT)){ox=-ox;on=-on}
    const w={x:best[1],n:best[2],a:best[3],ox,on};let thr;if(k==="K")thr=PLZ+4.3;else{const yo=H(w.x+w.ox*9,w.n+w.on*9);thr=yo<-3.5?Math.max(yo+0.5,HUL):Math.max(yo,-1.5)}
    const tw=k==="K"?5.6:gw*0.78,N=Math.ceil(-thr/0.18),h=-thr/N,tread=0.3,FL=12,LAND=1.8,run=i=>0.4+i*tread+Math.floor(i/FL)*LAND,tot=run(N-1)+tread;
    TUNS_.push({nm,k,w,fx:Math.cos(w.a),fn:Math.sin(w.a),i:best[4],t:best[5],thr,tw,N,h,tread,FL,LAND,run,tot,D:tot+0.6,OPEN:k==="K"?11:14})});
  return TUNS_}
function tunAt(x,n,m){for(const T of TUNS()){const dx=x-T.w.x,dn=n-T.w.n,al=dx*T.fx+dn*T.fn,nn=dx*T.w.ox+dn*T.w.on;if(Math.abs(al)<T.tw/2+m&&nn<2&&nn>-(T.D+m))return T}return null}
function mountNotched(){const P=MOUNT.map(p=>[p[0],p[1]]);TUNS().slice().sort((a,b)=>b.i-a.i||b.t-a.t).forEach(T=>{const w=T.w,h=T.tw/2,q=(al,nn)=>[w.x+T.fx*al+w.ox*nn,w.n+T.fn*al+w.on*nn];P.splice(T.i+1,0,q(-h,0),q(-h,-T.D),q(h,-T.D),q(h,0))});return P}
function underMount(x,n,h){if(!inPoly(x,n,MOUNT_BIG))return h;if(!inPoly(x,n,MOUNT))return Math.min(h,-1);if(tunAt(x,n,14))return Math.min(h,-46);const e=nearEdge(x,n,MOUNT);if(e[0]>14)return Math.min(h,-4);const dx=e[1]-x,dn=e[2]-n,l=Math.hypot(dx,dn)||1,o=H(e[1]+dx/l*4,e[2]+dn/l*4);return Math.min(h,o-1,-4)}
function nearEdge(x,n,P){let best=1e9,bx=0,bn=0;for(let i=0;i<P.length;i++){const a=P[i],c=P[(i+1)%P.length],vx=c[0]-a[0],vn=c[1]-a[1],L2=vx*vx+vn*vn||1;let t=((x-a[0])*vx+(n-a[1])*vn)/L2;t=Math.max(0,Math.min(1,t));const px=a[0]+vx*t,pn=a[1]+vn*t,dd=Math.hypot(x-px,n-pn);if(dd<best){best=dd;bx=px;bn=pn}}return[best,bx,bn]}
function Hsyn(x,n){
  const w=sig((-x-430)/180);let h=38*w+92*sig((x-560)/110);
  if(n<-260)h-=Math.min(70,(-260-n)*0.07)*(1-0.75*w);
  if(n>350)h+=Math.min(22,(n-350)*0.03);
  h+=16*Math.exp(-Math.pow(Math.hypot(x+600,n+690)/190,2));
  let r=segDist(x,n,KIDRON);h-=r[1]*Math.exp(-Math.pow(r[0]/80,2));
  r=segDist(x,n,HINNOM);h-=r[1]*Math.exp(-Math.pow(r[0]/65,2));
  r=segDist(x,n,TYRO);h-=r[1]*Math.exp(-Math.pow(r[0]/60,2));
  return h}
function H(x,n){let h=Hsyn(x,n);const w=demW(x,n);
  if(w>0){let dm=demAt(x,n);
    if(x>-200&&x<260&&n>-320&&n<330&&!inPoly(x,n,GEO.MOUNT)){const e=nearEdge(x,n,GEO.MOUNT);if(e[0]<55){const k=(55-e[0])/Math.max(e[0],0.5),o=demAt(x+(x-e[1])*k,n+(n-e[2])*k);if(o!==null){const f=1-e[0]/55;dm=Math.min(dm,o+(dm-o)*(1-f)-4*f)}}}
    const r=segDist(x,n,KIDRON);dm-=3*Math.exp(-Math.pow(r[0]/14,2));
    h=h*(1-w)+dm*w}
  if(x>-240&&x<-40&&n>-300&&n<-70){let f;if(inPoly(x,n,PLAZA)||inPoly(x,n,KZ))f=1;else{let dmin=1e9;for(let i=0;i<PLAZA.length;i++){const r=segDist(x,n,[PLAZA[i],PLAZA[(i+1)%PLAZA.length]]);if(r[0]<dmin)dmin=r[0]}f=Math.max(0,1-dmin/35)}if(f>0){f=f*f*(3-2*f);h=h*(1-f)+PLZ*f}}
  if(x>-160&&x<260&&n>-680&&n<-205&&!inPoly(x,n,MOUNT))h=groundFix(x,n,h);
  return h;
}
// topic 3: surveyed levels south of the mount. Points: [x,n,shift m,radius m]
function groundFix(x,n,h){const P=groundFix.P||(groundFix.P=[[45,-246,4.1,22],[112,-236,10.6,20],[113,-259,6.6,20],[113,-300,2.9,25],[113,-348,-5.9,30],[-25,-415,-11,35],[-37,-415,-11,30],[-116,-351,0,30],[-80,-430,0,30],[60,-470,0,35],[40,-600,0,50],[170,-260,0,25],[180,-330,0,30],[0,-290,0,22],[-40,-275,0,20],[-80,-262,0,18]]);
  let sw=0,sd=0;for(const p of P){const w=Math.exp(-((x-p[0])**2+(n-p[1])**2)/(p[3]*p[3]));sw+=w;sd+=w*p[2]}h+=sd/(sw+0.12);
  // the Southern Steps before the Double Gate: a landing at the sill, then 30 steps down 6.8 m
  const s=(x-45)*0.9847+(n+237.15)*0.1743,t=(x-45)*0.1743-(n+237.15)*0.9847;
  if(t>0&&t<40&&Math.abs(s)<42){const pr=(t<6?HUL:t<27?HUL-(t-6)*6.8/21:HUL-6.8)-0.15,cl=v=>Math.max(0,Math.min(1,v)),w=cl((42-Math.abs(s))/10)*cl((40-t)/12);h=h*(1-w)+pr*w}
  return h}
const HS=(x,n)=>{const g=S2G(x,n);return H(g[0],g[1])};
function inPoly(x,n,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const xi=P[i][0],ni=P[i][1],xj=P[j][0],nj=P[j][1];if(((ni>n)!==(nj>n))&&(x<(xj-xi)*(n-ni)/(nj-ni)+xi))c=!c}return c}
function rng(seed){return()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}}
// stage 3: a box whose edges and corners are chamfered by a few cm, with normals that bend round them so they read as rounded; the first 24 vertices keep BoxGeometry's layout
function rbox(w,h,d,tile){const g=wbox(w,h,d,tile),r=Math.min(0.06,w/4,h/4,d/4);if(r<0.012)return g;
  const hf=[w/2,h/2,d/2],pos=Array.from(g.attributes.position.array),nor=Array.from(g.attributes.normal.array),uvs=Array.from(g.attributes.uv.array),idx=Array.from(g.index.array);
  for(let i=0;i<24;i++)for(let a=0;a<3;a++){if(Math.abs(nor[i*3+a])>0.5)continue;const v=pos[i*3+a];pos[i*3+a]=Math.sign(v)*(hf[a]-r)}
  const start=idx.length,addV=(p,n)=>{pos.push(p[0],p[1],p[2]);nor.push(n[0],n[1],n[2]);uvs.push(0,0);return pos.length/3-1};
  const tri=(a,b,c,o)=>{const A3=pos.slice(a*3,a*3+3),B3=pos.slice(b*3,b*3+3),C3=pos.slice(c*3,c*3+3),u=[B3[0]-A3[0],B3[1]-A3[1],B3[2]-A3[2]],v=[C3[0]-A3[0],C3[1]-A3[1],C3[2]-A3[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n[0]*o[0]+n[1]*o[1]+n[2]*o[2]<0)idx.push(a,c,b);else idx.push(a,b,c)};
  for(let e=0;e<3;e++){const a=(e+1)%3,b=(e+2)%3;for(const sa of[-1,1])for(const sb of[-1,1]){const mk=(fa,se)=>{const p=[0,0,0],n=[0,0,0];p[e]=se*(hf[e]-r);p[a]=sa*(fa?hf[a]:hf[a]-r);p[b]=sb*(fa?hf[b]-r:hf[b]);if(fa)n[a]=sa;else n[b]=sb;return addV(p,n)};
    const a0=mk(true,-1),a1=mk(true,1),b0=mk(false,-1),b1=mk(false,1),o=[0,0,0];o[a]=sa;o[b]=sb;tri(a0,a1,b1,o);tri(a0,b1,b0,o)}}
  for(const sx of[-1,1])for(const sy of[-1,1])for(const sz of[-1,1]){const sg=[sx,sy,sz],vs=[0,1,2].map(ax=>{const p=sg.map((q,k)=>q*(k===ax?hf[k]:hf[k]-r)),n=[0,0,0];n[ax]=sg[ax];return addV(p,n)});tri(vs[0],vs[1],vs[2],sg)}
  const G=new THREE.BufferGeometry();G.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));G.setAttribute("normal",new THREE.Float32BufferAttribute(nor,3));G.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));G.setIndex(idx);
  g.groups.forEach(q=>G.addGroup(q.start,q.count,q.materialIndex));G.addGroup(start,idx.length-start,0);g.dispose();return G}
function wbox(w,h,d,tile){const g=new THREE.BoxGeometry(w,h,d);const uv=g.attributes.uv;const dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*dims[f][0]/tile,uv.getY(i)*dims[f][1]/tile)}uv.needsUpdate=true;return g}

function cv(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d",{willReadFrequently:true}),w,h);return c}
function tex(c,srgb){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(srgb)t.encoding=THREE.sRGBEncoding;return t}
function noiseFill(x,w,h,amt,seed){const img=x.getImageData(0,0,w,h),d=img.data;let q=(Math.imul(seed|0,2654435761)^0x9e3779b9)|0||1;const k=amt/4294967296;for(let i=0;i<d.length;i+=4){q^=q<<13;q^=q>>>17;q^=q<<5;const v=(q>>>0)*k-amt*0.5;d[i]+=v;d[i+1]+=v;d[i+2]+=v}x.putImageData(img,0,0)}
function normalFrom(hc,str){const w=hc.width,h=hc.height,src=hc.getContext("2d").getImageData(0,0,w,h).data;return cv(w,h,(x)=>{const img=x.createImageData(w,h),d=img.data;const at=(i,j)=>src[(((j+h)%h)*w+((i+w)%w))*4]/255;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const dx=(at(i+1,j)-at(i-1,j))*str,dy=(at(i,j+1)-at(i,j-1))*str;const l=Math.hypot(dx,dy,1),k=(j*w+i)*4;d[k]=(-dx/l*0.5+0.5)*255;d[k+1]=(dy/l*0.5+0.5)*255;d[k+2]=(1/l*0.5+0.5)*255;d[k+3]=255}x.putImageData(img,0,0)})}
function shade(hex,k){const c=new THREE.Color(hex);c.multiplyScalar(k);return"#"+c.getHexString()}
function ashlarCanvases(base,seed){
  // stage 2: Herodian-style ashlar, like the Western Wall: a flat drafted margin round each stone, a slightly raised pick-dressed boss, softened arrises, wear and dirt
  const W=SMALL?512:1024,Hh=W,s=W/512,rows=4,rh=Hh/rows,r=rng(seed);
  const sc=(k)=>{const c=new THREE.Color(base).multiplyScalar(k);c.r=Math.min(1,c.r);c.g=Math.min(1,c.g);c.b=Math.min(1,c.b);return"#"+c.getHexString()};
    const col=cv(W,Hh,(x)=>{x.fillStyle=sc(0.8);x.fillRect(0,0,W,Hh)}),hgt=cv(W,Hh,(x)=>{x.fillStyle="#141414";x.fillRect(0,0,W,Hh)});
  const cx=col.getContext("2d"),hx=hgt.getContext("2d"),J=3*s,Mg=Math.round(12*s);
  const stone=(xx,y,bw,sh,sd)=>{const q=rng(sd),x0=xx+J/2,y0=y+J/2,w=bw-J,h=rh-J;
    // rounded arris in the height map: dark rim, then the margin plane
    hx.fillStyle="#5c5c5c";hx.fillRect(x0,y0,w,h);hx.fillStyle="#7c7c7c";hx.fillRect(x0+1.5*s,y0+1.5*s,w-3*s,h-3*s);hx.fillStyle="#8c8c8c";hx.fillRect(x0+3*s,y0+3*s,w-6*s,h-6*s);
    cx.fillStyle=sc(sh*1.07);cx.fillRect(x0,y0,w,h);
    // drafted margin: fine comb-chisel strokes across the band
    cx.lineWidth=0.8*s;cx.strokeStyle="rgba(95,80,55,.10)";cx.beginPath();
    for(let k=x0+2*s;k<x0+w-2*s;k+=2.6*s){const j=(q()-0.5)*1.6*s;cx.moveTo(k,y0+1*s);cx.lineTo(k+j,y0+Mg*0.8);cx.moveTo(k,y0+h-Mg*0.9);cx.lineTo(k+j,y0+h-1*s)}
    for(let k=y0+Mg;k<y0+h-Mg;k+=2.6*s){const j=(q()-0.5)*1.6*s;cx.moveTo(x0+1*s,k);cx.lineTo(x0+Mg*0.9,k+j);cx.moveTo(x0+w-Mg*0.9,k);cx.lineTo(x0+w-1*s,k+j)}cx.stroke();
    // the boss: raised, with a soft bevel (nested steps in height)
    const bx=x0+Mg,by=y0+Mg*0.8,bW=w-2*Mg,bH=h-Mg*1.7;if(bW>4*s&&bH>4*s){
      for(let k=0;k<5;k++){const v=150+k*20,d=k*1.4*s;hx.fillStyle="rgb("+v+","+v+","+v+")";hx.fillRect(bx+d,by+d,bW-2*d,bH-2*d)}
      cx.fillStyle=sc(sh*1.01);cx.fillRect(bx,by,bW,bH);
      let g=cx.createLinearGradient(0,by,0,by+bH);g.addColorStop(0,"rgba(255,250,236,.20)");g.addColorStop(0.12,"rgba(255,250,236,0)");g.addColorStop(0.86,"rgba(70,52,28,0)");g.addColorStop(1,"rgba(70,52,28,.13)");cx.fillStyle=g;cx.fillRect(bx,by,bW,bH);
      // pick-dressing pits
      const np=Math.floor(bW*bH/(40*s*s));for(let k=0;k<np;k++){const px=bx+q()*bW,py=by+q()*bH,sz=(0.6+q()*1.2)*s;const dk=q()<0.55;cx.fillStyle=dk?"rgba(75,58,35,"+(0.04+q()*0.05)+")":"rgba(255,248,230,"+(0.04+q()*0.05)+")";cx.fillRect(px,py,sz,sz)}}
    // worn and chipped edges
    const nc=1+Math.floor(q()*3);for(let k=0;k<nc;k++){const top=q()<0.5,ex=x0+q()*w,ey=top?y0+q()*1.5*s:y0+h-q()*1.5*s,rr=(0.8+q()*2)*s;cx.fillStyle="rgba(85,68,45,.18)";cx.beginPath();cx.arc(ex,ey,rr,0,7);cx.fill();hx.fillStyle="#606060";hx.beginPath();hx.arc(ex,ey,rr,0,7);hx.fill()}
    // dirt gathers at the foot of each stone; some stones are a touch darker or warmer
    const g2=cx.createLinearGradient(0,y0,0,y0+h);g2.addColorStop(0,"rgba(0,0,0,0)");g2.addColorStop(0.65,"rgba(70,55,32,0)");g2.addColorStop(1,"rgba(70,55,32,"+(0.03+q()*0.07)+")");cx.fillStyle=g2;cx.fillRect(x0,y0,w,h);
    if(q()<0.25){cx.fillStyle="rgba(150,110,60,"+(0.04+q()*0.06)+")";cx.fillRect(x0,y0,w,h)}
  };
  let sid=seed*977;
  for(let j=0;j<rows;j++){let xx=-(r()*140*s);while(xx<W){const bw=(150+r()*260)*s,y=j*rh,sh=0.9+r()*0.16,sd=++sid;stone(xx,y,bw,sh,sd);if(xx+bw>W)stone(xx-W,y,bw,sh,sd);if(xx<0)stone(xx+W,y,bw,sh,sd);xx+=bw}}
  // faint rain streaks running down the face
  for(let k=0;k<9;k++){const sx=r()*W,sw=(5+r()*16)*s,g=cx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,"rgba(80,70,55,0)");g.addColorStop(0.5,"rgba(80,70,55,"+(0.03+r()*0.04)+")");g.addColorStop(1,"rgba(80,70,55,0)");cx.fillStyle=g;cx.fillRect(sx,0,sw,Hh)}
  noiseFill(cx,W,Hh,9,seed+1);noiseFill(hx,W,Hh,14,seed+2);
  return{col,nrm:normalFrom(hgt,1.2*s)};
}
function paverCanvases(){const W=512,r=rng(5);
  const col=cv(W,W,(x)=>{x.fillStyle="#d8ceb6";x.fillRect(0,0,W,W);for(let j=0;j<8;j++)for(let i=-1;i<8;i++){const o=(j%2)*32;x.fillStyle=shade("#e4d9c0",0.92+r()*0.14);x.fillRect(i*64+o+2,j*64+2,60,60)}noiseFill(x,W,W,12,6)});
  const hg=cv(W,W,(x)=>{x.fillStyle="#303030";x.fillRect(0,0,W,W);x.fillStyle="#c8c8c8";for(let j=0;j<8;j++)for(let i=-1;i<8;i++){const o=(j%2)*32;x.fillRect(i*64+o+3,j*64+3,58,58)}noiseFill(x,W,W,20,7)});
  return{col,nrm:normalFrom(hg,1.6)};}
function marbleCanvases(){const W=256,Hh=512,r=rng(9);
  const col=cv(W,Hh,(x)=>{for(let j=0;j<4;j++){const blue=j%2===1;x.fillStyle=blue?"#cdd8e3":"#f5f3ee";x.fillRect(0,j*128,W,128);x.strokeStyle=blue?"rgba(90,110,140,.25)":"rgba(150,140,120,.18)";for(let v=0;v<6;v++){x.beginPath();let px=r()*W,py=j*128+r()*128;x.moveTo(px,py);for(let s=0;s<8;s++){px+=(r()-0.3)*40;py+=(r()-0.5)*20;x.lineTo(px,py)}x.lineWidth=0.6+r();x.stroke()}x.fillStyle="rgba(0,0,0,.10)";x.fillRect(0,j*128,W,2)}x.fillStyle="rgba(0,0,0,.06)";x.fillRect(0,0,1,Hh);x.fillRect(128,0,1,Hh)});
  const hg=cv(W,Hh,(x)=>{x.fillStyle="#d0d0d0";x.fillRect(0,0,W,Hh);x.fillStyle="#808080";for(let j=0;j<4;j++)x.fillRect(0,j*128,W,3);x.fillRect(0,0,2,Hh);x.fillRect(128,0,2,Hh)});
  return{col,nrm:normalFrom(hg,1.2)};}
function palmCanvas(){return cv(128,512,(x,w,h)=>{x.fillStyle="#d9ccb0";x.fillRect(0,0,w,h);x.strokeStyle="#a8977a";x.lineWidth=5;x.beginPath();x.moveTo(64,h-10);x.lineTo(64,140);x.stroke();for(let i=0;i<7;i++){const a=-1.2+i*0.4;x.beginPath();x.moveTo(64,140);x.quadraticCurveTo(64+Math.cos(a)*30,80+Math.sin(a)*10,64+Math.cos(a-0.6)*58,110-Math.sin(-a)*55);x.stroke()}for(let k=0;k<20;k++){x.beginPath();x.moveTo(52,h-20-k*17);x.lineTo(76,h-28-k*17);x.stroke()}})}
function mountWallCanvases(){const W=SMALL?512:1024,Hh=W*2,s=W/1024,ppm=W/16,r=rng(4242);
  const col=cv(W,Hh,x=>{x.fillStyle="#b9a888";x.fillRect(0,0,W,Hh)}),hg=cv(W,Hh,x=>{x.fillStyle="#202020";x.fillRect(0,0,W,Hh)});
  const cx=col.getContext("2d"),hx=hg.getContext("2d");const Y=y=>(2-y)*ppm;
  const band=(y0,y1,ch,lmin,lmax,drafted,base,var_)=>{let y=y1;while(y-ch>=y0-0.01){const py=Y(y),h=ch*ppm;let xx=-r()*lmax*ppm;while(xx<W){const bw=(lmin+r()*(lmax-lmin))*ppm,sh=base*(0.9+r()*var_);
      const draw=(ox)=>{const x0=ox+1.5*s,y0p=py+1.5*s,w=bw-3*s,hh=h-3*s;const c=new THREE.Color("#e6d2a6").multiplyScalar(sh);c.r=Math.min(1,c.r);c.g=Math.min(1,c.g);c.b=Math.min(1,c.b);
        cx.fillStyle="#"+c.getHexString();cx.fillRect(x0,y0p,w,hh);hx.fillStyle="#707070";hx.fillRect(x0,y0p,w,hh);
        if(drafted){const m=Math.max(4*s,0.09*ppm);hx.fillStyle="#9a9a9a";hx.fillRect(x0+m,y0p+m,w-2*m,hh-2*m);hx.fillStyle="#b0b0b0";hx.fillRect(x0+m+2*s,y0p+m+2*s,w-2*m-4*s,hh-2*m-4*s);
          cx.fillStyle="rgba(255,250,232,.10)";cx.fillRect(x0+m,y0p+m,w-2*m,3*s);cx.fillStyle="rgba(60,45,25,.10)";cx.fillRect(x0+m,y0p+hh-m-3*s,w-2*m,3*s);
          cx.strokeStyle="rgba(90,75,50,.10)";cx.lineWidth=0.8*s;cx.beginPath();for(let k=x0+2*s;k<x0+w;k+=3*s){cx.moveTo(k,y0p+1);cx.lineTo(k,y0p+m*0.8);cx.moveTo(k,y0p+hh-m*0.8);cx.lineTo(k,y0p+hh-1)}cx.stroke()}
        else{hx.fillStyle="#8c8c8c";hx.fillRect(x0+2*s,y0p+2*s,w-4*s,hh-4*s)}
        const g=cx.createLinearGradient(0,y0p,0,y0p+hh);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(60,45,25,"+(0.05+r()*0.08)+")");cx.fillStyle=g;cx.fillRect(x0,y0p,w,hh)};
      draw(xx);if(xx+bw>W)draw(xx-W);xx+=bw}y-=ch}};
  band(-6,2,0.42,0.5,1.1,false,1.0,0.12);   // late small stones at the top
  band(-12,-6,0.85,1.0,2.6,false,0.96,0.12);  // medium courses
  band(-30,-12,1.08,2.0,6.5,true,0.93,0.14);    // Herodian courses, drafted margins
  for(let k=0;k<26;k++){const sx=r()*W,sw=(4+r()*14)*s,g=cx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,"rgba(70,60,45,0)");g.addColorStop(0.6,"rgba(70,60,45,"+(0.03+r()*0.05)+")");g.addColorStop(1,"rgba(70,60,45,0)");cx.fillStyle=g;cx.fillRect(sx,0,sw,Hh)}
  for(let k=0;k<30;k++){const px=r()*W,py=Y(-12)+r()*(Y(-30)-Y(-12)),rr=(3+r()*6)*s;cx.fillStyle="rgba(95,110,60,"+(0.10+r()*0.12)+")";cx.beginPath();cx.arc(px,py,rr,0,7);cx.fill()}
  noiseFill(cx,W,Hh,10,77);noiseFill(hx,W,Hh,12,78);return{col,nrm:normalFrom(hg,1.4*s)}}
const T={};
(function(){
  const a1=ashlarCanvases("#dccfb2",11),a2=ashlarCanvases("#d3c39f",21),a3=ashlarCanvases("#e3dac6",31),pv=paverCanvases(),mb=marbleCanvases();
  {const mw=mountWallCanvases();T.mwC=tex(mw.col,true);T.mwN=tex(mw.nrm)}T.ashC=tex(a1.col,true);T.ashN=tex(a1.nrm);T.ash2C=tex(a2.col,true);T.ash2N=tex(a2.nrm);T.ash3C=tex(a3.col,true);T.ash3N=tex(a3.nrm);
  T.pavC=tex(pv.col,true);T.pavN=tex(pv.nrm);{const r=rng(91),W=512,Hh=512,col=cv(W,Hh,()=>{}),hgt=cv(W,Hh,()=>{}),cx=col.getContext("2d"),hx=hgt.getContext("2d");hx.fillStyle="#d0d0d0";hx.fillRect(0,0,W,Hh);
    for(let row=0;row<2;row++){const y0=row*256,base=row?[214,222,228]:[243,240,233];let x=-r()*200;while(x<W){const bw=180+r()*200,k=0.96+r()*0.06;cx.fillStyle="rgb("+base.map(v=>Math.round(v*k)).join(",")+")";cx.fillRect(x,y0,bw,256);for(let i=0;i<40;i++){cx.fillStyle="rgba(150,150,160,"+(r()*0.05)+")";cx.beginPath();cx.ellipse(x+r()*bw,y0+r()*256,8+r()*40,2+r()*6,r()*3,0,7);cx.fill()}
      cx.fillStyle="rgba(120,115,105,.55)";cx.fillRect(x,y0,3,256);hx.fillStyle="#303030";hx.fillRect(x-1,y0,5,256);x+=bw}
      cx.fillStyle="rgba(120,115,105,.6)";cx.fillRect(0,y0,W,3);hx.fillStyle="#303030";hx.fillRect(0,y0-1,W,5);cx.fillStyle="rgba(255,255,255,.18)";cx.fillRect(0,y0+4,W,6)}
    noiseFill(cx,W,Hh,6,93);T.marC=tex(col,true);T.marN=tex(normalFrom(hgt,3))}T.palm=tex(palmCanvas(),true);
  T.ground=tex(cv(256,256,(x,w,h)=>{x.fillStyle="#808080";x.fillRect(0,0,w,h);noiseFill(x,w,h,70,41)}));
})();
const M={
  stone:new THREE.MeshStandardMaterial({map:T.ashC,normalMap:T.ashN,roughness:0.86}),
  stone2:new THREE.MeshStandardMaterial({map:T.ash2C,normalMap:T.ash2N,roughness:0.9}),
  stoneL:new THREE.MeshStandardMaterial({map:T.ash3C,normalMap:T.ash3N,roughness:0.85}),
  pave:new THREE.MeshStandardMaterial({map:T.pavC,normalMap:T.pavN,roughness:0.8}),
  marble:new THREE.MeshStandardMaterial({map:T.marC,normalMap:T.marN,roughness:0.62}),
  gold:new THREE.MeshStandardMaterial({color:0xc98a1e,metalness:0.7,roughness:0.28,emissive:0x5a3606,emissiveIntensity:0.55}),
  bronze:new THREE.MeshStandardMaterial({color:0x9a6b3a,metalness:0.9,roughness:0.35}),
  wood:new THREE.MeshStandardMaterial({color:0x7d5a3a,roughness:0.7}),
  dark:new THREE.MeshStandardMaterial({color:0x151b28,roughness:1}),
  win:new THREE.MeshStandardMaterial({color:0x1a2030,roughness:1,emissive:0xffb35a,emissiveIntensity:0}),
  palm:new THREE.MeshStandardMaterial({map:T.palm,roughness:0.85}),
  white:new THREE.MeshStandardMaterial({color:0xf3f1ea,roughness:0.9}),
  people:new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.9}),
  city:new THREE.MeshStandardMaterial({color:0xffffff,map:T.ash3C,roughness:0.9}),
  dome:new THREE.MeshStandardMaterial({color:0xd9d2c2,roughness:0.85}),
  wall:new THREE.MeshStandardMaterial({map:T.ash2C,normalMap:T.ash2N,roughness:0.9}),
  leaf:new THREE.MeshStandardMaterial({color:0x6f7a4c,roughness:1}),
  cypress:new THREE.MeshStandardMaterial({color:0x26331f,roughness:1,flatShading:true}),
  trunk:new THREE.MeshStandardMaterial({color:0x5b4a38,roughness:1}),
  fire:new THREE.MeshBasicMaterial({color:0xffa040}),
  fire2:new THREE.MeshBasicMaterial({color:0xffe08a}),
  smoke:new THREE.MeshBasicMaterial({color:0xb5b0a8,transparent:true,opacity:0.1,depthWrite:false}),
  lamp:new THREE.MeshBasicMaterial({color:0xffd28a})
};
// tone the temple stone down to the colour of real Jerusalem stone, and weather it like the city around
M.stone.color.setHex(0xf1e7d3);M.stone2.color.setHex(0xeee2ca);M.stoneL.color.setHex(0xf0e6d4);M.white.color.setHex(0xe2d8c5);M.city.color.setHex(0xc9bea7);M.white.envMapIntensity=0.45;M.marble.color.setHex(0xf3eadb);M.marble.envMapIntensity=0.45;M.marble.roughness=0.7;M.stoneL.envMapIntensity=0.5;M.pave.color.setHex(0xebe2d0);
[[M.stone,0.15,0.16],[M.stone2,0.15,0.18],[M.stoneL,0.13,0.14],[M.white,0.12,0.12],[M.wall,0.16,0.2],[M.pave,0.3,0],[M.dome,0.1,0.1],[M.marble,0.08,0]].forEach(q=>weather(...q));
const waterTex=tex(cv(64,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"#2f79b8");g.addColorStop(0.5,"#55a5dc");g.addColorStop(1,"#2f79b8");x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle="rgba(255,255,255,.35)";const r=rng(3);for(let i=0;i<14;i++){x.beginPath();x.moveTo(r()*w,i*18);x.lineTo(r()*w,i*18+10);x.stroke()}}),true);
T.panel=tex(cv(256,256,(x,w,h)=>{x.fillStyle="#b48a3c";x.fillRect(0,0,w,h);x.strokeStyle="rgba(70,45,10,.75)";x.fillStyle="rgba(255,230,160,.18)";x.lineWidth=3;
  const palm=(cx)=>{x.beginPath();x.moveTo(cx,h-14);x.lineTo(cx,70);x.stroke();for(let i=0;i<7;i++){const a=-1.25+i*0.42;x.beginPath();x.moveTo(cx,70);x.quadraticCurveTo(cx+Math.cos(a)*22,40,cx+Math.cos(a-0.6)*42,62-Math.sin(-a)*40);x.stroke()}for(let k=0;k<9;k++){x.beginPath();x.moveTo(cx-7,h-24-k*17);x.lineTo(cx+7,h-30-k*17);x.stroke()}};
  const cherub=(cx)=>{x.beginPath();x.ellipse(cx,150,16,44,0,0,Math.PI*2);x.fill();x.stroke();x.beginPath();x.arc(cx-11,96,10,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(cx-20,93);x.lineTo(cx-25,99);x.lineTo(cx-20,101);x.stroke();x.beginPath();x.arc(cx-15,92,1.6,0,7);x.fill();x.beginPath();x.arc(cx+11,96,9,0,Math.PI*2);x.stroke();for(let i=0;i<14;i++){const a=i/14*Math.PI*2;x.beginPath();x.moveTo(cx+11+Math.cos(a)*10,96+Math.sin(a)*10);x.lineTo(cx+11+Math.cos(a)*16,96+Math.sin(a)*16);x.stroke()}x.beginPath();x.arc(cx+15,93,1.6,0,7);x.fill();
    x.beginPath();x.moveTo(cx-14,130);x.quadraticCurveTo(cx-60,70,cx-58,30);x.quadraticCurveTo(cx-40,90,cx-14,150);x.stroke();x.beginPath();x.moveTo(cx+14,130);x.quadraticCurveTo(cx+60,70,cx+58,30);x.quadraticCurveTo(cx+40,90,cx+14,150);x.stroke()};
  palm(32);cherub(128);palm(224);x.strokeStyle="rgba(60,40,10,.6)";x.strokeRect(2,2,w-4,h-4);noiseFill(x,w,h,10,61)}),true);
T.metR=tex(cv(256,256,(x,w,h)=>{x.fillStyle="#6a6a6a";x.fillRect(0,0,w,h);const r=rng(77);for(let i=0;i<260;i++){const v=70+r()*90;x.fillStyle="rgba("+v+","+v+","+v+",.35)";x.beginPath();x.arc(r()*w,r()*h,2+r()*9,0,7);x.fill()}x.strokeStyle="rgba(170,170,170,.25)";x.lineWidth=0.6;for(let i=0;i<90;i++){const px=r()*w,py=r()*h,a=r()*0.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*30,py+Math.sin(a)*30);x.stroke()}noiseFill(x,w,h,18,78)})); // moved before M.panel, which uses it (was undefined there; request from Grok 5.11.2026)
M.panel=new THREE.MeshStandardMaterial({map:T.panel,normalMap:tex(normalFrom(T.panel.image,2.2)),metalness:0.8,roughness:0.42,roughnessMap:T.metR,color:0xffeccc,emissive:0x2a1904,emissiveIntensity:0.45,envMapIntensity:1.1});
M.lattice=new THREE.MeshStandardMaterial({map:tex(cv(128,128,(x,w,h)=>{x.fillStyle="#15181e";x.fillRect(0,0,w,h);x.fillStyle="#d8ccb0";for(let i=0;i<=8;i++){x.fillRect(i*16-3,0,6,h);x.fillRect(0,i*16-3,w,6)}x.strokeStyle="#b9ab8c";x.lineWidth=10;x.strokeRect(0,0,w,h)}),true),roughness:0.85});
M.win.map=M.lattice.map;M.win.color.setHex(0xffffff);M.win.needsUpdate=true;
// stage 3: "חלונות שקופים ואטומים" — wide outside, narrow inside (Menachot 86b): a splayed stone reveal down to a narrow slit
{const draw=(x,w,h,glow)=>{x.fillStyle=glow?"#000":"#d9ccb0";x.fillRect(0,0,w,h);const sx=w*0.38,sy=h*0.1,ix0=sx,ix1=w-sx,iy0=sy,iy1=h-sy;
  if(!glow){const q=(pts,c0,c1,gx0,gy0,gx1,gy1)=>{const g=x.createLinearGradient(gx0,gy0,gx1,gy1);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.beginPath();x.moveTo(...pts[0]);pts.slice(1).forEach(p=>x.lineTo(...p));x.closePath();x.fill()};
    q([[0,0],[w,0],[ix1,iy0],[ix0,iy0]],"#efe5cf","#a89a7e",0,0,0,iy0);q([[0,h],[w,h],[ix1,iy1],[ix0,iy1]],"#b3a588","#7d715a",0,h,0,iy1);
    q([[0,0],[ix0,iy0],[ix0,iy1],[0,h]],"#e2d6bd","#968a70",0,0,ix0,0);q([[w,0],[ix1,iy0],[ix1,iy1],[w,h]],"#cfc2a6","#8a7e65",w,0,ix1,0)}
  x.fillStyle=glow?"#fff":"#0c0f16";x.fillRect(ix0,iy0,ix1-ix0,iy1-iy0)};
  M.win2=new THREE.MeshStandardMaterial({map:tex(cv(64,256,(x,w,h)=>draw(x,w,h,false)),true),emissiveMap:tex(cv(64,256,(x,w,h)=>draw(x,w,h,true)),true),emissive:0xffb35a,emissiveIntensity:0,roughness:0.9})}
// stage 3: carved stone reliefs for the outside of the House — cherubs with two faces, a palm between cherub and cherub (41:18-20)
function reliefTex(kind){const W=256,H=256,hc=cv(W,H,(x)=>{x.fillStyle="#7a7a7a";x.fillRect(0,0,W,H);x.filter="blur(1.5px)";x.strokeStyle="#d8d8d8";x.fillStyle="#bdbdbd";x.lineWidth=7;x.lineCap="round";
    const palm=(cx)=>{x.beginPath();x.moveTo(cx,H-8);x.lineTo(cx,70);x.stroke();for(let i=0;i<7;i++){const a=-1.25+i*0.42;x.beginPath();x.moveTo(cx,70);x.quadraticCurveTo(cx+Math.cos(a)*22,38,cx+Math.cos(a-0.6)*40,62-Math.sin(-a)*40);x.stroke()}for(let k=0;k<9;k++){x.beginPath();x.moveTo(cx-8,H-22-k*18);x.lineTo(cx+8,H-28-k*18);x.stroke()}};
    const cherub=(cx)=>{x.beginPath();x.ellipse(cx,160,18,48,0,0,7);x.fill();x.beginPath();x.moveTo(cx-14,130);x.quadraticCurveTo(cx-62,72,cx-58,26);x.quadraticCurveTo(cx-40,96,cx-14,152);x.fill();x.beginPath();x.moveTo(cx+14,130);x.quadraticCurveTo(cx+62,72,cx+58,26);x.quadraticCurveTo(cx+40,96,cx+14,152);x.fill();
      x.beginPath();x.arc(cx-12,98,11,0,7);x.fill();x.beginPath();x.moveTo(cx-22,95);x.lineTo(cx-28,101);x.lineTo(cx-21,104);x.fill();x.beginPath();x.arc(cx+12,98,10,0,7);x.fill();x.lineWidth=4;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;x.beginPath();x.moveTo(cx+12+Math.cos(a)*10,98+Math.sin(a)*10);x.lineTo(cx+12+Math.cos(a)*17,98+Math.sin(a)*17);x.stroke()}x.lineWidth=7};
    if(kind==="palm")palm(W/2);else{palm(0);palm(W);cherub(W/2)}
    x.filter="none";x.strokeStyle="#5a5a5a";x.lineWidth=6;x.strokeRect(0,0,W,H);noiseFill(x,W,H,10,kind==="palm"?95:96)});
  const col=cv(W,H,(x)=>{x.drawImage(hc,0,0);const d=x.getImageData(0,0,W,H),p=d.data;for(let i=0;i<p.length;i+=4){const v=p[i]/255;const k=0.5+0.62*v;p[i]=Math.min(255,236*k);p[i+1]=Math.min(255,222*k);p[i+2]=Math.min(255,196*k)}x.putImageData(d,0,0)});
  return new THREE.MeshStandardMaterial({map:tex(col,true),normalMap:tex(normalFrom(hc,6)),roughness:0.85,color:0xf6efe2})}
M.relief=reliefTex("cherub");M.reliefP=reliefTex("palm");
M.altarGold=new THREE.MeshStandardMaterial({color:0xc98a1e,metalness:0.7,roughness:0.28,emissive:0x5a3606,emissiveIntensity:0.55,envMapIntensity:1.2});
// ---- stage 2: metals and wood that read as real ----
T.hamC=tex(cv(256,256,(x,w,h)=>{x.fillStyle="#ffffff";x.fillRect(0,0,w,h);const r=rng(79);for(let i=0;i<340;i++){const v=236+r()*19;x.fillStyle="rgba("+v+","+(v-6)+","+(v-22)+",.22)";x.beginPath();x.arc(r()*w,r()*h,3+r()*7,0,7);x.fill()}noiseFill(x,w,h,8,80)}),true);
T.patC=tex(cv(256,256,(x,w,h)=>{x.fillStyle="#ffffff";x.fillRect(0,0,w,h);const r=rng(81);for(let i=0;i<120;i++){x.fillStyle=r()<0.5?"rgba(95,70,45,.07)":"rgba(120,140,110,.05)";x.beginPath();x.arc(r()*w,r()*h,4+r()*16,0,7);x.fill()}noiseFill(x,w,h,10,82)}),true);
T.woodC=tex(cv(256,512,(x,w,h)=>{x.fillStyle="#a7764a";x.fillRect(0,0,w,h);const r=rng(83);for(let i=0;i<70;i++){const px=r()*w,c=r()<0.5?"rgba(90,55,28,":"rgba(200,150,100,";x.strokeStyle=c+(0.12+r()*0.22)+")";x.lineWidth=0.6+r()*2.2;x.beginPath();x.moveTo(px,0);for(let y=0;y<=h;y+=16)x.lineTo(px+Math.sin(y*0.02+i)*4+(r()-0.5)*1.5,y);x.stroke()}for(let i=0;i<4;i++){const kx=r()*w,ky=r()*h;x.strokeStyle="rgba(70,40,18,.35)";for(let k=1;k<6;k++){x.beginPath();x.ellipse(kx,ky,k*2.2,k*5,0,0,7);x.stroke()}}x.fillStyle="rgba(60,35,15,.5)";x.fillRect(0,0,2,h);x.fillRect(w/2,0,2,h);noiseFill(x,w,h,10,84)}),true);
function realGold(m,bright){m.color.setHex(bright?0xf7c460:0xeab552);m.metalness=1;m.roughness=0.32;m.roughnessMap=T.metR;m.map=T.hamC;m.emissive.setHex(0x3a2406);m.emissiveIntensity=0.35;m.envMapIntensity=1.25;m.needsUpdate=true}
realGold(M.gold,false);realGold(M.altarGold,true);
M.bronze.color.setHex(0xd59660);M.bronze.metalness=1;M.bronze.roughness=0.4;M.bronze.roughnessMap=T.metR;M.bronze.map=T.patC;M.bronze.envMapIntensity=1.15;M.bronze.emissive=new THREE.Color(0x24140a);M.bronze.emissiveIntensity=0.35;M.bronze.needsUpdate=true;
M.wood.color.setHex(0xffffff);M.wood.map=T.woodC;M.wood.roughness=0.68;M.wood.needsUpdate=true;
M.plaster=new THREE.MeshStandardMaterial({color:0xe9e2d2,roughness:0.95,envMapIntensity:0.3});
// stage 5: the altar is built of whole field stones that iron never touched, whitewashed twice a year (Middot 3:4; Rambam Beit HaBechira 1:14-16) —
// so it is white and smooth, but the round shapes of the stones still show through the lime
{const W=512,r=rng(77),P=[];for(let j=0;j<9;j++)for(let i=0;i<9;i++)P.push([(i+0.5+(r()-0.5)*0.55)*W/9,(j+0.5+(r()-0.5)*0.55)*W/9,(0.4+r()*0.12)*W/9,(0.36+r()*0.1)*W/9,r()*3,r()]);
  const blob=(x,p,sc,o)=>{x.beginPath();for(let a=0;a<=24;a++){const t=a/24*Math.PI*2,n=1+0.13*Math.sin(t*3+p[4]*5)+0.07*Math.sin(t*5+p[5]*9);x.lineTo(p[0]+o[0]+Math.cos(t+p[4])*p[2]*sc*n,p[1]+o[1]+Math.sin(t+p[4])*p[3]*sc*n)}x.closePath()};
  const tile=(x,fn)=>P.forEach(p=>[[0,0],[W,0],[-W,0],[0,W],[0,-W],[W,W],[-W,-W],[W,-W],[-W,W]].forEach(o=>fn(p,o)));
  const col=cv(W,W,(x)=>{x.fillStyle="#e4ddce";x.fillRect(0,0,W,W);tile(x,(p,o)=>{x.fillStyle=shade("#efe9dd",0.98+p[5]*0.04);blob(x,p,1,o);x.fill()});noiseFill(x,W,W,9,78)});
  const hc=cv(W,W,(x)=>{x.fillStyle="#3a3a3a";x.fillRect(0,0,W,W);x.filter="blur(7px)";tile(x,(p,o)=>{x.fillStyle="#8a8a8a";blob(x,p,1,o);x.fill();x.fillStyle="#d8d8d8";blob(x,p,0.62,o);x.fill()});x.filter="none";noiseFill(x,W,W,14,79)});
  M.altarS=new THREE.MeshStandardMaterial({map:tex(col,true),normalMap:tex(normalFrom(hc,1.7)),roughness:0.93,envMapIntensity:0.3});
  M.ash=new THREE.MeshStandardMaterial({color:0x8d8984,roughness:1});M.ember=new THREE.MeshBasicMaterial({color:0xff6a20});
  M.iron=new THREE.MeshStandardMaterial({color:0x4b4a48,metalness:0.8,roughness:0.45})}
M.goldFloor=new THREE.MeshStandardMaterial({color:0xd9a95a,metalness:0.75,roughness:0.5,roughnessMap:T.metR,map:T.hamC,envMapIntensity:0.45,emissive:0x2a1a04,emissiveIntensity:0.3});
M.ceiling=(()=>{const W=512,r=rng(505),B=46,flower=(x,cx,cy,R,n)=>{for(let i=0;i<n;i++){const a=i/n*Math.PI*2;x.beginPath();x.ellipse(cx+Math.cos(a)*R*0.55,cy+Math.sin(a)*R*0.55,R*0.42,R*0.17,a,0,7);x.fill()}x.beginPath();x.arc(cx,cy,R*0.22,0,7);x.fill()};
  const gourds=(x,cx,cy,hor)=>{for(let k=-2;k<=2;k++){x.beginPath();x.ellipse(cx+(hor?k*26:0),cy+(hor?0:k*26),hor?9:5,hor?5:9,0,0,7);x.fill()}};
  const pat=(x,mode)=>{// mode: 0 colour, 1 height, 2 metal
    x.fillStyle=mode===0?"#4f3019":mode===1?"#d8d8d8":"#000";x.fillRect(0,0,W,W);
    x.fillStyle=mode===0?"#7a4a27":mode===1?"#555":"#000";x.fillRect(B,B,W-2*B,W-2*B);
    x.strokeStyle=mode===0?"rgba(40,22,10,.8)":mode===1?"#999":"#000";x.lineWidth=10;x.strokeRect(B+8,B+8,W-2*B-16,W-2*B-16);
    if(mode===0){for(let i=0;i<70;i++){x.strokeStyle="rgba(40,22,10,"+(0.08+r()*0.12)+")";x.lineWidth=1+r()*2;const yy=r()*W;x.beginPath();x.moveTo(0,yy);x.bezierCurveTo(W*0.3,yy+(r()-0.5)*20,W*0.7,yy+(r()-0.5)*20,W,yy+(r()-0.5)*10);x.stroke()}}
    x.fillStyle=mode===0?"#d9b25a":mode===1?"#fff":"#fff";flower(x,W/2,W/2,120,10);x.fillStyle=mode===0?"#8a5a32":mode===1?"#777":"#000";x.beginPath();x.arc(W/2,W/2,22,0,7);x.fill();x.fillStyle=mode===0?"#d9b25a":"#fff";flower(x,W/2,W/2,34,8);
    x.fillStyle=mode===0?"#c9a24e":"#fff";gourds(x,W/2,B/2,true);gourds(x,W/2,W-B/2,true);gourds(x,B/2,W/2,false);gourds(x,W-B/2,W/2,false);[[B/2,B/2],[W-B/2,B/2],[B/2,W-B/2],[W-B/2,W-B/2]].forEach(([a,b])=>flower(x,a,b,20,8))};
  const c=cv(W,W,x=>{pat(x,0);noiseFill(x,W,W,10,506)}),h=cv(W,W,x=>{pat(x,1);x.filter="blur(2px)";x.drawImage(x.canvas,0,0);x.filter="none"}),m=cv(W,W,x=>pat(x,2));
  return new THREE.MeshStandardMaterial({map:tex(c,true),normalMap:tex(normalFrom(h,3)),metalnessMap:tex(m),metalness:1,roughness:0.55,color:0xffffff})})();
M.bread=(()=>{const W=128,r=rng(404),h=cv(W,W,(x)=>{x.fillStyle="#808080";x.fillRect(0,0,W,W);for(let i=0;i<220;i++){const px=r()*W,py=r()*W,rad=1+r()*4,g=x.createRadialGradient(px,py,0,px,py,rad);const v=r()<0.6?40:220;g.addColorStop(0,"rgba("+v+","+v+","+v+",.5)");g.addColorStop(1,"rgba(128,128,128,0)");x.fillStyle=g;x.fillRect(px-rad,py-rad,rad*2,rad*2)}}),
  c=cv(W,W,(x)=>{const g=x.createLinearGradient(0,0,W,W);g.addColorStop(0,"#c8873f");g.addColorStop(0.5,"#d9a15a");g.addColorStop(1,"#b9742f");x.fillStyle=g;x.fillRect(0,0,W,W);for(let i=0;i<120;i++){x.fillStyle="rgba("+(r()<0.5?"120,70,25":"240,205,150")+","+(r()*0.25)+")";x.beginPath();x.ellipse(r()*W,r()*W,2+r()*9,1+r()*4,r()*3,0,7);x.fill()}noiseFill(x,W,W,14,405)});
  return new THREE.MeshStandardMaterial({map:tex(c,true),normalMap:tex(normalFrom(h,2)),roughness:0.85})})();
Object.values(M).forEach(m=>{if(m.isMeshStandardMaterial)m.envMapIntensity=0.3});M.gold.envMapIntensity=1.1;M.bronze.envMapIntensity=0.8;M.marble.envMapIntensity=0.35;
const fadeTex=(soft)=>{const t=new THREE.CanvasTexture(cv(128,4,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,"#000");g.addColorStop(soft,"#fff");g.addColorStop(1-soft,"#fff");g.addColorStop(1,"#000");x.fillStyle=g;x.fillRect(0,0,w,h)}));t.wrapT=THREE.RepeatWrapping;return t};
const RIPN=tex(normalFrom(cv(256,256,(x,w,h)=>{x.fillStyle="#808080";x.fillRect(0,0,w,h);const r=rng(55);for(let i=0;i<260;i++){const px=r()*w,py=r()*h,rad=4+r()*22,g=x.createRadialGradient(px,py,0,px,py,rad);const v=r()<0.5?255:0;g.addColorStop(0,"rgba("+v+","+v+","+v+",.22)");g.addColorStop(1,"rgba(128,128,128,0)");x.fillStyle=g;for(const ox of[-w,0,w])for(const oy of[-h,0,h]){x.save();x.translate(ox,oy);x.beginPath();x.arc(px,py,rad,0,7);x.fill();x.restore()}}}),2.2));RIPN.repeat.set(2,1);
M.river=new THREE.MeshStandardMaterial({color:0x35606a,roughness:0.06,metalness:0.15,normalMap:RIPN,normalScale:new THREE.Vector2(0.55,0.55),alphaMap:fadeTex(0.2),transparent:true,opacity:0.94,depthWrite:false,envMapIntensity:1.3,side:THREE.DoubleSide});
M.bank=new THREE.MeshStandardMaterial({color:0x5a5244,opacity:0.45,roughness:1,alphaMap:fadeTex(0.45),transparent:true,depthWrite:false,envMapIntensity:0.2,side:THREE.DoubleSide});
M.leaf2=new THREE.MeshStandardMaterial({color:0x56783a,roughness:0.95,envMapIntensity:0.25});
M.foam=new THREE.MeshStandardMaterial({color:0xf4f8f8,roughness:0.5,transparent:true,opacity:0.75,depthWrite:false});
M.water=new THREE.MeshStandardMaterial({map:waterTex,roughness:0.15,metalness:0.1,transparent:true,opacity:0.92});
M.water2=new THREE.MeshStandardMaterial({map:waterTex,roughness:0.12,metalness:0.1,transparent:true,opacity:0.9,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});

const WG=new THREE.Group();WG.rotation.y=-THETA;scene.add(WG);
function b64bytes(t){const b=atob(t.trim()),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
const T19=[{"img":"sat19_0_0.webp","w":35.22148132324219,"e":35.22869110107422,"s":31.78027699666432,"nn":31.785384226419538},{"img":"sat19_0_1.webp","w":35.22869110107422,"e":35.23590087890625,"s":31.78027699666432,"nn":31.785384226419538},{"img":"sat19_0_2.webp","w":35.23590087890625,"e":35.24311065673828,"s":31.78027699666432,"nn":31.785384226419538},{"img":"sat19_0_3.webp","w":35.24311065673828,"e":35.25032043457031,"s":31.78027699666432,"nn":31.785384226419538},{"img":"sat19_1_0.webp","w":35.22148132324219,"e":35.22869110107422,"s":31.775169484844636,"nn":31.78027699666432},{"img":"sat19_1_1.webp","w":35.22869110107422,"e":35.23590087890625,"s":31.775169484844636,"nn":31.78027699666432},{"img":"sat19_1_2.webp","w":35.23590087890625,"e":35.24311065673828,"s":31.775169484844636,"nn":31.78027699666432},{"img":"sat19_1_3.webp","w":35.24311065673828,"e":35.25032043457031,"s":31.775169484844636,"nn":31.78027699666432},{"img":"sat19_2_0.webp","w":35.22148132324219,"e":35.22869110107422,"s":31.7700616909855,"nn":31.775169484844636},{"img":"sat19_2_1.webp","w":35.22869110107422,"e":35.23590087890625,"s":31.7700616909855,"nn":31.775169484844636},{"img":"sat19_2_2.webp","w":35.23590087890625,"e":35.24311065673828,"s":31.7700616909855,"nn":31.775169484844636},{"img":"sat19_2_3.webp","w":35.24311065673828,"e":35.25032043457031,"s":31.7700616909855,"nn":31.775169484844636},{"img":"sat19_3_0.webp","w":35.22148132324219,"e":35.22869110107422,"s":31.76495361511195,"nn":31.7700616909855},{"img":"sat19_3_1.webp","w":35.22869110107422,"e":35.23590087890625,"s":31.76495361511195,"nn":31.7700616909855},{"img":"sat19_3_2.webp","w":35.23590087890625,"e":35.24311065673828,"s":31.76495361511195,"nn":31.7700616909855},{"img":"sat19_3_3.webp","w":35.24311065673828,"e":35.25032043457031,"s":31.76495361511195,"nn":31.7700616909855}];
const SATB={old:{w:35.22500038146973,e:35.244998931884766,s:31.769997841777602,nn:31.78500119397257,img:SMALL?"sat_oldcity.jpg":"sat_oldcity_hi.jpg",st:SMALL?12:8},mt:{w:35.232499837875366,e:35.23800104856491,s:31.77449910297965,nn:31.78149910945709,img:SMALL?"sat_mount.jpg":"sat_mount_hi.jpg",st:SMALL?6:4}};
const MERC=la=>Math.log(Math.tan(Math.PI/4+la*Math.PI/360)),LAT0=31.7780,LON0=35.2354;
function inSat(x,n){const b=SATB.old,lon=LON0+x/94630,lat=LAT0+n/110574;return lon>b.w&&lon<b.e&&lat>b.s&&lat<b.nn}
function satUV(b,x,n){const lon=LON0+x/94630,lat=LAT0+n/110574;return[(lon-b.w)/(b.e-b.w),(MERC(lat)-MERC(b.s))/(MERC(b.nn)-MERC(b.s))]}
let FLOOR="sat";const SATG=new THREE.Group(),CITYSAT=new THREE.Group(),SATTOP=new THREE.Group();WG.add(SATG);WG.add(CITYSAT);WG.add(SATTOP);

// ==== topic 5 (Claude): tree library — each species has its own shape (one merged mesh with colours = one draw call) ====
// 💡 sizes are typical grown trees of the Jerusalem hills; shapes are drawn simply, not botanically exact.
const TREES5=(function(){
  const r=rng(5151),V=new THREE.Vector3(),UP=new THREE.Vector3(0,1,0);
  // a lumpy leaf mass: round normals (soft light even with few faces), darker at the bottom and inside
  function blob(cx,cy,cz,rx,ry,rz,hex,det){const g=(q=>q.index?q.toNonIndexed():q)(new THREE.IcosahedronGeometry(1,det||0)),p=g.attributes.position,n=g.attributes.normal,col=[],c=new THREE.Color(hex);
    for(let i=0;i<p.count;i++){V.set(p.getX(i),p.getY(i),p.getZ(i)).normalize();const hv=Math.sin(V.x*12.99+V.y*78.23+V.z*37.72+cx*3.1+cz*1.7)*43758.55,k=0.84+0.28*(hv-Math.floor(hv));n.setXYZ(i,V.x,V.y,V.z);p.setXYZ(i,cx+V.x*rx*k,cy+V.y*ry*k,cz+V.z*rz*k);
      const sh=0.6+0.4*(V.y*0.5+0.5)+((hv*7)%1-0.5)*0.12;col.push(c.r*sh,c.g*sh,c.b*sh)}
    g.setAttribute("color",new THREE.Float32BufferAttribute(col,3));g.deleteAttribute("uv");return g}
  // a branch or trunk piece from a to b
  function limb(a,b,r0,r1,hex,seg){const L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),g=(q=>q.index?q.toNonIndexed():q)(new THREE.CylinderGeometry(r1,r0,L,seg||5,1,true));g.translate(0,L/2,0);
    V.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize();g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP,V)));g.translate(a[0],a[1],a[2]);
    const c=new THREE.Color(hex),col=[],p=g.attributes.position;for(let i=0;i<p.count;i++){const k=0.85+0.25*r();col.push(c.r*k,c.g*k,c.b*k)}g.setAttribute("color",new THREE.Float32BufferAttribute(col,3));g.deleteAttribute("uv");return g}
  function merge(list){let n=0;list.forEach(g=>n+=g.attributes.position.count);const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;
    list.forEach(g=>{P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);C.set(g.attributes.color.array,o*3);o+=g.attributes.position.count;g.dispose()});
    const m=new THREE.BufferGeometry();m.setAttribute("position",new THREE.BufferAttribute(P,3));m.setAttribute("normal",new THREE.BufferAttribute(N,3));m.setAttribute("color",new THREE.BufferAttribute(C,3));m.computeBoundingBox();m.computeBoundingSphere();return m}
  const ring=(k,R,y,rr)=>{const out=[];for(let i=0;i<k;i++){const a=i/k*Math.PI*2+r()*0.6,d=R*(0.6+0.4*r());out.push([Math.cos(a)*d,y+(r()-0.5)*rr,Math.sin(a)*d])}return out};
  const BARK=0x6e6253,BARKG=0x8a8070;
  const B={
    // olive (זית): short twisted trunk that splits, wide silvery crown — about 6 m high, 7 m wide
    olive:(lo)=>{const L=[limb([0,0,0],[0.35,1.3,0.1],0.38,0.3,BARKG,6),limb([0.35,1.3,0.1],[1.1,2.6,0.5],0.26,0.16,BARKG),limb([0.35,1.3,0.1],[-0.6,2.8,-0.3],0.25,0.15,BARKG),limb([0.3,1.2,0],[0.2,3.0,-1.0],0.2,0.12,BARKG)];
      if(lo)L.push(blob(0.2,3.9,0,3.3,1.8,3.3,0x7d8a62));else{L.push(blob(0,4.2,0,2.2,1.5,2.2,0x84906a));ring(6,2.0,3.6,0.8).forEach(q=>L.push(blob(q[0],q[1],q[2],1.5+r()*0.5,1.1+r()*0.3,1.5+r()*0.5,r()<0.5?0x7a875d:0x8c9673)))}return merge(L)},
    // Jerusalem pine / Aleppo pine (אורן ירושלים): tall bare trunk, open flat clumps at the top — about 12 m
    pine:(lo)=>{const top=[0.7,8.5,0.2],L=[limb([0,0,0],top,0.32,0.16,0x6a5a48,6),limb([0.5,6.2,0.15],[-1.6,9.4,0.6],0.12,0.07,0x6a5a48),limb([0.6,7.2,0.2],[2.3,9.8,-0.8],0.11,0.06,0x6a5a48)];
      if(lo)L.push(blob(0.4,9.9,0,3.4,1.6,3.4,0x46592f));else{L.push(blob(0.7,10.6,0.1,1.9,1.1,1.9,0x4a5d33));[[-1.6,9.6,0.6],[2.3,10,-0.8],[0.2,9.0,1.9],[1.3,9.2,1.4],[-0.6,8.6,-1.6]].forEach(q=>L.push(blob(q[0],q[1],q[2],1.6+r()*0.5,0.85+r()*0.3,1.6+r()*0.5,r()<0.5?0x3f5230:0x4d6137)))}return merge(L)},
    // Italian cypress (ברוש): a narrow dark spindle — about 13 m
    cypress:(lo)=>{const pts=[];const K=lo?5:9;for(let i=0;i<=K;i++){const t=i/K;pts.push(new THREE.Vector2(Math.max(0.02,0.95*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.08)),0.75)*(1-t*0.25)),0.6+t*12.4))}
      const g=(q=>q.index?q.toNonIndexed():q)(new THREE.LatheGeometry(pts,lo?5:8)),p=g.attributes.position,c=new THREE.Color(0x2e3d26),col=[];for(let i=0;i<p.count;i++){const y=p.getY(i),k=0.7+0.3*(y/13)+(r()-0.5)*0.1;col.push(c.r*k,c.g*k,c.b*k)}
      g.setAttribute("color",new THREE.Float32BufferAttribute(col,3));g.deleteAttribute("uv");g.computeVertexNormals();return merge([g,limb([0,0,0],[0,0.8,0],0.18,0.15,0x5b4a38)])},
    // date palm (תמר): ringed trunk, arching fronds, date bunches — about 10 m
    palm:(lo)=>{const H=9,L=[limb([0,0,0],[0.25,H*0.5,0],0.3,0.26,0x7a6a55,7),limb([0.25,H*0.5,0],[0.6,H,0.1],0.26,0.22,0x7a6a55,7)],top=[0.6,H,0.1];
      const F=lo?7:14,c=new THREE.Color(0x5b7b36),pos=[],col=[];for(let f=0;f<F;f++){const a=f/F*Math.PI*2+(f%2)*0.2,up=f%2?0.9:0.5,len=3.6+r()*0.8,ca=Math.cos(a),sa=Math.sin(a),S=lo?2:5;
        const P=t=>{const d=t*len,h=up*1.6*t-2.6*t*t;return[top[0]+ca*d,top[1]+h,top[2]+sa*d]};
        for(let s=0;s<S;s++){const t0=s/S,t1=(s+1)/S,w0=0.55*Math.sin(Math.PI*Math.min(1,t0+0.1)),w1=0.55*Math.sin(Math.PI*Math.min(1,t1+0.1)),A=P(t0),Bq=P(t1);
          [[-1,1],[1,-1]].forEach(([s1])=>{const q=(p,w,dd)=>[p[0]-sa*w*s1,p[1]-0.12*w,p[2]+ca*w*s1];const a0=q(A,w0),b0=q(Bq,w1);pos.push(...A,...b0,...Bq,...A,...a0,...b0)});
          for(let k=0;k<12;k++){const sh=0.75+0.3*(1-t0);col.push(c.r*sh,c.g*sh,c.b*sh)}}}
      const fg=new THREE.BufferGeometry();fg.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));fg.setAttribute("color",new THREE.Float32BufferAttribute(col,3));fg.computeVertexNormals();L.push(fg);
      if(!lo)ring(4,0.55,H-0.5,0.2).forEach(q=>L.push(blob(top[0]+q[0],q[1],top[2]+q[2],0.28,0.45,0.28,0xb5731e)));return merge(L)},
    // fig (תאנה): several low stems, broad light-green crown — about 5 m high, 6 m wide
    fig:(lo)=>{const L=[limb([0,0,0],[0.9,2.0,0.4],0.17,0.11,BARKG),limb([0,0,0],[-0.8,2.1,0.3],0.16,0.1,BARKG),limb([0,0,0],[0.1,2.2,-0.9],0.15,0.1,BARKG)];
      if(lo)L.push(blob(0,3.1,0,3,1.5,3,0x5e7d3a));else{L.push(blob(0,3.5,0,2,1.3,2,0x648441));ring(5,1.9,2.9,0.5).forEach(q=>L.push(blob(q[0],q[1],q[2],1.4+r()*0.4,1.0,1.4+r()*0.4,r()<0.5?0x5a7a37:0x6b8a45)))}return merge(L)},
    // carob (חרוב): short thick trunk, dense dark rounded crown — about 7 m
    carob:(lo)=>{const L=[limb([0,0,0],[0.2,1.8,0],0.36,0.28,BARK,6),limb([0.2,1.8,0],[1.2,3.0,0.3],0.2,0.13,BARK),limb([0.2,1.8,0],[-0.9,3.1,-0.4],0.2,0.13,BARK)];
      if(lo)L.push(blob(0,4.2,0,3.2,2.3,3.2,0x3f5b2d));else{L.push(blob(0,4.6,0,2.4,1.9,2.4,0x435f30));ring(6,1.9,3.9,0.9).forEach(q=>L.push(blob(q[0],q[1],q[2],1.5+r()*0.4,1.3,1.5+r()*0.4,r()<0.5?0x3b552a:0x4a6634)))}return merge(L)},
    // caper (צלף): a hanging blue-green clump that grows out of the joints of old walls, white flowers — about 1.2 m
    caper:(lo)=>{const L=[blob(0,0,0,0.7,0.45,0.55,0x93ab86),blob(0.45,-0.25,0.1,0.45,0.35,0.4,0x9db58f),blob(-0.4,-0.2,0.05,0.42,0.32,0.38,0x8aa37f)];if(!lo)for(let i=0;i<7;i++)L.push(blob((r()-0.5)*1.3,(r()-0.6)*0.7,0.35+r()*0.2,0.07,0.07,0.07,r()<0.7?0xf4eef0:0xd9a7c7));return merge(L)},
    // hyssop / za'atar (אזוב): a small grey-green upright tuft — about 0.5 m
    hyssop:(lo)=>{const L=[];for(let i=0;i<(lo?2:4);i++)L.push(blob((r()-0.5)*0.35,0.18+r()*0.12,(r()-0.5)*0.25,0.16,0.3,0.16,0xa8b48f));return merge(L)},
    // a town shade tree (plane, ficus): straight trunk, round crown — about 9 m
    shade:(lo)=>{const L=[limb([0,0,0],[0.1,3.2,0],0.25,0.2,0x7a6e60,6),limb([0.1,3.0,0],[1.2,4.6,0.4],0.13,0.08,0x7a6e60),limb([0.1,3.0,0],[-1.0,4.8,-0.3],0.13,0.08,0x7a6e60)];
      if(lo)L.push(blob(0,6,0,3.2,2.8,3.2,0x55713a));else{L.push(blob(0,6.6,0,2.4,2.0,2.4,0x5a763d));ring(5,1.8,5.6,1).forEach(q=>L.push(blob(q[0],q[1],q[2],1.6,1.4,1.6,r()<0.5?0x506b36:0x617d44)))}return merge(L)}
  };
  const G={},mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.92,envMapIntensity:0.25,side:THREE.DoubleSide});
  const geo=(k,lo)=>{const key=k+(lo?"_lo":"");return G[key]||(G[key]=B[k](lo))};
  const NAMES={olive:"עץ זית",pine:"אורן ירושלים",cypress:"ברוש",palm:"תמר",fig:"תאנה",carob:"חרוב",shade:"עץ צל",caper:"צלף",hyssop:"אזוב"};
  // plant(parent, species, [[x,y,z,scale,rotY], ...] in scene coordinates, card) -> the mesh. Far away the distance LOD (core/33) swaps in the simple shape.
  function plant(parent,k,list,card){if(!list.length)return null;const m=new THREE.InstancedMesh(geo(k,SMALL),mat,list.length),d=new THREE.Object3D(),c=new THREE.Color();
    list.forEach((t,i)=>{const s=t[3]||1;d.position.set(t[0],t[1]-0.15,t[2]);d.rotation.set(0,t[4]!=null?t[4]:i*2.39,0);d.scale.set(s*(0.92+0.16*((i*7)%5)/4),s,s*(0.92+0.16*((i*3)%5)/4));d.updateMatrix();m.setMatrixAt(i,d.matrix);
      const v=0.9+0.2*((i*13)%7)/6;c.setRGB(v,v,v*(0.95+0.1*((i*5)%3)/2));m.setColorAt(i,c)});
    m.castShadow=true;m.receiveShadow=true;m.userData=Object.assign({farGeo:geo(k,true),lodR:230},card||{n:NAMES[k],r:"💡 צורה כללית של המין",t:NAMES[k]});parent.add(m);return m}
  return {plant,geo,mat,NAMES,kinds:Object.keys(B)};
})();
