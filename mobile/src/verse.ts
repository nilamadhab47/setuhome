import simpleFile from "./simple-english.json";
import verses from "./verses.json";

export type SimpleEnglish = {
  simpleEnglish: string;
  keyIdea?: string;
  contextNote?: string;
  difficultTerms?: string[];
  needsReview?: boolean;
  promptVersion?: string;
  model?: string;
  generatedAt?: string;
  source?: string;
  locked?: boolean;
};

export type Verse = {
  ref: string;
  book: "gita" | "ramayana";
  kanda?: string;
  sanskrit: string[];
  transliteration: string[];
  english: string;
  englishSource?: string;
  simple?: SimpleEnglish;
};

export const SIMPLE_UNAVAILABLE =
  "A simpler English for this verse is not ready yet. The original translation is still here.";
export const ENGLISH_UNAVAILABLE =
  "The English for this verse waits on a sourced translation. It is not written here.";

type SimpleFile = {
  promptVersion?: string;
  verses?: Record<string, SimpleEnglish>;
};

const simpleMap = ((simpleFile as SimpleFile).verses ?? {}) as Record<string, SimpleEnglish>;

function withSimple(row: Verse): Verse {
  const simple = simpleMap[row.ref];
  if (!simple?.simpleEnglish) return row;
  return { ...row, simple };
}

const list = (verses as Verse[]).map(withSimple);
const byRef = new Map(list.map((row) => [row.ref, row]));

export type Place = {
  book: Verse["book"];
  kanda?: string;
  chapter: number;
  verse: number;
  group: string;
};

export function originalWork(verse: Verse): string {
  if (verse.book === "gita") return "Sacred Books of the East, vol. 8 (1882)";
  return "The Ramayana, English translation (1891–94)";
}

export function placeOf(verse: Verse): Place {
  const parts = verse.ref.split(" ").pop()?.split(".") ?? [];
  const numbers = parts.map((part) => Number(part));
  if (verse.book === "gita") {
    const chapter = numbers[0] || 1;
    return { book: "gita", chapter, verse: numbers[1] || 1, group: `gita:${chapter}` };
  }
  const kandaNo = numbers[0] || 1;
  const sarga = numbers[1] || 1;
  const kanda = verse.kanda || "Bala";
  return {
    book: "ramayana",
    kanda,
    chapter: sarga,
    verse: numbers[2] || 1,
    group: `ramayana:${kanda}:${sarga}`,
  };
}

const groups = new Map<string, Verse[]>();
for (const row of list) {
  const key = placeOf(row).group;
  const bucket = groups.get(key);
  if (bucket) bucket.push(row);
  else groups.set(key, [row]);
}
for (const bucket of groups.values()) {
  bucket.sort((a, b) => placeOf(a).verse - placeOf(b).verse);
}

export function allVerses(): Verse[] {
  return list;
}

export function versesInGroup(group: string): Verse[] {
  return groups.get(group) ?? [];
}

export function verseForDate(date = new Date()): Verse {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return list[((Math.imul(day, 1103515245) + 12345) >>> 0) % list.length];
}

export function verseByRef(ref: string): Verse | undefined {
  return byRef.get(ref);
}

export function adjacentVerse(ref: string, step: -1 | 1): Verse | undefined {
  const current = byRef.get(ref);
  if (!current) return undefined;
  const group = versesInGroup(placeOf(current).group);
  const index = group.findIndex((row) => row.ref === ref);
  if (index < 0) return undefined;
  return group[index + step];
}
