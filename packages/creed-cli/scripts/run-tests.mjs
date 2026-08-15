import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";

const testsDirectory = "dist/tests";

function findTests(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return findTests(path);
    }

    return entry.isFile() && entry.name.endsWith(".test.js") ? [path] : [];
  });
}

const testFiles = findTests(testsDirectory)
  .map((path) => relative(process.cwd(), path))
  .sort();

if (testFiles.length === 0) {
  throw new Error("No compiled CLI test files were found.");
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
