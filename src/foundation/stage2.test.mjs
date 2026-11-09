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
  storageSnapshot, allowWritesAfterHydration, waitForDurableWrites, readRawRecoveryCopies, quarantineRawRecoveryCopies, recoverVerifiedBackup, QUARANTINE_PREFIX, idbCompareAndSwap } from "./storage.ts";

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
      let hasPut = false;
      const tx = { oncomplete: null, onerror: null, onabort: null,
        objectStore: () => ({
          get(key) {
            const req = { result: undefined, onsuccess: null, onerror: null };
            queueMicrotask(() => {
              if (failReads) { req.onerror?.(); return; }
              req.result = data.get(key);
              req.onsuccess?.();
              if (mode === "readwrite" && !hasPut) queueMicrotask(() => tx.oncomplete?.());
            });
            return req;
          },
          put(value, key) {
            hasPut = true;
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
    assert.equal(storageSnapshot().readOnly, true);
    assert.equal(storageSnapshot().ready, false);
    assert.equal(local.map.has(FALLBACK_KEY), false);
    assert.equal(local.map.get(LEGACY_KEY), raw);
    // R-03 Owner decision: fallback is read-only; export remains possible.
    const exported = await useDesk.getState().exportDesk();
    assert.equal(JSON.parse(exported).schemaVersion, 2);
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
  // F-01 requires explicit Owner consent even for genuine V1 migration.
  const result = await useDesk.getState().importDesk(JSON.stringify(exported), true);
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

test("R2-F-03-a: corrupted IndexedDB bytes remain unchanged and raw export preserves every character", async () => {
  const broken = "{bad\\u0000raw";
  const legacy = legacyEnvelope();
  const local = fakeLocal({ [LEGACY_KEY]: legacy });
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    assert.equal(storageSnapshot().ready, false);
    const copies = await readRawRecoveryCopies();
    assert.deepEqual(copies, [
      { source: "indexeddb:" + DESK_KEY, raw: broken },
      { source: "localStorage:" + LEGACY_KEY, raw: legacy },
    ]);
    assert.equal(indexed.data.get(DESK_KEY), broken);
    assert.equal(indexed.calls.length, 0);
  });
});
test("R2-F-03-b: quarantine keeps damaged source bytes and never overwrites active book", async () => {
  const broken = "corrupt-book-\\u0000";
  const local = fakeLocal({ [LEGACY_KEY]: "legacy-raw" });
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    const copies = await quarantineRawRecoveryCopies();
    const key = [...indexed.data.keys()].find((name) => name.startsWith(QUARANTINE_PREFIX));
    assert.ok(key);
    assert.deepEqual(JSON.parse(indexed.data.get(key)), copies);
    assert.equal(indexed.data.get(DESK_KEY), broken);
    assert.equal(local.getItem(LEGACY_KEY), "legacy-raw");
    assert.equal(indexed.calls.length, 0);
  });
});

test("R2-F-03-c: verified V2 backup recovers only after quarantining damaged active bytes", async () => {
  const backup = await useDesk.getState().exportDesk();
  const broken = "broken-active-\\u0000";
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    await recoverVerifiedBackup(backup);
    const key = [...indexed.data.keys()].find((k) => k.startsWith(QUARANTINE_PREFIX));
    assert.ok(key);
    const copies = JSON.parse(indexed.data.get(key));
    assert.equal(copies[0].raw, broken);
    const saved = JSON.parse(indexed.data.get(DESK_KEY));
    assert.equal(saved.state.sha256, JSON.parse(backup).sha256);
    assert.equal(storageSnapshot().ready, false);
  });
});
test("R2-F-03-d: corrupt backup cannot quarantine or overwrite active bytes", async () => {
  const backup = JSON.parse(await useDesk.getState().exportDesk());
  backup.mandate.currency = "EDITED";
  const local = fakeLocal();
  const indexed = fakeIndexed({ [DESK_KEY]: "broken-active" });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    await assert.rejects(() => recoverVerifiedBackup(JSON.stringify(backup)), /sha256/u);
    assert.equal(indexed.data.get(DESK_KEY), "broken-active");
    assert.equal(indexed.calls.length, 0);
    assert.equal([...local.map.keys()].some((k) => k.startsWith(QUARANTINE_PREFIX)), false);
  });
});

test("R2-F-03-e: no source bytes means no quarantine and no recovery overwrite", async () => {
  const backup = await useDesk.getState().exportDesk();
  const local = fakeLocal();
  const indexed = fakeIndexed();
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), null);
    await assert.rejects(() => recoverVerifiedBackup(backup), /Không có dữ liệu gốc/u);
    assert.equal(indexed.calls.length, 0);
    assert.equal(indexed.data.size, 0);
  });
});

test("R2-F-03-f: localStorage quota failure prevents recovery write and preserves broken IndexedDB", async () => {
  const backup = await useDesk.getState().exportDesk();
  const broken = "damaged-original";
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const originalSet = local.setItem;
  local.setItem = (key, value) => {
    if (key.startsWith(QUARANTINE_PREFIX)) throw new Error("QuotaExceededError");
    return originalSet(key, value);
  };
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    await recoverVerifiedBackup(backup);
    const quarantineKey = [...indexed.data.keys()].find((k) => k.startsWith(QUARANTINE_PREFIX));
    assert.ok(quarantineKey);
    assert.equal(JSON.parse(indexed.data.get(quarantineKey))[0].raw, broken);
    assert.notEqual(indexed.data.get(DESK_KEY), broken);
    assert.equal(local.getItem(LEGACY_KEY), legacyEnvelope());
  });
});
test("R2-F-03-g: failed IndexedDB recovery write retains quarantined original and locked session", async () => {
  const backup = await useDesk.getState().exportDesk();
  const broken = "damaged-original";
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    indexed.setFailWrites(true);
    await assert.rejects(() => recoverVerifiedBackup(backup));
    const key = [...local.map.keys()].find((k) => k.startsWith(QUARANTINE_PREFIX));
    assert.ok(key);
    assert.equal(JSON.parse(local.getItem(key))[0].raw, broken);
    assert.equal(indexed.data.get(DESK_KEY), broken);
    assert.equal(storageSnapshot().ready, false);
  });
});

test("R2-F-03-h: unreadable IndexedDB cannot be bypassed by a valid legacy localStorage copy", async () => {
  const backup = await useDesk.getState().exportDesk();
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: "damaged-original" });
  await withBrowser(local, indexed.api, async () => {
    indexed.setFailReads(true);
    await assert.rejects(() => recoverVerifiedBackup(backup), /Không thể đọc dữ liệu thô IndexedDB/u);
    assert.equal(indexed.calls.length, 0);
    assert.equal(indexed.data.get(DESK_KEY), "damaged-original");
    assert.equal([...local.map.keys()].some((key) => key.startsWith(QUARANTINE_PREFIX)), false);
  });
});

function casFakeIndexed(initial = {}) {
  const data = new Map(Object.entries(initial));
  let writeCount = 0;
  const db = {
    close() {},
    transaction(_store, mode) {
      assert.equal(mode, "readwrite");
      let pending = 0;
      const tx = { oncomplete: null, onerror: null, onabort: null };
      const finish = () => {
        if (pending === 0) queueMicrotask(() => tx.oncomplete?.());
      };
      const store = {
        get(key) {
          pending++;
          const request = { result: undefined, onsuccess: null, onerror: null };
          queueMicrotask(() => {
            request.result = data.get(key);
            request.onsuccess?.();
            pending--;
            finish();
          });
          return request;
        },
        put(value, key) {
          pending++;
          queueMicrotask(() => {
            data.set(key, value);
            writeCount++;
            pending--;
            finish();
          });
        },
      };
      tx.objectStore = () => store;
      return tx;
    },
  };
  return { db, data, writes: () => writeCount };
}
test("R2-F-04-a: tab A commits v1 then stale tab B cannot overwrite it", async () => {
  const original = JSON.stringify({ bookVersion: 0, state: baseline() });
  const indexed = casFakeIndexed({ [DESK_KEY]: original });
  const a = JSON.stringify({ bookVersion: 1, state: { ...baseline(), signoff: { a: true } } });
  const b = JSON.stringify({ bookVersion: 1, state: { ...baseline(), signoff: { b: true } } });
  assert.equal(await idbCompareAndSwap(indexed.db, DESK_KEY, original, a), true);
  assert.equal(await idbCompareAndSwap(indexed.db, DESK_KEY, original, b), false);
  assert.equal(indexed.data.get(DESK_KEY), a);
  assert.equal(indexed.writes(), 1);
});
test("R2-F-04-b: tab B commits v1 then stale tab A cannot overwrite it", async () => {
  const original = JSON.stringify({ bookVersion: 0, state: baseline() });
  const indexed = casFakeIndexed({ [DESK_KEY]: original });
  const a = JSON.stringify({ bookVersion: 1, state: { ...baseline(), signoff: { a: true } } });
  const b = JSON.stringify({ bookVersion: 1, state: { ...baseline(), signoff: { b: true } } });
  assert.equal(await idbCompareAndSwap(indexed.db, DESK_KEY, original, b), true);
  assert.equal(await idbCompareAndSwap(indexed.db, DESK_KEY, original, a), false);
  assert.equal(indexed.data.get(DESK_KEY), b);
  assert.equal(indexed.writes(), 1);
});
test("R2-F-04-c: CAS rejects skipped version and cannot modify persisted bytes", async () => {
  const original = JSON.stringify({ bookVersion: 3, state: baseline() });
  const indexed = casFakeIndexed({ [DESK_KEY]: original });
  await assert.rejects(() => idbCompareAndSwap(indexed.db, DESK_KEY, original,
    JSON.stringify({ bookVersion: 5, state: baseline() })), /bookVersion/u);
  assert.equal(indexed.data.get(DESK_KEY), original);
  assert.equal(indexed.writes(), 0);
});

test("R2-F-04-d: storage refuses stale tab, locks further saves and preserves newer disk bytes", async () => {
  const original = legacyEnvelope();
  const local = fakeLocal();
  const indexed = fakeIndexed({ [DESK_KEY]: original });
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), original);
    allowWritesAfterHydration();
    const newer = JSON.stringify({ ...JSON.parse(original), bookVersion: 1 });
    indexed.data.set(DESK_KEY, newer); // independent tab has committed newer bytes
    const before = indexed.calls.length;
    await durableStorage.setItem(DESK_KEY, original);
    assert.equal(storageSnapshot().conflict, true);
    assert.equal(storageSnapshot().ready, false);
    assert.equal(storageSnapshot().saveError, true);
    assert.equal(indexed.data.get(DESK_KEY), newer);
    assert.equal(indexed.calls.length, before);
    await durableStorage.setItem(DESK_KEY, original);
    assert.equal(indexed.calls.length, before);
    const memoryCopy = await useDesk.getState().exportDesk();
    assert.equal(JSON.parse(memoryCopy).schemaVersion, 2);
  });
});

test("R2-F-04-e: concurrent creation does not overwrite an IndexedDB book with a legacy seed", async () => {
  const seed = legacyEnvelope();
  const anotherTab = JSON.stringify({ ...JSON.parse(seed), bookVersion: 3 });
  const local = fakeLocal({ [LEGACY_KEY]: seed });
  const indexed = fakeIndexed();
  const originalGet = indexed.data.get.bind(indexed.data);
  let firstRead = true;
  indexed.data.get = (key) => {
    if (key === DESK_KEY && firstRead) {
      firstRead = false;
      indexed.data.set(DESK_KEY, anotherTab); // another tab wins after initial read
      return undefined;
    }
    return originalGet(key);
  };
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY), /tab khác/u);
    assert.equal(indexed.data.get(DESK_KEY), anotherTab);
    assert.equal(indexed.calls.length, 0);
    assert.equal(local.getItem(LEGACY_KEY), seed);
  });
});
test("R2-F-04-f: recovery cannot overwrite bytes changed by another tab after quarantine", async () => {
  const backup = await useDesk.getState().exportDesk();
  const damaged = "damaged-book-before-recovery";
  const newer = JSON.stringify({ state: baseline(), version: 0, bookVersion: 12 });
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: damaged });
  const previousGet = indexed.data.get.bind(indexed.data);
  let reads = 0;
  indexed.data.get = (key) => {
    if (key === DESK_KEY) {
      reads++;
      if (reads === 2) indexed.data.set(DESK_KEY, newer); // between quarantine and recovery CAS
    }
    return previousGet(key);
  };
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => recoverVerifiedBackup(backup), /Xung đột khi phục hồi/u);
    assert.equal(indexed.data.get(DESK_KEY), newer);
    assert.equal(indexed.calls.length, 0);
    const key = [...local.map.keys()].find((name) => name.startsWith(QUARANTINE_PREFIX));
    assert.ok(key);
    assert.equal(JSON.parse(local.getItem(key))[0].raw, damaged);
  });
});
test("R2-F-04-g: invalid non-string IndexedDB payload cannot be treated as missing or overwritten", async () => {
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const indexed = fakeIndexed({ [DESK_KEY]: { invalid: "raw" } });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY), /không phải chuỗi/u);
    assert.deepEqual(indexed.data.get(DESK_KEY), { invalid: "raw" });
    assert.equal(indexed.calls.length, 0);
  });
});

test("R2-F-04-h: later tab wins before post-CAS readback, first tab locks instead of continuing", async () => {
  const initial = legacyEnvelope();
  const local = fakeLocal();
  const indexed = fakeIndexed({ [DESK_KEY]: initial });
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), initial);
    allowWritesAfterHydration();
    const get = indexed.data.get.bind(indexed.data);
    let reads = 0;
    const newer = JSON.stringify({ ...JSON.parse(initial), bookVersion: 2 });
    indexed.data.get = (key) => {
      if (key === DESK_KEY && ++reads === 2) indexed.data.set(DESK_KEY, newer);
      return get(key);
    };
    await durableStorage.setItem(DESK_KEY, initial);
    assert.equal(indexed.data.get(DESK_KEY), newer);
    assert.equal(storageSnapshot().conflict, true);
    assert.equal(storageSnapshot().ready, false);
    assert.equal(storageSnapshot().saveError, true);
    const writes = indexed.calls.length;
    await durableStorage.setItem(DESK_KEY, initial);
    assert.equal(indexed.calls.length, writes);
  });
});
test("R2-F-04-i: post-CAS readback error locks all subsequent writes, despite prior commit", async () => {
  const initial = legacyEnvelope();
  const local = fakeLocal();
  const indexed = fakeIndexed({ [DESK_KEY]: initial });
  await withBrowser(local, indexed.api, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), initial);
    allowWritesAfterHydration();
    // The CAS put has committed; subsequent readback must fail.
    const originalSet = indexed.data.set.bind(indexed.data);
    indexed.data.set = (key, value) => {
      const result = originalSet(key, value);
      if (key === DESK_KEY) indexed.setFailReads(true);
      return result;
    };
    await durableStorage.setItem(DESK_KEY, initial);
    assert.equal(storageSnapshot().readOnly, true);
    assert.equal(storageSnapshot().ready, false);
    assert.equal(storageSnapshot().saveError, true);
    const writes = indexed.calls.length;
    await durableStorage.setItem(DESK_KEY, initial);
    assert.equal(indexed.calls.length, writes);
  });
});

test("R2-F-04-j: queued stale writes cannot bypass conflict lock", async () => {
  const original = legacyEnvelope();
  const indexed = fakeIndexed({ [DESK_KEY]: original });
  await withBrowser(fakeLocal(), indexed.api, async () => {
    await durableStorage.getItem(DESK_KEY);
    allowWritesAfterHydration();
    const newer = JSON.stringify({ ...JSON.parse(original), bookVersion: 1 });
    indexed.data.set(DESK_KEY, newer);
    await Promise.all([
      durableStorage.setItem(DESK_KEY, original),
      durableStorage.setItem(DESK_KEY, original),
    ]);
    await waitForDurableWrites();
    assert.equal(indexed.data.get(DESK_KEY), newer);
    assert.equal(indexed.calls.length, 0);
    assert.equal(storageSnapshot().conflict, true);
    assert.equal(storageSnapshot().ready, false);
  });
});

/** A shared IDB store with exclusive readwrite transactions, across connections. */
function sharedSerializedCAS(initial) {
  const data = new Map([[DESK_KEY, initial]]);
  const queue = [];
  let active = false;
  let writes = 0;
  const pump = () => {
    if (active || queue.length === 0) return;
    active = true;
    const execute = queue.shift();
    queueMicrotask(execute);
  };
  const connect = () => ({
    transaction(_name, mode) {
      assert.equal(mode, "readwrite");
      const requests = [];
      let pending = 0;
      let settled = false;
      const tx = { oncomplete: null, onerror: null, onabort: null, objectStore: () => store };
      const done = () => {
        if (pending !== 0 || settled) return;
        settled = true;
        queueMicrotask(() => {
          tx.oncomplete?.();
          active = false;
          pump();
        });
      };
      const store = {
        get(key) {
          pending++;
          const req = { result: undefined, onsuccess: null, onerror: null };
          requests.push({ key, req });
          return req;
        },
        put(value, key) {
          pending++;
          queueMicrotask(() => {
            data.set(key, value);
            writes++;
            pending--;
            done();
          });
        },
      };
      queue.push(() => {
        for (const { key, req } of requests) {
          queueMicrotask(() => {
            req.result = data.get(key);
            req.onsuccess?.();
            pending--;
            done();
          });
        }
      });
      pump();
      return tx;
    },
  });
  return { connect, data, writes: () => writes };
}
test("R2-F-04-k: concurrent CAS from separate connections permits only tab A to commit", async () => {
  const original = JSON.stringify({ bookVersion: 7, state: baseline() });
  const db = sharedSerializedCAS(original);
  const a = JSON.stringify({ bookVersion: 8, state: { ...baseline(), signoff: { a: true } } });
  const b = JSON.stringify({ bookVersion: 8, state: { ...baseline(), signoff: { b: true } } });
  const [aOK, bOK] = await Promise.all([
    idbCompareAndSwap(db.connect(), DESK_KEY, original, a),
    idbCompareAndSwap(db.connect(), DESK_KEY, original, b),
  ]);
  assert.deepEqual([aOK, bOK], [true, false]);
  assert.equal(db.data.get(DESK_KEY), a);
  assert.equal(db.writes(), 1);
});
test("R2-F-04-l: reversed concurrent CAS permits only tab B to commit", async () => {
  const original = JSON.stringify({ bookVersion: 7, state: baseline() });
  const db = sharedSerializedCAS(original);
  const a = JSON.stringify({ bookVersion: 8, state: { ...baseline(), signoff: { a: true } } });
  const b = JSON.stringify({ bookVersion: 8, state: { ...baseline(), signoff: { b: true } } });
  const [bOK, aOK] = await Promise.all([
    idbCompareAndSwap(db.connect(), DESK_KEY, original, b),
    idbCompareAndSwap(db.connect(), DESK_KEY, original, a),
  ]);
  assert.deepEqual([bOK, aOK], [true, false]);
  assert.equal(db.data.get(DESK_KEY), b);
  assert.equal(db.writes(), 1);
});


/**
 * R2-F-04-m: real Chromium, not a mocked transaction scheduler.
 * Two tabs share one origin and IndexedDB database but open separate native
 * IDBDatabase connections. The application CAS function is served by Vite.
 * Opt in via CHINAM_REAL_BROWSER_TEST=1; CI runs it as a dedicated step.
 */
test("R2-F-04-m: native Chromium two-tab CAS allows exactly one winner", {
  skip: process.env.CHINAM_REAL_BROWSER_TEST !== "1", timeout: 90_000,
}, async () => {
  const [{ chromium }, { createServer }] = await Promise.all([
    import("playwright"), import("vite"),
  ]);
  const server = await createServer({
    configFile: false,
    server: { host: "127.0.0.1", port: 0, strictPort: true },
    plugins: [{
      name: "chinam-f04-standalone-fixture",
      configureServer(vite) {
        vite.middlewares.use((req, res, next) => {
          if (req.url?.split("?")[0] !== "/__chinam_f04.html") return next();
          res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
          res.end("<!doctype html><html><head><title>F-04 native CAS</title></head><body>isolated IndexedDB test origin</body></html>");
        });
      },
    }],
  });
  let browser;
  try {
    await server.listen();
    const address = server.httpServer.address();
    assert.ok(address && typeof address === "object");
    const origin = "http://127.0.0.1:" + address.port;
    // GitHub's ubuntu-latest runner has Google Chrome installed; no dependency
    // or fixture data is added to the project for this browser integration.
    browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--no-sandbox"] });
    const context = await browser.newContext();
    const tabA = await context.newPage();
    const tabB = await context.newPage();
    await Promise.all([
      tabA.goto(origin + "/__chinam_f04.html"),
      tabB.goto(origin + "/__chinam_f04.html"),
    ]);
    const connect = (page) => page.evaluate(async () => {
      const module = await import("/src/foundation/storage.ts");
      globalThis.__chinamF04CAS = module.idbCompareAndSwap;
      globalThis.__chinamF04DB = await new Promise((resolve, reject) => {
        const request = globalThis.indexedDB.open("chinam", 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains("desk")) {
            request.result.createObjectStore("desk");
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("IndexedDB open blocked"));
      });
    });
    // Each page independently imports the production module and opens its own
    // native DB connection; both connections point to the same persistent store.
    await connect(tabA);
    await connect(tabB);

    const seed = JSON.stringify({ bookVersion: 7, version: 0, state: baseline() });
    const nextA = JSON.stringify({ bookVersion: 8, version: 0,
      state: { ...baseline(), signoff: { tabA: true } } });
    const nextB = JSON.stringify({ bookVersion: 8, version: 0,
      state: { ...baseline(), signoff: { tabB: true } } });
    const putSeed = () => tabA.evaluate(({ key, raw }) => new Promise((resolve, reject) => {
      const tx = globalThis.__chinamF04DB.transaction("desk", "readwrite");
      tx.objectStore("desk").put(raw, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    }), { key: DESK_KEY, raw: seed });
    const readBack = () => tabB.evaluate((key) => new Promise((resolve, reject) => {
      const tx = globalThis.__chinamF04DB.transaction("desk", "readonly");
      const request = tx.objectStore("desk").get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
      tx.onerror = () => reject(tx.error);
    }), DESK_KEY);
    const cas = (page, candidate) => page.evaluate(
      ({ key, expected, replacement }) =>
        globalThis.__chinamF04CAS(globalThis.__chinamF04DB, key, expected, replacement),
      { key: DESK_KEY, expected: seed, replacement: candidate },
    );

    // Both dispatch orders are tested without assuming which tab the browser
    // schedules first. Exactly one commit must win in each real-browser race.
    for (const order of [
      [{ page: tabA, candidate: nextA }, { page: tabB, candidate: nextB }],
      [{ page: tabB, candidate: nextB }, { page: tabA, candidate: nextA }],
    ]) {
      await putSeed();
      const results = await Promise.all(order.map(({ page, candidate }) => cas(page, candidate)));
      assert.equal(results.filter(Boolean).length, 1, "two browser tabs must never both commit");
      const winner = order.find((_entry, index) => results[index]);
      const loser = order.find((_entry, index) => !results[index]);
      assert.equal(await readBack(), winner.candidate, "durable bytes must belong to the winner");
      assert.equal(await cas(loser.page, loser.candidate), false, "stale retry must still lose");
      assert.equal(await readBack(), winner.candidate, "stale retry must not overwrite the winner");
    }

    // A version jump is rejected before opening any transaction.
    await assert.rejects(cas(tabA, JSON.stringify({
      bookVersion: 10, version: 0, state: baseline(),
    })), /bookVersion/u);
  } finally {
    await browser?.close();
    await server.close();
  }
});

test("R2v2-R-07: CI uses production Vite build without database migration", () => {
  const path = fileURLToPath(new URL("../../.github/workflows/chinam-stage1-verification.yml", import.meta.url));
  const yaml = readFileSync(path, "utf8");
  assert.match(yaml, /run: node scripts\/with-app-env\.mjs vite build(?:\n|$)/u);
  assert.doesNotMatch(yaml, /run: npm run build:dev/u);
  assert.doesNotMatch(yaml, /run: npm run db:migrate/u);
});

test("R2v2-R-03: no IndexedDB is read-only, export remains available and clear warning exists", async () => {
  const path = fileURLToPath(new URL("../components/shell.tsx", import.meta.url));
  const shell = readFileSync(path, "utf8");
  assert.match(shell, /Trình duyệt này không cho lưu sổ \(thường do chế độ ẩn danh\)/u);
  assert.match(shell, /Mọi thay đổi sẽ KHÔNG được lưu/u);
  assert.match(shell, /Hãy mở bằng cửa sổ thường/u);
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  await withBrowser(local, undefined, async () => {
    assert.equal(await durableStorage.getItem(DESK_KEY), legacyEnvelope());
    allowWritesAfterHydration();
    assert.equal(storageSnapshot().readOnly, true);
    assert.equal(storageSnapshot().ready, false);
    assert.equal(JSON.parse(await useDesk.getState().exportDesk()).schemaVersion, 2);
    assert.equal(local.getItem(FALLBACK_KEY), null);
  });
});

test("R2v2-R-04: failed IndexedDB read still exports exact legacy localStorage bytes with error metadata", async () => {
  const raw = legacyEnvelope();
  const local = fakeLocal({ [LEGACY_KEY]: raw });
  const indexed = fakeIndexed({ [DESK_KEY]: "unreadable-active" });
  await withBrowser(local, indexed.api, async () => {
    indexed.setFailReads(true);
    const copies = await readRawRecoveryCopies();
    const legacy = copies.find((item) => item.source === "localStorage:" + LEGACY_KEY);
    assert.equal(legacy?.raw, raw);
    const failure = copies.find((item) => item.source.startsWith("indexeddb: KHÔNG ĐỌC ĐƯỢC"));
    assert.ok(failure, "download must retain explicit IndexedDB failure notice");
    assert.equal(failure.raw, "");
    await assert.rejects(() => quarantineRawRecoveryCopies(), /Không thể đọc dữ liệu thô IndexedDB/u);
    assert.equal(indexed.data.get(DESK_KEY), "unreadable-active");
    assert.equal(indexed.calls.length, 0);
  });
});

test("R2v2-R-02: 3MB broken record quarantines in IndexedDB despite 1MB localStorage quota", async () => {
  const broken = "corrupt:" + "x".repeat(3_000_000);
  const backup = await useDesk.getState().exportDesk();
  const local = fakeLocal({ [LEGACY_KEY]: legacyEnvelope() });
  const set = local.setItem;
  local.setItem = (key, value) => {
    if (value.length > 1_000_000) throw new Error("QuotaExceededError");
    return set(key, value);
  };
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(local, indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    await recoverVerifiedBackup(backup);
    const quarantinedKey = [...indexed.data.keys()].find((key) => key.startsWith(QUARANTINE_PREFIX));
    assert.ok(quarantinedKey);
    const copies = JSON.parse(indexed.data.get(quarantinedKey));
    assert.equal(copies[0].raw.length, broken.length);
    assert.equal(copies[0].raw, broken);
    assert.equal([...local.map.keys()].filter((key) => key.startsWith(QUARANTINE_PREFIX)).length, 0);
    assert.equal(JSON.parse(indexed.data.get(DESK_KEY)).state.sha256, JSON.parse(backup).sha256);
  });
});

test("R2v2-R-01: 9328168-style V1 backup requires explicit recovery consent and records dated audit", async () => {
  // Commit 9328168 exported JSON.stringify(normalizePersisted(get()), null, 2):
  // no schemaVersion and no file-total sha256.
  const legacyBackup = JSON.stringify(baseline(), null, 2);
  const broken = "{corrupt-old-active";
  const indexed = fakeIndexed({ [DESK_KEY]: broken });
  await withBrowser(fakeLocal(), indexed.api, async () => {
    await assert.rejects(() => durableStorage.getItem(DESK_KEY));
    await assert.rejects(() => recoverVerifiedBackup(legacyBackup), /legacy-unverified/u);
    assert.equal(indexed.data.get(DESK_KEY), broken);
    await recoverVerifiedBackup(legacyBackup, true);
    const key = [...indexed.data.keys()].find((name) => name.startsWith(QUARANTINE_PREFIX));
    assert.ok(key);
    assert.equal(JSON.parse(indexed.data.get(key))[0].raw, broken);
    const restored = JSON.parse(indexed.data.get(DESK_KEY)).state;
    assert.equal(restored.schemaVersion, 2);
    assert.equal(restored.sha256, await hashJson(restored));
    const entry = restored.tamperImportApprovals.at(-1);
    assert.match(entry.note, /phục hồi từ bản cũ chưa kiểm/u);
    assert.match(entry.at, /^\\d{4}-\\d{2}-\\d{2}T/u);
  });
});

test("R2v2-R-05: imported forged approval is tagged and prior local consent is append-only", async () => {
  const legacy = JSON.parse(await useDesk.getState().exportDesk());
  delete legacy.schemaVersion;
  delete legacy.sha256;
  const first = await useDesk.getState().importDesk(JSON.stringify(legacy), true);
  assert.equal(first.ok, true);
  const local = useDesk.getState().tamperImportApprovals.at(-1);
  const forged = JSON.parse(await useDesk.getState().exportDesk());
  forged.tamperImportApprovals = [{
    at: "2020-01-01T00:00:00Z", note: "Owner xác nhận (GIẢ)",
    expectedHash: "", observedHash: "", source: "local",
  }];
  forged.sha256 = await hashJson(forged);
  assert.equal((await useDesk.getState().importDesk(JSON.stringify(forged))).ok, true);
  const history = useDesk.getState().tamperImportApprovals;
  assert.ok(history.some((row) => row.at === local.at && row.note === local.note && row.source === "local"));
  const imported = history.find((row) => row.note === "Owner xác nhận (GIẢ)");
  assert.equal(imported?.source, "imported");
  assert.equal(imported?.at, "2020-01-01T00:00:00Z");
  const path = fileURLToPath(new URL("../routes/index.tsx", import.meta.url));
  const jsx = readFileSync(path, "utf8");
  assert.match(jsx, /Nhật ký từ file nhập/u);
  assert.match(jsx, /Xác nhận thực hiện trên máy này/u);
});
