#!/usr/bin/env python3
"""Build the local verse file. English is Telang (Gita) and Dutt (Ramayana) only."""

from __future__ import annotations

import csv
import json
import re
import time
import urllib.request
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "verses.json"
GITA_VERSES = ROOT / "data" / "gita-verse.json"
GITA_TELANG = ROOT / "data" / "gita-telang.csv"
RAMAYANA_DUTT = ROOT / "data" / "ramayana-dutt.json"
DUTT_URL = "https://raw.githubusercontent.com/rahular/itihasa/gh-pages/res/ramayana.json"
TELANG_SOURCE = "Kashinath Trimbak Telang, 1882"
DUTT_SOURCE = "M. N. Dutt, 1891–94"
RAMAYANA = {
    "bala": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/balakanda_all.json",
        "Bala",
        1,
    ),
    "ayodhya": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/ayodhyakanda_all.json",
        "Ayodhya",
        2,
    ),
    "aranya": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/aranyakanda_all.json",
        "Aranya",
        3,
    ),
    "kishkindha": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/kishkindhakanda_all.json",
        "Kishkindha",
        4,
    ),
    "sundara": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/sundarakanda_all.json",
        "Sundara",
        5,
    ),
    "yuddha": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/yudhhakanda_all.json",
        "Yuddha",
        6,
    ),
    "uttara": (
        "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san/uttarakanda_all.json",
        "Uttara",
        7,
    ),
}
DUTT_VOLUMES = {
    "vol-i": ["Bala", "Ayodhya"],
    "vol-ii": ["Aranya", "Kishkindha", "Sundara"],
    "vol-iii": ["Yuddha"],
    "vol-iv": ["Uttara"],
}

VOWELS = {
    "अ": "a",
    "आ": "ā",
    "इ": "i",
    "ई": "ī",
    "उ": "u",
    "ऊ": "ū",
    "ऋ": "ṛ",
    "ॠ": "ṝ",
    "ऌ": "ḷ",
    "ॡ": "ḹ",
    "ए": "e",
    "ऐ": "ai",
    "ओ": "o",
    "औ": "au",
}
MARKS = {
    "ा": "ā",
    "ि": "i",
    "ी": "ī",
    "ु": "u",
    "ू": "ū",
    "ृ": "ṛ",
    "ॄ": "ṝ",
    "ॢ": "ḷ",
    "ॣ": "ḹ",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
}
CONS = {
    "क": "k",
    "ख": "kh",
    "ग": "g",
    "घ": "gh",
    "ङ": "ṅ",
    "च": "c",
    "छ": "ch",
    "ज": "j",
    "झ": "jh",
    "ञ": "ñ",
    "ट": "ṭ",
    "ठ": "ṭh",
    "ड": "ḍ",
    "ढ": "ḍh",
    "ण": "ṇ",
    "त": "t",
    "थ": "th",
    "द": "d",
    "ध": "dh",
    "न": "n",
    "प": "p",
    "फ": "ph",
    "ब": "b",
    "भ": "bh",
    "म": "m",
    "य": "y",
    "र": "r",
    "ल": "l",
    "व": "v",
    "श": "ś",
    "ष": "ṣ",
    "स": "s",
    "ह": "h",
    "ळ": "ḷ",
}
DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")
VIRAMA = "्"
ANUSVARA = "ं"
VISARGA = "ः"
CANDRA = "ँ"
AVAGRAHA = "ऽ"
NUKTA = "़"
SANSKRIT_NOISE = re.compile(r"[०-९0-9\s।॥.,;:!?\"'“”‘’\-–—()\[\]ॐ॰|]")


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "setuHome-verse-build"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return response.read()
        except Exception:
            if attempt == 4:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(url)


def to_iast(text: str) -> str:
    out: list[str] = []
    i = 0
    while i < len(text):
        ch = text[i]
        if ch in CONS:
            cluster = CONS[ch]
            i += 1
            if i < len(text) and text[i] == NUKTA:
                i += 1
            while i + 1 < len(text) and text[i] == VIRAMA and text[i + 1] in CONS:
                cluster += CONS[text[i + 1]]
                i += 2
                if i < len(text) and text[i] == NUKTA:
                    i += 1
            if i < len(text) and text[i] == VIRAMA:
                out.append(cluster)
                i += 1
            elif i < len(text) and text[i] in MARKS:
                out.append(cluster + MARKS[text[i]])
                i += 1
            else:
                out.append(cluster + "a")
            continue
        if ch in VOWELS:
            out.append(VOWELS[ch])
        elif ch == ANUSVARA:
            out.append("ṃ")
        elif ch == VISARGA:
            out.append("ḥ")
        elif ch == CANDRA:
            out.append("m̐")
        elif ch == AVAGRAHA:
            out.append("'")
        elif ch in "।|":
            out.append("|")
        elif ch == "॥":
            pass
        elif ch in " \n\t":
            out.append(" ")
        elif ch in "०१२३४५६७८९":
            out.append(ch.translate(DIGITS))
        elif ch in "-–—.,;:?!'\"()[]":
            out.append(ch)
        i += 1
    return re.sub(r"\s+", " ", "".join(out)).strip()


def split_lines(text: str, sep: str) -> list[str]:
    parts = [re.sub(r"\s+", " ", part).strip(" .") for part in re.split(sep, text)]
    return [part for part in parts if part]


def clean_english(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("`", "'")).strip()


def norm_sanskrit(text: str) -> str:
    return SANSKRIT_NOISE.sub("", text)


def gita_verses() -> list[dict]:
    """Sanskrit and IAST from verse.json only. Skip translation.json and commentary.json."""
    rows: list[dict] = []
    marker = re.compile(r"।।\s*[\d.]+\s*।।")
    for row in json.loads(GITA_VERSES.read_text(encoding="utf-8")):
        sanskrit = split_lines(marker.sub("", row["text"]), r"[\n।]")
        transliteration = split_lines(row["transliteration"], r"[\n]")
        rows.append(
            {
                "ref": f"Bhagavad Gita {row['chapter_number']}.{row['verse_number']}",
                "book": "gita",
                "sanskrit": sanskrit,
                "transliteration": transliteration,
                "english": "",
            }
        )
    rows.sort(key=lambda item: tuple(int(part) for part in item["ref"].split()[-1].split(".")))
    print(f"gita {len(rows)} from {GITA_VERSES}", flush=True)
    return rows


def ramayana_verses() -> list[dict]:
    rows: list[dict] = []
    number = re.compile(r"॥\s*([०-९0-9\-—.]+)\s*॥")
    for _key, (url, name, kanda) in RAMAYANA.items():
        print(f"ramayana {name}", flush=True)
        blob = json.loads(fetch(url).decode())
        kanda_data = next(iter(blob.values()))
        for chapter in kanda_data["chapters"]:
            sarga = int(chapter["chapter_number"])
            for index, sloka in enumerate(chapter["slokas"], start=1):
                raw = sloka.strip()
                match = number.search(raw)
                if match:
                    nums = match.group(1).translate(DIGITS).replace("—", "-").replace("–", "-")
                    verse_no = nums.split("-")[-1].split(".")[-1]
                    try:
                        verse = int(verse_no)
                    except ValueError:
                        verse = index
                    body = number.sub("", raw)
                else:
                    verse = index
                    body = raw
                sanskrit = [
                    line
                    for line in split_lines(body, r"[।|]")
                    if not re.fullmatch(r"[०-९0-9.\-—–\s]+", line)
                ]
                if not sanskrit:
                    continue
                rows.append(
                    {
                        "ref": f"Valmiki Ramayana {kanda}.{sarga}.{verse}",
                        "kanda": name,
                        "book": "ramayana",
                        "sanskrit": sanskrit,
                        "transliteration": [to_iast(line) for line in sanskrit],
                        "english": "",
                    }
                )
    return rows


def telang_index() -> dict[tuple[int, int], str]:
    out: dict[tuple[int, int], str] = {}
    with GITA_TELANG.open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            chapter = int(row["Chapter"])
            verse = int(row["Verse"])
            text = clean_english(row["Text"])
            if text:
                out[(chapter, verse)] = text
    return out


def attach_telang(rows: list[dict]) -> int:
    index = telang_index()
    filled = 0
    for row in rows:
        chapter, verse = (int(part) for part in row["ref"].split()[-1].split("."))
        english = index.get((chapter, verse), "")
        if not english:
            continue
        row["english"] = english
        row["englishSource"] = TELANG_SOURCE
        filled += 1
    print(f"gita english {filled}/{len(rows)} Telang 1882", flush=True)
    return filled


def dutt_blocks() -> dict[str, list[list[dict]]]:
    if RAMAYANA_DUTT.exists():
        blob = json.loads(RAMAYANA_DUTT.read_text(encoding="utf-8"))
    else:
        print("fetching Dutt Ramayana", flush=True)
        blob = json.loads(fetch(DUTT_URL).decode())
        RAMAYANA_DUTT.write_text(json.dumps(blob, ensure_ascii=False), encoding="utf-8")
    grouped: dict[str, list[list[dict]]] = {}
    for volume, names in DUTT_VOLUMES.items():
        blocks: list[list[dict]] = []
        current: list[dict] = []
        previous = 0
        for chapter in blob[volume]:
            number = int(chapter["chapter"])
            if current and number < previous:
                blocks.append(current)
                current = []
            current.append(chapter)
            previous = number
        if current:
            blocks.append(current)
        if len(blocks) != len(names):
            raise SystemExit(f"{volume} split into {len(blocks)} kandas, expected {names}")
        grouped[volume] = blocks
    return grouped


def dutt_by_sarga() -> dict[tuple[str, int], list[tuple[str, str]]]:
    by_sarga: dict[tuple[str, int], list[tuple[str, str]]] = defaultdict(list)
    grouped = dutt_blocks()
    for volume, names in DUTT_VOLUMES.items():
        for name, block in zip(names, grouped[volume], strict=True):
            seen: set[int] = set()
            for chapter in block:
                sarga = int(chapter["chapter"])
                while sarga in seen:
                    sarga += 1
                seen.add(sarga)
                for sanskrit, english in zip(chapter["sn"], chapter["en"], strict=True):
                    text = clean_english(english)
                    key = norm_sanskrit(sanskrit)
                    if text and key:
                        by_sarga[(name, sarga)].append((key, text))
    return by_sarga


def pick_dutt(key: str, candidates: list[tuple[str, str]]) -> str:
    if not key or not candidates:
        return ""
    exact = [english for fingerprint, english in candidates if fingerprint == key]
    if len(set(exact)) == 1:
        return exact[0]
    contained = [
        english
        for fingerprint, english in candidates
        if key in fingerprint or fingerprint in key
    ]
    unique = list(dict.fromkeys(contained))
    if len(unique) == 1:
        return unique[0]
    best_ratio = -1.0
    second = -1.0
    best_english = ""
    for fingerprint, english in candidates:
        ratio = SequenceMatcher(None, key, fingerprint).ratio()
        if ratio > best_ratio:
            second = best_ratio
            best_ratio = ratio
            best_english = english
        elif ratio > second:
            second = ratio
    if best_ratio >= 0.55 and best_ratio - second >= 0.08:
        return best_english
    return ""


def attach_dutt(rows: list[dict]) -> int:
    by_sarga = dutt_by_sarga()
    filled = 0
    for row in rows:
        kanda = row["kanda"]
        _kanda_no, sarga, _verse = (int(part) for part in row["ref"].split()[-1].split("."))
        english = pick_dutt(norm_sanskrit("".join(row["sanskrit"])), by_sarga.get((kanda, sarga), []))
        if not english:
            continue
        row["english"] = english
        row["englishSource"] = DUTT_SOURCE
        filled += 1
    print(f"ramayana english {filled}/{len(rows)} Dutt 1891–94", flush=True)
    return filled


def main() -> None:
    gita = gita_verses()
    ramayana = ramayana_verses()
    if len(gita) < 690:
        raise SystemExit(f"Gita rows look short: {len(gita)}")
    if len(ramayana) < 1000:
        raise SystemExit(f"Ramayana rows look short: {len(ramayana)}")
    gita_en = attach_telang(gita)
    ramayana_en = attach_dutt(ramayana)
    if gita_en < 650:
        raise SystemExit(f"Gita English looks short: {gita_en}")
    if ramayana_en < 5000:
        raise SystemExit(f"Ramayana English looks short: {ramayana_en}")
    mixed: list[dict] = []
    gi = ri = 0
    while gi < len(gita) or ri < len(ramayana):
        if gi < len(gita):
            mixed.append(gita[gi])
            gi += 1
        if ri < len(ramayana):
            mixed.append(ramayana[ri])
            ri += 1
    OUT.write_text(json.dumps(mixed, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT} gita={len(gita)} ramayana={len(ramayana)} total={len(mixed)}")


if __name__ == "__main__":
    main()
