// ==== v114 · שכבת האמנות: אור, אבן וזהב ====
// 💡 הכול כאן הוא מראה בלבד (אור, צבע, ניצוץ). אין כאן שום מידה ושום שינוי במבנה.
ART=(function(){
  const LOWQ=QL==="low";
  // האור הישיר של השמש הוא העיקר, ואור השמיים רק ממלא את הצל. קודם אור השמיים (מפת הסביבה) האיר כמעט הכול, ולכן האבן נראתה שטוחה.
  const G={morning:{sun:0xffc88e,k:1.62,hemi:0.30,sky:0xb6c9ee,gnd:0xb48f5e,env:0.34,exp:1.0},
           noon:{sun:0xfff0d8,k:1.75,hemi:0.32,sky:0xc4d6f2,gnd:0xb09468,env:0.40,exp:1.0},
           evening:{sun:0xffb070,k:1.85,hemi:0.28,sky:0xb0bfe6,gnd:0xb88a58,env:0.34,exp:1.0},
           night:{env:1}};
  let diff=[];
  function collect(){const seen=new Set();diff=[];scene.traverse(o=>{const mm=o.material;if(!mm)return;(Array.isArray(mm)?mm:[mm]).forEach(m=>{if(!m||seen.has(m)||!m.isMeshStandardMaterial)return;seen.add(m);if(m.metalness>=0.5)return;if(m.userData.e0==null)m.userData.e0=m.envMapIntensity;diff.push(m)})})}
  function grade(){const g=G[TIME]||G.night;diff.forEach(m=>{m.envMapIntensity=m.userData.e0*g.env});if(TIME==="night"){/* 💡 אור ירח רך: בלילה הקירות היו כמעט שחורים. 124.5: אבל 0.36 עם ירח 0.32 נראה כמו יום אפור. עכשיו אור שמיים כחול חלש וירח חלש, כך שרואים את הצורות, והאור החם בא מהחלונות, מהמנורות ומהמזבח */if(!INSIDE){hemi.intensity=0.06;sun.intensity=Math.min(sun.intensity,0.14);hemi.color.set(0x5a6fae);hemi.groundColor.set(0x15171f)}else{hemi.intensity=Math.max(hemi.intensity,0.36);hemi.color.set(0x93a9dc);hemi.groundColor.set(0x3b3c4c)}return}if(!g.sun)return;
    const sp=sunAt(HOUR!=null?HOUR:TIMES[TIME].h);if(sp.el<4)return; // דמדומים: נשארים כמו שהיו
    sun.color.set(g.sun);sun.intensity*=g.k;hemi.intensity=g.hemi;hemi.color.set(g.sky);hemi.groundColor.set(g.gnd);renderer.toneMappingExposure*=g.exp}
  // אבן ירושלמית: גוון דבש חם במקום קרם כמעט לבן (צבע בלבד)
  M.stone.color.setHex(0xe8d6b4);M.stone2.color.setHex(0xe2cea8);M.stoneL.color.setHex(0xeadabb);M.wall.color.setHex(0xe0cca6);M.pave.color.setHex(0xd2c2a2);M.white.color.setHex(0xe2d6bf);M.marble.color.setHex(0xefe5d2);
  // ---- זהב שמנצנץ: ניצוצות קטנים על משטחי הזהב, שנדלקים וכבים לפי זווית השמש והמבט (בפנים: לפי אור המנורה) ----
  const GL={pts:null,n:0,P:null,N:null,I:null,ph:null};
  const STAR=(()=>{const c=cv(64,64,(x,w,h)=>{x.fillStyle="#000";x.fillRect(0,0,w,h);const g=x.createRadialGradient(32,32,0,32,32,30);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(0.12,"rgba(255,255,255,.55)");g.addColorStop(0.4,"rgba(255,255,255,.1)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,w,h);
      x.globalCompositeOperation="lighter";[[1,0],[0,1]].forEach(([a,b])=>{const l=x.createLinearGradient(32-a*31,32-b*31,32+a*31,32+b*31);l.addColorStop(0,"rgba(255,255,255,0)");l.addColorStop(0.5,"rgba(255,255,255,.9)");l.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=l;if(a)x.fillRect(1,31,62,2);else x.fillRect(31,1,2,62)})});return new THREE.CanvasTexture(c)})();
  const GMAT=new THREE.ShaderMaterial({uniforms:{uTex:{value:STAR},uScale:{value:600}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:"attribute float aI;varying float vI;uniform float uScale;void main(){vI=aI;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=aI<0.01?0.0:clamp((0.14+0.30*aI)*uScale/max(0.5,-mv.z),3.0,44.0);}",
    fragmentShader:"uniform sampler2D uTex;varying float vI;void main(){float a=texture2D(uTex,gl_PointCoord).r*vI;if(a<0.01)discard;gl_FragColor=vec4(vec3(1.0,0.9,0.62)*a,a);}"});
  function glintBuild(){if(GL.pts){if(GL.pts.parent)GL.pts.parent.remove(GL.pts);GL.pts.geometry.dispose();GL.pts=null}
    const want=new Set([M.gold,M.altarGold,M.panel,M.goldFloor]),T=[];let tot=0;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),ab=new THREE.Vector3(),ac=new THREE.Vector3();
    group.updateMatrixWorld(true);
    group.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||!want.has(o.material)||!o.visible||o.userData.hid||!o.geometry||!o.geometry.attributes.position)return;for(let q=o.parent;q&&q!==group;q=q.parent)if(!q.visible)return;
      const g=o.geometry,pos=g.attributes.position,ix=g.index,nt=(ix?ix.count:pos.count)/3,st=Math.max(1,Math.floor(nt/4000));
      for(let t=0;t<nt;t+=st){const i0=ix?ix.getX(t*3):t*3,i1=ix?ix.getX(t*3+1):t*3+1,i2=ix?ix.getX(t*3+2):t*3+2;a.fromBufferAttribute(pos,i0).applyMatrix4(o.matrixWorld);b.fromBufferAttribute(pos,i1).applyMatrix4(o.matrixWorld);c.fromBufferAttribute(pos,i2).applyMatrix4(o.matrixWorld);
        ab.subVectors(b,a);ac.subVectors(c,a);const n=new THREE.Vector3().crossVectors(ab,ac),ar=n.length()*0.5*st;if(ar<1e-5)continue;n.normalize();if(n.y<-0.6)continue;tot+=ar;T.push([a.clone(),ab.clone(),ac.clone(),n,tot,o.material===M.panel||o.material===M.goldFloor])}});
    if(!T.length)return;const N=LOWQ?90:SMALL?200:420,r=rng(1414),P=new Float32Array(N*3),NN=new Float32Array(N*3),I=new Float32Array(N),ph=new Float32Array(N),ins=new Uint8Array(N);
    for(let i=0;i<N;i++){const x=r()*tot;let lo=0,hi=T.length-1;while(lo<hi){const m=(lo+hi)>>1;if(T[m][4]<x)lo=m+1;else hi=m}const t=T[lo];let u=r(),v=r();if(u+v>1){u=1-u;v=1-v}
      const p=t[0].clone().addScaledVector(t[1],u).addScaledVector(t[2],v).addScaledVector(t[3],0.04),n=t[3].clone();n.x+=(r()-0.5)*0.5;n.y+=(r()-0.5)*0.5;n.z+=(r()-0.5)*0.5;n.normalize();
      P[i*3]=p.x;P[i*3+1]=p.y;P[i*3+2]=p.z;NN[i*3]=n.x;NN[i*3+1]=n.y;NN[i*3+2]=n.z;ph[i]=r()*6.283;ins[i]=t[5]?1:0}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(P,3));g.setAttribute("aI",new THREE.BufferAttribute(I,1));
    const pts=new THREE.Points(g,GMAT);pts.frustumCulled=false;pts.renderOrder=7;pts.userData.art=1;group.add(pts);Object.assign(GL,{pts,n:N,P,N:NN,I,ph,ins})}
  const _l=new THREE.Vector3(),_v=new THREE.Vector3(),_h=new THREE.Vector3(),_m=new THREE.Vector3();
  function glintTick(tt){if(!GL.pts)return;const night=TIME==="night",cp=camera.position,P=GL.P,NN=GL.N,I=GL.I,inside=INSIDE>0&&MENL;
    if(inside)MENL.getWorldPosition(_m);else _l.copy(sun.position).sub(sun.target.position).normalize();
    const day=night?0.25:Math.min(1,sun.intensity/1.2);GMAT.uniforms.uScale.value=stage.clientHeight*PR/(2*Math.tan(camera.fov*Math.PI/360));
    for(let i=0;i<GL.n;i++){const j=i*3;if(inside){if(!GL.ins[i]){I[i]=0;continue}_l.set(_m.x-P[j],_m.y-P[j+1],_m.z-P[j+2]).normalize()}else if(GL.ins[i]&&INSIDE===0&&night){I[i]=0;continue}
      _v.set(cp.x-P[j],cp.y-P[j+1],cp.z-P[j+2]);const d=_v.length();if(d>260){I[i]=0;continue}_v.multiplyScalar(1/d);_h.addVectors(_l,_v).normalize();
      const s=Math.max(0,_h.x*NN[j]+_h.y*NN[j+1]+_h.z*NN[j+2]);let k=Math.pow(s,48);k*=(0.75+0.25*Math.sin(tt*3.1+GL.ph[i]))*(inside?0.9:day);I[i]=k<0.04?0:Math.min(1,k*1.5)}
    GL.pts.geometry.attributes.aI.needsUpdate=true}
  // ---- צל חד יותר במחשב חזק (מפת צל 4096). בטלפון ובאיכות חסכונית נשאר כמו שהיה ----
  try{const gl=renderer.getContext(),x=gl.getExtension("WEBGL_debug_renderer_info"),soft=!!(x&&/swiftshader|llvmpipe|software/i.test(gl.getParameter(x.UNMASKED_RENDERER_WEBGL)));
    if(!LOWQ&&!SMALL&&!soft&&renderer.capabilities.maxTextureSize>=8192&&(navigator.deviceMemory||8)>=8){sun.shadow.mapSize.set(4096,4096);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}}catch(e){}
  // ---- מים: כחול־ירקרק עמוק שמחזיר את השמיים, במקום כחול שטוח ----
  [M.water,M.water2].forEach(m=>{m.color.setHex(0x9fc4cf);m.roughness=0.08;m.metalness=0.25;m.normalMap=RIPN;m.normalScale=new THREE.Vector2(0.35,0.35);m.envMapIntensity=1.4;m.needsUpdate=true});
  function built(){collect();try{glintBuild()}catch(e){console.warn("glint",e)}}
  const _s=new THREE.Vector3();
  function tick(dt,tt){if(!reduce)glintTick(tt);
    // כיוון השמש כפי שהמצלמה רואה אותו, כדי שהעשן יואר מהצד הנכון
    if(PFX.length){_s.copy(sun.position).sub(sun.target.position).normalize().transformDirection(camera.matrixWorldInverse);PFX.forEach(S=>{const u=S.pts.material.uniforms;if(u.uL)u.uL.value.set(_s.x,_s.y)})}}
  return{grade,built,collect,G,tick,GL}})();
{const b0=ART.built;ART.built=function(){b0.apply(this,arguments);try{let c=0;WG.children.forEach(ch=>{if(/^(dung_terminal|osm_drop)$/.test(ch.name))c+=mergeGroupStatic(ch)});if(RIVG)c+=mergeGroupStatic(RIVG);group.traverse(o=>{if(o.userData&&o.userData.hid)o.matrixAutoUpdate=false});window.__MGS=c}catch(e){console.warn("mgs",e)}try{if(window.__TOURFIG&&window.__TOURFIG.ambient)window.__TOURFIG.ambient()}catch(e){console.warn("amb",e)}}}
ART.built();applyTime();



/* ==== v114: סיור קולנועי — פסי מסך רחב וכותרת תחנה ==== */
(function(){try{
  const st=document.getElementById("stage")||document.body;
  const bars=document.createElement("div");bars.id="cineBars";bars.setAttribute("aria-hidden","true");bars.innerHTML="<i></i><i></i>";st.appendChild(bars);
  const card=document.createElement("div");card.id="cineTitle";card.setAttribute("aria-hidden","true");card.innerHTML='<small></small><b></b>';st.appendChild(card);
  let d0=null,i0=-1,tm=0;
  setInterval(()=>{const S=STORY_API&&STORY_API.S,on=!!STORY&&S&&S.def;
    if(!on){d0=null;i0=-1;card.classList.remove("on");return}
    if(S.def!==d0||S.i!==i0){d0=S.def;i0=S.i;const s=S.def.steps[S.i]||{};
      card.firstChild.textContent=(S.def.title||"")+" · "+(S.i+1)+"/"+S.def.steps.length;card.lastChild.textContent=s.title||"";
      card.classList.remove("on");void card.offsetWidth;if(s.title){card.classList.add("on");clearTimeout(tm);tm=setTimeout(()=>card.classList.remove("on"),3600)}}
  },200);
}catch(e){console.warn("cine",e)}})();


/* גרסה 115: ממשק מחודש — לוח זהות ושיטה, פעולה ראשית, ערכת צבעים ליום וללילה */
try{(function(){const st=document.getElementById("stage");if(!st||document.getElementById("mplate"))return;
  const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;return e};
  const TL={morning:["☀","בוקר"],noon:["☀","צהריים"],evening:["🌇","ערב"],night:["🌙","לילה"]},TO=["morning","noon","evening","night"];
  const mp=el("div","gl ui dim",'<div class="bt"><b>והראנו בבניינו</b><small>הדמיית המקדש בירושלים</small></div><div class="row"><button type="button" id="mpTime" aria-label="שעה ביום"></button></div>');mp.id="mplate";st.appendChild(mp);
  const curT=()=>{const b=document.querySelector('#timeSeg button[aria-pressed="true"]');return b?b.dataset.t:"morning"};
  mp.querySelector("#mpTime").onclick=()=>{const n=TO[(TO.indexOf(curT())+1)%4],b=document.querySelector('#timeSeg button[data-t="'+n+'"]');if(b)b.click()};
  const cta=el("div","gl ui dim",'<button type="button" class="pri"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/></svg>סיור מודרך</button><button type="button" class="sec"><svg viewBox="0 0 24 24"><circle cx="12" cy="4.6" r="2"/><path d="M12 7.5v6M12 13.5l-3.2 6.5M12 13.5l3.2 6.5M8 10.2l4-1.6 4 1.6"/></svg><span>הולך</span></button><button type="button" class="map" id="ctaMap" aria-label="מפה: מבט מלמעלה כמו בגוגל מפות"><svg viewBox="0 0 24 24"><path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/></svg><span>מפה</span></button>');cta.id="cta";st.appendChild(cta);
  /* 128.2: כפתור ״מפה״ — מבט מלמעלה כמו בגוגל מפות (60-navigation) */cta.querySelector(".map").onclick=()=>{try{window.__NAV.mapView()}catch(e){console.warn("map",e)}};
  cta.querySelector(".pri").onclick=()=>{const b=document.querySelector("#rail button");if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
  /* 128.3: ״הולך״ — דמות שהולכת מהמקום שבמרכז המסך, ומצלמה מאחוריה (52-views-hud) */cta.querySelector(".sec").setAttribute("aria-label","הולך: דמות בגובה אדם, ומצלמה מאחוריה");cta.querySelector(".sec").onclick=()=>{try{if(STORY)STORY.stop();fadeJump(()=>window.__PERSON.start())}catch(e){console.warn("person",e);const b=document.getElementById("vWalk");if(b)b.click()}};const vwS=()=>setTimeout(()=>{const b=document.querySelector('#rail button[aria-pressed="true"]');if(b)b.click()},0);cta.querySelector(".sec").addEventListener("click",vwS);
  let sig="";const sync=()=>{let t="morning",pl="ez",busy=false;try{t=curT();busy=!!(WALK||DRONE||(TRN&&TRN.riding))}catch(e){}
    const s=t+pl+busy;if(s===sig)return;sig=s;document.body.classList.toggle("tnight",t==="night");document.body.classList.toggle("busy3d",busy);
    const L=TL[t]||TL.morning;mp.querySelector("#mpTime").innerHTML="<span>"+L[0]+"</span>"+L[1]};
  /* כניסה להליכה סוגרת מגירה פתוחה, כדי שהמסך יהיה נקי */
  const shut=()=>{const b=document.querySelector('#rail button[aria-pressed="true"]');if(b)b.click()};const vw=document.getElementById("vWalk");if(vw)vw.addEventListener("click",()=>setTimeout(shut,0));
  /* יומן אבחון קטן שנשמר בין טעינות: שגיאות ואובדן הקשר גרפי, כדי למצוא את סיבת האיפוסים הנדירים. נראה במונה הביצועים (Shift+P) */
  try{const K="tm_diag",put=(t)=>{try{const a=JSON.parse(localStorage.getItem(K)||"[]");a.push(new Date().toISOString().slice(5,19)+" "+String(t).slice(0,160));localStorage.setItem(K,JSON.stringify(a.slice(-25)))}catch(e){}};
    window.addEventListener("error",e=>put("err "+(e.message||"")+" @"+(e.lineno||"")));window.addEventListener("unhandledrejection",e=>put("rej "+(e.reason&&e.reason.message||e.reason||"")));
    const cvs=st.querySelector("canvas");if(cvs)cvs.addEventListener("webglcontextlost",()=>{let m="";try{m=" story="+(!!STORY)+" walk="+(!!WALK)}catch(e){}put("contextlost"+m)},true);
    window.__DIAG=()=>{try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}};const pb=document.getElementById("perfbox");if(pb){const dv=document.createElement("div");dv.id="diagbox";dv.style.cssText="position:absolute;right:92px;top:104px;z-index:6;max-width:420px;font:11px/1.4 monospace;color:#d8f5d0;background:rgba(10,14,22,.75);padding:4px 8px;border-radius:6px;direction:ltr;white-space:pre-wrap;pointer-events:none";dv.hidden=true;st.appendChild(dv);setInterval(()=>{const on=!pb.hidden;if(on!==!dv.hidden){dv.hidden=!on;if(on){const a=window.__DIAG();dv.textContent=a.length?a.slice(-8).join("\n"):"diag: empty"}}},700)}}catch(e){}
  sync();setInterval(sync,350)})()}catch(e){console.warn("ui2",e)}


/* גרסה 115 · היגיון לפי שעה, חומרים, והורדת מה שלא תורם. אין כאן שום מידה ושום שינוי במבנה. */
try{(function(){
  /* משטחים שיושבים באותו מישור (ריצוף מול חומה/רצפת לשכה) הבהבו: הריצוף נדחק מעט לאחור בעומק בלבד */
  try{M.pave.polygonOffset=true;M.pave.polygonOffsetFactor=1.5;M.pave.polygonOffsetUnits=3;M.pave.needsUpdate=true}catch(e){}
  /* רצפת הזהב בהיכל: פחות מראָה, בלי כתמי סנוור לבנים. חיפוי הזהב: פחות השתקפות שמיים כחולה */
  try{M.goldFloor.roughness=0.78;M.goldFloor.envMapIntensity=0.28;M.goldFloor.metalness=0.7;M.goldFloor.needsUpdate=true;
      M.panel.metalness=0.66;M.panel.roughness=0.52;M.panel.envMapIntensity=0.55;M.panel.userData.e0=0.55;M.panel.needsUpdate=true}catch(e){}
  try{M.win2.emissive.setHex(0xff9a3c)}catch(e){}
  /* גוף הבית מבחוץ: אבן חמה ועמומה, לא משטח מבריק שמחזיר את כחול השמיים ונראה כמו מגדל זכוכית */
  try{M.marble.roughness=0.9;M.marble.envMapIntensity=0.18;M.marble.userData.e0=0.18;M.marble.color.setHex(0xf3e3c2);M.marble.needsUpdate=true}catch(e){}
  /* 📜 "אחד אבני הכבש ואחד אבני המזבח" (מידות ג, ד): המזבח והכבש נראים כאבנים מסוידות ולא כבטון חלק. תבליטי חוץ הבית בגוון אבן חם */
  try{if(M.altarS&&M.plaster){M.plaster.map=M.altarS.map;M.plaster.normalMap=M.altarS.normalMap;M.plaster.color.setHex(0xf1ebde);M.plaster.needsUpdate=true}
      [M.relief,M.reliefP].forEach(m=>{if(m){m.color.setHex(0xeddcba);m.envMapIntensity=0.25;m.userData.e0=0.25}})}catch(e){}
  /* כפתור "מצב בדיקה" הוא כלי עבודה, לא למבקר: מופיע רק עם ?review בכתובת */
  try{if(!/[?&#]review/.test(location.href)){const b=document.getElementById("revBtn");if(b)b.style.display="none"}}catch(e){}
  /* "יום בשבוע" כפל את "סוג היום" (שבת), ו"איכות גבוהה" כפל את בורר האיכות: יורדים מהתפריט */
  try{const sh=document.getElementById("shabSeg");if(sh&&sh.closest(".ctl"))sh.closest(".ctl").style.display="none";const ss=document.getElementById("oS");if(ss)ss.style.display="none"}catch(e){}
  /* בית הטבילה: במקום כתם שטוח רואים דרך פי הירידה מדרגות יורדות אל מתחת לרצפה, קירות אבן ואור נרות ("והנרות דולקים מכאן ומכאן", תמיד א, א). 💡 צורת המדרגות בהערכה. זה ציור בתוך הפתח בלבד, בלי שינוי במבנה */
  const PITM=()=>new THREE.ShaderMaterial({uniforms:{uO:{value:new THREE.Vector3()},uS:{value:new THREE.Vector2()},uDay:{value:1}},
    vertexShader:"#include <common>\n#include <logdepthbuf_pars_vertex>\nvarying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;\n#include <logdepthbuf_vertex>\n}",
    fragmentShader:"#include <common>\n#include <logdepthbuf_pars_fragment>\nuniform vec3 uO;uniform vec2 uS;uniform float uDay;varying vec3 vW;void main(){\n#include <logdepthbuf_fragment>\nvec3 rd=normalize(vW-cameraPosition);vec3 ro=vec3(vW.z-uO.z,0.0,vW.x-uO.x);vec3 d=vec3(rd.z,min(rd.y,-0.002),rd.x);float TR=0.30,H=0.19,best=1e9,kind=0.0;"+
      "for(int i=0;i<16;i++){float fi=float(i);float y=-(fi+1.0)*H;float t=(y-ro.y)/d.y;float x=ro.x+d.x*t;if(t>0.0&&t<best&&x>=fi*TR&&(x<(fi+1.0)*TR||i==15)){best=t;kind=1.0;}if(d.x<0.0){float t2=(fi*TR-ro.x)/d.x;float yy=ro.y+d.y*t2;if(t2>0.0&&t2<best&&yy<=-fi*H&&yy>=-(fi+1.0)*H){best=t2;kind=2.0;}}}"+
      "if(d.z<0.0){float t=-ro.z/d.z;if(t>0.0&&t<best){best=t;kind=3.0;}}if(d.z>0.0){float t=(uS.x-ro.z)/d.z;if(t>0.0&&t<best){best=t;kind=3.0;}}if(best>1e8){best=0.0;kind=2.0;}"+
      "vec3 p=ro+d*best;float dep=max(0.0,-p.y);float sh=kind<1.5?1.0:(kind<2.5?0.6:0.78);float j=kind>2.5?mix(0.8,1.0,smoothstep(0.0,0.06,abs(fract(p.y/0.42)-0.5)))*mix(0.86,1.0,smoothstep(0.0,0.04,abs(fract(p.x/0.9+floor(p.y/0.42)*0.5)-0.5))):mix(0.84,1.0,smoothstep(0.0,0.05,abs(fract(p.z/0.6)-0.5)));"+
      "float fog=exp(-dep*0.5-max(0.0,p.x-uS.y)*0.45);vec3 col=vec3(0.80,0.71,0.56)*sh*j*fog*mix(0.22,1.0,uDay);col+=vec3(1.0,0.60,0.22)*0.34*exp(-abs(dep-1.5)*1.1)*(kind>2.5?1.0:0.45);gl_FragColor=vec4(col,1.0);}"});
  let pitG=null,pitMs=[];
  /* מיפוי מרקם לפי מיקום (קופסה) לכל מה שמסויד, כדי שגם הכבש (שאין לו קואורדינטות מרקם) ייראה אבן ולא משטח אפור */
  const boxUV=()=>{try{group.traverse(o=>{if(!o.isMesh||o.material!==M.plaster||!o.geometry||o.geometry.userData.buv)return;const g=o.geometry,P=g.attributes.position;if(!P)return;if(!g.attributes.normal)g.computeVertexNormals();const N=g.attributes.normal,uv=new Float32Array(P.count*2),k=1/2.4;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i),ax=Math.abs(N.getX(i)),ay=Math.abs(N.getY(i)),az=Math.abs(N.getZ(i));if(ay>=ax&&ay>=az){uv[i*2]=x*k;uv[i*2+1]=z*k}else if(ax>=az){uv[i*2]=z*k;uv[i*2+1]=y*k}else{uv[i*2]=x*k;uv[i*2+1]=y*k}}g.setAttribute("uv",new THREE.BufferAttribute(uv,2));g.userData.buv=1})}catch(e){console.warn("buv",e)}};
  const pits=()=>{try{if(!group||pitG===group)return;pitG=group;boxUV();pitMs.forEach(m=>{if(m.parent)m.parent.remove(m)});pitMs=[];(window.__PITS||[]).forEach(m=>{if(!m||!m.geometry)return;m.geometry.computeBoundingBox();const b=m.geometry.boundingBox.clone().applyMatrix4(m.matrix),w=b.max.x-b.min.x,l=b.max.z-b.min.z;if(!(w>0.3&&l>0.3))return;
      const g=new THREE.PlaneGeometry(w,l);g.rotateX(-Math.PI/2);g.translate((b.min.x+b.max.x)/2,b.max.y+0.012,(b.min.z+b.max.z)/2);const mat=PITM();const pm=new THREE.Mesh(g,mat);pm.userData=m.userData;pm.renderOrder=1;group.add(pm);pm.updateMatrixWorld(true);
      const o=new THREE.Vector3(b.min.x,b.max.y,b.min.z).applyMatrix4(group.matrixWorld);mat.uniforms.uO.value.copy(o);mat.uniforms.uS.value.set(w,l);try{cPick.push(pm)}catch(e){}pitMs.push(pm)})}catch(e){console.warn("pit",e)}};
  let sig="";
  /* הבנייה נמשכת כמה שלבים: אחרי שהיא מסתיימת (ART.built) עוברים שוב על הפתחים ועל המרקמים */
  try{if(ART&&ART.built){const b0=ART.built;ART.built=function(){const r=b0.apply(this,arguments);pitMs.forEach(m=>{if(m.parent)m.parent.remove(m)});pitG=null;sig="";return r}}}catch(e){}
  const rule=()=>{let night=false,t="morning",st=false;try{t=TIME;night=t==="night";st=!!STORY}catch(e){return}pits();const s=t+st+(group?group.id:0);if(s===sig)return;sig=s;pitMs.forEach(m=>{m.material.uniforms.uDay.value=night?0.3:1});
    /* ⚖ בלילה ההר ריק ורק המשמרות במקומן (מידות א, א): הקהל שבחצרות לא מוצג בלילה. בסיור נשאר כמו שהסיור קובע */
    try{(window.__CRW||[]).forEach(m=>{if(m&&m.parent)m.visible=!night||st})}catch(e){}
    /* 📜 הקטורת מוקטרת בבוקר ובין הערביים (שמות ל, ז-ח): עשן הקטורת רק אז, ובסיור */
    try{if(window.__INC&&window.__INC.parent)window.__INC.visible=st||t==="morning"||t==="evening"}catch(e){}
    /* 💡 התנורים בבית המבשלים לא בוערים בלילה */
    try{if(window.__OVS&&window.__OVS.parent)window.__OVS.visible=!night;if(typeof ksm!=="undefined"&&ksm)ksm.visible=!night}catch(e){}
    try{renderer.shadowMap.needsUpdate=true;lastMove=performance.now()}catch(e){}};
  setInterval(rule,400)})()}catch(e){console.warn("real",e)}

/* 124.8 · רצפת הר הבית: קודם מרקם חול, שמרחוק נראה כמו עפר חום וריק. עכשיו ריצוף אבן ירושלמית בהירה בנדבכים,
   כל אבן בגוון קצת אחר ועם פוגות כהות. 💡 צורת הריצוף ומידות האבנים הן הצעה לתצוגה. המרקם חוזר כל 9 מ׳ (לפי ה־UV של משטח ההר) */
try{(function(){if(!PLATTOP)return;const S=QL==="low"||SMALL?512:1024,k=S/9;
  const c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");let sd=7;const rr=()=>(sd=(sd*16807)%2147483647)/2147483647;
  x.fillStyle="#b3a68e";x.fillRect(0,0,S,S);
  const rows=[1.15,0.95,1.2,1.05,0.9,1.1,1.0,1.1,0.55],tot=rows.reduce((a,b)=>a+b,0);let y=0;
  rows.forEach(h0=>{const h=h0*9/tot*k;let xs=rr()*S,used=0;const L=[];while(used<S-1.0*k){const l=Math.min((1.1+rr()*1.6)*k,S-used);L.push(l);used+=l}if(L.length)L[L.length-1]+=S-used;
    L.forEach(l=>{const t=rr(),g=0.93+0.1*t,wr=Math.round(240*g),wg=Math.round(229*g),wb=Math.round(205*g*(0.98+0.04*rr()));
      for(const dx of [0,-S]){const X=xs+dx;x.fillStyle="rgb("+wr+","+wg+","+wb+")";x.fillRect(X+1.2,y+1.2,l-2.4,h-2.4);
        const gr=x.createLinearGradient(X,y,X,y+h);gr.addColorStop(0,"rgba(255,250,235,.10)");gr.addColorStop(1,"rgba(60,45,25,.10)");x.fillStyle=gr;x.fillRect(X+1.2,y+1.2,l-2.4,h-2.4)}
      xs=(xs+l)%S});y+=h});
  /* גרעין האבן: נקודות דקות */
  const im=x.getImageData(0,0,S,S),D=im.data;for(let i=0;i<D.length;i+=4){const n=(rr()-0.5)*14;D[i]+=n;D[i+1]+=n;D[i+2]+=n*0.9}x.putImageData(im,0,0);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  /* משטחים שפונים למעלה מקבלים את הריצוף לפי המקום בעולם (כל 9 מ׳), כך שהאבנים באותו גודל בכל החצרות ועל ההר. קירות ומדרגות נשארים לפי ה־UV שלהם */
  const fl=m=>{if(!m||m.userData.flag)return;m.userData.flag=true;const prev=m.onBeforeCompile;m.map=t;m.normalMap=null;m.color.setHex(0xfaf4ea);m.roughness=0.84;
    m.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);if(sh.vertexShader.indexOf("varying vec3 vWP")<0){sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;").replace("#include <worldpos_vertex>","#include <worldpos_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;");sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 vWP;")}
      sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nvarying float vUp;").replace("#include <beginnormal_vertex>","#include <beginnormal_vertex>\nvUp=normalize(mat3(modelMatrix)*objectNormal).y;");
      sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying float vUp;").replace("#include <map_fragment>","#ifdef USE_MAP\nvec4 texelColor=texture2D(map,vUp>0.7?vec2(vWP.x,-vWP.z)/9.0:vUv);texelColor=mapTexelToLinear(texelColor);diffuseColor*=texelColor;\n#endif")};
    m.needsUpdate=true};
  fl(M.pave);fl(PLATTOP);
  try{renderer.shadowMap.needsUpdate=true}catch(e){}
})()}catch(e){console.warn("pave",e)}

/* 124.8 · שלב 6: «המקדש בשתי דקות» (125.0: נמדד כשתי דקות, לא דקה), סיור ראשון ברשימה למי שבא בפעם הראשונה. התחנות והמקורות לקוחים כמו שהם מסיור עולה הרגל,
   רק פחות תחנות (כ־דקה). כרטיס הסיור הראשון בתפריט «סיורים» הוא הסיור הזה */
try{(function(){if(!STORIES||!STORIES.pilgrim||STORIES.quick)return;
  const pick=["השער הצפוני","העזרה החיצונה","המזבח","פתח האולם","בתוך ההיכל"].map(t=>STORIES.pilgrim.steps.find(s=>s.title===t)).filter(Boolean).map(s=>Object.assign({},s));
  if(pick.length<4)return;
  const q={title:"המקדש בשתי דקות",min:2,open(){try{SND.crowd(0.04)}catch(e){}},steps:[{title:"המקדש על הר הבית",pose:VP("home"),cap:"ברוכים הבאים אל הר הבית. לפניכם בית המקדש, כפי שראה אותו הנביא יחזקאל במראה, וכפי שפירש המלבי״ם את דבריו. אל ההר הזה עולים ישראל, להיראות לפני השם. חומה סובבת את הבית מכל צד, ובתוכה חצר אחר חצר, וכל אחת קדושה מן הקודמת לה. עכשיו נעשה את כל הדרך בקצרה: נעבור בשער, נעמוד בחצר החיצונה, נגיע אל המזבח, ונביט אל ההיכל. בואו נצא לדרך.",src:"💡 סיור קצר: התחנות מתוך סיור עולה הרגל"}].concat(pick)};
  const rest=Object.assign({},STORIES);Object.keys(rest).forEach(k=>delete STORIES[k]);STORIES.quick=q;Object.assign(STORIES,rest)})()}catch(e){console.warn("quick",e)}

/* 124.7 · שלב 2 של מסמך חוויית המשתמש: תפריט «תצוגה» מתחיל במה שרוב המבקרים מחפשים (שעה, יום, חג, שכבות).
   איכות, רקע, חומת ההר היום ושכבות הדרך עוברים ל«הגדרות מתקדמות» סגורות בתחתית. כפתור שיתוף גלוי בעמודת הכפתורים,
   ובמסך מגע «איך זזים» מסביר מגע ולא מקלדת. 💡 שינוי סידור בלבד: אף אפשרות לא נמחקה */
try{(function(){const $=id=>document.getElementById(id),d=$("dr-view");if(!d||$("advBox"))return;
  const ctl=el=>el&&el.closest(".ctl");
  const adv=document.createElement("details");adv.id="advBox";adv.className="adv";adv.innerHTML='<summary>הגדרות מתקדמות<small>איכות, רקע, חומת ההר היום ושכבות הדרך</small></summary>';
  /* "חומת ההר היום" נשאר כפתור בתוך שכבות (שם מאזינים לו ושם הקישור קורא אותו). כאן יש כפתור שלוחץ עליו ומראה את מצבו */
  const w=$("oW");let wc=null;if(w){wc=document.createElement("div");wc.className="ctl";wc.innerHTML='<div class="cl">להשוואה עם היום</div><div class="seg chips" role="group" aria-label="להשוואה עם היום"><button type="button" id="oW2"></button></div>';
    const b=wc.querySelector("#oW2");b.textContent=w.textContent;const sync=()=>b.setAttribute("aria-pressed",w.getAttribute("aria-pressed")||"false");sync();
    b.onclick=()=>{w.click();sync()};new MutationObserver(sync).observe(w,{attributes:true,attributeFilter:["aria-pressed"]});w.style.display="none"}
  [ctl($("qSeg")),ctl($("floorSeg")),wc,ctl($("osmSeg"))].forEach(c=>{if(c)adv.appendChild(c)});
  d.appendChild(adv);
  adv.addEventListener("toggle",()=>{if(adv.open)setTimeout(()=>{try{adv.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},50)});
  /* שיתוף: עד עכשיו רק בתוך «עזרה» ובכרטיס של מקום */
  const hud=$("hud"),home=$("homeB");if(hud&&!$("shareB")){const sb=document.createElement("button");sb.type="button";sb.className="hb";sb.id="shareB";sb.setAttribute("aria-label","שיתוף המבט הזה");sb.title="שיתוף המבט הזה";
    sb.innerHTML='<svg class="ico" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>';
    sb.onclick=()=>{try{window.__UI.share()}catch(e){}};if(home&&home.nextSibling)hud.insertBefore(sb,home.nextSibling);else hud.appendChild(sb)}
  /* מגע: הסבר בלי מקלדת */
  const touch=matchMedia("(pointer: coarse)").matches&&!matchMedia("(pointer: fine)").matches;
  const TL="<li>אצבע אחת: הזזת המפה.</li><li>שתי אצבעות: מקרבים ומרחיקים, ומסובבים את המבט.</li><li>נגיעה על חלק במודל: השם, המקור והמידות.</li><li>הכפתור ⌂: חזרה למבט הכללי. המצפן: פנייה צפונה.</li>";
  if(touch){const h=$("dr-help"),ul=h&&h.querySelector("ul.plain");if(ul)ul.innerHTML=TL}
  /* 126.1 (בדיקה חוזרת 40): מכשיר משולב — מגע וגם עכבר או מקלדת — מקבל את שתי ההוראות */
  else{let hy=false;try{hy=matchMedia("(any-pointer: coarse)").matches}catch(e){}if(hy){const h=$("dr-help"),ul=h&&h.querySelector("ul.plain");if(ul&&!ul.dataset.hy){ul.dataset.hy=1;ul.insertAdjacentHTML("beforeend","<li><b>במסך מגע:</b></li>"+TL)}}}
})()}catch(e){console.warn("adv",e)}

/* 126.1 (בדיקה חוזרת, א): מקור נתונים אחד לסיורים. חלופת הקריאה (כשאין תלת־ממד) קוראת את tours/reading.json,
   והקובץ נוצר מאותם STORIES בדיוק (tools/test/reading-dump.js). הבדיקה האוטומטית נכשלת אם הם לא זהים */
window.__sukVis=()=>SUK&&SUK.vis?SUK.vis():null;
window.__toursText=()=>{const v=x=>{try{return typeof x==="function"?x():x}catch(e){return ""}},str=x=>{x=v(x);return typeof x==="string"&&x.trim()?x.trim():undefined};
  return Object.keys(STORIES).map(k=>{const S=STORIES[k];return{key:k,title:str(S.title)||k,steps:(S.steps||[]).map((st,i)=>{const o={n:i+1,title:str(st.title)||""};["cap","verse","verseRef","src","full"].forEach(f=>{const t=str(st[f]);if(t)o[f]=t});return o})}})};
__DONE=true;__Q.splice(0).forEach(f=>{try{f()}catch(e){console.warn(e)}});
frame();
})();
</script>

