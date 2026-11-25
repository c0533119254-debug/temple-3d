/* v115 · מהירות: קבוצות סטטיות של הרבה רשתות קטנות (מסוף האוטובוסים, מפרצי ההורדה, אבני הנחל) מתאחדות לפי חומר ולפי כרטיס המידע. המקוריות נשארות מוסתרות, כמו ב-mergeStatic */
function mergeGroupStatic(g){if(!g||!THREE.BufferGeometryUtils||g.userData.mgs)return 0;g.userData.mgs=1;g.updateMatrixWorld(true);const by=new Map(),inv=new THREE.Matrix4().copy(g.matrixWorld).invert(),rel=new THREE.Matrix4();let cut=0;
  g.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.userData.merged||Array.isArray(o.material)||o.material.transparent||!o.visible||!o.geometry.attributes.position||!o.geometry.attributes.normal||o.children.length)return;for(let q=o.parent;q&&q!==g;q=q.parent)if(!q.visible)return;
    const t=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;if(t>1500)return;const k=o.material.uuid+(o.castShadow?"s":"n")+(o.receiveShadow?"r":"")+"|"+(o.userData&&o.userData.n||"")+"|"+o.renderOrder;if(!by.has(k))by.set(k,[]);by.get(k).push(o)});
  by.forEach(list=>{if(list.length<3)return;const gs=list.map(o=>{const q=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone(),n=q.attributes.position.count,G=new THREE.BufferGeometry();G.setAttribute("position",q.attributes.position);G.setAttribute("normal",q.attributes.normal);G.setAttribute("uv",q.attributes.uv||new THREE.Float32BufferAttribute(new Float32Array(n*2),2));rel.multiplyMatrices(inv,o.matrixWorld);G.applyMatrix4(rel);return G});
    const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs,false);if(!mg)return;const o0=list[0],m=new THREE.Mesh(mg,o0.material);m.castShadow=o0.castShadow;m.receiveShadow=o0.receiveShadow;m.renderOrder=o0.renderOrder;m.userData=Object.assign({},o0.userData,{merged:true});g.add(m);
    try{if(typeof PICK!=="undefined"&&list.some(o=>PICK.indexOf(o)>=0)){PICK.push(m);list.forEach(o=>{const i=PICK.indexOf(o);if(i>=0)PICK.splice(i,1)})}}catch(e){}
    list.forEach(o=>{o.visible=false;o.userData.hid=true;o.matrixAutoUpdate=false});cut+=list.length-1});return cut}
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

// ---- time of day ----
function b64url(path,cb){fetch(path).then(r=>r.text()).then(t=>__AFTER(()=>cb(URL.createObjectURL(new Blob([b64bytes(t)]))))).catch(()=>{})}
const SKY={morning:{f:"sky_morning.hdr.txt",exp:0.5,sun:1.55,hemi:0.26,fog:[1.146,0.841,0.699]},noon:{f:"sky_noon.hdr.txt",exp:0.46,sun:1.2,hemi:0.34,fog:[0.613,0.66,0.796]},evening:{f:"sky_evening.hdr.txt",exp:0.46,sun:1.25,hemi:0.28,fog:[1.146,0.841,0.699]}},SKYT={};
// topic 6 stage 2: the sun at its real place over Jerusalem for an hour of the day (NOAA solar position formulas, https://gml.noaa.gov/grad/solcalc/solareqns.PDF).
// 📜 place: the Dome of the Rock, 31.778° N 35.235° E (OpenStreetMap). Local standard time UTC+2 (no summer time: the hours of the Temple are the hours of the sun).
// 💡 DOY = day of the year. 105 = 15 April, an average date for Pesach (15 Nisan falls between late March and late April).
// 💡 122.6: the default is a regular day (no festival): DOY 80 = 21 March, the spring equinox, the middle of the sun's yearly path (day and night equal). Picked by us, not from a source.
let HOUR=null,DOY=80;const JLM={lat:31.778,lon:35.235,tz:2};
function sunAt(h,doy){doy=doy||DOY;const r=Math.PI/180,g=2*Math.PI/365*(doy-1+(h-12)/24),
  eq=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g)),
  de=0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g),
  ts=h*60+eq+4*JLM.lon-60*JLM.tz,ha=(ts/4-180)*r,la=JLM.lat*r,
  ce=Math.sin(la)*Math.sin(de)+Math.cos(la)*Math.cos(de)*Math.cos(ha),el=Math.asin(Math.max(-1,Math.min(1,ce))),
  az=Math.atan2(Math.sin(ha),Math.cos(ha)*Math.sin(la)-Math.tan(de)*Math.cos(la))/r+180;
  return{el:el/r,az:az}}
// a direction in the scene for an elevation and a compass bearing (0 = north, 90 = east); the scene is turned with the mount walls (G2S)
function skyVec(el,az){const r=Math.PI/180,c=Math.cos(el*r),q=G2S(Math.sin(az*r)*c,Math.cos(az*r)*c);return new THREE.Vector3(q[0],Math.sin(el*r),-q[1]).normalize()}
// topic 6 stage 3: the times of the day in the Temple, for the hour slider (topic 7) and the stories. h = local standard hour.
// ⚖️ "seasonal hours" (שעות זמניות): the day from sunrise to sunset in 12 parts (Rambam, commentary on the Mishna, Berachot 1:2). Others count from dawn to the stars (Magen Avraham 58:1) – not used here.
function hourAtEl(el,am,doy){let a=am?0:12,b=am?12:24;for(let i=0;i<40;i++){const m=(a+b)/2,e=sunAt(m,doy).el;if((e<el)===am)a=m;else b=m}return(a+b)/2}
function zmanim(doy){const ne=hourAtEl(-0.833,true,doy),sh=hourAtEl(-0.833,false,doy),zh=(sh-ne)/12,Z=(n,h,tag,src,t)=>({n,h,tag,src,t});
  return[Z("עלות השחר",ne-1.2,"⚖️","פסחים צד, א: ארבעה מילין לפני הזריחה; 72 דקות (מיל = 18 דקות), ויש אומרים 90 דקות","השחר עולה במזרח. מכאן כשרות עבודות היום (מגילה כ, א)"),
    Z("האיר פני כל המזרח",ne-0.6,"📜","תמיד ג, ב; יומא כח, א","הממונה אומר: \"צאו וראו אם הגיע זמן השחיטה\". כשהאיר כל המזרח עד חברון – שוחטים את תמיד של שחר. 💡 השעה לא מפורשת; כאן באמצע בין עלות השחר לזריחה"),
    Z("הנץ החמה",ne,"📜","ברכות ט, ב","השמש זורחת מעל הר הזיתים"),
    Z("חצות היום",ne+6*zh,"⚖️","פסחים נח, א","השמש בדרום, הצל הקצר ביותר. מכאן מנחה גדולה (שש ומחצה)"),
    Z("שחיטת תמיד של בין הערביים",ne+8.5*zh,"⚖️","פסחים ה, א","\"תמיד נשחט בשמונה ומחצה וקרב בתשעה ומחצה\". בערב פסח – שעה אחת קודם, ואחריו הפסח"),
    Z("הקטרת תמיד של בין הערביים",ne+9.5*zh,"⚖️","פסחים ה, א",""),
    Z("שקיעת החמה",sh,"📜","ברכות ב, ב","השמש שוקעת במערב, מאחורי הבית"),
    Z("צאת הכוכבים",hourAtEl(-8.5,false,doy),"⚖️","שבת לה, ב; 💡 שמש 8.5° מתחת לאופק","שלושה כוכבים בינוניים. כאן מתחיל הלילה")]}
// the time of the day near an hour (within 20 minutes), for a caption under the slider: null when none
function zmanAt(h,doy){let b=null;zmanim(doy).forEach(z=>{const d=Math.abs(z.h-h);if(d<=1/3&&(!b||d<Math.abs(b.h-h)))b=z});return b}
// topic 6 stage 4: the festivals in the sky. 📜 Pesach 15 Nisan (Lev 23:5-6), Shavuot 50 days after the Omer (Lev 23:15-16), Sukkot 15 Tishrei (Lev 23:34).
// 💡 the solar date moves every year; these are average days of the year: 15 April, 4 June, 8 October. On the 15th the moon is full (stage 1).
const FEST={chol:{doy:80,n:"יום רגיל"},pesach:{doy:105,n:"פסח"},shavuot:{doy:155,n:"שבועות"},sukkot:{doy:281,n:"סוכות"}};
function setFest(k){const f=FEST[k];if(!f)return;DOY=f.doy;applyTime();return f}
function setHour(h){HOUR=((h%24)+24)%24;const sp=sunAt(HOUR);TIME=sp.el<=-7?"night":HOUR<10.5?"morning":HOUR>14.5?"evening":"noon";applyTime();return sp}
// the four buttons are fixed hours: morning 6:30 (sun ~16° up in the east), noon 11:39 = midday (חצות היום, the sun due south), evening 17:15 (~10° up in the west), night 23:30
const TIMES={morning:{h:6.5,el:15,az:100,exp:0.42,fog:0xd8d0c6,sunI:2.2,hemi:0.28},noon:{h:11.65,el:48,az:165,exp:0.34,fog:0xcfdbe4,sunI:2.1,hemi:0.35},evening:{h:17.25,el:10,az:265,exp:0.5,fog:0xd9b89a,sunI:1.7,hemi:0.25},night:{h:23.5,el:-12,az:250,exp:0.62,fog:0x162034,sunI:0,hemi:0.22}};
// topic 6 stage 1: a real night. 💡 full moon (the festivals fall on the 15th of a lunar month, Lev 23:6, 23:34), opposite the sun (stage 2).
// The sky is a dark-blue gradient that gets a little lighter at the horizon, and the fog has the horizon's colour, so the far ground fades into the sky instead of a hard line.
const NIGHT={top:[0.012,0.022,0.055],hor:[0.075,0.105,0.17],moonC:0xa8bce8,moonI:0.32,hemiS:0x2c3c62,hemiG:0x0c0e13,tex:null,env:null,moon:null};
/* 124.1: בפעם הראשונה שעוברים ללילה נבנו כ־44 תוכניות צביעה (שיידרים) בבת אחת, והמסך נתקע. מחממים אותן מראש במסך הטעינה, כשהמשתמש עוד לא נכנס. */
function warmNight(){try{if(NIGHT.warmed)return;NIGHT.warmed=1;nightSky();const e0=scene.environment,b0=scene.background;scene.environment=NIGHT.env;scene.background=NIGHT.tex;try{renderer.compile(scene,camera)}finally{scene.environment=e0;scene.background=b0}}catch(e){console.warn("warmNight",e)}}
function nightSky(){if(NIGHT.tex)return;const W=8,Hh=256,cv=document.createElement("canvas");cv.width=W;cv.height=Hh;const c=cv.getContext("2d"),im=c.createImageData(W,Hh);
  for(let y=0;y<Hh;y++){const v=y/(Hh-1),e=Math.abs(0.5-v)*2,k=Math.pow(1-e,6),q=v>0.5?0.55:1;for(let x=0;x<W;x++){const o=(y*W+x)*4;for(let j=0;j<3;j++)im.data[o+j]=Math.round(255*Math.pow((NIGHT.top[j]+(NIGHT.hor[j]-NIGHT.top[j])*k)*q,1/2.2));im.data[o+3]=255}}
  c.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;NIGHT.tex=t;NIGHT.env=pmrem.fromEquirectangular(t).texture;
  
  const m=new THREE.Mesh(new THREE.CircleGeometry(150,40),new THREE.MeshBasicMaterial({color:0xf3eedd,fog:false,toneMapped:false}));m.renderOrder=-1;m.visible=false;m.userData.moon=1;scene.add(m);NIGHT.moon=m}
// topic 6 stage 6: light inside the house. INSIDE = 0 outside, 1 in the Heikhal, 2 in the Holy of Holies (set by the loop).
// 📜 inside the Heikhal the light is the menorah, "להעלות נר תמיד" (Ex 27:20), and by day the open door from the Ulam; the windows give light out, not in (Menachot 86b).
// 📜 the Holy of Holies is dark: "ה׳ אמר לשכן בערפל" (I Kings 8:12). 💡 a faint light stays so that it can be seen in the model.
// Before: the gold walls had their own glow (emissive) and the sky light reached inside as if there were no roof, so even the Holy of Holies at night was bright gold.
const INL={1:{hemi:0.5,sun:0.3,glow:0.6,exp:1.5,men:2.6},2:{hemi:0.24,sun:0.12,glow:0.32,exp:1.35,men:1.7}};
function insideLight(){const q=INL[INSIDE];if(!M.panel.userData.g0){M.panel.userData.g0=M.panel.emissiveIntensity;M.goldFloor.userData.g0=M.goldFloor.emissiveIntensity}
  const g=q?q.glow:1;M.panel.emissiveIntensity=M.panel.userData.g0*g;M.goldFloor.emissiveIntensity=M.goldFloor.userData.g0*g;if(!q)return;
  hemi.intensity*=q.hemi;sun.intensity*=q.sun;renderer.toneMappingExposure*=q.exp;scene.environment=null} // no sky reflections on the gold inside: it shines only from the menorah and the door
// topic 6 stage 7: the inner east gate is open only on Shabbat and Rosh Chodesh, by day (Ezek 46:1-2). DAY = "chol" (a weekday) / "shabbat" / "rosh" (Rosh Chodesh).
// ⚖️ the model opens on a weekday (7.11.2026), so the gate is closed ("יהיה סגור ששת ימי המעשה") and the buses and trains run; choosing Shabbat also stops the traffic (one state, core/31 shabSeg).
function gateDoors(){if(!EGATE)return;const sp=sunAt(HOUR!=null?HOUR:TIMES[TIME].h),open=DAY!=="chol"&&sp.el>-0.833;EGATE.forEach(m=>m.visible=!open);EGATE._c=null}
function setDay(d){DAY=d;gateDoors();renderer.shadowMap.needsUpdate=true;
  // מכונות מצב: "שבת" בסוג היום ו"שבת / יום טוב" בתחבורה הם אותו מצב. כל אחד מעדכן את השני
  const sb=document.querySelector('#shabSeg button[data-sh="'+(d==="shabbat"?"1":"0")+'"]');if(sb&&sb.getAttribute("aria-pressed")!=="true")sb.click();
  document.querySelectorAll("#daySeg button[data-day]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.day===d?"true":"false"))}
function applyTime(){applyTime0();if(ART)try{ART.grade()}catch(e){}insideLight();gateDoors()}
function applyTime0(){renderer.shadowMap.needsUpdate=true;
  const t=TIMES[TIME],night=TIME==="night",sp=sunAt(HOUR!=null?HOUR:t.h),tw=!night&&sp.el<4;
  const d2=skyVec(Math.max(sp.el,-2),sp.az);
  // 💡 full moon = opposite the sun; when it is still low (early night) keep it at least 20° up so the moonlight reaches into the courts
  NIGHT.dir=skyVec(Math.max(20,-sp.el),sp.az+180);
  su.sunPosition.value.copy(d2);sky.visible=!night;stars.visible=night;
  if(night)nightSky();scene.background=night?NIGHT.tex:null;if(NIGHT.moon){NIGHT.moon.visible=night;NIGHT.moon.position.copy(NIGHT.dir).multiplyScalar(14000).add(camera.position);NIGHT.moon.lookAt(camera.position)}
  scene.fog=new THREE.FogExp2(t.fog,night?0.00022:0.00009);/* 141.3: כשעל הטבעת יש צילום לוויין (במחשב) לא צובעים אותה בצבע האובך (היא מוארת כמו שאר הקרקע) */if(RING.material.map)RING.material.color.setScalar(1);else RING.material.color.copy(scene.fog.color).multiplyScalar(night?1:0.85);
  renderer.toneMappingExposure=t.exp;
  if(BLDMAT){[BLDMAT,BLDMAT.userData.twin,BLDMAT.userData.sky].forEach(m=>{if(!m)return;m.emissive.setHex(night?0xffb866:0x000000);m.emissiveIntensity=1.3})}M.wall.emissive.setHex(night?0x1c140b:0x000000);if(TRN)TRN.night(night);
  if(night){sun.color.set(NIGHT.moonC);sun.intensity=NIGHT.moonI;sun.position.copy(C).addScaledVector(NIGHT.dir,900)}
  else{sun.color.set(TIME==="evening"?0xffc28a:TIME==="morning"?0xffd3a0:0xfff1dc);sun.intensity=t.sunI;sun.position.copy(C).addScaledVector(d2,900)}
  sun.target.position.copy(C);hemi.intensity=t.hemi;hemi.color.set(night?NIGHT.hemiS:0xdfe8f2);hemi.groundColor.set(night?NIGHT.hemiG:0x7a6a52);
  M.win.emissiveIntensity=night?2.2:0;if(M.win2)M.win2.emissiveIntensity=night?1.05:0;M.lamp.color.set(night?0xffd28a:0x8a7a5a);
  if(fireLight)fireLight.intensity=night?1.6:0.25;
  bloom.strength=night?0.55:0.12;bloom.threshold=night?0.75:0.96;
  if(tw){const k=Math.max(0,Math.min(1,(sp.el+7)/11)),nf=new THREE.Color(TIMES.night.fog);// dawn and dusk: from 7° below the horizon (0) to 4° above it (1)
    sun.color.set(0xff9a5c);sun.intensity=t.sunI*Math.max(0,Math.min(1,(sp.el+1)/5));hemi.intensity=0.22+(t.hemi-0.22)*k;renderer.toneMappingExposure=0.62+(t.exp-0.62)*k;
    scene.fog.color.lerpColors(nf,new THREE.Color(t.fog),k);RING.material.color.copy(scene.fog.color).multiplyScalar(0.85);stars.visible=k<0.35}
  const sk=tw?null:SKY[TIME];if(sk&&!SKYT[TIME]){const key=TIME;SKYT[key]={};try{b64url(sk.f,url=>new THREE.RGBELoader().setDataType(THREE.HalfFloatType).load(url,t=>{t.mapping=THREE.EquirectangularReflectionMapping;SKYT[key]={bg:t,env:pmrem.fromEquirectangular(t).texture};if(TIME===key)applyTime()}))}catch(e){}}
  const L=sk&&SKYT[TIME]&&SKYT[TIME].bg?SKYT[TIME]:null;
  if(L){sky.visible=false;scene.background=L.bg;scene.environment=L.env;scene.fog=new THREE.FogExp2(new THREE.Color(sk.fog[0],sk.fog[1],sk.fog[2]),0.00032); /* 124.8: אובך אוויר רך. קודם 0.00013, כמעט בלי אובך, והעיר הרחוקה הייתה חדה כמו הקרובה ומשכה את העין. עכשיו בק״מ אחד יש כ־10% אובך, ובשני ק״מ כ־34%. 💡 */RING.material.color.copy(scene.fog.color);renderer.toneMappingExposure=sk.exp;sun.intensity=sk.sun;hemi.intensity=sk.hemi;hemi.color.set(TIME==="morning"?0xf0e2d0:0xdfe8f2);return}
  if(!night){if(envRT)envRT.dispose();const s2=new THREE.Scene(),sk=new THREE.Sky();sk.scale.setScalar(1000);sk.material.uniforms.sunPosition.value.copy(d2);["turbidity","rayleigh","mieCoefficient","mieDirectionalG"].forEach(k=>sk.material.uniforms[k].value=su[k].value);s2.add(sk);envRT=pmrem.fromScene(s2);scene.environment=envRT.texture}
  else scene.environment=NIGHT.env;
}

