/** Recording shortcuts for a post. Leave both off in the running app. */
export const RECORDING = {
  onboard: false,
  verseRef: null as string | null,
};

function queryParam(name: string): string | null {
  const search = typeof window === "undefined" ? undefined : window.location?.search;
  if (!search) return null;
  return new URLSearchParams(search).get(name);
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
