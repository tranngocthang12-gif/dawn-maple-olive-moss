import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Amendment, BaseRate, Claim, CompanyFact, CompanyFile, CompanySeal, Decision, DecisionAction, KillCriterion, LedgerRow, Mandate, QualityId, QualityRow, Signoff, Signal, Thesis, ThesisTexts, WorldObs } from "./types";
import { caps, checksDefault, companyFileIssues, defaultScenarios, emptyQuality, emptyTexts, fullBook, newId, recordUsable, sealFromCompany, signalAliveIssues, thesisBlockers } from "./logic";

type DeskState = {
  theses: Thesis[];
  decisions: Decision[];
  ledger: LedgerRow[];
  signoff: Signoff;
  activeThesisId: string | null;
  ready: boolean;
  setReady: (v: boolean) => void;
  createThesis: () => { ok: true; id: string } | { ok: false; reason: string };
  updateThesis: (id: string, patch: Partial<Thesis>) => void;
  patchText: (id: string, key: keyof ThesisTexts, value: string) => void;
  setActive: (id: string | null) => void;
  addClaim: (id: string) => void;
  updateClaim: (id: string, claimId: string, patch: Partial<Claim>) => void;
  removeClaim: (id: string, claimId: string) => void;
  addKill: (id: string) => void;
  updateKill: (id: string, killId: string, patch: Partial<KillCriterion>) => void;
  removeKill: (id: string, killId: string) => void;
  refreshStatus: (id: string) => void;
  addLedger: (row: Omit<LedgerRow, "id" | "at">) => { ok: true } | { ok: false; reason: string };
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
  }) => { ok: true } | { ok: false; reason: string };
  patchOutcome: (id: string, patch: Pick<Decision, "outcome" | "postMortemClass" | "postMortemNote">) => void;
  amend: (id: string, note: string) => void;
  voidDecision: (id: string, reason: string) => void;
  toggleSignoff: (key: string) => void;
  mandate: Mandate;
  world: WorldObs[];
  baseRates: BaseRate[];
  patchMandate: (patch: Partial<Mandate>) => void;
  lockMandate: () => { ok: true } | { ok: false; reason: string };
  unlockMandate: (reason: string) => { ok: true } | { ok: false; reason: string };
  addWorld: (row: Omit<WorldObs, "id" | "at">) => { ok: true } | { ok: false; reason: string };
  addBaseRate: (row: Omit<BaseRate, "id" | "at">) => { ok: true } | { ok: false; reason: string };
  companies: CompanyFile[];
  companySeals: CompanySeal[];
  signals: Signal[];
  createCompany: () => { ok: true; id: string } | { ok: false; reason: string };
  patchCompany: (id: string, patch: Partial<Pick<CompanyFile, "name" | "venue" | "standard" | "standardNote" | "business" | "missingNote">>) => void;
  addCompanyFact: (id: string, row: Omit<CompanyFact, "id" | "at">) => { ok: true } | { ok: false; reason: string };
  setQuality: (id: string, key: QualityId, patch: Partial<QualityRow>) => void;
  fileCompany: (id: string) => { ok: true } | { ok: false; reason: string };
  createSignal: () => { ok: true; id: string } | { ok: false; reason: string };
  patchSignal: (id: string, patch: Partial<Pick<Signal, "family" | "hypothesis" | "mechanism" | "lag" | "death" | "rights" | "rightsOk">>) => void;
  markSignalAlive: (id: string) => { ok: true } | { ok: false; reason: string };
  killSignal: (id: string, reason: string) => { ok: true } | { ok: false; reason: string };
  exportDesk: () => string;
  importDesk: (raw: string) => { ok: true } | { ok: false; reason: string };
};

function touch(t: Thesis, patch: Partial<Thesis>): Thesis {
  return { ...t, ...patch, updatedAt: new Date().toISOString() };
}

const memoryStorage = {
  getItem: () => null as string | null,
  setItem: () => {},
  removeItem: () => {},
};

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
  "theses" | "decisions" | "ledger" | "signoff" | "activeThesisId" | "mandate" | "world" | "baseRates" | "companies" | "companySeals" | "signals"
>;

function normalizePersisted(p: Partial<Persisted>): Persisted {
  const theses = (p.theses ?? []).map((t) => ({
    ...t,
    ring: t.ring ?? "",
    baseRateId: t.baseRateId ?? "",
    worldIds: t.worldIds ?? [],
    companyId: t.companyId ?? "",
    priorSeenIds: t.priorSeenIds ?? [],
  }));
  let seals = (p.companySeals ?? []).map((s) => ({ ...s, sealed: s.sealed !== false, facts: s.facts ?? [], quality: { ...emptyQuality(), ...(s.quality ?? {}) } }));
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
  const decisions = (p.decisions ?? []).map((d) => ({
    ...d,
    companySeal: d.companySeal ?? null,
    worldSnapshot: d.worldSnapshot ?? [],
    baseRateSnapshot: d.baseRateSnapshot ?? null,
    amendments: d.amendments ?? [],
  }));
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

export const useDesk = create<DeskState>()(
  persist<DeskState, [], [], Persisted>(
    (set, get) => ({
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
      ready: false,
      setReady: (v) => set({ ready: v }),
      createThesis: () => {
        if (get().theses.length >= caps.theses) return { ok: false, reason: fullBook };
        const id = newId();
        const now = new Date().toISOString();
        const thesis: Thesis = {
          id,
          createdAt: now,
          updatedAt: now,
          status: "draft",
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
          worldIds: [],
          companyId: "",
          priorSeenIds: [],
        };
        set((s) => ({ theses: [thesis, ...s.theses], activeThesisId: id }));
        return { ok: true, id };
      },
      updateThesis: (id, patch) =>
        set((s) => ({
          theses: s.theses.map((t) => (t.id === id ? touch(t, patch) : t)),
        })),
      patchText: (id, key, value) =>
        set((s) => ({
          theses: s.theses.map((t) => (t.id === id ? touch(t, { texts: { ...t.texts, [key]: value } }) : t)),
        })),
      setActive: (id) => set({ activeThesisId: id }),
      addClaim: (id) =>
        set((s) => ({
          theses: s.theses.map((t) =>
            t.id === id
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
        set((s) => ({
          theses: s.theses.map((t) =>
            t.id === id ? touch(t, { claims: t.claims.map((c) => (c.id === claimId ? { ...c, ...patch } : c)) }) : t,
          ),
        })),
      removeClaim: (id, claimId) =>
        set((s) => ({
          theses: s.theses.map((t) => (t.id === id ? touch(t, { claims: t.claims.filter((c) => c.id !== claimId) }) : t)),
        })),
      addKill: (id) =>
        set((s) => ({
          theses: s.theses.map((t) => (t.id === id ? touch(t, { kills: [...t.kills, { id: newId(), text: "", threshold: "" }] }) : t)),
        })),
      updateKill: (id, killId, patch) =>
        set((s) => ({
          theses: s.theses.map((t) =>
            t.id === id ? touch(t, { kills: t.kills.map((k) => (k.id === killId ? { ...k, ...patch } : k)) }) : t,
          ),
        })),
      removeKill: (id, killId) =>
        set((s) => ({
          theses: s.theses.map((t) => (t.id === id && t.kills.length > 3 ? touch(t, { kills: t.kills.filter((k) => k.id !== killId) }) : t)),
        })),
      refreshStatus: (id) => {
        const t = get().theses.find((x) => x.id === id);
        if (!t || t.status === "invalidated") return;
        const next = thesisBlockers(t, {
          mandate: get().mandate,
          world: get().world,
          baseRates: get().baseRates,
          companies: get().companies,
          decisions: get().decisions,
        }).length === 0 ? "ready" : "draft";
        if (next !== t.status) get().updateThesis(id, { status: next });
      },
      addLedger: (row) => {
        if (get().ledger.length >= caps.ledger) return { ok: false, reason: fullBook };
        set((s) => ({
          ledger: [{ ...row, id: newId(), at: new Date().toISOString() }, ...s.ledger],
        }));
        return { ok: true };
      },
      addDecision: (input) => {
        const thesis = input.thesisId ? get().theses.find((t) => t.id === input.thesisId) ?? null : null;
        if (input.action === "paper" || input.action === "hold" || input.action === "kill") {
          if (!thesis) return { ok: false, reason: "Hành động này cần một thesis." };
          if (thesis.status !== "ready" && !input.override) {
            return { ok: false, reason: "Thesis chưa sẵn sàng. Muốn ghi nhật ký vẫn phải bật ghi đè và nêu lý do." };
          }
          if (input.override && input.overrideReason.trim().length < 12) {
            return { ok: false, reason: "Ghi đè cần lý do cụ thể. Không ghi đè im lặng." };
          }
        }
        if (get().decisions.length >= caps.decisions) return { ok: false, reason: fullBook };
        const company = thesis?.companyId ? (get().companies.find((c) => c.id === thesis.companyId) ?? null) : null;
        const companySeal = company
          ? company.status === "filed"
            ? structuredClone(
                get().companySeals.find((s) => s.id === company.sealId && s.companyId === company.id) ??
                  sealFromCompany(company, company.updatedAt, newId(), true),
              )
            : sealFromCompany(company, new Date().toISOString(), newId(), false)
          : null;
        const worldSnapshot = thesis ? get().world.filter((w) => (thesis.worldIds ?? []).includes(w.id)).map((w) => structuredClone(w)) : [];
        const baseRateSnapshot = thesis?.baseRateId ? structuredClone(get().baseRates.find((r) => r.id === thesis.baseRateId) ?? null) : null;
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
          override: input.override,
          overrideReason: input.overrideReason,
          voided: false,
          voidReason: "",
          amendments: [],
        };
        set((s) => ({ decisions: [decision, ...s.decisions] }));
        return { ok: true };
      },
      patchOutcome: (id, patch) =>
        set((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      amend: (id, note) => {
        const trimmed = note.trim();
        if (trimmed.length < 8) return;
        const amendment: Amendment = { id: newId(), at: new Date().toISOString(), note: trimmed };
        set((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, amendments: [...d.amendments, amendment] } : d)),
        }));
      },
      voidDecision: (id, reason) => {
        if (reason.trim().length < 12) return;
        set((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, voided: true, voidReason: reason.trim() } : d)),
        }));
      },
      toggleSignoff: (key) =>
        set((s) => ({ signoff: { ...s.signoff, [key]: !s.signoff[key] } })),
      patchMandate: (patch) =>
        set((s) => {
          if (s.mandate.locked) return s;
          return { mandate: { ...s.mandate, ...patch, locked: false, amendments: s.mandate.amendments } };
        }),
      lockMandate: () => {
        const m = get().mandate;
        if (m.locked) return { ok: false, reason: "Ủy thác đã khóa." };
        if (m.currency.trim().length < 2 || m.horizon.trim().length < 2) {
          return { ok: false, reason: "Cần tiền tệ tiêu dùng và chân trời." };
        }
        if (m.universeInner.trim().length < 12) return { ok: false, reason: "Vành trong cần một mô tả cụ thể, không phải một chữ." };
        if (m.leverage === "capped" && m.leverageNote.trim().length < 8) {
          return { ok: false, reason: "Đòn bẩy có trần thì phải ghi trần đó." };
        }
        set((s) => ({ mandate: { ...s.mandate, locked: true, lockedAt: new Date().toISOString() } }));
        return { ok: true };
      },
      unlockMandate: (reason) => {
        if (reason.trim().length < 12) return { ok: false, reason: "Mở khóa cần lý do. Đây là ghi đè." };
        const note: Amendment = { id: newId(), at: new Date().toISOString(), note: `Mở khóa: ${reason.trim()}` };
        set((s) => ({ mandate: { ...s.mandate, locked: false, amendments: [...s.mandate.amendments, note] } }));
        return { ok: true };
      },
      addWorld: (row) => {
        if (row.name.trim().length < 2 || row.geography.trim().length < 2) return { ok: false, reason: "Cần tên chỉ tiêu và địa lý." };
        if (![row.level, row.delta, row.acceleration].some((x) => x.trim())) {
          return { ok: false, reason: "Cần ít nhất một trong ba: mức, tốc độ đổi, gia tốc." };
        }
        if (!recordUsable(row)) return { ok: false, reason: "Quan sát thế giới chỉ vào sổ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        if (get().world.length >= caps.world) return { ok: false, reason: fullBook };
        const obs: WorldObs = { ...row, id: newId(), at: new Date().toISOString() };
        set((s) => ({ world: [obs, ...s.world] }));
        return { ok: true };
      },
      addBaseRate: (row) => {
        if (row.name.trim().length < 2 || row.event.trim().length < 12 || row.rateNote.trim().length < 2) {
          return { ok: false, reason: "Cần tên, định nghĩa sự kiện, và con số kèm mẫu." };
        }
        if (row.caveat.trim().length < 12) return { ok: false, reason: "Base rate phải ghi giới hạn: nơi, thời, và cái nó không nói." };
        if (!recordUsable(row)) return { ok: false, reason: "Base rate cần nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        if (get().baseRates.length >= caps.baseRates) return { ok: false, reason: fullBook };
        const rate: BaseRate = { ...row, id: newId(), at: new Date().toISOString() };
        set((s) => ({ baseRates: [rate, ...s.baseRates] }));
        return { ok: true };
      },
      createCompany: () => {
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
        set((s) => ({ companies: [file, ...s.companies] }));
        return { ok: true, id };
      },
      patchCompany: (id, patch) =>
        set((s) => ({
          companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch, status: "draft", updatedAt: new Date().toISOString() } : c)),
        })),
      addCompanyFact: (id, row) => {
        if (row.text.trim().length < 2) return { ok: false, reason: "Sự kiện trống." };
        if (!recordUsable(row)) {
          return { ok: false, reason: "Sự kiện doanh nghiệp chỉ vào hồ sơ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        }
        const file = get().companies.find((c) => c.id === id);
        if (!file) return { ok: false, reason: "Không thấy hồ sơ doanh nghiệp." };
        if (file.facts.length >= caps.facts) return { ok: false, reason: fullBook };
        const fact: CompanyFact = { ...row, id: newId(), at: new Date().toISOString() };
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === id ? { ...c, facts: [fact, ...c.facts], status: "draft", updatedAt: fact.at } : c,
          ),
        }));
        return { ok: true };
      },
      setQuality: (id, key, patch) =>
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "draft",
                  updatedAt: new Date().toISOString(),
                  quality: { ...c.quality, [key]: { ...c.quality[key], ...patch } },
                }
              : c,
          ),
        })),
      fileCompany: (id) => {
        const file = get().companies.find((c) => c.id === id);
        if (!file) return { ok: false, reason: "Không thấy hồ sơ doanh nghiệp." };
        const issues = companyFileIssues(file);
        if (issues.length) return { ok: false, reason: issues[0] };
        if (file.status === "filed") return { ok: false, reason: "Bản này đã đóng. Gõ sửa nếu bạn muốn viết bản nháp mới, rồi nộp lại." };
        if (get().companySeals.length >= caps.seals) return { ok: false, reason: fullBook };
        const filedAt = new Date().toISOString();
        const seal = sealFromCompany({ ...file, updatedAt: filedAt }, filedAt, newId(), true);
        set((s) => ({
          companySeals: [seal, ...s.companySeals],
          companies: s.companies.map((c) => (c.id === id ? { ...c, status: "filed", sealId: seal.id, updatedAt: filedAt } : c)),
        }));
        return { ok: true };
      },
      createSignal: () => {
        if (get().signals.length >= caps.signals) return { ok: false, reason: fullBook };
        const id = newId();
        const now = new Date().toISOString();
        const row: Signal = {
          id,
          at: now,
          updatedAt: now,
          family: "",
          hypothesis: "",
          mechanism: "",
          lag: "",
          death: "",
          rights: "",
          rightsOk: false,
          status: "draft",
          diedAt: "",
          deathReason: "",
        };
        set((s) => ({ signals: [row, ...s.signals] }));
        return { ok: true, id };
      },
      patchSignal: (id, patch) =>
        set((s) => ({
          signals: s.signals.map((row) => (row.id === id && row.status === "draft" ? { ...row, ...patch, updatedAt: new Date().toISOString() } : row)),
        })),
      markSignalAlive: (id) => {
        const row = get().signals.find((s) => s.id === id);
        if (!row) return { ok: false, reason: "Không thấy tín hiệu." };
        if (row.status === "dead") return { ok: false, reason: "Tín hiệu đã chết không được hồi sinh. Mở một dòng mới." };
        if (row.status === "alive") return { ok: false, reason: "Tín hiệu này đang sống." };
        const issues = signalAliveIssues(row);
        if (issues.length) return { ok: false, reason: issues[0] };
        set((s) => ({
          signals: s.signals.map((item) => (item.id === id ? { ...item, status: "alive", updatedAt: new Date().toISOString() } : item)),
        }));
        return { ok: true };
      },
      killSignal: (id, reason) => {
        const row = get().signals.find((s) => s.id === id);
        if (!row) return { ok: false, reason: "Không thấy tín hiệu." };
        if (row.status === "dead") return { ok: false, reason: "Tín hiệu này đã chết." };
        if (reason.trim().length < 12) return { ok: false, reason: "Khai tử cần lý do. Giữ vì đã tốn công không phải lý do." };
        const at = new Date().toISOString();
        set((s) => ({
          signals: s.signals.map((item) =>
            item.id === id ? { ...item, status: "dead", diedAt: at, deathReason: reason.trim(), updatedAt: at } : item,
          ),
        }));
        return { ok: true };
      },
      exportDesk: () => JSON.stringify(normalizePersisted(get()), null, 2),
      importDesk: (raw) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return { ok: false, reason: "Tệp này không đọc được." };
        }
        if (!parsed || typeof parsed !== "object") return { ok: false, reason: "Tệp này không phải sổ của bàn làm việc." };
        const body = parsed as Partial<Persisted>;
        const known = ["theses", "decisions", "ledger", "mandate", "world", "baseRates", "companies", "companySeals", "signals", "signoff"] as const;
        if (!known.some((key) => key in body)) return { ok: false, reason: "Tệp này không phải sổ CHỈNAM." };
        const next = normalizePersisted(body);
        const problem = tooBig(next);
        if (problem) return { ok: false, reason: problem };
        set(next);
        return { ok: true };
      },
    }),
    {
      name: "chinam-foundation-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : window.localStorage)),
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
      }),
      merge: (persisted, current) => ({ ...current, ...normalizePersisted((persisted ?? {}) as Partial<Persisted>) }),
    },
  ),
);
