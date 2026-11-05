// ==== v59 phase B: Earth-style navigation — drag pans, right/Ctrl drag turns, zoom to cursor, keys, double-click fly ====
(function(){
const el=renderer.domElement;
controls.mouseButtons={LEFT:THREE.MOUSE.PAN,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};
controls.touches={ONE:THREE.TOUCH.PAN,TWO:THREE.TOUCH.DOLLY_ROTATE};
controls.screenSpacePanning=false;controls.panSpeed=1;
el.addEventListener("contextmenu",e=>e.preventDefault());
// where the ray under the cursor meets the ground / buildings / temple boxes
const rc=new THREE.Raycaster(),m2=new THREE.Vector2(),tmp=new THREE.Vector3();
function rayAt(cx,cy){const r=el.getBoundingClientRect();m2.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);rc.setFromCamera(m2,camera);return rc.ray}
function groundHit(ray,max){const o=ray.origin,d=ray.direction;let t=0.5,prev=0;max=max||7000;
  while(t<max){tmp.copy(o).addScaledVector(d,t);const g=floorAt(tmp.x,tmp.z);if(tmp.y<=g){let a=prev,b=t;for(let k=0;k<8;k++){const mm=(a+b)/2;tmp.copy(o).addScaledVector(d,mm);if(tmp.y<=floorAt(tmp.x,tmp.z))b=mm;else a=mm}return o.clone().addScaledVector(d,b)}
    for(const c of COL){if(c.y1-c.y0<2||tmp.x<c.x0||tmp.x>c.x1||tmp.z<c.z0||tmp.z>c.z1||tmp.y<c.y0||tmp.y>c.y1)continue;return tmp.clone()}
    prev=t;t+=Math.max(0.4,t*0.015)}return null}
function sceneHit(ray){try{rc.ray.copy(ray);rc.near=0;rc.far=8000;const objs=[];if(group)objs.push(group);const h=rc.intersectObjects(objs,true).find(h=>{for(let q=h.object;q;q=q.parent)if(!q.visible)return false;return !(h.object.material&&h.object.material.transparent&&h.object.material.opacity<0.5)});const g=groundHit(ray);if(h&&(!g||h.distance<g.distanceTo(ray.origin)))return h.point.clone();return g}catch(e){return groundHit(ray)}}
const busy=()=>WALK||DRONE||(TRN&&TRN.riding);
// zoom toward the cursor
let zAcc=0,zPt=null,zT=0;
stage.addEventListener("wheel",e=>{if(e.target!==el||busy())return;e.preventDefault();e.stopPropagation();tween=null;if(TOUR)stopTour();if(STORY&&STORY.pause)STORY.pause();const now=performance.now();
  if(!zPt||now-zT>250){const g=groundHit(rayAt(e.clientX,e.clientY));zPt=g||controls.target.clone()}zT=now;
  const dy=e.deltaMode===1?e.deltaY*33:e.deltaY;zAcc+=Math.max(-400,Math.min(400,dy))},{passive:false,capture:true});
function zoomTick(dt){if(Math.abs(zAcc)<0.5||!zPt){zAcc=0;return}const step=zAcc*Math.min(1,dt*14);zAcc-=step;
  const cp=camera.position,t=controls.target;const f=Math.exp(step*0.0011);const dist=cp.distanceTo(zPt);
  if(f<1&&dist*f<2.2)return;if(f>1&&cp.distanceTo(t)*f>controls.maxDistance)return;
  let np=zPt.clone().add(cp.clone().sub(zPt).multiplyScalar(f)),nt=zPt.clone().add(t.clone().sub(zPt).multiplyScalar(f));
  // item 29: zooming in never passes through a wall: stop 0.6 m before it, and drop the rest of the wheel
  if(f<1){const h=segHit(cp,np);if(h<1){zAcc=0;const L=cp.distanceTo(np),k=(h*L-0.6)/L;if(k<=0.02)return;np=cp.clone().lerp(np,k);nt=t.clone().lerp(nt,k)}}
  const g=floorAt(np.x,np.z);if(np.y<g+1.6)np.y=g+1.6;const gt=floorAt(nt.x,nt.z);if(nt.y<gt-0.5)nt.y=gt;
  cp.copy(np);t.copy(nt);camSaved=false;camLim=1e9;controls.update();
  // near the ground the view levels toward the horizon, like Earth
  const h=np.y-g,dd=np.distanceTo(nt);if(f<1&&h<40){const dir=nt.clone().sub(np);const flat=Math.hypot(dir.x,dir.z),want=Math.max(0.05,h/45)*flat;if(-dir.y>want){const ny=np.y-want;t.y+=(ny-t.y)*0.35;controls.update()}}}
// keyboard: WASD/arrows move, Q/E turn, R/F tilt, +/- zoom, Shift fast
const K={};
const typing=()=>{const a=document.activeElement;return a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)};
window.addEventListener("keydown",e=>{if(busy()||typing()||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(["w","a","s","d","q","e","r","f","arrowup","arrowdown","arrowleft","arrowright","+","=","-","shift"].includes(k)){K[k]=true;if(k.startsWith("arrow"))e.preventDefault();if(STORY&&STORY.pause&&k!=="shift")STORY.pause();if(TOUR)stopTour()}});
window.addEventListener("keyup",e=>{K[e.key.toLowerCase()]=false});window.addEventListener("blur",()=>{for(const k in K)K[k]=false});
const VJ={lx:0,ly:0,rx:0,ry:0};
function keyTick(dt){if(busy()||typing())return;const f=Math.max(-1,Math.min(1,(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0)-VJ.ly)),r=Math.max(-1,Math.min(1,(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+VJ.lx)),up=(K.e?1:0)-(K.q?1:0),turn=VJ.rx,tilt=(K.r?1:0)-(K.f?1:0)-VJ.ry,zm=(K["+"]||K["="]?1:0)-(K["-"]?1:0);
  if(!f&&!r&&!turn&&!tilt&&!zm&&!up)return;tween=null;if(STORY&&STORY.pause&&!STORY_API.S.paused)STORY.pause();const cp=camera.position,t=controls.target;const dist=cp.distanceTo(t),sp=Math.max(6,dist*0.9)*(K.shift?2.5:1)*dt;
  const fw=t.clone().sub(cp);fw.y=0;if(fw.lengthSq()<1e-6)fw.set(0,0,-1);fw.normalize();const rt=new THREE.Vector3(-fw.z,0,fw.x);
  const mv=fw.multiplyScalar(f*sp).addScaledVector(rt,r*sp);mv.y+=up*Math.max(4,dist*0.6)*(K.shift?2.5:1)*dt;cp.add(mv);t.add(mv);
  if(turn){const off=cp.clone().sub(t).applyAxisAngle(new THREE.Vector3(0,1,0),-turn*1.4*dt);cp.copy(t).add(off)}
  if(tilt){const off=cp.clone().sub(t),sph=new THREE.Spherical().setFromVector3(off);sph.phi=Math.max(0.05,Math.min(controls.maxPolarAngle,sph.phi-tilt*0.9*dt));off.setFromSpherical(sph);cp.copy(t).add(off)}
  if(zm){const off=cp.clone().sub(t).multiplyScalar(Math.exp(-zm*1.4*dt));if(off.length()>2)cp.copy(t).add(off)}
  const g=floorAt(cp.x,cp.z);if(cp.y<g+1.6){const d=g+1.6-cp.y;cp.y+=d;if(up<0)t.y+=d}const gt=floorAt(t.x,t.z);if(t.y<gt)t.y=gt;camSaved=false;camLim=1e9;controls.update()}
// two on-screen sticks for touch screens: left moves, right turns and tilts
{const touch=matchMedia("(pointer: coarse)").matches||"ontouchstart" in window;if(touch){
  const hud=document.getElementById("hud");const jb=document.createElement("button");jb.type="button";jb.className="hb";jb.id="joyB";jb.setAttribute("aria-label","ג׳ויסטיקים");jb.setAttribute("aria-pressed","false");jb.innerHTML='<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>';hud.appendChild(jb);
  const mkJ=(side)=>{const d=document.createElement("div");d.className="vjoy "+side;d.hidden=true;d.innerHTML="<i></i>";stage.appendChild(d);const k=d.firstChild;let id=null;
    const set=(e)=>{const r=d.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let x=(e.clientX-cx)/(r.width/2),y=(e.clientY-cy)/(r.height/2);const L=Math.hypot(x,y);if(L>1){x/=L;y/=L}k.style.transform="translate("+x*35+"px,"+y*35+"px)";if(side==="l"){VJ.lx=x;VJ.ly=y}else{VJ.rx=x;VJ.ry=y}};
    const end=()=>{id=null;k.style.transform="";if(side==="l"){VJ.lx=VJ.ly=0}else{VJ.rx=VJ.ry=0}};
    d.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;d.setPointerCapture(id);set(e)});d.addEventListener("pointermove",e=>{if(e.pointerId===id)set(e)});d.addEventListener("pointerup",end);d.addEventListener("pointercancel",end);return d};
  const jl=mkJ("l"),jr=mkJ("r");jb.onclick=()=>{const on=jl.hidden;jl.hidden=jr.hidden=!on;jb.setAttribute("aria-pressed",on?"true":"false")}}}
// double click: fly there
el.addEventListener("dblclick",e=>{if(busy())return;e.preventDefault();const p=sceneHit(rayAt(e.clientX,e.clientY));if(!p)return;if(STORY)STORY.stop();if(TOUR)stopTour();
  const cp=camera.position,d0=cp.distanceTo(p),nd=Math.max(14,Math.min(d0*0.45,400));const dir=cp.clone().sub(p).normalize();if(dir.y<0.25){dir.y=0.25;dir.normalize()}
  const np=p.clone().addScaledVector(dir,nd);const g=floorAt(np.x,np.z);if(np.y<g+2)np.y=g+2;try{safeCam(np,p)}catch(err){}
  document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  if(reduce){camAt(np,p);return}tween={p0:cp.clone(),t0:controls.target.clone(),p1:np,t1:p,start:performance.now(),dur:1500,arc:true}});
// first-drag hint
{let shown=false;el.addEventListener("pointerdown",()=>{if(shown||busy())return;shown=true;try{if(localStorage.getItem("tm_navhint"))return;localStorage.setItem("tm_navhint","1")}catch(e){}setTimeout(()=>toast("גרירה מזיזה את המפה. לסיבוב: גרירה ימנית, Ctrl וגרירה, או שתי אצבעות. לחיצה כפולה טסה אל המקום."),400)})}
let last=performance.now();
function navTick(){requestAnimationFrame(navTick);const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;if(busy()){zAcc=0;return}zoomTick(dt);keyTick(dt)}
requestAnimationFrame(navTick);
window.__NAV={groundHit,sceneHit,rayAt};
})();

// ==== v59 phase C: Voyager-style tours — station strip, slow orbit at each stop, three new festival tours ====
(function(){
const $=id=>document.getElementById(id);
const press=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
const unpress=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")==="true")b.click()};
const TID={morning:"tM",noon:"tN",evening:"tE",night:"tL"};
// remember what a tour changed, and put it back when it ends
const keep=()=>({fest:$("oF").getAttribute("aria-pressed")==="true",time:TIME,plan:PLAN});
const back=k=>{if(!k)return;if(!k.fest)unpress("oF");if(TIME!==k.time)$(TID[k.time]).click()};
let KP=null;const festOpen=()=>{KP=keep();press("oF");closeInfo()};const festClose=()=>{back(KP);KP=null};
STORIES.pesach={title:"קרבן פסח",open(){KP=keep();if(TIME!=="noon")$("tN").click();SND.crowd(0.05)},close(){back(KP);KP=null},steps:[
 {title:"ערב פסח",pose:AP(520,250,70,300,250,10),cap:"בארבעה עשר בניסן, אחר הצהריים, התמיד נשחט מוקדם: בשבע ומחצה וקרב בשמונה ומחצה. כך נותר זמן לשחיטת הפסחים. כל חבורה מביאה כבש אחד.",src:"פסחים ה, א; יחזקאל מ״ה, כא",full:"📜 \"בראשון בארבעה עשר יום לחדש יהיה לכם הפסח, חג שבעות ימים, מצות יאכל\" (יחזקאל מ״ה, כא). ⚖️ \"תמיד נשחט בשמונה וחצי וקרב בתשעה וחצי. ערב פסח נשחט בשבע וחצי וקרב בשמונה וחצי\" (פסחים ה, א)."},
 {title:"שלוש כיתות",pose:AP(345,236,16,300,250,13),cap:"הפסח נשחט בשלוש כיתות. נכנסת הכת הראשונה, נתמלאת העזרה, נועלים את הדלתות, ותוקעים מריעים ותוקעים.",src:"פסחים ה, ה",full:"📜 \"הפסח נשחט בשלש כתות... נכנסה כת הראשונה, נתמלאה העזרה, נעלו דלתות העזרה. תקעו, הריעו ותקעו\" (פסחים ה, ה)."},
 {title:"שורות של כהנים",pose:AP(298,212,13,262,240,8),cap:"הכהנים עומדים שורות שורות, בזיכי כסף ובזיכי זהב. שורה כולה כסף ושורה כולה זהב, ולא מעורבין. לבזיכים אין שוליים, שמא יניחום ויקרש הדם.",src:"פסחים ה, ה",full:"📜 \"הכהנים עומדים שורות שורות, ובידיהם בזיכי כסף ובזיכי זהב. שורה שכולה כסף כסף, ושורה שכולה זהב זהב, לא היו מעורבין. ולא היו לבזיכין שולים, שמא יניחום ויקרש הדם\" (פסחים ה, ה). 💡 במודל אין דמויות מיוחדות לפסח."},
 {title:"מעבירים מיד ליד",pose:AP(272,220,10,252,238,8.5),cap:"ישראל שוחט והכהן מקבל. נותן לחברו וחברו לחברו, והקרוב למזבח זורק זריקה אחת כנגד היסוד. מחזירים את הריקן ומקבלים את המלא.",src:"פסחים ה, ו",full:"📜 \"שחט ישראל וקבל הכהן, נותנו לחברו וחברו לחברו, ומקבל את המלא ומחזיר את הריקן. כהן הקרוב אצל המזבח זורקו זריקה אחת כנגד היסוד\" (פסחים ה, ו)."},
 {title:"הלל",pose:AP(270,232,11,285.5,240,10),cap:"בזמן השחיטה הלוויים קוראים את ההלל. אם גמרו, שונים; אם שונו, משלשים. אך מעולם לא שלשו.",src:"פסחים ה, ז",full:"📜 \"קראו את ההלל. אם גמרו שנו, ואם שנו שלשו, אף על פי שלא שלשו מימיהם\" (פסחים ה, ז)."},
 {title:"תולין ומפשיטין",pose:AP(262,196,12,274,214,8),cap:"אנקליות של ברזל קבועות בכתלים ובעמודים לתלייה ולהפשטה. מי שאין לו מקום מניח מקל דק על כתפו ועל כתף חברו, ותולה ומפשיט.",src:"פסחים ה, ט",full:"📜 \"כיצד תולין ומפשיטין? אנקליות של ברזל היו קבועין בכתלים ובעמודים, שבהן תולין ומפשיטין. וכל מי שאין לו מקום לתלות ולהפשיט, מקלות דקים חלקים היו שם, ומניח על כתפו ועל כתף חברו, ותולה ומפשיט\" (פסחים ה, ט). ⚖️ במודל: בית המטבחיים בצפון המזבח (מידות ג, ה)."},
 {title:"יוצאים",pose:AP(400,305,34,300,250,8),cap:"יצאה הכת הראשונה וישבה בהר הבית, השנייה בחיל, והשלישית במקומה. כשחשכה יצאו וצלו את פסחיהם. במודל יחזקאל אין חיל, ולכן רואים את החצר החיצונה.",src:"פסחים ה, י",full:"📜 \"יצאו וישבו להן, כת ראשונה בהר הבית, שניה בחיל, והשלישית במקומה עומדת. חשכה, יצאו וצלו את פסחיהן\" (פסחים ה, י). 💡 ביחזקאל אין חיל; כאן החצר החיצונה."},
 {title:"בכל הבתים",pose:VP("city"),cap:"בלילה אוכלים את הבשר צלי אש, עם מצות ומרורים. ירושלים מלאה חבורות, וההלל עולה מן הבתים.",verse:"וְאָכְלוּ אֶת־הַבָּשָׂר בַּלַּיְלָה הַזֶּה צְלִי־אֵשׁ וּמַצּוֹת עַל־מְרֹרִים יֹאכְלֻהוּ׃",verseRef:"שמות יב, ח",src:"שמות יב, ח; פסחים ז, יג",full:"📜 \"ואכלו את הבשר בלילה הזה, צלי אש ומצות, על מררים יאכלהו\" (שמות יב, ח)."}]};
STORIES.sukkot={title:"חג הסוכות במקדש",open(){festOpen();SND.crowd(0.05)},close(){festClose()},steps:[
 {title:"ערבות ממוצא",pose:AP(284,300,32,250,252,17.5),cap:"בכל יום בחג יורדים למוצא ומביאים מורביות של ערבה. זוקפים אותן בצדי המזבח, וראשיהן כפופים על גביו, ותוקעים מריעים ותוקעים.",src:"סוכה ד, ה",full:"📜 \"מקום היה למטה מירושלים ונקרא מוצא. יורדין לשם ומלקטין משם מורביות של ערבה, ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח. תקעו והריעו ותקעו\" (סוכה ד, ה). 💡 הערבות עצמן לא מוצגות במודל."},
 {title:"הקפת המזבח",pose:AP(292,212,30,250,252,18),cap:"בכל יום מקיפים את המזבח פעם אחת ואומרים אנא ה׳ הושיעה נא. ביום השביעי מקיפים שבע פעמים.",verse:"אָנָּא ה׳ הוֹשִׁיעָה נָּא אָנָּא ה׳ הַצְלִיחָה נָּא׃",verseRef:"תהלים קיח, כה",src:"סוכה ד, ה",full:"📜 \"בכל יום מקיפין את המזבח פעם אחת ואומרים: אנא ה' הושיעה נא, אנא ה' הצליחה נא... ואותו היום מקיפין את המזבח שבעה פעמים\" (סוכה ד, ה)."},
 {title:"המים מן השילוח",pose:GP(160,-430,80,40,-600,10),cap:"יורדים לשילוח וממלאים צלוחית של זהב מחזקת שלושה לוגין. בהגיעם לשער המים תוקעים מריעים ותוקעים.",src:"סוכה ד, ט",full:"📜 \"ניסוך המים כיצד? צלוחית של זהב מחזקת שלשה לגין היה ממלא מן השילוח. הגיעו לשער המים, תקעו והריעו ותקעו\" (סוכה ד, ט)."},
 {title:"ניסוך המים",pose:AP(300,286,26,250,252,17.5),cap:"הכהן עולה בכבש ופונה לשמאלו. שני ספלים של כסף שם, ליין ולמים, מנוקבים כמין חוטמין. אומרים לו: הגבה ידך.",verse:"וְהִנֵּה־מַיִם יֹצְאִים מִתַּחַת מִפְתַּן הַבַּיִת קָדִימָה׃",verseRef:"יחזקאל מז, א",src:"סוכה ד, ט",full:"📜 \"עלה בכבש ופנה לשמאלו. שני ספלים של כסף היו שם... ומנוקבין כמין שני חוטמין דקין... ולמנסך אומרים לו: הגבה ידך\" (סוכה ד, ט)."},
 {title:"שמחת בית השואבה",enter:()=>{if(TIME!=="night")$("tL").click()},pose:AP(472,188,40,415,250,28),cap:"במוצאי יום טוב הראשון מדליקים מנורות של זהב. לא היתה חצר בירושלים שאינה מאירה מאור בית השואבה, וחסידים מרקדים באבוקות.",verse:"וּשְׁאַבְתֶּם־מַיִם בְּשָׂשׂוֹן מִמַּעַיְנֵי הַיְשׁוּעָה׃",verseRef:"ישעיהו יב, ג",src:"סוכה ה, א-ד",full:"📜 \"מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו... ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה. חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן\" (סוכה ה, א-ד). 💡 ביחזקאל אין עזרת נשים, ולכן המנורות כאן בחצר החיצונה."},
 {title:"הלוויים במעלות",pose:AP(345,250,14,300,250,14),cap:"הלוויים עומדים על המעלות בכינורות, בנבלים ובחצוצרות ואומרים שירה. שני כהנים בשער העליון וחצוצרות בידיהם. במודל יחזקאל הם על מדרגות השער הפנימי.",src:"סוכה ה, ד",full:"📜 \"והלוים בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים... ועמדו שני כהנים בשער העליון... ושתי חצוצרות בידיהן\" (סוכה ה, ד). 💡 במודל של יחזקאל הם על מדרגות השער הפנימי."},
 {title:"פנינו אל ההיכל",enter:()=>{if(TIME!=="morning")$("tM").click()},pose:AP(410,250,14,200,250,40),cap:"מגיעים לשער המזרחי, הופכים פנים למערב ואומרים: אבותינו אחוריהם אל ההיכל ופניהם קדמה, ואנו לה׳ עינינו.",verse:"וְהִנֵּה כְּבוֹד אֱלֹהֵי יִשְׂרָאֵל בָּא מִדֶּרֶךְ הַקָּדִים וְקוֹלוֹ כְּקוֹל מַיִם רַבִּים וְהָאָרֶץ הֵאִירָה מִכְּבֹדוֹ׃",verseRef:"יחזקאל מג, ב",src:"סוכה ה, ד",full:"📜 \"הגיעו לשער היוצא ממזרח, הפכו פניהן למערב ואמרו: אבותינו שהיו במקום הזה, אחוריהם אל ההיכל ופניהם קדמה, והמה משתחוים קדמה לשמש. ואנו ליה עינינו\" (סוכה ה, ד)."}]};
STORIES.hakhel={title:"מצוות הקהל",open(){festOpen();SND.trumpets();SND.crowd(0.06)},close(){festClose()},steps:[
 {title:"מוצאי שנת השמיטה",pose:AP(520,340,60,415,303,8),cap:"מקץ שבע שנים, במועד שנת השמיטה בחג הסוכות, מקהילים את העם: האנשים והנשים והטף והגר אשר בשעריך.",verse:"הַקְהֵל אֶת־הָעָם הָאֲנָשִׁים וְהַנָּשִׁים וְהַטַּף וְגֵרְךָ אֲשֶׁר בִּשְׁעָרֶיךָ לְמַעַן יִשְׁמְעוּ וּלְמַעַן יִלְמְדוּ׃",verseRef:"דברים לא, יב",src:"דברים לא, י-יב",full:"📜 \"מקץ שבע שנים, במעד שנת השמטה, בחג הסכות... הקהל את העם, האנשים והנשים והטף וגרך אשר בשעריך, למען ישמעו ולמען ילמדו\" (דברים לא, י-יב)."},
 {title:"חצוצרות בכל העיר",pose:VP("olives"),cap:"תוקעים בחצוצרות בכל ירושלים כדי להקהיל את העם, ומביאים בימה גדולה של עץ.",src:"רמב״ם, הלכות חגיגה ג, ד",full:"⚖️ \"ותוקעין בחצוצרות בכל ירושלים כדי להקהיל את העם, ומביאין בימה גדולה והיתה של עץ, ומעמידין אותה באמצע עזרת הנשים\" (רמב״ם, הלכות חגיגה ג, ד)."},
 {title:"בימה של עץ",pose:AP(436,284,14,415,304,7),cap:"עושים למלך בימה של עץ בעזרה, והוא יושב עליה. כל העם עומד מסביב. במודל יחזקאל הבימה בחצר החיצונה, שאין בו עזרת נשים.",src:"סוטה ז, ח",full:"📜 \"מוצאי יום טוב הראשון של חג, בשמיני, במוצאי שביעית, עושין לו בימה של עץ בעזרה, והוא יושב עליה\" (סוטה ז, ח). 💡 במודל של יחזקאל הבימה בחצר החיצונה, כי אין בו עזרת נשים."},
 {title:"מסירת ספר התורה",pose:AP(434,284,15,415,303.4,8),cap:"חזן הכנסת נוטל ספר תורה ונותנו לראש הכנסת, לראש הכנסת לסגן, לסגן לכהן גדול, ולכהן גדול למלך. כך מכבדים את התורה.",src:"סוטה ז, ז-ח",full:"📜 \"חזן הכנסת נוטל ספר תורה ונותנה לראש הכנסת, וראש הכנסת נותנה לסגן, והסגן נותנה לכהן גדול, וכהן גדול נותנה למלך\" (סוטה ז, ח)."},
 {title:"אגריפס המלך",pose:AP(398,286,15,415,303.4,8),cap:"המלך מקבל וקורא בישיבה. אגריפס עמד וקרא בעמידה, ושיבחוהו חכמים. כשהגיע ל\"לא תוכל לתת עליך איש נכרי\" זלגו עיניו דמעות, ואמרו לו: אל תתירא, אחינו אתה.",src:"סוטה ז, ח",full:"📜 \"והמלך עומד ומקבל וקורא יושב. אגריפס המלך עמד וקבל וקרא עומד, ושבחוהו חכמים. וכשהגיע ל'לא תוכל לתת עליך איש נכרי' זלגו עיניו דמעות. אמרו לו: אל תתירא אגריפס, אחינו אתה, אחינו אתה\" (סוטה ז, ח)."},
 {title:"מה קוראים",pose:AP(452,330,24,415,303,6),cap:"המלך קורא מתחילת אלה הדברים עד שמע, ושמע, והיה אם שמוע, עשר תעשר, כי תכלה לעשר, פרשת המלך, והברכות והקללות.",src:"סוטה ז, ח",full:"📜 \"וקורא מתחלת 'אלה הדברים' עד 'שמע', ו'שמע', ו'והיה אם שמע', 'עשר תעשר', 'כי תכלה לעשר', ופרשת המלך, וברכות וקללות, עד שגומר כל הפרשה\" (סוטה ז, ח)."},
 {title:"למען ישמעו",pose:VP("home"),cap:"למען ישמעו ולמען ילמדו. הרמב״ם כותב שיראה אדם עצמו כאילו עתה נצטווה בתורה, ומפי הגבורה הוא שומעה.",src:"דברים לא, יב; רמב״ם, הלכות חגיגה ג, ו",full:"⚖️ \"ויראה עצמו כאילו עתה נצטוה בה, ומפי הגבורה שומעה\" (רמב״ם, הלכות חגיגה ג, ו)."}]};
// --- Voyager layout: step card on the left, fixed bar at the bottom with the station strip ---
const box=$("story");const bar=document.createElement("div");bar.id="tbar";bar.className="gl";bar.hidden=true;stage.appendChild(bar);
const strip=document.createElement("div");strip.id="stStrip";strip.setAttribute("role","tablist");strip.setAttribute("aria-label","תחנות הסיור");
const ctl=box.querySelector(".stctl");if(ctl)bar.appendChild(ctl);bar.appendChild(strip);
const tx=document.createElement("button");tx.type="button";tx.className="tx";tx.textContent="✕ יציאה";tx.onclick=()=>STORY_API.stop();bar.appendChild(tx);
const step=document.createElement("div");step.id="stStep";const txt=$("stText");txt.parentNode.insertBefore(step,txt);
const res=document.createElement("button");res.id="resume";res.type="button";res.hidden=true;res.textContent="▶ המשך סיור";res.onclick=()=>$("stPlay").click();stage.appendChild(res);
window.addEventListener("keydown",e=>{if(e.key==="Escape"&&STORY)STORY_API.stop()});
let sDef=null,sI=-1,orb=null,wasMove=false;
function buildStrip(){const S=STORY_API.S;strip.innerHTML="";S.def.steps.forEach((st,i)=>{const b=document.createElement("button");b.type="button";b.textContent=(i+1)+". "+(st.title||"");b.setAttribute("role","tab");b.onclick=()=>{if(STORY_API.S.paused){STORY_API.S.paused=false;STORY_API.S.user=false;$("stPlay").textContent="⏸"}STORY_API.go(i)};strip.appendChild(b)})}
function tick(){requestAnimationFrame(tick);const S=STORY_API&&STORY_API.S;if(!S)return;document.body.classList.toggle("touring",!!STORY);bar.hidden=!STORY;res.hidden=!(STORY&&S.paused&&S.user);if(!STORY){sDef=null;orb=null;return}
  if(S.def!==sDef){sDef=S.def;buildStrip();sI=-1}
  if(S.i!==sI){sI=S.i;const st=S.def.steps[sI]||{};step.innerHTML='<bdi class="n">'+(sI+1)+'/'+S.def.steps.length+'</bdi> · '+(st.title||"");$("stNum").textContent=S.def.title;[...strip.children].forEach((b,i)=>{b.setAttribute("aria-selected",i===sI?"true":"false");b.classList.toggle("on",i===sI)});const a=strip.children[sI];if(a)a.scrollIntoView({block:"nearest",inline:"center"});orb=null}
  const moving=!!(S.move||tween);if(wasMove&&!moving){orb={off:camera.position.clone().sub(controls.target),t0:performance.now(),tg:controls.target.clone()}}wasMove=moving;
  if(orb&&!moving&&!S.paused&&!reduce){const k=(performance.now()-orb.t0)/1000,ang=0.1*Math.sin(k*0.3)*Math.min(1,k/3);if(controls.target.distanceTo(orb.tg)>0.5){orb=null;return}camera.position.copy(orb.tg).add(orb.off.clone().applyAxisAngle(new THREE.Vector3(0,1,0),ang));controls.update()}}
requestAnimationFrame(tick);
})();

// ==== v61: Google Maps / Earth style shell — search pill, icon rail, place panel, chips that light up the model, share link, intro flight ====
await __Y(98);var UIPT=null;
(function(){
const $=id=>document.getElementById(id);
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
// line icons (one stroke family)
const P={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 tour:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14"/><path d="M12 17.5v.01"/>',
 gate:'<path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7M3 21h18"/>',room:'<path d="M3 10 12 4l9 6"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',fire:'<path d="M12 21c-4 0-6-2.7-6-6 0-4 4-6 4-10 2 1 5 4 5 7 1-1 1-2 1-3 2 2 2 4 2 6 0 3.3-2 6-6 6z"/>',
 vessel:'<path d="M12 3v18M6 21h12"/><path d="M5 6v3a7 7 0 0 0 14 0V6"/><path d="M8.5 6v3a3.5 3.5 0 0 0 7 0V6"/>',house:'<path d="M4 21V9l8-5 8 5v12z"/><path d="M9 21v-6h6v6"/>',city:'<path d="M3 21V8l5-3 5 3v13M13 21V11h8v10M3 21h18"/>',
 fly:'<path d="M2 16 22 8l-6 12-3-6z"/>',door:'<path d="M5 21V4h11v17M16 7l3 1v12l-3 1"/><path d="M12 12v.01"/>',near:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',size:'<path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',joy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',diamond:'<path d="m12 3 8 9-8 9-8-9z"/>',walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2-6 3 3v3M10 12l2-4 4 3 2 1M12 8l-3 1-2 3"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>'};
const I=(k,c)=>'<svg class="ico'+(c?" "+c:"")+'" viewBox="0 0 24 24" aria-hidden="true">'+(P[k]||P.diamond)+'</svg>';
// --- Hebrew-forgiving search ---
const norm=s=>String(s||"").replace(/<[^>]+>/g," ").replace(/[֑-ׇ]/g,"").replace(/["'״׳`’]/g,"").toLowerCase();
const words=s=>norm(s).split(/[^א-תa-z0-9]+/).filter(Boolean).map(w=>w.length>2&&w[0]==="ה"?w.slice(1):w);
const CATS=[["שערים","gate",/שער|פתח/],["לשכות","room",/לשכ|תאים|בית המוקד|בית החליפות|בית הטבילה|בית אבטינס/],["מזבח","fire",/מזבח|כבש|סובב|יסוד|קרנ|מערכה|שיתין/],["כלים","vessel",/מנור|שולחן|כיור|ארון|מכונ|כלי|חצוצר|מחת|ציץ|לחם הפנים|קטורת|פרוכת|אבן השתי|דוכן/],["הבית","house",/היכל|אולם|קודש|הבית|צלע|עליי/]];
const catOf=(n,city)=>{if(city)return["מקומות בעיר","city"];for(const c of CATS)if(c[2].test(n))return[c[0],c[1]];return["חלקי המקדש","diamond"]};
const isCity=L=>!L.c&&!cLabels.includes(L);
// area of a place, for the Places drawer (compound units: u east, v south; house 100-200, inner court 200-300)
function areaOf(L){if(isCity(L))return"העיר";const n=L.txt||"";if(/שער/.test(n))return"שערים";if(!COMP)return"עזרה חיצונה";const u=(L.v.x-COMP.X0)/A,v=(COMP.N0+L.v.z)/A;
  if(/היכל|אולם|קודש|הבית|תאים|צלע|כרוב|פרוכת|מנורה|שולחן|מזבח הזהב|אבן השתי/.test(n)&&u<206)return"הבית";if(u>=95&&u<=306&&v>=165&&v<=335)return"עזרה פנימית";return"עזרה חיצונה"}
function buildIndex(){const out=[],seen=new Set();
  labels.forEach(L=>{if(!L.txt||!L.el||!L.el.isConnected)return;const k=norm(L.txt);if(seen.has(k))return;seen.add(k);const c=catOf(L.txt+" "+(L.info&&L.info.n||""),isCity(L));out.push({n:L.txt,sub:L.info&&L.info.r||"",cat:c[0],ic:c[1],L,w:words(L.txt+" "+(L.info?L.info.n:"")),w2:words(L.info?L.info.t:""),go:()=>pickLabel(L)})});
  const shown=o=>{for(let q=o;q;q=q.parent){if(!q.visible&&!q.userData.hid)return false}return true};
  cPick.concat(PICK).forEach(o=>{const d=o.userData;if(!d||!d.n||d.train||o.isInstancedMesh||o.__lodFar||!shown(o))return;const k=norm(d.n);if(seen.has(k))return;seen.add(k);const c=catOf(d.n,PICK.includes(o));out.push({n:d.n,sub:d.r||"",cat:c[0],ic:c[1],w:words(d.n),w2:words(d.t),go:()=>pickObj(o)})});
  Object.keys(STORIES).forEach(key=>{const S=STORIES[key];out.push({n:"סיור: "+S.title,sub:S.steps.length+" תחנות",cat:"סיורים",ic:"tour",w:words(S.title+" סיור"),w2:words(S.steps.map(s=>s.title).join(" ")),go:()=>startTour(key)})});
  Object.keys(HELP).forEach(k=>{const d=HELP[k];if(!d||!d.n)return;out.push({n:d.n,sub:"הסבר",cat:"הסברים",ic:"help",w:words(d.n),w2:words(d.t),go:()=>{UIPT=null;showInfo(d)}})});
  return out}
function score(it,q){if(!q.length)return 1;let s=0;for(const w of q){let best=0;for(const x of it.w){if(x===w)best=Math.max(best,10);else if(x.startsWith(w))best=Math.max(best,7);else if(x.includes(w))best=Math.max(best,4)}if(!best)for(const x of it.w2){if(x.startsWith(w)){best=1.5;break}}if(!best)return 0;s+=best}return s}
// --- search pill ---
const sbox=mk("div","ui");sbox.id="sbox";sbox.innerHTML='<div class="row1"><button type="button" class="ib2 go" id="sgo" aria-label="חיפוש">'+I("search")+'</button><input id="sq" type="search" autocomplete="off" placeholder="חיפוש במקדש ובעיר" aria-label="חיפוש במודל"><button type="button" class="ib2" id="sx" aria-label="ניקוי" hidden>'+I("x")+'</button></div><div id="chips" role="group" aria-label="סינון מהיר"></div><div id="sres" hidden role="listbox"></div>';
stage.appendChild(sbox);
const sq=$("sq"),sres=$("sres"),chipBox=$("chips");let CHIP=null,IDX=null,SEL=-1,ROWS=[];
CATS.forEach(c=>{const b=mk("button",null,I(c[1])+esc(c[0]));b.type="button";b.dataset.c=c[0];b.setAttribute("aria-pressed","false");b.onclick=()=>chip(CHIP===c[0]?null:c[0]);chipBox.appendChild(b)});
function chip(c){CHIP=c;chipBox.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.c===CHIP?"true":"false"));IDX=buildIndex();
  labels.forEach(L=>{if(L.force){L.force=false;L.el.classList.remove("hl")}});
  if(CHIP)IDX.filter(it=>it.cat===CHIP&&it.L).forEach(it=>{it.L.force=true;it.L.el.classList.add("hl")});run()}
function run(){const q=words(sq.value);$("sx").hidden=!sq.value&&!CHIP;if(!q.length&&!CHIP){sres.hidden=true;return}IDX=IDX||buildIndex();
  let r=IDX.map(it=>[it,score(it,q)]).filter(a=>a[1]>0&&(!CHIP||a[0].cat===CHIP));r.sort((a,b)=>b[1]-a[1]||a[0].n.length-b[0].n.length);r=r.slice(0,40);
  sres.innerHTML="";ROWS=[];SEL=-1;if(!r.length){sres.innerHTML='<div class="none">לא נמצא. נסו מילה אחרת, למשל "שער", "לשכה" או "מזבח".</div>';sres.hidden=false;return}
  const groups={};r.forEach(a=>{(groups[a[0].cat]=groups[a[0].cat]||[]).push(a[0])});
  Object.keys(groups).forEach(g=>{sres.appendChild(mk("h4",null,esc(g)));groups[g].forEach(it=>{const b=mk("button",null,'<span class="ri">'+I(it.ic)+'</span><span class="rt"><b>'+esc(it.n)+'</b>'+(it.sub?'<small>'+esc(it.sub)+'</small>':'')+'</span>');b.type="button";b.setAttribute("role","option");b.onclick=()=>choose(it);sres.appendChild(b);ROWS.push([b,it])})});sres.hidden=false}
function choose(it){sres.hidden=true;sq.blur();closeDr();try{it.go()}catch(e){console.warn(e)}}
sq.addEventListener("input",()=>{IDX=null;run()});sq.addEventListener("focus",()=>{IDX=null;if(sq.value||CHIP)run()});
sq.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!ROWS.length)return;SEL=(SEL+(e.key==="ArrowDown"?1:-1)+ROWS.length)%ROWS.length;ROWS.forEach((r,i)=>r[0].classList.toggle("on",i===SEL));ROWS[SEL][0].scrollIntoView({block:"nearest"})}else if(e.key==="Enter"){if(ROWS.length)choose(ROWS[Math.max(0,SEL)][1])}else if(e.key==="Escape"){sq.value="";run();sq.blur()}e.stopPropagation()});
sq.addEventListener("keyup",e=>e.stopPropagation());
$("sgo").onclick=()=>{if(ROWS.length)choose(ROWS[0][1]);else sq.focus()};
$("sx").onclick=()=>{sq.value="";chip(null);sres.hidden=true;sq.focus()};
document.addEventListener("pointerdown",e=>{if(!sbox.contains(e.target))sres.hidden=true},true);
window.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==sq&&!/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName)){e.preventDefault();sq.focus()}});
// --- going to things ---
function hl(el){document.querySelectorAll(".lbl.hl").forEach(x=>{if(!labels.find(L=>L.el===x&&L.force))x.classList.remove("hl")});if(!el)return;el.classList.add("hl");clearTimeout(hl._t);hl._t=setTimeout(()=>{if(!labels.find(L=>L.el===el&&L.force))el.classList.remove("hl")},8000)}
function pickLabel(L){goLabel(L);hl(L.el);L.pin=performance.now()}
const _goLabel=goLabel;goLabel=function(L){UIPT=L.v.clone();UIPT._L=L;_goLabel(L);UIPT=null};
function flyToPoint(c,r){if(STORY)STORY.stop();if(TOUR)stopTour();if(WALK)stopWalk();if(DRONE){droneFly(c.clone());return}
  const cp=camera.position.clone(),dir=cp.sub(c);dir.y=0;if(dir.length()<1)dir.set(1,0,1);dir.normalize();const dist=Math.max(28,Math.min(260,r*3));
  const p=c.clone().addScaledVector(dir,dist);p.y=c.y+Math.max(10,dist*0.55);const t=c.clone();try{safeCam(p,t)}catch(e){}
  document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  if(reduce){camAt(p,t);return}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:1600,arc:true}}
function objCenter(o){const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return null;const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());return[c,Math.max(4,s.length()/2)]}
function pickObj(o){const cr=objCenter(o);if(!cr)return;flyToPoint(cr[0],cr[1]);UIPT=cr[0].clone();showInfo(o.userData)}
function startTour(key){closeInfo();closeDr();if(STORY)STORY.stop();if(TOUR)stopTour();if(WALK)stopWalk();try{stopDrone()}catch(e){}if(/^(pesach|sukkot|hakhel)$/.test(key)&&PLAN!=="ez")$("plEz").click();STORY_API.start(key)}
// --- icon rail + drawers ---
const rail=mk("nav","gl ui dim");rail.id="rail";rail.setAttribute("aria-label","תפריט");stage.appendChild(rail);
const DR={};
[["tours","tour","סיורים"],["places","pin","מקומות"],["method","ruler","שיטה"],["view","layers","תצוגה"],["help","help","עזרה"]].forEach(a=>{
  const b=mk("button",null,I(a[1]));b.type="button";b.dataset.tip=a[2];b.setAttribute("aria-pressed","false");b.setAttribute("aria-label",a[2]);b.onclick=()=>toggleDr(a[0]);rail.appendChild(b);
  const d=mk("section","dr gl ui",'<div class="grab"></div><button type="button" class="x" aria-label="סגירה">'+I("x")+'</button><h2>'+a[2]+'</h2>');d.id="dr-"+a[0];d.setAttribute("aria-label",a[2]);d.querySelector(".x").onclick=closeDr;stage.appendChild(d);DR[a[0]]={b,d}});
function closeDr(){document.body.classList.remove("drawer");Object.values(DR).forEach(x=>{x.d.classList.remove("open","full");x.b.setAttribute("aria-pressed","false")})}
function toggleDr(k){const was=DR[k].d.classList.contains("open");closeDr();if(was)return;sres.hidden=true;document.body.classList.add("drawer");if(DR[k].fill)DR[k].fill();DR[k].d.classList.add("open");DR[k].b.setAttribute("aria-pressed","true");if(window.innerWidth<=700)closeInfo()}
window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDr();if(!STORY)closeInfo()}});
const grabSwipe=(g,el,close)=>{let y0=null;g.addEventListener("pointerdown",e=>{y0=e.clientY;g.setPointerCapture(e.pointerId)});g.addEventListener("pointerup",e=>{if(y0==null)return;const dy=e.clientY-y0;y0=null;if(dy>40){if(el.classList.contains("full"))el.classList.remove("full");else close()}else if(dy<-40)el.classList.add("full");else el.classList.toggle("full")})};
Object.values(DR).forEach(x=>grabSwipe(x.d.querySelector(".grab"),x.d,closeDr));
// tours drawer: cards with picture tile, length and stations
const TICON={oldcity:"🏛",pilgrim:"🚶",yk:"🕯",tamid:"🐑",pesach:"🍷",sukkot:"🌿",hakhel:"📖"};
DR.tours.fill=()=>{const d=DR.tours.d;d.querySelectorAll(".tcard,.tnote").forEach(x=>x.remove());
  Object.keys(STORIES).forEach(k=>{const S=STORIES[k];const min=Math.max(2,Math.round(S.steps.reduce((a,s)=>a+(s.cap||"").length,0)/14/60+S.steps.length*0.15));const b=mk("button","tcard",'<span class="tim">'+(TICON[k]||"🧭")+'</span><span><b>'+esc(S.title)+'</b><small>'+S.steps.length+' תחנות · כ־<bdi class="n">'+min+'</bdi> דקות</small></span>');b.type="button";b.onclick=()=>startTour(k);d.appendChild(b)});
  d.appendChild(mk("p","tnote ch",'נגיעה במודל עוצרת את הסיור לרגע, ו"המשך סיור" מחזיר אותו. Esc יוצא מהסיור.'))};
// places drawer: views, then places by area
{const d=DR.places.d;d.appendChild(mk("h3",null,"נקודות מבט"));const vs=$("viewSeg");vs.classList.add("vseg");d.appendChild(vs);const pl=mk("div","plist");pl.id="plist";d.appendChild(pl);
  DR.places.fill=()=>{pl.innerHTML="";const g={};buildIndex().filter(it=>it.L).forEach(it=>{const a=areaOf(it.L);(g[a]=g[a]||[]).push(it)});
    ["הבית","עזרה פנימית","עזרה חיצונה","שערים","העיר"].forEach(c=>{if(!g[c])return;pl.appendChild(mk("h3",null,esc(c)));g[c].sort((a,b)=>a.n.localeCompare(b.n,"he")).forEach(it=>{const b=mk("button",null,I(it.ic)+esc(it.n));b.type="button";b.onclick=()=>{if(window.innerWidth<=700)closeDr();it.go()};pl.appendChild(b)})})}}
// method drawer
{const d=DR.method.d;const grp=[...document.querySelectorAll(".controls .cgroup")];const m=grp.find(g=>g.querySelector("#planSeg"));if(m)m.querySelectorAll(".ctl").forEach(c=>d.appendChild(c));
  d.appendChild(mk("p","ch",'המודל מראה שיטה אחת בכל פעם. הכפתור i ליד כל אפשרות מסביר את המחלוקת ואת המקור.'));const fit=$("fit");if(fit)d.appendChild(fit)}
// view drawer: hour slider (עלות השחר until the night), day type, festival, background, layers
{const d=DR.view.d;const HMIN=4.5,HMAX=23.5,SPAN=HMAX-HMIN;
  const fmtH=h=>{let H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H+=1;M=0}H=((H%24)+24)%24;return (H<10?"0":"")+H+":"+(M<10?"0":"")+M};
  const bucket=h=>{const sp=sunAt(h);return sp.el<=-7?"night":h<10.5?"morning":h>14.5?"evening":"noon"};
  const BN={morning:"בוקר",noon:"צהריים",evening:"ערב",night:"לילה"};
  const w=mk("div","ctl hourctl",'<div class="cl">שעה ביום: <b id="hsv"></b></div><div class="hslide"><div class="hmarks" id="hmarks" aria-hidden="true"></div><input type="range" id="hslider" min="4.5" max="23.5" step="0.05" aria-label="שעה ביום"></div><div class="hcap" id="hcap" aria-live="polite"></div><div class="hlist" id="hlist"></div>');d.appendChild(w);
  const hsl=$("hslider"),hsv=$("hsv"),hcap=$("hcap"),hmarks=$("hmarks"),hlist=$("hlist");
  let zKey=null,zs=[];
  function marks(){if(zKey===DOY)return;zKey=DOY;zs=zmanim(DOY);const bits=[];
    zs.forEach(z=>{const p=(z.h-HMIN)/SPAN;if(p<0||p>1)return;bits.push('<i style="right:'+(p*100).toFixed(2)+'%" title="'+esc(z.n)+'"></i>')});
    hmarks.innerHTML=bits.join("");
    hlist.innerHTML=zs.map(z=>'<span>'+esc(z.n)+'</span>').join('<span class="dot" aria-hidden="true">·</span>')}
  function readout(h){const z=zmanAt(h,DOY),t=bucket(h);
    hsv.innerHTML='<bdi class="n">'+fmtH(h)+'</bdi> · '+BN[t];
    hcap.textContent=z?z.n:"";
    hsl.setAttribute("aria-valuetext",fmtH(h)+" "+BN[t]+(z?" "+z.n:""));
    hsl.setAttribute("aria-valuenow",String(Math.round(h*20)/20));
    hlist.querySelectorAll("span:not(.dot)").forEach(s=>s.classList.toggle("on",!!(z&&s.textContent===z.n)));
    hmarks.querySelectorAll("i").forEach(el=>el.classList.toggle("on",!!(z&&el.title===z.n)))}
  let raf=0;
  function applyH(h){setHour(h);document.querySelectorAll("#timeSeg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===bucket(h)?"true":"false"))}
  hsl.addEventListener("input",()=>{const h=+hsl.value;marks();readout(h);if(!raf)raf=requestAnimationFrame(()=>{raf=0;applyH(+hsl.value)})});
  hsl.addEventListener("change",()=>{if(raf){cancelAnimationFrame(raf);raf=0}const h=+hsl.value;readout(h);applyH(h)});
  ["tM","tN","tE","tL"].forEach(id=>$(id).addEventListener("click",()=>{if(raf){cancelAnimationFrame(raf);raf=0}const h=TIMES[$(id).dataset.t].h;hsl.value=String(h);marks();readout(h)}));
  hsl.value=String(Math.max(HMIN,Math.min(HMAX,HOUR!=null?HOUR:TIMES[TIME].h)));marks();readout(+hsl.value);
  const days=[["chol","חול"],["shabbat","שבת"],["rosh","ראש חודש"]];
  const dw=mk("div","ctl",'<div class="cl">סוג היום</div><div class="seg tap" id="daySeg" role="group" aria-label="סוג היום">'+days.map(([k,n])=>'<button type="button" data-day="'+k+'" aria-pressed="'+(DAY===k?"true":"false")+'">'+n+'</button>').join("")+'</div>');d.appendChild(dw);
  dw.querySelector("#daySeg").addEventListener("click",e=>{const b=e.target.closest("button[data-day]");if(!b)return;dw.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));setDay(b.dataset.day)});
  // setFest returns immediately for an unknown key, so it cannot be cleared — no "ללא" button.
  const fests=[["pesach","פסח"],["shavuot","שבועות"],["sukkot","סוכות"]];
  const curF=Object.keys(FEST).find(k=>FEST[k].doy===DOY)||"";
  const fw=mk("div","ctl",'<div class="cl">חג</div><div class="seg tap" id="festSeg" role="group" aria-label="חג">'+fests.map(([k,n])=>'<button type="button" data-fest="'+k+'" aria-pressed="'+(curF===k?"true":"false")+'">'+n+'</button>').join("")+'</div>');d.appendChild(fw);
  fw.querySelector("#festSeg").addEventListener("click",e=>{const b=e.target.closest("button[data-fest]");if(!b)return;fw.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));setFest(b.dataset.fest);zKey=null;marks();readout(+hsl.value)});
  const ts=$("timeSeg");if(ts)ts.closest(".ctl").style.display="none";
  const v=[...document.querySelectorAll(".controls .cgroup")].find(g=>g.querySelector("#floorSeg"));if(v)v.querySelectorAll(".ctl").forEach(c=>{if(!c.querySelector("#timeSeg"))d.appendChild(c)})}
// help drawer
{const d=DR.help.d;d.appendChild(mk("div",null,'<h3>איך זזים</h3><ul class="plain"><li>גרירה: הזזת המפה.</li><li>גרירה ימנית, או <kbd>Ctrl</kbd> וגרירה: סיבוב והטיה.</li><li>גלגלת או צביטה: זום אל המקום שמתחת לסמן.</li><li>לחיצה כפולה: טיסה אל הנקודה.</li><li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> או החצים: תנועה. <kbd>Q</kbd>/<kbd>E</kbd>: למטה ולמעלה. <kbd>Shift</kbd>: מהר.</li><li><kbd>/</kbd>: חיפוש. <kbd>Esc</kbd>: סגירה.</li><li>המצפן: לחיצה מפנה צפונה, ולחיצה כפולה מיישרת את המבט.</li></ul><h3>הסימנים</h3><p>📜 מפורש במקור · ⚖️ לפי ההלכה · 💡 הצעה שלנו</p>'));
  const sh=mk("button","tcard",'<span class="tim">'+I("share")+'</span><span><b>שתפו את המבט הזה</b><small>קישור שפותח בדיוק את המקום הזה</small></span>');sh.type="button";sh.onclick=()=>share();d.appendChild(sh);
  const intro=mk("button","tcard",'<span class="tim">'+I("chat")+'</span><span><b>מדריך קצר</b><small>להציג שוב את כרטיסי הפתיחה</small></span>');intro.type="button";intro.onclick=()=>{closeDr();showIntro(0)};d.appendChild(intro);
  const about=[...document.querySelectorAll(".grid .panel")].find(p=>!p.id);if(about)d.appendChild(about);const f=document.querySelector("footer.foot");if(f)d.appendChild(f)}
// --- the place panel (left, like Google Maps) ---
const card=$("infocard");card.classList.add("ui");$("infoX").innerHTML=I("x");$("infoX").setAttribute("aria-label","סגירה");
const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.id="icline";svg.innerHTML='<line stroke="#C9A24B" stroke-width="1.6" stroke-dasharray="4 4"/><circle r="6" fill="none" stroke="#C9A24B" stroke-width="2"/>';stage.appendChild(svg);svg.style.display="none";
const CUR={pt:null,d:null,dist0:0};
function dimsOf(t){const s=norm(t).replace(/,/g,".");const m=s.match(/(\d+(?:\.\d+)?)\s*(?:×|x|על)\s*(\d+(?:\.\d+)?)(?:\s*(?:×|x|על)\s*(\d+(?:\.\d+)?))?\s*אמ/);const fm=v=>(Math.round(v*A*10)/10).toString();
  if(m){const a=[m[1],m[2],m[3]].filter(Boolean).map(Number);return'<bdi class="n">'+a.join(" × ")+'</bdi> אמה ≈ <bdi class="n">'+a.map(fm).join(" × ")+'</bdi> מ׳'}
  const g=s.match(/(\d+(?:\.\d+)?)\s*אמה/);if(g)return'<bdi class="n">'+g[1]+'</bdi> אמה ≈ <bdi class="n">'+fm(+g[1])+'</bdi> מ׳';return""}
function tagsOf(t){const s=String(t||"");const o=[];if(s.includes("📜"))o.push('<span class="ic-tag">📜 מפורש</span>');if(s.includes("⚖"))o.push('<span class="ic-tag">⚖️ מקור</span>');if(s.includes("💡"))o.push('<span class="ic-tag s">💡 הצעה</span>');return o.join("")}
const near=(pt,n)=>labels.filter(L=>L.el&&L.el.isConnected&&L.txt&&L.v.distanceTo(pt)>0.5).map(L=>[L,L.v.distanceTo(pt)]).sort((a,b)=>a[1]-b[1]).slice(0,n);
const _show=showInfo;
showInfo=function(d){if(!d)return;_show(d);const pt=UIPT;UIPT=null;CUR.d=d;CUR.pt=pt?pt.clone():null;if(pt&&pt._L)CUR.pt._L=pt._L;CUR.dist0=pt?camera.position.distanceTo(pt):0;
  const city=pt&&pt._L?isCity(pt._L):false;const c=catOf(d.n||"",city);const t=d.t||"";const long=norm(t).length>340;
  const src=(d.r||"").split(/[;؛]| · /).map(x=>x.trim()).filter(Boolean);
  const inner=/היכל|קודש הקודשים|הבית$/.test(d.n||"");
  let h='<div class="ic-grab"></div><div class="ic-hero">'+I(c[1])+'</div><div class="ic-head"><h2>'+esc(d.n)+'</h2><div class="ic-type"><span>'+esc(c[0])+'</span>'+tagsOf(t)+'</div></div>';
  h+='<div class="ic-btns">'+(CUR.pt?'<button type="button" data-a="fly"><span class="c">'+I("fly")+'</span>טוס לשם</button>':'')+(inner?'<button type="button" data-a="in"><span class="c">'+I("door")+'</span>היכנס</button>':'')+(CUR.pt?'<button type="button" data-a="near"><span class="c">'+I("near")+'</span>מה בסביבה</button>':'')+'<button type="button" data-a="share"><span class="c">'+I("share")+'</span>שתף</button></div><div class="ic-body">';
  if(t)h+='<div class="ic-txt'+(long?' short':'')+'">'+t+'</div>'+(long?'<button type="button" class="ic-more">עוד</button>':'');
  const dm=dimsOf(t);if(dm)h+='<div class="ic-row">'+I("size")+'<div>'+dm+'<br><small class="ch">אמה של <bdi class="n">'+Math.round(A*1000)/10+'</bdi> ס״מ</small></div></div>';
  if(src.length)h+='<div class="ic-row">'+I("book")+'<div class="ic-src">'+src.map(x=>'<a href="https://www.sefaria.org.il/search?q='+encodeURIComponent(x.replace(/[֑-ׇ]/g,""))+'&tab=text" target="_blank" rel="noopener">'+esc(x)+'</a>').join("")+'</div></div>';
  h+='<div class="ic-row ic-near" hidden></div></div>';
  $("infobody").innerHTML=h;card.hidden=false;card.classList.remove("full");card.scrollTop=0;document.body.classList.add("pane");
  const g=card.querySelector(".ic-grab");if(g)grabSwipe(g,card,closeInfo)};
const _close=closeInfo;try{closeInfo=function(){_close();document.body.classList.remove("pane");CUR.pt=null}}catch(e){}
new MutationObserver(()=>{document.body.classList.toggle("pane",!card.hidden)}).observe(card,{attributes:true,attributeFilter:["hidden"]});
card.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.classList.contains("ic-more")){const x=card.querySelector(".ic-txt");const s=x.classList.toggle("short");b.textContent=s?"עוד":"פחות";return}
  const a=b.dataset.a;if(!a)return;e.stopPropagation();
  if(a==="fly"&&CUR.pt){const L=CUR.pt._L;if(L)goLabel(L);else flyToPoint(CUR.pt,20);CUR.dist0=0}
  else if(a==="in"){const k=/קודש הקודשים/.test(CUR.d.n)?"vKd":"vIn";$(k).click()}
  else if(a==="near"&&CUR.pt){const box=card.querySelector(".ic-near");box.hidden=!box.hidden;if(!box.hidden){box.innerHTML=I("near")+'<div><b>בסביבה</b></div>';const w=box.lastChild;near(CUR.pt,6).forEach(([L,dd])=>{const q=mk("button",null,esc(L.txt)+' <small class="ch">(<bdi class="n">'+Math.round(dd/A)+'</bdi> אמה)</small>');q.type="button";q.onclick=()=>pickLabel(L);w.appendChild(q)})}}
  else if(a==="share")share()});
// click on the sky closes the panel
const tv=new THREE.Vector3();
function cardTick(){requestAnimationFrame(cardTick);
  if(card.hidden||!CUR.pt||window.innerWidth<=700){svg.style.display="none";return}
  const dd=camera.position.distanceTo(CUR.pt);if(CUR.dist0&&dd>Math.max(900,CUR.dist0*4)&&!STORY){closeInfo();return}
  tv.copy(CUR.pt).project(camera);if(tv.z>1||Math.abs(tv.x)>1.1||Math.abs(tv.y)>1.1){svg.style.display="none";return}
  const sr=stage.getBoundingClientRect(),cr=card.getBoundingClientRect();const x=(tv.x+1)/2*sr.width,y=(1-tv.y)/2*sr.height;const cx=cr.right-sr.left,cy=Math.max(140,Math.min(sr.height-40,y));
  if(x<cx+8){svg.style.display="none";return}
  svg.style.display="";const ln=svg.firstChild,ci=svg.lastChild;ln.setAttribute("x1",cx);ln.setAttribute("y1",cy);ln.setAttribute("x2",x);ln.setAttribute("y2",y);ci.setAttribute("cx",x);ci.setAttribute("cy",y)}
requestAnimationFrame(cardTick);
// --- share link ---
function shareURL(){const p=camera.position,t=controls.target,f=v=>v.toFixed(1);const q=["v="+[p.x,p.y,p.z,t.x,t.y,t.z].map(f).join(","),"pl="+PLAN,"a="+A,"f="+FMODE,"l="+LOC];if(CUR.d&&!card.hidden)q.push("o="+encodeURIComponent(CUR.d.n));return location.href.split("#")[0]+"#"+q.join("&")}
function share(){const u=shareURL();try{history.replaceState(null,"",u)}catch(e){}const done=()=>toast("הקישור הועתק. מי שיפתח אותו יראה בדיוק את המבט הזה.");if(navigator.share&&window.innerWidth<=700){navigator.share({title:"הדמיית המקדש",url:u}).catch(()=>{})}else if(navigator.clipboard)navigator.clipboard.writeText(u).then(done,()=>toast(u));else toast(u)}
function restore(){const h=location.hash.slice(1);if(!h||!/v=/.test(h))return false;const Q={};h.split("&").forEach(kv=>{const i=kv.indexOf("=");if(i>0)Q[kv.slice(0,i)]=decodeURIComponent(kv.slice(i+1))});
  const click=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
  if(Q.pl==="rambam")click("plRb");if(Q.a){const m={"0.48":"a48","0.525":"a525","0.576":"a576"}[Q.a];if(m)click(m)}if(Q.f==="mid")click("fMid");if(Q.l==="altar")click("lA");closeInfo();
  const v=(Q.v||"").split(",").map(Number);if(v.length===6&&v.every(isFinite)){tween=null;camAt(new THREE.Vector3(v[0],v[1],v[2]),new THREE.Vector3(v[3],v[4],v[5]));document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"))}
  if(Q.o){const L=labels.find(L=>L.txt===Q.o);if(L){UIPT=L.v.clone();UIPT._L=L;showInfo(L.info||{n:L.txt})}else{const o=cPick.concat(PICK).find(o=>o.userData&&o.userData.n===Q.o);if(o){const cr=objCenter(o);UIPT=cr?cr[0]:null;showInfo(o.userData)}}}
  return true}
// --- corner controls: compass, home, zoom, full screen ---
{const hud=$("hud");hud.classList.add("ui","dim");
  const zg=mk("div","zgrp");const zin=mk("button",null,I("plus")),zout=mk("button",null,I("minus"));zin.type=zout.type="button";zin.setAttribute("aria-label","התקרבות");zout.setAttribute("aria-label","התרחקות");zg.append(zin,zout);
  const zoom=f=>{if(WALK||DRONE)return;tween=null;const t=controls.target,p=camera.position,np=t.clone().add(p.clone().sub(t).multiplyScalar(f));if(np.distanceTo(t)<3)return;tween={p0:p.clone(),t0:t.clone(),p1:np,t1:t.clone(),start:performance.now(),dur:350}};
  zin.onclick=()=>zoom(0.6);zout.onclick=()=>zoom(1.6);
  const fs=mk("button","hb",I("full"));fs.type="button";fs.id="fsB";fs.setAttribute("aria-label","מסך מלא");fs.onclick=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen).call(document.documentElement)}catch(e){toast("הדפדפן לא מאפשר מסך מלא כאן.")}};
  hud.insertBefore(zg,hud.firstChild);hud.appendChild(fs);
  $("homeB").innerHTML=I("house");
  $("compass").addEventListener("dblclick",e=>{e.preventDefault();if(WALK)return;const t=controls.target,p=camera.position,d=p.distanceTo(t),f=p.clone().sub(t);f.y=0;if(f.length()<1)f.set(0,0,1);f.normalize();const np=t.clone().addScaledVector(f,d*Math.cos(0.42));np.y=t.y+d*Math.sin(0.42);tween={p0:p.clone(),t0:t.clone(),p1:np,t1:t.clone(),start:performance.now(),dur:700}});
  ["mini","exitB","perfbox","attrib","fastB"].forEach(id=>{const e=$(id);if(e)e.classList.add("ui")})}
// --- idle: the controls fade a little after 5 s ---
{let t=null;const wake=()=>{document.body.classList.remove("idle");clearTimeout(t);t=setTimeout(()=>document.body.classList.add("idle"),5000)};["pointermove","pointerdown","keydown","wheel","touchstart"].forEach(ev=>window.addEventListener(ev,wake,{passive:true,capture:true}));wake()}
// --- first visit: fly in from the Mount of Olives, then 3 short cards ---
const IN=[["move","גוררים כדי לזוז","גרירה מזיזה את המפה, גלגלת או צביטה מקרבות, וגרירה ימנית מסובבת. לחיצה כפולה טסה אל המקום."],["pin","לוחצים על כל חלק","לחיצה על חלק במקדש פותחת כרטיס עם השם, המקור והמידות. 📜 מפורש · ⚖️ מקור · 💡 הצעה."],["search","מחפשים או יוצאים לסיור","אפשר לחפש למעלה (למשל \"גזית\"), או לבחור סיור מודרך בתפריט."]];
P.move='<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>';
const intro=mk("div","ui");intro.id="intro";intro.hidden=true;intro.innerHTML='<div class="box gl" role="dialog" aria-modal="true" aria-labelledby="inH"><div class="ill"></div><div class="dots"><i></i><i></i><i></i></div><h2 id="inH"></h2><p id="inP"></p><div class="ib"></div></div>';stage.appendChild(intro);
function showIntro(i){intro.hidden=false;intro.querySelector(".ill").innerHTML=I(IN[i][0]);intro.querySelectorAll(".dots i").forEach((d,k)=>d.classList.toggle("on",k===i));$("inH").textContent=IN[i][1];$("inP").textContent=IN[i][2];const ib=intro.querySelector(".ib");ib.innerHTML="";
  const B=(t,pri,fn)=>{const b=mk("button",pri?"pri":null,t);b.type="button";b.onclick=fn;ib.appendChild(b);return b};
  const end=()=>{intro.hidden=true;LS.set("tm_intro","1")};
  if(i<2){B("דלג",0,end);B("הבא",1,()=>showIntro(i+1)).focus()}else{B("✈ חקירה חופשית",0,end);B("🧭 סיור מודרך",1,()=>{end();toggleDr("tours")}).focus()}}
intro.addEventListener("click",e=>{if(e.target===intro){intro.hidden=true;LS.set("tm_intro","1")}});
function flyIn(then){try{const [p,t]=viewPose("olives");if(camera.position.distanceTo(p)>5)camAt(p,t);setTimeout(()=>{flyTo("home",4200);setTimeout(then,4300)},400)}catch(e){then()}}
{const t0=performance.now();const wait=()=>{if($("loading")&&performance.now()-t0<240000){setTimeout(wait,200);return}const r=restore();if(!r&&!LS.get("tm_intro")&&!window.__EV){LS.set("tm_intro","1");if(window.__TOUCHED)showIntro(0);else flyIn(()=>showIntro(0))}};setTimeout(wait,300)}
window.__UI={buildIndex,run,toggleDr,showIntro,share,shareURL,restore,closeDr,chip,flyIn};
})();
// the stage must never scroll (focus on an off-screen item scrolled it sideways and showed a blue strip)
{const st=document.getElementById("stage");const fix=()=>{if(st.scrollLeft||st.scrollTop){st.scrollLeft=0;st.scrollTop=0}};st.addEventListener("scroll",fix,{passive:true});setInterval(fix,500)}


