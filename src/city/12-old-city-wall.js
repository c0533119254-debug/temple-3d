// ---- Old City wall, towers, gates ----
(function(){
  const merl=[],tow=[],WLm=[];
  const wi={n:"חומות העיר העתיקה",r:"נבנו בימי סולימאן, 1537–1541",t:"החומות של היום, באורך של כ־4 ק״מ. הן לא חלק מהתוכנית ונשארות כמו שהן."};
  for(let i=0;i<WALL_LINE.length-1;i++){
    const a=WALL_LINE[i],b=WALL_LINE[i+1],dx=b[0]-a[0],dn=b[1]-a[1],L=Math.hypot(dx,dn),steps=Math.max(1,Math.ceil(L/25)),ang=Math.atan2(dn,dx),hh=13;
    for(let k=0;k<steps;k++){const t=(k+0.5)/steps,x=a[0]+dx*t,n=a[1]+dn*t,base=H(x,n)-2;
      const dg=GATES.dung,tg=((dg[0]-a[0])*dx+(dg[1]-a[1])*dn)/L,pd=Math.abs((dg[0]-a[0])*dn-(dg[1]-a[1])*dx)/L,s0=k/steps*L,s1=(k+1)/steps*L;
      const wp=(u0,u1)=>{if(u1-u0<0.3)return;const um=(u0+u1)/2,xx=a[0]+dx*um/L,nq=a[1]+dn*um/L,m=new THREE.Mesh(wbox(u1-u0+0.6,hh,3.6,6),M.wall);m.position.set(xx,base+hh/2,-nq);m.rotation.y=ang;m.castShadow=true;m.receiveShadow=true;m.userData=wi;WLm.push(m)};
      if(pd<8&&tg>s0-3&&tg<s1+3){wp(s0,Math.min(s1,tg-3));wp(Math.max(s0,tg+3),s1)}else wp(s0,s1);
      const nm=Math.max(1,Math.floor(L/steps/2.6));for(let q=0;q<nm;q++){const tt=(k+(q+0.5)/nm)/steps,xx=a[0]+dx*tt,nn=a[1]+dn*tt;merl.push([xx,nn,H(xx,nn)-2+hh,ang])}}
    const nt=Math.floor(L/110);for(let k=1;k<=nt;k++){const t=k/(nt+1);tow.push([a[0]+dx*t,a[1]+dn*t,ang])}
  }
  const mm=new THREE.InstancedMesh(new THREE.BoxGeometry(1.4,1.6,1.2),M.wall,merl.length),d=new THREE.Object3D();
  merl.forEach((p,i)=>{d.position.set(p[0],p[2]+0.8,-p[1]);d.rotation.set(0,p[3],0);d.updateMatrix();mm.setMatrixAt(i,d.matrix)});mm.castShadow=true;WG.add(mm);
  tow.forEach(p=>{const m=new THREE.Mesh(wbox(9,17,8,6),M.wall);m.position.set(p[0],H(p[0],p[1])-2+8.5,-p[1]);m.rotation.y=p[2];m.castShadow=true;m.userData=wi;WLm.push(m)});{let ok=false;try{if(THREE.BufferGeometryUtils){const gs=WLm.map(m=>{m.updateMatrix();const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrix);return g});const mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs,false);if(mg){const w=new THREE.Mesh(mg,M.wall);w.castShadow=true;w.receiveShadow=true;w.userData=wi;WG.add(w);PICK.push(w);ok=true}gs.forEach(g=>g.dispose())}}catch(e){}if(!ok)WLm.forEach(m=>{WG.add(m);PICK.push(m)})}
  Object.values(GATES).forEach(g=>{if(["שער הרחמים","שער יפו","שער ציון","שער שכם","שער הפרחים","שער האריות","השער החדש"].includes(g[2]))return;
    let best=[1e9,0];for(let i=1;i<WALL_LINE.length;i++){const a=WALL_LINE[i-1],p=WALL_LINE[i];const r=segDist(g[0],g[1],[a,p]);if(r[0]<best[0])best=[r[0],Math.atan2(p[1]-a[1],p[0]-a[0])]}
    const y=H(g[0],g[1])-2,ui={n:g[2],r:"שערי העיר העתיקה",t:"אחד משערי העיר. בתוכנית, שערי הצפון והמערב הם מסלולי הכניסה של העולים לרגל, ושער האשפות ועיר דוד הם מסלול היציאה בדרום. 💡 השער פתוח: עוברים בו ברגל ובכלי רכב, כמו היום."};const gp=new THREE.Group();gp.position.set(g[0],y,-g[1]);gp.rotation.y=best[1];WG.add(gp);
    [[-6,9.5,6,19],[6,9.5,6,19],[0,14,6,10],[0,1,6,2]].forEach(([lx,ly,bw,bh])=>{const m=new THREE.Mesh(wbox(bw,bh,13,6),M.wall);m.position.set(lx,ly,0);m.castShadow=true;m.receiveShadow=true;m.userData=ui;gp.add(m);PICK.push(m)})});
})();

