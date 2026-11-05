// ---- city fabric ----
await __Y(75);function instBlocks(o){
  o.count=Math.round(o.count*(SMALL?0.5:1));const r=rng(o.seed),mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),M.city,o.count);
  const domes=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,6,0,Math.PI*2,0,Math.PI/2),M.dome,o.count);
  const d=new THREE.Object3D(),c=new THREE.Color();let k=0,kd=0,tries=0;
  while(k<o.count&&tries<o.count*15){tries++;
    const x=o.area[0]+r()*(o.area[1]-o.area[0]),n=o.area[2]+r()*(o.area[3]-o.area[2]);if(!o.test(x,n)||!satOK(x,n))continue;
    const w=o.size[0]+r()*(o.size[1]-o.size[0]),dd=o.size[0]+r()*(o.size[1]-o.size[0]),h=o.ht[0]+r()*(o.ht[1]-o.ht[0]);
    if(!clearAt(x,n,Math.max(w,dd)/2))continue;
    const y=TY(x,n);d.position.set(x,y+h/2-1.2,-n);d.scale.set(w,h+1.2,dd);d.rotation.set(0,(o.rot||0)+(r()-0.5)*0.1,0);d.updateMatrix();mesh.setMatrixAt(k,d.matrix);
    c.setHex(o.tint[Math.floor(r()*o.tint.length)]);mesh.setColorAt(k,c);k++;
    if(o.domes&&r()<o.domes){const rad=Math.min(w,dd)*0.22+0.8;d.position.set(x+(r()-0.5)*w*0.3,y+h-1.2,-n+(r()-0.5)*dd*0.3);d.scale.set(rad,rad*0.75,rad);d.rotation.set(0,0,0);d.updateMatrix();domes.setMatrixAt(kd++,d.matrix)}
  }
  mesh.count=k;domes.count=kd;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  mesh.castShadow=true;mesh.receiveShadow=true;domes.castShadow=true;if(k>0)TGRP().add(mesh);if(kd>0)TGRP().add(domes);
}
const tints=[0xe8dfcc,0xdfd4bc,0xeee7d7,0xd9cdb2,0xe3d8c0,0xd2c6aa];
const nearMount=(x,n)=>inPoly(x,n,MOUNT_BIG);
const plaza=(x,n)=>x>-200&&x<-70&&n>-270&&n<-100&&inPoly(x,n,PLAZA);
function cityPass(){
instBlocks({count:2600,seed:7,area:[-920,210,-580,640],test:(x,n)=>inPoly(x,n,OLD)&&!nearMount(x,n)&&!plaza(x,n)&&Math.hypot(x+384,n+295)>22&&Math.hypot(x+705,n+190)>30&&segDist(x,n,[[-98,-116.5],[-87.8,-174.7]])[0]>4,size:[7,19],ht:[6,13],tint:tints,domes:0.35});
instBlocks({count:620,seed:11,area:[-110,560,-1050,-360],test:(x,n)=>segDist(x,n,KIDRON)[0]>26&&!inPoly(x,n,OLD)&&(inPoly(x,n,COD)||x>200),size:[7,15],ht:[5,10],tint:tints,domes:0.2});
instBlocks({count:900,seed:13,area:[-2200,-980,-1500,1700],test:(x,n)=>segDist(x,n,HINNOM)[0]>70,size:[16,40],ht:[10,34],tint:[0xe6dfd0,0xddd6c6,0xeae4d6,0xd4ccb9],rot:0.05});
instBlocks({count:700,seed:17,area:[-950,260,660,1700],test:(x,n)=>segDist(x,n,KIDRON)[0]>60&&!inPoly(x,n,OLD),size:[14,34],ht:[8,26],tint:[0xe6dfd0,0xddd6c6,0xeae4d6],rot:-0.08});
instBlocks({count:260,seed:19,area:[720,1450,-700,1100],test:(x,n)=>x>750,size:[10,24],ht:[6,15],tint:tints,domes:0.15});
instBlocks({count:280,seed:23,area:[-860,-420,-920,-590],test:(x,n)=>segDist(x,n,HINNOM)[0]>55&&!inPoly(x,n,OLD),size:[10,22],ht:[6,12],tint:tints,domes:0.2});
(function(){
  const r=rng(31),cnt=SMALL?1100:2600,can=new THREE.InstancedMesh(new THREE.SphereGeometry(1,7,5),M.leaf,cnt),trk=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.25,0.35,1,5),M.trunk,cnt),d=new THREE.Object3D();let k=0,tries=0;
  while(k<cnt&&tries<cnt*10){tries++;const x=215+r()*600,n=-1000+r()*2200;if(inPoly(x,n,OLD)||nearMount(x,n)||!satOK(x,n)||!clearAt(x,n,2))continue;if(segDist(x,n,KIDRON)[0]<8)continue;if(x>760&&r()<0.6)continue;
    if(x>430&&x<720&&Math.abs(n-10)<170)continue;const y=TY(x,n),s=1.8+r()*1.6;d.position.set(x,y+s*0.9,-n);d.scale.set(s,s*0.7,s);d.updateMatrix();can.setMatrixAt(k,d.matrix);d.position.set(x,y+s*0.35,-n);d.scale.set(1,s*0.7,1);d.updateMatrix();trk.setMatrixAt(k,d.matrix);k++}
  can.count=trk.count=k;can.castShadow=true;TGRP().add(can);TGRP().add(trk);
  const cy=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,6),M.cypress,500);k=0;tries=0;
  while(k<500&&tries<6000){tries++;const x=-1500+r()*2700,n=-1100+r()*2600;if(inPoly(x,n,OLD)||nearMount(x,n)||!satOK(x,n)||!clearAt(x,n,2))continue;const y=TY(x,n),s=1.6+r()*1.2,hh=9+r()*7;d.position.set(x,y+hh/2,-n);d.scale.set(s,hh,s);d.updateMatrix();cy.setMatrixAt(k++,d.matrix)}
  cy.count=k;cy.castShadow=true;TGRP().add(cy);
})();
}
SATPH=0;cityPass();SATPH=1;cityPass();SATPH=null;
(function(){
  const psh=new THREE.Shape();PLAZA.forEach((q,i)=>i?psh.lineTo(q[0],q[1]):psh.moveTo(q[0],q[1]));const pg=new THREE.ShapeGeometry(psh);pg.rotateX(-Math.PI/2);{const uv=pg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/4,uv.getY(i)/4)}
  const pz=new THREE.Mesh(pg,M.pave);pz.position.y=(PLZ+0.25);pz.receiveShadow=true;pz.renderOrder=2;
  pz.userData={n:"רחבת הכותל",r:"",t:"הרחבה נשארת רחבת תפילה. בתוכנית היא גם גישה מערבית להר ושטח המתנה לפי משמרות בחגים. הכותל עצמו — הקיר המערבי של ההר — לא משתנה."};WG.add(pz);PICK.push(pz);
  {const ks=new THREE.Shape();KZ.forEach((q,i)=>i?ks.lineTo(q[0],q[1]):ks.moveTo(q[0],q[1]));const kg=new THREE.ShapeGeometry(ks);kg.rotateX(-Math.PI/2);{const uv=kg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/4,uv.getY(i)/4)}const km=new THREE.Mesh(kg,M.pave);km.position.y=(PLZ+0.24);km.receiveShadow=true;km.renderOrder=2;km.userData={n:"רחבת העלייה לשער קיפונוס",r:"הצעה של התוכנית",t:"💡 רחבה מרוצפת וישרה בין רחבת הכותל לבין המדרגות של שער קיפונוס. מכאן עולים להר במדרגות או במעליות."};WG.add(km);PICK.push(km)}
})();
const stars=(function(){const g=new THREE.BufferGeometry(),v=[],r=rng(77);for(let i=0;i<2500;i++){const th=r()*Math.PI*2,ph=Math.acos(r()*0.95);v.push(15000*Math.sin(ph)*Math.cos(th),15000*Math.cos(ph),15000*Math.sin(ph)*Math.sin(th))}g.setAttribute("position",new THREE.Float32BufferAttribute(v,3));const p=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,transparent:true,opacity:0.85,fog:false}));p.visible=false;scene.add(p);return p})();

function toast(t){let el=document.getElementById("toast");if(!el){el=document.createElement("div");el.id="toast";el.className="toast";el.onclick=()=>el.hidden=true;stage.appendChild(el)}el.textContent=t;el.hidden=false;clearTimeout(el._t);el._t=setTimeout(()=>el.hidden=true,9000)}
// ---- labels ----
const labels=[];
function label(txt,x,y,z,cls,info){const el=document.createElement("div");el.className="lbl go"+(cls?" "+cls:"");el.textContent=txt;stage.appendChild(el);const L={el,v:new THREE.Vector3(x,y,z),c:!!cls,info:info||null,txt};el.addEventListener("click",e=>{e.stopPropagation();goLabel(L)});el.addEventListener("pointerdown",e=>{e.stopPropagation();down=null});el.addEventListener("pointerup",e=>e.stopPropagation());labels.push(L);return L}
const LG=(t,x,n,dy)=>{const q=G2S(x,n);label(t,q[0],H(x,n)+dy,-q[1])};
Object.values(GATES).forEach(g=>LG(g[2],g[0],g[1],24));
[["רחבת הכותל",-140,-175,6],["הכותל המערבי",-93,-145,22],["הר הזיתים",803,36,30],["עיר דוד",40,-600,20],["נחל קדרון",323.4,90.3,8],["גיא בן הינום",-930,-420,14],["בית הכנסת החורבה",-387.5,-299.2,32],["מגדל דוד",-700,-205,34],["שוק הקצבים",-429.5,-88,9],["שוק הבשמים",-411.5,-88,9],["שוק הצורפים",-393,-88,9],["כנסיית הקבר",-545,56,34],["המוריסטן",-518,-60,9],["תפארת ישראל",-198.5,-259,30],["הקרדו",-418,-328,8],["בית הכנסת הרמב״ן",-399,-318,8],["סנט ג׳יימס",-598,-382,24],["הדורמיציון",-606,-656,40],["קבר דוד",-590,-690,16],["שוק הכותנה",-165,-1,12],["רחוב השלשלת",-300,-131,9],["חאן א־זית",-424,80,9],["ויה דולורוזה",-120,296,9],["קשת אקה הומו",-150,290,12],["סנט אן",102,377,20]].forEach(a=>LG(a[0],a[1],a[2],a[3]));

