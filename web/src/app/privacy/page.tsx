import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy · SetuHome",
  description:
    "How SetuHome handles data on the website and in the iPhone and Android app. No ads, no sale of data, and no tracking across other apps.",
};

const practices = [
  ["Email address", "Waitlist, an account you create, or a note you send us.", "To write when the app is ready, to keep your city and reminders, or to answer you."],
  ["City", "The city you choose, or one we suggest if you allow location.", "Sunrise, tithi, and festival days for that place. Not a trail of where you go."],
  ["Approximate location", "Only if you allow it, and only to suggest a city.", "We do not collect precise location in the background."],
  ["Morning time", "The reminder hour you set.", "A local notification on your phone."],
  ["Words you type", "A guidance question, a search, or a contact note.", "To answer from the Gita or the Ramayana, to search, or to read your note."],
  ["Microphone", "Only while you choose to speak a search.", "Turned into text for that search. Not kept as a voice profile, and not used to copy anyone’s voice."],
  ["Story text", "The words of a story the app reads aloud.", "Sent so a voice can be generated. We do not send your name with that request."],
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-32 pb-24">
      <p className="text-xs tracking-widest text-marigold uppercase">Privacy</p>
      <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-plum">Last updated 11 October 2026</p>
      <p className="mt-6 leading-relaxed text-plum">
        This policy covers the SetuHome website and the SetuHome app on iPhone and Android. It is
        the policy to use for the Apple App Store and Google Play listings. SetuHome is operated
        from India for families who want the Gita, the Ramayana, festival days, and stories at
        home.
      </p>

      <Section title="The short version">
        <p>
          The app is free. There are no ads and no sale of personal data. We do not track you
          across other companies’ apps or websites. Kids’ mode asks for nothing: no name, no email,
          no chat, and no microphone.
        </p>
        <p>
          On this website, a waitlist address stays in your browser until a mail list is connected.
          It is not sent to a server from the page. In the app, we keep what the feature needs: a
          city, a morning time, and, if you ask a question or play a story, the text required to
          answer or to speak.
        </p>
      </Section>

      <Section title="Who this covers">
        <p>
          “We” means the people who operate SetuHome. The website and the apps are one product. If
          a parent sets up the phone, this policy applies to the parent. A child listening in kids’
          mode is not asked to make an account.
        </p>
        <p>
          We do not ask you to state a religion, caste, or tradition as a field on a profile. The
          app is for reading these texts and keeping festival days. We do not sell the fact that
          you use it, and we do not use it to advertise.
        </p>
      </Section>

      <Section title="The website">
        <p>
          Joining the waitlist writes the email address into local storage on that phone or
          computer. You can clear it by clearing the site data in the browser. The contact form on
          the home page also keeps the note on that device. Neither one is transmitted to us from
          the page as it works today.
        </p>
        <p>
          The site does not use advertising cookies, and it does not load a third-party analytics
          product. Fonts are delivered with the site. If you follow a link to the App Store or to
          Google Play, that store’s own policy applies from the moment you leave SetuHome.
        </p>
      </Section>

      <Section title="The app">
        <p>Each item below is collected only when you use the feature that needs it.</p>
        <ul className="mt-4 space-y-4">
          {practices.map(([name, source, why]) => (
            <li key={name} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-serif text-xl text-ink">{name}</h3>
              <p className="mt-2 text-sm">{source}</p>
              <p className="mt-2 text-sm text-ink">{why}</p>
            </li>
          ))}
        </ul>
        <p>
          Reminders are scheduled on the device. We do not need a push token for a morning verse
          that stays on the phone. If a later version uses a remote notification, this policy will
          say so before that ships.
        </p>
        <p>
          Simple English for a verse is written before we ship and stored on the device. Opening a
          verse does not send the verse to an AI. Guidance sends the question to a server so the
          reply can quote a verse from the Gita or the Ramayana. The reply is not a person, and it
          does not speak as a deity. We do not use the question to build an advertising profile.
        </p>
        <p>
          A story’s words may be sent to a speech service so the app can play them. We send the
          text of the story, not a recording of your family, and we do not ask that service to
          advertise to you. Listen clips for Gita verses are recordings shipped with the app or
          downloaded as audio files. They are not a recording of you.
        </p>
      </Section>

      <Section title="Children">
        <p>
          Kids’ mode is stories only. It does not collect a name, an email address, a city, a
          photo, a contact list, or a voice. It has no chat and no ads. A child is not asked to
          create an account.
        </p>
        <p>
          The rest of the app is for a parent or another adult. You must be old enough to agree to
          the terms in your country before you create an account. If you believe a child has sent
          us personal information, write through the contact form and we will delete it.
        </p>
        <p>
          We do not knowingly collect personal information from children under 13, or under 16 where
          that is the age your local law uses. This includes the United States Children’s Online
          Privacy Protection Act, and the age rules that apply in the United Kingdom, the European
          Union, and other places the app is offered.
        </p>
      </Section>

      <Section title="What we do not do">
        <ul className="list-disc space-y-2 pl-5">
          <li>We do not sell personal information.</li>
          <li>We do not share it with data brokers.</li>
          <li>We do not use it for cross-app or cross-site tracking, and we do not use Apple’s
            advertising identifier or Google’s advertising identifier for ads.</li>
          <li>We do not show third-party ads.</li>
          <li>We do not read your contacts, photos, health data, or payment cards. The app does not
            take payment.</li>
          <li>We do not follow your location in the background.</li>
          <li>We do not require an account to read a verse that is already on the device.</li>
        </ul>
      </Section>

      <Section title="For the App Store and for Play">
        <p>
          Use this section when you fill in App Privacy on the App Store and the Data safety form
          on Google Play. It describes the first public release.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Data linked to a person, if they create an account: email address, city, and morning
            reminder time.</li>
          <li>Data used for app function and not for advertising: a guidance question, a spoken
            search, and story text sent for speech.</li>
          <li>Data not collected: precise background location, contacts, photos, financial info,
            health, browsing history from other apps, and advertising identifiers.</li>
          <li>Tracking: no.</li>
          <li>Shared with advertisers: no. A speech or model provider receives only the text needed
            for that request, under a contract that forbids using it to advertise.</li>
          <li>Account deletion: yes, from the profile screen once accounts exist, and by request
            through the contact form.</li>
        </ul>
        <p>
          Apple and Google may still receive diagnostics about crashes and installs under their own
          terms when someone downloads the app. That is their collection, not an analytics kit we
          add.
        </p>
      </Section>

      <Section title="Why we use data, and for how long">
        <p>
          We use data to run the feature you asked for, to keep the app reliable, and to answer
          you. We do not use it for a purpose that is different from the one named above.
        </p>
        <p>
          A waitlist address in the browser stays until you clear it. An account stays until you
          delete it. A guidance question is kept only as long as needed to return the answer and to
          investigate abuse, and not as a marketing list. Server logs that contain an IP address
          are kept for a short security window and then deleted or aggregated. Story audio cached
          on the phone stays until you remove the app or clear its storage.
        </p>
      </Section>

      <Section title="Where it is processed">
        <p>
          SetuHome is operated from India. A city calculation, a spoken story, or a guidance reply
          may be processed on a server in India or in the country of that provider. If you live in
          the United Kingdom, the European Economic Area, Canada, Australia, the United Arab
          Emirates, Singapore, the United States, or elsewhere, your information may leave your
          country for that purpose. We use providers that process it only on our instructions, over
          an encrypted connection (HTTPS).
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Depending on where you live, you can ask us to see the personal information we hold, to
          correct it, to delete it, to receive a copy, to limit or object to a use, or to withdraw
          a permission. That includes the rights under India’s Digital Personal Data Protection Act,
          the UK and EU GDPR, Canada’s PIPEDA, Australia’s Privacy Act, Singapore’s Personal Data
          Protection Act, the UAE’s personal-data rules, and US state laws such as the California
          Consumer Privacy Act. We do not sell or share personal information as those US laws
          define “sell” and “share.”
        </p>
        <p>
          Location, microphone, and notification permissions are controlled in iOS and Android
          settings. Denying a permission turns off the feature that needs it. The rest of the app
          still opens.
        </p>
        <p>
          To ask, use the <Link href="/#contact" className="underline">contact form</Link>. We may
          need to confirm that the request comes from you. We will not discriminate against you for
          asking. If a law gives you the right to complain to a regulator, you may do that as well.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Keys for speech and for any model stay on a server. They are not placed inside the app.
          No method of storage or transmission is perfect. If we learn of a breach that the law
          requires us to announce, we will tell the people affected and, where required, the
          authority.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If we start collecting something new, or start advertising, we will update this page and
          change the date at the top before that version of the app depends on it. The App Store
          and Play listings should point at this page.
        </p>
      </Section>

      <p className="mt-12 text-sm text-plum">
        The terms for using SetuHome are on the <Link href="/terms" className="underline">terms page</Link>.
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 space-y-4 leading-relaxed text-plum">
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
