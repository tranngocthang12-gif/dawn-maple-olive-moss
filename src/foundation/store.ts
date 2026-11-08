import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Amendment, BaseRate, Claim, Decision, DecisionAction, KillCriterion, LedgerRow, Mandate, Signoff, Thesis, ThesisTexts, WorldObs } from "./types";
import { checksDefault, defaultScenarios, emptyTexts, newId, recordUsable, thesisBlockers } from "./logic";

type DeskState = {
  theses: Thesis[];
  decisions: Decision[];
  ledger: LedgerRow[];
  signoff: Signoff;
  activeThesisId: string | null;
  ready: boolean;
  setReady: (v: boolean) => void;
  createThesis: () => string;
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
  addLedger: (row: Omit<LedgerRow, "id" | "at">) => void;
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

type Persisted = Pick<DeskState, "theses" | "decisions" | "ledger" | "signoff" | "activeThesisId" | "mandate" | "world" | "baseRates">;

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
      ready: false,
      setReady: (v) => set({ ready: v }),
      createThesis: () => {
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
        };
        set((s) => ({ theses: [thesis, ...s.theses].slice(0, 40), activeThesisId: id }));
        return id;
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
        const next = thesisBlockers(t, { mandate: get().mandate, world: get().world, baseRates: get().baseRates }).length === 0 ? "ready" : "draft";
        if (next !== t.status) get().updateThesis(id, { status: next });
      },
      addLedger: (row) =>
        set((s) => ({
          ledger: [{ ...row, id: newId(), at: new Date().toISOString() }, ...s.ledger].slice(0, 200),
        })),
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
        const decision: Decision = {
          id: newId(),
          at: new Date().toISOString(),
          security: input.security.trim(),
          priceNote: input.priceNote,
          action: input.action,
          thesisId: thesis?.id ?? null,
          thesisSnapshot: thesis ? structuredClone(thesis) : null,
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
        set((s) => ({ decisions: [decision, ...s.decisions].slice(0, 200) }));
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
        const obs: WorldObs = { ...row, id: newId(), at: new Date().toISOString() };
        set((s) => ({ world: [obs, ...s.world].slice(0, 200) }));
        return { ok: true };
      },
      addBaseRate: (row) => {
        if (row.name.trim().length < 2 || row.event.trim().length < 12 || row.rateNote.trim().length < 2) {
          return { ok: false, reason: "Cần tên, định nghĩa sự kiện, và con số kèm mẫu." };
        }
        if (row.caveat.trim().length < 12) return { ok: false, reason: "Base rate phải ghi giới hạn: nơi, thời, và cái nó không nói." };
        if (!recordUsable(row)) return { ok: false, reason: "Base rate cần nguồn tầng 1 hoặc 2, ngày, và được phép dùng." };
        const rate: BaseRate = { ...row, id: newId(), at: new Date().toISOString() };
        set((s) => ({ baseRates: [rate, ...s.baseRates].slice(0, 200) }));
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
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const theses = (p.theses ?? []).map((t) => ({
          ...t,
          ring: t.ring ?? "",
          baseRateId: t.baseRateId ?? "",
          worldIds: t.worldIds ?? [],
        }));
        return {
          ...current,
          ...p,
          theses,
          mandate: { ...emptyMandate(), ...(p.mandate ?? {}) },
          world: p.world ?? [],
          baseRates: p.baseRates ?? [],
          decisions: p.decisions ?? [],
          ledger: p.ledger ?? [],
          signoff: p.signoff ?? {},
          activeThesisId: p.activeThesisId ?? null,
        };
      },
    },
  ),
);
