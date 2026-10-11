# setuHome

A family-first Hindu practice app for the Indian diaspora: a daily verse from the Bhagavad Gita or the Valmiki Ramayana, a library to read both books, and (next) festival dates for the city you live in.

The working name on the screens is **setuHome**. The public name is still open.

The first release does not charge. No subscription, no ads, no in-app purchase.

## What it is

setuHome is built for households outside India who want the verse on the card to be correct, attributed, and usable in English without inventing a translation at runtime.

- **Today** draws one verse for the calendar day from 701 Gita shlokas and 23,334 Ramayana shlokas. There is no book picker and no mood match.
- **Sanskrit and IAST** stay on the card.
- **English** is a sourced translator: Kashinath Trimbak Telang (1882) for the Gita, M. N. Dutt (1891–94) for the Ramayana. A verse with no reliable match shows Sanskrit only.
- **In everyday words** is an offline, labeled explanation of that sourced line. It is not the translator’s wording. The original line is one tap away.
- **Listen** plays a Gita recording, then (where a clip has been generated) the everyday-words voice. The phone never calls a model or a TTS API.
- **Read** lists Gita adhyāyas and Ramayana kāṇḍas. Search opens a verse. Continue remembers the last opened verse on this phone.

Guidance, stories, festival clocks, onboarding, and accounts are designed and listed in the work order. They are not in the running app yet.

The app does not speak as a deity. Guidance, when it ships, must cite a verse and stay inside the Gita and the Ramayana.

## Status

| Area | State |
| --- | --- |
| App shell (Expo, five tabs, Sacred Editorial type) | Done |
| Today: greeting, verse, share, save, streak count | Done |
| Daily verse from the local file | Done |
| Telang / Dutt English | Done |
| Everyday-words reading (Gita complete; Ramayana partial) | Done |
| Read: chapters, sargas, search, continue | Done |
| Listen: Gita recordings + everyday-words voice-over | Done (voice clips for Gita chapters 2 and 12, and today’s Ramayana fill-in) |
| Marketing site (`web/`) | Done as a waitlist |
| Onboarding, city timings, Diwali guide, Satyanarayan, guidance, stories | Not started — see [`ISSUES.md`](ISSUES.md) |

Decisions live in [`MVP.md`](MVP.md). Text and recording sources live in [`SOURCES.md`](SOURCES.md). The screens to match are in `design-system/public/stitch/`.

## Repository layout

```
setuHome/
├── mobile/           Expo app (iOS, Android, web preview)
├── web/              Next.js waitlist site
├── design-system/    Stitch exports and a local preview
├── site/             Earlier static landing sketch
├── ISSUES.md         Work order, in sequence
├── MVP.md            Product lock
└── SOURCES.md        What we may copy, what we must not
```

API keys belong in `mobile/.env` (gitignored). They are never bundled into the app.

## Requirements

- Node 20+
- [pnpm](https://pnpm.io) 10
- Xcode / Android Studio if you run a simulator
- Python 3.12+ only if you rebuild verses, Simple English, or Listen clips

## Run the app

```bash
cd mobile
pnpm install
pnpm start          # Expo; then iOS, Android, or web
# or
pnpm ios
pnpm android
pnpm web            # http://localhost:8081
```

Copy `mobile/.env` locally if you will run the **offline** jobs. The running app does not read that file.

```
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
```

## Run the site

```bash
cd web
pnpm install
pnpm dev            # http://localhost:3000
```

Privacy and terms are routes on that site. The waitlist stores an address in the browser in this build; it is not a production backend.

## Design preview

```bash
cd design-system
pnpm install
pnpm dev            # Vite, Stitch HTML in public/stitch/
```

## Verse file

The app reads one local file, `mobile/src/verses.json`, plus `mobile/src/simple-english.json`. Rebuild from `mobile/`:

```bash
python3 scripts/build-verses.py
python3 scripts/simplify-verses.py --book gita
python3 scripts/simplify-verses.py --book ramayana   # resume; Ramayana is partial
```

Gita Sanskrit and IAST come from the public-domain rows aligned to the 701-verse audio set, not from modern commentaries. Ramayana Sanskrit comes from Wikisource via [Ramayana_Book](https://github.com/svenkatreddy/Ramayana_Book) (Sanskrit only). Telang and Dutt dumps sit in `mobile/data/`.

Do not load `279.pdf` (Star Publications, 1993). It is not a text source and is not in this repository.

## Listen

Gita chant audio is **not** vendored as WAV. The app fetches the verse recording from [JDhruv14/Bhagavad-Gita_Audio](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Audio) (Apache-2.0) using offsets in `mobile/src/listen-catalog.json`.

Everyday-words speech is generated **offline** with ElevenLabs and bundled as small mp3 files. The device never holds the key.

From `mobile/`:

```bash
python3 scripts/build-listen-catalog.py
python3 scripts/speak-verses.py --check
python3 scripts/speak-verses.py --english --gita-chapter 2
python3 scripts/speak-verses.py --english --today
python3 scripts/transcribe-listen.py          # optional word timings for recordings
```

A Ramayana verse with no recording may get a spoken reading of the transliteration. That clip is labeled as not a temple chant.

Listen is wired on **Today** and in the **Read** verse reader. Words highlight in the transliteration during the chant, then in the everyday-words block during the voice-over.

## Rules that do not move

- Do not invent verse text, translations, or festival clock times.
- Do not ship modern commentaries (Chinmayananda, Prabhupada, Sivananda, and the rest listed in `SOURCES.md`).
- Do not call Anthropic or ElevenLabs from the client.
- Do not speak as Krishna, Rama, or any deity.
- A GitHub licence on this repo licenses the **code**. It does not license a copyrighted translation in a JSON file.

## Contributing

Work follows [`ISSUES.md`](ISSUES.md) from the top. TypeScript is strict. Do not commit `.env` or `279.pdf`.

If you add English, name the translator and the edition. If you add a festival time, it has to come from an API the app already uses — empty is better than a guess.

## Licence

Original code is [MIT](LICENSE).

| Material | Terms |
| --- | --- |
| App, site, and scripts in this repository | MIT |
| Gita English (Telang, 1882) | Public domain |
| Ramayana English (Dutt, 1891–94) | Public domain |
| Ramayana Sanskrit (Wikisource) | Source licence as documented in `SOURCES.md` |
| Gita verse recordings | Apache-2.0, [Bhagavad-Gita_Audio](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Audio) |
| Everyday-words explanations | Generated offline; labeled in the UI as not a translator’s words |
| Stitch design HTML | Use as product direction in this repo; do not treat third-party design tools as a text source |

Full tables, including works we will not ship, are in [`SOURCES.md`](SOURCES.md).
