// Reads the expiry of Supabase's session cookie without a network request.
// An unknown cookie shape returns null, so the proxy refreshes it safely.

type CookiePair = { name: string; value: string };

export const SESSION_REFRESH_WINDOW_SECONDS = 120;

function decodeBase64(value: string): string | null {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    if (typeof atob === "function") return atob(normalized);
    return Buffer.from(normalized, "base64").toString("utf8");
  } catch {
    return null;
  }
}

export function readSessionExpiresAt(cookies: CookiePair[]): number | null {
  const chunks = cookies
    .filter(
      ({ name }) =>
        name.startsWith("sb-") &&
        name.includes("auth-token") &&
        !name.includes("code-verifier"),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));

  if (chunks.length === 0) return null;

  const joined = chunks.map(({ value }) => value).join("");
  const payload = joined.startsWith("base64-")
    ? decodeBase64(joined.slice("base64-".length))
    : joined;
  if (!payload) return null;

  try {
    const session: unknown = JSON.parse(payload);
    if (
      typeof session === "object" &&
      session !== null &&
      "expires_at" in session &&
      typeof session.expires_at === "number" &&
      Number.isFinite(session.expires_at)
    ) {
      return session.expires_at;
    }
  } catch {
    // An unreadable cookie refreshes through the normal proxy path.
  }

  return null;
}

export function sessionNeedsRefresh(
  cookies: CookiePair[],
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const expiresAt = readSessionExpiresAt(cookies);
  return expiresAt === null || expiresAt - nowSeconds < SESSION_REFRESH_WINDOW_SECONDS;
}
