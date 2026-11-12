#!/usr/bin/env python3
"""temple-3d: שכבת קריינות WaveNet-D + מוזיקה (TempleMusic) מעל כל גרסת אתר של Claude.
שימוש:  python3 apply_layer.py <site.zip | site-dir> <out-dir> [--label-suffix .1] [--allow-caption-drift]
- לא עורך את הקלט. כותב ל־out-dir אתר מלא (קבצים בשורש) + מעתיק את השכבה: audio/*.mp3+manifest.json+index.json, music-module/.
- אידמפוטנטי: אם index.html כבר מכיל את הסמן TEMPLE-LAYER, מעתיק כמות שהוא ולא מוסיף כלום.
- נכשל בקול (קוד יציאה 1, בלי לכתוב כלום) אם עוגן חסר או מופיע מספר שגוי של פעמים.
- הכתוביות: מוחלפות לנוסח המפוסק (captions-v117.json) לפי הנוסח הישן שב־tours-v116.json. אם Claude שינה כתובית, העוגן נכשל, אלא אם --allow-caption-drift (אז רק מדווח).
שכבת הקבצים: music-module/music.js, niggun-baal-shem-tov.ogg, audio-v117/. ההוקים מפורטים ב־LAYER-HOOKS-FOR-CLAUDE.md."""
import sys,os,re,json,shutil,zipfile,tempfile
TC='/workspace/temple-cf'
HERE=os.path.dirname(os.path.abspath(__file__))
args=[a for a in sys.argv[1:] if not a.startswith('--')]
flags=[a for a in sys.argv[1:] if a.startswith('--')]
suffix='.1'
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
        shutil.copy(TC+'/music-module/music.js',out+'/music-module/');shutil.copy(TC+'/music-module/niggun-baal-shem-tov.ogg',out+'/music-module/')
if 'TEMPLE-LAYER' in s:
    finish(s,False);print('already patched: html copied unchanged, layer files refreshed');sys.exit(0)
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
# loading screen button
R.append(('<div class="ldt">העיר נבנית <b>0%</b></div>','<div class="ldt">העיר נבנית <b>0%</b></div><button type="button" id="enterBtn" class="ldenter">כניסה</button><div class="ldhint" id="enterHint" hidden>לחצו «כניסה» כדי להיכנס (עם מוזיקה)</div>',1))
R.append(('.ldt{font:600 12px','.ldenter{margin:16px auto 0;display:block;padding:9px 34px;border-radius:22px;border:1px solid rgba(240,213,140,.7);background:rgba(240,213,140,.1);color:#F0D58C;font:700 14px var(--f-body,"Assistant",sans-serif);cursor:pointer;letter-spacing:.06em}.ldenter:hover,.ldenter:focus-visible{background:rgba(240,213,140,.22);outline:none}.ldhint{margin-top:8px;font:600 12px var(--f-body,"Assistant",sans-serif);color:rgba(245,239,224,.7)}\n.ldt{font:600 12px',1))
# gate hide() on the click, start choir from the click
old='{let gone=false;const hide=()=>{if(gone)return;gone=true;window.__LOADT=Math.round(performance.now());const l=document.getElementById("loading");if(l)l.remove();document.getElementById("tourBtn").disabled=false};document.getElementById("tourBtn").disabled=true;setTimeout(hide,9000);const poll=()=>{if(gone)return;const ok=Object.values(satTex).every(t=>t.image&&t.image.complete&&t.image.naturalWidth>0);if(ok)setTimeout(hide,250);else setTimeout(poll,200)};poll()}'
new='{let gone=false,entered=/[?&]skipenter\\b/.test(location.search),ready=false;const doHide=()=>{if(gone)return;gone=true;window.__LOADT=Math.round(performance.now());const l=document.getElementById("loading");if(l)l.remove();document.getElementById("tourBtn").disabled=false};const hide=()=>{ready=true;if(entered){doHide();return}const h=document.getElementById("enterHint");if(h)h.hidden=false};const eb=document.getElementById("enterBtn");if(eb)eb.addEventListener("click",()=>{if(entered&&!window.TempleMusic){doHide();return}entered=true;try{window.TempleMusic&&TempleMusic.startLoading()}catch(e){}setTimeout(()=>{try{window.TempleMusic&&TempleMusic.endLoading()}catch(e){}},41000);if(ready)doHide()});document.getElementById("tourBtn").disabled=true;setTimeout(hide,9000);const poll=()=>{if(gone||ready)return;const ok=Object.values(satTex).every(t=>t.image&&t.image.complete&&t.image.naturalWidth>0);if(ok)setTimeout(hide,250);else setTimeout(poll,200)};poll()}'
R.append((old,new,1))
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
s=s.replace('</body>','<!--TEMPLE-LAYER v1-->\n</body>',1) if '<!--TEMPLE-LAYER' not in s else s
finish(s,True);print('ok',len(norm),'replacements ->',out)
