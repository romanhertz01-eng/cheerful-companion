/** Build /auth URL with a validated `next` return path (internal only). */
export function buildAuthHref(next?: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/auth";
  return `/auth?next=${encodeURIComponent(next)}`;
}

/** Read a safe internal `next` path from a URL search string. */
export function readSafeNext(search: string): string | null {
  try {
    const params = new URLSearchParams(search);
    const raw = params.get("next");
    if (!raw) return null;
    if (!raw.startsWith("/") || raw.startsWith("//")) return null;
    return raw;
  } catch {
    return null;
  }
}