#!/usr/bin/env python3
"""ElevenLabs speech-to-text for Gita recordings. Writes word timings only."""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request

from listen_io import (
    CATALOG,
    HF_ROWS,
    STT_MODEL,
    eleven_key,
    load_catalog,
    load_verses,
    save_catalog,
    shloka_id_of,
    write_listen_assets,
)


def fetch_audio(offset: int) -> bytes:
    url = f"{HF_ROWS}&offset={offset}&length=1"
    req = urllib.request.Request(url, headers={"User-Agent": "setuHome-listen/1"})
    with urllib.request.urlopen(req, timeout=90) as response:
        page = json.loads(response.read().decode("utf-8"))
    src = page["rows"][0]["row"]["audio"][0]["src"]
    with urllib.request.urlopen(src, timeout=120) as audio:
        return audio.read()


def transcribe(wav: bytes, keyterms: list[str]) -> dict:
    boundary = "----setuhomeListen"
    fields = [
        ("model_id", STT_MODEL),
        ("language_code", "sa"),
        ("timestamps_granularity", "word"),
        ("tag_audio_events", "false"),
        ("num_speakers", "1"),
    ]
    body = b""
    for name, value in fields:
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n".encode()
    if keyterms:
        body += (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"keyterms\"\r\n\r\n"
            + json.dumps(keyterms[:80])
            + "\r\n"
        ).encode()
    body += (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"verse.wav\"\r\n"
        "Content-Type: audio/wav\r\n\r\n"
    ).encode()
    body += wav + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/speech-to-text",
        data=body,
        method="POST",
        headers={
            "xi-api-key": eleven_key(),
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))


def words_of(payload: dict) -> list[dict]:
    out = []
    for item in payload.get("words") or []:
        if item.get("type") and item.get("type") != "word":
            continue
        text = (item.get("text") or "").strip()
        if not text:
            continue
        out.append({"text": text, "start": float(item.get("start") or 0), "end": float(item.get("end") or 0)})
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref", help="One verse ref, exclusive")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()
    blob = load_catalog()
    verses = [row for row in load_verses() if row.get("book") == "gita"]
    if args.ref:
        verses = [row for row in verses if row["ref"] == args.ref]
    done = 0
    for verse in verses:
        entry = blob["verses"].get(verse["ref"])
        if not entry or entry.get("hfOffset") is None:
            continue
        if entry.get("words") and not args.ref:
            continue
        keyterms = [part for line in verse.get("transliteration") or [] for part in line.split() if part][:40]
        try:
            wav = fetch_audio(int(entry["hfOffset"]))
            payload = transcribe(wav, keyterms)
        except urllib.error.HTTPError as err:
            print(f"skip {verse['ref']}: HTTP {err.code}", flush=True)
            if err.code in {401, 403}:
                raise SystemExit("ElevenLabs rejected the key. Put a working ELEVENLABS_API_KEY in mobile/.env")
            time.sleep(2)
            continue
        entry["words"] = words_of(payload)
        entry["sttModel"] = STT_MODEL
        blob["verses"][verse["ref"]] = entry
        save_catalog(blob)
        done += 1
        print(f"transcribed {verse['ref']} ({len(entry['words'])} words)", flush=True)
        if args.limit and done >= args.limit:
            break
        time.sleep(0.4)
    write_listen_assets(blob)
    print(f"wrote {CATALOG}")


if __name__ == "__main__":
    main()
