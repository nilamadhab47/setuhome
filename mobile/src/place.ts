import cities from "./cities.json";

export type Place = {
  name: string;
  aliases: string[];
  lat: number;
  lng: number;
  tz: string;
  elevation: number;
};

type CityRow = {
  name: string;
  aliases?: string[];
  lat: number;
  lng: number;
  tz: string;
  elevation?: number;
};

export const PLACES: Place[] = (cities as CityRow[]).map((row) => ({
  name: row.name,
  aliases: row.aliases ?? [],
  lat: row.lat,
  lng: row.lng,
  tz: row.tz,
  elevation: row.elevation ?? 0,
}));

export const CHIP_CITIES = [
  "Mumbai, MH",
  "Bengaluru, KA",
  "Delhi, DL",
  "Chennai, TN",
  "Hyderabad, TS",
  "Kolkata, WB",
  "London, UK",
  "Singapore",
] as const;

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string) {
  return fold(value).split(" ").filter(Boolean);
}

function scorePlace(place: Place, query: string) {
  const needle = fold(query);
  if (!needle) return 0;
  const labels = [place.name, ...place.aliases].map(fold);
  if (labels.includes(needle)) return 100;
  if (labels.some((label) => label.startsWith(needle) || needle.startsWith(label))) return 80;
  if (labels.some((label) => label.includes(needle))) return 60;
  const parts = tokens(query);
  if (parts.length && parts.every((part) => labels.some((label) => label.includes(part)))) return 40;
  return 0;
}

export function findPlace(query: string): Place | null {
  const needle = query.trim();
  if (!needle) return null;
  let best: Place | null = null;
  let bestScore = 0;
  for (const place of PLACES) {
    const next = scorePlace(place, needle);
    if (next > bestScore) {
      best = place;
      bestScore = next;
    }
  }
  return bestScore >= 40 ? best : null;
}

export function searchPlaces(query: string, limit = 12): Place[] {
  const needle = query.trim();
  if (!needle) {
    return CHIP_CITIES.map((name) => PLACES.find((place) => place.name === name)).filter((place): place is Place => Boolean(place));
  }
  return PLACES.map((place) => ({ place, score: scorePlace(place, needle) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.place);
}

export function timezoneOffsetMinutes(timeZone: string, date: Date): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
      hour: "numeric",
    }).formatToParts(date);
    const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "";
    const match = name.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
    if (!match) return null;
    const sign = match[1] === "-" ? -1 : 1;
    return sign * (Number(match[2]) * 60 + Number(match[3] || 0));
  } catch {
    return null;
  }
}

export function ymdInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) return date.toISOString().slice(0, 10);
  return `${year}-${month}-${day}`;
}

export function shiftYmd(ymd: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return ymd;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days, 12, 0, 0));
  return date.toISOString().slice(0, 10);
}

export function noonOnYmd(ymd: string, timeZone: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return new Date();
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcGuess = Date.UTC(year, month - 1, day, 12, 0, 0);
  const offset = timezoneOffsetMinutes(timeZone, new Date(utcGuess));
  if (offset == null) return new Date(utcGuess);
  return new Date(utcGuess - offset * 60_000);
}

type GeoRow = {
  name?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;
  admin1?: string;
  country_code?: string;
};

export async function geocodeCity(query: string): Promise<Place | null> {
  const needle = query.trim();
  if (!needle) return null;
  const listed = findPlace(needle);
  if (listed) return listed;
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(needle)}&count=5&language=en&format=json`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
    if (!response.ok) return null;
    const body = (await response.json()) as { results?: GeoRow[] };
    const row = body.results?.[0];
    if (typeof row?.latitude !== "number" || typeof row?.longitude !== "number") return null;
    const label = [row.name, row.admin1, row.country_code].filter(Boolean).join(", ");
    return {
      name: label || needle,
      aliases: row.name ? [row.name] : [],
      lat: row.latitude,
      lng: row.longitude,
      tz: row.timezone || "UTC",
      elevation: typeof row.elevation === "number" ? row.elevation : 0,
    };
  } catch {
    return null;
  }
}
