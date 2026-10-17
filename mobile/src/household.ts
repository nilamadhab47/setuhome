import { CHIP_CITIES, findPlace, type Place } from "./place";
import { STORE_KEYS, getItem, setItem } from "./store";

const key = STORE_KEYS.household;

export const CITIES = CHIP_CITIES;

export type Household = {
  city: string;
  morningHour: number;
  morningMinute: number;
  kids: boolean;
  lat?: number;
  lng?: number;
  tz?: string;
  elevation?: number;
  observeDay?: string | null;
};

const fallback: Household = {
  city: "",
  morningHour: 7,
  morningMinute: 0,
  kids: true,
};

let memory: Household | null = null;

function clampHour(value: number) {
  if (!Number.isFinite(value)) return fallback.morningHour;
  return Math.min(23, Math.max(0, Math.round(value)));
}

function clampMinute(value: number) {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value / 15) * 15;
  if (rounded >= 60) return 0;
  if (rounded < 0) return 45;
  return rounded;
}

function finiteNumber(value: unknown): number | undefined {
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function parseDay(value: unknown): string | null | undefined {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function withPlace(household: Household, place: Place | null): Household {
  if (!place) return household;
  return {
    ...household,
    city: place.name || household.city,
    lat: place.lat,
    lng: place.lng,
    tz: place.tz,
    elevation: place.elevation,
  };
}

function parse(value: unknown): Household | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<Household>;
  const city = typeof row.city === "string" ? row.city.trim() : "";
  if (!city) return null;
  const listed = findPlace(city);
  const lat = finiteNumber(row.lat) ?? listed?.lat;
  const lng = finiteNumber(row.lng) ?? listed?.lng;
  const tz = typeof row.tz === "string" && row.tz ? row.tz : listed?.tz;
  const elevation = finiteNumber(row.elevation) ?? listed?.elevation;
  return {
    city,
    morningHour: clampHour(Number(row.morningHour)),
    morningMinute: clampMinute(Number(row.morningMinute)),
    kids: row.kids !== false,
    lat,
    lng,
    tz,
    elevation,
    observeDay: parseDay(row.observeDay),
  };
}

export function readHousehold(): Household | null {
  if (memory) return memory;
  try {
    memory = parse(JSON.parse(getItem(key) || "null"));
    return memory;
  } catch {
    return null;
  }
}

export function writeHousehold(next: Household) {
  const saved = parse(next);
  if (!saved) return null;
  memory = saved;
  setItem(key, JSON.stringify(saved));
  return saved;
}

export function phoneTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export function formatMorning(hour: number, minute: number) {
  const meridiem = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

export function fromTwelveHour(hour12: number, minute: number, meridiem: "AM" | "PM") {
  const wrapped = hour12 <= 0 ? 12 : hour12 > 12 ? 1 : hour12;
  const hour = meridiem === "PM" ? (wrapped % 12) + 12 : wrapped % 12;
  return { hour, minute: clampMinute(minute) };
}

export function toTwelveHour(hour: number, minute: number) {
  const meridiem: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  return {
    hour12: hour % 12 === 0 ? 12 : hour % 12,
    minute: clampMinute(minute),
    meridiem,
  };
}
