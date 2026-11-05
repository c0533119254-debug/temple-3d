// ---- Temple Mount platform ----
(function(){
  const s=new THREE.Shape();mountNotched().forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:130,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,-130,0);
  const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/9,uv.getY(i)/9);
  const pp=g.attributes.position,sg=g.groups[1];for(let i=sg.start;i<sg.start+sg.count;i++)uv.setXY(i,(pp.getX(i)+pp.getZ(i))/4.2,pp.getY(i)/4.2);
  const top=new THREE.MeshStandardMaterial({map:T.pavC,normalMap:T.pavN,roughness:0.85});PLATTOP=top;
  const hc=new THREE.TextureLoader().load("tex_sand_diff.jpg"),hn=new THREE.TextureLoader().load("tex_sand_nor.jpg");[hc,hn].forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8});hc.encoding=THREE.sRGBEncoding;
  const herod=new THREE.MeshStandardMaterial({map:hc,normalMap:hn,normalScale:new THREE.Vector2(1.8,1.8),color:0xe2d6bd,roughness:0.92,envMapIntensity:0.3});
  weather(top,0.3,0);weather(herod,0.14,0.22);const m=new THREE.Mesh(g,[top,herod]);m.receiveShadow=true;m.castShadow=false;
  m.userData={n:"הר הבית",r:"מסכת מידות ב, א",t:"הרחבה שהורדוס הרחיב, בצורת טרפז: 488 מ׳ במערב, 470 במזרח, 315 בצפון ו־280 בדרום. הקירות שלה, כמו הכותל המערבי, עומדים עד היום. במודל היא מוצגת כקרקע פנויה רעיונית."};
  WG.add(m);PICK.push(m);
})();

// v83: steps in front of a city-gate arch, from the street up to the sill (item 24)
function sillSteps(add,off,gf,x,n,a,y,w){const q=off(x,n,a,1.6,0),g0=gf(q[0],q[1]);if(!(y-g0>0.12)||y-g0>4)return;const N=Math.ceil((y-g0)/0.17),hh=(y-g0)/N;
  for(let i=0;i<N-1;i++){const top=y-(i+1)*hh,p=off(x,n,a,0.45+i*0.32,0);add("wall",wbox(w+1.2,top-g0+0.6,0.34,4),p[0],(top+g0-0.6)/2,p[1],a+Math.PI/2)}}

// ---- topic 5: plants that grow out of the old walls of the Mount (capers and hyssop) ----
// 📜 "מן הארז אשר בלבנון ועד האזוב אשר יצא בקיר" (מלכים א ה, יג). 💡 like today: capers hang from the joints of the Western Wall and the other Herodian walls.
(function(){const r=rng(4747),C=[],Hs=[],P=MOUNT;let ar=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];ar+=a[0]*b[1]-b[0]*a[1]}const out=ar>0?1:-1;
  for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn);if(L<6)continue;const ox=dn/L*out,on=-dx/L*out;
    for(let s=3;s<L-3;s+=2.2){if(r()<0.72)continue;const x=a[0]+dx*s/L,n=a[1]+dn*s/L,g=H(x+ox*3,n+on*3),hw=-g;if(hw<4)continue;
      const y=g+2.5+r()*(hw-3.5),big=r()<0.6;(big?C:Hs).push([x+ox*(big?0.35:0.15),y-(big?0:0.2),-(n+on*(big?0.35:0.15)),big?1.1+r()*0.8:1.0+r()*0.6,Math.atan2(ox,on)])}}
  TREES5.plant(WG,"caper",C,{n:"צלף בחומה",r:"💡 כמו היום בכותל המערבי",t:"💡 הצלף (Capparis spinosa) צומח היום מבין אבני הכותל ושאר חומות הר הבית, ותלוי מהן כשיח ירוק־כחלחל עם פרחים לבנים."});
  TREES5.plant(WG,"hyssop",Hs,{n:"אזוב בקיר",r:"מלכים א ה, יג",t:"📜 \"ועד האזוב אשר יצא בקיר\" (מלכים א ה, יג): האזוב צומח בסדקי קירות. ⚖️ רב סעדיה גאון והרמב״ם מזהים את האזוב עם הזעתר (צעתר)."});
})();
