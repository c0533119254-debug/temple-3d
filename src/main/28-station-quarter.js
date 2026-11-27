// ---- 145.0: the First Station quarter (רובע התחנה הראשונה), per the Jerusalem municipality plan and the Khan station residents meeting ----
/* 145.0: רובע התחנה הראשונה. 📜 תוכנית העירייה (אתר עיריית ירושלים, "רובע התחנה הראשונה") ומפגש התושבים על תחנת חאן.
   בשלב הזה: האתר מתפנה (הדק, החניון הקטן, המחסנים שמדרום לתחנה), במקומם רחבה מרוצפת עם שורות עצים ובריכת מזרקה עגולה,
   ובניין התחנה ההיסטורי (1892) נבנה מחדש לפי טביעת הרגל שלו במפה הפתוחה, עם גגות רעפים אדומים.
   הכבישים (רחוב רמז והכיכר, דרך חברון, דרך בית לחם) והרכבת הקלה נשארים כמו שהם. 💡 = משוער */
__AFTER(()=>{try{
  const Y=(x,n)=>{const y=surfY(x,n);return isNaN(y)?H(x,n):y};
  const LRT=[[-1010.7,-1442.6],[-1015.5,-1432.9],[-1025.4,-1408.3],[-1034.1,-1383.3],[-1041.5,-1357.8],[-1081.3,-1207.2],[-1084,-1193],[-1085.5,-1178.7],[-1085.7,-1164.3],[-1084.8,-1149.9],[-1082.6,-1135.7],[-1076.5,-1105]];
  const TEAL=[[-1129,-1169.6],[-1119.3,-1152.7],[-1078.1,-1110.6],[-1071.6,-1089.2]];
  const NB=[[-1044,-1135.5],[-1027,-1134.5],[-1025.5,-1187],[-1042.3,-1188]],SB=[[-1042,-1191.5],[-1010.5,-1195.5],[-1008,-1251.5],[-1039.5,-1253]];
  const FOUNT={x:-1000,n:-1222,r:7};
  const onRoad=(x,n)=>segDist(x,n,LRT)[0]<5.5||segDist(x,n,TEAL)[0]<5.5||Math.hypot(x+1010,n+1182)<16||(n>-1203&&x>-1006);
  const inB=(x,n)=>inPoly(x,n,NB)||inPoly(x,n,SB);
  const INF_P={n:"רחבת התחנה הראשונה",r:"📜 תוכנית רובע התחנה הראשונה, עיריית ירושלים; מפגש התושבים על תחנת חאן",t:"📜 לפי התוכנית, הדק והחניונים שליד התחנה הראשונה יורדים, וכל השירותים (חניה, פריקה וטעינה) עוברים מתחת לאדמה. במקומם רחבה פתוחה להולכי רגל, בין בניין התחנה ההיסטורי לרחוב רמז ולרכבת הקלה. 💡 הריצוף, שורות העצים ומקום בריכת המזרקה לפי ההדמיות של התוכנית, בקירוב."};
  const INF_S={n:"התחנה הראשונה",r:"📜 OpenStreetMap (טביעת הרגל); תוכנית רובע התחנה הראשונה, עיריית ירושלים",t:"📜 תחנת הרכבת הראשונה של ירושלים, מ־1892, סוף הקו מיפו. הבניין ההיסטורי נשמר בתוכנית הרובע, ולידו (מדרום) תהיה הכניסה הראשית לתחנת חאן של הרכבת המהירה. 💡 גובה הבניין, צורת הגגות והחלונות לפי תמונות, בקירוב."};
  // plaza paving: P0 cut into small triangles that follow the ground, leaving the roads, the rails and the station itself
  const pos=[],col=[],cA=new THREE.Color(0xd9ccb0),cB=new THREE.Color(0xcbbd9f);
  const tr=THREE.ShapeUtils.triangulateShape(STQ.P0.map(q=>new THREE.Vector2(q[0],q[1])),[]);
  const put=(a,b,d,k)=>{const l=(u,w)=>Math.hypot(u[0]-w[0],u[1]-w[1]),m=(u,w)=>[(u[0]+w[0])/2,(u[1]+w[1])/2];
    if(k<8&&Math.max(l(a,b),l(b,d),l(d,a))>5){const ab=m(a,b),bd=m(b,d),da=m(d,a);put(a,ab,da,k+1);put(ab,b,bd,k+1);put(da,bd,d,k+1);put(ab,bd,da,k+1);return}
    const cx=(a[0]+b[0]+d[0])/3,cn=(a[1]+b[1]+d[1])/3;if(onRoad(cx,cn)||inB(cx,cn)||Math.hypot(cx-FOUNT.x,cn-FOUNT.n)<FOUNT.r)return;
    const cw=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0])<0,c=((Math.floor(cx/6)+Math.floor(cn/6))&1)?cA:cB;
    (cw?[a,d,b]:[a,b,d]).forEach(q=>{pos.push(q[0],Y(q[0],q[1])+0.09,-q[1]);col.push(c.r,c.g,c.b)})};
  tr.forEach(i=>put(STQ.P0[i[0]],STQ.P0[i[1]],STQ.P0[i[2]],0));
  {const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("color",new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.85,envMapIntensity:0.2,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));
    m.receiveShadow=true;m.name="stq-plaza";m.userData=INF_P;WG.add(m);PICK.push(m)}
  // the round fountain pool: a low stone rim and water
  {const y=Y(FOUNT.x,FOUNT.n),rim=new THREE.Mesh(new THREE.CylinderGeometry(FOUNT.r+0.4,FOUNT.r+0.5,0.6,40,1,true),M.stoneL||M.wall),w=new THREE.Mesh(new THREE.CircleGeometry(FOUNT.r,40),new THREE.MeshStandardMaterial({color:0x5f8796,roughness:0.15,metalness:0.1}));
    rim.position.set(FOUNT.x,y+0.25,-FOUNT.n);w.rotation.x=-Math.PI/2;w.position.set(FOUNT.x,y+0.35,-FOUNT.n);const top=new THREE.Mesh(new THREE.RingGeometry(FOUNT.r,FOUNT.r+0.5,40),M.stoneL||M.wall);top.rotation.x=-Math.PI/2;top.position.set(FOUNT.x,y+0.56,-FOUNT.n);
    const inf={n:"בריכת המזרקה ברחבת התחנה",r:"📜 הדמיות תוכנית רובע התחנה הראשונה, עיריית ירושלים",t:"📜 בהדמיות של התוכנית יש ברחבה שליד התחנה בריכת מים עגולה עם מזרקה. 💡 המקום והגודל בקירוב."};
    [rim,w,top].forEach(o=>{o.userData=inf;o.receiveShadow=true;WG.add(o);PICK.push(o)})}
  // the historic station: stone walls with tall arched windows, red tile roofs (north block one floor, gable; south block two floors, hipped)
  const wc=document.createElement("canvas");wc.width=128;wc.height=128;{const x=wc.getContext("2d");x.fillStyle="#dcc8a2";x.fillRect(0,0,128,128);x.fillStyle="#cdb78f";for(let j=0;j<128;j+=16)x.fillRect(0,j,128,1.5);
    x.fillStyle="#6a5b48";x.beginPath();x.moveTo(46,104);x.lineTo(46,44);x.arc(64,44,18,Math.PI,0);x.lineTo(82,104);x.closePath();x.fill();x.fillStyle="#e8d9b8";x.fillRect(42,104,44,5)}
  const wt=new THREE.CanvasTexture(wc);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.encoding=THREE.sRGBEncoding;wt.anisotropy=4;
  const WM=new THREE.MeshStandardMaterial({map:wt,roughness:0.9,envMapIntensity:0.4,side:THREE.DoubleSide}),RM=new THREE.MeshStandardMaterial({color:0xa4563c,roughness:0.75,envMapIntensity:0.3,side:THREE.DoubleSide});
  const block=(C,fh,floors,rise,hip)=>{let y0=1e9;C.forEach(q=>y0=Math.min(y0,Y(q[0],q[1])));y0-=0.6;const y1=y0+0.6+fh*floors,P=[],U=[];
    for(let i=0;i<4;i++){const a=C[i],b=C[(i+1)%4],L=Math.hypot(b[0]-a[0],b[1]-a[1])/5,V=fh*floors/(fh);[[a,y0,0,0],[b,y0,L,0],[b,y1,L,V],[a,y0,0,0],[b,y1,L,V],[a,y1,0,V]].forEach(([q,y,u,v])=>{P.push(q[0],y,-q[1]);U.push(u,v)})}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
    const w=new THREE.Mesh(g,WM);w.castShadow=w.receiveShadow=true;w.userData=INF_S;w.name="stq-station";WG.add(w);PICK.push(w);
    // roof: the ridge runs along the long sides (C0-C3 and C1-C2 are the long ones); eaves stick out 0.6 m
    const mid=(u,w)=>[(u[0]+w[0])/2,(u[1]+w[1])/2],ex=(q,c,k)=>[q[0]+(q[0]-c[0])*k,q[1]+(q[1]-c[1])*k];const cx=(C[0][0]+C[1][0]+C[2][0]+C[3][0])/4,cn=(C[0][1]+C[1][1]+C[2][1]+C[3][1])/4;
    const E=C.map(q=>ex(q,[cx,cn],0.035)),m0=mid(E[0],E[1]),m1=mid(E[3],E[2]),wid=Math.hypot(E[1][0]-E[0][0],E[1][1]-E[0][1]),len=Math.hypot(m1[0]-m0[0],m1[1]-m0[1]),k=hip?Math.min(0.45,wid/2/len):0;
    const r0=[m0[0]+(m1[0]-m0[0])*k,m0[1]+(m1[1]-m0[1])*k],r1=[m1[0]+(m0[0]-m1[0])*k,m1[1]+(m0[1]-m1[1])*k],yr=y1+rise,R=[];
    const tri=(a,ya,b,yb,c,yc)=>R.push(a[0],ya,-a[1],b[0],yb,-b[1],c[0],yc,-c[1]);
    tri(E[0],y1,E[3],y1,r1,yr);tri(E[0],y1,r1,yr,r0,yr);tri(E[1],y1,r0,yr,r1,yr);tri(E[1],y1,r1,yr,E[2],y1);tri(E[0],y1,r0,yr,E[1],y1);tri(E[3],y1,E[2],y1,r1,yr);
    if(!hip){const wall=[];[[E[0],E[1],r0],[E[3],E[2],r1]].forEach(([a,b,r])=>wall.push(a[0],y1,-a[1],b[0],y1,-b[1],r[0],yr,-r[1]));const gw=new THREE.BufferGeometry();gw.setAttribute("position",new THREE.Float32BufferAttribute(wall,3));gw.computeVertexNormals();const gm=new THREE.Mesh(gw,new THREE.MeshStandardMaterial({color:0xd8c39c,roughness:0.9,side:THREE.DoubleSide}));gm.userData=INF_S;WG.add(gm)}
    const gr=new THREE.BufferGeometry();gr.setAttribute("position",new THREE.Float32BufferAttribute(R,3));gr.computeVertexNormals();const r=new THREE.Mesh(gr,RM);r.castShadow=r.receiveShadow=true;r.userData=INF_S;WG.add(r);PICK.push(r);
    let xa=1e9,xb=-1e9,na=1e9,nb=-1e9;C.forEach(q=>{xa=Math.min(xa,q[0]);xb=Math.max(xb,q[0]);na=Math.min(na,q[1]);nb=Math.max(nb,q[1])});cbAdd(CB.b,{p:C,y1:yr,xa,xb,na,nb},xa,xb,na,nb);return yr};
  const yN=block(NB,5.5,1,3.2,false),yS=block(SB,4.8,2,4.5,true);
  // trees: two rows of shade trees across the plaza, east of the deck line and along Remez St (💡 like the renderings)
  if(typeof TREES5!=="undefined"){const T=[];const ok=(x,n)=>STQ.clear(x,n)&&!onRoad(x,n)&&!inB(x,n)&&[NB,SB].every(B=>segDist(x,n,B.concat([B[0]]))[0]>4)&&Math.hypot(x-FOUNT.x,n-FOUNT.n)>FOUNT.r+4;
    for(let n=-1140;n>-1340;n-=11){[-1055,-1066].forEach(x=>{if(ok(x,n))T.push([x,Y(x,n),-n,0.85+0.15*Math.sin(n),n*1.7])})}
    for(let x=-1002;x<-976;x+=9)[-1262,-1300,-1330].forEach(n=>{if(ok(x,n))T.push([x,Y(x,n),-n,0.9,x])});
    const m=TREES5.plant(WG,"shade",T,{n:"עצים ברחבת התחנה",r:"💡 לפי ההדמיות של תוכנית הרובע",t:"💡 שורות עצי צל ברחבה, כמו בהדמיות של התוכנית. סוג העץ והמקום המדויק משוערים."});if(m)m.name="stq-trees"}
  {const q=G2S(-1030,-1192);label("התחנה הראשונה",q[0],yS+6,-q[1],null,INF_S);const p=G2S(-1062,-1290);label("רחבת התחנה",p[0],Y(-1062,-1290)+8,-p[1],null,INF_P)}
  window.__STQ145={plazaTris:pos.length/9,roofN:yN,roofS:yS};
}catch(e){console.warn("station quarter",e)}});
