import { J as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader, r as Note } from "./ui-DWc1CX_7.mjs";
import { d as signalScore, i as funnel, l as scorePenalties, s as overfitChecks, u as sensors } from "./doctrine-BOYtCS0t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signals-DEOZl9mU.js
var import_jsx_runtime = require_jsx_runtime();
function SignalsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Học thuyết tín hiệu · engine chưa xây",
				title: "Đa số tín hiệu phải được phép chết.",
				lede: "Chưa có backtest nào trong Foundation. Trang này khóa quy tắc nghiên cứu để khi Phase 5 mở, không ai được luyện mô hình trên tập kiểm rồi kể là đã phát hiện."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Các con số 10.000 xuống còn 10–20 trong hiến chương là hình minh họa, không phải hạn ngạch. Đề xuất P9 đang chờ nếu Owner muốn giữ chúng thành luật. Hiện chúng không phải luật." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 space-y-3",
				children: funnel.map((stage, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: ["Cửa ", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl",
							children: stage.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: stage.gate
						})
					]
				}, stage.gate))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Viết trước khi đo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Giả thuyết." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cơ chế nhân quả. Tương quan không đủ." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Độ trễ kỳ vọng, và cửa sổ đó còn giao dịch được không." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cách chết. Cái gì sẽ làm tín hiệu này bị khai tử." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Sau đó mới đến luyện, kiểm, ngoài mẫu, walk-forward, giấy, vốn nhỏ, rồi sản xuất. Không chỉnh vô hạn trên tập đã thấy."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Điểm chất lượng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "C × L × I × R × U, rồi trừ các khoản phạt. Chưa có thang điểm số vì chưa có tín hiệu sống. Câu hỏi mới là cổng."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: signalScore.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border-t border-line pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm",
								children: [
									s.k,
									" · ",
									s.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: s.q
							})]
						}, s.k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: scorePenalties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, {
							tone: "accent",
							children: ["Trừ ", p]
						}, p))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Họ cảm biến"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Mười họ của hiến chương. Chúng không phải mười nguồn sự thật. Đề xuất P3 là một sổ đăng ký. Chưa gộp thành engine vì Phase 5 chưa mở. Tín hiệu vật lý chỉ được xét khi hợp pháp và có đường tới lợi nhuận."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: sensors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border-t border-line pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: s.watch
							})]
						}, s.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Chống overfitting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: overfitChecks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-t border-line py-2",
						children: item
					}, item))
				})]
			})
		]
	});
}
//#endregion
export { SignalsPage as component };
