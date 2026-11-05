await __Y(86);function build(){
  if(group){scene.remove(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  cLabels.forEach(L=>{L.el.remove();labels.splice(labels.indexOf(L),1)});cLabels=[];cPick=[];flames=[];
  COL=[];GLIST=[];EGATE=null;ACTS=null;CROWDT=null;ksm=null;PFX=[];MENL=null;
  group=new THREE.Group();scene.add(group);
  const RB=PLAN==="middot"||PLAN==="rambam",COMB=PLAN==="rambam",ROOT=group;
  const ref=LOC==="kodesh"?[125,250]:(RB?[238,259]:[250,250]);
  const X0=ROCK.x-ref[0]*A,N0=ROCK.n+ref[1]*A;
  {const fl=(RB?[0,6,13.5,16,22]:[0,3.5,4,7.5,13.5,10.6]).map(v=>v*A);while(fl.length<8)fl.push(-1e4);AOU.uFl.value=fl;const c0=X0-8*A,c1=X0+508*A,z0=-N0-8*A,z1=-N0+508*A;AOU.uBox.value.set(c0,Math.min(z0,z1),c1,Math.max(z0,z1));const i0=X0+0.3*A,i1=X0+499.7*A,w0=-N0+0.3*A,w1=-N0+499.7*A;AOU.uBoxI.value.set(i0,Math.min(w0,w1),i1,Math.max(w0,w1))}
  let W=(u,v)=>[X0+u*A,-(N0-v*A)];
  const I=(n,r,t)=>({n,r,t});
  const CL=(t,u,v,y,info,minor)=>{const p=W(u,v);const Lb=label(t,p[0],y*A,p[1],"c",info||null);Lb.m=minor!==false;cLabels.push(Lb)};
  // stage 5 (user request): a low stone cheek wall and a bronze handrail beside the steps
  const RLI=I("מעקה במדרגות","💡 הצעה של התוכנית","💡 המקורות לא מזכירים מעקה במדרגות המקדש. כאן נוסף בצידי המדרגות קיר אבן נמוך, ועליו מאחז יד מנחושת בגובה של כ־90 ס״מ, כדי שכל אחד יוכל לעלות בבטחה — גם זקנים, ילדים ומי שקשה לו ללכת. ⚖️ בכבש של המזבח לא נוסף מעקה: הכבש הוא חלק מהמזבח ומידותיו כתובות במשנה (מידות ג, ג), ולכן לא מוסיפים עליו.");
  const RAILG=new THREE.CylinderGeometry(0.045*A,0.045*A,1,8),POSTG=new THREE.CylinderGeometry(0.035*A,0.035*A,1,6);
  const rail=(p0,p1,g)=>{const m=new THREE.Mesh(g||RAILG,M.bronze),d=p1.clone().sub(p0);m.scale.y=d.length();m.position.copy(p0).add(p1).multiplyScalar(0.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;m.userData=RLI;cPick.push(m);group.add(m);return m};
  // P(a,y) maps the run coordinate a and height y to world space; tread(k) is the top of step k (k=0 at the top)
  const stairRail=(P,n,aTop,dir,tread,wallTo)=>{const RH=1.9;for(let k=0;k<n;k++)wallTo(aTop+dir*k,aTop+dir*(k+1),tread(k)+1.05);
    const p0=P(aTop+dir*0.5,tread(0)+RH),p1=P(aTop+dir*(n-0.5),tread(n-1)+RH);rail(p0,p1);
    [0,Math.floor((n-1)/2),n-1].forEach(k=>rail(P(aTop+dir*(k+0.5),tread(k)+1.05),P(aTop+dir*(k+0.5),tread(k)+RH+0.02),POSTG))};
  function box(u0,v0,u1,v1,y0,y1,mat,info,o){o=o||{};const w=(u1-u0)*A,h=(y1-y0)*A,d=(v1-v0)*A;
    const m=new THREE.Mesh(rbox(Math.max(w,0.01),Math.max(h,0.01),Math.max(d,0.01),o.tile||3.2),mat);const p=W((u0+u1)/2,(v0+v1)/2);{const uv=m.geometry.attributes.uv,off=y0*A/(o.tile||3.2);for(const f of[0,1,4,5])for(let k=0;k<4;k++)uv.setY(f*4+k,uv.getY(f*4+k)+off)}
    m.position.set(p[0],(y0+y1)/2*A,p[1]);m.castShadow=o.cast!==false;m.receiveShadow=true;if(info){m.userData=info;cPick.push(m)}group.add(m);
    if(o.col||(!o.noCol&&o.cast!==false&&h>0.9))COL.push({x0:p[0]-w/2,x1:p[0]+w/2,z0:p[1]-d/2,z1:p[1]+d/2,y0:y0*A,y1:y1*A});return m}
  window.__CHD=[];
  // hollow chamber: walls t thick, a real opening on one side, a stone frame outside, steps down to the outside floor
  function hroom(u0,v0,u1,v1,yF,yT,mat,info,dr,o){o=o||{};const t=o.t||0.8,yB=o.yB==null?yF:o.yB,w=dr.w||3,h=dr.h||4.5,c=dr.c,sd=dr.side;
    if(yB<yF-0.01)box(u0,v0,u1,v1,yB,yF,mat,info);
    const MI=M.inner||(M.inner=new THREE.MeshStandardMaterial({color:0x564d42,roughness:0.95,envMapIntensity:0.2}));
    box(u0+t,v0+t,u1-t,v1-t,yF,yF+0.02,o.open?M.pave:MI,null,{noCol:true,cast:false,tile:6});
    if(!o.open){const e=0.04,X0_=u0+t,X1_=u1-t,Y0_=v0+t,Y1_=v1-t;if(sd!=="u0")box(X0_,Y0_,X0_+e,Y1_,yF,yT,MI,null,{noCol:true,cast:false});if(sd!=="u1")box(X1_-e,Y0_,X1_,Y1_,yF,yT,MI,null,{noCol:true,cast:false});if(sd!=="v0")box(X0_,Y0_,X1_,Y0_+e,yF,yT,MI,null,{noCol:true,cast:false});if(sd!=="v1")box(X0_,Y1_-e,X1_,Y1_,yF,yT,MI,null,{noCol:true,cast:false});box(X0_,Y0_,X1_,Y1_,yT-e,yT,MI,null,{noCol:true,cast:false})}
    const Wl=(q,a0,a1,y0,y1)=>{if(a1-a0<0.01||y1-y0<0.01)return;if(q==="u0")box(u0,a0,u0+t,a1,y0,y1,mat,info);else if(q==="u1")box(u1-t,a0,u1,a1,y0,y1,mat,info);else if(q==="v0")box(a0,v0,a1,v0+t,y0,y1,mat,info);else box(a0,v1-t,a1,v1,y0,y1,mat,info)};
    const R={u0:[v0,v1],u1:[v0,v1],v0:[u0+t,u1-t],v1:[u0+t,u1-t]};
    ["u0","u1","v0","v1"].forEach(q=>{const [a,b]=R[q];if(q!==sd){Wl(q,a,b,yF,yT);return}Wl(q,a,c-w/2,yF,yT);Wl(q,c+w/2,b,yF,yT);Wl(q,c-w/2,c+w/2,yF+h,yT)});
    if(o.roof)box(u0-0.3,v0-0.3,u1+0.3,v1+0.3,yT,yT+0.6,M.stone2,null);
    const sg=(sd==="u0"||sd==="v0")?-1:1,f=sd==="u0"?u0:sd==="u1"?u1:sd==="v0"?v0:v1,isU=sd[0]==="u";
    const P=(d0,d1,a0,a1,y0,y1,m,op)=>{const p0=Math.min(f+sg*d0,f+sg*d1),p1=Math.max(f+sg*d0,f+sg*d1);if(isU)box(p0,a0,p1,a1,y0,y1,m,null,op);else box(a0,p0,a1,p1,y0,y1,m,null,op)};
    if(!o.noFrame){P(-0.01,0.45,c-w/2-0.55,c-w/2,yF,yF+h,M.stoneL,{noCol:true});P(-0.01,0.45,c+w/2,c+w/2+0.55,yF,yF+h,M.stoneL,{noCol:true});P(-0.01,0.6,c-w/2-0.8,c+w/2+0.8,yF+h,yF+h+0.7,M.stone2,{noCol:true})}
    const yo=o.yo==null?yF:o.yo;if(yF-yo>0.1){const n=Math.max(1,Math.round((yF-yo)/0.5)),hh=(yF-yo)/n;P(0,1.2,c-w/2-0.5,c+w/2+0.5,yo,yF,M.stone2,{noCol:true});for(let k=1;k<n;k++)P(1.2+k-1,1.2+k,c-w/2-0.5,c+w/2+0.5,yo,yF-k*hh,M.stone2,{noCol:true})}
    if(dr.nm){const dc=isU?[f,c]:[c,f];window.__CHD.push({nm:dr.nm,u:dc[0],v:dc[1],ax:isU?"u":"v",s:sg,y:yF,yo,w,dp:isU?(u1-u0):(v1-v0)})}}
  // a door frame on a solid wall face (for the small outer chambers): jambs and a lintel that stand out, so the opening has depth
  function dframe(ax,f,sg,c,w,y,h){const P=(d0,d1,a0,a1,y0,y1,m)=>{const p0=Math.min(f+sg*d0,f+sg*d1),p1=Math.max(f+sg*d0,f+sg*d1);if(ax==="u")box(p0,a0,p1,a1,y0,y1,m,null,{noCol:true,cast:false});else box(a0,p0,a1,p1,y0,y1,m,null,{noCol:true,cast:false})};
    P(0,0.4,c-w/2-0.5,c-w/2,y,y+h,M.stoneL);P(0,0.4,c+w/2,c+w/2+0.5,y,y+h,M.stoneL);P(0,0.55,c-w/2-0.8,c+w/2+0.8,y+h,y+h+0.6,M.stone2)}
  function cyl(u,v,y0,y1,r0,r1,mat,info,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1*A,r0*A,(y1-y0)*A,seg||20),mat);const p=W(u,v);m.position.set(p[0],(y0+y1)/2*A,p[1]);m.castShadow=true;m.receiveShadow=true;if(info){m.userData=info;cPick.push(m)}group.add(m);return m}
  if(!RB){
  // floors
  box(0,0,500,500,0,3.5,M.pave,I("החצר החיצונה","יחזקאל מ׳, יז-יט","החצר שבה עומד העם, גבוהה ב־7 מדרגות מהר הבית. לאורך החומה רצפה, ועליה 30 לשכות. בתוכנית: עד 10–15 אלף איש בבת אחת."),{cast:false,tile:9});
  box(0,200,300,300,3.5,7.5,M.pave,I("החצר הפנימית","יחזקאל מ׳, מז","100 × 100 אמה, והמזבח באמצע. גבוהה מהחצר החיצונה ב־8 מדרגות. כאן עובדים הכהנים."),{cast:false,tile:9,col:true});
  // outer wall + cornice
  const wi=I("החומה החיצונה","יחזקאל מ׳, ה; מ״ב, כ","חומה ברוחב ובגובה של קנה, 6 אמות, \"להבדיל בין הקדש לחל\".");
  [[0,0,237.5,6],[262.5,0,500,6],[0,494,237.5,500],[262.5,494,500,500],[0,6,6,494],[494,6,500,237.5],[494,262.5,500,494]].forEach(r=>{box(r[0],r[1],r[2],r[3],0,9.5,M.stone,wi);box(r[0]-0.4,r[1]-0.4,r[2]+0.4,r[3]+0.4,9.5,10.2,M.stoneL,null)});
  // gates
  function gate(axis,cu,cv,floor,outward,info,closed){
    const L=50,Wd=25,pass=10,side=(Wd-pass)/2,hBody=GATE==="high"?40:20,hPylon=GATE==="high"?60:20;
    const along=(a0,a1,w0,w1,y0,y1,mat,inf,o)=>axis==="e"?box(cu+a0,cv+w0,cu+a1,cv+w1,y0,y1,mat,inf,o):box(cu+w0,cv+a0,cu+w1,cv+a1,y0,y1,mat,inf,o);
    const sa=s0=>outward*(L/2-s0),piece=(s0,s1,w0,w1,y0,y1,mat,inf,o)=>{const a0=sa(s0),a1=sa(s1);along(Math.min(a0,a1),Math.max(a0,a1),w0,w1,y0,y1,mat,inf,o)};
    const ri=I("תאי השער","יחזקאל מ׳, ז-יב","\"והתא קנה אחד ארך וקנה אחד רחב, ובין התאים חמש אמות\" — שלושה תאים מכל צד של המעבר, 6 × 6 אמה, ולפניהם \"גבול אמה אחת\". כאן עמדו השומרים.");
    // stage 4: the ulam of the gate, 8 amot deep with eilim of 2 (40:9). Outer gates: the ulam faces the House ("והאולם מהבית");
    // inner gates: "ואלמו אל החצר החיצונה" (40:31,34,37), so the whole plan is mirrored
    const MI=floor>4,mr=(a,b)=>MI?[50-b,50-a]:[a,b],eU=MI?outward:-outward;
    const ul=I("אולם השער","יחזקאל מ׳, ח-ט; מ׳, לא","\"וימד את אלם השער שמנה אמות, ואילו שתים אמות, ואלם השער מהבית\" — 📜 אולם של 8 אמות בקצה השער, ואילים של 2 אמות. "+(MI?"📜 בשער הפנימי האולם פונה \"אל החצר החיצונה\", ולכן הוא בצד המדרגות.":"📜 בשער החיצון האולם בצד הפנימי, מול הבית.")+" 💡 רוחב החדר וגובהו לא מפורשים; כאן לפי רוחב השער, בהערכה.");
    [-1,1].forEach(sd=>{const w=(a,b)=>sd<0?[-b,-a]:[a,b];
      [[0,6],[12,17],[23,28],[34,40],[48,50]].map(q=>mr(q[0],q[1])).forEach(([s0,s1])=>{const ww=w(pass/2,Wd/2);piece(s0,s1,ww[0],ww[1],3.5,floor+hBody,M.stone,info)});
      {const [s0,s1]=mr(40,48),wo=w(Wd/2-1.5,Wd/2),wf=w(pass/2,Wd/2-1.5);piece(s0,s1,wo[0],wo[1],3.5,floor+hBody,M.stone,ul);
        if(MI)piece(s0,s1,wf[0],wf[1],3.5,floor,M.pave,null,{noCol:true,cast:false,tile:9});piece(s0,s1,wf[0],wf[1],floor+hBody-3,floor+hBody,M.stone,null,{noCol:true});
        const wb=w(pass/2,Wd/2-1.5);piece(s0+0.2,s1-0.2,wb[0],wb[1],floor,floor+0.12,M.stoneL,ul,{noCol:true,cast:false})}
      [[6,12],[17,23],[28,34]].map(q=>mr(q[0],q[1])).forEach(([s0,s1])=>{const wo=w(pass/2+6,Wd/2);piece(s0,s1,wo[0],wo[1],3.5,floor+hBody,M.stone,info);const wf=w(pass/2,pass/2+6);
        if(floor>4)piece(s0,s1,wf[0],wf[1],3.5,floor,M.pave,null,{noCol:true,cast:false,tile:9});piece(s0,s1,wf[0],wf[1],floor+hBody-3,floor+hBody,M.stone,null,{noCol:true});
        const wb=w(pass/2,pass/2+0.5);piece(s0+0.3,s1-0.3,wb[0],wb[1],floor,floor+1,M.stoneL,ri,{noCol:true})})});
    along(-L/2,L/2,-pass/2,pass/2,floor+hBody-5,floor+hBody,M.stone,info);
    along(-L/2-0.3,L/2+0.3,-Wd/2-0.3,Wd/2+0.3,floor+hBody,floor+hBody+1,M.stoneL,null);
    const pyl=I("אילי השער","יחזקאל מ׳, יד; מ׳, טז",(GATE==="high"?"⚖️ לפי רש״י (מ׳, יד) והרמח״ל: האילים הם מזוזות הפתח, עמודים עגולים \"כמין אילנות\" מאבני גזית, גבוהים 60 אמה. 📜 \"ואל אילו תמרים\" (מ׳, טז) — ובראשם צורת דקל. 💡 העובי (2 אמות) והכותרת בהערכה. המלבי״ם מפרש אחרת: 60 אמה היא מידה לאורך הקיר, ולא גובה.":"לפי המלבי״ם, האילים הם עמודים צמודים לקיר, ו\"ששים אמה\" היא מידה לאורך הקיר ולא גובה. ⚖️ \"ואל איל תמרים\" (מ׳, טז) — לפי המלבי״ם האילים \"היו על גביהם כצורת דקל תמר לנוי\". גובה השער לא כתוב ביחזקאל, וכאן הוא כ־20 אמה, בהערכה. (לפי רש״י האילים גבוהים 60 אמה — אפשר לראות בכפתור.)"));
    [-1,1].forEach(e=>[-1,1].forEach(s=>{const hd=e===eU?1:3.5,a=e*(L/2-hd),w=s*(Wd/2-3.5);if(GATE==="high"){const ao=e*(L/2-1),uu=axis==="e"?cu+ao:cu+w,vv=axis==="e"?cv+w:cv+ao;cyl(uu,vv,3.5,floor+hPylon,1.05,1,M.stone,pyl,20);cyl(uu,vv,floor+hPylon,floor+hPylon+1.2,1,1.25,M.stoneL,null,20);for(let k=0;k<7;k++){const fr=new THREE.Mesh(PALMF||(PALMF=new THREE.ConeGeometry(0.35*A,3.2*A,4)),M.gold),p=W(uu,vv),an=k/7*Math.PI*2;fr.position.set(p[0]+Math.cos(an)*0.9*A,(floor+hPylon+2.2)*A,p[1]+Math.sin(an)*0.9*A);fr.rotation.set(Math.sin(an)*1.1,0,-Math.cos(an)*1.1);group.add(fr)}return}along(a-hd,a+hd,w-3.5,w+3.5,3.5,floor+hPylon,M.stone,pyl);
      const f=a+e*(hd+0.05);along(f-0.03,f+0.03,w-2.4,w+2.4,floor+6,floor+hPylon-6,M.palm,null,{cast:false})}));
    const wi=I("חלונות אטומות","יחזקאל מ׳, טז; רש״י שם","\"וחלונות אטומות אל התאים ואל אליהמה\". 📜 חלונות צרים מבפנים ורחבים מבחוץ, \"והאורות יוצאים דרכן מבית המקדש לכל העולם\" (מנחות פו ע״ב), עם סבכה של אבן. ועל האילים — תמרים.");[-15,-5,5,15].forEach(a=>[-1,1].forEach(s=>{const w=s*(Wd/2+0.05);along(a-1.5,a+1.5,w-0.06,w+0.06,floor+hBody-11,floor+hBody-7,M.lattice,wi,{cast:false,tile:3*A});along(a-1.9,a+1.9,w-0.12,w+0.12,floor+hBody-7,floor+hBody-6.6,M.stoneL,null,{cast:false})}))
    // #15: the closed east gate (Ezek 44:2) gets no steps: outside it the ground falls ~21 m (the 500-amah square goes past the mount), so the steps ended in the air
    if(closed)return;
    const n=floor>4?8:7,y0=floor>4?3.5:0;GLIST.push({axis,cu,cv,floor,outward,n,y0,L,pass});
    if(floor>4)along(-L/2,L/2,-pass/2,pass/2,3.5,floor,M.pave,null,{noCol:true,cast:false,tile:9});
    for(let k=0;k<n;k++){const a0=outward*(L/2+k),a1=outward*(L/2+k+1);along(Math.min(a0,a1),Math.max(a0,a1),-pass/2-1,pass/2+1,y0,y0+(n-k)*0.5,M.stone2,null,{noCol:true})}
    [-1,1].forEach(sd=>{const wc=sd*(pass/2+1.3),P=(a,y)=>{const q=axis==="e"?W(cu+a,cv+wc):W(cu+wc,cv+a);return new THREE.Vector3(q[0],y*A,q[1])};
      stairRail(P,n,outward*L/2,outward,k=>y0+(n-k)*0.5,(a0,a1,top)=>along(Math.min(a0,a1),Math.max(a0,a1),wc-0.3,wc+0.3,y0,top,M.stone2,RLI,{noCol:true}))});
  }
  gate("n",250,25,3.5,-1,I("השער החיצוני הצפוני","יחזקאל מ׳, כ-כג; מ״ו, ט","שער באורך 50 אמה ורוחב 25, עם תאים, אילים ואולם, ו־7 מדרגות. דרכו נכנסים ברגלים."));
  gate("n",250,475,3.5,1,I("השער החיצוני הדרומי","יחזקאל מ׳, כד-כז","מי שנכנס מצפון יוצא מדרום, וכך הזרמים לא נתקלים זה בזה."));
  gate("e",475,250,3.5,1,I("השער החיצוני המזרחי — סגור","יחזקאל מ״ד, א-ב; מידות א, ג","📜 \"השער הזה סגור יהיה, לא יפתח, ואיש לא יבא בו\" (יחזקאל מד, ב). 💡 זה שער אחד: מבפנים הוא השער החיצוני המזרחי של יחזקאל, ומבחוץ חזיתו היא שער שושן (מידות א, ג). הוא סגור, ולכן אין לו שימוש ואין סופרים בו מדרגות. 💡 הקרקע שמחוצה לו נמוכה (כ־21- מ׳), כי ריבוע 500 האמה יוצא מזרחה מהחומה של היום אל מדרון הקדרון, ושם יש מילוי."),true);
  {const gi=I("שער המזרח — שער שושן","מידות א, ג; יחזקאל מד, א–ג","⚖️ \"שער המזרחי, עליו שושן הבירה צורה\" (מידות א, ג). 📜 \"השער הזה סגור יהיה, לא יפתח\" (יחזקאל מד, ב). 💡 בתוכנית זה השער המזרחי של חומת 500 האמה, שהיא הר הבית. זה אותו שער כמו \"השער החיצוני המזרחי — סגור\": שושן הוא שם החזית שלו מבחוץ. הדלתות הגדולות סגורות תמיד, ומעליהן תבליט של שושן הבירה. ⚖️ לפי המשנה כבש הפרה יוצא מהשער המזרחי (מידות א, ג). 💡 לכן לפני השער יש רחבה שממנה יוצא הכבש, והכהן עובר אליה בפשפש הקטן שבצד השער, שפתוח. כך השער \"סגור\" כדברי יחזקאל, והכבש עדיין יוצא ממנו.");
    // east-gate cleanup: two closed bronze leaves inside a stone frame (jambs + lintel), the seam and bands show it is a door that stays shut
    {const dh=GATE==="high"?35:15,y1=3.5+dh;box(500,245,500.3,255,3.5,y1,M.bronze,gi,{cast:false});box(500.3,249.9,500.38,250.1,3.5,y1,M.dark,null,{noCol:true,cast:false});
      [0.25,0.5,0.75].forEach(f=>box(500.3,245.3,500.36,254.7,3.5+dh*f-0.15,3.5+dh*f+0.15,M.gold,null,{noCol:true,cast:false}));
      [-1,1].forEach(sd=>box(500,250+sd*5-(sd>0?0:1.2),500.9,250+sd*5+(sd>0?1.2:0),3.5,y1,M.stoneL,gi));box(500,243.8,501,256.2,y1,y1+1.1,M.stoneL,gi)}
    const rc=cv(512,224,(x,Wc,Hh)=>{x.fillStyle="#d9c9a4";x.fillRect(0,0,Wc,Hh);const sh=f=>{x.save();x.translate(2,3);x.fillStyle="rgba(70,52,28,.45)";f();x.restore();x.fillStyle="#f1e6ca";f()};
      sh(()=>{x.fillRect(96,120,320,64);x.fillRect(120,84,40,40);x.fillRect(352,84,40,40);x.fillRect(196,96,120,28);x.beginPath();x.arc(256,96,46,Math.PI,0);x.fill();x.fillRect(250,34,12,20);x.fillRect(132,64,16,22);x.fillRect(364,64,16,22)});
      x.fillStyle="rgba(70,52,28,.55)";for(let i=0;i<6;i++){x.beginPath();x.arc(140+i*51,160,10,Math.PI,0);x.fill();x.fillRect(130+i*51,160,20,22)}
      x.strokeStyle="rgba(70,52,28,.5)";x.lineWidth=3;x.strokeRect(10,10,Wc-20,Hh-20);x.fillStyle="rgba(60,44,22,.85)";x.font="bold 26px serif";x.textAlign="center";x.direction="rtl";x.fillText("שושן הבירה",256,212)});
    const rt=new THREE.CanvasTexture(rc);rt.encoding=THREE.sRGBEncoding;const rel=new THREE.Mesh(new THREE.PlaneGeometry(14*A,6*A),new THREE.MeshStandardMaterial({map:rt,roughness:0.9}));
    const p=W(500.9,250),ry=GATE==="high"?42.6:22.6;rel.position.set(p[0],ry*A,p[1]);rel.rotation.y=Math.PI/2;rel.userData=gi;cPick.push(rel);group.add(rel)}
  gate("n",250,175,7.5,-1,I("השער הפנימי הצפוני","יחזקאל מ׳, לה-מג","שער לחצר הפנימית, עם 8 מדרגות. לידו שולחנות השחיטה."));
  gate("n",250,325,7.5,1,I("השער הפנימי הדרומי","יחזקאל מ׳, כח-לא","שער לחצר הפנימית, עם 8 מדרגות."));
  gate("e",325,250,7.5,1,I("השער הפנימי המזרחי","יחזקאל מ״ו, א-ב","סגור בששת ימי המעשה, ונפתח בשבת ובראש חודש. הנשיא משתחווה על מפתן השער."));
  // topic 6 stage 7: the doors of the inner east gate. 📜 "יהיה סגור ששת ימי המעשה, וביום השבת יפתח, וביום החדש יפתח... והשער לא יסגר עד הערב" (Ezek 46:1-2).
  // 💡 two bronze leaves at the inner-court end of the passage (the threshold where the Nasi bows, 46:2); their height and material are not given. Shown by gateDoors() in core/30.
  {const di=I("דלתות השער הפנימי המזרחי","יחזקאל מ״ו, א-ב","📜 \"שער החצר הפנימית הפנה קדים יהיה סגור ששת ימי המעשה, וביום השבת יפתח, וביום החדש יפתח\", \"והשער לא יסגר עד הערב\". 💡 מקום הדלתות בקצה המעבר, וגובהן וחומרן לא מפורשים.");
    EGATE=[box(300,245,300.4,250,7.5,7.5+(GATE==="high"?37:17),M.bronze,di,{noCol:true}),box(300,250,300.4,255,7.5,7.5+(GATE==="high"?37:17),M.bronze,di,{noCol:true})];EGATE.forEach(m=>m.visible=false)}
  // 30 chambers
  const pi=I("לשכה בחצר החיצונה","יחזקאל מ׳, יז; מ״ו, כד","אחת מ־30 הלשכות שעל הרצפה — 10 בצפון, 10 בדרום ו־10 במזרח (מלבי״ם). עומק 4 אמות. כאן העם אוכל את בשר השלמים. הגובה בהערכה.");
  const rp=I("הרצפה","יחזקאל מ׳, יז-יח; מלבי״ם שם","\"והנה לשכות ורצפה עשוי לחצר סביב\" — לפי המלבי״ם הרצפה רחבה 6 אמות לאורך החומה, הלשכות עומדות עליה ועומקן 4 אמות, ונשארות 2 אמות פנויות לפניהן. \"הרצפה התחתונה\" — נמוכה מהחצר הפנימית. גובה הרצפה והלשכות לא מפורש, וכאן הוא בהערכה.");
  const segs=[[46,232],[268,454]],L5=(186-16)/5;
  // stage 4: a stone lintel and jambs around each door, and the ends of the wooden roof beams under the cornice (💡 style, not explicit)
  const dec=(c0,c1,f,o,ax)=>{const B=(a0,a1,d0,d1,y0,y1,m)=>{const p0=Math.min(f+o*d0,f+o*d1),p1=Math.max(f+o*d0,f+o*d1);if(ax==="v")box(a0,p0,a1,p1,y0,y1,m,null,{noCol:true,cast:false});else box(p0,a0,p1,a1,y0,y1,m,null,{noCol:true,cast:false})};
    const m=(c0+c1)/2;B(m-1.8,m+1.8,-0.05,0.28,8,8.75,M.stoneL);B(m-1.8,m-1.2,-0.05,0.18,4,8,M.stoneL);B(m+1.2,m+1.8,-0.05,0.18,4,8,M.stoneL);
    for(let a=c0+1.5;a<c1-1;a+=3)B(a-0.25,a+0.25,0,0.5,9.2,9.75,M.wood)};
  segs.forEach(([a0,a1])=>{box(a0,6,a1,12,3.5,4,M.pave,rp,{noCol:true,tile:9});box(a0,488,a1,494,3.5,4,M.pave,rp,{noCol:true,tile:9});box(488,a0,494,a1,3.5,4,M.pave,rp,{noCol:true,tile:9});
    if(GATE!=="high"){for(let k=0;k<5;k++){const c0=a0+k*(L5+4),c1=c0+L5;box(c0,6,c1,10,4,10,M.stoneL,pi);box(c0-0.3,5.7,c1+0.3,10.3,10,10.6,M.stone2,null);box((c0+c1)/2-1.2,10,(c0+c1)/2+1.2,10.08,4,8,M.dark,null,{cast:false,noCol:true});dframe("v",10,1,(c0+c1)/2,2.4,4,4);
      box(c0,490,c1,494,4,10,M.stoneL,pi);box(c0-0.3,489.7,c1+0.3,494.3,10,10.6,M.stone2,null);box((c0+c1)/2-1.2,489.92,(c0+c1)/2+1.2,490,4,8,M.dark,null,{cast:false,noCol:true});dframe("v",490,-1,(c0+c1)/2,2.4,4,4);
      box(490,c0,494,c1,4,10,M.stoneL,pi);box(489.7,c0-0.3,494.3,c1+0.3,10,10.6,M.stone2,null);box(489.92,(c0+c1)/2-1.2,490,(c0+c1)/2+1.2,4,8,M.dark,null,{cast:false,noCol:true});dframe("u",490,-1,(c0+c1)/2,2.4,4,4);
      dec(c0,c1,10,1,"v");dec(c0,c1,490,-1,"v");dec(c0,c1,490,-1,"u")}}});
  if(GATE==="high"){const Y0=53.5,PP=[],gi=I("המרפסת על העמודים","יחזקאל מ׳, יז-יח; רש״י שם; רד״ק שם; מידות ב, ה","⚖️ לפי רש״י, הרד״ק והרמח״ל: \"לשכות ורצפה\" — הרצפה היא מרפסת (גזוזטרא) על עמודים לאורך חומת החצר, כמו הגזוזטרא בעזרת הנשים בבית שני (מידות ב, ה). 💡 עובי העמודים, המרחק ביניהם והעלייה למרפסת בהערכה."),pi2=I("לשכה בחצר החיצונה","יחזקאל מ׳, יז-יח; רש״י שם; משכני עליון לרמח״ל","📜 \"שלשים לשכות אל הרצפה\" (מ׳, יז). ⚖️ לפי רש״י והרמח״ל תחתית הלשכות בגובה 50 אמה, כנגד גובה השער, והן עומדות על המרפסת שעל העמודים: 10 בצפון, 10 בדרום ו־10 במזרח, חמש מכל צד של השער. בפינות, בחצרות המבשלות, אין מרפסת ואין לשכות. 💡 מידות הלשכה בהערכה.");
    const side=(a0,a1,f,o,ax)=>{const R=(b0,b1,d0,d1,y0,y1,m,inf,op)=>{const p0=Math.min(f+o*d0,f+o*d1),p1=Math.max(f+o*d0,f+o*d1);if(ax==="v")box(b0,p0,b1,p1,y0,y1,m,inf,op);else box(p0,b0,p1,b1,y0,y1,m,inf,op)};R(a0,a1,0,6,Y0-0.7,Y0,M.pave,gi,{noCol:true,tile:9});R(a0,a1,5.7,6,Y0,Y0+1.2,M.stoneL,null,{noCol:true,cast:false});for(let k=0;k<5;k++){const c0=a0+k*(L5+4),c1=c0+L5,m=(c0+c1)/2;R(c0,c1,0,4,Y0,Y0+6,M.stoneL,pi2,{noCol:true});R(c0-0.3,c1+0.3,-0.3,4.3,Y0+6,Y0+6.6,M.stone2,null,{noCol:true});R(m-1.2,m+1.2,4,4.08,Y0,Y0+4,M.dark,null,{noCol:true,cast:false});R(m-1.7,m-1.2,4,4.4,Y0,Y0+4,M.stoneL,null,{noCol:true,cast:false});R(m+1.2,m+1.7,4,4.4,Y0,Y0+4,M.stoneL,null,{noCol:true,cast:false});R(m-2,m+2,4,4.55,Y0+4,Y0+4.6,M.stone2,null,{noCol:true,cast:false})}const n=20;for(let q=0;q<=n;q++){const a=a0+0.8+q*(a1-a0-1.6)/n;[0.8,5.2].forEach(d=>{const p=f+o*d;PP.push(ax==="v"?[a,p]:[p,a])})}};
    segs.forEach(([a0,a1])=>{side(a0,a1,6,1,"v");side(a0,a1,494,-1,"v");side(a0,a1,494,-1,"u")});
    const ig=new THREE.CylinderGeometry(0.55*A,0.65*A,(Y0-0.7-4)*A,10),im=new THREE.InstancedMesh(ig,M.stoneL,PP.length),d=new THREE.Object3D();PP.forEach((q,k)=>{const p=W(q[0],q[1]);d.position.set(p[0],(Y0-0.7+4)/2*A,p[1]);d.updateMatrix();im.setMatrixAt(k,d.matrix)});im.castShadow=true;im.receiveShadow=true;im.userData=gi;cPick.push(im);group.add(im)}
  // kitchens
  const ki=I("בית המבשלים","יחזקאל מ״ו, כא-כד","📜 חצר קטנה בפינת החצר החיצונה, 40 × 30 אמה, \"וטור סביב בהם... ומבשלות עשוי מתחת הטירות סביב\" — שורת אבן, ומתחתיה מקומות האש. שם המשרתים מבשלים את זבחי העם. 💡 צורת התנורים (תנור עגול של חרס, כמו בימי המשנה) בהערכה.");
  const KB=[],tannur=(u,v,y)=>{cyl(u,v,y,y+2.6,1.7,1.35,M.stone2,null,14);cyl(u,v,y+2.3,y+2.62,1.05,1.05,M.ember,null,12);const q=W(u,v);KB.push([q[0],(y+2.8)*A,q[1],(u*0.37+v*0.61)%1])};
  [[6,6],[454,6],[6,464],[454,464]].forEach(c=>{box(c[0],c[1],c[0]+40,c[1]+2,3.5,9.2,M.stone2,ki);box(c[0],c[1]+28,c[0]+40,c[1]+30,3.5,9.2,M.stone2,ki);box(c[0],c[1],c[0]+2,c[1]+30,3.5,9.2,M.stone2,ki);box(c[0]+38,c[1],c[0]+40,c[1]+30,3.5,9.2,M.stone2,ki);
    if(GATE==="high"){const u0=c[0]+2,u1=c[0]+38,v0=c[1]+2,v1=c[1]+28,kr=I("הטור והמבשלות","יחזקאל מ״ו, כג; רש״י שם","📜 \"וטור סביב בהם סביב לארבעתם, ומבשלות עשוי מתחת הטירות סביב\". ⚖️ לפי רש״י: הטור הוא שורה של אבנים סביב הקירות, ותחתיה מקומות האש לבישול. 💡 גובה השורה ומספר מקומות האש בהערכה.");box(u0,v0,u1,v0+2,3.5,6,M.stone,kr,{noCol:true});box(u0,v1-2,u1,v1,3.5,6,M.stone,kr,{noCol:true});box(u0,v0+2,u0+2,v1-2,3.5,6,M.stone,kr,{noCol:true});box(u1-2,v0+2,u1,v1-2,3.5,6,M.stone,kr,{noCol:true});for(let u=u0+4;u<=u1-4;u+=4)[[v0+2,1],[v1-2,-1]].forEach(([vf,o],n)=>{const a=Math.min(vf,vf+o*0.06),b=Math.max(vf,vf+o*0.06);box(u-0.9,a,u+0.9,b,3.6,4.8,M.dark,null,{noCol:true,cast:false});box(u-0.7,Math.min(vf,vf+o*0.1),u+0.7,Math.max(vf,vf+o*0.1),3.6,3.75,M.ember,null,{noCol:true,cast:false});if(((u-u0)/4)%2===1){const q=W(u,vf+o*0.4);KB.push([q[0],4.9*A,q[1],(u*0.37+vf*0.61)%1])}});for(let v=v0+6;v<=v1-6;v+=4)[[u0+2,1],[u1-2,-1]].forEach(([uf,o])=>{box(Math.min(uf,uf+o*0.06),v-0.9,Math.max(uf,uf+o*0.06),v+0.9,3.6,4.8,M.dark,null,{noCol:true,cast:false})})}else{box(c[0]+4,c[1]+4,c[0]+36,c[1]+12,3.5,4.3,M.stone,null,{noCol:true});for(let k=0;k<4;k++)tannur(c[0]+8+k*8,c[1]+8,4.3)}});
  {const pk=I("מקום הבישול של הכהנים","יחזקאל מ״ו, יט-כ","\"והנה שם מקום בירכתם ימה. ויאמר אלי זה המקום אשר יבשלו שם הכהנים את האשם ואת החטאת, אשר יאפו את המנחה, לבלתי הוציא אל החצר החיצונה\". בקצה המערבי של לשכות הכהנים.");
    [[150,176],[324,350]].forEach(([v0,v1])=>{box(86,v0,88,v1,3.5,10,M.stone2,pk);box(102,v0,104,v1,3.5,10,M.stone2,pk);box(86,v0,104,v0+2,3.5,10,M.stone2,pk);box(86,v1-2,104,v1,3.5,10,M.stone2,pk);for(let k=0;k<3;k++)tannur(91.5+k*4.5,v0+11.5,3.5)})}
  if(KB.length){group.add(makePFX(KB.length*(SMALL?5:8),true,KB.map(b=>({x:b[0],y:b[1]-0.15*A,z:b[2],rx:0.55*A,s:0.32})),{seed:61}));
    group.add(makePFX(KB.length*(SMALL?6:9),false,KB.map(b=>({x:b[0],y:b[1]+0.4*A,z:b[2],rx:0.4*A,s:0.45})),{seed:62,vy:0.9,ttl:8,grow:5,drift:0.35}))}
  [[26,21],[474,21],[26,479],[474,479]].forEach(c=>{const q=W(c[0],c[1]);cLabels.push(label("מבשלות",q[0],11*A,q[1],null,ki))});
  // priests' chambers
  function priestBlock(vIn,dir,title){
    const info=I(title,"יחזקאל מ״ב, א-יד","שתי שורות לשכות: שורה של 100 אמה מול הבית ושורה של 50 אמה מול החצר החיצונה, ובאמצע מהלך של 10 אמה. שלוש קומות, וכל קומה עליונה צרה מזו שמתחתיה, \"כי יוכלו אתיקים מהנה\". כאן הכהנים אוכלים קודשי קודשים ומחליפים בגדים.");
    const rows=[[100,200,vIn,vIn+dir*20],[150,200,vIn+dir*30,vIn+dir*50]];
    rows.forEach(([u0,u1,va,vb],ri)=>{const lo=Math.min(va,vb),hi=Math.max(va,vb);for(let s=0;s<3;s++){const ins=s*3,y0=3.5+s*8,y1=y0+8;
      const v0=ri===0?(dir<0?lo+ins:lo):(dir<0?lo:lo+ins),v1=ri===0?(dir<0?hi:hi-ins):(dir<0?hi-ins:hi);
      if(s===0){const nmP=(FMODE==="ez"&&!RB&&!COMB)?(vIn<250?(ri===0?"לשכת העץ":"לשכות הכהנים"):(ri===0?"לשכות הכהנים (דרום)":"לשכת עושי לחם הפנים")):null;hroom(u0,v0,u1,v1,y0,y1,M.stoneL,info,{side:"u1",c:(v0+v1)/2,w:3,h:5.5,nm:nmP},{noFrame:true})}else box(u0+ins*0.5,v0,u1-ins*0.5,v1,y0,y1,M.stoneL,info);box(u0+ins*0.5-0.3,v0-0.3,u1-ins*0.5+0.3,v1+0.3,y1,y1+0.6,M.stone2,null);
      const face=dir<0?v0:v1;for(let k=0;k<Math.floor((u1-u0-ins)/5);k++){const uu=u0+ins*0.5+2.5+k*5;box(uu-0.6,face-0.06,uu+0.6,face+0.06,y0+3,y0+6.5,M.win,null,{cast:false})}}});
  }
  priestBlock(200,-1,"לשכות הכהנים (צפון)");priestBlock(300,1,"לשכות הכהנים (דרום)");
  if(FMODE==="ez"&&!RB&&!COMB){const ek=I("מקום אכילת קדשי הקדשים","יחזקאל מ״ב, יג-יד; רש״י שם","📜 \"לשכות הצפון לשכות הדרום... הנה לשכות הקדש אשר יאכלו שם הכהנים... קדשי הקדשים\" (מ״ב, יג). בהן אוכלים הכהנים את קדשי הקדשים, ושם מניחים את בגדי הקודש לפני שיוצאים אל העם (מ״ב, יד).");CL("אכילת קדשי הקדשים",150,180,26,ek,false);CL("אכילת קדשי הקדשים",150,320,26,ek,false)}
  {const mb=I("המבוא מהקדים","יחזקאל מ״ב, ט","📜 \"ומתחתה הלשכות האלה המבוא מהקדים בבאו להנה מהחצר החצנה\" — הכניסה לקומה התחתונה של לשכות הכהנים היא ממזרח, מהחצר החיצונה. 💡 גודל הפתח בהערכה.");
    [[200,-1],[300,1]].forEach(([vIn,dir])=>[10,40].forEach(o=>{const vm=vIn+dir*o;box(199.9,vm-2.1,200.35,vm+2.1,9,9.7,M.stoneL,null,{noCol:true,cast:false});
      [-1,1].forEach(sd=>box(199.9,vm+sd*1.8-0.3,200.25,vm+sd*1.8+0.3,3.5,9,M.stoneL,null,{noCol:true,cast:false}))}))}
  // stage 4: the chambers named in Middot 5:3-4 and Middot 1:6, placed in Ezekiel's priest chambers (⚖️ names; 💡 placement)
  {const nm=(t,src,tx)=>I(t,src,tx+" ⚖️ יחזקאל לא מפרט את שמות הלשכות. המקום כאן לפי השיטה שלשכות בית שני (מידות ה, ג-ד) עומדות בצדי העזרה.");
    const S=[["לשכת המלח","מידות ה, ג","⚖️ בדרום העזרה. שם נותנים מלח לקרבן — \"על כל קרבנך תקריב מלח\"."],["לשכת הפרוה","מידות ה, ג; יומא ל ע״א","⚖️ בדרום. שם מולחים את עורות הקדשים, ועל גגה בית הטבילה של הכהן הגדול ביום הכיפורים."],
      ["לשכת המדיחין","מידות ה, ג","⚖️ בדרום. שם מדיחים את קרבי הקדשים."],["בית אבטינס","יומא יט ע״א; תמיד א, א","⚖️ עלייה שבה עשו את הקטורת, ובה שמרו הכהנים בלילה."]],
      N=[["לשכת העץ","מידות ה, ד","⚖️ בצפון. לשכת הכהן הגדול (ויש אומרים: לשכת פרהדרין)."],["לשכת הגולה","מידות ה, ד","⚖️ בצפון. שם הבור והגלגל, ומשם מספקים מים לכל העזרה."],
      ["לשכת הטלאים","מידות א, ו; תמיד ג, ג","⚖️ שם שמרו את הכבשים לקרבן התמיד, ארבעה ימים לפני הקרבתם."],["לשכת עושי לחם הפנים","מידות א, ו","⚖️ שם אפו את לחם הפנים."]];
    const SP=FMODE==="ez"&&!RB&&!COMB?[[231.5,309,14],[231.5,322,14],null,[268.5,319,14]]:null;S.forEach((c,k)=>{const li=nm(c[0],c[1],c[2]);if(SP){if(SP[k])CL(c[0],SP[k][0],SP[k][1],SP[k][2],li)}else CL(c[0],112.5+k*25,310,31,li)});
    N.forEach((c,k)=>{const u=112.5+k*25,li=nm(c[0],c[1],c[2]);if(COMB&&k>=2)CL(c[0],k===2?207:222,166,19,I(c[0],"מידות א, ו",c[2]+" ⚖️ לפי מסכת מידות היא אחת מארבע הלשכות של בית המוקד."));else if(FMODE==="ez"&&!RB&&!COMB){const NP=[[112.5,190,31],[268.5,180,14],[231.5,162.5,14],[175,340,26]];CL(c[0],NP[k][0],NP[k][1],NP[k][2],li)}else CL(c[0],u,190,31,li)});
    if((FMODE==="ez"&&!RB&&!COMB)){[[226,304,237,314,"u0",309,S[0]],[226,317,237,327,"u0",322,S[1]],[263,313,274,325,"u1",319,S[3]],[263,174,274,186,"u1",180,N[1]],[226,157,237,168,"u0",162.5,N[2]]].forEach(([a,b,c2,d,sd,cc,e])=>{hroom(a,b,c2,d,3.5,11,M.stoneL,nm(e[0],e[1],e[2]),{side:sd,c:cc,nm:e[0]});box(a-0.3,b-0.3,c2+0.3,d+0.3,11,11.6,M.stone2,null)})}
    // the immersion room on the roof of the Parvah
    {const pv=nm("בית הטבילה על גג הפרוה","יומא ג, ג; מידות ה, ג","⚖️ על גג לשכת הפרוה היה בית טבילה, ושם טבל הכהן הגדול ביום הכיפורים.");const u=137.5;if(!(FMODE==="ez"&&!RB&&!COMB)){
      box(u-5,303.5,u+5,312,28.1,32,M.stoneL,pv);box(u-5.3,303.2,u+5.3,312.3,32,32.5,M.stone2,null);box(u-1,312,u+1,312.08,28.1,31,M.dark,null,{cast:false,noCol:true})}}}
  // the chamber of seals and the chamber of shekalim with the 13 shofarot, beside the inner south gate (💡 placement)
  {const ho=I("לשכת החותמות","שקלים ה, ג-ד","⚖️ מי שצריך נסכים קונה \"חותם\" (מעין שובר) אצל הממונה על החותמות, ומקבל בו את הנסכים אצל הממונה על הנסכים. 💡 המקום כאן ליד השער הפנימי הדרומי — הצעה.");
    const sk=I("לשכת השקלים","שקלים ג, א-ב; ה, ו","⚖️ לשכה שבה אוספים את מחצית השקל, ושלוש פעמים בשנה \"תורמים את הלשכה\" — משם קונים את קרבנות הציבור. 💡 המקום כאן הצעה.");
    const sf=I("שלושה עשר שופרות","שקלים ו, א; ו, ה","⚖️ \"שלשה עשר שופרות היו במקדש\" — תיבות צרות מלמעלה ורחבות מלמטה (כמו שופר), שלא יכניסו יד ויגנבו. על כל אחת כתוב למה התרומה: תקלין חדתין, תקלין עתיקין, קינין, גוזלי עולה, עצים, לבונה, זהב לכפורת, ושש לנדבה. 💡 המקום כאן הצעה.");
    [[263,ho,"לשכת החותמות"],[227,sk,"לשכת השקלים"]].forEach(([u0,inf,t])=>{hroom(u0,338,u0+10,349,3.5,11,M.stoneL,inf,{side:u0<250?"u0":"u1",c:343.5,nm:t});box(u0-0.3,337.7,u0+10.3,349.3,11,11.6,M.stone2,null);CL(t,u0+5,343.5,15,inf)});
    for(let k=0;k<13;k++){const u=226+k*0.85;cyl(u,351.2,3.5,4.9,0.32,0.1,M.bronze,sf,10);cyl(u,351.2,4.9,5.05,0.11,0.11,M.dark,null,8)}
    CL("13 שופרות",231,351.2,8,sf)}
  // binyan
  const bi=I("הבניין שמול הגזרה","יחזקאל מ״א, יב","70 × 90 אמה מבפנים, עם קיר של 5 אמות. למה הוא משמש — לא מפורש. הגובה כאן בניחוש.");
  box(0,200,80,300,7.5,37.5,M.stone,bi);box(0,199.6,80.4,300.4,37.5,39,M.stoneL,null);for(let k=0;k<9;k++)box(80,207+k*10.5,81,210+k*10.5,7.5,37.5,M.stone2,null);
  }
  let HG=null,colH=COL.length;if(RB){HG=new THREE.Group();HG.position.y=8.5*A;ROOT.add(HG);group=HG}
  // the House
  const ez=FMODE==="ez"&&!RB,bodyW=ez?32:70,tzW=ez?50:70,ulW=ez?50:100,D=ez?14:20,bu0=ez?109:100;
  if(!ez){const ms=I("המסיבה","מידות ד, ה; ד, ז","📜 \"ומסבה היתה עולה מקרן מזרחית צפונית לקרן צפונית מערבית, שבה היו עולין לגגות התאים\" (מידות ד, ה). 📜 ברוחב 3 אמות, בצד הצפוני של הבית, בין שני כתלים של 5 אמות (מידות ד, ז). כאן היא בתוך הקיר, ולא רואים אותה מבחוץ."),hm=I("בית הורדת המים","מידות ד, ז","📜 בצד הדרומי של הבית, ברוחב 3 אמות, בין שני כתלים של 5 אמות — \"ובית הורדת המים שלש אמות\". כאן הוא בתוך הקיר, ולא רואים אותו מבחוץ.");CL("המסיבה",140,221.5,56,ms,false);CL("בית הורדת המים",140,278.5,56,hm,false)}
  const hi=I("הבית","יחזקאל מ״א; מידות ד, ו-ז",(ez?"לפי יחזקאל: הבית עם הצלעות רוחבו 50 אמה, וגוף ההיכל מעליהן צר יותר.":"לפי מסכת מידות: הבית 70 אמה רוחב והאולם 100 — \"צר מאחוריו ורחב מלפניו, ודומה לארי\".")+" אורך 100 אמה. במודל: הגובה 100 אמה, לפי מסכת מידות (יחזקאל לא נותן גובה לבית). דעת המלבי״ם (מ״א, ז): הבית גבוה יותר. שיש לבן וכחלחל בשורות, \"כי אדוותא דימא\". 📜 עומק האולם 11 אמה, כמו בפסוק (מ׳, מט) וברש״י שם. 💡 כך חסרה אמה אחת בחשבון של 100 אמה (מ״א, יג). לפי רש״י, את ה־100 מודדים יחד עם בית החליפות שבצדי האולם.");
  const vmin=250-Math.max(tzW,ulW)/2-5,vmax=250+Math.max(tzW,ulW)/2+5;
  box(98,vmin,203,vmax,7.5,13.5,M.stone,I("יסוד הבית","יחזקאל מ״א, ח; מ׳, מט","יסוד בגובה \"מלוא הקנה, שש אמות\". עולים אליו ב־"+(ez?"10":"12")+" מדרגות (המספר לא כתוב בפסוק — הצעה)."+(ez?" חמש האמות של היסוד שבולטות מחוץ לצלעות הן \"מקום המנח\" (מ״א, יא), ואליו נפתחים פתחי הצלעות.":"")));
  const nst=ez?10:12;if(!M.stepD){M.stepD=M.stone2.clone();M.stepD.color=new THREE.Color(0xbdb3a0)}for(let k=0;k<nst;k++){box(203+k,236,204+k,264,7.5,13.5-6/nst*(k+1),k%2?M.stepD:M.stone2,null,{noCol:true});box(203+k+0.85,236,204+k,264,13.5-6/nst*(k+1)-0.02,13.5-6/nst*(k+1),M.dark,null,{noCol:true,cast:false})}
  [235.35,264.65].forEach(vc=>{const P=(a,y)=>{const q=W(a,vc);return new THREE.Vector3(q[0],y*A,q[1])};stairRail(P,nst,203,1,k=>13.5-6/nst*(k+1),(a0,a1,top)=>box(a0,vc-0.3,a1,vc+0.3,7.5,top,M.stone2,RLI,{noCol:true}))});
  const ti=I("הצלעות","יחזקאל מ״א, ה-יא","חדרים צדדיים סביב הבית, בשלוש קומות — \"צלע אל צלע שלוש ושלשים פעמים\" (יחזקאל מ״א, ו), \"ורחבה ונסבה למעלה למעלה\". בבית שני היו 38 תאים: 15 בצפון, 15 בדרום ו־8 במערב (מידות ד, ג; רמב״ם, הלכות בית הבחירה ד, י)."+(ez?" כאן 33 תאים, 11 בכל קומה: 5 בצפון, 5 בדרום ו־1 במערב — החלוקה היא הצעה של התוכנית. \"ופתח הצלע למנח, פתח אחד דרך הצפון ופתח אחד לדרום\" (מ״א, יא) — שני הפתחים בקומה התחתונה. התאים מתרחבים כלפי מעלה, כי קיר הבית נעשה דק יותר בכל קומה (\"מגרעות\", מ״א, ו-ז), ולכן ההתרחבות בפנים ולא רואים אותה מבחוץ.":""));
  if(ez){for(let s=0;s<3;s++){const y0=13.5+s*7,y1=y0+7;box(100,225,180,(250-bodyW/2),y0,y1,M.marble,ti,{tile:2.6});box(100,(250+bodyW/2),180,275,y0,y1,M.marble,ti,{tile:2.6});box(100,(250-bodyW/2),bu0,(250+bodyW/2),y0,y1,M.marble,ti,{tile:2.6});box(99.7,224.7,180,(250-bodyW/2),y1-0.4,y1,M.stone2,null);box(99.7,(250+bodyW/2),180,275.3,y1-0.4,y1,M.stone2,null);box(99.7,(250-bodyW/2),bu0,(250+bodyW/2),y1-0.4,y1,M.stone2,null);
      for(let i=1;i<5;i++){const u=100+16*i;box(u-0.4,224.7,u+0.4,225,y0,y1-0.4,M.marble,null,{tile:2.6,noCol:true});box(u-0.4,275,u+0.4,275.3,y0,y1-0.4,M.marble,null,{tile:2.6,noCol:true})}
      for(let i=0;i<5;i++){const u=108+16*i;if(s===0&&i===2)continue;box(u-0.7,224.94,u+0.7,225,y0+2.2,y0+5.6,M.win,null,{cast:false});box(u-0.7,275,u+0.7,275.06,y0+2.2,y0+5.6,M.win,null,{cast:false})}
      box(99.94,249.3,100,250.7,y0+2.2,y0+5.6,M.win,null,{cast:false})}
    {const dr=I("פתחי הצלעות","יחזקאל מ״א, יא","\"ופתח הצלע למנח, פתח אחד דרך הצפון ופתח אחד לדרום\" — שני פתחים לצלעות, אחד בצפון ואחד בדרום, ודרכם יוצאים אל המנח, שהוא חלק היסוד שבולט מחוץ לצלעות. רוחב הפתח וגובהו לא מפורשים — כאן בהערכה.");
      [[224.6,225.02],[274.98,275.4]].forEach(([a,b])=>{box(139,a,141,b,13.5,18,M.dark,dr,{cast:false,noCol:true});box(138.4,a-0.15,141.6,b+0.15,18,18.6,M.stoneL,null,{noCol:true});box(138.4,a-0.15,139,b+0.15,13.5,18,M.stoneL,null,{noCol:true});box(141,a-0.15,141.6,b+0.15,13.5,18,M.stoneL,null,{noCol:true})});
      // item 7 (decided by Shmuel): steps from the inner court up to the munach, in front of each opening. 📜 the munach is the top of the 6-amah base (41:8, 41:11); 💡 12 steps of half an amah, 1 amah deep, 6 amot wide
      const ms=I("המדרגות אל המנח","יחזקאל מ״א, ח; מ״א, יא","📜 הצלעות עומדות על יסוד \"מלוא הקנה שש אמות\" (מ״א, ח), ופתח הצלע נפתח \"למנח\" (מ״א, יא), שהוא ראש היסוד. 💡 הפסוק לא אומר איך עולים אל המנח. כאן 12 מדרגות של חצי אמה מהחצר, מול כל פתח, ומספרן ורוחבן הם הצעה.");
      [[vmin,-1],[vmax,1]].forEach(([vf,o])=>{for(let k=0;k<12;k++){const a=vf+o*k,b=vf+o*(k+1);box(137,Math.min(a,b),143,Math.max(a,b),7.5,13.5-0.5*(k+1),k%2?M.stepD:M.stone2,k?null:ms,{noCol:true})}})}}
  function boxM(u0,v0,u1,v1,y0,y1,faces,info){const w=(u1-u0)*A,h=(y1-y0)*A,d=(v1-v0)*A;const mats=[0,1,2,3,4,5].map(i=>faces[i]||M.marble);
    const m=new THREE.Mesh(rbox(Math.max(w,0.01),Math.max(h,0.01),Math.max(d,0.01),2.6),mats);const p=W((u0+u1)/2,(v0+v1)/2);m.position.set(p[0],(y0+y1)/2*A,p[1]);m.castShadow=true;m.receiveShadow=true;if(info){m.userData=info;cPick.push(m)}group.add(m);COL.push({x0:p[0]-w/2,x1:p[0]+w/2,z0:p[1]-d/2,z1:p[1]+d/2,y0:y0*A,y1:y1*A});return m}
  const P=M.panel,vN=250-bodyW/2,vS=250+bodyW/2,ui0=ez?240:215,ui1=ez?260:285;
  // body walls around heikhal (u137-177) + kodesh (u115-135), interior 20 wide, 40 high
  boxM(bu0,vN,177,240,13.5,53.5,{4:P},hi);boxM(bu0,260,177,vS,13.5,53.5,{5:P},hi);boxM(bu0,240,115,260,13.5,53.5,{0:P},hi);
  const kd=I("הפתח לקודש הקודשים","יחזקאל מ״א, ג; מ״א, כג-כה","\"ושתים דלתות להיכל ולקדש, ושתים דלתות לדלתות, שתים מוסבות דלתות\" — פתח של 6 אמות ובו שתי דלתות, ולכל דלת שתי כנפיים שמתקפלות. הדלתות מצופות זהב עם כרובים ותמורים (מ״א, כה). ⚖️ לפי הרמח״ל (משכני עליון) הדלתות פתוחות תמיד, ולפני הפתח מסך גדול — פרוכת, שלא יסתכלו פנימה. רק הכהן הגדול נכנס, ביום הכיפורים.");
  if(ez){boxM(135,240,137,247,13.5,53.5,{0:P,1:P},kd);boxM(135,253,137,260,13.5,53.5,{0:P,1:P},kd);boxM(135,247,137,253,25.5,53.5,{0:P,1:P,3:P},kd);
  // item 28: one gold skin over the whole wall (both faces), so the three stone pieces do not show seams or shifted panels. 💡 the panel pattern is the model's
  {const sh=new THREE.Shape();sh.moveTo(-10*A,13.5*A);sh.lineTo(10*A,13.5*A);sh.lineTo(10*A,53.5*A);sh.lineTo(-10*A,53.5*A);sh.lineTo(-10*A,13.5*A);const ho=new THREE.Path();ho.moveTo(-3*A,13.5*A+0.001);ho.lineTo(-3*A,25.5*A);ho.lineTo(3*A,25.5*A);ho.lineTo(3*A,13.5*A+0.001);ho.lineTo(-3*A,13.5*A+0.001);sh.holes.push(ho);
    [[137.02,Math.PI/2,-1],[134.98,-Math.PI/2,1]].forEach(([u,ry,sx])=>{const g=new THREE.ShapeGeometry(sh),pa=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pa.count;i++)uv.setXY(i,(sx*pa.getX(i)+10*A)/2.6,pa.getY(i)/2.6);uv.needsUpdate=true;const m=new THREE.Mesh(g,P),q=W(u,250);m.position.set(q[0],0,q[1]);m.rotation.y=ry;m.receiveShadow=true;m.userData=kd;cPick.push(m);group.add(m)})}
  box(132,247,135,247.22,13.5,25.5,M.panel,kd,{cast:false,tile:1.2,noCol:true});box(132,252.78,135,253,13.5,25.5,M.panel,kd,{cast:false,tile:1.2,noCol:true});{if(!M.parocS)M.parocS=new THREE.MeshStandardMaterial({color:0x14205a,roughness:1,metalness:0,side:THREE.DoubleSide});const pm=M.parocS;const g=new THREE.PlaneGeometry(7.2*A,12.6*A,40,1),pp=g.attributes.position;for(let i=0;i<pp.count;i++){pp.setZ(i,Math.sin(pp.getX(i)/(0.45*A)*Math.PI)*0.06*A)}g.computeVertexNormals();const m=new THREE.Mesh(g,pm),q=W(137.45,250);m.position.set(q[0],19.8*A,q[1]);m.rotation.y=Math.PI/2;m.castShadow=true;m.userData=I("הפרוכת","יחזקאל מ״א, ג; משכני עליון לרמח״ל; מלכים א ח, ח","⚖️ לפני פתח קודש הקודשים פרוסה פרוכת בגודל הפתח, \"לכסות המקום שלא יסתכלו לקדש הקדשים\". הדלתות עצמן פתוחות תמיד. 💡 הצבעים כמו בפרוכת המשכן: תכלת, ארגמן, תולעת שני ושש.");cPick.push(m);group.add(m);box(137.5,246.4,137.8,253.6,26,26.3,M.gold,null,{cast:false,noCol:true});}}
  else{const pk=I("שתי הפרוכות","רמב״ם, הלכות בית הבחירה ד, ב; יומא נא ע״ב","בבית שני לא היה כותל בין ההיכל לקודש הקודשים, אלא \"אמה טרקסין\" — אמה אחת, ושתי פרוכות זו לפני זו. 📜 הפרוכת \"תכלת וארגמן ותולעת שני ושש משזר, מעשה חשב יעשה אתה כרבים\" (שמות כו, לא) — ארוגה מארבעה מינים, ובה כרובים. ⚖️ עוביה טפח (שקלים ח, ה). 💡 צורת הכרובים והקפלים בהערכה.");
    if(!M.paroc){const Wd=512,Hd=1024,r=rng(606),cols=["#24387f","#5e2463","#9c1f2a","#ebe4d2"];
      const c=cv(Wd,Hd,(x)=>{for(let y=0;y<Hd;y+=2)for(let xx=0;xx<Wd;xx+=2){}x.fillStyle="#2a3a7a";x.fillRect(0,0,Wd,Hd);
        for(let y=0;y<Hd;y+=3){x.fillStyle=cols[(y/3+((y/48)|0))%4];x.globalAlpha=0.16;x.fillRect(0,y,Wd,2)}for(let xx=0;xx<Wd;xx+=3){x.fillStyle=cols[(xx/3)%4];x.globalAlpha=0.1;x.fillRect(xx,0,2,Hd)}x.globalAlpha=1;
        const cher=(cx,cy,s)=>{x.fillStyle="#e9e0c8";x.beginPath();x.ellipse(cx,cy+22*s,9*s,28*s,0,0,7);x.fill();[-1,1].forEach(sd=>{x.beginPath();x.moveTo(cx+sd*7*s,cy+5*s);x.quadraticCurveTo(cx+sd*42*s,cy-30*s,cx+sd*44*s,cy-52*s);x.quadraticCurveTo(cx+sd*30*s,cy-8*s,cx+sd*8*s,cy+18*s);x.fill()});x.beginPath();x.arc(cx,cy-6*s,8*s,0,7);x.fill();
          x.strokeStyle="#9c1f2a";x.lineWidth=2*s;x.beginPath();x.ellipse(cx,cy+22*s,9*s,28*s,0,0,7);x.stroke()};
        for(let j=0;j<8;j++)for(let i=0;i<4;i++)cher(64+i*128,90+j*124,1.05);
        [[0,26],[Hd-26,26]].forEach(([y,h])=>{x.fillStyle="#9c1f2a";x.fillRect(0,y,Wd,h);x.fillStyle="#5e2463";x.fillRect(0,y+8,Wd,10)});noiseFill(x,Wd,Hd,16,607)});
      M.paroc=new THREE.MeshStandardMaterial({map:tex(c,true),roughness:0.92,side:THREE.DoubleSide})}
    // soft vertical folds; invisible boxes keep the old collision
    [135.67,136.47].forEach((u,k)=>{const b=box(u-0.07,240,u+0.08,260,13.5,53.5,M.paroc,pk,{cast:false,col:true});b.visible=false;
      const g=new THREE.PlaneGeometry(20*A,40*A,60,1),pp=g.attributes.position;for(let i=0;i<pp.count;i++){const x=pp.getX(i);pp.setZ(i,Math.sin(x/(0.55*A)*Math.PI+k)*0.09*A)}g.computeVertexNormals();
      const m=new THREE.Mesh(g,M.paroc),q=W(u,250);m.position.set(q[0],33.5*A,q[1]);m.rotation.y=Math.PI/2;m.castShadow=true;m.receiveShadow=true;m.userData=pk;cPick.push(m);group.add(m)})}
  // east wall of heikhal with its 10×20 entrance
  const hg=I("שער ההיכל","יחזקאל מ״א, ב; מידות ד, א","פתח של 10 אמות רוחב ו־20 גובה. \"ושתים דלתות להיכל... שתים מוסבות דלתות\" (מ״א, כג-כד) — שתי דלתות, ולכל אחת שתי כנפיים שמתקפלות זו על זו. ביום הן פתוחות ומקופלות לתוך ההיכל. עליהן כרובים ותמורים (מ״א, כה).");
  boxM(177,vN,183,245,13.5,53.5,{0:P,1:P},hg);boxM(177,255,183,vS,13.5,53.5,{0:P,1:P},hg);boxM(177,245,183,255,33.5,53.5,{0:P,1:P,3:P},hg);
  {const leaf=(u,v,ang,len,y0,y1,mat)=>{const g=new THREE.BoxGeometry(len*A,(y1-y0)*A,0.16*A);const m=new THREE.Mesh(g,mat);const c=[u+Math.cos(ang)*len/2,v+Math.sin(ang)*len/2],p=W(c[0],c[1]);m.position.set(p[0],(y0+y1)/2*A,p[1]);m.rotation.y=-ang;m.castShadow=true;m.receiveShadow=true;m.userData=hg;cPick.push(m);group.add(m);return[u+Math.cos(ang)*len,v+Math.sin(ang)*len]};
    if(!M.doorG){M.doorG=M.panel.clone();M.doorG.map=M.panel.map.clone();M.doorG.map.repeat.set(1,2);M.doorG.map.needsUpdate=true}
    const d=Math.PI/180;[[245,1],[255,-1]].forEach(([vh,sg])=>{const e=leaf(177,vh,sg*155*d,2.5,13.5,33.5,M.doorG);leaf(e[0],e[1],sg*20*d,2.5,13.5,33.5,M.doorG)})}
  // heikhal ceiling + upper storey mass
  boxM(bu0,vN,183,vS,53.5,107.5,{3:M.ceiling},I("התקרה","מלכים א ו, ט; ו, יח; יחזקאל מ״א, טז","⚖️ \"ויספן את הבית גבים ושדרת בארזים\" — תקרה של קורות ארז ותאים ביניהן, \"וארז אל הבית פנימה מקלעת פקעים ופטורי צצים\" — מגולפת בדלעות קטנות ובפרחים פתוחים. 📜 ביחזקאל: \"שחיף עץ סביב סביב\" (מ״א, טז). 💡 הציפוי בזהב של הפרחים, כמו בבית ראשון (מלכים א ו, כב), והמידות של התאים — בהערכה."));
  // ulam: side walls, front wall with the great opening, upper mass
  boxM(183,250-ulW/2,194,ui0,13.5,53.5,{4:P},hi);boxM(183,ui1,194,250+ulW/2,13.5,53.5,{5:P},hi);
  boxM(194,250-ulW/2,199,250-D/2,13.5,53.5,{1:P},hi);boxM(194,250+D/2,199,250+ulW/2,13.5,53.5,{1:P},hi);
  boxM(183,250-ulW/2,199,250+ulW/2,53.5,107.5,{3:M.ceiling},hi);
  if(ez){const pp=I("הפשפשים","יחזקאל מ״ד, א-ג ורש״י שם; מידות ד, ב","📜 \"השער הזה סגור יהיה, לא יפתח\" — משני צדי פתח ההיכל שתי דלתות קטנות, בעובי קיר האולם. ⚖️ הצפוני פתוח, ודרכו נכנסים הכהנים בכל בוקר אל המנח, אל הצלעות ואל ההיכל. הדרומי סגור תמיד, \"כי ה׳ אלקי ישראל בא בו\". 💡 גודל הפתחים בהערכה.");
    [[250-ulW/2,-1,true],[250+ulW/2,1,false]].forEach(([vw,dr,open])=>{const a=vw+dr*0.02,b=vw+dr*0.1,lo=Math.min(a,b),hi2=Math.max(a,b);box(187,lo,190,hi2,13.5,19.5,open?M.dark:M.wood,pp,{cast:false,noCol:true});const fa=vw+dr*0.02,fb=vw+dr*0.3,f0=Math.min(fa,fb),f1=Math.max(fa,fb);box(186.4,f0,190.6,f1,19.5,20.1,M.stoneL,null,{cast:false,noCol:true});box(186.4,f0,187,f1,13.5,19.5,M.stoneL,null,{cast:false,noCol:true});box(190,f0,190.6,f1,13.5,19.5,M.stoneL,null,{cast:false,noCol:true});CL(open?"פשפש פתוח":"פשפש סגור",188.5,vw+dr*0.5,17,pp,false)})}
  // crown: gold cornice and roof spikes ("כלה עורב", מידות ד, ו)
  {const cr=I("כלה עורב","מידות ד, ו","מעל הגג מעקה בגובה 3 אמות, ועליו \"כלה עורב\" — חודים בגובה אמה, שלא ינחתו עופות על הגג. כך יוצא הבית בדיוק 100 אמה גובה (מידות ד, ו; רמב״ם, הלכות בית הבחירה ד, ג).");
    box(bu0-0.6,vN-0.6,183.01,vS+0.6,105.9,106.5,M.stoneL,cr,{cast:false});box(183,250-ulW/2-0.6,199.6,250+ulW/2+0.6,105.9,106.5,M.stoneL,cr,{cast:false});
    box(bu0-0.4,vN-0.4,183.01,vS+0.4,52.9,53.9,M.stoneL,null,{cast:false});box(183,250-ulW/2-0.4,199.4,250+ulW/2+0.4,52.9,53.9,M.stoneL,null,{cast:false});
    const sp=[];const ring=(u0,v0,u1,v1)=>{for(let u=u0;u<=u1;u+=1){sp.push([u,v0],[u,v1])}for(let v=v0+1;v<v1;v+=1){sp.push([u0,v],[u1,v])}};ring(bu0,vN,183,vS);ring(183,250-ulW/2,199,250+ulW/2);
    const im=new THREE.InstancedMesh(new THREE.ConeGeometry(0.07*A,1*A,5),M.bronze,sp.length),d=new THREE.Object3D();sp.forEach((q,i)=>{const p=W(q[0],q[1]);d.position.set(p[0],107*A,p[1]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});group.add(im)}
  // golden floor inside
  box(115,240,194,260,13.5,13.56,M.goldFloor,null,{cast:false});box(183,ui0,194,ui1,13.5,13.56,M.goldFloor,null,{cast:false});
  // vessels of the heikhal
  const fl=13.56,mI=I("המנורה","שמות כ״ה, לא-מ; מנחות כח ע״ב","מנורת זהב בגובה 18 טפחים, כ־3 אמות, עם שבעה נרות שמן זית, בדרום ההיכל. הקנים ישרים ואלכסוניים, כמו בציור של הרמב״ם בפירוש המשניות (מנחות ג, ז), ולה שלוש רגליים, לפי מנחות כח ע״ב. לפי הרמב״ם (ג, ח) הנרות מסודרים מצפון לדרום, שישה הנרות פונים לאמצעי, והאמצעי — \"נר מערבי\" — פונה לקודש הקודשים. 42 קישוטים: 22 גביעים, 11 כפתורים ו־9 פרחים (ג, א-ג), לפי סדר הטפחים בגמרא (מנחות כח ע״ב). לפניה אבן עם שלוש מעלות. שימו לב: יחזקאל לא מזכיר מנורה בהיכל — בפסוק מ״א, כב מתואר רק \"המזבח עץ... השולחן אשר לפני ה׳\". המנורה כאן היא הנחה של התוכנית, לפי התורה ומסכת מידות.");
  (function(){const mu=150,mv=257.5,p=W(mu,mv),g=new THREE.Group();g.position.set(p[0],fl*A,p[1]);
    const add=(geo,mat,x,y,z,rx,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(rx)m.rotation.x=rx;if(rz)m.rotation.z=rz;m.castShadow=true;m.userData=mI;cPick.push(m);g.add(m);return m};
    const a=A,t=a/6,G=M.altarGold;
    const vseg=(x,y0,y1,r)=>add(new THREE.CylinderGeometry(r*t,r*t,(y1-y0)*t,10),G,x*t,(y0+y1)/2*t,0);
    const dseg=(x0,y0,x1,y1,r)=>{const L=Math.hypot(x1-x0,y1-y0),m=add(new THREE.CylinderGeometry(r*t,r*t,L*t,8),G,(x0+x1)/2*t,(y0+y1)/2*t,0);m.rotation.z=Math.atan2(-(x1-x0),y1-y0);return m};
    const goblet=(x,y)=>add(new THREE.CylinderGeometry(0.42*t,0.12*t,0.33*t,12),G,x*t,y*t,0);           // גביע — כוס רחבה למטה? "כמין כוסות אלכסנדריאה", פיה רחב
    const bulb=(x,y)=>{const m=add(new THREE.SphereGeometry(0.3*t,12,8),G,x*t,y*t,0);m.scale.set(1,1.35,1);return m}; // כפתור — כתפוחי הכרתי, ארוך מעט
    const flower=(x,y)=>add(new THREE.CylinderGeometry(0.45*t,0.18*t,0.3*t,14,1,true),G,x*t,y*t,0);      // פרח — כמין כותרת, שפתו נוטה לחוץ
    // feet (3) and base: tefachim 0-3, with the lowest flower
    for(let i=0;i<3;i++){const an=i*2.0944+Math.PI/2,lx=Math.cos(an)*1.6,lz=Math.sin(an)*1.6;const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.12*t,0.2*t,2.3*t,8),G);leg.position.set(lx*t*0.5,1.0*t,lz*t*0.5);leg.lookAt(new THREE.Vector3(0,2.6*t,0));leg.rotateX(Math.PI/2);leg.castShadow=true;leg.userData=mI;cPick.push(leg);g.add(leg);add(new THREE.SphereGeometry(0.22*t,8,6),G,lx*t,0.15*t,lz*t)}
    flower(0,2.6);vseg(0,2.0,18,0.22);
    // shaft: 5-6 goblet+bulb+flower; bulbs at 8.5, 10.5, 12.5 with branches; 15-18 three goblets, bulb, flower
    goblet(0,5.2);bulb(0,5.55);flower(0,5.85);
    const LX=[6,4,2];[8.5,10.5,12.5].forEach((y,k)=>{bulb(0,y);const xs=LX[k];[-1,1].forEach(sd=>{dseg(0,y,sd*xs,15,0.18);vseg(sd*xs,15,18,0.18);
      goblet(sd*xs,15.4);goblet(sd*xs,16.0);goblet(sd*xs,16.6);bulb(sd*xs,17.15);flower(sd*xs,17.7)})});
    goblet(0,15.4);goblet(0,16.0);goblet(0,16.6);bulb(0,17.15);flower(0,17.7);
    // seven fixed lamps; the side lamps face the middle one, the middle faces west
    [-6,-4,-2,0,2,4,6].forEach((x,i)=>{const lp=add(new THREE.CylinderGeometry(0.42*t,0.25*t,0.35*t,10),G,x*t,18.1*t,0);const f=new THREE.Mesh(new THREE.ConeGeometry(0.13*t,0.6*t,8),M.fire2);f.position.set(x*t+(x===0?0:-Math.sign(x)*0.25*t),18.6*t,0);g.add(f);f.userData.base=f.position.y;f.userData.ph=i*7;f.userData.small=true;flames.push(f)});
    // the stone with three steps in front of the menorah (3:11)
    {const sI3=I("האבן שלפני המנורה","רמב״ם, הלכות בית הבחירה ג, יא; תמיד ג, ט","אבן ובה שלוש מעלות לפני המנורה. הכהן עומד עליה ומטיב את הנרות, ומניח עליה את כוז השמן, המלקחיים והמחתות.");
      [0,1,2].forEach(k=>{const m=new THREE.Mesh(new THREE.BoxGeometry((1.2-0.3*k)*a*0.6,0.5*t,3.5*t),M.marble);m.position.set(0,(0.25+0.5*k)*t,0);m.position.z=(2.6+0.55*k)*t*0+0;m.position.x=0;m.userData=sI3;cPick.push(m);const w=new THREE.Group();w.add(m);w.position.set(0,0,0);g.add(w);m.position.set(0,(0.25+0.5*k)*t,0);m.translateZ(0);m.position.z=(4.2-0.45*k)*t;})}
    g.rotation.y=Math.PI/2;group.add(g);
    const lt=new THREE.PointLight(0xffb45c,1.5,26*a*3,2);lt.position.set(p[0],(fl+3.6)*A,p[1]);group.add(lt);MENL=lt;
    // stage 6: soft flames — "להעלות נר תמיד", pure olive oil (Exodus 27:20); the group is turned a quarter, so local x runs along -z
    const LMP=[-6,-4,-2,0,2,4,6].map(x=>{const xl=(x+(x===0?0:-Math.sign(x)*0.25))*t;return{x:p[0],y:fl*A+18.72*t,z:p[1]-xl,rx:0.006,s:0.06}});group.add(makePFX(LMP.length*(SMALL?8:12),true,LMP,{seed:71}))})();
  const sI=I("שולחן לחם הפנים","שמות כ״ה, כג-ל; מנחות צו ע״א","שולחן מצופה זהב בצפון ההיכל: אורך 2 אמות, רוחב אמה, גובה אמה וחצי (כ־80 ס״מ — גובה של שולחן רגיל). עליו 12 חלות בשתי מערכות של 6. \"החלות ארכן עשרה ורחבן חמשה וקרנותיהן שבע אצבעות\" (מנחות יא, ד): לפי רבי יהודה החלה מונחת לרוחב השולחן, ושני קצותיה מקופלים כלפי מעלה, כמו \"תיבה פרוצה\". בין חלה לחלה קנים של זהב, שהאוויר יעבור, ו־4 סניפין (עמודים) של זהב מחזיקים את הקנים. בין המערכות שני בזיכי לבונה.");
  (function(){const RRT=GATE==="high"&&!COMB&&!RB,su=RRT?143:150,sv=243,TH=RRT?3:1.5,sI2=RRT?I("השולחן","יחזקאל מ״א, כב; רש״י שם; משכני עליון לרמח״ל","📜 \"המזבח עץ שלוש אמות גבה, וארכו שתים אמות... וידבר אלי זה השלחן אשר לפני ה׳\" (מ״א, כב). ⚖️ לפי רש״י והרמח״ל זה שולחן לחם הפנים: אורך 2 אמות, רוחב אמה וגובה 3 אמות. הוא בצפון ההיכל, 5 אמות מקיר קודש הקודשים. עליו 12 חלות בשתי מערכות (ויקרא כד, ה-ו)."):sI;box(su-1,sv-0.5,su+1,sv+0.5,fl+TH-0.15,fl+TH,M.gold,sI2);[[-0.9,-0.4],[0.9,-0.4],[-0.9,0.4],[0.9,0.4]].forEach(o=>box(su+o[0]-0.06,sv+o[1]-0.06,su+o[0]+0.06,sv+o[1]+0.06,fl,fl+TH-0.15,M.gold,sI2,{cast:false}));
    {const t=1/6,top=fl+TH,step=2.1*t;[-3.5*t,3.5*t].forEach(o=>{const u=su+o;for(let k=0;k<6;k++){const y=top+k*step;
      box(u-2.5*t,sv-3*t,u+2.5*t,sv+3*t,y,y+0.5*t,M.bread,sI,{cast:false,noCol:true});[-1,1].forEach(sd=>box(u-2.5*t,sv+sd*3*t-(sd>0?0.5*t:0),u+2.5*t,sv+sd*3*t+(sd<0?0.5*t:0),y,y+2*t,M.bread,sI,{cast:false,noCol:true}));
      if(k<5)for(let q=-1;q<=1;q++){if(k===4&&q===0)continue;const cc=new THREE.Mesh(new THREE.CylinderGeometry(0.06*t*A,0.06*t*A,6.2*t*A,6),M.altarGold);const pp=W(u+q*1.6*t,sv);cc.position.set(pp[0],(y+step-0.08*t)*A,pp[1]);cc.rotation.x=Math.PI/2;group.add(cc)}}});
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{box(su+a*(6.2*t)-0.08*t,sv+b*(3.3*t)-0.08*t,su+a*(6.2*t)+0.08*t,sv+b*(3.3*t)+0.08*t,top,top+12.5*t,M.altarGold,sI,{cast:false,noCol:true})});
    const bz=I("בזיכי הלבונה","ויקרא כד, ז; מנחות צו ע״א","\"ונתת על המערכת לבונה זכה\" — שני בזיכים (כפות) של זהב עם קומץ לבונה בכל אחד, בין שתי המערכות.");
    [-0.6*t,0.6*t].forEach(o=>{cyl(su,sv+o,top,top+0.7*t,0.35*t,0.45*t,M.altarGold,bz,12)})}})();
  if(COMB||(GATE==="high"&&!RB)){box(152.5,249.5,153.5,250.5,fl,fl+2,M.altarGold,!COMB?I("מזבח הזהב","שמות ל, א-י; יחזקאל מ״א, כב; רש״י שם","⚖️ לפי רש״י והרמח״ל, \"המזבח עץ\" שביחזקאל (מ״א, כב) הוא השולחן. לכן מזבח הקטורת כאן לפי התורה: אמה על אמה וגובה 2 אמות, מצופה זהב, עם ארבע קרנות ו\"זר זהב סביב\" (שמות ל, ב-ג), באמצע ההיכל בין השולחן למנורה."):I("מזבח הזהב","שמות ל, א-י; רמב״ם, הלכות בית הבחירה ג, יז","מזבח הקטורת: אמה על אמה וגובה 2 אמות (כ־1 מ׳), מצופה זהב, עם ארבע קרנות ו\"זר זהב סביב\" (שמות ל, ג). עומד באמצע ההיכל מצפון לדרום, בין השולחן למנורה, ומשוך קצת כלפי חוץ (מזרחה). יחזקאל (מ״א, כב) מזכיר \"מזבח עץ שלש אמות גבה וארכו שתים אמות\"; כאן הלכנו לפי התורה והרמב״ם, כי כלי המקדש מפורשים בתורה."));}else{box(152,249,154,251,fl,fl+3,M.altarGold,I("מזבח הזהב — לפי יחזקאל והמלבי״ם","יחזקאל מ״א, כב; מלבי״ם שם","\"המזבח עץ שלוש אמות גבה, וארכו שתים אמות, ומקצעותיו לו... זה השלחן אשר לפני ה׳\". לפי המלבי״ם זה מזבח הזהב של העתיד: 2 × 2 אמה וגובה 3, עשוי עץ וראוי להיות מצופה זהב. בתורה (שמות ל, ב) הוא אמה על אמה וגובה 2 — כך הוא בתוכנית \"הרמב״ם\"."));}
  {const TA=COMB||(GATE==="high"&&!RB),h=TA?2:3,s0=TA?0.5:1,cu=153,cv=250;box(cu-s0-0.08,cv-s0-0.08,cu+s0+0.08,cv+s0+0.08,fl+h-0.3,fl+h-0.15,M.altarGold,null);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>box(cu+a*s0-(a>0?0.34:0),cv+b*s0-(b>0?0.34:0),cu+a*s0+(a<0?0.34:0),cv+b*s0+(b<0?0.34:0),fl+h,fl+h+0.45,M.altarGold,null,{cast:false}));
    [[cu-s0,cv,0.08,2*s0],[cu+s0,cv,0.08,2*s0],[cu,cv-s0,2*s0,0.08],[cu,cv+s0,2*s0,0.08]].forEach(c=>box(c[0]-c[2]/2,c[1]-c[3]/2,c[0]+c[2]/2,c[1]+c[3]/2,fl+h,fl+h+0.15,M.altarGold,null,{cast:false}))}{const q=W(153,250),gl=new THREE.PointLight(0xffc070,0.5,9,2);gl.position.set(q[0],(fl+4.5)*A,q[1]);group.add(gl);
    // stage 6: the incense — a thin column that rises straight and spreads under the ceiling ("כתמרות עשן", Song 3:6)
    const hA=(COMB||(GATE==="high"&&!RB))?2:3;box(152.7,249.7,153.3,250.3,fl+hA,fl+hA+0.05,M.ember,null,{cast:false,noCol:true});
    group.add(makePFX(SMALL?40:70,false,[{x:q[0],y:(fl+hA+0.2)*A,z:q[1],rx:0.12*A,s:0.4}],{seed:81,vy:1.1,ttl:15,grow:7,drift:0,col:0xe9e4dc}))}
  {const ks=I("קודש הקודשים","יחזקאל מ״א, ג-ד; משנה יומא ה, ב; רמב״ם, הלכות בית הבחירה ד, א","20 × 20 אמה — זה כל מה שיחזקאל אומר: \"וימד את ארכו עשרים אמה ורחב עשרים אמה... ויאמר אלי זה קדש הקדשים\". בבית שני החדר היה ריק, ורק \"אבן היתה שם מימות נביאים ראשונים, ושתייה היתה נקראת, גבוהה מן הארץ שלש אצבעות\". הארון נגנז בימי יאשיהו (רמב״ם). כאן החדר ריק, ו"+(LOC==="kodesh"?"אבן השתייה בולטת מהרצפה.":"כשהמזבח על הסלע, אבן השתייה נמצאת מתחת למזבח ולא כאן.")+" רק הכהן הגדול נכנס, ביום הכיפורים.");
    box(115,240,135,260,13.5,13.56,M.goldFloor,ks,{cast:false});
    if(LOC==="kodesh"){const rg=new THREE.IcosahedronGeometry(1,5),pp=rg.attributes.position;for(let i=0;i<pp.count;i++){const x=pp.getX(i),y=pp.getY(i),z=pp.getZ(i),nz=Math.sin(x*5.1+z*3.7)*0.5+Math.sin(x*2.3-z*6.1+y*4.0)*0.3+Math.sin(x*13.7+z*11.3)*0.2,k=0.8+0.2*nz;pp.setXYZ(i,x*k,Math.max(y,-0.2)*k,z*k)}rg.computeVertexNormals();
      const ri=I("אבן השתייה","משנה יומא ה, ב; יומא נג ע״ב; רמב״ם, הלכות בית הבחירה ד, א","📜 \"משניטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתייה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן\" (יומא ה, ב). ⚖️ סלע טבעי שבולט מהרצפה כשלוש אצבעות (כ־6 ס״מ). ביום הכיפורים הכהן הגדול מניח עליה את המחתה. 📜 הארון: בבית ראשון עמד כאן. ⚖️ שלמה בנה מקום לגנוז אותו, ויאשיהו גנז אותו שם (רמב״ם, הלכות בית הבחירה ד, א), ולכן בבית שני לא היה ארון. 💡 בבית העתידי — המקורות של התוכנית לא אומרים במפורש שהארון יחזור, ולכן במודל החדר ריק כמו בבית שני, ורק אבן השתייה בולטת מהרצפה.");
      const rock=new THREE.Mesh(rg,new THREE.MeshStandardMaterial({map:T.ground,color:0x5a4e3e,roughness:1,metalness:0,envMapIntensity:0.15}));const q=W(125,250);rock.scale.set(3.4*A,0.11,2.6*A);rock.position.set(q[0],13.56*A-0.05,q[1]);rock.rotation.y=0.4;rock.userData=ri;cPick.push(rock);group.add(rock);
      {const L=label("אבן השתייה",q[0],13.56*A+1.4,q[1],"c",ri);L.inh=true;L.pr=2;cLabels.push(L)}}
    const kl=new THREE.PointLight(0xffd9a0,0.35,30,2);const q2=W(125,250);kl.position.set(q2[0],(13.56+12)*A,q2[1]);group.add(kl);
    KDS={p:new THREE.Vector3(...(()=>{const q=W(134,252);return[q[0],13.56*A+3.6,q[1]]})()),t:new THREE.Vector3(...(()=>{const q=W(118,250);return[q[0],13.56*A+0.6,q[1]]})())}}
  INT={p:new THREE.Vector3(...(()=>{const q=W(172,250);return[q[0],fl*A+2.4,q[1]]})()),t:new THREE.Vector3(...(()=>{const q=W(137,250);return[q[0],fl*A+2.2,q[1]]})())};
  {const a=W(115,240),b=W(199,260);INTBOX={x0:Math.min(a[0],b[0]),x1:Math.max(a[0],b[0]),z0:Math.min(a[1],b[1]),z1:Math.max(a[1],b[1]),y1:53.5*A}}
  {const a=W(115,240),b=W(135.5,260);KBOX={x0:Math.min(a[0],b[0]),x1:Math.max(a[0],b[0]),z0:Math.min(a[1],b[1]),z1:Math.max(a[1],b[1])}} // topic 6: the Holy of Holies part of the house (west of the partition at u≈132–135; the "kodesh" view stands at u=134), for its own darker light
  for(let k=0;k<=6;k++){const v=250-ulW/2+k*ulW/6;if(Math.abs(v-250)<D/2+1)continue;box(199,v-1,200,v+1,13.5,104.5,M.marble,hi,{tile:2.6})}
  for(let k=0;k<=8;k++){const u=bu0+k*(183-bu0)/8;box(u-1,250-bodyW/2-1,u+1,250-bodyW/2,(ez?34.5:13.5),104.5,M.marble,null,{tile:2.6});box(u-1,250+bodyW/2,u+1,250+bodyW/2+1,(ez?34.5:13.5),104.5,M.marble,null,{tile:2.6})}
  box(182.6,250-ulW/2-0.6,200.2,250+ulW/2+0.6,13.5,15,M.stone,null);
  {const rI=I("כרובים ותמורים מבחוץ","יחזקאל מ״א, יח-כ; מ״א, כה-כו","\"מהארץ עד מעל הפתח הכרובים והתמרים עשוים\" (מ״א, כ), \"ותמרה בין כרוב לכרוב, ושנים פנים לכרוב: ופני אדם אל התמרה מפו, ופני כפיר אל התמרה מפו\" (מ״א, יח-יט). כאן הם חקוקים באבן על חזית האולם, מהרצפה עד מעל הפתח, ועל \"כתפות האולם\" — תמרים מפה ומפה (מ״א, כו). המקום המדויק על החזית הוא הצעה של התוכנית.");
    const pan=(va,vb,y0,y1)=>{const w=(vb-va)*A,h=(y1-y0)*A,g=new THREE.PlaneGeometry(w,h),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*(y1-y0)/(vb-va));const m=new THREE.Mesh(g,M.relief);const p=W(199.05,(va+vb)/2);m.position.set(p[0],(y0+y1)/2*A,p[1]);m.rotation.y=Math.PI/2;m.receiveShadow=true;m.userData=rI;cPick.push(m);group.add(m)};
    for(let k=0;k<6;k++){const va=250-ulW/2+k*ulW/6+1,vb=250-ulW/2+(k+1)*ulW/6-1;if(vb>250-D/2-0.5&&va<250+D/2+0.5)continue;pan(va,vb,15.2,58)}
    [[250-D/2+0.03,0],[250+D/2-0.03,Math.PI]].forEach(([v,ry])=>{const g=new THREE.PlaneGeometry(4.6*A,38*A),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*38/4.6);const m=new THREE.Mesh(g,M.reliefP);const p=W(196.6,v);m.position.set(p[0],34.5*A,p[1]);m.rotation.y=ry;m.receiveShadow=true;m.userData=rI;cPick.push(m);group.add(m)})}
  box(199,250-D/2-1.2,199.6,250-D/2,13.5,54.5,M.gold,null,{cast:false});box(199,250+D/2,199.6,250+D/2+1.2,13.5,54.5,M.gold,null,{cast:false});
  box(bu0-0.4,250-bodyW/2-0.4,183,250+bodyW/2+0.4,104.5,105.5,M.gold,null);
  box(182.6,250-ulW/2-0.4,199.4,250+ulW/2+0.4,104.5,105.5,M.gold,null);
  const spikes=[];const edge=(u0,v0,u1,v1)=>{const L=Math.hypot(u1-u0,v1-v0),n=Math.max(1,Math.floor(L/1.5));for(let k=0;k<=n;k++){const t=k/n;spikes.push([u0+(u1-u0)*t,v0+(v1-v0)*t])}};
  edge(bu0,250-bodyW/2,183,250-bodyW/2);edge(bu0,250+bodyW/2,183,250+bodyW/2);edge(bu0,250-bodyW/2,bu0,250+bodyW/2);edge(183,250-ulW/2,199,250-ulW/2);edge(183,250+ulW/2,199,250+ulW/2);edge(199,250-ulW/2,199,250+ulW/2);
  const im=new THREE.InstancedMesh(new THREE.ConeGeometry(0.36*A,1*A,4),M.gold,spikes.length),dd=new THREE.Object3D();spikes.forEach((s,i)=>{const p=W(s[0],s[1]);dd.position.set(p[0],108*A,p[1]);dd.updateMatrix();im.setMatrixAt(i,dd.matrix)});group.add(im);
  box(bu0,250-bodyW/2,183,250+bodyW/2,107.5,107.7,M.stone2,I("כלה עורב","מידות ד, ו","מעל הגג מעקה בגובה 3 אמות, ועליו \"כלה עורב\" — חודים בגובה אמה, שלא ינחתו עופות על הגג. כך יוצא הבית בדיוק 100 אמה גובה (מידות ד, ו; רמב״ם, הלכות בית הבחירה ד, ג)."),{cast:false});
  const vine=new THREE.Mesh(new THREE.TorusKnotGeometry(2.2*A,0.35*A,64,6,2,5),M.gold);const vp=W(183.4,250);vine.position.set(vp[0],36*A,vp[1]);vine.scale.set(0.4,0.55,2.4);vine.rotation.y=Math.PI/2;vine.userData=I("גפן הזהב","מידות ג, ח","\"גפן של זהב היתה עומדת על פתחו של היכל\". מי שהתנדב הביא עלה, גרגר או אשכול של זהב ותלה בה.");cPick.push(vine);group.add(vine);
  for(let i=0;i<5;i++){const w=D+2*(i+1);box(199,250-w/2,200+i*0.3,250+w/2,53.5+i,54.5+i,M.wood,I("חמש המלתראות","מידות ג, ז","חמש קורות מעל הפתח. כל אחת בולטת אמה מכל צד מעל זו שמתחתיה."))}
  const wn=I("חלונות שקופים ואטומים","יחזקאל מ׳, טז; מ״א, טז; מנחות פו ע״ב","צרים מבפנים ורחבים מבחוץ, כי האור יוצא מהמקדש לעולם. בלילה רואים דרכם את אור המנורה.");
  const cols=ez?[-19,-13,13,19]:[-42,-34,-26,-18,18,26,34,42];
  [63.5,79.5].forEach(y=>cols.forEach(c=>box(199,250+c-0.8,199.12,250+c+0.8,y,y+9,M.win2,wn,{cast:false})));
  (ez?[-19,-13,-7,0,7,13,19]:[-42,-34,-26,-18,-10,0,10,18,26,34,42]).forEach(c=>box(199,250+c-0.8,199.12,250+c+0.8,93.5,101.5,M.win2,wn,{cast:false}));
  for(let k=0;k<6;k++){const u=125+k*9;box(u-0.7,250-bodyW/2-0.06,u+0.7,250-bodyW/2,38,50,M.win2,wn,{cast:false});box(u-0.7,250+bodyW/2,u+0.7,250+bodyW/2+0.06,38,50,M.win2,wn,{cast:false})}
  if(ez&&GATE==="high"){const ui=I("העמודים לפני האולם","יחזקאל מ׳, מח-מט; רש״י שם; משכני עליון לרמח״ל","📜 \"ועמודים אל האילים, אחד מפה ואחד מפה\" (מ׳, מט). ⚖️ לפי רש״י והרמח״ל אלה \"אילי האולם\": שני עמודים גבוהים 60 אמה, ברוחב 2 אמות, ובראשם צורת דקל. 💡 צורת הכותרת בהערכה.");[-11.5,11.5].forEach(c=>{cyl(201,250+c,13.5,14.4,1.8,1.8,M.stoneL,null,24);cyl(201,250+c,14.4,73.5,1.05,1,M.marble,ui,24);cyl(201,250+c,73.5,74.7,1,1.3,M.gold,null,20);const p=W(201,250+c);for(let k=0;k<8;k++){const fr=new THREE.Mesh(PALMF||(PALMF=new THREE.ConeGeometry(0.35*A,3.2*A,4)),M.gold),an=k/8*Math.PI*2;fr.position.set(p[0]+Math.cos(an)*0.9*A,75.8*A,p[1]+Math.sin(an)*0.9*A);fr.rotation.set(Math.sin(an)*1.1,0,-Math.cos(an)*1.1);group.add(fr)}})}else if(ez){[-11.5,11.5].forEach(c=>{cyl(201,250+c,13.5,14.4,2.3,2.3,M.stoneL,null,24);cyl(201,250+c,14.4,15,2.3,1.9,M.bronze,null,24)});[-11.5,11.5].forEach(c=>{cyl(201,250+c,15,31.5,1.7,1.5,M.bronze,I("העמודים","יחזקאל מ׳, מט; מלכים א ז, טו-כב","\"ועמודים אל האילים, אחד מפה ואחד מפה\". הגובה כמו יכין ובועז: 18 אמה, וכותרת של 5 אמות עם \"מעשה שושן\"."),24);cyl(201,250+c,31.5,36.5,1.8,2.6,M.gold,null,24)})}
  if(!RB){
  // altar
  const ai=I("המזבח","יחזקאל מ״ג, יג-יז; מלבי״ם שם","לפי המלבי״ם: החיק (היסוד) 32 × 32 וגובהו 2 אמות; העזרה התחתונה נכנסת אמה ורוחבה 30, וגבוהה 4; העזרה הגדולה נכנסת עוד אמה ורוחבה 28, ועוד 4 אמות עד ראש הקרנות — סך הכול 10 אמות. ההראל הוא החלק העליון של המזבח: 4 אמות גובה, עם הקרנות. האריאל הוא מקום המערכה, שעליו בוערת האש: 24 × 24 אמה (12 אמות מהאמצע לכל צד), כי מורידים מסביב את מקום הקרנות ואת המקום שהכהנים הולכים בו. המלבי״ם הולך כאן לפי מסכת מידות. הכבש בדרום (\"ומעלתהו פנות קדים\" — העולה פונה ימינה, למזרח). האש דולקת תמיד, ועמוד העשן עולה ישר (אבות ה, ה).");
  const aY=I("החיק — היסוד","יחזקאל מ״ג, יג-יד; מלבי״ם שם; מידות ג, א","📜 \"וחיק האמה ואמה רחב\" — השלב התחתון של המזבח. ⚖️ לפי המלבי״ם זה היסוד: 32 × 32 וגובהו 2 אמות. על היסוד שופכים את שירי הדם.");
  const aS=I("העזרה הקטנה — הסובב","יחזקאל מ״ג, יד; מלבי״ם שם; מידות ג, א","📜 \"ומחיק הארץ עד העזרה התחתונה שתים אמות, ורחב אמה\". ⚖️ לפי המלבי״ם, בשלב הזה נמצא הסובב — מדף ברוחב אמה שהכהנים הולכים עליו מסביב למזבח, כדי לתת את הדם על הקרנות. חוט הסיקרא חוגר את המזבח באמצע.");
  [[32,7.5,9.5,aY],[30,9.5,13.5,aS],[28,13.5,16.5,ai]].forEach(t=>box(250-t[0]/2,250-t[0]/2,250+t[0]/2,250+t[0]/2,t[1],t[2],M.altarS,t[3],{tile:3.2}));
  [[236,236],[263,236],[236,263],[263,263]].forEach(c=>box(c[0],c[1],c[0]+1,c[1]+1,16.5,17.5,M.altarS,I("הקרנות","יחזקאל מ״ג, טו; מידות ג, א","📜 \"ומהאראיל ולמעלה הקרנות ארבע\". ⚖️ אמה על אמה, ועליהן נותנים את דם החטאת באצבע."),{tile:3.2}));
  (function(){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(32*A,0);sh.lineTo(0,9*A);sh.closePath();
    const g=new THREE.ExtrudeGeometry(sh,{depth:16*A,bevelEnabled:false});g.rotateY(-Math.PI/2);
    const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/3.2,uv.getY(i)/3.2);
    const m=new THREE.Mesh(g,M.altarS);const p=W(258,264.25);m.position.set(p[0],7.5*A,p[1]);m.castShadow=true;m.receiveShadow=true;
    m.userData=I("הכבש","מידות ג, ג; רמב״ם, הלכות בית הבחירה ב, יג-יד; זבחים סב ע״ב","הכבש מגיע עד גובה מקום המערכה, ופורח מעל השלבים התחתונים של המזבח, אבל מופרד ממנו ברווח דק — \"כחוט השערה\" — ולכן את האיברים זורקים אל המערכה. בצד המערבי של הכבש חלון של אמה על אמה, \"רבובה\", ששם שמו חטאות העוף שנפסלו. נותנים מלח על הכבש שהכהנים לא יחליקו (עירובין קד ע״א). המזבח והכבש בנויים מאבנים שלמות שלא נגע בהן ברזל, ומסוידים פעמיים בשנה — לכן הם חלקים ולבנים ולא אבני גזית (רמב״ם, הלכות בית הבחירה א, יד-טז). רמפה מדרום למזבח, באורך 32 אמה וברוחב 16. אין מדרגות למזבח, כי \"ולא תעלה במעלות על מזבחי\" (שמות כ, כג). \"ומעלתהו פנות קדים\" — העולה בכבש פונה ימינה, למזרח.");cPick.push(m);group.add(m)})();
  {const rv=I("הרבובה","רמב״ם, הלכות בית הבחירה ב, יד; מידות ג, ג","חלון של אמה על אמה בצד המערבי של הכבש, ששם הניחו חטאות העוף שנפסלו עד שיתעפשו, ואז שורפים אותן.");box(241.92,269,242.04,270,9,10,M.dark,rv,{cast:false,noCol:true})}
  // stage 5: the two wood piles (Tamid 2:4-5; Yoma 4:6): the great pile in the east, and the second pile for the incense coals
  // in the south-west corner, four amot to the north; the tapuach — the heap of ash — in the middle (Tamid 2:2)
  const fr=rng(55),logG=new THREE.CylinderGeometry(0.16*A,0.18*A,1,7);logG.rotateZ(Math.PI/2);
  const pile=(cu,cv,len,n,layers,y,info)=>{for(let l=0;l<layers;l++)for(let k=0;k<n;k++){const m=new THREE.Mesh(logG,M.wood),off=(k-(n-1)/2)*(len/n),q=l%2?W(cu+off,cv):W(cu,cv+off);m.scale.x=(len*(0.85+fr()*0.2))*A;m.position.set(q[0],(y+0.17+l*0.32)*A,q[1]);m.rotation.y=(l%2?Math.PI/2:0)+(fr()-0.5)*0.12;m.castShadow=true;if(info){m.userData=info;cPick.push(m)}group.add(m)}};
  const mg=I("המערכה הגדולה","תמיד ב, ג-ד; יומא ד, ו; ויקרא ו, ה","⚖️ \"והאש על המזבח תוקד בו לא תכבה\". המערכה הגדולה במזרח המזבח, ועליה מקריבים את הקרבנות. כל בוקר מסדרים אותה מחדש, בעצי תאנה, אגוז ועץ שמן. 💡 גודל הערימה בהערכה.");
  const m2=I("מערכה שנייה של קטורת","תמיד ב, ה; יומא ד, ו","⚖️ מערכה קטנה בקרן הדרומית־מערבית, \"משוך מן הקרן כלפי צפון ארבע אמות\". ממנה לוקחים גחלים למזבח הזהב, שבו מקטירים את הקטורת. (ביום הכיפורים יש עוד מערכה רביעית.)");
  const tp=I("תפוח האפר","תמיד ב, ב; ויקרא ו, ג","⚖️ באמצע המזבח צוברים את האפר, \"וְהָיָה תפוח באמצע המזבח, פעמים עליו כשלש מאות כור\". כל בוקר כהן חותה מעט אפר (תרומת הדשן) ונותן אותו במזרח הכבש.");
  pile(256.5,250,7,7,4,16.5,mg);pile(241,255,3,4,2,16.5,m2);{const m3=I("מערכה שלישית — לקיום האש","יומא מה ע״א; רמב״ם, הלכות תמידין ומוספין ב, ד-ה","📜 בכל יום שלוש מערכות על המזבח: הגדולה, של הקטורת, ושלישית \"לקיום האש\", שלא תכבה האש לעולם. 💡 המקום כאן הצעה.");pile(241,244,3,3,2,16.5,m3);box(240,243,242,245,16.5,16.55,M.ember,null,{noCol:true,cast:false})}
  {const c=new THREE.Mesh(new THREE.ConeGeometry(3.2*A,1.8*A,18),M.ash);const q=W(248,250);c.position.set(q[0],(16.5+0.9)*A,q[1]);c.scale.z=0.8;c.userData=tp;cPick.push(c);group.add(c);CL("תפוח",248,250,20.5,tp)}
  box(253,246.5,260,253.5,16.5,16.55,M.ember,null,{noCol:true,cast:false});box(240,253.5,242,256.5,16.5,16.55,M.ember,null,{noCol:true,cast:false});
  const fp=W(256.5,250);
  {const q2=W(241,255);group.add(makePFX(SMALL?120:190,true,[{x:fp[0],y:17.4*A,z:fp[1],rx:2.9*A,rz:2.9*A,w:6,s:1.15},{x:q2[0],y:17*A,z:q2[1],rx:1*A,w:1,s:0.5},{x:W(241,244)[0],y:17*A,z:W(241,244)[1],rx:0.9*A,w:1,s:0.45}],{seed:51}));
    group.add(makePFX(SMALL?70:110,false,[{x:fp[0],y:19.5*A,z:fp[1],rx:1.3*A,s:1.6}],{seed:52,vy:2.6,ttl:13,grow:4.5,drift:0}))}
  {const q=W(247,268),d=I("מקום הדשן","תמיד א, ד; ויקרא ו, ג","⚖️ את תרומת הדשן נותנים על הרצפה, במזרח הכבש, \"ושמו אצל המזבח\". שם היא נבלעת במקומה.");const c=new THREE.Mesh(new THREE.ConeGeometry(0.7*A,0.35*A,12),M.ash);const p=W(259.5,272);c.position.set(p[0],(7.5+0.17)*A,p[1]);c.userData=d;cPick.push(c);group.add(c)}
  fireLight=new THREE.PointLight(0xff9a40,0.6,90,2);fireLight.position.set(fp[0],20*A,fp[1]);group.add(fireLight);
  // slaughter tables
  {const lw=I("הלשכה שמדיחים בה את העולה","יחזקאל מ׳, לח; מלבי״ם שם","📜 \"ולשכה ופתחה באילים השערים, שם ידיחו את העלה\" — לשכה שפתחה ליד אילי השער, ובה רוחצים את הקרבן לפני שמקריבים. ⚖️ לפי המלבי״ם היא בשער הצפוני הפנימי, שבו שוחטים. ⚖️ לפי רש״י (מ׳, לח) זו לשכת המדיחין. 💡 מידות הלשכה ומקומה המדויק (כאן ממזרח לאולם השער) בהערכה.");
    hroom(263,150,272,160,3.5,11,M.stoneL,lw,{side:"v0",c:266,nm:"הדחת העולה · לשכת המדיחין"});box(262.7,149.7,272.3,160.3,11,11.6,M.stone2,null);
    cyl(268.5,148.3,3.5,4.6,1.1,1.25,M.stone2,lw,16);cyl(268.5,148.3,4.45,4.62,0.95,0.95,M.water,null,16);CL("הדחת העולה · לשכת המדיחין",267.5,155,14,lw)}
  const tb=I("שולחנות השחיטה","יחזקאל מ׳, לט-מג","ארבעה שולחנות מכל צד של השער הצפוני, ועוד ארבעה שולחנות של אבן גזית לכלים. כאן שוחטים את העולה, החטאת והאשם.");
  [229,269].forEach(u=>{for(let k=0;k<4;k++)box(u,162+k*7,u+2,163.5+k*7,3.5,4.5,M.stoneL,tb,{noCol:true})});
  {const tg=I("שולחנות אבני גזית","יחזקאל מ׳, מב-מג","\"ושלחנות ארבעה לעולה אבני גזית, ארך אמה אחת וחצי ורחב אמה אחת וחצי וגבה אמה אחת\" — כ־80 × 80 ס״מ וגובה כ־50 ס״מ. עליהם מניחים את כלי השחיטה. \"והשפתים טפח אחד\" — ווים באורך טפח לתליית הבשר.");
    [231,235.5,263,267.5].forEach(u=>box(u,203,u+1.5,204.5,7.5,8.5,M.marble,tg,{noCol:true}))}
  }else{
  // ---- the altar per Middot 3:1-3 and Rambam 2:5-17 ----
  {const AU=238,AV=259,t6=1/6,ai=I("המזבח — לפי מסכת מידות והרמב״ם","מידות ג, א-ד; רמב״ם, הלכות בית הבחירה ב, ה-יז","32 × 32 אמה. יסוד גבוה אמה (של 5 טפחים) ונכנס אמה; סובב גבוה 5 אמות ונכנס אמה; ועוד 3 אמות עד מקום המערכה, 24 × 24 אחרי הקרנות ומקום הילוך הכהנים. הקרנות אמה על אמה וגובהן 5 טפחים — סך הכול 58 טפחים, כמעט 10 אמות. היסוד מהלך על כל הצפון וכל המערב, ובדרום ובמזרח רק אמה אחת — חסר בפינה הדרומית־מזרחית. בפינה הדרומית־מערבית שני נקבים (שיתין) שהדם יורד דרכם לנחל קדרון. חוט הסיקרא באמצע הגובה.");
    const y0=7.5,yY=y0+5*t6,yS=y0+35*t6,yH=y0+53*t6,yK=y0+58*t6;
    box(AU-15,AV-15,AU+15,AV+15,y0,yS,M.plaster,ai,{tile:1.6});box(AU-14,AV-14,AU+14,AV+14,yS,yH,M.plaster,ai,{tile:1.6});
    box(AU-16,AV-16,AU+16,AV-15,y0,yY,M.plaster,ai);box(AU-16,AV-15,AU-15,AV+16,y0,yY,M.plaster,ai);box(AU-15,AV+15,AU-14,AV+16,y0,yY,M.plaster,ai);box(AU+15,AV-15,AU+16,AV-14,y0,yY,M.plaster,ai);
    [[-14,-14],[13,-14],[-14,13],[13,13]].forEach(c=>box(AU+c[0],AV+c[1],AU+c[0]+1,AV+c[1]+1,yH,yK,M.plaster,ai));
    box(AU-15.03,AV-15.03,AU+15.03,AV+15.03,y0+29*t6-0.1,y0+29*t6+0.1,new THREE.MeshStandardMaterial({color:0x9c2a1c,roughness:0.8}),I("חוט הסיקרא","מידות ג, א","\"וחוט של סיקרא חוגרו באמצעו\" — 29 טפחים מהקרקע."),{cast:false,noCol:true});
    box(AU-15.2,AV+14.6,AU-14.6,AV+15.2,y0,y0+0.15,M.dark,I("השיתין","מידות ג, ב; רמב״ם, הלכות בית הבחירה ב, יא","שני נקבים דקים בקרן הדרומית־מערבית, שהדמים והנסכים יורדים בהם לאמה ויוצאים לנחל קדרון."),{cast:false,noCol:true});
    // ramp 32 x 16 on the south, up to the hearth, with the rivuvah on its west
    {const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(32*A,0);sh.lineTo(0,53*t6*A);sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:16*A,bevelEnabled:false});g.rotateY(-Math.PI/2);
      const m=new THREE.Mesh(g,M.plaster);const p=W(AU+8,AV+14.25);m.position.set(p[0],y0*A,p[1]);m.castShadow=true;m.receiveShadow=true;
      m.userData=I("הכבש","מידות ג, ג; רמב״ם, הלכות בית הבחירה ב, יג-יד","32 אמה אורך ו־16 רוחב, בדרום המזבח. מגיע עד גובה מקום המערכה (9 אמות פחות שישית), ופורח מעל היסוד והסובב, ומופרש מן המזבח כחוט השערה. בצד המערבי חלון של אמה על אמה — הרבובה. שני כבשים קטנים יוצאים ממנו: ליסוד (במערב) ולסובב.");cPick.push(m);group.add(m);
      box(AU-8.08,AV+20,AU-7.95,AV+21,y0+1.5,y0+2.5,M.dark,null,{cast:false,noCol:true});
      box(AU-12,AV+16,AU-8,AV+22,y0,yY,M.plaster,null,{noCol:true});box(AU+8,AV+16,AU+12,AV+22,y0,yS-1,M.plaster,null,{noCol:true})}
    box(AU-4,AV-4,AU+4,AV+4,yH,yH+0.8,M.wood,null,{noCol:true});
    const fp=W(AU,AV),fr=rng(55);
    for(let k=0;k<7;k++){const f=new THREE.Mesh(new THREE.ConeGeometry((1.4+fr())*A,(3+fr()*3)*A,8),k%2?M.fire:M.fire2);f.position.set(fp[0]+(fr()-0.5)*4*A,(yH+0.8)*A+1.2,fp[1]+(fr()-0.5)*4*A);f.userData.base=f.position.y;f.userData.ph=fr()*6;group.add(f);flames.push(f)}
    fireLight=new THREE.PointLight(0xff9a40,0.6,90,2);fireLight.position.set(fp[0],(yH+3)*A,fp[1]);group.add(fireLight);
    smoke=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),M.smoke,40);smokeData=[];for(let k=0;k<40;k++)smokeData.push({t:k/40,seed:fr()});smoke.userData.base=[fp[0],(yH+1)*A,fp[1]];group.add(smoke)}
  }
  const SG=new THREE.Group(),colS=COL.length,grpS=group,sgL=cLabels.length;if(RB){group.add(SG);group=SG}
  if(!RB){const sg=I("לשכת המשוררים ולשכת שומרי משמרת הבית","יחזקאל מ׳, מד-מה; מלבי״ם שם","\"ומחוצה לשער הפנימי לשכות שרים בחצר הפנימית, אשר אל כתף שער הצפון ופניהם דרך הדרום\" — לשכה ליד השער הצפוני, פונה לדרום, לכהנים \"שמרי משמרת הבית\". הגובה בהערכה.");
    const sp=I("לשכת שומרי משמרת המזבח","יחזקאל מ׳, מד-מו; מלבי״ם שם","לשכה ליד השער הדרומי, פונה לצפון — \"לכהנים שמרי משמרת המזבח, הם בני צדוק\". הגובה בהערכה.");
    if(GATE==="high"&&!RB&&!COMB){const sl=I("לשכת הלויים המשוררים","יחזקאל מ׳, מד; רש״י שם; משכני עליון לרמח״ל","📜 \"ומחוצה לשער הפנימי לשכות שרים בחצר הפנימית, אשר אל כתף שער הצפון ופניהם דרך הדרום\" (מ׳, מד). ⚖️ לפי רש״י והרמח״ל זו לשכת הלויים המשוררים, בכתף המזרחית של השער הצפוני הפנימי, והיא מחולקת לשתיים. הפתחים פונים לדרום. 💡 המידות והגובה בהערכה."),pl=I("לשכת הכהנים שבכתף שער המזרח","יחזקאל מ׳, מד-מו; משכני עליון לרמח״ל","📜 \"אחד אל כתף שער הקדים, פני דרך הצפן\" (מ׳, מד). ⚖️ לפי הרמח״ל זו לשכה לכהנים, בכתף הדרומית של השער המזרחי הפנימי, ופתחה לצפון. משם לובשים הכהנים את בגדיהם. 💡 המידות והגובה בהערכה.");hroom(266,200,277,208,7.5,15,M.stoneL,sl,{side:"v1",c:271,w:2.4,nm:"לשכת המשוררים"});hroom(277,200,288,208,7.5,15,M.stoneL,sl,{side:"v1",c:282,w:2.4});box(265.7,199.7,288.3,208.3,15,15.6,M.stone2,null);hroom(278,266,296,274,7.5,15,M.stoneL,pl,{side:"v0",c:287,w:2.4,nm:"לשכת הכהנים"});box(277.7,265.7,296.3,274.3,15,15.6,M.stone2,null);CL("לשכת המשוררים",277,204,18,sl,false);CL("לשכת הכהנים",287,270,18,pl,false)}else{
    hroom(212,200,234,208,7.5,15,M.stoneL,sg,{side:"v1",c:223,nm:"לשכת המשוררים ולשכת שומרי משמרת הבית"});box(211.7,199.7,234.3,208.3,15,15.6,M.stone2,null);
    hroom(212,292,234,300,7.5,15,M.stoneL,sp,{side:"v0",c:223,nm:"לשכת שומרי משמרת המזבח"});box(211.7,291.7,234.3,300.3,15,15.6,M.stone2,null);
    }
    const tv=I("השולחנות שבאולם השער","יחזקאל מ׳, לט; מלבי״ם שם","\"ובאולם השער שנים שלחנות מפו ושנים שלחנות מפה, לשחוט אליהם העולה והחטאת והאשם\" — ארבעה שולחנות של אבן בתוך אולם השער הצפוני הפנימי. המידות לא מפורשות.");
    [[245.3,153.2],[245.3,156.4],[253.5,153.2],[253.5,156.4]].forEach(c=>box(c[0],c[1],c[0]+1.2,c[1]+2,7.5,8.6,M.marble,tv,{noCol:true}))}
  // ---- stage 7: the Sanhedrin and the courts of 23 (Sanhedrin 11:2; Middot 5:4) ----
  {let MIR=false;const SEAT=new Map(),STAND=new Map(),add=(mp,info,p)=>{if(MIR){p.a=Math.PI-p.a;p.v=500-p.v}if(!mp.has(info))mp.set(info,[]);mp.get(info).push(p)};
    const face=(u,v,fu,fv)=>Math.atan2(fu-u,fv-v);
    // a half circle of n judges around (cu,cv); dir -1 puts the middle seat to the north, +1 to the south
    const semi=(cu,cv,R,n,y,dir,info,col)=>{for(let k=0;k<n;k++){const th=Math.PI*(k+0.5)/n,u=cu-R*Math.cos(th),v=cv+dir*R*Math.sin(th);add(SEAT,info,{u,v,y,a:face(u,v,cu,cv),c:col(k)})}};
    const rows=(u0,u1,n,vs,y,fv,info)=>vs.forEach((v,ri)=>{for(let k=0;k<n;k++){const u=u0+(u1-u0)*k/(n-1);add(SEAT,info,{u,v,y,a:face(0,v,0,fv),c:[0xb9ab90,0xa89a80,0xc4b89f,0x9d9384][(k+ri)%4]})}});
    const JC=k=>[0xf3efe4,0xebe6d8,0xf6f3ea][k%3];
    // ---- Lishkat HaGazit (built as if in the north, then mirrored to the south side: v -> 500-v) ----
    const g7c=COL.length,g7l=cLabels.length,g7g=group;if(RB){const G7=new THREE.Group();G7.position.set(-40*A,0,8.5*A);group.add(G7);group=G7}
    const W0=W;W=(u,v)=>W0(u,500-v);MIR=true;
    const lg=I("לשכת הגזית","מידות ה, ד; סנהדרין יא, ב; יומא כה ע״א; רמב״ם, הלכות בית הבחירה ה, יז","⚖️ כאן ישבה הסנהדרין הגדולה, 71 זקנים, ושם יצאה תורה לכל ישראל. 📜 \"חציה בקודש וחציה בחול, ולה שני פתחים — אחד לקודש ואחד לחול\" (מידות ה, ד). ⚖️ הדיינים יושבים בחצי של החול, כי אין ישיבה בעזרה אלא למלכי בית דוד (יומא כה ע״א). 📜 בנוסח המשנה שלפנינו היא אחת משלוש הלשכות שבדרום העזרה, עם לשכת העץ ולשכת הגולה (מידות ה, ד), ולכן היא כאן, בצד הדרומי של החצר הפנימית. ⚖️ יש נוסח אחר — \"שבצפון\" — שתוספות יום טוב מביא בשם הגמרא ביומא (יט ע״א), ויש משחזרים ששמים אותה בצפון העזרה (למשל הרב זלמן קורן — בצפון־מערב). במודל הלכנו לפי הנוסח שלפנינו. 📜 \"כמין בסילקי גדולה היתה\" (יומא כה ע״א) — אולם גדול כמו בזיליקה: אולם ארוך עם שורות עמודים. 📜 \"פייס במזרחה, וזקן יושב במערבה\" — הפיס בצד המזרחי, בחצי שבקודש, והזקן שמנהל אותו יושב במערב, בחצי שבחול; ומזה למדו שיש לה שני פתחים, אחד לקודש ואחד לחול (שם). 💡 יחזקאל לא מזכיר אותה, והמקום המדויק בצד הדרומי הוא הצעה. ⚖️ ארבעים שנה לפני החורבן גלתה הסנהדרין מלשכת הגזית לחנויות ולירושלים (עבודה זרה ח ע״ב), אבל בזמן שהמקדש עומד כתיקונו מקומה כאן. 💡 המידות (40 × 44 אמה), העמודים, החלונות והגג הפתוח עם קורות העץ (כדי שיראו את פנים האולם) הם הצעה.");
    const Y0=3.5,YT=20,wl=(a,b,c,d,y0)=>box(a,b,c,d,y0,YT,M.stoneL,lg);
    wl(280,166,297,167,Y0);wl(303,166,320,167,Y0);wl(297,166,303,167,12);          // north wall, door to the chol
    wl(280,209,291,210,Y0);wl(297,209,320,210,Y0);wl(291,209,297,210,14);          // south wall, door to the azarah
    wl(280,167,281,209,Y0);wl(319,167,320,209,Y0);
    [[279.6,165.6,320.4,167.4],[279.6,208.6,320.4,210.4],[279.6,167.4,281.4,208.6],[318.6,167.4,320.4,208.6]].forEach(r=>box(r[0],r[1],r[2],r[3],YT,YT+0.8,M.stone2,null,{noCol:true}));
    for(let u=283.5;u<318;u+=3)box(u-0.3,167,u+0.3,209,YT-0.9,YT,M.wood,null,{noCol:true});
    [[296.4,297],[303,303.6]].forEach(([a,b])=>box(a,165.9,b,167.1,Y0,12.6,M.stone2,null,{noCol:true}));box(296.4,165.9,303.6,167.1,12,12.8,M.stone2,null,{noCol:true});
    [[290.4,291],[297,297.6]].forEach(([a,b])=>box(a,208.9,b,210.1,7.5,14.6,M.stone2,null,{noCol:true}));box(290.4,208.9,297.6,210.1,14,14.8,M.stone2,null,{noCol:true});
    for(let k=0;k<7;k++){const u=284+k*5.3;if(Math.abs(u-300)>4)box(u-0.6,165.94,u+0.6,166,13.5,17,M.win,null,{cast:false,noCol:true})}
    for(let k=0;k<7;k++){const v=171+k*5.8;box(279.94,v-0.6,280,v+0.6,13.5,17,M.win,null,{cast:false,noCol:true});box(320,v-0.6,320.06,v+0.6,13.5,17,M.win,null,{cast:false,noCol:true})}
    box(281,167,319,199.6,3.5,3.56,M.marble,lg,{cast:false,noCol:true,tile:4});
    [170,175,180].forEach(v=>[282.4,317.6].forEach(u=>{cyl(u,v,3.56,YT-1.6,0.42,0.42,M.marble,lg,12);box(u-0.6,v-0.6,u+0.6,v+0.6,YT-1.6,YT-0.9,M.stoneL,null,{noCol:true,cast:false})}));
    [285.5,291,309,314.5].forEach(u=>{cyl(u,168.4,3.56,YT-1.6,0.42,0.42,M.marble,lg,12);box(u-0.6,167.8,u+0.6,169,YT-1.6,YT-0.9,M.stoneL,null,{noCol:true,cast:false})});
    box(281.8,167.8,318.2,169,YT-0.9,YT-0.5,M.stoneL,null,{noCol:true,cast:false});[281.8,317].forEach(u=>box(u,169,u+1.2,181,YT-0.9,YT-0.5,M.stoneL,null,{noCol:true,cast:false}));
    box(281,200,320,210,3.5,7.5,M.pave,null,{cast:false,tile:9,col:true});box(281,200.4,319,209,7.5,7.56,M.marble,null,{cast:false,noCol:true,tile:4});
    const kd=I("החצי שבקודש — מקום הפיס","יומא כה ע״א; תמיד ב, ה; ה, א","⚖️ החצי הצפוני של הלשכה נמצא בתוך העזרה, ופתחו לעזרה. 📜 \"פייס במזרחה\" (יומא כה ע״א) — הפיס בצד המזרחי של הלשכה. כאן הכהנים עושים את הפיס — ההגרלה מי יעבוד בכל עבודה (\"פייס בלשכת הגזית\", יומא כה ע״א), ולכאן הם באים לקרוא את שמע בבוקר (תמיד ה, א). 💡 קיר נמוך מפריד בין החצי של החול, שרצפתו נמוכה, לבין החצי של הקודש, שבגובה רצפת העזרה. 💡 הכהנים עומדים כאן במעגל, כמו בשעת הפיס.");
    box(281,199.6,319,200.4,3.5,8.6,M.stone2,kd);
    for(let k=0;k<13;k++){const an=k/13*Math.PI*2,u=310+Math.cos(an)*3,v=204.8+Math.sin(an)*2.6;add(STAND,kd,{u,v,y:7.56,a:face(u,v,310,204.8),c:0xfaf8f2})}
    {const zk=I("הזקן שיושב במערב","יומא כה ע״א; תמיד א, ב","📜 \"זקן יושב במערבה\" — אחד מזקני הסנהדרין יושב בצד המערבי של הלשכה, בחצי שבחול, ומשגיח על הפיס. ⚖️ הוא יושב בחול, כי אין ישיבה בעזרה. 💡 מקום הכיסא המדויק הוא הצעה.");add(SEAT,zk,{u:283.6,v:198,y:3.56,a:face(283.6,198,310,204.8),c:0xe9dcb4});CL("הזקן",283.6,198,7,zk,true)}
    CL("לשכת הגזית",300,188,24,lg,false);cLabels[cLabels.length-1].pr=1;CL("מקום הפיס",310,205,12,kd,true);
    // ---- the 71 ----
    const sn=I("הסנהדרין הגדולה — 71 זקנים","סנהדרין א, ו; ד, ג-ד; רמב״ם, הלכות סנהדרין א, ג","📜 \"סנהדרין היתה כחצי גורן עגולה, כדי שיהו רואין זה את זה\" (סנהדרין ד, ג). ⚖️ 71 דיינים. באמצע יושב הנשיא (הראש), ואב בית הדין יושב מימינו (רמב״ם, הלכות סנהדרין א, ג). 📜 שני סופרי הדיינים עומדים לפניהם, אחד מימין ואחד משמאל, וכותבים את דברי המזכים ואת דברי המחייבים. 📜 לפניהם יושבות שלוש שורות של תלמידי חכמים, \"וכל אחד ואחד מכיר את מקומו\" (ד, ד). 💡 הבגדים, הצבעים והכיסאות הם הצעה.");
    const CU=300,CV=190,RS=17.4;semi(CU,CV,RS,71,3.56,-1,sn,k=>k===35?0xe9dcb4:k===34?0xe4d9be:JC(k));
    // the Nasi and the Av Beit Din sit a little higher
    {const a=Math.PI*35.5/71,b=Math.PI*34.5/71;[[a,0.4],[b,0.25]].forEach(([th,h])=>{const u=CU-RS*Math.cos(th),v=CV-RS*Math.sin(th);box(u-0.8,v-0.8,u+0.8,v+0.8,3.56,3.56+h,M.stoneL,sn,{noCol:true,cast:false})});const ss=SEAT.get(sn);ss[35].y+=0.4;ss[34].y+=0.25}
    [-1,1].forEach(sd=>{const u=CU+sd*(RS-2),v=CV+0.5;add(STAND,sn,{u,v,y:3.56,a:face(u,v,CU,CV-6),c:0xcdb98f})});
    const sr=I("שלוש שורות של תלמידי חכמים","סנהדרין ד, ד; רמב״ם, הלכות סנהדרין א, ג","📜 \"ושלש שורות של תלמידי חכמים יושבין לפניהם\". ⚖️ כשצריך להוסיף דיין, ממנים את הראשון שבשורה הראשונה, והאחרים עולים מקום אחד. 💡 23 בכל שורה (כמו בבית דין קטן) — הצעה.");
    rows(288,312,23,[192.5,194.5,196.5],3.56,CV-RS,sr);
    CL("הנשיא",CU,CV-RS,6.8,sn,true);CL("אב בית הדין",CU-RS*Math.cos(Math.PI*34.5/71)-2.5,CV-RS*Math.sin(Math.PI*34.5/71)+0.6,6.3,sn,true);
    W=W0;MIR=false;
    if(RB){group=g7g;for(let i=g7c;i<COL.length;i++){COL[i].x0-=40*A;COL[i].x1-=40*A;COL[i].z0+=8.5*A;COL[i].z1+=8.5*A}for(let i=g7l;i<cLabels.length;i++){cLabels[i].v.x-=40*A;cLabels[i].v.z+=8.5*A}[SEAT,STAND].forEach(m=>m.forEach(a=>a.forEach(p=>{p.u-=40;p.v+=8.5})))}
    // RB plan: what stands on Har HaBayit goes down to its floor (the house group is raised 8.5 amot)
    const Y3=RB?0.35:3.5,lowC=COL.length,lowL=cLabels.length,lowG=group,lowS=new Map();[SEAT,STAND].forEach(m=>m.forEach(a=>lowS.set(a,a.length)));
    if(RB){const LG=new THREE.Group();LG.position.y=-8.5*A;group.add(LG);group=LG}
    // ---- two courts of 23 ----
    const court=(u0,v0,u1,v1,dir,y,info,title)=>{const cu=(u0+u1)/2,yt=y+12,dv=dir<0?v1:v0,dm=cu;
      box(u0,v0,u1,v0+0.8,y,yt,M.stoneL,info,{});box(u0,v1-0.8,u1,v1,y,yt,M.stoneL,info);box(u0,v0+0.8,u0+0.8,v1-0.8,y,yt,M.stoneL,info);box(u1-0.8,v0+0.8,u1,v1-0.8,y,yt,M.stoneL,info);
      // the door in the wall facing away from the judges
      COL.pop();COL.pop();COL.pop();COL.pop();
      const dw=0.8,ds=dir<0?v1-dw:v0;
      [[u0,v0,u1,v0+dw],[u0,v1-dw,u1,v1]].forEach((r,i)=>{const isDoor=(dir<0&&i===1)||(dir>0&&i===0);if(!isDoor){COL.push(colOf(r[0],r[1],r[2],r[3],y,yt));return}
        COL.push(colOf(r[0],r[1],dm-2.5,r[3],y,yt));COL.push(colOf(dm+2.5,r[1],r[2],r[3],y,yt))});
      COL.push(colOf(u0,v0,u0+0.8,v1,y,yt));COL.push(colOf(u1-0.8,v0,u1,v1,y,yt));
      [[u0-0.3,v0-0.3,u1+0.3,v0+1.1],[u0-0.3,v1-1.1,u1+0.3,v1+0.3],[u0-0.3,v0+1.1,u0+1.1,v1-1.1],[u1-1.1,v0+1.1,u1+0.3,v1-1.1]].forEach(r=>box(r[0],r[1],r[2],r[3],yt,yt+0.6,M.stone2,null,{noCol:true}));
      for(let u=u0+2.5;u<u1-1;u+=2.5)box(u-0.25,v0+0.8,u+0.25,v1-0.8,yt-0.7,yt,M.wood,null,{noCol:true});
      box(cu-2.5,ds-0.05,cu+2.5,ds+dw+0.05,y,y+7,M.dark,null,{cast:false,noCol:true});box(cu-3,ds-0.15,cu+3,ds+dw+0.15,y+7,y+7.8,M.stone2,null,{noCol:true});
      box(u0+0.8,v0+0.8,u1-0.8,v1-0.8,y,y+0.06,M.marble,info,{cast:false,noCol:true,tile:4});
      const cv=dir<0?v0+0.8+7.6:v1-0.8-7.6;semi(cu,cv,7,23,y+0.06,dir,info,JC);
      [-1,1].forEach(sd=>{const u=cu+sd*5.4,v=cv-dir*0.6;add(STAND,info,{u,v,y:y+0.06,a:face(u,v,cu,cv+dir*4),c:0xcdb98f})});
      rows(cu-6,cu+6,8,[cv-dir*2,cv-dir*3.6,cv-dir*5.2],y+0.06,cv+dir*7,info);
      CL(title,cu,(v0+v1)/2,yt+3,info,false);cLabels[cLabels.length-1].pr=1};
    const colOf=(a,b,c,d,y0,y1)=>{const p0=W(a,b),p1=W(c,d);return{x0:Math.min(p0[0],p1[0]),x1:Math.max(p0[0],p1[0]),z0:Math.min(p0[1],p1[1]),z1:Math.max(p0[1],p1[1]),y0:y0*A,y1:y1*A}};
    court(264,126,286,146,-1,Y3,I("בית דין של 23 — בפתח העזרה","סנהדרין יא, ב; רמב״ם, הלכות סנהדרין א, ג","📜 \"שלשה בתי דינין היו שם: אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית\". ⚖️ מי שיש לו שאלה בא קודם לבית הדין שבפתח הר הבית, אחר כך לזה שבפתח העזרה, ואחר כך ללשכת הגזית. ⚖️ 23 דיינים בחצי עיגול, שני סופרים ושלוש שורות תלמידים. 💡 הבניין, המידות והמקום ליד השער הפנימי הצפוני הם הצעה."),"בית דין — פתח העזרה");
    court(266,RB?528:428,288,RB?548:448,1,Y3,I("בית דין של 23 — בפתח הר הבית","סנהדרין יא, ב; מידות ב, א; רמב״ם, הלכות סנהדרין א, ג","📜 \"אחד יושב על פתח הר הבית\". 💡 החומה החיצונה של יחזקאל, 500 על 500 אמה, היא כמו הר הבית שבמשנה (\"הר הבית היה חמש מאות אמה על חמש מאות אמה\", מידות ב, א), ולכן בית הדין יושב כאן, ליד השער החיצוני הדרומי. 💡 הבניין והמידות הם הצעה."),"בית דין — פתח הר הבית");
    // ==== stage 8: things that would naturally be there ====
    const FSEAT=new Map(),FSTAND=new Map(),GY=(u,v)=>TY(X0+(u-(RB?12:0))*A,N0-(v+(RB?9:0))*A)/A,gmin=(u0,v0,u1,v1)=>Math.min(GY(u0,v0),GY(u1,v0),GY(u0,v1),GY(u1,v1),GY((u0+u1)/2,(v0+v1)/2))-0.3;
    const glassM=new THREE.MeshStandardMaterial({color:0x9db8c6,metalness:0.35,roughness:0.12,envMapIntensity:1.1}),steelM=M.stone2,
      clothM=new THREE.MeshStandardMaterial({color:0xf3eee2,roughness:0.95,side:THREE.DoubleSide}),greenM=new THREE.MeshStandardMaterial({color:0x2f9a5a,roughness:0.8}),whiteM=M.stoneL,
      redM=new THREE.MeshStandardMaterial({color:0xd0202a,roughness:0.5,side:THREE.DoubleSide}),wickM=new THREE.MeshStandardMaterial({color:0xb48c50,roughness:0.95}),oxM=new THREE.MeshStandardMaterial({color:0x7a4a2c,roughness:0.9});
    const LV=0xe6dfc9,PR=0xfaf8f2,around=(cu,cv,R,n,y,info,mp,col,a0,a1)=>{for(let k=0;k<n;k++){const th=a0+(a1-a0)*(k+0.5)/n,u=cu+R*Math.cos(th),v=cv+R*Math.sin(th);add(mp||SEAT,info,{u,v,y,a:face(u,v,cu,cv),c:col?col(k):[0xb9ab90,0xa89a80,0xc4b89f,0x9d9384][k%4]})}};
    // -- the beit midrash under the stoa (Pesachim 26a) --
    if(!RB){const st=I("בית המדרש שבסטיו","פסחים כו ע״א; סנהדרין יא, ב","⚖️ \"מלמד שהיה רבן יוחנן בן זכאי יושב בצלו של היכל ודורש כל היום כולו\" (פסחים כו ע״א). בבית שני היה בהר הבית סטיו — אולם עמודים מקורה — ושם ישבו ללמוד. 📜 המשנה מזכירה את \"בית המדרש שבהר הבית\" (סנהדרין יא, ב). 💡 ביחזקאל אין סטיו. כאן הוא לאורך החומה המערבית של החצר החיצונה, ויושבות בו חבורות של לומדים.");
      for(let v=72;v<=178;v+=6)cyl(17.4,v,3.5,15,0.55,0.55,M.marble,st,14);box(6,70,18.4,180,15,15.9,M.stone2,st,{noCol:true});box(17,70,18.6,180,14.2,15,M.stoneL,null,{noCol:true});
      box(6,70,17.6,180,3.5,3.58,M.marble,null,{cast:false,noCol:true,tile:4});
      [92,125,158].forEach((vc,i)=>{add(SEAT,st,{u:8.5,v:vc,y:3.58,a:face(8.5,vc,14,vc),c:0xe9e2cf});around(8.5,vc,3.4,7+i,3.58,st,SEAT,null,-Math.PI*0.42,Math.PI*0.42)});
      CL("בית המדרש",12,125,19,st,true)}
    // -- the money changers (Shekalim 1:3) --
    {const sh=I("השולחנים — מחליפי הכסף","שקלים א, ג; ב, א","📜 \"בעשרים וחמשה בו ישבו במקדש\" — בחודש אדר ישבו כאן שולחנים, מחליפי כסף, וגבו את מחצית השקל. ⚖️ מי שאין לו מטבע של חצי שקל מחליף אצלם ומשלם קלבון, תוספת קטנה. 💡 היום אפשר להוסיף על השולחנות עמדות תשלום בכרטיס.");
      for(let k=0;k<6;k++){const u=206+k*5;box(u,58,u+3.2,59.6,Y3,Y3+1.6,M.wood,sh,{noCol:true});box(u+2.3,58.5,u+2.8,59,Y3+1.6,Y3+2.05,M.dark,sh,{noCol:true,cast:false});cyl(u+0.8,58.8,Y3+1.6,Y3+1.8,0.18,0.18,M.gold,null,10);cyl(u+1.3,58.9,Y3+1.6,Y3+1.9,0.18,0.18,M.white,null,10);
        add(SEAT,sh,{u:u+1.6,v:57,y:Y3,a:0,c:[0xa58f6e,0x8e8a7c,0xb7a181][k%3]});add(STAND,sh,{u:u+1.6,v:61.4,y:Y3,a:Math.PI,c:[0xc2b59a,0x9ea6ad,0xb9a48c][k%3]})}
      CL("השולחנים",221,59,9,sh,true)}
    // -- the passage down to the mikveh (Tamid 1:1) --
    if(!RB){const tb=I("המסיבה לבית הטבילה","תמיד א, א; מידות א, ט","⚖️ כהן שנטמא בלילה יוצא והולך במסיבה ההולכת תחת הבירה, והנרות דולקים מכאן ומכאן, עד שמגיע לבית הטבילה. ושם בית הכסא של כבוד ומדורה. 📜 \"וזה היה כבודו: מצאו נעול, יודע שיש שם אדם\". 💡 כאן הכניסה היא בית קטן ובו מדרגות היורדות מתחת לקרקע, ליד השער הפנימי הצפוני. במצב הרמב״ם הוא צמוד לבית המוקד, כמו במשנה.");
      hroom(228,172,234.5,180,3.5,9.5,M.stoneL,tb,{side:"v0",c:231.25,w:2.6,h:4,nm:"בית הטבילה"});box(227.7,171.7,234.8,180.3,9.5,10.1,M.stone2,null);box(229.2,175.5,233.3,179,3.5,3.56,M.dark,tb,{cast:false,noCol:true});
      CL("בית הטבילה",231,176,13,tb,true)}
    // -- the 24 watches (Middot 1:1) --
    if(!RB){const gd=I("שומרי המשמרת — 24 מקומות","מידות א, א; רמב״ם, הלכות בית הבחירה ח, א-ה","📜 \"בשלשה מקומות הכהנים שומרים בבית המקדש... והלוים בעשרים ואחד מקום\". ⚖️ הכהנים: בבית אבטינס, בבית הניצוץ ובבית המוקד. הלויים: חמשה על שערי הר הבית, ארבעה על ארבע פינותיו מתוכו, חמשה על שערי העזרה, ארבעה על פינותיה מבחוץ, אחד בלשכת הקרבן, אחד בלשכת הפרוכת ואחד אחורי בית הכפורת. ⚖️ השמירה היא כבוד לבית, לא מפחד (רמב״ם, הלכות בית הבחירה ח, א). 💡 ביחזקאל יש רק שלושה שערים בכל חצר, ולכן בחלק מהשערים עומדים שני שומרים, אחד מכל צד. המקומות המדויקים הם הצעה.");
      [[244,54],[256,54],[244,446],[256,446],[446,244],[12,40],[484,40],[12,460],[484,460],[244,146],[256,146],[244,354],[256,354],[354,244],[204,196],[323,196],[204,304],[323,304],[232,357],[268,357]].forEach(([u,v])=>add(STAND,gd,{u,v,y:3.5,a:face(u,v,250,250),c:LV}));
      add(STAND,gd,{u:90,v:250,y:7.5,a:face(90,250,250,250),c:LV});[[230,150],[270,146],[226,190]].forEach(([u,v])=>add(STAND,gd,{u,v,y:3.5,a:face(u,v,250,250),c:PR}))}
    // -- Kevesh HaParah: arches on arches to the Mount of Olives (Parah 3:6) --
    {const kp=I("כבש הפרה","פרה ג, ו; מידות ב, ד","📜 \"וכבש היו עושין מהר הבית להר המשחה, כיפין על גבי כיפין, וכיפה כנגד האום\" — גשר על קשתות מעל קשתות, כדי שיהיה חלל תחתיו ולא תהיה בו טומאת קבר. עליו הכהן מוציא את הפרה האדומה להר הזיתים. 💡 השער המזרחי ביחזקאל סגור לעולם (מ״ד, ב), ולכן הכהן יוצא בפשפש קטן שבצד השער, אל רחבה שלפני השער, וממנה יוצא הגשר. ⚖️ \"כל הכתלים שהיו שם היו גבוהים, חוץ מכותל המזרחי, שהכהן השורף את הפרה עומד בראש הר המשחה ומתכוון ורואה בפתחו של היכל\" (מידות ב, ד). בהדמיה בודקים שמסוף הכבש רואים את פתח ההיכל. הרוחב, השיפוע וגודל הקשתות הם הצעה.");
      if(RB)kp.t=kp.t.replace(/💡 השער המזרחי ביחזקאל[^⚖]*/,"📜 לפי מסכת מידות הכבש יוצא בשער המזרחי עצמו: \"שער המזרחי... שבו כהן גדול השורף את הפרה ופרה וכל מסעדיה יוצאין להר המשחה\" (מידות א, ג). ");
      // east-gate cleanup: the wicket moves from v=220 (where the last east chamber, v 198-232, blocked it from inside) to the free strip between that chamber and the gate (v 232-237.5)
      const KU=RB?541:500,BV=RB?241:234.75,BW=2.3,SL=0.03,yD=u=>Y3+(u-KU)*SL,P=[];for(let u=KU+2;u<1500;u+=20){P.push(u);if(GY(u,BV)>yD(u)-1.5)break}const ue=P[P.length-1];
      if(!RB){box(500,BV-1.55,500.1,BV+1.55,3.5,9,M.dark,kp,{noCol:true,cast:false});box(500,BV-2.6,501.2,BV+2.6,9,10.2,M.stoneL,null,{noCol:true});
      [-1,1].forEach(sd=>box(500,BV+sd*1.55-(sd>0?0:1.05),501.2,BV+sd*1.55+(sd>0?1.05:0),3.5,9,M.stone2,kp,{noCol:true}));
      // east-gate landing (user request): the closed gate and the open wicket both face one paved landing, and the bridge leaves from it
      {const li=I("הרחבה שלפני שער המזרח","מידות א, ג; פרה ג, ו; יחזקאל מד, ב","⚖️ \"שער המזרחי... שבו כהן גדול השורף את הפרה ופרה וכל מסעדיה יוצאין להר המשחה\" (מידות א, ג). 📜 \"השער הזה סגור יהיה\" (יחזקאל מד, ב). 💡 רחבה לפני השער: הדלתות הגדולות סגורות, הפשפש שבצד פתוח אליה, וממנה יוצא כבש הפרה. המידות הן הצעה.");
        box(501.2,231.5,510,263.5,2.6,3.5,M.stoneL,li,{noCol:true});box(509.6,237.1,510,263.5,3.5,5.2,M.stone2,null,{noCol:true});box(501.2,263.1,510,263.5,3.5,5.2,M.stone2,null,{noCol:true});box(501.2,231.5,510,231.9,3.5,5.2,M.stone2,null,{noCol:true});
        [247.5,262].forEach(v=>{const g=GY(509,v);box(508,v-1,510,v+1,g-1,2.6,M.stoneL,li,{noCol:true})})}
      {const pi=I("פשפש כבש הפרה","פרה ג, ו; יחזקאל מד, ב; מידות ד, ב","💡 פתח קטן בחומה המזרחית, צמוד לשער המזרח הסגור מצפון, בין השער ללשכה האחרונה. דרכו בלבד יוצא הכהן עם הפרה אל הכבש. 📜 שער המזרח עצמו נשאר סגור (יחזקאל מד, ב). ⚖️ \"פשפש\" הוא פתח קטן בצד שער גדול, כמו שני הפשפשים של שער ההיכל (מידות ד, ב).");
        box(493.9,BV-1.55,494,BV+1.55,3.5,9,M.dark,pi,{noCol:true,cast:false});box(492.8,BV-2.6,494,BV+2.6,9,10.2,M.stoneL,null,{noCol:true});CL("פשפש כבש הפרה",503,BV,13,pi,true)}}
      P.forEach(u=>{const g=GY(u,BV);if(g<yD(u)-1.5)box(u-1.1,BV-BW,u+1.1,BV+BW,g-1,yD(u)-0.9,M.stoneL,kp,{noCol:true})});
      const AR=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],m=(a+b)/2,gm=Math.max(GY(a,BV),GY(b,BV),GY(m,BV)),top=yD(m)-0.9;for(let t=top-10;t>gm;t-=10)AR.push([m,t])}
      if(AR.length){const Wd=17.8,sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(0,10*A);sh.lineTo(Wd*A,10*A);sh.lineTo(Wd*A,0);sh.absarc(Wd/2*A,0,Wd/2*A,0,Math.PI,false);
        const ag=new THREE.ExtrudeGeometry(sh,{depth:2*BW*A,bevelEnabled:false});ag.translate(-Wd/2*A,0,-BW*A);const am=new THREE.InstancedMesh(ag,M.stoneL,AR.length),d=new THREE.Object3D();
        AR.forEach(([m,t],i)=>{const q=W(m,BV);d.position.set(q[0],t*A,q[1]);d.updateMatrix();am.setMatrixAt(i,d.matrix)});am.castShadow=true;am.receiveShadow=true;am.userData=kp;cPick.push(am);group.add(am)}
      {const KS=RB?KU:510,L=ue-KS,mu=(KS+ue)/2,q=W(mu,BV),g=new THREE.Group();g.position.set(q[0],(yD(mu)-0.45)*A,q[1]);g.rotation.z=Math.atan(SL);
        const dk=new THREE.Mesh(new THREE.BoxGeometry(L*A*Math.hypot(1,SL),0.9*A,2*BW*A),M.stoneL);dk.castShadow=true;dk.receiveShadow=true;dk.userData=kp;cPick.push(dk);g.add(dk);
        [-1,1].forEach(sd=>{const pp=new THREE.Mesh(new THREE.BoxGeometry(L*A*Math.hypot(1,SL),1.3*A,0.35*A),M.stone2);pp.position.set(0,1.1*A,sd*(BW-0.18)*A);pp.castShadow=true;g.add(pp)});group.add(g)}
      CL("כבש הפרה",KU+260,BV,yD(KU+260)+6,kp,false);cLabels[cLabels.length-1].pr=1;
      // the purity centre and the place of burning at the far end
      const pc=I("מרכז טהרה","במדבר יט, יא-יט; פרה ג","⚖️ טמא מת צריך הזאה של מי חטאת — אפר הפרה האדומה במים חיים — ביום השלישי וביום השביעי, ואחר כך טבילה. 💡 כאן מוצע מרכז טהרה מחוץ להר, בסוף כבש הפרה בהר הזיתים: מקוואות, מקום הזאה וחדרים להחלפת בגדים.");
      {const pad=(u0,v0,u1,v1,h,mat,info)=>{const g0=gmin(u0,v0,u1,v1),gt=Math.max(GY(u0,v0),GY(u1,v0),GY(u0,v1),GY(u1,v1))+0.3;box(u0,v0,u1,v1,g0-0.5,gt,M.stoneL,info);if(h)box(u0+0.5,v0+0.5,u1-0.5,v1-0.5,gt,gt+h,mat,info);return gt};
        const t1=pad(ue+6,198,ue+20,210,6,whiteM,pc);box(ue+5.7,197.7,ue+20.3,210.3,t1+6,t1+6.5,M.stone2,null);box(ue+11,210.3,ue+14,210.4,t1,t1+4.5,M.dark,null,{noCol:true,cast:false});
        const t2=pad(ue+6,214,ue+16,222,0,null,pc);box(ue+7,215,ue+15,221,t2,t2+0.5,M.stoneL,pc,{noCol:true});box(ue+7.5,215.5,ue+14.5,220.5,t2+0.2,t2+0.45,M.water,pc,{noCol:true,cast:false});
        const t3=pad(ue+24,198,ue+34,208,5,whiteM,pc);box(ue+23.7,197.7,ue+34.3,208.3,t3+5,t3+5.5,M.stone2,null);
        const t4=pad(ue+24,212,ue+30,218,0,null,pc);cyl(ue+27,215,t4,t4+2,0.9,0.7,M.stoneL,pc,16);cyl(ue+27,215,t4+2,t4+2.3,1.3,1.3,M.stoneL,pc,16);
        CL("מרכז טהרה",ue+20,208,t1+12,pc,false);
        const sp=I("מקום שריפת הפרה","פרה ג, ז-ט; מידות ב, ד","⚖️ בהר המשחה, מול פתח ההיכל, שורפים את הפרה האדומה, ומשליכים לתוך שריפתה עץ ארז, אזוב ושני תולעת. 📜 הכהן עומד \"ומכוין ורואה כנגד פתחו של היכל\" (מידות ב, ד). 💡 המקום המדויק הוא הצעה, על הקו של ציר הבית.");
        const pu=ue+24,g1=GY(pu,250);cyl(pu,250,g1-0.5,g1+0.7,3.2,3.4,M.stone2,sp,18);cyl(pu,250,g1+0.6,g1+0.8,2.6,2.6,M.ash,sp,18);CL("מקום שריפת הפרה",pu,250,g1+6,sp,true)}}
    // -- outside the holy area (💡 modern state) --
    {const svc=I("שירותים, מים וצל","💡 הצעה","💡 ליד כל כניסה להר: שירותים, ברזיות של מים קרים, וסטיו של אבן לצל לממתינים, כמו הסטווים שהקיפו את ההר (פסחים יג, ב: \"סטיו לפנים מסטיו\"). הם עומדים מחוץ לחומה, מחוץ לשטח המקודש.");
      const sec=I("שביל חירום","💡 הצעה","💡 שביל פנוי, מרוצף באבן בהירה, מהשער אל הרחוב, לאמבולנס ולכבאית, וגם לניהול העומס בחגים. הוא מחוץ לשטח המקודש.");
      const entr=(vs,dir)=>{const vp=vs+dir*7.5,g=0;
        // shade: a stone stoa (colonnade), like the porticoes that stood around the Mount
        const v0=Math.min(vp,vp+dir*24),v1=Math.max(vp,vp+dir*24);
        box(225,v0,275,v1,g,g+0.06,M.stone2,svc,{noCol:true,cast:false});
        
        // water: three stone basins along the stoa
        for(let k=0;k<3;k++){const u=236+k*14,v=vp+dir*6;cyl(u,v,g,g+2,1.3,1.1,M.stoneL,svc,16);cyl(u,v,g+1.85,g+1.95,1.05,1.05,M.water,svc,16)}
        // toilets: a low stone building with a cornice and two doorways, outside the holy area
        {const a=dir<0?vp-26:vp+8;box(186,a,210,a+18,g,g+6,M.stoneL,svc);box(185.6,a-0.4,210.4,a+18.4,g+6,g+6.6,M.stone2,null);box(209.95,a+3,210.05,a+6,g,g+4.5,M.dark,null,{noCol:true,cast:false});box(209.95,a+12,210.05,a+15,g,g+4.5,M.dark,null,{noCol:true,cast:false})}
        // emergency lane: kept free, marked only by a paving of lighter stone with two kerbs
        const ve=dir<0?vs-200:vs+110,w0=Math.min(vp,ve),w1=Math.max(vp,ve);box(246,w0,254,w1,g+0.02,g+0.06,M.stone2,sec,{noCol:true,cast:false});box(245.7,w0,246,w1,g,g+0.25,M.stoneL,null,{noCol:true,cast:false});box(254,w0,254.3,w1,g,g+0.25,M.stoneL,null,{noCol:true,cast:false})};
      entr(0,-1);entr(500,1)}
    {const vc=I("מרכז מבקרים לכל העמים","ישעיה נו, ז; מלכים א ח, מא-מג","📜 \"כי ביתי בית תפלה יקרא לכל העמים\". 📜 שלמה התפלל גם על \"הנכרי אשר לא מעמך ישראל הוא, ובא מארץ רחוקה\". ⚖️ גם נכרי יכול להביא קרבן ולהתפלל במקדש, אבל אסור לו להיכנס לפנים מן הסורג (מידות ב, ג). 💡 לכן מרכז המבקרים עומד ליד הכניסה הצפונית, שדרכה נכנסים כולם (יחזקאל מ״ו, ט), מחוץ לשטח המקודש: הסברים בשפות רבות, מה מותר לכל אחד ועד איפה, ומקום תפילה לכל אדם.");
      const g=0;box(300,-112,380,-68,g,g+3,M.stoneL,vc);box(304,-108,376,-72,g+3,g+12,M.stoneL,vc);[[-108.1,-71.9]].forEach(([a,b])=>{for(let k=0;k<9;k++){const u=308+k*7.6;box(u,a,u+3.2,b,g+4.5,g+10.5,M.dark,null,{noCol:true,cast:false})}});box(301,-111,379,-69,g+12,g+13,M.stoneL,null);box(330,-68.05,350,-67.95,g+3,g+9,M.dark,null,{noCol:true,cast:false});
      CL("מרכז מבקרים לכל העמים",340,-90,g+18,vc,false)}
    {const ic=I("מרכז בדיקת קרבנות","ויקרא כב, יז-כה; בכורות ו; תמיד ג, ג","⚖️ בהמה שיש בה מום פסולה לקרבן, וצריך לבדוק אותה לפני שמביאים אותה. 📜 בלשכת הטלאים בדקו את כבשי התמיד. 💡 כאן מוצע מרכז מודרני מחוץ לשטח המקודש: וטרינר ו\"מומחה למומין\", מכלאות, מים וצל, ליד שער השבטים בצפון־מזרח ההר.");
      const g=0;box(320,-160,350,-130,g,g+9,whiteM,ic);box(319.7,-160.3,350.3,-129.7,g+9,g+9.5,steelM,null);box(320,-129.95,350,-129.9,g+4,g+6.5,glassM,null,{noCol:true,cast:false});
      for(let i=0;i<4;i++){const u0=354+i*11;box(u0,-158,u0+0.3,-116,g,g+2,M.wood,ic,{noCol:true});box(u0,-158,u0+11,-157.7,g,g+2,M.wood,null,{noCol:true});box(u0,-116.3,u0+11,-116,g,g+2,M.wood,null,{noCol:true})}
      box(398,-158,398.3,-116,g,g+2,M.wood,null,{noCol:true});
      CL("מרכז בדיקת קרבנות",372,-137,g+12,ic,false)}
    {const ba=I("בן אחיה — מרפאה","שקלים ה, א-ב","📜 \"בן אחיה על חולי מעים\" — אחד הממונים במקדש, שטיפל בכהנים שחלו (הם הלכו יחפים על השיש ואכלו הרבה בשר). 💡 כאן מוצעת מרפאה ותחנת עזרה ראשונה לכל המבקרים, מחוץ לשטח המקודש.");
      const g=0;box(150,-72,180,-46,g,g+8,whiteM,ba);box(149.7,-72.3,180.3,-45.7,g+8,g+8.5,steelM,null);box(162,-45.95,168,-45.9,g,g+4.5,glassM,null,{noCol:true,cast:false});
      const tri=a=>{const s=new THREE.Shape(),R=1.7*A;for(let k=0;k<3;k++){const t=a+k*2*Math.PI/3;k?s.lineTo(R*Math.sin(t),R*Math.cos(t)):s.moveTo(R*Math.sin(t),R*Math.cos(t))}return new THREE.ShapeGeometry(s)};
      const q=W(165,-45.85);[0,Math.PI].forEach(a=>{const m=new THREE.Mesh(tri(a),redM);m.position.set(q[0],(g+6.2)*A,q[1]);m.userData=ba;cPick.push(m);group.add(m)});
      CL("בן אחיה — מרפאה",165,-59,g+12,ba,true)}
    {const et=I("אבן הטועים","בבא מציעא כח ע״ב","📜 \"אבן טוען היתה בירושלים. כל מי שאבדה לו אבדה נפנה לשם, וכל מי שמצא אבדה נפנה לשם. זה עומד ומכריז, וזה עומד ונותן סימניו ונוטלה\". 💡 היום — אבן גדולה ולידה עמדת מידע לאבדות ומציאות.");
      const g=0;box(296,-44,303,-38,g,g+3.4,M.stone,et);box(304.5,-41.5,305,-40.5,g,g+3,steelM,et,{noCol:true});box(304.2,-41.8,305.3,-40.2,g+3,g+4.6,M.dark,et,{noCol:true});
      CL("אבן הטועים",300,-41,g+7,et,true)}
    // -- festival mode (button "חג"): built into FESTG, hidden until asked --
    FESTG=new THREE.Group();FESTG.visible=SHOW_FEST;group.add(FESTG);if(RB)FESTG.position.set(-55*A,2.5*A,-15*A);
    {const g0=group;group=FESTG;const nc={noCol:true};
      const sb=I("שמחת בית השואבה","סוכה ה, א-ד","📜 \"מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו\". 📜 ארבע מנורות של זהב, גובהן 50 אמה, ובראש כל אחת ארבעה ספלים. פרחי כהונה עולים בסולמות וממלאים אותם שמן, ומבלאי מכנסי הכהנים עושים פתילות — \"ולא היתה חצר בירושלים שאינה מאירה\". 📜 חסידים ואנשי מעשה מרקדים לפניהם באבוקות של אור. 💡 ביחזקאל אין עזרת נשים, ולכן המנורות כאן בחצר החיצונה, בצד המזרחי.");
      const EM=[];[[390,222],[390,278],[440,222],[440,278]].forEach(([u,v])=>{cyl(u,v,3.5,5,2,1.6,M.gold,sb,16);cyl(u,v,5,50,0.5,0.4,M.gold,sb,12);box(u-2.6,v-0.3,u+2.6,v+0.3,49.6,50.2,M.gold,sb,nc);box(u-0.3,v-2.6,u+0.3,v+2.6,49.6,50.2,M.gold,sb,nc);
        [[2.3,0],[-2.3,0],[0,2.3],[0,-2.3]].forEach(([du,dv])=>{cyl(u+du,v+dv,50.2,51.4,0.7,1.1,M.gold,sb,12);cyl(u+du,v+dv,51.35,51.45,0.95,0.95,M.ember,null,10);const q=W(u+du,v+dv);EM.push({x:q[0],y:51.45*A,z:q[1],rx:0.5*A,s:0.9})});
        box(u+2.6,v-0.5,u+3.1,v+0.5,3.5,46,M.wood,sb,nc)});
      FESTG.add(makePFX(EM.length*(SMALL?6:10),true,EM,{seed:81}));
      const TE=[];around(415,250,7,12,3.5,sb,FSTAND,k=>[0xf1ece0,0xd9cdb2,0xe8e2cf][k%3],0,Math.PI*2);for(let k=0;k<12;k++){const th=Math.PI*2*(k+0.5)/12,q=W(415+7.6*Math.cos(th),250+7.6*Math.sin(th));TE.push({x:q[0],y:(3.5+3.4)*A,z:q[1],rx:0.08*A,s:0.35})}
      FESTG.add(makePFX(TE.length*(SMALL?3:5),true,TE,{seed:82}));
      const hk=I("הקהל — בימת המלך","סוטה ז, ח; דברים לא, י-יג","📜 במוצאי שנת השמיטה, בחג הסוכות, \"עושין לו בימה של עץ בעזרה, והוא יושב עליה\", והמלך קורא בתורה לפני כל העם — אנשים, נשים וטף. 📜 אגריפס המלך עמד וקרא, ושבחוהו חכמים. 💡 המקום בחצר החיצונה הוא הצעה.");
      box(411,300,419,308,3.5,6.5,M.wood,hk,nc);box(412.5,308,417.5,310,3.5,5,M.wood,hk,nc);box(412.5,310,417.5,311.5,3.5,4,M.wood,hk,nc);box(414,301,416,302,6.5,8.3,M.wood,hk,nc);
      add(FSTAND,hk,{u:415,v:303.4,y:6.5,a:face(415,303.4,415,280),c:0x6e2a43});[[412,304],[418,304]].forEach(([u,v])=>add(FSTAND,hk,{u,v,y:6.5,a:face(u,v,415,280),c:PR}));
      let BK=null;if(RB){BK=new THREE.Group();BK.position.set(55*A,-5.65*A,50*A);FESTG.add(BK);group=BK}const bk=I("הבאת הביכורים","ביכורים ג, ב-ד, ח","📜 \"והשור הולך לפניהם, וקרניו מצופות זהב, ועטרת של זית בראשו. והחליל מכה לפניהם... הגיעו להר הבית, אפילו אגריפס המלך נוטל הסל על כתפו ונכנס\". 📜 העשירים מביאים בסלים של כסף וזהב, והעניים בסלים של נצרים. 💡 התהלוכה כאן נכנסת בשער הצפוני.");
      for(let k=0;k<13;k++)[247,253].forEach((u,j)=>{const v=64+k*4.4+j*1.2;add(FSTAND,bk,{u,v,y:3.5,a:0,c:[0xd8c9a8,0x9fb0bf,0xc7a27a,0xe2dccb][(k+j)%4]});cyl(u+0.42,v,3.5+2.65,3.5+3.2,0.36,0.3,(k%5===0)?M.gold:wickM,bk,10)});
      add(FSTAND,bk,{u:250,v:122.5,y:3.5,a:0,c:0xe2dccb});cyl(250.3,123.2,3.5+2.2,3.5+2.3,0.04,0.04,M.wood,null,6);
      box(249.1,125,250.9,129.3,5.3,7.4,oxM,bk,nc);[[249.2,125.2],[250.4,125.2],[249.2,128.6],[250.4,128.6]].forEach(([u,v])=>box(u,v,u+0.45,v+0.45,3.5,5.4,oxM,null,nc));
      box(249.4,129.2,250.6,130.8,6.4,7.6,oxM,bk,nc);[[249.45,-0.5],[250.55,0.5]].forEach(([u,dz])=>{const h=cyl(u,130.3,7.6,8.4,0.1,0.02,M.gold,bk,6);h.rotation.z=dz});
      {const wr=new THREE.Mesh(new THREE.TorusGeometry(0.5*A,0.08*A,6,14),new THREE.MeshStandardMaterial({color:0x6f8a45,roughness:0.9})),q=W(250,130.2);wr.position.set(q[0],7.7*A,q[1]);wr.rotation.x=Math.PI/2;group.add(wr)}if(BK)(FSTAND.get(bk)||[]).forEach(p=>{p.u+=55;p.v+=50;p.y-=5.65});
      group=g0}
    if(RB){group=lowG;for(let i=lowC;i<COL.length;i++){COL[i].y0-=8.5*A;COL[i].y1-=8.5*A}for(let i=lowL;i<cLabels.length;i++)cLabels[i].v.y-=8.5*A;[SEAT,STAND].forEach(m=>m.forEach(a=>{for(let i=lowS.get(a)||0;i<a.length;i++)a[i].y-=8.5}))}
    // ---- figures: one instanced mesh per part and per card ----
    const BU=THREE.BufferGeometryUtils,mg=a=>(BU&&BU.mergeBufferGeometries(a.map(g=>g.index?g.toNonIndexed():g)))||a[0];
    const T=(g,x,y,z)=>{g.translate(x*A,y*A,z*A);return g};
    const sBody=mg([T(new THREE.CylinderGeometry(0.3*A,0.45*A,1.25*A,10),0,1.42,-0.1),T(new THREE.CylinderGeometry(0.22*A,0.48*A,0.38*A,10),0,1.88,-0.08),T(new THREE.BoxGeometry(0.7*A,0.28*A,0.75*A),0,0.94,0.3),T(new THREE.BoxGeometry(0.62*A,0.8*A,0.26*A),0,0.4,0.62)]);
    const stool=T(new THREE.BoxGeometry(0.85*A,0.8*A,0.8*A),0,0.4,-0.05);
    const tBody=mg([T(new THREE.CylinderGeometry(0.27*A,0.43*A,2.6*A,10),0,1.3,0),T(new THREE.CylinderGeometry(0.2*A,0.46*A,0.4*A,10),0,2.45,0)]);
    const head=new THREE.SphereGeometry(0.2*A,10,8),hood=new THREE.SphereGeometry(0.235*A,12,6,Math.PI*0.85,Math.PI*1.3,0,Math.PI*0.62);hood.translate(0,0,-0.03*A);
    const robeM=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.92,envMapIntensity:0.4}),skinM=new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}),stoolM=M.wood;
    const d=new THREE.Object3D(),c=new THREE.Color();
    const inst=(geo,mat,arr,info,dy,col)=>{const m=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((p,i)=>{const q=W(p.u,p.v);d.position.set(q[0],(p.y+dy)*A,q[1]);d.rotation.set(0,p.a,0);d.updateMatrix();m.setMatrixAt(i,d.matrix);if(col)m.setColorAt(i,c.setHex(p.c))});
      if(m.instanceColor)m.instanceColor.needsUpdate=true;m.castShadow=true;m.receiveShadow=true;m.userData=info;cPick.push(m);group.add(m)};
    const figs=(SEAT,STAND)=>{SEAT.forEach((arr,info)=>{inst(sBody,robeM,arr,info,0,true);inst(stool,stoolM,arr,info,0,false);inst(head,skinM,arr,info,2.3,false);inst(hood,robeM,arr,info,2.33,true)});
    STAND.forEach((arr,info)=>{inst(tBody,robeM,arr,info,0,true);inst(head,skinM,arr,info,2.88,false);inst(hood,robeM,arr,info,2.91,true)})};figs(SEAT,STAND);{const g0=group;group=FESTG;figs(FSEAT,FSTAND);group=g0}}
  // ---- vessels of the inner court ----
  {const kv=I("הכיור והמוכני","שמות ל, יז-כא; מידות ג, ו; יומא לז ע״א","כיור נחושת שממנו הכהנים מקדשים ידיים ורגליים לפני העבודה. \"הכיור היה בין האולם ולמזבח, ומשוך כלפי הדרום\". בן קטין עשה לו 12 דדים (ברזים), כדי ש־12 כהנים יקדשו בבת אחת, ומוכני — גלגל שמשקיע אותו במים בלילה. הגודל לא מפורש; כאן קוטר של כ־3 אמות.");
    const u=222,v=263;cyl(u,v,7.5,9.5,0.9,0.7,M.bronze,kv,16);cyl(u,v,9.5,11,1.6,1.9,M.bronze,kv,24);
    for(let k=0;k<12;k++){const an=k/12*Math.PI*2,q=W(u+Math.cos(an)*1.85,v+Math.sin(an)*1.85),sp=new THREE.Mesh(new THREE.CylinderGeometry(0.035*A,0.035*A,0.35*A,6),M.bronze);sp.position.set(q[0],10.2*A,q[1]);sp.rotation.z=Math.PI/2;sp.rotation.y=-an;group.add(sp)}}
  {const ts=I("שולחנות השיש והכסף","שקלים ו, ד; תמיד ג","שני שולחנות במערב הכבש: של שיש, עליו נותנים את איברי הקרבן, ושל כסף, עליו כלי השרת.");
    box(238.5,268,240.5,269.2,7.5,8.6,M.marble,ts,{noCol:true});box(238.5,276,240.5,277.2,7.5,8.6,M.white,ts,{noCol:true})}
  {const bm=I("בית המטבחיים","מידות ג, ה; תמיד ג","בצפון המזבח: 24 טבעות ברצפה (ארבע שורות של שש) לקשירת הבהמות בשעת השחיטה, ושמונה עמודים נמוכים (\"ננסין\") עם קורות ארז וּווים של ברזל לתליית הבשר והפשטתו, ושמונה שולחנות שיש להדחת הקרביים.");
    // stage 5: each ring stands up on a hinge, so the neck of the animal goes through it (Middot 3:5; Tamid 3:3, 4:1)
    const rg=new THREE.TorusGeometry(0.24*A,0.05*A,6,14);for(let r=0;r<4;r++)for(let c=0;c<6;c++){const q=W(238+c*2.4,212+r*2.6),m=new THREE.Mesh(rg,M.iron);m.position.set(q[0],7.5*A+0.24*A,q[1]);m.rotation.y=0.3*((r+c)%3-1);m.userData=bm;cPick.push(m);group.add(m);
      box(238+c*2.4-0.3,212+r*2.6-0.2,238+c*2.4+0.3,212+r*2.6+0.2,7.5,7.54,M.iron,null,{noCol:true,cast:false})}
    for(let k=0;k<8;k++){const u=268+(k%4)*3,v=k<4?212:219;cyl(u,v,7.5,11,0.25,0.25,M.stoneL,bm,10)}
    const hk=new THREE.TorusGeometry(0.07*A,0.012*A,4,8,Math.PI*1.3),hs=new THREE.CylinderGeometry(0.012*A,0.012*A,0.18*A,4);
    [212,219].forEach(v=>{box(267.6,v-0.25,277.4,v+0.25,10.6,11.1,M.wood,bm,{noCol:true});
      // "ואונקליות של ברזל היו קבועים בהן, ושלשה סדרים היו לכל אחד ואחד" — three rows of iron hooks
      for(let row=0;row<3;row++)for(let k=0;k<10;k++){const uu=268.2+k*0.95+(row===1?0.45:0),dv=row===0?-0.27:row===2?0.27:0,yy=row===1?10.6:10.85,q=W(uu,v+dv);
        const st=new THREE.Mesh(hs,M.iron);st.position.set(q[0],(yy-0.09)*A-(row===1?0:0.02),q[1]);group.add(st);const h=new THREE.Mesh(hk,M.iron);h.position.set(q[0],(yy-0.18-0.07)*A,q[1]);h.rotation.z=Math.PI*0.85;h.rotation.y=row===1?0:Math.PI/2;group.add(h)}});
    for(let k=0;k<8;k++){const u=267.5+(k%4)*3;box(u,k<4?205.5:224,u+1.6,(k<4?205.5:224)+1,7.5,8.6,M.marble,bm,{noCol:true})}}
  if(!RB){const dk=I("הדוכן","מידות ב, ו; ערכין יא ע״ב","במה של הלוויים בין עזרת ישראל לעזרת כהנים: גבוהה אמה, ועליה דוכן עם שלוש מעלות של חצי אמה. כאן עמדו הלוויים ושרו ונגנו בשעת הקרבן — \"ואין פוחתין משנים עשר לויים עומדין על הדוכן\".");
    [[212,261],[271,288]].forEach(([v0,v1])=>{box(284,v0,287,v1,7.5,8.5,M.stoneL,dk,{noCol:true});box(283,v0,284,v1,7.5,9,M.stone2,null,{noCol:true});box(282,v0,283,v1,7.5,9.5,M.stone2,null,{noCol:true});box(281,v0,282,v1,7.5,10,M.stone2,null,{noCol:true})})}
  if(RB){group=grpS;SG.position.set(-12*A,0,9*A);for(let i=colS;i<COL.length;i++){COL[i].x0-=12*A;COL[i].x1-=12*A;COL[i].z0+=9*A;COL[i].z1+=9*A}for(let i=sgL;i<cLabels.length;i++){const q=cLabels[i].v;q.x-=12*A;q.z+=9*A;q.y+=8.5*A}}
  if(COMB&&!RB){
    // soreg + chel around the inner court
    {const so=I("הסורג והחיל — תוספת מבית שני","מידות ב, ג; רמב״ם, הלכות בית הבחירה ה, ג","גדר סבכה בגובה 10 טפחים, ולפנים ממנה החיל — רחבה של 10 אמות לפני החצר הפנימית. יחזקאל לא מזכיר אותם; הם לקוחים מבית שני.");
      const hs=10/6,fence=(a0,a1,fixed,alongU)=>{if(alongU){box(a0,fixed-0.15,a1,fixed+0.15,3.75,3.75+hs,M.lattice,so,{noCol:true,cast:false,tile:hs*A});box(a0,fixed-0.25,a1,fixed+0.25,3.75+hs,3.95+hs,M.stoneL,so,{noCol:true,cast:false})}else{box(fixed-0.15,a0,fixed+0.15,a1,3.75,3.75+hs,M.lattice,so,{noCol:true,cast:false,tile:hs*A});box(fixed-0.25,a0,fixed+0.25,a1,3.75+hs,3.95+hs,M.stoneL,so,{noCol:true,cast:false})}};
      fence(200,236,190,true);fence(264,310,190,true);fence(200,236,310,true);fence(264,280,310,true);fence(190,236,310,false);fence(264,290,310,false);
      box(200,190,310,200,3.5,3.75,M.pave,so,{cast:false,noCol:true,tile:9});box(200,300,280,310,3.5,3.75,M.pave,so,{cast:false,noCol:true,tile:9});box(300,200,310,300,3.5,3.75,M.pave,so,{cast:false,noCol:true,tile:9});
      CL("הסורג והחיל",305,195,8,so,false);
      // stage 5: warning stones at the openings. The Greek text is the one on the stone found in 1871 (Josephus mentions Greek and Latin)
      {const L=[["he","לא יבוא איש נכרי","לפנים מן הסורג","ולא טמא מת אל החיל"],["el","ΜΗΘΕΝΑ ΑΛΛΟΓΕΝΗ","ΕΙΣΠΟΡΕΥΕΣΘΑΙ ΕΝΤΟΣ ΤΟΥ","ΠΕΡΙ ΤΟ ΙΕΡΟΝ ΤΡΥΦΑΚΤΟΥ"],["la","NE QVIS ALIENIGENA","INTRA CANCELLOS","INGREDIATVR"],["en","NO FOREIGNER","MAY ENTER WITHIN","THE BALUSTRADE"]];
        const mat={};L.forEach(([id,...t])=>{const c=cv(256,320,(x,w,h)=>{x.fillStyle="#ece4d2";x.fillRect(0,0,w,h);noiseFill(x,w,h,14,40+id.length);x.strokeStyle="rgba(120,105,80,.6)";x.lineWidth=5;x.strokeRect(12,12,w-24,h-24);x.fillStyle="#5b4a33";x.textAlign="center";x.direction=id==="he"?"rtl":"ltr";
          t.forEach((ln,i)=>{let fs=id==="he"?34:26;x.font=(id==="he"?"bold ":"")+fs+"px serif";while(x.measureText(ln).width>w-44&&fs>12){fs--;x.font=(id==="he"?"bold ":"")+fs+"px serif"}x.fillText(ln,w/2,110+i*58)})});mat[id]=new THREE.MeshStandardMaterial({map:tex(c,true),roughness:0.9})});
        const wn=I("שלטי האזהרה שליד הסורג","מידות ב, ג; כלים א, ח; יוספוס, מלחמות ה, ה, ב","⚖️ לפנים מן הסורג אסור לנכרים ולטמאי מתים להיכנס. 💡 יוספוס כותב שעמדו כאן אבנים עם אזהרה ביוונית ובלטינית, ואבן כזאת ביוונית נמצאה ב־1871. כאן יש שלטים בעברית, ביוונית, בלטינית ובאנגלית — הנוסח העברי והאנגלי הם הצעה.");
        const stele=(u,v,face,id)=>{const q=W(u,v),g=new THREE.Group();g.position.set(q[0],3.75*A,q[1]);g.rotation.y=face;const st=new THREE.Mesh(rbox(1.5*A,2.3*A,0.35*A,3.2),M.stoneL);st.position.y=1.15*A;st.castShadow=true;st.userData=wn;cPick.push(st);g.add(st);
          const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.2*A,1.5*A),mat[id]);pl.position.set(0,1.3*A,0.18*A);g.add(pl);group.add(g)};
        stele(233,188.6,Math.PI,"he");stele(267,188.6,Math.PI,"el");stele(233,311.4,0,"la");stele(267,311.4,0,"he");stele(311.4,233,Math.PI/2,"en");stele(311.4,267,Math.PI/2,"el")}}
    // Lishkat HaGazit: half inside the inner court, half outside
    // (stage 7: Lishkat HaGazit is now built for both plans, above)
    // Beit HaMoked north of the inner court
    {const bm=I("בית המוקד — תוספת מבית שני","מידות א, ו-ח; רמב״ם, הלכות בית הבחירה ה, ט-יב","בנוי כיפה, ורובדין של אבן מסביב. שם ישנו זקני בית אב, ומשם יורדים במסיבה למקווה שמתחת לבית. בו לשכות הטלאים ועושי לחם הפנים.");
      box(203,160,226,186,3.5,15,M.stoneL,bm);const dm=new THREE.Mesh(new THREE.SphereGeometry(10*A,24,12,0,Math.PI*2,0,Math.PI/2),M.white);const q=W(214.5,173);dm.position.set(q[0],15*A,q[1]);dm.userData=bm;cPick.push(dm);group.add(dm);CL("בית המוקד",214.5,173,27,bm,false);cLabels[cLabels.length-1].pr=1}
    // Nicanor doors on the inner east gate
    {const nk=I("שער ניקנור","מידות ב, ג; רמב״ם, הלכות בית הבחירה ה, ה","השער הפנימי המזרחי — בבית שני נקרא שער ניקנור, ודלתותיו נחושת קלל שמבהיקה כזהב. יחזקאל (מ״ו, א) אומר שהוא סגור בימי המעשה ונפתח בשבת ובראש חודש.");
      box(300.2,244,300.5,256,7.5,27.5,M.bronze,nk,{cast:false,noCol:true});CL("שער ניקנור",312,250,30,nk,false);cLabels[cLabels.length-1].pr=1}
    // the altar: shitin and the two small ramps (Rambam 2:11-14)
    {const st=I("השיתין","מידות ג, ב; רמב״ם, הלכות בית הבחירה ב, יא","שני נקבים דקים בקרן הדרומית־מערבית של היסוד; הדמים והנסכים יורדים בהם לאמה, ומשם לנחל קדרון.");
      box(234,265.3,234.7,266,9.5,9.55,M.dark,st,{cast:false,noCol:true});
      {const am=I("האמה — הניקוז לנחל קדרון","מידות ג, ב; ג, ו; יומא נח ע״ב; מעילה ג, ג","⚖️ הדם והנסכים יורדים בשיתין אל מתחת למזבח, ומשם \"מתערבין באמה ויוצאין לנחל קדרון\", ונמכרים לגננים לזבל. אמת מים עוברת בעזרה ויוצאת תחת שער המים. 💡 כאן התעלה מכוסה באבנים ויש בה סבכות קטנות — ניקוז נסתר כמו היום. המסלול המדויק בהערכה.");
        const run=(u0,v0,u1,v1)=>{box(u0,v0,u1,v1,7.5,7.53,M.stone2,am,{cast:false,noCol:true,tile:2});const L=Math.max(u1-u0,v1-v0);for(let k=3;k<L;k+=6){const a=u1-u0>v1-v0?[u0+k-0.4,v0+0.1,u0+k+0.4,v1-0.1]:[u0+0.1,v0+k-0.4,u1-0.1,v0+k+0.4];box(a[0],a[1],a[2],a[3],7.53,7.55,M.iron,am,{cast:false,noCol:true})}};
        run(233.5,268,234.7,298.5);run(233.5,298.5,300,299.7);CL("האמה",270,299,9.5,am)}
      const wedge=(uE,vTop,len,h,wd,info)=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(len*A,0);sh.lineTo(0,h*A);sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:wd*A,bevelEnabled:false});g.rotateY(-Math.PI/2);const m=new THREE.Mesh(g,M.plaster);const p=W(uE,vTop);m.position.set(p[0],7.5*A,p[1]);m.castShadow=true;m.receiveShadow=true;m.userData=info;cPick.push(m);group.add(m)};
      const kr=I("הכבשים הקטנים","רמב״ם, הלכות בית הבחירה ב, יד; זבחים סב ע״ב","שני כבשים קטנים יוצאים מן הכבש הגדול: אחד ליסוד ואחד לסובב, ומופרשים מן המזבח כחוט השערה.");
      wedge(242,266.1,8,2,3,kr);wedge(261,266.1,16,6,3,kr)}
    // the kitchens are also the four roofless chambers (Middot 2:5)
    [["לשכת המצורעים",26,21],["לשכת דיר העצים",474,21],["לשכת בית שמניה",26,479],["לשכת הנזירים",474,479]].forEach(([n,u,v])=>CL(n,u,v,16,I(n+" — מקצעות החצר","מידות ב, ה; יחזקאל מ״ו, כא-כד","ארבע לשכות בלי גג בארבע הפינות — \"וכן הן עתידות להיות, שנאמר... בארבעת מקצעות החצר חצרות קטרות\". בבית שני: לשכת הנזירים (דרום־מזרח), דיר העצים (צפון־מזרח), המצורעים (צפון־מערב) ובית שמניה (דרום־מערב).")));
  }
  // ulam: tables of marble and of gold (Menachot 99b)
  {const ut=I("שני השולחנות שבאולם","מנחות צט ע״ב; שקלים ו, ד","\"על שולחן של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקודש ולא מורידין\".");
    box(187,243,189,244,13.56,15.06,M.marble,ut,{noCol:true});box(187,256,189,257,13.56,15.06,M.altarGold,ut,{noCol:true})}
  // golden vine over the heikhal entrance (Middot 3:8)
  {const gv=I("גפן של זהב","מידות ג, ח","\"וגפן של זהב היתה עומדת על פתחו של היכל ומודלה על גבי כלונסות. כל מי שהוא מתנדב עלה, או גרגיר, או אשכול — מביא ותולה בה\".");
    box(183.02,243,183.2,257,33.6,34.0,M.altarGold,gv,{cast:false,noCol:true});const r=rng(33);for(let k=0;k<26;k++){const q=W(183.25,243.4+r()*13.2),b=new THREE.Mesh(new THREE.SphereGeometry((0.12+r()*0.1)*A,8,6),M.altarGold);b.position.set(q[0],(33.2+r()*1.2)*A,q[1]);b.userData=gv;cPick.push(b);group.add(b)}}
  if(!RB){
  // red line around the altar (Middot 3:1)
  {const ch=I("חוט הסיקרא","מידות ג, א","\"וחוט של סיקרא חוגרו באמצעו, להבדיל בין דמים העליונים לדמים התחתונים\".");box(234.95,234.95,265.05,265.05,12.4,12.6,new THREE.MeshStandardMaterial({color:0x9c2a1c,roughness:0.8}),ch,{cast:false,noCol:true})}
  // court lamps
  {const li=I("עמוד תאורה","💡 הצעה","💡 עמודי תאורה בחצר החיצונה, כדי שיהיה אור בלילה. הם עשויים כמו מנורת שמן גדולה מנחושת על בסיס אבן. ⚖️ בלילה האירו במקדש בנרות ובמדורה (תמיד א, א), אבל לא כתוב שהיו עמודי תאורה בחצר.");
    [[60,60],[440,60],[60,440],[440,440],[220,120],[280,120],[220,380],[280,380],[400,200],[400,300]].forEach(c=>{cyl(c[0],c[1],3.5,4.6,0.85,1,M.stoneL,li,10);cyl(c[0],c[1],4.6,12.4,0.2,0.28,M.bronze,li,10);cyl(c[0],c[1],12.4,13,0.95,0.35,M.bronze,li,12);box(c[0]-0.5,c[1]-0.5,c[0]+0.5,c[1]+0.5,13,14.1,M.lamp,li,{cast:false,noCol:true});cyl(c[0],c[1],14.1,14.6,0.85,0.2,M.bronze,li,12);cyl(c[0],c[1],14.6,15,0.08,0.08,M.bronze,null,6)})}
  // river
  const rivStart=group.children.length;
  const rv=I("הנחל שיוצא מהמקדש","יחזקאל מ״ז, א-יב; רש״י שם","📜 \"והנה מים יצאים מתחת מפתן הבית קדימה... והמים ירדים מתחת מכתף הבית הימנית, מנגב למזבח\" (מ״ז, א). 📜 מחוץ לשער המזרחי הסגור: \"והנה מים מפכים מן הכתף הימנית\" (מ״ז, ב) — ⚖️ רש״י: מעט מים, כמו שיוצאים מפך. 📜 ככל שהולכים מזרחה המים גדלים: אחרי 1000 אמה עד הקרסוליים, אחרי 2000 עד הברכיים, אחרי 3000 עד המותניים, ואחרי 4000 \"נחל אשר לא אוכל לעבר\" (מ״ז, ג-ה). הם יורדים אל הערבה ובאים אל ים המלח, \"ונרפאו המים\" (מ״ז, ח), ועל שתי הגדות \"כל עץ מאכל\" שנותן פרי בכל חודש (מ״ז, יב). 💡 מה שנבחר כאן: במקדש המים זורמים מעל הקרקע, בתעלת אבן צרה ופתוחה, כי יחזקאל רואה אותם ומודד אותם. מתחת לחומה, לכבש ולכבישים הם עוברים בצינור מקורה. מתחת לחומת הר הבית הם עוברים בצינור מקורה ויוצאים במעיין קטן למרגלותיה (\"מפכים\"), ומשם ומשם נחל טבעי דרומה במורד הקדרון — זה הכיוון שבו המים באמת יכולים לרדת לים המלח. על הגדות: עצי מאכל (זית, תמר, תאנה), קנים, הרדופים וסלעים.");
  // item 26: the channel runs 1.5 amot further south, so it does not cut the Ulam steps or the altar base.
  // stage 5 (user request): from under the south side of the House's front, past the altar on the south, as a small open channel with stone curbs
  {const chan=(u0,u1,vc,y,wd)=>{box(u0,vc-wd/2,u1,vc+wd/2,y,y+0.04,M.water,rv,{cast:false,noCol:true});[-1,1].forEach(sd=>box(u0,vc+sd*(wd/2+0.2)-0.2,u1,vc+sd*(wd/2+0.2)+0.2,y,y+0.12,M.stone2,null,{cast:false,noCol:true,tile:2}))};
    chan(203,300,268,7.5,1.4);box(203,267.1,203.06,268.9,7.5,8.4,M.dark,rv,{cast:false,noCol:true});
    // under the altar ramp in a culvert
    [241.94,258].forEach(u=>box(u,267.1,u+0.06,268.9,7.5,8.3,M.dark,null,{cast:false,noCol:true}));
    // three small steps down the edge of the inner court, south of the inner east gate
    for(let k=0;k<3;k++){const u0=300+k*0.9,top=6.5-k;box(u0,267.1,u0+0.9,268.9,3.5,top,M.stone2,null,{noCol:true,tile:2});box(u0,267.3,u0+0.9,268.7,top,top+0.04,M.water,rv,{cast:false,noCol:true});box(u0-0.05,267.3,u0+0.01,268.7,top,top+1,M.water,rv,{cast:false,noCol:true})}
    box(302.65,267.3,302.71,268.7,3.5,4.5,M.water,rv,{cast:false,noCol:true});
    chan(302.7,494,268,3.5,1.4);
    // through the outer wall in a covered culvert
    box(493.92,267.1,494,268.9,3.5,4.9,M.dark,rv,{cast:false,noCol:true});box(493.85,266.8,494,269.2,4.9,5.3,M.stoneL,null,{cast:false,noCol:true});
    // east-gate cleanup: no outlet high on the outside of the wall any more; the water stays in a covered channel and comes out at the foot of the Mount (see the spring below)
  }
  (function(){
    const s0=W(505,268),x0=s0[0],n0=-s0[1];
    const ribbon=(pts,w0,w1,lift)=>{const pos=[],uv=[],idx=[];let acc=0;
      for(let k=0;k<pts.length;k++){const p=pts[k],q=pts[Math.min(k+1,pts.length-1)],o=pts[Math.max(k-1,0)];const dx=q[0]-o[0],dz=q[2]-o[2],l=Math.hypot(dx,dz)||1;const nx=-dz/l,nz=dx/l;const w=(w0+(w1-w0)*k/(pts.length-1))/2;
        if(k>0)acc+=Math.hypot(p[0]-pts[k-1][0],p[2]-pts[k-1][2]);
        pos.push(p[0]+nx*w,p[1]+lift,p[2]+nz*w,p[0]-nx*w,p[1]+lift,p[2]-nz*w);uv.push(0,acc/12,1,acc/12);
        if(k<pts.length-1){const a=k*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      const m=new THREE.Mesh(g,M.water2);m.userData=rv;cPick.push(m);group.add(m);return m};
    let xe=x0;while(inPoly(xe+1,n0,MOUNT_S)&&xe<x0+250)xe+=1;
    // stone channel across the platform
    while(inPoly(xe+0.1,n0,MOUNT_S)&&xe<x0+250)xe+=0.1;
    const gf=S2G(xe+3,n0),hb=H(gf[0],gf[1]),f0p=x=>x+0.15,u500=x=>500+(x-W(500,268)[0])/A;
    if(!M.fallMist){M.fallMist=new THREE.MeshStandardMaterial({map:waterTex,color:0xffffff,transparent:true,opacity:0.38,depthWrite:false,side:THREE.DoubleSide,roughness:0.4});M.mist=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:0.16,depthWrite:false,roughness:1});M.rock=new THREE.MeshStandardMaterial({color:0x8a8070,roughness:0.95,flatShading:true});
      M.palmLeaf=new THREE.MeshStandardMaterial({color:0x557232,roughness:0.9,side:THREE.DoubleSide});M.reed=new THREE.MeshStandardMaterial({color:0x8e9a52,roughness:0.95})}
    // east-gate cleanup: instead of a spout and a 20 m waterfall, the water comes out at the foot of the wall in a small arched outlet and trickles into a pool.
    // 📜 "והנה מים מפכים מן הכתף הימנית" (Ezek 47:2) ⚖️ Rashi: a little water, as from a flask. 💡 the outlet's place and size are a suggestion.
    {const sp=I("המעיין למרגלות החומה","יחזקאל מ״ז, ב; רש״י שם","📜 \"ויסבני דרך חוץ אל שער החוץ... והנה מים מפכים מן הכתף הימנית\" (מ״ז, ב). ⚖️ רש״י: מעט מים, כמו שיוצאים מפך. 💡 המים עוברים מתחת לחומה בצינור מקורה, ויוצאים כאן, למרגלות החומה מדרום לשער המזרחי הסגור. מכאן הם מתחילים לגדול, ומכאן נמדדות 1000 האמות הראשונות. מקום הפתח וגודלו הם הצעה.");
      const f0=xe+0.15,Bx=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(wbox(w,h,d,2.6),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;b.userData=sp;cPick.push(b);group.add(b)};
      Bx(0.5,0.35,3.4,f0+0.2,hb+2.75,-n0,M.stone2);[-1,1].forEach(sd=>Bx(0.5,2.6,0.6,f0+0.2,hb+1.3,-n0+sd*1.4,M.stone2));Bx(0.08,2.2,2.2,f0-0.02,hb+1.4,-n0,M.dark);
      Bx(1.4,0.22,1.0,f0+0.65,hb+0.95,-n0,M.stone2);const pr=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.75),M.water2);pr.position.set(f0+1.38,hb+0.62,-n0);pr.rotation.y=Math.PI/2;pr.userData=sp;cPick.push(pr);group.add(pr);
      CL("המעיין למרגלות החומה",u500(f0),268,(hb+5)/A,sp,true)}
    const px=f0p(xe)+5.6;
    const pool=new THREE.Mesh(new THREE.CircleGeometry(5.5,28),M.river);pool.rotation.x=-Math.PI/2;pool.position.set(px,hb+0.35,-n0);pool.userData=rv;cPick.push(pool);group.add(pool);
    const fo=new THREE.Mesh(new THREE.RingGeometry(0.3,3,24),M.foam);fo.rotation.x=-Math.PI/2;fo.position.set(px-0.6,hb+0.42,-n0);group.add(fo);
    if(0){const r=rng(808),mg=new THREE.SphereGeometry(1,8,6);for(let k=0;k<7;k++){const m=new THREE.Mesh(mg,M.mist);const s=1.2+r()*1.8;m.scale.set(s,s*0.7,s);m.position.set(px-0.5+(r()-0.5)*3,hb+0.6+r()*2,-n0+(r()-0.5)*4);group.add(m)}}
    const ROCKS=[];{const r=rng(809);for(let k=0;k<18;k++){const a=k/18*Math.PI*2,rr=5.6+r()*1.4;ROCKS.push([px+Math.cos(a)*rr,hb+0.1,-n0+Math.sin(a)*rr,0.5+r()*0.9])}}
    // follow the slope down to the Kidron (steepest descent), then the Kidron south
    let g0=S2G(px+5,n0),cur=[g0[0],g0[1]],dir=(()=>{const e=S2G(1,0),z=S2G(0,0);return[e[0]-z[0],e[1]-z[1]]})();const gp=[cur.slice()];
    const kidD=(x,n)=>segDist(x,n,KIDRON)[0];
    for(let it=0;it<160&&kidD(cur[0],cur[1])>6;it++){let best=null,bh=1e9;const h0=H(cur[0],cur[1]);
      for(let a=0;a<16;a++){const an=a/16*Math.PI*2,dx=Math.cos(an),dn=Math.sin(an),x=cur[0]+dx*5,n=cur[1]+dn*5;if(inPoly(x,n,MOUNT_BIG))continue;const g2=G2S(x,n),hh=H(x,n)+(1-(dx*dir[0]+dn*dir[1]))*(it<10?40:3)+(inPoly(g2[0]+0,g2[1],MOUNT_S)?1e6:0);if(hh<bh){bh=hh;best=[x,n,dx,dn]}}
      if(!best)break;cur=[best[0],best[1]];dir=[dir[0]*0.5+best[2]*0.5,dir[1]*0.5+best[3]*0.5];const l=Math.hypot(dir[0],dir[1])||1;dir=[dir[0]/l,dir[1]/l];gp.push(cur.slice())}
    let bi=0,bd=1e9;for(let i=0;i<KIDRON.length;i++){const d2=Math.hypot(KIDRON[i][0]-cur[0],KIDRON[i][1]-cur[1]);if(d2<bd&&KIDRON[i][1]<=cur[1]+10){bd=d2;bi=i}}
    for(let i=bi;i<KIDRON.length&&KIDRON[i][1]>-1150;i++)gp.push([KIDRON[i][0],KIDRON[i][1]]);
    let P=gp;for(let it=0;it<3;it++){const q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75])}q.push(P[P.length-1]);P=q}
    const R=[P[0]];let acc=0;for(let i=1;i<P.length;i++){const a=R[R.length-1],b=P[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(l>=4)R.push(b)}
    const pts=[],wid=[],AC=[];acc=0;R.forEach((q,i)=>{if(i)acc+=Math.hypot(q[0]-R[i-1][0],q[1]-R[i-1][1]);const sq=G2S(q[0],q[1]);pts.push([sq[0],H(q[0],q[1]),-sq[1]]);AC.push(acc);wid.push(2.6+24*(1-Math.exp(-acc/(1600*A))))});
    // roads near the stream: where one crosses, the water goes under it in a culvert
    let bx0=1e9,bx1=-1e9,bn0=1e9,bn1=-1e9;R.forEach(q=>{bx0=Math.min(bx0,q[0]);bx1=Math.max(bx1,q[0]);bn0=Math.min(bn0,q[1]);bn1=Math.max(bn1,q[1])});
    const RDN=ROADS.filter(rd=>rd.c<4&&rd.p.some(q=>q[0]>bx0-40&&q[0]<bx1+40&&q[1]>bn0-40&&q[1]<bn1+40));
    const onRoad=(x,n,pad)=>RDN.some(rd=>segDist(x,n,rd.p)[0]<rd.w/2+pad);
    const FLAG=R.map((q,i)=>onRoad(q[0],q[1],2.2+wid[i]*0.15));
    const strip=(w,lift,mat,ro)=>{const pos=[],uv=[],idx=[];let a2=0;for(let k=0;k<pts.length;k++){const p=pts[k],q=pts[Math.min(k+1,pts.length-1)],o=pts[Math.max(k-1,0)];const dx=q[0]-o[0],dz=q[2]-o[2],l=Math.hypot(dx,dz)||1,nx=-dz/l,nz=dx/l,ww=w(k)/2;if(k)a2+=Math.hypot(p[0]-pts[k-1][0],p[2]-pts[k-1][2]);
        pos.push(p[0]+nx*ww,p[1]+lift,p[2]+nz*ww,p[0]-nx*ww,p[1]+lift,p[2]-nz*ww);uv.push(0,a2/10,1,a2/10);if(k<pts.length-1&&!FLAG[k]&&!FLAG[k+1]){const b=k*2;idx.push(b,b+1,b+2,b+1,b+3,b+2)}}
      const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.renderOrder=ro;m.receiveShadow=true;m.userData=rv;cPick.push(m);group.add(m);return m};
    strip(k=>wid[k]+7,1.0,M.bank,1);strip(k=>wid[k],1.15,M.river,2);
    // culvert headwalls where the stream meets a road
    for(let k=0;k<pts.length-1;k++){if(FLAG[k]===FLAG[k+1])continue;const i=FLAG[k]?k+1:k,j=FLAG[k]?k:k+1,p=pts[i],q=pts[j],dx=q[0]-p[0],dz=q[2]-p[2],an=Math.atan2(dx,dz),w=wid[i]+3;
      const hw=new THREE.Mesh(wbox(w,2.6,0.9,2.6),M.stone2);hw.position.set(p[0]+dx*0.3,p[1]+1.1,p[2]+dz*0.3);hw.rotation.y=an;hw.castShadow=true;hw.userData=rv;cPick.push(hw);group.add(hw);
      const op=new THREE.Mesh(new THREE.CircleGeometry(Math.min(wid[i]*0.42,5),20,0,Math.PI),M.dark);op.position.set(p[0]+dx*0.3-Math.sin(an)*0.46,p[1]+1.15,p[2]+dz*0.3-Math.cos(an)*0.46);op.rotation.y=an+Math.PI;group.add(op)}
    // the four measures of Ezekiel 47:3-5
    {const MS=[[1000,"מי אפסים","\"ויעברני במים, מי אפסים\" — המים מגיעים עד הקרסוליים."],[2000,"מים ברכים","\"ויעברני במים, מים ברכים\" — עד הברכיים."],[3000,"מי מתנים","\"ויעברני, מי מתנים\" — עד המותניים."],[4000,"נחל שלא עוברים","\"נחל אשר לא אוכל לעבר, כי גאו המים, מי שחו\" — צריך לשחות."]];
      MS.forEach(([am,t,tx])=>{const d=am*A;let k=AC.findIndex(a=>a>=d);if(k<1)return;const p=pts[k],q=pts[Math.min(k+1,pts.length-1)],dx=q[0]-p[0],dz=q[2]-p[2],l=Math.hypot(dx,dz)||1,off=wid[k]/2+3,x=p[0]-dz/l*off,z=p[2]+dx/l*off,g=S2G(x,-z),hy=H(g[0],g[1]);
        const inf=I(am+" אמה: "+t,"יחזקאל מ״ז, ג-ה","📜 "+tx+" 💡 המרחק נמדד כאן מהמעיין שלמרגלות החומה.");const m=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.3,1.4,8),M.stoneL);m.position.set(x,hy+0.7,z);m.userData=inf;cPick.push(m);group.add(m);const Lb=label(am+" אמה · "+t,x,hy+3.5,z,"c",inf);Lb.m=true;cLabels.push(Lb)})}
    // "and by the river ... shall grow all trees for food" (47:12): trees on both banks
    {const r=rng(707),T=[];for(let k=2;k<pts.length;k+=1){if(r()<0.55)continue;[-1,1].forEach(sd=>{if(r()<0.35)return;const p=pts[k],q=pts[Math.min(k+1,pts.length-1)],dx=q[0]-p[0],dz=q[2]-p[2],l=Math.hypot(dx,dz)||1,off=wid[k]/2+1.8+r()*6.5;const x=p[0]-dz/l*off*sd,z=p[2]+dx/l*off*sd;const g=S2G(x,-z);if(inPoly(g[0],g[1],MOUNT_BIG)||onRoad(g[0],g[1],2))return;T.push([x,H(g[0],g[1]),z,1.6+r()*1.8])})}
      // stage 5: date palms and figs among the olives ("כל עץ מאכל", 47:12), reeds and oleanders at the water, rocks in the bed
      // topic 5: each species from the tree library (TREES5 in core/02), carobs added among the fruit trees
      const PL=[],FG=[],CB=[];for(let i=T.length-1;i>=0;i--){if(i%4===1)PL.push(T.splice(i,1)[0]);else if(i%4===3)FG.push(T.splice(i,1)[0]);else if(i%8===0)CB.push(T.splice(i,1)[0])}
      const TP=(k,a,sc)=>TREES5.plant(group,k,a.map((t,i)=>[t[0],t[1],t[2],sc(t),i*2.39]),{n:TREES5.NAMES[k]+" על גדות הנחל",r:"יחזקאל מ״ז, ז, יב",t:"📜 \"ועל הנחל יעלה על שפתו מזה ומזה כל עץ מאכל... לחדשיו יבכר\" (יחזקאל מ״ז, יב). 💡 המינים כאן: זית, תמר, תאנה וחרוב, עצי מאכל של ארץ ישראל."});
      TP("palm",PL,t=>0.75+t[3]*0.14);TP("fig",FG,t=>0.55+t[3]*0.22);TP("carob",CB,t=>0.6+t[3]*0.2);
      {const RD=[],SH=[];for(let k=1;k<pts.length;k++){if(FLAG[k])continue;const p=pts[k],q=pts[Math.min(k+1,pts.length-1)],dx=q[0]-p[0],dz=q[2]-p[2],l=Math.hypot(dx,dz)||1;[-1,1].forEach(sd=>{
          if(r()<0.75){const off=wid[k]/2+0.2+r()*1.4,cx=p[0]-dz/l*off*sd,cz=p[2]+dx/l*off*sd;for(let j=0;j<6;j++)RD.push([cx+(r()-0.5)*1.6,p[1]+1.0,cz+(r()-0.5)*1.6,1.2+r()*1.6,(r()-0.5)*0.25,(r()-0.5)*0.25])}
          if(r()<0.35){const off=wid[k]/2+1.5+r()*3,x=p[0]-dz/l*off*sd,z=p[2]+dx/l*off*sd;const g=S2G(x,-z);if(!onRoad(g[0],g[1],1.5)&&!inPoly(g[0],g[1],MOUNT_BIG))SH.push([x,H(g[0],g[1]),z,0.7+r()*0.6,r()<0.4])}
          if(r()<0.4){const off=wid[k]/2-0.4+r()*1.2;ROCKS.push([p[0]-dz/l*off*sd,p[1]+0.9,p[2]+dx/l*off*sd,0.25+r()*0.6])}})}
        const d=new THREE.Object3D(),c=new THREE.Color();
        if(RD.length){const g=new THREE.ConeGeometry(0.045,1,3);g.translate(0,0.5,0);const rm=new THREE.InstancedMesh(g,M.reed,RD.length);RD.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.scale.set(1,t[3],1);d.rotation.set(t[4],0,t[5]);d.updateMatrix();rm.setMatrixAt(i,d.matrix);c.setHSL(0.17+(i%7)*0.008,0.35,0.36+(i%5)*0.03);rm.setColorAt(i,c)});group.add(rm)}
        if(SH.length){const sm=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),M.leaf2,SH.length);SH.forEach((t,i)=>{d.position.set(t[0],t[1]+t[3]*0.6,t[2]);d.scale.set(t[3]*1.2,t[3]*0.8,t[3]*1.2);d.rotation.set(0,i,0);d.updateMatrix();sm.setMatrixAt(i,d.matrix);if(t[4])c.setRGB(0.62,0.42,0.47);else c.setHSL(0.27,0.4,0.27);sm.setColorAt(i,c)});sm.castShadow=true;group.add(sm)}
        if(ROCKS.length){const rk=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),M.rock,ROCKS.length);ROCKS.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.scale.set(t[3]*1.3,t[3]*0.7,t[3]);d.rotation.set(i*0.7,i*1.3,i*0.4);d.updateMatrix();rk.setMatrixAt(i,d.matrix)});rk.castShadow=true;rk.receiveShadow=true;group.add(rk)}}
      TP("olive",T,t=>0.55+t[3]*0.22)}
  })();
  {const g=new THREE.Group();g.name="riv";group.children.slice(rivStart).forEach(o=>g.add(o));group.add(g);g.visible=SHOW_RIVER;RIVG=g}
  }
  if(RB){group=ROOT;const dy=8.5*A;for(let i=colH;i<COL.length;i++){COL[i].y0+=dy;COL[i].y1+=dy}
    if(INT){INT.p.y+=dy;INT.t.y+=dy}if(KDS){KDS.p.y+=dy;KDS.t.y+=dy}if(INTBOX)INTBOX.y1+=dy;
    // ================= Second-Temple layout (Middot; Rambam 5) =================
    const yA=16,yI=13.5,yN=6,TH=25;   // floors (amot above Har HaBayit): azarah of priests, of Israel, women's court
    const hb=I("הר הבית","מידות ב, א; רמב״ם, הלכות בית הבחירה ה, א","500 × 500 אמה, מוקף חומה. העזרה לא באמצע: \"רוב המדה מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, ומיעוטו מן המערב\".");
    const MU0=29,MV0=82.5,MS=500;
    box(MU0,MV0,MU0+MS,MV0+MS,0,0.35,M.pave,hb,{cast:false,noCol:true,tile:9});
    // Har HaBayit wall and its five gates (Middot 1:3)
    const hw=I("חומת הר הבית","מידות א, ג","חמישה שערים היו להר הבית: שני שערי חולדה מן הדרום, קיפונוס מן המערב, טדי מן הצפון, ושער המזרחי — שעליו שושן הבירה.");
    const GW=[["n",[MU0+250],"שער טדי"],["w",[MV0+167.5],"שער קיפונוס"],["e",[250],"שער המזרח (שושן)"],["s",[MU0+190,MU0+310],"שערי חולדה"]];
    const wallSeg=(axis,c0,c1,fix)=>{if(c1-c0<0.5)return;if(axis==="n"||axis==="s"){const v=axis==="n"?MV0:MV0+MS-6;box(c0,v,c1,v+6,0,24,M.wall,hw)}else{const u=axis==="w"?MU0:MU0+MS-6;box(u,c0,u+6,c1,0,24,M.wall,hw)}};
    GW.forEach(([ax,cs,nm])=>{let a=(ax==="n"||ax==="s")?MU0:MV0,end=a+MS;const sorted=cs.slice().sort((x,y)=>x-y);sorted.forEach(c=>{wallSeg(ax,a,c-5);a=c+5});wallSeg(ax,a,end);
      sorted.forEach(c=>{const gi=I(nm,"מידות א, ג; רמב״ם, הלכות בית הבחירה ה, ב","רוחב 10 אמות וגובה 20, ולו דלתות.");if(ax==="n"||ax==="s"){const v=ax==="n"?MV0:MV0+MS-6;box(c-5,v,c+5,v+6,20,24,M.wall,gi);box(c-6.5,v-1,c-5,v+7,0,26,M.stoneL,gi);box(c+5,v-1,c+6.5,v+7,0,26,M.stoneL,gi);CL(nm,c,v+3,28)}else{const u=ax==="w"?MU0:MU0+MS-6;box(u,c-5,u+6,c+5,20,24,M.wall,gi);box(u-1,c-6.5,u+7,c-5,0,26,M.stoneL,gi);box(u-1,c+5,u+7,c+6.5,0,26,M.stoneL,gi);CL(nm,u+3,c,28)}})});
    // courts
    const AZ={u0:89,u1:276,v0:182.5,v1:317.5},EN={u0:281,u1:416},WT=5;
    // soreg (10 tefachim) and chel (10 amot) around the courts (Middot 2:3)
    {const so=I("הסורג והחיל","מידות ב, ג; רמב״ם, הלכות בית הבחירה ה, ג","הסורג: גדר סבכה בגובה 10 טפחים, שעד כאן מותר לנכרים ולטמאי מתים להיכנס. לפנים ממנו החיל — רחבה של 10 אמות. בסורג היו 13 פרצות שגדרום, וכנגדן 13 השתחוויות.");
      const su0=AZ.u0-WT-10,su1=EN.u1+WT+10,sv0=AZ.v0-WT-10,sv1=AZ.v1+WT+10,hs=10/6;
      box(su0,sv0,su1,sv1,0.35,0.6,M.pave,so,{cast:false,noCol:true,tile:9});
      const fence=(a0,a1,fixed,alongU)=>{for(let a=a0;a<a1;a+=1.2){const q=alongU?W(a,fixed):W(fixed,a);const m=new THREE.Mesh(new THREE.BoxGeometry(alongU?0.9*A:0.12*A,hs*A,alongU?0.12*A:0.9*A),M.wood);m.position.set(q[0],(0.6+hs/2)*A,q[1]);group.add(m)}};
      [[su0,MU0+235],[MU0+265,su1]].forEach(([a,b])=>fence(a,b,sv0,true));[[su0,226],[MU0+265,su1]].forEach(([a,b])=>fence(a,b,sv1,true));[[sv0,240],[260,sv1]].forEach(([a,b])=>{fence(a,b,su0,false);fence(a,b,su1,false)});
      {const L=[["he","לא יבוא איש נכרי","לפנים מן הסורג","ולא טמא מת אל החיל"],["el","ΜΗΘΕΝΑ ΑΛΛΟΓΕΝΗ","ΕΙΣΠΟΡΕΥΕΣΘΑΙ ΕΝΤΟΣ ΤΟΥ","ΠΕΡΙ ΤΟ ΙΕΡΟΝ ΤΡΥΦΑΚΤΟΥ"],["la","NE QVIS ALIENIGENA","INTRA CANCELLOS","INGREDIATVR"],["en","NO FOREIGNER","MAY ENTER WITHIN","THE BALUSTRADE"]];
        const mat={};L.forEach(([id,...t])=>{const c=cv(256,320,(x,w,h)=>{x.fillStyle="#ece4d2";x.fillRect(0,0,w,h);noiseFill(x,w,h,14,40+id.length);x.strokeStyle="rgba(120,105,80,.6)";x.lineWidth=5;x.strokeRect(12,12,w-24,h-24);x.fillStyle="#5b4a33";x.textAlign="center";x.direction=id==="he"?"rtl":"ltr";
          t.forEach((ln,i)=>{let fs=id==="he"?34:26;x.font=(id==="he"?"bold ":"")+fs+"px serif";while(x.measureText(ln).width>w-44&&fs>12){fs--;x.font=(id==="he"?"bold ":"")+fs+"px serif"}x.fillText(ln,w/2,110+i*58)})});mat[id]=new THREE.MeshStandardMaterial({map:tex(c,true),roughness:0.9})});
        const wn=I("שלטי האזהרה שליד הסורג","מידות ב, ג; כלים א, ח; יוספוס, מלחמות ה, ה, ב","⚖️ לפנים מן הסורג אסור לנכרים ולטמאי מתים להיכנס. 💡 יוספוס כותב שעמדו כאן אבנים עם אזהרה ביוונית ובלטינית, ואבן כזאת ביוונית נמצאה ב־1871. כאן יש שלטים בעברית, ביוונית, בלטינית ובאנגלית — הנוסח העברי והאנגלי הם הצעה.");
        const stele=(u,v,face,id)=>{const q=W(u,v),g=new THREE.Group();g.position.set(q[0],0.6*A,q[1]);g.rotation.y=face;const st=new THREE.Mesh(rbox(1.5*A,2.3*A,0.35*A,3.2),M.stoneL);st.position.y=1.15*A;st.castShadow=true;st.userData=wn;cPick.push(st);g.add(st);
          const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.2*A,1.5*A),mat[id]);pl.position.set(0,1.3*A,0.18*A);g.add(pl);group.add(g)};
        stele(MU0+233,sv0-1.4,Math.PI,"he");stele(MU0+267,sv0-1.4,Math.PI,"el");stele(224,sv1+1.4,0,"la");stele(MU0+267,sv1+1.4,0,"he");stele(su1+1.4,238,Math.PI/2,"en");stele(su1+1.4,262,Math.PI/2,"el");stele(su0-1.4,238,-Math.PI/2,"he");stele(su0-1.4,262,-Math.PI/2,"la")}
      CL("הסורג",(su0+su1)/2,sv0-1,4,I("הסורג","מידות ב, ג; רמב״ם, הלכות בית הבחירה ה, ג","⚖️ גדר סבכה נמוכה, 10 טפחים, מסביב לעזרות. עד כאן מותר לנכרים ולטמאי מתים להיכנס. בסורג היו 13 פרצות, וכנגדן 13 השתחוויות."),false);
      CL("החיל",(su0+su1)/2,sv0+5,4,I("החיל","מידות ב, ג; רמב״ם, הלכות בית הבחירה ה, ג","⚖️ רחבה של 10 אמות בין הסורג לחומת העזרות. טבול יום לא נכנס לשם (כלים א, ח)."),false)}
    // azarah (raised) and its walls
    const az=I("העזרה","מידות ה, א; רמב״ם, הלכות בית הבחירה ה, ד; ה, יג-יד","187 אמה ממזרח למערב ו־135 מצפון לדרום: 11 אמות אחורי בית הכפורת, 100 ההיכל, 22 בין האולם למזבח, 32 המזבח, 11 עזרת כהנים ו־11 עזרת ישראל. עזרת כהנים גבוהה מעזרת ישראל 2.5 אמות.");
    box(AZ.u0,AZ.v0,265,AZ.v1,0,yA,M.pave,az,{tile:9});box(265,AZ.v0,AZ.u1,AZ.v1,0,yI,M.pave,I("עזרת ישראל","מידות ב, ו; ה, א","11 אמות — מקום דריסת רגלי ישראל, נמוכה מעזרת כהנים 2.5 אמות. הדוכן מפריד ביניהן."),{tile:9});
    const aw=I("כותלי העזרה","מידות א-ב","הגובה לא מפורש; כאן כ־25 אמה מעל רצפת העזרה, בהערכה.");
    const azG={n:[110,150,190],s:[110,150,190]};
    const hwall=(u0,u1,v0,v1,gates,alongU,y1)=>{let a=alongU?u0:v0;const e=alongU?u1:v1;gates.slice().sort((x,y)=>x-y).forEach(c=>{if(alongU)box(a,v0,c-5,v1,0,y1,M.wall,aw);else box(u0,a,u1,c-5,0,y1,M.wall,aw);if(alongU)box(c-5,v0,c+5,v1,y1-5,y1,M.wall,aw);else box(u0,c-5,u1,c+5,y1-5,y1,M.wall,aw);a=c+5});if(alongU)box(a,v0,e,v1,0,y1,M.wall,aw);else box(u0,a,u1,e,0,y1,M.wall,aw)};
    hwall(AZ.u0-WT,AZ.u1+WT,AZ.v0-WT,AZ.v0,azG.n,true,yA+TH);hwall(AZ.u0-WT,228,AZ.v1,AZ.v1+WT,azG.s,true,yA+TH);hwall(268,AZ.u1+WT,AZ.v1,AZ.v1+WT,[],true,yA+TH);box(228,AZ.v1,268,AZ.v1+WT,29.3,yA+TH,M.wall,aw);
    {const gz=I("לשכת הגזית — חציה בקודש וחציה בחול","מידות ה, ד; יומא כה ע״א","⚖️ \"לשכת הגזית... חציה בקודש וחציה בחול, ולה שני פתחים, אחד לקודש ואחד לחול\" (יומא כה ע״א). 💡 כאן החצי שבחול בנוי על במה מעל החיל, ויורדים ממנו במדרגות אל הר הבית.");
      box(228,AZ.v1,268,AZ.v1+34,0,12,M.wall,gz);for(let q=0;q<24;q++)box(244,AZ.v1+34+q,252,AZ.v1+35+q,0,12-q*0.5,M.stone2,gz,{noCol:true})}
    hwall(AZ.u0-WT,AZ.u0,AZ.v0,AZ.v1,[],false,yA+TH);hwall(AZ.u1,AZ.u1+WT,AZ.v0,AZ.v1,[250],false,yA+TH);
    const GN=["שער הניצוץ","שער הקרבן","שער בית המוקד"],GS=["שער הדלק","שער הבכורות","שער המים"];
    azG.n.forEach((u,k)=>{const s0=k===2?26:0;box(u-5,AZ.v0-WT,u+5,AZ.v0,0,yA,M.pave,null,{noCol:true});for(let q=0;q<32;q++)box(u-5,AZ.v0-WT-s0-q-1,u+5,AZ.v0-WT-s0-q,0,yA*(32-q)/32,M.stone2,null,{noCol:true});CL(GN[k],u,AZ.v0-2,yA+TH+3)});
    azG.s.forEach((u,k)=>{box(u-5,AZ.v1,u+5,AZ.v1+WT,0,yA,M.pave,null,{noCol:true});for(let q=0;q<32;q++)box(u-5,AZ.v1+WT+q,u+5,AZ.v1+WT+q+1,0,yA*(32-q)/32,M.stone2,null,{noCol:true});CL(GS[k],u,AZ.v1+2,yA+TH+3)});
    // Nicanor gate and the 15 steps (Middot 2:5-6)
    {const nk=I("שער ניקנור","מידות ב, ג; ב, ו; רמב״ם, הלכות בית הבחירה ה, ה","השער המזרחי של העזרה, בין עזרת נשים לעזרת ישראל. דלתותיו נחושת שמבהיקה כזהב — בגלל הנס שנעשה לניקנור. לפניו 15 מעלות בחצי עיגול, כנגד 15 \"שיר המעלות\", ועליהן עמדו הלוויים ושרו.");
      box(AZ.u1,245,AZ.u1+WT,255,0,yI,M.pave,null,{noCol:true});box(AZ.u1-0.5,243.5,AZ.u1+0.2,245,yI,yI+20,M.bronze,nk,{noCol:true});box(AZ.u1-0.5,255,AZ.u1+0.2,256.5,yI,yI+20,M.bronze,nk,{noCol:true});
      for(let k=0;k<15;k++){const R=(6+(15-k))*A,h=(k+1)*0.5*A,m=new THREE.Mesh(new THREE.CylinderGeometry(R,R,h,48,1,false,0,Math.PI),M.marble),q=W(EN.u0,250);m.position.set(q[0],yN*A+h/2,q[1]);m.castShadow=true;m.receiveShadow=true;m.userData=nk;cPick.push(m);group.add(m)}
      CL("שער ניקנור",EN.u0+0.6,250,yA+TH-6);CL("15 המעלות",EN.u0+8,250,yN+5,I("חמש עשרה המעלות","מידות ב, ה; רמב״ם, הלכות בית הבחירה ה, ג","📜 \"וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר\". ⚖️ הן עגולות כחצי גורן, וכל מעלה גבוהה חצי אמה."),false)}
    // women's court with its four roofless corner chambers (Middot 2:5)
    {const en=I("עזרת נשים","מידות ב, ה; רמב״ם, הלכות בית הבחירה ה, ז-ט","135 × 135 אמה, גבוהה מהר הבית 6 אמות (12 מעלות של חצי אמה). בארבע פינותיה לשכות של 40 × 40 בלי גג, ומסביב גזוזטראות — שהנשים רואות מלמעלה והאנשים מלמטה, ולא יהיו מעורבים.");
      box(EN.u0,AZ.v0,EN.u1,AZ.v1,0,yN,M.pave,en,{tile:9});
      hwall(EN.u0,EN.u1+WT,AZ.v0-WT,AZ.v0,[],true,yN+20);hwall(EN.u0,EN.u1+WT,AZ.v1,AZ.v1+WT,[],true,yN+20);hwall(EN.u1,EN.u1+WT,AZ.v0,AZ.v1,[250],false,yN+20);
      box(EN.u1,245,EN.u1+WT,255,0,yN,M.pave,null,{noCol:true});for(let k=0;k<12;k++)box(EN.u1+WT+k,242,EN.u1+WT+k+1,258,0,yN-k*0.5,M.stone2,null,{noCol:true});
      const LS=[["לשכת הנזירים","דרום־מזרח: שם הנזירים מבשלים את שלמיהם ומגלחים",EN.u1-40,AZ.v1-40],["לשכת דיר העצים","צפון־מזרח: כהנים בעלי מומים מתליעים את העצים",EN.u1-40,AZ.v0],["לשכת המצורעים","צפון־מערב: שם טובלים המצורעים",EN.u0,AZ.v0],["לשכת בית שמניה","דרום־מערב: שם נותנים יין ושמן",EN.u0,AZ.v1-40]];
      LS.forEach(([nm,tx,u,v])=>{const li=I(nm,"מידות ב, ה",tx+". לשכות בלי גג — \"וכן הן עתידות להיות\".");hroom(u,v,u+40,v+40,yN,yN+10,M.stoneL,li,{side:v===AZ.v0?"v1":"v0",c:u+20,w:4,h:6.5,nm},{t:1.2,open:true});CL(nm,u+20,v+20,yN+13)});
      [[EN.u0+40,EN.u1-40,AZ.v0+0.3,AZ.v0+5],[EN.u0+40,EN.u1-40,AZ.v1-5,AZ.v1-0.3]].forEach(r=>box(r[0],r[2],r[1],r[3],yN+9,yN+10,M.wood,I("הגזוזטרא","מידות ב, ה; סוכה נא ע״ב","מרפסת מסביב לעזרת נשים — \"תיקון גדול\" לשמחת בית השואבה."),{noCol:true}));
      CL("עזרת נשים",(EN.u0+EN.u1)/2,250,yN+16,null,false)}
    // chambers of the azarah (Middot 5:3-4; Rambam 5:17-18) and Beit HaMoked
    {const ch=[["לשכת הגולה","בדרום: שם הבור והגלגל, ומשם מספקים מים לכל העזרה",212,AZ.v1-10,15.5,10],["לשכת העץ","בדרום: לשכת כהן גדול",196,AZ.v1-10,15.5,10],
       ["לשכת המלח","בצפון: שם נותנים מלח לקרבן",206,AZ.v0,18,10],["לשכת הפרוה","בצפון: שם מולחים עורות הקדשים, ועל גגה בית הטבילה לכהן גדול ביום הכיפורים",226,AZ.v0,18,10],["לשכת המדיחין","בצפון: שם מדיחים קרבי הקדשים",246,AZ.v0,18,10]];
      ch.forEach(([nm,tx,u,v,w,d])=>{const li=I(nm,"מידות ה, ג-ד; רמב״ם, הלכות בית הבחירה ה, יז-יח",tx+".");hroom(u,v,u+w,v+d,yA,yA+14,M.stoneL,li,{side:v===AZ.v0?"v1":"v0",c:u+w/2,nm},{yB:0,roof:true});CL(nm,u+w/2,v+d/2,yA+17)});
      const bm=I("בית המוקד","מידות א, ו-ח; רמב״ם, הלכות בית הבחירה ה, ט-יב","בצפון העזרה, בנוי כיפה, ורובדין של אבן מסביב. שם ישנו זקני בית אב. בו ארבע לשכות: הטלאים, עושי לחם הפנים, אבני המזבח ששיקצום מלכי יוון, ומדרגות למקווה שמתחת לבית.");
      const b0=AZ.v0-WT-26,b1=AZ.v0-WT,yT=yA+16,pd=I("שני הפתחים של בית המוקד","מידות א, ז; תמיד א, א","📜 \"ושני פתחים היו לבית המוקד, אחד פתוח לחיל ואחד פתוח לעזרה\". ⚖️ הפתח הצפוני יוצא אל החיל, והפתח הדרומי הוא שער בית המוקד שבכותל העזרה.");
      box(175,b0,205,b1,0,yA,M.stoneL,bm);box(175,b0,185,b0+1.5,yA,yT,M.stoneL,bm);box(195,b0,205,b0+1.5,yA,yT,M.stoneL,bm);box(185,b0,195,b0+1.5,yA+10,yT,M.stoneL,pd);
      box(175,b0+1.5,176.5,b1,yA,yT,M.stoneL,bm);box(203.5,b0+1.5,205,b1,yA,yT,M.stoneL,bm);box(174.7,b0-0.3,205.3,b1,yT,yT+0.8,M.stone2,null,{noCol:true});
      [[176.5,b0+1.5,184,b0+3],[196,b0+1.5,203.5,b0+3],[176.5,b0+3,178,b1],[202,b0+3,203.5,b1]].forEach(r=>box(r[0],r[1],r[2],r[3],yA,yA+1,M.stone2,I("הרובדין שבבית המוקד","מידות א, ח; תמיד א, א","📜 \"ורובדין של אבן היו מקיפין אותו\" — ספסלי אבן, ועליהם ישנו זקני בית אב."),{noCol:true}));
      box(177,b0+4,181,b0+8,yA,yA+0.05,M.dark,I("הירידה לבית הטבילה","מידות א, ו; א, ט; תמיד א, א","📜 בלשכה שבצפון־מערב יורדים במסיבה ההולכת תחת הבירה לבית הטבילה. 💡 כאן רואים רק את פי המדרגות."),{cast:false,noCol:true});
      const dm=new THREE.Mesh(new THREE.SphereGeometry(14.5*A,24,12,0,Math.PI*2,0,Math.PI/2),M.white);const q=W(190,(b0+b1)/2);dm.position.set(q[0],(yT+0.8)*A,q[1]);dm.userData=bm;cPick.push(dm);group.add(dm);CL("בית המוקד",190,(b0+b1)/2,yT+17);window.__CHD.push({nm:"בית המוקד",u:190,v:b0,ax:"v",s:-1,y:yA,yo:yA,w:10,dp:26});CL("פתח לחיל",190,b0-0.6,yA+11,pd,false)}
    {const ba=I("בית אבטינס","יומא יט ע״א; תמיד א, א; מידות א, א","⚖️ עלייה שבה עשו את הקטורת, ושם שמרו הכהנים בלילה (אחד משלושת מקומות השמירה של הכהנים). 💡 לפי כמה מפרשים היא בדרום, ליד שער המים; המקום והגודל כאן הצעה.");
      hroom(197,AZ.v1-1,215,AZ.v1+WT+1,yA+TH,yA+TH+9,M.stoneL,ba,{side:"u0",c:AZ.v1+WT/2,w:3,h:5,nm:"בית אבטינס"});{const sa=I("המדרגות לבית אבטינס","מידות א, א; תמיד א, א; יומא יט ע״א","📜 \"בית אבטינס ובית הניצוץ עליות היו, והרובים שומרים שם\" (מידות א, א). 💡 המשנה לא אומרת איך עולים לעלייה. כאן מדרגות לאורך כותל העזרה, בין שער הבכורות לשער המים, עד ראש החומה, ומשם הולכים על החומה אל הפתח.");const n=Math.round(TH/0.5),u0=155,u1=184,tr=(u1-u0)/n;for(let k=0;k<n;k++)box(u0+k*tr,AZ.v1-3,u0+(k+1)*tr,AZ.v1,yA,yA+(k+1)*0.5,k%2?(M.stepD||M.stone2):M.stone2,k?null:sa);box(u1,AZ.v1-3,185,AZ.v1,yA,yA+TH,M.stone2,sa)}box(196.7,AZ.v1-1.3,215.3,AZ.v1+WT+1.3,yA+TH+9,yA+TH+9.6,M.stone2,null);box(205,AZ.v1+WT+1,207,AZ.v1+WT+1.08,yA+TH+1,yA+TH+5,M.win2,null,{cast:false,noCol:true});CL("בית אבטינס",206,AZ.v1+2,yA+TH+13,ba)}
    {const bm2=I("לשכות בית המוקד","מידות א, ו","⚖️ \"ארבע לשכות היו לבית המוקד\": לשכת הטלאים (בדרום־מערב), לשכת עושי לחם הפנים (בדרום־מזרח), לשכה שגנזו בה בני חשמונאי את אבני המזבח (בצפון־מזרח), ולשכה שיורדים ממנה לבית הטבילה (בצפון־מערב).");
      CL("לשכת הטלאים",181,AZ.v0-WT-4,yA+5,bm2);CL("לשכת עושי לחם הפנים",199,AZ.v0-WT-4,yA+5,bm2)}
    {const sf=I("שלושה עשר שופרות","שקלים ו, א; ו, ה; רמב״ם, הלכות שקלים ב, ב","⚖️ \"שלשה עשר שופרות היו במקדש\" — תיבות צרות מלמעלה ורחבות מלמטה. על כל אחת כתוב למה התרומה: תקלין חדתין, תקלין עתיקין, קינין, גוזלי עולה, עצים, לבונה, זהב לכפורת, ושש לנדבה. 💡 המקום כאן בעזרת נשים — הצעה.");
      for(let k=0;k<13;k++){const u=333+k*2.4;cyl(u,AZ.v0+7,yN,yN+1.4,0.32,0.1,M.bronze,sf,10);cyl(u,AZ.v0+7,yN+1.4,yN+1.55,0.11,0.11,M.dark,null,8)}CL("13 שופרות",348,AZ.v0+7,yN+5,sf)}
    CL("עזרת כהנים",120,300,yA+3);CL("עזרת ישראל",270,300,yI+3);const dkI=I("הדוכן","מידות ב, ו; ערכין ב, ו; רמב״ם, הלכות בית הבחירה ה, ד","📜 עזרת כהנים גבוהה מעזרת ישראל שתי אמות ומחצה, והדוכן נתון עליה: אמה, ועליו שלוש מעלות של חצי אמה (מידות ב, ו). כאן עמדו הלוויים ושרו בשעת הקרבן. 💡 באמצע, מול המזבח, יש מעבר במדרגות לכהנים.");[[AZ.v0+1,240],[260,AZ.v1-1]].forEach(([a,b])=>{box(267,a,268,b,yI,yI+1,M.stoneL,dkI,{noCol:true});box(266,a,267,b,yI,yI+1.5,M.stone2,dkI,{noCol:true});box(265,a,266,b,yI,yI+2,M.stone2,dkI,{noCol:true})});for(let k=0;k<5;k++)box(265+k,240,266+k,260,yI,yA-k*0.5,M.stone2,null,{noCol:true});CL("הדוכן",266,230,yI+5,I("הדוכן","מידות ב, ו; ערכין ב, ו; רמב״ם, הלכות בית הבחירה ה, ד","⚖️ במה של הלוויים בין עזרת ישראל לעזרת כהנים: גבוהה אמה, ועליה שלוש מעלות של חצי אמה. כאן הלוויים שרים ומנגנים בשעת הקרבן — \"אין פוחתין משנים עשר לויים עומדין על הדוכן\"."),false);
    // people in the courts
    if(SHOW_PEOPLE){const r=rng(303),P=[];const bodyG=new THREE.LatheGeometry([[0,0],[0.3,0],[0.26,0.4],[0.21,0.95],[0.25,1.25],[0.2,1.38],[0.07,1.45],[0,1.45]].map(q=>new THREE.Vector2(q[0],q[1])),10).translate(0,-0.725,0),headG=new THREE.SphereGeometry(0.12,7,5);
      for(let k=0;k<(SMALL?260:520);k++){const z=r();let u,v,y;if(z<0.45){u=EN.u0+5+r()*125;v=AZ.v0+45+r()*45;y=yN}else if(z<0.6){u=266+r()*9;v=AZ.v0+5+r()*125;y=yI}else if(z<0.75){u=200+r()*60;v=AZ.v0+5+r()*125;y=yA;if(u>222&&u<256&&v>239&&v<308)continue}else{u=MU0+20+r()*460;v=MV0+20+r()*460;y=0.35;if(u>AZ.u0-30&&u<EN.u1+30&&v>AZ.v0-30&&v<AZ.v1+30)continue}P.push([u,v,y,z>0.6&&z<0.75])}
      const pal=[0x6b5b4a,0x3e4a5c,0x8a7a62,0x5c3f3a,0xa89a84,0x2f3a2e,0x7b6c8a],bm=new THREE.InstancedMesh(bodyG,M.people,P.length),hm=new THREE.InstancedMesh(headG,M.people,P.length),d=new THREE.Object3D(),c=new THREE.Color();
      P.forEach((p,i)=>{const w=W(p[0],p[1]);d.position.set(w[0],p[2]*A+0.72,w[1]);d.updateMatrix();bm.setMatrixAt(i,d.matrix);c.setHex(p[3]?0xf6f4ee:pal[i%pal.length]);bm.setColorAt(i,c);d.position.y=p[2]*A+1.52;d.updateMatrix();hm.setMatrixAt(i,d.matrix);c.setHex(p[3]?0xf6f4ee:0xb38b6d);hm.setColorAt(i,c)});group.add(bm,hm)}
    {const am=I("האמה — הניקוז לנחל קדרון","מידות ג, ב; ג, ו; יומא נח ע״ב; מעילה ג, ג","⚖️ הדם והנסכים יורדים בשיתין אל מתחת למזבח, ומשם \"מתערבין באמה ויוצאין לנחל קדרון\", ונמכרים לגננים לזבל. אמת מים עוברת בעזרה ויוצאת תחת שער המים. 💡 כאן התעלה מכוסה באבנים ויש בה סבכות קטנות — ניקוז נסתר כמו היום. המסלול המדויק בהערכה.");const run=(u0,v0,u1,v1)=>{box(u0,v0,u1,v1,yA,yA+0.03,M.stone2,am,{cast:false,noCol:true,tile:2});const L=Math.max(u1-u0,v1-v0);for(let k=3;k<L;k+=6){const a=u1-u0>v1-v0?[u0+k-0.4,v0+0.1,u0+k+0.4,v1-0.1]:[u0+0.1,v0+k-0.4,u1-0.1,v0+k+0.4];box(a[0],a[1],a[2],a[3],yA+0.03,yA+0.05,M.iron,am,{cast:false,noCol:true})}};
      run(222.4,274.6,223.6,306);run(190,305,223.6,306.2);run(189.4,306.2,190.6,AZ.v1);CL("האמה",206,305.6,yA+2,am)}
    // gates of the Middot plan for the gate tour
    {const P=(cu,cv,axis,outward,L,n,y0,floor,nm)=>GLIST.push({axis,cu,cv,floor,outward,n,y0,L,pass:10,nm,hw:5});
      azG.n.forEach((u,k)=>k===2?P(u,AZ.v0-15.5,"n",-1,31,32,0,yA,GN[k]+" (דרך בית המוקד)"):P(u,AZ.v0-WT/2,"n",-1,WT,32,0,yA,GN[k]));azG.s.forEach((u,k)=>P(u,AZ.v1+WT/2,"n",1,WT,32,0,yA,GS[k]));
      P(AZ.u1+WT/2,250,"e",1,WT,15,yN,yI,"שער ניקנור");P(EN.u1+WT/2,250,"e",1,WT,12,0,yN,"שער עזרת נשים");
      P(MU0+250,MV0+3,"n",-1,6,0,0,0.35,"שער טדי (חומת 500 האמה)");P(MU0+3,MV0+167.5,"e",-1,6,0,0,0.35,"שער קיפונוס (חומת 500 האמה)");P(MU0+MS-3,250,"e",1,6,0,0,0.35,"שער המזרח — שושן (חומת 500 האמה)");
      P(MU0+190,MV0+MS-3,"n",1,6,0,0,0.35,"שער חולדה המערבי (חומת 500 האמה)");P(MU0+310,MV0+MS-3,"n",1,6,0,0,0.35,"שער חולדה המזרחי (חומת 500 האמה)")}
    CL("הבית",150,250,114+8.5,null,false);CL("המזבח",238,259,yA+14,null,false);
  }
  if(!RB){
  // people
  if(SHOW_PEOPLE){
    const r=rng(101),list=[];const inCOL=(u,v,yA)=>{const w=W(u,v),y=yA*A;for(const c of COL){if(w[0]>c.x0-0.4&&w[0]<c.x1+0.4&&w[1]>c.z0-0.4&&w[1]<c.z1+0.4&&c.y1>y+0.3&&c.y0<y+1.6)return true}return false};
    for(let k=0;k<(SMALL?600:1000);k++){const u=10+r()*480,v=10+r()*480;if(u<100&&v>190&&v<310)continue;if(u>95&&u<305&&v>140&&v<360)continue;if(u>230&&u<355&&v>230&&v<270)continue;if(u>225&&u<275&&(v<55||v>445))continue;if(inCOL(u,v,3.5))continue;list.push([u,v,3.5,0])}
    list.push([186,250,13.56,1]);
    for(let k=0;k<70;k++){const u=205+r()*90,v=205+r()*90;if(Math.abs(u-250)<17&&Math.abs(v-250)<17)continue;if(u>240&&u<260&&v>264&&v<298)continue;if(inCOL(u,v,7.5))continue;list.push([u,v,7.5,1])}
    const bodyG=new THREE.LatheGeometry([[0,0],[0.3,0],[0.26,0.4],[0.21,0.95],[0.25,1.25],[0.2,1.38],[0.07,1.45],[0,1.45]].map(q=>new THREE.Vector2(q[0],q[1])),10).translate(0,-0.725,0),headG=new THREE.SphereGeometry(0.12,7,5);
    const bm=FIG.mesh(list.length,FIG.mat(0xffffff)),hm=new THREE.InstancedMesh(headG,M.people,list.length),d=new THREE.Object3D(),c=new THREE.Color(),WKR=[];
    const pal=[0x6b5b4a,0x3e4a5c,0x8a7a62,0x5c3f3a,0xa89a84,0x2f3a2e,0x7b6c8a];
    list.forEach((p,i)=>{const w=W(p[0],p[1]);const rot=r()*6.28;d.rotation.set(0,rot,0);d.position.set(w[0],p[2]*A,w[1]);d.updateMatrix();bm.setMatrixAt(i,d.matrix);bm.setAmp(i,0);if(!p[3]&&r()<0.3){WKR.push({i,x:w[0],z:w[1],y:p[2]*A,R:2+r()*5,w:(0.2+r()*0.15)*(r()<0.5?1:-1),a:r()*6.28});bm.setAmp(i,1)}c.setHex(p[3]?0xf6f4ee:pal[i%pal.length]);bm.setColorAt(i,c);d.position.y=p[2]*A+1.52;d.updateMatrix();hm.setMatrixAt(i,d.matrix);c.setHex(p[3]?0xfbfaf6:0xb38b6d);hm.setColorAt(i,c)});
    bm.castShadow=false;group.add(bm);group.add(hm);bm.frustumCulled=hm.frustumCulled=false;
    CROWDT=(dt)=>{WKR.forEach(o=>{o.a+=o.w*dt/o.R*1.0;const x=o.x+Math.cos(o.a)*o.R,z=o.z+Math.sin(o.a)*o.R;d.rotation.set(0,-o.a+(o.w>0?-Math.PI/2:Math.PI/2),0);d.position.set(x,o.y,z);d.updateMatrix();bm.setMatrixAt(o.i,d.matrix);d.position.y=o.y+1.56;d.updateMatrix();hm.setMatrixAt(o.i,d.matrix)});bm.instanceMatrix.needsUpdate=hm.instanceMatrix.needsUpdate=true};
    const r2=rng(202),pl=[];const mx=MOUNT_S.map(q=>q[0]),mn=MOUNT_S.map(q=>q[1]),bx0=Math.min(...mx),bx1=Math.max(...mx),bn0=Math.min(...mn),bn1=Math.max(...mn);for(let k=0;k<900;k++){const x=bx0+r2()*(bx1-bx0),n=bn0+r2()*(bn1-bn0);if(!inPoly(x,n,MOUNT_S))continue;const u=(x-X0)/A,v=(N0-n)/A;if(u>-14&&u<514&&v>-14&&v<514)continue;pl.push([x,0,n])}
    for(let k=0,t=0;k<260&&t<4000;t++){const x=-182+r2()*96,n=-248+r2()*133;if(!inPoly(x,n,PLAZA))continue;const q=G2S(x,n);pl.push([q[0],PLZ+0.4,q[1]]);k++}
    const b2=FIG.mesh(pl.length,FIG.mat(0xffffff)),h2=new THREE.InstancedMesh(headG,M.people,pl.length);
    pl.forEach((p,i)=>{b2.setAmp(i,0);d.rotation.set(0,r2()*6.28,0);d.position.set(p[0],p[1],-p[2]);d.updateMatrix();b2.setMatrixAt(i,d.matrix);c.setHex(pal[(i*3)%pal.length]);b2.setColorAt(i,c);d.position.y=p[1]+1.52;d.updateMatrix();h2.setMatrixAt(i,d.matrix);c.setHex(0xb38b6d);h2.setColorAt(i,c)});
    group.add(b2);group.add(h2);
  }
  ACTS=buildActors(W);
  const findI=k=>{const o=cPick.find(m=>m.userData&&m.userData.n===k)||cPick.find(m=>m.userData&&m.userData.n&&m.userData.n.indexOf(k)>=0);return o?o.userData:{n:k,r:"",t:""}};
  const KEYS={"הבית":"הבית","המזבח":"המזבח","שער צפון":"השער החיצוני הצפוני","שער דרום":"השער החיצוני הדרומי","שער המזרח (שושן) · סגור":"שער המזרח — שער שושן","לשכות הכהנים":"לשכות"};
  const cl=(t,u,v,y)=>{const p=W(u,v);cLabels.push(label(t,p[0],y*A,p[1],"c",findI(KEYS[t]||t)))};
  cl("הבית",150,250,114);cl("המזבח",250,250,27);const gy=GATE==="high"?66:26;cl("שער צפון",250,25,gy);cl("שער דרום",250,475,gy);cl("שער המזרח (שושן) · סגור",490,250,gy);cl("לשכות הכהנים",150,170,32);
  (function(){const mg=I("המגרש","יחזקאל מ״ה, ב","\"וחמשים אמה מגרש לו סביב\" — 50 אמה פנויות סביב המקדש. לכן לא בונים כאן כלום.");
    const mat=M.pave;
    const tiles=[];const add=(u0,v0,u1,v1)=>{for(let u=u0;u<u1;u+=10)for(let v=v0;v<v1;v+=10){const q=W(u+5,v+5);if(inPoly(q[0],-q[1],MOUNT_S))tiles.push(q)}};
    add(-50,-50,550,0);add(-50,500,550,550);add(-50,0,0,500);add(500,0,550,500);
    const tm=new THREE.InstancedMesh(new THREE.BoxGeometry(10*A,0.06,10*A),mat,Math.max(1,tiles.length)),dd=new THREE.Object3D();tiles.forEach((q,i)=>{dd.position.set(q[0],0.03,q[1]);dd.updateMatrix();tm.setMatrixAt(i,dd.matrix)});tm.count=tiles.length;tm.receiveShadow=true;tm.userData=mg;cPick.push(tm);group.add(tm)})();
  (function(){const si=I("סטווים — אכסדראות לאורך החומה","הצעה של התוכנית; יוספוס, קדמוניות ט״ו","שורות עמודים מקורות לאורך חומות ההר, לצל ולהמתנה לפי משמרות. בימי בית שני היו סטווים כאלה סביב ההר, והסטיו המלכותי בדרום. הם נמצאים מחוץ למתחם ומחוץ למגרש של 50 אמה.");
    const colG=new THREE.CylinderGeometry(0.55,0.65,9,12),cols=[],d=new THREE.Object3D();
    const stoa=(a,b,inward,depth,h)=>{const dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn),ux=dx/L,un=dn/L,nx=-un*inward,nn=ux*inward,ang=Math.atan2(dn,dx);
      const cx=(a[0]+b[0])/2+nx*depth/2,cn=(a[1]+b[1])/2+nn*depth/2;
      const roof=new THREE.Mesh(wbox(L-8,1.2,depth+1,4),M.stoneL);roof.position.set(cx,h+0.6,-cn);roof.rotation.y=ang;roof.castShadow=true;roof.receiveShadow=true;roof.userData=si;cPick.push(roof);group.add(roof);
      const GOP=(window.__MG||[]).filter(g=>g.w_).map(g=>{const w=g.w_,p=G2S(w.x,w.n),f=G2S(Math.cos(w.a),Math.sin(w.a)),o=G2S(w.ox,w.on);return{x:p[0],n:p[1],fx:f[0],fn:f[1],ox:o[0],on:o[1],h:g.k==="S"?(g.w+4)/2:g.k==="K"?4:(g.k==="N"&&g.five)?(g.w+4)/2:g.w*0.3+1.4}});const cut=GOP.map(q=>{const t=(q.x-a[0])*ux+(q.n-a[1])*un,dd=(q.x-a[0])*nx+(q.n-a[1])*nn;return Math.abs(dd)<25?[t-q.h-1.5,t+q.h+1.5]:null}).filter(Boolean).sort((p,q)=>p[0]-q[0]);
      {let t0=4;const piece=(s0,s1)=>{if(s1-s0<0.5)return;const back=new THREE.Mesh(wbox(s1-s0,h,1.2,4),M.stone);back.position.set(a[0]+ux*(s0+s1)/2+nx*0.6,h/2,-(a[1]+un*(s0+s1)/2+nn*0.6));back.rotation.y=ang;back.castShadow=true;back.userData=si;cPick.push(back);group.add(back)};cut.forEach(c=>{piece(t0,Math.min(c[0],L-4));t0=Math.max(t0,c[1])});piece(t0,L-4)}
      for(let r=1;r<=2;r++){const off=depth*r/2;for(let t=6;t<L-6;t+=5){if(cut.some(c=>t>c[0]-0.8&&t<c[1]+0.8))continue;cols.push([a[0]+ux*t+nx*off,a[1]+un*t+nn*off,h])}}};
    const SW=G2S(-73.5,-257.8),SE=G2S(204,-212.1),NE=G2S(156.7,253.9),NW=G2S(-157,221);
    const sh=(a,b,f)=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
    const southIn=Math.max(SW[1],SE[1])+16,northIn=Math.min(NW[1],NE[1])-16,cS=N0-550*A,cN=N0+50*A;
    if(southIn<cS)stoa(sh(SW,SE,0.04),sh(SW,SE,0.96),1,14,9);
    if(northIn>cN)stoa(sh(NE,NW,0.04),sh(NE,NW,0.96),1,14,9);
    const im=new THREE.InstancedMesh(colG,M.marble,cols.length);cols.forEach((c,i)=>{d.position.set(c[0],c[2]/2,-c[1]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;group.add(im)})();
  (function(){const mi=I("בתי טבילה","הצעה של התוכנית, פרק 9","מקוואות לפני הכניסה למתחם, מחוץ למגרש של 50 אמה. כל מי שנכנס צריך לטבול. בפנים: מקוואות של 40 סאה, חדרי הלבשה ומים חיים.");
    [[205,-75],[295,-75],[205,575],[295,575]].forEach(c=>{const p=W(c[0],c[1]);const n=-p[1];if(!inPoly(p[0],n,MOUNT_S))return;const m=new THREE.Mesh(wbox(16,6,12,4),M.stoneL);m.position.set(p[0],3,p[1]);m.castShadow=true;m.receiveShadow=true;m.userData=mi;cPick.push(m);group.add(m);COL.push({x0:p[0]-8,x1:p[0]+8,z0:p[1]-6,z1:p[1]+6,y0:0,y1:6});
      const dm=new THREE.Mesh(new THREE.SphereGeometry(3.2,16,8,0,Math.PI*2,0,Math.PI/2),M.white);dm.position.set(p[0],6,p[1]);dm.userData=mi;cPick.push(dm);group.add(dm)})})();
  }
  {const fi=I("מילוי וקיר תומך — הצעה הנדסית","סעיף 15.3; פרק 17.6","איפה שהמתחם יוצא מעבר להר של היום, צריך להרחיב את הרחבה: למלא את המדרון ולבנות קיר תומך, כמו שהורדוס הרחיב את ההר בזמנו. הגוש הזה מראה כמה מילוי צריך. זו רק אפשרות אחת; אפשר גם לבחור אמה קטנה יותר או מיקום אחר על הסלע. ההכרעה — לפוסקים ולמהנדסים.");
    const S=500*A,st=4,cells=[];for(let x=X0+st/2;x<X0+S;x+=st)for(let n=N0-S+st/2;n<N0;n+=st){if(inPoly(x,n,MOUNT_S))continue;const h=HS(x,n);if(h<-0.5)cells.push([x,n,h])}
    if(cells.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(st,1,st),M.wall,cells.length),d=new THREE.Object3D();cells.forEach((c,i)=>{const hh=-c[2]+1;d.position.set(c[0],c[2]+hh/2-1,-c[1]);d.scale.set(1,hh,1);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;im.receiveShadow=true;im.userData=fi;cPick.push(im);group.add(im)}}
  // the edge of the mount: a retaining wall and a stone parapet all round, so nobody can walk off the edge
  {const pi=I("שפת ההר — קיר ומעקה","💡 הצעה","💡 מסביב לרחבת ההר יש קיר תומך, ומעליו מעקה אבן בגובה של כמטר, כדי שאי אפשר ליפול מהשפה. איפה שהמתחם יוצא מעבר להר של היום, ההר מורחב במילוי ובקיר תומך, כמו שעשה הורדוס.");
    const S=500*A,inC=(x,n)=>x>X0-4&&x<X0+S+4&&n<N0+4&&n>N0-S-4,P=MOUNT_S,L=[];const GOP=(window.__MG||[]).filter(g=>g.w_).map(g=>{const w=g.w_,p=G2S(w.x,w.n),f=G2S(Math.cos(w.a),Math.sin(w.a)),o=G2S(w.ox,w.on);return{x:p[0],n:p[1],fx:f[0],fn:f[1],ox:o[0],on:o[1],h:g.k==="S"?(g.w+4)/2:g.k==="K"?4:(g.k==="N"&&g.five)?(g.w+4)/2:g.w*0.3+1.4}});
    for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<0.2)continue;const m=Math.max(1,Math.ceil(len/3)),ux=(b[0]-a[0])/len,un=(b[1]-a[1])/len;
      for(let k=0;k<m;k++){const t0=k/m*len,t1=(k+1)/m*len,xm=a[0]+ux*(t0+t1)/2,nm=a[1]+un*(t0+t1)/2;if(inC(xm,nm))continue;if(GOP.some(q=>Math.abs((xm-q.x)*q.fx+(nm-q.n)*q.fn)<q.h&&Math.abs((xm-q.x)*q.ox+(nm-q.n)*q.on)<4))continue;
        let nx=-un,nn=ux;if(!inPoly(xm+nx*1.5,nm+nn*1.5,P)){nx=-nx;nn=-nn}const cx=xm+nx*0.45,cn=nm+nn*0.45,g=HS(xm-nx*3,nm-nn*3),y0=Math.min(g,0)-0.6,y1=1.05;L.push([cx,cn,t1-t0+0.05,y0,y1,Math.atan2(un,ux)]);
        COL.push({x0:cx-Math.abs(ux)*(t1-t0)/2-0.45,x1:cx+Math.abs(ux)*(t1-t0)/2+0.45,z0:-cn-Math.abs(un)*(t1-t0)/2-0.45,z1:-cn+Math.abs(un)*(t1-t0)/2+0.45,y0:y0,y1:y1+0.6})}}
    if(L.length){const d=new THREE.Object3D(),wm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,0.9),M.stoneL,L.length),cm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,0.18,1.15),M.stone2,L.length);
      L.forEach((q,i)=>{d.rotation.set(0,q[5],0);d.position.set(q[0],(q[3]+q[4])/2,-q[1]);d.scale.set(q[2],q[4]-q[3],1);d.updateMatrix();wm.setMatrixAt(i,d.matrix);d.position.y=q[4]+0.09;d.scale.set(q[2],1,1);d.updateMatrix();cm.setMatrixAt(i,d.matrix)});
      [wm,cm].forEach(m=>{m.castShadow=true;m.receiveShadow=true;m.userData=pi;cPick.push(m);group.add(m)})}
    // topic 2, stage 2: the outer face of the mount, one continuous stone skin whose courses follow the real height
    {const wi=I("חומות הר הבית מבחוץ","💡 לפי הכותל והחפירות","💡 החומות של ההר נראות כמו הכותל היום: למטה אבנים גדולות מימי בית שני, עם שוליים מסותתים ובליטה באמצע; מעליהן שורות בינוניות; ובראש אבנים קטנות מתקופות מאוחרות. כך גם החומה הדרומית והמזרחית.");
      const pos=[],uv=[],idx=[];let acc=0;
      const GOP=(window.__MG||[]).filter(g=>g.w_).map(g=>{const w=g.w_,p=G2S(w.x,w.n),f=G2S(Math.cos(w.a),Math.sin(w.a)),o=G2S(w.ox,w.on);return{x:p[0],n:p[1],fx:f[0],fn:f[1],ox:o[0],on:o[1],h:g.k==="S"?(g.w+4)/2:g.k==="K"?4:(g.k==="N"&&g.five)?(g.w+4)/2:g.w*0.3+1.4}});
      for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<0.2){continue}const m=Math.max(1,Math.ceil(len/3)),ux=(b[0]-a[0])/len,un=(b[1]-a[1])/len;
        for(let k=0;k<m;k++){const t0=k/m*len,t1=(k+1)/m*len,xm=a[0]+ux*(t0+t1)/2,nm=a[1]+un*(t0+t1)/2;if(inC(xm,nm)){continue}if(GOP.some(q=>Math.abs((xm-q.x)*q.fx+(nm-q.n)*q.fn)<q.h&&Math.abs((xm-q.x)*q.ox+(nm-q.n)*q.on)<4)){continue}
          let nx=-un,nn=ux;if(!inPoly(xm+nx*1.5,nm+nn*1.5,P)){nx=-nx;nn=-nn}const g=HS(xm-nx*3,nm-nn*3);if(g>-0.3)continue;const y0=Math.min(g,0)-0.6,y1=1.04;
          const xa=a[0]+ux*t0-nx*0.3,na=a[1]+un*t0-nn*0.3,xb=a[0]+ux*t1-nx*0.3,nb=a[1]+un*t1-nn*0.3,ua=(acc+t0)/16,ub=(acc+t1)/16,b0=pos.length/3;
          pos.push(xa,y0,-na, xb,y0,-nb, xb,y1,-nb, xa,y1,-na);uv.push(ua,(y0+30)/32, ub,(y0+30)/32, ub,(y1+30)/32, ua,(y1+30)/32);
          const cr=(xb-xa)*(-nn)-(nb-na)*(-nx);idx.push(...(cr>0?[b0,b0+1,b0+2,b0,b0+2,b0+3]:[b0,b0+2,b0+1,b0,b0+3,b0+2]))}
        acc+=len}
      if(pos.length){const gg=new THREE.BufferGeometry();gg.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));gg.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));gg.setIndex(idx);gg.computeVertexNormals();
        if(!M.mwall){M.mwall=new THREE.MeshStandardMaterial({map:T.mwC,normalMap:T.mwN,roughness:0.92,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}
        const sk=new THREE.Mesh(gg,M.mwall);sk.receiveShadow=true;sk.castShadow=false;sk.userData=wi;cPick.push(sk);group.add(sk)}}
    // topic 2, stage 7: two processional paths across the mount plaza, from the 500 wall's gates to the mount walls
    {const pi2=I("דרך העולים","מידות ב, ב; הצעה של התוכנית","💡 שביל אבן רחב מהשער שבחומת 500 האמה אל שערי ההר. ⚖️ נכנסים בימין ויוצאים בשמאל (מידות ב, ב). ⚖️ אסור לעשות את ההר קפנדריא, כלומר קיצור דרך (ברכות ט, ה), ולכן השבילים מובילים רק אל השערים.");
      if(!M.path2){M.path2=new THREE.MeshStandardMaterial({map:T.ashC,normalMap:T.ashN,roughness:0.9,color:0xe9dfc8,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}
      [[0,-1],[500,1]].forEach(([v0,dir])=>{let v=v0,L=0;while(L<200){const q=W(250,v+dir*(L+2));if(!inPoly(q[0],-q[1],P))break;L+=2}if(L<6)return;
        const a=W(250,v0),b=W(250,v0+dir*L),m=new THREE.Mesh(new THREE.PlaneGeometry(22*A,Math.abs(b[1]-a[1])),M.path2);m.rotation.x=-Math.PI/2;m.position.set((a[0]+b[0])/2,0.14,(a[1]+b[1])/2);m.receiveShadow=true;m.userData=pi2;cPick.push(m);group.add(m)})}}
  const wlStart=group.children.length;
  // today's wall line, shown where the 500-amah square goes past it
  {const S=500*A,QX=X0+(RB?29:0)*A,QN=N0-(RB?82.5:0)*A,inC=(x,n)=>x>QX-1&&x<QX+S+1&&n<QN+1&&n>QN-S-1,red=new THREE.MeshBasicMaterial({color:0xe0412f}),cur=new THREE.MeshBasicMaterial({color:0xe0412f,transparent:true,opacity:0.28,side:THREE.DoubleSide,depthWrite:false});let mid=null,cnt=0;
    const wi={n:"חומת הר הבית של היום",r:"OpenStreetMap; פרק 15",t:"הקו האדום הוא החומה של הר הבית היום. איפה שהמתחם עובר אותו, הריבוע של 500 אמה (יחזקאל מ״ב, טו-כ) יוצא מעבר להר הקיים. זה נובע מהמידות, לא מטעות בהדמיה, והפתרון ההלכתי וההנדסי הוא שאלה לפוסקים ולמהנדסים (סעיף 15.3)."};
    for(let i=0;i<MOUNT_S.length;i++){const a=MOUNT_S[i],b=MOUNT_S[(i+1)%MOUNT_S.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),m=Math.max(1,Math.ceil(L/2));
      for(let k=0;k<m;k++){const t0=k/m,t1=(k+1)/m,x0=a[0]+(b[0]-a[0])*t0,n0=a[1]+(b[1]-a[1])*t0,x1=a[0]+(b[0]-a[0])*t1,n1=a[1]+(b[1]-a[1])*t1,xm=(x0+x1)/2,nm=(n0+n1)/2;if(!inC(xm,nm))continue;
        const l=Math.hypot(x1-x0,n1-n0),ang=Math.atan2(n1-n0,x1-x0);const ln=new THREE.Mesh(new THREE.BoxGeometry(l+0.05,0.45,0.45),red);ln.position.set(xm,13.5,-nm);ln.rotation.y=ang;ln.userData=wi;cPick.push(ln);group.add(ln);
        const cu=new THREE.Mesh(new THREE.PlaneGeometry(l+0.05,13.5),cur);cu.position.set(xm,6.75,-nm);cu.rotation.y=ang;cu.renderOrder=3;group.add(cu);cnt++;if(!mid||cnt%2===0)mid=[xm,nm]}}
    if(mid){const m=Math.floor(cnt/2);const WL=label("קו החומה של היום",mid[0],16,-mid[1],"c",wi);WL.wall=true;cLabels.push(WL)}}
  {const g=new THREE.Group();group.children.slice(wlStart).forEach(o=>g.add(o));group.add(g);g.visible=SHOW_WALL;WALLG=g}
  COMP={X0,N0,vmin,vmax,rb:RB,nst:RB?12:(FMODE==="ez"?10:12)};
  const cp=W(250,250);C.set(cp[0],15,cp[1]);
  fixModern();mergeStatic();fixInst();renderer.shadowMap.needsUpdate=true;applyTime();fitCheck(X0+(RB?29:0)*A,N0-(RB?82.5:0)*A);try{renderer.compile(scene,camera)}catch(e){}
}
await __Y(93);function overOf(X0,N0,S){const over={};for(let t=0.06;t<=0.9401;t+=0.02){[["s",X0+S*t,N0-S],["n",X0+S*t,N0],["w",X0,N0-S*t],["e",X0+S,N0-S*t]].forEach(([sd,x,n])=>{if(inPoly(x,n,MOUNT_S))return;let b=1e9;for(let i=0;i<MOUNT_S.length;i++){const r=segDist(x,n,[MOUNT_S[i],MOUNT_S[(i+1)%MOUNT_S.length]]);if(r[0]<b)b=r[0]}over[sd]=Math.max(over[sd]||0,b)})}return over}
function fitTable(){const nm={e:"מזרח",w:"מערב",s:"דרום",n:"צפון"};let h="<table class='ft'><tr><th>אמה</th><th>קודש הקודשים על הסלע</th><th>המזבח על הסלע</th></tr>";
  [0.48,0.525,0.576].forEach(a=>{h+="<tr"+(Math.abs(a-A)<1e-6?" style='font-weight:700;background:rgba(233,216,166,.35)'":"")+"><td>"+Math.round(a*1000)/10+" ס״מ ("+Math.round(500*a)+" מ׳)</td>";[[125,250],[250,250]].forEach(ref=>{const X0=ROCK.x-ref[0]*a,N0=ROCK.n+ref[1]*a,o=overOf(X0,N0,500*a),parts=Object.keys(o).filter(k=>o[k]>1).map(k=>nm[k]+" "+Math.round(o[k])+" מ׳");h+="<td>"+(parts.length?parts.join(", "):"נכנס כולו ✓")+"</td>"});h+="</tr>"});
  return h+"</table><p class='hint'>השורה של האמה שבחרת מודגשת. הקו האדום והמילוי מופיעים בשכבה \"חומת ההר היום\".</p>"}
function fixInst(){scene.traverse(o=>{if(o.isInstancedMesh)o.frustumCulled=false})}
function fixModern(){const S=["מרכז מבקרים לכל העמים","מרכז טהרה","בן אחיה — מרפאה","מרכז בדיקת קרבנות"];cLabels.concat(labels).forEach(L=>{const i=L.info;if(!i||!S.includes(L.txt)||i._mod)return;i._mod=1;if(!/^💡/.test(i.t||""))i.t="💡 הצעה של התוכנית. "+(i.t||"");if(!/הצעה/.test(i.r||""))i.r=(i.r?i.r+"; ":"")+"הצעה של התוכנית"})}
function mergeStatic(){if(!THREE.BufferGeometryUtils)return;const skip=new Set([RIVG,WALLG,FESTG].filter(Boolean)),fl=new Set(flames),by=new Map();group.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(group.matrixWorld).invert(),rel=new THREE.Matrix4();
  group.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.merged)return;for(let q=o.parent;q&&q!==group;q=q.parent)if(skip.has(q)||!q.visible)return;if(fl.has(o)||Array.isArray(o.material)||o.material.transparent||!o.visible||!o.geometry.attributes.position)return;
    const k=o.material.uuid+(o.castShadow?"s":"n");if(!by.has(k))by.set(k,{m:o.material,cast:o.castShadow,list:[]});by.get(k).list.push(o)});
  by.forEach(e=>{if(e.list.length<3)return;const gs=e.list.map(o=>{let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();const n=g.attributes.position.count,G=new THREE.BufferGeometry();G.setAttribute("position",g.attributes.position);G.setAttribute("normal",g.attributes.normal||new THREE.Float32BufferAttribute(new Float32Array(n*3),3));G.setAttribute("uv",g.attributes.uv||new THREE.Float32BufferAttribute(new Float32Array(n*2),2));rel.multiplyMatrices(inv,o.matrixWorld);G.applyMatrix4(rel);return G});
    const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs,false);if(!mg)return;const m=new THREE.Mesh(mg,e.m);m.castShadow=e.cast;m.receiveShadow=true;m.userData.merged=true;group.add(m);e.list.forEach(o=>{o.visible=false;o.userData.hid=true})})}
function fitCheck(X0,N0){
  const S=500*A,over={};
  for(let t=0.06;t<=0.9401;t+=0.02){[["s",X0+S*t,N0-S],["n",X0+S*t,N0],["w",X0,N0-S*t],["e",X0+S,N0-S*t]].forEach(([sd,x,n])=>{if(inPoly(x,n,MOUNT_S))return;let b=1e9;for(let i=0;i<MOUNT_S.length;i++){const r=segDist(x,n,[MOUNT_S[i],MOUNT_S[(i+1)%MOUNT_S.length]]);if(r[0]<b)b=r[0]}over[sd]=Math.max(over[sd]||0,b)})}
  const nm={e:"במזרח",w:"במערב",s:"בדרום",n:"בצפון"},parts=[];Object.keys(over).forEach(k=>{if(over[k]>1)parts.push(nm[k]+" בכ־"+Math.round(over[k])+" מ׳")});
  const el=document.getElementById("fit"),who=LOC==="kodesh"?"קודש הקודשים":"המזבח",side=Math.round(S);
  if(parts.length){el.className="panel fit";el.innerHTML="<h2>המתחם יוצא מעבר להר של היום</h2><p class='note'>ריבוע של "+side+" מ׳. כש"+who+" על הסלע, המתחם יוצא מעבר לחומת ההר "+parts.join(", ")+".</p><p class='hint'>לפי קווי המתאר של ההר ב־OpenStreetMap. זו שאלה 15.3.4 לפוסקים.</p>"+fitTable()}
  else{el.className="panel fit ok";el.innerHTML="<h2>המתחם נכנס להר של היום</h2><p class='note'>ריבוע של "+side+" מ׳. כש"+who+" על הסלע, כל 500 האמה נכנסות בתוך חומות ההר.</p><p class='hint'>לפי קווי המתאר של ההר ב־OpenStreetMap.</p>"+fitTable()}
}

