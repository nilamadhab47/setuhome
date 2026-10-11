import { listenAssets, listenEnglishAssets } from "./listen-assets";
import catalogFile from "./listen-catalog.json";
import { placeOf, type Verse } from "./verse";

export type ListenWord = {
  text: string;
  start: number;
  end: number;
};

export type ListenPart = {
  kind: "chant" | "english";
  label: string;
  words: ListenWord[];
  source?: string;
  uri?: string;
  asset?: number;
  rate: number;
};

export type ListenClip = {
  chant: ListenPart;
  english?: ListenPart;
};

type CatalogRow = {
  kind?: "recording" | "spoken";
  hfOffset?: number;
  shlokaId?: string;
  file?: string;
  words?: ListenWord[];
  source?: string;
  label?: string;
  englishFile?: string;
  englishSource?: string;
  englishLabel?: string;
  englishWords?: ListenWord[];
};

type CatalogFile = {
  gitaSource?: string;
  verses?: Record<string, CatalogRow>;
};

const HF_ROWS =
  "https://datasets-server.huggingface.co/rows?dataset=JDhruv14/Bhagavad-Gita_Audio&config=default&split=train";

const catalog = (catalogFile as CatalogFile).verses ?? {};
const gitaUriCache = new Map<number, string>();

export const LISTEN_MISSING = "The chant for this verse is not on the phone yet.";
export const LISTEN_FAILED = "The chant could not be opened on this device.";
export const CHANT_RATE = 1.15;

export function listenRow(verse: Verse): CatalogRow | undefined {
  return catalog[verse.ref];
}

export function listenLabel(verse: Verse): string {
  const row = listenRow(verse);
  if (row?.label) return row.label;
  if (row?.kind === "spoken" || verse.book === "ramayana") {
    return "A spoken reading of this verse, not a temple chant.";
  }
  return "A recording of this verse.";
}

export function englishListenLabel(verse: Verse): string {
  const row = listenRow(verse);
  if (row?.englishLabel) return row.englishLabel;
  return verse.simple?.simpleEnglish ? "The meaning after the chant." : "The English for this verse is not ready to hear.";
}

export function hasListenClip(verse: Verse): boolean {
  const row = listenRow(verse);
  if (verse.book === "gita" && (row?.hfOffset !== undefined || listenAssets[verse.ref] !== undefined)) return true;
  return listenAssets[verse.ref] !== undefined;
}

async function gitaRecordingUri(offset: number): Promise<string | undefined> {
  const cached = gitaUriCache.get(offset);
  if (cached) return cached;
  const response = await fetch(`${HF_ROWS}&offset=${offset}&length=1`);
  if (!response.ok) return undefined;
  const data = (await response.json()) as {
    rows?: { row?: { audio?: { src?: string }[] } }[];
  };
  const uri = data.rows?.[0]?.row?.audio?.[0]?.src;
  if (uri) gitaUriCache.set(offset, uri);
  return uri;
}

function partFromAsset(
  kind: ListenPart["kind"],
  label: string,
  words: ListenWord[],
  source: string | undefined,
  asset: number | undefined,
  rate: number,
): ListenPart | undefined {
  if (asset === undefined) return undefined;
  return { kind, label, words, source, asset, rate };
}

export async function resolveListenClip(verse: Verse): Promise<ListenClip | undefined> {
  const row = listenRow(verse);
  const chantAsset = listenAssets[verse.ref];
  let chant: ListenPart | undefined = partFromAsset(
    "chant",
    listenLabel(verse),
    row?.words ?? [],
    row?.source,
    chantAsset,
    verse.book === "gita" ? CHANT_RATE : 1,
  );
  if (!chant && verse.book === "gita") {
    const offset = row?.hfOffset;
    if (offset === undefined) return undefined;
    const uri = await gitaRecordingUri(offset);
    if (!uri) return undefined;
    chant = {
      kind: "chant",
      label: listenLabel(verse),
      words: row?.words ?? [],
      source: row?.source || "JDhruv14/Bhagavad-Gita_Audio",
      uri,
      rate: CHANT_RATE,
    };
  }
  if (!chant) return undefined;
  const english = partFromAsset(
    "english",
    englishListenLabel(verse),
    row?.englishWords ?? [],
    row?.englishSource || verse.simple?.promptVersion || "simple-en-v1",
    listenEnglishAssets[verse.ref],
    1,
  );
  return { chant, english };
}

export function activeWord(words: ListenWord[], time: number): ListenWord | undefined {
  return words.find((word) => time >= word.start && time < word.end);
}

export type SpokenPiece = { kind: "word" | "sep"; text: string };

export function splitSpoken(text: string): SpokenPiece[] {
  const parts: SpokenPiece[] = [];
  const re = /(\s+|[।॥|,]+)/g;
  let last = 0;
  let match: RegExpExecArray | null = re.exec(text);
  while (match) {
    if (match.index > last) parts.push({ kind: "word", text: text.slice(last, match.index) });
    parts.push({ kind: "sep", text: match[0] });
    last = match.index + match[0].length;
    match = re.exec(text);
  }
  if (last < text.length) parts.push({ kind: "word", text: text.slice(last) });
  return parts.filter((part) => part.text.length > 0);
}

export function spokenWordCount(lines: string[]): number {
  return lines.reduce((sum, line) => sum + splitSpoken(line).filter((part) => part.kind === "word").length, 0);
}

export function spokenWordIndex(
  words: ListenWord[],
  time: number,
  duration: number,
  displayWordCount: number,
): number {
  if (words.length > 0) {
    const hit = words.findIndex((word) => time >= word.start && time < word.end);
    if (hit >= 0) return hit;
    if (time >= (words[words.length - 1]?.end ?? 0)) return words.length - 1;
    return -1;
  }
  if (displayWordCount <= 0 || duration <= 0 || time < 0) return -1;
  return Math.min(displayWordCount - 1, Math.floor((time / duration) * displayWordCount));
}

export type SpokenSync = {
  part: ListenPart["kind"];
  time: number;
  duration: number;
  words: ListenWord[];
  playing: boolean;
};

export function partSource(part: ListenPart): number | { uri: string } | null {
  if (part.asset !== undefined) return part.asset;
  if (part.uri) return { uri: part.uri };
  return null;
}

export function listenFilename(verse: Verse): string {
  const place = placeOf(verse);
  if (verse.book === "gita") return `gita/${place.chapter}.${place.verse}.mp3`;
  return `ramayana/${verse.ref.split(" ").pop()}.mp3`;
}

export function applyPart(
  player: {
    replace: (source: number | { uri: string }) => unknown;
    setPlaybackRate: (rate: number) => void;
  },
  part: ListenPart,
) {
  if (part.asset !== undefined) player.replace(part.asset);
  else if (part.uri) player.replace({ uri: part.uri });
  try {
    player.setPlaybackRate(part.rate);
  } catch {
    /* rate applies once the source is loaded */
  }
}

export async function loadPart(
  player: {
    replace: (source: number | { uri: string }) => unknown;
    setPlaybackRate: (rate: number) => void;
  },
  part: ListenPart,
) {
  applyPart(player, part);
  await new Promise((resolve) => setTimeout(resolve, 40));
}

export function playbackEnded(status: {
  didJustFinish?: boolean;
  currentTime?: number;
  duration?: number;
  playing?: boolean;
  isBuffering?: boolean;
}): boolean {
  if (status.didJustFinish) return true;
  if (status.isBuffering) return false;
  const duration = status.duration || 0;
  const time = status.currentTime || 0;
  return duration > 0.3 && time >= duration - 0.2;
}
