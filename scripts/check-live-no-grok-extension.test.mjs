import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import * as liveCheck from "./check-live-no-grok-extension.mjs";
import { GROK_EXTENSIONS_SCRIPT_SRC } from "./grok-pwa-shared.mjs";

// Namespace import so a missing export fails only the test that needs it.
const { GROK_EXTENSION_NEEDLE, checkLiveNoGrokExtension } = liveCheck;

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS_DIR, "check-live-no-grok-extension.mjs");
const APP_TITLE = "<title>CHỈNAM — Bàn vận hành</title>";
const appPage = (head = "") =>
  `<!doctype html><html lang="vi"><head>${APP_TITLE}${head}</head><body>app</body></html>`;
const HTML = { "content-type": "text/html; charset=utf-8" };

function routes(otherBase) {
  return {
    "/clean": [200, HTML, appPage()],
    "/with-script": [
      200,
      HTML,
      appPage(`<script src="${GROK_EXTENSIONS_SCRIPT_SRC}" defer></script>`),
    ],
    "/server-error": [500, HTML, appPage()],
    "/not-found": [404, HTML, appPage()],
    "/json-200": [200, { "content-type": "application/json" }, '{"ok":true}'],
    "/text-200": [200, { "content-type": "text/plain" }, appPage()],
    "/no-content-type": [200, {}, appPage()],
    "/empty-200": [200, HTML, ""],
    "/no-content-204": [204, {}, ""],
    "/html-not-the-app": [
      200,
      HTML,
      "<!doctype html><html><head><title>Deployment placeholder</title></head><body>soon</body></html>",
    ],
    "/redirect-same-origin": [302, { location: "/clean" }, ""],
    "/redirect-other-origin": [302, { location: `${otherBase}/clean` }, ""],
  };
}

function listen(server) {
  return new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
}

async function closeServer(server) {
  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
}

async function withFakeSites(run) {
  // Second site on a different origin ("localhost" vs "127.0.0.1") serving the real app page.
  const other = createServer((_req, res) => {
    res.writeHead(200, HTML);
    res.end(appPage());
  });
  await listen(other);
  const otherBase = `http://localhost:${other.address().port}`;
  const table = routes(otherBase);
  const server = createServer((req, res) => {
    if (req.url === "/hang") return; // never answers
    const [status, headers, body] = table[req.url] ?? [404, HTML, "missing"];
    res.writeHead(status, headers);
    res.end(body);
  });
  await listen(server);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    return await run(base);
  } finally {
    await closeServer(server);
    await closeServer(other);
  }
}

async function closedPortUrl() {
  const server = createServer();
  await listen(server);
  const { port } = server.address();
  await closeServer(server);
  return `http://127.0.0.1:${port}/`;
}

function runCli(args, script = SCRIPT) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => resolve({ code, output }));
  });
}

async function expectRed(url, pattern, options) {
  const result = await checkLiveNoGrokExtension(url, options);
  assert.equal(result.ok, false, `${url}: ${result.reason}`);
  assert.match(result.reason, pattern);
  return result;
}

test("REL-02 live check: needle matches the platform script URL", () => {
  assert.ok(GROK_EXTENSIONS_SCRIPT_SRC.endsWith(GROK_EXTENSION_NEEDLE));
});

test("REL-02 live check: app page without the extension script is GREEN and reports the final URL", async () => {
  await withFakeSites(async (base) => {
    const result = await checkLiveNoGrokExtension(`${base}/clean`);
    assert.equal(result.ok, true, result.reason);
    assert.equal(result.status, 200);
    assert.equal(result.finalUrl, `${base}/clean`);

    const cli = await runCli([`${base}/clean`]);
    assert.equal(cli.code, 0, cli.output);
    assert.match(cli.output, /^PASS: /);
    assert.ok(cli.output.includes(`final ${base}/clean`), cli.output);
  });
});

test("REL-02 live check: app page with the extension script is RED", async () => {
  await withFakeSites(async (base) => {
    await expectRed(`${base}/with-script`, /contains/);
    const cli = await runCli([`${base}/with-script`]);
    assert.equal(cli.code, 1, cli.output);
    assert.match(cli.output, /^FAIL: /);
  });
});

test("REL-02 live check: non-2xx status is RED even on the app page", async () => {
  await withFakeSites(async (base) => {
    await expectRed(`${base}/server-error`, /non-2xx/);
    await expectRed(`${base}/not-found`, /non-2xx/);
    const cli = await runCli([`${base}/server-error`]);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: content-type other than text/html is RED", async () => {
  await withFakeSites(async (base) => {
    await expectRed(`${base}/json-200`, /content-type/);
    await expectRed(`${base}/text-200`, /content-type/);
    await expectRed(`${base}/no-content-type`, /content-type/);
    const cli = await runCli([`${base}/json-200`]);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: empty body (200 and 204) is RED", async () => {
  await withFakeSites(async (base) => {
    await expectRed(`${base}/empty-200`, /empty/);
    await expectRed(`${base}/no-content-204`, /empty|content-type/);
    const cli = await runCli([`${base}/empty-200`]);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: HTML page that is not CHỈNAM is RED", async () => {
  await withFakeSites(async (base) => {
    await expectRed(`${base}/html-not-the-app`, /marker/);
    const cli = await runCli([`${base}/html-not-the-app`]);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: same-origin redirect is followed and GREEN on the app page", async () => {
  await withFakeSites(async (base) => {
    const result = await checkLiveNoGrokExtension(`${base}/redirect-same-origin`);
    assert.equal(result.ok, true, result.reason);
    assert.equal(result.finalUrl, `${base}/clean`);
  });
});

test("REL-02 live check: redirect to another origin is RED even if that page is clean", async () => {
  await withFakeSites(async (base) => {
    const result = await expectRed(`${base}/redirect-other-origin`, /origin/);
    assert.match(result.finalUrl, /^http:\/\/localhost:\d+\/clean$/);
    const cli = await runCli([`${base}/redirect-other-origin`]);
    assert.equal(cli.code, 1, cli.output);
  });
});

test("REL-02 live check: a server that never answers is RED after timeoutMs", async () => {
  await withFakeSites(async (base) => {
    let timer;
    const notApplied = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeoutMs was not applied")), 5_000);
    });
    try {
      await Promise.race([
        expectRed(`${base}/hang`, /fetch failed/, { timeoutMs: 300 }),
        notApplied,
      ]);
    } finally {
      clearTimeout(timer);
    }
  });
});

test("REL-02 live check: network error is RED", async () => {
  const url = await closedPortUrl();
  await expectRed(url, /fetch failed/, { timeoutMs: 5_000 });
  const cli = await runCli([url]);
  assert.equal(cli.code, 1, cli.output);
  assert.match(cli.output, /^FAIL: /);
});

test("REL-02 live check: invalid URL or missing argument is RED", async () => {
  assert.equal((await checkLiveNoGrokExtension("not a url")).ok, false);
  assert.equal((await checkLiveNoGrokExtension("ftp://example.invalid/")).ok, false);
  const cli = await runCli([""]);
  assert.notEqual(cli.code, 0, cli.output);
});

test("REL-02 live check: CLI still runs the check when invoked through a file or directory symlink", async () => {
  const work = mkdtempSync(join(tmpdir(), "chinam-live-symlink-"));
  try {
    const fileLink = join(work, "check-live-link.mjs");
    symlinkSync(SCRIPT, fileLink);
    const dirLink = join(work, "scripts-link");
    symlinkSync(SCRIPTS_DIR, dirLink, "dir");
    await withFakeSites(async (base) => {
      for (const script of [fileLink, join(dirLink, "check-live-no-grok-extension.mjs")]) {
        const red = await runCli([`${base}/with-script`], script);
        assert.equal(red.code, 1, `${script}: ${red.output}`);
        assert.match(red.output, /^FAIL: /, script);
        const green = await runCli([`${base}/clean`], script);
        assert.equal(green.code, 0, `${script}: ${green.output}`);
        assert.match(green.output, /^PASS: /, script);
      }
    });
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});
