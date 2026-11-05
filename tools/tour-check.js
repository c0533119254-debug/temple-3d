// Tour station check (topic 7 / #30 item 3).
// For every station of every tour: fly there, wait for the flight to end, then check
//   1. the subject (the pose target) is on screen, and
//   2. nothing solid stands between the camera and the subject (so the camera is not inside a wall).
// Writes a report and one screenshot per station, plus a contact sheet per window size.
// Run from the repo root with a local server:  python3 -m http.server 8000 &  node tools/tour-check.js http://localhost:8000/ out-dir
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const url=process.argv[2]||'http://localhost:8000/',out=process.argv[3]||'tour-check';fs.mkdirSync(out,{recursive:true});
  const sizes=[['desktop',{viewport:{width:1280,height:800}}],['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]];
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const rep=[];
  for(const [tag,opt] of sizes){const ctx=await b.newContext(opt),p=await ctx.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.addInitScript(()=>{try{localStorage.setItem('tm_intro','1');localStorage.setItem('tm_navhint','1')}catch(e){}});
    await p.route('**/src/core/30-time-views-hud.js',async r=>{const res=await r.fetch();let t=await res.text();t+='\nwindow.__TC={get SA(){return STORY_API},get ST(){return STORIES},camera,scene,controls};\n';r.fulfill({response:res,body:t})});
    await p.goto(url);await p.waitForFunction(()=>!document.getElementById('loading')&&window.__TC,null,{timeout:300000});await p.waitForTimeout(2000);
    const keys=await p.evaluate(()=>Object.keys(__TC.ST).map(k=>[k,__TC.ST[k].title,__TC.ST[k].steps.length]));
    for(const [k,title,n] of keys){for(let i=0;i<n;i++){
      const r=await p.evaluate(async([k,i])=>{const A=__TC.SA;if(A.S.key!==k){A.start(k);A.S.key=k}A.go(i);let c=0;await new Promise(r=>setTimeout(r,300));while(A.S.move&&c<300){await new Promise(r=>setTimeout(r,100));c++}A.pause&&A.pause();await new Promise(r=>setTimeout(r,1200));
        const cam=__TC.camera,tg=__TC.controls.target.clone(),st=A.S.def.steps[i];cam.updateMatrixWorld();const v=tg.clone().project(cam),on=Math.abs(v.x)<0.95&&Math.abs(v.y)<0.95&&v.z<1;
        const dir=cam.position.clone().sub(tg),d=dir.length();dir.normalize();const rc=new THREE.Raycaster(tg.clone().addScaledVector(dir,0.6),dir,0,Math.max(0,d-0.8));const ms=[];__TC.scene.traverseVisible(o=>{if(o.isMesh&&!o.isSprite&&!(o.material&&(o.material.transparent||o.material.opacity<1)))ms.push(o)});
        const h=rc.intersectObjects(ms,false)[0];return{title:st.title,onScreen:on,blocked:h?(h.object.userData&&h.object.userData.n||h.object.name||'?')+' @'+h.distance.toFixed(1)+'m':null,dist:+d.toFixed(1)}},[k,i]);
      const f=`${out}/${tag}_${k}_${String(i+1).padStart(2,'0')}.png`;await p.screenshot({path:f});rep.push({size:tag,tour:k,tourTitle:title,station:i+1,...r,ok:r.onScreen&&!r.blocked,shot:f})}
      await p.evaluate(()=>{__TC.SA.stop&&__TC.SA.stop();__TC.SA.S.key=null})}
    if(errs.length)rep.push({size:tag,errors:errs.slice(0,5)});await ctx.close()}
  await b.close();fs.writeFileSync(out+'/report.json',JSON.stringify(rep,null,1));
  const bad=rep.filter(r=>r.station&&!r.ok);console.log('stations',rep.filter(r=>r.station).length,'problems',bad.length);bad.forEach(r=>console.log(r.size,r.tour,r.station,r.title,r.onScreen?'':'off-screen',r.blocked||''))})();
