# Gita & Ramayana Companion — Build Investigation

Oct 9, 2026 · @nilamadhab

Decisions as of 10 Oct 2026 are in [MVP.md](MVP.md). The Stitch screens are the product direction. Home draws a verse from the Gita and the Ramayana. Streaks, guidance on a pro plan, stories, and the design’s prices are in. The onboarding question about what someone wants help with waits for a customer yes or no. The market notes below still stand. Where a note below disagrees with MVP.md, MVP.md wins.

## TL;DR

Build it: a paid, family-first Hindu practice app for the diaspora, with a cited Gita/Ramayana companion at its core. Ship an MVP to the App Store and Play Store before Diwali on Sunday 8 Nov 2026, then use the post-Diwali window to tune the paywall.

- **The money is proven.** Hallow (Catholic prayer app) earned roughly $40M net in 2025 on a \~$70/year subscription. Sri Mandir's diaspora users spend about 10x what Indian users spend.
- **The AI chat is not the edge.** Dozens of "GitaGPT" apps exist and most are thin wrappers. The edge is three things they don't do together: verse-cited answers that never invent shlokas, a timezone-correct festival and puja guide for the user's actual city, and content for kids.
- **Fine-tuning is now the decision.** The 9 Oct note below recommended retrieval over a verse database rather than a fine-tune. On 10 Oct the decision moved: an open-source model, finetuned on the Gita and the Ramayana, with every answer kept inside those texts and cited. The cost and licensing cautions in this file still apply.
- **Biggest risks:** content licensing (most popular English translations are copyrighted), App Store rejection as a "thin AI app", and getting a festival date wrong for a US user.

## Market

The audience is small in headcount but rich and under-served: about 3.6M Hindus in North America, among the highest-income religious groups in the US.

| Signal | Figure | Why it matters |
| --- | --- | --- |
| Hindus in North America | 3.6M, up 55% in a decade ([Pew](https://www.pewresearch.org/religion/2025/06/09/hindu-population-change/)) | Fast-growing, migration-driven |
| Asian American Hindus with a postgraduate degree | 61% ([Pew via American Kahani](https://americankahani.com/community/most-indian-americans-are-hindus-a-new-pew-study-on-religion-among-asian-americans-reveals/)) | High willingness to pay for subscriptions |
| Asian American Hindus born abroad | 92% (same source) | Parents raising US-born kids: the "pass it on" anxiety is the hook |
| Sri Mandir diaspora spend | \~$81 per user vs $7–9 in India ([summary of TechCrunch](https://benzatine.com/news-room/sri-mandir-secures-20-million-in-funding-amid-booming-digital-pilgrimage)) | Dollar pricing works |
| Sri Mandir revenue from diaspora | \~20% ([TechCrunch](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows)) | Diaspora pays out of proportion to its size |
| Hallow net revenue, 2025 | \~$40M ([Appfigures](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue)) | The subscription faith-app model is proven |

Also target the UK (\~1M Hindus), Canada, Australia, UAE and Singapore; the same app works with local currency pricing.

**The Hallow lesson is the playbook.** Hallow's revenue spikes every year around Lent, driven by a 40-day challenge ([Appfigures](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue)). Hindu practice has more of these moments, not fewer: Navratri, Diwali, Shravan, Janmashtami, Ganesh Chaturthi, Ram Navami. Each is a natural "9-day" or "21-day" challenge.

## Competitors and the gaps they leave

Nobody owns "daily Hindu practice for diaspora families". The field splits into puja marketplaces, generic Gita chatbots and verse readers.

| Player | What it is | Gap you can take |
| --- | --- | --- |
| [Sri Mandir](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows) (AppsForBharat) | Remote puja booking at Indian temples, devotional content; \~3.5M MAU | India-first, transaction model; diaspora users call it expensive ([TechCrunch](https://techcrunch.com/?p=2851321)). No guided learning or kids track |
| [Gita GPT](https://apps.apple.com/app/id6478273332) and similar | Chat with an AI "Krishna" | Generic, often unsourced; one early GitaGPT drew backlash for endorsing killing in Krishna's voice ([report](https://www.jagonews24.com/en/feature/news/86478)) |
| [Daily Bhagavad Gita GPT](https://apps.apple.com/us/app/daily-bhagavad-gita-gpt/id6743033229) | Verse-a-day with AI personalisation | Gita only; no festivals, family or kids |
| Astrology apps (Astrotalk, AstroSage) | Paid astrologer calls, horoscopes | Different job; avoid astrology to stay trustworthy |
| Temple websites and WhatsApp groups | Where diaspora families get festival dates today | Fragmented, India-timezone dates, no "how to do it at home" |

Two takeaways: never put words in Krishna's mouth, and the festival/home-puja guidance is the most neglected job.

## Positioning and the edge

Position it as "Hallow for Hindu families abroad", not as "ChatGPT for the Gita". The buyer is a 30–45-year-old parent who wants their kids to know the stories and wants to do festivals right without calling their mother in India.

The edges, in order of how hard they are to copy:

1. **Correct for where you live.** Festival dates, tithi and muhurat computed for the user's city and timezone. A Karva Chauth moonrise time for New Jersey, not Delhi. Most apps and temple WhatsApp forwards get this wrong.
2. **Trust by design.** Every answer cites the verse it rests on (BG 2.47, Valmiki Ramayana 2.18.5). The model never speaks as a deity. Answers say when traditions differ (Vaishnava, Shaiva, Smarta, regional).
3. **Family, not just individual.** A kids' mode with bedtime Ramayana episodes, a parent dashboard, and "explain this to my non-Indian spouse" or "to a 7-year-old" modes.
4. **Practice loops.** Navratri 9-day, Shravan, Diwali 5-day and "read the Gita in 18 days" challenges with streaks, the same engine that drives Hallow's Lent spike.
5. **Regional respect.** Tamil, Telugu, Gujarati and Bengali families celebrate differently. Let users pick a tradition and region at onboarding; it changes the calendar and the puja guides.

Name ideas to test: Dharma Daily, Sanskara, Gita & Ghar, Deepa. Check trademarks and App Store availability before committing.

## MVP feature set

Ship five things well before Diwali; everything else waits for real usage data.

| Feature | MVP (by 1 Nov) | Later |
| --- | --- | --- |
| Ask the Gita / Ramayana | Chat with cited verses, Sanskrit + transliteration + translation, tap a citation to read the verse | Voice questions, Hindi replies, saved journals |
| Daily practice | Verse of the day, push at the user's chosen time, streaks | Personalised plans by life situation |
| Festival & puja guide | Calendar for the user's city, Diwali 5-day guide, Karva Chauth guide with local moonrise, home-puja checklists | Full year of festivals, regional variants, vrat reminders |
| Kids' stories | 10–15 short Ramayana episodes with audio narration | Illustrated stories, quizzes, age bands |
| Diwali challenge | 5-day guided challenge, free during Diwali week | Navratri, Shravan, 18-day Gita challenges |
| Paywall | 7-day trial, monthly and annual plans | Family plan, gifting |

Cut from v1: astrology, horoscopes, puja booking, community feeds and Mahabharata. Each adds moderation load or dilutes trust.

## Content sources and licensing

The Sanskrit is free to use; most modern English translations are not. Build on public-domain translations plus your own reviewed translation.

| Source | Use it for | Licence status |
| --- | --- | --- |
| Sanskrit text of the Gita and Valmiki Ramayana | The canonical verse records | Public domain (ancient) |
| [gita/gita dataset](https://github.com/gita/gita) | Verse structure, Devanagari + IAST | Verse text public domain; check repo licence for the files |
| [vedicscriptures/bhagavad-gita-data](https://www.github.com/vedicscriptures/bhagavad-gita-data) | Structure only | **Caution:** includes translations by Chinmayananda, Gambhirananda, Ramsukhdas and others that are likely still copyrighted. An MIT code licence does not license those texts |
| [Itihāsa corpus](https://github.com/rahular/itihasa) | Ramayana Sanskrit–English pairs from M. N. Dutt (1890s) | Dutt's translation is old enough to be public domain; confirm the dataset's own licence |
| [Project Ramayanam](https://github.com/imradhe/ramayanam) | Valmiki Ramayana verse structure (sourced from IIT Kanpur's site) | MIT for the project; the IIT Kanpur translations themselves need permission |
| Edwin Arnold's *Song Celestial* (1885), K. T. Telang's Gita (1882), Griffith's Ramayana (1870s) | Displayed English translations | Public domain |
| Your own modern translation | The default reading translation | Draft with Claude, then pay a Sanskrit scholar to review all 700 Gita verses |

Avoid shipping text from *Bhagavad-gītā As It Is* (BBT), Gita Press or Chinmaya Mission without a written licence.

The scholar review is your moat as much as a cost. A paid review (get quotes from Sanskrit departments or temple scholars) lets you say "reviewed by" on every verse, which no wrapper app can claim. Kids' stories should be original retellings written for the app, with the source chapter cited.

## AI architecture

Use retrieval over a verse database with Claude, not fine-tuning. Fine-tuning teaches tone, not facts, so a fine-tuned model still invents verses; and Claude isn't fine-tunable on the standard API anyway. Retrieval keeps every answer tied to a real verse and lets you fix content in the database without retraining.

**Answer pipeline (server-side, never from the app directly):**

1. Classify the question with Haiku: scripture question, life advice, festival/how-to, kids, or sensitive (distress, medical, legal, caste, politics).
2. Retrieve 6–10 verses: hybrid search (pgvector embeddings + keyword/BM25) over verse records, each carrying its translation and a short commentary you wrote.
3. Generate with Sonnet: a system prompt that forbids speaking as a deity, requires a citation for every scriptural claim, and says when traditions differ.
4. Verify citations in code: every cited ID must be in the retrieved set. If not, regenerate once, then fall back to "here are the most relevant verses".
5. Stream the answer; the app renders citations as tappable verse cards.

**Model choice and cost** ([Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)):

| Job | Model | Price per million tokens (in / out) |
| --- | --- | --- |
| Routing, classification, verse-of-day blurbs | Claude Haiku 5.5 | $0.10 / $0.50 |
| Chat answers | Claude Sonnet 5.5 | $2 / $10 |
| Pre-generated content (daily reflections, puja guides) | Sonnet via Batch API | 50% off |

At roughly 3,000 input and 400 output tokens per answer, a Sonnet reply costs about $0.01, and prompt caching of the system prompt cuts that further. A heavy user asking 100 questions a month costs about $1. Pre-generate everything that isn't a live question.

**Open-source options, if you ever need them:** Sarvam-30B or Sarvam-105B for Hindi and regional-language answers ([Sarvam docs](https://docs.sarvam.ai/api-reference-docs/getting-started/models.md)), or Qwen/Llama/Gemma if you want to self-host later for cost. Not needed for v1.

**Guardrails that matter for a faith app:**

- Distress: people open the Gita in hard moments. Detect self-harm or crisis language and show local helplines (988 in the US) before any scripture.
- No medical, legal or financial rulings dressed as scripture.
- No sectarian put-downs; present Advaita, Vishishtadvaita and Dvaita readings neutrally when they differ.
- Caste, gender and politics questions get careful, historically grounded answers, reviewed by you before launch with a test set of 50–100 hard prompts.

## Expo tech stack

One Expo codebase for iOS and Android, a thin TypeScript backend, and Postgres with pgvector. Start on Expo SDK 57: SDK 56 shipped React Native 0.85 and React 19.2, but has a Hermes memory regression with Reanimated that SDK 57 fixes ([Expo changelog](https://expo.dev/changelog/sdk-56.md)).

| Layer | Choice | Notes |
| --- | --- | --- |
| App | Expo SDK 57, Expo Router, TypeScript | File-based routing; EAS Build and EAS Submit for both stores |
| UI | Expo UI or NativeWind; Reanimated for verse-card and streak animations | Devanagari fonts: Noto Serif Devanagari, Tiro Devanagari Sanskrit (both OFL) |
| Local data | expo-sqlite with the full verse database bundled | Reading, search and festival guides work offline; only chat needs network |
| State and fetching | TanStack Query + Zustand | Streams chat over SSE or fetch streaming |
| Audio | expo-audio, background playback + lock-screen controls | Kids' stories and chanting |
| Notifications | expo-notifications, scheduled locally per user timezone | Verse of the day, festival reminders, Karva Chauth moonrise alert |
| Payments | RevenueCat (react-native-purchases) | Handles App Store + Play Billing, trials, paywall A/B tests |
| Auth | Sign in with Apple + Google via Supabase Auth or Clerk | Offering Google login means Apple's guideline 4.8 expects Sign in with Apple (or an equivalent private login) too |
| Backend | Supabase (Postgres + pgvector + Edge Functions) or a Hono/Fastify API on Railway | Holds the Claude key, rate limits, citation verifier |
| Analytics and errors | PostHog + Sentry | Funnel: install → onboarding → first answer → trial → paid |
| OTA updates | EAS Update | Fix content and copy without a store review |

Keep the Claude API key on the server only. The app talks to your backend, which enforces per-user limits so a free user can't run up your bill.

## Festival and panchang engine

This is the hardest-to-copy feature, and the one you must not get wrong. Precompute dates server-side, verify them, and ship them as data.

**Why it's hard:** a festival is defined by a lunar day (tithi) at a specific time of day (sunrise, pradosh, moonrise). Because those moments are local, a festival can fall on a different Gregorian date in New Jersey than in India. Calendars also differ by region (amanta vs purnimanta months).

**Licence trap:** Swiss Ephemeris, the standard astronomy library, is AGPL or a paid Professional licence. Under AGPL, running it behind a public service obliges you to publish your whole service's source ([Swiss Ephemeris licence](https://github.com/KunstschuleLotus/swisseph)). Either buy the Professional licence or use an MIT-licensed library such as Astronomy Engine for sun/moon positions, sunrise and moonrise.

**How to build it:**

1. Compute sun and moon longitudes; tithi = the moon–sun angle divided into 12° steps; nakshatra needs a sidereal correction (Lahiri ayanamsa).
2. Encode each festival as a rule ("Krishna Chaturthi of Kartika, observed at moonrise") with regional variants.
3. Precompute 3 years of dates for the top 40 diaspora cities (Bay Area, NJ/NYC, Houston, Dallas, Chicago, Atlanta, Toronto, London, Leicester, Sydney, Dubai, Singapore and others) and store as JSON.
4. Cross-check every major festival against Drik Panchang's city pages before release; log any disagreement for manual review.
5. Show a one-line note when a local temple may observe a different day, and let users override.

For context, Diwali (Lakshmi Puja) falls on Sunday 8 Nov 2026 in India ([Drik Panchang](https://www.drikpanchang.com/festivals/lunar-month/festivals-kartika.html)). Verify the US and UK dates with the engine before you market them.

## Audio and voice

Pre-generate all narration once and serve the files from a CDN; audio costs then stay near zero per user.

| Audio | Tool | Cost |
| --- | --- | --- |
| English narration for kids' stories and daily reflections | ElevenLabs Multilingual v2/v3 | $0.10 per 1,000 characters on the API; Flash is $0.05 ([pricing guide](https://developer.puter.com/tutorials/elevenlabs-api-pricing/)) |
| Hindi, Tamil, Telugu, Gujarati narration | Sarvam Bulbul v3: 30+ voices in 11 Indian languages, trained on Indian speech | ₹30 per 10,000 characters in beta ([invideo summary](https://invideo.io/blog/sarvam-bulbul-indian-tts/)) |
| Sanskrit shloka recitation | A human reciter, recorded once | One-off fee; TTS usually mangles Sanskrit metre and sandhi |

Worked example: 15 kids' episodes of about 6,000 characters each is 90,000 characters, roughly $9 on ElevenLabs Multilingual.

Skip live voice chat in v1. It adds latency work and cost per minute, and text chat is enough to test whether people pay.

## Pricing and unit economics

Price just under Hallow and lead with the annual plan. Hallow lists $9.99 a month or $69.99 a year ([App Pricing Lab](https://apppricinglab.com/iap/apple/1405323394)), and pairs a 7-day trial with 50% off the first month ([Appfigures](https://appfigures.com/resources/insights/20230324/amp?f=4)).

| Plan | Suggested price | Notes |
| --- | --- | --- |
| Free | $0 | Verse of the day, festival calendar, 3 questions a day, 2 kids' stories |
| Monthly | $7.99 | Unlimited questions, all stories and challenges |
| Annual | $49.99 | Default selection on the paywall |
| Family annual | $69.99 | Up to 5 profiles incl. kids; via Apple Family Sharing / Play family library |

**Rough economics for one annual subscriber:** $49.99 gross, minus the 15% store fee under Apple's and Google's small-developer programs, is about $42.50. AI and audio cost for a heavy user is about $1 a month, so roughly $30 a year in the worst case. Typical users cost far less.

**What 1,000 annual subscribers means:** about $42,500 a year after store fees. That is a realistic first-year target with a strong Diwali and Navratri launch; it is not guaranteed.

You'll receive USD from Apple and Google as an India-based developer. Talk to a CA about GST treatment of export of services and LUT filing before revenue starts; I'm not a tax adviser.

## App Store, privacy and risk

Apple is rejecting thin, templated AI apps under its spam rules, while approving AI apps that do something specific and useful ([vp0 guide](https://vp0.com/blogs/does-apple-reject-ai-generated-apps.md)). An app whose first screen is a chat box is at risk; one that opens on today's verse, the festival calendar and a story is not.

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Rejected as a thin AI wrapper (guideline 4.3) | Medium | Lead with offline reading, calendar and audio; chat is one tab of five |
| AI disclosure and third-party data sharing | Certain to be checked | Label AI answers clearly; disclose that questions go to Anthropic, ask consent before first chat; privacy policy and nutrition labels match |
| Kids' data (COPPA in the US) | Medium | Kids' mode collects nothing, has no chat, no ads, no third-party analytics; stay out of the Kids category for v1, rate the app 4+ |
| Wrong festival date | Medium | Precompute, cross-check, show local-temple note, let users override |
| Offensive or sectarian AI answer goes viral | Low–medium | Citation verifier, red-team prompt set, report button on every answer, no deity persona |
| Copyright claim on a translation | Low if you follow the licensing table | Only public-domain or owned text |
| Seasonal churn after Diwali | High | Annual plan default, Navratri/Shravan/Gita challenges spread across the year |

## Go-to-market

Diaspora Hindus cluster in temples, Sunday schools and WhatsApp groups. Win those trust networks, and time every push to a festival.

| Channel | Tactic | Cost |
| --- | --- | --- |
| Temples and Bal Vihar / Sunday schools | Free family codes for teachers; a printable festival calendar with a QR code | Low; your time |
| Indian grocery stores | QR flyers near the Diwali aisle in NJ, Bay Area, Houston, Dallas | Low |
| Instagram Reels / YouTube Shorts / TikTok | 30-second "What BG 2.47 actually means" and "Diwali day 1 in 60 seconds" clips, made from app content | Low |
| Parent creators | Indian-American mom and dad creators get lifetime access + affiliate code | Revenue share |
| Apple Search Ads + ASO | Bid on "Diwali", "Bhagavad Gita", "Hindu calendar", "Ramayana for kids" during festival weeks | Pay per tap; cap daily |
| Campus groups | Hindu Students Council chapters for the young-adult segment | Low |
| Build in public on X | Weekly progress threads; useful for early testers | Free |

Upcoming moments: Navratri runs 11–19 Oct 2026 ([AstroSight](https://astrosight.ai/2026-festival-calendar)), too soon for the app but right for a waitlist; Karva Chauth is late October; Diwali is 8 Nov. After that, Gita Jayanti in December, then the new-year festival cycle.

## Build plan

&#91;embedded content: build plan · 6 workstreams, 4 milestones\]

The workstreams overlap so a solo builder can switch when blocked; store review is the hard gate, so submit by 30 Oct and keep 2 Nov as the public launch with a few days of slack before Diwali.

This week:

- [ ] Lock the name and check App Store / Play availability
- [ ] Put up a waitlist page before Navratri starts on 11 Oct
- [ ] Load the Gita and Ramayana verse database from public-domain sources
- [ ] Prototype tithi and moonrise for 5 US cities and compare with Drik Panchang
- [ ] Create the Expo SDK 57 project, EAS, RevenueCat and Apple/Google developer accounts
- [ ] Write 50 red-team prompts for the chat

## Sources

- [Pew Research: Hindu population change (2025)](https://www.pewresearch.org/religion/2025/06/09/hindu-population-change/)
- [American Kahani: Pew study on Asian American Hindus](https://americankahani.com/community/most-indian-americans-are-hindus-a-new-pew-study-on-religion-among-asian-americans-reveals/)
- [TechCrunch: Sri Mandir keeps investors hooked (2025)](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows)
- [TechCrunch: Sri Mandir and diaspora users](https://techcrunch.com/?p=2851321)
- [Benzatine: Sri Mandir funding summary](https://benzatine.com/news-room/sri-mandir-secures-20-million-in-funding-amid-booming-digital-pilgrimage)
- [Appfigures: Hallow Lent surge and 2025 revenue](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue)
- [Appfigures: Hallow trial and discount strategy](https://appfigures.com/resources/insights/20230324/amp?f=4)
- [App Pricing Lab: Hallow in-app purchases](https://apppricinglab.com/iap/apple/1405323394)
- [Gita GPT on the App Store](https://apps.apple.com/app/id6478273332) · [Daily Bhagavad Gita GPT](https://apps.apple.com/us/app/daily-bhagavad-gita-gpt/id6743033229)
- [Jago News: AI meets the divine](https://www.jagonews24.com/en/feature/news/86478)
- [vedicscriptures/bhagavad-gita-data](https://www.github.com/vedicscriptures/bhagavad-gita-data) · [gita/gita](https://github.com/gita/gita) · [Itihāsa corpus](https://github.com/rahular/itihasa) · [Project Ramayanam](https://github.com/imradhe/ramayanam)
- [Swiss Ephemeris licence](https://github.com/KunstschuleLotus/swisseph)
- [Drik Panchang: Kartika festivals 2026](https://www.drikpanchang.com/festivals/lunar-month/festivals-kartika.html) · [AstroSight 2026 festival calendar](https://astrosight.ai/2026-festival-calendar)
- [Anthropic API pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Expo SDK 56 changelog](https://expo.dev/changelog/sdk-56.md)
- [ElevenLabs API pricing guide](https://developer.puter.com/tutorials/elevenlabs-api-pricing/) · [Sarvam Bulbul v3 explained](https://invideo.io/blog/sarvam-bulbul-indian-tts/) · [Sarvam models](https://docs.sarvam.ai/api-reference-docs/getting-started/models.md)
- [vp0: Does Apple reject AI-generated apps?](https://vp0.com/blogs/does-apple-reject-ai-generated-apps.md)
