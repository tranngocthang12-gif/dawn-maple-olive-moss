import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mandate-BoFTBv7u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MandatePage() {
	const mandate = useDesk((s) => s.mandate);
	const patch = useDesk((s) => s.patchMandate);
	const lock = useDesk((s) => s.lockMandate);
	const unlock = useDesk((s) => s.unlockMandate);
	const [error, setError] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "P1 · dụng cụ của Owner",
				title: "Không có ủy thác thì không có hồ sơ sẵn sàng.",
				lede: "Hệ thống không chọn vũ trụ hộ. Khóa xong thì các ô đóng. Muốn đổi phải mở khóa và ghi lý do. Đây chưa phải giấy phép dùng vốn thật."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					tone: mandate.locked ? "solid" : "accent",
					children: mandate.locked ? `Đã khóa ${mandate.lockedAt.slice(0, 10)}` : "Chưa khóa"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					const result = lock();
					setError(result.ok ? "" : result.reason);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tiền tệ tiêu dùng",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							disabled: mandate.locked,
							value: mandate.currency,
							onChange: (e) => patch({ currency: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chân trời mặc định",
						hint: "Ví dụ: 3 đến 7 năm. Không phải ngày mai.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							disabled: mandate.locked,
							value: mandate.horizon,
							onChange: (e) => patch({ horizon: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vành trong",
						hint: "Những gì sau này được phép đưa vào nhật ký như ý định vốn.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							disabled: mandate.locked,
							value: mandate.universeInner,
							onChange: (e) => patch({ universeInner: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vành ngoài",
						hint: "Chỉ theo dõi cơ chế. Không phải ứng viên vốn.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							disabled: mandate.locked,
							value: mandate.universeOuter,
							onChange: (e) => patch({ universeOuter: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Đòn bẩy",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputClass,
							disabled: mandate.locked,
							value: mandate.leverage,
							onChange: (e) => patch({ leverage: e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "Không dùng"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "capped",
								children: "Có trần — phải ghi trần"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Trần đòn bẩy, thuế, thanh khoản",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							disabled: mandate.locked,
							value: mandate.leverageNote,
							onChange: (e) => patch({ leverageNote: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ghi chú thuế",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							disabled: mandate.locked,
							value: mandate.taxNote,
							onChange: (e) => patch({ taxNote: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nhu cầu thanh khoản",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							disabled: mandate.locked,
							value: mandate.liquidityNote,
							onChange: (e) => patch({ liquidityNote: e.target.value })
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: error
					}) : null,
					!mandate.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						children: "Khóa ủy thác"
					}) : null
				]
			}),
			mandate.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3 border-t border-line pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Mở khóa không xóa nội dung. Nó ghi một dòng rằng Owner đã đổi luật chơi." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lý do mở khóa",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "border border-accent px-4 py-3 text-sm text-accent",
						onClick: () => {
							const result = unlock(reason);
							setError(result.ok ? "" : result.reason);
							if (result.ok) setReason("");
						},
						children: "Mở khóa"
					})
				]
			}) : null,
			mandate.amendments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-2 text-sm text-muted",
				children: mandate.amendments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					a.at.slice(0, 16).replace("T", " "),
					" — ",
					a.note
				] }, a.id))
			}) : null
		]
	});
}
//#endregion
export { MandatePage as component };
