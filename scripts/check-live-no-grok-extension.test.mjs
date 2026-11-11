import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  GROK_EXTENSION_NEEDLE,
  checkLiveNoGrokExtension,
} from "./check-live-no-grok-extension.mjs";
import { GROK_EXTENSIONS_SCRIPT_SRC } from "./grok-pwa-shared.mjs";

const SCRIPT = fileURLToPath(new URL("./check-live-no-grok-extension.mjs", import.meta.url));

const PAGES = {
  "/with-script": [
    200,
    `<!doctype html><html><head><script src="${GROK_EXTENSIONS_SCRIPT_SRC}" defer></script></head><body>app</body></html>`,
  ],
  "/clean": [200, "<!doctype html><html><head></head><body>app</body></html>"],
  "/server-error": [500, "<!doctype html><html><body>error</body></html>"],
  "/not-found": [404, "<!doctype html><html><body>missing</body></html>"],
};

async function withFakeSite(run) {
  const server = createServer((req, res) => {
    const [status, body] = PAGES[req.url] ?? [404, "missing"];
    res.writeHead(status, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    return await run(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function closedPortUrl() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return `http://127.0.0.1:${port}/`;
}

function runCli(url) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SCRIPT, url], { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => resolve({ code, output }));
  });
}

test("REL-02 live check: needle matches the platform script URL", () => {
  assert.ok(GROK_EXTENSIONS_SCRIPT_SRC.endsWith(GROK_EXTENSION_NEEDLE));
});

test("REL-02 live check: page with the extension script is RED", async () => {
  await withFakeSite(async (base) => {
    const result = await checkLiveNoGrokExtension(`${base}/with-script`);
    assert.equal(result.ok, false);
    assert.equal(result.status, 200);
    assert.match(result.reason, /contains/);

    const cli = await runCli(`${base}/with-script`);
    assert.equal(cli.code, 1, cli.output);
    assert.match(cli.output, /^FAIL:/);
  });
});

test("REL-02 live check: page without the extension script is GREEN", async () => {
  await withFakeSite(async (base) => {
    const result = await checkLiveNoGrokExtension(`${base}/clean`);
    assert.equal(result.ok, true, result.reason);
    assert.equal(result.status, 200);

    const cli = await runCli(`${base}/clean`);
    assert.equal(cli.code, 0, cli.output);
    assert.match(cli.output, /^PASS:/);
  });
});

test("REL-02 live check: non-2xx status is RED even without the script", async () => {
  await withFakeSite(async (base) => {
    for (const path of ["/server-error", "/not-found"]) {
      const result = await checkLiveNoGrokExtension(`${base}${path}`);
      assert.equal(result.ok, false, path);
      assert.match(result.reason, /non-2xx/);
    }
    const cli = await runCli(`${base}/server-error`);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: network error is RED", async () => {
  const url = await closedPortUrl();
  const result = await checkLiveNoGrokExtension(url, { timeoutMs: 5_000 });
  assert.equal(result.ok, false);
  assert.match(result.reason, /fetch failed/);

  const cli = await runCli(url);
  assert.equal(cli.code, 1, cli.output);
  assert.match(cli.output, /^FAIL:/);
});

test("REL-02 live check: invalid URL or missing argument is RED", async () => {
  assert.equal((await checkLiveNoGrokExtension("not a url")).ok, false);
  assert.equal((await checkLiveNoGrokExtension("ftp://example.invalid/")).ok, false);
  const cli = await runCli("");
  assert.notEqual(cli.code, 0, cli.output);
});
