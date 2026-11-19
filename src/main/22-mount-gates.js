// ---- gates of the Temple Mount, joined to the streets they open onto ----
const GATEG=new THREE.Group();WG.add(GATEG);
(function(){const d=new THREE.Object3D(),cx=MOUNT.reduce((a,p)=>a+p[0],0)/MOUNT.length,cn=MOUNT.reduce((a,p)=>a+p[1],0)/MOUNT.length;
  const wallAt=(x,n)=>{let best=[1e9,0,0,0];for(let i=0;i<MOUNT.length;i++){const a=MOUNT[i],b=MOUNT[(i+1)%MOUNT.length],dx=b[0]-a[0],dn=b[1]-a[1],L2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-a[0])*dx+(n-a[1])*dn)/L2)),px=a[0]+dx*t,pn=a[1]+dn*t,e=Math.hypot(px-x,pn-n);if(e<best[0])best=[e,px,pn,Math.atan2(dn,dx)]}
    let ox=-Math.sin(best[3]),on=Math.cos(best[3]);if((best[1]+ox*5-cx)*ox+(best[2]+on*5-cn)*on<0){}if(inPoly(best[1]+ox*3,best[2]+on*3,MOUNT)){ox=-ox;on=-on}return{x:best[1],n:best[2],a:best[3],ox,on}};
  const M_={n:"",r:"",t:""};
  const SRC="משנה מידות א, ג; הר הבית היום";
  const G=[
    {n:"שער חולדה המערבי (השער הכפול)",x:-35.1,n2:-251.3,w:14,k:"S",five:1,t:"⚖️ \"שני שערי חולדה מן הדרום, משמשין כניסה ויציאה\" (מידות א, ג). ⚖️ \"כל הנכנסין להר הבית נכנסין דרך ימין... ויוצאין דרך שמאל\" (מידות ב, ב). 💡 לכן השער המערבי (הכפול) הוא שער היציאה. 💡 הסף בגובה שנמדד, 725 מ׳ (וורן וכספי). מאחוריו אולם כניסה עם עמודים, ומעבר עם מדרגות שעולה בתוך ההר כ־11 מ׳ ויוצא לרחבה, כמו בימי בית שני. במעבר יש גם מדרגות נעות ומעליות למי שצריך. המחילות שמתחת להר \"לא נתקדשו\" (פסחים פו ע״א). 📜 לפני השער: בחפירות נמצא קצה המדרגות 32 מ׳ ממזרח לעמוד האמצעי של השער, ו־30 מדרגות, מדרגה ומשטח לסירוגין. ⚖️ הרוחב הכולל, 64 מ׳, הוא שחזור לפי סימטריה (ריטמאייר, 1989). ⚖️ בראש המדרגות רחוב ברוחב 6.4 מ׳ לאורך החומה (מקור משני). 💡 הרחבה שבתחתית המדרגות ומספר המדרגות במודל בהערכה."},
    {n:"שער חולדה המזרחי (השער המשולש)",x:30,n2:-239.8,w:16,k:"S",five:1,t:"⚖️ השער השני משערי חולדה (מידות א, ג). 💡 זה שער הכניסה: מי שבא מן הדרום ופונה צפונה, \"ימין\" שלו הוא המזרח (מידות ב, ב). 💡 לפניו מדרגות רחבות כמו המדרגות הדרומיות שנחשפו בחפירות, עם רחבות מנוחה. בתחתיתן מקוואות. מאחורי השער מעבר שעולה בתוך ההר ויוצא לרחבה. 📜 לפני השער: בחפירות נמצאה רחבה מרוצפת צרה, והקמרונות שנשאו את המדרגות מתחילים 7.2–7.5 מ׳ מדרום לשער (ברוך ורייך, עתיקות 85, 2016). לכן הרחבה שבראש המדרגות במודל היא 7.2 מ׳. 💡 רוחב המדרגות והרחבה שבתחתיתן בהערכה."},
    {n:"שער קיפונוס",x:-90,n2:-175.1,w:10,k:"K",five:1,t:"⚖️ \"קיפונוס מן המערב, משמש כניסה ויציאה\" (מידות א, ג). 💡 לפי חלק מהחוקרים, קיפונוס הוא שער ברקלי, שהסף שלו נמדד בגובה 721 מ׳, רק כ־4 מ׳ מעל רחבת הכותל. לכן בתוכנית עולים מהרחבה במדרגות רחבות אל מרפסת אבן לפני השער, ומשם ממשיכים בתוך ההר, במעבר עם מדרגות, מדרגות נעות ומעליות, עד רחבת ההר. ⚖️ עולים בצד ימין ויורדים בצד שמאל (מידות ב, ב)."},
    {n:"שער השלשלת",x:-99.2,n2:-116.8,w:8,k:"W",t:"שער במערב ההר, בסוף רחוב השלשלת שיורד מהעיר העתיקה. הרחוב והשער נשארים כמו היום ומשמשים כניסה מהרובע היהודי ומשער יפו."},
    {n:"שער המטהרה",x:-108.5,n2:-81.8,w:7,k:"W",t:"שער קטן במערב ההר, בקצה סמטה של העיר העתיקה."},
    {n:"שער סוחרי הכותנה",x:-117.1,n2:-1.7,w:8,k:"W",t:"שער במערב ההר, בסוף שוק סוחרי הכותנה. מהשוק המקורה נכנסים ישר אל ההר."},
    {n:"שער הברזל",x:-127.9,n2:56.9,w:7,k:"W",t:"שער במערב ההר, בקצה סמטה שיורדת מרחוב הגיא."},
    {n:"שער המועצה",x:-140.4,n2:124.3,w:7,k:"W",t:"שער במערב ההר, בסוף רחוב שמגיע מרחוב הגיא ומשער שכם. עולי רגל שיורדים מהרכבת בשער שכם נכנסים לכאן."},
    {n:"שער בני ע׳אנם",x:-152,n2:205,w:7,k:"W",t:"השער בפינה הצפונית־מערבית של ההר, ליד דרך הייסורים."},
    {n:"שער טדי",x:-26.1,n2:250.2,w:10,k:"N",five:1,t:"⚖️ השער הצפוני של הר הבית במשנה: \"טדי מן הצפון, לא היה משמש כלום\" (מידות א, ג). ⚖️ מעל הפתח שלו אין משקוף ישר, אלא \"שתי אבנים מוטות זו על גב זו\" (מידות ב, ג). ⚖️ השימוש היחיד בו: כהן שנטמא בלילה יוצא במסיבה שתחת הבירה ויוצא בטדי (מידות א, ט). 💡 לכן בתוכנית הוא סגור לקהל, ויש בו דלת קטנה. הקהל מהצפון נכנס בשער חטה ובשער השבטים, שקרובים אליו."},
    {n:"שער חטה",x:58,n2:243.5,w:7,k:"N",t:"שער בצפון ההר, בקצה רחוב שעולה משער האריות ומשער הפרחים."},
    {n:"שער השבטים",x:145.7,n2:255.1,w:9,k:"N",t:"השער בפינה הצפונית־מזרחית, קרוב לשער האריות. מכאן נכנסים עולי רגל שמגיעים מהר הזיתים ומתחנת הרכבת \"העופל\"."}
  ];
  window.__MG=G;const woodB=[],stoneG=[],darkB=[],darkA=[],steps=[],paves=[],lifts=[],RAILS=[],PORT=[],SCR=[];
  const gateM=M.wall,dark=new THREE.MeshStandardMaterial({color:0x14110d,roughness:1});
  // v80: a covered passage (Huldah, Kiponus): stairs that climb inside the mount, a stepped ceiling, a roof slab flush with the plaza, and an open stair-head with parapets
  const TB=(T,lab,info)=>{const w=T.w,fx=T.fx,fn=T.fn,P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],hw=T.tw/2,R0=-(T.D-T.OPEN);
    for(let i=0;i<T.N;i++){const top=T.thr+(i+1)*T.h,d0=T.run(i),dd=T.tread+((i%T.FL===T.FL-1)&&i<T.N-1?T.LAND:0),p=P(-(d0+dd/2),0);steps.push([p[0],top,p[1],w.a,T.tw,top+46,dd+0.02]);
      if(-d0>R0+0.3)stoneG.push([p[0],Math.min(top+4,-0.45)+0.2,p[1],w.a,T.tw,0.4,dd+0.04])}
    {const p=P(-T.tot-0.3,0);steps.push([p[0],0,p[1],w.a,T.tw,46,0.62])}
    // #25: dressed stone walls along the passage, so the opening shows a lit stair hall and not the dark rock of the mount
    if(T.k==="K")[-1,1].forEach(sd=>{const p=P(-T.D/2,sd*(hw+0.25));stoneG.push([p[0],(T.thr-0.6+(-0.3))/2,p[1],w.a,0.5,-0.3-(T.thr-0.6),T.D])});
    {const p=P(-0.2,0);stoneG.push([p[0],T.thr-23,p[1],w.a,T.tw,46,0.42]);stoneG.push([p[0],(T.thr+4.2)/2,p[1],w.a,T.tw,-(T.thr+4.2)+0.2,0.42])}
    // the roof: the same paving as the plaza on top, plain stone under it
    {const q=(nn,al)=>P(nn,al),c=[q(0,-hw),q(R0,-hw),q(R0,hw),q(0,hw)],sh=new THREE.Shape();c.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));sh.closePath();
      const gg=new THREE.ShapeGeometry(sh),uv=gg.attributes.uv,pp=gg.attributes.position;for(let i=0;i<pp.count;i++)uv.setXY(i,pp.getX(i)/9,pp.getY(i)/9);gg.rotateX(-Math.PI/2);
      const rf=new THREE.Mesh(gg,PLATTOP||M.pave);rf.position.y=0.05;rf.receiveShadow=true;rf.userData=info;PICK.push(rf);GATEG.add(rf);
      const p=P(R0/2,0);stoneG.push([p[0],-0.235,p[1],w.a,T.tw,0.43,-R0])}
    // parapets round the open stair-head; the exit at the top end stays open
    [-1,1].forEach(sd=>{const p=P(R0-T.OPEN/2,sd*(hw+0.3));stoneG.push([p[0],0.55,p[1],w.a,0.6,1.1,T.OPEN])});{const p=P(R0+0.3,0);stoneG.push([p[0],0.55,p[1],w.a,T.tw+1.2,1.1,0.6])}
    [-1,1].forEach(sd=>{const a=P(-0.4,sd*(hw-0.25)),b=P(-T.tot,sd*(hw-0.25));RAILS.push([a[0],T.thr+1,a[1],b[0],1,b[1]])});
    const q=G2S(...P(R0-T.OPEN/2,0));label(lab,q[0],8,-q[1],null,info).m=true};
  // #25: the height of the ground as it is drawn (terrain, satellite tiles and streets are coarse meshes, so the formula TY can be off by a metre or more)
  const GND=(()=>{const L=[],rc=new THREE.Raycaster(),o=new THREE.Vector3(),dn=new THREE.Vector3(0,-1,0),C=new Map();scene.updateMatrixWorld(true);
    scene.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||!m.geometry)return;let a=m;while(a){if(a===GATEG)return;a=a.parent}if(!m.geometry.boundingSphere)m.geometry.computeBoundingSphere();if(m.geometry.boundingSphere.radius>40)L.push(m)});
    /* v115 · מהירות טעינה: במקום לירות קרן מול כל משולש של כל רשת (כ-800 קרניים × 2.8 מיליון משולשים, כ-40% מזמן הטעינה), לכל רשת נבנה פעם אחת אינדקס משבצות, ורק כשנקודה נופלת בתחומה */
    const CS=6,bx=new THREE.Box3(),v=new THREE.Vector3(),IX=new Map(),index=m=>{const g=m.geometry,pa=g.attributes.position,ix=g.index,nt=(ix?ix.count:pa.count)/3,P=new Float32Array(pa.count*3),e=m.matrixWorld.elements;
        for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i);P[i*3]=e[0]*x+e[4]*y+e[8]*z+e[12];P[i*3+1]=e[1]*x+e[5]*y+e[9]*z+e[13];P[i*3+2]=e[2]*x+e[6]*y+e[10]*z+e[14]}
        const T=new Uint32Array(nt*3),G=new Map();for(let t=0;t<nt;t++){const a=ix?ix.getX(t*3):t*3,b=ix?ix.getX(t*3+1):t*3+1,c=ix?ix.getX(t*3+2):t*3+2;T[t*3]=a;T[t*3+1]=b;T[t*3+2]=c;
          const x0=Math.floor(Math.min(P[a*3],P[b*3],P[c*3])/CS),x1=Math.floor(Math.max(P[a*3],P[b*3],P[c*3])/CS),z0=Math.floor(Math.min(P[a*3+2],P[b*3+2],P[c*3+2])/CS),z1=Math.floor(Math.max(P[a*3+2],P[b*3+2],P[c*3+2])/CS);
          if((x1-x0+1)*(z1-z0+1)>60000)continue;for(let cx=x0;cx<=x1;cx++)for(let cz=z0;cz<=z1;cz++){const k=cx*65536+cz;let q=G.get(k);if(!q){q=[];G.set(k,q)}q.push(t)}}
        const mt=Array.isArray(m.material)?m.material[0]:m.material;return{P,T,G,sd:mt?mt.side:0}};
    const NT=L.map(m=>(m.geometry.index?m.geometry.index.count:m.geometry.attributes.position.count)/3);const BB=L.map(m=>{bx.setFromObject(m);const sp=m.geometry.boundingSphere.clone().applyMatrix4(m.matrixWorld);/* כמו ה-Raycaster: רשת שכדור התיחום שלה לא נחתך — מדלגים */return[bx.min.x,bx.max.x,bx.min.z,bx.max.z,sp.center.x,sp.center.z,sp.radius*sp.radius]});
    return(x,n)=>{const k=Math.round(x*4)+","+Math.round(n*4);if(C.has(k))return C.get(k);o.set(x,120,-n);WG.localToWorld(o);const px=o.x,pz=o.z,ck=Math.floor(px/CS)*65536+Math.floor(pz/CS);let best=-1e9;
      for(let i=0;i<L.length;i++){const b=BB[i];if(px<b[0]||px>b[1]||pz<b[2]||pz>b[3])continue;if((px-b[4])*(px-b[4])+(pz-b[5])*(pz-b[5])>b[6])continue;if(NT[i]<3000){/* רשתות קטנות: הקרן הרגילה, כמו קודם */rc.set(o,dn);const hh=rc.intersectObject(L[i],false);if(hh.length&&hh[0].point.y>best)best=hh[0].point.y;continue}let I=IX.get(i);if(!I){I=index(L[i]);IX.set(i,I)}const q=I.G.get(ck);if(!q)continue;const P=I.P,T=I.T;
        for(let j=0;j<q.length;j++){const t=q[j]*3,a=T[t]*3,b2=T[t+1]*3,c=T[t+2]*3,ax=P[a],az=P[a+2],bxx=P[b2],bz=P[b2+2],cx=P[c],cz=P[c+2],d=(bz-cz)*(ax-cx)+(cx-bxx)*(az-cz);if(Math.abs(d)<1e-12)continue;if(I.sd!==2){const ny=(bz-az)*(cx-ax)-(bxx-ax)*(cz-az);if(I.sd===0?ny<=0:ny>=0)continue}
          const u=((bz-cz)*(px-cx)+(cx-bxx)*(pz-cz))/d,w=((cz-az)*(px-cx)+(ax-cx)*(pz-cz))/d,r=1-u-w;if(u<0||w<0||r<0){/* על השפה: מקבלים עד מילימטר מחוץ למשולש, במרחק אמיתי ולא יחסי */const sg=d>0?-1:1,e1=sg*((bxx-ax)*(pz-az)-(bz-az)*(px-ax))/(Math.hypot(bxx-ax,bz-az)||1),e2=sg*((cx-bxx)*(pz-bz)-(cz-bz)*(px-bxx))/(Math.hypot(cx-bxx,cz-bz)||1),e3=sg*((ax-cx)*(pz-cz)-(az-cz)*(px-cx))/(Math.hypot(ax-cx,az-cz)||1);if(!((e1>=-1e-3&&e2>=-1e-3&&e3>=-1e-3)||(e1<=1e-3&&e2<=1e-3&&e3<=1e-3)))continue}const y=u*P[a+1]+w*P[b2+1]+r*P[c+1];if(y>best&&y<=o.y+1e-3)best=y}}
      const y=best>-1e8?WG.worldToLocal(v.set(px,best,pz)).y:TY(x,n);C.set(k,y);return y}})();
  G.forEach(g=>{const w=wallAt(g.x,g.n2),yo=H(w.x+w.ox*9,w.n+w.on*9),fx=Math.cos(w.a),fn=Math.sin(w.a);g.w_=w;const T=g.five?TUNS().find(t=>g.n.includes(t.nm)):null;g.T_=T;
    const P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],seg=(a0,a1,y0,y1,n0,n1)=>{const p=P((n0+n1)/2,(a0+a1)/2);stoneG.push([p[0],(y0+y1)/2,p[1],w.a,a1-a0,y1-y0,n1-n0])};
    const low=yo<-3.5&&g.k==="S",today=g.k==="W"||g.k==="N",cwy=g.k==="W"&&yo<-4.5;
    // v80: today's gates stand on the visible ground just outside the wall (not on the hill height 9 m out), with steps up to the plaza
    const gb=today?(cwy?-1.5:TY(...P(2.5,0))):0;
    const thr=low?Math.max(yo+0.5,HUL):(g.k==="K"?(PLZ+4.3):(today?Math.max(0,gb):Math.max(yo,-1.5)));g.thr_=thr;const top=g.k==="K"?1.2:Math.max(thr,0)+6.5,bot=Math.min(yo,thr,gb)-2;
    const TOW=g.k==="S"||(g.five&&g.k!=="K");
    const oh=g.k==="K"?10:Math.min(5.2,g.w*0.42),ow=g.k==="K"?5.6:g.w*0.42;
    const face=(Math.sin(w.a)*w.ox-Math.cos(w.a)*w.on)>0?w.a:w.a+Math.PI,base=thr;
    if(g.k==="S"){const W2=(g.w+4)/2,o0=g.w*0.09,o1=g.w*0.39,ot=thr+oh*0.8;
      if(T){seg(-W2,-o1,bot,top,-0.4,2.8);seg(-o0,o0,bot,top,-0.4,2.8);seg(o1,W2,bot,top,-0.4,2.8);seg(-o1,o1,ot,top,-0.4,2.8);seg(-o1,o1,bot,thr,-0.4,2.8)}else stoneG.push([w.x+w.ox*1.2,(top+bot)/2,w.n+w.on*1.2,w.a,g.w+4,top-bot,3.2]);
      [-1,1].forEach(s=>{const px=w.x+w.ox*2.85+fx*s*g.w*0.24,pn=w.n+w.on*2.85+fn*s*g.w*0.24;PORT.push([px,pn,w,face,base,thr+oh*0.8,g.w*0.15]);if(!T){darkB.push([px,thr+oh*0.4,pn,w.a,g.w*0.3,oh*0.8,0.2]);darkA.push([px,thr+oh*0.8,pn,w.a,g.w*0.15])}})}
    else if(g.k==="K"){// a proper gateway, like Barclay's Gate: the wall closes flush round a 5.6 m opening, with jambs, one great lintel stone and a relieving arch over it
      const OH=4.2,F=0.3;seg(-4.05,4.05,thr+OH,1.04,-1.5,F);[-1,1].forEach(sd=>seg(sd<0?-4.05:ow/2,sd<0?-ow/2:4.05,thr-0.3,thr+OH,-1.5,F));
      [-1,1].forEach(sd=>seg(sd<0?-ow/2-0.75:ow/2,sd<0?-ow/2:ow/2+0.75,thr,thr+OH,F,F+0.28));seg(-ow/2-1.1,ow/2+1.1,thr+OH,thr+OH+1.9,F,F+0.36);seg(-ow/2-1.3,ow/2+1.3,thr+OH+1.9,thr+OH+2.15,F,F+0.46);
      g.arch_={c:P(F+0.18,0),y:thr+OH+2.15,r:3.1,a:w.a}}
    else if(TOW){stoneG.push([w.x+w.ox*1.2,(top+bot)/2,w.n+w.on*1.2,w.a,g.w+4,top-bot,3.2]);const px=w.x+w.ox*2.85,pn=w.n+w.on*2.85;PORT.push([px,pn,w,face,base,thr+oh*0.7,ow/2]);if(g.n!=="שער טדי"){darkB.push([px,thr+oh*0.35,pn,w.a,ow,oh*0.7,0.2]);darkA.push([px,thr+oh*0.7,pn,w.a,ow/2])}}
    else{// v80 (item 20): a real gateway: two piers, a lintel and a cornice, open between them
      const o=g.w*0.6/2;seg(-o-1.4,-o,thr,thr+6,-1.5,1.5);seg(o,o+1.4,thr,thr+6,-1.5,1.5);seg(-o,o,thr+4.2,thr+6,-1.5,1.5);seg(-o-1.6,o+1.6,thr+6,thr+6.4,-1.7,1.7);
      seg(-o-1.4,o+1.4,Math.min(gb,0)-0.8,thr,0,1.5);if(thr>0.05)seg(-o-1.4,o+1.4,-0.5,thr,-1.5,0)}
    // steps between the gate and the ground outside it (items 10, 21, 22)
    // #25: the stairs end on a flat landing. The ground is sampled over the whole landing (not at one point), the landing sits at its highest point, and a stone pad fills down to the lowest, so nothing floats and nothing is buried.
    // Where the street outside is already at the threshold, there are no stairs: a flat stone apron fills the dip by the wall instead
    if(today&&!cwy){const tread=0.32,FL=12,LAND=1.5,LP=3.2,s0=TOW?2.8:1.5,wid=TOW?3:g.w*0.6+2.8,run=i=>s0+i*tread+Math.floor(i/FL)*LAND;
      const gAt=(nn,al)=>{const y=GND(...P(nn,al));return y>thr+1.5?TY(...P(nn,al)):y},span=(n0,n1,a)=>{let lo=1e9,hi=-1e9;const st=Math.max((n1-n0)/4,0.01);for(let nn=n0;nn<=n1+0.001;nn+=st)for(let k=-2;k<=2;k++){const y=gAt(nn,k*a/2);lo=Math.min(lo,y);hi=Math.max(hi,y)}return[lo,hi]};
      let gS=Math.min(gb,thr-0.17),N=2;for(let it=0;it<6;it++){N=Math.max(2,Math.ceil((thr-gS)/0.17));const e=run(N-2)+tread;gS=Math.max(gS,span(e,e+LP,wid/2+0.6)[1])}
      if(gS>thr-0.25){// no stairs: an apron at the threshold out to where the ground meets it
        let d=s0;while(d<9&&span(d,d,wid/2)[1]<thr-0.1)d+=0.5;const lo=Math.min(thr-0.6,span(0,d,wid/2+0.6)[0]-0.4),p=P(d/2+0.2,0);
        stoneG.push([p[0],(thr+lo)/2-0.02,p[1],w.a,wid+1.2,thr-lo-0.04,d]);paves.push([p[0],thr+0.04,p[1],w.a,wid+1,0.08,d-0.2]);g.st_={s0,end:0,LP:d,wid,gS:thr,thr,N:0}}
      else{N=Math.max(2,Math.ceil((thr-gS)/0.17));const h=(thr-gS)/N,end=run(N-2)+tread;
        for(let i=0;i<N-1;i++){const y=thr-(i+1)*h,dd=tread+((i%FL===FL-1)?LAND:0),p=P(run(i)+dd/2,0),lo=Math.min(gS-0.8,span(run(i),run(i)+dd,wid/2)[0]-0.4);steps.push([p[0],y,p[1],w.a,wid,y-lo,dd+0.02])}
        {const lo=Math.min(gS-0.6,span(end,end+LP,wid/2+0.6)[0]-0.5),p=P(end+LP/2,0);stoneG.push([p[0],(gS+lo)/2-0.02,p[1],w.a,wid+1.2,gS-lo-0.04,LP]);paves.push([p[0],gS+0.04,p[1],w.a,wid+1,0.08,LP-0.2])}
        g.st_={s0,end,LP,wid,gS,thr,N};
        [-1,1].forEach(sd=>{const a=P(s0,sd*(wid/2-0.2)),b=P(end,sd*(wid/2-0.2));RAILS.push([a[0],thr+1,a[1],b[0],gS+h+1,b[1]])})}}
    else if(today&&gb<thr-0.1){const rise=thr-gb,N=Math.ceil(rise/0.17),h=rise/N,tread=0.32,FL=12,LAND=1.5,s0=TOW?2.8:1.5,wid=TOW?3:g.w*0.6+2.8,run=i=>s0+i*tread+Math.floor(i/FL)*LAND;
      for(let i=0;i<N-1;i++){const y=thr-(i+1)*h,dd=tread+((i%FL===FL-1)?LAND:0),p=P(run(i)+dd/2,0);steps.push([p[0],y,p[1],w.a,wid,y-gb+0.8,dd+0.02])}
      [-1,1].forEach(sd=>{const a=P(s0,sd*(wid/2-0.2)),b=P(run(N-2)+tread,sd*(wid/2-0.2));RAILS.push([a[0],thr+1,a[1],b[0],gb+h+1,b[1]])})}
    if(today&&thr>0.05){const N=Math.ceil(thr/0.17),h=thr/N,wid=g.w*0.6+2.8;for(let i=0;i<N-1;i++){const y=thr-(i+1)*h,p=P(-1.5-(i+0.5)*0.32,0);steps.push([p[0],y,p[1],w.a,wid,y+0.5,0.34])}}
    if(low){/* גרסה 122.2: גרם מדרגות אחד גדול לשני שערי חולדה (במקום שלושה גרמים שחופפים ובזוויות שונות). ישר, מקביל לחומה, מדרגות אחידות עם רחבת מנוחה כל 10, וצלעות סגורות. 💡 הרוחב מכסה את שני השערים; בחפירות נמצא גרם ברוחב 64 מ׳ מול השער הכפול (Ritmeyer, BAR 15:6, 1989) והמשכו מזרחה לא נחשף, לכן ההשלמה שלי. עומק הרחבה העליונה 7.2 מ׳ (Baruch & Reich, Atiqot 85, 2016) */
      if(g.n.includes("המזרחי")){g.top_=window.__HG.top;g.plz_=window.__HG.plz}
      else{const E=G.find(q=>q.n.includes("המזרחי")),wE=wallAt(E.x,E.n2),Cx=(w.x+wE.x)/2,Cn=(w.n+wE.n)/2,P2=(nn,al)=>[Cx+w.ox*nn+fx*al,Cn+w.on*nn+fn*al];
        const dxs=Math.hypot(wE.x-w.x,wE.n-w.n),wid=Math.round(dxs+g.w/2+E.w/2+16),TOP=7.2,tread=0.36,FL=10,LAND=2.6,run=i=>TOP+i*tread+Math.floor(i/FL)*LAND;
        let yoL=Math.min(yo,H(wE.x+wE.ox*9,wE.n+wE.on*9));const rise0=thr-yoL,N=Math.ceil(rise0/0.17),tot=run(N);for(let k=-2;k<=2;k++){const q=P2(tot,k*wid/4);yoL=Math.min(yoL,H(q[0],q[1]))}
        const rise=thr-yoL,N2=Math.ceil(rise/0.17),tot2=run(N2),h=rise/N2;
        for(let i=0;i<N2;i++){const y=thr-i*h,dist=run(i)+tread/2,p=P2(dist,0);steps.push([p[0],y,p[1],w.a,wid,y-yoL+4,tread+(i%FL===FL-1?LAND:0)+0.02])}
        {const p=P2(TOP/2,0);stoneG.push([p[0],thr-2.1,p[1],w.a,wid+0.4,4.2,TOP]);paves.push([p[0],thr+0.05,p[1],w.a,wid,0.3,TOP])}
        // stone balustrade along both sides of the stair, and at the head
        [-1,1].forEach(sd=>{const a=P2(TOP,sd*(wid/2-0.3)),b=P2(tot2-LAND,sd*(wid/2-0.3));RAILS.push([a[0],thr+1,a[1],b[0],yoL+1.4,b[1]])});
        const lf=P2(tot2*0.35,wid/2+2.6);lifts.push([lf[0],yoL,lf[1],w.a,thr-yoL+3.2]);
        const PD=24,PW=wid+8,pc=P2(tot2+PD/2,0);stoneG.push([pc[0],yoL-1.6,pc[1],w.a,PW+0.6,3.2,PD+0.4]);paves.push([pc[0],yoL+0.05,pc[1],w.a,PW,0.1,PD]);
        /* 122.2: הרחבה נחפרת לכל עומקה (לא רק בשלוש נקודות), ותומכים אותה בקיר אבן משלושה צדדיה. 💡 */
        {const wh=4.4,ed=P2(tot2+PD+0.6,0);stoneG.push([ed[0],yoL+wh/2-0.8,ed[1],w.a,PW+2.4,wh,1.2]);[-1,1].forEach(sd=>{const e=P2(tot2+PD/2,sd*(PW/2+0.6));stoneG.push([e[0],yoL+wh/2-0.8,e[1],w.a,1.2,wh,PD+0.4])})}
        const plz={pc,PD,PW,yo:yoL};try{const c0=[],ST=5,nA=Math.ceil(PW/ST),nD=Math.ceil(PD/ST);for(let i=0;i<nA;i++)for(let j=0;j<nD;j++){const a0=-PW/2+i*PW/nA,a1=-PW/2+(i+1)*PW/nA,d0=tot2+j*PD/nD,d1=tot2+(j+1)*PD/nD,q=[P2(d0,a0),P2(d1,a0),P2(d1,a1),P2(d0,a1)].map(r=>[r[0],yoL+0.1,-r[1]]);c0.push(...q[0],...q[1],...q[2],...q[0],...q[2],...q[3])}const T=c0;for(let r=0;r<3;r++)plz.cf=TMESH.conform(T,{lo:0.15,hi:99})}catch(e){}
        // a room for staff, shoes and bags inside each end of the stair (a door in the end wall, under the mount's approach), 💡
        const doors=[];[-1,1].forEach(sd=>{const i=Math.floor(N2*0.42),dist=run(i)+tread/2,p=P2(dist,sd*(wid/2+0.06)),gy=H(p[0],p[1]);doors.push([p[0],gy,p[1]]);
          darkB.push([p[0],gy+1.4,p[1],w.a+Math.PI/2,3.0,2.8,0.2]);stoneG.push([p[0]+fx*sd*0.12,gy+3.0,p[1]+fn*sd*0.12,w.a+Math.PI/2,3.8,0.45,0.5]);[-1,1].forEach(s2=>{const q=P2(dist+s2*1.75,sd*(wid/2+0.12));stoneG.push([q[0],gy+1.5,q[1],w.a+Math.PI/2,0.4,3.0,0.5])})});
        window.__HG={top:{TOP,wid},plz,C:[Cx,Cn],tot:tot2,wid,yo:yoL,thr,w,doors,P2};g.top_=window.__HG.top;g.plz_=plz}}
    else if(!today)paves.push([w.x+w.ox*6,thr+0.05,w.n+w.on*6,w.a,g.w+4,0.1,7]);
    else if(gb>=thr-0.1&&!g.st_)paves.push([w.x+w.ox*4,thr+0.05,w.n+w.on*4,w.a,g.w+4,0.1,5]);
    // a gate whose street is far above the ground below it stands on a stone causeway, like Wilson's Arch under the Street of the Chain
    if(cwy){const thr=-1.5;let D=12;while(D<130&&H(w.x+w.ox*D,w.n+w.on*D)<thr-0.6)D+=2;D+=2;const yb=Math.min(yo,(PLZ+0.25))-1,cw=g.w+2,cx=w.x+w.ox*(D/2+2),cn=w.n+w.on*(D/2+2);
      paves.push([cx,thr+0.05,cn,w.a,cw-0.4,0.1,D]);[-1,1].forEach(sd=>{/* 127.0: בגשר וילסון, פתח במעקה הדרומי לראש המדרגות שיורדות אל הרחבה (21–33 מ׳ מהשער) */const cut=g.n==="שער השלשלת"&&sd>0?[[2.5,20.5],[33,D+2]]:[[2.5,D+2]];cut.forEach(([d0,d1])=>{const a=P(d0,sd*(cw/2-0.25)),b=P(d1,sd*(cw/2-0.25));RAILS.push([a[0],thr+1.1,a[1],b[0],thr+1.1,b[1]])})});const arcs=[];
      for(let d=8;d<D-4;d+=13){const ay=H(w.x+w.ox*(d+2),w.n+w.on*(d+2));if(ay>thr-6)continue;const gq=[w.x+w.ox*(d+2),w.n+w.on*(d+2)],fl=inPoly(gq[0],gq[1],GEO.PLAZA)||inPoly(gq[0],gq[1],KZ)?(PLZ+0.45):TY(gq[0],gq[1]);arcs.push([d+2-3.5,d+2+3.5,fl,Math.min(fl+Math.min(thr-ay-3,11),thr-2.2)])}
      const piece=(a0,a1,y0,y1)=>{if(a1-a0<0.05||y1-y0<0.05)return;const c=(a0+a1)/2;stoneG.push([w.x+w.ox*c,(y0+y1)/2,w.n+w.on*c,w.a,cw,y1-y0,a1-a0])};let s0=2;
      arcs.forEach(r=>{piece(s0,r[0],yb,thr);piece(r[0],r[1],r[3],thr);piece(r[0],r[1],yb,r[2]);[-1,1].forEach(sd=>{const c=(r[0]+r[1])/2,px=w.x+w.ox*c+fx*sd*(cw/2+0.15),pn=w.n+w.on*c+fn*sd*(cw/2+0.15);stoneG.push([px,r[3]+0.35,pn,w.a,0.3,0.7,r[1]-r[0]+1.2])});s0=r[1]});piece(s0,D+2,yb,thr);
      const q=G2S(w.x+w.ox*(D*0.6),w.n+w.on*(D*0.6));label(g.n==="שער השלשלת"?"קשת וילסון":"גשר אבן",q[0],thr+4,-q[1],null,{n:"קשת וילסון והגשר לשער",r:"הצעה של התוכנית",t:"📜 רחוב השלשלת עולה לשער על גשר אבן עתיק, \"קשת וילסון\", שנבנה בימי בית שני מעל הגיא. 💡 בתוכנית הגשר בנוי מחדש באבן, כך שהשער לא תלוי באוויר מעל רחבת הכותל. מתחת לקשתות אפשר להתפלל בצל."}).m=true}
    // v80 (item 11): the Kiponus label sits on the gate itself, just over the opening
    const q=g.k==="K"?G2S(w.x+w.ox*1,w.n+w.on*1):G2S(w.x+w.ox*4,w.n+w.on*4);const L=label(g.n==="שער טדי"?"שער טדי (לא משמש)":g.n,q[0],g.k==="K"?thr+5.6:top+6,-q[1],g.five?"c":null,{n:g.n,r:SRC,t:g.t});L.m=!g.five;if(g.five)L.pr=1});
  // #25: no wall plants on the gates themselves
  {const mm=new THREE.Matrix4(),pp=new THREE.Vector3(),qq=new THREE.Quaternion(),ss=new THREE.Vector3();WG.children.forEach(m=>{if(!m.isInstancedMesh||!m.userData||(m.userData.n!=="צלף בחומה"&&m.userData.n!=="אזוב בקיר"))return;let ch=false;
    for(let i=0;i<m.count;i++){m.getMatrixAt(i,mm);mm.decompose(pp,qq,ss);if(G.some(g=>g.w_&&Math.hypot(pp.x-g.w_.x,-pp.z-g.w_.n)<(g.k==="S"?16:g.k==="K"?12:9))){ss.set(0,0,0);mm.compose(pp,qq,ss);m.setMatrixAt(i,mm);ch=true}}if(ch)m.instanceMatrix.needsUpdate=true})}
  // topic 2, stage 5: the Kiponus gatehouse — a low stone terrace before the gate, a broad stair from the plaza, the rest of the climb inside the mount
  {const g=G.find(q=>q.k==="K"),w=g.w_,fx=Math.cos(w.a),fn=Math.sin(w.a),P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],yb=(PLZ+0.25),yt=(PLZ+4.3),TW=30,TD=10;
    const ki={n:"בית שער קיפונוס",r:"מידות א, ג; ב, ב; הצעה של התוכנית",t:"💡 העלייה מרחבת הכותל להר, בנויה כבית שער אחד: מדרגות רחבות ונמוכות, מרפסת אבן לפני השער, והשער עצמו בחומה. משם עולים בתוך ההר, במדרגות או במדרגות נעות ובמעליות, ויוצאים לרחבת ההר. ⚖️ עולים בצד ימין ויורדים בצד שמאל (מידות ב, ב). אין כאן מגדלים או מבנים גבוהים: הרחבה נשארת פתוחה, והכותל נשאר כמו שהוא."};
    {const p=P(TD/2,0);stoneG.push([p[0],(yb+yt)/2-0.3,p[1],w.a,TW,yt-yb+0.6,TD]);paves.push([p[0],yt+0.03,p[1],w.a,TW-0.4,0.08,TD-0.4])}
    const rise=yt-yb,N=Math.ceil(rise/0.16),h=rise/N,tread=0.4,FL=13,LAND=2.6,SW=18,run=i=>i*tread+Math.floor(i/FL)*LAND,tot=run(N-1)+tread;
    for(let i=0;i<N;i++){const top=yt-(i+1)*h,p=P(TD+run(i)+tread/2,0);steps.push([p[0],top,p[1],w.a,SW,top-yb+0.4,tread+((i%FL===FL-1)&&i<N-1?LAND:0)+0.02])}
    [-1,1].forEach(sd=>{const al=sd*(SW/2+0.5);{const p=P(TD+tot/2,al);stoneG.push([p[0],yb+0.45,p[1],w.a+Math.PI/2,tot,0.9,0.7])}
      const a0=P(TD,al),a1=P(TD+tot,al);RAILS.push([a0[0],yt+1,a0[1],a1[0],yb+1,a1[1]]);
      const e0=P(0.6,sd*TW/2-sd*0.3),e1=P(TD-0.2,sd*TW/2-sd*0.3);RAILS.push([e0[0],yt+1,e0[1],e1[0],yt+1,e1[1]]);
      const f0=P(TD-0.2,sd*TW/2-sd*0.3),f1=P(TD-0.2,sd*(SW/2+0.5));RAILS.push([f0[0],yt+1,f0[1],f1[0],yt+1,f1[1]])});
    {const p=P(TD+0.6,0);stoneG.push([p[0],yt-0.2,p[1],w.a,1.0,0.4,0.6])}
    {const q=G2S(...P(TD+4,0));const L=label("בית שער קיפונוס — עלייה להר",q[0],yt+6,-q[1],null,ki);L.m=true}
    {const L2=G2S(...P(TD+tot*0.5,-SW/4)),R2=G2S(...P(TD+tot*0.5,SW/4));label("עולים",R2[0],yb+3,-R2[1],null,ki).m=true;label("יורדים",L2[0],yb+3,-L2[1],null,ki).m=true}
    // inside the mount: the passage comes up on the mount plaza through a stair-head beside the west wall
    TB(g.T_,"המעבר מקיפונוס",ki);
    {const V=(gx,gn,y)=>{const q=G2S(gx,gn);return new THREE.Vector3(q[0],y,-q[1])};const ft=P(TD+tot+6,0),tp=P(TD-2,0),gi=P(-3,0);
      window.KIP={side:()=>{const a=P(TD+tot+30,-26),b=P(2,0);return[V(a[0],a[1],yb+9),V(b[0],b[1],yt+2)]},top:()=>[V(tp[0],tp[1],yt+1.7),V(gi[0],gi[1],yt+2.5)],base:()=>[V(ft[0],ft[1],yb+1.7),V(tp[0],tp[1],yt+1.5)]}}}
  // topic 2, stage 3: Tadi, two leaning stones over a closed opening with a small door
  {const g=G.find(q=>q.n==="שער טדי"),w=g.w_,yo=H(w.x+w.ox*9,w.n+w.on*9),thr=g.thr_,ow=g.w*0.42,oh=Math.min(5.2,g.w*0.42);
    const grp=new THREE.Group();grp.position.set(w.x+w.ox*3.05,0,-(w.n+w.on*3.05));grp.rotation.y=w.a;GATEG.add(grp);
    const ti={n:"שער טדי",r:"מידות א, ג; ב, ג; א, ט",t:g.t};
    const fill=new THREE.Mesh(new THREE.BoxGeometry(ow,oh*0.7,0.4),M.stone2);fill.position.set(0,thr+oh*0.35,0);fill.userData=ti;PICK.push(fill);grp.add(fill);
    const dr=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.1,0.5),new THREE.MeshStandardMaterial({color:0x5a3d22,roughness:0.8}));dr.position.set(0,thr+1.05,0);grp.add(dr);
    const L=ow*0.62+0.6;[-1,1].forEach(sd=>{const st=new THREE.Mesh(new THREE.BoxGeometry(L,0.9,1.1),M.wall);st.rotation.z=-sd*0.62;st.position.set(sd*ow*0.25,thr+oh*0.7+Math.sin(0.62)*L/2-0.05,0);st.castShadow=true;st.userData=ti;PICK.push(st);grp.add(st)})}
  // topic 2, stage 4: behind each Huldah gate a passage climbs inside the mount and comes up on the plaza; mikvaot at the foot of the steps
  {const hm=new THREE.MeshStandardMaterial({color:0x17130e,roughness:1});
    G.filter(g=>g.k==="S").forEach(g=>{const w=g.w_,fx=Math.cos(w.a),fn=Math.sin(w.a),P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],ent=g.n.includes("המזרחי");
      const hi={n:ent?"יציאת המעבר משער חולדה המזרחי":"ירידה אל שער חולדה המערבי",r:"מידות א, ג; ב, ב; פסחים פו ע״א",t:"💡 כאן "+(ent?"עולה":"יורד")+" המעבר שבתוך ההר. "+(ent?"מי שנכנס בשער חולדה המזרחי עולה במדרגות בתוך ההר, ויוצא כאן לרחבה.":"מי שיוצא מההר יורד כאן במדרגות, בתוך ההר, אל שער חולדה המערבי.")+" יש גם מדרגות נעות ומעליות בתוך המעבר. ⚖️ המחילות שמתחת להר לא נתקדשו (פסחים פו ע״א), ולכן אין בעיה במכונות שם. 📜 מאחורי שערי חולדה נשתמרו עד היום מעברים מקורים שעולים בתוך ההר (מידות א, ג; נחקרו בידי וורן). 💡 המסלול כאן: מהשער, במעבר מקורה עם מדרגות ורחבות מנוחה, עד פתח פתוח ברחבת ההר."};
      TB(g.T_,ent?"יציאה מהמעבר (חולדה)":"ירידה לשער היציאה",hi);
      // stage 9: an entry / exit plaque over the gate
      {const pc=cv(512,128,(x,Wc,Hh)=>{x.fillStyle="#2a2117";x.fillRect(0,0,Wc,Hh);x.strokeStyle="#c9a24b";x.lineWidth=6;x.strokeRect(6,6,Wc-12,Hh-12);x.fillStyle="#f0d58c";x.font="bold 64px serif";x.textAlign="center";x.textBaseline="middle";x.direction="rtl";x.fillText(ent?"כניסה":"יציאה",Wc/2,Hh/2+4)});
        const pt=new THREE.CanvasTexture(pc);pt.encoding=THREE.sRGBEncoding;const pl=new THREE.Mesh(new THREE.PlaneGeometry(6,1.5),new THREE.MeshStandardMaterial({map:pt,roughness:0.6}));const pp=P(4.6,0);
        pl.position.set(pp[0],HUL+7.6,-pp[1]);pl.rotation.y=Math.atan2(w.ox,-w.on);pl.userData={n:ent?"שער הכניסה":"שער היציאה",r:"מידות ב, ב",t:"⚖️ \"כל הנכנסין להר הבית נכנסין דרך ימין, ומקיפין ויוצאין דרך שמאל\" (מידות ב, ב). 💡 לכן יש שער אחד לכניסה ושער אחד ליציאה, והקהל זורם בכיוון אחד. גם בקיפונוס עולים בצד ימין ויורדים בצד שמאל. ♿ ליד המדרגות יש מעלית מהרחוב, ובתוך המעבר יש מדרגות נעות ומעליות עד רחבת ההר."};PICK.push(pl);GATEG.add(pl)}
      // mikvaot: two identical bathhouses, one at each end of the foot of the grand stair (built once, with the east gate)
      if(ent&&window.__HG){const HG=window.__HG,w2=HG.w,f2=[Math.cos(w2.a),Math.sin(w2.a)];
        const mi={n:"מקוואות",r:"רמב״ם הלכות ביאת המקדש ג; ממצאי העופל",t:"⚖️ לפני העלייה להר טובלים. בעופל נמצאו יותר מ־50 מקוואות מימי בית שני. 💡 כאן שני בתי מקוואות זהים, אחד לגברים ואחד לנשים, משני קצות רחבת הכניסה בתחתית המדרגות. ההצבה והמידות הן הצעה שלי."};
        [-1,1].forEach(sd=>{const c=HG.P2(HG.tot+12,sd*(HG.wid/2+14)),ys=[];for(const dx of[-7,7])for(const dn of[-5,5])ys.push(H(c[0]+f2[0]*dx+w2.ox*dn,c[1]+f2[1]*dx+w2.on*dn));const lo=Math.min(...ys),hi=Math.max(...ys),top=hi+3.6;
          stoneG.push([c[0],(lo-0.6+top)/2,c[1],w2.a,14,top-lo+0.6,10]);stoneG.push([c[0],top+0.15,c[1],w2.a,14.6,0.3,10.6]);
          const dpt=[c[0]-sd*f2[0]*7.05,c[1]-sd*f2[1]*7.05];darkB.push([dpt[0],hi+1.3,dpt[1],w2.a+Math.PI/2,2.2,2.6,0.2]);stoneG.push([dpt[0]-sd*f2[0]*0.1,hi+2.8,dpt[1]-sd*f2[1]*0.1,w2.a+Math.PI/2,3.0,0.4,0.5]);
          const q=G2S(c[0],c[1]);label(sd<0?"מקוואות — גברים":"מקוואות — נשים",q[0],top+3,-q[1],null,mi).m=true})}})}
  // topic 2, stage 7: a sign at each Mishnah gate, a place to leave staff, shoes and bags before entering, and the mourners' path
  {const si={n:"שלט בשער ההר",r:"ברכות ט, ה; כלים א, ח; רמב״ם בית הבחירה ז",t:"⚖️ \"לא יכנס אדם להר הבית במקלו, ובמנעלו, ובפונדתו (ארנק), ובאבק שעל רגליו, ולא יעשנו קפנדריא\" (ברכות ט, ה). ⚖️ \"הר הבית מקודש ממנו, שאין זבים וזבות, נדות ויולדות נכנסים לשם\" (כלים א, ח). 💡 השלט עומד בכניסה לכל אחד מחמשת שערי המשנה."};
    G.filter(g=>g.five).forEach(g=>{const w=g.w_,fx=Math.cos(w.a),fn=Math.sin(w.a),p=[w.x+w.ox*(g.k==="K"?16:g.k==="S"?4:9)+fx*(g.k==="K"?18:g.w*(g.k==="S"?0.5:0.5)+3.5),w.n+w.on*(g.k==="K"?16:g.k==="S"?4:9)+fn*(g.k==="K"?18:g.w*(g.k==="S"?0.5:0.5)+3.5)],gy=g.k==="K"?(PLZ+0.25):g.k==="S"?g.thr_:H(p[0],p[1]);
      stoneG.push([p[0],gy+1.1,p[1],w.a,1.5,2.2,0.35]);const q=G2S(p[0],p[1]);label("שלט: מי נכנס להר",q[0],gy+3.2,-q[1],null,si).m=true});
    const li={n:"מקום למקל, לנעליים ולתיקים",r:"ברכות ט, ה; פסחים פו ע״א",t:"⚖️ אסור להיכנס להר הבית עם מקל, נעליים, ארנק ואבק על הרגליים (ברכות ט, ה). 💡 לכן לפני הכניסה, עוד מחוץ לשטח המקודש, יש ארונות לתיקים ולמקלות, מדפים לנעליים וברזים לשטיפת רגליים. נעלי בד או סנדלים בלי עור אפשר לקבל כאן."};
    const kG=G.find(q=>q.k==="K"),kw=kG.w_,kf=[Math.cos(kw.a),Math.sin(kw.a)];
    /* גרסה 122.2: מקום המקל, הנעליים והתיקים הוא חדר, לא קופסה באמצע הרחבה. בקיפונוס: חדר מתחת למרפסת האבן שלפני השער. בחולדה: חדר בכל קצה של גרם המדרגות. 💡 המיקום והעיצוב הצעה שלי; מקור: ברכות ט, ה */
    const shoeRoom=(x,y,n,a,lab)=>{darkB.push([x,y+1.3,n,a+Math.PI/2,3.0,2.6,0.2]);const q=G2S(x,n);if(lab)label("מקום לנעליים ולתיקים",q[0],y+5,-q[1],null,li).m=true};
    {const g=kG,w=kw,P=(nn,al)=>[w.x+w.ox*nn+kf[0]*al,w.n+w.on*nn+kf[1]*al],yb=PLZ+0.25;[-1,1].forEach(sd=>{const p=P(5,sd*15.06);shoeRoom(p[0],yb,p[1],w.a,sd>0);stoneG.push([p[0]+kf[0]*sd*0.12,yb+3.0,p[1]+kf[1]*sd*0.12,w.a+Math.PI/2,3.8,0.45,0.5]);[-1,1].forEach(s2=>{const q=P(5+s2*1.75,sd*15.12);stoneG.push([q[0],yb+1.5,q[1],w.a+Math.PI/2,0.4,3.0,0.5])})})}
    if(window.__HG)window.__HG.doors.forEach((d,i)=>{const q=G2S(d[0],d[2]);if(i===0)label("מקום לנעליים ולתיקים",q[0],d[1]+5,-q[1],null,li).m=true});
    {const g=G.find(q=>q.n.includes("המערבי")),w=g.w_,p=[w.x-w.ox*58,w.n-w.on*58],q=G2S(p[0],p[1]);
      label("מסלול האבלים",q[0],4,-q[1],null,{n:"מסלול האבלים — מקיפים לשמאל",r:"מידות ב, ב",t:"⚖️ \"כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שאירע לו דבר שהוא מקיף לשמאל. מה לך מקיף לשמאל? שאני אבל — השוכן בבית הזה ינחמך.\" 💡 בתוכנית אין צריך לסמן את האבלים. רק השלט מזכיר שמי שהולך נגד הזרם הוא אבל, וכל מי שפוגש אותו מנחם אותו."}).m=true}}
  // topic 2, stage 2: the remains of Robinson's Arch near the SW corner, left as a ruin (as today)
  {const w=wallAt(-80,-243),fx=Math.cos(w.a),fn=Math.sin(w.a),P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],gy=H(...P(14,0));
    const ri={n:"קשת רובינסון — שריד",r:"חפירות הגן הארכיאולוגי; הצעה של התוכנית",t:"💡 השריד של קשת גדולה מימי בית שני, שנשאה גרם מדרגות מהרחוב שלמטה אל ההר. הקשת נשארת שריד כמו היום, כי היא חלק מאזור הכותל. רואים את תחילת הקשת שבולטת מהחומה, ואת בסיס העמוד שלה ברחוב."};
    for(let k=0;k<4;k++){const p=P(-0.6-k*0.55,0);stoneG.push([p[0],-13.2+k*0.55,p[1],w.a,15,1.0,1.1+k*0.6])}
    {const p=P(-13.5,0);stoneG.push([p[0],gy+1.6,p[1],w.a,15.2,3.2,3.6]);stoneG.push([p[0]+fx*4,gy+3.6,p[1]+fn*4,w.a,5,1.2,3.2])}
    const q=G2S(...P(-6,0));label("קשת רובינסון (שריד)",q[0],-8,-q[1],null,ri).m=true}
  // Kotel prayer area: a low partition (mechitza) and a low stone railing with two openings
  {const w=wallAt(-93,-147),fx=Math.cos(w.a),fn=Math.sin(w.a),P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],Y=(PLZ+0.25);const north=fn>0?1:-1;
    {const p=P(14,0);SCR.push([p[0],Y+0.9,p[1],w.a+Math.PI/2,22,1.8,0.12,0])}
    /* גרסה 122.2: ברחבה מחיצה אחת בלבד בין הגברים לנשים. המעקה הנמוך עם הפתחים הוסר */
    const q1=G2S(...P(12,13*north)),q2=G2S(...P(12,-13*north)),q3=G2S(...P(31,0));
    label("תפילה — גברים",q1[0],Y+4,-q1[1],null,{n:"עזרת הגברים ליד הכותל",r:"כמו היום",t:"💡 אזור התפילה נשאר כמו היום. זה הצד הצפוני, של הגברים, הקרוב לקשת וילסון. מחיצה מפרידה בינו לבין עזרת הנשים שבדרום, והמעבר אליו מהרחבה פתוח, בלי מעקה."}).m=true;
    label("תפילה — נשים",q2[0],Y+4,-q2[1],null,{n:"עזרת הנשים ליד הכותל",r:"כמו היום",t:"💡 אזור התפילה נשאר כמו היום. זה הצד הדרומי, של הנשים. מחיצה מפרידה בינו לבין עזרת הגברים שבצפון, והמעבר אליו מהרחבה פתוח, בלי מעקה."}).m=true}
  /* גרסה 122.2: ירידה מסודרת אל רחבת הכותל, מהרובע היהודי במערב: גרם מדרגות רחב אחד עם רחבות מנוחה, מעקות ורחבה למעלה, במקום שביל קטן על מדרון. 💡 המיקום והמידות הצעה שלי */
  {const yb=PLZ+0.25,E0=[-175.5,-169],o=[-0.983,-0.185],t=[0.185,-0.983],aa=Math.atan2(t[1],t[0]),W=14,tread=0.4,FL=13,LAND=2.6,Q=(dd,al)=>[E0[0]+o[0]*dd+t[0]*al,E0[1]+o[1]*dd+t[1]*al];
    let top=yb+3;for(let k=-1;k<=1;k++){const q=Q(24,k*W/2);top=Math.max(top,Math.min(TY(q[0],q[1])+0.2,yb+9))}
    const rise=top-yb,N=Math.ceil(rise/0.16),h=rise/N,run=i=>i*tread+Math.floor(i/FL)*LAND,tot=run(N-1)+tread,D0=3;
    for(let i=0;i<N;i++){const y=yb+(i+1)*h,p=Q(D0+run(i)+tread/2,0);steps.push([p[0],y,p[1],aa,W,y-yb+0.4,tread+((i%FL===FL-1)&&i<N-1?LAND:0)+0.02])}
    {const c=Q(D0+tot+3,0);stoneG.push([c[0],(yb+top)/2-0.3,c[1],aa,W+1,top-yb+0.6,6]);paves.push([c[0],top+0.03,c[1],aa,W+0.6,0.08,5.8]);
     const c2=Q(D0/2,0);stoneG.push([c2[0],yb-0.1,c2[1],aa,W+1,0.5,D0+0.6]);paves.push([c2[0],yb+0.04,c2[1],aa,W+0.6,0.08,D0])}
    [-1,1].forEach(sd=>{const a0=Q(D0,sd*(W/2+0.3)),a1=Q(D0+tot,sd*(W/2+0.3));RAILS.push([a0[0],yb+1,a0[1],a1[0],top+1,a1[1]]);const w0=Q(D0+tot/2,sd*(W/2+0.6));stoneG.push([w0[0],yb+(top-yb)/2+0.3,w0[1],aa+Math.PI/2,tot+1,top-yb+0.9,0.6])});
    try{const A=Q(D0,-W/2-1),B=Q(D0,W/2+1),C=Q(D0+tot,W/2+1),D=Q(D0+tot,-W/2-1),yy=[yb+0.1,yb+0.1,top+0.1,top+0.1],T=[[A,yy[0]],[B,yy[1]],[C,yy[2]],[A,yy[0]],[C,yy[2]],[D,yy[3]]].flatMap(([q,y])=>[q[0],y,-q[1]]);TMESH.conform(T,{lo:0.15,hi:99})}catch(e){console.warn("kdesc",e)}
    const qd=G2S(...Q(D0+tot*0.5,0));label("ירידה אל רחבת הכותל",qd[0],top+4,-qd[1],null,{n:"הירידה אל רחבת הכותל",r:"הצעה של התוכנית",t:"💡 גרם מדרגות רחב אחד, עם רחבות מנוחה ומעקות, מהרובע היהודי אל רחבת התפילה. במציאות היום הירידה בשבילים ובמדרגות צרות."}).m=true}
  const im=(geo,mat,arr,fn,info)=>{if(!arr.length)return;const m=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((p,i)=>{fn(p);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.castShadow=true;m.receiveShadow=true;if(info){m.userData=info;PICK.push(m)}GATEG.add(m)};
  const box=new THREE.BoxGeometry(1,1,1),half=(()=>{const g=new THREE.CylinderGeometry(1,1,0.2,16,1,false,0,Math.PI);g.rotateX(Math.PI/2);g.rotateZ(Math.PI/2);g.rotateY(Math.PI/2);return g})();
  const gInfo={n:"שערי הר הבית",r:SRC,t:"השערים בחומות ההר, כל אחד במקום של שער אמיתי ובקצה של רחוב אמיתי. בדרום — שני שערי חולדה עם מדרגות רחבות; במערב — שער קיפונוס מעל רחבת הכותל ושערי העיר העתיקה; בצפון — שער טדי ועוד. 📜 שער הרחמים שבחומה המזרחית של היום אטום, ובהדמיה הוא נשאר אטום כמו היום. 💡 הוא לא השער הסגור שביחזקאל: \"השער הזה סגור יהיה\" (מד, ב) נאמר על השער החיצוני המזרחי של המתחם, שבהדמיה עומד מזרחה יותר."};
  // #25: the gate masses use the same Herodian stone as the mount wall skin (topic 25), measured in metres, so a gate no longer reads as a dark block stuck on the wall
  {if(!M.mgate)M.mgate=T.mwC?new THREE.MeshStandardMaterial({map:T.mwC,normalMap:T.mwN,roughness:0.92}):gateM;const gs=[];
    stoneG.forEach(p=>{const [x,y,n,a,sx,sy,sz]=p,ax=Math.abs(sx),ay=Math.abs(sy),az=Math.abs(sz);if(ax<1e-3||ay<1e-3||az<1e-3)return;const g=new THREE.BoxGeometry(ax,ay,az),uv=g.attributes.uv,y0=y-ay/2;
      const dims=[[az,1],[az,1],[ax,az],[ax,az],[ax,1],[ax,1]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k,u=uv.getX(i),v=uv.getY(i);if(f===2||f===3)uv.setXY(i,u*ax/16,v*az/16);else uv.setXY(i,u*dims[f][0]/16,(y0+v*ay+30)/32)}
      g.rotateY(a);g.translate(x,y,-n);gs.push(g)});
    G.forEach(g=>{const A=g.arch_;if(!A)return;const NV=11;for(let i=0;i<NV;i++){const t=(i+0.5)/NV*Math.PI,len=A.r*Math.PI/NV*0.94;const b=new THREE.BoxGeometry(len,0.85,0.36),uv=b.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*len/16,uv.getY(k)*0.85/32+i*0.07);
      b.rotateZ(t-Math.PI/2);b.translate(Math.cos(t)*A.r,Math.sin(t)*A.r,0);b.rotateY(A.a);b.translate(A.c[0],A.y,-A.c[1]);gs.push(b)}});
    if(gs.length){const U=THREE.BufferGeometryUtils,mg=U&&U.mergeBufferGeometries?U.mergeBufferGeometries(gs):null;
      if(mg){const m=new THREE.Mesh(mg,M.mgate);m.castShadow=true;m.receiveShadow=true;m.userData=gInfo;PICK.push(m);GATEG.add(m)}else im(box,gateM,stoneG,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])},gInfo)}}
  im(box,dark,darkB,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])});
  im(box,M.wood||M.stone2,woodB,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])},{n:"ארונות לנעליים ולתיקים",r:"ברכות ט, ה",t:"💡 ארונות עץ לנעליים, למקלות ולתיקים, לפני העלייה להר (ברכות ט, ה: \"לא יכנס אדם להר הבית במקלו ובמנעלו ובפונדתו\")."});
  im(half,dark,darkA,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[4],1);d.position.set(p[0],p[1],-p[2])});
  /* גרסה 122.2: המדרגות הן משטח הליכה: האנשים עולים עליהן ולא עוברים דרכן בגובה הרחבה */
  try{if(WALKG&&WALKG.h)steps.forEach(p=>{const c=Math.cos(p[3]),sn=Math.sin(p[3]),hw=p[4]/2,hd=p[6]/2,A=(u,v)=>[p[0]+c*u-sn*v,-(p[2]+sn*u+c*v)],q=[A(-hw,-hd),A(hw,-hd),A(hw,hd),A(-hw,hd)];WALKG.tri(q[0][0],p[1],q[0][1],q[1][0],p[1],q[1][1],q[2][0],p[1],q[2][1]);WALKG.tri(q[0][0],p[1],q[0][1],q[2][0],p[1],q[2][1],q[3][0],p[1],q[3][1])})}catch(e){console.warn("walkg steps",e)}
  /* 125.3 (מסלולי ההליכה 11–12): גם המרפסות והרחבות המרוצפות לפני השערים (מרפסת קיפונוס, רחבות חולדה) הן רצפה להולך, ולא רק המדרגות. בלי זה ההולך "נופל" לקרקע שמתחתן וחוק הטיפוס עוצר אותו */
  try{if(WALKG&&WALKG.h)paves.forEach(p=>{const y=p[1]+p[5]/2,c=Math.cos(p[3]),sn=Math.sin(p[3]),hw=p[4]/2,hd=p[6]/2,A=(u,v)=>[p[0]+c*u-sn*v,-(p[2]+sn*u+c*v)],q=[A(-hw,-hd),A(hw,-hd),A(hw,hd),A(-hw,hd)];WALKG.tri(q[0][0],y,q[0][1],q[1][0],y,q[1][1],q[2][0],y,q[2][1]);WALKG.tri(q[0][0],y,q[0][1],q[2][0],y,q[2][1],q[3][0],y,q[3][1])})}catch(e){console.warn("walkg paves",e)}
  im(box,M.stone2,steps,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1]-p[5]/2,-p[2])},{n:"מדרגות העלייה להר",r:"בהשראת המדרגות הדרומיות מימי בית שני",t:"גרמי מדרגות רחבים מאבן, בקטעים קצרים עם רחבות ביניים — כמו המדרגות הדרומיות מימי בית שני. בשערי חולדה עולים במדרגות עד השער, ומשם במעבר מקורה שעולה בתוך ההר עד הרחבה, כמו שהיה אז. ליד כל גרם מדרגות יש מעלית."});
  im(box,M.stone2,lifts,p=>{d.rotation.set(0,p[3],0);d.scale.set(3.8,p[4],3.8);d.position.set(p[0],p[1]+p[4]/2,-p[2])},{n:"מעלית",r:"הצעה של התוכנית",t:"מעלית לכל מי שקשה לו לעלות במדרגות — זקנים, אנשים עם מוגבלות, עגלות. היא עולה מהרחוב עד מפלס השער."});
  im(box,new THREE.MeshStandardMaterial({color:0x2a3a48,roughness:0.15,metalness:0.6}),lifts,p=>{d.rotation.set(0,p[3],0);d.scale.set(4.0,p[4]-1.5,1.6);d.position.set(p[0],p[1]+p[4]/2-0.2,-p[2])});
  {const pil=[],arc=[],key=[],cor=[],cap=[],door=[],post=[],head=[],plq=[];
    PORT.forEach(([px,pn,w,face,base,spr,r])=>{const fx=Math.cos(w.a),fn=Math.sin(w.a),Q=(al,nn)=>[px+fx*al+w.ox*nn,pn+fn*al+w.on*nn];const R=r+0.45,top=spr+R+0.35;
      [-1,1].forEach(s=>{const p=Q(s*(r+0.55),0.3);pil.push([p[0],(base+top)/2,p[1],w.a,0.9,top-base,0.6]);
        const dp=Q(s*(r+0.04),r*0.5+0.1);door.push([dp[0],(base+spr+r*0.6)/2,dp[1],w.a+Math.PI/2,r,spr+r*0.6-base,0.12]);
        const lp=Q(s*(r+2.2),1.6);post.push([lp[0],base+1.7,lp[1],w.a,0.12,3.4,0.12]);head.push([lp[0],base+3.55,lp[1],w.a,0.42,0.55,0.42])});
      {const p=Q(0,0.15);arc.push([p[0],spr,p[1],face,R]);const k=Q(0,0.35);key.push([k[0],spr+R+0.05,k[1],w.a,0.8,1.1,0.7]);
        const c=Q(0,0.45);cor.push([c[0],top+0.3,c[1],w.a,2*R+2.4,0.6,0.9]);cap.push([c[0],top+0.72,c[1],w.a,2*R+3.0,0.24,1.2]);
        const pq=Q(0,0.91);plq.push([pq[0],top+0.3,pq[1],face,2*R+1.8,0.5])}});
    const B=(m,arr,info)=>im(box,m,arr,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])},info);
    const pInfo={n:"פתח השער",r:"תהלים קיח, יט; הצעה של התוכנית",t:"💡 כל שער של ההר מקבל חזית מפוארת: שני עמודים, קשת אבן עם אבן ראשה, כרכוב, דלתות נחושת פתוחות לרווחה ופנסים משני הצדדים. על המשקוף כתוב \"פתחו לי שערי צדק אבוא בם\". 📜 \"שאו שערים ראשיכם\" (תהלים כד, ז)."};
    B(M.stoneL,pil,pInfo);B(M.stoneL,key,pInfo);B(M.stoneL,cor,pInfo);B(M.stoneL,cap,pInfo);B(M.bronze,door,pInfo);B(M.bronze,post);B(M.lamp,head);
    const tor=new THREE.TorusGeometry(1,0.13,8,24,Math.PI);im(tor,M.stoneL,arc,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[4],p[4]);d.position.set(p[0],p[1],-p[2])},pInfo);
    const cvs=document.createElement("canvas");cvs.width=1024;cvs.height=128;{const x=cvs.getContext("2d");x.fillStyle="#6b4a22";x.fillRect(0,0,1024,128);x.strokeStyle="#e0b860";x.lineWidth=6;x.strokeRect(8,8,1008,112);x.fillStyle="#f1d48a";x.font="bold 64px serif";x.textAlign="center";x.textBaseline="middle";x.direction="rtl";x.fillText("פתחו לי שערי צדק אבוא בם",512,68)}
    const pt=new THREE.CanvasTexture(cvs);pt.anisotropy=4;im(new THREE.PlaneGeometry(1,1),new THREE.MeshStandardMaterial({map:pt,roughness:0.6,metalness:0.3}),plq,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],1);d.position.set(p[0],p[1],-p[2])},pInfo);
    const rl=[],po=[];RAILS.forEach(([x0,y0,n0,x1,y1,n1])=>{const L=Math.hypot(x1-x0,y1-y0,n1-n0);rl.push([x0,y0,n0,x1,y1,n1,L]);const k=Math.max(1,Math.round(L/1.6));for(let j=0;j<=k;j++){const t=j/k;po.push([x0+(x1-x0)*t,y0+(y1-y0)*t,n0+(n1-n0)*t])}});
    const rInfo={n:"מעקה",r:"הצעה של התוכנית",t:"💡 מעקה נחושת בשני הצדדים של המדרגות ובשולי הרחבות, כדי שיהיה בטוח ונוח לעלות."};
    im(box,M.bronze,rl,p=>{d.position.set((p[0]+p[3])/2,(p[1]+p[4])/2,-(p[2]+p[5])/2);d.rotation.set(0,0,0);d.lookAt(p[3],p[4],-p[5]);d.scale.set(0.08,0.08,p[6])},rInfo);
    im(box,M.bronze,po,p=>{d.rotation.set(0,0,0);d.scale.set(0.05,1,0.05);d.position.set(p[0],p[1]-0.5,-p[2])});
    B(new THREE.MeshStandardMaterial({color:0x8a7a62,roughness:0.85}),SCR.filter(p=>!p[7]),{n:"מחיצה",r:"סוכה נא, ב; כמו היום",t:"⚖️ מחיצה בין עזרת הגברים לעזרת הנשים במקום התפילה, כמו היום ליד הכותל."});
    B(M.stoneL,SCR.filter(p=>p[7]),{n:"מעקה אזור התפילה",r:"הצעה של התוכנית",t:"💡 מעקה אבן נמוך עם שני פתחים, כדי שיהיה ברור איפה אזור התפילה ואיפה הרחבה שממנה עולים להר."})}
  im(box,M.pave,paves,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])});
})();

// ---- 125.5 (תמונות Mapillary של רחבת הכותל): המדרגות מהרובע, הרחבה הדרומית, אזור התפילה, כיור ופנסים ----
// 📜 לפי 96 תמונות רחוב של Mapillary (2014–2023) ברשת של 25 מ׳ על הרחבה. מה ששייך רק להיום (עמדות בידוק, גדרות זמניות, מכוניות חונות) לא נבנה, כי המודל מראה את העתיד
(function(){try{
  const d=new THREE.Object3D(),r=rng(1255),Y0=PLZ+0.25;
  const MAT=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.85},o||{}));
  const BOX=new THREE.BoxGeometry(1,1,1);
  const put=(list,mat,info,geo)=>{if(!list.length)return null;const m=new THREE.InstancedMesh(geo||BOX,mat,list.length);list.forEach((q,i)=>{d.position.set(q[0],q[1],-q[2]);d.rotation.set(0,q[3],q[7]||0);d.scale.set(q[4],q[5],q[6]);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.instanceMatrix.needsUpdate=true;m.castShadow=true;m.receiveShadow=true;m.userData=info;WG.add(m);PICK.push(m);return m};
  /* box at geo point (x,n), base y0, height h, along-axis angle a, length l, thickness t */
  const bx=(L,x,n,y0,h,a,l,t)=>L.push([x,y0+h/2,n,a,l,h,t]);

  // 1) המדרגות מהרובע היהודי אל הרחבה (לאורך השבילים של OSM)
  const STP=[],SIDE=[],HR=[];
  KST.forEach(F=>{const hw=F.w/2;for(let i=0;i<F.p.length-1;i++){const a=F.p[i],b=F.p[i+1],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn),ux=dx/L,un=dn/L,px=-un,pn=ux,ang=Math.atan2(dn,dx),drop=a[2]-b[2];
    const ns=Math.max(1,Math.round(Math.abs(drop)/0.16)),tr=L/ns;
    for(let k=0;k<ns;k++){const s=(k+0.5)*tr,cx=a[0]+ux*s,cn=a[1]+un*s,top=PLZ+a[2]-drop*k/ns,yb=Math.min(H(cx,cn),top)-0.8;
      STP.push([cx,(top+yb)/2,cn,ang,tr+0.03,top-yb,F.w]);
      if(WALKG&&WALKG.h){const c=Math.cos(ang),sn=Math.sin(ang),A=(u,v)=>[cx+c*u-sn*v,-(cn+sn*u+c*v)],q=[A(-tr/2,-hw),A(tr/2,-hw),A(tr/2,hw),A(-tr/2,hw)];WALKG.tri(q[0][0],top,q[0][1],q[1][0],top,q[1][1],q[2][0],top,q[2][1]);WALKG.tri(q[0][0],top,q[0][1],q[2][0],top,q[2][1],q[3][0],top,q[3][1])}
      /* מעקה אבן מדורג משני הצדדים; ליד הצמתים (2 מ׳ מכל קצה) פתוח, כדי שאפשר לעבור בין גרמי המדרגות */
      if(s<2||s>L-2)continue;
      /* 127.0: F.open = [[קטע, צד]] — צד פתוח בלי מעקה (ראש המדרגות מגשר וילסון נפתח אל הגשר) */
      [1,-1].forEach(sd=>{if(F.open&&F.open.some(o=>o[0]===i&&o[1]===sd))return;const ox=cx+px*sd*(hw+0.15),on=cn+pn*sd*(hw+0.15),go=H(cx+px*sd*(hw+4.5),cn+pn*sd*(hw+4.5)),tp=Math.max(top+0.95,go+0.15);SIDE.push([ox,(tp+yb)/2,on,ang,tr+0.03,tp-yb,0.3])})}
    if(L>4.5)[1,-1].forEach(sd=>{if(F.open&&F.open.some(o=>o[0]===i&&o[1]===sd))return;const mx=(a[0]+b[0])/2+px*sd*(hw+0.15),mn=(a[1]+b[1])/2+pn*sd*(hw+0.15),lo=PLZ+Math.min(a[2],b[2]);cwAdd(mx,mn,ang,L-4,0.3,lo-2,PLZ+Math.max(a[2],b[2])+3);
      /* מאחז יד ממתכת על המעקה */
      const sl=Math.atan2(-drop,L);HR.push([mx-px*sd*0.05,PLZ+(a[2]+b[2])/2+1.0,mn-pn*sd*0.05,ang,Math.hypot(L-4,drop*(L-4)/L),0.05,0.05,sl])})}});
  const SI={n:"המדרגות מהרובע היהודי לכותל",r:"תמונות רחוב (Mapillary, 2014–2023); OpenStreetMap",t:"📜 המדרגות יורדות מהרובע היהודי אל רחבת הכותל, לאורך השבילים שבמפה, עם מעקה אבן ומאחז יד, כמו בתמונות. 💡 גובה כל מדרגה (16 ס״מ) והרוחב (3.2 מ׳) מקורבים."};
  {const q=G2S(-190,-147);label("רחוב הרב גץ",q[0],PLZ+12,-q[1],null,{n:"רחוב הרב גץ",r:"מפת רחובות; תוכנית רחבת הכותל",t:"📜 השביל הקצר שיוצא מצפון־מערב רחבת הכותל מערבה אל רחוב הגיא, ליד בית הכנסת שומרי החומות. הוא נקרא על שם הרב מאיר יהודה גץ, רב הכותל. 💡 במודל הוא יורד במדרגות אבן מגובה רחוב הגיא אל מפלס הרחבה."}).m=true}
  {const q=G2S(-140,-131);label("מדרגות מגשר וילסון",q[0],PLZ+10,-q[1],null,{n:"המדרגות מגשר וילסון אל רחבת הכותל",r:"תוכנית רחבת הכותל, כניסה 6",t:"💡 מי שבא משער יפו ברחוב השלשלת יורד בסוף הרחוב במדרגות רחבות אל גשר וילסון, ובאמצע הגשר יורד במדרגות האלה אל צפון רחבת הכותל, בלי לעלות להר. הבניין שחסם היום את סוף הרחוב מעל הגשר לא נבנה. היום אין כאן ירידה ישירה. 💡 המקום והמידות הם הצעה."}).m=true}
  put(STP,MAT(0xd9cdb2),SI);put(SIDE,M.stoneL||MAT(0xcfc2a5),SI);put(HR,MAT(0x3a3d40,{metalness:0.5,roughness:0.5}),SI);

  // 2) הרחבה הדרומית: ריצוף, וקיר תמך בקצה שבו הקרקע גבוהה יותר
  {const sh=new THREE.Shape();KP.forEach((q,i)=>i?sh.lineTo(q[0],q[1]):sh.moveTo(q[0],q[1]));const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);{const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/4,uv.getY(i)/4)}
    const m=new THREE.Mesh(g,M.pave);m.position.y=PLZ+0.21;m.receiveShadow=true;m.renderOrder=2;m.userData={n:"הרחבה הדרומית של רחבת הכותל",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 בתמונות זו רחבה ישרה ומרוצפת בגובה רחבת הכותל. במודל היה כאן מדרון שלא קיים. 💡 בעתיד היא רק להולכי רגל: מגיעים אליה משער האשפות ומהמדרגות של הרובע, וממשיכים לכותל, לשער קיפונוס ולשערי חולדה. מכוניות לא נכנסות (רק אמבולנס). עמדות הבידוק והגדרות של היום לא נבנו. ⚖️ קדשים קלים \"נאכלים בכל העיר\" (זבחים ה, ז), ולכן אפשר גם לשבת כאן ולאכול."};WG.add(m);PICK.push(m);}

  // 3) אזור התפילה ליד הכותל: גדר נמוכה עם פתחים, ארונות קודש, ארונות ספרים, כיסאות, שולחנות, סטנדרים ושמשיות
  {let best=null;for(let i=0;i<MOUNT.length;i++){const a=MOUNT[i],b=MOUNT[(i+1)%MOUNT.length],dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((-93-a[0])*dx+(-147-a[1])*dn)/l2)),fx=a[0]+dx*t,fn=a[1]+dn*t,e=Math.hypot(fx+93,fn+147);if(!best||e<best.e)best={e,fx,fn,dx,dn}}
    const l=Math.hypot(best.dx,best.dn);let ax=best.dx/l,an=best.dn/l;if(an<0){ax=-ax;an=-an}/* al חיובי = צפונה */
    let ox=-an,on=ax;if(ox>0){ox=-ox;on=-on}/* nn חיובי = מערבה, אל הרחבה */
    const P=(nn,al)=>[best.fx+ox*nn+ax*al,best.fn+on*nn+an*al],WA=Math.atan2(an,ax)/* כיוון לאורך הכותל */,FACE=Math.atan2(-on,-ox)/* מבט אל הכותל */;
    const FEN=[],ARK=[],BOOK=[],CH=[],TB=[],SHT=[],UMP=[],UMT=[];
    // הגדר: 26 מ׳ מהכותל, מ־25 מ׳ דרומה עד 24 מ׳ צפונה, עם ארבעה פתחים של 3 מ׳
    const OPEN=[-18,-6,8,18],FN=26;let runs=[],cur=-25;OPEN.forEach(o=>{runs.push([cur,o-1.5]);cur=o+1.5});runs.push([cur,24]);
    /* 126.4 (תוכנית רחבת הכותל): במקום גדר המתכת של היום, מעקה אבן נמוך (אבן בלבד, כמו כל הרחבה), עם אותם פתחים */
    const CAP=[];runs.forEach(([s0,s1])=>{const L=s1-s0;if(L<0.5)return;const c=P(FN,(s0+s1)/2);bx(FEN,c[0],c[1],Y0-0.1,0.78,WA,L,0.42);bx(CAP,c[0],c[1],Y0+0.68,0.12,WA,L+0.08,0.52);cwAdd(c[0],c[1],WA,L,0.45,PLZ-1,Y0+0.8)});
    const FI={n:"מעקה אבן לפני אזור התפילה",r:"תוכנית רחבת הכותל; תמונות רחוב (Mapillary)",t:"📜 היום יש כאן גדר מתכת נמוכה עם פתחים. 💡 בעתיד: מעקה אבן נמוך באותו מקום ועם אותם פתחים, מאותה אבן של הרחבה. הוא מסמן את אזור התפילה ולא סוגר אותו."};
    put(FEN,M.stoneL||MAT(0xcfc2a5),FI);put(CAP,MAT(0xe2d6bb),FI);
    const busy=[];const free=(nn,al,rad)=>busy.every(b=>Math.hypot(b[0]-nn,b[1]-al)>b[2]+rad);
    [6,12,18].forEach(al=>{const q=P(1.1,al);bx(ARK,q[0],q[1],Y0,2.4,WA,1.5,0.75);busy.push([1.1,al,1.4])});
    [[24.6,4],[24.6,13],[24.6,21],[24.6,-11],[24.6,-21]].forEach(([nn,al])=>{const q=P(nn,al);bx(BOOK,q[0],q[1],Y0,1.9,WA,2.2,0.45);busy.push([nn,al,1.6])});
    busy.push([14,0,0.9]);/* המחיצה */
    const place=(cnt,a0,a1,rad,fn)=>{let k=0,t=0;while(k<cnt&&t<cnt*40){t++;const nn=2+r()*21.5,al=a0+r()*(a1-a0);if(Math.abs(al)<1.2||!free(nn,al,rad))continue;busy.push([nn,al,rad]);fn(nn,al);k++}};
    const chair=(nn,al)=>{const q=P(nn,al),f=FACE+(r()-0.5)*1.2,c=Math.cos(f),s=Math.sin(f);CH.push([q[0],Y0+0.45,q[1],f,0.44,0.05,0.44]);CH.push([q[0]-c*0.2,Y0+0.7,q[1]-s*0.2,f,0.05,0.45,0.44]);CH.push([q[0],Y0+0.21,q[1],f,0.36,0.42,0.36])};
    place(10,2,23,1.2,(nn,al)=>{const q=P(nn,al);TB.push([q[0],Y0+0.72,q[1],WA,1.8,0.04,0.75]);TB.push([q[0],Y0+0.35,q[1],WA,1.6,0.7,0.04]);chair(nn+0.9,al)});
    place(20,1.5,23,0.5,(nn,al)=>{const q=P(nn,al);bx(SHT,q[0],q[1],Y0,1.15,FACE,0.4,0.5)});
    place(8,-24,-1.5,0.5,(nn,al)=>{const q=P(nn,al);bx(SHT,q[0],q[1],Y0,1.15,FACE,0.4,0.5)});
    place(90,1.5,23,0.4,chair);place(45,-24,-1.5,0.4,chair);
    /* 126.4 (תוכנית רחבת הכותל): בלי שמשיות. הכלל של שמואל: בלי סככות על הרחבה, והמודל מראה את העתיד ולא ריהוט של קיץ */
    const PI={n:"אזור התפילה ליד הכותל",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 ליד הכותל עומדים ארונות קודש מעץ, ארונות ספרים, כיסאות, שולחנות וסטנדרים, כמו בתמונות. 💡 המקום של כל פריט הוא השלמה. 💡 השמשיות של היום לא נבנו (בלי סככות על הרחבה). ⚖️ המתפללים פונים מזרחה, אל המקדש: \"היה עומד בירושלים, יכוון את ליבו כנגד בית המקדש\" (ברכות ל ע״א)."};
    put(ARK,MAT(0x6b4a2b),PI);put(BOOK,MAT(0x5a3d24),PI);put(CH,MAT(0xf1f0ea,{roughness:0.6}),PI);put(TB,MAT(0xeeeeea,{roughness:0.6}),PI);put(SHT,MAT(0x7a5634),PI);
}

  // 4) כיור נטילת ידיים ברחבה, ופנסי רחוב
  {const KI=[],KC=[],x=-140,n=-177.5;KI.push([x,Y0+0.38,n,0,1.3,0.76,1.3]);KC.push([x,Y0+0.85,n,0,0.3,1.2,0.3]);cwAdd(x,n,0,1.4,1.4,PLZ-1,Y0+0.76);
    put(KI,M.stoneL||MAT(0xcfc2a5),{n:"כיור נטילת ידיים",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 כיור אבן עגול עם עמוד ברזים באמצע, ברחבה שלפני אזור התפילה, כמו בתמונות."},new THREE.CylinderGeometry(0.5,0.42,1,20));
    put(KC,MAT(0x8a6b3c,{metalness:0.6,roughness:0.4}),{n:"כיור נטילת ידיים",r:"תמונות רחוב (Mapillary)",t:"📜 עמוד הברזים של הכיור."},new THREE.CylinderGeometry(0.4,0.5,1,12))}
  {const LP=[],LH=[];[[-168,-205],[-158,-186],[-150,-166],[-146,-146],[-152,-232],[-140,-244],[-160,-245],[-128,-228],[-132,-200],[-125,-120]].forEach(([x,n])=>{if(!inPoly(x,n,PLAZA)&&!inPoly(x,n,KP))return;LP.push([x,Y0+3.5,n,0,0.14,7,0.14]);LH.push([x,Y0+7.05,n,0,0.7,0.18,0.35])});
    const LI={n:"פנס רחוב",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 פנסים גבוהים ודקים ברחבה, כמו בתמונות. 💡 המקום של כל פנס הוא השלמה."};put(LP,MAT(0x34383c,{metalness:0.5}),LI);put(LH,MAT(0x2a2d30,{metalness:0.5}),LI)}

  // 5) מדרגות אבן (טרסות) על המדרון שבין הרחבה לבין הרובע: בתמונות אין שם מדרון חול, אלא קירות אבן ובתים. כל טרסה מכסה עלייה של עד 6 מ׳ אופקית
  {const TW=[],nearE0=(x,n)=>{const u=(x+175.5)*-0.983+(n+169)*-0.185,v=(x+175.5)*0.185+(n+169)*-0.983;return u>-3&&u<34&&Math.abs(v)<10},
    inBld=(x,n)=>{const L=CB.b.get(cbK(Math.floor(x/CB.st),Math.floor(n/CB.st)));if(!L)return false;for(const o of L){if(x>=o.xa&&x<=o.xb&&n>=o.na&&n<=o.nb&&inPoly(x,n,o.p))return true}return false};
    [PLAZA,KP].forEach(P=>{for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn);if(L<1)continue;const ux=dx/L,un=dn/L;let px=-un,pn=ux;const mx=(a[0]+b[0])/2,mn=(a[1]+b[1])/2;if(inPoly(mx+px*0.8,mn+pn*0.8,P)){px=-px;pn=-pn}const ang=Math.atan2(dn,dx);
      for(let s=1;s<L;s+=2){const ex=a[0]+ux*s,en=a[1]+un*s;if(ex>-100)continue;let gc=PLZ;
        for(const off of [0.5,6.5,12.5,18.5]){const x=ex+px*off,n=en+pn*off;if(nearE0(x,n)||inPoly(x,n,KP)||inPoly(x,n,PLAZA)||inPoly(x,n,KZ)||inBld(x,n)||inPoly(x,n,MOUNT_BIG)||onStreet(x,n))break;const k=kstAt(x,n);if(k&&k.d<k.w/2+2)break;
          const g1=H(ex+px*(off+5.5),en+pn*(off+5.5));if(g1-gc<1.2){if(off>0.6)break;continue}const tp=Math.min(g1+0.3,gc+7);TW.push([x,(gc-0.4+tp)/2,n,ang,2.15,tp-gc+0.4,0.8]);cwAdd(x,n,ang,2.15,0.8,gc-1,tp);gc=Math.min(g1,tp)}}}});
    put(TW,M.stoneL||MAT(0xcfc2a5),{n:"קירות אבן בין הרחבה לרובע",r:"תמונות רחוב (Mapillary, 2014–2023)",t:"📜 בתמונות, בין רחבת הכותל לבין הרובע היהודי שמעליה, עולים קירות אבן ובתים, ולא מדרון של עפר. 💡 כאן הם בנויים כטרסות לפי פני הקרקע של המודל."})
    /* 126.4 (תוכנית רחבת הכותל, ג5): בשוליים שבמערב ובצפון, במקום מדרון חול – טרסות אבן שטוחות במדרגות של 4.5 מ׳ (נושא 2), עם קיר אבן בכל מעבר בין טרסות */
    {const EDG=[];[PLAZA,KP,KZ].forEach(P=>{for(let i=0;i<P.length;i++)EDG.push([P[i],P[(i+1)%P.length]])});
     const dE=(x,n)=>{let m=1e9;for(const [a,b] of EDG){const dx=b[0]-a[0],dn=b[1]-a[1],l2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-a[0])*dx+(n-a[1])*dn)/l2));m=Math.min(m,Math.hypot(x-a[0]-dx*t,n-a[1]-dn*t))}return m};
     /* 127.0: הרשת ממשיכה צפונה עד n=-74, אל מדרון החול שמצפון לגשר וילסון (בין הבתים לכותל, עד שער המטהרה). מתחת לגשר עצמו לא בונים */
     const DK=(window.__MG||[]).find(g=>g.n==="שער השלשלת"),dkw=DK&&DK.w_,underDeck=(x,n)=>{if(!dkw||x<-168)return false;const t=(x-dkw.x)/dkw.ox;return Math.abs(n-(dkw.n+dkw.on*t))<DK.w/2+3};
     const S=2,X0=-200,N0=-280,NX=52,NN=103,LV=new Float32Array(NX*NN).fill(NaN);
     const ok=(x,n)=>{if(x>-97||inPoly(x,n,PLAZA)||inPoly(x,n,KP)||inPoly(x,n,KZ)||inPoly(x,n,MOUNT_BIG)||nearE0(x,n)||inBld(x,n)||onStreet(x,n))return false;const k=kstAt(x,n);if(k&&k.d<k.w/2+1.5)return false;if(underDeck(x,n))return false;return dE(x,n)<30||(x>-162&&n>-124)};
     for(let i=0;i<NX;i++)for(let j=0;j<NN;j++){const x=X0+(i+0.5)*S,n=N0+(j+0.5)*S;if(!ok(x,n))continue;const d=Math.max(H(x,n),TY(x,n))-PLZ;if(d>27)continue;LV[j*NX+i]=PLZ+0.22+Math.max(0,Math.round(d/4.5))*4.5}
     /* מחליקים את קווי הטרסות: כל תא מקבל את הגובה הנפוץ בין 5×5 השכנים שלו (שלוש פעמים), כדי שהקירות יהיו ישרים ולא משוננים */
     for(let it=0;it<3;it++){const L0=LV.slice();for(let i=0;i<NX;i++)for(let j=0;j<NN;j++){if(isNaN(L0[j*NX+i]))continue;const c=new Map();for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=NX||jj>=NN)continue;const v=L0[jj*NX+ii];if(!isNaN(v))c.set(v,(c.get(v)||0)+1)}let bv=L0[j*NX+i],bc=0;c.forEach((k,v)=>{if(k>bc||(k===bc&&v===L0[j*NX+i])){bc=k;bv=v}});LV[j*NX+i]=bv}}
     const TOP=[],RIS=[],q=(x,y,n)=>[x,y,-n];
     for(let i=0;i<NX;i++)for(let j=0;j<NN;j++){const L=LV[j*NX+i];if(isNaN(L))continue;const x=X0+i*S,n=N0+j*S;
       const A=q(x,L,n),B=q(x+S,L,n),C=q(x+S,L,n+S),D=q(x,L,n+S);TOP.push(...A,...B,...C,...A,...C,...D);
       if(WALKG&&WALKG.h){WALKG.tri(A[0],L,A[2],B[0],L,B[2],C[0],L,C[2]);WALKG.tri(A[0],L,A[2],C[0],L,C[2],D[0],L,D[2])}
       [[1,0],[-1,0],[0,1],[0,-1]].forEach(([di,dj])=>{const ii=i+di,jj=j+dj;let L2=(ii>=0&&jj>=0&&ii<NX&&jj<NN)?LV[jj*NX+ii]:NaN;if(isNaN(L2)){const xx=X0+(ii+0.5)*S,nn=N0+(jj+0.5)*S;L2=Math.min(L-0.2,Math.max(PLZ,H(xx,nn)))}if(L2>=L-0.3)return;
         const ex=di>0?x+S:di<0?x:x+S/2,en=dj>0?n+S:dj<0?n:n+S/2,ang=di?Math.PI/2:0,h=L-L2+0.3;RIS.push([ex,L2-0.3+h/2,en,ang,S+0.02,h,0.5]);if(L-L2>1.2)cwAdd(ex,en,ang,S,0.5,L2-1,L)})}
     if(TOP.length){try{TMESH.conform(TOP,{lo:0.15,hi:99})}catch(e){console.warn("kotel terraces conform",e)}
       const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(TOP,3));g.computeVertexNormals();const m=new THREE.Mesh(g,M.pave);m.receiveShadow=true;m.renderOrder=2;
       const TI={n:"טרסות האבן בשולי הרחבה",r:"תוכנית רחבת הכותל; נושא 2 (טרסות של 4.5 מ׳)",t:"💡 בין רחבת הכותל לבין הרובע היהודי, וגם מצפון לגשר וילסון, הקרקע עולה בטרסות שטוחות של אבן, 4.5 מ׳ כל אחת, ולא במדרון חול. עולים ויורדים רק במדרגות."};m.userData=TI;WG.add(m);PICK.push(m);put(RIS,M.stoneL||MAT(0xcfc2a5),TI)}}
  }
  /* 127.0 (תוכנית רחבת הכותל, סעיף ו): חדר ההכנה בתוך מרפסת האבן של קיפונוס. נכנסים מהקצה הדרומי (ימין של מי שעולה, מידות ב, ב) ויוצאים בקצה הצפוני.
     בחזית שפונה לרחבה: שורת קשתות אבן משני צדי המדרגות, כמו החנויות שנמצאו ברחוב שלמרגלות קשת רובינסון. בצד הדרומי, תחת הקשתות: ברזים וספסלי אבן לרחיצת רגליים, אחרונה לפני העלייה.
     בצד הצפוני: דלפק עץ להחזרת החפצים וספסלים לנעילת נעליים. בקצה הדרומי: שתי דלתות למקוואות (גברים, נשים) משני צדי דלת החדר. 💡 הכול הצעה; מקור: ברכות ט, ה */
  {const kG=(window.__MG||[]).find(q=>q.k==="K"),w=kG&&kG.w_;if(w){const fx=Math.cos(w.a),fn=Math.sin(w.a),P=(nn,al)=>[w.x+w.ox*nn+fx*al,w.n+w.on*nn+fn*al],yb=PLZ+0.25,TD=10,TW=30,a=w.a;
    const DK=[],FR=[],BEN=[],TR=[],WAT=[],TAP=[],CTR=[];
    const lab=(t,nn,al,y,info)=>{const p=P(nn,al),q=G2S(p[0],p[1]);label(t,q[0],y,-q[1],null,info).m=true};
    [-1,1].forEach(sd=>{[11.0,13.5].forEach(c=>{const al=sd*c;
      /* פתח קשת: מלבן כהה ומעליו שתי מדרגות כהות קטנות (קשת), ומסגרת אבן בהירה */
      {const p=P(TD+0.03,al);bx(DK,p[0],p[1],yb,2.3,a,1.9,0.1);bx(DK,p[0],p[1],yb+2.3,0.32,a,1.5,0.1);bx(DK,p[0],p[1],yb+2.62,0.24,a,0.9,0.1)}
      [-1,1].forEach(s2=>{const p=P(TD+0.08,al+s2*1.12);bx(FR,p[0],p[1],yb,2.45,a,0.34,0.2)});
      {const p=P(TD+0.08,al);bx(FR,p[0],p[1],yb+2.95,0.3,a,2.6,0.2)}
      if(sd>0){/* רחיצת רגליים: ספסל אבן נמוך, תעלת אבן עם מים, ושני ברזי נחושת בכל קשת */
        {const p=P(TD+1.75,al);bx(BEN,p[0],p[1],yb,0.42,a,2.0,0.45)}
        {const p=P(TD+0.75,al);bx(TR,p[0],p[1],yb,0.22,a,2.0,0.7);bx(WAT,p[0],p[1],yb+0.2,0.04,a,1.8,0.5)}
        [-0.5,0.5].forEach(o=>{const p=P(TD+0.18,al+o);bx(TAP,p[0],p[1],yb+0.75,0.05,a,0.06,0.3)})}
      else{/* יציאה: דלפק עץ להחזרת החפצים וספסל לנעילת נעליים */
        {const p=P(TD+0.45,al);bx(CTR,p[0],p[1],yb,1.05,a,1.9,0.55)}
        {const p=P(TD+2.0,al);bx(BEN,p[0],p[1],yb,0.42,a,2.0,0.45)}}})});
    /* שתי דלתות מקווה בקצה הדרומי, משני צדי דלת החדר (שנמצאת באמצע הקצה) */
    [1.8,8.2].forEach(nn=>{const p=P(nn,TW/2+0.06);bx(DK,p[0],p[1],yb,2.3,a+Math.PI/2,1.3,0.12);const f=P(nn,TW/2+0.12);bx(FR,f[0],f[1],yb+2.3,0.3,a+Math.PI/2,1.8,0.22)});
    const IW={n:"רחיצת הרגליים לפני העלייה",r:"ברכות ט, ה; תוכנית רחבת הכותל",t:"⚖️ \"לא יכנס להר הבית במקלו ובמנעלו ובפונדתו ובאבק שעל רגליו\" (ברכות ט, ה). 💡 תחת הקשתות בצד הדרומי של מרפסת קיפונוס: ספסלי אבן נמוכים וברזים, זה הדבר האחרון לפני שעולים. משם יוצאים ישר אל צד העלייה של המדרגות."};
    const IC={n:"החזרת החפצים ביציאה",r:"תוכנית רחבת הכותל",t:"💡 מי שיורד מההר יוצא בצד הצפוני (מידות ב, ב: יוצאים דרך שמאל). כאן, תחת הקשתות, מקבלים בחזרה את המקל, הארנק והנעליים שהופקדו בכניסה הדרומית, ויש ספסלים לנעול נעליים. כך אין שני זרמים של אנשים באותה דלת."};
    const IA={n:"קשתות חדר ההכנה",r:"חפירות הרחוב שלמרגלות קשת רובינסון; תוכנית רחבת הכותל",t:"📜 ברחוב ההרודיאני שלמרגלות הכותל נמצאה שורת חנויות קטנות בקשתות אבן. 💡 חזית חדר ההכנה בנויה כך: קשתות אבן פתוחות, בלי שלטים מודרניים ובלי זכוכית. החדר עצמו נמצא בתוך מרפסת האבן שלפני השער, ולא כבניין על הרחבה."};
    const IM={n:"מקוואות לפני העלייה",r:"פסחים סח ע״א; רמב״ם, הלכות ביאת מקדש ג",t:"⚖️ מי שצריך טבילה לא נכנס להר הבית עד שיטבול (פסחים סח ע״א; רמב״ם, ביאת מקדש ג). 💡 בקצה הדרומי של המרפסת, משני צדי הכניסה לחדר ההכנה, שתי דלתות למקוואות: אחת לגברים ואחת לנשים. מי שצריך טובל ראשון, ורק אחר כך מפקיד את חפציו."};
    put(DK,MAT(0x2b251d),IA);put(FR,M.stoneL||MAT(0xcfc2a5),IA);put(BEN,M.stoneL||MAT(0xcfc2a5),IW);put(TR,MAT(0xb8ab92),IW);put(WAT,MAT(0x6f9fb5,{roughness:0.15,metalness:0.1}),IW);put(TAP,M.bronze||MAT(0xb07a48),IW);put(CTR,M.wood||MAT(0x8a6a48),IC);
    lab("רחיצת רגליים",TD+1,12.2,yb+4.6,IW);lab("החזרת חפצים",TD+1,-12.2,yb+4.6,IC);lab("מקוואות",5,TW/2+1,yb+5.6,IM)}}
  /* 127.0 (תוכנית רחבת הכותל, סעיף ו, שלב 5): אותו דבר בקטן בשערי חולדה. ליד כל אחת משתי הדלתות שבקצות גרם המדרגות: ספסל אבן, תעלה עם מים ושני ברזים. 💡 */
  {const HG=window.__HG;if(HG&&HG.doors&&HG.w){const w=HG.w,fx=Math.cos(w.a),fn=Math.sin(w.a),BN=[],TRH=[],WH=[],TPH=[];
    HG.doors.forEach((d,i)=>{const sd=i===0?-1:1;[-2.7,2.7].forEach(o=>{const bxp=(off)=>[d[0]+fx*sd*off+w.ox*o,d[2]+fn*sd*off+w.on*o];
      {const p=bxp(1.9);bx(BN,p[0],p[1],d[1],0.42,w.a+Math.PI/2,1.8,0.45)}{const p=bxp(0.75);bx(TRH,p[0],p[1],d[1],0.22,w.a+Math.PI/2,1.8,0.7);bx(WH,p[0],p[1],d[1]+0.2,0.04,w.a+Math.PI/2,1.6,0.5)}
      [-0.45,0.45].forEach(t=>{const p=bxp(0.2),q=[p[0]+w.ox*t,p[1]+w.on*t];bx(TPH,q[0],q[1],d[1]+0.75,0.05,w.a+Math.PI/2,0.06,0.3)})})});
    const IH={n:"רחיצת רגליים בשערי חולדה",r:"ברכות ט, ה; תוכנית רחבת הכותל",t:"⚖️ \"ובאבק שעל רגליו\" (ברכות ט, ה). 💡 ליד חדרי הנעליים שבשני קצות מדרגות חולדה, ספסלי אבן וברזים לרחיצת רגליים, כמו בקיפונוס אבל בקטן. מי שצריך טבילה טובל במקוואות שבחדר שבקצה המדרגות לפני העלייה."};
    put(BN,M.stoneL||MAT(0xcfc2a5),IH);put(TRH,MAT(0xb8ab92),IH);put(WH,MAT(0x6f9fb5,{roughness:0.15,metalness:0.1}),IH);put(TPH,M.bronze||MAT(0xb07a48),IH)}}
  /* 127.0 (כניסה 7): הכניסה למנהרות הכותל, פתח בקיר הדרומי של גשר וילסון, בצפון אזור התפילה. כרטיס בלבד, בלי לבנות מנהרה */
  {const kG=(window.__MG||[]).find(q=>q.n==="שער השלשלת"),w=kG&&kG.w_;if(w){const a=Math.atan2(w.on,w.ox),t=(-108-w.x)/w.ox,cn=w.n+w.on*t,hw=kG.w/2+1,PD=[],PF=[];
    const px=-108-(-w.on)*0,pn=cn-hw-0.05;bx(PD,px,pn,Y0,2.8,a,2.4,0.12);bx(PF,px,pn-0.06,Y0+2.8,0.45,a,3.4,0.25);[-1,1].forEach(s=>bx(PF,px+w.ox*s*1.45,pn-0.06+w.on*s*1.45,Y0,2.8,a,0.5,0.25));
    const IT={n:"הכניסה למנהרות הכותל",r:"חפירות מנהרות הכותל; תוכנית רחבת הכותל, כניסה 7",t:"📜 מכאן נכנסים למנהרות הכותל, שעוברות לאורך הכותל המערבי מתחת לבתי העיר, ויוצאות בצפון בויה דולורוזה. רואים בהן את האבנים הגדולות של החומה ואת הרחוב מימי בית שני. 📜 בתוך המנהרות, מול שער וורן, נמצא בית הכנסת שהקים הרב מאיר יהודה גץ, רב הכותל, במקום הקרוב ביותר לבית קודש הקודשים. 💡 המנהרות נשארות לסיור היסטורי. הן מחוץ להר הבית, ולכן אין בהן דיני כניסה להר. המנהרות עצמן לא בנויות במודל."};
    put(PD,MAT(0x221d17),IT);put(PF,M.stoneL||MAT(0xcfc2a5),IT);const q=G2S(px,pn-1);label("מנהרות הכותל",q[0],Y0+4,-q[1],null,IT).m=true}}
  /* 127.0 (כניסה 10): מעלית מהרובע היהודי אל הרחבה. פיר אבן צמוד לטרסות שבמערב הרחבה, ודלת נחושת לכיוון הרחבה. 💡 המקום הוא הצעה */
  {const LX=-183.6,LN=-192,LS=[],LDR=[],top=PLZ+15.5;bx(LS,LX,LN,Y0-0.2,top-Y0+0.2,0,3.8,3.8);bx(LS,LX,LN,top,0.35,0,4.3,4.3);bx(LDR,LX+1.93,LN,Y0,2.3,Math.PI/2,1.3,0.08);
    const IL={n:"מעלית מהרובע היהודי",r:"תוכנית רחבת הכותל, כניסה 10",t:"💡 מעלית בפיר אבן, מהרובע היהודי ישר אל מפלס רחבת הכותל, למי שלא יכול לרדת במדרגות: זקנים, עגלות ילדים וכיסאות גלגלים. הפיר צמוד לטרסות שבמערב הרחבה, כך שאין מגדל חדש באמצע הרחבה. 💡 המקום והצורה הם הצעה; העירייה מתכננת מעלית כזו."};
    put(LS,M.stoneL||MAT(0xcfc2a5),IL);put(LDR,M.bronze||MAT(0xb07a48),IL);const q=G2S(LX+3,LN);label("מעלית מהרובע",q[0],Y0+4,-q[1],null,IL).m=true}
}catch(e){console.warn("kotel plaza",e)}})();
