# PROJECT_STATE_V1.md — CHỈNAM application

**State snapshot:** 2026-11-11, during Owner order `LỆNH [CHỈNAM] #4.1`. **Verified base `main` SHA:** `609ed1bd7cdbea76842745985e34c13e91e050c4` (merge of PR #6). [Main commit](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/commit/609ed1bd7cdbea76842745985e34c13e91e050c4); [successful main push CI](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42760002295). This file is part of the order #4.1 PR; it does **not** claim that PR is merged or that anything is deployed.

## Completed and merged application stages (SOURCE_EVIDENCE)

| Stage / scope | PR | Reviewed head SHA | Merged commit | R2 verdict on PR | After-merge CI |
| --- | --- | --- | --- | --- | --- |
| Stage 1, Foundation corrections | [#1](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/1) | `0e0a31cd012bc6c79a64bb45298e0545b7c88006` | `86a86e0ba57e57ddf875503ec8f0f78bcdee6b55` | **CHƯA ĐỦ BẰNG CHỨNG:** no R2 comment found in PR #1 GitHub discussion/reviews at this snapshot; do not fabricate a link | Not independently extracted for this row |
| Stage 2 durability | [#2](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2) | `b6f9ee86203d8822a6099d89616858aa8765715d` | `c5bb588ad23166bf935a9631c561c051bbb09e18` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2#issuecomment-6735617760) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42590551679) |
| Stage 2 low-priority follow-ups | [#4](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4) | `ffa64354ae2274b0a026b533359a38f47e250713` | `3660d0c7f99d612c6e00f1d0c38e4817f5297139` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4#issuecomment-6738116210) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42603644065) |
| Stage 3 probability bench and repository hygiene | [#5](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5) | `b0ef6e8b76e45cd08fc01d027f9ab054a4d44b97` | `e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5#issuecomment-6739242528) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42611299570) |
| Ops #4.0, operational records + untrack stale `.vercel/output` | [#6](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6) | `16303010d1103ddfe9323ef39e028f4f5d1507bf` | `609ed1bd7cdbea76842745985e34c13e91e050c4` (merged by Owner) | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6#issuecomment-6759515840); accepted under one-time waiver W-02 | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42760002295) |

Stage 1–3 and Ops #4.0 are **merged into main** as above. This is not evidence of live deployment, real-market predictive validity, finance readiness or investment execution authorization.

## Owner decisions (order #4.1, 2026-11-10)
- **D-1 — DECIDED:** the application runs on **Vercel**, built from `main`.
- **D-2 — DECIDED:** live data stays **in the browser**, as now.
- **D-3 — DECIDED:** **do not open Stage 4.**
- **Definition of "done" for this phase:** the application runs for real from `main`, and REL-01 and REL-02 are closed. The project stops at that milestone.

## Deployment
- Vercel project connected to this repository, building from `main`; install/build commands exactly as `vercel.json` (`npm install --omit=dev --no-audit --no-fund`; `VITE_GROK_EXTENSIONS=0 npm run build`).
- **REQUIRED:** set `VITE_GROK_EXTENSIONS=0` for **Production** and **Preview** in the Vercel project configuration (runtime environment). `vercel.json` covers the build only; the built server function reads the variable at runtime.
- After **every** deployment run `node scripts/check-live-no-grok-extension.mjs <deployed URL>`; it must PASS (exit 0).
- No other environment variable is required (no database, auth off).

## Outstanding / governed items
- **REL-01 — OPEN until a live deployment from `main` is verified.** The tracked legacy `.vercel/output` (from `9328168`) was removed by PR #6 (merged `609ed1b`); CI builds a clean Vercel-style output from source. Closes when the deployed site built from `main` is checked with the live check script.
- **REL-02 — opened 2026-11-10; status: "GIẢM THIỂU BẰNG CÀI ĐẶT — chờ kiểm bản chạy thật".** Reproduction (SOURCE_EVIDENCE): the built server function (`.vercel/output/functions/__server.func/index.mjs`) injects `https://grok.com/grok-app-builder/extensions.js` into every page when the runtime `VITE_GROK_EXTENSIONS` is not `"0"` (reported in the [PR #6 R2 comment](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/6#issuecomment-6759515840); re-run by `scripts/check-built-server-grok-extension.mjs` on a clean build of `609ed1b`: `=0` → ABSENT, unset → PRESENT). Decision: platform files are **not** modified; the script is turned off by setting only (`VITE_GROK_EXTENSIONS=0` at build and runtime). CI asserts both cases on every run. Closes when the live check passes on the deployed site from `main`.
- **GIT-01 — Owner-confirmed CLOSED for the branch-settings checklist; readback limitations recorded.** Owner states screenshot and independent R2 check verified required PR, zero required approvals, required GitHub Actions `verify`, "Do not allow bypassing" ON, force pushes OFF, deletions OFF. GitHub branch summary independently reports `protected=true`; detailed rules endpoint was inaccessible to this integration (403). No settings changes authorized by order #4.0.
- **PIT-01 — DEFERRED to future Stage 4 specification by Owner order, not implemented here.** Historical event-time/public-availability/ingest-time and revision provenance need an explicit point-in-time contract before trustworthy historical evaluation.
- **ENG-01 — PLANNED SCOPE, not an implementation failure.** Future World/Macro engines, Economic Graph, valuations, calibration, portfolio risk, continuous intelligence require separately approved phases.

**Stage 4: LOCKED.** No specification, code, real capital or broker execution authority granted. **Owner decision:** CHỈNAM **KHÔNG LIÊN QUAN VỚI TRUNG TÂM TÀI CHÍNH**. Do not share states, queues or data. Live data storage: in the browser (D-2, decided).

See `TASK_QUEUE_V1.md` for the only currently authorized work and `REVIEW_LOG.md` for R2 history.
