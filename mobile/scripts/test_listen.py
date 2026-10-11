#!/usr/bin/env python3
"""Listen catalog mapping, alignment words, and Gita/Ramayana split."""

from __future__ import annotations

import unittest

from listen_io import english_file, english_text, gita_ref, shloka_id_of, words_from_alignment


class ListenTests(unittest.TestCase):
    def test_gita_ref_round_trip(self) -> None:
        self.assertEqual(gita_ref(2, 47), "Bhagavad Gita 2.47")
        self.assertEqual(shloka_id_of("Bhagavad Gita 2.47"), "2_47")
        self.assertIsNone(shloka_id_of("Valmiki Ramayana 6.40.23"))

    def test_alignment_groups_characters_into_words(self) -> None:
        chars = list("karmaṇy evā")
        starts = [i * 0.1 for i in range(len(chars))]
        ends = [s + 0.1 for s in starts]
        words = words_from_alignment(chars, starts, ends)
        self.assertEqual([word["text"] for word in words], ["karmaṇy", "evā"])
        self.assertLess(words[0]["start"], words[1]["start"])

    def test_english_uses_simple_english_only(self) -> None:
        self.assertEqual(english_file("Bhagavad Gita 2.1"), "english/gita/2.1.mp3")
        self.assertEqual(english_file("Valmiki Ramayana 6.40.23"), "english/ramayana/6.40.23.mp3")
        self.assertEqual(english_text({"english": "  To him, who was thus overcome  "}), "")
        self.assertEqual(english_text({"simple": {"simpleEnglish": "  A rewrite  "}}), "A rewrite")


if __name__ == "__main__":
    unittest.main()
