"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  type ArrowUpRightIconHandle,
} from "@/components/ui/arrow-up-right";
import { AnimatedPageTitle, AnimatedSectionHeading } from "@/components/marketing/animated-page-title";
import { MarketingFooter, MarketingHeroBanner } from "@/components/marketing/site-chrome";
import { CONTACT_EMAIL } from "@/lib/branding";

const contactEmail = CONTACT_EMAIL ?? "your Grant deployment operator";

type PrivacySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

const sections: PrivacySection[] = [
  {
    id: "scope",
    title: "Who this policy applies to",
    paragraphs: [
      "This policy applies to people who use Grant, including people who create an account, complete onboarding, connect agents, submit or review proposals, or otherwise use the service.",
    ],
  },
  {
    id: "controller",
    title: "Who controls your information",
    paragraphs: [
      "For the purposes of UK data protection law, Grant is the controller of the personal information described in this policy.",
      `If you have questions about how Grant handles personal information, you can contact ${contactEmail}.`,
    ],
  },
  {
    id: "collected-data",
    title: "What information Grant collects",
    paragraphs: [
      "Grant currently stores and processes the following categories of information as part of operating the service.",
    ],
    bullets: [
      "name",
      "email address",
      "profile picture",
      "Grant profile contents",
      "onboarding answers",
      "proposal history",
      "activity history",
      "connection metadata",
      "connection tokens",
    ],
  },
  {
    id: "collection",
    title: "How Grant collects information",
    bullets: [
      "directly from you when you sign in, complete onboarding, edit your Grant profile, manage connections, or use account features",
      "from Google Auth when basic account information is provided during sign-in, such as your name, email address, and profile image",
      "from connected agent activity when an agent reads Grant through a tokenised endpoint or submits a proposal back through a tokenised endpoint",
    ],
    paragraphs: [
      "When you run an AI feature such as quality analysis, the relevant parts of your Grant profile are sent to OpenRouter using the key you configured in Settings.",
    ],
  },
  {
    id: "use",
    title: "Why Grant uses information",
    paragraphs: [
      "Grant uses personal information to provide and run the service, including to create and manage accounts, authenticate users, generate and maintain profiles, run AI features such as quality analysis, support connected agent reads and proposals, store proposal and activity history, manage tokens and connections, respond to support requests, and comply with legal obligations.",
      "Under UK GDPR, the main lawful bases Grant is likely to rely on are performance of a contract where processing is needed to provide the service you asked for, legitimate interests where processing is needed to run and secure the service in a proportionate way, and legal obligation where processing is needed to comply with applicable law.",
      "Where a specific activity depends on consent, Grant will rely on consent for that activity.",
    ],
  },
  {
    id: "agents",
    title: "Agent access and proposal endpoints",
    paragraphs: [
      "Grant provides tokenised endpoints that let connected agents interact with a user's Grant profile.",
    ],
    bullets: [
      "A valid read token allows an agent to read the relevant Grant payload.",
      "A valid proposal token allows an agent to submit a proposal back to Grant.",
      "Proposal submissions may include the agent name, section information, the reason for the proposed change, and draft content.",
      "Connection metadata may be recorded so Grant can show connection status and recent activity.",
    ],
    note: "These tokens are secrets and should be treated carefully. Grant stores connection tokens so the service can verify and use them. Users can rotate tokens, and rotating a token will break existing agent connections that depend on them.",
  },
  {
    id: "sharing",
    title: "Sharing with service providers",
    paragraphs: [
      "Grant uses third-party service providers to operate the service. At the time of writing, these include Supabase for database and auth-related backend services, Vercel for hosting, Google Auth for sign-in, and OpenRouter for AI features such as quality analysis.",
      "Grant shares information with these providers only as needed to operate the service.",
      "Grant does not sell your personal information. Grant does not use your content to train models.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and sessions",
    paragraphs: [
      "Grant currently uses only cookies or similar technologies that are necessary for core service operation, such as authentication and session handling.",
      "Grant does not currently use analytics cookies or marketing cookies.",
    ],
  },
  {
    id: "retention",
    title: "Retention",
    paragraphs: [
      "Grant keeps personal information for as long as it is reasonably needed to provide the service, maintain the account, keep proposal and activity history available to the user, and meet legal or operational requirements.",
    ],
    bullets: [
      "Account and Grant data are normally kept while your account remains active.",
      "If you ask for deletion, Grant will delete your account and associated data, subject to any limited retention that may be required for legal, security, fraud-prevention, or administrative reasons.",
      "If you want a copy of your data before deletion, you can request export first.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paragraphs: [
      "Depending on the circumstances, UK GDPR gives you rights over your personal information.",
    ],
    bullets: [
      "ask for access to your personal information",
      "ask for incorrect information to be corrected",
      "ask for your information to be deleted",
      "ask for export of your data",
      "object to certain processing",
      "ask for processing to be restricted",
      "withdraw consent where processing depends on consent",
    ],
    note: `To make a privacy request, contact ${contactEmail}. Grant also provides account deletion and data export functionality as part of the service.`,
  },
  {
    id: "contact",
    title: "Contact and complaints",
    paragraphs: [
      `If you have questions about this policy or how Grant handles personal information, contact ${contactEmail}.`,
      "If you are unhappy with how Grant handles your personal information, please contact Grant first so there is a chance to help.",
      "You also have the right to complain to the UK Information Commissioner's Office (ICO). Information about how to do that is available at ico.org.uk.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "Grant may update this Privacy Policy from time to time to reflect changes to the service, legal requirements, or how personal information is handled.",
    ],
  },
];

export function PrivacyPageView() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--creed-background)] text-[var(--creed-text-primary)]">
      <MarketingHeroBanner configured scrolled={scrolled} />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
        <div className="border-b border-[var(--creed-border)] pb-8">
          <AnimatedPageTitle text="Privacy Policy" />
          <p className="t-lede mt-5 max-w-2xl text-[var(--creed-text-secondary)]">
            How Grant collects, uses, and protects your information.
          </p>
        </div>

        <div className="border-b border-[var(--creed-border)] pb-8 pt-8 text-[var(--creed-text-secondary)]">
          <p className="text-[16px] leading-8 md:text-[17px]">
            Grant is a service that helps people create and maintain a structured personal context
            file for use with connected AI agents. This notice explains what personal information
            Grant collects, how it is used, who it is shared with, and the choices you have under
            UK GDPR.
          </p>
        </div>

        <div className="pt-2">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={section.id === "changes" ? "py-8 md:py-10" : "border-b border-[var(--creed-border)] py-8 md:py-10"}
            >
              <AnimatedSectionHeading text={section.title} className="t-step" />

              <div className="mt-5 space-y-4 text-[15px] leading-8 text-[var(--creed-text-secondary)] md:text-[16px]">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {section.bullets ? (
                <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-8 text-[var(--creed-text-secondary)] marker:font-medium marker:text-[var(--creed-accent)] md:text-[16px]">
                  {section.bullets.map((item) => (
                    <li key={item} className="pl-1 first-letter:uppercase">{item}</li>
                  ))}
                </ol>
              ) : null}

              {section.note ? (
                <p className="mt-5 text-[15px] leading-8 text-[var(--creed-text-primary)] md:text-[16px]">
                  {section.note}
                </p>
              ) : null}

              {section.id === "contact" && CONTACT_EMAIL ? (
                <div className="mt-6 flex flex-col gap-4 text-[15px] leading-8 text-[var(--creed-text-secondary)] md:flex-row md:items-center md:justify-between">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-[var(--creed-accent)] transition-colors hover:text-[var(--creed-accent-hover)]"
                  >
                    {contactEmail}
                  </a>
                  <PrivacyExternalLink href="https://ico.org.uk" label="ICO guidance" />
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

function PrivacyExternalLink({ href, label }: { href: string; label: string }) {
  const arrowRef = useRef<ArrowUpRightIconHandle | null>(null);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => arrowRef.current?.startAnimation()}
      onMouseLeave={() => arrowRef.current?.stopAnimation()}
      className="inline-flex items-center gap-2 text-[var(--creed-accent)] transition-colors hover:text-[var(--creed-accent-hover)]"
    >
      {label}
      <ArrowUpRightIcon ref={arrowRef} size={16} className="inline-flex h-4 w-4 items-center justify-center" />
    </a>
  );
}
