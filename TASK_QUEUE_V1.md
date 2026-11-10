# TASK_QUEUE_V1.md — Owner-authorized work only

**State as of 2026-11-09, base `main` `e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd`.** Changes in order #4.0 require a PR, independent R2, then **Owner** merge; this file does not approve a merge or open Stage 4.

| Priority | Order / task | Status | Authorization and acceptance |
| --- | --- | --- | --- |
| 1 | **LỆNH [CHỈNAM] #4.0 — O-01** Create in-repo application operational records | AUTHORIZED / IN_PROGRESS on `chinam/ops-records` | Four short root documents: `AGENTS.project.md`, `PROJECT_STATE_V1.md`, `TASK_QUEUE_V1.md`, `REVIEW_LOG.md`; source-linked facts, no private credentials |
| 2 | **LỆNH [CHỈNAM] #4.0 — O-02** Untrack legacy `.vercel/output/` | AUTHORIZED / PENDING PR REVIEW | Add ignore rule, remove tracked files, CI clean Vercel-style source build (exact `vercel.json` install/build commands), test no tracked output |
| 3 | **LỆNH [CHỈNAM] #4.0** Open one PR into `main`, evidence + R2 handoff | AUTHORIZED / PENDING | Two commits `ops O-01:` and `ops O-02:`; CI success; **NO AUTO-MERGE** |

## Pending Owner decisions — not work authorization
- **D-1:** Choose/verify the live application's deployment destination and deployment mechanism.
- **D-2:** Choose where CHỈNAM's live data will reside. **Owner has decided CHỈNAM has no relationship with TRUNG TÂM TÀI CHÍNH**; this is not an open decision.
- **D-3:** Decide if and when to open Stage 4, under a separate explicit order.

**Forbidden by current queue:** writing Stage 4 specifications or code; merging this PR; trading or connecting a broker to execute; changing repository settings; conflating application and other finance repository states.
