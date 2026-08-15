import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShellLayout } from "@/components/creed/app-shell-layout";
import { AppVersionNotifier } from "@/components/creed/app-version-notifier";
import { getAppVersion } from "@/lib/app-version";
import { AuthedProviders } from "@/components/creed/authed-providers";
import { hasPersistedCreed } from "@/lib/creed-backend";
import { isSupabaseTableMissingError } from "@/lib/creed-backend-errors";
import { hasCompanyAccess } from "@/lib/creed-membership";
import { resolveActiveCreed } from "@/lib/creed-context";
import { getRequestAuth } from "@/lib/request-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Authentication + onboarding gate for everything inside the (creed-app)
// route group (/file, /connections, /settings). Three-layer check:
//   1. signed in? if not → /home
//   2. belongs to a company workspace? enter the app
//   3. otherwise, has a persisted personal Creed row? if not → /onboarding
//
// Step 3 catches users who deep-link to /file (or come back via a
// stale browser tab) without having completed onboarding yet. It checks
// the Creed row (created by the onboarding claim step), NOT the section
// count - a user who deletes every section still has a Creed and must
// not be bounced back into first-run onboarding.
//
// Marketing routes and legacy compatibility routes don't pass through here so they remain
// reachable to anyone.
//
// This layout (not the root) owns the dynamic, user-specific boundary now:
// AuthedProviders loads the Creed and supplies CreedProvider, and the gate
// reads the session, so the segment renders dynamically while the root stays
// static.
export const dynamic = "force-dynamic";

export default async function CreedAppLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    // Local dev without Supabase config: skip the gate so the rest of
    // the app can render. Production deployments always have Supabase.
    return (
      <AuthedProviders>
        <AppShellLayout showWelcome={false}>
          {children}
        </AppShellLayout>
        <AppVersionNotifier initialVersion={getAppVersion()} />
      </AuthedProviders>
    );
  }

  const { supabase, user } = await getRequestAuth();

  if (!user) {
    redirect("/home");
  }

  const companyAccess = await hasCompanyAccess(supabase, supabase, user.id);

  // Personal-only users still pass the personal onboarding gate: a user
  // with no persisted Creed is routed to /onboarding to finish first-run.
  // Company members skip this (their active company Creed decides what loads);
  // the company onboarding flow handles a company Creed that is still being set
  // up. Treat a missing-tables error as "not onboarded".
  if (!companyAccess) {
    let sectionsPersisted = false;
    try {
      sectionsPersisted = await hasPersistedCreed(supabase, user.id);
    } catch (error) {
      if (!isSupabaseTableMissingError(error)) {
        throw error;
      }
    }
    if (!sectionsPersisted) {
      redirect("/onboarding");
    }
  }

  // Resume company onboarding: if the user OWNS any company Creed that has not
  // finished setup, send them to the company onboarding flow rather than an
  // empty file. This is the "bought it, closed the laptop, came back" path - the
  // switcher's "Set up" entry lands here too. Scan every Creed, not just the
  // active one: a dual-Creed owner whose active cookie points at their personal
  // Creed (the resolveActiveCreed default) must still be resumed into setup.
  const active = await resolveActiveCreed(supabase, user);
  if (active) {
    const unfinishedOwned = active.creeds.find(
      (c) => c.type === "company" && c.needsSetup && c.role === "owner"
    );
    if (unfinishedOwned) {
      redirect("/onboarding/company");
    }
  }

  return (
    <AuthedProviders>
      <AppShellLayout showWelcome={false}>
        {children}
      </AppShellLayout>
      <AppVersionNotifier initialVersion={getAppVersion()} />
    </AuthedProviders>
  );
}
