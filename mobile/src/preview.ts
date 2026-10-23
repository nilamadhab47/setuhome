/** Recording shortcuts for a post. Leave both off in the running app. */
export const RECORDING = {
  onboard: false,
  verseRef: null as string | null,
};

export function hrefParams(href?: string | null): URLSearchParams {
  if (href && href.includes("?")) {
    return new URLSearchParams(href.slice(href.indexOf("?") + 1).split("#")[0]);
  }
  const search = typeof window === "undefined" ? undefined : window.location?.search;
  return new URLSearchParams(search || "");
}

function queryParam(name: string): string | null {
  return hrefParams().get(name);
}

export function guideFromHref(href?: string | null): "diwali" | "satyanarayan" | null {
  const value = hrefParams(href).get("guide");
  return value === "diwali" || value === "satyanarayan" ? value : null;
}

export function ceremonyStepFromHref(href?: string | null): number | null {
  const raw = hrefParams(href).get("step");
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function wantOnboard(): boolean {
  const value = queryParam("onboard");
  if (value === "1") return true;
  if (value === "0") return false;
  return RECORDING.onboard;
}

export function previewVerseRef(): string | null {
  return queryParam("verse") || RECORDING.verseRef;
}
