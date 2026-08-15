// Canonical FAQ content for the public site. Shared by the visible FAQ on
// /home (components/marketing/below-hero-sections.tsx) and the FAQPage
// JSON-LD that ships on the same page (lib/seo/structured-data.ts). Keeping
// one source means the structured data can never drift from the rendered
// answers, which is exactly what search and AI engines check for.

export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqItems: FaqItem[] = [
  {
    question: "What actually goes in a Grant profile?",
    answer:
      "Who you are, what you're working toward, how you like AI to talk to you, the people and routines that shape your week, plus any health, accessibility, or hard noes AI should respect. One concise profile, not a journal.",
  },
  {
    question: "Why not just retell every AI who I am each time?",
    answer:
      "Because it doesn't stick, doesn't cross tools, and you end up repeating yourself. Grant gives every AI the same profile to read before answering, and lets them propose updates as they learn more about you.",
  },
  {
    question: "Which tools does Grant work with?",
    answer:
      "Grant connects to agents like Claude Code, Codex, Cursor, and ChatGPT over MCP, and integrates with GitHub for version control. Support for tools like Notion and Obsidian is coming for editing and storage.",
  },
  {
    question: "What gets written back to Grant?",
    answer:
      "Durable things AI learns about you, a sharper preference, a new routine, a goal that shifted. Not session recap, not mood, not generic praise.",
  },
  {
    question: "Do I have to review every change?",
    answer:
      "No. You can keep agent edits reviewable, or trust them to write directly when you want a lighter loop. The point is control when you want it, not friction by default.",
  },
  {
    question: "Is Grant for teams or just for me?",
    answer:
      "Both. Grant starts as a personal profile, and a company workspace adds one shared context profile that every member's agents read, with member roles, an activity view across the team, and admin controls.",
  },
];

// FAQ for the company landing page. Standalone answers about the workspace
// so an answer engine can quote a single item.
export const companyFaqItems: FaqItem[] = [
  {
    question: "What is a Grant company workspace?",
    answer:
      "A Grant company workspace is one shared context profile that every member's agents read before they act. It holds the canonical company context: how the team works, what it is building, and the conventions and constraints that apply to everyone, so agents stop drifting from how the team actually operates.",
  },
  {
    question: "How is it different from a wiki or knowledge base?",
    answer:
      "A wiki is a large, complete record for people to search. A Grant company profile is short, curated, and written to be read by agents before they answer. It is the profile your AI reads, not the archive your team browses. Most teams keep both.",
  },
  {
    question: "What roles does a Company workspace have?",
    answer:
      "Three: Owner, who manages members and content; Admin, who manages members and content; and Member, who reads and proposes. Section permissions can further control who edits each section directly versus by proposal, and every change is attributed in the activity view.",
  },
  {
    question: "Do team members need their own personal Grant profile?",
    answer:
      "No. A member needs a Grant account, but not a personal Grant profile. They connect their own agents over MCP and read the shared company profile. They can keep a personal Grant profile too, and switch between them from the workspace dropdown.",
  },
];

// FAQ about personal context files (surfaced in llms-full.txt). Phrased as direct, standalone answers
// so answer engines can quote a single item without surrounding context.
export const contextFileFaqItems: FaqItem[] = [
  {
    question: "What is a personal context file?",
    answer:
      "A personal context file is one structured profile that describes who you are and how you want AI to work with you. Every AI tool you connect reads it before it answers, so your context stays consistent across tools and sessions instead of being re-explained each time.",
  },
  {
    question: "How is a personal context file different from a chatbot's memory?",
    answer:
      "Chatbot memory lives inside one app and cannot move with you. A personal context file is one portable file you own. It works across every agent you connect, and you can read, edit, or export it as plain Markdown at any time.",
  },
  {
    question: "How do agents keep a personal context file updated?",
    answer:
      "As an agent learns something durable about you, a sharper preference, a new routine, or a goal that shifted, it proposes a narrow update. You approve what stays, or let trusted agents edit directly. Session chatter and one-off details are left out by design.",
  },
  {
    question: "What goes in a personal context file?",
    answer:
      "Grant organizes it into ten sections: Identity, Goals, Work, Preferences, and Routines as the always-on core, plus optional Beliefs, Constraints, People, Health, and Context. Each section is short, specific, and written to change how AI responds.",
  },
  {
    question: "Which tools does a personal context file work with?",
    answer:
      "Grant connects to agents like Claude Code, Codex, Cursor, and ChatGPT over MCP, and integrates with GitHub for version control. Support for Notion and Obsidian is on the way.",
  },
  {
    question: "Do I own my personal context file?",
    answer:
      "Yes. Grant is plain Markdown that you control. You bring your own AI key, your tokens stay yours, and deleting your account wipes everything. There is no lock-in.",
  },
];
