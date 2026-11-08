import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader } from "./ui-DibgHC3d.mjs";
import { a as hallucinations, c as proposals, i as gaps, l as risks, n as dupes, o as keptOnPurpose, r as falseConfidence, s as overfit, t as assumptions } from "./review-CHcBQd2e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/review-BGzxEFzs.js
var import_jsx_runtime = require_jsx_runtime();
var klassLabel = {
	fact: "Sự thật về văn bản",
	inference: "Suy luận",
	hypothesis: "Giả thuyết"
};
function ReviewPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Phản biện trước khi xây tiếp",
				title: "Kiến trúc này chưa hoàn hảo.",
				lede: "Đây là suy luận của Foundation V1 về chính hiến chương. Nó không phải một kiểm toán độc lập, và không phải lý do để cắt nguyên tắc cho dễ làm. Chín đề xuất ở cuối đang chờ Owner."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-6 flex flex-wrap gap-2 text-sm",
				"aria-label": "Mục phản biện",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#gaps",
						children: "Thiếu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#dupes",
						children: "Trùng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#risks",
						children: "Rủi ro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#assumptions",
						children: "Giả định"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#overfit",
						children: "Overfitting"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#hallucinations",
						children: "Ảo giác"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#confidence",
						children: "Tự tin giả"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "border border-line px-3 py-2",
						href: "#proposals",
						children: "Đề xuất"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "gaps",
				title: "Thiếu sót",
				items: gaps
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "dupes",
				title: "Trùng",
				items: dupes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "risks",
				title: "Rủi ro",
				items: risks
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "assumptions",
				title: "Giả định ẩn",
				items: assumptions
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "overfit",
				title: "Cửa overfitting",
				items: overfit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "hallucinations",
				title: "Cửa ảo giác",
				items: hallucinations
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
				id: "confidence",
				title: "Cửa tự tin giả",
				items: falseConfidence
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "kept",
				className: "mt-12 border-t border-line pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Không bị cắt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm leading-relaxed text-muted",
					children: keptOnPurpose.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "proposals",
				className: "mt-12 border-t border-line pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Đề xuất đang chờ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: "Mỗi đề xuất có lý do, phản biện, và so sánh. Khuyến nghị là suy luận của kiến trúc sư, không phải quyết định. Owner chưa gật thì đề xuất chưa thành luật, trừ những chỗ đã ghi là dụng cụ thi hành nguyên tắc cũ."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-6",
						children: proposals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border border-line p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: "accent",
										children: p.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Chờ Owner" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-serif text-xl",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prop, {
									k: "Đề xuất",
									v: p.proposal
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prop, {
									k: "Vì sao",
									v: p.why
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prop, {
									k: "Phản biện",
									v: p.counter
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prop, {
									k: "So sánh",
									v: p.compare
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prop, {
									k: "Khuyến nghị, loại suy luận",
									v: p.recommend
								})
							]
						}, p.id))
					})
				]
			})
		]
	});
}
function Block({ id, title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "mt-12 border-t border-line pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-2xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-5",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					tone: item.klass === "fact" ? "solid" : item.klass === "hypothesis" ? "accent" : "muted",
					children: klassLabel[item.klass]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 text-base text-fg",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: item.body
				})
			] }, item.id))
		})]
	});
}
function Prop({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-3 text-sm leading-relaxed",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-muted",
			children: [k, ". "]
		}), v]
	});
}
//#endregion
export { ReviewPage as component };
