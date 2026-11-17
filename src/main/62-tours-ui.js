// ==== v59 phase C: Voyager-style tours — station strip, slow orbit at each stop, three new festival tours ====
(function(){
const $=id=>document.getElementById(id);
const press=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
const unpress=id=>{const b=$(id);if(b&&b.getAttribute("aria-pressed")==="true")b.click()};
const TID={morning:"tM",noon:"tN",evening:"tE",night:"tL"};
// remember what a tour changed, and put it back when it ends
const keep=()=>({fest:$("oF").getAttribute("aria-pressed")==="true",time:TIME,hour:HOUR,doy:DOY,plan:PLAN,pp:PESPICK,sp:SHVPICK});
// מכונות מצב: בסוף סיור מחזירים בדיוק את השעה שהייתה בסרגל ואת החג, לא רק "בוקר/צהריים"
const festB=k=>document.querySelector('#festSeg button[data-fest="'+k+'"]'),setFestUI=k=>{const b=festB(k);if(b&&b.getAttribute("aria-pressed")!=="true")b.click()};
const back=k=>{if(!k)return;if(!k.fest)unpress("oF");if(DOY!==k.doy){const f=Object.keys(FEST).find(q=>FEST[q].doy===k.doy);if(f)setFestUI(f)}if(k.hour!=null){const s=$("hslider");if(s){s.value=String(k.hour);s.dispatchEvent(new Event("change"))}}else if(TIME!==k.time||HOUR!=null)$(TID[k.time]).click();PESPICK=!!k.pp;if(window.__pesUI)window.__pesUI();SHVPICK=!!k.sp;if(window.__shvUI)window.__shvUI()};
let KP=null;const festOpen=()=>{KP=keep();setFestUI("sukkot");press("oF");closeInfo()}; /* סוכות והקהל (דברים לא, י: "בחג הסוכות"): השמש והירח של תשרי */const festClose=()=>{back(KP);KP=null};
/* גרסה 123: תנועת מצלמה איטית בתוך תחנה (דולי, טיסה): מן המסגור של התחנה אל המסגור השני */
const tourDrift=(b,dur)=>{DRIFT={i:STORY_API.S.i,b:b(),dur:dur||14000,t0:0,a:null}};
const driftTick=dt=>{if(!DRIFT||!STORY)return;const S=STORY_API.S;if(DRIFT.i!==S.i){DRIFT=null;return}if(S.move||tween)return;const now=performance.now();if(!DRIFT.a){DRIFT.a=[camera.position.clone(),controls.target.clone()];DRIFT.t0=now}
  if(S.paused){DRIFT.t0+=dt*1000;return}const k=Math.min(1,(now-DRIFT.t0)/DRIFT.dur),e=k*k*(3-2*k);camera.position.lerpVectors(DRIFT.a[0],DRIFT.b[0],e);controls.target.lerpVectors(DRIFT.a[1],DRIFT.b[1],e);camera.lookAt(controls.target)};window.__driftTick=driftTick;
STORIES.pesach={title:"קרבן פסח",open(){KP=keep();setFestUI("pesach");PESPICK=false;if(window.__pesUI)window.__pesUI();SND.crowd(0.05)},close(){DRIFT=null;try{PES.tour.end()}catch(e){}back(KP);KP=null},steps:[
 {title:"ערב פסח",enter(){PES.tour.go(0)},pose:()=>PES.tour.pose1(),fov:38,nofc:true,cap:"ערב פסח. בכל חצר תנור, ובכל חבורה שה אחד. בשנה שספר אגריפס המלך את הפסחים, נמנו על כל פסח יותר מעשרה איש.",src:"תענית ג, ח; פסחים סד ע״ב",full:"📜 \"צאו והכניסו תנורי פסחים, בשביל שלא יימוקו\" (תענית ג, ח). 📜 \"אין לך כל פסח ופסח שלא נמנו עליו יותר מעשרה בני אדם\" (פסחים סד ע״ב). ⚖️ זה תיאור של שנה אחת, שבה אגריפס המלך ביקש לדעת כמה הם ישראל, ולא מספר מינימום לחבורה. 💡 כאן אחד עשר איש בכל חבורה, ומקום החצר והתנור הוא הצעה לתצוגה."},
 {title:"שערי החצר החיצונה",enter(){PES.tour.go(1)},pose:AP(60,30,40,300,250,9),fov:50,nofc:true,cap:"הבא דרך שער צפון יוצא דרך שער נגב – אין חוזרים בשער שבו באו.",src:"יחזקאל מו, ט",full:"📜 \"והבא דרך שער צפון להשתחות יצא דרך שער נגב, והבא דרך שער נגב יצא דרך שער צפון, לא ישוב דרך השער אשר בא בו, כי נכחו יצא\" (יחזקאל מו, ט). ⚖️ המלבי״ם (מו, י): כך נעשה לכבוד העם. השער המזרחי סגור. 💡 מסלול ההליכה ומספר ההולכים הם הצעה לתצוגה."},
 {title:"כת אחת מתוך שלוש",enter(){PES.tour.go(2)},pose:AP(250,192,10.6,250,150.3,10.0),fov:44,nofc:true,cap:"נכנסה כת ראשונה, נתמלאה העזרה, נעלו דלתות העזרה. תקעו, הריעו ותקעו.",src:"פסחים ה, ה; אבות ה, ה",full:"📜 \"הפסח נשחט בשלש כתות... נכנסה כת ראשונה, נתמלאה העזרה, נעלו דלתות העזרה. תקעו, הריעו ותקעו\" (פסחים ה, ה). 📜 \"עומדים צפופים ומשתחוים רווחים\" (אבות ה, ה). 💡 ביחזקאל מפורשות דלתות רק לשער הפנימי המזרחי; הדלתות בשער הצפוני והדרומי הן הצעה לתצוגה. נשאר פתוח: האם מותר יותר משלוש כתות."},
 {title:"שורות כסף וזהב",enter(){PES.tour.go(3);tourDrift(AP(250,224,9.9,250,236,8.6),16000)},pose:AP(250,188,17,250,214,8.4),fov:46,nofc:true,cap:"שורה שכולה כסף, ושורה שכולה זהב, ולא היו מעורבין – כדי שיהיה להם נוי.",src:"פסחים ה, ה; רמב״ם, הלכות קרבן פסח א, יג",full:"📜 \"הכהנים עומדים שורות שורות, ובידיהם בזיכי כסף ובזיכי זהב. שורה שכולה כסף, ושורה שכולה זהב, לא היו מעורבין. ולא היו לבזיכין שולים, שמא יניחום ויקרש הדם\" (פסחים ה, ה). ⚖️ בלשון הרמב״ם: \"מזרקי כסף ומזרקי זהב\" (קרבן פסח א, יג). 💡 מספר השורות והכוהנים הוא הצעה לתצוגה."},
 {title:"השוחט והמקבל",enter(){PES.tour.go(4);tourDrift(AP(251,225,10.2,250,234,8.5),15000)},pose:AP(239.5,198.6,9.7,244,205.4,8.9),fov:36,nofc:true,cap:"שחט ישראל וקיבל הכוהן – השחיטה כשרה בכל אדם, ומן הקבלה ואילך מצוות כהונה. והלוויים עומדים לפני העם לשרתם, ושוחטים בשביל מי שצריך.",src:"פסחים ה, ו; פסחים סד ע״ב; יחזקאל מד, יא; מלבי״ם מד, ט; דברי הימים ב ל, יז",full:"📜 \"שחט ישראל וקבל הכהן, נתנו לחברו וחברו לחברו, ומקבל את המלא ומחזיר את הריקן. כהן הקרוב אצל המזבח זורקו זריקה אחת כנגד היסוד\" (פסחים ה, ו). 📜 \"דשחיטה בזר כשירה... מקבלה ואילך מצות כהונה\" (פסחים סד ע״ב; לא נבדק מול נוסח נקי). 📜 \"המה ישחטו את העולה ואת הזבח לעם, והמה יעמדו לפניהם לשרתם\" (יחזקאל מד, יא). ⚖️ המלבי״ם (מד, ט): הלוויים משרתים את העם בשחיטה והפשט ונתוח. 📜 \"והלויים על שחיטת הפסחים\" (דברי הימים ב ל, יז). 💡 היחס בין ישראלים ללוויים הוא הצעה לתצוגה."},
 {title:"ההלל",enter(){PES.tour.go(5)},pose:AP(306,264,15.5,354,243,10),fov:42,nofc:true,cap:"קראו את ההלל. אם גמרו – שנו, ואם שנו – שילשו.",src:"פסחים ה, ז (הלוויים: תוספתא פסחים ד)",full:"📜 \"קראו את ההלל. אם גמרו שנו, ואם שנו שלשו, אף על פי שלא שלשו מימיהם\" (פסחים ה, ז). 📜 \"הלוים עומדין על דוכנן וגומרין הלל\" (תוספתא פסחים ד; לא נבדק מול נוסח נקי). 💡 מספר הלוויים ומקומם על המעלות הם הצעה לתצוגה."},
 {title:"תולין ומפשיטין",enter(){PES.tour.go(6)},pose:AP(279,232,15.5,290,213,8.4),fov:38,nofc:true,cap:"מי שאין לו מקום לתלות – מקלות דקים חלקים, מניח על כתפו ועל כתף חברו, ותולה ומפשיט.",src:"פסחים ה, ט; יחזקאל מ, מג; דברי הימים ב לה, יא",full:"📜 \"וכל מי שאין לו מקום לתלות ולהפשיט, מקלות דקים חלקים היו שם, ומניח על כתפו ועל כתף חברו, ותולה ומפשיט\" (פסחים ה, ט). 📜 \"והשפתים טפח אחד מוכנים בבית סביב סביב\" (יחזקאל מ, מג). 📜 \"והלויים מפשיטים\" (דברי הימים ב לה, יא). 💡 מקום המקלות ומספר העוסקים הוא הצעה לתצוגה."},
 {title:"ליל הסדר",enter(){PES.tour.go(7);tourDrift(()=>{const q=viewPose("city");return[q[0].clone().add(new THREE.Vector3(70,-25,-45)),q[1].clone()]},20000)},pose:VP("city"),fov:46,nofc:true,cap:"בלילה הזה צלי אש, מצות ומרורים. כזית פסח – והלל שובר את הגגות.",verse:"וְאָכְלוּ אֶת־הַבָּשָׂר בַּלַּיְלָה הַזֶּה צְלִי־אֵשׁ וּמַצּוֹת עַל־מְרֹרִים יֹאכְלֻהוּ׃",verseRef:"שמות יב, ח",src:"שמות יב, ח; פסחים פה ע״ב",full:"📜 \"ואכלו את הבשר בלילה הזה, צלי אש ומצות, על מררים יאכלהו\" (שמות יב, ח). 📜 \"כזיתא פסחא והלילא פקע איגרא\" (פסחים פה ע״ב; לא נבדק מול נוסח נקי). 💡 מספר התנורים והזוהר שלהם הם הצעה לתצוגה."}]};
{const T=STORIES.tamid;if(T){const o=T.open,c=T.close;T.open=function(){KP=keep();o.call(this)};T.close=function(){c.call(this);back(KP);KP=null}}} // סדר התמיד משנה שעה; בסוף חוזרים לשעה של המשתמש
STORIES.shavuot={title:"הבאת הביכורים ושתי הלחם",open(){KP=keep();setFestUI("shavuot");SHVPICK=false;if(window.__shvUI)window.__shvUI();SND.crowd(0.05)},close(){DRIFT=null;try{SHV.tour.end()}catch(e){}back(KP);KP=null},steps:[
 {title:"עיר המעמד",enter(){SHV.tour.go(0)},pose:()=>SHV.tour.pos([SHV.tour.sR()-68,0,6.5,SHV.tour.sR()-30,0,0.9]),fov:44,nofc:true,cap:"לנין ברחובה של עיר, ולמשכים הממונה אומר: קומו ונעלה ציון אל בית ה׳ אלוקינו.",src:"ביכורים ג, ב",full:"📜 הכפרים שבמעמד מתכנסים לעיר המעמד, לנים ברחובה של עיר, והממונה אומר: \"קומו ונעלה ציון אל בית ה׳ אלהינו\" (ביכורים ג, ב; הנוסח לא נבדק מול נוסח נקי). 💡 מקום עיר המעמד הוא הצעה לתצוגה, וכך מספר הישנים."},
 {title:"השור והחליל",enter(){SHV.tour.go(1)},pose:()=>SHV.tour.pos([SHV.tour.sR()-40,0.4,4.4,SHV.tour.sR()-45,0,1.2]),fov:42,nofc:true,cap:"השור הולך לפניהם, וקרניו מצופות זהב ועטרת של זית בראשו, והחליל מכה לפניהם.",src:"ביכורים ג, ג",full:"📜 \"השור הולך לפניהם, וקרניו מצופות זהב ועטרה של זית בראשו, החליל מכה לפניהם עד שמגיעים קרוב לירושלים\" (ביכורים ג, ג; הנוסח לא נבדק מול נוסח נקי). 💡 גודל השור והחליל הם הצעה לתצוגה."},
 {title:"בעלי אומניות",enter(){SHV.tour.go(2)},pose:()=>SHV.tour.pos([SHV.tour.sR()-2,0,5.0,SHV.tour.sR()-32,0,1.2]),fov:46,nofc:true,cap:"כל בעלי אומניות שבירושלים עומדים לפניהם: אחינו אנשי המקום פלוני, באתם לשלום.",src:"ביכורים ג, ג",full:"📜 \"כל בעלי אומניות שבירושלים עומדים מפניהם ושואלים בשלומם: אחינו אנשי המקום פלוני, באתם לשלום\" (ביכורים ג, ג; הנוסח לא נבדק מול נוסח נקי). 💡 מספר העומדים ולבושם הם הצעה לתצוגה."},
 {title:"הסל על הכתף",enter(){SHV.tour.go(3)},pose:()=>SHV.tour.pos([SHV.tour.sG()-8,1.3,1.9,SHV.tour.sG()+3,0,1.25]),fov:40,nofc:true,cap:"הגיעו להר הבית – אפילו אגריפס המלך נוטל הסל על כתפו ונכנס.",src:"ביכורים ג, ד",full:"📜 \"הגיעו להר הבית, אפילו אגריפס המלך נוטל הסל על כתפו ונכנס\" (ביכורים ג, ד; הנוסח לא נבדק מול נוסח נקי). 💡 קצב ההרמה הוא הצעה לתצוגה."},
 {title:"הלוויים בשיר",enter(){SHV.tour.go(4)},pose:AP(378,250,11,352,250,8),fov:38,nofc:true,cap:"הגיע לעזרה, ודיברו הלוויים בשיר: ארוממך ה׳ כי דליתני.",verse:"אֲרוֹמִמְךָ ה׳ כִּי דִלִּיתָנִי וְלֹא־שִׂמַּחְתָּ אֹיְבַי לִי׃",verseRef:"תהלים ל, ב",src:"ביכורים ג, ד",full:"📜 \"הגיע לעזרה, ודברו הלוים בשיר: ארוממך ה׳ כי דליתני ולא שמחת אויבי לי\" (ביכורים ג, ד; תהלים ל, ב). 💡 מספר הלוויים ומקומם על המעלות הם הצעה לתצוגה. אין כאן קול."},
 {title:"הכוהן מניף",enter(){SHV.tour.go(5)},pose:AP(262,238,13.5,250,222,9),fov:34,nofc:true,cap:"וכוהן מניח ידו תחתיו ומניפו… ומניחו בצד המזבח.",src:"ביכורים ג, ו",full:"📜 \"והכהן מניח ידו תחתיו ומניפו, וקורא... ומניחו בצד המזבח\" (ביכורים ג, ו; הנוסח לא נבדק מול נוסח נקי). 💡 מקום הערימה בצד הצפוני של המזבח הוא הצעה לתצוגה."},
 {title:"תנופת שתי הלחם",enter(){SHV.tour.go(6)},pose:AP(290.5,245.5,12.6,285.6,250,10.4),fov:34,nofc:true,cap:"נותן שתי הלחם על גבי שני כבשים… מוליך ומביא, מעלה ומוריד. תנופה הייתה במזרח.",src:"מנחות ה, ו",full:"📜 \"נותן שתי הלחם על שני כבשים, מניח שתי ידיו מלמטן, מוליך ומביא, מעלה ומוריד\" (מנחות ה, ו). 📜 \"שתי הלחם אורכן שבעה, ורוחבן ארבעה, וקרנותיה ארבע אצבעות\" (מנחות יא, ד). ⚖️ רמב״ם, תמידין ומוספין ח, יא: \"מביא שני הכבשים, ומניף אותם כשהם חיים\". הרמב״ם מתאר תנופה בשני שלבים: הכבשים חיים, ואחר השחיטה שתי הלחם עם החזה והשוק; במשנה שתי הלחם נתונות על הכבשים. המודל מציג את נוסח המשנה. 💡 המקום «במזרח» נקבע לפי הטבלה של המשימה, ולא נבדק מול נוסח נקי."}]};
STORIES.sukkot={title:"חג הסוכות במקדש",open(){festOpen();SND.crowd(0.05)},close(){DRIFT=null;try{SUK.tour.end()}catch(e){}festClose()},steps:[
 {title:"סוכות על הגגות",enter(){SUK.tour.go(0);tourDrift(()=>SUK.tour.roofEnd(),16000)},pose:()=>SUK.tour.roofPose(),fov:46,nofc:true,cap:"ויעשו להם סוכות איש על גגו ובחצרותיהם, ובחצרות בית האלוקים.",verse:"וַיֵּצְאוּ הָעָם וַיָּבִיאוּ וַיַּעֲשׂוּ לָהֶם סֻכּוֹת אִישׁ עַל גַּגּוֹ וּבְחַצְרֹתֵיהֶם וּבְחַצְרוֹת בֵּית הָאֱלֹהִים׃",verseRef:"נחמיה ח, טז",src:"נחמיה ח, טז",full:"📜 \"ויצאו העם ויביאו ויעשו להם סכות איש על גגו ובחצרתיהם ובחצרות בית האלהים וברחוב שער המים וברחוב שער אפרים\" (נחמיה ח, טז). 💡 מקום הסוכות על הגגות, כמותן וזווית המצלמה הם הצעה לתצוגה."},
 {title:"לולב ביד",enter(){SUK.tour.go(1)},pose:()=>SUK.tour.walkPose(),fov:44,nofc:true,cap:"יוצא אדם מביתו שחרית ולולבו בידו… ויוצא לבקר חולים והוא בידו.",src:"רמב״ם, הלכות שופר וסוכה ולולב ז, כד",full:"⚖️ \"יוצא אדם מביתו שחרית ולולבו בידו, והולך לבית הכנסת ולולבו בידו... ויוצא לבקר חולים והוא בידו\" (רמב״ם, הלכות שופר וסוכה ולולב ז, כד; הנוסח לא נבדק מול נוסח נקי). 💡 המצלמה עוקבת אחרי אחד מהולכי הרחוב, והבחירה בו היא הצעה לתצוגה."},
 {title:"השילוח",enter(){SUK.tour.go(2)},pose:()=>SUK.tour.poolPose(),fov:46,nofc:true,cap:"צלוחית של זהב מחזקת שלושה לוגין היה ממלא מן השילוח.",src:"סוכה ד, ט",full:"📜 \"ניסוך המים כיצד? צלוחית של זהב מחזקת שלשה לוגין היה ממלא מן השילוח\" (סוכה ד, ט). 💡 מקום הבריכה והדרך אל שער חולדה הם הצעה לתצוגה. מילוי הצלוחית עצמו עוד לא מוצג, והוא ייבנה אחרי מחקר נפרד."},
 {title:"שער המים",enter(){SUK.tour.go(3)},pose:AP(252,412,11.5,250,352,6.5),fov:40,nofc:true,cap:"הגיעו לשער המים – תקעו והריעו ותקעו.",src:"סוכה ד, ט; מידות א, ד",full:"📜 \"הגיעו לשער המים, תקעו והריעו ותקעו\" (סוכה ד, ט). 📜 \"ושער המים, שבו מכניסין צלוחית של מים של ניסוך בחג\" (מידות א, ד; הנוסח לא נבדק מול נוסח נקי). 💡 המקום של שער המים בשער הפנימי הדרומי הוא הצעה, והתקיעה מוצגת בלי שופר."},
 {title:"ספלי הכסף",enter(){SUK.tour.go(4)},pose:AP(249,274,34,238.4,261.5,16.7),fov:34,nofc:true,cap:"שני ספלים של כסף… מערבי של מים, מזרחי של יין. ולמנסך אומרים לו: הגבה ידך.",verse:"וְהִנֵּה־מַיִם יֹצְאִים מִתַּחַת מִפְתַּן הַבַּיִת קָדִימָה׃",verseRef:"יחזקאל מז, א",src:"סוכה ד, ט",full:"📜 \"עלה בכבש ופנה לשמאלו. שני ספלים של כסף היו שם... מערבי של מים ומזרחי של יין... ולמנסך אומרים לו: הגבה ידך\" (סוכה ד, ט; הנוסח לא נבדק מול נוסח נקי). 💡 מקום הספלים ליד הכבש הוא הצעה לתצוגה."},
 {title:"ערבה והקפה",enter(){SUK.tour.go(5)},pose:AP(292,212,30,250,252,18),fov:44,nofc:true,cap:"זוקפין אותן בצדי המזבח וראשיהן כפופין על גבי המזבח… אנא ה׳ הושיעה נא.",verse:"אָנָּא ה׳ הוֹשִׁיעָה נָּא אָנָּא ה׳ הַצְלִיחָה נָּא׃",verseRef:"תהלים קיח, כה",src:"סוכה ד, ה",full:"📜 \"באין וזוקפין אותן בצדי המזבח וראשיהן כפופין על גבי המזבח... בכל יום מקיפין את המזבח פעם אחת ואומרים: אנא ה' הושיעה נא\" (סוכה ד, ה)."},
 {title:"פרחי כהונה",enter(){SUK.tour.go(6)},pose:AP(466,250,36,415,250,31),fov:60,nofc:true,cap:"ארבעה ילדים מפרחי כהונה ובידיהם כדים של שמן… מבלאי מכנסי כוהנים… היו מפקיעין.",src:"סוכה ה, ב-ג",full:"📜 \"וארבעה ילדים מפרחי כהונה, ובידיהם כדי שמן של מאה ועשרים לוג, שהן מטילין לכל ספל וספל\" (סוכה ה, ב). 📜 \"מבלאי מכנסי כהנים ומהמייניהן, מהן היו מפקיעין, ובהן היו מדליקין\" (סוכה ה, ג). ⚖️ \"המיין\" הוא האבנט. 📜 \"חסידים ואנשי מעשה היו מרקדין לפניהם באבוקות של אור שבידיהן\" (סוכה ה, ד). 💡 מספר המרקדים, הריקוד, האור וריצודו הם הצעה לתצוגה."},
 {title:"מאור בית השואבה",enter(){SUK.tour.go(7);tourDrift(AP(520,250,125,100,250,0),18000)},pose:AP(458,266,22,415,250,12),fov:50,nofc:true,cap:"לא הייתה חצר בירושלים שאינה מאירה מאור בית השואבה.",verse:"וּשְׁאַבְתֶּם־מַיִם בְּשָׂשׂוֹן מִמַּעַיְנֵי הַיְשׁוּעָה׃",verseRef:"ישעיהו יב, ג",src:"סוכה ה, ג; סוכה נא ע״ב",full:"📜 \"מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו. ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה\" (סוכה ה, א-ג). 📜 \"הקיפו עזרת הנשים גזוזטרא... שיהו נשים יושבות מלמעלה ואנשים מלמטה\" (סוכה נא ע״ב). 💡 במודל של יחזקאל אין עזרת נשים. לפי המלבי״ם החצר החיצונה היא העזרה, ולכן הגזוזטרא מקיפה את כולה, והנשים עליה: המקום והגובה הם הצעה לתצוגה."},
 {title:"הושענא רבה",enter(){SUK.tour.go(8)},pose:AP(292,212,30,250,252,18),fov:44,nofc:true,cap:"ואותו היום מקיפין את המזבח שבע פעמים… יופי לך מזבח.",src:"סוכה ד, ה",full:"📜 \"ואותו היום מקיפין את המזבח שבעה פעמים... בשעת פטירתן מה היו אומרים? יופי לך מזבח\" (סוכה ד, ה; הנוסח לא נבדק מול נוסח נקי)."}]};
STORIES.hakhel={title:"מצוות הקהל",open(){festOpen();SND.trumpets();SND.crowd(0.06)},close(){festClose()},steps:[
 {title:"מוצאי שנת השמיטה",pose:AP(520,340,60,415,303,8),cap:"מקץ שבע שנים, במועד שנת השמיטה, בחג הסוכות, מקהילים את העם: האנשים, והנשים, והטף, והגר אשר בשעריך.",verse:"הַקְהֵל אֶת־הָעָם הָאֲנָשִׁים וְהַנָּשִׁים וְהַטַּף וְגֵרְךָ אֲשֶׁר בִּשְׁעָרֶיךָ לְמַעַן יִשְׁמְעוּ וּלְמַעַן יִלְמְדוּ׃",verseRef:"דברים לא, יב",src:"דברים לא, י-יב",full:"📜 \"מקץ שבע שנים, במעד שנת השמטה, בחג הסכות... הקהל את העם, האנשים והנשים והטף וגרך אשר בשעריך, למען ישמעו ולמען ילמדו\" (דברים לא, י-יב)."},
 {title:"חצוצרות בכל העיר",pose:VP("olives"),cap:"תוקעים בחצוצרות בכל ירושלים, כדי להקהיל את העם, ומביאים בימה גדולה של עץ.",src:"רמב״ם, הלכות חגיגה ג, ד",full:"⚖️ \"ותוקעין בחצוצרות בכל ירושלים כדי להקהיל את העם, ומביאין בימה גדולה והיתה של עץ, ומעמידין אותה באמצע עזרת הנשים\" (רמב״ם, הלכות חגיגה ג, ד)."},
 {title:"בימה של עץ",pose:AP(436,284,14,415,304,7),cap:"עושים למלך בימה של עץ בעזרה, והוא יושב עליה. כל העם עומד מסביב. במודל יחזקאל, הבימה בחצר החיצונה, שאין בו עזרת נשים.",src:"סוטה ז, ח",full:"📜 \"מוצאי יום טוב הראשון של חג, בשמיני, במוצאי שביעית, עושין לו בימה של עץ בעזרה, והוא יושב עליה\" (סוטה ז, ח). 💡 במודל של יחזקאל הבימה בחצר החיצונה, כי אין בו עזרת נשים."},
 {title:"מסירת ספר התורה",pose:AP(434,284,15,415,303.4,8),cap:"חזן הכנסת נוטל ספר תורה, ונותנו לראש הכנסת, לראש הכנסת לסגן, לסגן לכהן גדול, ולכהן גדול למלך. כך מכבדים את התורה.",src:"סוטה ז, ז-ח",full:"📜 \"חזן הכנסת נוטל ספר תורה ונותנה לראש הכנסת, וראש הכנסת נותנה לסגן, והסגן נותנה לכהן גדול, וכהן גדול נותנה למלך\" (סוטה ז, ח)."},
 {title:"אגריפס המלך",pose:AP(398,286,15,415,303.4,8),cap:"המלך מקבל, וקורא בישיבה. אגריפס עמד וקרא בעמידה, ושיבחוהו חכמים. כשהגיע ל\"לא תוכל לתת עליך איש נכרי\", זלגו עיניו דמעות, ואמרו לו: אל תתירא, אחינו אתה.",src:"סוטה ז, ח",full:"📜 \"והמלך עומד ומקבל וקורא יושב. אגריפס המלך עמד וקבל וקרא עומד, ושבחוהו חכמים. וכשהגיע ל'לא תוכל לתת עליך איש נכרי' זלגו עיניו דמעות. אמרו לו: אל תתירא אגריפס, אחינו אתה, אחינו אתה\" (סוטה ז, ח)."},
 {title:"מה קוראים",pose:AP(452,330,24,415,303,6),cap:"המלך קורא מתחילת אלה הדברים עד שמע, ושמע, והיה אם שמוע, עשר תעשר, כי תכלה לעשר, פרשת המלך, והברכות והקללות.",src:"סוטה ז, ח",full:"📜 \"וקורא מתחלת 'אלה הדברים' עד 'שמע', ו'שמע', ו'והיה אם שמע', 'עשר תעשר', 'כי תכלה לעשר', ופרשת המלך, וברכות וקללות, עד שגומר כל הפרשה\" (סוטה ז, ח)."},
 {title:"למען ישמעו",pose:VP("home"),cap:"למען ישמעו, ולמען ילמדו. הרמב״ם כותב, שיראה אדם עצמו כאילו עתה נצטווה בתורה, ומפי הגבורה הוא שומעה.",src:"דברים לא, יב; רמב״ם, הלכות חגיגה ג, ו",full:"⚖️ \"ויראה עצמו כאילו עתה נצטוה בה, ומפי הגבורה שומעה\" (רמב״ם, הלכות חגיגה ג, ו)."}]};
// ---- v105: higher-quality CC0 humanoid, modest ketonet, action poses, station framing ----
const TOURFIGS=(function(){
  const g=new THREE.Group();g.name="TOURFIGS";g.visible=true;if(typeof group!=="undefined")group.add(g);
  const actors=[],mixers=[];
  let proto=null,clips={},bindQ=null,ready=false,H=1.72,fail=false;
  const SKIN=0xc4a07a, EYEL=0xf2efe8, EYEIRIS=0x3d4a3a;
  const robeCol={kohen:0xf4f0e4,gadolW:0xfbfaf3,gadolG:0x1b2a66,pilgrim:0xcbb892,pilgrim2:0xb89b6a,levite:0xe8e2cf,king:0x6e2a43};
  const SKIN_BONES={Head:1,neck_01:1,hand_l:1,hand_r:1,foot_l:1,foot_r:1,ball_l:1,ball_r:1,ball_leaf_l:1,ball_leaf_r:1};
  "index middle pinky ring thumb".split(" ").forEach(f=>{[1,2,3].forEach(n=>{SKIN_BONES[f+"_0"+n+"_l"]=1;SKIN_BONES[f+"_0"+n+"_r"]=1});SKIN_BONES[f+"_04_leaf_l"]=1;SKIN_BONES[f+"_04_leaf_r"]=1});
  function robeMat(hex,skinHex){
    const mat=new THREE.MeshStandardMaterial({roughness:0.82,metalness:0.04,vertexColors:2,color:hex||0xffffff});
    mat.skinning=true;
    if(typeof mat.defines!=="object"||!mat.defines)mat.defines={};
    mat.defines.USE_COLOR="";
    return mat;
  }
  function varyMat(kind,seed){
    const robe=new THREE.Color(robeCol[kind]||robeCol.kohen);
    robe.offsetHSL((seed-0.5)*0.012,(seed-0.5)*0.03,(seed-0.5)*0.04);
    // material.color tints both skin and linen slightly for figure-to-figure variation
    const tint=new THREE.Color(0xffffff);
    tint.offsetHSL((seed-0.5)*0.01,0,(seed-0.5)*0.03);
    const mat=robeMat(0xffffff);
    mat.color.copy(tint);
    mat.userData.robe=robe;
    return mat;
  }
  const MATS={};Object.keys(robeCol).forEach(k=>MATS[k]=robeMat(robeCol[k]));
  const MAT_SKIN=new THREE.MeshStandardMaterial({color:SKIN,roughness:0.72,metalness:0.02});
  const MAT_EYE=new THREE.MeshStandardMaterial({color:EYEL,roughness:0.25,metalness:0.05});
  function cloneRig(src){
    const srcOf=new Map(),dstOf=new Map();
    const dst=src.clone(true);
    (function par(a,b){srcOf.set(b,a);dstOf.set(a,b);for(let i=0;i<a.children.length;i++)par(a.children[i],b.children[i])})(src,dst);
    dst.traverse(node=>{
      if(!node.isSkinnedMesh)return;
      const srcMesh=srcOf.get(node);
      if(!srcMesh||!srcMesh.skeleton)return;
      const sk=srcMesh.skeleton.clone();
      sk.bones=srcMesh.skeleton.bones.map(b=>dstOf.get(b)||b);
      node.bind(sk,node.bindMatrix);
    });
    return dst;
  }
  function findBone(root,name){let f=null;root.traverse(o=>{if(!f&&o.name===name)f=o});return f}
  function paintMask(root){
    const bones=[];
    root.traverse(o=>{if(o.isBone||o.name&&SKIN_BONES[o.name])bones.push(o)});
    let skel=null;
    root.traverse(o=>{if(!skel&&o.isSkinnedMesh&&o.skeleton)skel=o.skeleton});
    const names=(skel?skel.bones:bones).map(b=>b.name);
    const headBone=(skel&&skel.bones||bones).find(b=>b.name==="Head")||null;
    root.updateMatrixWorld(true);
    root.traverse(o=>{
      if(!o.isSkinnedMesh||!o.geometry)return;
      const geo=o.geometry;
      const J=geo.attributes.skinIndex||geo.attributes.joints||geo.attributes.JOINTS_0;
      const W=geo.attributes.skinWeight||geo.attributes.weight||geo.attributes.WEIGHTS_0;
      const pos=geo.attributes.position;
      const n=pos.count;
      const col=new Float32Array(n*3);
      const isFace=/face|eye|brow/i.test(o.name||"")||(o.material&&/hair|eye|face/i.test(o.material.name||""));
      const role=new Uint8Array(n); // 0 cloth, 1 skin, 2 beard
      const headLocal=[];
      for(let i=0;i<n;i++){
        let skin=isFace?1:0, headW=0;
        if(J&&W&&!isFace){
          let best=0,bi=0;
          const itemW=W.itemSize||4, itemJ=J.itemSize||4, aW=W.array, aJ=J.array;
          for(let k=0;k<4;k++){
            const w=aW[i*itemW+k];
            if(w>best){best=w;bi=aJ[i*itemJ+k]}
          }
          const nm=names[bi]||"";
          if(SKIN_BONES[nm]||/hand|foot|ball|Head|neck/.test(nm))skin=1;
          if(nm==="Head"||nm==="neck_01")headW=best;
        }
        role[i]=skin?1:0;
        if(skin&&headW>0.45&&headBone){
          const v=new THREE.Vector3(pos.getX(i),pos.getY(i),pos.getZ(i)).applyMatrix4(o.matrixWorld);
          headBone.worldToLocal(v);
          headLocal.push([i,v.x,v.y,v.z]);
        }
      }
      // Beard: lower-front of the head in Head-local space (UE +Y along the skull).
      if(headLocal.length>20){
        let yMin=1e9,yMax=-1e9,zMin=1e9,zMax=-1e9,xAbs=0;
        headLocal.forEach(q=>{if(q[2]<yMin)yMin=q[2];if(q[2]>yMax)yMax=q[2];if(q[3]<zMin)zMin=q[3];if(q[3]>zMax)zMax=q[3];xAbs+=Math.abs(q[1])});
        const yCut=yMin+0.42*(yMax-yMin);
        // choose the forward axis as the one with the larger extent that is not +Y
        const useZ=(zMax-zMin)>=0.02;
        const zMid=(zMin+zMax)*0.5, zSign=Math.abs(zMax)>Math.abs(zMin)?1:-1;
        headLocal.forEach(q=>{
          const low=q[2]<yCut;
          const front=useZ?((zSign>0?q[3]>=zMid:q[3]<=zMid)):true;
          const notEar=Math.abs(q[1])<0.09;
          if(low&&front&&notEar)role[q[0]]=2;
        });
      }
      for(let i=0;i<n;i++){
        if(role[i]===2){col[i*3]=0.22;col[i*3+1]=0.15;col[i*3+2]=0.11}
        else if(role[i]===1){col[i*3]=0.78;col[i*3+1]=0.62;col[i*3+2]=0.48}
        else {col[i*3]=0.96;col[i*3+1]=0.94;col[i*3+2]=0.89}
      }
      geo.setAttribute("color",new THREE.BufferAttribute(col,3));
      geo.userData.skinRole=role;
    });
  }
  function applySkinGroups(root){
    root.traverse(o=>{
      if(!o.isSkinnedMesh||!o.geometry||!o.geometry.attributes.color)return;
      const nm=o.name||"";
      if(/eye/i.test(nm)&&!/brow/i.test(nm))return;
      if(/brow|hair/i.test(nm))return;
      const geo=o.geometry, col=geo.attributes.color, pos=geo.attributes.position, idx=geo.index;
      const kindOf=i=>{const r=col.getX(i);return r<0.4?2:r<0.9?1:0};
      const buckets=[[],[],[]];
      const tri=idx?idx.count:pos.count;
      for(let i=0;i<tri;i+=3){
        const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;
        const v=[0,0,0];v[kindOf(a)]++;v[kindOf(b)]++;v[kindOf(c)]++;
        let k=v[1]>=v[0]?1:0;if(v[2]>=v[k]&&v[2]>0)k=2;
        buckets[k].push(a,b,c);
      }
      const total=buckets[0].length+buckets[1].length+buckets[2].length;
      if(!total)return;
      const merged=new Uint32Array(total);
      let off=0;const starts=[];
      for(let k=0;k<3;k++){starts.push(off);if(buckets[k].length)merged.set(buckets[k],off);off+=buckets[k].length}
      const g2=geo.clone();
      g2.setIndex(new THREE.BufferAttribute(merged,1));
      g2.clearGroups();
      g2.addGroup(starts[0],buckets[0].length,0);
      g2.addGroup(starts[1],buckets[1].length,1);
      g2.addGroup(starts[2],buckets[2].length,2);
      o.geometry=g2;
      o.userData.skinGroups=true;
    });
  }
  function linenMat(hex,rough){return new THREE.MeshStandardMaterial({color:hex,roughness:rough==null?0.88:rough,metalness:0.03,side:THREE.DoubleSide})}
  function addKit(root,kind){
    const pelvis=findBone(root,"pelvis"), spine=findBone(root,"spine_02")||findBone(root,"spine_03"), spine3=findBone(root,"spine_03");
    const head=findBone(root,"Head");
    const uL=findBone(root,"upperarm_l"), uR=findBone(root,"upperarm_r");
    const lL=findBone(root,"lowerarm_l"), lR=findBone(root,"lowerarm_r");
    root.updateMatrixWorld(true);
    const robe=robeCol[kind]||robeCol.kohen;
    const cloth=linenMat(robe,0.9), ketSleeve=kind==="gadolG"?linenMat(0xf4f0e4,0.9):null;
    const Y=new THREE.Vector3(0,1,0);
    function attachWorld(bone,mesh,wpos,wquat){
      mesh.position.copy(wpos);
      if(wquat)mesh.quaternion.copy(wquat);else mesh.quaternion.identity();
      mesh.updateMatrixWorld(true);
      bone.attach(mesh);
      mesh.castShadow=false;mesh.receiveShadow=false;
    }
    function bonePos(b){const v=new THREE.Vector3();b.getWorldPosition(v);return v}
    function boneAxis(b){const q=new THREE.Quaternion();b.getWorldQuaternion(q);return Y.clone().applyQuaternion(q).normalize()}
    if(pelvis){
      const p=bonePos(pelvis);
      // long ketonet: world-vertical flared skirt down to the feet
      /* גרסה 116: הכתונת רחבה יותר ומתרחבת כלפי מטה, כדי שהרגליים לא יבלטו ממנה גם בצעד הליכה (נבדק בכמה פריימים של האנימציה); אורכה עד הקרסול כמו קודם */
      const hem=new THREE.LatheGeometry([
        new THREE.Vector2(0.32, -0.95),
        new THREE.Vector2(0.27, -0.6),
        new THREE.Vector2(0.235,-0.3),
        new THREE.Vector2(0.215,-0.1),
        new THREE.Vector2(0.195, 0.06)
      ], 24);
      const skirt=new THREE.Mesh(hem,cloth);
      skirt.name="ketonet_skirt";
      attachWorld(pelvis,skirt,p.clone());
      const sashCol=kind==="gadolG"?0xb8861e:kind==="king"?0xc9a227:0xe6dcc4;
      const sash=linenMat(sashCol,0.78);
      const band=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.025,8,22),sash);
      band.rotation.x=Math.PI/2;band.name="avnet_band";
      attachWorld(pelvis,band,p.clone().setY(p.y+0.06));
      const end=new THREE.Mesh(new THREE.BoxGeometry(0.055,0.45,0.012),sash);
      attachWorld(pelvis,end,new THREE.Vector3(p.x+0.1,p.y-0.18,p.z+0.21));
      const end2=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.38,0.012),sash);
      attachWorld(pelvis,end2,new THREE.Vector3(p.x-0.04,p.y-0.16,p.z+0.225));
    }
    // no solid torso tube — the skinned body (linen-tinted) keeps human shoulders and chest
    function sleeve(bone,len,r0,r1){
      if(!bone)return;
      const a=bonePos(bone), axis=boneAxis(bone);
      const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,len,12,1,true),kind==="gadolG"?ketSleeve:cloth);
      const q=new THREE.Quaternion().setFromUnitVectors(Y,axis);
      attachWorld(bone,mesh,a.clone().addScaledVector(axis,len*0.48),q);
    }
    sleeve(uL,0.28,0.08,0.07);sleeve(uR,0.28,0.08,0.07);
    sleeve(lL,0.26,0.065,0.05);sleeve(lR,0.26,0.065,0.05);
    if(kind==="gadolG")goldKit();
    /* 124.4 · בגדי זהב של הכהן הגדול (שמות כח; רמב״ם, הלכות כלי המקדש ט–י): ⚖️ מעיל תכלת בלי שרוולים (השרוולים הלבנים הם של הכתונת), פעמונים ורימונים בשוליו; ⚖️ אפוד וחשב מזהב ותכלת וארגמן ותולעת שני, מאחור ובחגורה; ⚖️ שתי אבני שוהם על הכתפיים; ⚖️ חושן עם שתים עשרה אבנים בארבעה טורים על הלב; ⚖️ ציץ זהב על המצח. 💡 הגדלים, צבעי האבנים ומספר הפעמונים בדגם (24 ולא 72) נבחרו כדי שייראו מרחוק */
    function goldKit(){
      const M=(c,m,r)=>new THREE.MeshStandardMaterial({color:c,metalness:m||0,roughness:r==null?0.6:r});
      const gold=M(0xd4a22e,0.65,0.3), weave=M(0xb8861e,0.5,0.42);
      const ch=spine3||spine;
      if(pelvis){
        const p=bonePos(pelvis);
        // פעמונים ורימונים בשולי המעיל (שמות כח, לג–לד)
        const bell=new THREE.SphereGeometry(0.022,8,6), pom=new THREE.SphereGeometry(0.026,8,6);
        const pomM=[M(0x2c4a9a),M(0x6b2a6e),M(0xa32a2a)];
        for(let k=0;k<24;k++){const a=k/24*Math.PI*2,r=0.325,isB=k%2===0;
          const m=new THREE.Mesh(isB?bell:pom,isB?gold:pomM[(k>>1)%3]);
          attachWorld(pelvis,m,new THREE.Vector3(p.x+Math.sin(a)*r,p.y-0.955,p.z+Math.cos(a)*r))}
        // האפוד: סינר מאחור מהמותניים ומטה (רש״י שמות כח, ו)
        const ap=new THREE.Mesh(new THREE.CylinderGeometry(0.232,0.26,0.42,16,1,true,Math.PI*0.68,Math.PI*0.64),weave);
        ap.material.side=THREE.DoubleSide;
        attachWorld(pelvis,ap,new THREE.Vector3(p.x,p.y-0.17,p.z));
      }
      if(ch){
        const c=bonePos(ch);
        const fz=frontZ(c.y,c.x);
        // החושן על הלב: מסגרת זהב ושתים עשרה אבנים בארבעה טורים (שמות כח, יז–כא). 💡 הצבעים
        const plate=new THREE.Group();
        const fr=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.2,0.014),gold);plate.add(fr);
        const ST=[0xb3202a,0x9ab33a,0x2f8f5a, 0x2fa7a0,0x2a4bc4,0xe8e4f0, 0xd0782a,0x9a9a92,0x7a3a9a, 0x2a8a8a,0x23302c,0xb05a3a];
        const sg=new THREE.BoxGeometry(0.038,0.034,0.012);
        ST.forEach((col,k)=>{const m=new THREE.Mesh(sg,M(col,0.1,0.25));m.position.set((1-k%3)*0.048,0.066-Math.floor(k/3)*0.044,0.01);plate.add(m)});
        attachWorld(ch,plate,new THREE.Vector3(c.x,c.y-0.03,fz+0.012));
        // כתפות האפוד ואבני השוהם על הכתפיים
        [uL,uR].forEach(u=>{if(!u)return;const s=bonePos(u);
          const sx=c.x+(s.x-c.x)*0.62, sy=s.y+0.05;
          const st=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),M(0x1c3a32,0.2,0.2));st.scale.set(1,0.6,1.2);
          attachWorld(ch,st,new THREE.Vector3(sx,sy,c.z));
          const strap=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.012,0.26),weave);
          attachWorld(ch,strap,new THREE.Vector3(sx,sy-0.012,c.z))});
      }
    }
    // the most forward point of the body at height y (bind pose), so the choshen sits on the chest
    function frontZ(y,x){let best=-1e9;const v=new THREE.Vector3();
      root.traverse(o=>{if(!o.isSkinnedMesh||!o.geometry)return;const P=o.geometry.attributes.position;
        for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);if(Math.abs(v.y-y)<0.05&&Math.abs(v.x-x)<0.06&&v.z>best)best=v.z}});
      return best>-1e8?best:0.13}
    if(head&&(kind==="kohen"||kind==="gadolW"||kind==="gadolG"||kind==="levite")){
      const hp=bonePos(head);
      const wrap=linenMat(kind==="gadolG"?0xf3e7c4:0xf4f0e4,0.86);
      const turban=new THREE.Group();turban.name="migbaat";
      const a=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.03,8,18),wrap);
      a.rotation.x=Math.PI/2;a.position.set(0,0.13,0.01);turban.add(a);
      const b=new THREE.Mesh(new THREE.TorusGeometry(0.078,0.026,8,18),wrap);
      b.rotation.x=Math.PI/2;b.position.set(0,0.165,0);turban.add(b);
      const c=new THREE.Mesh(new THREE.SphereGeometry(0.075,14,10,0,Math.PI*2,0,Math.PI/2),wrap);
      c.position.set(0,0.17,0);turban.add(c);
      if(kind==="gadolG"){
        const tz=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.026,0.008),new THREE.MeshStandardMaterial({color:0xe0b84a,metalness:0.6,roughness:0.3,emissive:0x3a2a08}));
        tz.position.set(0,0.145,0.095);turban.add(tz);
      }
      turban.traverse(o=>{if(o.isMesh)o.castShadow=true});
      attachWorld(head,turban,hp.clone().setY(hp.y+0.02));
    }
    // v107: skin/beard come from the existing mesh groups, no separate face/hand spheres
  }
  /* v115 · מהירות: חלקי הלבוש שעל אותה עצם ובאותו חומר מתאחדים לרשת אחת (מצנפת 3→1, אבנט 3→1). פחות קריאות ציור לכל דמות */
  function kitMerge(body){body.updateMatrixWorld(true);const U=THREE.BufferGeometryUtils;if(!U)return;const bones=[];body.traverse(o=>{if(o.isBone)bones.push(o)});
    bones.forEach(bn=>{const by=new Map(),walk=o=>{o.children.forEach(c=>{if(c.isBone)return;if(c.isMesh&&!c.isSkinnedMesh&&!Array.isArray(c.material)){(by.get(c.material)||by.set(c.material,[]).get(c.material)).push(c)}walk(c)})};walk(bn);
      const inv=new THREE.Matrix4().copy(bn.matrixWorld).invert(),rel=new THREE.Matrix4();
      by.forEach((list,mat)=>{if(list.length<2)return;const gs=list.map(o=>{const q=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone(),G=new THREE.BufferGeometry();G.setAttribute("position",q.attributes.position);G.setAttribute("normal",q.attributes.normal);if(q.attributes.uv)G.setAttribute("uv",q.attributes.uv);rel.multiplyMatrices(inv,o.matrixWorld);G.applyMatrix4(rel);return G});
        if(!gs.every(g=>!!g.attributes.uv===!!gs[0].attributes.uv))return;const mg=U.mergeBufferGeometries(gs,false);if(!mg)return;const m=new THREE.Mesh(mg,mat);m.name=list[0].name||"kit";bn.add(m);list.forEach(o=>{if(o.parent)o.parent.remove(o);o.geometry.dispose()})})})}
  function mkProp(type){
    if(type==="limb"){const g=new THREE.Group();const meat=new THREE.MeshStandardMaterial({color:0x6e3a2c,roughness:0.84,metalness:0.02});const bone=new THREE.MeshStandardMaterial({color:0xe6d7b8,roughness:0.55});const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.038,0.055,0.50,12),meat);sh.rotation.z=Math.PI/2;const jt=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),meat);jt.position.x=0.22;const bn=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.018,0.10,8),bone);bn.rotation.z=Math.PI/2;bn.position.x=0.30;g.add(sh,jt,bn);g.name="limbProp";return g}
    if(type==="bowl"){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.10,0.10,14),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:0.85,roughness:0.28}));return m}
    if(type==="willow"){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.03,1.4,6),new THREE.MeshStandardMaterial({color:0x6f8a45,roughness:0.9}));m.rotation.z=-0.4;return m}
    if(type==="sefer"){const m=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.24,0.06),new THREE.MeshStandardMaterial({color:0xc9a36a,roughness:0.7}));return m}
    if(type==="jug"){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.08,0.2,10),new THREE.MeshStandardMaterial({color:0xd4b45a,metalness:0.55,roughness:0.35}));return m}
    return null;
  }
  function captureBind(root){
    const map={};
    root.traverse(o=>{if(o.isBone||(o.name&&(o.quaternion)))map[o.name]=o.quaternion.clone()});
    return map;
  }
  function resetBind(root){
    if(!bindQ)return;
    root.traverse(o=>{if(bindQ[o.name])o.quaternion.copy(bindQ[o.name])});
  }
  // UE-style bone local axis: X typically along the bone. Arm-down from A-pose is often a Z or Y rotation.
  function qMul(bind,ax,ay,az){
    const q=bind.clone();
    const add=new THREE.Quaternion().setFromEuler(new THREE.Euler(ax,ay,az,"XYZ"));
    return q.multiply(add);
  }
  function makeClips(root){
    root.updateMatrixWorld(true);
    const Y=new THREE.Vector3(0,1,0);
    function aimLocal(bone,worldDir){
      if(!bone||!bone.parent)return new THREE.Quaternion();
      bone.parent.updateWorldMatrix(true,false);
      const inv=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
      const local=worldDir.clone().normalize().applyQuaternion(inv);
      if(local.lengthSq()<1e-8)return bone.quaternion.clone();
      return new THREE.Quaternion().setFromUnitVectors(Y,local.normalize());
    }
    function withPose(bone,quat,fn){
      const saved=bone.quaternion.clone();
      bone.quaternion.copy(quat);
      bone.updateWorldMatrix(true,false);
      const r=fn();
      bone.quaternion.copy(saved);
      bone.updateWorldMatrix(true,false);
      return r;
    }
    function tracks(name,dur,poseFn){
      const tr=[];
      const acc={};
      function set(boneName,q,t){
        if(!acc[boneName])acc[boneName]=[];
        acc[boneName].push({t,q});
      }
      poseFn(set);
      Object.keys(acc).forEach(nm=>{
        const frames=acc[nm];
        const times=[],vals=[];
        frames.forEach(f=>{times.push(f.t);vals.push(f.q.x,f.q.y,f.q.z,f.q.w)});
        tr.push(new THREE.QuaternionKeyframeTrack(nm+".quaternion",times,vals));
      });
      const c=new THREE.AnimationClip(name,dur,tr);clips[name]=c;return c;
    }
    const uR=findBone(root,"upperarm_r"),uL=findBone(root,"upperarm_l");
    const loR=findBone(root,"lowerarm_r"),loL=findBone(root,"lowerarm_l");
    const thR=findBone(root,"thigh_r"),thL=findBone(root,"thigh_l");
    const cfR=findBone(root,"calf_r"),cfL=findBone(root,"calf_l");
    const idleUR=aimLocal(uR,new THREE.Vector3(0.12,-1,0.08));
    const idleUL=aimLocal(uL,new THREE.Vector3(-0.12,-1,0.08));
    const idleLR=withPose(uR,idleUR,()=>aimLocal(loR,new THREE.Vector3(0.05,-0.85,0.20)));
    const idleLL=withPose(uL,idleUL,()=>aimLocal(loL,new THREE.Vector3(-0.05,-0.85,0.20)));
    const bq=nm=>bindQ[nm]||new THREE.Quaternion();
    function qAdd(bind,ex,ey,ez){
      return bind.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(ex,ey,ez,"XYZ")));
    }
    tracks("Idle",4,(set)=>{
      set("upperarm_r",idleUR,0);set("upperarm_r",idleUR,4);
      set("upperarm_l",idleUL,0);set("upperarm_l",idleUL,4);
      set("lowerarm_r",idleLR,0);set("lowerarm_r",idleLR,4);
      set("lowerarm_l",idleLL,0);set("lowerarm_l",idleLL,4);
      const sp0=bq("spine_01"),sp1=qAdd(bq("spine_01"),0.03,0,0);
      set("spine_01",sp0,0);set("spine_01",sp1,2);set("spine_01",sp0,4);
    });
    tracks("Walk",1,(set)=>{
      const keys=[0,0.25,0.5,0.75,1];
      keys.forEach(t=>{
        const sw=Math.sin(t*Math.PI*2)*0.2, sw2=Math.sin(t*Math.PI*2+Math.PI)*0.2;/* גרסה 116: צעד קצר — בכתונת עד הקרסול הרגל לא יוצאת מהבגד (נמדד: 0 קודקודי רגל מחוץ לבגד ב־8 שלבי צעד) */
        set("thigh_r",qAdd(bq("thigh_r"),sw,0,0),t);
        set("thigh_l",qAdd(bq("thigh_l"),sw2,0,0),t);
        set("calf_r",qAdd(bq("calf_r"),Math.max(0,-Math.sin(t*Math.PI*2))*0.22,0,0),t);
        set("calf_l",qAdd(bq("calf_l"),Math.max(0,-Math.sin(t*Math.PI*2+Math.PI))*0.22,0,0),t);
        set("upperarm_r",aimLocal(uR,new THREE.Vector3(0.12,-1,0.08-Math.sin(t*Math.PI*2)*0.25)),t);
        set("upperarm_l",aimLocal(uL,new THREE.Vector3(-0.12,-1,0.08+Math.sin(t*Math.PI*2)*0.25)),t);
      });
      set("lowerarm_r",idleLR,0);set("lowerarm_r",idleLR,1);
      set("lowerarm_l",idleLL,0);set("lowerarm_l",idleLL,1);
    });
    // Reach: bent elbows, both hands at lamp/head height in front of the body. Never a straight raised arm.
    const reachUR=aimLocal(uR,new THREE.Vector3(0.22,-0.30,0.86));
    const reachUL=aimLocal(uL,new THREE.Vector3(-0.22,-0.30,0.86));
    const reachLR=withPose(uR,reachUR,()=>aimLocal(loR,new THREE.Vector3(0.08,0.48,0.86)));
    const reachLL=withPose(uL,reachUL,()=>aimLocal(loL,new THREE.Vector3(-0.08,0.48,0.86)));
    tracks("Reach",2,(set)=>{
      set("upperarm_r",reachUR,0);set("upperarm_r",reachUR,2);
      set("upperarm_l",reachUL,0);set("upperarm_l",reachUL,2);
      set("lowerarm_r",reachLR,0);set("lowerarm_r",reachLR,2);
      set("lowerarm_l",reachLL,0);set("lowerarm_l",reachLL,2);
    });
    const wkUR=aimLocal(uR,new THREE.Vector3(0.28,-0.42,0.82));
    const wkUL=aimLocal(uL,new THREE.Vector3(-0.28,-0.42,0.82));
    const wkLR=withPose(uR,wkUR,()=>aimLocal(loR,new THREE.Vector3(0.10,0.22,0.95)));
    const wkLL=withPose(uL,wkUL,()=>aimLocal(loL,new THREE.Vector3(-0.10,0.22,0.95)));
    tracks("Working",2,(set)=>{
      set("upperarm_r",wkUR,0);set("upperarm_r",wkUR,2);
      set("upperarm_l",wkUL,0);set("upperarm_l",wkUL,2);
      set("lowerarm_r",wkLR,0);set("lowerarm_r",wkLR,2);
      set("lowerarm_l",wkLL,0);set("lowerarm_l",wkLL,2);
    });
    // Carry/WalkCarry: vessel held at mid-torso, elbows clearly bent. Never a straight arm forward.
    const carUR=aimLocal(uR,new THREE.Vector3(0.30,-0.52,0.78));
    const carUL=aimLocal(uL,new THREE.Vector3(-0.30,-0.52,0.78));
    const carLR=withPose(uR,carUR,()=>aimLocal(loR,new THREE.Vector3(0.14,0.62,0.70)));
    const carLL=withPose(uL,carUL,()=>aimLocal(loL,new THREE.Vector3(-0.14,0.62,0.70)));
    tracks("Carry",1,(set)=>{
      set("upperarm_r",carUR,0);set("upperarm_r",carUR,1);
      set("upperarm_l",carUL,0);set("upperarm_l",carUL,1);
      set("lowerarm_r",carLR,0);set("lowerarm_r",carLR,1);
      set("lowerarm_l",carLL,0);set("lowerarm_l",carLL,1);
    });
    tracks("WalkCarry",1,(set)=>{
      const keys=[0,0.25,0.5,0.75,1];
      keys.forEach(t=>{
        const sw=Math.sin(t*Math.PI*2)*0.2, sw2=Math.sin(t*Math.PI*2+Math.PI)*0.2;
        set("thigh_r",qAdd(bq("thigh_r"),sw,0,0),t);
        set("thigh_l",qAdd(bq("thigh_l"),sw2,0,0),t);
        set("calf_r",qAdd(bq("calf_r"),Math.max(0,-Math.sin(t*Math.PI*2))*0.22,0,0),t);
        set("calf_l",qAdd(bq("calf_l"),Math.max(0,-Math.sin(t*Math.PI*2+Math.PI))*0.22,0,0),t);
      });
      set("upperarm_r",carUR,0);set("upperarm_r",carUR,1);
      set("upperarm_l",carUL,0);set("upperarm_l",carUL,1);
      set("lowerarm_r",carLR,0);set("lowerarm_r",carLR,1);
      set("lowerarm_l",carLL,0);set("lowerarm_l",carLL,1);
    });
    // Tamid 7:2 / Sotah 7:6 — במקדש נושאים ידיהם על גבי ראשיהן.
    // Arms extended forward, hands slightly above the head, elbows only slightly bent, symmetric.
    // Palms toward the people (forward/down). Fingers split in the priestly shin (index+middle / ring+pinky, thumb out).
    // Not a straight vertical salute and not a side Y-pose.
    const huUR=aimLocal(uR,new THREE.Vector3(0.50,0.40,0.77));
    const huUL=aimLocal(uL,new THREE.Vector3(-0.50,0.40,0.77));
    const huLR=withPose(uR,huUR,()=>aimLocal(loR,new THREE.Vector3(0.18,0.96,0.20)));
    const huLL=withPose(uL,huUL,()=>aimLocal(loL,new THREE.Vector3(-0.18,0.96,0.20)));
    const huHR=qAdd(bq("hand_r"),-0.35,0.20,0.70);
    const huHL=qAdd(bq("hand_l"),-0.35,-0.20,-0.70);
    const huFin={};
    // modest abduction at the first joints to open a shin-like gap; keep the fingers extended (open palm)
    [["index",-0.22,-0.16],["middle",-0.14,-0.08],["ring",0.14,0.08],["pinky",0.24,0.16]].forEach(([f,yr,yl])=>{
      huFin[f+"_01_r"]=qAdd(bq(f+"_01_r"),-0.06,yr,0.06);
      huFin[f+"_01_l"]=qAdd(bq(f+"_01_l"),-0.06,yl,-0.06);
      huFin[f+"_02_r"]=qAdd(bq(f+"_02_r"),-0.03,0,0);
      huFin[f+"_02_l"]=qAdd(bq(f+"_02_l"),-0.03,0,0);
    });
    huFin.thumb_01_r=qAdd(bq("thumb_01_r"),0.20,0.55,0.30);
    huFin.thumb_01_l=qAdd(bq("thumb_01_l"),0.20,-0.55,-0.30);
    tracks("HandsUp",2,(set)=>{
      set("upperarm_r",huUR,0);set("upperarm_r",huUR,2);
      set("upperarm_l",huUL,0);set("upperarm_l",huUL,2);
      set("lowerarm_r",huLR,0);set("lowerarm_r",huLR,2);
      set("lowerarm_l",huLL,0);set("lowerarm_l",huLL,2);
      set("hand_r",huHR,0);set("hand_r",huHR,2);
      set("hand_l",huHL,0);set("hand_l",huHL,2);
      Object.keys(huFin).forEach(nm=>{set(nm,huFin[nm],0);set(nm,huFin[nm],2)});
    });
    const bowSP=qAdd(bq("spine_01"),0.45,0,0);
    tracks("Bow",2,(set)=>{
      set("spine_01",bowSP,0);set("spine_01",bowSP,2);
      set("upperarm_r",idleUR,0);set("upperarm_r",idleUR,2);
      set("upperarm_l",idleUL,0);set("upperarm_l",idleUL,2);
      set("lowerarm_r",idleLR,0);set("lowerarm_r",idleLR,2);
      set("lowerarm_l",idleLL,0);set("lowerarm_l",idleLL,2);
    });
    clips.Idle=clips.Idle;clips.Walk=clips.Walk;clips.Working=clips.Working;
  }
  function clipOf(name){
    if(!name)return clips.Idle;
    return clips[name]||clips[name.replace(/\s/g,"")]||clips.Idle;
  }
  function play(mixer,name,speed){
    mixer.stopAllAction();
    const c=clipOf(name);
    if(!c)return null;
    const a=mixer.clipAction(c);a.reset();a.setLoop(THREE.LoopRepeat,Infinity);a.timeScale=speed||1;a.play();return a;
  }
  function load(){
    if(typeof THREE==="undefined"||!THREE.GLTFLoader){fail=true;return}
    const ldr=new THREE.GLTFLoader();
    ldr.load("chars/kohen.glb",gltf=>{
      proto=gltf.scene;
      proto.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(proto);
      const size=box.getSize(new THREE.Vector3());
      const s=H/Math.max(0.05,size.y);
      proto.scale.setScalar(s);
      proto.position.y=-box.min.y*s;
      proto.updateMatrixWorld(true);
      const box2=new THREE.Box3().setFromObject(proto);
      proto.position.y-=box2.min.y;
      proto.updateMatrixWorld(true);
      paintMask(proto);
      applySkinGroups(proto);
      bindQ=captureBind(proto);
      makeClips(proto);
      ready=true;attach();
      window.__TOURFIGS_READY=true;try{ambient()}catch(e){console.warn("amb",e)}
      if(STORY&&STORY_API&&STORY_API.S&&STORY_API.S.def)try{api.onStep(STORY_API.S.def,STORY_API.S.i,STORY_API.S.def.steps[STORY_API.S.i])}catch(e){}
    },undefined,err=>{fail=true;console.warn("TOURFIGS load",err&&err.message||err)});
  }
  function attach(){if(typeof group!=="undefined"&&group){if(g.parent&&g.parent!==group)g.parent.remove(g);if(g.parent!==group)group.add(g)}else if(!g.parent&&typeof scene!=="undefined")scene.add(g)}
  function worldOf(u,v,y){const p=[COMP.X0+u*A,-(COMP.N0-v*A)];return new THREE.Vector3(p[0],y*A,p[1])}
  function yawTowards(from,to){return Math.atan2(to.x-from.x,to.z-from.z)}
  function clear(all){
    const keep=all?[]:actors.filter(o=>o.amb),rm=actors.filter(o=>all||!o.amb);
    rm.forEach(o=>{try{o.mixer.stopAllAction();o.mixer.uncacheRoot(o.mixer.getRoot())}catch(e){}});
    mixers.length=0;keep.forEach(o=>mixers.push(o.mixer));
    const keepG=new Set(),keepM=new Set([MAT_EYE,MAT_SKIN]);Object.values(MATS).forEach(m=>keepM.add(m));
    if(proto)proto.traverse(o=>{if(o.geometry)keepG.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m&&keepM.add(m))});
    rm.forEach(o=>{if(o.root.parent)o.root.parent.remove(o.root);
      try{o.root.traverse(q=>{if(q.geometry&&!keepG.has(q.geometry))q.geometry.dispose();if(q.material)(Array.isArray(q.material)?q.material:[q.material]).forEach(m=>{if(m&&!keepM.has(m))m.dispose()})})}catch(e){}});
    actors.length=0;keep.forEach(o=>actors.push(o));
    g.children.slice().forEach(c=>{if(!keep.some(o=>o.root===c))g.remove(c)});
    if(!all)stylized(true);
  }
  /* v114: דמויות קבע בעזרה (כוהנים עולים בכבש, מקיפים ויורדים) */
  let ambN=0,ambSt=false;
  function ambient(){
    const old=actors.filter(o=>o.amb);
    if(old.length){old.forEach(o=>{o.amb=false;o._kill=true});const keepT=actors.filter(o=>!o._kill);const sv=keepT.map(o=>{o.amb=true;return o});clear();sv.forEach(o=>{o.amb=false})}
    ambN=0;
    if(!ready||!proto)return;attach();
    if(typeof SHOW_PEOPLE!=="undefined"&&!SHOW_PEOPLE)return;const LOWA=QL==="low"; /* גרסה 115: גם באיכות חסכונית המזבח לא ריק: כוהן אחד עולה ואחד עובד */
    let cu,cv,top,y0,v0,v1,hf;
    {cu=250;cv=251;top=16.5;y0=7.5;v0=264.25;v1=296.1;hf=11}
    /* 📜 זבחים ו, ג: "כל העולים למזבח עולין דרך ימין ומקיפין ויורדין דרך שמאל". 💡 מספר הכוהנים וקצב ההליכה */
    const e=cu+3.5,w=cu-3.5,loop=[[e,v1+7,y0],[e,v1,y0],[e,v0,top],[cu+hf,cv+hf,top],[cu+hf,cv-hf,top],[cu-hf,cv-hf,top],[cu-hf,cv+hf,top],[w,v0,top],[w,v1,y0],[w,v1+7,y0],[e,v1+7,y0]];
    let len=0;for(let i=1;i<loop.length;i++)len+=Math.hypot(loop[i][0]-loop[i-1][0],loop[i][1]-loop[i-1][1],loop[i][2]-loop[i-1][2]);
    const per=len*A/0.75,n=LOWA?1:SMALL?2:4;
    for(let i=0;i<n;i++){const o=spawn({kind:"kohen",clip:"Walk",path:loop,period:per,u:loop[0][0],v:loop[0][1],y:y0});if(o){o.amb=true;o.t=per*(i+0.37*(i%2))/n;place(o);ambN++}}
    (([[256.5,255,256.5,250],[255.6,245,256.5,250]])).slice(0,(SMALL||LOWA)?1:2).forEach(q=>{const o=spawn({kind:"kohen",clip:"Working",u:q[0],v:q[1],y:top,fu:q[2],fv:q[3]});if(o){o.amb=true;ambN++}});
  }
  function stylized(on){
    try{
      if(ACTS&&ACTS.tm){["fig","head","hat"].forEach(k=>{if(ACTS.tm[k])ACTS.tm[k].visible=on})}
      if(ACTS&&ACTS.yk)["hp","head","mit","tz","ephod"].forEach(k=>{if(ACTS.yk[k])ACTS.yk[k].visible=on})
    }catch(e){}
  }
  /* v112 */const noSh=o=>{try{Object.defineProperty(o,"castShadow",{get:()=>false,set:()=>{},configurable:true});o.receiveShadow=false}catch(e){}};
  function spawn(spec){
    if(!ready||!proto){api&&(api.lastErr="not ready");return null}
    try{
    const kind=spec.kind||"kohen";
    const root=new THREE.Group();
    const body=cloneRig(proto);
    body.traverse(o=>{
      if(o.isMesh){
        noSh(o); /* v112: בלי צללים לדמויות — מפת הצללים סטטית, וצל של דמות זזה קפץ/הבהב */
        if(o.isSkinnedMesh){
          const nm=(o.name||"")+(o.material&&o.material.name||"");
          if(/eye/i.test(nm)&&!/brow/i.test(nm)){o.material=MAT_EYE;o.material.skinning=true}
          else if(/brow|hair/i.test(nm)){const h=new THREE.MeshStandardMaterial({color:0x2a221c,roughness:0.8,metalness:0.02});h.skinning=true;o.material=h}
          else if(o.userData.skinGroups||(o.geometry&&o.geometry.groups&&o.geometry.groups.length>=2)){
            const seed=Math.random();
            const cloth=varyMat(kind,seed);cloth.skinning=true;cloth.vertexColors=0;/* 124.4: גוף הבגד בצבע הבגד עצמו (עד עכשיו היה תמיד לבן, ולכן בגדי הזהב נראו לבנים) */cloth.color.multiply(cloth.userData.robe);
            const skin=MAT_SKIN.clone();skin.skinning=true;skin.vertexColors=0;skin.color.offsetHSL((seed-0.5)*0.03,0,(seed-0.5)*0.04);
            const beard=new THREE.MeshStandardMaterial({color:0x3a2a20,roughness:0.86,metalness:0.02});beard.skinning=true;
            o.material=[cloth,skin,beard];
          }
          else {const m=varyMat(kind,Math.random());m.skinning=true;o.material=m}
        }
      }
    });
    addKit(body,kind);try{kitMerge(body)}catch(e){}
    root.add(body);
    const mixer=new THREE.AnimationMixer(body);
    let clipName=spec.clip||"Idle";
    if(clipName==="Walk"&&spec.prop)clipName="WalkCarry";
    if(clipName==="Working"&&spec.prop)clipName="Carry";
    const act=play(mixer,clipName,spec.speed||1);
    const o={root,body,mixer,spec,t:Math.random()*10};root.userData.fig=o;
    place(o);
    /* v114: קצב הצעדים לפי מהירות ההליכה בפועל (מחזור הליכה מלא = כ-1.78 מ׳), ופאזה אקראית כדי שלא יזוזו כולם יחד */
    if(act){if(spec.path&&spec._len&&!spec.speed&&/Walk/.test(clipName))act.timeScale=Math.max(0.3,Math.min(1.3,(spec._len*A/(spec.period||8))/1.78));try{act.time=Math.random()*act.getClip().duration}catch(e){}}
    try{mixer.update(0.02)}catch(e){}
    body.updateMatrixWorld(true);
    const prop=spec.prop?mkProp(spec.prop):null;
    if(prop){
      const hand=findBone(body,"hand_r")||findBone(body,"hand_l");
      const handL=findBone(body,"hand_l");
      if(hand){
        if(spec.prop==="limb"&&handL){
          const pR=new THREE.Vector3(),pL=new THREE.Vector3();
          hand.getWorldPosition(pR);handL.getWorldPosition(pL);
          const mid=pR.clone().add(pL).multiplyScalar(0.5).add(new THREE.Vector3(0,0.02,0));
          const dir=pL.clone().sub(pR);if(dir.lengthSq()<1e-4)dir.set(0,0,1);
          prop.position.copy(mid);
          prop.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),dir.normalize());
          hand.attach(prop);
        }else{
          const hp=new THREE.Vector3();hand.getWorldPosition(hp);
          prop.position.copy(hp).add(new THREE.Vector3(0,0.03,0));prop.quaternion.identity();
          hand.attach(prop);
        }
      }else root.add(prop);
    }
    root.traverse(q=>{if(q.isMesh)noSh(q)});
    g.add(root);actors.push(o);mixers.push(mixer);
    return o;
    }catch(e){api.lastErr=(e&&e.message)||String(e);console.warn("TOURFIGS spawn",e);return null}
  }
  function setFade(o,f){
    f=Math.max(0,Math.min(1,f));if(o.fade===f||(o.fade===undefined&&f===1))return;o.fade=f;
    if(!o.fmats){o.fmats=[];o.root.traverse(q=>{if(!q.isMesh||!q.material)return;const cl=m=>{const c=m.clone();if(m.skinning)c.skinning=true;if(m.onBeforeCompile)c.onBeforeCompile=m.onBeforeCompile;if(m.customProgramCacheKey)c.customProgramCacheKey=m.customProgramCacheKey;c.userData=m.userData;o.fmats.push(c);return c};q.material=Array.isArray(q.material)?q.material.map(cl):cl(q.material)})}
    o.fmats.forEach(m=>{m.transparent=f<1;m.opacity=f});o.root.visible=f>0.01;
  }
  function place(o,dt){
    const s=o.spec;let u=s.u,v=s.v,y=s.y,fu=s.fu,fv=s.fv,fade=1;
    if(s.path&&s.path.length>=2){
      const L=s.path,per=s.period||8,n=L.length-1;
      if(!s._cl){let acc=0;const cl=[0];for(let i=0;i<n;i++){acc+=Math.hypot(L[i+1][0]-L[i][0],L[i+1][1]-L[i][1],L[i+1][2]-L[i][2]);cl.push(acc)}s._cl=cl;s._len=acc;s._loop=Math.hypot(L[n][0]-L[0][0],L[n][1]-L[0][1])<0.5}
      o.t=(o.t||0)%per;const k=o.t/per;
      if(!s._loop){const e=Math.min(0.08,0.4/per);fade=Math.min(1,k/e,(1-k)/e);if(o._k!==undefined&&k<o._k)o.yaw=null;o._k=k} /* v114: בלי קפיצה בסוף המסלול — הדמות נמוגה ומופיעה */
      const dist=k*s._len;let i=0;while(i<n-1&&s._cl[i+1]<dist)i++;
      const seg=(s._cl[i+1]-s._cl[i])||1,t=Math.max(0,Math.min(1,(dist-s._cl[i])/seg)),a=L[i],b=L[i+1];
      u=a[0]+(b[0]-a[0])*t;v=a[1]+(b[1]-a[1])*t;y=a[2]+(b[2]-a[2])*t;
      fu=b[0];fv=b[1];
    }
    const p=worldOf(u,v,y);
    o.root.position.copy(p);
    if(fu!=null&&fv!=null){const t=worldOf(fu,fv,y),ty=yawTowards(p,t);
      if(s.path&&o.yaw!=null&&dt){let d=ty-o.yaw;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;o.yaw+=d*Math.min(1,dt*4)}else o.yaw=ty;
      o.root.rotation.y=o.yaw}
    else if(s.yaw!=null)o.root.rotation.y=s.yaw;
    if(s.path)setFade(o,fade);
  }
  function ring(n,cu,cv,y,r,kind,clip,fu,fv){
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2;
      spawn({kind,clip,u:cu+Math.cos(a)*r,v:cv+Math.sin(a)*r,y,fu:fu!=null?fu:cu,fv:fv!=null?fv:cv});
    }
  }
  function line(n,u0,v0,u1,v1,y,kind,clip,fu,fv,prop){
    for(let i=0;i<n;i++){
      const t=n>1?i/(n-1):0;
      spawn({kind,clip,prop,u:u0+(u1-u0)*t,v:v0+(v1-v0)*t,y,fu,fv});
    }
  }
  function findNamed(n){
    let hit=null;
    if(typeof group==="undefined"||!group)return null;
    group.traverse(o=>{if(!hit&&o.userData&&o.userData.n===n)hit=o});
    return hit;
  }
  function subjectsOf(st){
    if(st&&st.subjects&&st.subjects.length)return st.subjects;
    const t=(st&&(st.title||"")+" "+(st.cap||""))||"";
    const out=[];
    if(/מנור/.test(t))out.push("המנורה");
    if(/מזבח הזהב|המזבח הפנימי|דישון המזבח הפנימי/.test(t))out.push("מזבח הזהב");
    if(/כבש|איברים לכבש/.test(t))out.push("כבש");
    if(/בימה/.test(t))out.push("בימה");
    if(/כיור/.test(t))out.push("כיור");
    return out;
  }
  function refit(){
    try{
      const S=STORY_API&&STORY_API.S;if(!S||!S.def)return null;
      const st=S.def.steps[S.i]||{};
      const cam=(typeof camera!=="undefined"&&camera)||(window.__GA&&window.__GA.getCam&&window.__GA.getCam());
      const ctl=(typeof controls!=="undefined"&&controls)||(window.__GA&&window.__GA.getControls&&window.__GA.getControls());
      if(!cam)return null;
      const box=new THREE.Box3();
      let any=false;
      if(g.children.length){box.setFromObject(g);any=true}
      subjectsOf(st).forEach(n=>{
        const o=findNamed(n);if(!o)return;
        const b=new THREE.Box3().setFromObject(o);
        if(isFinite(b.min.x)){if(!any){box.copy(b);any=true}else box.union(b)}
      });
      if(!any||!isFinite(box.min.x))return null;
      const c=box.getCenter(new THREE.Vector3());
      const size=box.getSize(new THREE.Vector3());
      const pad=1.28;
      const aspect=(cam.aspect||(1280/720));
      const fov=cam.fov*Math.PI/180;
      const fitH=size.y*pad,fitW=Math.max(size.x,size.z)*pad;
      let dist=Math.max(fitH/2/Math.tan(fov/2), (fitW/2)/(Math.tan(fov/2)*aspect));
      dist=Math.max(3.2,Math.min(28,dist));
      const dir=cam.position.clone().sub(ctl&&ctl.target?ctl.target:c);
      if(dir.length()<0.2)dir.set(1,0.4,1);
      dir.normalize();
      if(dir.y<0.08)dir.y=0.08;if(dir.y>0.55)dir.y=0.45;dir.normalize();
      cam.position.copy(c).addScaledVector(dir,dist);
      if(ctl){ctl.target.copy(c);ctl.update()}
      cam.lookAt(c);cam.updateMatrixWorld(true);cam.updateProjectionMatrix();
      // enlarge distance if anything is clipped
      const pts=[];
      const corners=[0,1].flatMap(i=>[0,1].flatMap(j=>[0,1].map(k=>new THREE.Vector3(
        i?box.max.x:box.min.x,j?box.max.y:box.min.y,k?box.max.z:box.min.z))));
      const tmp=new THREE.Vector3();
      function clipped(){
        const m=0.08;
        for(const p of corners){
          tmp.copy(p).project(cam);
          if(tmp.x<-1+m||tmp.x>1-m||tmp.y<-1+m||tmp.y>1-m||tmp.z>1||tmp.z<0)return true;
        }
        return false;
      }
      let guard=0;
      while(clipped()&&guard++<8){
        dist*=1.18;
        cam.position.copy(c).addScaledVector(dir,dist);
        if(ctl){ctl.target.copy(c);ctl.update()}
        cam.lookAt(c);cam.updateMatrixWorld(true);
      }
      const figBox=g.children.length?new THREE.Box3().setFromObject(g):null;
      let figFrac=null;
      if(figBox&&isFinite(figBox.min.y)){
        const a=figBox.min.clone().project(cam),b=figBox.max.clone().project(cam);
        figFrac=Math.min(1,Math.abs(a.y-b.y)/2);
      }
      api.lastFrame={dist,figFrac,subjects:subjectsOf(st),clipped:clipped()};
      return api.lastFrame;
    }catch(e){api.lastErr=(e&&e.message)||String(e);return null}
  }
  function frameCheck(){
    const cam=(typeof camera!=="undefined"&&camera)||(window.__GA&&window.__GA.getCam&&window.__GA.getCam());
    if(!cam)return {ok:false,reason:"no cam"};
    const W=innerWidth,Hgt=innerHeight,margin=28;
    const info={ok:true,figures:[],subjects:[],cut:[]};
    function projectBox(obj,label){
      const box=new THREE.Box3().setFromObject(obj);
      if(!isFinite(box.min.x))return null;
      const pts=[0,1].flatMap(i=>[0,1].flatMap(j=>[0,1].map(k=>new THREE.Vector3(i?box.max.x:box.min.x,j?box.max.y:box.min.y,k?box.max.z:box.min.z))));
      let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9,behind=false;
      pts.forEach(p=>{p.project(cam);if(p.z>1||p.z<0)behind=true;const x=(p.x*0.5+0.5)*W,y=(1-(p.y*0.5+0.5))*Hgt;minx=Math.min(minx,x);miny=Math.min(miny,y);maxx=Math.max(maxx,x);maxy=Math.max(maxy,y)});
      const cut=behind||minx<margin||miny<margin||maxx>W-margin||maxy>Hgt-margin;
      const h=Math.max(0,maxy-miny);
      return {label,minx,miny,maxx,maxy,h,frac:h/Hgt,cut,behind};
    }
    actors.forEach((o,i)=>{
      const r=projectBox(o.root,"fig"+i);
      if(r){info.figures.push(r);if(r.cut){info.ok=false;info.cut.push(r.label)}}
    });
    const S=STORY_API&&STORY_API.S,st=S&&S.def&&S.def.steps[S.i];
    subjectsOf(st||{}).forEach(n=>{
      const o=findNamed(n);if(!o){info.subjects.push({label:n,missing:true});return}
      const r=projectBox(o,n);
      if(r){info.subjects.push(r);if(r.cut){info.ok=false;info.cut.push(n)}}
    });
    if(info.figures.length===1||info.figures.length===2){
      const fr=Math.max(...info.figures.map(f=>f.frac));
      info.figFrac=fr;
      // single/pair should occupy a readable portion of the frame, not a speck and not a crop
      if(fr<0.18||fr>0.85)info.warn="figFrac "+fr.toFixed(2);
    }
    api.lastCheck=info;return info;
  }

  const ramp=v=>7.5+(296-v)*0.3;
  function onStep(def,idx,st){
    clear();
    if(!def||!ready)return;
    const key=Object.keys(STORIES).find(k=>STORIES[k]===def);
    if(!key)return;
    // hide stylized near-field doubles when we place full models
    const use=specList(key,idx);
    if(!use||!use.length){stylized(true);return}
    stylized(false);
    use.forEach(s=>{
      if(s.ring)ring(s.n,s.u,s.v,s.y,s.r,s.kind,s.clip,s.fu,s.fv);
      else if(s.line)line(s.n,s.u0,s.v0,s.u1,s.v1,s.y,s.kind,s.clip,s.fu,s.fv,s.prop);
      else spawn(s);
    });
  }
  function specList(key,i){
    // returns a list of spawn specs for (tour, station index). Empty = no full figures (keep far crowd / stylized).
    const K="kohen",G="gadolW",GG="gadolG",P="pilgrim",P2="pilgrim2",L="levite",KG="king";
    if(key==="yk"){
      return [
        /* 117: תחנות 1 ו־2 בפתח לשכת פרהדרין (יומא א, א; רש״י יומא יט ע״א: "שהוא ישן שם"). 💡 מקום העמידה ומספר הזקנים ופרחי הכהונה */[{kind:GG,u:276.5,v:157.2,y:3.5,fu:276.5,fv:150,clip:"Idle"},{kind:K,u:274.3,v:153.2,y:3.5,fu:276.5,fv:157.2,clip:"Idle"},{kind:K,u:278.7,v:153.2,y:3.5,fu:276.5,fv:157.2,clip:"Idle"}],
        [{kind:GG,u:276.5,v:157.2,y:3.5,fu:275,fv:150,clip:"Idle"},{kind:K,u:274.6,v:154.6,y:3.5,fu:276.5,fv:157.2,clip:"Idle"},{kind:K,u:278.4,v:154.8,y:3.5,fu:276.5,fv:157.2,clip:"Idle"}],
        [{kind:GG,u:200,v:214,y:7.5,fu:205,fv:214,clip:"Idle"}],
        [{kind:GG,u:250,v:262,y:16.5,fu:250,fv:256,clip:"Working"}],
        // Yoma 3:8 — bull head south, face west; kohen stands to the east
        [{kind:G,u:220,v:248,y:7.5,fu:214,fv:248,clip:"Idle"},{kind:K,u:222,v:252,y:7.5,fu:214,fv:248,clip:"Idle"}],
        [{kind:G,u:278,v:232,y:7.5,fu:272,fv:232,clip:"Working"},{kind:K,u:280,v:236,y:7.5,fu:276,fv:232,clip:"Idle"}],
        [{kind:G,u:220,v:248,y:7.5,fu:214,fv:248,clip:"Working"},{kind:K,u:218,v:252,y:7.5,fu:220,fv:248,clip:"Idle"}],
        [{kind:G,u:127,v:250,y:13.56,fu:123,fv:250,clip:"Idle"}], // לבדו
        [{kind:G,u:127,v:250,y:13.56,fu:129,fv:252,clip:"Working"}],
        [{kind:G,u:152,v:252,y:13.56,fu:152,fv:250,clip:"Working"}],
        [{kind:G,u:276,v:232,y:7.5,fu:272,fv:236,clip:"Idle"},{kind:K,u:282,v:234,y:7.5,fu:276,fv:232,clip:"Idle"}],
        [{kind:GG,u:226,v:264,y:9.6,fu:222,fv:270,clip:"Idle"},{kind:P,u:230,v:268,y:7.5,fu:226,fv:264,clip:"Idle"},{kind:P2,u:220,v:268,y:7.5,fu:226,fv:264,clip:"Idle"}]
      ][i]||[];
    }
    if(key==="tamid"){
      const gz=310,gv=295.2,gy=7.56;
      return [
        {line:1,n:8,u0:222,v0:186,u1:238,v1:186,y:3.5,kind:K,clip:"Idle",fu:230,fv:175},
        [{kind:K,u:gz,v:gv,y:gy,fu:gz+1,fv:gv,clip:"Idle"},{ring:1,n:8,u:gz,v:gv,y:gy,r:2.8,kind:K,clip:"Idle",fu:gz,fv:gv}],
        [{kind:K,u:250,v:258,y:16.5,fu:250,fv:250,clip:"Working"},{kind:K,u:222.3,v:265.2,y:7.5,fu:222,fv:263,clip:"Idle"},{line:1,n:5,u0:226,v0:270,u1:240,v1:270,y:7.5,kind:K,clip:"Idle",fu:250,fv:250}],
        [{line:1,n:4,u0:244,v0:247,u1:256,v1:253,y:16.5,kind:K,clip:"Working",fu:250,fv:250},{line:1,n:4,u0:226,v0:272,u1:244,v1:272,y:7.5,kind:K,clip:"Idle",fu:250,fv:262}],
        [{kind:K,u:gz,v:gv,y:gy,fu:gz+1,fv:gv,clip:"Idle"},{ring:1,n:8,u:gz,v:gv,y:gy,r:2.8,kind:K,clip:"Idle",fu:gz,fv:gv}],
        [{kind:K,u:250,v:166,y:27.6,fu:300,fv:140,clip:"Idle"},{kind:K,u:250.6,v:201,y:7.5,fu:250,fv:203,clip:"Idle"},{kind:K,u:249.4,v:201,y:7.5,fu:250,fv:203,clip:"Idle"}],
        [{kind:K,u:244.6,v:214.6,y:7.5,fu:244,fv:216,clip:"Working"},{kind:K,u:245.6,v:217.6,y:7.5,fu:244,fv:216,clip:"Idle"},{line:1,n:5,u0:234,v0:224,u1:260,v1:224,y:7.5,kind:K,clip:"Idle",fu:244,fv:216}],
        [{kind:K,u:155.2,v:250,y:13.56,fu:153,fv:250,clip:"Carry",prop:"bowl"},{kind:K,u:150.95,v:257.5,y:13.81,fu:150,fv:257.5,clip:"Reach",prop:"bowl"}],
        [{path:1,kind:K,clip:"WalkCarry",prop:"limb",period:10,u:247,v:292,y:ramp(292),path:[[247,292,ramp(292)],[247,282,ramp(282)]],fu:247,fv:270},
         {path:1,kind:K,clip:"WalkCarry",prop:"limb",period:11,u:247,v:290,y:ramp(290),path:[[247,290,ramp(290)],[247,280,ramp(280)]],fu:247,fv:270},
         {path:1,kind:K,clip:"WalkCarry",prop:"limb",period:9,u:247,v:288,y:ramp(288),path:[[247,288,ramp(288)],[247,278,ramp(278)]],fu:247,fv:270},
         {kind:K,u:247,v:284,y:ramp(284),fu:247,fv:270,clip:"Carry",prop:"limb"},
         {kind:K,u:247,v:282,y:ramp(282),fu:247,fv:270,clip:"Carry",prop:"limb"}],
        [{line:1,n:6,u0:283,v0:293,u1:299,v1:293,y:7.56,kind:K,clip:"Idle",fu:292,fv:290},{line:1,n:5,u0:284,v0:297.5,u1:298,v1:297.5,y:7.56,kind:K,clip:"Idle",fu:292,fv:290}],
        [{kind:K,u:154,v:250,y:13.56,fu:152,fv:250,clip:"Working"}],
        [{line:1,n:7,u0:203.5,v0:241,u1:203.5,v1:259,y:11.5,kind:K,clip:"HandsUp",fu:240,fv:250}],
        [{kind:K,u:238,v:262,y:16.5,fu:234,fv:266,clip:"Working"},{kind:K,u:240.5,v:263,y:16.5,fu:250,fv:280,clip:"Idle"},{kind:L,u:239.3,v:268.2,y:8.6,fu:250,fv:268,clip:"Idle"},{kind:L,u:239.3,v:270.4,y:8.6,fu:250,fv:268,clip:"Idle"},
         {path:1,kind:K,clip:"WalkCarry",prop:"limb",period:10,path:[[247,286,ramp(286)],[247,270,ramp(270)]],u:247,v:280,y:ramp(280),fu:250,fv:262}]
      ][i]||[];
    }
    if(key==="pilgrim"){
      return [
        [{kind:P,u:null,geo:1,clip:"Walk"}, // handled below for world/geo stations
        ],
        [],
        [{kind:P,clip:"Walk",path:[[248,-20,9],[250,10,9]],period:12,u:248,v:-10,y:9,fu:250,fv:15},{kind:P2,clip:"Walk",path:[[252,-16,9],[250,8,9]],period:14,u:252,v:-8,y:9,fu:250,fv:15},{kind:P,u:246,v:8,y:9,fu:250,fv:20,clip:"Idle"}],
        [{kind:P,u:250,v:8,y:6,fu:250,fv:30,clip:"Walk",path:[[250,-5,6],[250,25,6]],period:10},{kind:P2,u:248,v:12,y:6,fu:250,fv:30,clip:"Idle"}],
        [{kind:P,u:250,v:8,y:6.2,fu:250,fv:30,clip:"Idle"},{kind:P2,u:247,v:14,y:6,fu:250,fv:30,clip:"Idle"}],
        [{kind:P,u:240,v:80,y:3.5,fu:250,fv:170,clip:"Walk",path:[[230,50,3.5],[250,140,3.5]],period:16},{kind:P2,u:260,v:90,y:3.5,fu:250,fv:170,clip:"Idle"}],
        [{kind:P,u:250,v:192,y:8,fu:250,fv:200,clip:"Idle"},{kind:K,u:248,v:198,y:8,fu:250,fv:192,clip:"Idle"}],
        [{kind:K,u:250,v:262,y:16.5,fu:250,fv:256,clip:"Working"},{kind:K,u:246,v:268,y:16.5,fu:250,fv:256,clip:"Idle"}],
        [{line:1,n:6,u0:285.5,v0:258,u1:285.5,v1:280,y:9,kind:L,clip:"Idle",fu:250,fv:260}],
        [{kind:K,u:222,v:263,y:7.5,fu:224,fv:266,clip:"Idle"},{kind:K,u:220,v:265,y:7.5,fu:222,fv:263,clip:"Idle"}],
        [{kind:P,u:210,v:250,y:10.5,fu:200,fv:250,clip:"Idle"},{kind:P2,u:212,v:246,y:10.5,fu:200,fv:250,clip:"Idle"},{kind:K,u:198,v:250,y:12,fu:190,fv:250,clip:"Idle"}],
        [],
        []
      ][i]||[];
    }
    if(key==="pesach"||key==="sukkot"||key==="shavuot")return [];
    if(key==="hakhel"){
      return [
        [],
        [],
        [{kind:KG,u:415,v:303.4,y:6.5,fu:415,fv:280,clip:"Idle",prop:"sefer"},{kind:GG,u:412,v:304,y:6.5,fu:415,fv:280,clip:"Idle"},{kind:K,u:418,v:304,y:6.5,fu:415,fv:280,clip:"Idle"},
         {ring:1,n:8,u:415,v:304,y:3.5,r:9,kind:P,clip:"Idle",fu:415,fv:304}],
        [{kind:KG,u:415,v:303.4,y:6.5,fu:415,fv:280,clip:"Idle"},{kind:GG,u:412,v:304,y:6.5,fu:415,fv:280,clip:"Idle",prop:"sefer"},{kind:K,u:418,v:304,y:6.5,fu:415,fv:280,clip:"Idle"},
         {ring:1,n:8,u:415,v:304,y:3.5,r:9,kind:P,clip:"Idle",fu:415,fv:304}],
        [{kind:KG,u:415,v:303.4,y:6.5,fu:415,fv:280,clip:"Idle",prop:"sefer"},{kind:GG,u:412,v:304,y:6.5,fu:415,fv:280,clip:"Idle"},{ring:1,n:8,u:415,v:304,y:3.5,r:9,kind:P,clip:"Idle",fu:415,fv:304}],
        [{kind:KG,u:415,v:303.4,y:6.5,fu:415,fv:280,clip:"Idle",prop:"sefer"},{ring:1,n:10,u:415,v:304,y:3.5,r:10,kind:P,clip:"Idle",fu:415,fv:304}],
        []
      ][i]||[];
    }
    // oldcity: modern streets — no Second-Temple figures (and no modern dress)
    return [];
  }

  function onStep2(def,idx,st){
    clear();attach();
    if(!def||!ready)return;
    const key=Object.keys(STORIES).find(k=>STORIES[k]===def);
    let use=specList(key,idx)||[];if(use&&!Array.isArray(use))use=[use];
    const flat=[];
    use.forEach(s=>{
      if(!s)return;
      if(s.kind===undefined&&s.ring===undefined&&s.line===undefined&&s.path===undefined&&!s.length)return;
      if(s.length&&!s.kind&&!s.ring&&!s.line&&!s.path){s.forEach(x=>flat.push(x));return}
      flat.push(s);
    });
    const ok=flat.filter(s=>s&&(s.ring||s.line||s.path||s.u!=null));
    api.last={key,idx,nUse:use.length,nFlat:flat.length,nOk:ok.length,ready:!!ready};
    if(!ok.length){stylized(true);return}
    stylized(false);
    ok.forEach(s=>{
      if(s.ring)ring(s.n,s.u,s.v,s.y,s.r,s.kind,s.clip,s.fu,s.fv);
      else if(s.line)line(s.n,s.u0,s.v0,s.u1,s.v1,s.y,s.kind,s.clip,s.fu,s.fv,s.prop);
      else spawn(s);
    });
    api.needRefit=false;
  }
  let lastTk=0;
  function tick(dt0){ /* v112: זמן משלו, פעם אחת לפריים — נקרא משתי לולאות, ולפני כן הדמויות קודמו פעמיים (מהירות כפולה וקפיצות) */
    const nowT=performance.now();if(nowT-lastTk<8)return;const dt=lastTk?Math.min(0.1,(nowT-lastTk)/1000):0.016;lastTk=nowT;
    try{const P=window.__PAISF,tm=!!STORY&&STORY_API.S.def===STORIES.tamid;if(P&&P.length&&P[0].visible===tm)P.forEach(m=>m.visible=!tm)}catch(e){}
    if(!g.visible)return;
    /* v115: דמות רחוקה — בלי עיניים וגבות (לא נראות ממרחק), ורחוקה מאוד — בלי חישוב שלד */
    {const cp=camera.position;actors.forEach(o=>{const dd=o.root.position.distanceToSquared(cp),far=dd>18*18;if(o.far!==far){o.far=far;if(!o.face){o.face=[];o.root.traverse(q=>{if(q.isSkinnedMesh&&/eye|brow/i.test(q.name||""))o.face.push(q)})}o.face.forEach(q=>q.visible=!far)}o.skip=dd>140*140||!o.root.visible});actors.forEach(o=>{if(!o.skip)o.mixer.update(dt)})}
    const st=!!STORY,showAmb=!st&&(typeof TIME==="undefined"||TIME!=="night"); /* 117: הקפת המזבח רק בשעות העבודה, לא בלילה */
    if(ambN){if(st&&!ambSt){try{if(ACTS&&ACTS.amb&&STORY_API.S.def!==STORIES.tamid)ACTS.amb.forEach(m=>m.visible=true)}catch(e){}}
      else if(!st){try{if(ACTS&&ACTS.amb)ACTS.amb.forEach(m=>{if(m.visible)m.visible=false})}catch(e){}}}
    ambSt=st;
    actors.forEach(o=>{if(o.amb){if(!showAmb){o.root.visible=false;return}if(!o.root.visible&&(o.fade===undefined||o.fade>0.01))o.root.visible=true}if(o.spec&&o.spec.path){o.t=(o.t||0)+dt;place(o,dt)}});
  }
  load();
  const api={g,clear,tick,ambient,onStep:onStep2,refit,frameCheck,get ready(){return ready},get fail(){return fail},spawn,stylized};
  window.__TOURFIG=api;
  return api;
})();
const setTime=k=>{const id={morning:"tM",noon:"tN",evening:"tE",night:"tL"}[k];const el=document.getElementById(id);if(el&&TIME!==k)el.click()};
const setBimah=on=>{if(typeof BIMAHG!=="undefined"&&BIMAHG)BIMAHG.visible=!!on};
const wrapEnter=(st,fn)=>{const e=st.enter;st.enter=()=>{fn(st);if(e)e()}};

(function patchTourStations(){
  const yk=STORIES.yk&&STORIES.yk.steps;if(yk){
    wrapEnter(yk[0],()=>setTime("morning"));
    wrapEnter(yk[1],()=>setTime("night"));
    yk[1].fov=36;
    wrapEnter(yk[2],()=>setTime("morning"));
    yk[3].pose=AP(268,292,18,250,262,16.5);yk[3].fov=34;
    // from the east, along the Mishnah line (Yoma 3:8)
    yk[4].pose=AP(232,256,10.5,218,248,8.3);yk[4].fov=34;
    /* 117: מהמערב, כך ששני השעירים והכהן הגדול בחזית, והלוויים מאחור */yk[5].pose=AP(262,225,10.4,276,233.5,8.4);yk[5].fov=36;
    /* 117: מצפון־מזרח, כדי שהכיור לא יסתיר את הפר */yk[6].pose=AP(233,238,10.6,219,249.5,8.4);yk[6].fov=34;
    yk[7].nofc=yk[8].nofc=yk[9].nofc=yk[10].nofc=true;yk[9].pose=AP(166,245.5,16.6,152,252,14.7);yk[9].fov=40;/* 117: מהמערב, כמו בגורלות, כדי שהלוויים לא יסתירו את השעיר */yk[10].pose=AP(261,224,10.8,277,234.5,8.3);yk[10].fov=38;
    yk[11].pose=AP(216,282,10.5,226,264,9.6);yk[11].fov=36;
    const o=STORIES.yk.open,c=STORIES.yk.close;
    STORIES.yk.open=function(){setTime("morning");if(o)o.call(this)};
    STORIES.yk.close=function(){if(c)c.call(this);TOURFIGS.clear()};
  }
  /* 117: סיורי החגים נשארים בדיוק כמו ב-116, בלי הבמאי האוטומטי */for(const k of ["pesach","shavuot","sukkot","hakhel"])if(STORIES[k]&&STORIES[k].steps)STORIES[k].steps.forEach(x=>{x.nofc=true});const tm=STORIES.tamid&&STORIES.tamid.steps;if(tm){
    tm[7].nofc=tm[10].nofc=true;tm[1].pose=AP(328,306,12.2,310,295.2,8);tm[1].fov=34;
    tm[2].pose=AP(268,292,18.5,250,262,16.5);tm[2].fov=34;
    tm[3].pose=AP(228,292,20,250,252,16.5);tm[3].fov=34;
    tm[4].pose=AP(318,286,12.8,310,295,8);tm[4].fov=34;
    tm[6].pose=AP(256,206,11.2,244,216,8);tm[6].fov=32;
    tm[7].pose=AP(172,251.5,16.2,152.0,254.5,15.15);tm[7].fov=32;tm[7].subjects=["המנורה","מזבח הזהב"];
    tm[8].pose=AP(266,298,13.8,247,286.5,10.4);tm[8].fov=34;tm[8].subjects=["כבש"];
    tm[9].pose=AP(300,308,11.4,292,295,7.8);tm[9].fov=34;
    tm[11].pose=AP(228,258,14.0,204,250,12.4);tm[11].fov=38;
    const c=STORIES.tamid.close;
    STORIES.tamid.close=function(){if(c)c.call(this);TOURFIGS.clear()};
  }
  const pg=STORIES.pilgrim&&STORIES.pilgrim.steps;if(pg){
    wrapEnter(pg[0],()=>setTime("morning"));
    pg[4].nofc=true;pg[7].fov=36;pg[8].fov=34;pg[9].fov=34;pg[10].fov=34;
    const c=STORIES.pilgrim.close,o=STORIES.pilgrim.open;
    STORIES.pilgrim.open=function(){setTime("morning");if(o)o.call(this)};
    STORIES.pilgrim.close=function(){if(c)c.call(this);TOURFIGS.clear()};
  }
  const hk=STORIES.hakhel&&STORIES.hakhel.steps;if(hk){
    const o=STORIES.hakhel.open,c=STORIES.hakhel.close;
    STORIES.hakhel.open=function(){setTime("morning");setBimah(false);if(o)o.call(this);setBimah(false)};
    wrapEnter(hk[0],()=>setBimah(false));
    wrapEnter(hk[1],()=>setBimah(false));
    wrapEnter(hk[2],()=>setBimah(true));
    wrapEnter(hk[3],()=>setBimah(true));
    wrapEnter(hk[4],()=>setBimah(true));
    wrapEnter(hk[5],()=>setBimah(true));
    hk[0].pose=AP(520,250,70,300,250,10);hk[0].fov=42;
    hk[2].pose=AP(438,286,13,415,304,7.2);hk[2].fov=32;
    hk[3].fov=32;hk[4].fov=32;hk[5].fov=36;
    STORIES.hakhel.close=function(){if(c)c.call(this);setBimah(!!SHOW_FEST);TOURFIGS.clear()};
  }
  if(STORIES.oldcity){
    const c=STORIES.oldcity.close;
    STORIES.oldcity.close=function(){if(c)c.call(this);TOURFIGS.clear()};
  }
})();

// hook story go/stop for figures + fov restore (inner go already patched below if present)
(function hookStory(){
  if(!STORY_API)return;
  const stop0=STORY_API.stop;
  STORY_API.stop=function(){try{TOURFIGS.clear()}catch(e){}if(camera){camera.fov=40;camera.updateProjectionMatrix()}return stop0.apply(this,arguments)};
})();
if(typeof ACTS!=="undefined"&&ACTS){const tk=ACTS.tick;ACTS.tick=(dt,tt)=>{tk(dt,tt);try{TOURFIGS.tick(dt)}catch(e){}}}

// --- Voyager layout: step card on the left, fixed bar at the bottom with the station strip ---
const box=$("story");const bar=document.createElement("div");bar.id="tbar";bar.className="gl";bar.hidden=true;stage.appendChild(bar);
const strip=document.createElement("div");strip.id="stStrip";strip.setAttribute("role","tablist");strip.setAttribute("aria-label","תחנות הסיור");
const ctl=box.querySelector(".stctl");if(ctl)bar.appendChild(ctl);bar.appendChild(strip);
const tx=document.createElement("button");tx.type="button";tx.className="tx";tx.textContent="✕ יציאה";tx.onclick=()=>STORY_API.stop();bar.appendChild(tx);
const step=document.createElement("div");step.id="stStep";const txt=$("stText");txt.parentNode.insertBefore(step,txt);
const res=document.createElement("button");res.id="resume";res.type="button";res.hidden=true;res.textContent="▶ המשך סיור";res.onclick=()=>$("stPlay").click();stage.appendChild(res);
window.addEventListener("keydown",e=>{if(e.key==="Escape"&&STORY)STORY_API.stop()});
let sDef=null,sI=-1,orb=null,wasMove=false;
function buildStrip(){const S=STORY_API.S;strip.innerHTML="";S.def.steps.forEach((st,i)=>{const b=document.createElement("button");b.type="button";b.textContent=(i+1)+". "+(st.title||"");b.setAttribute("role","tab");b.onclick=()=>{if(STORY_API.S.paused){STORY_API.S.paused=false;STORY_API.S.user=false;$("stPlay").textContent="⏸"}STORY_API.go(i)};strip.appendChild(b)})}
function tick(){requestAnimationFrame(tick);try{TOURFIGS.tick(0)}catch(e){}const S=STORY_API&&STORY_API.S;if(!S)return;document.body.classList.toggle("touring",!!STORY);bar.hidden=!STORY;res.hidden=!(STORY&&S.paused&&S.user);if(!STORY){sDef=null;orb=null;return}
  if(S.def!==sDef){sDef=S.def;buildStrip();sI=-1}
  if(S.i!==sI){sI=S.i;const st=S.def.steps[sI]||{};step.innerHTML='<bdi class="n">'+(sI+1)+'/'+S.def.steps.length+'</bdi> · '+(st.title||"");$("stNum").textContent=S.def.title;[...strip.children].forEach((b,i)=>{b.setAttribute("aria-selected",i===sI?"true":"false");b.classList.toggle("on",i===sI)});const a=strip.children[sI];if(a)a.scrollIntoView({block:"nearest",inline:"center"});orb=null}
  const moving=!!(S.move||tween);if(wasMove&&!moving){orb={off:camera.position.clone().sub(controls.target),t0:performance.now(),tg:controls.target.clone()}}wasMove=moving;
  if(orb&&!moving&&!S.paused&&!reduce){/* v114: צילום קולנועי בתחנה — קשת איטית לכיוון אחד והתקרבות עדינה, במקום נדנוד */const k=(performance.now()-orb.t0)/1000,dir=(sI%2?-1:1),ang=dir*0.13*(1-Math.exp(-k/16)),dl=1-0.07*(1-Math.exp(-k/13));if(controls.target.distanceTo(orb.tg)>0.5){orb=null;return}camera.position.copy(orb.tg).add(orb.off.clone().applyAxisAngle(new THREE.Vector3(0,1,0),ang).multiplyScalar(dl));controls.update()}}
requestAnimationFrame(tick);
})();

