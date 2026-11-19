#!/usr/bin/env python3
"""שמונת קבצי קריינות העיר העתיקה: קיימים, נטענים, והאורך תואם את המניפסט.

האתר טוען אותם דרך audio/index.json אל audio/<קובץ>, ומסנכרן כתוביות
כש־text זהה לכתובית החיה ומספר המשפטים זהה לפיצול ב־src/main/32-story-tours.js.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "audio"
FILES = [f"oldcity_{i:02d}.mp3" for i in range(1, 9)]
# ffprobe על CBR זהה לבית העשרוני של המניפסט; השוליים בולעים עיגול של מפענח.
TOL = 0.15
# אותו פיצול כמו sentences() בנגן הסיור: נקודה, סימן קריאה, שאלה, מנהיג, וגם נקודתיים.
SENT = re.compile(r"[^.!?…:]+[.!?…:]*[\"״׳']?\s*")


def fail(msg: str) -> None:
    print(f"FAIL {msg}", file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"חסר {path.relative_to(ROOT)}")
    except json.JSONDecodeError as e:
        fail(f"{path.relative_to(ROOT)} אינו JSON תקין: {e}")


def decoded_duration(path: Path) -> float:
    """פענוח מלא (load) ואז אורך. קובץ שבור נופל כאן, לא רק בבדיקת כותרת."""
    dec = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    if dec.returncode != 0:
        err = (dec.stderr or "").strip().splitlines()
        fail(f"{path.name} לא נטען: {err[-1] if err else dec.returncode}")
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True,
        text=True,
    )
    raw = (probe.stdout or "").strip()
    if probe.returncode != 0 or not raw:
        err = (probe.stderr or "").strip().splitlines()
        fail(f"אין אורך ל־{path.name}: {err[-1] if err else probe.returncode}")
    try:
        return float(raw)
    except ValueError:
        fail(f"אורך לא מספרי ל־{path.name}: {raw!r}")


def player_sentences(text: str) -> list[str]:
    return SENT.findall(text) or [text]


def main() -> None:
    index = load_json(AUDIO / "index.json")
    listed = index.get("oldcity")
    if listed != FILES:
        fail(f"audio/index.json oldcity אינו שמונת הקבצים: {listed!r}")

    manifest = load_json(AUDIO / "manifest.json")
    items = manifest.get("items")
    if not isinstance(items, dict):
        fail("audio/manifest.json בלי items")

    reading = load_json(ROOT / "tours" / "reading.json")
    tours = reading.get("tours") if isinstance(reading, dict) else reading
    old = next((t for t in tours if t.get("key") == "oldcity"), None)
    if not old or len(old.get("steps") or []) != 8:
        fail("ב־tours/reading.json אין ל־oldcity שמונה תחנות")

    for i, name in enumerate(FILES):
        key = name[:-4]
        path = AUDIO / name
        if not path.is_file() or path.stat().st_size < 1000:
            fail(f"חסר או ריק: audio/{name}")
        item = items.get(key)
        if not isinstance(item, dict):
            fail(f"אין {key} ב־manifest")
        if item.get("file") != name or item.get("tour") != "oldcity":
            fail(f"{key} אינו מצביע על {name} בסיור oldcity")
        cap = old["steps"][i].get("cap")
        if item.get("text") != cap:
            fail(f"{key}: הטקסט במניפסט אינו הכתובית החיה ב־reading.json")
        sentences = item.get("sentences")
        split = player_sentences(cap)
        if not isinstance(sentences, list) or len(sentences) != len(split):
            fail(
                f"{key}: {0 if not isinstance(sentences, list) else len(sentences)} משפטים במניפסט, "
                f"{len(split)} בפיצול הנגן"
            )
        if [s.get("text") for s in sentences] != split:
            fail(f"{key}: טקסט המשפטים אינו תואם לפיצול הכתוביות")
        declared = item.get("duration")
        if not isinstance(declared, (int, float)) or declared <= 0:
            fail(f"{key}: duration חסר במניפסט")
        got = decoded_duration(path)
        if abs(got - float(declared)) > TOL:
            fail(f"{key}: אורך הקובץ {got:.3f}ש׳ מחוץ למניפסט {float(declared):.3f}ש׳ (סף {TOL}ש׳)")
        prev = -1.0
        for s in sentences:
            try:
                start, end = float(s["start"]), float(s["end"])
            except (KeyError, TypeError, ValueError):
                fail(f"{key}: חותמת זמן חסרה")
            if start < 0 or end < start or start < prev:
                fail(f"{key}: חותמות לא בסדר ({start}–{end})")
            if end > float(declared) + 0.05 or end > got + 0.05:
                fail(f"{key}: סוף משפט {end:.3f}ש׳ אחרי האורך")
            prev = start
        print(f"ok {name} {got:.3f}s = manifest {float(declared):.3f}s, {len(sentences)} sentences")
    print(f"oldcity: {len(FILES)} files load, durations inside the manifest")


if __name__ == "__main__":
    main()
