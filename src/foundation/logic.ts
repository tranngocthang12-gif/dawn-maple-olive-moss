import type {
  BaseRate,
  Claim,
  CompanyFile,
  CompanySeal,
  ConfidenceChecks,
  Decision,
  EvidenceClass,
  Mandate,
  QualityId,
  QualityRow,
  Scenario,
  Signal,
  SourceTier,
  Thesis,
  ThesisReadiness,
  ThesisTexts,
  WorldObs,
} from "./types.ts";
import { sensors } from "./doctrine.ts";

export const caps = {
  theses: 40,
  decisions: 200,
  ledger: 200,
  world: 200,
  baseRates: 200,
  companies: 40,
  facts: 80,
  signals: 80,
  seals: 200,
} as const;

export const fullBook = "Sổ này đã đầy. Hãy tải sổ về máy trước. Hệ thống không xóa dòng cũ để lấy chỗ.";

export function sealFromCompany(c: CompanyFile, filedAt: string, id: string, sealed: boolean): CompanySeal {
  return {
    id,
    companyId: c.id,
    filedAt,
    sealed,
    name: c.name,
    venue: c.venue,
    standard: c.standard,
    standardNote: c.standardNote,
    business: c.business,
    missingNote: c.missingNote,
    facts: c.facts.map((f) => ({ ...f })),
    quality: structuredClone(c.quality ?? emptyQuality()),
  };
}

export const TEXT_KEYS: { key: keyof ThesisTexts; step: string; label: string }[] = [
  { key: "business", step: "2", label: "Mô hình kinh doanh" },
  { key: "industry", step: "3", label: "Ngành" },
  { key: "position", step: "4", label: "Vị thế cạnh tranh" },
  { key: "management", step: "5", label: "Ban lãnh đạo" },
  { key: "financialQuality", step: "6", label: "Chất lượng tài chính" },
  { key: "balanceSheet", step: "7", label: "Bảng cân đối" },
  { key: "cashFlow", step: "8", label: "Dòng tiền" },
  { key: "capitalAllocation", step: "9", label: "Phân bổ vốn" },
  { key: "growth", step: "10", label: "Động lực tăng trưởng" },
  { key: "risks", step: "11", label: "Rủi ro" },
  { key: "macro", step: "12", label: "Phơi nhiễm vĩ mô" },
  { key: "graph", step: "13", label: "Đồ thị kinh tế" },
  { key: "suppliers", step: "14", label: "Tín hiệu nhà cung cấp" },
  { key: "customers", step: "15", label: "Tín hiệu khách hàng" },
  { key: "weakSignals", step: "16", label: "Tín hiệu yếu" },
  { key: "marketBelieves", step: "17", label: "Thị trường đang tin gì" },
  { key: "difference", step: "17", label: "Ta tin khác ở đâu" },
  { key: "valuation", step: "18", label: "Định giá — ghi chú, không phải giá mục tiêu" },
  { key: "portfolioImpact", step: "20", label: "Tác động danh mục" },
  { key: "bear", step: "21", label: "Luận điểm phe bán" },
  { key: "contrary", step: "21", label: "Bằng chứng chống lại" },
  { key: "missing", step: "15-out", label: "Thông tin còn thiếu" },
  { key: "invalidation", step: "22", label: "Điều kiện hủy thesis" },
];

const MIN = 12;
const FORBIDDEN_INSUFFICIENT_KEYS = new Set<keyof ThesisTexts>([
  "business",
  "risks",
  "bear",
  "contrary",
  "invalidation",
  "valuation",
]);

export function hasInsufficientMarker(value: string): boolean {
  return value.normalize("NFC").includes("CHƯA ĐỦ");
}

export function insufficientTextCount(t: Thesis): number {
  return TEXT_KEYS.filter((field) => field.key !== "missing" && hasInsufficientMarker(t.texts?.[field.key] ?? "")).length;
}

export function independentSourceCount(t: Thesis): number {
  const sources = new Set<string>();
  for (const claim of t.claims ?? []) {
    if (claim.klass !== "fact" && claim.klass !== "data") continue;
    if (!claim.text.trim() || !recordUsable(claim) || claimIssues(claim).length > 0) continue;
    sources.add(claim.source.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " "));
  }
  return sources.size;
}

export function emptyTexts(): ThesisTexts {
  return {
    business: "",
    industry: "",
    position: "",
    management: "",
    financialQuality: "",
    balanceSheet: "",
    cashFlow: "",
    capitalAllocation: "",
    growth: "",
    risks: "",
    macro: "",
    graph: "",
    suppliers: "",
    customers: "",
    weakSignals: "",
    marketBelieves: "",
    difference: "",
    valuation: "",
    portfolioImpact: "",
    bear: "",
    contrary: "",
    missing: "",
    invalidation: "",
  };
}

export function defaultScenarios(): Scenario[] {
  const names = ["bull", "base", "bear", "tail"] as const;
  return names.map((name) => ({
    name,
    probability: null,
    returnPct: null,
    narrative: "",
    catalyst: "",
    revenue: "",
    margin: "",
    multiple: "",
    fairValue: "",
    risk: "",
  }));
}

export function bayesPosterior(priorPct: number, lr: number): number | null {
  if (!Number.isFinite(priorPct) || !Number.isFinite(lr)) return null;
  if (lr <= 0) return null;
  const p = priorPct / 100;
  if (p <= 0 || p >= 1) return null;
  const odds = (p / (1 - p)) * lr;
  const post = odds / (1 + odds);
  return Math.round(post * 1000) / 10;
}

export function scenarioSum(scenarios: Scenario[]): number | null {
  if (scenarios.some((s) => s.probability === null || !Number.isFinite(s.probability))) return null;
  const sum = scenarios.reduce((a, s) => a + (s.probability ?? 0), 0);
  return Math.round(sum * 10) / 10;
}

export function expectedReturn(scenarios: Scenario[]): number | null {
  if (scenarioSum(scenarios) === null) return null;
  if (scenarios.some((s) => s.returnPct === null || !Number.isFinite(s.returnPct))) return null;
  const ev = scenarios.reduce((a, s) => a + ((s.probability ?? 0) / 100) * (s.returnPct ?? 0), 0);
  return Math.round(ev * 10) / 10;
}

export function scenarioWarnings(scenarios: Scenario[]): string[] {
  const warnings: string[] = [];
  const probs = scenarios.map((s) => s.probability);
  if (probs.every((p) => p === 25)) warnings.push("Bốn xác suất bằng 25% thường là dấu hiệu chưa có luận điểm, không phải một tiên nghiệm trung tính.");
  const bull = scenarios.find((s) => s.name === "bull");
  const bear = scenarios.find((s) => s.name === "bear");
  if (bull && bear && bull.returnPct !== null && bear.returnPct !== null && bull.returnPct < bear.returnPct) {
    warnings.push("Lợi nhuận kịch bản tăng đang thấp hơn kịch bản giảm. Kiểm tra lại dấu.");
  }
  const tail = scenarios.find((s) => s.name === "tail");
  if (tail?.probability === 0) warnings.push("Xác suất đuôi bằng 0 là một giả định mạnh, không phải một kết quả đo được.");
  return warnings;
}

function filled(s: string): boolean {
  return s.trim().length >= MIN;
}

export function claimIssues(c: Claim): string[] {
  const issues: string[] = [];
  if (!c.text.trim()) issues.push("Nội dung trống.");
  if ((c.klass === "fact" || c.klass === "data") && !c.permitted) issues.push("Sự thật hoặc dữ liệu đòi hỏi xác nhận nguồn được phép dùng và không phải thông tin nội gián.");
  if ((c.klass === "fact" || c.klass === "data") && (!c.source.trim() || c.tier === "none" || !c.asOf)) issues.push("Sự thật hoặc dữ liệu cần nguồn, tầng nguồn, và thời điểm thị trường có thể đã biết.");
  if ((c.klass === "fact" || c.klass === "data") && (c.tier === "t4" || c.tier === "t5")) issues.push("Tầng 4–5 không đủ để gắn nhãn sự thật hoặc dữ liệu.");
  if (c.klass === "forecast" && c.tier === "none") issues.push("Dự báo vẫn phải ghi nguồn của giả định.");
  return issues;
}

export function recordUsable(row: { tier: SourceTier; permitted: boolean; source: string; asOf: string }): boolean {
  return row.permitted && (row.tier === "t1" || row.tier === "t2") && row.source.trim().length >= 3 && row.asOf.trim().length >= 8;
}

export const qualityItems: { id: QualityId; label: string; ask: string }[] = [
  { id: "receivables", label: "Phải thu", ask: "Phải thu có chạy nhanh hơn doanh thu không? Nguồn nào, kỳ nào?" },
  { id: "inventory", label: "Tồn kho", ask: "Vòng quay, giảm giá, và hàng chậm. Một tỷ lệ không phải kết luận." },
  { id: "accruals", label: "Dồn tích", ask: "Lợi nhuận và tiền lệch về phía nào, trong mấy kỳ?" },
  { id: "capitalization", label: "Vốn hóa chi phí", ask: "Cái gì được đưa vào tài sản thay vì chi phí kỳ này?" },
  { id: "related", label: "Bên liên quan", ask: "Với ai, điều khoản nào, có lệch giá độc lập không?" },
  { id: "dilution", label: "Pha loãng", ask: "Số cổ phiếu mới, quyền chọn, trái phiếu chuyển đổi. Đơn vị là cổ phiếu." },
  { id: "offbalance", label: "Ngoài bảng", ask: "Bảo lãnh, thuê, cam kết. Không gộp VAS với IFRS hay US GAAP." },
  { id: "auditor", label: "Kiểm toán", ask: "Đổi kiểm toán hoặc ý kiến không nguyên vẹn. Câu hỏi, chưa phải gian lận." },
  { id: "cfo", label: "CFO và vốn", ask: "Đổi CFO, cổ tức, mua lại, thâu tóm. Ghi sự kiện, không ghi ý định." },
];

export function emptyQuality(): Record<QualityId, QualityRow> {
  const row = (): QualityRow => ({ state: "open", note: "", source: "" });
  return {
    receivables: row(), inventory: row(), accruals: row(), capitalization: row(), related: row(), dilution: row(), offbalance: row(), auditor: row(), cfo: row(),
  };
}

export function companyFileIssues(c: CompanyFile): string[] {
  const b: string[] = [];
  if (c.name.trim().length < 2) b.push("Chưa có tên doanh nghiệp.");
  if (c.venue.trim().length < 2) b.push("Chưa có sàn hoặc nơi báo cáo.");
  if (!c.standard) b.push("Chưa chọn chuẩn báo cáo. VAS, IFRS và US GAAP không phải một thứ.");
  if (c.standardNote.trim().length < 12) b.push("Cần ghi chuẩn đang dùng và cái nó không so sánh được.");
  if (c.business.trim().length < 12) b.push("Chưa mô tả doanh nghiệp bán gì, cho ai.");
  const usable = c.facts.filter((f) => recordUsable(f) && f.text.trim().length >= 2);
  const thin = hasInsufficientMarker(c.missingNote) && c.missingNote.trim().length >= 12;
  if (usable.length === 0 && !thin) b.push("Chưa có sự kiện nguồn tầng 1 hoặc 2. Nếu chưa có, ghi CHƯA ĐỦ BẰNG CHỨNG.");
  const open = qualityItems.filter((q) => (c.quality?.[q.id]?.state ?? "open") === "open");
  if (open.length > 0 && !thin) b.push("Còn chiều chất lượng để ngỏ. Trả lời từng chiều, hoặc ghi CHƯA ĐỦ BẰNG CHỨNG.");
  for (const q of qualityItems) {
    const row = c.quality?.[q.id];
    if (!row || row.state === "open") continue;
    const min = row.state === "clear" ? 8 : 12;
    if (row.note.trim().length < min) b.push(`${q.label} cần ghi chú dài hơn. Một nhãn không phải bằng chứng.`);
    if (row.state === "clear" && row.source.trim().length < 3) b.push(`${q.label}: chưa thấy vấn đề vẫn phải có nguồn.`);
  }
  return b;
}

export function signalAliveIssues(s: Pick<Signal, "family" | "hypothesis" | "mechanism" | "lag" | "death" | "rights" | "rightsOk">): string[] {
  const b: string[] = [];
  if (!sensors.some((x) => x.id === s.family)) b.push("Chưa chọn họ cảm biến.");
  if (s.hypothesis.trim().length < 12) b.push("Giả thuyết quá ngắn. Viết điều sẽ sai nếu tín hiệu sai.");
  if (s.mechanism.trim().length < 12) b.push("Chưa có cơ chế nhân quả. Tương quan không đủ để cho sống.");
  if (s.lag.trim().length < 8) b.push("Chưa ghi độ trễ, và cửa sổ đó còn giao dịch được không.");
  if (s.death.trim().length < 12) b.push("Chưa viết cách tín hiệu này chết.");
  if (!s.rightsOk || s.rights.trim().length < 12) b.push("Chưa xác nhận dữ liệu được phép dùng và không phải thông tin nội gián.");
  if (s.family === "physical" && !s.rights.toLowerCase().includes("hợp pháp")) b.push("Cảm biến vật lý phải ghi vì sao việc thu thập là hợp pháp.");
  return b;
}

export type DeskCtx = {
  mandate: Mandate;
  world: WorldObs[];
  baseRates: BaseRate[];
  companies: CompanyFile[];
  decisions?: Decision[];
};

export function securityKey(name: string): string {
  return name.trim().toLocaleLowerCase("vi").replace(/\s+/g, " ");
}

export function priorDecisions(security: string, decisions: Decision[]): Decision[] {
  const key = securityKey(security);
  if (key.length < 2) return [];
  return (decisions ?? []).filter((d) => !d.voided && securityKey(d.security) === key);
}

export function baseRateSatisfied(t: Thesis, ctx: DeskCtx): boolean {
  const linked = ctx.baseRates.find((r) => r.id === (t.baseRateId ?? ""));
  if (linked && recordUsable(linked)) return true;
  const note = (t.baseRateSearchNote ?? "").normalize("NFC").trim();
  return note.length >= 30
    && /đã\s+(?:tìm|tra\s*cứu|kiểm\s*tra)/iu.test(note)
    && /(?:chưa|không)\s+(?:tìm\s+)?thấy/iu.test(note);
}

export function thesisBlockers(t: Thesis, ctx: DeskCtx): string[] {
  const b: string[] = [];
  if (!ctx.mandate.locked) b.push("Ủy thác chưa khóa. Hồ sơ không thể sẵn sàng.");
  const ring = t.ring ?? "";
  if (ring !== "inner" && ring !== "outer") b.push("Chưa chọn vành trong hoặc vành ngoài.");
  if (t.security.trim().length < 2) b.push("Chưa có danh tính chứng khoán.");
  const company = (ctx.companies ?? []).find((c) => c.id === (t.companyId ?? ""));
  if (!company || company.status !== "filed") b.push("Chưa gắn hồ sơ doanh nghiệp đã nộp. Có thể nộp với dòng CHƯA ĐỦ BẰNG CHỨNG, nhưng không được bỏ qua.");
  if (!t.venue.trim() || !t.horizon.trim()) b.push("Chưa có sàn và chân trời thời gian.");

  for (const field of TEXT_KEYS) {
    const value = t.texts?.[field.key] ?? "";
    if (!filled(value)) b.push(`Còn trống: ${field.label}. Có thể ghi CHƯA ĐỦ BẰNG CHỨNG.`);
    if (FORBIDDEN_INSUFFICIENT_KEYS.has(field.key) && hasInsufficientMarker(value)) {
      b.push(`${field.label} không được dùng CHƯA ĐỦ BẰNG CHỨNG để qua cổng.`);
    }
  }
  const insufficient = insufficientTextCount(t);
  if (insufficient > 8) b.push(`Có ${insufficient} mục CHƯA ĐỦ BẰNG CHỨNG; tối đa 8 mục, không tính Thông tin còn thiếu.`);

  const worldIds = t.worldIds ?? [];
  if (!hasInsufficientMarker(t.texts.macro) && worldIds.length === 0) b.push("Phơi nhiễm vĩ mô cần một quan sát Thế giới dùng được, hoặc ghi CHƯA ĐỦ BẰNG CHỨNG.");
  if (worldIds.some((id) => !ctx.world.some((w) => w.id === id && recordUsable(w)))) b.push("Có quan sát Thế giới được gắn nhưng chưa đủ nguồn tầng 1 hoặc 2.");
  if (!baseRateSatisfied(t, ctx)) b.push("Chưa gắn base rate dùng được, hoặc ghi chú chưa đạt: tối thiểu 30 ký tự, nêu đã tìm ở đâu và kết quả chưa/không thấy.");

  const prior = priorDecisions(t.security, ctx.decisions ?? []);
  const seen = new Set(t.priorSeenIds ?? []);
  const unseen = prior.filter((d) => !seen.has(d.id));
  if (unseen.length) b.push(`Có ${unseen.length} quyết định cũ của mã này chưa đọc lại. Cuộc trò chuyện mới không được kể từ đầu.`);
  if ((t.claims ?? []).length === 0) b.push("Chưa có claim nào được phân loại.");
  const badClaims = (t.claims ?? []).filter((c) => claimIssues(c).length > 0);
  if (badClaims.length) b.push("Có claim chưa đạt chuẩn phân loại — xem mục bằng chứng.");
  const substantive = (t.claims ?? []).some((c) => c.klass === "fact" || c.klass === "data" || c.klass === "inference" || c.klass === "hypothesis");
  if ((t.claims ?? []).length > 0 && !substantive) b.push("Mọi claim đều là chưa xác minh, chưa đủ, hoặc chỉ là dự báo. Thesis chưa có bằng chứng hoặc giả thuyết đã đặt tên.");

  const scenarios = t.scenarios ?? [];
  if (scenarios.length !== 4 || new Set(scenarios.map((scenario) => scenario.name)).size !== 4 ||
      ["bull", "base", "bear", "tail"].some((name) => !scenarios.some((scenario) => scenario.name === name))) {
    b.push("Bắt buộc có đủ bốn kịch bản phân biệt.");
  }
  const sum = scenarioSum(scenarios);
  if (sum === null) b.push("Bốn kịch bản chưa có đủ xác suất.");
  else if (Math.abs(sum - 100) > 0.2) b.push(`Tổng xác suất đang là ${sum}%, cần bằng 100%.`);
  for (const s of scenarios) {
    if (s.probability === null || !Number.isFinite(s.probability) || s.probability < 0 || s.probability > 100) b.push(`Kịch bản ${s.name}: xác suất không hợp lệ.`);
    if (!filled(s.narrative)) b.push(`Kịch bản ${s.name} chưa có diễn giải.`);
    else if (hasInsufficientMarker(s.narrative)) b.push(`Kịch bản ${s.name} không được chứa dấu CHƯA ĐỦ trong diễn giải.`);
    if (s.returnPct === null || !Number.isFinite(s.returnPct)) b.push(`Kịch bản ${s.name} chưa có mức lợi nhuận.`);
  }

  if ((t.kills ?? []).length < 3) {
    b.push("Cần ít nhất 3 tiêu chí hủy, mỗi tiêu chí có ngưỡng chứa ít nhất một chữ số.");
  } else {
    const invalidKill = t.kills.some((k) => !filled(k.text) || !/\d/.test(k.threshold));
    if (invalidKill) b.push("Mỗi tiêu chí hủy phải có mô tả đủ dài và ngưỡng chứa ít nhất một chữ số.");
  }
  if (!t.checks.contraryConsidered) b.push("Chưa xác nhận đã đọc bằng chứng trái chiều.");
  if (!t.checks.notBecauseProse) b.push("Chưa xác nhận độ tin cậy không đến từ văn phong.");
  return b;
}

export function thesisReadiness(t: Thesis, ctx: DeskCtx): ThesisReadiness {
  if (t.status === "invalidated") return "invalidated";
  if (thesisBlockers(t, ctx).length > 0) return "draft";
  return insufficientTextCount(t) > 0 ? "thin-ready" : "ready";
}

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export function confidenceOf(t: Thesis, ctx: DeskCtx): { level: ConfidenceLevel; lockedHigh: true; reasons: string[] } {
  const reasons: string[] = ["HIGH bị khóa đến khi Phase 7 có mẫu calibration. Khóa này là ràng buộc Foundation V1, không phải một đánh giá về văn phong."];
  const blockers = thesisBlockers(t, ctx);
  const sourceCount = independentSourceCount(t);
  const tierOk = t.claims.some((c) => (c.klass === "fact" || c.klass === "data") && recordUsable(c));
  const medium = blockers.length === 0 && sourceCount >= 2 && tierOk && baseRateSatisfied(t, ctx) && t.checks.contraryConsidered && t.checks.notBecauseProse;
  if (!medium) {
    if (sourceCount < 2) reasons.push("Chưa đủ hai nguồn độc lập do mã đếm từ claim Sự thật/Dữ liệu hợp lệ để lên MEDIUM.");
    if (!tierOk) reasons.push("Chưa có dữ liệu hoặc sự thật ở tầng 1 hoặc 2 được phép dùng.");
    if (blockers.length) reasons.push("Hồ sơ chưa qua cổng sẵn sàng.");
  } else {
    reasons.push("MEDIUM là trần ở Foundation V1. Hệ thống chưa được calibration.");
  }
  return { level: medium ? "MEDIUM" : "LOW", lockedHigh: true, reasons };
}

export function confidenceGaps(t: Thesis, ctx: DeskCtx): string[] {
  const gaps: string[] = [];
  const company = (ctx.companies ?? []).find((c) => c.id === (t.companyId ?? ""));
  if (company && hasInsufficientMarker(company.missingNote)) gaps.push("Hồ sơ doanh nghiệp đi theo đường chưa đủ bằng chứng.");
  if (company) {
    const open = qualityItems.filter((q) => (company.quality?.[q.id]?.state ?? "open") === "open");
    if (open.length) gaps.push(`Còn ${open.length} chiều chất lượng để ngỏ.`);
  }
  if (hasInsufficientMarker(t.texts?.macro ?? "")) gaps.push("Phần vĩ mô ghi chưa đủ bằng chứng, nên không buộc phải gắn một quan sát thế giới.");
  const linked = ctx.baseRates.find((r) => r.id === (t.baseRateId ?? ""));
  if (!(linked && recordUsable(linked)) && (t.baseRateSearchNote ?? "").trim().length >= 30) gaps.push("Không gắn base rate; hồ sơ chỉ có ghi chú đã tìm nhưng chưa thấy base rate dùng được.");
  if (t.scenarios.some((s) => s.returnPct !== null && Number.isFinite(s.returnPct))) gaps.push("Mức lời trong bốn kịch bản là số bạn tự nhập. Nó chưa có nguồn, và chưa được hiệu chỉnh.");
  const pending = priorDecisions(t.security, ctx.decisions ?? []).filter((d) => d.outcome === "pending" || d.outcome === "");
  if (pending.length) gaps.push(`${pending.length} quyết định của mã này chưa có kết quả. Chưa thể gọi đó là kinh nghiệm thắng hay thua.`);
  return gaps;
}

export function processScore(d: Decision): { score: number; parts: { label: string; got: boolean }[] } {
  const parts = [
    { label: "Gắn thesis hoặc ghi rõ là không có thesis", got: Boolean(d.thesisId) || d.action === "pass" || d.action === "observe" },
    { label: "Có điều kiện hủy", got: d.invalidation.trim().length >= MIN },
    { label: "Có quan điểm đối lập", got: d.alternativeView.trim().length >= MIN },
    { label: "Có chất xúc tác", got: d.catalyst.trim().length >= MIN },
    { label: "Có rủi ro", got: d.risk.trim().length >= MIN },
    { label: "Ghi chú kích thước không phải lệnh", got: d.sizeNote.trim().length >= MIN },
    { label: "Ghi chú xác suất", got: d.probabilityNote.trim().length >= MIN },
    { label: "Giá kèm thời điểm, hoặc ghi chưa có giá", got: d.priceNote.trim().length >= MIN },
    { label: "Nếu đảo quyết định thì có lý do", got: !d.override || d.overrideReason.trim().length >= MIN },
    { label: "Lợi nhuận kỳ vọng được ghi", got: d.expectedReturn.trim().length >= 1 },
  ];
  const score = Math.round((parts.filter((p) => p.got).length / parts.length) * 100);
  return { score, parts };
}

export type KellyResult = { ok: false; reason: string } | { ok: true; full: number; half: number; quarter: number; adjustedQuarter: number; negative: boolean };

export function kellyReference(winPct: number, payoffB: number, uncertainty: number, basePct: number): KellyResult {
  if (!Number.isFinite(winPct) || winPct <= 0 || winPct >= 100) return { ok: false, reason: "Xác suất thắng phải nằm trong khoảng (0, 100)." };
  if (!Number.isFinite(payoffB) || payoffB <= 0) return { ok: false, reason: "Tỷ lệ lời ròng b phải dương." };
  const u = Math.min(1, Math.max(0, uncertainty));
  const base = Math.min(99, Math.max(1, basePct));
  const p = winPct / 100;
  const q = 1 - p;
  const full = ((payoffB * p - q) / payoffB) * 100;
  const pAdj = (1 - u) * p + u * (base / 100);
  const qAdj = 1 - pAdj;
  const adj = ((payoffB * pAdj - qAdj) / payoffB) * 100;
  const round = (n: number) => Math.round(n * 10) / 10;
  return { ok: true, full: round(full), half: round(full / 2), quarter: round(full / 4), adjustedQuarter: round(adj / 4), negative: adj <= 0 };
}

export type McInput = { eps: number; years: number; gMean: number; gSd: number; marginMean: number; marginSd: number; marginBase: number; peMean: number; peSd: number; price: number; seed: number; n: number };
export type McResult = { n: number; p5: number; p25: number; p50: number; p75: number; p95: number; shareAbove: number; degenerate: boolean; bins: { x: string; count: number }[] };
function mulberry32(seed: number) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gaussian(rng: () => number) { let u = 0; let v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function quantile(sorted: number[], q: number) { const pos = (sorted.length - 1) * q; const base = Math.floor(pos); const rest = pos - base; const next = sorted[Math.min(sorted.length - 1, base + 1)] ?? sorted[base] ?? 0; return (sorted[base] ?? 0) * (1 - rest) + next * rest; }
export function monteCarlo(input: McInput): McResult { const n = Math.max(200, Math.min(8000, Math.floor(input.n))); const rng = mulberry32(input.seed || 1); const values: number[] = []; const baseMargin = input.marginBase === 0 ? 1 : input.marginBase; for (let i = 0; i < n; i++) { const g = Math.min(2, Math.max(-0.8, input.gMean + input.gSd * gaussian(rng))); const margin = Math.min(0.8, Math.max(0, input.marginMean + input.marginSd * gaussian(rng))); const pe = Math.min(80, Math.max(0.1, input.peMean + input.peSd * gaussian(rng))); const epsT = input.eps * Math.pow(1 + g, input.years) * (margin / baseMargin); values.push(epsT * pe); } values.sort((a,b)=>a-b); const above = values.filter((v)=>v>input.price).length/values.length; const lo=values[0]??0; const hi=values[values.length-1]??0; const bins:{x:string;count:number}[]=[]; const binCount=16; const span=hi-lo||1; const counts=Array.from({length:binCount},()=>0); for(const v of values){const idx=Math.min(binCount-1,Math.floor(((v-lo)/span)*binCount)); counts[idx]=(counts[idx]??0)+1;} for(let i=0;i<binCount;i++){const edge=lo+(span*i)/binCount;bins.push({x:edge.toFixed(0),count:counts[i]??0});} const round=(v:number)=>Math.round(v*100)/100; return {n,p5:round(quantile(values,.05)),p25:round(quantile(values,.25)),p50:round(quantile(values,.5)),p75:round(quantile(values,.75)),p95:round(quantile(values,.95)),shareAbove:Math.round(above*1000)/10,degenerate:input.gSd===0&&input.marginSd===0&&input.peSd===0,bins}; }

export function evidenceLabel(k: EvidenceClass): string { const map: Record<EvidenceClass,string> = { fact:"Sự thật", data:"Dữ liệu", inference:"Suy luận", hypothesis:"Giả thuyết", forecast:"Dự báo", unverified:"Chưa xác minh", insufficient:"Chưa đủ bằng chứng" }; return map[k]; }
export function newId(): string { if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID(); return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
export function checksDefault(): ConfidenceChecks { return { contraryConsidered: false, notBecauseProse: false }; }