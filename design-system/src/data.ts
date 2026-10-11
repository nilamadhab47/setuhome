export type TextChoice = "gita" | "ramayana" | "both";
export type Screen =
  | "today"
  | "read"
  | "verse"
  | "festivals"
  | "ceremony"
  | "guest"
  | "setup"
  | "foundations";

export type Verse = {
  ref: string;
  work: string;
  chapter: string;
  sanskrit: string[];
  iast: string[];
  explanation: string;
};

/** Layout samples. Sanskrit is the standard verse. English is not a signed explanation. */
export const verses: Verse[] = [
  {
    ref: "BG 2.47",
    work: "Bhagavad Gita",
    chapter: "Chapter 2",
    sanskrit: ["कर्मण्येवाधिकारस्ते", "मा फलेषु कदाचन ।", "मा कर्मफलहेतुर्भूर्", "मा ते सङ्गोऽस्त्वकर्मणि ॥"],
    iast: ["karmaṇy-evādhikāras te", "mā phaleṣu kadācana", "mā karma-phala-hetur bhūr", "mā te saṅgo ’stv akarmaṇi"],
    explanation:
      "You can choose the action in front of you. You cannot hold the result. Do the work, and leave what it becomes.",
  },
  {
    ref: "BG 2.14",
    work: "Bhagavad Gita",
    chapter: "Chapter 2",
    sanskrit: ["मात्रास्पर्शास्तु कौन्तेय", "शीतोष्णसुखदुःखदाः ।", "आगमापायिनोऽनित्याः", "तांस्तितिक्षस्व भारत ॥"],
    iast: ["mātrā-sparśās tu kaunteya", "śītoṣṇa-sukha-duḥkha-dāḥ", "āgamāpāyino ’nityās", "tāṁs titikṣasva bhārata"],
    explanation: "Heat and cold, pleasure and pain, arrive and leave. They do not stay. Let them pass through.",
  },
  {
    ref: "BG 6.5",
    work: "Bhagavad Gita",
    chapter: "Chapter 6",
    sanskrit: ["उद्धरेदात्मनात्मानं", "नात्मानमवसादयेत् ।", "आत्मैव ह्यात्मनो बन्धुर्", "आत्मैव रिपुरात्मनः ॥"],
    iast: ["uddhared ātmanātmānaṁ", "nātmānam avasādayet", "ātmaiva hy ātmano bandhur", "ātmaiva ripur ātmanaḥ"],
    explanation: "Lift yourself. Do not pull yourself down. You can be a friend to yourself, or your own obstacle.",
  },
];

export const todayVerse = verses[0];

export const cities = [
  "Delhi",
  "Edison, New Jersey",
  "San Jose",
  "Houston",
  "Toronto",
  "London",
  "Dubai",
  "Singapore",
];

export const times = ["7:00 am", "8:30 am", "12:30 pm", "9:00 pm"];

export const gitaChapters: { n: number; name: string; gloss: string; verses: number }[] = [
  { n: 1, name: "Arjuna Vishada Yoga", gloss: "Arjuna’s sorrow", verses: 47 },
  { n: 2, name: "Sankhya Yoga", gloss: "How to stand in the middle of it", verses: 72 },
  { n: 3, name: "Karma Yoga", gloss: "Action without clinging", verses: 43 },
  { n: 4, name: "Jnana Yoga", gloss: "Knowledge, and how it is passed on", verses: 42 },
  { n: 5, name: "Karma Sannyasa Yoga", gloss: "Letting go while still acting", verses: 29 },
  { n: 6, name: "Dhyana Yoga", gloss: "Sitting still", verses: 47 },
  { n: 7, name: "Jnana Vijnana Yoga", gloss: "Knowing, and knowing from experience", verses: 30 },
  { n: 8, name: "Akshara Brahma Yoga", gloss: "What does not pass away", verses: 28 },
  { n: 9, name: "Raja Vidya Yoga", gloss: "The teaching Krishna calls the secret", verses: 34 },
  { n: 10, name: "Vibhuti Yoga", gloss: "Where the divine shows up in the world", verses: 42 },
  { n: 11, name: "Vishvarupa Darshana Yoga", gloss: "Arjuna sees the whole", verses: 55 },
  { n: 12, name: "Bhakti Yoga", gloss: "Devotion", verses: 20 },
  { n: 13, name: "Kshetra Kshetrajna Yoga", gloss: "The field, and the one who knows it", verses: 35 },
  { n: 14, name: "Gunatraya Yoga", gloss: "The three qualities of nature", verses: 27 },
  { n: 15, name: "Purushottama Yoga", gloss: "The person beyond the perishable", verses: 20 },
  { n: 16, name: "Daivasura Yoga", gloss: "Two tendencies in a person", verses: 24 },
  { n: 17, name: "Shraddhatraya Yoga", gloss: "Three kinds of trust", verses: 28 },
  { n: 18, name: "Moksha Sannyasa Yoga", gloss: "Release, and the last teaching", verses: 78 },
];

export const ramayanaKandas = [
  { name: "Ayodhya Kanda", line: "The exile, and the promises made at home", included: true },
  { name: "Sundara Kanda", line: "Hanuman crosses the sea and finds Sita", included: true },
  { name: "Bala Kanda", line: "Added in this same reader when the text is ready", included: false },
  { name: "Aranya Kanda", line: "Added in this same reader when the text is ready", included: false },
  { name: "Kishkindha Kanda", line: "Added in this same reader when the text is ready", included: false },
  { name: "Yuddha Kanda", line: "Added in this same reader when the text is ready", included: false },
  { name: "Uttara Kanda", line: "Added in this same reader when the text is ready", included: false },
];

/** Layout sample only. Not a reviewed liturgy. */
export const ceremonySteps = [
  {
    title: "The lamp is lit",
    meaning: "People settle. A lamp is lit before anything is asked or offered.",
    child: "We light a lamp so everyone knows something careful is about to begin.",
    sanskrit: "",
    iast: "",
    doing: "Sit facing the altar. Phones can stay low.",
  },
  {
    title: "Sankalpa",
    meaning: "The host says, in a few words, why everyone has gathered today.",
    child: "Someone says out loud why this day matters to the family.",
    sanskrit: "",
    iast: "",
    doing: "Listen. The names of the family may be spoken here.",
  },
  {
    title: "The katha",
    meaning: "The story is read in parts. Each part is a chapter of the vow.",
    child: "This is the story. It has five parts. We stay until it ends.",
    sanskrit: "ॐ नमो भगवते सत्यनारायणाय",
    iast: "om namo bhagavate satyanārāyaṇāya",
    doing: "Some families hold a few grains of rice while they listen.",
  },
  {
    title: "Aarti",
    meaning: "A lamp is circled, then the food that was offered is shared.",
    child: "The lamp comes around. Then everyone eats a little of the same sweet.",
    sanskrit: "",
    iast: "",
    doing: "Stand if you can. Take the light with both hands, then pass it on.",
  },
];

export const diwaliDays = [
  { name: "Dhanteras", line: "The first evening. The home is cleaned and a lamp is kept." },
  { name: "Naraka Chaturdashi", line: "The day before Diwali. An early lamp, and a bath." },
  { name: "Diwali", line: "Lakshmi puja after sunset. This evening has its own steps." },
  { name: "Govardhan", line: "The day after. A meal shared with the household." },
  { name: "Bhai Dooj", line: "Brothers and sisters meet. A tilak, then food." },
];

export const readings: { id: TextChoice; label: string; line: string }[] = [
  { id: "both", label: "Gita and Ramayana", line: "The daily verse alternates between the two" },
  { id: "gita", label: "Bhagavad Gita", line: "The daily verse stays in the Gita" },
  { id: "ramayana", label: "Valmiki Ramayana", line: "The daily verse stays in the Ramayana" },
];
