import { allVerses, placeOf, type Verse } from "./verse";

export type Book = Verse["book"];
export type SortMode = "popular" | "order";

export type CatalogItem = {
  id: string;
  book: Book;
  kanda?: string;
  chapter: number;
  titleSa: string;
  titleEn: string;
  verseCount: number;
  firstRef: string;
  preview: string;
  themes: string[];
};

export const GITA_THEMES = [
  "Duty",
  "Fear",
  "Grief",
  "Peace",
  "Purpose",
  "Anger",
  "Devotion",
] as const;

const GITA_META: { n: number; sa: string; en: string; themes: string[]; seed: number }[] = [
  { n: 1, sa: "अर्जुनविषादयोग", en: "Arjuna’s despair", themes: ["Fear", "Grief", "Anger"], seed: 11 },
  { n: 2, sa: "साङ्ख्ययोग", en: "The yoga of knowledge", themes: ["Duty", "Grief", "Purpose"], seed: 18 },
  { n: 3, sa: "कर्मयोग", en: "The yoga of action", themes: ["Duty", "Purpose"], seed: 14 },
  { n: 4, sa: "ज्ञानकर्मसंन्यासयोग", en: "Wisdom in action", themes: ["Duty", "Purpose"], seed: 10 },
  { n: 5, sa: "कर्मसंन्यासयोग", en: "Renunciation", themes: ["Peace"], seed: 8 },
  { n: 6, sa: "आत्मसंयमयोग", en: "Meditation", themes: ["Peace"], seed: 12 },
  { n: 7, sa: "ज्ञानविज्ञानयोग", en: "Knowledge and realization", themes: ["Devotion"], seed: 9 },
  { n: 8, sa: "अक्षरब्रह्मयोग", en: "The imperishable", themes: ["Peace"], seed: 7 },
  { n: 9, sa: "राजविद्याराजगुह्ययोग", en: "Royal knowledge", themes: ["Devotion"], seed: 13 },
  { n: 10, sa: "विभूतियोग", en: "Divine manifestations", themes: ["Devotion"], seed: 6 },
  { n: 11, sa: "विश्वरूपदर्शनयोग", en: "The vision of the form", themes: ["Fear", "Devotion"], seed: 15 },
  { n: 12, sa: "भक्तियोग", en: "Devotion", themes: ["Devotion", "Peace"], seed: 17 },
  { n: 13, sa: "क्षेत्रक्षेत्रज्ञविभागयोग", en: "The field and the knower", themes: ["Peace"], seed: 5 },
  { n: 14, sa: "गुणत्रयविभागयोग", en: "The three qualities", themes: ["Purpose"], seed: 4 },
  { n: 15, sa: "पुरुषोत्तमयोग", en: "The supreme person", themes: ["Devotion"], seed: 8 },
  { n: 16, sa: "दैवासुरसम्पद्विभागयोग", en: "The divine and the harsh", themes: ["Anger"], seed: 3 },
  { n: 17, sa: "श्रद्धात्रयविभागयोग", en: "Three kinds of faith", themes: ["Duty"], seed: 2 },
  { n: 18, sa: "मोक्षसंन्यासयोग", en: "Release and letting go", themes: ["Duty", "Devotion"], seed: 16 },
];

const KANDA_META: { n: number; name: string; sa: string; en: string; seed: number }[] = [
  { n: 1, name: "Bala", sa: "बालकाण्ड", en: "Bala", seed: 14 },
  { n: 2, name: "Ayodhya", sa: "अयोध्याकाण्ड", en: "Ayodhya", seed: 12 },
  { n: 3, name: "Aranya", sa: "अरण्यकाण्ड", en: "Aranya", seed: 10 },
  { n: 4, name: "Kishkindha", sa: "किष्किन्धाकाण्ड", en: "Kishkindha", seed: 8 },
  { n: 5, name: "Sundara", sa: "सुन्दरकाण्ड", en: "Sundara", seed: 18 },
  { n: 6, name: "Yuddha", sa: "युद्धकाण्ड", en: "Yuddha", seed: 16 },
  { n: 7, name: "Uttara", sa: "उत्तरकाण्ड", en: "Uttara", seed: 6 },
];

const verses = allVerses();
const gitaItems: CatalogItem[] = [];
const kandaItems: CatalogItem[] = [];
const sargaItems = new Map<string, CatalogItem[]>();
const haystack = new Map<string, string>();
const seedScore = new Map<string, number>();

function previewOf(verse: Verse) {
  return verse.sanskrit[0] || verse.transliteration[0] || verse.ref;
}

for (const meta of GITA_META) {
  const rows = verses
    .filter((row) => row.book === "gita" && placeOf(row).chapter === meta.n)
    .sort((a, b) => placeOf(a).verse - placeOf(b).verse);
  if (!rows.length) continue;
  const id = `gita:${meta.n}`;
  seedScore.set(id, meta.seed);
  gitaItems.push({
    id,
    book: "gita",
    chapter: meta.n,
    titleSa: meta.sa,
    titleEn: meta.en,
    verseCount: rows.length,
    firstRef: rows[0].ref,
    preview: previewOf(rows[0]),
    themes: meta.themes,
  });
}

for (const meta of KANDA_META) {
  const rows = verses
    .filter((row) => row.book === "ramayana" && row.kanda === meta.name)
    .sort((a, b) => placeOf(a).chapter - placeOf(b).chapter || placeOf(a).verse - placeOf(b).verse);
  if (!rows.length) continue;
  const id = `ramayana:${meta.name}`;
  seedScore.set(id, meta.seed);
  kandaItems.push({
    id,
    book: "ramayana",
    kanda: meta.name,
    chapter: meta.n,
    titleSa: meta.sa,
    titleEn: meta.en,
    verseCount: rows.length,
    firstRef: rows[0].ref,
    preview: previewOf(rows[0]),
    themes: [],
  });
  const bySarga = new Map<number, Verse[]>();
  for (const row of rows) {
    const sarga = placeOf(row).chapter;
    const bucket = bySarga.get(sarga);
    if (bucket) bucket.push(row);
    else bySarga.set(sarga, [row]);
  }
  const sargas: CatalogItem[] = [];
  for (const sarga of [...bySarga.keys()].sort((a, b) => a - b)) {
    const verses = bySarga.get(sarga) ?? [];
    const sargaId = `ramayana:${meta.name}:${sarga}`;
    seedScore.set(sargaId, 0);
    sargas.push({
      id: sargaId,
      book: "ramayana",
      kanda: meta.name,
      chapter: sarga,
      titleSa: `सर्ग ${sarga}`,
      titleEn: `Sarga ${sarga}`,
      verseCount: verses.length,
      firstRef: verses[0].ref,
      preview: previewOf(verses[0]),
      themes: [],
    });
  }
  sargaItems.set(id, sargas);
}

for (const row of verses) {
  haystack.set(
    row.ref,
    `${row.ref} ${row.sanskrit.join(" ")} ${row.transliteration.join(" ")} ${row.english} ${row.simple?.simpleEnglish ?? ""}`.toLowerCase(),
  );
}

export function catalogFor(book: Book): CatalogItem[] {
  return book === "gita" ? gitaItems : kandaItems;
}

export function sargasFor(kandaId: string): CatalogItem[] {
  return sargaItems.get(kandaId) ?? [];
}

export function itemById(id: string): CatalogItem | undefined {
  return gitaItems.find((item) => item.id === id) || kandaItems.find((item) => item.id === id) ||
    [...sargaItems.values()].flat().find((item) => item.id === id);
}

export function scoreOf(id: string, opens: Record<string, number>) {
  return (opens[id] ?? 0) * 1000 + (seedScore.get(id) ?? 0);
}

export function sortedCatalog(items: CatalogItem[], mode: SortMode, opens: Record<string, number>) {
  const copy = [...items];
  if (mode === "order") {
    return copy.sort((a, b) => a.chapter - b.chapter || a.titleEn.localeCompare(b.titleEn));
  }
  return copy.sort((a, b) => scoreOf(b.id, opens) - scoreOf(a.id, opens) || a.chapter - b.chapter);
}

export function searchVerses(query: string, book: Book): Verse[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: Verse[] = [];
  for (const row of verses) {
    if (row.book !== book) continue;
    if ((haystack.get(row.ref) || "").includes(needle)) hits.push(row);
    if (hits.length >= 25) break;
  }
  return hits;
}
