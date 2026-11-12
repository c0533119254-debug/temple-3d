#!/usr/bin/env python3
"""temple-3d: שכבת קריינות WaveNet-D + מוזיקה (TempleMusic) מעל כל גרסת אתר של Claude.
שימוש:  python3 apply_layer.py <site.zip | site-dir> <out-dir> [--label-suffix .2] [--allow-caption-drift]
- לא עורך את הקלט. כותב ל־out-dir אתר מלא (קבצים בשורש) + מעתיק את השכבה: audio/*.mp3+manifest.json+index.json, music-module/.
- אידמפוטנטי: אם index.html כבר מכיל את הסמן TEMPLE-LAYER, מעתיק כמות שהוא ולא מוסיף כלום.
- נכשל בקול (קוד יציאה 1, בלי לכתוב כלום) אם עוגן חסר או מופיע מספר שגוי של פעמים.
- הכתוביות: מוחלפות לנוסח המפוסק (captions-v117.json) לפי הנוסח הישן שב־tours-v116.json. אם Claude שינה כתובית, העוגן נכשל, אלא אם --allow-caption-drift (אז רק מדווח).
שכבת הקבצים: music-module/music.js, niggun-baal-shem-tov.ogg + .m4a (אותו ניגון ל־Safari ישן), audio-v117/. ההוקים מפורטים ב־LAYER-HOOKS-FOR-CLAUDE.md."""
import sys,os,re,json,shutil,zipfile,tempfile
TC='/workspace/temple-cf'
HERE=os.path.dirname(os.path.abspath(__file__))
args=[a for a in sys.argv[1:] if not a.startswith('--')]
flags=[a for a in sys.argv[1:] if a.startswith('--')]
suffix='.2'
if '--label-suffix' in sys.argv:
    i=sys.argv.index('--label-suffix');suffix=sys.argv[i+1];args=[a for a in args if a!=suffix]
ALLOW='--allow-caption-drift' in flags
if len(args)!=2: sys.exit(__doc__)
inp,out=args
if os.path.abspath(inp)==os.path.abspath(out): sys.exit('refusing to edit in place')
tmp=None
if inp.endswith('.zip'):
    tmp=tempfile.mkdtemp();zipfile.ZipFile(inp).extractall(tmp);srcdir=tmp
else: srcdir=inp
if not os.path.isfile(srcdir+'/index.html'): sys.exit('no index.html at root of input')
s=open(srcdir+'/index.html',encoding='utf-8').read()
def finish(html,patched):
    if os.path.exists(out): shutil.rmtree(out)
    shutil.copytree(srcdir,out)
    open(out+'/index.html','w',encoding='utf-8').write(html)
    if patched or True:
        A=out+'/audio'
        if os.path.exists(A): shutil.rmtree(A)
        os.makedirs(A)
        for f in sorted(os.listdir(TC+'/audio-v117')):
            if f.endswith('.mp3') or f in('manifest.json','index.json'): shutil.copy(TC+'/audio-v117/'+f,A)
        open(A+'/README.txt','w',encoding='utf-8').write('קריינות WaveNet-D (he-IL-Wavenet-D), 69 תחנות. manifest.json: חותמות זמן לכל משפט. index.json: מיפוי סיור->קבצים.\n')
        os.makedirs(out+'/music-module',exist_ok=True)
        shutil.copy(TC+'/music-module/music.js',out+'/music-module/');shutil.copy(TC+'/music-module/niggun-baal-shem-tov.ogg',out+'/music-module/');shutil.copy(TC+'/music-module/niggun-baal-shem-tov.m4a',out+'/music-module/')
caps=json.load(open(TC+'/audio-v117/captions-v117.json',encoding='utf-8'))
old=json.load(open(HERE+'/tours-v116.json',encoding='utf-8'))
R=[];CAPR=[]
# 1) כתוביות: הנוסח המפוסק (= הקריינות)
for k,v in old.items():
    for i,st in enumerate(v['steps']):
        id=f'{k}_{i+1:02d}'
        a='cap:'+json.dumps(st['cap'],ensure_ascii=False);b='cap:'+json.dumps(caps[id],ensure_ascii=False)
        if a!=b: CAPR.append((a,b,1,id))
# 2) סנכרון כתוביות לפי חותמות הזמן ב־audio/manifest.json
R.append(('try{fetch("audio/index.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&typeof j==="object")NARR=j}).catch(()=>{})}catch(e){}',
 'try{fetch("audio/index.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&typeof j==="object")NARR=j}).catch(()=>{})}catch(e){}let MAN=null;try{fetch("audio/manifest.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&j.items)MAN=j.items}).catch(()=>{})}catch(e){}',1,'manifest load'))
R.append(('if(a.duration>0){let acc=0,k=0;const at=a.currentTime/a.duration*tot;for(;k<arr.length-1;k++){acc+=arr[k].length;if(at<acc)break}showText(arr,k)}',
 'const mi=MAN&&MAN[key+"_"+String(S.i+1).padStart(2,"0")];if(mi&&mi.text===st.cap&&mi.sentences&&mi.sentences.length===arr.length){let k=0;for(let q=0;q<arr.length;q++)if(a.currentTime>=mi.sentences[q].start-0.05)k=q;showText(arr,k);const vv=$("stVerse");if(vv&&mi.verseStart!=null)vv.classList.toggle("reading",a.currentTime>=mi.verseStart)}else if(a.duration>0){let acc=0,k=0;const at=a.currentTime/a.duration*tot;for(;k<arr.length-1;k++){acc+=arr[k].length;if(at<acc)break}showText(arr,k)}',1,'sentence sync'))
R.append(('#stVerse cite{','#stVerse.reading span{color:#F5EFE0;transition:color .6s}\n#stVerse cite{',1,'verse highlight css'))
# 3) מוזיקה: אירועי סיור
TM='try{window.TempleMusic&&TempleMusic.%s}catch(e){}'
R.append(('STORY=api;SND.init();','STORY=api;try{window.TempleMusic&&(TempleMusic.endLoading(),TempleMusic.startTour(key))}catch(e){}SND.init();',1,'startTour'))
R.append(('S.i=i;clearTimeout(S.timer);const st=d.steps[i];','S.i=i;clearTimeout(S.timer);'+TM%'onStation(Object.keys(STORIES).find(q=>STORIES[q]===d),i)'+'const st=d.steps[i];',1,'onStation'))
R.append(('stop(){if(!STORY)return;STORY=null;','stop(){if(!STORY)return;STORY=null;'+TM%'endTour()',1,'endTour'))
R.append(('pause(){if(!STORY||S.paused)return;S.paused=true;','pause(){if(!STORY||S.paused)return;S.paused=true;'+TM%'pauseTour()',1,'pauseTour'))
R.append(('$("stPlay").onclick=()=>{','$("stPlay").onclick=()=>{setTimeout(()=>{try{if(window.TempleMusic&&STORY){S.paused?TempleMusic.pauseTour():TempleMusic.resumeTour()}}catch(e){}},0);',1,'play/pause sync'))
# הנמכה מתחת לקריינות
R.append(('a.onended=()=>{clearInterval(iv);if(tok===S.token)S.narrDone=true};','a.onended=()=>{clearInterval(iv);if(tok===S.token){S.narrDone=true;'+TM%'unduck()'+'}};',1,'unduck (recorded)'))
R.append(('a.play().catch(()=>{});return}}',TM%'duck()'+'a.play().catch(()=>{});return}}',1,'duck (recorded)'))
R.append(('S.narrDone=true;return}','S.narrDone=true;'+TM%'unduck()'+'return}',2,'unduck (device voice / timed captions)'))
R.append(('say(0)};',TM%'duck()'+'say(0)};',1,'duck (device voice)'))
# 4) טעינת המודול
R.append(('</body>','<script src="music-module/music.js"></script>\n<script>try{TempleMusic.init({root:document.getElementById("stage")})}catch(e){}</script>\n</body>',1,'script tag'))
# loading screen: «כניסה»
# v120.2: הכפתור מוסתר עד שהסצנה מוכנה (במקומו נראה רק סרגל ההתקדמות). המאזין נקשר כבר בזמן פענוח ה־HTML,
# לא בסוף הטעינה: בגרסה 120.1 המאזין נקשר רק ב־~96% וכל לחיצה לפני כן הלכה לאיבוד.
ENTER_JS=r"""(function(){var E=window.__ENTER={entered:/[?&]skipenter\b/.test(location.search),ready:false,clicked:false,doHide:null,fired:0,err:null};
var b=document.getElementById("enterBtn");if(!b)return;var tx=0,ty=0;
function go(ev){try{if(E.clicked)return;E.clicked=true;E.fired++;if(ev&&ev.type==="touchend"&&ev.cancelable)ev.preventDefault();
/* השמע מתחיל סינכרונית בתוך המחווה. כל כשל בו לא עוצר את הכניסה. */
try{window.TempleMusic&&TempleMusic.enter&&TempleMusic.enter();setTimeout(function(){try{window.TempleMusic&&TempleMusic.endLoading()}catch(e){}},41000)}catch(e){E.err=String(e)}
}catch(e){E.err=String(e)}finally{E.entered=true;try{if(E.ready&&E.doHide)E.doHide()}catch(e){E.err=String(e)}}}
b.addEventListener("click",go);
b.addEventListener("touchstart",function(e){var t=e.touches&&e.touches[0];if(t){tx=t.clientX;ty=t.clientY}},{passive:true});
b.addEventListener("touchend",function(e){var t=e.changedTouches&&e.changedTouches[0];if(t&&Math.abs(t.clientX-tx)<12&&Math.abs(t.clientY-ty)<12)go(e)},{passive:false});
})();"""
R.append(('<div class="ldt">העיר נבנית <b>0%</b></div>','<div class="ldt">העיר נבנית <b>0%</b></div><button type="button" id="enterBtn" class="ldenter">כניסה</button><div class="ldhint" id="enterHint" hidden>לחצו «כניסה» כדי להיכנס (עם מוזיקה)</div><script>'+ENTER_JS+'</script>',1,'enter button + early handler'))
R.append(('.ldt{font:600 12px','.ldenter{display:none;margin:16px auto 0;min-width:120px;min-height:44px;padding:9px 34px;border-radius:22px;border:1px solid rgba(240,213,140,.7);background:rgba(240,213,140,.1);color:#F0D58C;font:700 16px var(--f-body,"Assistant",sans-serif);cursor:pointer;letter-spacing:.06em;position:relative;z-index:3;touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-appearance:none;appearance:none}.ldenter:hover,.ldenter:focus-visible,.ldenter:active{background:rgba(240,213,140,.22);outline:none}.ldhint{margin-top:8px;font:600 12px var(--f-body,"Assistant",sans-serif);color:rgba(245,239,224,.7)}\n.loading.ldready .ldbar,.loading.ldready .ldt{display:none}.loading.ldready .ldenter{display:block;animation:ldenterin .5s ease both}@keyframes ldenterin{from{opacity:0}to{opacity:1}}\n.ldt{font:600 12px',1,'enter css'))
# gate hide() on the click
old='{let gone=false;const hide=()=>{if(gone)return;gone=true;window.__LOADT=Math.round(performance.now());const l=document.getElementById("loading");if(l)l.remove();document.getElementById("tourBtn").disabled=false};document.getElementById("tourBtn").disabled=true;setTimeout(hide,9000);const poll=()=>{if(gone)return;const ok=Object.values(satTex).every(t=>t.image&&t.image.complete&&t.image.naturalWidth>0);if(ok)setTimeout(hide,250);else setTimeout(poll,200)};poll()}'
new='{let gone=false,ready=false;const E=window.__ENTER||{entered:true};const doHide=()=>{if(gone)return;gone=true;window.__LOADT=Math.round(performance.now());const l=document.getElementById("loading");if(l)l.remove();document.getElementById("tourBtn").disabled=false};E.doHide=doHide;const hide=()=>{if(ready)return;ready=true;E.ready=true;if(E.entered){doHide();return}const l=document.getElementById("loading");if(l){l.classList.add("ldready");const q=l.querySelector("b");if(q)q.textContent="100%"}const h=document.getElementById("enterHint");if(h)h.hidden=false;const eb=document.getElementById("enterBtn");if(eb)try{eb.focus({preventScroll:true})}catch(e){}};document.getElementById("tourBtn").disabled=true;setTimeout(hide,9000);const poll=()=>{if(gone||ready)return;const ok=Object.values(satTex).every(t=>t.image&&t.image.complete&&t.image.naturalWidth>0);if(ok)setTimeout(hide,250);else setTimeout(poll,200)};poll()}'
R.append((old,new,1,'enter gate'))
# narration: element unlocked inside the «כניסה» tap (iOS unlocks each audio element separately)
R.append(('const a=new Audio("audio/"+f);window.__narrA=a;','const a=(window.TempleMusic&&TempleMusic.narrEl&&TempleMusic.narrEl("audio/"+f))||new Audio("audio/"+f);window.__narrA=a;',1,'narration audio element'))
V1_LAYER_STRINGS=['<div class="ldt">העיר נבנית <b>0%</b></div><button type="button" id="enterBtn" class="ldenter">כניסה</button><div class="ldhint" id="enterHint" hidden>לחצו «כניסה» כדי להיכנס (עם מוזיקה)</div>', '.ldenter{margin:16px auto 0;display:block;padding:9px 34px;border-radius:22px;border:1px solid rgba(240,213,140,.7);background:rgba(240,213,140,.1);color:#F0D58C;font:700 14px var(--f-body,"Assistant",sans-serif);cursor:pointer;letter-spacing:.06em}.ldenter:hover,.ldenter:focus-visible{background:rgba(240,213,140,.22);outline:none}.ldhint{margin-top:8px;font:600 12px var(--f-body,"Assistant",sans-serif);color:rgba(245,239,224,.7)}\n.ldt{font:600 12px', '{let gone=false,entered=/[?&]skipenter\\b/.test(location.search),ready=false;const doHide=()=>{if(gone)return;gone=true;window.__LOADT=Math.round(performance.now());const l=document.getElementById("loading");if(l)l.remove();document.getElementById("tourBtn").disabled=false};const hide=()=>{ready=true;if(entered){doHide();return}const h=document.getElementById("enterHint");if(h)h.hidden=false};const eb=document.getElementById("enterBtn");if(eb)eb.addEventListener("click",()=>{if(entered&&!window.TempleMusic){doHide();return}entered=true;try{window.TempleMusic&&TempleMusic.startLoading()}catch(e){}setTimeout(()=>{try{window.TempleMusic&&TempleMusic.endLoading()}catch(e){}},41000);if(ready)doHide()});document.getElementById("tourBtn").disabled=true;setTimeout(hide,9000);const poll=()=>{if(gone||ready)return;const ok=Object.values(satTex).every(t=>t.image&&t.image.complete&&t.image.naturalWidth>0);if(ok)setTimeout(hide,250);else setTimeout(poll,200)};poll()}']  # v120.1 (marker TEMPLE-LAYER v1): מה שהשכבה הישנה הזריקה, לשדרוג במקום

# --- שדרוג: האתר כבר מכיל שכבה. v1 (120.1) -> v2 (120.2) בהחלפת הקטעים הישנים; v2 מועתק כמות שהוא ---
if 'TEMPLE-LAYER' in s:
    if 'TEMPLE-LAYER v1' in s:
        UP=[(V1_LAYER_STRINGS[0],R[-4][1],1,'upgrade: enter button + early handler'),
            (V1_LAYER_STRINGS[1],R[-3][1],1,'upgrade: enter css'),
            (V1_LAYER_STRINGS[2],R[-2][1],1,'upgrade: enter gate'),
            ('const a=new Audio("audio/"+f);window.__narrA=a;',R[-1][1],1,'upgrade: narration audio element'),
            ('<!--TEMPLE-LAYER v1-->','<!--TEMPLE-LAYER v2-->',1,'upgrade: marker')]
        bad=[f'{n}: found {s.count(a)}, expected {c}' for a,b,c,n in UP if s.count(a)!=c]
        if bad: sys.exit('NOT WRITTEN (v1->v2 upgrade):\n'+'\n'.join(bad))
        for a,b,c,n in UP: s=s.replace(a,b)
        if '--label-suffix' in sys.argv:
            m=re.findall(r'v\.textContent="(גרסה \d+(?:\.\d+)?)"',s)
            if len(m)!=1: sys.exit('NOT WRITTEN: version label anchor found %d times'%len(m))
            s=s.replace('v.textContent="%s"'%m[0],'v.textContent="%s%s"'%(m[0],suffix))
        finish(s,True);print('upgraded v1 -> v2 (%d replacements) ->'%len(UP),out);sys.exit(0)
    finish(s,False);print('already patched (v2): html copied unchanged, layer files refreshed');sys.exit(0)
# end loading choir (fade) when a tour starts

R+=CAPR if not ALLOW else []
# גרסה: הסיומת מתווספת לתווית הגלויה
m=re.findall(r'v\.textContent="(גרסה \d+(?:\.\d+)?)"',s)
if len(m)!=1: sys.exit('NOT WRITTEN: version label anchor found %d times'%len(m))
R.append(('v.textContent="%s"'%m[0],'v.textContent="%s%s"'%(m[0],suffix),1,'version label'))
bad=[]
norm=[]
for t in R:
    if len(t)==3: t=t+(t[0][:40],)
    norm.append(t)
for a,b,n,name in norm:
    c=s.count(a)
    if c!=n: bad.append(f'{name}: found {c}, expected {n}')
if ALLOW:
    miss=[x[3] for x in CAPR if s.count(x[0])!=1]
    if miss: print('WARNING caption drift (not replaced):',miss)
    norm+= [x for x in CAPR if s.count(x[0])==1]
if bad: sys.exit('NOT WRITTEN:\n'+'\n'.join(bad))
for a,b,n,name in norm: s=s.replace(a,b)
s=s.replace('</body>','<!--TEMPLE-LAYER v2-->\n</body>',1) if '<!--TEMPLE-LAYER' not in s else s
finish(s,True);print('ok',len(norm),'replacements ->',out)
