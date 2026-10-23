import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORE_KEYS = {
  household: "setuhome-household",
  streak: "setuhome-streak",
  saved: "setuhome-saved-verses",
  opens: "setuhome-read-opens",
  continue: "setuhome-continue",
  prep: "setuhome-diwali-prep",
  ceremony: "setuhome-satyanarayan-step",
} as const;

const memory = new Map<string, string>();
const allKeys = Object.values(STORE_KEYS);

function webGet(key: string) {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function webSet(key: string, value: string) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Keep the value in memory.
  }
}

export function getItem(key: string) {
  if (memory.has(key)) return memory.get(key) ?? null;
  const fromWeb = webGet(key);
  if (fromWeb != null) {
    memory.set(key, fromWeb);
    return fromWeb;
  }
  return null;
}

export function setItem(key: string, value: string) {
  memory.set(key, value);
  webSet(key, value);
  void AsyncStorage.setItem(key, value);
}

export async function hydrateStore() {
  try {
    const pairs = await AsyncStorage.multiGet(allKeys);
    for (const [key, value] of pairs) {
      if (key && value != null && !memory.has(key)) memory.set(key, value);
    }
  } catch {
    // Native storage is unavailable; web localStorage still works via getItem.
  }
  for (const key of allKeys) {
    const fromWeb = webGet(key);
    if (fromWeb != null && !memory.has(key)) memory.set(key, fromWeb);
  }
}
