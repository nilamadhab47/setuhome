#!/usr/bin/env python3
"""Checks for Simple English mapping, attribution, validation, and fallback."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

from simple_english import (
    PROMPT_VERSION,
    original_work,
    should_generate,
    validate_simple,
)

ROOT = Path(__file__).resolve().parents[1]
VERSES = ROOT / "src" / "verses.json"
SIMPLE = ROOT / "src" / "simple-english.json"


class ValidateTests(unittest.TestCase):
    def test_accepts_a_plain_rewrite(self) -> None:
        source = (
            "Your business is with action alone; not by any means with fruit. "
            "Let not the fruit of action be your motive (to action)."
        )
        out = validate_simple(
            {
                "simple_english": "You can choose what you do. You cannot control everything that happens because of it.",
                "key_idea": "",
                "context_note": "",
                "difficult_terms": [],
                "needs_review": False,
                "prompt_version": PROMPT_VERSION,
            },
            source,
        )
        self.assertTrue(out["simpleEnglish"])
        self.assertEqual(out["promptVersion"], PROMPT_VERSION)
        self.assertFalse(out["needsReview"])

    def test_rejects_copy_of_source(self) -> None:
        source = "You have a right to the action alone, never to its fruits."
        with self.assertRaises(ValueError):
            validate_simple(
                {
                    "simple_english": source,
                    "key_idea": "",
                    "context_note": "",
                    "difficult_terms": [],
                    "needs_review": False,
                    "prompt_version": PROMPT_VERSION,
                },
                source,
            )

    def test_rejects_deity_voice(self) -> None:
        with self.assertRaises(ValueError):
            validate_simple(
                {
                    "simple_english": "I am Krishna and you must worship me today.",
                    "key_idea": "",
                    "context_note": "",
                    "difficult_terms": [],
                    "needs_review": False,
                    "prompt_version": PROMPT_VERSION,
                },
                "Know me to be the lord of all.",
            )

    def test_rejects_short_or_wrong_prompt(self) -> None:
        with self.assertRaises(ValueError):
            validate_simple(
                {
                    "simple_english": "Be good.",
                    "key_idea": "",
                    "context_note": "",
                    "difficult_terms": [],
                    "needs_review": False,
                    "prompt_version": PROMPT_VERSION,
                },
                "A long sourced line about duty and fruit.",
            )
        with self.assertRaises(ValueError):
            validate_simple(
                {
                    "simple_english": "You can choose what you do, and that is the whole teaching here.",
                    "key_idea": "",
                    "context_note": "",
                    "difficult_terms": [],
                    "needs_review": False,
                    "prompt_version": "other",
                },
                "Your business is with action alone.",
            )


class MappingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.verses = json.loads(VERSES.read_text(encoding="utf-8"))
        cls.simple = json.loads(SIMPLE.read_text(encoding="utf-8")) if SIMPLE.exists() else {"verses": {}}
        cls.by_ref = {row["ref"]: row for row in cls.verses}

    def test_gita_247_keeps_telang_attribution(self) -> None:
        row = self.by_ref["Bhagavad Gita 2.47"]
        self.assertEqual(row["book"], "gita")
        self.assertIn("action alone", row["english"].lower())
        self.assertIn("Telang", row.get("englishSource") or "")
        self.assertEqual(original_work("gita"), "Sacred Books of the East, vol. 8 (1882)")

    def test_missing_english_is_not_generated(self) -> None:
        empty = next(row for row in self.verses if not row.get("english"))
        self.assertEqual(should_generate(empty, None), "no sourced english")

    def test_locked_and_existing_are_skipped(self) -> None:
        verse = {"english": "A sourced line long enough to keep.", "ref": "x"}
        self.assertEqual(should_generate(verse, {"locked": True}), "locked")
        self.assertEqual(
            should_generate(
                verse,
                {"promptVersion": PROMPT_VERSION, "simpleEnglish": "You can choose what you do today."},
            ),
            "already generated",
        )

    def test_sidecar_keys_match_verse_refs(self) -> None:
        unknown = [ref for ref in self.simple.get("verses", {}) if ref not in self.by_ref]
        self.assertEqual(unknown[:5], [])

    def test_fallback_does_not_invent_simple_english(self) -> None:
        for row in self.verses:
            simple = self.simple.get("verses", {}).get(row["ref"])
            if simple:
                self.assertTrue(row.get("english"), msg=row["ref"])
                self.assertNotEqual(
                    (simple.get("simpleEnglish") or "").strip().lower(),
                    row["english"].strip().lower(),
                    msg=row["ref"],
                )


if __name__ == "__main__":
    unittest.main()
