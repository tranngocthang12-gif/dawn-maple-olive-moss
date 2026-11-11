# TASK_QUEUE_V1.md — Owner-authorized work only

**State as of 2026-11-11, `main` `4c83f808ccf52dcc03412b9396b56cac5d8a825d` (merge of PR #7).** All authorized work for this phase is done (Chief Engineer order C-06 closed REL-01 and REL-02). The project stops at this milestone (D-3). This file does not approve a merge or open Stage 4.

| Priority | Order / task | Status | Evidence |
| --- | --- | --- | --- |
| 1 | **LỆNH [CHỈNAM] #4.1** — REL-02: turn off the platform script by setting, CI check on the built server function, live check script, record Owner decisions | **DONE** — PR #7 R2 round 1 CHANGES REQUIRED, R2C7-01 and R2C7-02 fixed, R2 round 2 MERGEABLE on `a867864` | `REVIEW_LOG.md` |
| 2 | Owner merges the order #4.1 PR | **DONE** — merged by Owner, merge commit `4c83f80` | [main push CI SUCCESS](https://github.com/tranngocthang12-gif/dawn-maple-olive-moss/actions/runs/42979470810) |
| 3 | Connect Vercel to this repository and set `VITE_GROK_EXTENSIONS=0` for Production and Preview | **DONE** — Owner, 2026-11-11 | `PROJECT_STATE_V1.md` → Deployment |
| 4 | Deploy from `main` | **DONE** — Vercel status Ready, source branch `main`, message "Merge pull request #7 …" (matched to `4c83f80`) | `PROJECT_STATE_V1.md` → Live check |
| 5 | From the repository root run `node scripts/check-live-no-grok-extension.mjs <deployed URL>`; only on exit 0 with a `PASS:` line naming the final URL, close REL-01 and REL-02 (C-06) | **DONE** — PASS on `https://dawn-maple-olive-moss.vercel.app/`, exit 0; REL-01 and REL-02 CLOSED 2026-11-11 | `PROJECT_STATE_V1.md` → Live check |
| 6 | Stop the project at this milestone | **DONE** — XONG giai đoạn này; dừng ở mốc này (D-3) | — |

**No authorized work remains.** Any further change needs a new numbered order.

## Observations — not work authorization (to consider only if the project is reopened)
- **OBS-01 (from PR #7 R2C7-02):** `scripts/brand-check.mjs:196`, `scripts/preview.mjs:332` and `scripts/write-atomic.mjs:71` use the same form of main-module guard (string compare of `import.meta.url` with `pathToFileURL(process.argv[1]).href`). As R2 showed for the two new scripts, that form does not run the script body when invoked through a symlink (ANALYTICAL_CLAIM for these three; not re-run). Not changed in PR #7 by Owner decision; any change needs a separate order.
- **O-1 (R2 round 2, marker does not prove build source):** a `PASS` proves the origin serves the CHỈNAM page without the platform script, not which commit it was built from; the build source must be matched separately (done for 2026-11-11 in `PROJECT_STATE_V1.md`). A marker substring outside the title tag would also pass. ANALYTICAL_CLAIM.
- **O-2 (R2 round 2, `--preserve-symlinks-main` with a file symlink outside `scripts/`):** the two scripts now fail with `ERR_MODULE_NOT_FOUND`, exit 1 — red and safe, but cannot check. The documented invocation works. SOURCE_EVIDENCE.
- **O-3 (R2 round 2, marker test pins source, not build output):** `check-live-marker.test.mjs` checks `src/routes/index.tsx`, not rendered HTML; a future change to how the title renders would make the live script fail falsely (safe direction).
- **O-4 (R2 rounds 1–2, extra arguments):** second and later arguments are silently ignored; the `PASS` line names only the first URL.
- **O-5 (R2 round 2, Deployment Protection):** a protected deployment that redirects to a sign-in page on another origin cannot be checked by the script (it fails). Observed on 2026-11-11: the deployment-specific URL answers `302` to `vercel.com/sso-api`; the script failed with `fetch failed`.
- **O-6 (R2 round 2, "bytes" count):** the number in the `PASS` line is the JS string length, not the UTF-8 byte count; it does not affect the check. ANALYTICAL_CLAIM.

## Owner decisions — recorded
- **D-1:** Vercel, built from `main`. **D-2:** live data in the browser. **D-3:** Stage 4 not opened. **Owner has decided CHỈNAM has no relationship with TRUNG TÂM TÀI CHÍNH.**
- **QĐ-16 (Chief Engineer, 2026-11-11):** documentation-only `.md` PRs of operational records are accepted by the Chief Engineer in place of R2; the Owner merges after the Chief Engineer reports them as passed.

**Forbidden by current queue:** writing Stage 4 specifications or code; implementer merging any PR; modifying platform files (`scripts/grok-pwa-*`, `server/`, `public/__grok/`); trading or connecting a broker to execute; changing repository settings; conflating application and other finance repository states.
