#!/usr/bin/env python3
"""Catalog counts, grouping, and popularity sort for the Read tab."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSES = json.loads((ROOT / "src" / "verses.json").read_text())

GITA_SEED = {
    1: 11,
    2: 18,
    3: 14,
    4: 10,
    5: 8,
    6: 12,
    7: 9,
    8: 7,
    9: 13,
    10: 6,
    11: 15,
    12: 17,
    13: 5,
    14: 4,
    15: 8,
    16: 3,
    17: 2,
    18: 16,
}
KANDA_SEED = {
    "Bala": 14,
    "Ayodhya": 12,
    "Aranya": 10,
    "Kishkindha": 8,
    "Sundara": 18,
    "Yuddha": 16,
    "Uttara": 6,
}
KANDA_ORDER = ["Bala", "Ayodhya", "Aranya", "Kishkindha", "Sundara", "Yuddha", "Uttara"]


def place(row: dict) -> tuple[str, int, int]:
    numbers = [int(part) for part in row["ref"].split(" ")[-1].split(".") if part.isdigit()]
    if row["book"] == "gita":
        return ("gita", numbers[0], numbers[1] if len(numbers) > 1 else 1)
    return (row.get("kanda") or "Bala", numbers[1] if len(numbers) > 1 else 1, numbers[2] if len(numbers) > 2 else 1)


def gita_chapters() -> dict[int, list]:
    buckets: dict[int, list] = {}
    for row in VERSES:
        if row["book"] != "gita":
            continue
        chapter = place(row)[1]
        buckets.setdefault(chapter, []).append(row)
    return buckets


def ramayana_kandas() -> dict[str, list]:
    buckets: dict[str, list] = {}
    for row in VERSES:
        if row["book"] != "ramayana":
            continue
        buckets.setdefault(row.get("kanda") or "Bala", []).append(row)
    return buckets


def popular_ids(items: list[tuple[str, int]], opens: dict[str, int], seeds: dict[str, int]) -> list[str]:
    def score(item_id: str) -> tuple[int, int]:
        chapter = int(item_id.rsplit(":", 1)[-1]) if item_id.rsplit(":", 1)[-1].isdigit() else 0
        return (-((opens.get(item_id) or 0) * 1000 + seeds.get(item_id, 0)), chapter)

    return [item_id for item_id, _ in sorted(items, key=lambda item: score(item[0]))]


class LibraryTests(unittest.TestCase):
    def test_gita_has_eighteen_adhyayas(self) -> None:
        chapters = gita_chapters()
        self.assertEqual(sorted(chapters), list(range(1, 19)))
        self.assertTrue(all(chapters[n] for n in range(1, 19)))

    def test_ramayana_has_seven_kandas(self) -> None:
        kandas = ramayana_kandas()
        self.assertEqual(set(kandas), set(KANDA_ORDER))
        self.assertTrue(all(kandas[name] for name in KANDA_ORDER))

    def test_gita_popular_starts_with_well_known_chapters(self) -> None:
        items = [(f"gita:{n}", n) for n in range(1, 19)]
        seeds = {f"gita:{n}": GITA_SEED[n] for n in range(1, 19)}
        order = popular_ids(items, {}, seeds)
        self.assertEqual(order[:4], ["gita:2", "gita:12", "gita:18", "gita:11"])

    def test_opens_outrank_seed(self) -> None:
        items = [(f"gita:{n}", n) for n in range(1, 19)]
        seeds = {f"gita:{n}": GITA_SEED[n] for n in range(1, 19)}
        order = popular_ids(items, {"gita:17": 1}, seeds)
        self.assertEqual(order[0], "gita:17")
        self.assertEqual(order[1], "gita:2")

    def test_ramayana_popular_starts_with_sundara(self) -> None:
        items = [(f"ramayana:{name}", i) for i, name in enumerate(KANDA_ORDER, start=1)]
        seeds = {f"ramayana:{name}": KANDA_SEED[name] for name in KANDA_ORDER}
        order = popular_ids(items, {}, seeds)
        self.assertEqual(order[:3], ["ramayana:Sundara", "ramayana:Yuddha", "ramayana:Bala"])

    def test_group_counts_cover_the_books(self) -> None:
        gita = [row for row in VERSES if row["book"] == "gita"]
        ramayana = [row for row in VERSES if row["book"] == "ramayana"]
        self.assertEqual(sum(len(rows) for rows in gita_chapters().values()), len(gita))
        self.assertEqual(sum(len(rows) for rows in ramayana_kandas().values()), len(ramayana))


if __name__ == "__main__":
    unittest.main()
