import { ContactForm } from "@/components/ContactForm";
import { Phone } from "@/components/Phone";
import { Reveal } from "@/components/Reveal";
import { WaitlistForm } from "@/components/WaitlistForm";

const cities = ["Mumbai", "Bengaluru", "Delhi", "Chennai", "London"];

const reasons = [
  "A verse each morning, with the chant.",
  "Festival days and timings for your city.",
  "The Gita in the day, not only on a shelf.",
];

const rooms = [
  {
    title: "Today",
    body: "A verse, the chant, a morning streak, and the next festival for your city.",
  },
  {
    title: "Guidance",
    body: "Ask in your own words. The reply quotes a verse from the Gita or the Ramayana and stays inside those texts.",
  },
  {
    title: "Stories",
    body: "Little Setu plays a bedtime story. Kids’ mode has stories only: no chat and no tracking.",
  },
  {
    title: "Festivals",
    body: "Diwali’s five days, Karva Chauth, and a muhurat only when the calendar returns one.",
  },
  {
    title: "Read",
    body: "The Gita by chapter, and the Ramayana by kāṇḍa. Search can use the microphone.",
  },
  {
    title: "Reminders",
    body: "A morning verse, then festival, sunset, bedtime, and a chime at a muhurat the calendar returned.",
  },
];

const festivals = [
  ["Diwali", "Five days at home, with the puja steps in order."],
  ["Karva Chauth", "The moonrise for your city, when the calendar returns it."],
  ["Satyanarayan", "Home Satyanarayan: six steps at home. Next and previous always work."],
  ["A guest link", "Someone at the gathering can follow the steps without installing the app."],
];

const stories = [
  ["Listen", "A voice reads the story. You can stop it at any line."],
  ["The moral", "A short line at the end, written for a child."],
  ["Your evening", "A bedtime reminder, at the hour you choose."],
];

const questions = [
  ["When does SetuHome launch?", "Before Diwali 2026, on iPhone and Android."],
  [
    "How is a verse shown?",
    "Sanskrit, transliteration, and a sourced English line. Everyday words explain that line. The original translator’s wording is one tap away.",
  ],
  [
    "Which traditions does it follow?",
    "The Gita and the Ramayana are shown with care. A ceremony follows one named tradition, reviewed before it is shown.",
  ],
  [
    "Is the guidance a person?",
    "No. An answer comes from a verse in the Gita or the Ramayana, and the verse is shown with it. It does not speak as Krishna or Rama.",
  ],
  ["Is it safe for kids?", "Kids’ mode has stories only: no chat, no ads, no tracking."],
  [
    "Which city does it use?",
    "The one you choose. Festival times follow that city. If the calendar has no time, the screen does not invent one.",
  ],
  ["What does it cost?", "The app is free. There is no subscription and there are no ads."],
];

export default function HomePage() {
  return (
    <>
      <section
        id="top"
        className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-28 pb-16 lg:grid-cols-2 lg:gap-14 lg:pt-36 lg:pb-24"
      >
        <div>
          <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
            Coming this Diwali · iOS and Android
          </p>
          <h1 className="rise rise-2 mt-5 font-serif text-4xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            The verse,
            <br />
            at home.
          </h1>
          <div className="phone-stage my-5 lg:hidden" aria-hidden>
            <Phone />
          </div>
          <p className="rise rise-3 mt-6 max-w-xl border-l-2 border-marigold/70 pr-1 pl-4 font-serif text-lg text-plum italic sm:text-xl">
            Setu means bridge in Sanskrit: from the shloka to the rest of the day.
          </p>
          <p className="rise rise-4 mt-5 max-w-xl text-lg leading-relaxed text-plum">
            Start each morning with the Gita, keep festival days for your city, and hear the
            stories at home.
          </p>
          <div className="rise rise-4 mt-8 max-w-lg">
            <WaitlistForm anchor />
          </div>
          <div className="mt-8 border-t border-line pt-4">
            <p className="text-xs tracking-wider text-plum uppercase">
              Calculating local sunrise and tithi for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((city) => (
                <span key={city} className="rounded-md border border-line bg-white px-2.5 py-1 text-xs">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="phone-stage hidden lg:block">
          <Phone />
        </div>
      </section>

      <section className="px-5 py-24 text-center">
        <Reveal>
          <p className="text-xs tracking-widest uppercase">Why SetuHome</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-snug sm:text-5xl">
            The verse, the festival, and the story — in one place at home.
          </h2>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal key={reason} delay={index * 120}>
              <p className="font-serif text-lg">{reason}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="inside" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-8">
        <Reveal className="text-center">
          <p className="text-xs tracking-widest text-marigold uppercase">Inside the app</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">
            Five rooms, one quiet home.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-plum">
            The app opens on today’s verse. Guidance, stories, festivals, and reading sit beside it.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.45)] transition duration-300 hover:-translate-y-1 hover:border-marigold/70">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-plum">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="scripture" className="scroll-mt-24 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
          <p className="text-xs tracking-widest text-marigold uppercase">Scripture</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">
            The Gita and the Ramayana, side by side.
          </h2>
          <p className="mt-4 max-w-2xl text-plum">
            Home draws a verse from both books. You do not pick which one, and the verse is not
            matched to a mood. Sanskrit and transliteration are always there. Simple English
            explains a sourced translation. The original line stays behind a tap.
          </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal>
            <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.45)]">
              <h3 className="font-serif text-2xl">Bhagavad Gita</h3>
              <p className="mt-3 text-sm leading-relaxed text-plum">
                Eighteen chapters, 701 verses. Listen uses a recording aligned to each verse. A
                sample on this page is chapter 2, verse 47.
              </p>
            </article>
            </Reveal>
            <Reveal delay={120}>
            <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.45)]">
              <h3 className="font-serif text-2xl">Valmiki Ramayana</h3>
              <p className="mt-3 text-sm leading-relaxed text-plum">
                Seven kāṇḍas. The Sanskrit is from Wikisource. The English is M. N. Dutt, where a
                person has checked the verse.
              </p>
            </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="festivals" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16">
        <Reveal>
        <p className="text-xs tracking-widest text-marigold uppercase">Festivals</p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl">The day is for your city.</h2>
        <p className="mt-4 text-plum">
          Sunrise, tithi, and a muhurat are calculated for the place you live. If the calendar has
          no time, the screen does not invent one. A temple may keep another day, and the host can
          move the household date.
        </p>
        </Reveal>
        <div className="mt-10 space-y-4">
          {festivals.map(([title, body], index) => (
            <Reveal key={title} delay={index * 80}>
              <article className="rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.45)]">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-plum">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="stories" className="scroll-mt-24 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
          <p className="text-xs tracking-widest text-marigold uppercase">Little Setu</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">Stories for the end of the day.</h2>
          <p className="mt-4 max-w-2xl text-plum">
            Panchatantra tales and the Ramayana, told for bedtime. The story text is a public-domain
            telling. Kids’ mode collects nothing: no chat, no ads, no tracking.
          </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stories.map(([title, body], index) => (
              <Reveal key={title} delay={index * 90}>
                <article className="h-full rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.45)]">
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-plum">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="h-28 bg-gradient-to-b from-parchment via-[#c4845a] to-[#160100]" />
        <div className="bg-[#160100] px-5 py-6 text-white">
        <Reveal>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-widest text-marigold uppercase">Diwali invitation</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Join before Diwali</h2>
            <p className="mt-4 max-w-xl text-white/80">
              The app is free. The five-day Diwali guide uses the time your city returns, and a
              host can move the household date.
            </p>
            <div className="mt-8 max-w-lg">
              <WaitlistForm dark />
            </div>
          </div>
          <ul className="space-y-3 rounded-3xl border border-white/15 bg-white/10 p-6 text-sm">
            <li>Five days of Diwali at home</li>
            <li>Puja steps in order, with next and previous</li>
            <li>Bedtime stories</li>
            <li>No ads</li>
          </ul>
        </div>
        </Reveal>
        </div>
        <div className="h-28 bg-gradient-to-b from-[#160100] via-[#c4845a] to-parchment" />
      </section>

      <section id="questions" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16">
        <Reveal>
          <p className="text-xs tracking-widest text-marigold uppercase">Questions</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Before you join the list.</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {questions.map(([question, answer], index) => (
            <Reveal key={question} delay={index * 40}>
              <details className="rounded-2xl border border-line bg-white p-5 shadow-[0_18px_40px_-28px_rgba(30,27,58,0.35)]">
                <summary className="cursor-pointer font-serif text-xl">{question}</summary>
                <p className="mt-3 border-t border-line pt-3 text-plum">{answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 text-center">
        <Reveal>
          <p className="text-xs tracking-widest uppercase">The app</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Free. No subscription and no ads.</h2>
          <p className="mt-3 font-serif text-plum italic">One home for the whole family.</p>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16">
        <Reveal>
        <p className="text-xs tracking-widest text-marigold uppercase">Contact</p>
        <h2 className="mt-4 font-serif text-4xl">Write to us.</h2>
        <p className="mt-4 text-plum">
          A note about a verse, a city, or the waitlist. It comes to us by email.
        </p>
        <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
