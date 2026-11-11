import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS_DIR, "check-built-server-grok-extension.mjs");
const NEEDLE = "https://grok.com/grok-app-builder/extensions.js";

// A fake built output whose server function honours VITE_GROK_EXTENSIONS like the real one.
const FAKE_SERVER = `export default {
  fetch: () => new Response(
    process.env.VITE_GROK_EXTENSIONS === "0"
      ? "<html><head></head><body>app</body></html>"
      : '<html><head><script src="${NEEDLE}" defer></script></head><body>app</body></html>',
    { status: 200, headers: { "content-type": "text/html" } },
  ),
};
`;

function run(script, outputDir) {
  const child = spawnSync(process.execPath, [script, outputDir], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { code: child.status, output: `${child.stdout}${child.stderr}` };
}

function withWorkDir(fn) {
  const work = mkdtempSync(join(tmpdir(), "chinam-built-check-"));
  try {
    const empty = join(work, "empty-output");
    mkdirSync(empty);
    const good = join(work, "good-output");
    mkdirSync(join(good, "functions/__server.func"), { recursive: true });
    writeFileSync(join(good, "functions/__server.func/index.mjs"), FAKE_SERVER);
    const fileLink = join(work, "check-built-link.mjs");
    symlinkSync(SCRIPT, fileLink);
    const dirLink = join(work, "scripts-link");
    symlinkSync(SCRIPTS_DIR, dirLink, "dir");
    const scripts = [SCRIPT, fileLink, join(dirLink, "check-built-server-grok-extension.mjs")];
    fn({ empty, good, scripts });
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

test("REL-02 built check: empty output dir is RED, directly and through file/dir symlinks", () => {
  withWorkDir(({ empty, scripts }) => {
    for (const script of scripts) {
      const result = run(script, empty);
      assert.equal(result.code, 1, `${script}: ${result.output}`);
      assert.match(result.output, /FAIL: missing built server function/, script);
    }
  });
});

test("REL-02 built check: output that honours the flag is GREEN, directly and through symlinks", () => {
  withWorkDir(({ good, scripts }) => {
    for (const script of scripts) {
      const result = run(script, good);
      assert.equal(result.code, 0, `${script}: ${result.output}`);
      assert.match(result.output, /BUILT_SERVER_GROK_EXTENSION_CHECK: PASS/, script);
    }
  });
});
