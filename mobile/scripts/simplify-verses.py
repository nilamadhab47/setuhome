#!/usr/bin/env python3
"""Generate Simple English offline. The app never calls this."""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from pathlib import Path

from simple_english import (
    MODEL,
    PROMPT_VERSION,
    SYSTEM_PROMPT,
    TOOL,
    should_generate,
    user_prompt,
    validate_simple,
)

ROOT = Path(__file__).resolve().parents[1]
VERSES = ROOT / "src" / "verses.json"
OUT = ROOT / "src" / "simple-english.json"
ENV = ROOT / ".env"
API = "https://api.anthropic.com/v1/messages"


def load_env() -> None:
    if not ENV.exists():
        return
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def load_sidecar() -> dict:
    if not OUT.exists():
        return {"promptVersion": PROMPT_VERSION, "verses": {}}
    blob = json.loads(OUT.read_text(encoding="utf-8"))
    blob.setdefault("promptVersion", PROMPT_VERSION)
    blob.setdefault("verses", {})
    return blob


def save_sidecar(blob: dict) -> None:
    tmp = OUT.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(blob, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(OUT)


def neighbors(rows: list[dict], index: int) -> tuple[dict | None, dict | None]:
    row = rows[index]
    prev = rows[index - 1] if index > 0 else None
    nxt = rows[index + 1] if index + 1 < len(rows) else None

    def same_stretch(other: dict | None) -> dict | None:
        if not other or other.get("book") != row.get("book"):
            return None
        if row.get("book") == "ramayana" and other.get("kanda") != row.get("kanda"):
            return None
        left = row["ref"].rsplit(".", 1)[0]
        right = other["ref"].rsplit(".", 1)[0]
        return other if left == right else None

    return same_stretch(prev), same_stretch(nxt)


def call_model(key: str, verse: dict, previous: dict | None, following: dict | None) -> dict:
    body = {
        "model": MODEL,
        "max_tokens": 700,
        "temperature": 0.2,
        "system": [
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        "tools": [TOOL],
        "tool_choice": {"type": "tool", "name": "save_simple_english"},
        "messages": [{"role": "user", "content": user_prompt(verse, previous, following)}],
    }
    last_error: Exception | None = None
    extra = ""
    for round_no in range(2):
        body["messages"] = [
            {
                "role": "user",
                "content": user_prompt(verse, previous, following) + extra,
            }
        ]
        request = urllib.request.Request(
            API,
            data=json.dumps(body).encode(),
            headers={
                "content-type": "application/json",
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )
        payload = None
        for attempt in range(6):
            try:
                with urllib.request.urlopen(request, timeout=90) as response:
                    payload = json.loads(response.read().decode())
                break
            except urllib.error.HTTPError as error:
                last_error = error
                detail = error.read().decode("utf-8", "replace")[:400]
                if error.code in {408, 429, 500, 529} and attempt < 5:
                    time.sleep(1.5 * (2**attempt))
                    continue
                raise RuntimeError(f"Anthropic {error.code}: {detail}") from error
            except (urllib.error.URLError, TimeoutError) as error:
                last_error = error
                if attempt < 5:
                    time.sleep(1.5 * (2**attempt))
                    continue
                raise
        if payload is None:
            raise RuntimeError(last_error)
        for block in payload.get("content") or []:
            if block.get("type") != "tool_use" or block.get("name") != "save_simple_english":
                continue
            try:
                checked = validate_simple(block.get("input") or {}, verse["english"])
            except ValueError as error:
                last_error = error
                extra = "\n\nRewrite in the third person. Do not use I for a deity."
                break
            checked["model"] = payload.get("model") or MODEL
            checked["generatedAt"] = date.today().isoformat()
            checked["source"] = verse.get("englishSource") or ""
            return checked
        else:
            last_error = RuntimeError("model did not return save_simple_english")
            extra = "\n\nCall save_simple_english with third-person Simple English."
    raise RuntimeError(last_error)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--book", choices=["gita", "ramayana", "all"], default="all")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--ref", action="append", default=[])
    args = parser.parse_args()
    load_env()
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key:
        raise SystemExit("ANTHROPIC_API_KEY is missing. Put it in mobile/.env; do not commit it.")

    rows: list[dict] = json.loads(VERSES.read_text(encoding="utf-8"))
    by_ref = {row["ref"]: i for i, row in enumerate(rows)}
    sidecar = load_sidecar()
    existing = sidecar["verses"]

    wanted: list[int] = []
    if args.ref:
        for ref in args.ref:
            index = by_ref.get(ref)
            if index is None:
                raise SystemExit(f"unknown ref: {ref}")
            wanted.append(index)
    else:
        for index, row in enumerate(rows):
            if args.book != "all" and row.get("book") != args.book:
                continue
            wanted.append(index)

    jobs: list[int] = []
    skipped = 0
    for index in wanted:
        row = rows[index]
        reason = should_generate(row, existing.get(row["ref"]), force=args.force)
        if reason:
            skipped += 1
            continue
        jobs.append(index)
        if args.limit and len(jobs) >= args.limit:
            break

    print(f"generate {len(jobs)} skip {skipped} model {MODEL}", flush=True)
    if not jobs:
        return

    done = 0
    failed = 0

    def work(index: int) -> tuple[str, dict]:
        row = rows[index]
        previous, following = neighbors(rows, index)
        return row["ref"], call_model(key, row, previous, following)

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(work, index): index for index in jobs}
        for future in as_completed(futures):
            index = futures[future]
            ref = rows[index]["ref"]
            try:
                saved_ref, record = future.result()
                existing[saved_ref] = record
                done += 1
                print(f"ok {done}/{len(jobs)} {saved_ref}", flush=True)
            except Exception as error:
                failed += 1
                print(f"fail {ref}: {error}", file=sys.stderr, flush=True)
            if (done + failed) % 20 == 0:
                sidecar["verses"] = existing
                sidecar["promptVersion"] = PROMPT_VERSION
                save_sidecar(sidecar)

    sidecar["verses"] = existing
    sidecar["promptVersion"] = PROMPT_VERSION
    save_sidecar(sidecar)
    print(f"wrote {OUT} ok={done} fail={failed} stored={len(existing)}")


if __name__ == "__main__":
    main()
