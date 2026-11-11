#!/usr/bin/env node
// REL-02 integration check for a Vercel-style build output.
//
// Calls the built server function (.vercel/output/functions/__server.func/index.mjs,
// default export with .fetch) with a Request for "/" in two separate Node
// processes and inspects the rendered HTML:
//
//   - VITE_GROK_EXTENSIONS=0 at runtime  -> HTML must NOT reference the script (required).
//   - VITE_GROK_EXTENSIONS unset         -> HTML DOES reference it (control: proves the
//     check can tell the two cases apart, and that the runtime setting is required).
//
// The platform files are not modified; the script is turned off by setting only.
//
// Usage: node scripts/check-built-server-grok-extension.mjs [path/to/.vercel/output]

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const GROK_EXTENSION_NEEDLE = "grok-app-builder/extensions.js";

const CHILD_SOURCE = `
const mod = await import(process.argv[1]);
const handler = mod.default;
if (!handler || typeof handler.fetch !== "function") {
  console.error("built server function has no default export with .fetch");
  process.exit(2);
}
const res = await handler.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }));
const html = await res.text();
process.stdout.write(JSON.stringify({ status: res.status, length: html.length, contains: html.includes(${JSON.stringify(GROK_EXTENSION_NEEDLE)}) }));
`;

function renderRoot(serverEntry, flag) {
  const env = { ...process.env };
  delete env.VITE_GROK_EXTENSIONS;
  if (flag !== undefined) env.VITE_GROK_EXTENSIONS = flag;
  const child = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", CHILD_SOURCE, pathToFileURL(serverEntry).href],
    { env, encoding: "utf8", timeout: 60_000 },
  );
  if (child.status !== 0) {
    throw new Error(
      `server function call failed (exit ${child.status}): ${child.stderr || child.stdout}`,
    );
  }
  const lastLine = child.stdout.trim().split("\n").at(-1) ?? "";
  return JSON.parse(lastLine);
}

function main() {
  const outputDir = resolve(process.argv[2] ?? ".vercel/output");
  const serverEntry = resolve(outputDir, "functions/__server.func/index.mjs");
  if (!existsSync(serverEntry)) {
    console.error(`FAIL: missing built server function ${serverEntry}`);
    process.exit(1);
  }

  let failed = false;
  const cases = [
    { label: "VITE_GROK_EXTENSIONS=0", flag: "0", expectContains: false },
    { label: "VITE_GROK_EXTENSIONS unset (control)", flag: undefined, expectContains: true },
  ];
  for (const { label, flag, expectContains } of cases) {
    const result = renderRoot(serverEntry, flag);
    const ok =
      result.status >= 200 &&
      result.status < 300 &&
      result.length > 0 &&
      result.contains === expectContains;
    console.log(
      `${ok ? "PASS" : "FAIL"}: ${label} -> status ${result.status}, html ${result.length} bytes, ` +
        `${GROK_EXTENSION_NEEDLE} ${result.contains ? "PRESENT" : "ABSENT"} ` +
        `(expected ${expectContains ? "PRESENT" : "ABSENT"})`,
    );
    if (!ok) failed = true;
  }
  if (failed) process.exit(1);
  console.log("BUILT_SERVER_GROK_EXTENSION_CHECK: PASS");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
