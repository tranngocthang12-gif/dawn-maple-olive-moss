import { L as tiers, S as outputSections, p as evidenceClasses, r as bindingPrinciples, y as mandatoryQuestions } from "./logic-DyFXhBq6.mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-CryJMzLA.js
var import_jsx_runtime = require_jsx_runtime();
function EvidencePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Luật bằng chứng",
				title: "Suy luận không được mặc áo sự thật.",
				lede: "Nếu thiếu bằng chứng, câu đúng là chưa đủ bằng chứng. Một nguồn tầng 5 không trở thành tầng 1 vì được nhắc lại nhiều lần."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 space-y-4",
				children: evidenceClasses.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border-t border-line pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						tone: item.id === "fact" || item.id === "data" ? "solid" : item.id === "insufficient" ? "accent" : "muted",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: item.rule
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Tầng nguồn"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: tiers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm text-fg",
							children: t.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: t.body
						})]
					}, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Dòng dõi của một số"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Nguồn, và tầng của nguồn." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Thời điểm thị trường có thể đã biết. Không dùng được cho quá khứ trước thời điểm đó." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Đơn vị và phương pháp. Một tỷ lệ không tên mẫu là chưa đủ." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Liệu nguồn có được phép dùng, và có phải thông tin nội gián hay không." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Phiên bản, nếu số đã bị sửa. Sửa thì ghi dòng mới, không viết đè im lặng." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Giá trị của thông tin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "Trước khi đi lấy thêm một số, hỏi: nếu biết số này, quyết định có đổi không? Nếu không, nó không được ưu tiên. Thu thập vì thu thập được là trình diễn."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Câu hỏi phản biện bắt buộc"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: mandatoryQuestions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-t border-line py-2",
						children: q
					}, q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Mười lăm mục của bản đọc"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Đủ mục không phải quyết định tốt. Mục trống phải hiện là chưa đủ bằng chứng, không được mô hình viết tiếp."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-1 text-sm",
						children: outputSections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							i + 1,
							". ",
							s
						] }, s))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Nguyên tắc còn ràng buộc"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: bindingPrinciples.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: p.body
					})] }, p.id))
				})]
			})
		]
	});
}
//#endregion
export { EvidencePage as component };
