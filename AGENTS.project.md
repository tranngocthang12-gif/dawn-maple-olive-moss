# AGENTS.project.md — CHỈNAM application operational rules

**Repository of record for this application:** `tranngocthang12-gif/dawn-maple-olive-moss`. **Owner decision:** CHỈNAM is independent and **KHÔNG LIÊN QUAN VỚI TRUNG TÂM TÀI CHÍNH**. Do not share operational state, queues, data or governance with that repository. Read this file first, then `PROJECT_STATE_V1.md`, `TASK_QUEUE_V1.md`, and `REVIEW_LOG.md`. Treat the checked-in records and their linked GitHub evidence as the operational source; verify the current SHA before acting.

## Roles and authority
- **Owner:** final authority for acceptance, branch merge, deployment, capital, leverage, and permission to open subsequent phases.
- **CHỈNAM architect:** may implement only the scope of an Owner order; prepares branches, tests, evidence and PRs; cannot independently accept or merge its own PR.
- **R2:** independent reviewer Claude as designated by Owner; R2 verdicts are delivered by Owner and recorded verbatim as PR comments with "chuyển từ Owner". Architect cannot impersonate R2.
- Specialist R3 is separate when Owner requests compliance, security, accounting or quant/risk review.

## Required change gates
1. Owner issues a numbered order, e.g. `LỆNH [CHỈNAM] #4.0`. If a numbered order has parts, do not execute a conditional part before its exact Owner trigger.
2. Work on a feature branch; all source/state changes must go through a pull request to `main`; do not directly push to `main` or change repo settings.
3. Verify tests, typecheck, lint and applicable real production build/CI at the pinned candidate SHA. A green CI is technical evidence, not an independent review or Owner acceptance.
4. Independent R2 conclusion must be linked as an explicit PR comment **before Owner merges**. When missing, record `CHƯA ĐỦ BẰNG CHỨNG` rather than invent a review.
5. **Only Owner merges or accepts**. Architects and reviewers do not authorize themselves to merge. After merge, verify `main` SHA and CI and update state through the next approved PR.
6. No Stage 4 specification or implementation until a new explicit Owner order; no capital, broker orders, margin, leverage, short or derivatives without Owner gates.

Evidence labels: `SOURCE_EVIDENCE`, `DERIVED_DATA`, `ANALYTICAL_CLAIM`, `HYPOTHESIS`, `FORECAST`. Never convert an inference into fact. Preserve point-in-time availability; never use revised future information to validate a past decision. `CHƯA ĐỦ BẰNG CHỨNG` is the required response to an unverified fact.

## State-record conventions
- `PROJECT_STATE_V1.md`: current application SHA, merge/CI evidence, phase gates and known open items.
- `TASK_QUEUE_V1.md`: **only** Owner-authorized work and pending Owner decisions.
- `REVIEW_LOG.md`: an index of independent R2 verdicts, pinned SHA and comment URLs, not copies of long reports.
- Historical records are not silently upgraded; commit/PR evidence stays linked.
