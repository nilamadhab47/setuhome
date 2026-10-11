#!/usr/bin/env python3
"""Map Gita verses to Hugging Face recording offsets. No API key."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.request

from listen_io import HF_ROWS, gita_ref, load_catalog, load_verses, save_catalog, write_listen_assets

PAGE = 50


def fetch_page(offset: int) -> dict:
    url = f"{HF_ROWS}&offset={offset}&length={PAGE}"
    req = urllib.request.Request(url, headers={"User-Agent": "setuHome-listen/1"})
    with urllib.request.urlopen(req, timeout=90) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    known = {row["ref"] for row in load_verses() if row.get("book") == "gita"}
    blob = load_catalog()
    offset = 0
    seen = 0
    while True:
        try:
            page = fetch_page(offset)
        except urllib.error.HTTPError as err:
            if err.code in {429, 500, 502, 503}:
                time.sleep(4)
                continue
            raise
        rows = page.get("rows") or []
        if not rows:
            break
        for item in rows:
            row = item.get("row") or {}
            shloka = str(row.get("shloka_id") or "")
            parts = shloka.split("_")
            if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit():
                offset += 1
                continue
            ref = gita_ref(int(parts[0]), int(parts[1]))
            if ref in known:
                entry = blob["verses"].get(ref, {})
                entry.update(
                    {
                        "kind": "recording",
                        "shlokaId": shloka,
                        "hfOffset": int(item.get("row_idx", offset)),
                        "source": "JDhruv14/Bhagavad-Gita_Audio",
                        "label": "A recording of this verse.",
                    }
                )
                blob["verses"][ref] = entry
                seen += 1
            offset += 1
        print(f"offset {offset} mapped {seen}", flush=True)
        if len(rows) < PAGE:
            break
        time.sleep(0.4)
    save_catalog(blob)
    write_listen_assets(blob)
    print(f"gita recordings in catalog: {sum(1 for row in blob['verses'].values() if row.get('kind')=='recording')}")


if __name__ == "__main__":
    main()
