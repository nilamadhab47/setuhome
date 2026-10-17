import { STORE_KEYS, getItem, setItem } from "./store";

const key = STORE_KEYS.saved;
const memory = new Set<string>();

function read(): string[] {
  try {
    const parsed = JSON.parse(getItem(key) || "[]") as string[];
    const list = Array.isArray(parsed) ? parsed : [];
    memory.clear();
    list.forEach((item) => memory.add(item));
    return list;
  } catch {
    return [...memory];
  }
}

export function isSaved(ref: string) {
  return read().includes(ref);
}

export function toggleSaved(ref: string) {
  const next = new Set(read());
  if (next.has(ref)) next.delete(ref);
  else next.add(ref);
  const list = [...next];
  memory.clear();
  list.forEach((item) => memory.add(item));
  setItem(key, JSON.stringify(list));
  return next.has(ref);
}
