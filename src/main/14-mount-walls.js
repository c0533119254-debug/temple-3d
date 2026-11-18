// ---- Temple Mount platform ----
(function(){
  const s=new THREE.Shape();mountNotched().forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:130,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-130,0);
  const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/9,uv.getY(i)/9);
  const pp=g.attributes.position,sg=g.groups[1];for(let i=sg.start;i<sg.start+sg.count;i++)uv.setXY(i,(pp.getX(i)+pp.getZ(i))/4.2,pp.getY(i)/4.2);
  const top=new THREE.MeshStandardMaterial({map:T.pavC,normalMap:T.pavN,roughness:0.85});PLATTOP=top;
  const hc=LTX("tex_sand_diff.jpg"),hn=LTX("tex_sand_nor.jpg");[hc,hn].forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8});hc.encoding=THREE.sRGBEncoding;
  const herod=new THREE.MeshStandardMaterial({map:hc,normalMap:hn,normalScale:new THREE.Vector2(1.8,1.8),color:0xe2d6bd,roughness:0.92,envMapIntensity:0.3});
  weather(top,0.3,0);weather(herod,0.14,0.22);const m=new THREE.Mesh(g,[top,herod]);m.receiveShadow=true;m.castShadow=false;
  m.userData={n:"הר הבית",r:"מסכת מידות ב, א",t:"הרחבה שהורדוס הרחיב, בצורת טרפז: 488 מ׳ במערב, 470 במזרח, 315 בצפון ו־280 בדרום. הקירות שלה, כמו הכותל המערבי, עומדים עד היום. במודל היא מוצגת כקרקע פנויה רעיונית."};
  WG.add(m);PICK.push(m);
})();

// v83: steps in front of a city-gate arch, from the street up to the sill (item 24)
function sillSteps(add,off,gf,x,n,a,y,w){const q=off(x,n,a,1.6,0),g0=gf(q[0],q[1]);if(!(y-g0>0.12)||y-g0>4)return;const N=Math.ceil((y-g0)/0.17),hh=(y-g0)/N;
  for(let i=0;i<N-1;i++){const top=y-(i+1)*hh,p=off(x,n,a,0.45+i*0.32,0);add("wall",wbox(w+1.2,top-g0+0.6,0.34,4),p[0],(top+g0-0.6)/2,p[1],a+Math.PI/2)}}

// ---- topic 5: plants that grow out of the old walls of the Mount (capers and hyssop) ----
// 📜 "מן הארז אשר בלבנון ועד האזוב אשר יצא בקיר" (מלכים א ה, יג). 💡 like today: capers hang from the joints of the Western Wall and the other Herodian walls.
// #25: a caper clump is about 0.6–1 m across (it read as a rock at 2 m), and none grows on a gate
(function(){const r=rng(4747),C=[],Hs=[],P=MOUNT;let ar=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];ar+=a[0]*b[1]-b[0]*a[1]}const out=ar>0?1:-1;
  for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn);if(L<6)continue;const ox=dn/L*out,on=-dx/L*out;
    for(let s=3;s<L-3;s+=2.2){if(r()<0.72)continue;const x=a[0]+dx*s/L,n=a[1]+dn*s/L,g=H(x+ox*3,n+on*3),hw=-g;if(hw<4)continue;
      const y=g+2.5+r()*(hw-3.5),big=r()<0.6;(big?C:Hs).push([x+ox*(big?0.35:0.15),y-(big?0:0.2),-(n+on*(big?0.35:0.15)),big?0.5+r()*0.35:1.0+r()*0.6,Math.atan2(ox,on)])}}
  TREES5.plant(WG,"caper",C,{n:"צלף בחומה",r:"💡 כמו היום בכותל המערבי",t:"💡 הצלף (Capparis spinosa) צומח היום מבין אבני הכותל ושאר חומות הר הבית, ותלוי מהן כשיח ירוק־כחלחל עם פרחים לבנים."});
  TREES5.plant(WG,"hyssop",Hs,{n:"אזוב בקיר",r:"מלכים א ה, יג",t:"📜 \"ועד האזוב אשר יצא בקיר\" (מלכים א ה, יג): האזוב צומח בסדקי קירות. ⚖️ רב סעדיה גאון והרמב״ם מזהים את האזוב עם הזעתר (צעתר)."});
})();
// ---- Old City wall, towers, gates ----
(function(){
  const merl=[],tow=[],WLm=[];
  const wi={n:"חומות העיר העתיקה",r:"נבנו בימי סולימאן, 1537–1541",t:"📜 החומות של היום, באורך של כ־4 ק״מ, עם 34 מגדלים. גובהן משתנה לפי הקרקע, בין 5 ל־15 מ׳ (בממוצע כ־12). הן לא חלק מהתוכנית ונשארות כמו שהן. 💡 בהדמיה הגובה אחיד (13 מ׳) והמגדלים מפוזרים לפי אורך כל קטע, ולא במקומות המדויקים. המצודה ושער יפו בנויים לפי המקום האמיתי."};
  // the wall is 3.6 m thick. Keep its centre at least 5 m from the Mount outline so it does not share a face with the Mount wall at the NE corner, and does not cut the Hulda East block.
  const CLEAR=5,farM=(x,n)=>nearEdge(x,n,MOUNT)[0]>=CLEAR&&!(x>-70&&x<70&&n>-285&&n<-225);/* גרסה 116: 💡 חומת העיר נעצרת לפני רחבת שערי חולדה, כדי שלא תחצה את פתח השער המשולש (בחירת מודל, לא מידה ממקור) */
  for(let i=0;i<WALL_LINE.length-1;i++){
    const a=WALL_LINE[i],b=WALL_LINE[i+1],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn),steps=Math.max(1,Math.ceil(L/25)),ang=Math.atan2(dn,dx),hh=13;
    const clip=(u0,u1,base)=>{if(u1-u0<0.4)return;const N=Math.max(2,Math.ceil((u1-u0)/2));let run=null;const put=e=>{if(run==null||e-run<0.4)return;const um=(run+e)/2,xx=a[0]+dx*um/L,nq=a[1]+dn*um/L,m=new THREE.Mesh(wbox(e-run,hh,3.6,6),M.wall);m.position.set(xx,base+hh/2,-nq);m.rotation.y=ang;m.castShadow=true;m.receiveShadow=true;m.userData=wi;WLm.push(m)};
      for(let s=0;s<=N;s++){const u=u0+(u1-u0)*s/N,ok=farM(a[0]+dx*u/L,a[1]+dn*u/L);if(ok&&run==null)run=u;if(!ok&&run!=null){put(u0+(u1-u0)*Math.max(0,s-1)/N);run=null}}if(run!=null)put(u1)};
    for(let k=0;k<steps;k++){const t=(k+0.5)/steps,x=a[0]+dx*t,n=a[1]+dn*t,base=H(x,n)-2;
      const dg=GATES.dung,tg=((dg[0]-a[0])*dx+(dg[1]-a[1])*dn)/L,pd=Math.abs((dg[0]-a[0])*dn-(dg[1]-a[1])*dx)/L,s0=k/steps*L,s1=(k+1)/steps*L;
      {let sg=[[s0,s1]];[[dg,3]].concat(WGAPS).forEach(q=>{const g=q[0],hw=q[1],t2=((g[0]-a[0])*dx+(g[1]-a[1])*dn)/L,p2=Math.abs((g[0]-a[0])*dn-(g[1]-a[1])*dx)/L;if(p2<8&&t2>s0-hw&&t2<s1+hw){const o=[];sg.forEach(e=>{o.push([e[0],Math.min(e[1],t2-hw)],[Math.max(e[0],t2+hw),e[1]])});sg=o}});sg.forEach(e=>clip(e[0],e[1],base))}
      const nm=Math.max(1,Math.floor(L/steps/2.6));for(let q=0;q<nm;q++){const tt=(k+(q+0.5)/nm)/steps,xx=a[0]+dx*tt,nn=a[1]+dn*tt;if(farM(xx,nn))merl.push([xx,nn,H(xx,nn)-2+hh,ang])}}
    const nt=Math.floor(L/110);for(let k=1;k<=nt;k++){const t=k/(nt+1),xx=a[0]+dx*t,nn=a[1]+dn*t;if(farM(xx,nn))tow.push([xx,nn,ang])}
  }
  const mm=new THREE.InstancedMesh(new THREE.BoxGeometry(1.4,1.6,1.2),M.wall,merl.length),d=new THREE.Object3D();
  merl.forEach((p,i)=>{d.position.set(p[0],p[2]+0.8,-p[1]);d.rotation.set(0,p[3],0);d.updateMatrix();mm.setMatrixAt(i,d.matrix)});mm.castShadow=true;WG.add(mm);
  tow.forEach(p=>{const m=new THREE.Mesh(wbox(9,17,8,6),M.wall);m.position.set(p[0],H(p[0],p[1])-2+8.5,-p[1]);m.rotation.y=p[2];m.castShadow=true;m.userData=wi;WLm.push(m)});{let ok=false;try{if(THREE.BufferGeometryUtils){const gs=WLm.map(m=>{m.updateMatrix();const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrix);return g});const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs,false);if(mg){const w=new THREE.Mesh(mg,M.wall);w.castShadow=true;w.receiveShadow=true;w.userData=wi;WG.add(w);PICK.push(w);ok=true}gs.forEach(g=>g.dispose())}}catch(e){}if(!ok)WLm.forEach(m=>{WG.add(m);PICK.push(m)})}
  Object.values(GATES).forEach(g=>{if(["שער הרחמים","שער יפו","שער ציון","שער שכם","שער הפרחים","שער האריות","השער החדש"].includes(g[2]))return;
    let best=[1e9,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],p=WALL_LINE[i];const r=segDist(g[0],g[1],[a,p]);if(r[0]<best[0])best=[r[0],Math.atan2(p[1]-a[1],p[0]-a[0])]}
    const y=H(g[0],g[1])-2,ui={n:g[2],r:"שערי העיר העתיקה",t:"אחד משערי העיר. בתוכנית, שערי הצפון והמערב הם מסלולי הכניסה של העולים לרגל, ושער האשפות ועיר דוד הם מסלול היציאה בדרום. "+(g[2]==="שער האשפות"?"💡 בשער האשפות עוברים רק ברגל: האוטובוסים עוצרים במסוף שמול השער, ועולי הרגל חוצים במעבר החציה ונכנסים בשער.":"💡 השער פתוח: עוברים בו ברגל ובכלי רכב, כמו היום.")+""};const gp=new THREE.Group();gp.position.set(g[0],y,-g[1]);gp.rotation.y=best[1];WG.add(gp);
    [[-6,9.5,6,19],[6,9.5,6,19],[0,14,6,10],[0,1,6,2]].forEach(([lx,ly,bw,bh])=>{const m=new THREE.Mesh(wbox(bw,bh,13,6),M.wall);m.position.set(lx,ly,0);m.castShadow=true;m.receiveShadow=true;m.userData=ui;gp.add(m);PICK.push(m)})});
})();

