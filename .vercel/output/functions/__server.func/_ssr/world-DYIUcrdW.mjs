import { i as __toESM } from "../_runtime.mjs";
import { O as recordUsable } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/world-DYIUcrdW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var domains = [
	"Lãi suất",
	"Lạm phát",
	"Tăng trưởng",
	"Việc làm",
	"Tín dụng",
	"Thanh khoản",
	"Tỷ giá",
	"Hàng hóa",
	"Địa chính trị",
	"Chính sách"
];
var empty = {
	domain: "Lãi suất",
	name: "",
	geography: "",
	level: "",
	delta: "",
	acceleration: "",
	unit: "",
	source: "",
	tier: "t1",
	asOf: "",
	permitted: false,
	supersedes: ""
};
function WorldPage() {
	const world = useDesk((s) => s.world);
	const addWorld = useDesk((s) => s.addWorld);
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
				kicker: "Một bản ghi · nhiều người đọc",
				title: "Thế giới chỉ tồn tại khi có nguồn và ngày.",
				lede: "Mỗi dòng phải có mức, hoặc tốc độ đổi, hoặc gia tốc. Không có dòng thì chưa có trạng thái thế giới. Hệ thống không tải số vĩ mô."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Tầng 4 và tầng 5 bị từ chối. Một bài báo không trở thành trạng thái thế giới. Đính chính bằng dòng mới, không xóa dòng cũ." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					const result = addWorld(form);
					setError(result.ok ? "" : result.reason);
					if (result.ok) setForm(empty);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Miền",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: inputClass,
									value: form.domain,
									onChange: (e) => set("domain", e.target.value),
									children: domains.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Chỉ tiêu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.name,
									onChange: (e) => set("name", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Địa lý",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.geography,
									onChange: (e) => set("geography", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Đơn vị",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.unit,
									onChange: (e) => set("unit", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Mức",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.level,
									onChange: (e) => set("level", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tốc độ đổi",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.delta,
									onChange: (e) => set("delta", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Gia tốc",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: form.acceleration,
									onChange: (e) => set("acceleration", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ngày thị trường có thể biết",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									type: "date",
									value: form.asOf,
									onChange: (e) => set("asOf", e.target.value)
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "t4",
									children: "Tầng 4 — sẽ bị từ chối"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "t5",
									children: "Tầng 5 — sẽ bị từ chối"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Đính chính dòng cũ, nếu có",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.supersedes,
							onChange: (e) => set("supersedes", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1",
							checked: form.permitted,
							onChange: (e) => set("permitted", e.target.checked)
						}), "Nguồn được phép dùng và không phải thông tin nội gián."]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						children: "Ghi quan sát"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-3",
				children: [world.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Sổ trống."
				}) : null, world.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: row.domain }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								tone: recordUsable(row) ? "solid" : "accent",
								children: recordUsable(row) ? "Dùng được" : "Không dùng được"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-2 font-serif text-xl",
							children: [
								row.name,
								" · ",
								row.geography
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm tabular-nums text-muted",
							children: [
								"Mức ",
								row.level || "—",
								" ",
								row.unit,
								" · đổi ",
								row.delta || "—",
								" · gia tốc ",
								row.acceleration || "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								row.source,
								" · ",
								row.tier,
								" · biết lúc ",
								row.asOf,
								row.supersedes ? ` · đính chính ${row.supersedes}` : ""
							]
						})
					]
				}, row.id))]
			})
		]
	});
}
//#endregion
export { WorldPage as component };
