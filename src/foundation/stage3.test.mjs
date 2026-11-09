// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { bayesPosterior, scenarioSum, expectedReturn, kellyReference, monteCarlo, claimIssues, companyFileIssues, signalAliveIssues, emptyQuality } from "./logic.ts";

test("stage3: Bayes updates likelihood ratio and refuses impossible priors", () => {
  assert.equal(bayesPosterior(50, 2), 66.7);
  assert.equal(bayesPosterior(0, 2), null);
  assert.equal(bayesPosterior(100, 2), null);
  assert.equal(bayesPosterior(50, -1), null);
});
test("stage3: scenario sum and expected return distinguish absent inputs", () => {
  const scenarios = [10, 20, -10, 0].map((returnPct) => ({ probability: 25, returnPct }));
  assert.equal(scenarioSum(scenarios), 100);
  assert.equal(expectedReturn(scenarios), 5);
  assert.equal(scenarioSum([{ probability: null, returnPct: 5 }]), null);
  assert.equal(expectedReturn([{ probability: 100, returnPct: null }]), null);
});
test("stage3: Kelly returns reference not execution sizing, rejects invalid inputs", () => {
  const value = kellyReference(55, 1, 0.5, 50);
  assert.equal(value.ok, true);
  assert.equal(value.full, 10);
  assert.equal(value.adjustedQuarter, 1.3);
  assert.equal(kellyReference(100, 1, 0.5, 50).ok, false);
  assert.equal(kellyReference(55, 0, 0.5, 50).ok, false);
});
test("stage3: seeded Monte Carlo preserves historical numerical regression", () => {
  const result = monteCarlo({ eps: 1, years: 5, gMean: 8 / 100, gSd: 4 / 100,
    marginMean: 12 / 100, marginSd: 2 / 100, marginBase: 12 / 100,
    peMean: 12, peSd: 3, price: 15, seed: 7, n: 3000 });
  assert.equal(result.p50, 16.7);
  assert.equal(result.shareAbove, 61.5);
  assert.equal(result.n, 3000);
  assert.ok(result.clippedPct >= 0 && result.clippedPct <= 100);
  assert.equal(result.bins.reduce((total, bin) => total + bin.count, 0), 3000);
});
test("stage3: Monte Carlo clipping is counted per path and deterministic path has no clipping", () => {
  const base = { eps: 1, years: 5, gMean: 0.08, gSd: 0, marginMean: 0.12, marginSd: 0,
    marginBase: 0.12, peMean: 12, peSd: 0, price: 15, seed: 7, n: 3000 };
  const one = monteCarlo(base); assert.equal(one.degenerate, true); assert.equal(one.clippedPct, 0);
  const clipped = monteCarlo({ ...base, gMean: 3, marginMean: -1, peMean: 100 });
  assert.equal(clipped.clippedPct, 100);
});
test("stage3: claim fact requires available evidence and permission", () => {
  const invalid = { text: "Test claim", klass: "fact", source: "", tier: "none", asOf: "", permitted: false };
  assert.ok(claimIssues(invalid).length >= 2);
  assert.deepEqual(claimIssues({ ...invalid, source: "Public primary source", tier: "t1", asOf: "2026-11-01", permitted: true }), []);
});
test("stage3: company file requires report basis, facts or explicit insufficient evidence", () => {
  const c = { name: "Test company", venue: "HOSE", standard: "VAS",
    standardNote: "VAS test accounting basis", business: "Synthetic business operating model",
    missingNote: "", facts: [], quality: emptyQuality() };
  assert.ok(companyFileIssues(c).length >= 2);
  assert.deepEqual(companyFileIssues({ ...c, missingNote: "CHƯA ĐỦ BẰNG CHỨNG: fixtures are not evidence" }), []);
});
test("stage3: signal registration checks causal rights, latency and failure criteria", () => {
  const signal = { family: "physical", hypothesis: "Testable causal hypothesis",
    mechanism: "Specific causal mechanism", lag: "three months", death: "Observable condition that invalidates signal",
    rights: "Dữ liệu hợp pháp và nguồn công khai có quyền sử dụng", rightsOk: true };
  assert.deepEqual(signalAliveIssues(signal), []);
  assert.ok(signalAliveIssues({ ...signal, rightsOk: false }).length > 0);
  assert.ok(signalAliveIssues({ ...signal, family: "invalid" }).length > 0);
});
test("stage3: probability input uses percent labels, rejects 800 and blank values, warns on clipping", () => {
  const path = fileURLToPath(new URL("../components/probability-bench.tsx", import.meta.url));
  const source = readFileSync(path, "utf8");
  assert.match(source, /gMean: growth \/ 100/u);
  assert.match(source, /growth > 200/u);
  assert.match(source, /Number\.isFinite/u);
  assert.match(source, /Đầu vào ngoài khoảng, kết quả không dùng được/u);
  assert.match(source, /mc\.clippedPct > 5/u);
  assert.match(source, /Kết quả phụ thuộc hoàn toàn vào phân phối tự nhập, chưa hiệu chỉnh/u);
});
