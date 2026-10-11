# Sources

Reviewed 10 Oct 2026. These repositories are references. setuHome keeps its own verse file. A GitHub licence licenses the code. It does not license a copyrighted translation sitting in the data.

Sanskrit of the Gita and the Valmiki Ramayana can be stored. English on a verse is a sourced translation, not model output. Commentaries by modern writers stay out unless a written licence from that writer is in this folder.

## Use

| Source | What we take | Why |
| --- | --- | --- |
| [svenkatreddy/Ramayana_Book](https://github.com/svenkatreddy/Ramayana_Book) | Sanskrit from Sanskrit Wikisource only. Do not take `translations/en/`. | That English folder mixes Dutt with IIT Kanpur and Gyaandweep. |
| [rahular/itihasa](https://github.com/rahular/itihasa) `res/ramayana.json` | M. N. Dutt Ramayana English, 1891–1894, copied to `mobile/data/ramayana-dutt.json`. | Hugging Face dataset licence is Apache-2.0. The English is Dutt, which is public domain. Mahabharata pairs in that repo stay out. |
| Telang, *Sacred Books of the East* vol. 8 (1882) | Gita English, verse-aligned, in `mobile/data/gita-telang.csv`. | Public domain. Matched by chapter and verse. Rows that do not exist in our 701 stay out. |
| [prathoshap/vagdhenu](https://github.com/prathoshap/vagdhenu) | The chant engine, Apache-2.0, run on our side. | No API key. It chants a verse from text. The voice is the author’s. Do not present it as a named pandit. |
| [ishubhamx/Hindu-Panchangam-Legal](https://github.com/ishubhamx/Hindu-Panchangam-Legal) | The calculation approach. MIT. It uses astronomy-engine and is checked against Drik Panchang. | Fits a paid app. No Swiss Ephemeris. |
| [DevDarsha-Admin/devdarsha-api-examples](https://github.com/DevDarsha-Admin/devdarsha-api-examples) | The daily panchang call only, if we buy that API: `POST /v1/panchang/daily` on `panchang.devdarsha.com`. | Festivals, muhurat, sunrise. Skip kundli, horoscope, and numerology. |
| [api-ninjas.com/api/city](https://api-ninjas.com/api/city) | City name to latitude and longitude. | Not a panchang. Commercial use needs their paid plan. |
| [JDhruv14/Bhagavad-Gita_Audio](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Audio) | The Gita half of the verse file: 701 rows, Sanskrit, IAST, and a WAV per verse. Apache-2.0. | Commercial use is allowed by that licence. Confirm the recordings are the uploader’s before Listen ships. Compress and download by chapter. Do not bundle the raw WAVs. |
| Local dump `Downloads/archive` (vedicscriptures Gita JSON) | `verse.json` only: 701 Sanskrit shlokas and transliteration, copied to `mobile/data/gita-verse.json`. | `translation.json`, `commentary.json`, `summary.md`, `word_meanings`, and the Swami English/Hindi stay out. |

## Shape only, do not copy the text

| Source | Why it stays a reference |
| --- | --- |
| [rushidarge/Geeta-GPT](https://github.com/rushidarge/Geeta-GPT) | RAG shape: retrieve a verse, then answer. MIT code. The index may hold copyrighted Gita English. We build the index from our own file. |
| [Anubhob435/Bhagavad-Gita-Project](https://github.com/Anubhob435/Bhagavad-Gita-Project) | Local chunks, embeddings, and a cited answer. MIT code. | Their PDF stays out. Retrieval runs on our verse file, one row per shloka. |
| [shubh-vedi/Ramayan-GPT](https://github.com/shubh-vedi/Ramayan-GPT) | Same shape, for the Ramayana. The sample answers are model prose. We do not store them. |
| [JDhruv14/Bhagavad-Gita-QA](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita-QA) | Questions and answers written by GPT-4.1. Our English is not model-written. |
| [karthikraman/panchangam](https://github.com/karthikraman/panchangam) | Festival rules are useful. The code depends on Swiss Ephemeris through jyotisha. We do not ship that library. |
| [evilcloud/The_Ramayana](https://github.com/evilcloud/The_Ramayana) | A character graph, not the verses. |
| [shyamvalsan/ramayana-rts](https://github.com/shyamvalsan/ramayana-rts) | A browser game. Not a text source. |

## Do not ship, even though the repo is public

| Source | Block |
| --- | --- |
| [vedicscriptures/bhagavad-gita-api](https://github.com/vedicscriptures/bhagavad-gita-api) and the RapidAPI host `bhagavad-gita3.p.rapidapi.com` | GPL-3 code. Their own note limits the free API to non-monetized apps. The books inside are Tejomayananda, Sivananda, Chinmayananda, Ramsukhdas, Prabhupada, and others. |
| [vedicscriptures/bhagavad-gita](https://github.com/vedicscriptures/bhagavad-gita) | Same commentaries. GPL-3 on the dataset does not license those books. |
| [nikhilsi/gitavani](https://github.com/nikhilsi/gitavani) | App code is MIT. The verse file is that same dataset, LGPL-3, including those commentators. |
| [praneshp1org/Bhagavad-Gita-JSON-data](https://github.com/praneshp1org/Bhagavad-Gita-JSON-data) | No stated text licence. Treat the English as unusable until we know the translator. |
| [imradhe/ramayanam-api](https://github.com/imradhe/ramayanam-api) | MIT code. The verses are pulled from IIT Kanpur. That site’s translation is not ours to resell. |
| [Ashutosh-Vijay/Valmiki_Ramayan_Dataset](https://github.com/Ashutosh-Vijay/Valmiki_Ramayan_Dataset) | The file says MIT, and the readme also says non-commercial. English mixes Dutt with IIT Kanpur and Gyaandweep. Take Dutt only, from the Ramayana_Book line above. |
| [divinesansar.com Satyanarayan vidhi](https://divinesansar.com/blogs/guide/satyanarayan-puja-vidhi-home), [vaidicpujas.org](https://vaidicpujas.org/puja/satyanarayana-puja), and [Drik Panchang Lakshmi puja vidhi](https://www.drikpanchang.com/festivals/lakshmipuja/info/lakshmi-puja-vidhi.html) | Permission to use these steps is stated. File the written grant (who gave it, which pages, what we may reproduce) in this folder before the steps are pasted into the app. One named tradition, reviewed, next and previous. |

## What we build

One local file, not a live call to those APIs.

- Gita: reference, Sanskrit, transliteration. English is Telang 1882 where the chapter and verse match.
- Ramayana: the same, Sanskrit from Wikisource, English from Dutt where the shloka matches. Empty if it does not.
- Simple English: an AI explanation of that sourced line, generated offline with prompt `simple-en-v1`, stored in `mobile/src/simple-english.json`. Labeled as not the translator’s words. The Anthropic key stays in `mobile/.env` and is never in the app.
- Listen: Gita clips are the Apache recording set, addressed by offset in `mobile/src/listen-catalog.json`. Word timings are written by an offline ElevenLabs speech-to-text job. Verses with no recording get an ElevenLabs spoken reading of the transliteration, labeled as not a temple chant. The ElevenLabs key stays in `mobile/.env`. The app never calls ElevenLabs.
- Guidance: retrieve from that file, then answer. Cite the verse. Do not train on the commentator datasets or the GPT-4.1 questions.
- Festivals: Hindu-Panchangam-Legal or DevDarsha daily panchang. City coordinates from a geocoder. No kundli.

## First release

The app stays free. No subscription, no in-app purchase, no ads. Paid APIs wait until a price is added. Until then, only sources that allow a free app are called.

`279.pdf` is a scanned copy of *Srimad Bhagavad Gita* (Sanskrit, Hindi, and English), editor Ashok Kaushik, Star Publications, © 1993, ISBN 81-7144-033-9. The Sanskrit ślokas are already covered by the audio set. The Hindi and English in that scan stay out of the app. A library stamp does not release the 1993 translation.

| Call while the app is free | What it fills | Remove when a price is added |
| --- | --- | --- |
| [Bhagavad Gita API](https://github.com/vedicscriptures/bhagavad-gita-api) | Gita Hindi, and English until Telang or Arnold is loaded | Yes. Their note limits the feed to a non-monetized app. |
| [API Ninjas City](https://api-ninjas.com/api/city), free tier | City name to coordinates | Yes, unless the account is on their paid plan. |
| Sarvam | Stories and any verse that has no recording | Only if that Sarvam plan cannot follow a price. ElevenLabs is the later voice. |

The Gita Listen button uses [Bhagavad-Gita_Audio](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Audio). Those clips are already aligned to the 701 verses. Build the offset map with `python3 scripts/build-listen-catalog.py`. Transcribe timings with `python3 scripts/transcribe-listen.py`. Spoken readings for verses without a clip, and the everyday-words voice-over after the chant: `python3 scripts/speak-verses.py --today` or `--english --gita-chapter 2`. The Sarvam and ElevenLabs keys stay in `mobile/.env` and have to be rotated if they appeared in chat.

## Stays after a price

These can ship in a paid app. Build the verse file from them so the later swap is a switch, not a rewrite.

| Need | Source |
| --- | --- |
| Gita Sanskrit, IAST, verse audio | [Bhagavad-Gita_Audio](https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Audio), Apache-2.0 |
| Gita English | Kashinath Trimbak Telang, 1882, in the Sacred Books of the East, or Edwin Arnold, *The Song Celestial*, 1885. Both are old enough to be public domain. The translation you provide replaces either one. |
| Ramayana Sanskrit | [Ramayana_Book](https://github.com/svenkatreddy/Ramayana_Book), from Sanskrit Wikisource |
| Ramayana English | M. N. Dutt, 1891–1894, from `mobile/data/ramayana-dutt.json` (Itihāsa / Dutt), not Ramayana_Book `translations/en/` |
| Stories | Arthur W. Ryder, *The Panchatantra*, 1925. The Purna Vidya PDF stays out. |
| Festival times | [Hindu-Panchangam-Legal](https://github.com/ishubhamx/Hindu-Panchangam-Legal), MIT |
| Sanskrit chant, if ElevenLabs is dropped | [Vāgdhenu](https://github.com/prathoshap/vagdhenu), Apache-2.0 |
| Ceremonies | The granted Satyanarayan and Diwali steps, once the written grant is filed |
| City lookup after a price | API Ninjas on a paid plan, or a city list shipped in the app |
| Festival API after a price | DevDarsha daily panchang, on a paid plan |

Hindi, Gujarati, and Tamil still need a text whose writer allows a paid app. The free Gita API’s Hindi comes out when the price goes in. No public-domain Hindi, Gujarati, or Tamil verse file is in hand.

Keys stay on a server. None of the keys pasted in chat are stored here.
