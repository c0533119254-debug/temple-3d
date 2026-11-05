// ---- topic 4 (Claude): transport of a city with a Temple. This file belongs to Claude (decided by Shmuel, 5.11.2026). ----
// 📜 three pilgrimage feasts a year (Devarim 16:16). 💡 where the pilgrims' buses stop: next to the start of each pilgrim road.
// The start points are copied from TR.pil in city/22-transport.js (the pilgrim roads already in the model).
{const PILS=[["שער שכם",-714.6,489.0],["שער הפרחים",-252.6,540.5],["העופל",336.6,236.4],["ממילא",-884.1,-161.4],["בריכת השילוח",-9,-835]];
  const OSML=window.OSML||(window.OSML={}),g=new THREE.Group();g.name="osm_drop";WG.add(g);(OSML.drop||(OSML.drop=[])).push(g);
  const cars=ROADS.filter(rd=>rd.c>=1&&rd.c<=3&&rd.w>=6);
  const yAt=(rd,i)=>(isNaN(rd.hs[i])?rd.h[i]:rd.hs[i])+0.15+0.04*rd.c+0.025;
  const near=(x,n)=>{let best=null,bd=60;cars.forEach(rd=>{const p=rd.p;for(let i=0;i<p.length-1;i++){const A=p[i],B=p[i+1],dx=B[0]-A[0],dn=B[1]-A[1],L2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-A[0])*dx+(n-A[1])*dn)/L2)),d=Math.hypot(x-A[0]-dx*t,n-A[1]-dn*t);
    if(d<bd){bd=d;const L=Math.sqrt(L2);best={rd,i,x:A[0]+dx*t,n:A[1]+dn*t,ux:dx/L,un:dn/L,y:yAt(rd,i)*(1-t)+yAt(rd,i+1)*t}}}});return best};
  const yel=new THREE.MeshStandardMaterial({color:0xf2c230,roughness:0.6,emissive:0x221a00,polygonOffset:true,polygonOffsetFactor:-2});
  const sign=(()=>{const cv=document.createElement("canvas");cv.width=512;cv.height=256;const c=cv.getContext("2d");c.fillStyle="#1f56b8";c.fillRect(0,0,512,256);c.fillStyle="#fff";c.textAlign="center";c.direction="rtl";
    c.font="bold 64px Arial";c.fillText("הורדת",256,96);c.fillText("עולי רגל",256,186);return new THREE.CanvasTexture(cv)})();
  const info=nm=>({n:"הורדת עולי רגל: "+nm,r:"דברים טז, טז (שלוש פעמים בשנה); מקום התחנה 💡 הצעה",t:"📜 שלוש פעמים בשנה עולים לרגל. 💡 כאן האוטובוסים של עולי הרגל עוצרים בצד הדרך, ומכאן ממשיכים ברגל בדרך עולי הרגל שבהדמיה עד הר הבית. בשבת וביום טוב אין נסיעה, ולכן התחנה עובדת בערב החג ובחול המועד."});
  // Flower Gate only: the right-hand bay sits on the brown LRT bed (TRN). Slide it along the road normal,
  // the smallest step that clears the bed mesh, and keep the marking on the roadway edge.
  const rc=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),org=new THREE.Vector3();
  const onBed=(x,n)=>{const q=G2S(x,n);org.set(q[0],180,-q[1]);rc.set(org,down);rc.far=500;const hs=rc.intersectObject(TRN.group,true);for(let i=0;i<hs.length;i++){const u=hs[i].object.userData;if(u&&u.n==="מסילת הרכבת הקלה")return true}return false};
  const pullOff=(fn,o)=>{if(!fn(o))return o;let v=o;while(fn(v)&&v>o-8)v-=0.02;return v};
  const DROPS=[];PILS.forEach(([nm,x,nn])=>{const s=near(x,nn);if(!s)return;const half=s.rd.w/2,rx=s.un,rn=-s.ux,ang=Math.atan2(s.un,s.ux);
    let lat=half-1.4,plat=half+1.0;
    if(nm==="שער הפרחים"){
      const paint=(o)=>{for(let a=-9;a<=9;a+=1.5){if(onBed(s.x+rx*o+s.ux*a+rx*1.375,s.n+rn*o+s.un*a+rn*1.375))return true;if(onBed(s.x+rx*o+s.ux*a-rx*1.375,s.n+rn*o+s.un*a-rn*1.375))return true}for(let b=-1.3;b<=1.3;b+=0.65){if(onBed(s.x+rx*o+s.ux*9.075+rx*b,s.n+rn*o+s.un*9.075+rn*b))return true;if(onBed(s.x+rx*o-s.ux*9.075+rx*b,s.n+rn*o-s.un*9.075+rn*b))return true}return false};
      const board=(o)=>{for(let b=-0.62;b<=0.62;b+=0.31)if(onBed(s.x+rx*(o+b),s.n+rn*(o+b)))return true;return false};
      lat=pullOff(paint,lat);plat=pullOff(board,plat)}
    const cx=s.x+rx*lat,cn=s.n+rn*lat;
    // a yellow bay 18 m long and 2.6 m wide on the right side of the road
    [[0,1.3,18,0.15],[0,-1.3,18,0.15],[9,0,0.15,2.6],[-9,0,0.15,2.6]].forEach(([a,b,w,dp])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,0.04,dp),yel);m.position.set(cx+s.ux*a+rx*b,s.y+0.01,-(cn+s.un*a+rn*b));m.rotation.y=ang;g.add(m)});
    const px=s.x+rx*plat,pn=s.n+rn*plat,pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.8,6),new THREE.MeshStandardMaterial({color:0x4a4f55,metalness:0.5,roughness:0.45}));pole.position.set(px,s.y+1.4,-pn);g.add(pole);
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.6,0.05),new THREE.MeshBasicMaterial({map:sign,toneMapped:false}));b.position.set(px,s.y+2.95,-pn);b.rotation.y=ang+Math.PI/2;b.userData=info(nm);g.add(b);PICK.push(b);DROPS.push([nm,Math.round(cx),Math.round(cn),Math.round(ang*100)/100,s.rd.c,s.rd.w])});
  window.__T4DROP=DROPS;
  // its own show/hide button, added to the "שכבות דרך" row without editing index.html
  const box=document.getElementById("osmSeg");if(box){const bt=document.createElement("button");bt.type="button";bt.dataset.k="drop";bt.setAttribute("aria-pressed","true");bt.textContent="הורדת עולי רגל";box.appendChild(bt)}}

// ---- the Dung Gate bus terminal (Claude, #30, 5.11.2026) ----
// 💡 Buses do not enter the gate. They stop at a terminal on the open lot across the road (the Givati lot of today):
// a lane through the lot, a raised stone platform, benches and a sign. Passengers cross on a zebra crossing,
// walk along the pavement under the wall and go in through the gate on foot. The lane and the slots are DUNG in core/00-setup.js.
{const P=DUNG.P,ang=DUNG.ANG,g=new THREE.Group();g.name="dung_terminal";WG.add(g);
  const Y=(x,n)=>surfY(x,n),T=DUNG.top;
  const mk=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.9,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4},o||{}));
  const asph=mk(0x4f5154,{roughness:1,metalness:0,envMapIntensity:0.15}),white=mk(0xf1efe6,{emissive:0x111111}),yel=mk(0xf2c230,{emissive:0x221a00}),stone=M.wall,plat=new THREE.MeshStandardMaterial({color:0xb9ad94,roughness:0.95,envMapIntensity:0.2}),kerb=new THREE.MeshStandardMaterial({color:0x8f877a,roughness:0.9,envMapIntensity:0.2});
  const info={n:"מסוף האוטובוסים של שער האשפות",r:"💡 הצעה. דברים טז, טז (שלוש פעמים בשנה)",t:"💡 האוטובוסים לא נכנסים בשער האשפות. הם עוצרים כאן, במגרש שמול השער, בנתיב משלהם ליד רציף אבן. 📜 שלוש פעמים בשנה עולים לרגל: עולי הרגל יורדים כאן, חוצים במעבר החציה, הולכים על המדרכה שלאורך החומה ונכנסים בשער ברגל. בתוך השער אין כלי רכב."};
  const box=(u0,u1,v0,v1,y0,y1,mat,pick)=>{const m=P((u0+u1)/2,(v0+v1)/2),b=new THREE.Mesh(mat===M.wall?wbox(u1-u0,y1-y0,v1-v0,6):new THREE.BoxGeometry(u1-u0,y1-y0,v1-v0),mat);b.position.set(m[0],(y0+y1)/2,-m[1]);b.rotation.y=ang;b.castShadow=b.receiveShadow=true;b.userData=info;g.add(b);if(pick)PICK.push(b);return b};
  const low=(u0,u1,v0,v1)=>{let m=1e9;for(let a=u0;a<=u1+0.01;a+=(u1-u0)/2)for(let b=v0;b<=v1+0.01;b+=(v1-v0)/3){const p=P(a,b);m=Math.min(m,Y(p[0],p[1]))}return m};
  // a ribbon along (u,v) points, w metres wide, at the terrace height + lift
  const ribbon=(pts,w,lift,mat)=>{const D=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),k=Math.max(1,Math.ceil(L/1.5));for(let j=0;j<k;j++)D.push([a[0]+(b[0]-a[0])*j/k,a[1]+(b[1]-a[1])*j/k])}D.push(pts[pts.length-1]);
    const pos=[],idx=[];D.forEach((q,i)=>{const a=D[Math.max(0,i-1)],b=D[Math.min(D.length-1,i+1)],du=b[0]-a[0],dv=b[1]-a[1],L=Math.hypot(du,dv)||1;[1,-1].forEach(sd=>{const uu=q[0]-dv/L*w/2*sd,p=P(uu,q[1]+du/L*w/2*sd);pos.push(p[0],T(uu)+lift,-p[1])});if(i)idx.push(2*i-2,2*i,2*i-1,2*i-1,2*i,2*i+1)});
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=new THREE.Mesh(geo,mat);m.receiveShadow=true;m.userData=info;g.add(m);return m};
  // the terrace, in 2 m steps along the road, with its stone face down to the slope
  for(let u=-30;u<36;u+=2){const t=Math.min(T(u),T(u+2));box(u,u+2,6,18.2,low(u,u+2,6,18.2)-0.6,t,stone,true)}
  PICK.push(ribbon(DUNG.LANE,3.8,0.03,asph));
  ribbon(DUNG.LANE.filter(q=>q[0]>=-14&&q[0]<=20).map(q=>[q[0],11.35]),0.15,0.05,yel);   // the stop line along the platform
  ribbon(DUNG.LANE.filter(q=>q[0]>=-16&&q[0]<=22).map(q=>[q[0],7.85]),0.12,0.05,white);  // the lane edge on the road side
  // the platform: 20 cm above the terrace, with a kerb on the lane side and stone benches
  for(let u=-28;u<20;u+=4){const t=Math.min(T(u),T(u+4));box(u,u+4,11.6,17.5,t-0.2,t+0.2,plat,true);box(u,u+4,11.6,11.9,t-0.2,t+0.22,kerb);
    if(u%8===0&&u>-24){const bn=box(u+1.1,u+2.9,16,16.5,t+0.2,t+0.65,kerb)}}
  // zebra crossing from the platform over both carriageways to the pavement under the wall
  for(let v=-6.5;v<=5.6;v+=1){const p=P(-27,v),z=new THREE.Mesh(new THREE.BoxGeometry(3,0.04,0.5),white);z.position.set(p[0],Y(p[0],p[1])+0.07,-p[1]);z.rotation.y=ang;g.add(z)}
  // the sign, in the same blue as the pilgrim drop-off signs
  {const cv=document.createElement("canvas");cv.width=512;cv.height=256;const c=cv.getContext("2d");c.fillStyle="#1f56b8";c.fillRect(0,0,512,256);c.fillStyle="#fff";c.textAlign="center";c.direction="rtl";
    c.font="bold 58px Arial";c.fillText("מסוף שער האשפות",256,92);c.font="bold 46px Arial";c.fillText("הורדת עולי רגל",256,180);
    const sp=P(-22,12.4),y=T(-22)+0.2,pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,3.2,6),new THREE.MeshStandardMaterial({color:0x4a4f55,metalness:0.5,roughness:0.45}));pole.position.set(sp[0],y+1.6,-sp[1]);g.add(pole);
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.9,0.06),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),toneMapped:false}));b.position.set(sp[0],y+3.5,-sp[1]);b.rotation.y=ang+Math.PI/2;b.userData=info;g.add(b);PICK.push(b);
    const q=P(0,14),qs=G2S(q[0],q[1]);label("מסוף שער האשפות",qs[0],y+6,-qs[1],null,info)}}
