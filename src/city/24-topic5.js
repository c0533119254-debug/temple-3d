// ---- topic 5 (Claude): the ground of the hills: limestone outcrops on the open slopes. This file belongs to Claude (like city/23-topic4.js). ----
// 💡 the Jerusalem hills are limestone, and on the steep slopes of the Kidron, Ben Hinnom and the Mount of Olives the rock comes out of the ground.
// Placement is a suggestion (steep, open, not built, not a road, not a grave); real outcrops from OSM (natural=bare_rock / scree) will replace it when the data comes.
await __Y(80);(function(){const r=rng(2024),cap=SMALL?900:2600,R=[];
  // graves already in the scene (city/15): keep rocks off them
  const GR=new Set(),gk=(x,n)=>Math.floor(x/6)+","+Math.floor(n/6),gm=PICK.find(m=>m.isInstancedMesh&&m.userData&&m.userData.n==="בתי קברות");
  if(gm){const M=new THREE.Matrix4(),p=new THREE.Vector3();for(let i=0;i<gm.count;i++){gm.getMatrixAt(i,M);p.setFromMatrixPosition(M);GR.add(gk(p.x,-p.z))}}
  const hsh=(i,j)=>{const t=Math.sin(i*127.1+j*311.7)*43758.5453;return t-Math.floor(t)};
  const noise=(x,n)=>{const u=x/55,v=n/55,i=Math.floor(u),j=Math.floor(v),f=u-i,g=v-j,a=f*f*(3-2*f),c=g*g*(3-2*g);return(hsh(i,j)*(1-a)+hsh(i+1,j)*a)*(1-c)+(hsh(i,j+1)*(1-a)+hsh(i+1,j+1)*a)*c};
  const st=SMALL?7:5;
  for(let n=-1300;n<520&&R.length<cap;n+=st)for(let x=-1000;x<1150&&R.length<cap;x+=st){const xx=x+(r()-0.5)*st,nn=n+(r()-0.5)*st;
    const kd=segDist(xx,nn,KIDRON)[0],hd=segDist(xx,nn,HINNOM)[0],olv=xx>480&&xx<1100&&nn>-700&&nn<450;if(kd>240&&hd>170&&!olv)continue;if(kd<9)continue;
    const sl=Math.hypot(H(xx+3,nn)-H(xx-3,nn),H(xx,nn+3)-H(xx,nn-3))/6;if(sl<0.16)continue;
    if(noise(xx,nn)*0.8+sl*1.2<0.86||r()<0.6)continue;
    if(inPoly(xx,nn,MOUNT_BIG)||inPoly(xx,nn,OLD)||GR.has(gk(xx,nn))||!clearAt(xx,nn,2.5))continue;
    const s=0.7+Math.pow(r(),2)*2.2;R.push([xx,TY(xx,nn),nn,s,r()*6.28,r()<0.35])}
  if(!R.length)return;
  // two shapes: a round boulder and a flat ledge (nari crust), half buried
  const mk=(flat,det)=>{const g=THREE.BufferGeometryUtils.mergeVertices(new THREE.DodecahedronGeometry(1,det)),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=0.85+0.3*hsh(Math.round(x*9),Math.round(z*9+y*5));p.setXYZ(i,x*k*(flat?1.7:1.1),y*k*(flat?0.32:0.7),z*k*(flat?1.2:0.95))}g.computeVertexNormals();return g};
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.95,envMapIntensity:0.15}),d=new THREE.Object3D(),c=new THREE.Color();
  [false,true].forEach(flat=>{const L=R.filter(q=>q[5]===flat);if(!L.length)return;const m=new THREE.InstancedMesh(mk(flat,SMALL?0:1),mat,L.length);
    L.forEach((q,i)=>{const s=q[3];d.position.set(q[0],q[1]-s*(flat?0.12:0.22),-q[2]);d.rotation.set((hsh(i,1)-0.5)*0.3,q[4],(hsh(i,2)-0.5)*0.3);d.scale.setScalar(s);d.updateMatrix();m.setMatrixAt(i,d.matrix);
      const v=0.4+hsh(i,3)*0.12;c.setRGB(v*1.0,v*0.96,v*0.86);m.setColorAt(i,c)});
    m.castShadow=true;m.receiveShadow=true;m.userData={farGeo:mk(flat,0),lodR:180,n:"סלעי גיר",r:"💡 הצעה; נתונים מ־OSM יחליפו",t:"💡 הרי ירושלים בנויים מאבן גיר. במדרונות התלולים של הקדרון, גיא בן הינום והר הזיתים הסלע יוצא מהאדמה: סלעים עגולים ומדפים שטוחים של נארי."};WG.add(m);PICK.push(m)});
})();
