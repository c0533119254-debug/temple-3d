#!/usr/bin/env python3
"""Split one big single-file temple HTML (as published) into the repo layout.

    python3 tools/split.py path/to/temple-3d.html

Writes: index.html, css/*.css, lib/*.js, src/**/*.js, src/parts.txt
Then:   python3 tools/build.py   rebuilds dist/temple-3d.html, which must be
        byte-identical to the input (the script checks this itself).
"""
import os, re, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Where the main program is cut. Each entry: (file, regex that matches the FIRST line of that file).
# Cuts are only at line starts, and the parts are joined back with "\n", so the program is unchanged.
CUTS = [
    ("core/00-setup.js",            None),
    ("core/01-dem-data.js",         r"^const DEM=\(function\(\)\{"),
    ("core/02-terrain-materials.js", r"^await __Y\(\d+\);function demAt\("),
    ("city/10-roads.js",            r"^// ---- roads \(OpenStreetMap\)"),
    ("city/11-ground.js",           r"^// ---- terrain ----"),
    ("temple/20-mount-platform.js", r"^// ---- Temple Mount platform ----"),
    ("city/12-old-city-wall.js",    r"^// ---- Old City wall, towers, gates ----"),
    ("city/13-buildings.js",        r"^// ---- real buildings"),
    ("city/14-weathering.js",       r"^// ---- weathering"),
    ("city/15-trees.js",            r"^// ---- real trees"),
    ("city/16-road-surfaces.js",    r"^// ---- road surfaces"),
    ("city/17-landmarks.js",        r"^// ---- landmarks"),
    ("city/18-old-city-areas.js",   r"^// ---- topic 3, area 1:"),
    ("city/19-living-city.js",      r"^// ---- living city"),
    ("city/20-city-fabric-labels.js", r"^// ---- city fabric ----"),
    ("temple/21-compound-mount-gates.js", r"^// ---- compound ----"),
    ("city/22-transport.js",        r"^// ---- public transport"),
    ("temple/23-actors.js",         r"let ACTS=null,CROWDT=null"),
    ("temple/24-stories.js",        r"^// ---- narrated story tours"),
    ("temple/25-build-temple.js",   r"^await __Y\(\d+\);function build\(\)\{"),
    ("core/30-time-views-hud.js",   r"^// ---- time of day ----"),
    ("core/31-loop.js",             r"^// ---- loop ----"),
    ("core/32-navigation-ui.js",    r"^// ==== v59 phase B"),
    ("core/33-lod-quality-review.js", r"^// ==== v60: distance LOD"),
]

def w(path, text):
    p = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(text)

def main(src):
    s = open(src, encoding="utf-8", newline="").read()
    tags = list(re.finditer(r"<(script|style)([^>]*)>", s))
    out, pos, main_done = [], 0, False
    for m in tags:
        kind, attrs = m.group(1), m.group(2)
        end = s.index("</%s>" % kind, m.end())
        body = s[m.end():end]
        if len(body) < 2000:          # small inline bits stay in index.html as they are
            continue
        out.append(s[pos:m.start()])
        if kind == "style":
            idm = re.search(r'id="([^"]+)"', attrs)
            name = "css/%s.css" % (idm.group(1) if idm else "main")
            w(name, body)
            out.append('<link rel="stylesheet" href="%s"%s>' % (name, ' data-id="%s"' % idm.group(1) if idm else ""))
        elif body.lstrip().startswith("/* three@"):
            first = body.split("\n", 1)[0]
            lib = re.search(r"/([A-Za-z0-9_.]+?)(?:\.min)?\.js", first).group(1)
            name = "lib/%s.js" % lib
            w(name, body)
            out.append('<script src="%s"></script>' % name)
        else:
            assert not main_done, "two big app scripts?"
            main_done = True
            lines = body.split("\n")
            starts, k = [0], 1
            for i, ln in enumerate(lines):
                if k < len(CUTS) and re.search(CUTS[k][1], ln):
                    starts.append(i); k += 1
            if k != len(CUTS):
                sys.exit("cut marker not found: %s %s" % CUTS[k])
            starts.append(len(lines))
            for (name, _), a, b in zip(CUTS, starts, starts[1:]):
                w("src/" + name, "\n".join(lines[a:b]) + "\n")
            head = ("# סדר החלקים של התוכנית. הם מחוברים בסדר הזה לסקריפט אחד.\n"
                    "# core/ = משותף (Claude), temple/ = המקדש (Claude), city/ = העיר והדרכים (Grok)\n"
                    "# קובץ חדש: מוסיפים שורה במקום הנכון ומבקשים ב-REQUESTS.md\n")
            w("src/parts.txt", head + "".join(n + "\n" for n, _ in CUTS))
            out.append('<script src="src/loader.js"></script>')
        pos = end + len("</%s>" % kind)
    out.append(s[pos:])
    w("index.html", "".join(out))
    r = subprocess.run([sys.executable, os.path.join(ROOT, "tools/build.py"), "--check", src])
    sys.exit(r.returncode)

if __name__ == "__main__":
    main(sys.argv[1])
