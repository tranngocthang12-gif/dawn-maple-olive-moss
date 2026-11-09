// The legacy JSON fixtures intentionally have shapes that strict TS rejects; runtime tests verify migration.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import * as reviewLogic from "./logic.ts";
import {
  emptyQuality,
  thesisBlockers,
  thesisReadiness,
  confidenceOf,
  independentSourceCount,
} from "./logic.ts";
import { useDesk } from "./store.ts";

const ENOUGH = "Nội dung có bằng chứng cụ thể và đủ dài để vượt cổng.";
const INSUFFICIENT = "CHƯA ĐỦ BẰNG CHỨNG";

function mandate(locked = true) {
  return {
    locked,
    lockedAt: locked ? "2026-11-01T00:00:00.000Z" : "",
    currency: "VND",
    horizon: "3 năm",
    universeInner: "Doanh nghiệp niêm yết thanh khoản đủ cho nghiên cứu.",
    universeOuter: "",
    leverage: "none",
    leverageNote: "",
    taxNote: "",
    liquidityNote: "",
    amendments: [],
  };
}
function world() {
  return {
    id: "w1", at: "2026-11-01T00:00:00.000Z", domain: "macro", name: "Lãi suất chính sách",
    geography: "Việt Nam", level: "4%", delta: "ổn định", acceleration: "không đổi", unit: "%",
    source: "Nguồn Thế giới A", tier: "t1", asOf: "2026-11-01", permitted: true, supersedes: "",
  };
}
function baseRate() {
  return {
    id: "br1", at: "2026-11-01T00:00:00.000Z", name: "Base rate mẫu",
    event: "Sự kiện được định nghĩa đủ dài để kiểm tra.", rateNote: "10% trên mẫu đã nêu",
    geography: "Việt Nam", period: "2010-2025", source: "Nguồn Base Rate A", tier: "t1",
    asOf: "2026-11-01", permitted: true, caveat: "Chỉ dùng cho đúng quần thể và khoảng thời gian này.", supersedes: "",
  };
}
function company() {
  return {
    id: "co1", createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
    status: "filed", name: "Công ty A", venue: "HOSE", standard: "VAS",
    standardNote: "VAS, không giả định tương đương IFRS.", business: "Doanh nghiệp bán sản phẩm cho khách hàng.",
    missingNote: "", facts: [], quality: emptyQuality(), sealId: "seal-1",
  };
}
function texts() {
  return {
    business: ENOUGH, industry: ENOUGH, position: ENOUGH, management: ENOUGH, financialQuality: ENOUGH,
    balanceSheet: ENOUGH, cashFlow: ENOUGH, capitalAllocation: ENOUGH, growth: ENOUGH, risks: ENOUGH,
    macro: ENOUGH, graph: ENOUGH, suppliers: ENOUGH, customers: ENOUGH, weakSignals: ENOUGH,
    marketBelieves: ENOUGH, difference: ENOUGH, valuation: ENOUGH, portfolioImpact: ENOUGH,
    bear: ENOUGH, contrary: ENOUGH, missing: ENOUGH, invalidation: ENOUGH,
  };
}
function thesis() {
  return {
    id: "t1", createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
    security: "AAA", venue: "HOSE", currency: "VND", horizon: "3 năm", texts: texts(),
    claims: [
      { id: "c1", text: "Sự thật đã kiểm tra từ nguồn thứ nhất.", klass: "fact", source: "Nguồn độc lập A", tier: "t1", asOf: "2026-11-01", unit: "VND", permitted: true },
      { id: "c2", text: "Dữ liệu đã kiểm tra từ nguồn thứ hai.", klass: "data", source: "Nguồn độc lập B", tier: "t2", asOf: "2026-11-01", unit: "%", permitted: true },
    ],
    scenarios: [
      { name: "bull", probability: 25, returnPct: 20, narrative: ENOUGH, catalyst: "", revenue: "", margin: "", multiple: "", fairValue: "", risk: "" },
      { name: "base", probability: 25, returnPct: 10, narrative: ENOUGH, catalyst: "", revenue: "", margin: "", multiple: "", fairValue: "", risk: "" },
      { name: "bear", probability: 25, returnPct: -10, narrative: ENOUGH, catalyst: "", revenue: "", margin: "", multiple: "", fairValue: "", risk: "" },
      { name: "tail", probability: 25, returnPct: -30, narrative: ENOUGH, catalyst: "", revenue: "", margin: "", multiple: "", fairValue: "", risk: "" },
    ],
    kills: [
      { id: "k1", text: "Tiêu chí hủy thứ nhất đủ dài.", threshold: "10%" },
      { id: "k2", text: "Tiêu chí hủy thứ hai đủ dài.", threshold: "20%" },
      { id: "k3", text: "Tiêu chí hủy thứ ba đủ dài.", threshold: "30%" },
    ],
    checks: { independentSources: 2, baseRateCited: true, contraryConsidered: true, notBecauseProse: true },
    ownerCapitalNote: "", ring: "inner", baseRateId: "br1", baseRateSearchNote: "", worldIds: ["w1"],
    companyId: "co1", priorSeenIds: [], supersedes: "", amendments: [],
  };
}
function ctx(locked = true) {
  return { mandate: mandate(locked), world: [world()], baseRates: [baseRate()], companies: [company()], decisions: [] };
}
function decisionInput(thesisId, action) {
  return {
    security: "AAA", priceNote: "Giá giấy tại thời điểm quyết định.", action, thesisId, expectedReturn: "5%",
    probabilityNote: "Xác suất lấy từ bốn kịch bản.", risk: "Rủi ro đã nêu trong thesis.",
    sizeNote: "Chỉ là ghi chú, không phải lệnh.", catalyst: "Chất xúc tác đã được ghi.",
    invalidation: "Điều kiện hủy đã được ghi.", alternativeView: "Quan điểm đối lập đã được ghi.",
    override: false, overrideReason: "",
  };
}
function putThesis(t, locked = true) {
  useDesk.setState({
    theses: [t], decisions: [], ledger: [], signoff: {}, activeThesisId: t.id, mandate: mandate(locked),
    world: [world()], baseRates: [baseRate()], companies: [company()], companySeals: [], signals: [],
  });
}

describe("Giai đoạn 1 — vá cổng kỷ luật", { concurrency: false }, () => {
  beforeEach(() => {
    useDesk.setState({ theses: [], decisions: [], ledger: [], signoff: {}, activeThesisId: null, mandate: mandate(true), world: [world()], baseRates: [baseRate()], companies: [company()], companySeals: [], signals: [] });
  });

  test("a) 23 mục + 4 diễn giải chỉ CHƯA ĐỦ, ngưỡng x%, 0 nguồn => không sẵn sàng", () => {
    const t = thesis();
    for (const key of Object.keys(t.texts)) t.texts[key] = INSUFFICIENT;
    t.claims = [{ id: "h1", text: "Giả thuyết chưa có nguồn độc lập.", klass: "hypothesis", source: "", tier: "none", asOf: "", unit: "", permitted: false }];
    t.scenarios = t.scenarios.map((s) => ({ ...s, narrative: INSUFFICIENT }));
    t.kills = t.kills.map((k) => ({ ...k, threshold: "x%" }));
    assert.ok(thesisBlockers(t, ctx()).length > 0);
    assert.equal(thesisReadiness(t, ctx()), "draft");
  });

  test("b) stored-ready legacy thesis + mandate unlocked => paper without override rejected", () => {
    const t = { ...thesis(), status: "ready" };
    putThesis(t, false);
    assert.equal(useDesk.getState().addDecision(decisionInput(t.id, "paper")).ok, false);
  });

  test("c1) cannot invalidate by generic patch without reason", () => {
    const t = thesis();
    putThesis(t);
    useDesk.getState().updateThesis(t.id, { status: "invalidated" });
    assert.equal(useDesk.getState().theses[0].status, undefined);
  });

  test("c2) invalidation needs >=12 chars, appends amendment, then thesis is immutable", () => {
    const t = thesis();
    putThesis(t);
    assert.equal(useDesk.getState().invalidateThesis(t.id, "quá ngắn").ok, false);
    const reason = "Bằng chứng mới phá vỡ giả thuyết cốt lõi.";
    assert.equal(useDesk.getState().invalidateThesis(t.id, reason).ok, true);
    const closed = useDesk.getState().theses[0];
    assert.equal(closed.status, "invalidated");
    assert.ok(closed.amendments.some((a) => a.note.includes(reason) && a.at.length >= 20));
    useDesk.getState().updateThesis(t.id, { security: "BBB" });
    useDesk.getState().patchText(t.id, "industry", "Bị sửa sau hủy");
    const stillClosed = useDesk.getState().theses[0];
    assert.equal(stillClosed.security, "AAA");
    assert.notEqual(stillClosed.texts.industry, "Bị sửa sau hủy");
  });

  test("c3) successor is new blank thesis with supersedes, old remains invalidated", () => {
    const t = thesis();
    putThesis(t);
    assert.equal(useDesk.getState().invalidateThesis(t.id, "Lý do hủy đủ dài để khóa bản cũ.").ok, true);
    const result = useDesk.getState().createSuccessor(t.id);
    assert.equal(result.ok, true);
    const next = useDesk.getState().theses.find((x) => x.id === result.id);
    assert.equal(next.supersedes, t.id);
    assert.equal(next.status, undefined);
    assert.equal(next.security, "");
    assert.equal(useDesk.getState().theses.find((x) => x.id === t.id).status, "invalidated");
  });

  test("d) thin-ready cannot record hold", () => {
    const t = thesis();
    t.texts.industry = INSUFFICIENT;
    assert.equal(thesisReadiness(t, ctx()), "thin-ready");
    putThesis(t, true);
    assert.equal(useDesk.getState().addDecision(decisionInput(t.id, "hold")).ok, false);
  });

  test("base-rate checkbox is legacy only; >=30-char search note is accepted", () => {
    const t = thesis();
    t.baseRateId = "";
    t.checks.baseRateCited = true;
    t.baseRateSearchNote = "";
    const noRate = { ...ctx(), baseRates: [] };
    assert.ok(thesisBlockers(t, noRate).some((x) => x.toLowerCase().includes("base rate")));
    t.baseRateSearchNote = "Đã tìm ở báo cáo ngành chính thức, nhưng chưa thấy base rate dùng được.";
    assert.ok(t.baseRateSearchNote.trim().length >= 30);
    assert.equal(thesisBlockers(t, noRate).some((x) => x.toLowerCase().includes("base rate")), false);
  });

  test("MEDIUM counts distinct usable sources from claims, ignores manual legacy count", () => {
    const t = thesis();
    t.claims = [t.claims[0]];
    t.checks.independentSources = 99;
    assert.equal(independentSourceCount(t), 1);
    assert.equal(confidenceOf(t, ctx()).level, "LOW");
    t.claims.push({ id: "c-new", text: "Dữ liệu từ nguồn độc lập thứ hai.", klass: "data", source: "Nguồn độc lập C", tier: "t2", asOf: "2026-11-01", unit: "%", permitted: true });
    assert.equal(independentSourceCount(t), 2);
    assert.equal(confidenceOf(t, ctx()).level, "MEDIUM");
  });

  test("e) legacy persisted status=ready migrates data intact and drops stored ready label", async () => {
    const legacy = { ...thesis(), status: "ready" };
    legacy.security = "";
    legacy.texts.industry = "Dòng cũ phải được giữ nguyên sau di trú.";
    const originalOptions = useDesk.persist.getOptions();
    const storage = {
      getItem: () => ({ state: { theses: [legacy], decisions: [], ledger: [], signoff: {}, activeThesisId: legacy.id, mandate: mandate(true), world: [world()], baseRates: [baseRate()], companies: [company()], companySeals: [], signals: [] }, version: 0 }),
      setItem: () => undefined,
      removeItem: () => undefined,
    };
    useDesk.persist.setOptions({ storage });
    try { await useDesk.persist.rehydrate(); } finally { useDesk.persist.setOptions(originalOptions); }
    const loaded = useDesk.getState().theses[0];
    assert.equal(loaded.texts.industry, legacy.texts.industry);
    assert.equal(loaded.claims.length, legacy.claims.length);
    assert.equal(loaded.status, undefined);
    assert.equal(thesisReadiness(loaded, ctx()), "draft");
  });
});

test("CHƯA ĐỦ appears in any one of six forbidden text fields => blocked", () => {
  for (const key of ["business", "risks", "bear", "contrary", "invalidation", "valuation"]) {
    const t = thesis();
    t.texts[key] = "Bản nháp với đoạn CHƯA ĐỦ BẰNG CHỨNG được chèn thêm.";
    assert.equal(thesisReadiness(t, ctx()), "draft", key);
  }
});

test("thin-ready cannot hold even when manual override is switched on", () => {
  const t = thesis();
  t.texts.industry = INSUFFICIENT;
  putThesis(t);
  const form = decisionInput(t.id, "hold");
  form.override = true;
  form.overrideReason = "Đã xem xét nhưng vẫn không đủ để giữ.";
  assert.equal(useDesk.getState().addDecision(form).ok, false);
});

test("duplicate source, invalid claim, and tier three never inflate MEDIUM", () => {
  const t = thesis();
  t.claims = [
    t.claims[0],
    { ...t.claims[0], id: "duplicate", source: "  nguồn  ĐỘC LẬP A " },
    { ...t.claims[0], id: "tier3", source: "Nguồn 3", tier: "t3" },
    { ...t.claims[0], id: "no-text", source: "Nguồn thứ hai", text: "" },
    { ...t.claims[0], id: "no-date", source: "Nguồn thứ ba", asOf: "" },
  ];
  assert.equal(independentSourceCount(t), 1);
  assert.equal(confidenceOf(t, ctx()).level, "LOW");
});

test("base rate search note with 30 characters but no search/no-find meaning does not unlock", () => {
  const t = thesis();
  t.baseRateId = "";
  t.baseRateSearchNote = "Một đoạn văn dài không hề nói đến việc đã tìm ở đâu và chưa thấy gì.".replace("đã tìm", "đâu")
    .replace("chưa thấy", "ở nơi đó");
  assert.ok(t.baseRateSearchNote.length >= 30);
  assert.ok(thesisBlockers(t, { ...ctx(), baseRates: [] }).some((reason) => reason.toLowerCase().includes("base rate")));
});

// Regression tests for independent Stage-1 review, Lệnh #1.2.
test("M1-a: no contrary-evidence confirmation stays draft", () => {
  const t = thesis();
  t.checks.contraryConsidered = false;
  assert.equal(thesisReadiness(t, ctx()), "draft");
  assert.equal(confidenceOf(t, ctx()).level, "LOW");
});

test("M1-b: no prose-confidence confirmation stays draft", () => {
  const t = thesis();
  t.checks.notBecauseProse = false;
  assert.equal(thesisReadiness(t, ctx()), "draft");
  assert.equal(confidenceOf(t, ctx()).level, "LOW");
});

test("M1-c: both confirmations with two valid sources and base rate allow ready MEDIUM", () => {
  const t = thesis();
  assert.equal(thesisReadiness(t, ctx()), "ready");
  assert.equal(confidenceOf(t, ctx()).level, "MEDIUM");
  t.checks.contraryConsidered = false;
  assert.equal(confidenceOf(t, ctx()).level, "LOW");
  t.checks.contraryConsidered = true;
  t.checks.notBecauseProse = false;
  assert.equal(confidenceOf(t, ctx()).level, "LOW");
});

test("M2-a: kill recorded after invalidation without override retains invalidated thesisSnapshot", () => {
  const t = thesis();
  putThesis(t);
  assert.equal(useDesk.getState().invalidateThesis(t.id, "Thông tin mới vi phạm tiêu chí hủy đã định trước.").ok, true);
  const result = useDesk.getState().addDecision(decisionInput(t.id, "kill"));
  assert.equal(result.ok, true);
  const recorded = useDesk.getState().decisions[0];
  assert.equal(recorded.action, "kill");
  assert.equal(recorded.override, false);
  assert.equal(recorded.thesisSnapshot.status, "invalidated");
});

test("M2-b: invalidated thesis rejects paper even with override", () => {
  const t = thesis();
  putThesis(t);
  useDesk.getState().invalidateThesis(t.id, "Thông tin mới vi phạm tiêu chí hủy đã định trước.");
  const form = decisionInput(t.id, "paper");
  form.override = true;
  form.overrideReason = "Lý do giải trình ghi đè rất đầy đủ.";
  assert.equal(useDesk.getState().addDecision(form).ok, false);
});

test("M2-c: invalidated thesis rejects hold even with override", () => {
  const t = thesis();
  putThesis(t);
  useDesk.getState().invalidateThesis(t.id, "Thông tin mới vi phạm tiêu chí hủy đã định trước.");
  const form = decisionInput(t.id, "hold");
  form.override = true;
  form.overrideReason = "Lý do giải trình ghi đè rất đầy đủ.";
  assert.equal(useDesk.getState().addDecision(form).ok, false);
});

test("M3: insufficient marker plus unlocked mandate cannot hold with override", () => {
  const t = thesis();
  t.texts.industry = INSUFFICIENT;
  putThesis(t, false);
  const form = decisionInput(t.id, "hold");
  form.override = true;
  form.overrideReason = "Đã xem xét override có lý do đủ dài.";
  assert.equal(useDesk.getState().addDecision(form).ok, false);
});

test("N4-a: lowercase business phrase is not an uppercase insufficient marker", () => {
  const t = thesis();
  t.texts.risks = "Dòng tiền hoạt động chưa đủ trả nợ vay ngắn hạn";
  assert.equal(reviewLogic.insufficientTextCount(t), 0);
  assert.equal(thesisReadiness(t, ctx()), "ready");
});

test("N4-b: NFD uppercase marker in risk text blocks readiness", () => {
  const t = thesis();
  t.texts.risks = INSUFFICIENT.normalize("NFD");
  assert.equal(thesisReadiness(t, ctx()), "draft");
});

test("N4-c: NFD uppercase marker in graph text produces thin-ready", () => {
  const t = thesis();
  t.texts.graph = INSUFFICIENT.normalize("NFD");
  assert.equal(reviewLogic.insufficientTextCount(t), 1);
  assert.equal(thesisReadiness(t, ctx()), "thin-ready");
});

test("N4-d: NFD marker for macro text is recognized without world observation", () => {
  const t = thesis();
  t.worldIds = [];
  t.texts.macro = INSUFFICIENT.normalize("NFD");
  assert.equal(thesisReadiness(t, ctx()), "thin-ready");
});

test("N4-e: NFD marker in company missingNote opens the documented thin-file route", () => {
  const c = company();
  c.missingNote = INSUFFICIENT.normalize("NFD");
  assert.deepEqual(reviewLogic.companyFileIssues(c), []);
});

test("L1: narrative containing uppercase marker within longer text blocks readiness", () => {
  const t = thesis();
  t.scenarios[0].narrative = "CHƯA ĐỦ BẰNG CHỨNG, cần thêm số liệu quý 3";
  assert.equal(thesisReadiness(t, ctx()), "draft");
});

test("L2-a: searched and did not find base rate with không thấy is acceptable", () => {
  const t = thesis();
  t.baseRateId = "";
  t.baseRateSearchNote = "Đã tra cứu trên HOSE và SSC, không thấy tỷ lệ nào cho ngành này";
  assert.equal(reviewLogic.baseRateSatisfied(t, { ...ctx(), baseRates: [] }), true);
});

test("L2-b: NFD search note with không thấy is accepted after NFC normalization", () => {
  const t = thesis();
  t.baseRateId = "";
  t.baseRateSearchNote = "Đã tra cứu trên HOSE và SSC, không thấy tỷ lệ nào cho ngành này".normalize("NFD");
  assert.equal(reviewLogic.baseRateSatisfied(t, { ...ctx(), baseRates: [] }), true);
});

test("L2-c: generic baserate guess without search statement fails closed", () => {
  const t = thesis();
  t.baseRateId = "";
  t.baseRateSearchNote = "Base rate này tôi nghĩ khoảng ba mươi phần trăm";
  assert.equal(reviewLogic.baseRateSatisfied(t, { ...ctx(), baseRates: [] }), false);
});

const deskComponentFile = fileURLToPath(new URL("../components/thesis-desk.tsx", import.meta.url));
test("M1 UI: both original blocker-only checkboxes remain editable", { skip: !existsSync(deskComponentFile) }, () => {
  const src = readFileSync(deskComponentFile, "utf8");
  assert.match(src, /checked=\{thesis\.checks\.contraryConsidered\}/);
  assert.match(src, /checked=\{thesis\.checks\.notBecauseProse\}/);
  assert.match(src, /Đã đọc bằng chứng trái, không chỉ phần ủng hộ\./);
  assert.match(src, /Độ tin cậy này không đến từ việc đoạn văn nghe chắc\./);
});

test("CI production smoke: vite build", { skip: process.env.GITHUB_ACTIONS !== "true" }, () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const viteCli = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
  const run = spawnSync(process.execPath, [viteCli, "build"], { cwd: root, encoding: "utf8", timeout: 180_000 });
  if (run.stdout) console.log(run.stdout);
  if (run.stderr) console.error(run.stderr);
  assert.equal(run.error, undefined, "vite build failed to start");
  assert.equal(run.status, 0, "vite build failed (status " + run.status + "): " + (run.stderr ?? ""));
});
