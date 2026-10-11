const opensKey = "setuhome-read-opens";
const continueKey = "setuhome-continue";
let opensMemory: Record<string, number> = {};
let continueMemory: ContinueRead | null = null;

export type ContinueRead = {
  ref: string;
  chapterId: string;
  at: number;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null") as T | null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readOpens(): Record<string, number> {
  const stored = readJson<Record<string, number>>(opensKey, opensMemory);
  opensMemory = stored && typeof stored === "object" ? { ...stored } : {};
  return { ...opensMemory };
}

export function recordOpen(chapterId: string, ref: string) {
  const opens = readOpens();
  opens[chapterId] = (opens[chapterId] ?? 0) + 1;
  opensMemory = opens;
  writeJson(opensKey, opens);
  const next = { ref, chapterId, at: Date.now() };
  continueMemory = next;
  writeJson(continueKey, next);
  return next;
}

export function readContinue(): ContinueRead | null {
  if (continueMemory) return continueMemory;
  const stored = readJson<ContinueRead | null>(continueKey, null);
  continueMemory = stored;
  return stored;
}

export function continueLabel(at: number) {
  const minutes = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} day ago`;
}
