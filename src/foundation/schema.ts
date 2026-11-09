import { z } from "zod";
import type { TamperImportApproval } from "./types.ts";

const t = z.string();
const b = z.boolean();
const n = z.number().finite();
const num = n.nullable();
const tier = z.enum(["t1", "t2", "t3", "t4", "t5", "none"]);
const klass = z.enum(["fact", "data", "inference", "hypothesis", "forecast", "unverified", "insufficient"]);
const action = z.enum(["observe", "pass", "paper", "hold", "kill"]);
const outcome = z.enum(["", "pending", "process-good-outcome-good", "process-good-outcome-bad", "process-bad-outcome-good", "process-bad-outcome-bad"]);
const mortality = z.enum(["", "bad-data", "bad-model", "bad-assumptions", "bad-execution", "bad-sizing", "bad-luck", "mixed"]);
const hash = t.regex(/^[0-9a-f]{64}$/u);
const origin = z.enum(["created", "legacy-backfill"]);
const amendment = z.strictObject({ id: t, at: t, note: t });
const claim = z.strictObject({ id: t, text: t, klass, source: t, tier, asOf: t, unit: t, permitted: b });
const scenario = z.strictObject({ name: z.enum(["bull", "base", "bear", "tail"]), probability: num, returnPct: num,
  narrative: t, catalyst: t, revenue: t, margin: t, multiple: t, fairValue: t, risk: t });
const kill = z.strictObject({ id: t, text: t, threshold: t });
const textNames = ["business", "industry", "position", "management", "financialQuality", "balanceSheet",
  "cashFlow", "capitalAllocation", "growth", "risks", "macro", "graph", "suppliers", "customers",
  "weakSignals", "marketBelieves", "difference", "valuation", "portfolioImpact", "bear", "contrary",
  "missing", "invalidation"] as const;
const textShape = Object.fromEntries(textNames.map((key) => [key, t])) as Record<(typeof textNames)[number], typeof t>;
const texts = z.strictObject(textShape);
const checks = z.strictObject({ contraryConsidered: b, notBecauseProse: b,
  independentSources: n.optional(), baseRateCited: b.optional() });
const thesis = z.strictObject({
  id: t, createdAt: t, updatedAt: t, status: z.literal("invalidated").optional(),
  security: t, venue: t, currency: t, horizon: t, texts, claims: z.array(claim),
  scenarios: z.array(scenario), kills: z.array(kill), checks, ownerCapitalNote: t,
  ring: z.enum(["", "inner", "outer"]), baseRateId: t, baseRateSearchNote: t,
  worldIds: z.array(t), companyId: t, priorSeenIds: z.array(t), supersedes: t,
  amendments: z.array(amendment),
});
const world = z.strictObject({ id: t, at: t, domain: t, name: t, geography: t, level: t,
  delta: t, acceleration: t, unit: t, source: t, tier, asOf: t, permitted: b, supersedes: t });
const baseRate = z.strictObject({ id: t, at: t, name: t, event: t, rateNote: t,
  geography: t, period: t, source: t, tier, asOf: t, permitted: b, caveat: t, supersedes: t });
const qualityRow = z.strictObject({ state: z.enum(["open", "clear", "question", "flag"]), note: t, source: t });
const qualityNames = ["receivables", "inventory", "accruals", "capitalization", "related", "dilution", "offbalance", "auditor", "cfo"] as const;
const qualityShape = Object.fromEntries(qualityNames.map((key) => [key, qualityRow])) as Record<(typeof qualityNames)[number], typeof qualityRow>;
const quality = z.strictObject(qualityShape);
const fact = z.strictObject({ id: t, at: t, text: t, source: t, tier, asOf: t, unit: t, permitted: b });
const company = z.strictObject({ id: t, createdAt: t, updatedAt: t, status: z.enum(["draft", "filed"]),
  name: t, venue: t, standard: z.enum(["", "VAS", "IFRS", "US-GAAP", "other"]),
  standardNote: t, business: t, missingNote: t, facts: z.array(fact), quality, sealId: t });
const seal = z.strictObject({ id: t, companyId: t, filedAt: t, sealed: b, name: t, venue: t,
  standard: z.enum(["", "VAS", "IFRS", "US-GAAP", "other"]),
  standardNote: t, business: t, missingNote: t, facts: z.array(fact), quality,
  sha256: hash.optional(), sha256Origin: origin.optional() });
const outcomeLog = z.strictObject({ at: t, outcome, postMortemClass: mortality, postMortemNote: t,
  legacyNote: z.literal("chuyển từ bản cũ").optional() });
const decision = z.strictObject({
  id: t, at: t, security: t, priceNote: t, action, thesisId: t.nullable(),
  thesisSnapshot: thesis.nullable(), companySeal: seal.nullable(), worldSnapshot: z.array(world),
  baseRateSnapshot: baseRate.nullable(), expectedReturn: t, probabilityNote: t, risk: t,
  sizeNote: t, catalyst: t, invalidation: t, alternativeView: t, outcome,
  postMortemClass: mortality, postMortemNote: t, outcomeLog: z.array(outcomeLog).min(1),
  snapshotSha256: hash.optional(), snapshotHashOrigin: origin.optional(),
  override: b, overrideReason: t, voided: b, voidReason: t, amendments: z.array(amendment),
});
const ledgerRow = z.strictObject({ id: t, at: t, statement: t, priorPct: n, lr: num, posteriorPct: num,
  evidenceNote: t, klass, corrects: t });
const mandate = z.strictObject({ locked: b, lockedAt: t, currency: t, horizon: t, universeInner: t,
  universeOuter: t, leverage: z.enum(["none", "capped"]), leverageNote: t,
  taxNote: t, liquidityNote: t, amendments: z.array(amendment) });
const signal = z.strictObject({ id: t, at: t, updatedAt: t, family: t, hypothesis: t, mechanism: t,
  lag: t, death: t, rights: t, rightsOk: b, status: z.enum(["draft", "alive", "dead"]),
  diedAt: t, deathReason: t });
const approval = z.strictObject({ at: t, note: t, expectedHash: t, observedHash: t, source: z.enum(["local", "imported"]).optional() });

export const bookSchema = z.strictObject({
  schemaVersion: z.literal(2),
  theses: z.array(thesis), decisions: z.array(decision), ledger: z.array(ledgerRow),
  signoff: z.record(t, b), activeThesisId: t.nullable(), mandate,
  world: z.array(world), baseRates: z.array(baseRate), companies: z.array(company),
  companySeals: z.array(seal), signals: z.array(signal),
  tamperImportApprovals: z.array(approval), sha256: hash.optional(),
}).superRefine((book, context) => {
  book.decisions.forEach((row, index) => {
    const newest = row.outcomeLog[row.outcomeLog.length - 1];
    if (newest && (row.outcome !== newest.outcome ||
        row.postMortemClass !== newest.postMortemClass ||
        row.postMortemNote !== newest.postMortemNote)) {
      context.addIssue({
        code: "custom",
        path: ["decisions", index, "outcomeLog"],
        message: "Kết quả hiện hành phải khớp với dòng hậu kiểm mới nhất.",
      });
    }
  });
});
export type BookV2 = z.infer<typeof bookSchema>;
type JsonObj = Record<string, unknown>;
function object(value: unknown): value is JsonObj {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
const arrays = ["theses", "decisions", "ledger", "world", "baseRates", "companies", "companySeals", "signals", "tamperImportApprovals"] as const;
const nestedArrays = new Set(["claims", "scenarios", "kills", "amendments", "facts", "worldSnapshot", "outcomeLog"]);
const nestedObjects = new Set(["texts", "checks", "quality", "thesisSnapshot", "companySeal", "baseRateSnapshot"]);
export function preflightBook(value: unknown): string | null {
  if (!object(value)) return "root";
  if (![...arrays, "mandate", "signoff"].some((key) => key in value)) return "root";
  for (const key of arrays) if (key in value && !Array.isArray(value[key])) return key;
  for (const key of ["mandate", "signoff"]) if (key in value && !object(value[key])) return key;
  const walk = (row: unknown, path: string): string | null => {
    if (!object(row)) return path;
    for (const [key, v] of Object.entries(row)) {
      const p = path + "." + key;
      if (nestedArrays.has(key)) {
        if (!Array.isArray(v)) return p;
        for (let i = 0; i < v.length; i++) {
          const bad = walk(v[i], p + "[" + i + "]");
          if (bad) return bad;
        }
      } else if (nestedObjects.has(key) && v !== null) {
        const bad = walk(v, p);
        if (bad) return bad;
      }
    }
    return null;
  };
  for (const key of arrays) {
    const rows = value[key] as unknown[] | undefined;
    if (!rows) continue;
    for (let i = 0; i < rows.length; i++) {
      const bad = walk(rows[i], key + "[" + i + "]");
      if (bad) return bad;
    }
  }
  return null;
}
export function issuePath(path: PropertyKey[]): string {
  let result = "";
  for (const item of path) {
    const str = String(item);
    result += typeof item === "number" || /^\d+$/u.test(str) ? "[" + str + "]" : (result ? "." : "") + str;
  }
  return result || "root";
}

const legacyThesis = thesis.omit({ status: true, baseRateSearchNote: true, supersedes: true, amendments: true })
  .extend({ status: z.enum(["draft", "ready", "invalidated"]).optional(),
    baseRateSearchNote: t.optional(), supersedes: t.optional(),
    amendments: z.array(amendment).optional(), checks: checks.partial() });
const legacySeal = seal;
const legacyDecision = decision.omit({ outcomeLog: true, snapshotSha256: true, snapshotHashOrigin: true, thesisSnapshot: true })
  .extend({ thesisSnapshot: legacyThesis.nullable(), outcomeLog: z.array(outcomeLog).optional(),
    snapshotSha256: hash.optional(), snapshotHashOrigin: origin.optional() });
const legacyBook = z.strictObject({
  schemaVersion: z.literal(1).optional(),
  theses: z.array(legacyThesis).default([]), decisions: z.array(legacyDecision).default([]),
  ledger: z.array(ledgerRow).default([]), signoff: z.record(t, b).default({}),
  activeThesisId: t.nullable().default(null),
  mandate: mandate.default({ locked: false, lockedAt: "", currency: "", horizon: "",
    universeInner: "", universeOuter: "", leverage: "none", leverageNote: "", taxNote: "",
    liquidityNote: "", amendments: [] }),
  world: z.array(world).default([]), baseRates: z.array(baseRate).default([]),
  companies: z.array(company).default([]), companySeals: z.array(legacySeal).default([]),
  signals: z.array(signal).default([]), tamperImportApprovals: z.array(approval).default([]),
});
export function migrateBook(value: unknown): { ok: true; book: BookV2; legacy: boolean } | { ok: false; field: string; reason: string } {
  const pre = preflightBook(value);
  if (pre) return { ok: false, field: pre, reason: "Cấu trúc mảng/đối tượng không hợp lệ." };
  const raw = value as JsonObj;
  if (raw.schemaVersion !== undefined && raw.schemaVersion !== 1 && raw.schemaVersion !== 2) {
    return { ok: false, field: "schemaVersion", reason: "Phiên bản không hỗ trợ." };
  }
  if (raw.schemaVersion === 2) {
    const checked = bookSchema.safeParse(value);
    if (!checked.success) {
      const issue = checked.error.issues[0];
      return { ok: false, field: issuePath(issue.path), reason: issue.message };
    }
    return { ok: true, book: checked.data, legacy: false };
  }
  const parsed = legacyBook.safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, field: issuePath(issue.path), reason: issue.message };
  }
  const v1 = parsed.data;
  const upThesis = (row: z.infer<typeof legacyThesis>) => {
    const { status, ...rest } = row;
    return { ...rest, ...(status === "invalidated" ? { status } : {}),
      baseRateSearchNote: row.baseRateSearchNote ?? "", supersedes: row.supersedes ?? "",
      amendments: row.amendments ?? [],
      checks: { contraryConsidered: false, notBecauseProse: false, ...row.checks } };
  };
  const migrated = { ...v1, schemaVersion: 2 as const,
    theses: v1.theses.map(upThesis),
    decisions: v1.decisions.map((row) => ({ ...row,
      thesisSnapshot: row.thesisSnapshot ? upThesis(row.thesisSnapshot) : null,
      outcomeLog: row.outcomeLog ?? [{
        at: row.at, outcome: row.outcome, postMortemClass: row.postMortemClass,
        postMortemNote: row.postMortemNote, legacyNote: "chuyển từ bản cũ" as const,
      }] })),
  };
  const checked = bookSchema.safeParse(migrated);
  if (!checked.success) {
    const issue = checked.error.issues[0];
    return { ok: false, field: issuePath(issue.path), reason: issue.message };
  }
  return { ok: true, book: checked.data, legacy: true };
}
export function approvalFromMismatch(expectedHash: string, observedHash: string): TamperImportApproval {
  return { at: new Date().toISOString(), note: "Vẫn nhập dù file đã bị sửa", expectedHash, observedHash };
}
