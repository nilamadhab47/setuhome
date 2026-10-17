import type { Household } from "./household";
import {
  calendarForHousehold,
  dayPanchang,
  formatFestivalWhen,
  type FestivalHit,
} from "./panchang";
import { noonOnYmd } from "./place";
import { STORE_KEYS, getItem, setItem } from "./store";

export type DiwaliDayId = "dhanteras" | "chhoti" | "lakshmi" | "govardhan" | "bhai";

export type DiwaliDay = {
  id: DiwaliDayId;
  n: number;
  name: string;
  line: string;
  day?: string;
  when?: string;
  timings: FestivalHit["timings"];
  sunset?: string;
};

const DAYS: Array<{ id: DiwaliDayId; name: string; line: string; match: (name: string) => boolean }> = [
  {
    id: "dhanteras",
    name: "Dhanteras",
    line: "The first evening. The home is cleaned and a lamp is kept.",
    match: (name) => /dhanteras|dhanatrayodashi/.test(name),
  },
  {
    id: "chhoti",
    name: "Chhoti Diwali",
    line: "The day before Lakshmi puja. An early lamp, and a bath.",
    match: (name) => /naraka|choti diwali|chhoti diwali/.test(name),
  },
  {
    id: "lakshmi",
    name: "Lakshmi Puja",
    line: "Lakshmi puja after sunset. This evening has its own steps.",
    match: (name) => {
      const folded = name.toLowerCase();
      if (!folded.includes("diwali") && !folded.includes("deepavali") && !folded.includes("lakshmi puja")) return false;
      if (folded.includes("choti") || folded.includes("chhoti") || folded.includes("naraka")) return false;
      if (folded.includes("dev diwali") || folded.includes("dev deepavali")) return false;
      return true;
    },
  },
  {
    id: "govardhan",
    name: "Govardhan Puja",
    line: "The day after. A meal shared with the household.",
    match: (name) => /govardhan|annakut/.test(name),
  },
  {
    id: "bhai",
    name: "Bhai Dooj",
    line: "Brothers and sisters meet. A tilak, then food.",
    match: (name) => /bhai dooj|yama dwitiya/.test(name),
  },
];

export const PREP = [
  "Clay lamps, with oil or ghee",
  "Fresh flowers for the doorway",
  "A sweet to offer, then share",
  "Rangoli or rice flour at the door",
  "A small image or coin of Lakshmi and Ganesha",
  "Clean water in a pot",
  "Incense and camphor for aarti",
] as const;

function folded(name: string) {
  return name.toLowerCase();
}

function firstHit(upcoming: FestivalHit[], match: (name: string) => boolean): FestivalHit | undefined {
  return upcoming.find((row) => match(folded(row.name)));
}

function chipDate(ymd: string, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(noonOnYmd(ymd, timeZone));
  } catch {
    return ymd;
  }
}

export function diwaliDays(household: Household, now = new Date()): DiwaliDay[] {
  const calendar = calendarForHousehold(household, now, false);
  const zone = calendar.place?.tz || "UTC";
  return DAYS.map((row, index) => {
    const hit = firstHit(calendar.upcoming, row.match);
    const panchang = calendar.place && hit?.day ? dayPanchang(calendar.place, hit.day) : null;
    const timed =
      panchang?.festivals.find((festival) => row.match(folded(festival.name))) ?? hit;
    return {
      id: row.id,
      n: index + 1,
      name: row.name,
      line: row.line,
      day: hit?.day,
      when: hit ? chipDate(hit.day, zone) : undefined,
      timings: timed?.timings ?? [],
      sunset: panchang?.sunset,
    };
  });
}

export function pickDiwaliDay(days: DiwaliDay[], phoneDay: string): DiwaliDayId {
  const today = days.find((row) => row.day === phoneDay);
  if (today) return today.id;
  const lakshmi = days.find((row) => row.id === "lakshmi" && row.day);
  if (lakshmi) return lakshmi.id;
  return days.find((row) => row.day)?.id ?? "lakshmi";
}

export function formatDiwaliWhen(day: DiwaliDay, timeZone: string) {
  if (!day.day) return undefined;
  return formatFestivalWhen({ name: day.name, day: day.day, timings: day.timings }, timeZone);
}

const prepKey = STORE_KEYS.prep;

export function readPrep(): boolean[] {
  try {
    const raw = JSON.parse(getItem(prepKey) || "null");
    if (!Array.isArray(raw)) return PREP.map(() => false);
    return PREP.map((_, index) => raw[index] === true);
  } catch {
    return PREP.map(() => false);
  }
}

export function writePrep(next: boolean[]) {
  const saved = PREP.map((_, index) => next[index] === true);
  setItem(prepKey, JSON.stringify(saved));
  return saved;
}
