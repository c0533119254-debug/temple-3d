await __Y(84);let ACTS=null,CROWDT=null;
// ---- Yom Kippur actors: the High Priest, the bull, the two goats, the lottery box, incense ----
function buildYK(W){const g=new THREE.Group();g.visible=false;group.add(g);const P=(u,v,y)=>{const p=W(u,v);return new THREE.Vector3(p[0],y*A,p[1])};
  const gold=new THREE.MeshStandardMaterial({color:0xd8b04a,roughness:0.45,metalness:0.35}),linen=new THREE.MeshStandardMaterial({color:0xfbfaf3,roughness:0.85});
  const hp=FIG.mesh(1,FIG.mat(0xffffff));hp.frustumCulled=false;g.add(hp);const hpMat=hp.material;
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.12,7,5),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}));const mit=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.14,0.17,10),linen);const tz=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.04,0.26),gold);
  const ephod=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.24,0.26),new THREE.MeshStandardMaterial({color:0x2a3f8a,roughness:0.6,metalness:0.2}));
  [head,mit,tz,ephod].forEach(m=>g.add(m));
  const tool=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.08,0.12,10),gold);g.add(tool);
  const mkAnimal=(col,L,Hh,hd)=>{const a=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:col,roughness:0.9});const b=new THREE.Mesh(new THREE.BoxGeometry(L,Hh*0.5,Hh*0.42),m);b.position.y=Hh*0.62;a.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(hd,hd*0.8,hd*0.7),m);h.position.set(L/2+hd*0.35,Hh*0.85,0);a.add(h);[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([i,j])=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.1,Hh*0.4,0.1),m);l.position.set(i*L*0.38,Hh*0.2,j*Hh*0.14);a.add(l)});return a};
  const bull=mkAnimal(0x3b2a20,2.2,1.5,0.55),gA=mkAnimal(0x2b2622,1.0,0.75,0.28),gB=mkAnimal(0x2b2622,1.0,0.75,0.28);
  const thread=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.06,0.3),new THREE.MeshStandardMaterial({color:0xb3261e}));gB.add(thread);thread.position.set(0.75,0.75,0);
  const kalpi=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.55,0.35),gold);[bull,gA,gB,kalpi].forEach(m=>g.add(m));
  const cloud=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshBasicMaterial({color:0xd8d2c8,transparent:true,opacity:0.16,depthWrite:false}),18);cloud.frustumCulled=false;g.add(cloud);cloud.visible=false;
  const tag=label("הכהן הגדול",0,0,0,"c",{n:"הכהן הגדול",r:"משנה יומא",t:"הכהן הגדול עושה לבדו את כל עבודת היום. בבגדי זהב (שמונה בגדים) לעבודות של כל יום, ובבגדי לבן (ארבעה בגדים) לעבודות המיוחדות של יום הכיפורים."});tag.yk=1;tag.m=false;cLabels.push(tag);
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.45,0.62,24),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:0.75,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;g.add(ring);
  const st={pos:P(170,200,7.5),from:null,to:null,t0:0,dur:1,face:0,act:0,garb:"gold",cloud:null,goat:null};
  const placeA=(o,u,v,y,face)=>{o.position.copy(P(u,v,y));o.rotation.y=face};
  placeA(bull,214,248,7.5,Math.PI/2);placeA(gA,272,228,7.5,Math.PI);placeA(gB,272,236,7.5,Math.PI);placeA(kalpi,276,232,7.5+0.6/A*0+0.0,0);kalpi.position.y+=0.28;
  const STEPS={park:[228,224,7.5,0,0],mikve:[200,214,7.5,0,0],laver:[224.5,266,7.5,Math.PI/2,0.3],altar:[250,262,16.5,Math.PI/2,0.4],bull1:[220,248,7.5,Math.PI,0.2],lots:[278,232,7.5,Math.PI,0.6],bull2:[220,248,7.5,Math.PI,0.2],kodesh:[127,250,13.56,Math.PI,0.15],sprinkle:[127,250,13.56,Math.PI,0.9],parochet:[140,250,13.56,Math.PI,0.9],goldalt:[152,252,13.56,Math.PI,0.7],azazel:[276,232,7.5,Math.PI,0.3],end:[226,264,7.5,Math.PI/2,0.1]};
  const api={g,show(v){g.visible=v;if(!v){cloud.visible=false;st.goat=null;placeA(gB,272,236,7.5,Math.PI)}},
    set(key,garb){const s=STEPS[key];if(!s)return;st.from=st.pos.clone();st.to=P(s[0],s[1],s[2]);st.t0=performance.now();st.dur=Math.max(1200,st.from.distanceTo(st.to)/1.3*1000);st.face=s[3];st.act=s[4];st.garb=garb;hpMat.color.setHex(garb==="gold"?0xd8b04a:0xfbfaf3);tz.visible=ephod.visible=garb==="gold";tool.visible=key==="kodesh"||key==="sprinkle"||key==="parochet"||key==="goldalt";
      cloud.visible=key==="kodesh"||key==="sprinkle";if(key==="azazel")st.goat={t0:performance.now(),path:[P(272,236,7.5),P(292,296,7.5),P(250,312,7.5),P(250,345,3.5),P(250,470,3.5),P(250,520,3.5)]};if(key==="lots"){placeA(gB,272,236,7.5,Math.PI);st.goat=null}},
    pose(key,cam){const s=STEPS[key],p=P(s[0],s[1],s[2]);return p},
    tick(dt,tt){if(!g.visible)return;const now=performance.now();let walking=false;if(st.to){const k=Math.min(1,(now-st.t0)/st.dur);st.pos.lerpVectors(st.from,st.to,k);walking=k<1;if(k>=1){st.from=null;st.to=null}}
      const p=st.pos,ang=walking&&st.from?Math.atan2(-(st.to.z-st.from.z),st.to.x-st.from.x):st.face;const D=new THREE.Object3D();D.position.copy(p);D.rotation.set(0,ang,0);D.updateMatrix();hp.setMatrixAt(0,D.matrix);hp.instanceMatrix.needsUpdate=true;hp.setAmp(0,walking?1:st.act*(0.6+0.4*Math.sin(tt*2)));
      tag.v.set(p.x,p.y+2.5,p.z);ring.position.set(p.x,p.y+0.04,p.z);ring.material.opacity=0.5+0.3*Math.sin(tt*3);
      head.position.set(p.x,p.y+1.56,p.z);mit.position.set(p.x,p.y+1.7,p.z);const fx=Math.cos(ang),fz=-Math.sin(ang);tz.position.set(p.x+fx*0.13,p.y+1.66,p.z+fz*0.13);tz.rotation.y=ang;ephod.position.set(p.x+fx*0.2,p.y+1.12,p.z+fz*0.2);ephod.rotation.y=ang;tool.position.set(p.x+fx*0.35,p.y+1.0,p.z+fz*0.35);
      if(cloud.visible){const c=P(123,250,13.56),D2=new THREE.Object3D();for(let i=0;i<18;i++){const a=i*2.4+tt*0.2,r=(i%6)*0.35+0.3;D2.position.set(c.x+Math.cos(a)*r,c.y+1.2+(i%5)*0.6+Math.sin(tt*0.6+i)*0.2,c.z+Math.sin(a)*r);D2.scale.setScalar(0.6+(i%4)*0.25);D2.updateMatrix();cloud.setMatrixAt(i,D2.matrix)}cloud.instanceMatrix.needsUpdate=true}
      if(st.goat){const q=st.goat.path,T=(now-st.goat.t0)/1000*1.4;let s=T,k=0;while(k<q.length-2&&s>q[k].distanceTo(q[k+1])){s-=q[k].distanceTo(q[k+1]);k++}const a=q[k],b=q[k+1],f=Math.min(1,s/a.distanceTo(b));gB.position.lerpVectors(a,b,f);gB.rotation.y=Math.atan2(-(b.z-a.z),b.x-a.x);gB.visible=!(k===q.length-2&&f>=1)}else gB.visible=true}};
  return api}

// ---- life in the courts: priests at the altar, Levites on the platform, doves, people walking in the courts ----
// ---- stage 9: the daily service (Mishnah Tamid), 13 priests that walk between places step by step ----
function buildTM(W){const g=new THREE.Group();g.visible=false;group.add(g);const P=(u,v,y)=>{const p=W(u,v);return new THREE.Vector3(p[0],y*A,p[1])};
  const N=13,fig=FIG.mesh(N,FIG.mat(0xfbfaf4));fig.frustumCulled=false;g.add(fig);
  const head=new THREE.InstancedMesh(new THREE.SphereGeometry(0.12,7,5),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}),N),hat=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12,0.135,0.15,10),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.85}),N);
  [head,hat].forEach(m=>{m.frustumCulled=false;g.add(m)});
  const info={n:"הכהנים בסדר התמיד",r:"משנה תמיד; רמב״ם, הלכות תמידין ומוספין ו",t:"⚖️ כהנים בארבעה בגדי לבן — כתונת, מכנסיים, מגבעת ואבנט — יחפים על רצפת האבן. כל אחד עושה את העבודה שזכה בה בפיס."};fig.userData=head.userData=info;cPick.push(fig);
  const silver=new THREE.MeshStandardMaterial({color:0xd9dde2,metalness:0.9,roughness:0.25}),fleece=new THREE.MeshStandardMaterial({color:0xf1ece2,roughness:1}),meat=new THREE.MeshStandardMaterial({color:0x9b3b32,roughness:0.7});
  const lamb=new THREE.Group();{const b=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.42,0.4),fleece);b.position.y=0.55;lamb.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.24,0.22),fleece);h.position.set(0.52,0.75,0);lamb.add(h);[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([i,j])=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.36,0.08),fleece);l.position.set(i*0.32,0.18,j*0.12);lamb.add(l)})}
  lamb.traverse(o=>{if(o.isMesh){o.userData={n:"כבש התמיד",r:"במדבר כח, ג-ח; תמיד ג, ג-ד; ד, א",t:"📜 \"את הכבש אחד תעשה בבקר ואת הכבש השני תעשה בין הערבים\". ⚖️ מביאים אותו מלשכת הטלאים, בודקים אותו לאור האבוקות ומשקים אותו בכוס של זהב. שוחטים אותו בצפון המזבח, בקרן מזרחית־צפונית, ובערב — בקרן מערבית־צפונית."};cPick.push(o)}});g.add(lamb);
  const limbs=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.18,0.22),meat);m.userData={n:"הולכת האיברים",r:"תמיד ד, ג",t:"📜 שישה כהנים מוליכים את האיברים לכבש: הראש והרגל, שתי הידיים, העוקץ והרגל, החזה והגרה, שתי הדפנות, והקרביים. הם נותנים אותם בחצי התחתון של הכבש, במערבו, ומולחים אותם."};cPick.push(m);limbs.push(m);g.add(m)}
  const trumpets=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.75,10,1,true),silver);m.userData={n:"שתי חצוצרות של כסף",r:"תמיד ז, ג; במדבר י, י",t:"📜 \"ושני כהנים עומדים על שולחן החלבים ושתי חצוצרות בידן. תקעו, והריעו, ותקעו\". בכל פרק של השיר תוקעים, ובכל תקיעה העם משתחווה."};cPick.push(m);g.add(m);return m});
  const flag=new THREE.Group();{const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,1.4,6),M.wood);st.position.y=0.7;flag.add(st);const cl=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.4),new THREE.MeshStandardMaterial({color:0xffffff,side:THREE.DoubleSide,roughness:0.9}));cl.position.set(0.28,1.2,0);flag.add(cl);flag.userData.cloth=cl}
  flag.traverse(o=>{if(o.isMesh){o.userData={n:"הסגן והסודרין",r:"תמיד ז, ג",t:"📜 \"הסגן עומד על הקרן והסודרין בידו... הניף הסגן בסודרין, והקיש בן ארזא בצלצל, ודברו הלוים בשיר\" — הנפת הבד היא הסימן ללוויים להתחיל לשיר."};cPick.push(o)}});g.add(flag);
  // places: [u,v,y, face-u, face-v, act(0..1)]
  const circ=(cu,cv,y,r,n,act)=>Array.from({length:n},(_,k)=>{const a=k/n*Math.PI*2;return[cu+Math.cos(a)*r,cv+Math.sin(a)*r,y,cu,cv,act||0.1]});
  const line=(u0,v0,u1,v1,y0,y1,n,fu,fv,act)=>Array.from({length:n},(_,k)=>{const t=n>1?k/(n-1):0;return[u0+(u1-u0)*t,v0+(v1-v0)*t,y0+(y1-y0)*t,fu,fv,act||0]});
  const ramp=v=>7.5+(296-v)*0.3;
  const GZ=[310,295.2,7.56];
  const ST={
    night:line(222,186,238,186,3.5,3.5,13,230,175,0),
    pais1:[[GZ[0],GZ[1],GZ[2],GZ[0]+1,GZ[1],0.6]].concat(circ(GZ[0],GZ[1],GZ[2],2.8,12,0.15)),
    deshen:[[250,258,16.5,250,250,0.8],[222.3,265.2,7.5,222,263,0.4]].concat(line(226,270,240,270,7.5,7.5,11,250,250,0)),
    wood:line(244,247,256,253,16.5,16.5,4,250,250,0.9).concat(line(226,272,244,272,7.5,7.5,9,250,262,0)),
    pais2:[[GZ[0],GZ[1],GZ[2],GZ[0]+1,GZ[1],0.6]].concat(circ(GZ[0],GZ[1],GZ[2],2.8,12,0.15)),
    lamb:[[250,166,27.6,300,140,0.5],[250.6,201,7.5,250,203,0.3],[249.4,201,7.5,250,203,0.3]].concat(line(236,197,264,197,3.5,3.5,10,250,205,0)),
    shechita:[[244.6,214.6,7.5,244,216,0.8],[245.6,217.6,7.5,244,216,0.6]].concat(line(234,224,260,224,7.5,7.5,11,244,216,0)),
    heikhal:[[154,250,13.56,152,250,0.6],[151,256,13.56,150,257.5,0.6]].concat(line(206,240,206,260,10.5,10.5,11,180,250,0)),
    limbs:line(247,292,247,282,ramp(292),ramp(282),6,247,270,0).concat(line(234,226,262,226,7.5,7.5,7,244,216,0)),
    shema:line(283,293,299,293,7.56,7.56,7,292,290,0.2).concat(line(284,297.5,298,297.5,7.56,7.56,6,292,290,0.2)),
    ketoret:[[154,250,13.56,152,250,0.7],[176,247,13.56,152,250,0.1],[176,253,13.56,152,250,0.1]].concat(line(206,238,206,262,10.5,10.5,10,180,250,0)),
    birkat:line(203.5,241,203.5,259,11.5,11.5,9,240,250,1).concat(line(210,244,210,256,7.5,7.5,4,200,250,0)),
    shir:[[238,262,16.5,234,266,0.7],[240.5,263,16.5,250,280,0.3],[250,267,16.5,250,280,0.3],[239.3,268.2,8.6,250,268,0.4],[239.3,270.4,8.6,250,268,0.4]].concat(line(247,286,247,270,ramp(286),ramp(270),8,250,262,0))};
  const st=Array.from({length:N},(_,i)=>({pos:P(222+i*1.2,186,3.5),from:null,to:null,t0:0,dur:1,f:null,act:0,ff:null}));let key=null;
  const api={g,show(v){g.visible=v},
    set(k){const L=ST[k];if(!L)return;key=k;const now=performance.now();st.forEach((o,i)=>{const q=L[i]||L[L.length-1];o.from=o.pos.clone();o.to=P(q[0],q[1],q[2]);o.t0=now+i*90;o.dur=Math.min(4000,Math.max(900,o.from.distanceTo(o.to)/4*1000));o.ff=P(q[3],q[4],q[2]);o.act=q[5]});
      lamb.visible=k==="lamb"||k==="shechita";if(k==="lamb"){lamb.position.copy(P(250,203,7.5));lamb.rotation.y=Math.PI/2}if(k==="shechita"){lamb.position.copy(P(244,216.3,7.5));lamb.rotation.y=0;lamb.rotation.z=0}
      limbs.forEach(m=>m.visible=k==="limbs"||k==="shir");trumpets.forEach(m=>m.visible=k==="shir");flag.visible=k==="shir"},
    tick(dt,tt){if(!g.visible)return;const now=performance.now(),D=new THREE.Object3D();
      st.forEach((o,i)=>{let walking=false;if(o.to&&now>=o.t0){const k=Math.min(1,(now-o.t0)/o.dur);o.pos.lerpVectors(o.from,o.to,k);walking=k<1;if(k>=1){o.from=null;o.to=null}}
        const p=o.pos;let ang;if(walking){const d=o.to.clone().sub(o.from);ang=Math.atan2(-d.z,d.x)}else if(o.ff){ang=Math.atan2(-(o.ff.z-p.z),o.ff.x-p.x)}else ang=0;
        D.position.copy(p);D.rotation.set(0,ang,0);D.scale.setScalar(1);D.updateMatrix();fig.setMatrixAt(i,D.matrix);fig.setAmp(i,walking?1:o.act*(0.6+0.4*Math.sin(tt*2+i)));
        D.position.y=p.y+1.56;D.updateMatrix();head.setMatrixAt(i,D.matrix);D.position.y=p.y+1.69;D.updateMatrix();hat.setMatrixAt(i,D.matrix);
        const fx=Math.cos(ang),fz=-Math.sin(ang);
        if((key==="limbs"||key==="shir")&&i<6){const m=limbs[i],j=key==="shir"?i+5:i;if(j<N){const q=st[j].pos;m.position.set(q.x+fx*0.3,q.y+(key==="shir"?1.0:1.45),q.z+fz*0.3);m.rotation.y=ang}}
        if(key==="shir"&&(i===3||i===4)){const m=trumpets[i-3];m.position.set(p.x+fx*0.45,p.y+1.45,p.z+fz*0.45);m.rotation.set(0,0,0);m.rotation.z=-Math.PI/2+0.25;m.rotation.y=ang;m.rotateZ(0)}
        if(key==="shir"&&i===1){flag.position.set(p.x+fx*0.25,p.y+0.6,p.z+fz*0.25);flag.rotation.y=ang;flag.userData.cloth.rotation.y=Math.sin(tt*5)*0.6}});
      fig.instanceMatrix.needsUpdate=head.instanceMatrix.needsUpdate=hat.instanceMatrix.needsUpdate=true;
      if(lamb.visible&&key==="lamb"){const t=(now/1000)%1;lamb.position.y=7.5*A+Math.abs(Math.sin(t*Math.PI*2))*0.03}}};
  return api}
function buildActors(W,y0A){const r=rng(777),d=new THREE.Object3D(),c=new THREE.Color(),ACT={tick(){}};
  const P=(u,v,y)=>{const p=W(u,v);return[p[0],y*A,p[1]]};
  // priests: wash at the laver, walk to the ramp, climb, serve at the fire, come down
  const loop=[[222,266,7.5],[236,286,7.5],[250,298,7.5],[250,282,12],[250,268,16.5],[246,262,16.5],[254,256,16.5],[250,268,16.5],[250,298,7.5],[232,290,7.5],[222,266,7.5]].map(q=>P(...q));
  const segL=[];let tot=0;for(let i=0;i<loop.length-1;i++){const l=Math.hypot(loop[i+1][0]-loop[i][0],loop[i+1][1]-loop[i][1],loop[i+1][2]-loop[i][2]);segL.push(l);tot+=l}
  const NPr=SMALL?10:18,pr=FIG.mesh(NPr,FIG.mat(0xf7f5ee)),prH=new THREE.InstancedMesh(new THREE.SphereGeometry(0.12,8,6),new THREE.MeshStandardMaterial({color:0xc99a74,roughness:0.8}),NPr),prT=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12,0.13,0.14,8),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.8}),NPr);
  const PRS=[];for(let i=0;i<NPr;i++)PRS.push({s:i/NPr*tot,v:0.9+r()*0.3});
  pr.userData=prH.userData={n:"כהנים בעבודה",r:"משנה תמיד; רמב״ם, הלכות תמידין ומוספין",t:"כהנים בבגדי לבן: מקדשים ידיים ורגליים בכיור, עולים בכבש אל המזבח, מסדרים את העצים ומקריבים, ויורדים. הם הולכים יחפים על רצפת האבן."};[pr,prH,prT].forEach(m=>{m.frustumCulled=false;group.add(m)});cPick.push(pr);
  // Levites on the duchan, singing and playing
  const LV=[];[[214,258],[273,287]].forEach(([a,b])=>{for(let v=a;v<=b;v+=2.2)LV.push(P(285.5,v,9))});
  const lv=FIG.mesh(LV.length,FIG.mat(0xe8e2cf)),lvH=new THREE.InstancedMesh(new THREE.SphereGeometry(0.12,8,6),prH.material,LV.length);
  LV.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.set(0,Math.PI,0);d.scale.setScalar(1);d.updateMatrix();lv.setMatrixAt(i,d.matrix);d.position.y=p[1]+1.56;d.updateMatrix();lvH.setMatrixAt(i,d.matrix);lv.setAmp(i,0.25)});
  lv.userData={n:"הלוויים על הדוכן",r:"מידות ב, ו; ערכין יא ע״ב",t:"לוויים עומדים על הדוכן ושרים את שיר של יום, בכינורות ובנבלים, בשעה שמנסכים את היין על המזבח. \"ואין פוחתין משנים עשר לויים עומדין על הדוכן\"."};[lv,lvH].forEach(m=>{m.frustumCulled=false;group.add(m)});cPick.push(lv);
  // doves
  const ND=SMALL?14:30,dv=new THREE.InstancedMesh((()=>{const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute([0,0,0,-0.15,0,0.45,0.12,0,0, 0,0,0,0.12,0,0,-0.15,0,-0.45, 0.25,0.02,0,-0.25,0.02,0.06,-0.25,0.02,-0.06],3));g.computeVertexNormals();return g})(),new THREE.MeshStandardMaterial({color:0xf2f0ea,side:THREE.DoubleSide,roughness:0.9}),ND);
  const DV=[];for(let i=0;i<ND;i++)DV.push({c:P(230+r()*60,230+r()*60,0),R:6+r()*16,h:22+r()*18,w:(0.35+r()*0.4)*(r()<0.5?1:-1),ph:r()*6});dv.frustumCulled=false;dv.visible=false;group.add(dv);
  // water in the laver
  const wt=new THREE.Mesh(new THREE.CircleGeometry(1.3*A*1.1,24),new THREE.MeshStandardMaterial({color:0x6f9fb8,roughness:0.05,metalness:0.3,emissive:0x0a1a24}));{const p=P(222,263,9.45);wt.position.set(p[0],p[1],p[2]);wt.rotation.x=-Math.PI/2;group.add(wt)}
  // incense: thin wisps from the doorway of the Heikhal
  const NI=14,inc=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),M.smoke,NI),IN=[];for(let i=0;i<NI;i++)IN.push({t:i/NI,s:r()});const ib=P(197,250,13.56+20);inc.frustumCulled=false;group.add(inc);
  ACT.tick=(dt,tt)=>{
    PRS.forEach((o,i)=>{o.s=(o.s+o.v*dt)%tot;let s=o.s,k=0;while(k<segL.length-1&&s>segL[k]){s-=segL[k];k++}const a=loop[k],b=loop[k+1],f=Math.min(1,s/(segL[k]||1));const x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f,z=a[2]+(b[2]-a[2])*f,ang=Math.atan2(-(b[2]-a[2]),b[0]-a[0]);
      d.position.set(x,y,z);d.rotation.set(0,ang,0);d.scale.setScalar(1);d.updateMatrix();pr.setMatrixAt(i,d.matrix);d.position.y=y+1.56;d.updateMatrix();prH.setMatrixAt(i,d.matrix);d.position.y=y+1.7;d.updateMatrix();prT.setMatrixAt(i,d.matrix)});
    pr.instanceMatrix.needsUpdate=prH.instanceMatrix.needsUpdate=prT.instanceMatrix.needsUpdate=true;
    DV.forEach((o,i)=>{const a=tt*o.w+o.ph,x=o.c[0]+Math.cos(a)*o.R,z=o.c[2]+Math.sin(a)*o.R,y=o.h+Math.sin(tt*0.7+o.ph)*2;d.position.set(x,y,z);d.rotation.set(0,-a+(o.w>0?0:Math.PI),Math.sin(tt*14+o.ph)*0.6);d.scale.setScalar(1);d.updateMatrix();dv.setMatrixAt(i,d.matrix)});dv.instanceMatrix.needsUpdate=true;
    wt.material.emissiveIntensity=0.8+0.2*Math.sin(tt*3);wt.scale.setScalar(1+0.01*Math.sin(tt*5));
    IN.forEach((o,i)=>{o.t=(o.t+dt*0.06)%1;const h=o.t*30,sz=(0.3+o.t*2.2)*A;d.position.set(ib[0]+Math.sin(o.s*30+tt*0.5)*o.t*1.5,ib[1]+h,ib[2]+Math.cos(o.s*20+tt*0.4)*o.t*1.5);d.rotation.set(0,0,0);d.scale.setScalar(sz);d.updateMatrix();inc.setMatrixAt(i,d.matrix)});inc.instanceMatrix.needsUpdate=true};
  ACT.yk=buildYK(W);ACT.tm=buildTM(W);ACT.amb=[pr,prH,prT];const tk0=ACT.tick;ACT.tick=(dt,tt)=>{tk0(dt,tt);ACT.yk.tick(dt,tt);ACT.tm.tick(dt,tt)};
  return ACT}

