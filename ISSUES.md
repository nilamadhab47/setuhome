# Work order

Follow this list from the top. Each issue starts when the one above it is done, except where it says it can run beside another. Decisions are in `MVP.md` (10 Oct 2026). The screens to match are in `design-system/public/stitch/`.

The first release does not charge. No subscription, no ads, no family price. Use the free sources in `SOURCES.md`. Paid APIs are a later switch, not work on this list. The Star Publications scan, `279.pdf`, is not a text source.

The app shell is `mobile/`. The public site is `site/`. Run the app with `pnpm web` inside `mobile/`.

## 01. App shell

Done. Expo SDK 57, Sacred Editorial colors and type, and the five tabs from the designs: Today, Guidance, Stories, Festivals, Read. Today shows the verse card, the dawn art, a streak count, and Diwali without a guessed date.

## 02. Today, matching the screen

Done. Today greets by the time of day, without a sample name. Listen, share, and save are on the verse card. Save stays on this phone. The festival card opens Festivals, and the bedtime card opens Stories. The streak stays. No tithi, countdown, or muhurat is printed until a city returns one. The focus question is not on this screen.

## 03. The daily verse

Done. Today picks one verse for the calendar day from a local file of 701 Gita shlokas and 23,334 Ramayana shlokas. There is no book picker and no mood match. Sanskrit and transliteration are stored. Gita text comes from `verse.json` in the local archive (not the Swami translations). Ramayana Sanskrit comes from Ramayana_Book / Wikisource. English is filled in issue 04.

## 04. English from a source, not a model

Done. Gita English is Kashinath Trimbak Telang, 1882 (Sacred Books of the East, vol. 8), matched by chapter and verse. Ramayana English is M. N. Dutt, 1891–94, from the Itihāsa dump of that book, matched to the Wikisource shloka. Ramayana_Book `translations/en/` is not used: that folder mixes Dutt with IIT Kanpur and Gyaandweep. A verse with no reliable match still shows Sanskrit and transliteration only. `279.pdf` is not used. The Bhagavad Gita API is not in the verse file.

## 04b. Simple English

Done as the default reading on Today, labeled **In everyday words** on the card. A versioned offline job (`mobile/scripts/simplify-verses.py`) rewrites a sourced line into Simple English and stores it in `mobile/src/simple-english.json`. The app never calls Anthropic. Sanskrit and transliteration stay on the card. Show Original Translation / Hide Original Translation reveals Telang or Dutt with the work title. Missing Simple English uses a fallback. Manual locks are kept. The Gita file is complete (697 of 697 sourced verses). Ramayana Simple English is partial; resume with `python3 scripts/simplify-verses.py --book ramayana`.

## 05. Read

Done. The Read tab lists Gita adhyāyas and Ramayana kāṇḍas (then sargas). Default sort is local opens over a seed of well-known chapters; In order is canonical. Mood chips filter Gita chapters and do not sort. Search opens a verse in the reader. Simple English and the original toggle are the same block as Today. Continue remembers the last opened verse on this phone.

## 05b. Listen

Done as playback on Today and the verse reader. Gita Listen plays the Apache recording set (`JDhruv14/Bhagavad-Gita_Audio`), fetched by verse, never bundled as raw WAV, and is played a little faster than the source tape. After the chant ends, the everyday-words reading is spoken if that clip has been generated offline (`speak-verses.py --english`). Words highlight in the transliteration during the chant, then in the everyday-words block during the voice-over. The label is a recording or a spoken reading, not a named pandit. Ramayana verses with no recording use an ElevenLabs spoken reading of the transliteration. The key stays in `mobile/.env`. The phone never calls ElevenLabs. A verse with no clip still says the chant is not on the phone.

## 06. Onboarding

Done. Welcome, city, and the morning time. Three steps. City and time stay on this phone. Festival clocks are not printed. The focus screen stays in the design file and is not in this flow. That question is issue 18.

## 07. Streaks

Done. Opening Today on a local calendar day counts a morning. Consecutive days add to the run; a missed day starts again at 1. Today shows the count and opens the path screen. Hitting 7, 21, 40, or 108 opens that screen once. The count stays on this phone.

## 08. Reminders

Done. One daily local notification at the morning time from onboarding. The copy does not invent a verse. Festival, tithi, sunset, bedtime, and muhurat alerts wait for issue 09. A time that is not returned is not shown.

## 09. City API

Done. Sunrise, tithi, and festival days come from `@ishubhamx/panchangam-js` (Hindu-Panchangam-Legal, MIT) for the chosen city. Coordinates ship in `mobile/src/cities.json`; a typed name that is not on that list is looked up with Open-Meteo geocoding (no key on the device). A time that is not returned is not shown. A temple may keep another day. The host can move the household date on Festivals.

## 10. Diwali guide

Done. Five days at home (Dhanteras through Bhai Dooj) for the household city, with dates and a clock only when the calendar returns them. The home list is what to set out, not a copied temple vidhi. A temple may keep another evening. Drik Panchang Lakshmi puja steps stay out until a written grant is filed.

## 11. Satyanarayan

Done. One named tradition: Home Satyanarayan. Six steps in order (gather, lamp, sankalpa, katha, aarti, prasad). Next and previous wrap, so they always work. The sequence is original household copy, not a pasted temple vidhi. The namaskara on the katha step is the traditional ॐ नमो भगवते सत्यनारायणाय. The host still reads the katha from the book at home. Divine Sansar / Vaidic Pujas / Drik steps stay out until a written grant is filed.

## 12. Guest link

A page for the ceremony and for Diwali puja. No install. The host’s copy works offline.

## 13. Guidance

The chat from the designs. The first release does not charge, so the whole conversation is available. Prefer an open-source model finetuned on the Gita and the Ramayana. Every answer cites a verse and stays inside those texts. Replace the sample reply that comforts someone about their children.

## 14. Stories

Little Setu and the story player, as designed, including bedtime audio. Story text is Ryder’s Panchatantra (1925). Narration is Sarvam, with the key on a server.

## 15. Account

Profile only. This release has no price, no trial, and no family charge. The membership screen stays in the design file. When a price is added later, swap any non-monetized source using `SOURCES.md`.

## 16. Languages

English first. Then Hindi, Gujarati, and Tamil as display options for the verses, from sourced text.

## 17. Artwork

Keep the art that is already in the screens. Generate further images with Nano Banana Pro. A person reviews each image before it ships.

## 18. The focus question

After the app is in people’s hands, ask whether “what would you like help with?” should ship. Yes or no. Until then it stays out of onboarding.

## 19. Landing page

The public site is the Next.js app in `web/`. Run it with `pnpm dev` inside `web/`. Home, features, festivals, for kids, scripture, FAQ, privacy, terms, and contact are pages. The homepage phone is a full device, including on a narrow screen. The waitlist confirms on the page and keeps the address in that browser.

The app is described as free. Festival clocks are not printed. The guidance sample cites Bhagavad Gita 2.47 and does not speak as Krishna.
