import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("Grant CLI source targets the published scoped package", () => {
  const packageJson = JSON.parse(source("../packages/creed-cli/package.json")) as {
    name?: string;
    version?: string;
    bin?: Record<string, string>;
  };
  const readme = source("../packages/creed-cli/README.md");
  const rootReadme = source("../README.md");

  assert.equal(packageJson.name, "@devndesigner/grant-cli");
  assert.equal(packageJson.version, "0.2.3");
  assert.equal(packageJson.bin?.grant, "dist/src/bin.js");
  assert.match(readme, /npm install --global @devndesigner\/grant-cli/);
  assert.match(readme, /npx @devndesigner\/grant-cli/);
  assert.match(rootReadme, /@devndesigner\/grant-cli/);
  assert.doesNotMatch(readme, /npx grant-cli/);
  assert.doesNotMatch(readme, /\bcreed (?:login|logout|status|doctor|tools|call|resource|resources|prompts|prompt)\b/);
});

test("Grant CSP and environment documentation contain no Stripe configuration", () => {
  const proxy = source("../proxy.ts");
  const environment = source("../.env.example");
  const readme = source("../README.md");

  assert.doesNotMatch(proxy, /stripe/i);
  assert.match(proxy, /process\.env\.GRANT_CSP_ENFORCE/);
  assert.doesNotMatch(proxy, /CREED_CSP_ENFORCE/);
  assert.match(environment, /^GRANT_CSRF_SECRET=$/m);
  assert.match(environment, /GRANT_CSP_ENFORCE/);
  assert.match(readme, /GRANT_CSRF_SECRET=/);
});

test("deferred invitations return and display a real manual acceptance URL", () => {
  const createRoute = source("../app/api/app/company/invites/route.ts");
  const resendRoute = source("../app/api/app/company/invites/[id]/route.ts");
  const settings = source("../components/creed/company-settings.tsx");

  for (const route of [createRoute, resendRoute]) {
    assert.match(route, /const inviteUrl = `\$\{siteUrl\}\/invite\/\$\{/);
    assert.match(route, /inviteUrl, emailSent: sent\.ok/);
  }
  assert.match(settings, /Email is not configured\. Copy this invite link to deliver it manually\./);
  assert.match(settings, /navigator\.clipboard\.writeText\(manualInviteLink\)/);
  assert.doesNotMatch(settings, /Invite failed to send\./);
});

test("model catalog does not expose synthetic quality benchmarks", () => {
  const catalog = source("../lib/ai/model-catalog.ts");

  assert.doesNotMatch(catalog, /Grant reasoning proxy|Reasoning benchmark proxy|benchmarkRules|inferBenchmark/);
  assert.match(catalog, /export type AiModelQuality = "uncertain"/);
  assert.match(catalog, /Live provider metadata is unavailable\./);
});
