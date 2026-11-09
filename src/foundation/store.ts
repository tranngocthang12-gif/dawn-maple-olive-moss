import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { approvalFromMismatch, migrateBook } from "./schema.ts";
import { ensureHashes, hashJson, countIntegrity } from "./hash.ts";
import { durableStorage, storageSnapshot, reportLoadFailure, registerHashSink } from "./storage.ts";
import type {
  Amendment,
  BaseRate,
  Claim,
  CompanyFact,
  CompanyFile,
  CompanySeal,
  Decision,
  DecisionAction,
  KillCriterion,
  LedgerRow,
  Mandate,
  QualityId,
  QualityRow,
  Signoff,
  Signal,
  Thesis,
  ThesisTexts,
  WorldObs,
  TamperImportApproval,
} from "./types.ts";
import {
  caps,
  checksDefault,
  companyFileIssues,
  defaultScenarios,
  emptyQuality,
  emptyTexts,
  fullBook,
  insufficientTextCount,
  newId,
  recordUsable,
  sealFromCompany,
  signalAliveIssues,
  thesisBlockers,
} from "./logic.ts";

type Result = { ok: true } | { ok: false; reason: string };
type IdResult = { ok: true; id: string } | { ok: false; reason: string };

type DeskState = {
  theses: Thesis[];
  decisions: Decision[];
  ledger: LedgerRow[];
  signoff: Signoff;
  activeThesisId: string | null;
  ready: boolean;
  setReady: (v: boolean) => void;
  tamperImportApprovals: TamperImportApproval[];
  createThesis: () => IdResult;
  createSuccessor: (id: string) => IdResult;
  invalidateThesis: (id: string, reason: string) => Result;
  updateThesis: (id: string, patch: Partial<Thesis>) => void;
  patchText: (id: string, key: keyof ThesisTexts, value: string) => void;
  setActive: (id: string | null) => void;
  addClaim: (id: string) => void;
  updateClaim: (id: string, claimId: string, patch: Partial<Claim>) => void;
  removeClaim: (id: string, claimId: string) => void;
  addKill: (id: string) => void;
  updateKill: (id: string, killId: string, patch: Partial<KillCriterion>) => void;
  removeKill: (id: string, killId: string) => void;
  addLedger: (row: Omit<LedgerRow, "id" | "at">) => Result;
  addDecision: (input: {
    security: string;
    priceNote: string;
    action: DecisionAction;
    thesisId: string | null;
    expectedReturn: string;
    probabilityNote: string;
    risk: string;
    sizeNote: string;
    catalyst: string;
    invalidation: string;
    alternativeView: string;
    override: boolean;
    overrideReason: string;
  }) => Result;
  patchOutcome: (id: string, patch: Pick<Decision, "outcome" | "postMortemClass" | "postMortemNote">) => void;
  amend: (id: string, note: string) => void;
  voidDecision: (id: string, reason: string) => void;
  toggleSignoff: (key: string) => void;
  mandate: Mandate;
  world: WorldObs[];
  baseRates: BaseRate[];
  patchMandate: (patch: Partial<Mandate>) => void;
  lockMandate: () => Result;
  unlockMandate: (reason: string) => Result;
  addWorld: (row: Omit<WorldObs, "id" | "at">) => Result;
  addBaseRate: (row: Omit<BaseRate, "id" | "at">) => Result;
  companies: CompanyFile[];
  companySeals: CompanySeal[];
  signals: Signal[];
  createCompany: () => IdResult;
  patchCompany: (id: string, patch: Partial<Pick<CompanyFile, "name" | "venue" | "standard" | "standardNote" | "business" | "missingNote">>) => void;
  addCompanyFact: (id: string, row: Omit<CompanyFact, "id" | "at">) => Result;
  setQuality: (id: string, key: QualityId, patch: Partial<QualityRow>) => void;
  fileCompany: (id: string) => Result;
  createSignal: () => IdResult;
  patchSignal: (id: string, patch: Partial<Pick<Signal, "family" | "hypothesis" | "mechanism" | "lag" | "death" | "rights" | "rightsOk">>) => void;
  markSignalAlive: (id: string) => Result;
  killSignal: (id: string, reason: string) => Result;
  exportDesk: () => Promise<string>;
  importDesk: (raw: string, acceptTamper?: boolean) => Promise<Result>;
  verifyIntegrity: () => Promise<{ matched: number; mismatched: number; missing: number }>;
};

function touch(t: Thesis, patch: Partial<Thesis>): Thesis {
  return { ...t, ...patch, updatedAt: new Date().toISOString() };
}

function emptyMandate(): Mandate {
  return {
    locked: false,
    lockedAt: "",
    currency: "",
    horizon: "",
    universeInner: "",
    universeOuter: "",
    leverage: "none",
    leverageNote: "",
    taxNote: "",
    liquidityNote: "",
    amendments: [],
  };
}

type Persisted = Pick<
  DeskState,
  "theses" | "decisions" | "ledger" | "signoff" | "activeThesisId" | "mandate" | "world" | "baseRates" | "companies" | "companySeals" | "signals" | "tamperImportApprovals"
>;

type LegacyThesis = Omit<Partial<Thesis>, "status" | "checks"> & {
  status?: "draft" | "ready" | "invalidated";
  checks?: Thesis["checks"] & { independentSources?: number; baseRateCited?: boolean };
};

function normalizeThesis(raw: LegacyThesis): Thesis {
  const now = new Date().toISOString();
  const terminal = raw.status === "invalidated" ? { status: "invalidated" as const } : {};
  return {
    id: raw.id ?? newId(),
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? raw.createdAt ?? now,
    ...terminal,
    security: raw.security ?? "",
    venue: raw.venue ?? "",
    currency: raw.currency ?? "",
    horizon: raw.horizon ?? "",
    texts: { ...emptyTexts(), ...(raw.texts ?? {}) },
    claims: raw.claims ?? [],
    scenarios: raw.scenarios ?? defaultScenarios(),
    kills: raw.kills ?? [],
    checks: { ...checksDefault(), ...(raw.checks ?? {}) },
    ownerCapitalNote: raw.ownerCapitalNote ?? "",
    ring: raw.ring ?? "",
    baseRateId: raw.baseRateId ?? "",
    baseRateSearchNote: raw.baseRateSearchNote ?? "",
    worldIds: raw.worldIds ?? [],
    companyId: raw.companyId ?? "",
    priorSeenIds: raw.priorSeenIds ?? [],
    supersedes: raw.supersedes ?? "",
    amendments: raw.amendments ?? [],
  };
}

function normalizePersisted(p: Partial<Persisted>): Persisted {
  const theses = (p.theses ?? []).map((t) => normalizeThesis(t as LegacyThesis));
  let seals = (p.companySeals ?? []).map((s) => ({
    ...s,
    sealed: s.sealed !== false,
    ...(!s.sha256 ? { sha256Origin: s.sha256Origin ?? "legacy-backfill" as const } : {}),
    facts: s.facts ?? [],
    quality: { ...emptyQuality(), ...(s.quality ?? {}) },
  }));
  const companies = (p.companies ?? []).map((c) => {
    const file: CompanyFile = {
      ...c,
      facts: c.facts ?? [],
      missingNote: c.missingNote ?? "",
      status: c.status ?? "draft",
      sealId: c.sealId ?? "",
      quality: { ...emptyQuality(), ...(c.quality ?? {}) },
    };
    if (file.status === "filed" && !seals.some((s) => s.id === file.sealId && s.companyId === file.id)) {
      const seal = sealFromCompany(file, file.updatedAt || new Date().toISOString(), newId(), true);
      seals = [seal, ...seals];
      file.sealId = seal.id;
    }
    return file;
  });
  const decisions = (p.decisions ?? []).map((d) => {
    const history = d.outcomeLog ?? [{
      at: d.at, outcome: d.outcome, postMortemClass: d.postMortemClass,
      postMortemNote: d.postMortemNote, legacyNote: "chuyển từ bản cũ" as const,
    }];
    const latest = history[history.length - 1];
    return {
      ...d,
      ...(latest ? { outcome: latest.outcome, postMortemClass: latest.postMortemClass, postMortemNote: latest.postMortemNote } : {}),
      thesisSnapshot: d.thesisSnapshot ? normalizeThesis(d.thesisSnapshot as LegacyThesis) : null,
      companySeal: d.companySeal
        ? { ...d.companySeal, ...(!d.companySeal.sha256 ? { sha256Origin: d.companySeal.sha256Origin ?? "legacy-backfill" as const } : {}) }
        : null,
      ...(!d.snapshotSha256 ? { snapshotHashOrigin: d.snapshotHashOrigin ?? "legacy-backfill" as const } : {}),
      worldSnapshot: d.worldSnapshot ?? [],
      baseRateSnapshot: d.baseRateSnapshot ?? null,
      amendments: d.amendments ?? [],
      outcomeLog: history,
    };
  });
  return {
    theses,
    decisions,
    ledger: p.ledger ?? [],
    signoff: p.signoff ?? {},
    activeThesisId: p.activeThesisId ?? null,
    mandate: { ...emptyMandate(), ...(p.mandate ?? {}) },
    world: p.world ?? [],
    baseRates: p.baseRates ?? [],
    companies,
    companySeals: seals,
    signals: p.signals ?? [],
    tamperImportApprovals: p.tamperImportApprovals ?? [],
  };
}

function tooBig(p: Persisted): string | null {
  if (p.theses.length > caps.theses) return "Tệp có quá nhiều hồ sơ luận điểm.";
  if (p.decisions.length > caps.decisions) return "Tệp có quá nhiều quyết định.";
  if (p.ledger.length > caps.ledger) return "Tệp có quá nhiều dòng xác suất.";
  if (p.world.length > caps.world) return "Tệp có quá nhiều quan sát thế giới.";
  if (p.baseRates.length > caps.baseRates) return "Tệp có quá nhiều tỷ lệ quá khứ.";
  if (p.companies.length > caps.companies) return "Tệp có quá nhiều hồ sơ doanh nghiệp.";
  if (p.companySeals.length > caps.seals) return "Tệp có quá nhiều bản hồ sơ đã đóng.";
  if (p.signals.length > caps.signals) return "Tệp có quá nhiều tín hiệu.";
  if (p.companies.some((c) => c.facts.length > caps.facts)) return "Một hồ sơ doanh nghiệp trong tệp có quá nhiều sự kiện.";
  return null;
}

function freshThesis(supersedes = ""): Thesis {
  const id = newId();
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    security: "",
    venue: "",
    currency: "",
    horizon: "",
    texts: emptyTexts(),
    claims: [],
    scenarios: defaultScenarios(),
    kills: [
      { id: newId(), text: "", threshold: "" },
      { id: newId(), text: "", threshold: "" },
      { id: newId(), text: "", threshold: "" },
    ],
    checks: checksDefault(),
    ownerCapitalNote: "",
    ring: "",
    baseRateId: "",
    baseRateSearchNote: "",
    worldIds: [],
    companyId: "",
    priorSeenIds: [],
    supersedes,
    amendments: [],
  };
}

function editablePatch(patch: Partial<Thesis>): Partial<Thesis> {
  const {
    status: _status,
    amendments: _amendments,
    supersedes: _supersedes,
    id: _id,
    createdAt: _createdAt,
    ...allowed
  } = patch;
  return allowed;
}

export const useDesk = create<DeskState>()(
  persist<DeskState, [], [], Persisted>(
    (set, get) => {
      const commit = (partial: Partial<DeskState> | ((state: DeskState) => Partial<DeskState>)) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return;
        set(partial);
      };
      return ({
      theses: [],
      decisions: [],
      ledger: [],
      signoff: {},
      activeThesisId: null,
      mandate: emptyMandate(),
      world: [],
      baseRates: [],
      companies: [],
      companySeals: [],
      signals: [],
      tamperImportApprovals: [],
      ready: false,
      setReady: (v) => set({ ready: v }),
      createThesis: () => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (get().theses.length >= caps.theses) return { ok: false, reason: fullBook };
        const thesis = freshThesis();
        commit((s) => ({ theses: [thesis, ...s.theses], activeThesisId: thesis.id }));
        return { ok: true, id: thesis.id };
      },
      createSuccessor: (id) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const prior = get().theses.find((t) => t.id === id);
        if (!prior) return { ok: false, reason: "Không thấy thesis gốc." };
        if (prior.status !== "invalidated") return { ok: false, reason: "Chỉ thesis đã hủy mới được tạo thesis kế tiếp." };
        if (get().theses.length >= caps.theses) return { ok: false, reason: fullBook };
        const next = freshThesis(prior.id);
        commit((s) => ({ theses: [next, ...s.theses], activeThesisId: next.id }));
        return { ok: true, id: next.id };
      },
      invalidateThesis: (id, reason) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const thesis = get().theses.find((t) => t.id === id);
        if (!thesis) return { ok: false, reason: "Không thấy thesis." };
        if (thesis.status === "invalidated") return { ok: false, reason: "Thesis này đã hủy và chỉ đọc." };
        const trimmed = reason.trim();
        if (trimmed.length < 12) return { ok: false, reason: "Hủy thesis cần lý do tối thiểu 12 ký tự." };
        const at = new Date().toISOString();
        const amendment: Amendment = { id: newId(), at, note: `Hủy thesis: ${trimmed}` };
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id
              ? { ...t, status: "invalidated", updatedAt: at, amendments: [...(t.amendments ?? []), amendment] }
              : t,
          ),
        }));
        return { ok: true };
      },
      updateThesis: (id, patch) =>
        commit((s) => ({
          theses: s.theses.map((t) => (t.id === id && t.status !== "invalidated" ? touch(t, editablePatch(patch)) : t)),
        })),
      patchText: (id, key, value) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated" ? touch(t, { texts: { ...t.texts, [key]: value } }) : t,
          ),
        })),
      setActive: (id) => commit({ activeThesisId: id }),
      addClaim: (id) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated"
              ? touch(t, {
                  claims: [
                    ...t.claims,
                    { id: newId(), text: "", klass: "unverified", source: "", tier: "none", asOf: "", unit: "", permitted: false },
                  ],
                })
              : t,
          ),
        })),
      updateClaim: (id, claimId, patch) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated"
              ? touch(t, { claims: t.claims.map((c) => (c.id === claimId ? { ...c, ...patch } : c)) })
              : t,
          ),
        })),
      removeClaim: (id, claimId) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated" ? touch(t, { claims: t.claims.filter((c) => c.id !== claimId) }) : t,
          ),
        })),
      addKill: (id) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated"
              ? touch(t, { kills: [...t.kills, { id: newId(), text: "", threshold: "" }] })
              : t,
          ),
        })),
      updateKill: (id, killId, patch) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated"
              ? touch(t, { kills: t.kills.map((k) => (k.id === killId ? { ...k, ...patch } : k)) })
              : t,
          ),
        })),
      removeKill: (id, killId) =>
        commit((s) => ({
          theses: s.theses.map((t) =>
            t.id === id && t.status !== "invalidated" && t.kills.length > 3
              ? touch(t, { kills: t.kills.filter((k) => k.id !== killId) })
              : t,
          ),
        })),
      addLedger: (row) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (get().ledger.length >= caps.ledger) return { ok: false, reason: fullBook };
        commit((s) => ({ ledger: [{ ...row, id: newId(), at: new Date().toISOString() }, ...s.ledger] }));
        return { ok: true };
      },
      addDecision: (input) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (input.override && input.overrideReason.trim().length < 12) {
          return { ok: false, reason: "Ghi đè cần lý do tối thiểu 12 ký tự, kể cả khi thesis đã hủy." };
        }
        const thesis = input.thesisId ? get().theses.find((t) => t.id === input.thesisId) ?? null : null;
        if (input.action === "paper" || input.action === "hold" || input.action === "kill") {
          if (!thesis) return { ok: false, reason: "Hành động này cần một thesis." };
          if (input.action === "hold" && insufficientTextCount(thesis) > 0) {
            return { ok: false, reason: "Thesis có dấu CHƯA ĐỦ không được ghi hành động giữ, kể cả khi ghi đè." };
          }
          if (thesis.status === "invalidated") {
            if (input.action !== "kill") return { ok: false, reason: "Thesis đã hủy không được ghi paper hoặc hold." };
          } else {
            const blockers = thesisBlockers(thesis, {
              mandate: get().mandate,
              world: get().world,
              baseRates: get().baseRates,
              companies: get().companies,
              decisions: get().decisions,
            });
            if (blockers.length > 0 && !input.override) {
              return { ok: false, reason: `Thesis chưa sẵn sàng: ${blockers[0]}` };
            }
          }
        }
        if (get().decisions.length >= caps.decisions) return { ok: false, reason: fullBook };
        const company = thesis?.companyId ? get().companies.find((c) => c.id === thesis.companyId) ?? null : null;
        const companySeal = company
          ? company.status === "filed"
            ? structuredClone(
                get().companySeals.find((s) => s.id === company.sealId && s.companyId === company.id) ??
                  sealFromCompany(company, company.updatedAt, newId(), true),
              )
            : sealFromCompany(company, new Date().toISOString(), newId(), false)
          : null;
        const worldSnapshot = thesis
          ? get().world.filter((w) => (thesis.worldIds ?? []).includes(w.id)).map((w) => structuredClone(w))
          : [];
        const baseRateSnapshot = thesis?.baseRateId
          ? structuredClone(get().baseRates.find((r) => r.id === thesis.baseRateId) ?? null)
          : null;
        const decision: Decision = {
          id: newId(),
          at: new Date().toISOString(),
          security: input.security.trim(),
          priceNote: input.priceNote,
          action: input.action,
          thesisId: thesis?.id ?? null,
          thesisSnapshot: thesis ? structuredClone(thesis) : null,
          companySeal,
          worldSnapshot,
          baseRateSnapshot,
          expectedReturn: input.expectedReturn,
          probabilityNote: input.probabilityNote,
          risk: input.risk,
          sizeNote: input.sizeNote,
          catalyst: input.catalyst,
          invalidation: input.invalidation,
          alternativeView: input.alternativeView,
          outcome: "pending",
          postMortemClass: "",
          postMortemNote: "",
          outcomeLog: [{ at: new Date().toISOString(), outcome: "pending", postMortemClass: "", postMortemNote: "" }],
          snapshotHashOrigin: "created",
          override: input.override,
          overrideReason: input.overrideReason,
          voided: false,
          voidReason: "",
          amendments: [],
        };
        commit((s) => ({ decisions: [decision, ...s.decisions] }));
        return { ok: true };
      },
      patchOutcome: (id, patch) =>
        commit((s) => ({ decisions: s.decisions.map((d) => {
          if (d.id !== id) return d;
          const at = new Date().toISOString();
          const log = { at, ...patch };
          return { ...d, ...patch, outcomeLog: [...(d.outcomeLog ?? []), log] };
        }) })),
      amend: (id, note) => {
        const trimmed = note.trim();
        if (trimmed.length < 8) return;
        const amendment: Amendment = { id: newId(), at: new Date().toISOString(), note: trimmed };
        commit((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, amendments: [...d.amendments, amendment] } : d)),
        }));
      },
      voidDecision: (id, reason) => {
        if (reason.trim().length < 12) return;
        commit((s) => ({ decisions: s.decisions.map((d) => (d.id === id ? { ...d, voided: true, voidReason: reason.trim() } : d)) }));
      },
      toggleSignoff: (key) => commit((s) => ({ signoff: { ...s.signoff, [key]: !s.signoff[key] } })),
      patchMandate: (patch) =>
        commit((s) => {
          if (s.mandate.locked) return s;
          return { mandate: { ...s.mandate, ...patch, locked: false, amendments: s.mandate.amendments } };
        }),
      lockMandate: () => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const m = get().mandate;
        if (m.locked) return { ok: false, reason: "Ủy thác đã khóa." };
        if (m.currency.trim().length < 2 || m.horizon.trim().length < 2) return { ok: false, reason: "Cần tiền tệ tiêu dùng và chân trời." };
        if (m.universeInner.trim().length < 12) return { ok: false, reason: "Vành trong cần một mô tả cụ thể, không phải một chữ." };
        if (m.leverage === "capped" && m.leverageNote.trim().length < 8) return { ok: false, reason: "Đòn bẩy có trần thì phải ghi trần đó." };
        commit((s) => ({ mandate: { ...s.mandate, locked: true, lockedAt: new Date().toISOString() } }));
        return { ok: true };
      },
      unlockMandate: (reason) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (reason.trim().length < 12) return { ok: false, reason: "Mở khóa cần lý do. Đây là ghi đè." };
        const note: Amendment = { id: newId(), at: new Date().toISOString(), note: `Mở khóa: ${reason.trim()}` };
        commit((s) => ({ mandate: { ...s.mandate, locked: false, amendments: [...s.mandate.amendments, note] } }));
        return { ok: true };
      },
      addWorld: (row) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (row.name.trim().length < 2 || row.geography.trim().length < 2) return { ok: false, reason: "Cần tên chỉ tiêu và địa lý." };
        if (![row.level, row.delta, row.acceleration].some((x) => x.trim())) return { ok: false, reason: "Cần ít nhất một trong ba: mức, tốc độ đổi, gia tốc." };
        if (!recordUsable(row)) return { ok: false, reason: "Quan sát thế giới chỉ vào sổ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        if (get().world.length >= caps.world) return { ok: false, reason: fullBook };
        const obs: WorldObs = { ...row, id: newId(), at: new Date().toISOString() };
        commit((s) => ({ world: [obs, ...s.world] }));
        return { ok: true };
      },
      addBaseRate: (row) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (row.name.trim().length < 2 || row.event.trim().length < 12 || row.rateNote.trim().length < 2) return { ok: false, reason: "Cần tên, định nghĩa sự kiện, và con số kèm mẫu." };
        if (row.caveat.trim().length < 12) return { ok: false, reason: "Base rate phải ghi giới hạn: nơi, thời, và cái nó không nói." };
        if (!recordUsable(row)) return { ok: false, reason: "Base rate cần nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        if (get().baseRates.length >= caps.baseRates) return { ok: false, reason: fullBook };
        const rate: BaseRate = { ...row, id: newId(), at: new Date().toISOString() };
        commit((s) => ({ baseRates: [rate, ...s.baseRates] }));
        return { ok: true };
      },
      createCompany: () => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (get().companies.length >= caps.companies) return { ok: false, reason: fullBook };
        const id = newId();
        const now = new Date().toISOString();
        const file: CompanyFile = {
          id,
          createdAt: now,
          updatedAt: now,
          status: "draft",
          name: "",
          venue: "",
          standard: "",
          standardNote: "",
          business: "",
          missingNote: "",
          facts: [],
          quality: emptyQuality(),
          sealId: "",
        };
        commit((s) => ({ companies: [file, ...s.companies] }));
        return { ok: true, id };
      },
      patchCompany: (id, patch) => commit((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch, status: "draft", updatedAt: new Date().toISOString() } : c)) })),
      addCompanyFact: (id, row) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (row.text.trim().length < 2) return { ok: false, reason: "Sự kiện trống." };
        if (!recordUsable(row)) return { ok: false, reason: "Sự kiện doanh nghiệp chỉ vào hồ sơ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        const file = get().companies.find((c) => c.id === id);
        if (!file) return { ok: false, reason: "Không thấy hồ sơ doanh nghiệp." };
        if (file.facts.length >= caps.facts) return { ok: false, reason: fullBook };
        const fact: CompanyFact = { ...row, id: newId(), at: new Date().toISOString() };
        commit((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, facts: [fact, ...c.facts], status: "draft", updatedAt: fact.at } : c)) }));
        return { ok: true };
      },
      setQuality: (id, key, patch) => commit((s) => ({ companies: s.companies.map((c) => c.id === id ? { ...c, status: "draft", updatedAt: new Date().toISOString(), quality: { ...c.quality, [key]: { ...c.quality[key], ...patch } } } : c) })),
      fileCompany: (id) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const file = get().companies.find((c) => c.id === id);
        if (!file) return { ok: false, reason: "Không thấy hồ sơ doanh nghiệp." };
        const issues = companyFileIssues(file);
        if (issues.length) return { ok: false, reason: issues[0] };
        if (file.status === "filed") return { ok: false, reason: "Bản này đã đóng. Gõ sửa nếu bạn muốn viết bản nháp mới, rồi nộp lại." };
        if (get().companySeals.length >= caps.seals) return { ok: false, reason: fullBook };
        const filedAt = new Date().toISOString();
        const seal = { ...sealFromCompany({ ...file, updatedAt: filedAt }, filedAt, newId(), true), sha256Origin: "created" as const };
        commit((s) => ({ companySeals: [seal, ...s.companySeals], companies: s.companies.map((c) => (c.id === id ? { ...c, status: "filed", sealId: seal.id, updatedAt: filedAt } : c)) }));
        return { ok: true };
      },
      createSignal: () => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        if (get().signals.length >= caps.signals) return { ok: false, reason: fullBook };
        const id = newId();
        const now = new Date().toISOString();
        const row: Signal = { id, at: now, updatedAt: now, family: "", hypothesis: "", mechanism: "", lag: "", death: "", rights: "", rightsOk: false, status: "draft", diedAt: "", deathReason: "" };
        commit((s) => ({ signals: [row, ...s.signals] }));
        return { ok: true, id };
      },
      patchSignal: (id, patch) => commit((s) => ({ signals: s.signals.map((row) => row.id === id && row.status === "draft" ? { ...row, ...patch, updatedAt: new Date().toISOString() } : row) })),
      markSignalAlive: (id) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const row = get().signals.find((s) => s.id === id);
        if (!row) return { ok: false, reason: "Không thấy tín hiệu." };
        if (row.status === "dead") return { ok: false, reason: "Tín hiệu đã chết không được hồi sinh. Mở một dòng mới." };
        if (row.status === "alive") return { ok: false, reason: "Tín hiệu này đang sống." };
        const issues = signalAliveIssues(row);
        if (issues.length) return { ok: false, reason: issues[0] };
        commit((s) => ({ signals: s.signals.map((item) => (item.id === id ? { ...item, status: "alive", updatedAt: new Date().toISOString() } : item)) }));
        return { ok: true };
      },
      killSignal: (id, reason) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể ghi." };
        const row = get().signals.find((s) => s.id === id);
        if (!row) return { ok: false, reason: "Không thấy tín hiệu." };
        if (row.status === "dead") return { ok: false, reason: "Tín hiệu này đã chết." };
        if (reason.trim().length < 12) return { ok: false, reason: "Khai tử cần lý do. Giữ vì đã tốn công không phải lý do." };
        const at = new Date().toISOString();
        commit((s) => ({ signals: s.signals.map((item) => item.id === id ? { ...item, status: "dead", diedAt: at, deathReason: reason.trim(), updatedAt: at } : item) }));
        return { ok: true };
      },
      verifyIntegrity: async () => {
        try { return await countIntegrity(get().companySeals, get().decisions); }
        catch { return { matched: 0, mismatched: 0, missing: get().companySeals.length + get().decisions.length }; }
      },
      exportDesk: async () => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) throw new Error("Đang mở sổ; không thể xuất bản chưa nạp.");
        const state = normalizePersisted(get());
        const hashed = await ensureHashes(state, "legacy-backfill");
        const payload = { schemaVersion: 2 as const, ...hashed };
        const validated = migrateBook(payload);
        if (!validated.ok) throw new Error("Sổ không thể xuất: " + validated.field + " — " + validated.reason);
        const sha256 = await hashJson(validated.book);
        // Export is a pure snapshot: never write old state back after awaits.
        return JSON.stringify({ ...validated.book, sha256 }, null, 2);
      },
      importDesk: async (raw, acceptTamper = false) => {
        if (typeof window !== "undefined" && !storageSnapshot().ready) return { ok: false, reason: "Đang mở sổ; không thể nhập." };
        try {
          let parsed: unknown;
          try { parsed = JSON.parse(raw); }
          catch { return { ok: false, reason: "root: Tệp không phải JSON hợp lệ." }; }
          const result = migrateBook(parsed);
          if (!result.ok) return { ok: false, reason: result.field + ": " + result.reason };
          if (result.legacy && !acceptTamper) {
            return { ok: false, reason: "legacy-unverified: File bản cũ không có mã băm, không kiểm được có bị sửa hay không — cần Owner xác nhận riêng trước khi nhập." };
          }
          const problem = tooBig(result.book);
          if (problem) return { ok: false, reason: problem };
          const expected = result.book.sha256 ?? "";
          const actual = await hashJson(result.book as Record<string, unknown>);
          const hasMismatch = !!expected && expected !== actual;
          if (!result.legacy && !expected) {
            return { ok: false, reason: "sha256: File phiên bản 2 thiếu mã băm tổng." };
          }
          const integrity = await countIntegrity(result.book.companySeals, result.book.decisions);
          const mismatch = integrity.mismatched > 0;
          if (!result.legacy && integrity.missing > 0) {
            return { ok: false, reason: "sha256: File phiên bản 2 thiếu mã băm của bản niêm phong hoặc ảnh chụp." };
          }
          if ((hasMismatch || mismatch) && !acceptTamper) {
            return { ok: false, reason: "sha256: Mã băm không khớp. File có thể đã bị sửa. Chỉ Owner được xác nhận Vẫn nhập dù file đã bị sửa." };
          }
          const upgraded = result.legacy ? await ensureHashes(result.book, "legacy-backfill") : result.book;
          const approved = result.legacy
            ? [...upgraded.tamperImportApprovals, {
                at: new Date().toISOString(), note: "bản cũ chưa kiểm — Owner xác nhận nhập",
                expectedHash: "", observedHash: "",
              }]
            : hasMismatch || mismatch
              ? [...upgraded.tamperImportApprovals, approvalFromMismatch(expected, actual)]
              : upgraded.tamperImportApprovals;
          // Commit only after JSON parse, shape preflight, migration, full Zod,
          // top-level hash and nested integrity checks have succeeded.
          commit(normalizePersisted({ ...upgraded, tamperImportApprovals: approved }));
          return { ok: true };
        } catch (error) {
          return { ok: false, reason: "Không thể nhập sổ: " + (error instanceof Error ? error.message : String(error)) };
        }
      },
      });
    },
    {
      name: "chinam-foundation-v2",
      storage: createJSONStorage(() => durableStorage),
      skipHydration: true,
      partialize: (s): Persisted => ({
        theses: s.theses,
        decisions: s.decisions,
        ledger: s.ledger,
        signoff: s.signoff,
        activeThesisId: s.activeThesisId,
        mandate: s.mandate,
        world: s.world,
        baseRates: s.baseRates,
        companies: s.companies,
        companySeals: s.companySeals,
        signals: s.signals,
        tamperImportApprovals: s.tamperImportApprovals,
      }),
      merge: (persisted, current) => ({ ...current, ...normalizePersisted((persisted ?? {}) as Partial<Persisted>) }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) reportLoadFailure(error);
      },
    },
  ),
);
/** Synchronize newly generated Web Crypto hashes into memory after verified disk writes.
 * Never repair an existing hash, including a mismatched one.
 */
registerHashSink((book) => {
  if (!storageSnapshot().ready) return;
  const current = useDesk.getState();
  const sealsById = new Map(book.companySeals.map((seal) => [seal.id, seal]));
  const decisionsById = new Map(book.decisions.map((d) => [d.id, d]));
  let changed = false;
  const companySeals = current.companySeals.map((seal) => {
    const persisted = sealsById.get(seal.id);
    if (seal.sha256 || !persisted?.sha256) return seal;
    changed = true;
    return { ...seal, sha256: persisted.sha256, sha256Origin: persisted.sha256Origin };
  });
  const decisions = current.decisions.map((decision) => {
    const persisted = decisionsById.get(decision.id);
    if (!persisted) return decision;
    let companySeal = decision.companySeal;
    if (companySeal && !companySeal.sha256 && persisted.companySeal?.sha256) {
      companySeal = { ...companySeal, sha256: persisted.companySeal.sha256,
        sha256Origin: persisted.companySeal.sha256Origin };
      changed = true;
    }
    if (!decision.snapshotSha256 && persisted.snapshotSha256) {
      changed = true;
      return { ...decision, companySeal, snapshotSha256: persisted.snapshotSha256,
        snapshotHashOrigin: persisted.snapshotHashOrigin };
    }
    return companySeal === decision.companySeal ? decision : { ...decision, companySeal };
  });
  if (changed) useDesk.setState({ decisions, companySeals });
});
