const key = "setuhome-saved-verses";
const memory = new Set<string>();

function read(): string[] {
  if (typeof localStorage === "undefined") return [...memory];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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
  if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(list));
  return next.has(ref);
}
