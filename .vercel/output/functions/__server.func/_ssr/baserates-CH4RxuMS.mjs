import { i as __toESM } from "../_runtime.mjs";
import { O as recordUsable } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/baserates-CH4RxuMS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	event: "",
	rateNote: "",
	geography: "",
	period: "",
	source: "",
	tier: "t1",
	asOf: "",
	permitted: false,
	caveat: "",
	supersedes: ""
};
function RatesPage() {
	const rates = useDesk((s) => s.baseRates);
	const add = useDesk((s) => s.addBaseRate);
	const [form, setForm] = (0, import_react.useState)(empty);
	const [error, setError] = (0, import_react.useState)("");
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Sổ base rate",
				title: "Một tỷ lệ không có mẫu thì không phải base rate.",
				lede: "Prior của thị trường Mỹ không được ghi như prior của nơi khác. Nếu nguồn chỉ là tầng 3, dòng bị từ chối cho đến khi có tầng 1 hoặc 2. Học thuật một mình chưa đủ để đưa vào hồ sơ sẵn sàng."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Không có tỷ lệ mẫu nào được cài sẵn. Điền khi bạn đang cầm tài liệu. Giới hạn sử dụng là bắt buộc." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					const result = add(form);
					setError(result.ok ? "" : result.reason);
					if (result.ok) setForm(empty);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.name,
							onChange: (e) => set("name", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sự kiện được đếm",
						hint: "Cái gì được tính là một lần xảy ra. Không định nghĩa thì tỷ lệ vô nghĩa.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.event,
							onChange: (e) => set("event", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tỷ lệ và cỡ mẫu",
						hint: "Viết cả tử, mẫu, và đơn vị. Đừng chỉ viết một phần trăm.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.rateNote,
							onChange: (e) => set("rateNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nơi",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.geography,
									onChange: (e) => set("geography", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Khoảng thời gian của mẫu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.period,
									onChange: (e) => set("period", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ngày biết",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: "date",
									value: form.asOf,
									onChange: (e) => set("asOf", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tầng",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: inputClass,
									value: form.tier,
									onChange: (e) => set("tier", e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "t1",
											children: "Tầng 1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "t2",
											children: "Tầng 2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "t3",
											children: "Tầng 3 — sẽ bị từ chối"
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nguồn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.source,
							onChange: (e) => set("source", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Giới hạn",
						hint: "Nơi nào không được ngoại suy. Thời nào làm mẫu gãy.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.caveat,
							onChange: (e) => set("caveat", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1",
							checked: form.permitted,
							onChange: (e) => set("permitted", e.target.checked)
						}), "Nguồn được phép dùng."]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						children: "Ghi base rate"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-3",
				children: [rates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Sổ trống. Chưa có prior nội bộ."
				}) : null, rates.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							tone: recordUsable(row) ? "solid" : "accent",
							children: recordUsable(row) ? "Dùng được" : "Không dùng được"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-serif text-xl",
							children: row.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: row.rateNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: row.event
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: [
								row.geography,
								" · ",
								row.period,
								" · ",
								row.source,
								" · ",
								row.asOf
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-accent",
							children: row.caveat
						})
					]
				}, row.id))]
			})
		]
	});
}
//#endregion
export { RatesPage as component };
