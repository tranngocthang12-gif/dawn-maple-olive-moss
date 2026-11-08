import { i as __toESM } from "../_runtime.mjs";
import { c as expectedReturn, f as processScore } from "./logic-BANorj8p.mjs";
import { J as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass } from "./ui-DWc1CX_7.mjs";
import { n as useDesk } from "./router-C0ltKAi5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-YkiJhuXz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var actions = [
	{
		id: "observe",
		label: "Chỉ quan sát"
	},
	{
		id: "pass",
		label: "Bỏ qua"
	},
	{
		id: "paper",
		label: "Ghi ý định giấy — không phải lệnh"
	},
	{
		id: "hold",
		label: "Giữ luận điểm đã có"
	},
	{
		id: "kill",
		label: "Hủy luận điểm"
	}
];
var causes = [
	{
		id: "",
		label: "Chưa phân loại"
	},
	{
		id: "bad-data",
		label: "Dữ liệu xấu"
	},
	{
		id: "bad-model",
		label: "Mô hình xấu"
	},
	{
		id: "bad-assumptions",
		label: "Giả định xấu"
	},
	{
		id: "bad-execution",
		label: "Thực thi xấu"
	},
	{
		id: "bad-sizing",
		label: "Kích thước xấu"
	},
	{
		id: "bad-luck",
		label: "May rủi"
	},
	{
		id: "mixed",
		label: "Trộn nhiều cửa"
	}
];
var empty = {
	security: "",
	priceNote: "",
	action: "observe",
	thesisId: "",
	expectedReturn: "",
	probabilityNote: "",
	risk: "",
	sizeNote: "",
	catalyst: "",
	invalidation: "",
	alternativeView: "",
	override: false,
	overrideReason: ""
};
function JournalDesk() {
	const theses = useDesk((s) => s.theses);
	const decisions = useDesk((s) => s.decisions);
	const addDecision = useDesk((s) => s.addDecision);
	const patchOutcome = useDesk((s) => s.patchOutcome);
	const amend = useDesk((s) => s.amend);
	const voidDecision = useDesk((s) => s.voidDecision);
	const [form, setForm] = (0, import_react.useState)(empty);
	const [error, setError] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)({});
	const [voids, setVoids] = (0, import_react.useState)({});
	const [voidFor, setVoidFor] = (0, import_react.useState)(null);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function chooseThesis(id) {
		const t = theses.find((x) => x.id === id);
		const ev = t ? expectedReturn(t.scenarios) : null;
		setForm((f) => ({
			...f,
			thesisId: id,
			security: t?.security || f.security,
			expectedReturn: ev === null ? f.expectedReturn : String(ev),
			invalidation: t?.texts.invalidation || f.invalidation
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Nhật ký lưu trên trình duyệt này. Quyết định đã ghi không sửa lõi và không xóa. Muốn đính chính thì thêm tu chính. Ý định giấy không đi ra thị trường." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "bg-accent px-4 py-3 text-sm text-ink",
				onClick: () => setOpen((v) => !v),
				children: open ? "Đóng biểu mẫu" : "Ghi một quyết định"
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4 border border-line p-4",
				onSubmit: (e) => {
					e.preventDefault();
					const result = addDecision({
						...form,
						thesisId: form.thesisId || null
					});
					if (!result.ok) {
						setError(result.reason);
						return;
					}
					setError("");
					setForm(empty);
					setOpen(false);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Gắn thesis",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputClass,
							value: form.thesisId,
							onChange: (e) => chooseThesis(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Không gắn"
							}), theses.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: (t.security || "Chưa đặt tên") + (t.status === "ready" ? " · sẵn sàng" : " · chưa sẵn sàng")
							}, t.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hành động",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							value: form.action,
							onChange: (e) => set("action", e.target.value),
							children: actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: a.id,
								children: a.label
							}, a.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên",
						hint: "Bản chụp sẽ giữ tên này.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.security,
							onChange: (e) => set("security", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Giá và thời điểm",
						hint: "Tự ghi. Hệ thống không lấy giá. Nếu chưa có, viết là chưa có giá.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.priceNote,
							onChange: (e) => set("priceNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lợi nhuận kỳ vọng",
						hint: "Một số không nguồn là chưa đủ. Ghi đơn vị và nói nó đến từ kịch bản nào.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: form.expectedReturn,
							onChange: (e) => set("expectedReturn", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Xác suất",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.probabilityNote,
							onChange: (e) => set("probabilityNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rủi ro",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.risk,
							onChange: (e) => set("risk", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kích thước",
						hint: "Đây là ghi chú của Owner. Không trở thành lệnh.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.sizeNote,
							onChange: (e) => set("sizeNote", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chất xúc tác",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.catalyst,
							onChange: (e) => set("catalyst", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Điều kiện hủy",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.invalidation,
							onChange: (e) => set("invalidation", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quan điểm đối lập",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.alternativeView,
							onChange: (e) => set("alternativeView", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1",
							checked: form.override,
							onChange: (e) => set("override", e.target.checked)
						}), "Ghi đè cổng sẵn sàng. Cần lý do. Việc ghi đè được lưu cùng quyết định."]
					}),
					form.override ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lý do ghi đè",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: form.overrideReason,
							onChange: (e) => set("overrideReason", e.target.value)
						})
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						children: "Khóa bản chụp"
					})
				]
			}) : null,
			decisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Chưa có quyết định. Đó là trạng thái đúng của Phase 0."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-4",
				children: decisions.map((d) => {
					const score = processScore(d);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `border border-line p-4 ${d.voided ? "opacity-60" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl",
										children: d.security || "Không tên"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: actions.find((a) => a.id === d.action)?.label ?? d.action }),
									d.override ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: "accent",
										children: "Ghi đè"
									}) : null,
									d.voided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: "accent",
										children: "Đã void"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, { children: ["Quy trình ", score.score] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [new Date(d.at).toLocaleString("vi-VN"), " · điểm quy trình không phải xác suất đúng"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Giá",
										v: d.priceNote
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Kỳ vọng",
										v: d.expectedReturn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Xác suất",
										v: d.probabilityNote
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Rủi ro",
										v: d.risk
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Kích thước",
										v: d.sizeNote
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Xúc tác",
										v: d.catalyst
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Hủy",
										v: d.invalidation
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Đối lập",
										v: d.alternativeView
									}),
									d.override ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Lý do ghi đè",
										v: d.overrideReason
									}) : null,
									d.voided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Lý do void",
										v: d.voidReason
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: d.thesisSnapshot ? "Có bản chụp thesis tại lúc ghi. Sửa thesis sau này không viết lại bản này." : "Không có bản chụp thesis."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1",
								children: score.parts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-xs text-muted",
									children: [
										p.got ? "Đủ" : "Thiếu",
										" — ",
										p.label
									]
								}, p.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Kết cục, khi đã biết",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: inputClass,
										value: d.outcome,
										onChange: (e) => patchOutcome(d.id, {
											outcome: e.target.value,
											postMortemClass: d.postMortemClass,
											postMortemNote: d.postMortemNote
										}),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "pending",
												children: "Chưa phân giải"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "process-good-outcome-good",
												children: "Quy trình đủ, kết quả tốt"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "process-good-outcome-bad",
												children: "Quy trình đủ, kết quả xấu"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "process-bad-outcome-good",
												children: "Quy trình thiếu, kết quả tốt"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "process-bad-outcome-bad",
												children: "Quy trình thiếu, kết quả xấu"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cửa sai của hệ thống",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: inputClass,
										value: d.postMortemClass,
										onChange: (e) => patchOutcome(d.id, {
											outcome: d.outcome,
											postMortemClass: e.target.value,
											postMortemNote: d.postMortemNote
										}),
										children: causes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.label
										}, c.id || "none"))
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ghi chú mổ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: areaClass,
									value: d.postMortemNote,
									onChange: (e) => patchOutcome(d.id, {
										outcome: d.outcome,
										postMortemClass: d.postMortemClass,
										postMortemNote: e.target.value
									})
								})
							}),
							d.amendments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: d.amendments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm text-muted",
									children: [
										"Tu chính ",
										new Date(a.at).toLocaleString("vi-VN"),
										": ",
										a.note
									]
								}, a.id))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-2 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									placeholder: "Tu chính, không sửa bản gốc",
									value: notes[d.id] ?? "",
									onChange: (e) => setNotes((n) => ({
										...n,
										[d.id]: e.target.value
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "shrink-0 border border-line px-3 py-2 text-sm",
									onClick: () => {
										amend(d.id, notes[d.id] ?? "");
										setNotes((n) => ({
											...n,
											[d.id]: ""
										}));
									},
									children: "Thêm tu chính"
								})]
							}),
							!d.voided ? voidFor === d.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									placeholder: "Lý do void. Dòng quyết định vẫn còn.",
									value: voids[d.id] ?? "",
									onChange: (e) => setVoids((n) => ({
										...n,
										[d.id]: e.target.value
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "border border-accent px-3 py-2 text-sm text-accent",
									onClick: () => {
										voidDecision(d.id, voids[d.id] ?? "");
										setVoidFor(null);
									},
									children: "Khóa void"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-3 text-sm text-accent",
								onClick: () => setVoidFor(d.id),
								children: "Void quyết định này"
							}) : null
						]
					}, d.id);
				})
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "whitespace-pre-wrap",
		children: v || "—"
	})] });
}
function JournalPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-3xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Trí nhớ chống hồi tố",
			title: "Quyết định tốt hay chỉ may, chỉ hỏi được nếu bản lúc ấy còn nguyên.",
			lede: "Ngày, giá, thesis, kỳ vọng, xác suất, rủi ro, kích thước, chất xúc tác, điều kiện hủy, quan điểm khác. Sau khi khóa, lõi không sửa. Kết cục đến sau không được viết lại lý do."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalDesk, {})] });
}
//#endregion
export { JournalPage as component };
