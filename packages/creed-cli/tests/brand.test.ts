import assert from "node:assert/strict";
import test from "node:test";
import { CLI_VERSION } from "../src/constants.js";
import { renderBrand } from "../src/terminal/brand.js";

test("renders a full Grant terminal mark with the version", () => {
  const output = renderBrand(100);
  assert.match(output, /████/);
  assert.match(output, new RegExp(`Grant ${CLI_VERSION.replaceAll(".", "\\.")}`));
  assert.equal(output.split("\n").findIndex((line) => line.includes(`Grant ${CLI_VERSION}`)), 12);
});

test("falls back to a compact wordmark in narrow terminals", () => {
  assert.equal(renderBrand(30), `Grant ${CLI_VERSION}`);
});
