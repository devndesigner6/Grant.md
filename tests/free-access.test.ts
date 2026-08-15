import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("authenticated personal access routes by profile state, not entitlement", () => {
  const home = readSource("../app/page.tsx");
  const layout = readSource("../app/(creed-app)/layout.tsx");

  assert.doesNotMatch(home, /hasActiveEntitlement/);
  assert.doesNotMatch(layout, /hasActiveEntitlement/);
  assert.match(home, /hasPersistedCreed\(supabase, user\.id\)/);
  assert.match(home, /redirect\(hasCreed \? "\/file" : "\/onboarding"\)/);
  assert.match(layout, /hasCompanyAccess\(supabase, supabase, user\.id\)/);
  assert.match(layout, /redirect\("\/home"\)/);
});

test("OAuth consent and grant issuance do not require an entitlement", () => {
  const consent = readSource("../app/authorize/page.tsx");
  const decision = readSource("../app/authorize/decision/route.ts");

  assert.doesNotMatch(consent, /hasActiveEntitlement/);
  assert.doesNotMatch(decision, /hasActiveEntitlement/);
  assert.match(consent, /getOAuthClient\(clientId\)/);
  assert.match(consent, /issueOAuthCsrfToken\(\)/);
  assert.match(decision, /verifyOAuthCsrfToken\(csrfToken\)/);
  assert.match(decision, /isAllowedRedirectUri\(redirectUri, client\.redirectUris\)/);
  assert.match(decision, /issueAuthorizationCode/);
});

test("MCP access keeps bearer and rate-limit protections without billing", () => {
  const mcp = readSource("../app/mcp/route.ts");

  assert.doesNotMatch(mcp, /creed_entitlements/);
  assert.doesNotMatch(mcp, /hasCurrentMcpAccess/);
  assert.match(mcp, /checkRateLimit/);
  assert.match(mcp, /findOAuthAccessToken\(bearer\)/);
  assert.match(mcp, /getCreedRole/);
});

test("workspace membership controls visibility without personal or company billing", () => {
  const membership = readSource("../lib/creed-membership.ts");

  assert.doesNotMatch(membership, /hasActiveEntitlement/);
  assert.match(membership, /return mapped;/);
  assert.match(
    membership,
    /listUserCreeds\(client, userId\)\)\.some\(\(creed\) => creed\.type === "company"\)/,
  );
});

test("all company AI routes preserve protections without frozen-billing blocks", () => {
  const agent = readSource("../app/api/app/ai/agent/route.ts");
  const panel = readSource("../app/api/app/ai/panel/route.ts");
  const quality = readSource("../app/api/app/ai/quality/route.ts");
  const tab = readSource("../app/api/app/ai/tab/route.ts");

  for (const source of [agent, panel, quality, tab]) {
    assert.doesNotMatch(source, /getCompanyAccessState/);
    assert.doesNotMatch(source, /billing is fixed/);
  }
  assert.match(quality, /canRunAnalysis\(role\)/);
  assert.match(agent, /requireApiAuth\(\)/);
  assert.match(panel, /requireApiAuth\(\)/);
  assert.match(panel, /checkRateLimit/);
  assert.match(tab, /checkRateLimit/);
});

test("company editing and administration retain role checks without billing reads", () => {
  const sections = readSource("../lib/company-sections.ts");
  const admin = readSource("../lib/company-admin.ts");

  assert.doesNotMatch(sections, /getCompanyBilling/);
  assert.doesNotMatch(sections, /deriveCompanyAccessState/);
  assert.doesNotMatch(sections, /companyAccess/);
  assert.doesNotMatch(sections, /billing is fixed/);
  assert.match(sections, /getCreedRole/);
  assert.match(sections, /resolveSectionPermission/);
  assert.doesNotMatch(admin, /getCompanyBilling/);
  assert.doesNotMatch(admin, /deriveCompanyAccessState/);
  assert.doesNotMatch(admin, /frozenResult/);
  assert.match(admin, /actorRole !== "owner"/);
  assert.match(admin, /actorRole !== "owner" && actorRole !== "admin"/);
});

test("company invitations no longer depend on billing or purchased seats", () => {
  const invites = readSource("../lib/company-invites.ts");
  const migration = readSource(
    "../supabase/migrations/20260802120000_grant_free_company_invites.sql",
  );

  assert.doesNotMatch(invites, /isCompanyFrozen/);
  assert.doesNotMatch(invites, /seats\.available/);
  assert.doesNotMatch(invites, /accepted === "no_seats"/);
  assert.match(invites, /actorRole !== "owner" && actorRole !== "admin"/);
  assert.doesNotMatch(migration, /creed_company_billing/);
  assert.doesNotMatch(migration, /v_used/);
  assert.match(migration, /for update/);
  assert.match(migration, /grant execute on function public\.accept_company_invite/);
});

test("company UI no longer derives read-only state from billing", () => {
  const backend = readSource("../lib/creed-backend.ts");
  const fileScreen = readSource("../components/creed/file-screen.tsx");
  const companySettings = readSource("../components/creed/company-settings.tsx");

  assert.doesNotMatch(backend, /creed_company_billing/);
  assert.doesNotMatch(fileScreen, /accessState !== "frozen"/);
  assert.doesNotMatch(fileScreen, /accessState === "frozen"/);
  assert.doesNotMatch(companySettings, /Fix billing/);
  assert.doesNotMatch(companySettings, /payment did not go through/);
});

test("welcome state does not depend on a billing timestamp", () => {
  const appShell = readSource("../components/creed/app-shell-layout.tsx");
  const welcomeDialog = readSource("../components/creed/welcome-dialog.tsx");

  assert.doesNotMatch(appShell, /welcomePaidAt|paidAt/);
  assert.doesNotMatch(welcomeDialog, /paidAt|paid_at/);
});

test("onboarding and retired public routes do not send users to checkout", () => {
  const onboarding = readSource("../components/creed/onboarding-screen.tsx");
  const onboardingPage = readSource("../app/onboarding/page.tsx");
  const pricing = readSource("../app/pricing/page.tsx");
  const success = readSource("../app/payment/success/page.tsx");
  const cancelled = readSource("../app/payment/cancelled/page.tsx");

  assert.doesNotMatch(onboarding, /checkout|entitlement|subscription/i);
  assert.doesNotMatch(onboarding, /\bpaid\b/);
  assert.doesNotMatch(onboardingPage, /\bpaid\b/);
  for (const source of [pricing, success, cancelled]) {
    assert.match(source, /redirect\("\/"\)/);
  }
});

test("AI setup is BYOK-only and has no runtime credit or Stripe caller", () => {
  const credentials = readSource("../lib/ai/credentials.ts");
  const settings = readSource("../components/creed/settings-screen.tsx");
  const companySettings = readSource("../components/creed/company-settings.tsx");

  assert.match(credentials, /Add your OpenRouter key in Settings\./);
  for (const source of [settings, companySettings]) {
    assert.doesNotMatch(source, /Add credits|checkout|billing portal|seat purchase/i);
  }
});

test("settings usage requests rely on the server-owned BYOK mode", () => {
  const preload = readSource("../components/creed/settings-preload.ts");
  const usageRoute = readSource("../app/api/app/ai/usage/route.ts");

  assert.match(preload, /\/api\/app\/ai\/usage\?range=\$\{range\}/);
  assert.doesNotMatch(preload, /&mode=\$\{mode\}/);
  assert.match(usageRoute, /const mode: AiMode = "byok"/);
});
