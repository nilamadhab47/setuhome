import { STORE_KEYS, getItem, setItem } from "./store";

const key = STORE_KEYS.streak;

export const MARKS = [7, 21, 40, 108] as const;
export type Mark = (typeof MARKS)[number];

export type StreakState = {
  count: number;
  lastDay: string;
  seen: Mark[];
};

let memory: StreakState | null = null;

export function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function yesterdayKey(date = new Date()) {
  return dayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
}

function asMark(value: number): Mark | null {
  return MARKS.includes(value as Mark) ? (value as Mark) : null;
}

function parse(value: unknown): StreakState | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<StreakState>;
  const count = Number(row.count);
  const lastDay = typeof row.lastDay === "string" ? row.lastDay : "";
  if (!lastDay || !Number.isFinite(count) || count < 1) return null;
  const seen = Array.isArray(row.seen)
    ? row.seen.map((item) => asMark(Number(item))).filter((item): item is Mark => item !== null)
    : [];
  return { count: Math.floor(count), lastDay, seen };
}

function persist(next: StreakState) {
  memory = next;
  setItem(key, JSON.stringify(next));
}

export function readStreak(): StreakState | null {
  if (memory) return memory;
  try {
    memory = parse(JSON.parse(getItem(key) || "null"));
    return memory;
  } catch {
    return null;
  }
}

export function nextStreak(prev: StreakState | null, today: string, yesterday: string): StreakState {
  if (!prev) return { count: 1, lastDay: today, seen: [] };
  if (prev.lastDay === today) return prev;
  if (prev.lastDay === yesterday) return { count: prev.count + 1, lastDay: today, seen: prev.seen };
  return { count: 1, lastDay: today, seen: [] };
}

export function reachedMark(state: StreakState): Mark | null {
  const mark = asMark(state.count);
  if (!mark || state.seen.includes(mark)) return null;
  return mark;
}

export function touchStreak(now = new Date()): StreakState {
  const next = nextStreak(readStreak(), dayKey(now), yesterdayKey(now));
  persist(next);
  return next;
}

export function markStreakSeen(mark: Mark): StreakState {
  const current = readStreak() ?? { count: mark, lastDay: dayKey(), seen: [] };
  const seen = current.seen.includes(mark) ? current.seen : [...current.seen, mark];
  const next = { ...current, seen };
  persist(next);
  return next;
}

export function markCopy(count: number) {
  if (count >= 108) return "A full round of mornings with the verse.";
  if (count >= 40) return "Forty mornings with the verse.";
  if (count >= 21) return "Twenty-one mornings with the verse.";
  if (count >= 7) return "A week of dawns with the verse.";
  return "Open Today each morning to keep the count.";
}

export const PATH = [
  { mark: 7 as Mark, title: "7 days", note: "The first week" },
  { mark: 21 as Mark, title: "21 days", note: "A habit taking shape" },
  { mark: 40 as Mark, title: "40 days", note: "A longer stretch" },
  { mark: 108 as Mark, title: "108 days", note: "A full round" },
];
