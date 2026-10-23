import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for the SetuHome website and the free iPhone and Android app: scripture, festivals, guidance, and stories for families.",
  alternates: { canonical: "/terms" },
  openGraph: {
    url: "/terms",
    title: "Terms · SetuHome",
    description:
      "Terms for the SetuHome website and the free iPhone and Android app: scripture, festivals, guidance, and stories for families.",
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-32 pb-24">
      <p className="text-xs tracking-widest text-marigold uppercase">Terms</p>
      <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">Terms of use</h1>
      <p className="mt-4 text-sm text-plum">Last updated 11 October 2026</p>
      <p className="mt-6 leading-relaxed text-plum">
        These terms cover the SetuHome website and the SetuHome app on iPhone and Android. By using
        the website, joining the waitlist, or installing the app, you agree to them. If you do not
        agree, do not use SetuHome. The <Link href="/privacy" className="underline">privacy policy</Link>{" "}
        explains what information is handled and is part of these terms.
      </p>

      <Section title="The service">
        <p>
          SetuHome is a free family app for a daily verse from the Bhagavad Gita and the Valmiki
          Ramayana, festival days for your city, and stories for children. It is operated from
          India. The first public release does not charge a subscription, does not sell in-app
          purchases, and does not show ads.
        </p>
        <p>
          Features can change as the app is built. A screen in a design is not a promise that every
          control is in the first build. We may add, pause, or remove a feature, and we will keep
          the privacy policy accurate when data practices change.
        </p>
      </Section>

      <Section title="Who may use it">
        <p>
          You need to be old enough, in the country where you live, to agree to a contract before
          you create an account or join the waitlist. In many places that is 18. If you are younger,
          a parent or guardian should be the one who installs the app and agrees to these terms.
        </p>
        <p>
          Kids’ mode is for listening to stories. It is not an account for a child. A parent decides
          whether a child may use it.
        </p>
      </Section>

      <Section title="Price">
        <p>
          The website and the app are free to download and free to use. There is no trial that
          turns into a charge, and there is no family plan fee. Apple or Google does not bill you
          for SetuHome. If a price is introduced later, it will be shown before you pay, and these
          terms will be updated. A free app today is not a promise that every future feature stays
          free, but nothing already on your phone will start charging without a new agreement.
        </p>
      </Section>

      <Section title="Accounts">
        <p>
          An account, when it is offered, holds the city you choose and the morning time you set.
          You are responsible for the device you install on. Tell us through the contact form if
          you believe someone else is using your account.
        </p>
        <p>
          You can delete an account from the profile screen in the app once accounts exist, and you
          can ask us to delete it through the <Link href="/#contact" className="underline">contact form</Link>.
          Deletion removes the account and the city and reminder time tied to it. Verses already
          stored on the device for offline reading may remain until you delete the app. Apple and
          Google also let you remove the app from the device.
        </p>
      </Section>

      <Section title="Scripture, guidance, and ceremonies">
        <p>
          Verses are shown from sourced texts. Sanskrit and transliteration are part of the reading.
          English is shown when a sourced translation is attached. Simple English on the card is an
          explanation generated from that sourced line before the app is shipped. It is not the
          translator’s wording, and opening a verse does not call a model. A verse with no sourced
          English is shown in Sanskrit and transliteration only. We do not invent a verse, a
          translation, or a festival time.
        </p>
        <p>
          Guidance, when you use it, quotes a verse from the Gita or the Ramayana and stays inside
          those texts. It is software. It is not a person, not a priest, and not a counsellor. It
          does not speak as Krishna, Rama, or any deity. It is not medical, mental-health, legal, or
          financial advice. If you or someone with you is in danger, contact local emergency
          services. Do not rely on the app for that.
        </p>
        <p>
          Festival days and muhurats are calculated for the city you set, from the data that
          calculation returns. If it returns no time, the app does not fill one in. A temple,
          a family, or another tradition may keep a different day. The person hosting a gathering
          can move the household date. Steps for a home ceremony follow one named tradition and are
          reviewed before they are shown. They are an aid for a household, not a ruling that every
          community observes the rite the same way.
        </p>
      </Section>

      <Section title="Stories for children">
        <p>
          Stories are for listening at home. They are not a school curriculum, not a substitute for
          a teacher, and not counselling. Kids’ mode collects nothing and has no chat. The app does
          not clone a family member’s voice. Narration is a generated or recorded reading, not a
          named living person unless we have said so in the app.
        </p>
      </Section>

      <Section title="What you may do">
        <p>
          We give you a personal, non-exclusive, non-transferable licence to use the website and the
          app for your household, on the devices you own or control, for as long as these terms
          allow. You may not copy the app, resell it, rent it, or try to pull out its source code
          except where the law does not allow that limit. You may not use the app to build a
          competing dataset of our arrangement, prompts, or product text by automated scraping.
        </p>
        <p>
          You agree not to misuse the service. That includes breaking the law, trying to get into
          systems you do not operate, sending malware, harassing someone, or using guidance or
          stories to harm a child. We may suspend access when we have to, to protect families or
          the service.
        </p>
      </Section>

      <Section title="Your notes">
        <p>
          If you type a question, a search, or a contact note, you keep whatever rights you already
          had in your own words. You give us permission to use those words only to run the feature:
          to answer, to search, to generate speech from a story, or to read a note you sent. We do
          not claim ownership of your questions, and we do not sell them.
        </p>
      </Section>

      <Section title="Our content and scripture sources">
        <p>
          The app’s design, name, layout, and original writing belong to SetuHome or its licensors.
          Scripture is included only from sources that allow that use, including public-domain
          translations and texts we have a right to show. Those underlying texts are not “sold” to
          you. Names of deities, books, and festivals are used to identify the material, not to
          claim a trademark in them.
        </p>
        <p>
          SetuHome and सेतु are the names we use for this product. A public name can still change
          before a store listing is final. Do not register a confusingly similar app name in a store
          in a way that suggests you are this product.
        </p>
      </Section>

      <Section title="Stores, devices, and other services">
        <p>
          If you download the app from the Apple App Store, Apple’s standard licensed-application
          terms also apply where Apple requires them, and Apple is not a party to these terms and
          has no duty to provide support. If you download it from Google Play, Google’s Play terms
          apply to the download, and Google is not a party to these terms. Questions about SetuHome
          come to us, not to Apple or Google.
        </p>
        <p>
          Sunrise, speech, and guidance may depend on a service outside the phone. If that service
          fails, the related feature may be unavailable. We do not control Apple, Google, or your
          network.
        </p>
      </Section>

      <Section title="Disclaimers">
        <p>
          The website and the app are provided “as is” and “as available.” To the extent the law
          allows, we disclaim warranties of merchantability, fitness for a particular purpose,
          quiet enjoyment, and non-infringement, and any warranty that a festival time, a
          translation, or a reply will be complete or suited to your family, temple, or tradition.
          Some places do not allow these disclaimers, so they apply only as far as they legally can.
        </p>
        <p>
          Calculations can be wrong, a source can contain a mistake, and a phone can be offline. You
          are responsible for how your household uses a verse, a date, or a story.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          To the extent the law allows, SetuHome and the people who operate it are not liable for
          indirect, incidental, special, consequential, or punitive damages, or for lost profits,
          lost data, or a ceremony held on a day you later decide was not yours. Because the app is
          free, our total liability for a claim relating to the service is limited to the amount you
          paid us for it in the three months before the claim, which for the free release is zero.
        </p>
        <p>
          Nothing in these terms limits liability that the law does not allow us to limit, including
          liability for fraud, or for death or personal injury caused by negligence where that
          exclusion is forbidden.
        </p>
      </Section>

      <Section title="Ending use">
        <p>
          You may stop using SetuHome at any time and delete the app. We may stop offering the
          website or the app, or close an account that breaks these terms. Sections that by their
          nature should survive — intellectual property, disclaimers, liability, and the law that
          governs — continue after use ends.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms as the app grows. The date at the top will change. If a change
          is material, we will post it on this page before it applies to a new version. Continuing
          to use SetuHome after the new date means you accept the update. If you do not accept it,
          stop using the app and delete your account.
        </p>
      </Section>

      <Section title="Law">
        <p>
          These terms are governed by the laws of India, without regard to conflict-of-law rules.
          Courts in India have jurisdiction, except where the law of your country gives you a right
          to bring a claim in your local courts that cannot be waived, including consumer rights in
          the United Kingdom, the European Union, Australia, and similar places. The United Nations
          Convention on Contracts for the International Sale of Goods does not apply.
        </p>
        <p>
          If a court holds one part of these terms unenforceable, the rest stays in effect.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms go through the{" "}
          <Link href="/#contact" className="underline">contact form</Link> on the website. Please
          write before you file a formal complaint, so we can try to resolve it.
        </p>
      </Section>
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
