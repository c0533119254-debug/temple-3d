# שכבת קול ומוזיקה: מה לא לשבור (להדביק ל־Claude)

מעל הקוד שלך יושבת שכבה נפרדת: קריינות מוקלטת (WaveNet-D) ומוזיקה (`TempleMusic`, הטמעות יוטיוב רשמיות בלבד). סקריפט אחד (`night/apply_layer.py`) מזריק אחרי כל גרסה שלך מספר קריאות קטנות בעוגנים קבועים, ונכשל בקול אם עוגן חסר. **אל תוסיף קריינות או מוזיקה משלך, ואל תיגע בקבצי `audio/` ו־`music-module/`.** גם בלי להוסיף שום דבר בעצמך, אל תשנה את העוגנים הבאים (שם, מבנה ומחרוזת) בלי לעדכן אותנו:

## עוגנים ב־`index.html` (מחרוזות מדויקות)
1. **מנוע הסיורים** (`STORIES`, `S`, `STORY`, `api`):
   - `STORY=api;SND.init();` ב־`api.start`
   - `S.i=i;clearTimeout(S.timer);const st=d.steps[i];` ב־`go(i)`
   - `stop(){if(!STORY)return;STORY=null;`
   - `pause(){if(!STORY||S.paused)return;S.paused=true;`
   - `$("stPlay").onclick=()=>{`
2. **ההקראה** (`speak`, `NARR`, `window.__narrA`, `S.narrDone`):
   - `try{fetch("audio/index.json")...NARR=j}...` והמבנה `NARR[key][S.i]` (קובץ לפי סיור ומספר תחנה)
   - `a.onended=()=>{clearInterval(iv);if(tok===S.token)S.narrDone=true};`
   - `a.play().catch(()=>{});return}}`
   - `S.narrDone=true;return}` (פעמיים)
   - `say(0)};`
   - שורת סנכרון הכתוביות `if(a.duration>0){let acc=0,k=0;const at=a.currentTime/a.duration*tot;...showText(arr,k)}`
   - `#stVerse{`/`#stVerse cite{` ב־CSS, ו־`$("stVerse")`
3. **הכתוביות:** כל `cap:"…"` ב־`STORIES` מוחלף לנוסח המפוסק של הקריינות. **אל תשנה טקסט של כתובית** (לא מילה, לא פיסוק). אם צריך שינוי, תכתוב לי איזה ומדוע, ואני אפיק מחדש את התחנה.
4. **מסך הטעינה:** `<div class="ldt">העיר נבנית <b>0%</b></div>`, `.ldt{font:600 12px` (CSS), והבלוק `{let gone=false;const hide=()=>{…}…poll()}` (פונקציית `hide` שמסירה את `#loading`). השכבה מוסיפה כפתור «כניסה» ומחכה ללחיצה לפני `hide`.
5. **תווית הגרסה:** `v.textContent="גרסה NNN"` (בדיוק פעם אחת). השכבה מוסיפה לה `.1`.
6. `</body>` פעם אחת בלבד.

## מזהי תחנות (חייבים להישאר יציבים)
מפתחות הסיורים ב־`STORIES`: `tamid`(13), `yk`(12), `pilgrim`(13), `oldcity`(9), `pesach`(8), `sukkot`(7), `hakhel`(7). סך הכול 69 תחנות. הקובץ של תחנה: `audio/<מפתח>_<NN>.mp3` (NN לפי הסדר ב־`steps`, מ־01). **אם מוסיפים, מסירים או מסדרים מחדש תחנה, הקריינות והמוזיקה זזות.** תגיד לי לפני, ואפיק מחדש.

## אל תעשה
- לא להוסיף `speechSynthesis` חדש, `Audio` או נגן יוטיוב משלך.
- לא לכתוב `window.TempleMusic` או `window.__narrA` מצדך.
- לא לפתוח או להוסיף מצבי חג בלי המשימה הרלוונטית (הם נשארים כמו שהם).
