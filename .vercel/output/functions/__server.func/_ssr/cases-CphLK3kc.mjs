import { i as __toESM } from "../_runtime.mjs";
import { J as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader } from "./ui-DWc1CX_7.mjs";
import { t as cases } from "./cases-CGA6X-YH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-CphLK3kc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var filters = [
	{
		id: "all",
		label: "Tất cả"
	},
	{
		id: "system",
		label: "Hệ thống còn sống"
	},
	{
		id: "failure",
		label: "Đổ"
	},
	{
		id: "pattern",
		label: "Mẫu hình"
	}
];
function CasesPage() {
	const [kind, setKind] = (0, import_react.useState)("all");
	const shown = cases.filter((c) => kind === "all" || c.kind === kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Án lệ",
				title: "Không thần tượng hóa cái sống. Không lấy một vụ đổ để khai tử cả một phương pháp.",
				lede: "Mỗi án có năm ngăn: cái được, cái gãy, vì sao, cái mang sang được, cái không được chép. Suất sinh lời của quỹ không được nhập khi chưa có nguồn sơ cấp trong dòng dõi."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto",
				children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(f.id),
					className: `shrink-0 border px-3 py-2 text-sm ${kind === f.id ? "border-accent text-fg" : "border-line text-muted"}`,
					children: f.label
				}, f.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-8",
				children: shown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border-t border-line pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								tone: item.kind === "failure" ? "accent" : "muted",
								children: item.kind === "system" ? "Hệ thống" : item.kind === "failure" ? "Thất bại" : "Mẫu hình"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: item.when })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-serif text-2xl",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							k: "Cái được",
							items: item.worked
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							k: "Cái gãy",
							items: item.failed
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							k: "Vì sao",
							items: item.why
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							k: "Mang sang được",
							items: item.transfer
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
							k: "Không được chép",
							items: item.notCopy
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-accent",
							children: item.evidence
						})
					]
				}, item.id))
			})
		]
	});
}
function Block({ k, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs tracking-wide text-muted uppercase",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2 text-sm leading-relaxed",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
		})]
	});
}
//#endregion
export { CasesPage as component };
