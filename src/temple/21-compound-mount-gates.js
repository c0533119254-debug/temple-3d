// ---- compound ----
let PALMF=null,SSAO=false,ssaoC=null,PLAN="ez",RIVG=null,WALLG=null,SHOW_RIVER=true,SHOW_WALL=false,KDS=null,INT=null,INTBOX=null,KBOX=null,INSIDE=0,EGATE=null,DAY="shabbat",COMP=null,COL=[],GLIST=[];function interiorPose(){return[INT.p.clone(),INT.t.clone()]}
let FESTG=null,SHOW_FEST=false;const HELP_FEST={n:"מצב חג",r:"סוכה ה; ביכורים ג; סוטה ז, ח",t:"⚖️ מראה את ההר בחג: ארבע המנורות של שמחת בית השואבה והרוקדים באבוקות, בימת ההקהל של המלך, ותהלוכת הביכורים עם השור. לחצו על כל אחד מהם כדי לקרוא עליו. 💡 המקומות בחצר החיצונה הם הצעה."};
let group=null,cPick=[],cLabels=[],C=new THREE.Vector3(),flames=[],smoke=null,smokeData=[],fireLight=null,ksm=null,PFX=[],MENL=null;
// stage 5b: natural fire and smoke (the page uses a logarithmic depth buffer, so the shaders include the logdepth chunks). Each particle is a soft, rotated puff that rises, changes colour and fades.
const PUFF=(()=>{const c=cv(128,128,(x,w,h)=>{const r=rng(321);x.fillStyle="#000";x.fillRect(0,0,w,h);x.globalCompositeOperation="lighter";
  for(let i=0;i<26;i++){const a=r()*6.28,d=r()*26,px=64+Math.cos(a)*d,py=64+Math.sin(a)*d,rad=14+r()*26,g=x.createRadialGradient(px,py,0,px,py,rad);g.addColorStop(0,"rgba(255,255,255,0.22)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,w,h)}
  x.globalCompositeOperation="destination-in";const m=x.createRadialGradient(64,64,10,64,64,63);m.addColorStop(0,"#fff");m.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=m;x.fillRect(0,0,w,h)});const t=new THREE.CanvasTexture(c);return t})();
function makePFX(n,fire,em,o){o=o||{};const g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),life=new Float32Array(n),size=new Float32Array(n),rot=new Float32Array(n);
  g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("aLife",new THREE.BufferAttribute(life,1));g.setAttribute("aSize",new THREE.BufferAttribute(size,1));g.setAttribute("aRot",new THREE.BufferAttribute(rot,1));
  const mat=new THREE.ShaderMaterial({uniforms:{uTex:{value:PUFF},uScale:{value:600},uSmoke:{value:new THREE.Color(0xbdb8b0)},uGlow:{value:1}},transparent:true,depthWrite:false,blending:fire?THREE.AdditiveBlending:THREE.NormalBlending,
    vertexShader:"#include <common>\n#include <logdepthbuf_pars_vertex>\nattribute float aLife;attribute float aSize;attribute float aRot;varying float vLife;varying float vRot;uniform float uScale;void main(){vLife=aLife;vRot=aRot;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=min(700.0,aSize*uScale/max(0.2,-mv.z));\n#include <logdepthbuf_vertex>\n}",
    fragmentShader:fire?"#include <logdepthbuf_pars_fragment>\nuniform sampler2D uTex;uniform float uGlow;varying float vLife;varying float vRot;void main(){\n#include <logdepthbuf_fragment>\nvec2 p=gl_PointCoord-0.5;float c=cos(vRot),s=sin(vRot);p=mat2(c,-s,s,c)*p;float a=texture2D(uTex,p+0.5).r;if(a<0.01)discard;float t=vLife;vec3 col=mix(vec3(1.0,0.93,0.62),vec3(1.0,0.5,0.1),smoothstep(0.0,0.4,t));col=mix(col,vec3(0.55,0.1,0.02),smoothstep(0.4,1.0,t));gl_FragColor=vec4(col,a*(1.0-t)*(1.0-t)*smoothstep(0.0,0.1,t)*uGlow);}"
      :"#include <logdepthbuf_pars_fragment>\nuniform sampler2D uTex;uniform vec3 uSmoke;varying float vLife;varying float vRot;void main(){\n#include <logdepthbuf_fragment>\nvec2 p=gl_PointCoord-0.5;float c=cos(vRot),s=sin(vRot);p=mat2(c,-s,s,c)*p;float a=texture2D(uTex,p+0.5).r;if(a<0.01)discard;float t=vLife;gl_FragColor=vec4(uSmoke*mix(0.72,1.05,t),a*0.42*smoothstep(0.0,0.15,t)*(1.0-t));}"});
  if(o.col)mat.uniforms.uSmoke.value.setHex(o.col);const pts=new THREE.Points(g,mat);pts.frustumCulled=false;pts.renderOrder=fire?6:5;
  const W8=em.map(e=>e.w||1),WS=W8.reduce((a,b)=>a+b,0),r=rng(o.seed||1),P=[];
  const spawn=(q,first)=>{let x=r()*WS,i=0;while(i<em.length-1&&x>W8[i]){x-=W8[i];i++}const e=em[i],sc=e.s||1;q.e=e;q.x=e.x+(r()-0.5)*2*e.rx;q.y=e.y;q.z=e.z+(r()-0.5)*2*(e.rz||e.rx);
    if(fire){q.vy=(1.4+r()*1.6)*sc;q.ttl=(0.45+r()*0.7)*Math.sqrt(sc);q.s0=(1.1+r()*1.3)*sc}else{q.vy=(o.vy||1.2)*(0.8+r()*0.45)*Math.sqrt(sc);q.ttl=(o.ttl||8)*(0.75+r()*0.5);q.s0=(0.8+r()*0.6)*sc}
    q.ph=r()*6.28;q.rs=(r()-0.5)*(fire?2:0.4);q.rot=r()*6.28;q.l=first?r():0};
  for(let i=0;i<n;i++){const q={};spawn(q,true);P.push(q)}
  const S={pts,fixed:!!o.col,tick(dt,tt){for(let i=0;i<n;i++){const q=P[i];q.l+=dt/q.ttl;if(q.l>=1)spawn(q,false);const l=q.l,sc=q.e.s||1;
      let x,z,y=q.y+q.vy*q.ttl*l*(fire?(1-0.35*l):1);
      if(fire){x=q.x+Math.sin(tt*7+q.ph)*0.18*sc*l-(q.x-q.e.x)*0.55*l;z=q.z+Math.cos(tt*6+q.ph)*0.18*sc*l-(q.z-q.e.z)*0.55*l;size[i]=q.s0*(1-0.55*l)}
      else{const d=(o.drift||0)*q.ttl*l*l;x=q.x+d+Math.sin(tt*0.3+q.ph)*0.25*l*sc;z=q.z+Math.cos(tt*0.27+q.ph)*0.25*l*sc;size[i]=q.s0*(1+l*(o.grow||4))}
      pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;life[i]=l;q.rot+=q.rs*dt;rot[i]=q.rot}
    g.attributes.position.needsUpdate=true;g.attributes.aLife.needsUpdate=true;g.attributes.aSize.needsUpdate=true;g.attributes.aRot.needsUpdate=true}};
  S.tick(0.016,0);PFX.push(S);return pts}
// ---- gates of the Temple Mount, joined to the streets they open onto ----
const GATEG=new THREE.Group();WG.add(GATEG);
(function(){const d=new THREE.Object3D(),cx=MOUNT.reduce((a,p)=>a+p[0],0)/MOUNT.length,cn=MOUNT.reduce((a,p)=>a+p[1],0)/MOUNT.length;
  const wallAt=(x,n)=>{let best=[1e9,0,0,0];for(let i=0;i<MOUNT.length;i++){const a=MOUNT[i],b=MOUNT[(i+1)%MOUNT.length],dx=b[0]-a[0],dn=b[1]-a[1],L2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-a[0])*dx+(n-a[1])*dn)/L2)),px=a[0]+dx*t,pn=a[1]+dn*t,e=Math.hypot(px-x,pn-n);if(e<best[0])best=[e,px,pn,Math.atan2(dn,dx)]}
    let ox=-Math.sin(best[3]),on=Math.cos(best[3]);if((best[1]+ox*5-cx)*ox+(best[2]+on*5-cn)*on<0){}if(inPoly(best[1]+ox*3,best[2]+on*3,MOUNT)){ox=-ox;on=-on}return{x:best[1],n:best[2],a:best[3],ox,on}};
  const M_={n:"",r:"",t:""};
  const SRC="משנה מידות א, ג; הר הבית היום";
  const G=[
    {n:"שער חולדה המערבי (השער הכפול)",x:-35.1,n2:-251.3,w:14,k:"S",five:1,t:"⚖️ \"שני שערי חולדה מן הדרום, משמשין כניסה ויציאה\" (מידות א, ג). ⚖️ \"כל הנכנסין להר הבית נכנסין דרך ימין... ויוצאין דרך שמאל\" (מידות ב, ב). 💡 לכן השער המערבי (הכפול) הוא שער היציאה. 💡 הסף בגובה שנמדד, 725 מ׳ (וורן וכספי). מאחוריו אולם כניסה עם עמודים, ומעבר עם מדרגות שעולה בתוך ההר כ־11 מ׳ ויוצא לרחבה, כמו בימי בית שני. במעבר יש גם מדרגות נעות ומעליות למי שצריך. המחילות שמתחת להר \"לא נתקדשו\" (פסחים פו ע״א)."},
    {n:"שער חולדה המזרחי (השער המשולש)",x:30,n2:-239.8,w:16,k:"S",five:1,t:"⚖️ השער השני משערי חולדה (מידות א, ג). 💡 זה שער הכניסה: מי שבא מן הדרום ופונה צפונה, \"ימין\" שלו הוא המזרח (מידות ב, ב). 💡 לפניו מדרגות רחבות כמו המדרגות הדרומיות שנחשפו בחפירות, עם רחבות מנוחה. בתחתיתן מקוואות. מאחורי השער מעבר שעולה בתוך ההר ויוצא לרחבה."},
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
    return(x,n)=>{const k=Math.round(x*4)+","+Math.round(n*4);if(C.has(k))return C.get(k);o.set(x,120,-n);WG.localToWorld(o);rc.set(o,dn);const h=rc.intersectObjects(L,false);const y=h.length?WG.worldToLocal(h[0].point.clone()).y:TY(x,n);C.set(k,y);return y}})();
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
    else if(g.k==="K"){seg(-ow/2-0.8,ow/2+0.8,thr+4.2,1.04,-0.6,0.6)}
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
    if(low){const rise=thr-yo,N=Math.ceil(rise/0.17),tread=0.36,wid=g.w*2.5,FL=10,LAND=2.6;const run=i=>3+i*tread+Math.floor(i/FL)*LAND;const tot=run(N);
      for(let i=0;i<N;i++){const y=thr-i*rise/N,dist=run(i)+tread/2;steps.push([w.x+w.ox*dist,y,w.n+w.on*dist,w.a,wid,y-yo+0.6,tread+(i%FL===FL-1?LAND:0)+0.02])}
      paves.push([w.x+w.ox*1.6,thr+0.05,w.n+w.on*1.6,w.a,wid,0.3,3.2]);
      const ex=w.x+w.ox*(tot*0.35)+fx*(wid/2+2.6),en=w.n+w.on*(tot*0.35)+fn*(wid/2+2.6);lifts.push([ex,yo,en,w.a,thr-yo+3.2])}
    else if(!today)paves.push([w.x+w.ox*6,thr+0.05,w.n+w.on*6,w.a,g.w+4,0.1,7]);
    else if(gb>=thr-0.1&&!g.st_)paves.push([w.x+w.ox*4,thr+0.05,w.n+w.on*4,w.a,g.w+4,0.1,5]);
    // a gate whose street is far above the ground below it stands on a stone causeway, like Wilson's Arch under the Street of the Chain
    if(cwy){const thr=-1.5;let D=12;while(D<130&&H(w.x+w.ox*D,w.n+w.on*D)<thr-0.6)D+=2;D+=2;const yb=Math.min(yo,(PLZ+0.25))-1,cw=g.w+2,cx=w.x+w.ox*(D/2+2),cn=w.n+w.on*(D/2+2);
      paves.push([cx,thr+0.05,cn,w.a,cw-0.4,0.1,D]);[-1,1].forEach(sd=>{const a=P(2.5,sd*(cw/2-0.25)),b=P(D+2,sd*(cw/2-0.25));RAILS.push([a[0],thr+1.1,a[1],b[0],thr+1.1,b[1]])});const arcs=[];
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
      // mikvaot at the foot of the steps
      const yo=H(...P(14,0));const rise=HUL-yo;if(rise>0.5&&ent){const N=Math.ceil(rise/0.17),tot=3+N*0.36+Math.floor(N/10)*2.6,wid=g.w*2.5;
        const mi={n:"מקוואות",r:"רמב״ם הלכות ביאת המקדש ג; ממצאי העופל",t:"⚖️ לפני העלייה להר טובלים. בעופל נמצאו יותר מ־50 מקוואות מימי בית שני. 💡 כאן שני בתי מקוואות, אחד לגברים ואחד לנשים, משני צדי המדרגות."};
        [-1,1].forEach(sd=>{const p=P(tot+8,sd*(wid/2+9)),gy=H(p[0],p[1]);stoneG.push([p[0],gy+2,p[1],w.a,14,4,10]);stoneG.push([p[0],gy+4.15,p[1],w.a,14.6,0.3,10.6]);
          const d1=P(tot+3,sd*(wid/2+9));darkB.push([d1[0],gy+1.1,d1[1],w.a,1.6,2.2,0.2]);const q=G2S(p[0],p[1]);label(sd<0?"מקוואות — גברים":"מקוואות — נשים",q[0],gy+7,-q[1],null,mi).m=true})}})}
  // topic 2, stage 7: a sign at each Mishnah gate, a place to leave staff, shoes and bags before entering, and the mourners' path
  {const si={n:"שלט בשער ההר",r:"ברכות ט, ה; כלים א, ח; רמב״ם בית הבחירה ז",t:"⚖️ \"לא יכנס אדם להר הבית במקלו, ובמנעלו, ובפונדתו (ארנק), ובאבק שעל רגליו, ולא יעשנו קפנדריא\" (ברכות ט, ה). ⚖️ \"הר הבית מקודש ממנו, שאין זבים וזבות, נדות ויולדות נכנסים לשם\" (כלים א, ח). 💡 השלט עומד בכניסה לכל אחד מחמשת שערי המשנה."};
    G.filter(g=>g.five).forEach(g=>{const w=g.w_,fx=Math.cos(w.a),fn=Math.sin(w.a),p=[w.x+w.ox*(g.k==="K"?16:g.k==="S"?20:9)+fx*(g.k==="K"?18:g.w*(g.k==="S"?1.35:0.5)+3),w.n+w.on*(g.k==="K"?16:g.k==="S"?20:9)+fn*(g.k==="K"?18:g.w*(g.k==="S"?1.35:0.5)+3)],gy=g.k==="K"?(PLZ+0.25):H(p[0],p[1]);
      stoneG.push([p[0],gy+1.1,p[1],w.a,1.5,2.2,0.35]);const q=G2S(p[0],p[1]);label("שלט: מי נכנס להר",q[0],gy+3.2,-q[1],null,si).m=true});
    const li={n:"מקום למקל, לנעליים ולתיקים",r:"ברכות ט, ה; פסחים פו ע״א",t:"⚖️ אסור להיכנס להר הבית עם מקל, נעליים, ארנק ואבק על הרגליים (ברכות ט, ה). 💡 לכן לפני הכניסה, עוד מחוץ לשטח המקודש, יש ארונות לתיקים ולמקלות, מדפים לנעליים וברזים לשטיפת רגליים. נעלי בד או סנדלים בלי עור אפשר לקבל כאן."};
    const kG=G.find(q=>q.k==="K"),kw=kG.w_,kf=[Math.cos(kw.a),Math.sin(kw.a)];
    [[kw,kf,12,-21,(PLZ+0.25)],[G.find(q=>q.n.includes("המזרחי")).w_,null,30,-34,null]].forEach(([w,f,nn,al,y0])=>{f=f||[Math.cos(w.a),Math.sin(w.a)];const p=[w.x+w.ox*nn+f[0]*al,w.n+w.on*nn+f[1]*al],gy=y0===null?H(p[0],p[1]):y0;
      stoneG.push([p[0],gy+1.4,p[1],w.a,10,2.8,4]);stoneG.push([p[0],gy+2.95,p[1],w.a,11,0.3,5]);woodB.push([p[0]+w.ox*2.05,gy+1.1,p[1]+w.on*2.05,w.a,7,1.6,0.1]);
      const q=G2S(p[0],p[1]);label("מקום לנעליים ולתיקים",q[0],gy+5,-q[1],null,li).m=true});
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
    [[-24,-11],[-5,5],[11,24]].forEach(([a0,a1])=>{const p=P(26,(a0+a1)/2);SCR.push([p[0],Y+0.5,p[1],w.a,a1-a0,1.0,0.5,1])});
    const q1=G2S(...P(12,13*north)),q2=G2S(...P(12,-13*north)),q3=G2S(...P(31,0));
    label("תפילה — גברים",q1[0],Y+4,-q1[1],null,{n:"אזור התפילה ליד הכותל",r:"כמו היום",t:"💡 אזור התפילה נשאר כמו היום: מחיצה באמצע, גברים בצד אחד ונשים בצד השני, ומעקה אבן נמוך עם שני פתחים שמפריד בינו לבין הרחבה."}).m=true;
    label("תפילה — נשים",q2[0],Y+4,-q2[1],null,{n:"אזור התפילה ליד הכותל",r:"כמו היום",t:"💡 אזור התפילה נשאר כמו היום: מחיצה באמצע, גברים בצד אחד ונשים בצד השני, ומעקה אבן נמוך עם שני פתחים שמפריד בינו לבין הרחבה."}).m=true}
  const im=(geo,mat,arr,fn,info)=>{if(!arr.length)return;const m=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((p,i)=>{fn(p);d.updateMatrix();m.setMatrixAt(i,d.matrix)});m.castShadow=true;m.receiveShadow=true;if(info){m.userData=info;PICK.push(m)}GATEG.add(m)};
  const box=new THREE.BoxGeometry(1,1,1),half=(()=>{const g=new THREE.CylinderGeometry(1,1,0.2,16,1,false,0,Math.PI);g.rotateX(Math.PI/2);g.rotateZ(Math.PI/2);g.rotateY(Math.PI/2);return g})();
  const gInfo={n:"שערי הר הבית",r:SRC,t:"השערים בחומות ההר, כל אחד במקום של שער אמיתי ובקצה של רחוב אמיתי. בדרום — שני שערי חולדה עם מדרגות רחבות; במערב — שער קיפונוס מעל רחבת הכותל ושערי העיר העתיקה; בצפון — שער טדי ועוד. שער המזרח (שער הרחמים) נשאר סגור: \"השער הזה סגור יהיה\" (יחזקאל מד, ב)."};
  // #25: the gate masses use the same Herodian stone as the mount wall skin (topic 25), measured in metres, so a gate no longer reads as a dark block stuck on the wall
  {if(!M.mgate)M.mgate=T.mwC?new THREE.MeshStandardMaterial({map:T.mwC,normalMap:T.mwN,roughness:0.92}):gateM;const gs=[];
    stoneG.forEach(p=>{const [x,y,n,a,sx,sy,sz]=p,ax=Math.abs(sx),ay=Math.abs(sy),az=Math.abs(sz);if(ax<1e-3||ay<1e-3||az<1e-3)return;const g=new THREE.BoxGeometry(ax,ay,az),uv=g.attributes.uv,y0=y-ay/2;
      const dims=[[az,1],[az,1],[ax,az],[ax,az],[ax,1],[ax,1]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k,u=uv.getX(i),v=uv.getY(i);if(f===2||f===3)uv.setXY(i,u*ax/16,v*az/16);else uv.setXY(i,u*dims[f][0]/16,(y0+v*ay+30)/32)}
      g.rotateY(a);g.translate(x,y,-n);gs.push(g)});
    if(gs.length){const U=THREE.BufferGeometryUtils,mg=U&&U.mergeBufferGeometries?U.mergeBufferGeometries(gs):null;
      if(mg){const m=new THREE.Mesh(mg,M.mgate);m.castShadow=true;m.receiveShadow=true;m.userData=gInfo;PICK.push(m);GATEG.add(m)}else im(box,gateM,stoneG,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])},gInfo)}}
  im(box,dark,darkB,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])});
  im(box,M.wood||M.stone2,woodB,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[5],p[6]);d.position.set(p[0],p[1],-p[2])},{n:"ארונות לנעליים ולתיקים",r:"ברכות ט, ה",t:"💡 ארונות עץ לנעליים, למקלות ולתיקים, לפני העלייה להר (ברכות ט, ה: \"לא יכנס אדם להר הבית במקלו ובמנעלו ובפונדתו\")."});
  im(half,dark,darkA,p=>{d.rotation.set(0,p[3],0);d.scale.set(p[4],p[4],1);d.position.set(p[0],p[1],-p[2])});
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

