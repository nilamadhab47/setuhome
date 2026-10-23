import { STORE_KEYS, getItem, setItem } from "./store";

export const TRADITION = "Home Satyanarayan";

export type CeremonyStep = {
  title: string;
  meaning: string;
  child: string;
  doing: string;
  sanskrit?: string;
  iast?: string;
};

/** One named household sequence. Not a copied temple vidhi. */
export const STEPS: CeremonyStep[] = [
  {
    title: "Gather",
    meaning: "People sit. The room is ready before anything is asked or offered.",
    child: "We sit together so everyone knows something careful is about to begin.",
    doing: "Sit facing the altar. Phones can stay low.",
  },
  {
    title: "The lamp is lit",
    meaning: "A lamp is lit first. Light marks the start of the vow.",
    child: "We light a lamp. That is how the ceremony begins.",
    doing: "Light one lamp. Keep it where everyone can see it.",
  },
  {
    title: "Sankalpa",
    meaning: "The host says, in a few words, why everyone has gathered today.",
    child: "Someone says out loud why this day matters to the family.",
    doing: "Listen. The names of the family may be spoken here.",
  },
  {
    title: "The katha",
    meaning: "The story of the vow is read in five parts. Stay until it ends. The host reads from the book at home; this screen does not replace that book.",
    child: "This is the story. It has five parts. We stay until it ends.",
    doing: "Some families hold a few grains of rice while they listen.",
    sanskrit: "ॐ नमो भगवते सत्यनारायणाय",
    iast: "om namo bhagavate satyanārāyaṇāya",
  },
  {
    title: "Aarti",
    meaning: "A lamp is circled. Then the food that was offered is shared.",
    child: "The lamp comes around. Then everyone eats a little of the same sweet.",
    doing: "Stand if you can. Take the light with both hands, then pass it on.",
  },
  {
    title: "Prasad",
    meaning: "The offering is eaten together. The vow ends when the last person has a share.",
    child: "Everyone eats a little of the same sweet. That is how we finish.",
    doing: "Share what was offered. No one is left out.",
  },
];

function clampStep(value: number) {
  if (!Number.isFinite(value)) return 0;
  const n = STEPS.length;
  return ((Math.round(value) % n) + n) % n;
}

export function wrapStep(index: number, delta: -1 | 1) {
  return clampStep(index + delta);
}

export function readCeremonyStep() {
  try {
    return clampStep(Number(getItem(STORE_KEYS.ceremony)));
  } catch {
    return 0;
  }
}

export function writeCeremonyStep(index: number) {
  const saved = clampStep(index);
  setItem(STORE_KEYS.ceremony, String(saved));
  return saved;
}
