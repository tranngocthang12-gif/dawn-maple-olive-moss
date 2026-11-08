//#region node_modules/.nitro/vite/services/ssr/assets/logic-BANorj8p.js
var TEXT_KEYS = [
	{
		key: "business",
		step: "2",
		label: "Mô hình kinh doanh"
	},
	{
		key: "industry",
		step: "3",
		label: "Ngành"
	},
	{
		key: "position",
		step: "4",
		label: "Vị thế cạnh tranh"
	},
	{
		key: "management",
		step: "5",
		label: "Ban lãnh đạo"
	},
	{
		key: "financialQuality",
		step: "6",
		label: "Chất lượng tài chính"
	},
	{
		key: "balanceSheet",
		step: "7",
		label: "Bảng cân đối"
	},
	{
		key: "cashFlow",
		step: "8",
		label: "Dòng tiền"
	},
	{
		key: "capitalAllocation",
		step: "9",
		label: "Phân bổ vốn"
	},
	{
		key: "growth",
		step: "10",
		label: "Động lực tăng trưởng"
	},
	{
		key: "risks",
		step: "11",
		label: "Rủi ro"
	},
	{
		key: "macro",
		step: "12",
		label: "Phơi nhiễm vĩ mô"
	},
	{
		key: "graph",
		step: "13",
		label: "Đồ thị kinh tế"
	},
	{
		key: "suppliers",
		step: "14",
		label: "Tín hiệu nhà cung cấp"
	},
	{
		key: "customers",
		step: "15",
		label: "Tín hiệu khách hàng"
	},
	{
		key: "weakSignals",
		step: "16",
		label: "Tín hiệu yếu"
	},
	{
		key: "marketBelieves",
		step: "17",
		label: "Thị trường đang tin gì"
	},
	{
		key: "difference",
		step: "17",
		label: "Ta tin khác ở đâu"
	},
	{
		key: "valuation",
		step: "18",
		label: "Định giá — ghi chú, không phải giá mục tiêu"
	},
	{
		key: "portfolioImpact",
		step: "20",
		label: "Tác động danh mục"
	},
	{
		key: "bear",
		step: "21",
		label: "Luận điểm phe bán"
	},
	{
		key: "contrary",
		step: "21",
		label: "Bằng chứng chống lại"
	},
	{
		key: "missing",
		step: "15-out",
		label: "Thông tin còn thiếu"
	},
	{
		key: "invalidation",
		step: "22",
		label: "Điều kiện hủy thesis"
	}
];
var MIN = 12;
function emptyTexts() {
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
		invalidation: ""
	};
}
function defaultScenarios() {
	return [
		"bull",
		"base",
		"bear",
		"tail"
	].map((name) => ({
		name,
		probability: null,
		returnPct: null,
		narrative: "",
		catalyst: "",
		revenue: "",
		margin: "",
		multiple: "",
		fairValue: "",
		risk: ""
	}));
}
function bayesPosterior(priorPct, lr) {
	if (!Number.isFinite(priorPct) || !Number.isFinite(lr)) return null;
	if (lr <= 0) return null;
	const p = priorPct / 100;
	if (p <= 0 || p >= 1) return null;
	const odds = p / (1 - p) * lr;
	const post = odds / (1 + odds);
	return Math.round(post * 1e3) / 10;
}
function scenarioSum(scenarios) {
	if (scenarios.some((s) => s.probability === null || !Number.isFinite(s.probability))) return null;
	const sum = scenarios.reduce((a, s) => a + (s.probability ?? 0), 0);
	return Math.round(sum * 10) / 10;
}
function expectedReturn(scenarios) {
	if (scenarioSum(scenarios) === null) return null;
	if (scenarios.some((s) => s.returnPct === null || !Number.isFinite(s.returnPct))) return null;
	const ev = scenarios.reduce((a, s) => a + (s.probability ?? 0) / 100 * (s.returnPct ?? 0), 0);
	return Math.round(ev * 10) / 10;
}
function scenarioWarnings(scenarios) {
	const warnings = [];
	if (scenarios.map((s) => s.probability).every((p) => p === 25)) warnings.push("Bốn xác suất bằng 25% thường là dấu hiệu chưa có luận điểm, không phải một tiên nghiệm trung tính.");
	const bull = scenarios.find((s) => s.name === "bull");
	const bear = scenarios.find((s) => s.name === "bear");
	if (bull?.returnPct !== null && bear?.returnPct !== null && bull && bear && bull.returnPct !== void 0 && bear.returnPct !== void 0 && bull.returnPct < bear.returnPct) warnings.push("Lợi nhuận kịch bản tăng đang thấp hơn kịch bản giảm. Kiểm tra lại dấu.");
	if (scenarios.find((s) => s.name === "tail")?.probability === 0) warnings.push("Xác suất đuôi bằng 0 là một giả định mạnh, không phải một kết quả đo được.");
	return warnings;
}
function filled(s) {
	return s.trim().length >= MIN;
}
function claimIssues(c) {
	const issues = [];
	if (!c.text.trim()) issues.push("Nội dung trống.");
	if ((c.klass === "fact" || c.klass === "data") && !c.permitted) issues.push("Sự thật hoặc dữ liệu đòi hỏi xác nhận nguồn được phép dùng và không phải thông tin nội gián.");
	if ((c.klass === "fact" || c.klass === "data") && (!c.source.trim() || c.tier === "none" || !c.asOf)) issues.push("Sự thật hoặc dữ liệu cần nguồn, tầng nguồn, và thời điểm thị trường có thể đã biết.");
	if ((c.klass === "fact" || c.klass === "data") && (c.tier === "t4" || c.tier === "t5")) issues.push("Tầng 4–5 không đủ để gắn nhãn sự thật hoặc dữ liệu.");
	if (c.klass === "forecast" && c.tier === "none") issues.push("Dự báo vẫn phải ghi nguồn của giả định.");
	return issues;
}
function thesisBlockers(t) {
	const b = [];
	if (t.security.trim().length < 2) b.push("Chưa có danh tính chứng khoán.");
	if (!t.venue.trim() || !t.horizon.trim()) b.push("Chưa có sàn và chân trời thời gian.");
	for (const field of TEXT_KEYS) if (!filled(t.texts[field.key])) b.push(`Còn trống: ${field.label}. Có thể ghi CHƯA ĐỦ BẰNG CHỨNG.`);
	if (t.claims.length === 0) b.push("Chưa có claim nào được phân loại.");
	if (t.claims.filter((c) => claimIssues(c).length > 0).length) b.push("Có claim chưa đạt chuẩn phân loại — xem mục bằng chứng.");
	const substantive = t.claims.some((c) => c.klass === "fact" || c.klass === "data" || c.klass === "inference" || c.klass === "hypothesis");
	if (t.claims.length > 0 && !substantive) b.push("Mọi claim đều là chưa xác minh, chưa đủ, hoặc chỉ là dự báo. Thesis chưa có bằng chứng hoặc giả thuyết đã đặt tên.");
	const sum = scenarioSum(t.scenarios);
	if (sum === null) b.push("Bốn kịch bản chưa có đủ xác suất.");
	else if (Math.abs(sum - 100) > .2) b.push(`Tổng xác suất đang là ${sum}%, cần bằng 100%.`);
	for (const s of t.scenarios) {
		if (!filled(s.narrative)) b.push(`Kịch bản ${s.name} chưa có diễn giải.`);
		if (s.returnPct === null || !Number.isFinite(s.returnPct)) b.push(`Kịch bản ${s.name} chưa có mức lợi nhuận.`);
	}
	if (t.kills.filter((k) => filled(k.text) && k.threshold.trim().length >= 2).length < 3) b.push("Cần ít nhất 3 tiêu chí hủy, mỗi tiêu chí có ngưỡng.");
	if (!t.checks.contraryConsidered) b.push("Chưa xác nhận đã đọc bằng chứng trái chiều.");
	if (!t.checks.baseRateCited) b.push("Chưa xác nhận đã nêu base rate, hoặc đã ghi rõ là chưa có base rate.");
	if (!t.checks.notBecauseProse) b.push("Chưa xác nhận độ tin cậy không đến từ văn phong.");
	return b;
}
function confidenceOf(t) {
	const reasons = ["HIGH bị khóa đến khi Phase 7 có mẫu calibration. Khóa này là ràng buộc Foundation V1, không phải một đánh giá về văn phong."];
	const blockers = thesisBlockers(t);
	const tierOk = t.claims.some((c) => (c.klass === "fact" || c.klass === "data") && (c.tier === "t1" || c.tier === "t2") && c.permitted);
	const medium = blockers.length === 0 && t.checks.independentSources >= 2 && tierOk && t.checks.baseRateCited && t.checks.contraryConsidered && t.checks.notBecauseProse;
	if (!medium) {
		if (t.checks.independentSources < 2) reasons.push("Chưa đủ hai nguồn độc lập để lên MEDIUM.");
		if (!tierOk) reasons.push("Chưa có dữ liệu hoặc sự thật ở tầng 1 hoặc 2 được phép dùng.");
		if (blockers.length) reasons.push("Hồ sơ chưa qua cổng sẵn sàng.");
	} else reasons.push("MEDIUM là trần ở Foundation V1. Hệ thống chưa được calibration.");
	return {
		level: medium ? "MEDIUM" : "LOW",
		lockedHigh: true,
		reasons
	};
}
function processScore(d) {
	const parts = [
		{
			label: "Gắn thesis hoặc ghi rõ là không có thesis",
			got: Boolean(d.thesisId) || d.action === "pass" || d.action === "observe"
		},
		{
			label: "Có điều kiện hủy",
			got: d.invalidation.trim().length >= MIN
		},
		{
			label: "Có quan điểm đối lập",
			got: d.alternativeView.trim().length >= MIN
		},
		{
			label: "Có chất xúc tác",
			got: d.catalyst.trim().length >= MIN
		},
		{
			label: "Có rủi ro",
			got: d.risk.trim().length >= MIN
		},
		{
			label: "Ghi chú kích thước không phải lệnh",
			got: d.sizeNote.trim().length >= MIN
		},
		{
			label: "Ghi chú xác suất",
			got: d.probabilityNote.trim().length >= MIN
		},
		{
			label: "Giá kèm thời điểm, hoặc ghi chưa có giá",
			got: d.priceNote.trim().length >= MIN
		},
		{
			label: "Nếu đảo quyết định thì có lý do",
			got: !d.override || d.overrideReason.trim().length >= MIN
		},
		{
			label: "Lợi nhuận kỳ vọng được ghi",
			got: d.expectedReturn.trim().length >= 1
		}
	];
	return {
		score: Math.round(parts.filter((p) => p.got).length / parts.length * 100),
		parts
	};
}
function kellyReference(winPct, payoffB, uncertainty, basePct) {
	if (!Number.isFinite(winPct) || winPct <= 0 || winPct >= 100) return {
		ok: false,
		reason: "Xác suất thắng phải nằm trong khoảng (0, 100)."
	};
	if (!Number.isFinite(payoffB) || payoffB <= 0) return {
		ok: false,
		reason: "Tỷ lệ lời ròng b phải dương."
	};
	const u = Math.min(1, Math.max(0, uncertainty));
	const base = Math.min(99, Math.max(1, basePct));
	const p = winPct / 100;
	const q = 1 - p;
	const full = (payoffB * p - q) / payoffB * 100;
	const pAdj = (1 - u) * p + u * (base / 100);
	const qAdj = 1 - pAdj;
	const adj = (payoffB * pAdj - qAdj) / payoffB * 100;
	const round = (n) => Math.round(n * 10) / 10;
	return {
		ok: true,
		full: round(full),
		half: round(full / 2),
		quarter: round(full / 4),
		adjustedQuarter: round(adj / 4),
		negative: adj <= 0
	};
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function gaussian(rng) {
	let u = 0;
	let v = 0;
	while (u === 0) u = rng();
	while (v === 0) v = rng();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function quantile(sorted, q) {
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	const next = sorted[Math.min(sorted.length - 1, base + 1)] ?? sorted[base] ?? 0;
	return (sorted[base] ?? 0) * (1 - rest) + next * rest;
}
function monteCarlo(input) {
	const n = Math.max(200, Math.min(8e3, Math.floor(input.n)));
	const rng = mulberry32(input.seed || 1);
	const values = [];
	const baseMargin = input.marginBase === 0 ? 1 : input.marginBase;
	for (let i = 0; i < n; i++) {
		const g = Math.min(2, Math.max(-.8, input.gMean + input.gSd * gaussian(rng)));
		const margin = Math.min(.8, Math.max(0, input.marginMean + input.marginSd * gaussian(rng)));
		const pe = Math.min(80, Math.max(.1, input.peMean + input.peSd * gaussian(rng)));
		const epsT = input.eps * Math.pow(1 + g, input.years) * (margin / baseMargin);
		values.push(epsT * pe);
	}
	values.sort((a, b) => a - b);
	const above = values.filter((v) => v > input.price).length / values.length;
	const lo = values[0] ?? 0;
	const hi = values[values.length - 1] ?? 0;
	const bins = [];
	const binCount = 16;
	const span = hi - lo || 1;
	const counts = Array.from({ length: binCount }, () => 0);
	for (const v of values) {
		const idx = Math.min(15, Math.floor((v - lo) / span * binCount));
		counts[idx] = (counts[idx] ?? 0) + 1;
	}
	for (let i = 0; i < binCount; i++) {
		const edge = lo + span * i / binCount;
		bins.push({
			x: edge.toFixed(0),
			count: counts[i] ?? 0
		});
	}
	const round = (v) => Math.round(v * 100) / 100;
	return {
		n,
		p5: round(quantile(values, .05)),
		p25: round(quantile(values, .25)),
		p50: round(quantile(values, .5)),
		p75: round(quantile(values, .75)),
		p95: round(quantile(values, .95)),
		shareAbove: Math.round(above * 1e3) / 10,
		degenerate: input.gSd === 0 && input.marginSd === 0 && input.peSd === 0,
		bins
	};
}
function evidenceLabel(k) {
	return {
		fact: "Sự thật",
		data: "Dữ liệu",
		inference: "Suy luận",
		hypothesis: "Giả thuyết",
		forecast: "Dự báo",
		unverified: "Chưa xác minh",
		insufficient: "Chưa đủ bằng chứng"
	}[k];
}
function newId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function checksDefault() {
	return {
		independentSources: 0,
		baseRateCited: false,
		contraryConsidered: false,
		notBecauseProse: false
	};
}
//#endregion
export { defaultScenarios as a, expectedReturn as c, newId as d, processScore as f, thesisBlockers as h, confidenceOf as i, kellyReference as l, scenarioWarnings as m, checksDefault as n, emptyTexts as o, scenarioSum as p, claimIssues as r, evidenceLabel as s, bayesPosterior as t, monteCarlo as u };
