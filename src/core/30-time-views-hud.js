// ---- time of day ----
function b64url(path,cb){fetch(path).then(r=>r.text()).then(t=>__AFTER(()=>cb(URL.createObjectURL(new Blob([b64bytes(t)]))))).catch(()=>{})}
const SKY={morning:{f:"sky_morning.hdr.txt",exp:0.5,sun:1.55,hemi:0.26,fog:[1.146,0.841,0.699]},noon:{f:"sky_noon.hdr.txt",exp:0.46,sun:1.2,hemi:0.34,fog:[0.613,0.66,0.796]},evening:{f:"sky_evening.hdr.txt",exp:0.46,sun:1.25,hemi:0.28,fog:[1.146,0.841,0.699]}},SKYT={};
// topic 6 stage 2: the sun at its real place over Jerusalem for an hour of the day (NOAA solar position formulas, https://gml.noaa.gov/grad/solcalc/solareqns.PDF).
// 📜 place: the Dome of the Rock, 31.778° N 35.235° E (OpenStreetMap). Local standard time UTC+2 (no summer time: the hours of the Temple are the hours of the sun).
// 💡 DOY = day of the year. 105 = 15 April, an average date for Pesach (15 Nisan falls between late March and late April).
let HOUR=null,DOY=105;const JLM={lat:31.778,lon:35.235,tz:2};
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
const FEST={pesach:{doy:105,n:"פסח"},shavuot:{doy:155,n:"שבועות"},sukkot:{doy:281,n:"סוכות"}};
function setFest(k){const f=FEST[k];if(!f)return;DOY=f.doy;applyTime();return f}
function setHour(h){HOUR=((h%24)+24)%24;const sp=sunAt(HOUR);TIME=sp.el<=-7?"night":HOUR<10.5?"morning":HOUR>14.5?"evening":"noon";applyTime();return sp}
// the four buttons are fixed hours: morning 6:30 (sun ~16° up in the east), noon 11:39 = midday (חצות היום, the sun due south), evening 17:15 (~10° up in the west), night 23:30
const TIMES={morning:{h:6.5,el:15,az:100,exp:0.42,fog:0xd8d0c6,sunI:2.2,hemi:0.28},noon:{h:11.65,el:48,az:165,exp:0.34,fog:0xcfdbe4,sunI:2.1,hemi:0.35},evening:{h:17.25,el:10,az:265,exp:0.5,fog:0xd9b89a,sunI:1.7,hemi:0.25},night:{h:23.5,el:-12,az:250,exp:0.62,fog:0x162034,sunI:0,hemi:0.22}};
// topic 6 stage 1: a real night. 💡 full moon (the festivals fall on the 15th of a lunar month, Lev 23:6, 23:34), opposite the sun (stage 2).
// The sky is a dark-blue gradient that gets a little lighter at the horizon, and the fog has the horizon's colour, so the far ground fades into the sky instead of a hard line.
const NIGHT={top:[0.012,0.022,0.055],hor:[0.075,0.105,0.17],moonC:0xa8bce8,moonI:0.32,hemiS:0x2c3c62,hemiG:0x0c0e13,tex:null,env:null,moon:null};
function nightSky(){if(NIGHT.tex)return;const W=8,Hh=256,cv=document.createElement("canvas");cv.width=W;cv.height=Hh;const c=cv.getContext("2d"),im=c.createImageData(W,Hh);
  for(let y=0;y<Hh;y++){const v=y/(Hh-1),e=Math.abs(0.5-v)*2,k=Math.pow(1-e,6),q=v>0.5?0.55:1;for(let x=0;x<W;x++){const o=(y*W+x)*4;for(let j=0;j<3;j++)im.data[o+j]=Math.round(255*Math.pow((NIGHT.top[j]+(NIGHT.hor[j]-NIGHT.top[j])*k)*q,1/2.2));im.data[o+3]=255}}
  c.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;NIGHT.tex=t;NIGHT.env=pmrem.fromEquirectangular(t).texture;
  
  const m=new THREE.Mesh(new THREE.CircleGeometry(150,40),new THREE.MeshBasicMaterial({color:0xf3eedd,fog:false,toneMapped:false}));m.renderOrder=-1;m.visible=false;m.userData.moon=1;scene.add(m);NIGHT.moon=m}
// topic 6 stage 6: light inside the house. INSIDE = 0 outside, 1 in the Heikhal, 2 in the Holy of Holies (set by the loop).
// 📜 inside the Heikhal the light is the menorah, "להעלות נר תמיד" (Ex 27:20), and by day the open door from the Ulam; the windows give light out, not in (Menachot 86b).
// 📜 the Holy of Holies is dark: "ה׳ אמר לשכן בערפל" (I Kings 8:12). 💡 a faint light stays so that it can be seen in the model.
// Before: the gold walls had their own glow (emissive) and the sky light reached inside as if there were no roof, so even the Holy of Holies at night was bright gold.
const INL={1:{hemi:0.5,sun:0.3,glow:0.6,exp:1.5,men:2.6},2:{hemi:0.15,sun:0.08,glow:0.15,exp:1.2,men:1.5}};
function insideLight(){const q=INL[INSIDE];if(!M.panel.userData.g0){M.panel.userData.g0=M.panel.emissiveIntensity;M.goldFloor.userData.g0=M.goldFloor.emissiveIntensity}
  const g=q?q.glow:1;M.panel.emissiveIntensity=M.panel.userData.g0*g;M.goldFloor.emissiveIntensity=M.goldFloor.userData.g0*g;if(!q)return;
  hemi.intensity*=q.hemi;sun.intensity*=q.sun;renderer.toneMappingExposure*=q.exp;scene.environment=null} // no sky reflections on the gold inside: it shines only from the menorah and the door
// topic 6 stage 7: the inner east gate is open only on Shabbat and Rosh Chodesh, by day (Ezek 46:1-2). DAY = "chol" (a weekday) / "shabbat" / "rosh" (Rosh Chodesh).
// 💡 the model opens on Shabbat so that the gate looks as it did before; on a weekday, or after sunset, the doors are closed.
function gateDoors(){if(!EGATE)return;const sp=sunAt(HOUR!=null?HOUR:TIMES[TIME].h),open=DAY!=="chol"&&sp.el>-0.833;EGATE.forEach(m=>m.visible=!open)}
function setDay(d){DAY=d;gateDoors();renderer.shadowMap.needsUpdate=true}
function applyTime(){applyTime0();insideLight();gateDoors()}
function applyTime0(){renderer.shadowMap.needsUpdate=true;
  const t=TIMES[TIME],night=TIME==="night",sp=sunAt(HOUR!=null?HOUR:t.h),tw=!night&&sp.el<4;
  const d2=skyVec(Math.max(sp.el,-2),sp.az);
  // 💡 full moon = opposite the sun; when it is still low (early night) keep it at least 20° up so the moonlight reaches into the courts
  NIGHT.dir=skyVec(Math.max(20,-sp.el),sp.az+180);
  su.sunPosition.value.copy(d2);sky.visible=!night;stars.visible=night;
  if(night)nightSky();scene.background=night?NIGHT.tex:null;if(NIGHT.moon){NIGHT.moon.visible=night;NIGHT.moon.position.copy(NIGHT.dir).multiplyScalar(14000).add(camera.position);NIGHT.moon.lookAt(camera.position)}
  scene.fog=new THREE.FogExp2(t.fog,night?0.00022:0.00009);RING.material.color.copy(scene.fog.color).multiplyScalar(night?1:0.85);
  renderer.toneMappingExposure=t.exp;
  if(BLDMAT){[BLDMAT,BLDMAT.userData.twin].forEach(m=>{if(!m)return;m.emissive.setHex(night?0xffb866:0x000000);m.emissiveIntensity=1.3})}M.wall.emissive.setHex(night?0x1c140b:0x000000);if(TRN)TRN.night(night);
  if(night){sun.color.set(NIGHT.moonC);sun.intensity=NIGHT.moonI;sun.position.copy(C).addScaledVector(NIGHT.dir,900)}
  else{sun.color.set(TIME==="evening"?0xffc28a:TIME==="morning"?0xffd3a0:0xfff1dc);sun.intensity=t.sunI;sun.position.copy(C).addScaledVector(d2,900)}
  sun.target.position.copy(C);hemi.intensity=t.hemi;hemi.color.set(night?NIGHT.hemiS:0xdfe8f2);hemi.groundColor.set(night?NIGHT.hemiG:0x7a6a52);
  M.win.emissiveIntensity=night?2.2:0;if(M.win2)M.win2.emissiveIntensity=night?2.6:0;M.lamp.color.set(night?0xffd28a:0x8a7a5a);
  if(fireLight)fireLight.intensity=night?1.6:0.25;
  bloom.strength=night?0.55:0.12;bloom.threshold=night?0.75:0.96;
  if(tw){const k=Math.max(0,Math.min(1,(sp.el+7)/11)),nf=new THREE.Color(TIMES.night.fog);// dawn and dusk: from 7° below the horizon (0) to 4° above it (1)
    sun.color.set(0xff9a5c);sun.intensity=t.sunI*Math.max(0,Math.min(1,(sp.el+1)/5));hemi.intensity=0.22+(t.hemi-0.22)*k;renderer.toneMappingExposure=0.62+(t.exp-0.62)*k;
    scene.fog.color.lerpColors(nf,new THREE.Color(t.fog),k);RING.material.color.copy(scene.fog.color).multiplyScalar(0.85);stars.visible=k<0.35}
  const sk=tw?null:SKY[TIME];if(sk&&!SKYT[TIME]){const key=TIME;SKYT[key]={};try{b64url(sk.f,url=>new THREE.RGBELoader().setDataType(THREE.HalfFloatType).load(url,t=>{t.mapping=THREE.EquirectangularReflectionMapping;SKYT[key]={bg:t,env:pmrem.fromEquirectangular(t).texture};if(TIME===key)applyTime()}))}catch(e){}}
  const L=sk&&SKYT[TIME]&&SKYT[TIME].bg?SKYT[TIME]:null;
  if(L){sky.visible=false;scene.background=L.bg;scene.environment=L.env;scene.fog=new THREE.FogExp2(new THREE.Color(sk.fog[0],sk.fog[1],sk.fog[2]),0.00013);RING.material.color.copy(scene.fog.color);renderer.toneMappingExposure=sk.exp;sun.intensity=sk.sun;hemi.intensity=sk.hemi;hemi.color.set(TIME==="morning"?0xf0e2d0:0xdfe8f2);return}
  if(!night){if(envRT)envRT.dispose();const s2=new THREE.Scene(),sk=new THREE.Sky();sk.scale.setScalar(1000);sk.material.uniforms.sunPosition.value.copy(d2);["turbidity","rayleigh","mieCoefficient","mieDirectionalG"].forEach(k=>sk.material.uniforms[k].value=su[k].value);s2.add(sk);envRT=pmrem.fromScene(s2);scene.environment=envRT.texture}
  else scene.environment=NIGHT.env;
}

// ---- views & tour ----
function groundAt(x,z){const n=-z;
  if(COMP&&COMP.rb){const u=(x-COMP.X0)/A,v=(COMP.N0-n)/A,Y=8.5,t6=1/6;
    if(u>=203&&u<=215&&v>=236&&v<=264)return(13.5-0.5*(u-203)+Y)*A;
    if(u>=98&&u<=203&&v>=COMP.vmin&&v<=COMP.vmax)return(13.56+Y)*A;
    if(u>=226&&u<=250&&v>=247&&v<=271)return(7.5+53*t6+Y)*A;
    if(u>=230&&u<=246&&v>=273.1&&v<=305.1)return(7.5+53*t6*(305.1-v)/32+Y)*A;
    if(v>=182.5&&v<=317.5){if(u>=89&&u<=265)return 16*A;if(u>265&&u<=281)return 13.5*A;if(u>281&&u<=296&&v>=235&&v<=265)return Math.max(6,13.5-0.5*(u-281))*A;if(u>281&&u<=421)return 6*A}
    if(u>=421&&u<=433&&v>=242&&v<=258)return Math.max(0,6-0.5*(u-421))*A;
    for(const gu of[110,150,190]){if(Math.abs(u-gu)<=5){if(v>=177.5&&v<182.5)return 16*A;if(v>=145.5&&v<177.5)return 16*(v-145.5)/32*A;if(v>317.5&&v<=322.5)return 16*A;if(v>322.5&&v<=354.5)return 16*(354.5-v)/32*A}}
    if(u>=29&&u<=529&&v>=82.5&&v<=582.5)return 0.35*A}
  else if(COMP){const u=(x-COMP.X0)/A,v=(COMP.N0-n)/A;
    for(const g of GLIST){const a=g.axis==="e"?u-g.cu:v-g.cv,w=g.axis==="e"?v-g.cv:u-g.cu;if(Math.abs(w)>g.pass/2+1)continue;const d=a*g.outward-g.L/2;
      if(d>=0&&d<=g.n)return(g.y0+(g.n-d)*0.5)*A;if(d<0&&d>=-g.L&&g.floor>4&&Math.abs(w)<=g.pass/2)return g.floor*A}
    if(u>=0&&u<=500&&v>=0&&v<=500){
      if(u>=203&&u<=203+COMP.nst&&v>=236&&v<=264)return(13.5-6*(u-203)/COMP.nst)*A;
      if(u>=242&&u<=258&&v>=264.1&&v<=296.1)return(7.5+9*(296.1-v)/32)*A;
      if(u>=238&&u<=262&&v>=238&&v<=264)return 16.5*A;
      if(u>=98&&u<=203&&v>=COMP.vmin&&v<=COMP.vmax)return 13.56*A;if(u<=300&&v>=200&&v<=300)return 7.5*A;return 3.5*A}}
  if(inPoly(x,n,MOUNT_S))return 0;{const g=S2G(x,n);return surfY(g[0],g[1])}}
function blocked(x,z,feet){const r=0.6;for(const c of COL){if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&c.y1>feet+0.55&&c.y0<feet+1.7)return true}return false}
const JOY={x:0,y:0};
let DRONE=false,WALK=false,yaw=0,pitch=0;const keys={};
function startWalk(){camSaved=false;if(DRONE)stopDrone();if(TOUR)stopTour();tween=null;WALK=true;controls.enabled=false;const p=COMP?(COMP.rb?[COMP.X0+250*A,-(COMP.N0-130*A)]:[COMP.X0+250*A,-(COMP.N0+30*A)]):[100,-300];
  camera.position.set(p[0],groundAt(p[0],p[1])+1.65,p[1]);yaw=Math.PI;pitch=0.02;camera.rotation.order="YXZ";camera.rotation.set(pitch,yaw,0);
  document.getElementById("pad").hidden=false;const wh=document.getElementById("walkhint");wh.textContent="גוררים כדי להסתכל מסביב · העיגול (או W A S D / החצים) כדי ללכת · Shift או דחיפה עד הסוף — ריצה";wh.hidden=false}
const D={h:20,vx:0,vz:0,fast:false,tw:null,pinch:0};
function startDrone(){camSaved=false;if(TOUR)stopTour();if(WALK)stopWalk();tween=null;DRONE=true;controls.enabled=false;const fw=new THREE.Vector3();camera.getWorldDirection(fw);yaw=Math.atan2(-fw.x,-fw.z);pitch=-0.5;D.vx=D.vz=0;D.h=20;
  const cp=camera.position,lim=380;cp.x=Math.max(C.x-lim,Math.min(C.x+lim,cp.x));cp.z=Math.max(C.z-lim,Math.min(C.z+lim,cp.z));if(camera.position.distanceTo(C)>300||!COMP){if(COMP){const W2=(u,v)=>[COMP.X0+u*A,-(COMP.N0-v*A)],q=W2(300,470),h=W2(200,250);cp.set(q[0],0,q[1]);yaw=Math.atan2(-(h[0]-q[0]),-(h[1]-q[1]))}else{cp.set(C.x+170,0,C.z+210);yaw=Math.atan2(170,210)}}cp.y=floorAt(cp.x,cp.z)+D.h;
  document.getElementById("pad").hidden=false;document.getElementById("fastB").hidden=false;const wh=document.getElementById("walkhint");wh.textContent="רחפן: W/S או העיגול — קדימה ואחורה · A/D — פנייה · גרירה — מבט · גלגלת או צביטה — גובה · לחיצה על מבנה — טיסה אליו";wh.hidden=false}
function stopDrone(){if(TRN&&TRN.riding)TRN.stopRide();if(!DRONE)return;DRONE=false;D.tw=null;controls.enabled=true;const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));controls.target.copy(camera.position).addScaledVector(f,40);controls.target.y=camera.position.y-25;controls.update();document.getElementById("pad").hidden=true;document.getElementById("fastB").hidden=true;document.getElementById("walkhint").hidden=true}
function droneFly(pt){const cp=camera.position,dx=pt.x-cp.x,dz=pt.z-cp.z,L=Math.hypot(dx,dz)||1,back=Math.max(30,D.h*1.6);const p1=new THREE.Vector3(pt.x-dx/L*back,0,pt.z-dz/L*back);p1.y=Math.max(floorAt(p1.x,p1.z)+D.h,pt.y+6);let y1=Math.atan2(-dx,-dz);while(y1-yaw>Math.PI)y1-=2*Math.PI;while(y1-yaw<-Math.PI)y1+=2*Math.PI;D.vx=D.vz=0;D.tw={p0:cp.clone(),p1,y0:yaw,y1,s:performance.now()}}
function droneTick(dt){const cp=camera.position;
  if(D.tw){const k=Math.min(1,(performance.now()-D.tw.s)/2000),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;cp.lerpVectors(D.tw.p0,D.tw.p1,e);cp.y+=Math.sin(Math.PI*e)*8;yaw=D.tw.y0+(D.tw.y1-D.tw.y0)*e;pitch+=((-0.45)-pitch)*Math.min(1,dt*3);if(k>=1){D.tw=null;D.h=Math.max(8,Math.min(60,cp.y-floorAt(cp.x,cp.z)))}}
  else{const fw=Math.max(-1,Math.min(1,(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-JOY.y)),tr=Math.max(-1,Math.min(1,(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+JOY.x));
    yaw-=tr*1.3*dt;const sp=(3+D.h*0.55)*((keys.shift||D.fast)?2:1),tvx=-Math.sin(yaw)*fw*sp,tvz=-Math.cos(yaw)*fw*sp,a=1-Math.exp(-dt/0.13);D.vx+=(tvx-D.vx)*a;D.vz+=(tvz-D.vz)*a;
    const lim=420,hit=(x,z)=>{for(const c of COL){if(x>c.x0-1.2&&x<c.x1+1.2&&z>c.z0-1.2&&z<c.z1+1.2&&c.y1>cp.y-1.5&&c.y0<cp.y+1)return true}return false};
    let nx=Math.max(C.x-lim,Math.min(C.x+lim,cp.x+D.vx*dt)),nz=Math.max(C.z-lim,Math.min(C.z+lim,cp.z+D.vz*dt));
    if(!hit(nx,nz)){cp.x=nx;cp.z=nz}else if(!hit(nx,cp.z)){cp.x=nx;D.vz*=0.3}else if(!hit(cp.x,nz)){cp.z=nz;D.vx*=0.3}else{D.vx=D.vz=0}
    const gy=floorAt(cp.x,cp.z)+D.h;cp.y+=(gy-cp.y)*Math.min(1,dt*3)}
  pitch=Math.max(-1.047,Math.min(-0.175,pitch));camera.rotation.order="YXZ";camera.rotation.set(pitch,yaw,0)}
renderer.domElement.addEventListener("touchstart",e=>{if(DRONE&&e.touches.length===2)D.pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
renderer.domElement.addEventListener("touchmove",e=>{if(DRONE&&e.touches.length===2&&D.pinch){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);D.h=Math.max(8,Math.min(60,D.h*D.pinch/d));D.pinch=d}},{passive:true});
document.getElementById("fastB").addEventListener("click",e=>{D.fast=!D.fast;e.currentTarget.setAttribute("aria-pressed",D.fast?"true":"false")});
function stopWalk(){if(!WALK)return;WALK=false;controls.enabled=true;const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));controls.target.copy(camera.position).addScaledVector(f,25);controls.update();document.getElementById("pad").hidden=true;document.getElementById("walkhint").hidden=true}
window.addEventListener("keydown",e=>{if(!WALK&&!DRONE)return;const k=e.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","shift"].includes(k)){keys[k]=true;e.preventDefault()}});
window.addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false});
(function(){const pad=document.getElementById("pad"),knob=document.getElementById("knob");let id=null;
  const set=e=>{const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2-14;let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l}JOY.x=dx/R;JOY.y=dy/R;knob.style.transform="translate("+dx+"px,"+dy+"px)"};
  pad.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;try{pad.setPointerCapture(id)}catch(_){}set(e)});
  pad.addEventListener("pointermove",e=>{if(e.pointerId===id)set(e)});
  const end=e=>{if(e.pointerId!==id)return;id=null;JOY.x=JOY.y=0;knob.style.transform=""};pad.addEventListener("pointerup",end);pad.addEventListener("pointercancel",end)})();
let look=null;renderer.domElement.addEventListener("pointerdown",e=>{if(WALK||DRONE){look=[e.clientX,e.clientY,yaw,pitch,e.pointerId]}});
renderer.domElement.addEventListener("pointermove",e=>{if((WALK||DRONE)&&look&&e.pointerId===look[4]&&!(DRONE&&D.pinch&&e.pointerType==="touch"&&e.isPrimary===false)){yaw=look[2]+(e.clientX-look[0])*0.005;pitch=Math.max(-1.1,Math.min(1.1,look[3]+(e.clientY-look[1])*0.004))}});
window.addEventListener("pointerup",e=>{if(look&&e.pointerId===look[4])look=null});
// #18 B1: OrbitControls holds the camera at most 80° from straight up when far (over 160 m) and just under level when near (core/31).
// A pose past that limit was pulled up by the controls the moment a flight ended (olives 34 m, city 56 m). Here the pose itself is moved to the limit, keeping its distance.
function fixPhi(p,t){const o=p.clone().sub(t),L=o.length();if(L<1e-6)return[p,t];const lim=L>160?THREE.MathUtils.degToRad(79.5):Math.PI*0.495,phi=Math.acos(Math.max(-1,Math.min(1,o.y/L)));
  if(phi>lim){const hz=Math.hypot(o.x,o.z)||1,k=L*Math.sin(lim)/hz;p.set(t.x+o.x*k,t.y+L*Math.cos(lim),t.z+o.z*k)}return[p,t]}
function camAt(p,t){fixPhi(p,t);camSaved=false;camLim=1e9;camera.position.copy(p);controls.target.copy(t);controls.update()}
const PG=(x,n,dy)=>{const q=G2S(x,n);return new THREE.Vector3(q[0],H(x,n)+dy,-q[1])};
function viewPose(v){const r=viewPose0(v);return r?fixPhi(r[0],r[1]):r}
function viewPose0(v){
  const t=C.clone(),s=500*A;
  if(v==="top")return[new THREE.Vector3(t.x+1,t.y+720,t.z+40),t];
  if(v==="olives")return[PG(640,-20,64),new THREE.Vector3(t.x+20,22,t.z)];
  if(v==="inside"){const ih=interiorPose();return ih}
  if(v==="kodesh"&&KDS)return[KDS.p.clone(),KDS.t.clone()];
  if(v==="city")return[PG(-330,-215,26),new THREE.Vector3(t.x,30,t.z)];
  if(v==="kotel"){const tg=PG(-90,-178,0);tg.y=PLZ+11;const p=PG(-180,-205,0);p.y=PLZ+5;return[p,tg]}
  if(COMP&&COMP.rb&&(v==="court"||v==="altar"||v==="gateN")){const Wq=(u,w,y)=>new THREE.Vector3(COMP.X0+u*A,y*A,-(COMP.N0-w*A));
    if(v==="court")return[Wq(270,236,17.7),Wq(160,250,40)];if(v==="altar")return[Wq(262,292,22),Wq(238,259,16)];return[Wq(150,130,12),Wq(150,182,20)]}
  if(v==="court")return[new THREE.Vector3(t.x+0.4*s,3.5*A+1.7,t.z+0.06*s),new THREE.Vector3(t.x-0.17*s,24,t.z)];
  if(v==="far"){const a=PG(-1500,-150,0),b=PG(-250,-120,0);a.y=260;b.y=40;return[a,b]}
  if(v==="gateN")return[new THREE.Vector3(t.x+40,22,t.z-0.5*s-70),new THREE.Vector3(t.x,18,t.z-0.5*s+20)];
  if(v==="altar")return[new THREE.Vector3(t.x+40,22,t.z+38),new THREE.Vector3(t.x,8,t.z)];
  return[new THREE.Vector3(t.x+250,145,t.z+320),new THREE.Vector3(t.x-25,12,t.z)];
}
let tween=null;
function inHouseP(q){return INTBOX&&q.x>INTBOX.x0-1&&q.x<INTBOX.x1+1&&q.z>INTBOX.z0-1&&q.z<INTBOX.z1+1&&q.y<INTBOX.y1}
function routeTo(p,t,dur){if(!COMP){camAt(p,t);return}const Wq=(u,w,y)=>new THREE.Vector3(COMP.X0+u*A,y,-(COMP.N0-w*A)),fy=13.56*A+(COMP.rb?8.5*A:0)+1.7;
  const pts=[camera.position.clone()],tgs=[controls.target.clone()];const a=inHouseP(camera.position),b=inHouseP(p);
  if(a){pts.push(Wq(178,250,fy),Wq(214,250,fy+1));tgs.push(Wq(230,250,fy),Wq(260,250,fy))}
  if(b){if(!a){pts.push(Wq(268,250,fy+30));tgs.push(Wq(200,250,fy+8))}pts.push(Wq(222,250,fy+2),Wq(184,250,fy));tgs.push(Wq(170,250,fy),Wq(137,250,fy+1))}
  pts.push(p);tgs.push(t);tween={path:pts,tpath:tgs,start:performance.now(),dur:Math.max(1600,(dur||1200)*1.6),p0:pts[0],t0:tgs[0],p1:p,t1:t}}
function needFade(p0,p1){const inH=q=>INTBOX&&q.x>INTBOX.x0-2&&q.x<INTBOX.x1+2&&q.z>INTBOX.z0-2&&q.z<INTBOX.z1+2&&q.y<INTBOX.y1;return inH(p0)||inH(p1)}
function flyTo(v,dur){const [p,t]=viewPose(v);if(reduce||!dur){camAt(p,t);return}if(needFade(camera.position,p)){routeTo(p,t,dur);return}tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,start:performance.now(),dur:dur}}
let TOUR=null,OCCF=0,HUDF=0;
function segHit(a,b){const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;let best=1;for(const c of COL){if(c.y1-c.y0<2.6||(c.x1-c.x0<1.6&&c.z1-c.z0<1.6))continue;if(a.x>c.x0-0.3&&a.x<c.x1+0.3&&a.z>c.z0-0.3&&a.z<c.z1+0.3&&a.y>c.y0-0.3&&a.y<c.y1+0.3)continue;let t0=0,t1=1;const sl=(o,d,lo,hi)=>{if(Math.abs(d)<1e-9)return o>=lo&&o<=hi;let u=(lo-o)/d,v=(hi-o)/d;if(u>v){const q=u;u=v;v=q}t0=Math.max(t0,u);t1=Math.min(t1,v);return t0<=t1};
  if(sl(a.x,dx,c.x0-0.25,c.x1+0.25)&&sl(a.y,dy,c.y0-0.25,c.y1+0.25)&&sl(a.z,dz,c.z0-0.25,c.z1+0.25)&&t0<best)best=t0}return best}
function floorAt(x,z){let g=groundAt(x,z);const q=S2G(x,-z),b=bldTop(q[0],q[1]);return Math.max(g,b)}
let camLim=1e9,camSaved=false;const camDesired=new THREE.Vector3();
function fadeJump(fn){const f=document.getElementById("fade");f.classList.add("on");setTimeout(()=>{fn();const t0=performance.now();let n=0;const wait=()=>{if(++n<12&&performance.now()-t0<700)requestAnimationFrame(wait);else f.classList.remove("on")};requestAnimationFrame(wait)},reduce?0:320)}
// #12: the old tour (TOUR_STEPS) never ran (the tour button starts STORIES.pilgrim); removed
function stPose(s){const yr=COMP.rb?8.5:0,Wq=(u,w,y)=>new THREE.Vector3(COMP.X0+u*A,(y+yr)*A,-(COMP.N0-w*A));return fixPhi(Wq(...s.p),Wq(...s.t))} // #18 B3: in the Rambam plan the courts stand 8.5 amot higher (as in groundAt and routeTo)
function stopTour(){TOUR=null;tween=null;document.getElementById("tourBtn").textContent="▶ סיור מודרך";document.getElementById("cap").hidden=true}
document.getElementById("ykBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("yk")});
document.getElementById("tmBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("tamid")});
document.getElementById("tourBtn").addEventListener("click",()=>{if(STORY){STORY.stop();return}STORY_API.start("pilgrim")});
renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();if(TOUR)stopTour();if(STORY&&STORY.pause)STORY.pause();if(DRONE){D.h=Math.max(8,Math.min(60,D.h+e.deltaY*0.02))}},{passive:false});
stage.addEventListener("pointerdown",e=>{if(false){controls.mouseButtons.LEFT=THREE.MOUSE.PAN;const up=()=>{controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;window.removeEventListener("pointerup",up)};window.addEventListener("pointerup",up)}},true);

// ---- help for the method buttons ----
const HELP={fac:{n:"חזית — איך נראה הבית מבחוץ",r:"יחזקאל מ״א; מסכת מידות ד, ז",t:"<b>יחזקאל:</b> הבית עם הצלעות רוחבו 50 אמה, והאולם באותו רוחב. <b>מידות:</b> הבית 70 אמה והאולם 100 — \"צר מאחוריו ורחב מלפניו, ודומה לארי\". הגובה של 100 אמה לקוח ממסכת מידות, כי יחזקאל לא נותן גובה לבית — לכן בחזית של יחזקאל הבית נראה צר וגבוה."},
 loc:{n:"על הסלע — מה עומד על אבן השתייה",r:"משנה יומא ה, ב; רמב״ם, הלכות בית הבחירה ד, א",t:"הסלע שבתוך כיפת הסלע של היום. <b>קודש הקודשים</b> (ברירת המחדל): לפי המסורת הרווחת, אבן השתייה היא המקום שעליו עמד הארון — \"אבן היתה שם... ושתייה היתה נקראת\". <b>המזבח:</b> לפי דעת חוקרים אחדים (כמו דלמן) הסלע הוא מקום המזבח. ההבדל הוא כ־60 מטר מזרחה או מערבה. הלחיצה מעבירה למבט מלמעלה כדי לראות את ההבדל, והחלון \"התאמה להר\" שמתחת לתלת־ממד מראה כמה המתחם חורג מהחומה."},
 amah:{n:"אמה — כמה סנטימטר",r:"שיעורי תורה",t:"<b>48</b> ס״מ לפי הגר״ח נאה, <b>57.6</b> לפי החזון איש, ו־<b>52.5</b> באמצע. כל המתחם — 500 × 500 אמה — גדל או קטן לפי הבחירה (240 עד 288 מטר)."},
 gate:{n:"שיטה — המלבי״ם או רש״י והרמח״ל",r:"יחזקאל מ׳, יד; מ׳, מח-מט; רש״י, מלבי״ם, משכני עליון לרמח״ל",t:"\"ויעש את אילים ששים אמה\". <b>המלבי״ם:</b> 60 אמה היא מידה לאורך הקיר, והשער בגובה רגיל (כאן כ־20 אמה, בהערכה). <b>רש״י והרמח״ל:</b> האילים הם עמודים עגולים \"כמין אילנות\", גבוהים 60 אמה, וגם שני העמודים לפני האולם גבוהים 60 אמה, ובראשם צורת דקל."},
 river:{n:"הנהר — המים שיוצאים מהמקדש",r:"יחזקאל מ״ז, א-יב",t:"\"והנה מים יוצאים מתחת מפתן הבית קדימה... מימין הבית מנגב למזבח\". המים יוצאים מתחת לבית, עוברים מדרום למזבח בתעלה, יוצאים מתחת לשער המזרח, יורדים אל נחל קדרון וזורמים לים המלח — \"ונרפאו המים\". הנהר מתרחב בדרך: עד הקרסוליים, עד הברכיים, עד המותניים, ובסוף נחל שאי אפשר לעבור. על שפתו עצי מאכל. זה חזון לעתיד, ולכן הוא מוסתר כברירת מחדל."},
 wall:{n:"חומת הר הבית של היום",r:"OpenStreetMap; סעיף 15.3",t:"הקו האדום מראה איפה עוברת היום החומה של הר הבית, רק במקומות שהמתחם של יחזקאל (500 × 500 אמה) עובר אותה. כך רואים בדיוק כמה המתחם יוצא מעבר להר הקיים. זה נובע מהמידות שבפסוקים, לא מטעות בהדמיה. כשהכפתור דלוק רואים גם את המילוי והקיר התומך שיצטרכו לבנות שם, ובחלון \"התאמה להר\" למטה — טבלה של החריגה בכל גודל אמה ובשתי האפשרויות על הסלע."},
 lines:{n:"שכבות — מה אפשר להדליק ולכבות",r:"",t:"<b>אנשים</b>, <b>תחבורה</b>, <b>שמות</b> — דלוקים בהתחלה. <b>חומת ההר היום</b> — קו אדום של החומה הנוכחית במקומות שהמתחם חורג ממנה, עם המילוי והקיר התומך; כבוי בהתחלה. <b>חג</b> — מנורות, ריקודים, הקהל והבאת ביכורים. <b>מפה קטנה</b> — מפה בפינה. <b>איכות גבוהה</b> — צללים רכים (כבד יותר). הנהר שיוצא מתחת לבית (יחזקאל מ״ז) מוצג תמיד, ואין לו כפתור."},
 transit:{n:"תחבורה ציבורית — כאילו הכול כבר פועל",r:"תוכנית האב לתחבורה בירושלים 2050 ותחנות הרכבת הקלה (data.gov.il); קווי האוטובוס והתחנות — משרד התחבורה (GTFS); הרכבל — משוער לפי מפות שפורסמו",t:"זה דגם של העתיד, לכן כל התוכניות מוצגות כאילו כבר נבנו, בשעת עומס: קווי הרכבת הקלה (כל קו בצבע שלו), כניסות למטרו (שנוסע מתחת לאדמה), רכבל להר ציון ולשער האשפות, ואוטובוסים בקווים הראשיים. בתחנות שליד העיר העתיקה עולי רגל יורדים מהרכבת והולכים בסמטאות אל הר הבית. <b>לוחצים על רכבת כדי לרכוב עליה.</b>"},
 plan:{n:"שתי תוכניות",r:"רמב״ם, הלכות בית הבחירה א, ד; יחזקאל מ״ג, יא; מידות ב, ה",t:"<b>יחזקאל (מלבי״ם):</b> המתחם לפי המידות של יחזקאל מ׳-מ״ח. <b>הרמב״ם — לפי מסכת מידות:</b> הרמב״ם כותב שבנין העתיד שביחזקאל \"אינו מפורש ומבואר\" (הלכות בית הבחירה א, ד), ובפרקים א-ז הוא מתאר את המקדש לפי מסכת מידות. לכן כאן הכל לפי מידות והרמב״ם: הר הבית 500 × 500 אמה וחמשת שעריו, הסורג והחיל, עזרת נשים 135 × 135 וארבע הלשכות שבפינותיה, 15 המעלות ושער ניקנור, שבעת שערי העזרה, הלשכות, בית המוקד, המזבח 32 × 32 והבית 100 × 100. העזרה לא באמצע הר הבית: \"רוב המדה מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, ומיעוטו מן המערב\" (מידות ב, א)."},
 floor:{n:"רצפה — מה רואים על הקרקע",r:"OpenStreetMap; צילום ההר היום — Esri, Maxar",t:"<b>קרקע:</b> הקרקע מצוירת לפי נתוני המפה — אדמה וסלע, גינות, חורשות ובתי קברות, וריצוף בין הבתים ובעיר העתיקה — בלי צילום לוויין. <b>ההר היום:</b> מסתיר את המקדש ומראה את ההר כמו שהוא היום — הצילום, כיפת הסלע ואל־אקצא — להשוואה בלבד. <b>מודל פשוט:</b> בלי צילום."}};
document.querySelectorAll("button.help").forEach(b=>b.addEventListener("click",()=>showInfo(HELP[b.dataset.help])));
document.getElementById("perfbtn").addEventListener("click",()=>{PERF.on=!PERF.on;document.getElementById("perfbox").hidden=!PERF.on;document.getElementById("perfbox").textContent="מודד…"});
renderer.domElement.addEventListener("webglcontextlost",e=>{e.preventDefault();const l=document.createElement("div");l.className="loading";l.id="ctxlost";l.textContent="הדפדפן עצר את התלת־ממד (זיכרון). טוען מחדש…";stage.appendChild(l)});renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload());
// ---- break up the repeating paving with a large-scale world tint ----
function antiTile(m){if(!m||m.userData.at)return;m.userData.at=true;m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;").replace("#include <worldpos_vertex>","#include <worldpos_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;");
  sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;\nfloat hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hh(i),hh(i+vec2(1,0)),f.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),f.x),f.y);}").replace("#include <map_fragment>","#include <map_fragment>\nfloat nz=vn(vWP.xz*0.045)*0.6+vn(vWP.xz*0.13)*0.4;diffuseColor.rgb*=0.86+0.24*nz;")};m.needsUpdate=true}
antiTile(M.pave);if(PLATTOP)antiTile(PLATTOP);
// ---- HUD: compass, home, mini-map, exit ----
// a drawn street map (not the satellite photo), prepared once; it shows about 1.6 km around the camera
const MAPR=2000,MAPS=2048,MAPK=MAPS/(2*MAPR),MAPC=(function(){const c=document.createElement("canvas");c.width=c.height=MAPS;const x=c.getContext("2d"),P=q=>[(q[0]+MAPR)*MAPK,(MAPR-q[1])*MAPK];
  const path=(pts,close)=>{x.beginPath();pts.forEach((q,i)=>{const p=P(q);i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])});if(close)x.closePath()};
  x.fillStyle="#efe9dc";x.fillRect(0,0,MAPS,MAPS);
  if(GEO.OLD){path(GEO.OLD,true);x.fillStyle="#e2d7c0";x.fill()}
  x.lineCap="round";x.lineJoin="round";ROADS.forEach(rd=>{path(rd.p,false);x.strokeStyle=rd.c===4?"#d8cfbf":"#ffffff";x.lineWidth=Math.max(2,(rd.w+(rd.c>=1&&rd.c<4?3:1))*MAPK);x.stroke()});
  ROADS.forEach(rd=>{if(rd.c>=1&&rd.c<4){path(rd.p,false);x.strokeStyle="#f3c96a";x.lineWidth=Math.max(1.5,rd.w*MAPK*0.7);x.stroke()}});
  if(GEO.KIDRON){path(GEO.KIDRON,false);x.strokeStyle="#6fa6d6";x.lineWidth=5;x.stroke()}
  if(GEO.WALL){path(GEO.WALL,false);x.strokeStyle="#8c7a5c";x.lineWidth=6;x.stroke()}
  path(GEO.MOUNT,true);x.fillStyle="#d9c9a3";x.fill();x.strokeStyle="#7d6b4c";x.lineWidth=4;x.stroke();
  x.fillStyle="#5d4e36";x.font="bold 40px sans-serif";x.textAlign="center";x.direction="rtl";
  const lab=(t,q)=>{const p=P(q);x.lineWidth=8;x.strokeStyle="rgba(255,255,255,.85)";x.strokeText(t,p[0],p[1]);x.fillText(t,p[0],p[1])};
  {let sx=0,sn=0;GEO.OLD&&GEO.OLD.forEach(q=>{sx+=q[0];sn+=q[1]});if(GEO.OLD)lab("העיר העתיקה",[sx/GEO.OLD.length-250,sn/GEO.OLD.length])}
  lab("הר הזיתים",[900,80]);return c})();
const MB=SATB.old;
function hudTick(){const fw=new THREE.Vector3();camera.getWorldDirection(fw);const nW=new THREE.Vector3(0,0,-1).applyAxisAngle(new THREE.Vector3(0,1,0),-THETA);const ang=Math.atan2(fw.x*nW.z-fw.z*nW.x,fw.x*nW.x+fw.z*nW.z);document.getElementById("needle").style.transform="rotate("+(ang*180/Math.PI)+"deg)";
  const c=document.getElementById("mini");if(c.hidden)return;const x=c.getContext("2d"),l=WG.worldToLocal(camera.position.clone()),gx=l.x,gn=-l.z,S=c.width,span=1600*MAPK;
  const px0=(gx+MAPR)*MAPK,py0=(MAPR-gn)*MAPK,cx=Math.max(span/2,Math.min(MAPS-span/2,px0)),cy=Math.max(span/2,Math.min(MAPS-span/2,py0)),M2=q=>[(q[0]-cx)/span*S+S/2,(q[1]-cy)/span*S+S/2];
  x.save();x.beginPath();x.arc(S/2,S/2,S/2,0,7);x.clip();x.drawImage(MAPC,cx-span/2,cy-span/2,span,span,0,0,S,S);
  // the Temple compound, drawn from the model itself
  if(COMP){const A=0.576,co=[[0,0],[500,0],[500,500],[0,500]].map(([u,v])=>{const w=WG.worldToLocal(new THREE.Vector3(COMP.X0+u*A,0,-(COMP.N0-v*A)));return M2([(w.x+MAPR)*MAPK,(MAPR+w.z)*MAPK])});
    x.beginPath();co.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle="rgba(201,162,74,.55)";x.fill();x.strokeStyle="#8a6a1f";x.lineWidth=1.5;x.stroke();
    const hp=WG.worldToLocal(new THREE.Vector3(COMP.X0+150*A,0,-(COMP.N0-250*A))),h=M2([(hp.x+MAPR)*MAPK,(MAPR+hp.z)*MAPK]);x.fillStyle="#7a5a12";x.fillRect(h[0]-2.5,h[1]-1.5,5,3)}
  const p=M2([px0,py0]),hd=ang;x.translate(p[0],p[1]);x.rotate(hd);x.fillStyle="rgba(232,88,74,.35)";x.beginPath();x.moveTo(0,0);x.arc(0,0,20,-Math.PI/2-0.5,-Math.PI/2+0.5);x.closePath();x.fill();x.fillStyle="#e8584a";x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.arc(0,0,4.5,0,7);x.fill();x.stroke();x.restore()}
document.getElementById("homeB").addEventListener("click",()=>{if(STORY)STORY.stop();if(TOUR)stopTour();if(WALK)stopWalk();stopDrone();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v==="home"?"true":"false"));flyTo("home",1600)});
document.getElementById("exitB").addEventListener("click",()=>{if(WALK)stopWalk();stopDrone();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v==="court"?"true":"false"));flyTo("court",1600)});
document.getElementById("compass").addEventListener("click",()=>{if(WALK)return;const t=controls.target,d=camera.position.distanceTo(t),nW=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),-THETA);const h=Math.max(20,camera.position.y-t.y);const p=t.clone().addScaledVector(nW,Math.sqrt(Math.max(1,d*d-h*h)));p.y=t.y+h;tween={p0:camera.position.clone(),t0:t.clone(),p1:p,t1:t.clone(),start:performance.now(),dur:900}});
// ---- info card ----
function showInfo(d){if(!d)return;const h="<h2>"+d.n+"</h2>"+(d.r?"<div class='ref'>"+d.r+"</div>":"")+(d.t?"<p class='note'>"+d.t+"</p>":"");document.getElementById("info").innerHTML=h;document.getElementById("infobody").innerHTML=h;document.getElementById("infocard").hidden=false}
const closeInfo=()=>{document.getElementById("infocard").hidden=true};["click","pointerdown"].forEach(ev=>document.getElementById("infoX").addEventListener(ev,e=>{e.stopPropagation();e.preventDefault();closeInfo()}));window.addEventListener("keydown",e=>{if(e.key==="Escape")closeInfo()});
// ---- labels fly to their place ----
function goLabel(L){if(STORY)STORY.stop();if(TRN&&TRN.riding)TRN.stopRide();if(TOUR)stopTour();if(DRONE){droneFly(L.v.clone());showInfo(L.info);return}if(WALK)stopWalk();document.querySelectorAll("#viewSeg button[data-v]").forEach(x=>x.setAttribute("aria-pressed","false"));
  const t=L.v.clone(),cp=camera.position.clone(),dir=cp.sub(t);dir.y=0;if(dir.length()<1)dir.set(1,0,1);dir.normalize();const dist=L.c?85:200;
  const tg=t.clone();tg.y=t.y-(L.c?1:10);for(const c of COL){if(tg.x>c.x0&&tg.x<c.x1&&tg.z>c.z0&&tg.z<c.z1&&tg.y<c.y1+1&&tg.y>c.y0)tg.y=c.y1+1.5}let p=null;
  for(let k=0;k<16&&!p;k++){const an=(k%2?1:-1)*Math.ceil(k/2)*Math.PI/8,d=dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0),an);for(const hf of[0.45,0.8]){const q=t.clone().addScaledVector(d,dist);q.y=t.y+dist*hf;if(segHit(tg,q)>=1&&q.y>floorAt(q.x,q.z)+3){p=q;break}}}
  if(!p){p=t.clone().addScaledVector(dir,dist);p.y=t.y+dist*1.2}
  if(needFade(camera.position,p))routeTo(p,tg,1600);else tween={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:tg,start:performance.now(),dur:reduce?1:1600,arc:true};showInfo(L.info)}
// ---- picking ----
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY];if(TOUR)stopTour();if(STORY&&STORY.pause)STORY.pause()});
document.addEventListener("click",e=>{if(STORY&&e.target.closest&&e.target.closest("#planSeg button,#facSeg button,#locSeg button,#amahSeg button,#gateSeg button,#floorSeg button"))STORY.stop()},true);
renderer.domElement.addEventListener("pointerup",e=>{
  if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;down=null;{const el=document.elementFromPoint(e.clientX,e.clientY);if(el&&el.closest&&el.closest(".lbl,.story,.infocard,.hud,#sbox,#rail,.dr,#intro"))return}
  const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
  ray.setFromCamera(mv,camera);const shown=o=>{for(let q=o;q;q=q.parent){if(!q.visible&&!q.userData.hid)return false}return true};const hit=ray.intersectObjects(cPick.concat(PICK),false).find(h=>h.object.userData&&h.object.userData.n&&shown(h.object));
  if(hit&&hit.object.userData.train){TRN.ride(hit.instanceId);return}
  if(hit){showInfo(hit.object.userData.inst?hit.object.userData.inst(hit):hit.object.userData);if(DRONE)droneFly(hit.point)}else document.getElementById("infocard").hidden=true;
});

