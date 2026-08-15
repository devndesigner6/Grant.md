<div align="center">

# Grant

**One living profile across every agent.**

Write your context down once. The agents you connect can read the sections you permit before they answer, then propose updates or edit only where you have allowed it.

[Home](https://grant-md.vercel.app) · [Docs](https://grant-md.vercel.app/docs) · [Stack](https://grant-md.vercel.app/stack) · [Privacy](https://grant-md.vercel.app/privacy)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![MCP](https://img.shields.io/badge/protocol-MCP%20%2B%20OAuth%202.1-8A2BE2)](https://grant-md.vercel.app/docs)

</div>

## What is Grant?

People who work seriously with AI repeatedly explain their goals, preferences, work style, and constraints. Grant keeps that context in one curated private profile instead of scattering it across prompts and chats.

Your Grant profile is structured Markdown. Connected agents, including Claude Code, Codex, Cursor, ChatGPT-compatible clients, OpenCode, and custom MCP clients, read only the sections you permit. They can propose updates, and can direct-edit only when a section explicitly allows it.

Grant is not a notes app, a journal, or an AI memory dump. It is one concise context profile that stays useful across the tools you choose.

```text
You complete onboarding → Your Grant profile → Connected agents
                              │
                 read permitted sections
                 propose or make permitted edits
```

Personal workspaces give one person one profile. Company workspaces use the same model with owners, admins, members, invitations, shared context, and section-level permissions.

Grant is free for authenticated users. OpenRouter features are bring-your-own-key only. There are no subscriptions, credits, checkout, or payment flows.

## Quickstart

Prerequisites: **Node 20+**, a free **Supabase** project, and an **OpenRouter key** if you want to use AI features.

```bash
git clone https://github.com/devndesigner6/grant.git
cd grant
npm ci
cp .env.example .env.local
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npm run dev
```

Minimum `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<service-role-key>
GRANT_ENCRYPTION_SECRET=<base64-32-byte-secret>
GRANT_CSRF_SECRET=<base64-32-byte-secret>
GRANT_HEALTH_SECRET=<base64-32-byte-secret>
```

Generate each Grant secret with a secure password generator or:

```bash
openssl rand -base64 32
```

The complete list, including GitHub OAuth and deferred Resend setup, is in [`.env.example`](./.env.example). Historical Supabase migrations are immutable and `supabase db push` applies the full schema, RLS policies, audit log, OAuth storage, GitHub integration, and rate limits.

## Connect an agent

Open `/connections` and add the Grant MCP URL to your agent as a custom connector:

```text
https://grant-md.vercel.app/mcp
```

For local development, use:

```text
http://localhost:3000/mcp
```

Grant is an OAuth 2.1 authorization server. A compatible MCP client discovers the server, opens the browser consent flow, and receives only the scoped access you approve. Grant preserves PKCE, CSRF protection, redirect validation, hashed bearer tokens, revocation, workspace scope, section permissions, and rate limits.

Connected agents can:

- Read permitted profile context.
- Propose changes for review.
- Direct-edit only sections that permit direct edits.
- Access personal or company context only within their authorized workspace.

## Security controls and audit evidence

Grant applies permission checks before an MCP tool can read or change a profile. The effective access ceiling is the narrowest of the OAuth scope, the connected-agent mode, the workspace role, and the section permission. Hidden and archived sections are excluded from agent payloads and cannot be targeted by agent tools.

When an authenticated MCP client is refused for a missing scope, a read-only section, or an unavailable section, Grant records a server-side audit event. The event contains only the client name, requested action, generic decision reason, requested section identifier, and request ID. It never stores profile content, prompts, bearer tokens, or encryption secrets.

To verify the boundary on a real deployment:

1. Create a profile section and set its agent permission to Hidden or Read-only.
2. Connect an MCP client through the OAuth consent flow with a restricted scope.
3. Request the section or attempt an edit through the client.
4. Confirm Grant returns a refusal without returning the protected content.
5. Review the resulting `mcp.access_denied` event in the `creed_audit_log` table in Supabase.

## Grant CLI

Grant ships a first-party terminal MCP client. It uses the same browser OAuth flow as every other client and discovers tools, resources, and prompts from the live Grant MCP server.

```bash
npm install --global @devndesigner/grant-cli
grant login
grant status
```

The executable is `grant`. It stores new configuration under `GRANT_CONFIG_DIR` and supports a legacy local configuration only as a read fallback. The source package remains in `packages/creed-cli/` temporarily for workspace compatibility.

## AI features

Grant uses OpenRouter BYOK only. A personal user or company owner saves an encrypted OpenRouter key in Settings. That key enables real Panel, Tab, Quality, and Agent features for the permitted workspace.

If no key is configured, Grant says: **“Add your OpenRouter key in Settings.”** It never presents a fake balance, managed credits, or fabricated AI output.

Optional model selection environment values:

```bash
ANALYSIS_MODEL=
TAB_MODEL=
PANEL_MODEL=
```

## GitHub sync

Grant can connect a real GitHub OAuth account, select a repository and branch, and synchronize the profile as Markdown.

Personal workspaces support push, pull preview, diff inspection, apply, and audit records. Company workspaces can push shared context; company pull and apply are intentionally unavailable because importing would overwrite shared sections.

Configure a GitHub OAuth App with:

```text
Homepage URL: https://grant-md.vercel.app
Authorization callback URL: https://grant-md.vercel.app/auth/github/callback
```

Then set:

```bash
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
```

## Company invitations and Resend

Invitations create a real database record, expiry, revocation path, and acceptance URL whether or not email is configured.

When Resend is not configured, Grant gives the company manager a copyable invite link and clearly states that email delivery is unavailable. When these values are configured, the same flow sends a real Grant-branded invitation email:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, Tiptap, Framer Motion |
| Backend | Supabase Auth, Postgres, RLS, realtime, audit logs |
| AI | OpenRouter BYOK with encrypted key storage |
| Agent protocol | MCP with OAuth 2.1 |
| Sync | GitHub Markdown push and pull |
| Deployment | One Vercel Next.js deployment |

## Repository map

```text
app/                    Next.js routes, authenticated APIs, MCP, and OAuth
components/             Product, auth, marketing, and UI components
lib/                    Supabase, AI, MCP, security, and GitHub integration
supabase/migrations/    Immutable forward-only schema history
packages/creed-cli/     Compatibility-sensitive Grant CLI source
tests/                  node:test suites
```

## Commands

```bash
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

## Deploy to Vercel

Grant is one Vercel Next.js deployment. It serves the frontend, API routes, MCP server, OAuth server, and streaming responses from the same project.

Use these Vercel settings:

```text
Framework: Next.js
Root directory: ./
Install command: npm ci
Build command: npm run build
Node: 20+
```

Set `NEXT_PUBLIC_SITE_URL` to the real deployment origin. The current Grant deployment is:

```text
https://grant-md.vercel.app
```

Use that same origin in all integration configuration:

- Supabase Site URL and redirect URLs.
- GitHub OAuth homepage and callback URL.
- MCP documentation and connection instructions.
- OAuth discovery metadata.
- Invitation acceptance links.

For a detailed health response after deployment, send `X-Grant-Health-Secret` to `/api/health`.

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md). AI coding agents should read [`AGENTS.md`](./AGENTS.md).

Report vulnerabilities through [`SECURITY.md`](./SECURITY.md), not a public issue.

## License

[MIT](./LICENSE)
