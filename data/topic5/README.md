# נתוני צמחייה וקרקע (נושא 5)

© OpenStreetMap contributors, ODbL.

הורדה ב־Overpass API ב־5.11.2026. חותמת הנתונים (`timestamp_osm_base`) היא מ־2026-11-05, בין 11:18:47Z ל־11:32:58Z.

הקובץ `vegetation.geojson` הוא FeatureCollection אחד: **2746** אובייקטים. בכל אובייקט כל תגיות OSM נמצאות ב־`properties`, ונוספו רק `osm_type` ו־`osm_id`.

## אזור

אותו מוצא כמו נתוני נושא 4: מרכז כיפת הסלע, `LAT0=31.7780`, `LON0=35.2354` (`src/core/02-terrain-materials.js`). בקואורדינטות של נושא 4 (`OSM4` ב־`src/city/16-road-surfaces.js`, עשיריות מטר מהמוצא הזה) אין נקודה רחוקה מ־3000 מ׳. הרחוקה ביותר היא 2899.6 מ׳.

השאילתה היא מעגל, לא מלבן:

```
(around:3000,31.7780,35.2354)
```

מלבן החוסם של המעגל, באותם מטרים למעלה כמו במודל (110574 לרוחב, 94630 לאורך): דרום 31.750869, צפון 31.805131, מערב 35.203698, מזרח 35.267102.

קו או שטח שנוגע במעגל נכנס בשלמותו, ולכן קצה של אובייקט יכול לבלוט מעט מחוץ למעגל.

`historic=*` לא נמשך על כל המעגל (העיר העתיקה מלאה באתרים). הוא נמשך רק על תיבה סביב האובייקטים ששמם הר הזיתים או גת שמנים, ועוד 150 מ׳ לכל צד (150/110574 ברוחב, 150/94630 באורך):

- way/137731600 — הר הזיתים, גם `landuse=orchard` ו־`trees=olive_trees`, אורך 752 מ׳
- way/56711604 — גת שמנים (Garden of Gethsemane), אורך 130 מ׳
- node/2031059194, node/5210692742, node/5210695880 — הר הזיתים
- node/4055644112, node/5325157775 — גת שמנים

התיבה (דרום, מערב, צפון, מזרח): 31.777447, 35.237725, 31.781684, 35.246620.

## שאילתה

```
[out:json][timeout:180];
(
  node["natural"="tree"](around:3000,31.7780,35.2354);
  way["natural"="tree"](around:3000,31.7780,35.2354);
  node["natural"="tree_row"](around:3000,31.7780,35.2354);
  way["natural"="tree_row"](around:3000,31.7780,35.2354);
  nwr["landuse"="forest"](around:3000,31.7780,35.2354);
  nwr["natural"="wood"](around:3000,31.7780,35.2354);
  nwr["landuse"="orchard"](around:3000,31.7780,35.2354);
  nwr["natural"="scrub"](around:3000,31.7780,35.2354);
  nwr["natural"="heath"](around:3000,31.7780,35.2354);
  nwr["natural"="grassland"](around:3000,31.7780,35.2354);
  nwr["landuse"="grass"](around:3000,31.7780,35.2354);
  nwr["landuse"="meadow"](around:3000,31.7780,35.2354);
  nwr["leisure"="park"](around:3000,31.7780,35.2354);
  nwr["leisure"="garden"](around:3000,31.7780,35.2354);
  nwr["natural"="bare_rock"](around:3000,31.7780,35.2354);
  nwr["natural"="scree"](around:3000,31.7780,35.2354);
  nwr["natural"="cliff"](around:3000,31.7780,35.2354);
  nwr["natural"="rock"](around:3000,31.7780,35.2354);
  nwr["natural"="stone"](around:3000,31.7780,35.2354);
  nwr["natural"="cave_entrance"](around:3000,31.7780,35.2354);
  nwr["barrier"="retaining_wall"](around:3000,31.7780,35.2354);
  nwr["man_made"="embankment"](around:3000,31.7780,35.2354);
  nwr["barrier"="wall"](around:3000,31.7780,35.2354);
  nwr["landuse"="farmland"](around:3000,31.7780,35.2354);
  nwr["landuse"="vineyard"](around:3000,31.7780,35.2354);
);
out geom;
```

```
[out:json][timeout:180];
(
  nwr["historic"](31.777447,35.237725,31.781684,35.246620);
);
out geom;
```

## ספירות

המספרים נספרו מתוך `vegetation.geojson`.

| קטגוריה | כמות |
|---|---|
| `natural=tree` | 1531 |
| `natural=tree_row` | 6 |
| `landuse=forest` | 95 |
| `natural=wood` | 5 |
| `landuse=orchard` | 46 |
| `natural=scrub` | 18 |
| `natural=heath` | 0 |
| `natural=grassland` | 6 |
| `landuse=grass` | 22 |
| `landuse=meadow` | 137 |
| `leisure=park` | 439 |
| `leisure=garden` | 84 |
| `natural=bare_rock` | 2 |
| `natural=scree` | 0 |
| `natural=cliff` | 1 |
| `natural=rock` | 2 |
| `natural=stone` | 1 |
| `natural=cave_entrance` | 8 |
| `barrier=retaining_wall` | 85 |
| `man_made=embankment` | 0 |
| `barrier=wall` | 251 |
| `landuse=farmland` | 2 |
| `landuse=vineyard` | 0 |

עצים (`natural=tree`, 1531):

| תגית | כמה עצים |
|---|---|
| `species` | 1 |
| `species:he` | 0 |
| `genus` | 1 |
| `leaf_type` | 66 |
| `leaf_cycle` | 56 |
| `height` | 0 |
| `circumference` | 0 |
| `denotation` | 0 |

העץ היחיד עם מין: node/8548145096, `species=Phoenix canariensis Hort. ex Chabaud`, `genus=Phoenix`. עוד 4 עצים מסומנים רק `taxon=Arecaceae` (בלי `species`). כל 66 בעלי `leaf_type` הם `broadleaved`, ו־56 בעלי `leaf_cycle` הם `deciduous`.

שש שורות העצים (`natural=tree_row`) בלי תגית מין.

מטעים: 46. לחמישה מהם `trees=olive_trees`, ובהם way/137731600 (הר הזיתים). לאחד מהחמישה, way/670656634, יש גם `species=Olea europaea`. ל־41 מטעים אין `trees=*`.

קירות (`barrier=wall`, 251): `wall=dry_stone` ב־6, `wall=stone` ב־29, `wall=concrete` ב־2, `wall=noise_barrier` ב־1, `wall=stone_wall` ב־1, וב־212 אין תגית `wall`.

`historic=*` בתיבת הר הזיתים וגת שמנים: 6. שניים `memorial`, שניים `archaeological_site` (אחד מהם בשם נקרופוליס), אחד `wayside_cross`, ואחד `tomb` (way/625346019, Tomb of Mujir al-Din). בקובץ יש עוד אובייקט אחד עם `historic=citywalls`: way/511655205, קיר (`barrier=wall`) מתוך מעגל 3 הק״מ, לא מתוך תיבת ההר.
