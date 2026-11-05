// ---- landmarks (simple shapes at their real places) ----
const TODAYG=new THREE.Group();WG.add(TODAYG);TODAYG.visible=false;
(function(){const st=M.stoneL,wh=M.white,gold=new THREE.MeshStandardMaterial({color:0xd8a531,metalness:0.8,roughness:0.3,envMapIntensity:1}),lead=new THREE.MeshStandardMaterial({color:0x7c838a,metalness:0.5,roughness:0.5}),grey=new THREE.MeshStandardMaterial({color:0x9aa0a4,roughness:0.6});
  const L=(x,n,info,parts,grp)=>{const g=new THREE.Group(),y=bldTop(x,n)>-1e3?Math.min(H(x,n),bldTop(x,n)):H(x,n);g.position.set(x,y,-n);parts(g);if(info.n.indexOf("כנסיי")===0){g.updateMatrixWorld(true);const bb=new THREE.Box3(),rm=[];g.children.forEach(o=>{if(!o.isMesh)return;bb.setFromObject(o);const sz=bb.getSize(new THREE.Vector3());if((bb.max.y-y>20&&Math.max(sz.x,sz.z)<12)||(o.geometry.type==="ConeGeometry"&&o.geometry.parameters.radius<6))rm.push(o)});rm.forEach(o=>g.remove(o))}g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData=info;PICK.push(o)}});(grp||WG).add(g)};
  const box=(g,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m||st);o.position.set(x,y+h/2,z);g.add(o);return o},cylr=(g,r,h,x,y,z,m,sg)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,sg||20),m||st);o.position.set(x,y+h/2,z);g.add(o);return o},dome=(g,r,x,y,z,m,sy)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2),m||wh);o.position.set(x,y,z);o.scale.y=sy||1;g.add(o);return o},cone=(g,r,h,x,y,z,m,sg)=>{const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,sg||16),m||grey);o.position.set(x,y+h/2,z);g.add(o);return o};
  // (rebuilt in detail: topic 3, area 3)
  // (rebuilt in detail: topic 3, area 3)
  // (rebuilt in detail: topic 3, area 5)
  // (Tower of David is now built in detail: topic 3, area 1)
  // today's Temple Mount buildings — shown only in "today" floor mode
  L(-10,2,{n:"כיפת הסלע",r:"מצב \"היום\"",t:"המבנה שעומד היום מעל הסלע. מוצג רק בתצוגת \"היום\", להשוואה."},g=>{const oc=new THREE.Mesh(new THREE.CylinderGeometry(27,27,11,8),new THREE.MeshStandardMaterial({color:0x3f7fb5,roughness:0.6}));oc.rotation.y=Math.PI/8;oc.position.y=5.5;g.add(oc);cylr(g,12,8,0,11,0,new THREE.MeshStandardMaterial({color:0x3f7fb5,roughness:0.6}),24);dome(g,12,0,19,0,gold,1.1)},TODAYG);
  L(36,-215,{n:"מסגד אל־אקצא",r:"מצב \"היום\"",t:"המבנה שבדרום ההר היום. מוצג רק בתצוגת \"היום\"."},g=>{box(g,55,14,80,0,0,0);dome(g,9,0,14,30,grey,0.9)},TODAYG);
})();

