import sys
p=sys.argv[1];s=open(p).read()
a=s.index('  const round=T.filter(t=>t[2]!==1)')
b=s.index('  // cemeteries:')
new='''  // topic 5: each tree gets a species and its own shape from the tree library (TREES5, core/02). 0 = city tree, 1 = cypress, 2 = forest, 3 = orchard.
  // 💡 until OSM species data arrives: forests = mostly Jerusalem pine, orchards = olives, city trees = a mix.
  const KIND=t=>t[2]===1?"cypress":t[2]===3?"olive":t[2]===2?(r()<0.75?"pine":"carob"):(q=>q<0.4?"shade":q<0.65?"olive":q<0.85?"pine":"palm")(r());
  const BY={};T.forEach(t=>{const k=KIND(t),s=t[2]===3?0.7+r()*0.35:0.75+r()*0.5;(BY[k]||(BY[k]=[])).push([t[0],TY(t[0],t[1]),-t[1],s,r()*6.28])});
  Object.keys(BY).forEach(k=>TREES5.plant(WG,k,BY[k],{n:TREES5.NAMES[k],r:"OpenStreetMap (natural=tree, landuse=forest/orchard)",t:"עץ במקום שלו לפי OpenStreetMap. 💡 המין משוער לפי סוג השטח (יער, מטע, גינה) עד שיגיעו נתוני המינים."}));
'''
s=s[:a]+new+s[b:]
open(p,'w').write(s)
