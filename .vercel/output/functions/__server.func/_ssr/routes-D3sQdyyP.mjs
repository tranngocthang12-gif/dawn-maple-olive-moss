import { J as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, r as Note } from "./ui-DWc1CX_7.mjs";
import { t as cases } from "./cases-CGA6X-YH.mjs";
import { n as bindingPrinciples } from "./doctrine-BOYtCS0t.mjs";
import { t as books } from "./books-Cdv06LzQ.mjs";
import { n as modules } from "./modules-Zp7UY4LD.mjs";
import { a as hallucinations, c as proposals, i as gaps, r as falseConfidence, s as overfit } from "./review-CHcBQd2e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3sQdyyP.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const instruments = modules.filter((m) => m.status === "instrument").length;
	const doctrine = modules.filter((m) => m.status === "doctrine").length;
	const proposed = modules.filter((m) => m.status === "proposed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-accent uppercase",
				children: "Foundation V1 · Phase 0 đang mở"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-serif text-4xl leading-tight text-fg lg:text-5xl",
				children: "Biết cái mình biết. Biết cái mình chưa biết. Biết xác suất mình sai."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base leading-relaxed text-muted",
				children: "CHỈNAM là nền của một hệ điều hành tình báo đầu tư. Phiên bản này giữ hiến chương, phản biện kiến trúc, và các dụng cụ buộc phải phân loại bằng chứng. Nó không phân tích cổ phiếu, không lập danh mục, và không triển khai vốn."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						tone: "solid",
						children: "Chưa hiệu chỉnh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "0 dự báo đã phân giải" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						tone: "accent",
						children: "Không phát lệnh"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Không xây"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Một chatbot trả lời nên mua mã nào." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Một máy dự báo giá ngày mai, hay một giọng chắc chắn tăng." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Một quyết định mà đầu vào chỉ là ý kiến của mô hình ngôn ngữ." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-8 border border-line bg-surface px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Công thức được phép"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-xl leading-relaxed",
						children: "Decision = f(World, Macro, Industry, Company, Management, Fundamentals, Valuation, Expectations, Market, Probability, Risk, Portfolio)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Không được phép: Decision = f(ý kiến của AI)."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Rà soát kiến trúc, trước khi mở rộng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: "Hiến chương không bị cắt. Phần dưới là các lỗ của chính nó. Mỗi mục trong trang phản biện mang nhãn sự thật về văn bản, suy luận, hoặc giả thuyết."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Thiếu sót",
								v: gaps.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Chỗ trùng",
								v: 6
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Overfitting",
								v: overfit.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Ảo giác",
								v: hallucinations.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Tự tin giả",
								v: falseConfidence.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Đề xuất chờ",
								v: proposals.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Sách trên kệ",
								v: books.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
								k: "Án lệ",
								v: cases.length
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/review",
						className: "mt-4 inline-block bg-accent px-4 py-3 text-sm text-ink",
						children: "Đọc phản biện"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Việc nên làm trước"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 space-y-3 text-sm leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Đọc phản biện và chín đề xuất. Các đề xuất chưa được tự ý biến thành nguyên tắc mới, trừ những dụng cụ đã ghi rõ là cách thi hành hiến chương." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Chưa mở một mã thật nếu chưa muốn luyện quy trình. Hồ sơ trống cố ý không có số." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Nếu ghi một xác suất, ghi vào sổ cái. Không ghi một phần trăm trong đầu rồi coi là đã cập nhật." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Trạng thái bản đồ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							instruments,
							" dụng cụ đang dùng được. ",
							doctrine,
							" engine mới có học thuyết. ",
							proposed,
							" module đang chờ Owner. Một sơ đồ không phải một hệ thống đang chạy."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/modules",
								className: "border border-line px-3 py-2",
								children: "Bản đồ module"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/protocol",
								className: "border border-line px-3 py-2",
								children: "Quy trình một mã"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/probability",
								className: "border border-line px-3 py-2",
								children: "Sổ xác suất"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/gates",
								className: "border border-line px-3 py-2",
								children: "Cổng nghiệm thu"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Nguyên tắc đang giữ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: bindingPrinciples.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: p.body
						})] }, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/evidence",
						className: "mt-4 inline-block text-sm text-accent",
						children: "Đủ luật bằng chứng"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Mục tiêu của phiên bản này không phải nhanh. Mục tiêu là xây đúng nền, rồi mới mở rộng. Vốn thật vẫn đóng ở Phase 9." })
			})
		]
	});
}
function Count({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-serif text-2xl tabular-nums",
			children: v
		})]
	});
}
//#endregion
export { Home as component };
