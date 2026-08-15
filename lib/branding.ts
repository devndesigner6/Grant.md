// Branding + contact constants pulled from environment variables so the
// open-source codebase doesn't ship with personal identifiers baked in.
// Set these in `.env.local` (or your deployment env) when running a fork:
//
//   NEXT_PUBLIC_CONTACT_EMAIL   = address shown in legal pages + footer
//   NEXT_PUBLIC_TWITTER_URL     = absolute URL of the project's X / Twitter profile
//   NEXT_PUBLIC_INSTAGRAM_URL   = absolute URL of the project's Instagram profile
//   NEXT_PUBLIC_GITHUB_URL      = absolute URL of the project's GitHub org / repo
//   NEXT_PUBLIC_DISCORD_URL     = absolute URL of the project's Discord invite
//
// Anything left unset is hidden. A Grant deployment must intentionally supply
// its own contact and social links instead of inheriting upstream identities.
function optionalPublicUrl(value: string | undefined): string | null {
  return value?.trim() || null;
}

export const CONTACT_EMAIL = optionalPublicUrl(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
export const CONTACT_MAILTO = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : null;
export const TWITTER_URL = optionalPublicUrl(process.env.NEXT_PUBLIC_TWITTER_URL);
export const INSTAGRAM_URL = optionalPublicUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL);
export const GITHUB_URL = optionalPublicUrl(process.env.NEXT_PUBLIC_GITHUB_URL);

// Discord invite. No hardcoded fallback: until a permanent invite is set via
// NEXT_PUBLIC_DISCORD_URL, surfaces that need the actual invite can hide their
// Discord CTA rather than shipping a dead community link.
export const DISCORD_URL = optionalPublicUrl(process.env.NEXT_PUBLIC_DISCORD_URL);
