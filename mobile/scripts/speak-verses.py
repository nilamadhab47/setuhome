#!/usr/bin/env python3
"""ElevenLabs clips. Chant fill-in for verses with no recording, and Simple English after the chant.
The key stays in .env. The app never calls ElevenLabs.
"""

from __future__ import annotations

import argparse
import base64
import json
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

from listen_io import (
    ASSETS,
    TTS_MODEL,
    TTS_VOICE,
    eleven_key,
    SIMPLE_VOICE,
    english_file,
    english_text,
    load_catalog,
    load_verses,
    with_simple,
    ramayana_file,
    save_catalog,
    words_from_alignment,
    write_listen_assets,
)


def verse_for_date(verses: list[dict], when: datetime | None = None) -> dict:
    now = when or datetime.now(timezone.utc)
    day = int(datetime(now.year, now.month, now.day, tzinfo=timezone.utc).timestamp() // 86_400)
    index = ((day * 1103515245 + 12345) & 0xFFFFFFFF) % len(verses)
    return verses[index]


def speak(text: str, speed: float) -> dict:
    body = json.dumps(
        {
            "text": text,
            "model_id": TTS_MODEL,
            "voice_settings": {"stability": 0.65, "similarity_boost": 0.55, "speed": speed},
        }
    ).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{TTS_VOICE}/with-timestamps?output_format=mp3_22050_32",
        data=body,
        method="POST",
        headers={"xi-api-key": eleven_key(), "Content-Type": "application/json", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))


def save_mp3(rel: str, payload: dict) -> list[dict]:
    path = ASSETS / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(base64.b64decode(payload["audio_base64"]))
    align = payload.get("alignment") or {}
    return words_from_alignment(
        align.get("characters") or [],
        align.get("character_start_times_seconds") or [],
        align.get("character_end_times_seconds") or [],
    )


def check_key() -> None:
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/user",
        headers={"xi-api-key": eleven_key(), "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        raise SystemExit(f"ElevenLabs HTTP {err.code}. The key in mobile/.env was not accepted.") from err
    sub = data.get("subscription") or {}
    remaining = sub.get("character_limit", 0) - sub.get("character_count", 0)
    print(f"ElevenLabs: ok · {remaining} characters left this period")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref")
    parser.add_argument("--today", action="store_true")
    parser.add_argument("--book", choices=["gita", "ramayana"])
    parser.add_argument("--gita-chapter", type=int)
    parser.add_argument("--english", action="store_true", help="Simple English voice-over after the chant")
    parser.add_argument("--force", action="store_true", help="Rebuild clips even when the file is already on disk")
    parser.add_argument("--chant", action="store_true", help="Spoken IAST for verses with no recording")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check_key()
        return
    if not args.english and not args.chant:
        args.english = True
        args.chant = True
    verses = with_simple(load_verses())
    chosen: list[dict] = []
    if args.today:
        chosen = [verse_for_date(verses)]
    elif args.ref:
        chosen = [row for row in verses if row["ref"] == args.ref]
    elif args.gita_chapter:
        prefix = f"Bhagavad Gita {args.gita_chapter}."
        chosen = [row for row in verses if row["ref"].startswith(prefix)]
    elif args.book:
        chosen = [row for row in verses if row.get("book") == args.book]
    else:
        raise SystemExit("Pass --check, --today, --ref, --gita-chapter, or --book")
    blob = load_catalog()
    made = 0
    for verse in chosen:
        entry = blob["verses"].get(verse["ref"], {})
        did = False
        if args.chant and verse.get("book") != "gita":
            rel = ramayana_file(verse["ref"])
            if not (ASSETS / rel).exists() or args.ref or args.today or args.force:
                text = " ".join(verse.get("transliteration") or verse.get("sanskrit") or [])
                if text.strip():
                    payload = speak(text, 1.0)
                    words = save_mp3(rel, payload)
                    entry.update(
                        {
                            "kind": "spoken",
                            "file": rel,
                            "source": "ElevenLabs spoken reading",
                            "label": "A spoken reading of this verse, not a temple chant.",
                            "model": TTS_MODEL,
                            "voice": TTS_VOICE,
                            "words": words,
                        }
                    )
                    did = True
                    print(f"chant {verse['ref']} -> {rel}", flush=True)
        if args.english:
            text = english_text(verse)
            rel = english_file(verse["ref"])
            stale = entry.get("englishSource") != SIMPLE_VOICE
            if not text:
                print(f"skip english {verse['ref']}: no Simple English")
            elif not (ASSETS / rel).exists() or args.ref or args.today or args.force or stale:
                payload = speak(text, 1.0)
                words = save_mp3(rel, payload)
                entry.update(
                    {
                        "englishFile": rel,
                        "englishSource": SIMPLE_VOICE,
                        "englishLabel": "The meaning after the chant.",
                        "englishModel": TTS_MODEL,
                        "englishVoice": TTS_VOICE,
                        "englishWords": words,
                    }
                )
                did = True
                print(f"english {verse['ref']} -> {rel}", flush=True)
        if did:
            blob["verses"][verse["ref"]] = entry
            save_catalog(blob)
            write_listen_assets(blob)
            made += 1
            if args.limit and made >= args.limit:
                break
            time.sleep(0.35)
    print(f"wrote {made} verses")


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as err:
        raise SystemExit(f"ElevenLabs HTTP {err.code}. The key in mobile/.env was not accepted.") from err
