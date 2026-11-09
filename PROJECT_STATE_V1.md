# PROJECT_STATE_V1.md — CHỈNAM application

**State snapshot (before Owner-order #4.0 PR merge):** 2026-11-09. **Verified base `main` SHA:** `e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd`. [Main commit](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/commit/e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd); [successful main push CI](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42611299570). This file is part of a proposed PR; it does **not** claim #4.0 is merged.

## Completed and merged application stages (SOURCE_EVIDENCE)

| Stage / scope | PR | Reviewed head SHA | Merged commit | R2 verdict on PR | After-merge CI |
| --- | --- | --- | --- | --- | --- |
| Stage 1, Foundation corrections | [#1](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/1) | `0e0a31cd012bc6c79a64bb45298e0545b7c88006` | `86a86e0ba57e57ddf875503ec8f0f78bcdee6b55` | **CHƯA ĐỦ BẰNG CHỨNG:** no R2 comment found in PR #1 GitHub discussion/reviews at this snapshot; do not fabricate a link | Not independently extracted for this row |
| Stage 2 durability | [#2](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2) | `b6f9ee86203d8822a6099d89616858aa8765715d` | `c5bb588ad23166bf935a9631c561c051bbb09e18` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/2#issuecomment-6735617760) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42590551679) |
| Stage 2 low-priority follow-ups | [#4](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4) | `ffa64354ae2274b0a026b533359a38f47e250713` | `3660d0c7f99d612c6e00f1d0c38e4817f5297139` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/4#issuecomment-6738116210) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42603644065) |
| Stage 3 probability bench and repository hygiene | [#5](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5) | `b0ef6e8b76e45cd08fc01d027f9ab054a4d44b97` | `e5bc5efcc4a18b4f9589677d3319f3f5d8ace5fd` | [Owner-forwarded R2 MERGEABLE](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/pull/5#issuecomment-6739242528) | [SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42611299570) |

Stage 1–3 are **merged into main** as above. This is not evidence of live deployment, real-market predictive validity, finance readiness or investment execution authorization.

## Outstanding / governed items
- **REL-01 — OPEN until #4.0 O-02 is independently reviewed and merged.** Owner-supplied Claude R2 evidence: currently tracked `.vercel/output` is a legacy prebuilt artifact from `9328168` (not the Stage 1–3 source build); R2 reports a clean Vercel-style build succeeds and produces a fresh v2 artifact. #4.0 authorizes removing this **tracked** legacy build only; production deployment destination/path remains **unconfirmed** pending Owner decision D-1.
- **GIT-01 — Owner-confirmed CLOSED for the branch-settings checklist; readback limitations recorded.** Owner states screenshot and independent R2 check verified required PR, zero required approvals, required GitHub Actions `verify`, "Do not allow bypassing" ON, force pushes OFF, deletions OFF. GitHub branch summary independently reports `protected=true`; detailed rules endpoint was inaccessible to this integration (403). No settings changes authorized by order #4.0.
- **PIT-01 — DEFERRED to future Stage 4 specification by Owner order, not implemented here.** Historical event-time/public-availability/ingest-time and revision provenance need an explicit point-in-time contract before trustworthy historical evaluation.
- **ENG-01 — PLANNED SCOPE, not an implementation failure.** Future World/Macro engines, Economic Graph, valuations, calibration, portfolio risk, continuous intelligence require separately approved phases.

**Stage 4: LOCKED.** No specification, code, real capital or broker execution authority granted. **Owner decision:** CHỈNAM **KHÔNG LIÊN QUAN VỚI TRUNG TÂM TÀI CHÍNH**. Do not share states, queues or data. The storage location for CHỈNAM live data remains a separate pending Owner decision (D-2).

See `TASK_QUEUE_V1.md` for the only currently authorized work and `REVIEW_LOG.md` for R2 history.
