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
const archOn=(x,n,nrot,y,w,h,dep,frame)=>{const rot=nrot+Math.PI/2;const g=archG(w,h,dep);g.translate(0,0,0.12);add("dark",g,x,y,n,rot);if(frame){const f=archG(w+1.4,h+0.8,0.7,[w,h]);f.translate(0,0,0.4);add("light",f,x,y,n,rot)}};
const tower=(x,n,w,d,h,rot,k)=>{let lo=1e9,hi=-1e9;[[-1,-1],[1,-1],[1,1],[-1,1],[0,0]].forEach(q=>{const p=off(x,n,rot,q[0]*w/2,q[1]*d/2),y=lg(p[0],p[1]);lo=Math.min(lo,y);hi=Math.max(hi,y)});
  const base=lo-2,top=Math.min(hi+h,LCAP-2.4);add(k||"wall",wbox(w,top-base,d,6),x,(base+top)/2,n,rot);
  add(k||"wall",wbox(w+1.6,hi-base+2.2,d+1.6,6),x,(base+hi+2.2)/2,n,rot); // battered plinth
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
{const x=-723,n=-252,g=lg(x,n),vm=Math.max(0.35,Math.min(1,(LCAP-g)/38.5)),y0=g+12*vm,Z=(geo)=>{geo.scale(1,vm,1);return geo};
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
  const c=off(gx,gn,rot,0,out*2),t=tower(c[0],c[1],16,14,17,rot);
  // outer arch on the end of the tower that faces north (along the wall), inner arch on the city side
  const sx=Math.sin(rot)>0?1:-1,fo=off(c[0],c[1],rot,sx*8,0),nOut=sx>0?rot:rot+Math.PI;
  archOn(fo[0],fo[1],nOut,t.hi,4.2,7.5,6,true);
  const fi=off(c[0],c[1],rot,0,-out*7),nIn=rot+(out>0?-Math.PI/2:Math.PI/2);archOn(fi[0],fi[1],nIn,t.hi,4.2,7.5,6,true);
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
// ===== the Cardo: a row of Roman/Byzantine columns in the excavated street west of the Hurva =====
begin({n:"הקרדו",r:"הרובע היהודי",t:"📜 הרחוב הראשי של ירושלים הביזנטית (המאה ה־6), ברוחב של כ־22 מ׳, עם עמודים משני הצדדים. 📜 חלק ממנו נחשף ברובע היהודי. 💡 כאן מוצגות שתי שורות עמודים, בלי התעלה החפורה."});
[-425.5,-410.5].forEach(cx=>{for(let n=-339;n<=-317;n+=3.6){const x=cx+(n+330)*0.03,g=G(x,n);A("light",wbox(0.9,0.5,0.9,2),x,g+0.25,n,0);A("light",new THREE.CylinderGeometry(0.32,0.36,4.2,12),x,g+0.5+2.1,n,0);A("light",wbox(0.95,0.45,0.95,2),x,g+4.9,n,0)}
  const g=G(cx,-328);A("light",wbox(0.9,0.7,23,3),cx,g+5.47,-328,0.03)});
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
  const top=Math.min(hi+14,LCAP-2.4),base=lo-2;add("wall",wbox(w,top-base,d,6),c[0],(top+base)/2,c[1],rot);add("wall",wbox(w+1.4,hi-base,d+1.4,6),c[0],(hi+base)/2,c[1],rot);
  [d/2-0.4,-d/2+0.4].forEach(o=>{const p=off(c[0],c[1],rot,0,o);crenel(p[0],p[1],rot,w,top)});[w/2-0.4,-w/2+0.4].forEach(o=>{const p=off(c[0],c[1],rot,o,0);crenel(p[0],p[1],rot+Math.PI/2,d-1.6,top)});
  // outer arch: on the east end of the tower (along the wall); inner arch: on the city (north) side
  const sx=Math.cos(rot)>0?1:-1,fo=off(c[0],c[1],rot,sx*w/2,0),nOut=sx>0?rot:rot+Math.PI;
  archOn("light",fo[0],fo[1],nOut,hi,5.4,8.3,0.7,0.4,[4,7.5],true);archOn("dark",fo[0],fo[1],nOut,hi,4,7.5,5,0.12,null,true);sillSteps(add,off,L,fo[0],fo[1],nOut,hi,4);
  const fi=off(c[0],c[1],rot,0,d/2),nIn=rot+Math.PI/2;archOn("light",fi[0],fi[1],nIn,hi,5.4,8.3,0.7,0.4,[4,7.5],true);archOn("dark",fi[0],fi[1],nIn,hi,4,7.5,5,0.12,null,true);sillSteps(add,off,L,fi[0],fi[1],nIn,hi,4);
  // bullet marks: small dark chips scattered on the outer face, thickest around the arch
  const rr=rng(1948);for(let i=0;i<260;i++){const u=(rr()-0.5)*(d-1),v=hi+0.6+rr()*(top-hi-1.5);if(Math.abs(u)<2.2&&v<hi+7.6)continue;const p=off(fo[0],fo[1],nOut,0.06,0);const q=off(p[0],p[1],nOut,0,u);const s=0.07+rr()*0.12;add("chip",new THREE.BoxGeometry(0.16,s,s*(0.8+rr()*0.5)),q[0],v,q[1],nOut)}}
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
function gateTower(gx0,gn0,w,d,h,pointed,keep){const wd=wallDir(gx0,gn0),rot=wd[1],gx=keep?gx0:wd[2],gn=keep?gn0:wd[3],lx=-Math.sin(rot),ln=Math.cos(rot),out=((gx+380)*lx+(gn-0)*ln)>0?1:-1;
  let lo=1e9,hi=-1e9;[[-1,-1],[1,-1],[1,1],[-1,1],[0,0]].forEach(q=>{const p=off(gx,gn,rot,q[0]*w/2,q[1]*d/2);lo=Math.min(lo,Lo(p[0],p[1]));hi=Math.max(hi,G(p[0],p[1]))});
  const top=Math.min(hi+h,LCAP-3.6),base=lo-2;add("wall",wbox(w,top-base,d,6),gx,(top+base)/2,gn,rot);add("wall",wbox(w+1.4,hi-base,d+1.4,6),gx,(hi+base)/2,gn,rot);
  [d/2-0.4,-d/2+0.4].forEach(o=>{const p=off(gx,gn,rot,0,o);crenel(p[0],p[1],rot,w,top,pointed)});[w/2-0.4,-w/2+0.4].forEach(o=>{const p=off(gx,gn,rot,o,0);crenel(p[0],p[1],rot+Math.PI/2,d-1.6,top,pointed)});
  return{rot,out,hi,top,lo,gx,gn,nOut:rot+out*Math.PI/2,nIn:rot-out*Math.PI/2}}
const gateArch=(x,n,a,y,w,h)=>{archOn("light",x,n,a,y,w+1.4,h+0.8,0.7,0.4,[w,h],true);archOn("dark",x,n,a,y,w,h,5,0.12,null,true);sillSteps(add,off,Lo,x,n,a,y,w)};
// ===== Damascus Gate: the grandest of the Ottoman gates =====
begin({n:"שער שכם",r:"שערי העיר העתיקה",t:"📜 השער המפואר ביותר בחומות סולימאן (1537), על מקום שער רומי. 📜 שני מגדלים, קשת מחודדת גבוהה, ושורת שיניים מחודדות בראש החומה. 📜 לפני השער יש רחבה במדרגות, כמו תיאטרון, שיורדת אל השער. 💡 מכאן יוצא חאן א־זית דרומה, אל לב העיר."});
{const T=gateTower(-467,418,15,11,14,true),gx=T.gx,gn=T.gn;
  const fo=off(gx,gn,T.rot,0,T.out*5.5);gateArch(fo[0],fo[1],T.nOut,T.hi,5,9);const fi=off(gx,gn,T.rot,0,-T.out*5.5);gateArch(fi[0],fi[1],T.nIn,T.hi,4.4,7.5);
  const mp=off(fo[0],fo[1],T.nOut,0.9,0);add("wall",wbox(1.8,2.2,5,4),mp[0],T.hi+11.6,mp[1],T.nOut+Math.PI/2);
  [-1,1].forEach(s=>{const c=off(gx,gn,T.rot,s*10.8,T.out*0.6),t2=gateTower(c[0],c[1],6.5,8.5,15.5,true,true)});
  // the stepped plaza in front, falling towards the gate (half rings, rising outwards)
  const cx=off(gx,gn,T.rot,0,T.out*6.5);for(let i=1;i<=7;i++){const r0=7+(i-1)*2.4,r1=r0+2.4,s=new THREE.Shape();const a0=T.nOut-Math.PI/2;s.absarc(0,0,r1,0,Math.PI,false);s.absarc(0,0,r0,Math.PI,0,true);
    const g=new THREE.ExtrudeGeometry(s,{depth:i*0.42+1.2,bevelEnabled:false,curveSegments:16});g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)/3,uv.getY(q)/3);add("pave",g,cx[0],T.hi-1.2,cx[1],-a0)}}
// ===== Herod's Gate (Flowers Gate): a smaller gate with a bent entrance =====
begin({n:"שער הפרחים",r:"שערי העיר העתיקה",t:"📜 שער קטן בצפון החומה, עם כניסה מכופפת: הפתח החיצוני בצד המגדל. 📜 על השער יש עיטור אבן בצורת פרח, ומכאן שמו בעברית. 💡 מכאן מגיע אחד ממסלולי העולים לרגל."});
{const T=gateTower(-162.5,549,12,12,12,false),gx=T.gx,gn=T.gn;const sx=Math.cos(T.rot)>0?1:-1,fo=off(gx,gn,T.rot,sx*6,0);gateArch(fo[0],fo[1],sx>0?T.rot:T.rot+Math.PI,T.hi,3.6,6.4);
  const fi=off(gx,gn,T.rot,0,-T.out*6);gateArch(fi[0],fi[1],T.nIn,T.hi,3.6,6.4);
  const fl=off(gx,gn,T.rot,0,T.out*6.15);add("light",new THREE.CylinderGeometry(0.9,0.9,0.3,12).rotateX(Math.PI/2),fl[0],T.hi+8.2,fl[1],T.nOut+Math.PI/2)}
// ===== Lions Gate: a straight gate with two pairs of reliefs =====
begin({n:"שער האריות",r:"שערי העיר העתיקה",t:"📜 שער במזרח החומה, מול הר הזיתים. 📜 משני צדי הפתח יש ארבעה תבליטים של חיות (בעצם נמרים), סמל של הסולטן בייברס. 📜 דרך השער הזה פרצו הצנחנים לעיר העתיקה בשנת 1967. 💡 מכאן נכנסים מהר הזיתים ומבית שער הפרה."});
{const T=gateTower(144.2,314.5,14,9,11,false),gx=T.gx,gn=T.gn;const fo=off(gx,gn,T.rot,0,T.out*4.5);gateArch(fo[0],fo[1],T.nOut,T.hi,3.6,6.6);const fi=off(gx,gn,T.rot,0,-T.out*4.5);gateArch(fi[0],fi[1],T.nIn,T.hi,3.6,6.6);
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
for(let i=0;i<WALL_LINE.length-1;i++){const a=WALL_LINE[i],b=WALL_LINE[i+1],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn),ang=Math.atan2(dn,dx),nt=Math.floor(L/110);
  for(let k=1;k<=nt;k++){const t=k/(nt+1),x=a[0]+dx*t,n=a[1]+dn*t,top=H(x,n)-2+17;
    [4-0.4,-4+0.4].forEach(o=>{const p=off(x,n,ang,0,o);crenel(p[0],p[1],ang,9,top)});[4.5-0.4,-4.5+0.4].forEach(o=>{const p=off(x,n,ang,o,0);crenel(p[0],p[1],ang+Math.PI/2,6.4,top)});
    [-2.2,2.2].forEach(u=>{const p=off(x,n,ang,u,0);add("dark",new THREE.BoxGeometry(0.4,1.6,8.3),p[0],top-5,p[1],ang)})}}
// the New Gate (1889): a straight gate between two small battlemented towers
{const g0=[-871.6,144.3];let best=[1e9,0,0,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],b=WALL_LINE[i],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((g0[0]-a[0])*dx+(g0[1]-a[1])*dn)/l2)),d=Math.hypot(a[0]+dx*t-g0[0],a[1]+dn*t-g0[1]);if(d<best[0])best=[d,Math.atan2(dn,dx),a[0]+dx*t,a[1]+dn*t]}
  const rot=best[1],gx=best[2],gn=best[3],lx=-Math.sin(rot),ln=Math.cos(rot),out=((gx+380)*lx+gn*ln)>0?1:-1,base=Math.min(H(gx,gn),TY(gx,gn))-2,hi=Math.max(H(gx,gn),TY(gx,gn)),top=Math.min(hi+13,LCAP-2.4);
  add("wall",wbox(9,top-base,5,6),gx,(top+base)/2,gn,rot);[4.5-0.4,-4.5+0.4].forEach(o=>{});crenel(...off(gx,gn,rot,0,out*2.1),rot,9,top);
  [-1,1].forEach(s=>{const c=off(gx,gn,rot,s*6.5,out*0.8);add("wall",wbox(4.5,top+2-base,6.6,6),c[0],(top+2+base)/2,c[1],rot);[3.3-0.4,-3.3+0.4].forEach(o=>{const p=off(c[0],c[1],rot,0,o);crenel(p[0],p[1],rot,4.5,top+2)})});
  [1,-1].forEach(s=>{const f=off(gx,gn,rot,0,s*2.5);const nrm=rot+s*Math.PI/2;archOn("light",f[0],f[1],nrm,hi,5.6,8,0.6,0.35,[4.2,7.3]);archOn("dark",f[0],f[1],nrm,hi,4.2,7.3,5.2,0.1)})}
const info={n:"חומות העיר העתיקה",r:"נבנו בימי סולימאן, 1537–1541",t:"📜 החומות של היום, באורך של כ־4 ק״מ, עם כ־34 מגדלים ושבעה שערים פתוחים. 📜 בראש החומות ובראש המגדלים יש שיניים (צינה) וחרכי ירי. 💡 המגדלים במודל עומדים במרחקים קבועים, ולא בדיוק במקומות האמיתיים. 📜 השער החדש נפתח רק בשנת 1889."};
const MAT={wall:M.wall,dark:M.dark,light:M.stone||M.stoneL};
Object.keys(GS).forEach(k=>{if(!GS[k].length)return;const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS[k],false);if(!mg)return;const m=new THREE.Mesh(mg,MAT[k]);m.castShadow=true;m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m)});
}catch(e){console.warn("area8",e)}})();

// ---- topic 3: the Southern Steps before the Double (Huldah) Gate, 64 m wide, rising 6.8 m ----
(function(){try{const GS=[];const ox=0.1743,on=-0.9847,R=0.1752;
  for(let k=0;k<30;k++){const tc=6+0.7*k+0.35,top=HUL-(k+1)*6.8/30,bot=HUL-8.2,g=wbox(64,top-bot,0.74,4),m=new THREE.Matrix4().makeRotationY(R);m.setPosition(45+ox*tc,(top+bot)/2,-(-237.15+on*tc));g.applyMatrix4(m);if(g.attributes.uv2)g.deleteAttribute("uv2");GS.push(g.index?g.toNonIndexed():g)}
  const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(GS,false);if(!mg)return;const me=new THREE.Mesh(mg,M.pave||M.stone2||M.wall);me.receiveShadow=true;me.castShadow=true;
  me.userData={n:"המדרגות הדרומיות",r:"חפירות העופל; מדידות וורן וכספי",t:"📜 מדרגות רחבות, כ־64 מטר, שעולות מהרחוב שמדרום להר אל שערי חולדה. 📜 מפתן השערים בגובה 725.4 מטר, והמדרגות עולות אליו כ־6.8 מטר. 💡 במודל יש 30 מדרגות שוות. במציאות המדרגות לא שוות: מדרגה צרה ומדרגה רחבה לסירוגין."};WG.add(me);PICK.push(me)}catch(e){console.warn("ssteps",e)}})();
