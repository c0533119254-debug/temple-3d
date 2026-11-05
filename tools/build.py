#!/usr/bin/env python3
"""Join the repo files back into ONE html file: dist/temple-3d.html

    python3 tools/build.py              # writes dist/temple-3d.html
    python3 tools/build.py --check X    # also checks that the result equals file X

The single file runs the same as index.html; it is for places that need one file
(e.g. the claude.ai artifact). The images (sat*, sky*, tex*) still sit next to it.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def rd(p):
    return open(os.path.join(ROOT, p), encoding="utf-8", newline="").read()

def build():
    s = rd("index.html")
    def css(m):
        idattr = ' id="%s"' % m.group(2) if m.group(2) else ""
        return "<style%s>%s</style>" % (idattr, rd(m.group(1)))
    s = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)"(?: data-id="([^"]+)")?>', css, s)
    def js(m):
        if m.group(1) == "src/loader.js":
            parts = [l.strip() for l in rd("src/parts.txt").splitlines() if l.strip() and not l.startswith("#")]
            body = "\n".join(rd("src/" + p)[:-1] if rd("src/" + p).endswith("\n") else rd("src/" + p) for p in parts)
            return "<script>%s</script>" % body
        return "<script>%s</script>" % rd(m.group(1))
    s = re.sub(r'<script src="((?:lib|src)/[^"]+)"></script>', js, s)
    return s

if __name__ == "__main__":
    out = build()
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    with open(os.path.join(ROOT, "dist/temple-3d.html"), "w", encoding="utf-8", newline="") as f:
        f.write(out)
    print("dist/temple-3d.html", len(out.encode("utf-8")), "bytes")
    if "--check" in sys.argv:
        ref = open(sys.argv[sys.argv.index("--check") + 1], encoding="utf-8", newline="").read()
        if ref == out:
            print("OK: identical to", sys.argv[-1])
        else:
            i = next(i for i, (a, b) in enumerate(zip(ref, out)) if a != b) if any(a != b for a, b in zip(ref, out)) else min(len(ref), len(out))
            print("DIFFERENT at char", i, repr(ref[i-40:i+40]), "vs", repr(out[i-40:i+40]))
            sys.exit(1)
