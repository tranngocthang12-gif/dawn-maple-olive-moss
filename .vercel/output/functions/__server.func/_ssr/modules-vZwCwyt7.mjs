import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader } from "./ui-DibgHC3d.mjs";
import { n as modules, t as layers } from "./modules--hoa8YCQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modules-vZwCwyt7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusLabel = {
	instrument: "Dụng cụ",
	doctrine: "Chưa xây engine",
	proposed: "Chờ Owner"
};
function ModulesPage() {
	const [id, setId] = (0, import_react.useState)(modules[0]?.id ?? "charter");
	const [layer, setLayer] = (0, import_react.useState)("all");
	const selected = modules.find((m) => m.id === id) ?? modules[0];
	const visible = modules.filter((m) => layer === "all" || m.layer === layer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Bản đồ",
			title: "Mỗi module có đầu vào, đầu ra, và một việc nó không được làm.",
			lede: "Quan hệ ghi bằng mã module nó đọc và việc nó được phép ghi. Trạng thái chưa xây là trạng thái thật. Đừng đọc bản đồ như thể các engine đang chạy."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex gap-2 overflow-x-auto pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				on: layer === "all",
				label: "Tất cả",
				click: () => setLayer("all")
			}), layers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				on: layer === item,
				label: item,
				click: () => setLayer(item)
			}, item))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-80 space-y-1 overflow-auto lg:max-h-none",
				children: visible.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setId(m.id),
					className: `w-full border px-3 py-2 text-left ${m.id === selected?.id ? "border-accent" : "border-line"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: m.code
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-sm",
						children: m.name
					})]
				}) }, m.id))
			}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-6 min-w-0 border border-line p-4 lg:mt-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: selected.code }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								tone: selected.status === "doctrine" ? "accent" : selected.status === "proposed" ? "accent" : "solid",
								children: statusLabel[selected.status]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, { children: ["Phase ", selected.phase] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-serif text-2xl",
						children: selected.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: selected.layer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed",
						children: selected.purpose
					}),
					selected.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-accent",
						children: selected.note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Sở hữu sự thật về",
						items: [selected.owns]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Đầu vào",
						items: selected.inputs
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Đầu ra",
						items: selected.outputs
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Đọc",
						items: selected.reads.length ? selected.reads : ["Không phụ thuộc module khác"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Được ghi",
						items: selected.writes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Cấm",
						items: selected.forbids
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
						k: "Nghiệm thu",
						items: selected.acceptance
					})
				]
			}) : null]
		})
	] });
}
function Filter({ on, label, click }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: click,
		className: `shrink-0 border px-3 py-2 text-xs ${on ? "border-accent text-fg" : "border-line text-muted"}`,
		children: label
	});
}
function Meta({ k, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs tracking-wide text-muted uppercase",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1 text-sm leading-relaxed",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
		})]
	});
}
//#endregion
export { ModulesPage as component };
