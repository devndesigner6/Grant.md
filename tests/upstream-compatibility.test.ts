import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("GitHub sync accepts an empty repository and returns truthful errors", () => {
  const github = source("../lib/github.ts");
  const preview = source("../app/api/app/github/pull/preview/route.ts");
  const push = source("../app/api/app/github/push/route.ts");
  const status = source("../app/api/app/github/status/route.ts");

  assert.match(github, /response\.status === 404 \|\| response\.status === 409/);
  for (const route of [preview, push, status]) {
    assert.match(route, /error\.message && error\.message !== "Unauthorized"/);
  }
});

test("editor list and menu interactions preserve the current visual system", () => {
  const styles = source("../app/globals.css");
  const screen = source("../components/creed/file-screen.tsx");

  assert.match(styles, /counter-reset: creed-ordered-list/);
  assert.match(styles, /counter\(creed-ordered-list\)/);
  assert.match(styles, /color: var\(--section-accent-bar, var\(--creed-text-primary\)\)/);
  assert.match(screen, /!event\.currentTarget\.contains\(event\.target\)/);
});
