# PROJECT_STATE_V1.md — CHỈNAM application

**State snapshot:** 2026-11-11, Chief Engineer order C-06 (live check and closing REL-01, REL-02). **Verified `main` SHA:** `4c83f808ccf52dcc03412b9396b56cac5d8a825d` (merge of PR #7). [Main commit](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/commit/4c83f808ccf52dcc03412b9396b56cac5d8a825d); [successful main push CI](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42979470810). This file is part of a documentation-only PR; it does **not** claim that PR is merged.

## Project status
**XONG giai đoạn này — app chạy thật từ main trên Vercel; dừng ở mốc này (D-3).** REL-01 and REL-02 are CLOSED (2026-11-11, see below). Stage 4 remains LOCKED. Only observations remain open (see `TASK_QUEUE_V1.md`), to be considered if the project is reopened.

## Completed and merged application stages (SOURCE_EVIDENCE)

| Stage / scope | PR | Reviewed head SHA | Merged commit | R2 verdict on PR | After-merge CI |
| --- | --- | --- | --- | --- | --- |
| Stage 1, Foundation corrections | [#1](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/1) | `0e0a31cd012bc6c79a64bb45298e0545b7c88006` | `86a86e0ba57e57ddf875503ec8f0f78bcdee6b55` | **CHƯA ĐỦ BẰNG CHỨNG:** no R2 comment found in PR #1 GitHub discussion/reviews at this snapshot; do not fabricate a link | Not independently extracted for this row |
| Stage 2 durability | [#2](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2) | `b6f9ee86203d8822a6099d89616858aa8765715d` | `c5bb588ad23166bf935a9631c561c051bbb09e18` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2#issuecomment-6735617760) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42590551679) |
| Stage 2 low-priority follow-ups | [#4](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4) | `ffa64354ae2274b0a026b533359a38f47e250713` | `3660d0c7f99d612c6e00f1d0c38e4817f5297139` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4#issuecomment-6738116210) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42603644065) |
| Stage 3 probability bench and repository hygiene | [#5](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5) | `b0ef6e8b76e45cd08fc01d027f9ab054a4d44b97` | `e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5#issuecomment-6739242528) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42611299570) |
| Ops #4.0, operational records + untrack stale `.vercel/output` | [#6](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6) | `16303010d1103ddfe9323ef39e028f4f5d1507bf` | `609ed1bd7cdbea76842745985e34c13e91e050c4` (merged by Owner) | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6#issuecomment-6759515840); accepted under one-time waiver W-02 | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42760002295) |
| Order #4.1, REL-02 settings guard + live check script | [#7](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/7) | `a867864073ca2fa11b725e53e088506da1584417` | `4c83f808ccf52dcc03412b9396b56cac5d8a825d` (merge commit, merged by Owner; parents `609ed1b`, `a867864`) | [Owner-forwarded R2 round 2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/7#issuecomment-6789607488) (waiver W-01) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42979470810) |

Stage 1–3, Ops #4.0 and order #4.1 are **merged into main** as above. The live deployment check below is evidence that the production site serves the CHỈNAM page without the platform script; it is not evidence of real-market predictive validity, finance readiness or investment execution authorization.

## Owner decisions (order #4.1, 2026-11-10)
- **D-1 — DECIDED:** the application runs on **Vercel**, built from `main`.
- **D-2 — DECIDED:** live data stays **in the browser**, as now.
- **D-3 — DECIDED:** **do not open Stage 4.**
- **Definition of "done" for this phase:** the application runs for real from `main`, and REL-01 and REL-02 are closed. The project stops at that milestone. **Met on 2026-11-11.**

## Chief Engineer decisions
- **QĐ-16 (2026-11-11):** a PR that changes only operational-record `.md` files (no code, no tests, no workflow, no configuration) is accepted by the Chief Engineer in place of R2; the Owner merges after the Chief Engineer reports it as passed.

## Deployment
- **Vercel connected by the Owner on 2026-11-11** (Hobby plan; the Vercel GitHub App is granted access to this repository only), building from `main`; install/build commands exactly as `vercel.json` (`npm install --omit=dev --no-audit --no-fund`; `VITE_GROK_EXTENSIONS=0 npm run build`).
- **`VITE_GROK_EXTENSIONS=0` is set for Production and Preview** in the Vercel project configuration (Owner statement, 2026-11-11). `vercel.json` covers the build only; the built server function reads the variable at runtime. The production live check PASS below is consistent with the runtime variable being `0` in Production (`ANALYTICAL_CLAIM`); Preview was not checked by script (see O-5).
- **Production domain:** `https://dawn-maple-olive-moss.vercel.app/`.
- After **every** deployment, from the repository root, run `node scripts/check-live-no-grok-extension.mjs <deployed URL>`. Count it as passed **only** when it exits 0 **and** prints a line starting with `PASS:` that names the final URL checked (`PASS: requested <url> -> final <final URL> -> ...`). The script fails on: fetch error or timeout; non-2xx; a redirect ending on another origin; content-type other than `text/html`; empty body; HTML containing `grok-app-builder/extensions.js`; HTML without the CHỈNAM marker `<title>CHỈNAM — Bàn vận hành</title>`.
- No other environment variable is required (no database, auth off).

### Live check of 2026-11-11 (SOURCE_EVIDENCE)
- **Where it ran:** Claude Code, from the cloud environment `chinam-live-check` created by the Owner on 2026-11-11, whose network allowlist opens only two hosts: the production domain and the deployment-specific `*.vercel.app` host of the same deployment. Clean checkout of `main` at `4c83f808ccf52dcc03412b9396b56cac5d8a825d` (`git status` clean), run from the repository root, Node v22.23.4.
- **Production domain, 2026-11-11T11:46:44Z:**
  ```
  $ node scripts/check-live-no-grok-extension.mjs https://dawn-maple-olive-moss.vercel.app/
  PASS: requested https://dawn-maple-olive-moss.vercel.app/ -> final https://dawn-maple-olive-moss.vercel.app/ -> CHỈNAM app page (4999 bytes) has no grok-app-builder/extensions.js
  ```
  Exit code **0**. Pass condition met (exit 0 and a `PASS:` line naming the final URL).
- **Deployment-specific URL, 2026-11-11T11:46:49Z, for the record only:** `FAIL: ... -> final (none) -> fetch failed: fetch failed`, exit code 1. Read-only diagnosis: that host answers `HTTP 302` to `https://vercel.com/sso-api?...` (Vercel Deployment Protection), and `vercel.com` is not in the environment's allowlist, so the fetch fails. This is the case R2 anticipated in observation O-5; it does not affect the production result.
- **Build source (R2 observation O-1):** `main` is `4c83f808ccf52dcc03412b9396b56cac5d8a825d`, and it is the only merge commit on `main` whose message is "Merge pull request #7" (parents `609ed1b`, `a867864`). The Owner's Vercel dashboard screenshot (2026-11-11 18:32 Vietnam time) shows status Ready, source branch `main`, message "Merge pull request #7 from tranngocthang12-gif/chinam/rel-02-settings-…". The screenshot truncates the message and shows no SHA, so "the production build is `4c83f80`" is an `ANALYTICAL_CLAIM` from that match; the SHA itself was not read from Vercel.

## Outstanding / governed items
- **REL-01 — CLOSED 2026-11-11.** The tracked legacy `.vercel/output` (from `9328168`) was removed by PR #6 (merged `609ed1b`); CI builds a clean Vercel-style output from source. Closing evidence: production `https://dawn-maple-olive-moss.vercel.app/`; live check line `PASS: requested https://dawn-maple-olive-moss.vercel.app/ -> final https://dawn-maple-olive-moss.vercel.app/ -> CHỈNAM app page (4999 bytes) has no grok-app-builder/extensions.js`, exit 0; `main` SHA `4c83f808ccf52dcc03412b9396b56cac5d8a825d`; build source as recorded above (Vercel message "Merge pull request #7 …", branch `main`, matched to `4c83f80`); `VITE_GROK_EXTENSIONS=0` set for Production and Preview. Check run from cloud environment `chinam-live-check` (Owner-created 2026-11-11, two hosts only).
- **REL-02 — CLOSED 2026-11-11** (previous status: "GIẢM THIỂU BẰNG CÀI ĐẶT — chờ kiểm bản chạy thật"). Reproduction (SOURCE_EVIDENCE): the built server function (`.vercel/output/functions/__server.func/index.mjs`) injects `https://grok.com/grok-app-builder/extensions.js` into every page when the runtime `VITE_GROK_EXTENSIONS` is not `"0"` (reported in the [PR #6 R2 comment](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6#issuecomment-6759515840); re-run by `scripts/check-built-server-grok-extension.mjs` on a clean build of `609ed1b`: `=0` → ABSENT, unset → PRESENT). Decision: platform files are **not** modified; the script is turned off by setting only (`VITE_GROK_EXTENSIONS=0` at build and runtime). CI asserts both cases on every run. PR #7: R2 round 1 CHANGES REQUIRED, R2 round 2 MERGEABLE, merged by Owner as `4c83f80`. Closing evidence: same production domain, `PASS:` line, exit code, `main` SHA, build source and Production/Preview variable as REL-01 above; check run from cloud environment `chinam-live-check` (Owner-created 2026-11-11, two hosts only).
- **GIT-01 — Owner-confirmed CLOSED for the branch-settings checklist; readback limitations recorded.** Owner states screenshot and independent R2 check verified required PR, zero required approvals, required GitHub Actions `verify`, "Do not allow bypassing" ON, force pushes OFF, deletions OFF. GitHub branch summary independently reports `protected=true`; detailed rules endpoint was inaccessible to this integration (403). No settings changes authorized by order #4.0.
- **PIT-01 — DEFERRED to future Stage 4 specification by Owner order, not implemented here.** Historical event-time/public-availability/ingest-time and revision provenance need an explicit point-in-time contract before trustworthy historical evaluation.
- **ENG-01 — PLANNED SCOPE, not an implementation failure.** Future World/Macro engines, Economic Graph, valuations, calibration, portfolio risk, continuous intelligence require separately approved phases.

**Stage 4: LOCKED.** No specification, code, real capital or broker execution authority granted. **Owner decision:** CHỈNAM **KHÔNG LIÊN QUAN VỚI TRUNG TÂM TÀI CHÍNH**. Do not share states, queues or data. Live data storage: in the browser (D-2, decided).

See `TASK_QUEUE_V1.md` for the remaining observations and `REVIEW_LOG.md` for R2 history.
