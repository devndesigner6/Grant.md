// Curated changelog for the public site. Hand-written, user-facing entries for
// meaningful ships, newest first. See CHANGELOG.md for when to add an entry.
// This is not a raw commit log.

export type ChangelogEntry = {
  // ISO date (YYYY-MM-DD), used for ordering and the visible date.
  date: string;
  title: string;
  body: string;
  highlights?: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-07-14",
    title: "Grant CLI",
    body: "Grant CLI brings the complete live MCP surface to your terminal through the same browser OAuth flow as the web app.",
    highlights: [
      "Install globally with npm install --global @devndesigner/grant-cli, then run grant.",
      "Run without installing with npx @devndesigner/grant-cli.",
      "Interactive and one-shot commands for tools, resources, and prompts.",
      "JSON output for scripts and coding agents, with diagnostics kept on stderr.",
      "Token-bound per-agent attribution keeps CLI status and last-seen times separate from MCP connections.",
      "Secure per-server credential storage, automatic token refresh, and OAuth revocation on logout.",
    ],
  },
  {
    date: "2026-07-12",
    title: "Tab autocomplete",
    body: "Press Tab while editing and Grant finishes the thought in your voice, drawn from your whole profile. One suggestion per press, streamed as ghost text in a few hundred milliseconds.",
    highlights: [
      "Tab once for a suggestion, Tab again to accept, Escape or keep typing to dismiss.",
      "Never invents facts: it only recombines what your file already says.",
      "Empty sections get a short drafted opening synthesized from the rest of your Grant profile.",
      "One generation per press; accepting and dismissing are free.",
    ],
  },
  {
    date: "2026-07-07",
    title: "Company workspaces",
    body: "Grant works for a whole team, not just one person. A company workspace adds shared context that every member's agents read before they act.",
    highlights: [
      "One shared company context profile with Owner, Admin, and Member roles.",
      "Section permissions decide who edits directly and who proposes.",
      "An activity view across every member and agent, with attribution.",
    ],
  },
  {
    date: "2026-07-03",
    title: "The command panel",
    body: "A command panel with search, ask, and an in-app agent, so you can work your Grant profile without leaving the file. New users get a short welcome tour.",
  },
  {
    date: "2026-06-29",
    title: "Guided onboarding and a live roadmap",
    body: "Onboarding is now a guided three-question flow that fits a founder, a writer, or a researcher equally. A public roadmap page shows what we are building, straight from the task board.",
  },
  {
    date: "2026-06-24",
    title: "Interactive landing and examples",
    body: "The landing page was rebuilt around interactive demos showing how Grant works and what changes when every agent reads the same context.",
  },
  {
    date: "2026-06-21",
    title: "Accounts and authentication",
    body: "Email, social, and password-reset authentication, so your Grant profile is tied to an account you control.",
  },
];
