import { i as __toESM } from "../_runtime.mjs";
import { A as scenarioWarnings, I as thesisBlockers, T as priorDecisions, c as confidenceGaps, h as expectedReturn, k as scenarioSum, l as confidenceOf, o as claimIssues, t as adversarial } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass, t as EvidenceStamp } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/protocol-yRdw6nMa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var screens = [
	{
		id: "id",
		title: "Danh tính"
	},
	{
		id: "biz",
		title: "Kinh doanh"
	},
	{
		id: "fin",
		title: "Tài chính"
	},
	{
		id: "ctx",
		title: "Bối cảnh"
	},
	{
		id: "net",
		title: "Mạng"
	},
	{
		id: "exp",
		title: "Kỳ vọng"
	},
	{
		id: "ev",
		title: "Bằng chứng"
	},
	{
		id: "sc",
		title: "Kịch bản"
	},
	{
		id: "kill",
		title: "Hủy bỏ"
	},
	{
		id: "out",
		title: "Bản đọc"
	}
];
var scenarioLabel = {
	bull: "Tăng",
	base: "Cơ sở",
	bear: "Giảm",
	tail: "Đuôi"
};
var classes = [
	"fact",
	"data",
	"inference",
	"hypothesis",
	"forecast",
	"unverified",
	"insufficient"
];
var className = {
	fact: "Sự thật",
	data: "Dữ liệu",
	inference: "Suy luận",
	hypothesis: "Giả thuyết",
	forecast: "Dự báo",
	unverified: "Chưa xác minh",
	insufficient: "Chưa đủ bằng chứng"
};
function num(raw) {
	if (raw.trim() === "") return null;
	const n = Number(raw);
	return Number.isFinite(n) ? n : null;
}
function ThesisDesk() {
	const theses = useDesk((s) => s.theses);
	const activeId = useDesk((s) => s.activeThesisId);
	const createThesis = useDesk((s) => s.createThesis);
	const setActive = useDesk((s) => s.setActive);
	const updateThesis = useDesk((s) => s.updateThesis);
	const patchText = useDesk((s) => s.patchText);
	const addClaim = useDesk((s) => s.addClaim);
	const updateClaim = useDesk((s) => s.updateClaim);
	const removeClaim = useDesk((s) => s.removeClaim);
	const addKill = useDesk((s) => s.addKill);
	const updateKill = useDesk((s) => s.updateKill);
	const removeKill = useDesk((s) => s.removeKill);
	const refreshStatus = useDesk((s) => s.refreshStatus);
	const mandate = useDesk((s) => s.mandate);
	const world = useDesk((s) => s.world);
	const baseRates = useDesk((s) => s.baseRates);
	const companies = useDesk((s) => s.companies);
	const decisions = useDesk((s) => s.decisions);
	const [screen, setScreen] = (0, import_react.useState)("id");
	const [bookError, setBookError] = (0, import_react.useState)("");
	const openThesis = () => {
		const result = createThesis();
		if (!result.ok) setBookError(result.reason);
		else setBookError("");
	};
	const thesis = theses.find((t) => t.id === activeId) ?? theses[0] ?? null;
	const ctx = {
		mandate,
		world,
		baseRates,
		companies,
		decisions
	};
	(0, import_react.useEffect)(() => {
		if (thesis && thesis.status !== "invalidated") refreshStatus(thesis.id);
	}, [
		thesis,
		refreshStatus,
		companies,
		mandate,
		world,
		baseRates,
		decisions
	]);
	const blockers = (0, import_react.useMemo)(() => thesis ? thesisBlockers(thesis, ctx) : [], [
		thesis,
		mandate,
		world,
		baseRates,
		companies,
		decisions
	]);
	const confidence = thesis ? confidenceOf(thesis, ctx) : null;
	const gaps = thesis ? confidenceGaps(thesis, ctx) : [];
	const ev = thesis ? expectedReturn(thesis.scenarios) : null;
	const sum = thesis ? scenarioSum(thesis.scenarios) : null;
	const warnings = thesis ? scenarioWarnings(thesis.scenarios) : [];
	if (!thesis) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Chưa có hồ sơ. Quy trình này là một khung trống. Nó không điền tên công ty, không điền số, và không kết luận giúp Owner." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 bg-accent px-4 py-3 text-sm text-ink",
				onClick: openThesis,
				children: "Mở một hồ sơ trống"
			}),
			bookError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-accent",
				children: bookError
			}) : null
		]
	});
	const text = (key, label, hint) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		hint,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			className: areaClass,
			value: thesis.texts[key],
			onChange: (e) => patchText(thesis.id, key, e.target.value)
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-3 lg:block lg:overflow-visible",
					children: theses.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActive(t.id),
						className: `shrink-0 border px-3 py-2 text-left text-sm lg:mb-2 lg:block lg:w-full ${t.id === thesis.id ? "border-accent text-fg" : "border-line text-muted"}`,
						children: t.security.trim() || "Chưa đặt tên"
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 border border-line px-3 py-2 text-sm text-fg",
					onClick: openThesis,
					children: "Hồ sơ mới"
				}),
				bookError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-accent",
					children: bookError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 hidden space-y-1 lg:block",
					children: screens.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `w-full px-2 py-1.5 text-left text-sm ${screen === s.id ? "text-accent" : "text-muted"}`,
						onClick: () => setScreen(s.id),
						children: [
							i + 1,
							". ",
							s.title
						]
					}) }, s.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							tone: thesis.status === "ready" ? "solid" : thesis.status === "invalidated" ? "accent" : "muted",
							children: thesis.status === "ready" ? "Sẵn sàng để Owner đọc" : thesis.status === "invalidated" ? "Đã hủy" : "Bản nháp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: confidence?.level ?? "LOW" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							tone: "accent",
							children: "HIGH đang khóa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Chưa hiệu chỉnh" })
					]
				}),
				gaps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1 text-sm text-muted",
					children: gaps.map((gap) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: gap }, gap))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: blockers.length === 0 ? "Đủ ô để đọc. Vẫn không phải lệnh." : `${blockers.length} việc còn chặn trạng thái sẵn sàng.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-2 overflow-x-auto lg:hidden",
					children: screens.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `shrink-0 border px-3 py-2 text-sm ${screen === s.id ? "border-accent text-fg" : "border-line text-muted"}`,
						onClick: () => setScreen(s.id),
						children: s.title
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-5",
					children: [
						screen === "id" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: mandate.locked ? `Ủy thác đã khóa: ${mandate.currency}, chân trời ${mandate.horizon}. Vành trong: ${mandate.universeInner}` : "Ủy thác chưa khóa. Hồ sơ có thể nháp, nhưng không thể sẵn sàng." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Vành",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: inputClass,
									value: thesis.ring ?? "",
									onChange: (e) => updateThesis(thesis.id, { ring: e.target.value }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Chưa chọn"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "inner",
											children: "Trong — được xét như ý định vốn, sau này"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "outer",
											children: "Ngoài — chỉ theo dõi cơ chế"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Hồ sơ doanh nghiệp",
								hint: "Hồ sơ luận điểm không sẵn sàng nếu doanh nghiệp chưa được nộp. CHƯA ĐỦ BẰNG CHỨNG là được. Bỏ trống thì không.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: inputClass,
									value: thesis.companyId ?? "",
									onChange: (e) => updateThesis(thesis.id, { companyId: e.target.value }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Chưa gắn"
									}), companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: (c.name.trim() || "Chưa đặt tên") + (c.status === "filed" ? " · đã đóng" : " · nháp")
									}, c.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Chứng khoán",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: thesis.security,
									onChange: (e) => updateThesis(thesis.id, { security: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorCalls, {
								security: thesis.security,
								seen: thesis.priorSeenIds ?? [],
								decisions,
								onSeen: (ids) => updateThesis(thesis.id, { priorSeenIds: ids })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Sàn hoặc thị trường",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: thesis.venue,
									onChange: (e) => updateThesis(thesis.id, { venue: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tiền tệ của luận điểm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: thesis.currency,
									onChange: (e) => updateThesis(thesis.id, { currency: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Chân trời của riêng hồ sơ này",
								hint: "Phải nằm trong chân trời ủy thác. Hệ thống không tự đối chiếu hộ.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputClass,
									value: thesis.horizon,
									onChange: (e) => updateThesis(thesis.id, { horizon: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Base rate gắn vào hồ sơ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: inputClass,
									value: thesis.baseRateId ?? "",
									onChange: (e) => updateThesis(thesis.id, { baseRateId: e.target.value }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Không gắn — khi đó phải xác nhận là chưa có base rate"
									}), baseRates.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r.id,
										children: r.name
									}, r.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-sm",
									children: "Quan sát thế giới dùng trong hồ sơ"
								}),
								world.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "Sổ thế giới đang trống."
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2",
									children: world.map((w) => {
										const ids = thesis.worldIds ?? [];
										const on = ids.includes(w.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-start gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "mt-1",
												checked: on,
												onChange: () => updateThesis(thesis.id, { worldIds: on ? ids.filter((id) => id !== w.id) : [...ids, w.id] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												w.name,
												" · ",
												w.geography,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-xs text-muted",
													children: [
														"mức ",
														w.level || "—",
														" · đổi ",
														w.delta || "—",
														" · gia tốc ",
														w.acceleration || "—"
													]
												})
											] })]
										}) }, w.id);
									})
								})
							] })
						] }) : null,
						screen === "biz" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							text("business", "Mô hình kinh doanh", "Sản phẩm, khách hàng, giá, hào. Nếu chưa biết, ghi CHƯA ĐỦ BẰNG CHỨNG."),
							text("industry", "Ngành"),
							text("position", "Vị thế cạnh tranh"),
							text("management", "Ban lãnh đạo", "Năng lực, nhất quán, sở hữu, giao dịch nội bộ, đổi CFO hoặc kiểm toán.")
						] }) : null,
						screen === "fin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							text("financialQuality", "Chất lượng lợi nhuận", "Phải thu, tồn kho, dồn tích, vốn hóa, bên liên quan, pha loãng, ngoài bảng."),
							text("balanceSheet", "Bảng cân đối"),
							text("cashFlow", "Dòng tiền"),
							text("capitalAllocation", "Phân bổ vốn")
						] }) : null,
						screen === "ctx" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							text("growth", "Động lực tăng trưởng"),
							text("risks", "Rủi ro"),
							text("macro", "Phơi nhiễm vĩ mô")
						] }) : null,
						screen === "net" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Mọi đối tác không có nguồn là chưa xác minh. Đừng để một đoạn văn trôi chảy tạo ra một nhà cung cấp." }),
							text("graph", "Đồ thị kinh tế"),
							text("suppliers", "Tín hiệu nhà cung cấp"),
							text("customers", "Tín hiệu khách hàng"),
							text("weakSignals", "Tín hiệu yếu", "Chỉ ghi nếu có cơ chế tới lợi nhuận. Không có thì ghi chưa có.")
						] }) : null,
						screen === "exp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							text("marketBelieves", "Thị trường đang tin gì"),
							text("difference", "Ta tin khác ở đâu", "Nếu không khác gì, hãy viết là không có khoảng kỳ vọng."),
							text("valuation", "Định giá", "Ghi các cách định giá đang mâu thuẫn. Ô này không tính một giá mục tiêu."),
							text("portfolioImpact", "Nếu luận điểm đúng, danh mục chịu gì", "Tương quan, tập trung, thanh khoản. Không điền tỷ trọng.")
						] }) : null,
						screen === "ev" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Sự thật và dữ liệu cần nguồn, tầng 1 hoặc 2, ngày thị trường có thể biết, và xác nhận được phép dùng." }),
							thesis.claims.map((c) => {
								const issues = claimIssues(c);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-line p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceStamp, { k: c.klass }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "text-xs text-muted",
												onClick: () => removeClaim(thesis.id, c.id),
												children: "Bỏ claim"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: areaClass,
											value: c.text,
											onChange: (e) => updateClaim(thesis.id, c.id, { text: e.target.value })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 grid gap-3 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: inputClass,
													value: c.klass,
													onChange: (e) => updateClaim(thesis.id, c.id, { klass: e.target.value }),
													children: classes.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: k,
														children: className[k]
													}, k))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: inputClass,
													value: c.tier,
													onChange: (e) => updateClaim(thesis.id, c.id, { tier: e.target.value }),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "none",
															children: "Chưa có tầng"
														}),
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
															children: "Tầng 3"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "t4",
															children: "Tầng 4"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "t5",
															children: "Tầng 5"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: inputClass,
													placeholder: "Nguồn",
													value: c.source,
													onChange: (e) => updateClaim(thesis.id, c.id, { source: e.target.value })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: inputClass,
													type: "date",
													value: c.asOf,
													onChange: (e) => updateClaim(thesis.id, c.id, { asOf: e.target.value })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: inputClass,
													placeholder: "Đơn vị",
													value: c.unit,
													onChange: (e) => updateClaim(thesis.id, c.id, { unit: e.target.value })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-3 flex items-start gap-2 text-sm text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "mt-1",
												checked: c.permitted,
												onChange: (e) => updateClaim(thesis.id, c.id, { permitted: e.target.checked })
											}), "Nguồn được phép dùng và không phải thông tin nội gián, theo hiểu biết của Owner."]
										}),
										issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-accent",
											children: issues[0]
										}) : null
									]
								}, c.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "border border-line px-4 py-3 text-sm",
								onClick: () => addClaim(thesis.id),
								children: "Thêm claim"
							})
						] }) : null,
						screen === "sc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Note, { children: [
								"Lợi nhuận kỳ vọng = tổng xác suất nhân mức lời. Tổng phải bằng 100. Hệ thống không gợi ý các con số.",
								sum === null ? " Chưa đủ xác suất." : ` Tổng hiện tại ${sum}%.`,
								ev === null ? "" : ` Kỳ vọng ${ev}%.`,
								" Con số này chưa hiệu chỉnh."
							] }),
							warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-accent",
								children: w
							}, w)),
							thesis.scenarios.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
								className: "border border-line p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
										className: "px-2 font-serif text-lg",
										children: scenarioLabel[s.name]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Xác suất %",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: `${inputClass} tabular-nums`,
												inputMode: "decimal",
												value: s.probability ?? "",
												onChange: (e) => updateThesis(thesis.id, { scenarios: thesis.scenarios.map((x) => x.name === s.name ? {
													...x,
													probability: num(e.target.value)
												} : x) })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Lợi nhuận %",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: `${inputClass} tabular-nums`,
												inputMode: "decimal",
												value: s.returnPct ?? "",
												onChange: (e) => updateThesis(thesis.id, { scenarios: thesis.scenarios.map((x) => x.name === s.name ? {
													...x,
													returnPct: num(e.target.value)
												} : x) })
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 space-y-3",
										children: [
											["narrative", "Diễn giải"],
											["catalyst", "Chất xúc tác"],
											["revenue", "Doanh thu"],
											["margin", "Biên"],
											["multiple", "Hệ số"],
											["fairValue", "Giá trị trong kịch bản này"],
											["risk", "Rủi ro của kịch bản"]
										].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: areaClass,
												value: s[key],
												onChange: (e) => updateThesis(thesis.id, { scenarios: thesis.scenarios.map((x) => x.name === s.name ? {
													...x,
													[key]: e.target.value
												} : x) })
											})
										}, key))
									})
								]
							}, s.name))
						] }) : null,
						screen === "kill" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							text("bear", "Luận điểm phe bán viết riêng", "Viết như thể nhiệm vụ là chứng minh luận điểm chính sai."),
							text("contrary", "Bằng chứng đang chống lại"),
							text("missing", "Thông tin còn thiếu"),
							text("invalidation", "Điều kiện hủy, bằng lời"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [thesis.kills.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 border border-line p-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: `Tiêu chí hủy ${i + 1}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: inputClass,
												value: k.text,
												onChange: (e) => updateKill(thesis.id, k.id, { text: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Ngưỡng",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: inputClass,
												value: k.threshold,
												onChange: (e) => updateKill(thesis.id, k.id, { threshold: e.target.value })
											})
										}),
										thesis.kills.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-left text-xs text-muted",
											onClick: () => removeKill(thesis.id, k.id),
											children: "Bỏ tiêu chí này"
										}) : null
									]
								}, k.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "border border-line px-4 py-3 text-sm",
									onClick: () => addKill(thesis.id),
									children: "Thêm tiêu chí"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Số nguồn độc lập",
								hint: "Đếm nguồn thật sự khác nhau, không đếm số lần nhắc lại.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${inputClass} tabular-nums`,
									inputMode: "numeric",
									value: thesis.checks.independentSources || "",
									onChange: (e) => updateThesis(thesis.id, { checks: {
										...thesis.checks,
										independentSources: Math.max(0, Math.floor(num(e.target.value) ?? 0))
									} })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "mt-1",
									checked: thesis.checks.baseRateCited,
									onChange: (e) => updateThesis(thesis.id, { checks: {
										...thesis.checks,
										baseRateCited: e.target.checked
									} })
								}), "Đã nêu base rate, hoặc đã ghi rõ là chưa có base rate đáng dùng."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "mt-1",
									checked: thesis.checks.contraryConsidered,
									onChange: (e) => updateThesis(thesis.id, { checks: {
										...thesis.checks,
										contraryConsidered: e.target.checked
									} })
								}), "Đã đọc bằng chứng trái, không chỉ phần ủng hộ."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "mt-1",
									checked: thesis.checks.notBecauseProse,
									onChange: (e) => updateThesis(thesis.id, { checks: {
										...thesis.checks,
										notBecauseProse: e.target.checked
									} })
								}), "Độ tin cậy này không đến từ việc đoạn văn nghe chắc."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ghi chú vốn của Owner",
								hint: "Hệ thống không điền ô này và không biến nó thành lệnh.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: areaClass,
									value: thesis.ownerCapitalNote,
									onChange: (e) => updateThesis(thesis.id, { ownerCapitalNote: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "border border-line px-4 py-3 text-sm",
									onClick: () => updateThesis(thesis.id, { status: "invalidated" }),
									children: "Đánh dấu đã hủy"
								}), thesis.status === "invalidated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "border border-line px-4 py-3 text-sm",
									onClick: () => updateThesis(thesis.id, { status: "draft" }),
									children: "Mở lại để sửa"
								}) : null]
							})
						] }) : null,
						screen === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Note, { children: [
									"Bản đọc lắp từ các ô Owner đã viết. Ô ngắn hiện là chưa đủ bằng chứng. Không có câu nào ở đây được mô hình thêm vào. Lợi nhuận kỳ vọng ",
									ev === null ? "chưa tính được" : `${ev}%`,
									". Độ tin cậy ",
									confidence?.level,
									". HIGH không mở."
								] }),
								confidence?.reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: r
								}, r)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Tóm tắt điều hành",
									body: `${thesis.security || "Chưa đặt tên"} · ${thesis.venue || "chưa có sàn"} · ${thesis.horizon || "chưa có chân trời"}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Thị trường đang tin",
									body: thesis.texts.marketBelieves
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Ta tin khác",
									body: thesis.texts.difference
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl",
										children: "Bằng chứng"
									}),
									thesis.claims.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted",
										children: "CHƯA ĐỦ BẰNG CHỨNG"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-3",
										children: thesis.claims.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "border-t border-line pt-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceStamp, { k: c.klass }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm leading-relaxed",
													children: c.text || "Trống"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xs text-muted",
													children: [
														c.source || "chưa có nguồn",
														" · ",
														c.tier,
														" · ",
														c.asOf || "chưa có ngày",
														" ",
														c.unit ? `· ${c.unit}` : ""
													]
												})
											]
										}, c.id))
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Chất lượng cơ bản",
									body: [
										thesis.texts.financialQuality,
										thesis.texts.balanceSheet,
										thesis.texts.cashFlow,
										thesis.texts.capitalAllocation
									].filter((x) => x.trim()).join("\n\n")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Định giá",
									body: thesis.texts.valuation
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Bốn kịch bản",
									body: thesis.scenarios.map((s) => `${scenarioLabel[s.name]}: ${s.probability ?? "—"}% → ${s.returnPct ?? "—"}%. ${s.narrative}`).join("\n\n")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Phía dưới và phe bán",
									body: `${thesis.texts.bear}\n\n${thesis.texts.contrary}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Điều kiện hủy",
									body: [thesis.texts.invalidation, ...thesis.kills.map((k) => `${k.text} — ngưỡng: ${k.threshold}`)].join("\n")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Còn thiếu",
									body: thesis.texts.missing
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
									title: "Ghi chú vốn của Owner",
									body: thesis.ownerCapitalNote || "Owner chưa ghi. Hệ thống không đề xuất tỷ trọng."
								})
							]
						}) : null
					]
				}),
				blockers.length > 0 && screen !== "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 border-t border-line pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm text-fg",
						children: "Còn chặn"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm text-muted",
						children: [blockers.slice(0, 6).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: b }, b)), blockers.length > 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Và ",
							blockers.length - 6,
							" mục nữa."
						] }) : null]
					})]
				}) : null
			]
		})]
	});
}
var callLabel = {
	observe: "Chỉ quan sát",
	pass: "Bỏ qua",
	paper: "Ghi trên giấy",
	hold: "Giữ luận điểm",
	kill: "Hủy luận điểm"
};
var resultLabel = {
	pending: "Chưa có kết quả",
	"": "Chưa có kết quả",
	"process-good-outcome-good": "Cách làm đủ, kết quả tốt — chưa chứng minh cách làm luôn đúng",
	"process-good-outcome-bad": "Cách làm đủ, kết quả xấu",
	"process-bad-outcome-good": "Cách làm thiếu, kết quả tốt — có thể là may",
	"process-bad-outcome-bad": "Cách làm thiếu, kết quả xấu"
};
function PriorCalls({ security, seen, decisions, onSeen }) {
	const prior = priorDecisions(security, decisions);
	if (security.trim().length < 2) return null;
	if (prior.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Mã này chưa có quyết định cũ. Chưa có thắng hay thua để học."
	});
	const seenSet = new Set(seen);
	const unseen = prior.filter((d) => !seenSet.has(d.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Mã này đã có quyết định. Cuộc trò chuyện mới không được kể từ đầu."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: prior.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line pt-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						new Date(d.at).toLocaleString("vi-VN"),
						" · ",
						callLabel[d.action],
						" · ",
						resultLabel[d.outcome] ?? "Chưa có kết quả"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: d.invalidation.trim() || "Chưa ghi điều kiện hủy."
					})]
				}, d.id))
			}),
			unseen.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 border border-accent px-4 py-3 text-sm",
				onClick: () => onSeen(prior.map((d) => d.id)),
				children: "Tôi đã đọc các quyết định cũ của mã này"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Đã đọc đủ các dòng hiện có. Có quyết định mới thì phải đọc lại."
			})
		]
	});
}
function Section({ title, body }) {
	const clean = body.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-serif text-xl",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted",
		children: clean.length >= 12 ? clean : "CHƯA ĐỦ BẰNG CHỨNG"
	})] });
}
function ProtocolPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Quy trình mặc định khi Owner đưa một mã",
				title: "Khung trống. Không có mã mẫu. Không có số mẫu.",
				lede: "Hai mươi hai chiều của hiến chương nằm trong các màn hình. Sẵn sàng chỉ có nghĩa là các ô đã được điền đủ trung thực, kể cả bằng câu chưa đủ bằng chứng. Sẵn sàng không có nghĩa là mua."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Năm vai A đến E chưa được triển khai thành agent. Cùng một họ mô hình ngôn ngữ không được tính là năm nhà phân tích. Nếu làm phản biện bằng tay, phe bán viết xong bản riêng trước khi đọc kết luận phe mua." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2 text-sm text-muted",
				children: adversarial.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-fg",
					children: [
						role.id,
						" · ",
						role.role,
						". "
					]
				}), role.job] }, role.id))
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThesisDesk, {})] });
}
//#endregion
export { ProtocolPage as component };
