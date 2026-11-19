// ---- topic 3, area 1: Jaffa Gate and the Citadel (Tower of David) ----
(function(){try{
const GS={wall:[],light:[],dark:[],lead:[],pave:[]};
const LCAP=113.5*0.48-1; // landmarks stay below the top of the Heikhal (smallest amah)
const add=(k,geo,x,y,n,rot,rx)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4();m.makeRotationY(rot||0);if(rx)m.multiply(new THREE.Matrix4().makeRotationX(rx));m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");GS[k].push(geo)};
const lg=(x,n)=>{const a=TY(x,n),b=H(x,n);return Math.min(a,b)};
// local frame helper: point at distance a along dir rot, b to its left (geo)
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const crenel=(x,n,rot,len,top,side,k)=>{ // parapet + merlons along a line, shifted `side` m to the left
  const c=off(x,n,rot,0,side);add(k||"wall",wbox(len,1.1,0.8,6),c[0],top+0.55,c[1],rot);
  const m=Math.max(2,Math.floor(len/2.6));for(let i=0;i<m;i++){const a=-len/2+len*(i+0.5)/m,p=off(x,n,rot,a,side);add(k||"wall",wbox(1.3,1.3,0.8,6),p[0],top+1.1+0.65,p[1],rot)}};
// pointed (Ottoman/Crusader) arch, extruded `dep` m, front face at z=0 pointing +z
const archP=(P,w,h)=>{const r=w/2;P.moveTo(-r,0);P.lineTo(-r,h-w*0.62);P.quadraticCurveTo(-r,h-w*0.08,0,h);P.quadraticCurveTo(r,h-w*0.08,r,h-w*0.62);P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep,hole)=>{const s=archP(new THREE.Shape(),w,h);if(hole){const hp=archP(new THREE.Path(),hole[0],hole[1]);hp.curves.reverse();s.holes.push(archP(new THREE.Path(),hole[0],hole[1]))}const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep);return g};
// put an arch on a face: face centre (x,n), outward normal angle nrot (geo), base y
const archOn=(x,n,nrot,y,w,h,dep,frame,open)=>{const rot=nrot+Math.PI/2;if(!open){const g=archG(w,h,dep);g.translate(0,0,0.12);add("dark",g,x,y,n,rot)}if(frame){const f=archG(w+1.4,h+0.8,0.7,[w,h]);f.translate(0,0,0.4);add("light",f,x,y,n,rot)}};
const tower=(x,n,w,d,h,rot,k,pass)=>{let lo=1e9,hi=-1e9;[[-1,-1],[1,-1],[1,1],[-1,1],[0,0]].forEach(q=>{const p=off(x,n,rot,q[0]*w/2,q[1]*d/2),y=lg(p[0],p[1]);lo=Math.min(lo,y);hi=Math.max(hi,y)});
  const base=lo-2,top=Math.min(hi+h,LCAP-2.4);if(pass)gatePass(add,off,wbox,Object.assign({x,n,rot,w,d,base,hi,top},pass));else add(k||"wall",wbox(w,top-base,d,6),x,(base+top)/2,n,rot);
  {const ph=pass?0:2.2;add(k||"wall",wbox(w+1.6,hi-base+ph,d+1.6,6),x,(base+hi+ph)/2,n,rot)} // battered plinth
  [[0,d/2-0.4,w],[0,-d/2+0.4,w]].forEach(e=>{const p=off(x,n,rot,0,e[1]);crenel(p[0],p[1],rot,e[2],top,0,k)});
  [[w/2-0.4],[-w/2+0.4]].forEach(e=>{const p=off(x,n,rot,e[0],0);crenel(p[0],p[1],rot+Math.PI/2,d-1.6,top,0,k)});
  for(let f=0;f<2;f++)for(let i=-1;i<=1;i+=2){const yy=hi+(top-hi)*(0.4+0.25*f),p=off(x,n,rot,i*w*0.22,0);add("dark",new THREE.BoxGeometry(0.45,1.5,d+0.3),p[0],yy,p[1],rot);const p2=off(x,n,rot,0,i*d*0.22);add("dark",new THREE.BoxGeometry(w+0.3,1.5,0.45),p2[0],yy,p2[1],rot)}
  return{top,base,hi}};
// --- the Citadel: an enclosure with towers around a courtyard (💡 simplified plan after the real walls) ---
const P=[[-731,-173],[-700,-161],[-676,-156],[-662,-168],[-666,-190],[-667,-222],[-678,-242],[-686,-252],[-718,-262],[-733,-258],[-728,-205]];
let cx=0,cn=0;P.forEach(p=>{cx+=p[0]/P.length;cn+=p[1]/P.length});
for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),rot=Math.atan2(b[1]-a[1],b[0]-a[0]);
  let lo=1e9,hi=-1e9;for(let t=0;t<=1.001;t+=0.25){const y=lg(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);lo=Math.min(lo,y);hi=Math.max(hi,y)}
  const mx=(a[0]+b[0])/2,mn=(a[1]+b[1])/2,base=lo-2,top=Math.min(hi+12,LCAP-2.4);
  // which side is outside? left normal = (-sin,cos)
  const lx=-Math.sin(rot),ln=Math.cos(rot),out=((mx-cx)*lx+(mn-cn)*ln)>0?1:-1;
  add("wall",wbox(L+3,top-base,3.2,6),mx,(base+top)/2,mn,rot);
  {const p=off(mx,mn,rot,0,out*1.6);add("wall",wbox(L+3.4,hi-base+3,2.2,6),p[0],(base+hi+3)/2,p[1],rot)} // glacis/plinth outside
  crenel(mx,mn,rot,L+2.4,top,out*1.2);
  {const p=off(mx,mn,rot,0,-out*1.3);add("wall",wbox(L+2,0.7,0.5,6),p[0],top+0.35,p[1],rot)}}
// towers
const ph=tower(-671,-166,20,17,24,0.2);   // Phasael — "Tower of David" of the archaeologists
tower(-727,-179,11,11,15,0.35);tower(-730,-222,9,9,14,1.48);tower(-683,-247,12,10,14,0.9);tower(-664,-205,9,8,14,1.53);
// the Ottoman minaret on the south-west (the tower people call "Tower of David"); no crescent, by request
{const x=-723,n=-252,g=lg(x,n),vm=1,y0=g+12*vm,Z=(geo)=>{geo.scale(1,vm,1);return geo};
  add("wall",Z(wbox(6,4,6,6)),x,y0+2*vm,n,0.3);
  add("light",Z(new THREE.CylinderGeometry(2.0,2.2,13,16)),x,y0+10.5*vm,n,0);
  add("light",Z(new THREE.CylinderGeometry(3.0,2.2,1.0,16)),x,y0+17.5*vm,n,0);
  add("light",Z(new THREE.CylinderGeometry(3.0,3.0,0.9,16,1,true)),x,y0+18.4*vm,n,0);
  add("light",Z(new THREE.CylinderGeometry(1.55,1.7,4.2,16)),x,y0+20.1*vm,n,0);
  add("lead",Z(new THREE.ConeGeometry(1.9,4.2,16)),x,y0+24.3*vm,n,0);
  for(let i=0;i<4;i++){const a=i*Math.PI/2+0.3;add("dark",new THREE.BoxGeometry(0.5,1.6*vm,4.6),x,y0+(9+i*1.6)*vm,n,a)}}
// entrance gatehouse on the east, with a stone bridge over the moat line
{const gx=-660,gn=-192,rot=1.5;const t=tower(gx,gn,10,7,10,rot);archOn(gx+4,gn,0.05,t.hi,3.2,5,5.5,true);
  add("light",wbox(9,0.8,4,4),gx+9,lg(gx+9,gn)+0.4,gn,0.05)}
// courtyard: paving, ruins of earlier walls (💡 suggests the excavations), a low round tower base
{const s=new THREE.Shape();const q=P.map(p=>[cx+(p[0]-cx)*0.9,cn+(p[1]-cn)*0.9]);s.moveTo(q[0][0]-cx,q[0][1]-cn);q.slice(1).forEach(p=>s.lineTo(p[0]-cx,p[1]-cn));
  const g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/4,uv.getY(i)/4);
  let y=-1e9;for(let a=-30;a<=30;a+=5)for(let b=-45;b<=45;b+=5){const x=cx+a,n=cn+b;if(inPoly(x,n,q))y=Math.max(y,TY(x,n),H(x,n))}y+=0.2;add("pave",g,cx,y,cn,0);
  // foundations of older rooms (💡 a hint of the excavations): low walls in room outlines
  [[-706,-200,14,9,0.3],[-694,-224,10,8,0.3],[-712,-232,12,8,0.25]].forEach(r=>{const[x,n,w,d,rt]=r;[[0,d/2,w,0],[0,-d/2,w,0],[w/2,0,d,1],[-w/2,0,d,1]].forEach(e=>{const p=off(x,n,rt,e[0],e[1]);add("light",wbox(e[2],1.2,0.9,4),p[0],y+0.6,p[1],rt+e[3]*Math.PI/2)})});
  add("light",new THREE.CylinderGeometry(5,5.4,1.6,20),-700,y+0.8,-210,0)}
// --- Jaffa Gate: Ottoman gatehouse with the L-shaped passage (📜 built by Suleiman, 1538) ---
{const gx=-743.5,gn=-151.7;let best=[1e9,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],b=WALL_LINE[i],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((gx-a[0])*dx+(gn-a[1])*dn)/l2)),d=Math.hypot(a[0]+dx*t-gx,a[1]+dn*t-gn);if(d<best[0])best=[d,Math.atan2(dn,dx)]}
  const rot=best[1],lx=-Math.sin(rot),ln=Math.cos(rot),out=((gx+380)*lx+(gn-0)*ln)>0?1:-1; // left side faces away from the city centre?
  /* v114: כניסה מכופפת פתוחה — הפתח החיצוני בצד המגדל, מחוץ לקו החומה, והפתח הפנימי אל העיר */
  const sx=Math.sin(rot)>0?1:-1,nOut=sx>0?rot:rot+Math.PI,nIn=rot+(out>0?-Math.PI/2:Math.PI/2),jb=out*2.9;
  const c=off(gx,gn,rot,0,out*2),t=tower(c[0],c[1],16,14,17,rot,null,{ph:7.9,cor:[[sx>0?-2.1:-8,sx>0?8:2.1,jb-2.1,jb+2.1],[-2.1,2.1,out>0?-7:jb-2.1,out>0?jb+2.1:7]],faces:[[sx*8,jb,nOut,4.2,7.5,true],[0,-out*7,nIn,4.2,7.5,true]]});
  const fo=off(c[0],c[1],rot,sx*8,jb);
  archOn(fo[0],fo[1],nOut,t.hi,4.2,7.5,6,true,true);
  const fi=off(c[0],c[1],rot,0,-out*7);archOn(fi[0],fi[1],nIn,t.hi,4.2,7.5,6,true,true);
  // inscription panel and the machicolation box above the outer arch
  const ip=off(fo[0],fo[1],nOut,0.35,0);add("light",new THREE.BoxGeometry(0.4,1.3,4.2),ip[0],Math.min(t.hi+9.2,t.top-4.6),ip[1],nOut);
  const mp=off(fo[0],fo[1],nOut,0.9,0);add("wall",wbox(1.8,2.4,4.6,4),mp[0],Math.min(t.hi+12.4,t.top-1.4),mp[1],nOut);
  for(let i=-1;i<=1;i++){const q=off(mp[0],mp[1],nOut,0,i*1.8);add("wall",wbox(1.4,0.9,0.5,4),q[0],Math.min(t.hi+12.4,t.top-1.4)-1.6,q[1],nOut)}
  window.__JG={x:c[0],n:c[1],rot,out}}
// merge per material and add to the city group
const info={n:"מגדל דוד והמצודה",r:"ליד שער יפו",t:"המצודה שבפינה המערבית של העיר. 📜 המגדל הגדול בצפון־מזרח (\"מגדל פצאל\") נבנה על יסודות מימי הורדוס. 📜 הצריח העות׳מאני בדרום־מערב הוא מה שרוב האנשים מכנים \"מגדל דוד\". בפנים חצר עם שרידי חומות מתקופות שונות. 💡 התוכנית פשוטה, לפי קווי החומות האמיתיים. 💡 הצריח מוצג בלי סמל בראשו."};
const infoG={n:"שער יפו",r:"שערי העיר העתיקה",t:"📜 שער שבנה הסולטן סולימאן בשנת 1538. הכניסה בו עושה פנייה של 90 מעלות (שער \"מכופף\"), כדי להאט תוקפים. מעל הפתח החיצוני יש לוח כתובת ותא הגנה בולט. 💡 מסלול הכניסה של העולים לרגל מהמערב עובר כאן."};
const MAT={wall:M.wall,light:M.stoneL,dark:M.dark,lead:new THREE.MeshStandardMaterial({color:0x7c838a,metalness:0.5,roughness:0.5}),pave:M.pave};
Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=k!=="pave";m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
// the gate parts get their own info: a separate pick box around the gatehouse
if(window.__JG){const J=window.__JG,b=new THREE.Mesh(new THREE.BoxGeometry(17,20,15),new THREE.MeshBasicMaterial({visible:false}));const c=J;b.position.set(c.x,lg(c.x,c.n)+9,-c.n);b.rotation.y=J.rot;b.userData=infoG;WG.add(b);PICK.push(b)}
}catch(e){console.warn("area1",e)}})();

// ---- topic 3, area 2: the covered markets (three parallel souqs + the roofed part of David Street) ----
(function(){try{
const GS={stone:[],vault:[],dark:[],pave:[],g0:[],g1:[],g2:[],g3:[]};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");GS[k].push(geo)};
const gy=(x,n)=>Math.min(TY(x,n),H(x,n)+0.5);
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const archP=(P,w,h)=>{const r=w/2;P.moveTo(-r,0);P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true);P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep)=>{const g=new THREE.ExtrudeGeometry(archP(new THREE.Shape(),w,h),{depth:dep,bevelEnabled:false,curveSegments:5});g.translate(0,0,-dep);return g};
const rnd=rng(4242);
// one covered lane along a polyline. lw = lane width, sd = shop-row depth (0 = thin frontage wall), hs = vault springing height
function lane(pl,lw,sd,hs,opt){opt=opt||{};const r=lw/2,STEP=3.2;let k=0;
  for(let i=1;i<pl.length;i++){const a=pl[i-1],b=pl[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),rot=Math.atan2(b[1]-a[1],b[0]-a[0]),ns=Math.max(1,Math.round(L/STEP)),st=L/ns;
    for(let j=0;j<ns;j++,k++){const t=(j+0.5)/ns,x=a[0]+(b[0]-a[0])*t,n=a[1]+(b[1]-a[1])*t,y=gy(x,n);
      add("pave",wbox(st+0.02,0.4,lw+0.2,2),x,y-0.05,n,rot);
      const top=hs+r+0.5,wd=sd>0?sd:0.7;
      [1,-1].forEach(s=>{const c=off(x,n,rot,0,s*(r+wd/2));add("stone",wbox(st+0.03,top+1.5,wd,4),c[0],y+top/2-0.75,c[1],rot);
        // a shop: arched opening with goods on a low table in front (💡)
        if(k%2===0||opt.dense){const f=off(x,n,rot,0,s*r);add("dark",archG(2.3,3.1,1.3).translate(0,0,0.12),f[0],y,f[1],rot+(s>0?0:Math.PI));
          if(rnd()<0.8){const gk="g"+Math.floor(rnd()*4),q=off(x,n,rot,0,s*(r-0.35));add(gk,new THREE.BoxGeometry(1.4,0.35+rnd()*0.35,0.5),q[0],y+0.45,q[1],rot)}}});
      // barrel vault, with a light shaft every fourth bay (📜 the souqs are lit from openings in the roof)
      if(k%4!==2){const v=new THREE.CylinderGeometry(r,r,st+0.04,12,1,true,0,Math.PI);v.rotateZ(Math.PI/2);add("vault",v,x,y+hs,n,rot);
        const sk=new THREE.CylinderGeometry(r+0.45,r+0.45,st+0.04,12,1,true,0,Math.PI);sk.rotateZ(Math.PI/2);add("stone",sk,x,y+hs,n,rot)}
      if(k%2===0){const rb=new THREE.TorusGeometry(r-0.05,0.18,5,12,Math.PI);rb.rotateY(Math.PI/2);add("stone",rb,x,y+hs,n,rot)}}}}
// 📜 three parallel markets from the Crusader period (12th century), on the line of the Roman Cardo. West to east:
lane([[-429.5,-134],[-430,-42],[-432,17]],3.6,5.4,3.9);
lane([[-411.5,-130],[-411.5,-43]],3.6,5.4,3.9);
lane([[-393,-128],[-393,-43]],3.6,5.4,3.9);
// fill what the old blocks covered outside the lanes
add("stone",wbox(37,9,23,4),-455.5,gy(-455.5,-123.5)+3.5,-123.5,0);
add("stone",wbox(12,8.5,62,4),-378,gy(-378,-95)+3.2,-95,0);
// David Street: the roofed eastern part, between the shops (thin frontage on both sides)
lane([[-566,-153],[-538,-152],[-530,-155],[-513,-162],[-506,-164],[-484,-169],[-475,-169],[-466,-168],[-457,-164],[-442,-163],[-436,-161]],3.6,0,3.6,{dense:true});
const sM=M.stoneL,vM=sM.clone();vM.side=THREE.DoubleSide;
const gm=c=>new THREE.MeshStandardMaterial({color:c,roughness:0.85});
const MAT={stone:sM,vault:vM,dark:M.dark,pave:M.pave,g0:gm(0x7a2a12),g1:gm(0x9a6614),g2:gm(0x44521c),g3:gm(0x24395a)};
const NAMES=[["שוק הקצבים",-429.5,-88],["שוק הבשמים",-411.5,-88],["שוק הצורפים",-393,-88]];
const info={n:"השווקים המקורים",r:"בין רחוב דוד לרחוב השלשלת וחאן א־זית",t:"📜 שלושה שווקים מקבילים ומקורים, מימי הצלבנים (המאה ה־12), על הקו של הקרדו הרומי. ממערב למזרח: שוק הקצבים (אל־לחאמין), שוק הבשמים (אל־עטארין) ושוק הצורפים (אל־ח׳וואג׳את). 📜 התקרה היא קמרון אבן עם פתחי אור. 💡 החנויות והסחורה מצוירות בפשטות. גם החלק המזרחי של רחוב דוד מקורה."};
Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=k==="stone"||k==="vault";m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
window.__SOUQN=NAMES;
}catch(e){console.warn("area2",e)}})();

// ---- topic 3, area 3: the Church of the Holy Sepulchre and the Muristan (no religious symbols, by request) ----
(function(){try{
const GS={stone:[],light:[],dark:[],lead:[],pave:[],white:[],water:[]};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");GS[k].push(geo)};
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const archP=(P,w,h)=>{const r=w/2;P.moveTo(-r,0);P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true);P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep)=>{const g=new THREE.ExtrudeGeometry(archP(new THREE.Shape(),w,h),{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep);return g};
// arch on a face whose outward normal has geo angle a (three rotY = a+PI/2)
const archOn=(k,x,n,a,y,w,h,dep,pro)=>add(k,archG(w,h,dep).translate(0,0,pro==null?0.12:pro),x,y,n,a+Math.PI/2);
const ext=(pts,h)=>{const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>s.lineTo(p[0],p[1]));const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/5,uv.getY(i)/5);return g};
const ring=(k,x,n,y,r,h,seg)=>add(k,new THREE.CylinderGeometry(r,r,h,seg||24),x,y+h/2,n,0);
const dome=(k,x,n,y,r,sy)=>{const g=new THREE.SphereGeometry(r,28,12,0,Math.PI*2,0,Math.PI/2);g.scale(1,sy||1,1);add(k,g,x,y,n,0)};
const slits=(x,n,y,r,cnt,h)=>{for(let i=0;i<cnt;i++){const a=i*Math.PI*2/cnt,p=[x+Math.cos(a)*(r-0.25),n+Math.sin(a)*(r-0.25)];archOn("dark",p[0],p[1],a,y,1.1,h,0.6,0.3)}};
const floorAt=(pts)=>{let y=-1e9;let x0=1e9,x1=-1e9,n0=1e9,n1=-1e9;pts.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);n0=Math.min(n0,p[1]);n1=Math.max(n1,p[1])});for(let x=x0;x<=x1;x+=3)for(let n=n0;n<=n1;n+=3)if(inPoly(x,n,pts))y=Math.max(y,H(x,n),TY(x,n));return y};
// ===== Church of the Holy Sepulchre =====
const SP=[[-540.7,29.6],[-540.8,31.3],[-539.9,32.2],[-525.3,33.4],[-524.0,32.7],[-523.8,30.3],[-504.0,32.9],[-505.8,45.8],[-499.7,46.7],[-497.7,45.5],[-499.0,62.8],[-494.5,64.0],[-496.0,75.1],[-491.0,75.6],[-491.8,82.8],[-500.4,82.0],[-500.3,81.0],[-515.7,79.4],[-515.2,75.1],[-517.3,74.8],[-517.8,79.3],[-545.4,73.2],[-545.8,75.7],[-563.6,74.0],[-563.4,71.5],[-570.8,70.7],[-568.5,47.6],[-578.3,46.6],[-576.9,27.8],[-574.0,28.0],[-574.1,28.9],[-564.8,29.6],[-564.7,27.8]];
let lo=1e9;SP.forEach(p=>lo=Math.min(lo,H(p[0],p[1]),TY(p[0],p[1])));
const gtop=floorAt(SP);
// keep everything under the height cap (no building may come within 12 m of the top of the Heikhal)
const LCAP=113.5*0.48-1,gpv=Math.max(H(-533,18),TY(-533,18)),want=31,vs=Math.max(0.3,Math.min(1,(LCAP-gpv)/want)),Y=v=>gpv+v*vs;
{const g=ext(SP,Y(13)-(lo-2));add("stone",g,0,lo-2,0,0)}
// the rotunda (Anastasis) over the tomb: a drum and a wide lead dome with an open oculus
ring("stone",-556,56,Y(13)-0.2,12.5,(Y(19)-Y(13))+0.2,32);slits(-556,56,Y(14),12.5,12,3.2*vs);
{const g=new THREE.SphereGeometry(11.8,32,12,0,Math.PI*2,0,Math.PI*0.43);g.scale(1,0.9*vs,1);add("lead",g,-556,Y(19),56,0)}
ring("light",-556,56,Y(19)+11.8*0.9*vs*0.97,2.6,1.4*vs,16);
// the Katholikon dome, with windows in its drum
ring("stone",-531,57,Y(13)-0.2,6,(Y(20)-Y(13))+0.2,24);slits(-531,57,Y(15),6,8,3*vs);dome("lead",-531,57,Y(20),5.8,0.95*vs);
// small domes: the Chapel of the Franks next to the door, and the Ethiopian monastery roof to the east
add("stone",wbox(6,(Y(10)-lo)+2,5,4),-521,(lo-2+Y(10))/2,36,0.24);dome("light",-521,36,Y(10),2.2,1);
[[-505,40,2.4],[-509,52,2],[-503,60,1.8],[-512,66,2.2]].forEach(d=>{ring("light",d[0],d[1],Y(13),d[2]+0.2,0.8,16);dome("white",d[0],d[1],Y(13)+0.8,d[2],1)});
// the south facade on the courtyard: two great arched doors (the right one walled up since 1187) and two windows above
{const rot=0.24,c=[-532.5,31.0],na=rot-Math.PI/2;const f=off(c[0],c[1],rot,0,-0.9);add("stone",wbox(18,(Y(15)-lo)+2,1.8,4),f[0],(lo-2+Y(15))/2,f[1],rot);
  const ff=off(c[0],c[1],rot,0,-1.8);add("light",wbox(18.6,0.7,0.6,4),ff[0],Y(15)+0.35,ff[1],rot);add("light",wbox(18.6,0.5,0.5,4),ff[0],Y(8.2),ff[1],rot);
  [[-3.9,1],[3.9,0]].forEach(d=>{const p=off(c[0],c[1],rot,d[0],-1.8);archOn("light",p[0],p[1],na,gpv-0.2,4.6,7.6*vs+0.6,0.5,0.35);archOn(d[1]?"dark":"stone",p[0],p[1],na,gpv,3.4,7.2*vs,1.5,0.45);
    archOn("light",p[0],p[1],na,Y(9),3.8,5*vs+0.5,0.5,0.35);archOn("dark",p[0],p[1],na,Y(9.2),2.8,4.6*vs,1.5,0.45)});
  // the parvis (courtyard) in front
  const PV=[[-545,8],[-522,8],[-522,29.5],[-545,28.6]],py=floorAt(PV)+0.15,s=new THREE.Shape();s.moveTo(PV[0][0],PV[0][1]);PV.slice(1).forEach(p=>s.lineTo(p[0],p[1]));const g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/4,uv.getY(i)/4);add("pave",g,0,py,0,0)}
// the bell tower west of the door, today cut short (📜 its top storey fell in 1545)
{const x=-547,n=34,top=Y(27),b=lo-2;add("stone",wbox(8.5,top-b,8.5,4),x,(top+b)/2,n,0.08);
  [[0,4.3,Math.PI/2],[0,-4.3,-Math.PI/2],[4.3,0,0],[-4.3,0,Math.PI]].forEach(f=>{const p=off(x,n,0.08,f[0],f[1]);[Y(16),Y(21.5)].forEach(yy=>archOn("dark",p[0],p[1],f[2]+0.08,yy,2.2,3.6*vs,1.2,0.25))});
  add("light",wbox(9.3,0.6,9.3,4),x,top+0.3,n,0.08)}
const infoS={n:"כנסיית הקבר",r:"הרובע הנוצרי",t:"📜 הכנסייה החשובה לנצרות, במקום שבו לפי המסורת שלהם נצלב ונקבר ישו. 📜 הכיפה הגדולה במערב (הרוטונדה) עומדת מעל הקבר, והכיפה הקטנה (הקתוליקון) מעל המקהלה. בחזית הדרומית שתי דלתות ענק, והימנית נאטמה בשנת 1187. 📜 ליד הדלת עומד מגדל פעמונים קטוע. 💡 הצורה פשוטה, לפי קווי הבניין האמיתיים, ובלי סמלים דתיים."+(vs<1?" 💡 הגובה הונמך מעט, כדי שלא יתקרב לגובה ההיכל.":"")};
// ===== Lutheran Church of the Redeemer =====
const RP=[[-459.0,0.2],[-468.5,0.0],[-468.5,-2.2],[-476.9,-2.2],[-477.0,-16.4],[-477.6,-16.4],[-477.6,-25.6],[-467.0,-25.7],[-467.0,-24.3],[-452.8,-24.3],[-452.8,-23.5],[-443.1,-23.6],[-443.1,-22.1],[-442.2,-22.2],[-441.1,-21.3],[-440.5,-19.6],[-441.4,-16.8],[-439.6,-16.5],[-438.3,-15.6],[-437.1,-13.5],[-436.9,-11.9],[-438.3,-9.1],[-439.6,-8.2],[-441.4,-7.7],[-441.0,-4.6],[-441.7,-3.2],[-443.0,-2.2],[-443.0,-0.9],[-452.9,-0.9],[-452.9,-1.9],[-459.0,-1.8]];
const infoR={n:"כנסיית הגואל הלותרנית",r:"מוריסטן",t:"📜 כנסייה מ־1898, על יסודות כנסייה צלבנית. מגדל הפעמונים הלבן שלה הוא אחד הגבוהים בעיר העתיקה. 💡 המגדל נמוך כאן מהמציאות (כ־50 מ׳), כדי שלא יעבור את גובה ההיכל."};
const GR={stone:[],light:[],dark:[],white:[]},addR=(k,geo,x,y,n,rot)=>{const o=GS[k];GS[k]=GR[k];add(k,geo,x,y,n,rot);GS[k]=o};
{let l2=1e9;RP.forEach(p=>l2=Math.min(l2,H(p[0],p[1]),TY(p[0],p[1])));const g0=floorAt(RP);
  addR("stone",ext(RP,g0+14-(l2-2)),0,l2-2,0,0);
  // pitched roof over the nave and a half dome over the apse
  {const s=new THREE.Shape();s.moveTo(-14,0);s.lineTo(14,0);s.lineTo(0,5);s.lineTo(-14,0);const g=new THREE.ExtrudeGeometry(s,{depth:30,bevelEnabled:false});g.translate(0,0,-15);g.rotateY(Math.PI/2);addR("light",g,-458,g0+14,-12.5,0)}
  const tx=-471,tn=-6,tb=l2-2,th=Math.min(g0+44,LCAP-5);
  addR("white",wbox(8,th-tb,8,4),tx,(th+tb)/2,tn,0);
  [[0,4,Math.PI/2],[0,-4,-Math.PI/2],[4,0,0],[-4,0,Math.PI]].forEach(f=>{const p=off(tx,tn,0,f[0],f[1]);archOn("dark",p[0],p[1],f[2],th-7,1.6,4.2,1.2,0.25);archOn("dark",p[0],p[1],f[2],th-16,1.1,2.6,1.2,0.25)});
  addR("light",wbox(8.8,0.8,8.8,4),tx,th+0.4,tn,0);addR("light",new THREE.CylinderGeometry(0.1,3.4,4.2,8),tx,th+0.8+2.1,tn,0)}
// ===== the Muristan fountain (Souq Aftimos), at the meeting of the lanes =====
{const x=-518,n=-60,y=Math.max(H(x,n),TY(x,n));const oct=new THREE.CylinderGeometry(3.6,3.8,0.8,8);add("light",oct,x,y+0.4,n,0);
  add("water",new THREE.CylinderGeometry(3.3,3.3,0.1,8),x,y+0.72,n,0);
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;add("light",new THREE.CylinderGeometry(0.22,0.25,4.2,8),x+Math.cos(a)*1.4,y+0.8+2.1,n+Math.sin(a)*1.4,0)}
  add("light",new THREE.CylinderGeometry(1.9,1.9,0.6,12),x,y+5.3,n,0);dome("light",x,n,y+5.6,1.7,1.1);add("light",new THREE.CylinderGeometry(0.4,0.5,1.4,8),x,y+1.5,n,0)}
const infoM={n:"המוריסטן",r:"הרובע הנוצרי",t:"📜 שוק אפתימוס, במקום בית החולים של הצלבנים (\"מוריסטן\" בפרסית: בית חולים). במרכז השוק מזרקה עות׳מאנית, ומסביבה רחובות קטנים בצורת כוכב. 💡 המזרקה מצוירת בפשטות."};
const MAT={stone:M.stoneL,light:M.stone||M.stoneL,dark:M.dark,lead:new THREE.MeshStandardMaterial({color:0x8d949b,metalness:0.45,roughness:0.45}),pave:M.pave,white:new THREE.MeshStandardMaterial({color:0xece6d8,roughness:0.7}),water:new THREE.MeshStandardMaterial({color:0x5d8aa0,roughness:0.15,metalness:0.2})};
const put=(G,info)=>Object.keys(G).forEach(k=>{if(!G[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(G[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=k!=="pave"&&k!=="water";m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
const fountain={light:[],water:[]};["light","water"].forEach(k=>{fountain[k]=GS[k].splice(GS[k].length-(k==="water"?1:8))});
put(GS,infoS);put(GR,infoR);put(fountain,infoM);
}catch(e){console.warn("area3",e)}})();

// ---- topic 3, area 4: the Jewish Quarter (Hurva, Ramban, Tiferet Yisrael finished, the Cardo) ----
(function(){try{
const LCAP=113.5*0.48-1;
const GS={};const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");const T=cur?cur.GS:GS;(T[k]=T[k]||[]).push(geo)};let cur=null;
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const archP=(P,w,h)=>{const r=w/2;P.moveTo(-r,0);P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true);P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep,hole)=>{const s=archP(new THREE.Shape(),w,h);if(hole)s.holes.push(archP(new THREE.Path(),hole[0],hole[1]));const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep);return g};
const archOn=(k,x,n,a,y,w,h,dep,pro,hole)=>add(k,archG(w,h,dep,hole).translate(0,0,pro==null?0.12:pro),x,y,n,a+Math.PI/2);
const cyl=(k,x,n,y,r,h,seg,r2)=>add(k,new THREE.CylinderGeometry(r2==null?r:r2,r,h,seg||20),x,y+h/2,n,0);
const dome=(k,x,n,y,r,sy)=>{const g=new THREE.SphereGeometry(r,28,12,0,Math.PI*2,0,Math.PI/2);g.scale(1,sy||1,1);add(k,g,x,y,n,0)};
const slits=(x,n,y,r,cnt,w,h)=>{for(let i=0;i<cnt;i++){const a=i*Math.PI*2/cnt+0.13,p=[x+Math.cos(a)*(r-0.3),n+Math.sin(a)*(r-0.3)];archOn("dark",p[0],p[1],a,y,w,h,0.7,0.35)}};
const G=(x,n)=>Math.max(H(x,n),TY(x,n)),lowAt=(pts)=>{let y=1e9;pts.forEach(p=>y=Math.min(y,H(p[0],p[1]),TY(p[0],p[1])));return y};
const faceWin=(cx,cn,rot,w,d,y,fn)=>[[0,d/2,Math.PI/2],[0,-d/2,-Math.PI/2],[w/2,0,0],[-w/2,0,Math.PI]].forEach(f=>{const p=off(cx,cn,rot,f[0],f[1]);fn(p,f[2]+rot,(f[0]===0?w:d))});
const INFO={};const put=(k,info)=>{(INFO[info.n]=INFO[info.n]||{info,keys:{}});};
// ===== the Hurva synagogue (📜 rebuilt in 2010 after the 1864 building) =====
const groups=[];const begin=info=>{cur={info,GS:{}};groups.push(cur)};

const A=add;
begin({n:"בית הכנסת החורבה",r:"הרובע היהודי",t:"📜 בית הכנסת של תלמידי הגר״א, שנבנה בשנת 1864, נהרס ב־1948 ונבנה מחדש ב־2010. 📜 בניין מרובע עם ארבע קשתות גדולות, צריחונים בפינות, ותוף גבוה עם חלונות ועליו כיפה. 💡 הצורה פשוטה, ובגובה שמתחת להיכל."});
{const x=-388,n=-299,rot=-0.059,w=23,d=24,lo=lowAt([[-400,-285],[-375,-286],[-377,-313],[-401,-312]])-2,g=G(x,n),vs=Math.min(1,(LCAP-g)/26.5),Y=v=>g+v*vs;
  A("stone",wbox(w,Y(13)-lo,d,4),x,(lo+Y(13))/2,n,rot);A("light",wbox(w+0.8,0.7,d+0.8,4),x,Y(13)+0.35,n,rot);
  faceWin(x,n,rot,w,d,0,(p,a,fw)=>{archOn("light",p[0],p[1],a,Y(1.5),10,Y(12)-Y(1.5),0.6,0.4,[8.4,Y(11.4)-Y(1.5)]);[-2.6,0,2.6].forEach(o=>{const q=off(p[0],p[1],a-Math.PI/2,o,0);archOn("dark",q[0],q[1],a,Y(o===0?6.2:5),1.4,(o===0?4.2:3.6)*vs,0.8,0.25)});const q=off(p[0],p[1],a-Math.PI/2,0,0);archOn("dark",q[0],q[1],a,g,2.2,3.4,0.8,0.25)});
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(c=>{const p=off(x,n,rot,c[0]*(w/2-1.4),c[1]*(d/2-1.4));A("stone",wbox(3.6,Y(16.5)-Y(12),3.6,4),p[0],(Y(12)+Y(16.5))/2,p[1],rot);dome("white",p[0],p[1],Y(16.5),1.8,1)});
  cyl("stone",x,n,Y(13),7.3,Y(19)-Y(13),28);slits(x,n,Y(14.2),7.3,12,1.3,3.4*vs);A("light",new THREE.CylinderGeometry(7.7,7.7,0.6,28),x,Y(19)+0.3,n,0);
  dome("white",x,n,Y(19.6),7.1,1.0*vs);cyl("light",x,n,Y(19.6)+7.1*vs,1.1,1.3,12)}
// ===== the Ramban synagogue next to it (📜 1267, the oldest in the city; mostly below street level) =====
begin({n:"בית הכנסת הרמב״ן",r:"הרובע היהודי",t:"📜 בית הכנסת שייסד הרמב״ן כשהגיע לירושלים בשנת 1267. רובו נמוך מגובה הרחוב, ונכנסים אליו במדרגות. 💡 מוצג כמבנה נמוך עם פתח מקושת."});
{const x=-399,n=-318,rot=1.45,g=G(x,n),lo=lowAt([[-404,-326],[-397,-326],[-394,-311],[-401,-310]])-2;A("stone",wbox(15,g+4.5-lo,7.4,4),x,(lo+g+4.5)/2,n,rot);A("light",wbox(15.6,0.5,8,4),x,g+4.75,n,rot);
  const p=off(x,n,rot,0,-3.7);archOn("dark",p[0],p[1],rot-Math.PI/2,g,1.8,2.8,0.8,0.25)}
// ===== the minaret by the Ramban (Sidna Omar) — the form only, no symbol on top, by request =====
begin({n:"הצריח שליד הרמב״ן",r:"הרובע היהודי",t:"📜 צריח מהמאה ה־15, צמוד לבית הכנסת הרמב״ן. 💡 מוצג בלי סמל בראשו."});
{const x=-389,n=-321,g=G(x,n),hh=Math.min(21,LCAP-g-3),s=hh/21;A("stone",wbox(3.8,hh*0.72,3.8,4),x,g+hh*0.36,n,-0.06);A("light",wbox(4.8,0.5,4.8,4),x,g+hh*0.72+0.25,n,-0.06);
  A("stone",new THREE.CylinderGeometry(1.5,1.7,hh*0.2,8),x,g+hh*0.82+0.25,n,0);dome("lead",x,n,g+hh*0.92+0.25,1.6,1.2);
  [0,1,2,3].forEach(i=>{const a=i*Math.PI/2-0.06,p=[x+Math.cos(a)*1.9,n+Math.sin(a)*1.9];archOn("dark",p[0],p[1],a,g+hh*0.55,0.9,1.8*s+0.4,0.6,0.25)})}
// ===== Tiferet Yisrael, shown finished (💡 by Vered's choice) =====
begin({n:"בית הכנסת תפארת ישראל",r:"הרובע היהודי",t:"📜 בית הכנסת של החסידים, שנחנך בשנת 1872 ונהרס ב־1948. 💡 כאן הוא מוצג גמור, כפי שביקשת: בניין מרובע עם תוף מתומן וכיפה."});
{const x=-198.5,n=-259,rot=0.13,w=19,d=21,lo=lowAt([[-187,-271],[-190,-246],[-210,-249],[-208,-265]])-2,g=G(x,n),vs=Math.min(1,(LCAP-g)/27),Y=v=>g+v*vs;
  A("stone",wbox(w,Y(15)-lo,d,4),x,(lo+Y(15))/2,n,rot);A("light",wbox(w+0.8,0.6,d+0.8,4),x,Y(15)+0.3,n,rot);A("light",wbox(w+0.5,0.4,d+0.5,4),x,Y(7.5),n,rot);
  faceWin(x,n,rot,w,d,0,(p,a,fw)=>{[-5,0,5].forEach(o=>{const q=off(p[0],p[1],a-Math.PI/2,o,0);archOn("dark",q[0],q[1],a,Y(9),1.6,4*vs,0.8,0.25);archOn("dark",q[0],q[1],a,o===0?g:Y(2),o===0?2.4:1.4,(o===0?4:3.4)*vs,0.8,0.25)})});
  const oc=new THREE.CylinderGeometry(6.6,6.6,Y(21)-Y(15),8);oc.rotateY(Math.PI/8);A("stone",oc,x,(Y(15)+Y(21))/2,n,0);slits(x,n,Y(16.2),6.4,8,1.4,3.4*vs);
  dome("lead",x,n,Y(21),6.1,1.0*vs);cyl("light",x,n,Y(21)+6.1*vs,0.9,1.4,10)}
// ===== the Cardo =====
/* 126.1 (בדיקה חוזרת 35): הקרדו נבנה בפועל במפלס החפירה: בור מרוצף כ־3 מ׳ מתחת לרחוב הנמוך שלידו, קירות תמך, מעקה מסביב,
   וגרם מדרגות מהרחוב בצד הצפוני. העמודים עומדים על רצפת הקרדו. הרחוב שמעל "נפתח" בעזרת מסכת עומק (cardoMask): החלקים של הבור מצוירים קודם,
   והמסכה (בלי צבע) מסתירה את פני הרחוב שמעליהם. ההולך יורד במדרגות (cardoY בתוך groundAt), והקצוות חוסמים לפי חוק הצוק */
{const C=cardoGeom();const inf={n:"הקרדו",r:"הרובע היהודי",t:"📜 הרחוב הראשי של ירושלים הביזנטית (המאה ה־6), ברוחב של כ־22 מ׳, עם עמודים משני הצדדים. 📜 חלק ממנו נחשף ברובע היהודי, כמה מטרים מתחת לרחוב של היום. בהדמיה: ⚖️ החפירה נמוכה בכ־3 מ׳ מהרחוב הנמוך שלידה, עם קירות תמך ומעקה מסביב, ויורדים אליה במדרגות מהצד הצפוני. 💡 העומק, מקום המדרגות ומספר העמודים בהערכה, לפי תמונות המקום."};
  const P=(u,v)=>[C.cx+u*C.ux+v*C.vx,C.cn+u*C.un+v*C.vn],rot=-Math.atan2(C.vx,C.vn),GS={pave:[],wall:[],light:[],iron:[]};
  const put=(k,geo,u,v,y)=>{geo=geo.index?geo.toNonIndexed():geo;if(geo.attributes.uv2)geo.deleteAttribute("uv2");const q=P(u,v),m=new THREE.Matrix4().makeRotationY(rot);m.setPosition(q[0],y,-q[1]);geo.applyMatrix4(m);GS[k].push(geo)};
  const fl=C.floor,hw=C.hw,hl=C.hl;
  put("pave",wbox(2*hw,0.3,2*hl,3),0,0,fl-0.15);
  // retaining walls up to the street, a stone coping and an iron railing (open at the top of the stairs)
  const edge=(u0,v0,u1,v1,open)=>{const L=Math.hypot(u1-u0,v1-v0),n=Math.max(1,Math.ceil(L/2));for(let k=0;k<n;k++){const a=k/n,b=(k+1)/n,uu=u0+(u1-u0)*(a+b)/2,vv=v0+(v1-v0)*(a+b)/2,q=P(uu,vv),top=C.top(q[0],q[1]),len=L/n+0.02,horiz=Math.abs(v1-v0)<1e-6;
      const W=(w,h,d)=>horiz?wbox(len,h,d,3):wbox(d,h,len,3);put("wall",W(0,top-fl+0.25,0.7),uu,vv,(top+fl)/2+0.12);put("light",W(0,0.18,0.9),uu,vv,top+0.34);
      if(!(open&&open(uu,vv))){put("iron",W(0,0.06,0.06),uu,vv,top+1.15);put("iron",W(0,0.04,0.04),uu,vv,top+0.75);put("iron",new THREE.CylinderGeometry(0.03,0.03,0.75,6),uu,vv,top+0.8)}}};
  const stairOpen=(u,v)=>Math.abs(u-C.su)<C.stw+0.3&&v>hl-0.5;
  edge(-hw,-hl,hw,-hl);edge(-hw,hl,hw,hl,stairOpen);edge(-hw,-hl,-hw,hl);edge(hw,-hl,hw,hl);
  // the stairs: risers of about 17 cm, from the street at the north edge down to the floor, with low side walls
  {const n=Math.ceil((C.stTop-fl)/0.17),rise=(C.stTop-fl)/n,run=C.run/n;for(let k=0;k<n;k++){const v=hl-run*(k+0.5),y=C.stTop-rise*(k+1);put("light",wbox(2*C.stw,y-fl+rise,run+0.02,3),C.su,v,(y+rise+fl)/2)}
    [-1,1].forEach(sd=>{for(let k=0;k<n;k+=2){const v=hl-run*(k+1),y=C.stTop-rise*(k+1)+1;put("wall",wbox(0.4,y-fl,run*2+0.02,3),C.su+sd*(C.stw+0.2),v,(y+fl)/2)}})}
  // the two colonnades on the Cardo floor
  [-7.5,7.5].forEach(u=>{for(let v=-hl+2;v<=hl-(Math.abs(u-C.su)<C.stw+1?C.run:1);v+=3.6){put("light",wbox(0.9,0.5,0.9,2),u,v,fl+0.25);put("light",new THREE.CylinderGeometry(0.32,0.36,4.2,12),u,v,fl+0.5+2.1);put("light",wbox(0.95,0.45,0.95,2),u,v,fl+4.9)}
    put("light",wbox(0.9,0.7,2*hl-2,3),u,0,fl+5.47)});
  const MATS={pave:M.pave||M.stoneL,wall:M.stone||M.stoneL,light:M.stoneL,iron:M.iron||new THREE.MeshStandardMaterial({color:0x2b2b2b,metalness:0.6,roughness:0.5})};
  Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MATS[k]);m.renderOrder=-2;m.castShadow=k!=="pave";m.receiveShadow=true;m.userData=inf;WG.add(m);PICK.push(m)});
  // the depth mask over the opening: a grid that follows the street just above it, drawn after the pit and before everything else
  {const nu=Math.ceil(2*hw/1.5),nv=Math.ceil(2*hl/1.5),pos=[],idx=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const u=-hw+0.35+(2*hw-0.7)*i/nu,v=-hl+0.35+(2*hl-0.7)*j/nv,q=P(u,v);pos.push(q[0],C.top(q[0],q[1])+0.32,-q[1])}
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;idx.push(a,c,b,b,c,d)}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);
    const mk=new THREE.Mesh(g,new THREE.MeshBasicMaterial({colorWrite:false,side:THREE.DoubleSide}));mk.renderOrder=-1;mk.name="cardoMask";mk.frustumCulled=false;WG.add(mk)}
}
// ===== the Sephardi synagogues: small domes on their roofs (📜 the four are built low, under the street) =====
begin({n:"ארבעת בתי הכנסת הספרדיים",r:"הרובע היהודי",t:"📜 ארבעה בתי כנסת צמודים של הקהילה הספרדית, מהמאה ה־16 וה־17. הם נבנו נמוך, כדי לא להיות גבוהים מהמסגדים, כפי שדרש החוק אז. 💡 מעליהם מוצגות כיפות קטנות."});
[[-339,-336],[-333,-344],[-345,-344],[-327,-336]].forEach(d=>{const t=bldTop(d[0],d[1]),y=t>-1e3?t:G(d[0],d[1])+6;cyl("stone",d[0],d[1],y-0.3,2.4,1.1,16);dome("white",d[0],d[1],y+0.8,2.3,0.9)});
const MAT={stone:M.stoneL,light:M.stone||M.stoneL,dark:M.dark,white:new THREE.MeshStandardMaterial({color:0xebe5d6,roughness:0.65}),lead:new THREE.MeshStandardMaterial({color:0x8d949b,metalness:0.45,roughness:0.45})};
groups.forEach(G=>Object.keys(G.GS).forEach(k=>{if(!G.GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(G.GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=true;m.receiveShadow=true;m.userData=G.info;WG.add(m);PICK.push(m)}));
}catch(e){console.warn("area4",e)}})();

// ---- topic 3, area 5: Zion Gate, the Armenian Quarter, Mount Zion (no religious symbols, by request) ----
(function(){try{
const LCAP=113.5*0.48-1;let cur=null;const groups=[],GS={};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");const T=cur?cur.GS:GS;(T[k]=T[k]||[]).push(geo)};
const begin=info=>{cur={info,GS:{}};groups.push(cur)};
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const G=(x,n)=>Math.max(H(x,n),TY(x,n)),L=(x,n)=>Math.min(H(x,n),TY(x,n));
const archP=(P,w,h,pt)=>{const r=w/2;P.moveTo(-r,0);if(pt){P.lineTo(-r,h-w*0.62);P.quadraticCurveTo(-r,h-w*0.08,0,h);P.quadraticCurveTo(r,h-w*0.08,r,h-w*0.62)}else{P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true)}P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep,hole,pt)=>{const s=archP(new THREE.Shape(),w,h,pt);if(hole)s.holes.push(archP(new THREE.Path(),hole[0],hole[1],pt));const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep);return g};
const archOn=(k,x,n,a,y,w,h,dep,pro,hole,pt)=>add(k,archG(w,h,dep,hole,pt).translate(0,0,pro==null?0.12:pro),x,y,n,a+Math.PI/2);
const cyl=(k,x,n,y,r,h,seg,r2)=>add(k,new THREE.CylinderGeometry(r2==null?r:r2,r,h,seg||20),x,y+h/2,n,0);
const cone=(k,x,n,y,r,h,seg)=>add(k,new THREE.ConeGeometry(r,h,seg||16),x,y+h/2,n,0);
const dome=(k,x,n,y,r,sy)=>{const g=new THREE.SphereGeometry(r,28,12,0,Math.PI*2,0,Math.PI/2);g.scale(1,sy||1,1);add(k,g,x,y,n,0)};
const crenel=(x,n,rot,len,top)=>{add("wall",wbox(len,1.1,0.8,6),x,top+0.55,n,rot);const m=Math.max(2,Math.floor(len/2.6));for(let i=0;i<m;i++){const p=off(x,n,rot,-len/2+len*(i+0.5)/m,0);add("wall",wbox(1.3,1.3,0.8,6),p[0],top+1.75,p[1],rot)}};
const ext=(pts,h)=>{const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>s.lineTo(p[0],p[1]));const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/5,uv.getY(i)/5);return g};
// ===== Zion Gate: Ottoman gatehouse with a bent entrance, and the bullet marks of 1948 =====
begin({n:"שער ציון",r:"שערי העיר העתיקה",t:"📜 שער מימי סולימאן (1540), בכניסה \"מכופפת\" כמו בשער יפו. 📜 החזית מלאה סימני קליעים מהקרבות על הרובע היהודי במלחמת העצמאות (1948). 💡 דרך השער עוברים אל הרובע הארמני והרובע היהודי."});
{const gx=-545.3,gn=-568.7;let best=[1e9,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],b=WALL_LINE[i],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((gx-a[0])*dx+(gn-a[1])*dn)/l2)),d=Math.hypot(a[0]+dx*t-gx,a[1]+dn*t-gn);if(d<best[0])best=[d,Math.atan2(dn,dx)]}
  const rot=best[1],w=14,d=12,c=off(gx,gn,rot,0,-1.5);
  let lo=1e9,hi=-1e9;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(q=>{const p=off(c[0],c[1],rot,q[0]*w/2,q[1]*d/2);lo=Math.min(lo,L(p[0],p[1]));hi=Math.max(hi,G(p[0],p[1]))});
  const top=Math.min(hi+14,LCAP-2.4),base=lo-2,zsx=Math.cos(rot)>0?1:-1,zb=-2.9;gatePass(add,off,wbox,{x:c[0],n:c[1],rot,w,d,base,hi,top,ph:7.9,cor:[[zsx>0?-2:-7,zsx>0?7:2,zb-2,zb+2],[-2,2,zb-2,6]],faces:[[zsx*7,zb,zsx>0?rot:rot+Math.PI,4,7.5,true],[0,6,rot+Math.PI/2,4,7.5,true]]});add("wall",wbox(w+1.4,hi-base,d+1.4,6),c[0],(hi+base)/2,c[1],rot);
  [d/2-0.4,-d/2+0.4].forEach(o=>{const p=off(c[0],c[1],rot,0,o);crenel(p[0],p[1],rot,w,top)});[w/2-0.4,-w/2+0.4].forEach(o=>{const p=off(c[0],c[1],rot,o,0);crenel(p[0],p[1],rot+Math.PI/2,d-1.6,top)});
  // outer arch: on the east end of the tower (along the wall); inner arch: on the city (north) side
  const sx=Math.cos(rot)>0?1:-1,fo=off(c[0],c[1],rot,sx*w/2,-2.9),fc=off(c[0],c[1],rot,sx*w/2,0),nOut=sx>0?rot:rot+Math.PI,cu0=sx>0?-2.9:2.9;
  archOn("light",fo[0],fo[1],nOut,hi,5.4,8.3,0.7,0.4,[4,7.5],true);sillSteps(add,off,L,fo[0],fo[1],nOut,hi,4);
  const fi=off(c[0],c[1],rot,0,d/2),nIn=rot+Math.PI/2;archOn("light",fi[0],fi[1],nIn,hi,5.4,8.3,0.7,0.4,[4,7.5],true);sillSteps(add,off,L,fi[0],fi[1],nIn,hi,4);
  // bullet marks: small dark chips scattered on the outer face, thickest around the arch
  const rr=rng(1948);for(let i=0;i<260;i++){const u=(rr()-0.5)*(d-1),v=hi+0.6+rr()*(top-hi-1.5);if(Math.abs(u-cu0)<2.9&&v<hi+8.6)continue;const p=off(fc[0],fc[1],nOut,0.06,0);const q=off(p[0],p[1],nOut,0,u);const s=0.07+rr()*0.12;add("chip",new THREE.BoxGeometry(0.16,s,s*(0.8+rr()*0.5)),q[0],v,q[1],nOut)}}
// ===== St James: the Armenian cathedral — a drum and a ribbed dome over the monastery roofs =====
begin({n:"קתדרלת סנט ג׳יימס",r:"הרובע הארמני",t:"📜 הכנסייה הראשית של הקהילה הארמנית, מהמאה ה־12, בתוך מתחם הפטריארכיה. 📜 הרובע הארמני סגור בחומה משלו, ובתוכו חצרות, מנזר וספרייה. 💡 מוצגת הכיפה מעל הגגות, בלי סמלים. 💡 הרובע הארמני גבוה בכ־45 מ׳ מרחבת ההר, ולכן הכיפה נמוכה מאוד, כדי שלא תעבור את ההיכל."});
{const x=-598,n=-382;let t=-1e4;for(let a=-8;a<=8;a+=2)for(let b=-8;b<=8;b+=2)t=Math.max(t,bldTop(x+a,n+b));const y=t>-1e3?t:G(x,n)+10,hh=Math.min(9,LCAP-y-0.5);
  if(hh>1.5){cyl("stone",x,n,y-0.3,5.2,hh*0.45+0.3,16);for(let i=0;i<8;i++){const a=i*Math.PI/4,p=[x+Math.cos(a)*5.0,n+Math.sin(a)*5.0];archOn("dark",p[0],p[1],a,y+hh*0.08,0.8,hh*0.3,0.5,0.25)}
    cone("lead",x,n,y+hh*0.45,5.6,hh*0.55,16)}}
// ===== Mount Zion: the Dormition — a round church with a conical roof, corner turrets and a tall bell tower =====
begin({n:"כנסיית הדורמיציון",r:"הר ציון",t:"📜 כנסייה גרמנית מ־1910, עגולה, עם גג חרוטי אפור, ארבעה צריחונים ומגדל פעמונים גבוה. היא הסימן המוכר של הר ציון. 💡 בלי סמלים, ובגובה שמתחת להיכל."});
{const DP=[[-635.1,-646.6],[-635.0,-656.5],[-636.5,-667.4],[-638.0,-668.3],[-621.8,-670.0],[-613.4,-674.2],[-603.5,-676.2],[-600.2,-675.9],[-597.7,-656.4],[-588.4,-654.5],[-582.6,-647.9],[-578.8,-640.1],[-580.6,-638.1],[-595.1,-637.5],[-604.0,-637.0],[-609.6,-639.4],[-612.4,-639.3],[-612.2,-642.1],[-617.9,-642.0],[-618.0,-649.8],[-628.8,-658.4],[-630.0,-646.3]];
  let lo=1e9;DP.forEach(p=>lo=Math.min(lo,L(p[0],p[1])));const x=-606,n=-656,g=G(x,n),vs=Math.min(1,(LCAP-g)/26),Y=v=>g+v*vs;
  // the abbey wings, lower than the church
  add("stone",ext(DP,Y(9)-(lo-2)),0,lo-2,0,0);
  cyl("stone",x,n,lo-2,14,Y(15)-(lo-2),24);for(let i=0;i<12;i++){const a=i*Math.PI/6+0.1,p=[x+Math.cos(a)*13.8,n+Math.sin(a)*13.8];archOn("dark",p[0],p[1],a,Y(9.5),1.4,3.6*vs,0.7,0.3)}
  add("light",new THREE.CylinderGeometry(14.6,14.6,0.6,24),x,Y(15)+0.3,n,0);cone("lead",x,n,Y(15.6),14.2,7*vs,24);cyl("lead",x,n,Y(15.6)+7*vs,1.2,1.6*vs,10);
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(c=>{const tx=x+c[0]*10.6,tn=n+c[1]*10.6;cyl("stone",tx,tn,Y(9),2.4,Y(18)-Y(9),12);cone("lead",tx,tn,Y(18),2.7,4*vs,12)});
  const bx=-622,bn=-644,bt=Math.min(Y(33),LCAP-4.5);add("stone",wbox(7.5,bt-(lo-2),7.5,4),bx,(bt+lo-2)/2,bn,0.05);
  [[0,3.75,Math.PI/2],[0,-3.75,-Math.PI/2],[3.75,0,0],[-3.75,0,Math.PI]].forEach(f=>{const p=off(bx,bn,0.05,f[0],f[1]);archOn("dark",p[0],p[1],f[2]+0.05,bt-5,1.6,3.6,0.7,0.25);archOn("dark",p[0],p[1],f[2]+0.05,bt-11,1,2.2,0.7,0.25)});
  add("light",wbox(8.2,0.6,8.2,4),bx,bt+0.3,bn,0.05);cone("lead",bx,bn,bt+0.6,5.4,4,4)}
// ===== the Cenacle and the Tomb of David, south of it =====
begin({n:"קבר דוד וחדר הסעודה",r:"הר ציון",t:"⚖️ לפי מסורת מימי הביניים, כאן קבר דוד המלך. מעליו האולם הצלבני שבו, לפי המסורת הנוצרית, הייתה \"הסעודה האחרונה\". 📜 על הבניין כיפה קטנה וצריח. 💡 הצריח בלי סמל."});
{const x=-590,n=-690,t=bldTop(x,n),y=t>-1e3?t:G(x,n)+8;cyl("stone",x,n,y-0.3,3.2,2.2,16);dome("lead",x,n,y+1.9,3.0,0.9);
  const mx=-580,mn=-683,mt=bldTop(mx,mn),my=mt>-1e3?mt:G(mx,mn)+8,mh=Math.min(10,LCAP-my-1);if(mh>3){add("stone",wbox(2.6,mh*0.8,2.6,4),mx,my+mh*0.4,mn,0);cyl("stone",mx,mn,my+mh*0.8,1.2,mh*0.12,8);dome("lead",mx,mn,my+mh*0.92,1.25,1.1)}}
const MAT={chip:new THREE.MeshStandardMaterial({color:0x5a5248,roughness:1}),wall:M.wall,stone:M.stoneL,light:M.stone||M.stoneL,dark:M.dark,lead:new THREE.MeshStandardMaterial({color:0x7f878e,metalness:0.45,roughness:0.5})};
groups.forEach(G=>Object.keys(G.GS).forEach(k=>{if(!G.GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(G.GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=true;m.receiveShadow=true;m.userData=G.info;WG.add(m);PICK.push(m)}));
}catch(e){console.warn("area5",e)}})();

// ---- topic 3, area 6: the Muslim Quarter by the Mount — the Cotton Merchants' market and the arches of Chain Street ----
(function(){try{
const GS={stone:[],vault:[],dark:[],pave:[],g0:[],g1:[],g2:[],g3:[]};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");GS[k].push(geo)};
const gy=(x,n)=>Math.min(TY(x,n),H(x,n)+0.5);
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const archP=(P,w,h,pt)=>{const r=w/2;P.moveTo(-r,0);if(pt){P.lineTo(-r,h-w*0.62);P.quadraticCurveTo(-r,h-w*0.08,0,h);P.quadraticCurveTo(r,h-w*0.08,r,h-w*0.62)}else{P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true)}P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep,pt)=>{const g=new THREE.ExtrudeGeometry(archP(new THREE.Shape(),w,h,pt),{depth:dep,bevelEnabled:false,curveSegments:5});g.translate(0,0,-dep);return g};
const rnd=rng(1336);
// a Mamluk covered market: a tall pointed vault on two storeys of shops, lit from openings in the roof
function lane(pl,lw,sd,hs){const r=lw/2,STEP=3.4;let k=0;
  for(let i=1;i<pl.length;i++){const a=pl[i-1],b=pl[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),rot=Math.atan2(b[1]-a[1],b[0]-a[0]),ns=Math.max(1,Math.round(L/STEP)),st=L/ns;
    for(let j=0;j<ns;j++,k++){const t=(j+0.5)/ns,x=a[0]+(b[0]-a[0])*t,n=a[1]+(b[1]-a[1])*t,y=gy(x,n);
      add("pave",wbox(st+0.02,0.4,lw+0.2,2),x,y-0.05,n,rot);const top=hs+r+0.9;
      [1,-1].forEach(s=>{const c=off(x,n,rot,0,s*(r+sd/2));add("stone",wbox(st+0.03,top+1.5,sd,4),c[0],y+top/2-0.75,c[1],rot);
        const f=off(x,n,rot,0,s*r),fr=rot+(s>0?0:Math.PI);add("dark",archG(2.4,3.0,1.3,true).translate(0,0,0.12),f[0],y,f[1],fr);add("dark",archG(1.1,1.6,1.0,true).translate(0,0,0.12),f[0],y+3.5,f[1],fr);
        if(rnd()<0.75){const gk="g"+Math.floor(rnd()*4),q=off(x,n,rot,0,s*(r-0.35));add(gk,new THREE.BoxGeometry(1.4,0.35+rnd()*0.35,0.5),q[0],y+0.45,q[1],rot)}});
      if(k%4!==2){const v=new THREE.CylinderGeometry(r,r,st+0.04,12,1,true,0,Math.PI);v.rotateZ(Math.PI/2);v.scale(1,1.25,1);add("vault",v,x,y+hs,n,rot);
        const sk=new THREE.CylinderGeometry(r+0.5,r+0.5,st+0.04,12,1,true,0,Math.PI);sk.rotateZ(Math.PI/2);sk.scale(1,1.2,1);add("stone",sk,x,y+hs,n,rot)}
      if(k%2===0){const rb=new THREE.TorusGeometry(r-0.05,0.2,5,12,Math.PI);rb.rotateY(Math.PI/2);rb.scale(1,1.25,1);add("stone",rb,x,y+hs,n,rot)}}}}
// 📜 Souq al-Qattanin (the Cotton Merchants' market), built by Tankiz in 1336, from al-Wad Street to the gate of the Mount
lane([[-207,-1],[-160,-1],[-124,-1.5]],4.0,5.2,4.6);
// arches (sabat) over Chain Street, as in the real street
const span=(x,n,rot,w)=>{const y=gy(x,n),r=w/2+0.1;[1,-1].forEach(s=>{const p=off(x,n,rot,0,s*(r+0.4));add("stone",wbox(1.2,4.6,0.9,3),p[0],y+2.3,p[1],rot)});
  const ar=new THREE.TorusGeometry(r+0.3,0.45,6,14,Math.PI);ar.rotateY(Math.PI/2);ar.scale(1,0.9,1);add("stone",ar,x,y+4.4,n,rot);add("stone",wbox(1.4,2.6,w+2.4,3),x,y+4.4+r+0.9,n,rot)};
[[-250,-123.4],[-300,-131.1],[-352,-140.2]].forEach(q=>span(q[0],q[1],-0.17,4.6));
const sM=M.stoneL,vM=sM.clone();vM.side=THREE.DoubleSide;const gm=c=>new THREE.MeshStandardMaterial({color:c,roughness:0.85});
const MAT={stone:sM,vault:vM,dark:M.dark,pave:M.pave,g0:gm(0x7a2a12),g1:gm(0x9a6614),g2:gm(0x44521c),g3:gm(0x24395a)};
const info={n:"שוק הכותנה (סוק אל־קטאנין)",r:"הרובע המוסלמי, ליד הר הבית",t:"📜 שוק מקורה ומפואר מהתקופה הממלוכית, שבנה המושל תנכיז בשנת 1336. 📜 קמרון גבוה, שתי קומות של חנויות, ופתחי אור בתקרה. השוק מוביל ישר אל שער סוחרי הכותנה של הר הבית. 💡 ברחוב השלשלת נוספו קשתות מעל הרחוב, כמו שיש בו היום."};
Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=k==="stone"||k==="vault";m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
}catch(e){console.warn("area6",e)}})();

// ---- topic 3, area 7: Damascus Gate, Khan al-Zeit, the Via Dolorosa, St Anne, Lions Gate and Herod's Gate ----
(function(){try{
const LCAP=113.5*0.48-1;let cur=null;const groups=[],GS={};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");const T=cur?cur.GS:GS;(T[k]=T[k]||[]).push(geo)};
const begin=info=>{cur={info,GS:{}};groups.push(cur)};
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const G=(x,n)=>Math.max(H(x,n),TY(x,n)),Lo=(x,n)=>Math.min(H(x,n),TY(x,n)),gy=(x,n)=>Math.min(TY(x,n),H(x,n)+0.5);
const archP=(P,w,h,pt)=>{const r=w/2;P.moveTo(-r,0);if(pt){P.lineTo(-r,h-w*0.62);P.quadraticCurveTo(-r,h-w*0.08,0,h);P.quadraticCurveTo(r,h-w*0.08,r,h-w*0.62)}else{P.lineTo(-r,h-r);P.absarc(0,h-r,r,Math.PI,0,true)}P.lineTo(r,0);P.lineTo(-r,0);return P};
const archG=(w,h,dep,hole,pt)=>{const s=archP(new THREE.Shape(),w,h,pt);if(hole)s.holes.push(archP(new THREE.Path(),hole[0],hole[1],pt));const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep);return g};
const archOn=(k,x,n,a,y,w,h,dep,pro,hole,pt)=>add(k,archG(w,h,dep,hole,pt).translate(0,0,pro==null?0.12:pro),x,y,n,a+Math.PI/2);
const cyl=(k,x,n,y,r,h,seg,r2)=>add(k,new THREE.CylinderGeometry(r2==null?r:r2,r,h,seg||20),x,y+h/2,n,0);
const dome=(k,x,n,y,r,sy)=>{const g=new THREE.SphereGeometry(r,24,10,0,Math.PI*2,0,Math.PI/2);g.scale(1,sy||1,1);add(k,g,x,y,n,0)};
const crenel=(x,n,rot,len,top,pointed)=>{add("wall",wbox(len,1.1,0.8,6),x,top+0.55,n,rot);const m=Math.max(2,Math.floor(len/2.6));for(let i=0;i<m;i++){const p=off(x,n,rot,-len/2+len*(i+0.5)/m,0);add("wall",wbox(1.3,1.3,0.8,6),p[0],top+1.75,p[1],rot);if(pointed){const c=new THREE.ConeGeometry(0.75,1.1,4);c.rotateY(Math.PI/4);c.scale(1,1,0.6);add("wall",c,p[0],top+2.95,p[1],rot)}}};
const wallDir=(gx,gn)=>{let best=[1e9,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],b=WALL_LINE[i],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((gx-a[0])*dx+(gn-a[1])*dn)/l2)),d=Math.hypot(a[0]+dx*t-gx,a[1]+dn*t-gn);if(d<best[0])best=[d,Math.atan2(dn,dx),a[0]+dx*t,a[1]+dn*t]}return best};
// a gate tower: returns frame info. outward = unit side (+1: left of the wall direction) that faces out of the city
function gateTower(gx0,gn0,w,d,h,pointed,keep,pass){const wd=wallDir(gx0,gn0),rot=wd[1],gx=keep?gx0:wd[2],gn=keep?gn0:wd[3],lx=-Math.sin(rot),ln=Math.cos(rot),out=((gx+380)*lx+(gn-0)*ln)>0?1:-1;
  let lo=1e9,hi=-1e9;[[-1,-1],[1,-1],[1,1],[-1,1],[0,0]].forEach(q=>{const p=off(gx,gn,rot,q[0]*w/2,q[1]*d/2);lo=Math.min(lo,Lo(p[0],p[1]));hi=Math.max(hi,G(p[0],p[1]))});
  const top=Math.min(hi+h,LCAP-3.6),base=lo-2;if(pass)gatePass(add,off,wbox,Object.assign({x:gx,n:gn,rot,w,d,base,hi,top},pass(rot,out)));else add("wall",wbox(w,top-base,d,6),gx,(top+base)/2,gn,rot);add("wall",wbox(w+1.4,hi-base,d+1.4,6),gx,(hi+base)/2,gn,rot);
  [d/2-0.4,-d/2+0.4].forEach(o=>{const p=off(gx,gn,rot,0,o);crenel(p[0],p[1],rot,w,top,pointed)});[w/2-0.4,-w/2+0.4].forEach(o=>{const p=off(gx,gn,rot,o,0);crenel(p[0],p[1],rot+Math.PI/2,d-1.6,top,pointed)});
  return{rot,out,hi,top,lo,gx,gn,nOut:rot+out*Math.PI/2,nIn:rot-out*Math.PI/2}}
const gateArch=(x,n,a,y,w,h)=>{archOn("light",x,n,a,y,w+1.4,h+0.8,0.7,0.4,[w,h],true);/* v114: בלי לוח כהה — הפתח פתוח באמת */sillSteps(add,off,Lo,x,n,a,y,w)};
// ===== Damascus Gate: the grandest of the Ottoman gates =====
begin({n:"שער שכם",r:"שערי העיר העתיקה",t:"📜 השער המפואר ביותר בחומות סולימאן (1537), על מקום שער רומי. 📜 שני מגדלים, קשת מחודדת גבוהה, ושורת שיניים מחודדות בראש החומה. 📜 לפני השער יש רחבה במדרגות, כמו תיאטרון, שיורדת אל השער. 💡 מכאן יוצא חאן א־זית דרומה, אל לב העיר."});
{const T=gateTower(-467,418,15,11,14,true,false,(rot,out)=>({ph:7.9,cor:[[-2.2,2.2,-5.5,5.5]],faces:[[0,out*5.5,rot+out*Math.PI/2,4.4,7.5,true],[0,-out*5.5,rot-out*Math.PI/2,4.4,7.5,true]]})),gx=T.gx,gn=T.gn;
  const fo=off(gx,gn,T.rot,0,T.out*5.5);gateArch(fo[0],fo[1],T.nOut,T.hi,5,9);const fi=off(gx,gn,T.rot,0,-T.out*5.5);gateArch(fi[0],fi[1],T.nIn,T.hi,4.4,7.5);
  const mp=off(fo[0],fo[1],T.nOut,0.9,0);add("wall",wbox(1.8,2.2,5,4),mp[0],T.hi+11.6,mp[1],T.nOut+Math.PI/2);
  [-1,1].forEach(s=>{const c=off(gx,gn,T.rot,s*10.8,T.out*0.6),t2=gateTower(c[0],c[1],6.5,8.5,15.5,true,true)});
  // the stepped plaza in front, falling towards the gate (half rings, rising outwards)
  const cx=off(gx,gn,T.rot,0,T.out*6.5);for(let i=1;i<=7;i++){const r0=7+(i-1)*2.4,r1=r0+2.4,s=new THREE.Shape();const a0=T.nOut-Math.PI/2;s.absarc(0,0,r1,0,Math.PI,false);s.absarc(0,0,r0,Math.PI,0,true);
    const g=new THREE.ExtrudeGeometry(s,{depth:i*0.42+1.2,bevelEnabled:false,curveSegments:16});g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)/3,uv.getY(q)/3);add("pave",g,cx[0],T.hi-1.2,cx[1],-a0)}}
// ===== Herod's Gate (Flowers Gate): a smaller gate with a bent entrance =====
begin({n:"שער הפרחים",r:"שערי העיר העתיקה",t:"📜 שער קטן בצפון החומה, עם כניסה מכופפת: הפתח החיצוני בצד המגדל. 📜 על השער יש עיטור אבן בצורת פרח, ומכאן שמו בעברית. 💡 מכאן מגיע אחד ממסלולי העולים לרגל."});
{const T=gateTower(-162.5,549,12,12,12,false,false,(rot,out)=>{const sx=Math.cos(rot)>0?1:-1,b0=out*3.5,h=1.7;return{ph:6.8,cor:[[sx>0?-h:-6,sx>0?6:h,b0-h,b0+h],[-h,h,out>0?-6:b0-h,out>0?b0+h:6]],faces:[[sx*6,b0,sx>0?rot:rot+Math.PI,3.4,6.4,true],[0,-out*6,rot-out*Math.PI/2,3.4,6.4,true]]}}),gx=T.gx,gn=T.gn;const sx=Math.cos(T.rot)>0?1:-1,fo=off(gx,gn,T.rot,sx*6,T.out*3.5);gateArch(fo[0],fo[1],sx>0?T.rot:T.rot+Math.PI,T.hi,3.4,6.4);
  const fi=off(gx,gn,T.rot,0,-T.out*6);gateArch(fi[0],fi[1],T.nIn,T.hi,3.4,6.4);
  const fl=off(gx,gn,T.rot,0,T.out*6.15);add("light",new THREE.CylinderGeometry(0.9,0.9,0.3,12).rotateX(Math.PI/2),fl[0],T.hi+8.2,fl[1],T.nOut+Math.PI/2)}
// ===== Lions Gate: a straight gate with two pairs of reliefs =====
begin({n:"שער האריות",r:"שערי העיר העתיקה",t:"📜 שער במזרח החומה, מול הר הזיתים. 📜 משני צדי הפתח יש ארבעה תבליטים של חיות (בעצם נמרים), סמל של הסולטן בייברס. 📜 דרך השער הזה פרצו הצנחנים לעיר העתיקה בשנת 1967. 💡 מכאן נכנסים מהר הזיתים ומבית שער הפרה."});
{const T=gateTower(144.2,314.5,14,9,11,false,false,(rot,out)=>({ph:7,cor:[[-1.8,1.8,-4.5,4.5]],faces:[[0,out*4.5,rot+out*Math.PI/2,3.6,6.6,true],[0,-out*4.5,rot-out*Math.PI/2,3.6,6.6,true]]})),gx=T.gx,gn=T.gn;const fo=off(gx,gn,T.rot,0,T.out*4.5);gateArch(fo[0],fo[1],T.nOut,T.hi,3.6,6.6);const fi=off(gx,gn,T.rot,0,-T.out*4.5);gateArch(fi[0],fi[1],T.nIn,T.hi,3.6,6.6);
  [-4.2,-2.9,2.9,4.2].forEach(u=>{const p=off(gx,gn,T.rot,u,T.out*4.65);add("light",wbox(1.1,0.75,0.25,1),p[0],T.hi+7.6,p[1],T.rot);add("dark",wbox(0.8,0.45,0.1,1),p[0],T.hi+7.6,p[1]+0,T.rot)})}
// ===== Khan al-Zeit: the southern, roofed part of the market street from Damascus Gate =====
begin({n:"חאן א־זית",r:"הרובע המוסלמי",t:"📜 רחוב השוק הראשי, שיורד משער שכם דרומה עד השווקים המקבילים. הוא נמצא על הקו של הקרדו הרומי. 📜 החלק הדרומי שלו מקורה בקמרונות. 💡 החנויות מצוירות בפשטות."});
{const pl=[[-426,140],[-426,111],[-424,83],[-424,64],[-423,44],[-423,19]],lw=3.6,r=lw/2,hs=3.6,STEP=3.2,rnd=rng(77);let k=0;
  for(let i=1;i<pl.length;i++){const a=pl[i-1],b=pl[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),rot=Math.atan2(b[1]-a[1],b[0]-a[0]),ns=Math.max(1,Math.round(L/STEP)),st=L/ns;
    for(let j=0;j<ns;j++,k++){const t=(j+0.5)/ns,x=a[0]+(b[0]-a[0])*t,n=a[1]+(b[1]-a[1])*t,y=gy(x,n);add("pave",wbox(st+0.02,0.4,lw+0.2,2),x,y-0.05,n,rot);
      [1,-1].forEach(s=>{const c=off(x,n,rot,0,s*(r+0.35));add("stone",wbox(st+0.03,hs+r+2,0.7,4),c[0],y+(hs+r)/2,c[1],rot);const f=off(x,n,rot,0,s*r);add("dark",archG(2.2,2.9,1.2).translate(0,0,0.12),f[0],y,f[1],rot+(s>0?0:Math.PI));
        if(rnd()<0.8){const q=off(x,n,rot,0,s*(r-0.35));add("g"+Math.floor(rnd()*4),new THREE.BoxGeometry(1.4,0.35+rnd()*0.35,0.5),q[0],y+0.45,q[1],rot)}});
      if(k%4!==2){const v=new THREE.CylinderGeometry(r,r,st+0.04,12,1,true,0,Math.PI);v.rotateZ(Math.PI/2);add("vault",v,x,y+hs,n,rot);const sk=new THREE.CylinderGeometry(r+0.45,r+0.45,st+0.04,12,1,true,0,Math.PI);sk.rotateZ(Math.PI/2);add("stone",sk,x,y+hs,n,rot)}
      if(k%2===0){const rb=new THREE.TorusGeometry(r-0.05,0.18,5,12,Math.PI);rb.rotateY(Math.PI/2);add("stone",rb,x,y+hs,n,rot)}}}}
// ===== the Ecce Homo arch over the Via Dolorosa =====
begin({n:"קשת אקה הומו",r:"ויה דולורוזה",t:"📜 קשת רומית מימי הקיסר אדריאנוס (המאה ה־2), שחוצה את הרחוב. 📜 הרחוב הוא ויה דולורוזה, הדרך שבה, לפי המסורת הנוצרית, הלך ישו אל הצליבה. 💡 בלי סמלים."});
{const x=-150,n=290,rot=0.19,y=gy(x,n),w=5.2,r=w/2;[1,-1].forEach(s=>{const p=off(x,n,rot,0,s*(r+0.6));add("stone",wbox(1.6,5.4,1.2,3),p[0],y+2.7,p[1],rot)});
  const ar=new THREE.TorusGeometry(r+0.4,0.55,6,16,Math.PI);ar.rotateY(Math.PI/2);add("stone",ar,x,y+5.2,n,rot);add("stone",wbox(2.2,3.4,w+3.4,3),x,y+5.2+r+1.4,n,rot);
  [1,-1].forEach(s=>{const p=off(x,n,rot,s*1.15,0);archOn("dark",p[0],p[1],rot+(s>0?0:Math.PI),y+5.2+r+0.6,0.8,1.3,0.6,0.15)})}
// ===== St Anne: the Crusader church by the Pool of Bethesda — a small dome over the crossing =====
begin({n:"כנסיית סנט אן",r:"ליד שער האריות",t:"📜 כנסייה צלבנית מהמאה ה־12, אחת השמורות בארץ, ולידה שרידי בריכת בית חסדא. 📜 בכנסייה יש כיפה קטנה מעל מרכזה, והאקוסטיקה שלה מפורסמת. 💡 בלי סמלים."});
{const x=102,n=377;let t=-1e4;for(let a=-6;a<=6;a+=2)for(let b=-6;b<=6;b+=2)t=Math.max(t,bldTop(x+a,n+b));const y=t>-1e3?t:G(x,n)+12,hh=Math.min(6,LCAP-y-0.5);
  if(hh>1.5){cyl("stone",x,n,y-0.3,3.6,hh*0.45+0.3,12);for(let i=0;i<8;i++){const a=i*Math.PI/4,p=[x+Math.cos(a)*3.5,n+Math.sin(a)*3.5];archOn("dark",p[0],p[1],a,y+hh*0.08,0.6,hh*0.3,0.5,0.25)}dome("lead",x,n,y+hh*0.45,3.6,hh*0.55/3.6)}}
const sM=M.stoneL,vM=sM.clone();vM.side=THREE.DoubleSide;const gm=c=>new THREE.MeshStandardMaterial({color:c,roughness:0.85});
const MAT={wall:M.wall,stone:sM,vault:vM,light:M.stone||M.stoneL,dark:M.dark,pave:M.pave,lead:new THREE.MeshStandardMaterial({color:0x7f878e,metalness:0.45,roughness:0.5}),g0:gm(0x7a2a12),g1:gm(0x9a6614),g2:gm(0x44521c),g3:gm(0x24395a)};
groups.forEach(G=>Object.keys(G.GS).forEach(k=>{if(!G.GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(G.GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=k!=="pave";m.receiveShadow=true;m.userData=G.info;WG.add(m);PICK.push(m)}));
}catch(e){console.warn("area7",e)}})();

// ---- topic 3, area 8: the walls — crenellated towers all around, and the New Gate ----
(function(){try{
const LCAP=113.5*0.48-1;const GS={wall:[],dark:[],light:[]};
const add=(k,geo,x,y,n,rot)=>{geo=geo.index?geo.toNonIndexed():geo;const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);if(geo.attributes.uv2)geo.deleteAttribute("uv2");GS[k].push(geo)};
const off=(x,n,rot,a,b)=>[x+Math.cos(rot)*a-Math.sin(rot)*b,n+Math.sin(rot)*a+Math.cos(rot)*b];
const crenel=(x,n,rot,len,top)=>{add("wall",wbox(len,1.0,0.8,6),x,top+0.5,n,rot);const m=Math.max(2,Math.floor(len/2.6));for(let i=0;i<m;i++){const p=off(x,n,rot,-len/2+len*(i+0.5)/m,0);add("wall",wbox(1.3,1.3,0.8,6),p[0],top+1.65,p[1],rot)}};
const archP=(P,w,h)=>{const r=w/2;P.moveTo(-r,0);P.lineTo(-r,h-w*0.62);P.quadraticCurveTo(-r,h-w*0.08,0,h);P.quadraticCurveTo(r,h-w*0.08,r,h-w*0.62);P.lineTo(r,0);P.lineTo(-r,0);return P};
const archOn=(k,x,n,a,y,w,h,dep,pro,hole)=>{const s=archP(new THREE.Shape(),w,h);if(hole)s.holes.push(archP(new THREE.Path(),hole[0],hole[1]));const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:6});g.translate(0,0,-dep+(pro==null?0.12:pro));add(k,g,x,y,n,a+Math.PI/2)};
// the same towers the wall code places (every ~110 m), now with battlements and arrow slits
/* 125.3 (ביקורת 37): אותם מגדלים שקוד החומה בונה, במקומות האמיתיים (wallTowers), עם שיניים בראש וחרכי ירי בחזית */
wallTowers().forEach(T=>{if(T.top==null)return;const x=T.x,n=T.n,ang=T.ang,top=T.top,hw=T.w/2,hd=T.d/2;
    [hd-0.4,-hd+0.4].forEach(o=>{const p=off(x,n,ang,0,o);crenel(p[0],p[1],ang,T.w,top)});[hw-0.4,-hw+0.4].forEach(o=>{const p=off(x,n,ang,o,0);crenel(p[0],p[1],ang+Math.PI/2,T.d-0.8,top)});
    const fo=-(hd+0.02),k=Math.max(1,Math.round(T.w/5));for(let j=0;j<k;j++){const u=-hw+T.w*(j+0.5)/k,p=off(x,n,ang,u,0);const q=[p[0]-T.ix*(hd+0.03),p[1]-T.inn*(hd+0.03)];add("dark",new THREE.BoxGeometry(0.4,1.6,0.12),q[0],top-5,q[1],ang)}});
// the New Gate (1889): a straight gate between two small battlemented towers
{const g0=[-871.6,144.3];let best=[1e9,0,0,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],b=WALL_LINE[i],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((g0[0]-a[0])*dx+(g0[1]-a[1])*dn)/l2)),d=Math.hypot(a[0]+dx*t-g0[0],a[1]+dn*t-g0[1]);if(d<best[0])best=[d,Math.atan2(dn,dx),a[0]+dx*t,a[1]+dn*t]}
  const rot=best[1],gx=best[2],gn=best[3],lx=-Math.sin(rot),ln=Math.cos(rot),out=((gx+380)*lx+gn*ln)>0?1:-1,base=Math.min(H(gx,gn),TY(gx,gn))-2,hi=Math.max(H(gx,gn),TY(gx,gn)),top=Math.min(hi+13,LCAP-2.4);
  gatePass(add,off,wbox,{x:gx,n:gn,rot,w:9,d:5,base,hi,top,ph:7.7,cor:[[-2.1,2.1,-2.5,2.5]],faces:[[0,2.5,rot+Math.PI/2,4.2,7.3,false],[0,-2.5,rot-Math.PI/2,4.2,7.3,false]]});crenel(...off(gx,gn,rot,0,out*2.1),rot,9,top);
  [-1,1].forEach(s=>{const c=off(gx,gn,rot,s*6.5,out*0.8);add("wall",wbox(4.5,top+2-base,6.6,6),c[0],(top+2+base)/2,c[1],rot);[3.3-0.4,-3.3+0.4].forEach(o=>{const p=off(c[0],c[1],rot,0,o);crenel(p[0],p[1],rot,4.5,top+2)})});
  [1,-1].forEach(s=>{const f=off(gx,gn,rot,0,s*2.5);const nrm=rot+s*Math.PI/2;archOn("light",f[0],f[1],nrm,hi,5.6,8,0.6,0.35,[4.2,7.3])})}
const info={n:"חומות העיר העתיקה",r:"נבנו בימי סולימאן, 1537–1541",t:"📜 החומות של היום, באורך של כ־4 ק״מ, עם כ־34 מגדלים ושבעה שערים פתוחים. 📜 בראש החומות ובראש המגדלים יש שיניים (צינה) וחרכי ירי. 📜 המגדלים עומדים במקומות שלהם לפי קו החומה במפה (OpenStreetMap), שבו כל מגדל בולט החוצה. 📜 השער החדש נפתח רק בשנת 1889."};
const MAT={wall:M.wall,dark:M.dark,light:M.stone||M.stoneL};
Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=true;m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
}catch(e){console.warn("area8",e)}})();

// ---- topic 3: the Southern Steps before the Double (Huldah) Gate, 64 m wide, rising 6.8 m ----
(function(){return;try{const GS=[];const ox=0.1743,on=-0.9847,R=0.1752;
  for(let k=0;k<30;k++){const tc=6+0.7*k+0.35,top=HUL-(k+1)*6.8/30,bot=HUL-8.2,g=wbox(64,top-bot,0.74,4),m=new THREE.Matrix4().makeRotationY(R);m.setPosition(45+ox*tc,(top+bot)/2,-(-237.15+on*tc));g.applyMatrix4(m);if(g.attributes.uv2)g.deleteAttribute("uv2");GS.push(g.index?g.toNonIndexed():g)}
  const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS,false);if(!mg)return;const me=new THREE.Mesh(mg,M.pave||M.stone2||M.wall);me.receiveShadow=true;me.castShadow=true;
  me.userData={n:"המדרגות הדרומיות",r:"חפירות העופל; מדידות וורן וכספי",t:"📜 מדרגות רחבות, כ־64 מטר, שעולות מהרחוב שמדרום להר אל שערי חולדה. 📜 מפתן השערים בגובה 725.4 מטר, והמדרגות עולות אליו כ־6.8 מטר. 💡 במודל יש 30 מדרגות שוות. במציאות המדרגות לא שוות: מדרגה צרה ומדרגה רחבה לסירוגין."};WG.add(me);PICK.push(me)}catch(e){console.warn("ssteps",e)}})();

// ---- 125.5 (תמונות Mapillary): חנויות בקומת הרחוב של רחובות השוק ----
// 📜 בתמונות הרחוב (Mapillary, 2018–2023) ברחוב דוד, ברחוב השלשלת, בחאן א־זית, בוויה דולורוזה ובמוריסטן, קומת הרחוב היא שורה של חנויות פתוחות:
// פתח כהה, סחורה על דוכן לפני הפתח, תריס מתכת מגולגל מעל, ולפעמים סוכך בד. בדגם היה שם קיר עם חלונות. השווקים המקורים (אזור 2) כבר בנויים עם חנויות ולא נוגעים בהם.
(function(){try{
  const SP=[[[-720,-165],[-631,-142.5],[-568,-142.5],[-510,-139],[-478,-137],[-440,-122]],[[-440,-125],[-300,-131],[-120,-117]],[[-462,400],[-424,80],[-418,20]],[[-120,296],[-300,300],[-424,290]],[[-545,-30],[-518,-60],[-490,-90]],[[-462,400],[-350,300]]];
  const nearSpine=(x,n)=>SP.some(L=>{for(let i=0;i<L.length-1;i++){const a=L[i],b=L[i+1],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn,t=Math.max(0,Math.min(1,((x-a[0])*dx+(n-a[1])*dn)/l2));if(Math.hypot(a[0]+dx*t-x,a[1]+dn*t-n)<9)return true}return false});
  const inB=(x,n)=>{const L=CB.b.get(cbK(Math.floor(x/CB.st),Math.floor(n/CB.st)));if(!L)return false;for(const o of L){if(x<o.xa||x>o.xb||n<o.na||n>o.nb)continue;if(inPoly(x,n,o.p))return true}return false};
  const souq=(x,n)=>x>-442&&x<-384&&n>-140&&n<22;
  const F=[],seen=new Set(),r=rng(1254);
  ROADS.forEach(rd=>{if(rd.c!==4)return;let nxt=1.6,acc=0;/* הנקודות של קו הרחוב צפופות (פחות ממטר), אז הולכים לאורך הקו כולו ודוגמים כל 3.2 מ׳ */for(let i=0;i<rd.p.length-1;i++){const a=rd.p[i],b=rd.p[i+1],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn);if(L<1e-3)continue;const ux=dx/L,un=dn/L,a0=acc;acc+=L;
    for(;nxt<acc;nxt+=3.2){const s=nxt-a0,x=a[0]+ux*s,n=a[1]+un*s;if(!inPoly(x,n,OLD)||souq(x,n))continue;if(!nearSpine(x,n)||inB(x,n))continue;
      [1,-1].forEach(sd=>{const px=-un*sd,pn=ux*sd;let d=-1;for(let q=0.6;q<=rd.w/2+3.5;q+=0.3){if(inB(x+px*q,n+pn*q)){d=q;break}}if(d<0)return;
        const fx=x+px*(d-0.05),fn=n+pn*(d-0.05),k=Math.round(fx/2.4)+"_"+Math.round(fn/2.4);if(seen.has(k))return;seen.add(k);
        /* החזית צריכה להיות ישרה כאן: גם 1 מ׳ לכל צד עדיין קיר */
        if(!inB(fx+px*0.3+ux*1.1,fn+pn*0.3+un*1.1)||!inB(fx+px*0.3-ux*1.1,fn+pn*0.3-un*1.1))return;
        F.push({w:rd.w,x:fx,n:fn,g:surfY(fx-px*0.4,fn-pn*0.4),a:Math.atan2(pn,px),o:r(),o2:r(),o3:r()})})}}});
  if(!F.length)return;
  const N=F.length,d=new THREE.Object3D(),col=new THREE.Color();
  const mk=(geo,mat,cnt)=>{const m=new THREE.InstancedMesh(geo,mat,cnt);m.castShadow=false;m.receiveShadow=true;return m};
  const dark=mk(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x2a2119,roughness:1}),N);
  const shut=mk(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x5f6366,metalness:0.3,roughness:0.7}),N);
  const goods=mk(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:0.85}),N*3);
  const awn=mk(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:0.9,side:THREE.DoubleSide}),N);
  const PAL=[0xb2412f,0x2f6d8c,0xd9a441,0x6b8f3a,0x8c3f6b,0xe0d3b8,0x4a3a2a,0xc96f2d];
  let gi=0,ai=0;
  F.forEach((f,i)=>{const c=Math.cos(f.a),s=Math.sin(f.a),P=(al,out)=>[f.x+c*out-s*al,f.n+s*out+c*al];/* out: מהקיר אל הרחוב (הכיוון ההפוך לנורמל), al: לאורך הקיר */
    const W=2.2+f.o*0.6,Hh=2.5;
    {const p=P(0,-0.04);d.position.set(p[0],f.g+Hh/2,-p[1]);d.rotation.set(0,f.a,0);d.scale.set(0.12,Hh,W);d.updateMatrix();dark.setMatrixAt(i,d.matrix)}
    {const p=P(0,-0.08);d.position.set(p[0],f.g+Hh+0.2,-p[1]);d.rotation.set(0,f.a,0);d.scale.set(0.14,0.4,W+0.1);d.updateMatrix();shut.setMatrixAt(i,d.matrix)}
    for(let k=0;k<3;k++){const al=(k-1)*W/3,h=0.3+((f.o2*7+k*3)%1)*0.45,p=P(al,-0.25);d.position.set(p[0],f.g+h/2,-p[1]);d.rotation.set(0,f.a,0);d.scale.set(0.4,h,W/3-0.15);d.updateMatrix();goods.setMatrixAt(gi,d.matrix);goods.setColorAt(gi,col.setHex(PAL[Math.floor(((f.o3*13+k*5)%1)*PAL.length)]));gi++}
    if(f.o3<(f.w>=4?0.45:0.3)&&f.w>=2.6){const p=P(0,-0.42);d.position.set(p[0],f.g+Hh+0.05,-p[1]);d.rotation.set(0,f.a,0.3);d.scale.set(0.85,0.04,W+0.2);d.updateMatrix();awn.setMatrixAt(ai,d.matrix);awn.setColorAt(ai,col.setHex(f.o<0.5?0x9c3b2c:0x2e5f7a));ai++}});
  awn.count=ai;[dark,shut,goods,awn].forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.userData={n:"חנויות ברחובות השוק",r:"תמונות רחוב (Mapillary, 2018–2023)",t:"📜 ברחובות השוק של העיר העתיקה (רחוב דוד, השלשלת, חאן א־זית, ויה דולורוזה, המוריסטן) קומת הרחוב היא שורה של חנויות פתוחות, עם סחורה לפני הפתח, תריס מתכת מעל, ולפעמים סוכך. 💡 צבעי הסחורה ומקום כל חנות בדיוק הם השלמה."};WG.add(m);PICK.push(m)});

}catch(e){console.warn("shops",e)}})();

// ---- 126.3 (תמונות Mapillary): כיכר החורבה וכיכר עומר אל־חטאב ----
// 📜 כיכר החורבה בתמונות: רחבה מרוצפת באבן בהירה עם פסים של אבן אדמדמה, עצים גדולים בערוגות אבן עגולות, ספסלים ופנסים. בדגם היה שם חול.
// 📜 כיכר עומר אל־חטאב (בתוך שער יפו): רחבה מרוצפת, פנסים גבוהים ודקים, ושמשיות וסחורה לפני החנויות שבצד הצפוני.
(function(){try{
  const inB=(x,n)=>{const L=CB.b.get(cbK(Math.floor(x/CB.st),Math.floor(n/CB.st)));if(!L)return false;for(const o of L){if(x<o.xa||x>o.xb||n<o.na||n>o.nb)continue;if(inPoly(x,n,o.p))return true}return false};
  const clear=(x,n,r)=>{for(let a=0;a<6.283;a+=0.785)if(inB(x+Math.cos(a)*r,n+Math.sin(a)*r))return false;return !inB(x,n)};
  const d=new THREE.Object3D(),MAT=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.85},o||{}));
  const put=(list,mat,info,geo,shadow)=>{if(!list.length)return;const m=new THREE.InstancedMesh(geo||new THREE.BoxGeometry(1,1,1),mat,list.length);list.forEach((q,i)=>{d.position.set(q[0],q[1],-q[2]);d.rotation.set(0,q[3]||0,0);d.scale.set(q[4],q[5],q[6]);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.instanceMatrix.needsUpdate=true;m.castShadow=shadow!==false;m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)};
  const lampM=MAT(0x34383c,{metalness:0.5}),stoneM=M.stoneL||MAT(0xd8ccb2),woodM=MAT(0x6b4a2f),leafM=MAT(0x4f6b34,{roughness:0.95}),barkM=MAT(0x5a4632);
  // 1) כיכר החורבה
  {const HI={n:"כיכר החורבה",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 רחבה מרוצפת באבן בהירה, עם פסים של אבן אדמדמה, עצים גדולים בערוגות אבן, ספסלים ופנסים, כמו בתמונות. 💡 המקום המדויק של כל עץ, ספסל ופנס הוא השלמה."};
    const X0=-405,X1=-350,N0=-314,N1=-280,free=(x,n)=>!inB(x,n)&&!onRoad(x,n),P=[],U=[],R=[];
    for(let x=X0;x<X1;x+=1)for(let n=N0;n<N1;n+=1){const cx=x+0.5,cn=n+0.5;if(!free(cx,cn))continue;
      const c=[[x,n],[x+1,n],[x+1,n+1],[x,n+1]].map(q=>[q[0],surfY(q[0],q[1])+0.05,q[1]]);
      const red=((cx-X0)%8<0.9)||((cn-N0)%8<0.9),A=red?R:P;[0,1,2,0,2,3].forEach(k=>{A.push(c[k][0],c[k][1],-c[k][2])})}
    [[P,M.pave||MAT(0xd9cdb4)],[R,MAT(0x9a5a44,{roughness:0.8})]].forEach(([A,mat])=>{if(!A.length)return;const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(A,3));const uv=[];for(let i=0;i<A.length;i+=3)uv.push(A[i]/3,A[i+2]/3);g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData=HI;WG.add(m);PICK.push(m)});
    const T=[];for(let x=X0+4;x<X1-3;x+=7)for(let n=N0+4;n<N1-3;n+=7){if(T.length>=6)break;if(!free(x,n)||!clear(x,n,4.5)||onRoad(x+3,n)||onRoad(x-3,n)||onRoad(x,n+3)||onRoad(x,n-3))continue;if(T.some(t=>Math.hypot(t[0]-x,t[1]-n)<8))continue;T.push([x,n,surfY(x,n)])}
    const PL=[],TR=[],CN=[],BE=[],BL=[],LP=[],LH=[];
    T.forEach(([x,n,g],i)=>{PL.push([x,g+0.25,n,0,2.8,0.5,2.8]);cwAdd(x,n,0,2.8,2.8,g-1,g+0.5);TR.push([x,g+1.9,n,0,0.35,3.3,0.35]);CN.push([x,g+4.6,n,i,4.2,3.2,4.2]);CN.push([x+0.9,g+5.6,n-0.6,i+1,2.8,2.4,2.8]);
      const a=i*1.3;BE.push([x+Math.cos(a)*2.4,g+0.45,n+Math.sin(a)*2.4,-a,0.5,0.08,1.8]);BL.push([x+Math.cos(a)*2.4,g+0.22,n+Math.sin(a)*2.4,-a,0.45,0.44,0.12])});
    const corners=[[X0+3,N0+3],[X1-3,N0+3],[X0+3,N1-3],[X1-3,N1-3],[(X0+X1)/2,(N0+N1)/2]];corners.forEach(([x0,n0])=>{let best=null;for(let r=0;r<8&&!best;r+=1)for(let a=0;a<6.283&&!best;a+=0.785){const x=x0+Math.cos(a)*r,n=n0+Math.sin(a)*r;if(free(x,n)&&clear(x,n,0.8)&&!T.some(t=>Math.hypot(t[0]-x,t[1]-n)<3))best=[x,n]}if(best){const g=surfY(best[0],best[1]);LP.push([best[0],g+2.25,best[1],0,0.12,4.5,0.12]);LH.push([best[0],g+4.6,best[1],0,0.45,0.35,0.45])}});
    window.__SQ={trees:T.length,hlamps:LP.length};    put(PL,stoneM,HI,new THREE.CylinderGeometry(0.5,0.5,1,20));put(TR,barkM,HI,new THREE.CylinderGeometry(0.4,0.5,1,7));put(CN,leafM,HI,new THREE.IcosahedronGeometry(0.5,1));put(BE,woodM,HI,null,false);put(BL,lampM,HI,null,false);
    put(LP,lampM,{n:"פנס רחוב",r:"תמונות רחוב (Mapillary)",t:"📜 פנסים בכיכר, כמו בתמונות. 💡 המקום של כל פנס הוא השלמה."});put(LH,MAT(0xf2e6c8,{emissive:0x332a18}),{n:"פנס רחוב",r:"תמונות רחוב (Mapillary)",t:"📜 פנסים בכיכר."})}
  // 2) כיכר עומר אל־חטאב: פנסים לאורך הרחבה, ושמשיות לפני החנויות בצד הצפוני
  {const OI={n:"כיכר עומר אל־חטאב",r:"תמונות רחוב (Mapillary, 2015–2023)",t:"📜 הרחבה שבתוך שער יפו: אבן מרוצפת, פנסים גבוהים ודקים, ושמשיות וסחורה לפני החנויות, כמו בתמונות. 📜 כמו בכל העיר העתיקה במודל, אין כאן נסיעה. 💡 המקום המדויק של כל פנס ושמשייה הוא השלמה."};
    const L=[[-722,-160.5],[-708,-155.8],[-695.7,-151.9],[-685,-148],[-672,-145.5],[-660,-143.5]],LP=[],LH=[],UP=[],UC=[],RK=[];let lastU=null;
    for(let i=0;i<L.length-1;i++){const a=L[i],b=L[i+1],dx=b[0]-a[0],dn=b[1]-a[1],len=Math.hypot(dx,dn),ux=dx/len,un=dn/len,px=-un,pn=ux;
      for(let s=0;s<len;s+=3){const x=a[0]+ux*s,n=a[1]+un*s;
        if(Math.round((i*len+s)/3)%4===0)[1,-1].forEach(sd=>{for(let q=7;q>=3;q-=0.5){const lx=x+px*q*sd,ln=n+pn*q*sd;if(onRoad(lx,ln)&&clear(lx,ln,0.6)){const g=surfY(lx,ln);LP.push([lx,g+3.5,ln,0,0.14,7,0.14]);LH.push([lx,g+7.05,ln,0,0.7,0.18,0.35]);break}}});
        let fd=-1,sg=1;for(let q=2;q<=18&&fd<0;q+=0.5)for(const z of [1,-1])if(fd<0&&inB(x+px*q*z,n+pn*q*z)){fd=q;sg=z}if(fd<0)continue;const ux2=x+px*sg*(fd-2.2),un2=n+pn*sg*(fd-2.2);
        if(!onRoad(ux2,un2)||!clear(ux2,un2,1.2)||(lastU&&Math.hypot(lastU[0]-ux2,lastU[1]-un2)<6.5)||UP.length>=6)continue;lastU=[ux2,un2];const g=surfY(ux2,un2);
        UP.push([ux2,g+1.15,un2,0,0.06,2.3,0.06]);UC.push([ux2,g+2.3,un2,UP.length,2.6,0.5,2.6]);
        const rx=x+px*sg*(fd-0.6),rn=n+pn*sg*(fd-0.6);RK.push([rx,surfY(rx,rn)+0.8,rn,Math.atan2(-ux,un),1.6,1.6,0.45])}}
    put(LP,lampM,OI);put(LH,MAT(0x2a2d30,{metalness:0.5}),OI);put(UP,MAT(0xdddddd,{metalness:0.4}),OI,new THREE.CylinderGeometry(0.5,0.5,1,6),false);
    put(UC,MAT(0xf3efe6,{side:THREE.DoubleSide}),OI,new THREE.ConeGeometry(0.5,1,8,1,true));put(RK,MAT(0xa8432f),OI);window.__SQ=Object.assign(window.__SQ||{},{lamps:LP.length,umb:UP.length})}
}catch(e){console.warn("squares",e)}})();

// ---- 126.8: עיר דוד — בריכת השילוח, רחוב העולים, מקוואות, מעיין הגיחון וגן המלך (תוכנית: city-of-david/תוכנית-עיר-דוד.md) ----
// 📜 נחמיה ג, טו: "ואת חומת ברכת השלח לגן המלך ועד המעלות היורדות מעיר דויד". הקואורדינטות ב־COD8 (10-setup).
(function(){try{
  const C=COD8,PL=C.pool,U=PL.U,A=PL.A,MAT=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.88},o||{}));
  const I=(n,r,t)=>({n,r,t});
  const INF={
    pool:I("בריכת השילוח","ישעיה ח, ו; נחמיה ג, טו; סוכה ד, ט; פרה ג, ב-ג","📜 \"מי השלח ההלכים לאט\" (ישעיה ח, ו). 📜 \"ואת חומת ברכת השלח לגן המלך ועד המעלות היורדות מעיר דויד\" (נחמיה ג, טו). ⚖️ מכאן ממלאים בסוכות את המים לניסוך: \"צלוחית של זהב מחזקת שלשת לוגים היה ממלא מן השילוח\" (סוכה ד, ט). ⚖️ לכאן יורדים הילדים שממלאים מים לפרה אדומה: \"הגיעו לשילוח, ירדו ומלאו ועלו\" (פרה ג, ב-ג). 📜 בחפירות נמצאה בריכה גדולה עם מדרגות סביב: שלוש מערכות של חמש מדרגות, ומשטח מנוחה ביניהן. 💡 המקום לפי צילום הלוויין, והגודל (כ־50 על 30 מ׳) בקירוב."),
    street:I("רחוב העולים — המעלות היורדות מעיר דוד","נחמיה ג, טו; יב, לז; ראש השנה טז ע״ב","📜 \"ועל שער העין ונגדם עלו על מעלות עיר דויד במעלה לחומה\" (נחמיה יב, לז). ⚖️ \"חייב אדם לטהר עצמו ברגל\" (ראש השנה טז ע״ב): העולים טובלים בשילוח ובמקוואות שבדרך, ועולים ברחוב הזה אל הר הבית. 📜 בחפירות נמצא רחוב מדורג רחב, מרוצף באבנים גדולות, שעולה מהשילוח צפונה בגיא. 💡 במודל הרחוב עובר על תוואי הכביש של היום, כי הרחוב הקדום חפור מתחתיו. אין בו מכוניות. 💡 הרוחב (7.5 מ׳), מקום המדרגות והפנסים הם הצעה."),
    mik:I("מקווה לעולים","יומא ג, ג; ראש השנה טז ע״ב","⚖️ \"אין אדם נכנס לעזרה לעבודה, אפילו טהור, עד שיטבול\" (יומא ג, ג). ⚖️ \"חייב אדם לטהר עצמו ברגל\" (ראש השנה טז ע״ב). 📜 לאורך הדרך לעיר נמצאו הרבה מקוואות חצובים, עם מדרגות ומחיצה באמצע: יורדים מצד אחד ועולים מהצד השני. 💡 המקום והמספר של המקוואות כאן הם הצעה."),
    gihon:I("מעיין הגיחון","מלכים א א, לג-לט; הוריות יב ע״א; דברי הימים ב לב, ל","📜 \"והורדתם אתו אל גחון, ומשח אתו שם צדוק הכהן ונתן הנביא למלך על ישראל\" (מלכים א א, לג-לד). ⚖️ \"אין מושחין את המלכים אלא על המעיין, כדי שתמשך מלכותן\" (הוריות יב ע״א). 📜 \"והוא יחזקיהו סתם את מוצא מימי גיחון העליון ויישרם למטה מערבה לעיר דויד\" (דברי הימים ב לב, ל): מכאן יוצאת נקבת חזקיהו, ובה המים עוברים מתחת לעיר אל בריכת השילוח. 💡 בית המעיין, המדרגות והבריכה הקטנה הם הצעה לתצוגה."),
    garden:I("גן המלך","נחמיה ג, טו; מלכים ב כה, ד","📜 \"ברכת השלח לגן המלך\" (נחמיה ג, טו). 📜 \"דרך שער בין החמתים אשר על גן המלך\" (מלכים ב כה, ד). 💡 הגן מוצג במקום שבו הגיא פוגש את נחל קדרון, לפי המסורת. העצים (זית, תאנה ותמר) הם הצעה.")};
  const GS={pave:[],wall:[],light:[],iron:[],water:[],dark:[]},MATS={pave:M.pave||M.stoneL,wall:M.stone||M.stoneL,light:M.stoneL,iron:M.iron||MAT(0x2b2b2b,{metalness:0.6,roughness:0.5}),water:MAT(0x3d7584,{roughness:0.12,metalness:0.1}),dark:MAT(0x2a2620,{roughness:1})};
  const GI={};Object.keys(GS).forEach(k=>GI[k]=[]);
  const add=(k,geo,x,y,n,rot,inf)=>{geo=geo.index?geo.toNonIndexed():geo;if(geo.attributes.uv2)geo.deleteAttribute("uv2");const m=new THREE.Matrix4().makeRotationY(rot||0);m.setPosition(x,y,-n);geo.applyMatrix4(m);GS[k].push(geo);GI[k].push(inf)};
  const PU=(u,v)=>[PL.c[0]+u*U[0]+v*A[0],PL.c[1]+u*U[1]+v*A[1]],rotP=Math.atan2(U[1],U[0]);
  const putP=(k,geo,u,v,y)=>{const q=PU(u,v);add(k,geo,q[0],y,q[1],rotP,INF.pool)};
  const top=(x,n)=>surfY(x,n);
  // ---- 1) בריכת השילוח ----
  const hw=PL.hw,hl=PL.hl;let y0=1e9;for(let u=-hw;u<=hw;u+=3)for(const v of [-hl,hl]){const q=PU(u,v);y0=Math.min(y0,top(q[0],q[1]))}for(let v=-hl;v<=hl;v+=3)for(const u of [-hw,hw]){const q=PU(u,v);y0=Math.min(y0,top(q[0],q[1]))}
  y0=Math.round((y0+0.25)*10)/10;const NST=15,RISE=0.2,TREAD=0.42,LAND=1.4,fl=y0-NST*RISE-0.3,wl=y0-NST*RISE+0.7;
  const inset=k=>k*TREAD+Math.floor(k/5)*LAND;
  for(let k=0;k<NST;k++){const a=inset(k),b=inset(k+1),yt=y0-RISE*(k+1),h=yt-fl,w=b-a;
    putP("light",wbox(w,h,2*(hl-a),3),-hw+a+w/2,0,fl+h/2);putP("light",wbox(w,h,2*(hl-a),3),hw-a-w/2,0,fl+h/2);
    putP("light",wbox(2*(hw-b),h,w,3),0,-hl+a+w/2,fl+h/2);putP("light",wbox(2*(hw-b),h,w,3),0,hl-a-w/2,fl+h/2)}
  {const b=inset(NST);putP("pave",wbox(2*(hw-b)+0.02,0.4,2*(hl-b)+0.02,3),0,0,fl-0.2+0.01);putP("water",new THREE.BoxGeometry(2*(hw-inset(11))-0.1,0.05,2*(hl-inset(11))-0.1),0,0,wl)}
  // שפת הבריכה: קיר תמך מסביב, מגובה הקרקע עד שפת האבן (בצד הנמוך הבריכה עומדת על בסיס, בצד הגבוה הקרקע נעצרת בקיר)
  const edge=(u0,v0,u1,v1)=>{const L=Math.hypot(u1-u0,v1-v0),nn=Math.max(1,Math.ceil(L/2.5)),horiz=Math.abs(v1-v0)<1e-6;for(let k=0;k<nn;k++){const t=(k+0.5)/nn,uu=u0+(u1-u0)*t,vv=v0+(v1-v0)*t,q=PU(uu,vv),g=top(q[0],q[1]),lo=Math.min(g,y0)-0.6,hi=Math.max(g,y0)+0.25,len=L/nn+0.02;
      const W=(h,d)=>horiz?wbox(len,h,d,3):wbox(d,h,len,3);putP("wall",W(hi-lo,1.2),uu,vv,(hi+lo)/2);putP("light",W(0.16,1.4),uu,vv,hi+0.08);
      if(g<y0+0.9){putP("iron",W(0.06,0.06),uu,vv,hi+1.05);putP("iron",new THREE.CylinderGeometry(0.03,0.03,0.9,6),uu,vv,hi+0.6)}}
    const a=PU(u0,v0),b=PU(u1,v1);cwAdd((a[0]+b[0])/2,(a[1]+b[1])/2,Math.atan2(b[1]-a[1],b[0]-a[0]),L,1.4,fl-1,y0+3)};
  const E=0.6;edge(-hw-E,-hl-E,hw+E,-hl-E);edge(-hw-E,hl+E,hw+E,hl+E);edge(-hw-E,-hl-E,-hw-E,hl+E);edge(hw+E,-hl-E,hw+E,hl+E);
  // מסכת עומק מעל הפתח: הקרקע לא נראית בתוך הבריכה (כמו בקרדו)
  {const nu=Math.ceil(2*hw/1.5),nv=Math.ceil(2*hl/1.5),pos=[],idx=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const u=-hw+0.1+(2*hw-0.2)*i/nu,v=-hl+0.1+(2*hl-0.2)*j/nv,q=PU(u,v);pos.push(q[0],Math.max(top(q[0],q[1]),y0)+0.32,-q[1])}
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;idx.push(a,c,b,b,c,d)}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);
    const mk=new THREE.Mesh(g,new THREE.MeshBasicMaterial({colorWrite:false,side:THREE.DoubleSide}));mk.renderOrder=-1;mk.name="codMask";mk.frustumCulled=false;WG.add(mk)}
  PL.y0=y0;PL.fl=fl;PL.wl=wl;
  // ---- 2) רחוב העולים: מדרגות (שורת אבן כל פעם שהרחוב עולה 16 ס״מ, ולפחות כל 7 מ׳), אבני שפה ופנסים ----
  const SR=ROADS.filter(rd=>rd.cod),LP=[],LH=[];let lampSide=1;
  SR.forEach(rd=>{const P=rd.p;let last=null,dist=0,since=0;
    for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<0.05)continue;const ux=(b[0]-a[0])/L,un=(b[1]-a[1])/L,px=-un,pn=ux,rot=Math.atan2(un,ux);
      for(let s=0;s<L;s+=0.6){const x=a[0]+ux*s,n=a[1]+un*s,y=top(x,n);since+=0.6;dist+=0.6;
        if(last===null)last=y;if(Math.abs(y-last)>=0.16||since>=7){add("light",wbox(0.4,0.2,rd.w-0.3,2),x,Math.max(y,last)-0.04,n,rot,INF.street);last=y;since=0}
        if(Math.round(dist/0.6)%4===0)[1,-1].forEach(sd=>{const cx=x+px*sd*(rd.w/2+0.25),cn=n+pn*sd*(rd.w/2+0.25);add("wall",wbox(2.45,0.42,0.42,2),cx,top(cx,cn)+0.12,cn,rot,INF.street)});
        if(Math.round(dist/0.6)%36===0){const cx=x+px*lampSide*(rd.w/2+0.9),cn=n+pn*lampSide*(rd.w/2+0.9),g=top(cx,cn);LP.push([cx,g+2.1,cn,0,0.12,4.2,0.12]);LH.push([cx,g+4.35,cn,0,0.42,0.42,0.42]);lampSide=-lampSide}}}});
  // ---- 3) מקוואות: אחד ליד הבריכה ושניים לאורך העלייה. מבנה אבן קטן עם שני פתחים (יורדים בזה ועולים בזה) ----
  const inB=(x,n)=>{const L=CB.b.get(cbK(Math.floor(x/CB.st),Math.floor(n/CB.st)));if(!L)return false;for(const o of L){if(x<o.xa||x>o.xb||n<o.na||n>o.nb)continue;if(inPoly(x,n,o.p))return true}return false};
  const MIK=[];[[-80,-872],[-98,-650],[-45,-480]].forEach(t=>{let best=null;for(let r=0;r<26&&!best;r+=2)for(let a=0;a<6.283&&!best;a+=0.524){const x=t[0]+Math.cos(a)*r,n=t[1]+Math.sin(a)*r;const sd=segDist(x,n,C.way)[0],q=C.loc(x,n);if(sd<9||sd>16||(Math.abs(q[0])<hw+7&&Math.abs(q[1])<hl+7))continue;if([[4,0],[-4,0],[0,4],[0,-4],[0,0]].some(o=>inB(x+o[0],n+o[1])||onRoad(x+o[0],n+o[1])))continue;best=[x,n]}if(best)MIK.push(best)});
  MIK.forEach(([x,n])=>{let k=0,bd=1e9;for(let i=0;i<C.way.length-1;i++){const d=segDist(x,n,[C.way[i],C.way[i+1]])[0];if(d<bd){bd=d;k=i}}const a=C.way[k],b=C.way[k+1],rot=Math.atan2(b[1]-a[1],b[0]-a[0]);
    let g=1e9;[[3.5,3],[-3.5,3],[3.5,-3],[-3.5,-3]].forEach(o=>{const xx=x+Math.cos(rot)*o[0]-Math.sin(rot)*o[1],nn=n+Math.sin(rot)*o[0]+Math.cos(rot)*o[1];g=Math.min(g,top(xx,nn))});
    add("wall",wbox(7,4.2,6,3),x,g+2.0,n,rot,INF.mik);add("light",wbox(7.4,0.3,6.4,3),x,g+4.2,n,rot,INF.mik);
    const ux=Math.cos(rot),un=Math.sin(rot),px=-un,pn=ux,side=segDist(x+px*3,n+pn*3,C.way)[0]<segDist(x-px*3,n-pn*3,C.way)[0]?1:-1;
    [-1.6,1.6].forEach(o=>{const dx=x+ux*o+px*side*3.02,dn=n+un*o+pn*side*3.02;add("dark",wbox(1.1,2.2,0.08,1),dx,g+1.1,dn,rot,INF.mik)});
    cwAdd(x,n,rot,7,6,g-1,g+4.5)});
  // ---- 4) מעיין הגיחון: בית מעיין מאבן במורד, מדרגות יורדות אל פתח המערה, בריכה קטנה ותעלה ----
  {const [gx,gn]=C.gihon;let g=1e9,gh=-1e9;for(let a=0;a<6.283;a+=0.785){const y=top(gx+Math.cos(a)*6,gn+Math.sin(a)*6);g=Math.min(g,y);gh=Math.max(gh,y)}
    const rot=0;/* הפתח פונה מזרחה, אל הנחל */
    add("wall",wbox(10,Math.max(5,gh-g+4),9,3),gx-2,g+Math.max(5,gh-g+4)/2-0.5,gn,rot,INF.gihon);
    {const s=new THREE.Shape();s.moveTo(-2,0);s.lineTo(-2,2.4);s.absarc(0,2.4,2,Math.PI,0,true);s.lineTo(2,0);s.lineTo(-2,0);const ag=new THREE.ExtrudeGeometry(s,{depth:0.3,bevelEnabled:false});ag.rotateY(Math.PI/2);add("dark",ag,gx+3.05,g,gn,0,INF.gihon)}
    add("light",wbox(1.2,0.5,6,2),gx+3.4,g+4.7,gn,0,INF.gihon);
    for(let k=0;k<6;k++)add("light",wbox(0.9,0.6,5,2),gx+3.9+k*0.9,g-0.2*(k+1)-0.3,gn,0,INF.gihon);
    const pc=[gx+12,gn],pg=top(pc[0],pc[1]),py=Math.min(pg,g-1.1);add("wall",wbox(7,1.2,6,3),pc[0],py-0.1,pc[1],0,INF.gihon);add("water",new THREE.BoxGeometry(5.8,0.05,4.8),pc[0],py+0.42,pc[1],0,INF.gihon);
    add("light",wbox(7.4,0.2,6.4,3),pc[0],py+0.6,pc[1],0,INF.gihon);cwAdd(gx-2,gn,0,10,9,g-1,g+6);C.gihonY=g}
  // merge by material; each merged mesh carries the card of its first part (the cards differ by area, so split by card)
  Object.keys(GS).forEach(k=>{const by=new Map();GS[k].forEach((geo,i)=>{const inf=GI[k][i];if(!by.has(inf))by.set(inf,[]);by.get(inf).push(geo)});
    by.forEach((list,inf)=>{const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(list,false);if(!mg)return;const m=new THREE.Mesh(mg,MATS[k]);m.renderOrder=inf===INF.pool?-2:0;m.castShadow=k!=="pave"&&k!=="water";m.receiveShadow=true;m.userData=inf;WG.add(m);PICK.push(m)})});
  {const d=new THREE.Object3D(),put=(list,mat,info)=>{if(!list.length)return;const m=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat,list.length);list.forEach((q,i)=>{d.position.set(q[0],q[1],-q[2]);d.rotation.set(0,0,0);d.scale.set(q[4],q[5],q[6]);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.instanceMatrix.needsUpdate=true;m.castShadow=true;m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)};
    put(LP,MAT(0x34383c,{metalness:0.5}),INF.street);put(LH,MAT(0xf2e6c8,{emissive:0x332a18}),INF.street)}
  // ---- 5) גן המלך: זיתים, תאנים ותמרים ----
  {const r=rng(1268),T={olive:[],fig:[],palm:[]};let xa=1e9,xb=-1e9,na=1e9,nb=-1e9;C.garden.forEach(q=>{xa=Math.min(xa,q[0]);xb=Math.max(xb,q[0]);na=Math.min(na,q[1]);nb=Math.max(nb,q[1])});
    for(let x=xa;x<xb;x+=6.5)for(let n=na;n<nb;n+=6.5){const xx=x+(r()-0.5)*3,nn=n+(r()-0.5)*3;if(!inPoly(xx,nn,C.garden)||onRoad(xx,nn)||inB(xx,nn))continue;const q=r(),k=q<0.55?"olive":q<0.85?"fig":"palm";T[k].push([xx,TY(xx,nn),-nn,0.8+r()*0.35,r()*6.28])}
    Object.keys(T).forEach(k=>{if(T[k].length)TREES5.plant(WG,k,T[k],INF.garden)});C.trees=T.olive.length+T.fig.length+T.palm.length}
  // ---- תוויות לחיפוש ולטיסה ----
  __AFTER(()=>{try{const L=(t,x,n,y,inf)=>{const q=G2S(x,n);label(t,q[0],y,-q[1],null,inf)};
    L("בריכת השילוח",PL.c[0],PL.c[1],y0+9,INF.pool);L("מעיין הגיחון",C.gihon[0],C.gihon[1],(C.gihonY||0)+10,INF.gihon);L("גן המלך",33,-918,TY(33,-918)+9,INF.garden);
    const mid=C.way[14];L("רחוב העולים",mid[0],mid[1],TY(mid[0],mid[1])+8,INF.street)}catch(e){console.warn("cod labels",e)}});
  window.__COD8={mik:MIK.length,lamps:LP.length,steps:GS.light.length,trees:C.trees,y0,streets:SR.length};
}catch(e){console.warn("cityOfDavid",e)}})();

// ---- 126.9: מקום המשואות בראש הר הזיתים (📜 ראש השנה ב, ד: "ומאין היו משיאין משואות? מהר המשחה לסרטבא") ----
(function(){try{
  let best=null;for(let r=0;r<=90;r+=6)for(let a=0;a<6.283;a+=r?6/r:7){const x=840+Math.cos(a)*r,n=50+Math.sin(a)*r;const L=CB.b.get(cbK(Math.floor(x/CB.st),Math.floor(n/CB.st)));let inb=false;if(L)for(const o of L)if(x>=o.xa&&x<=o.xb&&n>=o.na&&n<=o.nb&&inPoly(x,n,o.p))inb=true;if(inb||onRoad(x,n))continue;const h=TY(x,n);if(!best||h>best[2])best=[x,n,h]}
  if(!best)return;const [x,n]=best;let g=1e9;for(let a=0;a<6.283;a+=0.785)g=Math.min(g,TY(x+Math.cos(a)*5,n+Math.sin(a)*5));
  const inf={n:"מקום המשואות",r:"ראש השנה ב, ב-ד",t:"📜 \"ומאין היו משיאין משואות? מהר המשחה לסרטבא\" (ראש השנה ב, ד). 📜 כך הודיעו לכל הגולה שבית הדין קידש את החודש: \"מביאין כלונסות של ארז ארוכין וקנים ועצי שמן ונעורת של פשתן... ומוליך ומביא ומעלה ומוריד, עד שהוא רואה את חבירו שהוא עושה כן בראש ההר השני\" (ראש השנה ב, ג). 📜 המשנה מספרת שאחר כך החליפו את המשואות בשלוחים (ראש השנה ב, ב). 💡 כאן מוצג המקום בראש ההר, עם רחבת אבן, כלונסות ארז ועצים מוכנים. אם ידליקו משואות בזמן הבא, זו הצעה."};
  const GS=[],WD=[],add=(arr,geo,px,py,pn,rx,rz)=>{geo=geo.index?geo.toNonIndexed():geo;if(geo.attributes.uv2)geo.deleteAttribute("uv2");const m=new THREE.Matrix4();m.makeRotationFromEuler(new THREE.Euler(rx||0,0,rz||0));m.setPosition(px,py,-pn);geo.applyMatrix4(m);arr.push(geo)};
  add(GS,wbox(12,Math.max(1,best[2]-g+1),12,3),x,g+(best[2]-g+1)/2-0.6,n);add(GS,wbox(12.4,0.25,12.4,3),x,best[2]+0.5,n);
  add(GS,wbox(3,0.9,3,2),x,best[2]+1.05,n);
  for(let k=0;k<6;k++){const a=k*Math.PI/3;add(WD,new THREE.CylinderGeometry(0.09,0.12,7,6),x+Math.cos(a)*0.4,best[2]+4.3,n+Math.sin(a)*0.4,Math.sin(a)*0.06,-Math.cos(a)*0.06)}
  for(let k=0;k<8;k++)add(WD,new THREE.CylinderGeometry(0.12,0.12,3.6,6),x+3.2+(k%4)*0.28,best[2]+0.75+Math.floor(k/4)*0.25,n-3.5,0,Math.PI/2);
  [[GS,M.stoneL||M.stone],[WD,M.wood||new THREE.MeshStandardMaterial({color:0x6b4a2f,roughness:0.9})]].forEach(([arr,mat])=>{const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(arr,false);if(!mg)return;const m=new THREE.Mesh(mg,mat);m.castShadow=true;m.receiveShadow=true;m.userData=inf;WG.add(m);PICK.push(m)});
  cwAdd(x,n,0,12,12,g-1,best[2]+0.5);
  __AFTER(()=>{try{const q=G2S(x,n);label("מקום המשואות",q[0],best[2]+12,-q[1],null,inf)}catch(e){console.warn("beacon label",e)}});
  window.__BEACON=best;
}catch(e){console.warn("beacon",e)}})();

/* 126.1 (בדיקה חוזרת 35): מידות הקרדו החפור, וגובה ההליכה בתוכו (קואורדינטות גאוגרפיות x מזרח, n צפון) */
function cardoGeom(){if(cardoGeom.C)return cardoGeom.C;const cx=-418,cn=-329,L=Math.hypot(0.03,1),vx=0.03/L,vn=1/L,ux=vn,un=-vx,hw=10,hl=12,stw=2,su=3.6;
  const top=(x,n)=>surfY(x,n);let mn=1e9;for(let u=-hw;u<=hw;u+=2)for(let v=-hl;v<=hl;v+=2){const x=cx+u*ux+v*vx,n=cn+u*un+v*vn;mn=Math.min(mn,top(x,n))}
  const floor=Math.round((mn-3)*10)/10,sx=cx+su*ux+hl*vx,sn=cn+su*un+hl*vn,stTop=top(sx,sn),run=Math.max(6,(stTop-floor)/0.56);
  return cardoGeom.C={cx,cn,ux,un,vx,vn,hw,hl,stw,su,floor,stTop,run,top}}
function cardoY(x,n){const C=cardoGeom.C;if(!C)return null;const dx=x-C.cx,dn=n-C.cn,u=dx*C.ux+dn*C.un,v=dx*C.vx+dn*C.vn;if(Math.abs(u)>C.hw||Math.abs(v)>C.hl)return null;
  if(Math.abs(u-C.su)<=C.stw&&v>C.hl-C.run){const t=(v-(C.hl-C.run))/C.run;return C.floor+(C.stTop-C.floor)*t}return C.floor}
