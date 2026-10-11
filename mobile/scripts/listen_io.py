#!/usr/bin/env python3
"""Shared Listen catalog helpers. Keys stay in .env; the app never reads them."""

from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / ".env"
VERSES = ROOT / "src" / "verses.json"
SIMPLE = ROOT / "src" / "simple-english.json"
CATALOG = ROOT / "src" / "listen-catalog.json"
SIMPLE_VOICE = "simple-en-v1"
ASSETS = ROOT / "assets" / "listen"
ASSETS_TS = ROOT / "src" / "listen-assets.ts"

HF_DATASET = "JDhruv14/Bhagavad-Gita_Audio"
HF_ROWS = "https://datasets-server.huggingface.co/rows?dataset=JDhruv14/Bhagavad-Gita_Audio&config=default&split=train"
TTS_MODEL = "eleven_multilingual_v2"
TTS_VOICE = "JBFqnCBsd6RMkjVDRZzb"
STT_MODEL = "scribe_v2"


def load_env() -> None:
    if not ENV.exists():
        return
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def eleven_key() -> str:
    load_env()
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        raise SystemExit("ELEVENLABS_API_KEY is missing from mobile/.env")
    return key


def load_verses() -> list[dict]:
    return json.loads(VERSES.read_text(encoding="utf-8"))


def load_simple() -> dict:
    if not SIMPLE.exists():
        return {}
    return json.loads(SIMPLE.read_text(encoding="utf-8")).get("verses") or {}


def with_simple(verses: list[dict]) -> list[dict]:
    simple_map = load_simple()
    out: list[dict] = []
    for verse in verses:
        simple = simple_map.get(verse.get("ref"))
        out.append({**verse, "simple": simple} if simple else verse)
    return out


def gita_ref(chapter: int, verse: int) -> str:
    return f"Bhagavad Gita {int(chapter)}.{int(verse)}"


def empty_catalog() -> dict:
    return {
        "gitaSource": HF_DATASET,
        "ttsModel": TTS_MODEL,
        "ttsVoice": TTS_VOICE,
        "sttModel": STT_MODEL,
        "verses": {},
    }


def load_catalog() -> dict:
    if not CATALOG.exists():
        return empty_catalog()
    blob = json.loads(CATALOG.read_text(encoding="utf-8"))
    blob.setdefault("verses", {})
    blob.setdefault("gitaSource", HF_DATASET)
    return blob


def save_catalog(blob: dict) -> None:
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    tmp = CATALOG.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(blob, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(CATALOG)


def shloka_id_of(ref: str) -> str | None:
    if not ref.startswith("Bhagavad Gita "):
        return None
    parts = ref.split(" ")[-1].split(".")
    if len(parts) != 2:
        return None
    return f"{int(parts[0])}_{int(parts[1])}"


def ramayana_file(ref: str) -> str:
    tail = ref.split(" ")[-1]
    return f"ramayana/{tail}.mp3"


def english_file(ref: str) -> str:
    tail = ref.split(" ")[-1]
    if ref.startswith("Bhagavad Gita "):
        return f"english/gita/{tail}.mp3"
    return f"english/ramayana/{tail}.mp3"


def english_text(verse: dict) -> str:
    simple = verse.get("simple") or {}
    return (simple.get("simpleEnglish") or "").strip()


def words_from_alignment(characters: list[str], starts: list[float], ends: list[float]) -> list[dict]:
    words: list[dict] = []
    buf: list[str] = []
    start = None
    end = 0.0
    for ch, s, e in zip(characters, starts, ends):
        if ch.isspace() or ch in "।॥|,":
            if buf and start is not None:
                words.append({"text": "".join(buf), "start": start, "end": end})
            buf = []
            start = None
            continue
        if start is None:
            start = s
        buf.append(ch)
        end = e
    if buf and start is not None:
        words.append({"text": "".join(buf), "start": start, "end": end})
    return words


def _asset_map(name: str, field: str, blob: dict) -> list[str]:
    lines = [f"export const {name}: Record<string, number> = {{"]
    for ref, row in sorted(blob.get("verses", {}).items()):
        rel = row.get(field)
        if not rel:
            continue
        path = ASSETS / rel
        if not path.exists():
            continue
        lines.append(f"  {json.dumps(ref)}: require({json.dumps('../assets/listen/' + rel)}),")
    lines.append("};")
    return lines


def write_listen_assets(blob: dict) -> None:
    lines = ["/* Generated. Bundled chant and English voice-over clips. */"]
    lines.extend(_asset_map("listenAssets", "file", blob))
    lines.append("")
    lines.extend(_asset_map("listenEnglishAssets", "englishFile", blob))
    lines.append("")
    ASSETS_TS.write_text("\n".join(lines), encoding="utf-8")
