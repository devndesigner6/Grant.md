import { getSiteUrl } from "@/lib/supabase/env";

export const dynamic = "force-static";

export function GET() {
  const base = getSiteUrl().replace(/\/$/, "");
  const body = `# Grant

Grant is a private context platform for people and teams. A user keeps one concise Markdown context profile with goals, work, preferences, routines, and optional sections. Connected MCP agents read only permitted sections and can propose or make permitted updates.

Grant supports personal and company workspaces, roles, section permissions, invitations, activity, archive and version history, GitHub sync, and MCP OAuth connections. AI features use an OpenRouter key configured by the user or company owner in Settings. Grant is free for authenticated users.

Site: ${base}\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400" } });
}
