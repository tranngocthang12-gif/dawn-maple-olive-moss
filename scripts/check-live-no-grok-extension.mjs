#!/usr/bin/env node
// REL-02 live check: fetch the root page of a deployed CHỈNAM URL and PASS (exit 0)
// only when the final response is the CHỈNAM app page and it does not reference the
// platform extension script. Anything else is FAIL (exit 1):
//   - fetch error or timeout;
//   - final status not 2xx;
//   - redirects ending on another origin than the requested URL;
//   - content-type not text/html, or an empty body (including 204);
//   - HTML containing grok-app-builder/extensions.js;
//   - HTML without the CHỈNAM marker (the <title> of the app root route,
//     set in src/routes/index.tsx).
// The output line always names the final URL that was checked.
//
// Usage (from the repository root): node scripts/check-live-no-grok-extension.mjs https://<deployment-host>/
//
// Run after every deployment. Not run against a real address in CI.

import { pathToFileURL } from "node:url";

export const GROK_EXTENSION_NEEDLE = "grok-app-builder/extensions.js";
export const CHINAM_APP_MARKER = "<title>CHỈNAM — Bàn vận hành</title>";

/**
 * @param {string} url
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [options]
 * @returns {Promise<{ ok: boolean, reason: string, status?: number, finalUrl?: string }>}
 */
export async function checkLiveNoGrokExtension(url, options = {}) {
  const { fetchImpl = fetch, timeoutMs = 20_000 } = options;
  let target;
  try {
    target = new URL(url);
  } catch {
    return { ok: false, reason: `invalid URL: ${url}` };
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return { ok: false, reason: `unsupported protocol: ${target.protocol}` };
  }

  let response;
  let html;
  try {
    response = await fetchImpl(target, {
      redirect: "follow",
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    html = await response.text();
  } catch (error) {
    return { ok: false, reason: `fetch failed: ${error?.message ?? error}` };
  }

  const status = response.status;
  const finalUrl = response.url;
  const fail = (reason) => ({ ok: false, status, finalUrl, reason });

  if (!finalUrl) return fail("response did not report a final URL");
  if (new URL(finalUrl).origin !== target.origin) {
    return fail(
      `redirected to another origin (${new URL(finalUrl).origin}, expected ${target.origin})`,
    );
  }
  if (response.status < 200 || response.status > 299) {
    return fail(`non-2xx status ${status}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  const mimeType = contentType.split(";")[0].trim().toLowerCase();
  if (mimeType !== "text/html") {
    return fail(`content-type is not text/html (${contentType || "missing"})`);
  }
  if (html.length === 0) return fail("empty body");
  if (html.includes(GROK_EXTENSION_NEEDLE)) {
    return fail(`HTML contains ${GROK_EXTENSION_NEEDLE}`);
  }
  if (!html.includes(CHINAM_APP_MARKER)) {
    return fail(`HTML is not the CHỈNAM app page (marker ${CHINAM_APP_MARKER} not found)`);
  }
  return {
    ok: true,
    status,
    finalUrl,
    reason: `CHỈNAM app page (${html.length} bytes) has no ${GROK_EXTENSION_NEEDLE}`,
  };
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("usage: node scripts/check-live-no-grok-extension.mjs <url>");
    process.exit(2);
  }
  const result = await checkLiveNoGrokExtension(url);
  console.log(
    `${result.ok ? "PASS" : "FAIL"}: requested ${url} -> final ${result.finalUrl || "(none)"} -> ${result.reason}`,
  );
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
