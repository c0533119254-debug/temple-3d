# מוריד תמונות רחוב של Mapillary לכל נקודה ב-points.json (רק לייחוס בעבודה; התמונות לא נכנסות לאתר).
# הרצה: MLY_TOKEN=... python3 tools/mapillary/fetch.py tools/mapillary/points.json out-dir
# התמונות ברישיון CC BY-SA של Mapillary; הקרדיט נשמר ב-index.json לכל תמונה.
import json, os, sys, math, urllib.request, urllib.parse
LAT0, LON0 = 31.7780, 35.2354
TH = 0.0  # points are already in geo x/n (east/north)
tok = os.environ["MLY_TOKEN"]
pts = json.load(open(sys.argv[1]))["points"]
out = sys.argv[2]; os.makedirs(out, exist_ok=True)
R = float(os.environ.get("MLY_RADIUS", "35"))
PER = int(os.environ.get("MLY_PER", "6"))
def get(url):
    with urllib.request.urlopen(url, timeout=60) as r: return r.read()
index = {}
for key, x, n in pts:
    lat = LAT0 + n / 110574; lon = LON0 + x / 94630
    dl = R / 110574; dn = R / 94630
    q = urllib.parse.urlencode({"access_token": tok, "bbox": f"{lon-dn},{lat-dl},{lon+dn},{lat+dl}", "limit": 200,
        "fields": "id,captured_at,compass_angle,computed_compass_angle,geometry,thumb_1024_url,is_pano,creator"})
    try: data = json.loads(get("https://graph.mapillary.com/images?" + q)).get("data", [])
    except Exception as e: print(key, "error", e); index[key] = {"error": str(e)}; continue
    flat = [d for d in data if not d.get("is_pano")] or data
    flat.sort(key=lambda d: -d.get("captured_at", 0))  # newest first
    chosen, sectors = [], set()
    for d in flat:  # one photo per 60° of view direction, newest first
        a = d.get("computed_compass_angle", d.get("compass_angle", 0)) or 0
        s = int(a // 60)
        if s in sectors: continue
        sectors.add(s); chosen.append(d)
        if len(chosen) >= PER: break
    os.makedirs(f"{out}/{key}", exist_ok=True); rows = []
    for d in chosen:
        u = d.get("thumb_1024_url")
        if not u: continue
        try: open(f"{out}/{key}/{d['id']}.jpg", "wb").write(get(u))
        except Exception as e: print(key, d["id"], "img error", e); continue
        c = d["geometry"]["coordinates"]
        rows.append({"id": d["id"], "date": __import__("datetime").datetime.utcfromtimestamp(d.get("captured_at", 0) / 1000).strftime("%Y-%m-%d"),
            "heading": round(d.get("computed_compass_angle", d.get("compass_angle", 0)) or 0),
            "x": round((c[0] - LON0) * 94630, 1), "n": round((c[1] - LAT0) * 110574, 1), "pano": bool(d.get("is_pano")),
            "credit": "Mapillary, CC BY-SA 4.0" + (", " + d["creator"]["username"] if d.get("creator") else "")})
    index[key] = {"x": x, "n": n, "found": len(data), "photos": rows}
    print(key, len(data), "found,", len(rows), "saved")
json.dump(index, open(f"{out}/index.json", "w"), ensure_ascii=False, indent=1)
