import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";

const testsDirectory = "tests";

function findTests(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return findTests(path);
    }

    return entry.isFile() && entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

const testFiles = findTests(testsDirectory)
  .map((path) => relative(process.cwd(), path))
  .sort();

if (testFiles.length === 0) {
  throw new Error("No root TypeScript test files were found.");
}

const result = spawnSync(
  process.execPath,
  ["--test", "--experimental-strip-types", ...testFiles],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
