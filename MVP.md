# MVP

Updated 10 Oct 2026. The Stitch screens in `design-system/public/stitch/` are the product direction. Improve them. Do not strip them back to the smaller 9 Oct lock. Where this file and that lock disagree, this file wins.

## Direction

Sacred Editorial, as exported: parchment, indigo type, marigold used sparingly, EB Garamond, DM Sans, Noto Serif. The working name on the screens stays **setuHome**. The name is still open. The earlier check found other products using Setu, so a trademark look is still unfinished.

The onboarding question “what would you like help with?” does not ship until customers have been asked, yes or no. It stays in the design file as a later test.

## What changed from the 9 Oct lock

- Streaks are in. Today can show the run. The seven-morning screen stays.
- Guidance is in. A small allowance is free. The full conversation is on the pro plan.
- Artwork stays, and it can be generated. Nano Banana Pro is the tool. A person reviews an image before it ships. The art is there to give the app life.
- Home does not ask Gita, Ramayana, or both. A verse is drawn from both.
- The library can sort by popularity. It does not have to sort by mood. The mood chips in the design are not a rule.
- Cities and festival timings come from an open API, not only from eight hand-checked cities.
- Stories, accounts, the design’s prices, the microphone, Hindi / Gujarati / Tamil, and the extra alerts follow the designs. They are no longer parked.

## Home

One verse, on the card the design already has: Sanskrit, transliteration, a plain-English rendering, the reference, and the artwork.

The verse is taken from the Bhagavad Gita and the Valmiki Ramayana. The person does not pick the book, and the verse is not matched to a mood. Popularity can influence what surfaces in the library.

The reading on the card is Simple English: a labeled AI explanation of a sourced translation (Telang 1882 for the Gita, Dutt 1891–94 for the Ramayana). It is written offline and stored with the verse. The phone does not call a model. The original translator’s wording is one tap away. A verse with no sourced English shows Sanskrit and transliteration only. A verse with sourced English but no Simple English yet says so, and does not invent a line at runtime.

## Streaks

The design’s streak stays: a count on Today, the seven-morning milestone, and the longer marks (21, 40, 108) on that screen.

## Guidance

A conversation, as in the designs, with two limits.

- The first release does not charge, so guidance is not split into a free allowance and a pro plan.
- Prefer an open-source model, finetuned on the Gita and the Ramayana, if that holds up in practice.
- An answer stays inside those texts and their understanding. It cites the verse. It does not speak as Krishna, Rama, or any deity, and it does not become open counseling.

The sample reply in the export, the one that comforts someone about their children and assigns a breathing exercise, gets rewritten so the answer is the verse and what that verse says.

## Artwork

Use the art. Generate more with Nano Banana Pro when a screen needs it. Review it before it ships.

## Festivals and cities

The festival screens follow the designs: Diwali’s five days, the puja guide, Karva Chauth, and timings for the person’s city.

Those timings come from an open API. The dates and clock times printed in the current export, including 8 November 2024 and the minute windows, are layout copy until an API returns them. The app does not invent a time the API did not return.

A temple may still observe another day. The host can move the household date.

## Reading

The Gita is in the app as a chapter list, as the design shows. The Ramayana is in the same library. Search can include a microphone, as the design shows.

Sorting is flexible. The default lean is popularity, because that is what gets opened. Mood tags are optional, not the rule.

## What the designs already include, and we are keeping

- Stories and Little Setu, including bedtime audio.
- An account and a profile. Family seats stay in the design and are not sold yet.
- No price on the first release. No subscription, no trial, no family charge. The membership screen can stay in the design file. Guidance is open to everyone until a price exists.
- Hindi, Gujarati, and Tamil as scripture display options. English is the first interface.
- Alerts beyond the morning verse: festival and tithi, a sunset reflection, bedtime for kids, and a chime at a muhurat the API returned.

## Public site

The second Stitch export is the setuHome landing page, for desktop and for a phone. It is a waitlist for iOS and Android. The pages to build are the full desktop page and the full mobile page. Two shorter desktop files in that export are earlier cuts of the same page.

## Still in the product, still missing from the screens

These were decided earlier and were not cancelled. The designs need a screen for each.

- Satyanarayan, one named tradition, steps in order, reviewed before they are shown. Next and previous always work.
- A guest link for that ceremony and for Diwali puja. No install. The host’s copy works offline.

## Still to decide

- The public name. setuHome stays on the designs until a decision replaces it.
- Whether the “what would you like help with?” step is kept, after a customer yes or no.
- Which open-source model is finetuned, and which API supplies the city timings.
- Which single tradition the Satyanarayan and Diwali guides follow.
- How much of the Ramayana Simple English file is ready for the first store build. The Gita can be finished first. The original Telang and Dutt lines stay either way.

## First release is free

The app does not charge. No subscription, no in-app purchase, no ads. While that is true, a source whose own terms say non-monetized or non-commercial may be called.

Each of those calls sits behind one switch. When a price is added, the switch moves to a source in the “stays after a price” list in `SOURCES.md`. The screens do not change.

Speech uses ElevenLabs where we have no recording. The key stays on a server. The Gita verse clips from the Apache audio set stay the Listen audio for those 701 verses, because that set can remain after a price.
