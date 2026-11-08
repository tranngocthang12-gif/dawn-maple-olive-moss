//#region node_modules/.nitro/vite/services/ssr/assets/logic-DyFXhBq6.js
var evidenceClasses = [
	{
		id: "fact",
		name: "Sự thật",
		rule: "Một sự kiện đã xảy ra, có nguồn tầng 1 hoặc 2, thời điểm biết, và được phép dùng. Không suy ra từ văn phong."
	},
	{
		id: "data",
		name: "Dữ liệu",
		rule: "Một số đo có đơn vị, nguồn, phương pháp và thời điểm. Số không có nguồn không phải dữ liệu."
	},
	{
		id: "inference",
		name: "Suy luận",
		rule: "Kết luận rút từ sự thật hoặc dữ liệu đã nêu. Phải chỉ được tiền đề. Không được viết như sự thật."
	},
	{
		id: "hypothesis",
		name: "Giả thuyết",
		rule: "Cơ chế nhân quả chưa được kiểm. Phải có cách sai và cách chết."
	},
	{
		id: "forecast",
		name: "Dự báo",
		rule: "Phát biểu về tương lai, kèm xác suất hoặc ghi rõ là chưa lượng hóa được. Không có câu chắc chắn tăng."
	},
	{
		id: "unverified",
		name: "Chưa xác minh",
		rule: "Nghe có vẻ hợp lý nhưng chưa có nguồn. Mặc định của mọi cạnh trong đồ thị kinh tế."
	},
	{
		id: "insufficient",
		name: "Chưa đủ bằng chứng",
		rule: "Đã tìm và chưa đủ. Đây là một kết luận hợp lệ, không phải một ô trống cần bịa cho đầy."
	}
];
var tiers = [
	{
		id: "t1",
		name: "Tầng 1",
		body: "Báo cáo doanh nghiệp, cơ quan quản lý, ngân hàng trung ương, thống kê nhà nước, hồ sơ sàn."
	},
	{
		id: "t2",
		name: "Tầng 2",
		body: "Nhà cung cấp dữ liệu chuyên nghiệp có hợp đồng và phương pháp công bố."
	},
	{
		id: "t3",
		name: "Tầng 3",
		body: "Nghiên cứu học thuật. Không phải sự thật về một công ty cụ thể chỉ vì có giá trị p."
	},
	{
		id: "t4",
		name: "Tầng 4",
		body: "Báo chí có tòa soạn. Dùng để tìm nguồn sơ cấp, không thay nguồn sơ cấp."
	},
	{
		id: "t5",
		name: "Tầng 5",
		body: "Mạng xã hội, diễn đàn, cộng đồng. Không bao giờ ngang tầng 1."
	},
	{
		id: "none",
		name: "Chưa có tầng",
		body: "Chưa được phép mang nhãn sự thật hoặc dữ liệu."
	}
];
var bindingPrinciples = [
	{
		id: "not-oracle",
		title: "Không phải nhà tiên tri",
		body: "Không xây chatbot trả lời nên mua mã nào. Không dự báo giá ngày mai. Không coi AI là người quyết định tỷ trọng."
	},
	{
		id: "separate",
		title: "Tách loại phát biểu",
		body: "Sự thật, dữ liệu, suy luận, giả thuyết, dự báo và chưa xác minh không được trộn."
	},
	{
		id: "no-fabrication",
		title: "Không bịa",
		body: "Không bịa số, không tạo nguồn giả, không giấu dữ liệu trái luận điểm."
	},
	{
		id: "distribution",
		title: "Phân phối, không chắc chắn",
		body: "Câu hỏi là phân phối kết quả, không phải tăng hay giảm."
	},
	{
		id: "formula",
		title: "Công thức quyết định",
		body: "Quyết định là hàm của thế giới, vĩ mô, ngành, doanh nghiệp, quản trị, cơ bản, định giá, kỳ vọng, thị trường, xác suất, rủi ro và danh mục. Không phải hàm của ý kiến AI."
	},
	{
		id: "expectation-gap",
		title: "Khoảng kỳ vọng",
		body: "Alpha xấp xỉ thực tế trừ kỳ vọng đã được định giá. Doanh nghiệp tốt có thể là khoản đầu tư xấu."
	},
	{
		id: "ensemble",
		title: "Không một mô hình định giá",
		body: "Một mô hình không được quyết định. Ensemble phải giữ độ lệch, không chỉ trung bình."
	},
	{
		id: "survival",
		title: "Sống sót trước",
		body: "Mục tiêu gần với của cải kép dài hạn dưới ràng buộc sinh tồn. Không chiến lược có xác suất phá sản không chấp nhận được."
	},
	{
		id: "no-full-kelly",
		title: "Không Full Kelly máy móc",
		body: "Kelly là khung tham chiếu. Bất định của chính xác suất p phải được tính. Hệ thống không phát lệnh kích thước."
	},
	{
		id: "calibration",
		title: "Hiệu chỉnh xác suất",
		body: "Đánh giá bằng độ tin cậy của xác suất, không chỉ đúng sai. Hiện chưa có mẫu nên mọi xác suất đều chưa hiệu chỉnh."
	},
	{
		id: "adversarial",
		title: "Phản biện độc lập",
		body: "Không để một AI viết thesis rồi tự nghiệm thu. Bất đồng không được xóa."
	},
	{
		id: "kill",
		title: "Tiêu chí hủy trước",
		body: "Kill criteria ghi trước. Không nới tiêu chuẩn để giữ khoản lỗ."
	},
	{
		id: "lineage",
		title: "Dòng dõi và thời gian",
		body: "Số liệu cần nguồn, ngày, đơn vị, phương pháp. Không dùng dữ liệu tương lai để kể chuyện quá khứ."
	},
	{
		id: "memory",
		title: "Trí nhớ đầu tư",
		body: "Thesis, xác suất, giả định và lý do được chụp tại lúc quyết định. Cấm viết lại hồi tố."
	},
	{
		id: "human",
		title: "Owner quyết định cuối",
		body: "AI phân tích, tính, phản biện, cảnh báo. AI không mua, không bán, không dùng đòn bẩy, không triển khai vốn thật khi chưa có quyền rõ ràng."
	},
	{
		id: "no-theater",
		title: "Chống trình diễn",
		body: "Nhiều agent, nhiều dữ liệu, dashboard đẹp không phải bằng chứng hệ thống tốt."
	},
	{
		id: "ev",
		title: "Giá trị kỳ vọng",
		body: "Đúng 60% chưa chắc tốt hơn đúng 52%. Payoff nhân xác suất."
	},
	{
		id: "books-not-truth",
		title: "Sách không phải sự thật",
		body: "Mỗi sách có năm, điều kiện, giả định. Không trường phái nào là chân lý duy nhất."
	}
];
var phases = [
	{
		id: "p0",
		name: "Phase 0 — Nền",
		intent: "Hiến chương, phân loại, luật bằng chứng, tầng nguồn, khung xác suất, bản đồ module, tiêu chuẩn nghiệm thu.",
		state: "open",
		acceptance: [
			"Phản biện kiến trúc nằm trong sản phẩm, gồm thiếu sót, trùng, rủi ro, giả định ẩn, overfitting, ảo giác và tự tin giả.",
			"Không nguyên tắc cốt lõi nào bị cắt để làm hệ thống dễ hơn.",
			"Đề xuất thiết kế khác được tách riêng và chờ Owner.",
			"Mỗi module có đầu vào, đầu ra, quan hệ và tiêu chuẩn nghiệm thu. Engine ghi rõ chưa xây.",
			"Sổ xác suất không ghi hậu nghiệm nếu chưa có tỷ số hợp lý hoặc chưa ghi là chưa biết.",
			"Quy trình một mã không chuyển sang sẵn sàng nếu thiếu tiêu chí hủy, bằng chứng trái, hoặc tổng xác suất khác 100.",
			"HIGH bị khóa. Mọi xác suất mang nhãn chưa hiệu chỉnh.",
			"Không có lệnh mua, bán, hay tỷ trọng vốn."
		]
	},
	{
		id: "p1",
		name: "Phase 1 — Tri thức",
		intent: "Kệ khoảng 100 sách và án lệ thành công lẫn thất bại. Đọc không được tính là tiến độ alpha.",
		state: "shelf",
		acceptance: [
			"Mỗi sách có lớp FOUNDATION, ADVANCED, COUNTERPOINT hoặc HISTORICAL, kèm giới hạn sử dụng.",
			"Không có sách bịa.",
			"Án lệ có năm phần: cái được, cái gãy, vì sao, nguyên tắc mang được, cái không được chép.",
			"Không nhập lợi nhuận quỹ nếu chưa có nguồn sơ cấp trong hệ thống."
		]
	},
	{
		id: "p2",
		name: "Phase 2 — Doanh nghiệp",
		intent: "Hồ sơ do Owner nộp. Không có engine tự điền báo cáo. Định giá vẫn đóng.",
		state: "open",
		acceptance: [
			"Mọi số có dòng dõi.",
			"Chất lượng lợi nhuận kiểm tra phải thu, tồn kho, dồn tích, vốn hóa, bên liên quan, pha loãng, nghĩa vụ ngoài bảng.",
			"Không điền báo cáo bằng trí nhớ của mô hình ngôn ngữ."
		]
	},
	{
		id: "p3",
		name: "Phase 3 — Xác suất và định giá",
		intent: "Bayes, kịch bản, Monte Carlo, ensemble. Minh họa trên bàn xác suất không phải engine này.",
		state: "closed",
		acceptance: [
			"Hậu nghiệm chỉ phát sinh từ một dòng sổ cái.",
			"Monte Carlo công bố là có điều kiện trên phân phối đầu vào, kèm phụ thuộc đã mô hình hay chưa.",
			"Ensemble báo trung vị và khoảng cách giữa các mô hình. Khoảng rộng chặn độ tin cậy."
		]
	},
	{
		id: "p4",
		name: "Phase 4 — Đồ thị kinh tế",
		intent: "Nhà cung cấp, khách hàng, đối thủ, logistics. Chưa mở.",
		state: "closed",
		acceptance: ["Mỗi cạnh mặc định chưa xác minh cho đến khi có nguồn và ngày.", "Không có đối tác do mô hình tưởng tượng ra."]
	},
	{
		id: "p5",
		name: "Phase 5 — Tín hiệu yếu",
		intent: "Sổ giả thuyết trước khi đo. Không backtest, không điểm số, không lệnh.",
		state: "open",
		acceptance: [
			"Trước backtest phải có giả thuyết, cơ chế, độ trễ kỳ vọng và cách chết.",
			"Cổng dữ liệu: công khai, có giấy phép, hoặc cấm. Cờ thông tin nội gián.",
			"Đa số tín hiệu được phép chết."
		]
	},
	{
		id: "p6",
		name: "Phase 6 — Danh mục và rủi ro",
		intent: "Tương quan, đuôi, kích thước. Chưa mở.",
		state: "closed",
		acceptance: ["Một nơi duy nhất chịu trách nhiệm kích thước vị thế.", "Stress: suy thoái, sốc lãi suất, khủng hoảng tiền tệ, đóng băng thanh khoản, sốc hàng hóa, địa chính trị, sụp đổ lợi nhuận."]
	},
	{
		id: "p7",
		name: "Phase 7 — Hiệu chỉnh",
		intent: "Brier, log loss, đường reliability. Chưa mở vì chưa có dự báo đã phân giải.",
		state: "closed",
		acceptance: ["HIGH chỉ được xét khi có mẫu đã phân giải đủ lớn và sai số hiệu chỉnh được báo cáo.", "Không nâng cấp bằng một vụ đúng."]
	},
	{
		id: "p8",
		name: "Phase 8 — Danh mục giấy",
		intent: "Chưa dùng tiền thật. Chưa mở.",
		state: "closed",
		acceptance: ["Chi phí giao dịch và thanh khoản được mô hình trước khi kể là có kết quả."]
	},
	{
		id: "p9",
		name: "Phase 9 — Vốn thật có kiểm soát",
		intent: "Chỉ sau nghiệm thu độc lập. Đóng.",
		state: "closed",
		acceptance: ["Out-of-sample, walk-forward, chi phí, thanh khoản, regime, đuôi, paper trading, calibration, phản biện độc lập.", "Backtest đẹp không đủ."]
	}
];
var adversarial = [
	{
		id: "A",
		role: "Phân tích chính",
		job: "Xây luận điểm. Viết trước, không được đọc kết luận của phe kia trước khi xong bản độc lập."
	},
	{
		id: "B",
		role: "Phe bán",
		job: "Nhiệm vụ là chứng minh A sai, không phải cân bằng giọng văn."
	},
	{
		id: "C",
		role: "Pháp y",
		job: "Kế toán, quản trị, nợ, pha loãng, dấu hiệu gian lận, đe dọa cạnh tranh."
	},
	{
		id: "D",
		role: "Định lượng và rủi ro",
		job: "Xác suất, tác động danh mục, đuôi, kích thước. Không viết lại câu chuyện."
	},
	{
		id: "E",
		role: "Phán xử",
		job: "Tổng hợp mà không xóa bất đồng. Không phải một phiếu bầu."
	}
];
var mandatoryQuestions = [
	"Điều gì có thể khiến ta sai?",
	"Bằng chứng nào chống lại thesis?",
	"Base rate của trường hợp này là gì?",
	"Thị trường đã biết gì?",
	"Thị trường có thể chưa biết gì?",
	"Thesis còn đúng nếu giá giảm 30%?",
	"Thesis còn đúng nếu lãi suất đổi mạnh?",
	"Điều kiện nào buộc hủy thesis?",
	"Lợi thế thực sự nằm ở đâu — thông tin, phân tích, hành vi, thời gian, cấu trúc, hay thực thi?",
	"Nếu biết thêm dữ liệu này, quyết định có đổi không?"
];
var outputSections = [
	"Tóm tắt điều hành",
	"Thị trường đang tin",
	"Ta tin khác",
	"Bằng chứng đã phân loại",
	"Chất lượng cơ bản",
	"Định giá",
	"Phân phối xác suất",
	"Tăng, cơ sở, giảm, đuôi",
	"Lợi nhuận kỳ vọng",
	"Phía dưới",
	"Rủi ro chính",
	"Bằng chứng trái",
	"Độ tin cậy",
	"Điều kiện hủy",
	"Thông tin còn thiếu"
];
var sensors = [
	{
		id: "hiring",
		name: "Tuyển dụng",
		watch: "Số lượng, loại vị trí, và trôi nội dung mô tả công việc."
	},
	{
		id: "people",
		name: "Dòng người",
		watch: "Một người không đáng kể. Một dòng cùng chuyên môn sang đối thủ có thể là tín hiệu."
	},
	{
		id: "supplier",
		name: "Nhà cung cấp",
		watch: "Đơn hàng, tồn kho, phải thu, công suất, capex, guidance."
	},
	{
		id: "customer",
		name: "Khách hàng",
		watch: "Capex, đóng cửa, tồn kho, mất khách của chính khách hàng lớn."
	},
	{
		id: "digital",
		name: "Dấu chân số",
		watch: "Chuỗi thời gian của giá, SKU, chiết khấu, thời gian giao, số cửa hàng, không chỉ ảnh chụp hiện tại."
	},
	{
		id: "inventory",
		name: "Tồn kho",
		watch: "Tồn kho báo cáo cộng với giảm giá, cầu đại diện và hàng thứ cấp."
	},
	{
		id: "physical",
		name: "Thế giới vật lý",
		watch: "Chỉ khi hợp pháp và có cơ chế tới lợi nhuận. Lạ không đủ."
	},
	{
		id: "language",
		name: "Ngôn ngữ",
		watch: "Trôi ngữ nghĩa và câu hỏi bị né. Không chỉ tích cực hay tiêu cực."
	},
	{
		id: "missing",
		name: "Thông tin biến mất",
		watch: "KPI từng được nhấn rồi biến mất."
	},
	{
		id: "patent",
		name: "Bằng sáng chế và công nghệ",
		watch: "Cụm và sự dịch chuyển, không phải số đếm."
	}
];
var funnel = [
	{
		n: "Hàng nghìn ứng viên",
		gate: "Được phép tồn tại"
	},
	{
		n: "Còn cơ chế nhân quả",
		gate: "Viết được giả thuyết, độ trễ, cách chết"
	},
	{
		n: "Sống sót thống kê",
		gate: "Không chỉ trên mẫu đã thấy"
	},
	{
		n: "Ngoài mẫu",
		gate: "Walk-forward"
	},
	{
		n: "Bền qua regime",
		gate: "Không chỉ một thời kỳ"
	},
	{
		n: "Có ích kinh tế",
		gate: "Sau chi phí, còn sức chứa, còn độc lập"
	},
	{
		n: "Một ít tín hiệu sống",
		gate: "Phần còn lại phải được phép chết"
	}
];
var overfitChecks = [
	"Overfitting",
	"Look-ahead bias",
	"Survivorship bias",
	"Selection bias",
	"Data leakage",
	"p-hacking",
	"Kiểm định nhiều giả thuyết cùng lúc",
	"Phụ thuộc regime",
	"Tương quan không kèm cơ chế"
];
var signalScore = [
	{
		k: "C",
		name: "Nhân quả",
		q: "Vì sao X có thể đi tới Y, chứ không chỉ cùng lúc?"
	},
	{
		k: "L",
		name: "Độ trễ",
		q: "Tín hiệu đến trước lợi nhuận bao lâu, và cửa sổ đó còn giao dịch được không?"
	},
	{
		k: "I",
		name: "Độc lập",
		q: "Nó có phải một biến đã có trong giá hoặc trong một tín hiệu khác?"
	},
	{
		k: "R",
		name: "Đáng tin",
		q: "Nguồn có ổn định, có dòng dõi, có sửa lịch sử không?"
	},
	{
		k: "U",
		name: "Chưa đông",
		q: "Ai khác nhìn thấy cùng dữ liệu công khai này?"
	}
];
var scorePenalties = [
	"Nhiễu",
	"Chi phí",
	"Rủi ro dữ liệu",
	"Rủi ro rò rỉ"
];
var caps = {
	theses: 40,
	decisions: 200,
	ledger: 200,
	world: 200,
	baseRates: 200,
	companies: 40,
	facts: 80,
	signals: 80,
	seals: 200
};
var fullBook = "Sổ này đã đầy. Hãy tải sổ về máy trước. Hệ thống không xóa dòng cũ để lấy chỗ.";
function sealFromCompany(c, filedAt, id, sealed) {
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
		quality: structuredClone(c.quality ?? emptyQuality())
	};
}
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
function recordUsable(row) {
	return row.permitted && (row.tier === "t1" || row.tier === "t2") && row.source.trim().length >= 3 && row.asOf.trim().length >= 8;
}
var qualityItems = [
	{
		id: "receivables",
		label: "Phải thu",
		ask: "Phải thu có chạy nhanh hơn doanh thu không? Nguồn nào, kỳ nào?"
	},
	{
		id: "inventory",
		label: "Tồn kho",
		ask: "Vòng quay, giảm giá, và hàng chậm. Một tỷ lệ không phải kết luận."
	},
	{
		id: "accruals",
		label: "Dồn tích",
		ask: "Lợi nhuận và tiền lệch về phía nào, trong mấy kỳ?"
	},
	{
		id: "capitalization",
		label: "Vốn hóa chi phí",
		ask: "Cái gì được đưa vào tài sản thay vì chi phí kỳ này?"
	},
	{
		id: "related",
		label: "Bên liên quan",
		ask: "Với ai, điều khoản nào, có lệch giá độc lập không?"
	},
	{
		id: "dilution",
		label: "Pha loãng",
		ask: "Số cổ phiếu mới, quyền chọn, trái phiếu chuyển đổi. Đơn vị là cổ phiếu."
	},
	{
		id: "offbalance",
		label: "Ngoài bảng",
		ask: "Bảo lãnh, thuê, cam kết. Không gộp VAS với IFRS hay US GAAP."
	},
	{
		id: "auditor",
		label: "Kiểm toán",
		ask: "Đổi kiểm toán hoặc ý kiến không nguyên vẹn. Câu hỏi, chưa phải gian lận."
	},
	{
		id: "cfo",
		label: "CFO và vốn",
		ask: "Đổi CFO, cổ tức, mua lại, thâu tóm. Ghi sự kiện, không ghi ý định."
	}
];
function emptyQuality() {
	const row = () => ({
		state: "open",
		note: "",
		source: ""
	});
	return {
		receivables: row(),
		inventory: row(),
		accruals: row(),
		capitalization: row(),
		related: row(),
		dilution: row(),
		offbalance: row(),
		auditor: row(),
		cfo: row()
	};
}
function companyFileIssues(c) {
	const b = [];
	if (c.name.trim().length < 2) b.push("Chưa có tên doanh nghiệp.");
	if (c.venue.trim().length < 2) b.push("Chưa có sàn hoặc nơi báo cáo.");
	if (!c.standard) b.push("Chưa chọn chuẩn báo cáo. VAS, IFRS và US GAAP không phải một thứ.");
	if (c.standardNote.trim().length < 12) b.push("Cần ghi chuẩn đang dùng và cái nó không so sánh được.");
	if (c.business.trim().length < 12) b.push("Chưa mô tả doanh nghiệp bán gì, cho ai.");
	const usable = c.facts.filter((f) => recordUsable(f) && f.text.trim().length >= 2);
	const thin = c.missingNote.includes("CHƯA ĐỦ") && c.missingNote.trim().length >= 12;
	if (usable.length === 0 && !thin) b.push("Chưa có sự kiện nguồn tầng 1 hoặc 2. Nếu chưa có, ghi CHƯA ĐỦ BẰNG CHỨNG.");
	if (qualityItems.filter((q) => (c.quality?.[q.id]?.state ?? "open") === "open").length > 0 && !thin) b.push("Còn chiều chất lượng để ngỏ. Trả lời từng chiều, hoặc ghi CHƯA ĐỦ BẰNG CHỨNG.");
	for (const q of qualityItems) {
		const row = c.quality?.[q.id];
		if (!row || row.state === "open") continue;
		const min = row.state === "clear" ? 8 : 12;
		if (row.note.trim().length < min) b.push(`${q.label} cần ghi chú dài hơn. Một nhãn không phải bằng chứng.`);
		if (row.state === "clear" && row.source.trim().length < 3) b.push(`${q.label}: chưa thấy vấn đề vẫn phải có nguồn.`);
	}
	return b;
}
function signalAliveIssues(s) {
	const b = [];
	if (!sensors.some((x) => x.id === s.family)) b.push("Chưa chọn họ cảm biến.");
	if (s.hypothesis.trim().length < 12) b.push("Giả thuyết quá ngắn. Viết điều sẽ sai nếu tín hiệu sai.");
	if (s.mechanism.trim().length < 12) b.push("Chưa có cơ chế nhân quả. Tương quan không đủ để cho sống.");
	if (s.lag.trim().length < 8) b.push("Chưa ghi độ trễ, và cửa sổ đó còn giao dịch được không.");
	if (s.death.trim().length < 12) b.push("Chưa viết cách tín hiệu này chết.");
	if (!s.rightsOk || s.rights.trim().length < 12) b.push("Chưa xác nhận dữ liệu được phép dùng và không phải thông tin nội gián.");
	if (s.family === "physical" && !s.rights.toLowerCase().includes("hợp pháp")) b.push("Cảm biến vật lý phải ghi vì sao việc thu thập là hợp pháp.");
	return b;
}
function securityKey(name) {
	return name.trim().toLocaleLowerCase("vi").replace(/\s+/g, " ");
}
function priorDecisions(security, decisions) {
	const key = securityKey(security);
	if (key.length < 2) return [];
	return (decisions ?? []).filter((d) => !d.voided && securityKey(d.security) === key);
}
function thesisBlockers(t, ctx) {
	const b = [];
	if (!ctx.mandate.locked) b.push("Ủy thác chưa khóa. Hồ sơ không thể sẵn sàng.");
	const ring = t.ring ?? "";
	if (ring !== "inner" && ring !== "outer") b.push("Chưa chọn vành trong hoặc vành ngoài.");
	if (t.security.trim().length < 2) b.push("Chưa có danh tính chứng khoán.");
	const company = (ctx.companies ?? []).find((c) => c.id === (t.companyId ?? ""));
	if (!company || company.status !== "filed") b.push("Chưa gắn hồ sơ doanh nghiệp đã nộp. Có thể nộp với dòng CHƯA ĐỦ BẰNG CHỨNG, nhưng không được bỏ qua.");
	if (!t.venue.trim() || !t.horizon.trim()) b.push("Chưa có sàn và chân trời thời gian.");
	for (const field of TEXT_KEYS) if (!filled(t.texts[field.key])) b.push(`Còn trống: ${field.label}. Có thể ghi CHƯA ĐỦ BẰNG CHỨNG.`);
	const worldIds = t.worldIds ?? [];
	if (!t.texts.macro.includes("CHƯA ĐỦ") && worldIds.length === 0) b.push("Phơi nhiễm vĩ mô cần một quan sát Thế giới dùng được, hoặc ghi CHƯA ĐỦ BẰNG CHỨNG.");
	if (worldIds.some((id) => !ctx.world.some((w) => w.id === id && recordUsable(w)))) b.push("Có quan sát Thế giới được gắn nhưng chưa đủ nguồn tầng 1 hoặc 2.");
	const linked = ctx.baseRates.find((r) => r.id === (t.baseRateId ?? ""));
	if (!(t.checks.baseRateCited || Boolean(linked && recordUsable(linked)))) b.push("Chưa gắn base rate dùng được, hoặc chưa xác nhận là chưa có base rate.");
	const prior = priorDecisions(t.security, ctx.decisions ?? []);
	const seen = new Set(t.priorSeenIds ?? []);
	const unseen = prior.filter((d) => !seen.has(d.id));
	if (unseen.length) b.push(`Có ${unseen.length} quyết định cũ của mã này chưa đọc lại. Cuộc trò chuyện mới không được kể từ đầu.`);
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
	if (!t.checks.notBecauseProse) b.push("Chưa xác nhận độ tin cậy không đến từ văn phong.");
	return b;
}
function confidenceOf(t, ctx) {
	const reasons = ["HIGH bị khóa đến khi Phase 7 có mẫu calibration. Khóa này là ràng buộc Foundation V1, không phải một đánh giá về văn phong."];
	const blockers = thesisBlockers(t, ctx);
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
function confidenceGaps(t, ctx) {
	const gaps = [];
	const company = (ctx.companies ?? []).find((c) => c.id === (t.companyId ?? ""));
	if (company?.missingNote.includes("CHƯA ĐỦ")) gaps.push("Hồ sơ doanh nghiệp đi theo đường chưa đủ bằng chứng.");
	if (company) {
		const open = qualityItems.filter((q) => (company.quality?.[q.id]?.state ?? "open") === "open");
		if (open.length) gaps.push(`Còn ${open.length} chiều chất lượng để ngỏ.`);
	}
	if ((t.texts?.macro ?? "").includes("CHƯA ĐỦ")) gaps.push("Phần vĩ mô ghi chưa đủ bằng chứng, nên không buộc phải gắn một quan sát thế giới.");
	const linked = ctx.baseRates.find((r) => r.id === (t.baseRateId ?? ""));
	if (t.checks.baseRateCited && !(linked && recordUsable(linked))) gaps.push("Tỷ lệ quá khứ chỉ là ô đã đánh dấu, chưa gắn một dòng trong sổ.");
	if (t.scenarios.some((s) => s.returnPct !== null && Number.isFinite(s.returnPct))) gaps.push("Mức lời trong bốn kịch bản là số bạn tự nhập. Nó chưa có nguồn, và chưa được hiệu chỉnh.");
	const pending = priorDecisions(t.security, ctx.decisions ?? []).filter((d) => d.outcome === "pending" || d.outcome === "");
	if (pending.length) gaps.push(`${pending.length} quyết định của mã này chưa có kết quả. Chưa thể gọi đó là kinh nghiệm thắng hay thua.`);
	return gaps;
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
export { scenarioWarnings as A, overfitChecks as C, qualityItems as D, processScore as E, signalScore as F, thesisBlockers as I, tiers as L, sealFromCompany as M, sensors as N, recordUsable as O, signalAliveIssues as P, outputSections as S, priorDecisions as T, funnel as _, checksDefault as a, monteCarlo as b, confidenceGaps as c, emptyQuality as d, emptyTexts as f, fullBook as g, expectedReturn as h, caps as i, scorePenalties as j, scenarioSum as k, confidenceOf as l, evidenceLabel as m, bayesPosterior as n, claimIssues as o, evidenceClasses as p, bindingPrinciples as r, companyFileIssues as s, adversarial as t, defaultScenarios as u, kellyReference as v, phases as w, newId as x, mandatoryQuestions as y };
