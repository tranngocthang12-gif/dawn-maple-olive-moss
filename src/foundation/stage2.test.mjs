// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { useDesk } from "./store.ts";
import { emptyQuality, sealFromCompany } from "./logic.ts";
import { bookSchema, migrateBook } from "./schema.ts";
import { canonicalJson, sha256Hex, hashJson, sealHash, verifyJsonHash } from "./hash.ts";
import { durableStorage, LEGACY_KEY, DESK_KEY, FALLBACK_KEY, resetStorageForTest,
  storageSnapshot, allowWritesAfterHydration, waitForDurableWrites } from "./storage.ts";

const baseline = () => ({
  theses: [], decisions: [], ledger: [], signoff: {}, activeThesisId: null,
  mandate: { locked: false, lockedAt: "", currency: "", horizon: "", universeInner: "",
    universeOuter: "", leverage: "none", leverageNote: "", taxNote: "", liquidityNote: "", amendments: [] },
  world: [], baseRates: [], companies: [], companySeals: [], signals: [], tamperImportApprovals: [],
});
const snapshot = () => JSON.stringify({
  ...baseline(),
  ...Object.fromEntries(Object.keys(baseline()).map((k) => [k, useDesk.getState()[k]])),
});
beforeEach(() => { useDesk.setState({ ...baseline(), ready: false }); resetStorageForTest(); });

const invalid = [
  "", "null", "[]", "123", "không phải json",
  '{"theses":"abc"}', '{"theses":null}', '{"theses":[null]}',
  '{"theses":[{"id":"x"}]}', '{"decisions":[1,2]}',
  '{"decisions":[{"thesisSnapshot":"x"}]}',
];
test("a) all eleven invalid imports reject atomically and never throw", async () => {
  const original = snapshot();
  for (const text of invalid) {
    const result = await useDesk.getState().importDesk(text);
    assert.equal(result.ok, false, text);
    assert.equal(snapshot(), original, text);
  }
});
test("a2) reports nested failing field path on malformed decision snapshot", async () => {
  const result = await useDesk.getState().importDesk('{"decisions":[{"thesisSnapshot":"x"}]}');
  assert.equal(result.ok, false);
  assert.match(result.reason, /decisions\[0\]\.thesisSnapshot/u);
});
test("b) export/import is stable and total hash matches canonical JSON", async () => {
  const raw = await useDesk.getState().exportDesk();
  const exported = JSON.parse(raw);
  assert.equal(exported.schemaVersion, 2);
  assert.deepEqual(bookSchema.parse(exported), exported);
  assert.equal(exported.sha256, await hashJson(exported));
  const prior = snapshot();
  assert.equal((await useDesk.getState().importDesk(raw)).ok, true);
  assert.equal(snapshot(), prior);
});
test("c) v1 export without schemaVersion imports by documented migration", async () => {
  const current = JSON.parse(await useDesk.getState().exportDesk());
  delete current.schemaVersion;
  delete current.sha256;
  const parsed = migrateBook(current);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.legacy, true);
  assert.equal((await useDesk.getState().importDesk(JSON.stringify(current), true)).ok, true);
  assert.match(useDesk.getState().tamperImportApprovals.at(-1).note, /bản cũ chưa kiểm/u);
});
test("d) a single edited character invalidates sha256 without Owner confirmation", async () => {
  const current = JSON.parse(await useDesk.getState().exportDesk());
  current.mandate.currency = "VND";
  const edited = JSON.stringify(current);
  const original = snapshot();
  const refused = await useDesk.getState().importDesk(edited);
  assert.equal(refused.ok, false);
  assert.match(refused.reason, /sha256/u);
  assert.equal(snapshot(), original);
  const accepted = await useDesk.getState().importDesk(edited, true);
  assert.equal(accepted.ok, true);
  assert.equal(useDesk.getState().tamperImportApprovals.length, 1);
  assert.match(useDesk.getState().tamperImportApprovals[0].note, /Vẫn nhập/u);
});

function fakeLocal(seed = {}) {
  const map = new Map(Object.entries(seed));
  return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => { map.set(k, v); },
    removeItem: (k) => { map.delete(k); } };
}
function fakeIndexed(initial = {}) {
  const data = new Map(Object.entries(initial));
  const calls = [];
  let failWrites = false, failReads = false;
  const db = {
    objectStoreNames: { contains: () => true }, createObjectStore: () => undefined,
    transaction(_store, mode) {
      const tx = { oncomplete: null, onerror: null, onabort: null,
        objectStore: () => ({
          get(key) {
            const req = { result: undefined, onsuccess: null, onerror: null };
            queueMicrotask(() => {
              if (failReads) { req.onerror?.(); return; }
              req.result = data.get(key);
              req.onsuccess?.();
            });
            return req;
          },
          put(value, key) {
            calls.push({ key, value, mode });
            queueMicrotask(() => {
              if (failWrites) { tx.onerror?.(); return; }
              data.set(key, value);
              tx.oncomplete?.();
            });
          },
        }),
      };
      return tx;
    },
  };
  const api = { open() {
    const req = { result: db, onsuccess: null, onerror: null, onupgradeneeded: null };
    queueMicrotask(() => req.onsuccess?.());
    return req;
  } };
  return { api, data, calls, setFailWrites(v) { failWrites = v; }, setFailReads(v) { failReads = v; } };
}
async function withBrowser(local, indexed, run) {
  const oldWindow = globalThis.window;
  const oldIndexed = globalThis.indexedDB;
  const oldNavigator = globalThis.navigator;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: local } });
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: indexed });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { storage: { estimate: async () => ({ quota: 1_000_000 }) } } });
  resetStorageForTest();
  try { await run(); } finally {
    Object.defineProperty(globalThis, "window", { configurable: true, value: oldWindow });
    Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: oldIndexed });
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: oldNavigator });
    resetStorageForTest();
  }
}
function legacyEnvelope() {
  return JSON.stringify({ state: baseline(), version: 0 });
}
test("e) localStorage V1 migrates byte-for-byte to indexedDB and retains original key", async () => {
  const raw = legacyEnvelope();
  const local = fakeLocal({ [LEGACY_KEY]: raw });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), raw);
    assert.equal(indexed.data.get(DESK_KEY), raw);
    assert.equal(local.map.get(LEGACY_KEY), raw);
    assert.equal(storageSnapshot().mode, "indexeddb");
  });
});
test("f) writes before hydration are blocked even with slow indexedDB", async () => {
  const raw = legacyEnvelope();
  const local = fakeLocal({ [LEGACY_KEY]: raw });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    await durableStorage.setItem(DESK_KEY, JSON.stringify({ state: { theses: [] }, version: 0 }));
    assert.equal(indexed.data.size, 0);
    assert.equal(await durableStorage.getItem(DESK_KEY), raw);
    assert.equal(indexed.data.get(DESK_KEY), raw);
  });
});
test("g) failed load is fail-closed and never writes an empty book", async () => {
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: "invalid-json" });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    assert.notEqual(storageSnapshot().loadError, "");
    assert.equal(indexed.calls.length, 0);
    assert.equal(indexed.data.get(DESK_KEY), "invalid-json");
  });
});
test("h) missing indexedDB uses localStorage fallback and warns", async () => {
  const raw = legacyEnvelope();
  const local = fakeLocal({ [LEGACY_KEY]: raw });
  await withBrowser(local, undefined, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), raw);
    assert.equal(storageSnapshot().mode, "fallback");
    allowWritesAfterHydration();
    await durableStorage.setItem(DESK_KEY, raw);
    assert.ok(local.map.has(FALLBACK_KEY));
    assert.equal(local.map.get(LEGACY_KEY), raw);
  });
});
test("i) a failed write raises persistent warning until a later successful write", async () => {
  const indexed = fakeIndexed();
  const local = fakeLocal();
  await withBrowser(local, indexed.api, async () => {
    await durableStorage.getItem(DESK_KEY);
    allowWritesAfterHydration();
    const valid = legacyEnvelope();
    indexed.setFailWrites(true);
    await durableStorage.setItem(DESK_KEY, valid);
    await waitForDurableWrites();
    assert.equal(storageSnapshot().saveError, true);
    indexed.setFailWrites(false);
    await durableStorage.setItem(DESK_KEY, valid);
    await waitForDurableWrites();
    assert.equal(storageSnapshot().saveError, false);
  });
});
test("j) two outcome changes retain three log rows and last is current", () => {
  const state = useDesk.getState();
  state.addDecision({ security: "ABC", priceNote: "", action: "observe", thesisId: null,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: false, overrideReason: "" });
  const id = useDesk.getState().decisions[0].id;
  useDesk.getState().patchOutcome(id, { outcome: "process-good-outcome-good", postMortemClass: "", postMortemNote: "Kết quả 1" });
  useDesk.getState().patchOutcome(id, { outcome: "process-bad-outcome-bad", postMortemClass: "bad-model", postMortemNote: "Kết quả 2" });
  const d = useDesk.getState().decisions[0];
  assert.equal(d.outcomeLog.length, 3);
  assert.equal(d.outcomeLog[0].outcome, "pending");
  assert.equal(d.outcomeLog[2].outcome, d.outcome);
  assert.equal(d.outcomeLog[2].postMortemNote, "Kết quả 2");
});
test("k) Web Crypto SHA-256 vector abc, canonical order, and seal tamper detection", async () => {
  assert.equal(await sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(canonicalJson({ z: 1, a: { y: 2, x: 3 } }), '{"a":{"x":3,"y":2},"z":1}');
  const seal = await sealHash({ id: "seal-1", name: "Ban goc" }, "created");
  assert.equal(await verifyJsonHash(seal), true);
  assert.equal(await verifyJsonHash({ ...seal, name: "Ban goc!" }), false);
});
test("l) override reason is mandatory for kill after invalidation", () => {
  const id = useDesk.getState().createThesis().id;
  useDesk.getState().invalidateThesis(id, "Thesis đã hủy theo tiêu chí xác định.");
  const result = useDesk.getState().addDecision({ security: "ABC", priceNote: "", action: "kill", thesisId: id,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: true, overrideReason: "" });
  assert.equal(result.ok, false);
});
test("m) CI covers main, chinam/** pushes, PR to main and no redundant Stage1 invocations", () => {
  const path = fileURLToPath(new URL("../../.github/workflows/chinam-stage1-verification.yml", import.meta.url));
  const yaml = readFileSync(path, "utf8");
  assert.match(yaml, /name: CHINAM CI/u);
  assert.match(yaml, /chinam\/\*\*/u);
  assert.match(yaml, /pull_request:/u);
  assert.match(yaml, /main/u);
  assert.doesNotMatch(yaml, /Stage 1 independent/u);
});

test("c2) migrated legacy decision gets one dated outcomeLog row with provenance", async () => {
  const form = { security: "ABC", priceNote: "", action: "observe", thesisId: null,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: false, overrideReason: "" };
  assert.equal(useDesk.getState().addDecision(form).ok, true);
  const exported = JSON.parse(await useDesk.getState().exportDesk());
  delete exported.schemaVersion;
  delete exported.sha256;
  delete exported.decisions[0].outcomeLog;
  delete exported.decisions[0].snapshotSha256;
  delete exported.decisions[0].snapshotHashOrigin;
  const result = await useDesk.getState().importDesk(JSON.stringify(exported));
  assert.equal(result.ok, true);
  const history = useDesk.getState().decisions[0].outcomeLog;
  assert.equal(history.length, 1);
  assert.equal(history[0].legacyNote, "chuyển từ bản cũ");
  assert.equal(useDesk.getState().decisions[0].snapshotHashOrigin, "legacy-backfill");
});
test("f2) store blocks mutation while browser hydration is incomplete", async () => {
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    const before = snapshot();
    const result = useDesk.getState().createThesis();
    assert.equal(result.ok, false);
    assert.equal(snapshot(), before);
    assert.equal(await durableStorage.getItem(DESK_KEY), local.getItem(LEGACY_KEY));
  });
});
test("k2) nested seal mismatch is rejected despite an otherwise valid file-total hash", async () => {
  const seal = await sealHash({ id: "seal", companyId: "co", filedAt: "2026-11-01", sealed: true,
    name: "Cty A", venue: "HOSE", standard: "VAS", standardNote: "",
    business: "", missingNote: "", facts: [], quality: {
      receivables: { state: "open", note: "", source: "" },
      inventory: { state: "open", note: "", source: "" },
      accruals: { state: "open", note: "", source: "" },
      capitalization: { state: "open", note: "", source: "" },
      related: { state: "open", note: "", source: "" },
      dilution: { state: "open", note: "", source: "" },
      offbalance: { state: "open", note: "", source: "" },
      auditor: { state: "open", note: "", source: "" },
      cfo: { state: "open", note: "", source: "" },
    } }, "created");
  const valid = JSON.parse(await useDesk.getState().exportDesk());
  valid.companySeals = [{ ...seal, name: "Cty B" }];
  valid.sha256 = await hashJson(valid);
  const rejected = await useDesk.getState().importDesk(JSON.stringify(valid));
  assert.equal(rejected.ok, false);
  assert.match(rejected.reason, /sha256/u);
});

test("e2) a newer localStorage fallback wins over stale legacy only after IDB read-back", async () => {
  const legacy = legacyEnvelope();
  const newer = JSON.stringify({ state: { ...baseline(), signoff: { newNote: true } }, version: 0 });
  const local = fakeLocal({ [LEGACY_KEY]: legacy, [FALLBACK_KEY]: newer });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), newer);
    assert.equal(indexed.data.get(DESK_KEY), newer);
    assert.equal(local.getItem(LEGACY_KEY), legacy);
  });
});
test("e3) divergent IDB and fallback copies fail closed instead of choosing a loser", async () => {
  const old = legacyEnvelope();
  const newer = JSON.stringify({ state: { ...baseline(), signoff: { newer: true } }, version: 0 });
  const local = fakeLocal({ [LEGACY_KEY]: old, [FALLBACK_KEY]: newer });
  const indexed = fakeIndexed({ [DESK_KEY]: old });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY), /khác nhau/u);
    assert.equal(indexed.calls.length, 0);
    assert.equal(local.getItem(FALLBACK_KEY), newer);
  });
});
test("k3) version2 file cannot drop nested hashes even if its total hash is recomputed", async () => {
  useDesk.getState().addDecision({ security: "ABC", priceNote: "", action: "observe", thesisId: null,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: false, overrideReason: "" });
  const current = JSON.parse(await useDesk.getState().exportDesk());
  delete current.decisions[0].snapshotSha256;
  current.sha256 = await hashJson(current);
  const response = await useDesk.getState().importDesk(JSON.stringify(current));
  assert.equal(response.ok, false);
  assert.match(response.reason, /sha256/u);
});

test("g2) malformed old localStorage cannot be copied into IndexedDB", async () => {
  const local = fakeLocal({ [LEGACY_KEY]: JSON.stringify({ state: { theses: [{ id: "x" }] }, version: 0 }) });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    assert.equal(indexed.calls.length, 0);
    assert.equal(indexed.data.size, 0);
    assert.ok(local.getItem(LEGACY_KEY));
  });
});

test("e4) migration round-trip retains populated rows in every persisted category", async () => {
  const now = "2026-11-01T00:00:00.000Z";
  const result = useDesk.getState().createThesis();
  assert.equal(result.ok, true);
  assert.equal(useDesk.getState().addDecision({ security: "ABC", priceNote: "Chỉ là fixture",
    action: "observe", thesisId: null, expectedReturn: "", probabilityNote: "", risk: "",
    sizeNote: "", catalyst: "", invalidation: "", alternativeView: "", override: false,
    overrideReason: "" }).ok, true);
  const company = { id: "co-test", createdAt: now, updatedAt: now, status: "filed",
    name: "Doanh nghiệp kiểm thử", venue: "HOSE", standard: "VAS",
    standardNote: "Chỉ fixture kiểm thử", business: "Hồ sơ fixture",
    missingNote: "", facts: [], quality: emptyQuality(), sealId: "seal-test" };
  const book = {
    ...baseline(), theses: useDesk.getState().theses, decisions: useDesk.getState().decisions,
    activeThesisId: result.id, signoff: { verified: true }, companies: [company],
    companySeals: [sealFromCompany(company, now, "seal-test", true)],
    ledger: [{ id: "led-test", at: now, statement: "Kiểm thử", priorPct: 50, lr: null,
      posteriorPct: null, evidenceNote: "", klass: "hypothesis", corrects: "" }],
    world: [{ id: "world-test", at: now, domain: "macro", name: "Kiểm thử", geography: "VN",
      level: "", delta: "", acceleration: "", unit: "", source: "", tier: "none",
      asOf: "", permitted: false, supersedes: "" }],
    baseRates: [{ id: "rate-test", at: now, name: "Kiểm thử", event: "", rateNote: "",
      geography: "", period: "", source: "", tier: "none", asOf: "",
      permitted: false, caveat: "", supersedes: "" }],
    signals: [{ id: "signal-test", at: now, updatedAt: now, family: "", hypothesis: "",
      mechanism: "", lag: "", death: "", rights: "", rightsOk: false,
      status: "draft", diedAt: "", deathReason: "" }],
  };
  const raw = JSON.stringify({ state: book, version: 0 });
  const local = fakeLocal({ [LEGACY_KEY]: raw });
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    const received = await durableStorage.getItem(DESK_KEY);
    assert.equal(received, raw);
    const migrated = JSON.parse(indexed.data.get(DESK_KEY)).state;
    for (const key of Object.keys(baseline())) assert.deepEqual(migrated[key], book[key], key);
    assert.equal(local.getItem(LEGACY_KEY), raw);
  });
});

test("j2) V2 rejects a file whose current outcome contradicts the latest outcomeLog row", async () => {
  assert.equal(useDesk.getState().addDecision({ security: "ABC", priceNote: "", action: "observe", thesisId: null,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: false, overrideReason: "" }).ok, true);
  const id = useDesk.getState().decisions[0].id;
  useDesk.getState().patchOutcome(id, {
    outcome: "process-good-outcome-bad", postMortemClass: "bad-model", postMortemNote: "Hậu kiểm mới",
  });
  const altered = JSON.parse(await useDesk.getState().exportDesk());
  altered.decisions[0].outcome = "pending";
  altered.sha256 = await hashJson(altered);
  const initial = snapshot();
  const rejected = await useDesk.getState().importDesk(JSON.stringify(altered));
  assert.equal(rejected.ok, false);
  assert.match(rejected.reason, /decisions\[0\]\.outcomeLog/u);
  assert.equal(snapshot(), initial);
});

test("R2-F02-a: export in flight must never drop a decision added concurrently", async () => {
  const exporting = useDesk.getState().exportDesk();
  const result = useDesk.getState().addDecision({ security: "NEW", priceNote: "", action: "observe", thesisId: null,
    expectedReturn: "", probabilityNote: "", risk: "", sizeNote: "", catalyst: "",
    invalidation: "", alternativeView: "", override: false, overrideReason: "" });
  assert.equal(result.ok, true);
  await exporting;
  assert.equal(useDesk.getState().decisions.filter((d) => d.security === "NEW").length, 1);
});
test("R2-F02-b: export in flight cannot truncate an appended outcomeLog", async () => {
  const form = { security: "ABC", priceNote: "", action: "observe", thesisId: null, expectedReturn: "",
    probabilityNote: "", risk: "", sizeNote: "", catalyst: "", invalidation: "", alternativeView: "",
    override: false, overrideReason: "" };
  assert.equal(useDesk.getState().addDecision(form).ok, true);
  const id = useDesk.getState().decisions[0].id;
  const exporting = useDesk.getState().exportDesk();
  useDesk.getState().patchOutcome(id, {
    outcome: "process-good-outcome-bad", postMortemClass: "bad-model", postMortemNote: "Outcome mới",
  });
  await exporting;
  assert.equal(useDesk.getState().decisions.find((d) => d.id === id)?.outcomeLog.length, 2);
});

test("R2-F-01-a: V2 downgraded to legacy cannot import silently or alter existing book", async () => {
  const current = JSON.parse(await useDesk.getState().exportDesk());
  current.mandate.currency = "TAMPERED";
  delete current.schemaVersion;
  delete current.sha256;
  delete current.tamperImportApprovals;
  for (const seal of current.companySeals) { delete seal.sha256; delete seal.sha256Origin; }
  for (const decision of current.decisions) {
    delete decision.snapshotSha256;
    delete decision.snapshotHashOrigin;
    delete decision.outcomeLog;
    if (decision.companySeal) { delete decision.companySeal.sha256; delete decision.companySeal.sha256Origin; }
  }
  const before = snapshot();
  const refused = await useDesk.getState().importDesk(JSON.stringify(current));
  assert.equal(refused.ok, false);
  assert.match(refused.reason, /legacy-unverified/u);
  assert.equal(snapshot(), before);
});
test("R2-F-01-b: explicitly approved unverified legacy import leaves dated audit entry", async () => {
  const current = JSON.parse(await useDesk.getState().exportDesk());
  delete current.schemaVersion;
  delete current.sha256;
  const before = snapshot();
  assert.equal((await useDesk.getState().importDesk(JSON.stringify(current))).ok, false);
  assert.equal(snapshot(), before);
  const accepted = await useDesk.getState().importDesk(JSON.stringify(current), true);
  assert.equal(accepted.ok, true);
  const entry = useDesk.getState().tamperImportApprovals.at(-1);
  assert.match(entry.note, /bản cũ chưa kiểm/u);
  assert.match(entry.at, /^\d{4}-\d{2}-\d{2}T/u);
});
