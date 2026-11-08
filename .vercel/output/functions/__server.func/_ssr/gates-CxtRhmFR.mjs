import { w as phases } from "./logic-DyFXhBq6.mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gates-CxtRhmFR.js
var import_jsx_runtime = require_jsx_runtime();
var stateLabel = {
	open: "Đang mở",
	shelf: "Mới là kệ",
	closed: "Đóng"
};
function GatesPage() {
	const signoff = useDesk((s) => s.signoff);
	const toggle = useDesk((s) => s.toggleSignoff);
	const phase0 = phases[0];
	const signed = phase0 ? phase0.acceptance.filter((_, i) => signoff[`p0-${i}`]).length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Cổng",
				title: "Không phase nào mở vì tài liệu đã dài.",
				lede: "Phase 0 có thể được Owner đánh dấu đã đọc. Việc đánh dấu là chữ ký của người, không phải của hệ thống. Các phase sau vẫn đóng. Vốn thật không có cửa ở phiên bản này."
			}),
			phase0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm tabular-nums text-muted",
				children: [
					"Owner đã đánh dấu ",
					signed,
					"/",
					phase0.acceptance.length,
					" mục Phase 0. Hệ thống không tự ký."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-8",
				children: phases.map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border-t border-line pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								tone: phase.state === "closed" ? "muted" : phase.state === "open" ? "solid" : "accent",
								children: stateLabel[phase.state]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-serif text-2xl",
							children: phase.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: phase.intent
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: phase.acceptance.map((item, i) => {
								const key = `${phase.id}-${i}`;
								const on = Boolean(signoff[key]);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-3 text-sm leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-1",
										checked: on,
										disabled: phase.state === "closed",
										onChange: () => toggle(key)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: phase.state === "closed" ? "text-muted" : "",
										children: item
									})]
								}) }, key);
							})
						})
					]
				}, phase.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: "Điều kiện trước vốn thật vẫn là: ngoài mẫu, walk-forward, chi phí, thanh khoản, regime, đuôi, giấy, hiệu chỉnh, và phản biện độc lập. Một backtest đẹp không nằm trong danh sách đủ."
			})
		]
	});
}
//#endregion
export { GatesPage as component };
