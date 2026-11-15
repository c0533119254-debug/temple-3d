# בית המקדש השלישי — הדמיה תלת־ממדית

הדמיה של בית המקדש לפי יחזקאל והמלבי״ם.

האתר החי: https://beit-hamikdash-3d.pages.dev

האתר מ־GitHub (מתעדכן לבד אחרי כל מיזוג ל־`main`): https://c0533119254-debug.github.io/temple-3d/

פרסום: כל מיזוג ל־`main` מתפרסם אוטומטית ל־GitHub Pages (`.github/workflows/pages.yml`). Cloudflare Pages (`beit-hamikdash-3d`) מתעדכן רק בהעלאה ידנית.

הענף `main` הוא מקור האמת. זו גרסה 123.9. עץ המקור הישן של גרסה 98 (`src/` ושותפיו) נשמר רק בהיסטוריית git.

## איך פותחים מקומית

הקבצים נטענים זה מזה, לכן צריך שרת מקומי (לחיצה כפולה על הקובץ לא תעבוד):

```
python3 -m http.server 8000
```

ואז בדפדפן: http://localhost:8000

דילוג על מסך הכניסה בבדיקות: http://localhost:8000/?skipenter

## הקוד מפורק לקבצים (מגרסה 124.3)

האתר עצמו הוא עדיין `index.html` אחד. התיקייה `src/` היא אותו קובץ בדיוק, חתוך ל־24 חלקים לפי נושא (`src/main/40-temple-build.js` הוא בניית המקדש, `src/main/62-tours-ui.js` הוא ממשק הסיורים, וכן הלאה). הסדר ב־`src/manifest.txt`.

- ערכת קובץ ב־`src/`? מריצים `python3 tools/templesrc.py build`, וזה בונה את `index.html` מחדש.
- ערכת את `index.html` ישירות (patch של Instinct, `layer/apply_layer.py`)? מריצים `python3 tools/templesrc.py split`, וזה מעדכן את `src/`.
- `python3 tools/templesrc.py check` בודק ששניהם זהים בייט לבייט.

## בדיקת משתמש אוטומטית

בכל PR רצה ב־GitHub הבדיקה `.github/workflows/user-test.yml`: היא עוברת על האתר כמו משתמש חדש, במחשב ובטלפון (כניסה, כרטיסי פתיחה, סיור, חיפוש וכרטיס מידע, הליכה ויציאה), ונכשלת על שגיאת JavaScript, על צעד שלא עובד, או על כפתורים שעולים זה על זה. הדוח מופיע בסיכום הריצה, וצילומי המסך נשמרים כ־artifact בשם `user-test-screens`.

הרצה מקומית: `npm i playwright && npx playwright install chromium`, ואז `python3 -m http.server 8765 &` ו־`node tools/test/user-path.js http://localhost:8765/ out`.

## שכבת הקול והמוזיקה

הקריינות והמוזיקה מתווספות מחדש על גרסה של Claude באמצעות:

```
python3 layer/apply_layer.py
```

הסקריפט אידמפוטנטי, ואינו כותב אם עוגן חסר. אחרי עדכון מבני מ־Claude יש להריץ אותו שוב ולבדוק.

## כללי עבודה לתורמים

1. עובדים בענפים, לא ישירות ב־`main`.
2. לפני העבודה מושכים את הגרסה האחרונה מ־`main`.
3. אין לשבור את העוגנים המפורטים ב־[layer/LAYER-HOOKS-FOR-CLAUDE.md](layer/LAYER-HOOKS-FOR-CLAUDE.md).
4. אחרי שינוי ב־`index.html` שנוגע לכיתובים או לנקודות העיגון, מריצים שוב את `layer/apply_layer.py`.
5. אחרי מיזוג ל־`main` האתר ב־GitHub Pages מתעדכן לבד תוך כדקה. Cloudflare Pages מתעדכן רק בהעלאה ידנית.
