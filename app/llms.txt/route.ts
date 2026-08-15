import { getSiteUrl } from "@/lib/supabase/env";

export const dynamic = "force-static";

export function GET() {
  const base = getSiteUrl().replace(/\/$/, "");
  const body = `# Grant

Grant is a private context platform for people and teams. Create one living profile, connect it to AI agents through MCP and OAuth, and keep work style, goals, preferences, and team context consistent.

- [Home](${base}/home)
- [Docs](${base}/docs)
- [Stack](${base}/stack)
- [Privacy](${base}/privacy)

Grant is free for authenticated users. AI features use an OpenRouter key saved in Settings.\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400" } });
}
