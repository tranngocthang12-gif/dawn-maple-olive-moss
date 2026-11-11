# TASK_QUEUE_V1.md — Owner-authorized work only

**State as of 2026-11-11, base `main` `609ed1bd7cdbea76842745985e34c13e91e050c4`.** Order `LỆNH [CHỈNAM] #4.0` (O-01, O-02) is done: PR #6 merged by Owner. This file does not approve a merge or open Stage 4.

| Priority | Order / task | Status | Authorization and acceptance |
| --- | --- | --- | --- |
| 1 | **LỆNH [CHỈNAM] #4.1** — REL-02: turn off the platform script by setting, CI check on the built server function, live check script, record Owner decisions | PR #7 OPEN on `chinam/rel-02-settings-guard`; R2 round 1 CHANGES REQUIRED; R2C7-01 and R2C7-02 fixed on the branch | Independent R2 re-reviews the new head (waiver W-01) |
| 2 | Owner merges the order #4.1 PR | PENDING (Owner only) | After R2 verdict comment on the PR |
| 3 | Connect Vercel to this repository and set `VITE_GROK_EXTENSIONS=0` for Production and Preview | PENDING (Owner, or delegated with Owner confirmation) | See `PROJECT_STATE_V1.md` → Deployment |
| 4 | Deploy from `main` | PENDING | Build per `vercel.json` |
| 5 | From the repository root run `node scripts/check-live-no-grok-extension.mjs <deployed URL>`; only on exit 0 with a `PASS:` line naming the final URL, close REL-01 and REL-02 | PENDING | Record result and SHA in the next state update |
| 6 | Stop the project at this milestone | PENDING | Definition of done: app runs for real from `main`, REL-01 and REL-02 closed |

## Observations — not work authorization
- **OBS-01 (from PR #7 R2C7-02):** `scripts/brand-check.mjs:196`, `scripts/preview.mjs:332` and `scripts/write-atomic.mjs:71` use the same form of main-module guard (string compare of `import.meta.url` with `pathToFileURL(process.argv[1]).href`). As R2 showed for the two new scripts, that form does not run the script body when invoked through a symlink (ANALYTICAL_CLAIM for these three; not re-run). Not changed in PR #7 by Owner decision; any change needs a separate order.

## Owner decisions — recorded
- **D-1:** Vercel, built from `main`. **D-2:** live data in the browser. **D-3:** Stage 4 not opened. **Owner has decided CHỈNAM has no relationship with TRUNG TÂM TÀI CHÍNH.**

**Forbidden by current queue:** writing Stage 4 specifications or code; implementer merging any PR; modifying platform files (`scripts/grok-pwa-*`, `server/`, `public/__grok/`); trading or connecting a broker to execute; changing repository settings; conflating application and other finance repository states.
