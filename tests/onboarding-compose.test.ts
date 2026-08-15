import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("onboarding only previews a 409 response when the profile was already composed", () => {
  const screen = source("../components/creed/onboarding-screen.tsx");
  const route = source("../app/api/app/onboarding/compose/route.ts");
  const page = source("../app/onboarding/page.tsx");

  assert.match(screen, /res\.status === 409 && data\.error === "already_composed"/);
  assert.match(screen, /Array\.isArray\(savedSections\) && savedSections\.length > 0/);
  assert.doesNotMatch(screen, /if \(res\.status === 409\) \{\s*setStep\(PREVIEW_STEP\)/);
  assert.match(route, /code: "seed_missing"/);
  assert.match(
    page,
    /result\.hasPersistedCreed && result\.state\.sections\.length > 0/,
  );
});
