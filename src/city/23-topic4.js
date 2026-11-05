// ---- topic 4 (Claude): transport of a city with a Temple. This file belongs to Claude (decided by Shmuel, 5.11.2026). ----
// 📜 three pilgrimage feasts a year (Devarim 16:16). 💡 where the pilgrims' buses stop: next to the start of each pilgrim road.
// The start points are copied from TR.pil in city/22-transport.js (the pilgrim roads already in the model).
{const PILS=[["שער שכם",-714.6,489.0],["שער הפרחים",-252.6,540.5],["העופל",336.6,236.4],["ממילא",-884.1,-161.4],["שער האשפות",-169.3,-414.0],["בריכת השילוח",-9,-835]];
  const OSML=window.OSML||(window.OSML={}),g=new THREE.Group();g.name="osm_drop";WG.add(g);(OSML.drop||(OSML.drop=[])).push(g);
  const cars=ROADS.filter(rd=>rd.c>=1&&rd.c<=3&&rd.w>=6);
  const yAt=(rd,i)=>(isNaN(rd.hs[i])?rd.h[i]:rd.hs[i])+0.15+0.04*rd.c+0.025;
  const near=(x,n)=>{let best=null,bd=60;cars.forEach(rd=>{const p=rd.p;for(let i=0;i<p.length-1;i++){const A=p[i],B=p[i+1],dx=B[0]-A[0],dn=B[1]-A[1],L2=dx*dx+dn*dn||1,t=Math.max(0,Math.min(1,((x-A[0])*dx+(n-A[1])*dn)/L2)),d=Math.hypot(x-A[0]-dx*t,n-A[1]-dn*t);
    if(d<bd){bd=d;const L=Math.sqrt(L2);best={rd,i,x:A[0]+dx*t,n:A[1]+dn*t,ux:dx/L,un:dn/L,y:yAt(rd,i)*(1-t)+yAt(rd,i+1)*t}}}});return best};
  const yel=new THREE.MeshStandardMaterial({color:0xf2c230,roughness:0.6,emissive:0x221a00,polygonOffset:true,polygonOffsetFactor:-2});
  const sign=(()=>{const cv=document.createElement("canvas");cv.width=512;cv.height=256;const c=cv.getContext("2d");c.fillStyle="#1f56b8";c.fillRect(0,0,512,256);c.fillStyle="#fff";c.textAlign="center";c.direction="rtl";
    c.font="bold 64px Arial";c.fillText("הורדת",256,96);c.fillText("עולי רגל",256,186);return new THREE.CanvasTexture(cv)})();
  const info=nm=>({n:"הורדת עולי רגל: "+nm,r:"דברים טז, טז (שלוש פעמים בשנה); מקום התחנה 💡 הצעה",t:"📜 שלוש פעמים בשנה עולים לרגל. 💡 כאן האוטובוסים של עולי הרגל עוצרים בצד הדרך, ומכאן ממשיכים ברגל בדרך עולי הרגל שבהדמיה עד הר הבית. בשבת וביום טוב אין נסיעה, ולכן התחנה עובדת בערב החג ובחול המועד."});
  // Flower Gate only: the right-hand bay sits on the brown LRT bed (TRN). Slide it along the road normal,
  // the smallest step that clears the bed mesh, and keep the marking on the roadway edge.
  const rc=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),org=new THREE.Vector3();
  const onBed=(x,n)=>{const q=G2S(x,n);org.set(q[0],180,-q[1]);rc.set(org,down);rc.far=500;const hs=rc.intersectObject(TRN.group,true);for(let i=0;i<hs.length;i++){const u=hs[i].object.userData;if(u&&u.n==="מסילת הרכבת הקלה")return true}return false};
  const pullOff=(fn,o)=>{if(!fn(o))return o;let v=o;while(fn(v)&&v>o-8)v-=0.02;return v};
  const DROPS=[];PILS.forEach(([nm,x,nn])=>{const s=near(x,nn);if(!s)return;const half=s.rd.w/2,rx=s.un,rn=-s.ux,ang=Math.atan2(s.un,s.ux);
    let lat=half-1.4,plat=half+1.0;
    if(nm==="שער הפרחים"){
      const paint=(o)=>{for(let a=-9;a<=9;a+=1.5){if(onBed(s.x+rx*o+s.ux*a+rx*1.375,s.n+rn*o+s.un*a+rn*1.375))return true;if(onBed(s.x+rx*o+s.ux*a-rx*1.375,s.n+rn*o+s.un*a-rn*1.375))return true}for(let b=-1.3;b<=1.3;b+=0.65){if(onBed(s.x+rx*o+s.ux*9.075+rx*b,s.n+rn*o+s.un*9.075+rn*b))return true;if(onBed(s.x+rx*o-s.ux*9.075+rx*b,s.n+rn*o-s.un*9.075+rn*b))return true}return false};
      const board=(o)=>{for(let b=-0.62;b<=0.62;b+=0.31)if(onBed(s.x+rx*(o+b),s.n+rn*(o+b)))return true;return false};
      lat=pullOff(paint,lat);plat=pullOff(board,plat)}
    const cx=s.x+rx*lat,cn=s.n+rn*lat;
    // a yellow bay 18 m long and 2.6 m wide on the right side of the road
    [[0,1.3,18,0.15],[0,-1.3,18,0.15],[9,0,0.15,2.6],[-9,0,0.15,2.6]].forEach(([a,b,w,dp])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,0.04,dp),yel);m.position.set(cx+s.ux*a+rx*b,s.y+0.01,-(cn+s.un*a+rn*b));m.rotation.y=ang;g.add(m)});
    const px=s.x+rx*plat,pn=s.n+rn*plat,pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.8,6),new THREE.MeshStandardMaterial({color:0x4a4f55,metalness:0.5,roughness:0.45}));pole.position.set(px,s.y+1.4,-pn);g.add(pole);
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.6,0.05),new THREE.MeshBasicMaterial({map:sign,toneMapped:false}));b.position.set(px,s.y+2.95,-pn);b.rotation.y=ang+Math.PI/2;b.userData=info(nm);g.add(b);PICK.push(b);DROPS.push([nm,Math.round(cx),Math.round(cn),Math.round(ang*100)/100,s.rd.c,s.rd.w])});
  window.__T4DROP=DROPS;
  // its own show/hide button, added to the "שכבות דרך" row without editing index.html
  const box=document.getElementById("osmSeg");if(box){const bt=document.createElement("button");bt.type="button";bt.dataset.k="drop";bt.setAttribute("aria-pressed","true");bt.textContent="הורדת עולי רגל";box.appendChild(bt)}}
