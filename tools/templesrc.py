#!/usr/bin/env python3
"""index.html <-> src/ (פירוק לקבצים לפי נושא, והרכבה חזרה לקובץ זהה בדיוק).

האתר עצמו הוא עדיין index.html אחד. התיקייה src/ היא אותו קובץ בדיוק, חתוך לחלקים
לפי נושא, כדי שיהיה קל לקרוא, לערוך ולראות מה השתנה. שני הכיוונים נותנים קובץ זהה
בייט לבייט.

    python3 tools/templesrc.py build   # src/ -> index.html  (אחרי עריכה ב-src/)
    python3 tools/templesrc.py split   # index.html -> src/  (אחרי עריכה ישירה ב-index.html,
                                       #  למשל patch של Instinct או layer/apply_layer.py)
    python3 tools/templesrc.py check   # בודק ש-src/ ו-index.html זהים (רץ גם ב-GitHub)

src/manifest.txt קובע את הסדר. בכל שורה: נתיב, טאב, ותחילת השורה הראשונה של החלק
(העוגן). הפיצול מחפש כל עוגן בתחילת שורה, לפי הסדר. אם עוגן נמחק או הוכפל, הפיצול
נעצר ואומר איזה, ולא כותב כלום.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
SRC = os.path.join(ROOT, "src")
MANIFEST = os.path.join(SRC, "manifest.txt")
ANCHOR_LEN = 120


def read_lines(path):
    with open(path, "rb") as f:
        return f.read().decode("utf-8").splitlines(keepends=True)


def load_manifest():
    out = []
    with open(MANIFEST, encoding="utf-8") as f:
        for raw in f:
            raw = raw.rstrip("\n")
            if not raw or raw.startswith("#"):
                continue
            path, anchor = raw.split("\t", 1)
            out.append((path, anchor.replace("\\n", "\n")))
    return out


def anchor_of(lines, i):
    """תחילת השורה; אם היא קצרה (כמו <script>), ממשיכים לשורה הבאה עד 40 תווים."""
    a = ""
    while i < len(lines):
        a += lines[i]
        if len(a.rstrip("\r\n")) >= 40:
            break
        i += 1
    return a.rstrip("\r\n")[:ANCHOR_LEN]


def at(lines, i, anchor):
    k = anchor.count("\n") + 1
    return "".join(lines[i:i + k]).startswith(anchor)


def cut(lines, manifest):
    """Return {path: text} or raise SystemExit with a clear message."""
    starts = []
    for path, anchor in manifest:
        hits = [i for i in range(len(lines)) if at(lines, i, anchor)]
        if len(hits) != 1:
            sys.exit("שגיאה: העוגן של %s נמצא %d פעמים (צריך פעם אחת):\n  %s"
                     % (path, len(hits), anchor[:80]))
        starts.append(hits[0])
    if starts != sorted(starts) or starts[0] != 0:
        sys.exit("שגיאה: סדר העוגנים ב-index.html לא תואם ל-src/manifest.txt")
    starts.append(len(lines))
    return {manifest[k][0]: "".join(lines[starts[k]:starts[k + 1]])
            for k in range(len(manifest))}


def assemble(manifest):
    parts = []
    for path, _ in manifest:
        with open(os.path.join(SRC, path), "rb") as f:
            parts.append(f.read().decode("utf-8"))
    return "".join(parts)


def write_pieces(pieces, manifest):
    for path, _ in manifest:
        full = os.path.join(SRC, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "wb") as f:
            f.write(pieces[path].encode("utf-8"))


def cmd_split():
    manifest = load_manifest()
    pieces = cut(read_lines(INDEX), manifest)
    write_pieces(pieces, manifest)
    cmd_check()


def cmd_build():
    text = assemble(load_manifest())
    with open(INDEX, "wb") as f:
        f.write(text.encode("utf-8"))
    print("index.html נבנה מ-src/ (%d בתים)" % len(text.encode("utf-8")))


def cmd_check():
    manifest = load_manifest()
    built = assemble(manifest).encode("utf-8")
    with open(INDEX, "rb") as f:
        cur = f.read()
    if built != cur:
        sys.exit("src/ ו-index.html לא תואמים.\n"
                 "  ערכת את src/?        python3 tools/templesrc.py build\n"
                 "  ערכת את index.html?  python3 tools/templesrc.py split")
    print("תקין: src/ (%d חלקים) ו-index.html זהים, %d בתים" % (len(manifest), len(cur)))


if __name__ == "__main__":
    cmds = {"split": cmd_split, "build": cmd_build, "check": cmd_check}
    if len(sys.argv) != 2 or sys.argv[1] not in cmds:
        sys.exit(__doc__)
    cmds[sys.argv[1]]()
