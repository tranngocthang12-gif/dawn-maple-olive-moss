# TASK_QUEUE_V1.md — Owner-authorized work only

**State as of 2026-11-11, base `main` `609ed1bd7cdbea76842745985e34c13e91e050c4`.** Order `LỆNH [CHỈNAM] #4.0` (O-01, O-02) is done: PR #6 merged by Owner. This file does not approve a merge or open Stage 4.

| Priority | Order / task | Status | Authorization and acceptance |
| --- | --- | --- | --- |
| 1 | **LỆNH [CHỈNAM] #4.1** — REL-02: turn off the platform script by setting, CI check on the built server function, live check script, record Owner decisions | PR OPEN on `chinam/rel-02-settings-guard` | Independent R2 reviews this PR (waiver W-01) |
| 2 | Owner merges the order #4.1 PR | PENDING (Owner only) | After R2 verdict comment on the PR |
| 3 | Connect Vercel to this repository and set `VITE_GROK_EXTENSIONS=0` for Production and Preview | PENDING (Owner, or delegated with Owner confirmation) | See `PROJECT_STATE_V1.md` → Deployment |
| 4 | Deploy from `main` | PENDING | Build per `vercel.json` |
| 5 | Run `node scripts/check-live-no-grok-extension.mjs <deployed URL>`; on PASS close REL-01 and REL-02 | PENDING | Record result and SHA in the next state update |
| 6 | Stop the project at this milestone | PENDING | Definition of done: app runs for real from `main`, REL-01 and REL-02 closed |

## Owner decisions — recorded
- **D-1:** Vercel, built from `main`. **D-2:** live data in the browser. **D-3:** Stage 4 not opened. **Owner has decided CHỈNAM has no relationship with TRUNG TÂM TÀI CHÍNH.**

**Forbidden by current queue:** writing Stage 4 specifications or code; implementer merging any PR; modifying platform files (`scripts/grok-pwa-*`, `server/`, `public/__grok/`); trading or connecting a broker to execute; changing repository settings; conflating application and other finance repository states.
