#!/usr/bin/env node
// REL-02 live check: fetch the root page of a deployed CHỈNAM URL and fail
// (non-zero exit) if the HTML references the platform extension script, if the
// page cannot be fetched, or if the response status is not 2xx.
//
// Usage: node scripts/check-live-no-grok-extension.mjs https://<deployment-host>/
//
// Run after every deployment. Not run against a real address in CI.

import { pathToFileURL } from "node:url";

export const GROK_EXTENSION_NEEDLE = "grok-app-builder/extensions.js";

/**
 * @param {string} url
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [options]
 * @returns {Promise<{ ok: boolean, reason: string, status?: number }>}
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

  if (response.status < 200 || response.status > 299) {
    return { ok: false, status: response.status, reason: `non-2xx status ${response.status}` };
  }
  if (html.includes(GROK_EXTENSION_NEEDLE)) {
    return {
      ok: false,
      status: response.status,
      reason: `HTML contains ${GROK_EXTENSION_NEEDLE}`,
    };
  }
  return {
    ok: true,
    status: response.status,
    reason: `HTML (${html.length} bytes) has no ${GROK_EXTENSION_NEEDLE}`,
  };
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("usage: node scripts/check-live-no-grok-extension.mjs <url>");
    process.exit(2);
  }
  const result = await checkLiveNoGrokExtension(url);
  console.log(`${result.ok ? "PASS" : "FAIL"}: ${url} -> ${result.reason}`);
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
