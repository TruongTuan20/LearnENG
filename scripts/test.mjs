import { mkdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const cache = path.resolve(".cache/vitest");
mkdirSync(cache, { recursive: true });
const result = spawnSync(
  process.execPath,
  ["node_modules/vitest/vitest.mjs", "run"],
  {
    stdio: "inherit",
    env: { ...process.env, TEMP: cache, TMP: cache, TMPDIR: cache },
  },
);
process.exit(result.status ?? 1);
