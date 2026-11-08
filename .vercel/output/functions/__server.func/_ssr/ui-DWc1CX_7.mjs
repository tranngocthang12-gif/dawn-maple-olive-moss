import { s as evidenceLabel } from "./logic-BANorj8p.mjs";
import { J as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-DWc1CX_7.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ kicker, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-accent uppercase",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-3xl text-fg lg:text-4xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: lede
			})
		]
	});
}
function Stamp({ children, tone = "muted" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center border px-2 py-0.5 text-xs tracking-wide uppercase ${tone === "solid" ? "border-accent bg-accent text-ink" : tone === "accent" ? "border-accent text-accent" : "border-line text-muted"}`,
		children
	});
}
function klassTone(k) {
	if (k === "fact" || k === "data") return "solid";
	if (k === "hypothesis" || k === "forecast" || k === "insufficient") return "accent";
	return "muted";
}
function EvidenceStamp({ k }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
		tone: klassTone(k),
		children: evidenceLabel(k)
	});
}
function Note({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted",
		children
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-fg",
				children: label
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs leading-relaxed text-muted",
				children: hint
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2",
				children
			})
		]
	});
}
var inputClass = "w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted focus:border-accent";
var areaClass = `${inputClass} min-h-28 leading-relaxed`;
//#endregion
export { Stamp as a, PageHeader as i, Field as n, areaClass as o, Note as r, inputClass as s, EvidenceStamp as t };
