import { Observer } from "astronomy-engine";
import { getPanchangam } from "@ishubhamx/panchangam-js/dist/core/panchangam";
import { getUpcomingFestivals } from "@ishubhamx/panchangam-js/dist/core/festivals";
import type { Festival } from "@ishubhamx/panchangam-js/dist/types/festivals";
import type { Household } from "./household";
import {
  findPlace,
  noonOnYmd,
  shiftYmd,
  timezoneOffsetMinutes,
  ymdInZone,
  type Place,
} from "./place";

export type FestivalHit = {
  name: string;
  day: string;
  category?: string;
  timings: Array<{ name: string; start?: string; end?: string }>;
};

export type DayPanchang = {
  city: string;
  day: string;
  sunrise?: string;
  sunset?: string;
  tithi?: string;
  paksha?: string;
  masa?: string;
  festivals: FestivalHit[];
};

const dayCache = new Map<string, DayPanchang | null>();
const upcomingCache = new Map<string, FestivalHit[]>();

export function placeForHousehold(household: Household): Place | null {
  if (Number.isFinite(household.lat) && Number.isFinite(household.lng) && household.tz) {
    return {
      name: household.city,
      aliases: [],
      lat: household.lat as number,
      lng: household.lng as number,
      tz: household.tz,
      elevation: Number.isFinite(household.elevation) ? (household.elevation as number) : 0,
    };
  }
  return findPlace(household.city);
}

function clockInZone(value: Date | null | undefined, timeZone: string): string | undefined {
  if (!value || Number.isNaN(value.getTime())) return undefined;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(value);
  } catch {
    return undefined;
  }
}

function dayLabel(ymd: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(noonOnYmd(ymd, timeZone));
  } catch {
    return ymd;
  }
}

function shortDayLabel(ymd: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "numeric",
      month: "long",
    }).format(noonOnYmd(ymd, timeZone));
  } catch {
    return ymd;
  }
}

function asDate(value: Date | string | number | undefined | null): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function festivalDay(festival: Festival, timeZone: string, fallback: string): string {
  const instant = asDate(festival.date) ?? asDate(festival.startDate);
  if (instant) return ymdInZone(instant, timeZone);
  return fallback;
}

function festivalTimings(festival: Festival, timeZone: string): FestivalHit["timings"] {
  if (!festival.timings?.length) return [];
  const rows: FestivalHit["timings"] = [];
  for (const timing of festival.timings) {
    const start = clockInZone(timing.start, timeZone);
    const end = clockInZone(timing.end, timeZone);
    if (!start && !end) continue;
    rows.push({ name: timing.name, start, end });
  }
  return rows;
}

function toHit(festival: Festival, timeZone: string, fallbackDay: string): FestivalHit {
  return {
    name: festival.name,
    day: festivalDay(festival, timeZone, fallbackDay),
    category: festival.category,
    timings: festivalTimings(festival, timeZone),
  };
}

function observerFor(place: Place) {
  return new Observer(place.lat, place.lng, place.elevation || 0);
}

function optionsFor(place: Place, date: Date) {
  const timezoneOffset = timezoneOffsetMinutes(place.tz, date);
  return Number.isFinite(timezoneOffset) ? { timezoneOffset: timezoneOffset as number } : undefined;
}

function readPanchangam(place: Place, date: Date) {
  const observer = observerFor(place);
  const options = optionsFor(place, date);
  try {
    return getPanchangam(date, observer, options);
  } catch {
    return getPanchangam(date, observer);
  }
}

export function dayPanchang(place: Place, ymd: string): DayPanchang | null {
  const key = `${place.lat}|${place.lng}|${place.tz}|${ymd}`;
  if (dayCache.has(key)) return dayCache.get(key) ?? null;
  try {
    const date = noonOnYmd(ymd, place.tz);
    const panchang = readPanchangam(place, date);
    const tithiName = panchang.tithis?.find((row) => row.index === panchang.tithi)?.name;
    const row: DayPanchang = {
      city: place.name,
      day: ymd,
      sunrise: clockInZone(panchang.sunrise, place.tz),
      sunset: clockInZone(panchang.sunset, place.tz),
      tithi: tithiName,
      paksha: panchang.paksha || undefined,
      masa: panchang.masa?.name
        ? panchang.masa.isAdhika
          ? `${panchang.masa.name} (Adhika)`
          : panchang.masa.name
        : undefined,
      festivals: (panchang.festivals ?? []).map((festival) => toHit(festival, place.tz, ymd)),
    };
    dayCache.set(key, row);
    return row;
  } catch {
    dayCache.set(key, null);
    return null;
  }
}

export function upcomingFestivals(place: Place, ymd: string, days = 45): FestivalHit[] {
  const key = `${place.lat}|${place.lng}|${place.tz}|${ymd}|${days}`;
  const cached = upcomingCache.get(key);
  if (cached) return cached;
  try {
    const date = noonOnYmd(ymd, place.tz);
    const timezoneOffset = timezoneOffsetMinutes(place.tz, date);
    const rows = getUpcomingFestivals({
      date,
      observer: observerFor(place),
      days,
      ...(timezoneOffset == null ? {} : { timezoneOffset }),
    });
    const hits = rows.map((festival) => toHit(festival, place.tz, ymd));
    upcomingCache.set(key, hits);
    return hits;
  } catch {
    upcomingCache.set(key, []);
    return [];
  }
}

function isDiwali(name: string) {
  const folded = name.toLowerCase();
  if (!folded.includes("diwali") && !folded.includes("deepavali")) return false;
  if (folded.includes("choti") || folded.includes("chhoti") || folded.includes("naraka")) return false;
  if (folded.includes("dev diwali") || folded.includes("dev deepavali")) return false;
  return true;
}

export function diwaliFrom(upcoming: FestivalHit[]): FestivalHit | null {
  return upcoming.find((row) => isDiwali(row.name)) ?? null;
}

export type HouseholdCalendar = {
  place: Place | null;
  day: string;
  phoneDay: string;
  shifted: boolean;
  panchang: DayPanchang | null;
  upcoming: FestivalHit[];
  diwali: FestivalHit | null;
  dayLabel: string;
  shortDayLabel: string;
};

export function calendarForHousehold(household: Household, now = new Date(), useObserveDay = true): HouseholdCalendar {
  const place = placeForHousehold(household);
  const zone = place?.tz || household.tz || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const phoneDay = ymdInZone(now, zone);
  const observed = household.observeDay && /^\d{4}-\d{2}-\d{2}$/.test(household.observeDay) ? household.observeDay : phoneDay;
  const day = useObserveDay ? observed : phoneDay;
  const panchang = place ? dayPanchang(place, day) : null;
  const upcoming = place ? upcomingFestivals(place, shiftYmd(day, -7), 52) : [];
  return {
    place,
    day,
    phoneDay,
    shifted: day !== phoneDay,
    panchang,
    upcoming,
    diwali: diwaliFrom(upcoming),
    dayLabel: dayLabel(day, zone),
    shortDayLabel: shortDayLabel(day, zone),
  };
}

export function tithiLine(panchang: DayPanchang | null): string | undefined {
  if (!panchang) return undefined;
  const tithi = [panchang.paksha, panchang.tithi].filter(Boolean).join(" ");
  if (tithi && panchang.sunrise) return `${tithi} · sunrise ${panchang.sunrise}`;
  if (tithi) return tithi;
  if (panchang.sunrise) return `Sunrise ${panchang.sunrise}`;
  return undefined;
}

export function formatFestivalWhen(hit: FestivalHit, timeZone: string): string {
  return shortDayLabel(hit.day, timeZone);
}
