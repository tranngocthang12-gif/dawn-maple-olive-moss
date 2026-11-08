//#region node_modules/.nitro/vite/services/ssr/assets/doctrine-BOYtCS0t.js
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
		intent: "Engine phân tích công ty. Chưa mở.",
		state: "closed",
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
		intent: "Dữ liệu thay thế và alpha ẩn. Chưa mở.",
		state: "closed",
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
//#endregion
export { mandatoryQuestions as a, phases as c, signalScore as d, tiers as f, funnel as i, scorePenalties as l, bindingPrinciples as n, outputSections as o, evidenceClasses as r, overfitChecks as s, adversarial as t, sensors as u };
