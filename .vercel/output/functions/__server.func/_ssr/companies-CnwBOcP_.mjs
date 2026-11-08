import { i as __toESM } from "../_runtime.mjs";
import { D as qualityItems, s as companyFileIssues } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/companies-CnwBOcP_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var standards = [
	{
		id: "",
		label: "Chưa chọn"
	},
	{
		id: "VAS",
		label: "VAS"
	},
	{
		id: "IFRS",
		label: "IFRS"
	},
	{
		id: "US-GAAP",
		label: "US GAAP"
	},
	{
		id: "other",
		label: "Khác — phải ghi tên chuẩn"
	}
];
var states = [
	{
		id: "open",
		label: "Để ngỏ"
	},
	{
		id: "clear",
		label: "Chưa thấy vấn đề — vẫn là suy luận"
	},
	{
		id: "question",
		label: "Câu hỏi mở"
	},
	{
		id: "flag",
		label: "Cờ đỏ — giả thuyết"
	}
];
var emptyFact = {
	text: "",
	source: "",
	tier: "t1",
	asOf: "",
	unit: "",
	permitted: false
};
function CompaniesPage() {
	const companies = useDesk((s) => s.companies);
	const createCompany = useDesk((s) => s.createCompany);
	const patchCompany = useDesk((s) => s.patchCompany);
	const addFact = useDesk((s) => s.addCompanyFact);
	const setQuality = useDesk((s) => s.setQuality);
	const fileCompany = useDesk((s) => s.fileCompany);
	const companySeals = useDesk((s) => s.companySeals);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [fact, setFact] = (0, import_react.useState)(emptyFact);
	const [error, setError] = (0, import_react.useState)("");
	const file = companies.find((c) => c.id === activeId) ?? companies[0] ?? null;
	const issues = file ? companyFileIssues(file) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Phase 2 · hồ sơ do Owner nộp",
				title: "Không có báo cáo nào được điền hộ.",
				lede: "Một hồ sơ doanh nghiệp giữ danh tính, chuẩn kế toán, sự kiện có nguồn, và chín chiều chất lượng lợi nhuận. Cờ đỏ là giả thuyết. Nó không phải kết luận gian lận, và nó không phải lệnh."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Nộp xong, bản đó được đóng và không sửa được. Bạn gõ tiếp thì đang viết bản nháp mới. Bản đã đóng vẫn còn, để nhật ký sau này không bị viết lại. VAS, IFRS và US GAAP không được ghi như cùng một ngôn ngữ." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 bg-accent px-4 py-3 text-sm text-ink",
				onClick: () => {
					const result = createCompany();
					if (!result.ok) setError(result.reason);
					else {
						setError("");
						setActiveId(result.id);
					}
				},
				children: "Mở hồ sơ trống"
			}),
			error && companies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-accent",
				children: error
			}) : null,
			companies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Chưa có doanh nghiệp. Không có mẫu nào được cài sẵn."
			}) : null,
			companies.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex gap-2 overflow-x-auto",
				children: companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `shrink-0 border px-3 py-2 text-sm ${(file?.id ?? "") === c.id ? "border-accent text-fg" : "border-line text-muted"}`,
					onClick: () => setActiveId(c.id),
					children: c.name.trim() || "Chưa đặt tên"
				}) }, c.id))
			}) : null,
			file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							tone: file.status === "filed" ? "solid" : "muted",
							children: file.status === "filed" ? "Đã đóng" : "Nháp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: file.standard || "Chưa chọn chuẩn" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên doanh nghiệp",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: file.name,
							onChange: (e) => patchCompany(file.id, { name: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sàn hoặc nơi báo cáo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: file.venue,
							onChange: (e) => patchCompany(file.id, { venue: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chuẩn báo cáo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							value: file.standard,
							onChange: (e) => patchCompany(file.id, { standard: e.target.value }),
							children: standards.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.label
							}, s.id || "none"))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Chuẩn này không so được với cái gì",
						hint: "Bắt buộc. Một câu ‘báo cáo tài chính’ là không đủ.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: file.standardNote,
							onChange: (e) => patchCompany(file.id, { standardNote: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bán gì, cho ai",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: file.business,
							onChange: (e) => patchCompany(file.id, { business: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nếu chưa đủ bằng chứng",
						hint: "Ghi đúng cụm CHƯA ĐỦ BẰNG CHỨNG khi chưa có số. Cụm này không thay một số bịa.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: areaClass,
							value: file.missingNote,
							onChange: (e) => patchCompany(file.id, { missingNote: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Sự kiện có nguồn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Chỉ tầng 1 hoặc 2, có ngày, và được phép dùng. Không xóa. Muốn sửa thì thêm một sự kiện mới."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 space-y-3",
							onSubmit: (e) => {
								e.preventDefault();
								const result = addFact(file.id, fact);
								setError(result.ok ? "" : result.reason);
								if (result.ok) setFact(emptyFact);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Sự kiện",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inputClass,
										value: fact.text,
										onChange: (e) => setFact({
											...fact,
											text: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Nguồn",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: inputClass,
												value: fact.source,
												onChange: (e) => setFact({
													...fact,
													source: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Đơn vị",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: inputClass,
												value: fact.unit,
												onChange: (e) => setFact({
													...fact,
													unit: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Ngày biết",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: inputClass,
												type: "date",
												value: fact.asOf,
												onChange: (e) => setFact({
													...fact,
													asOf: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Tầng",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: inputClass,
												value: fact.tier,
												onChange: (e) => setFact({
													...fact,
													tier: e.target.value
												}),
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-1",
										checked: fact.permitted,
										onChange: (e) => setFact({
											...fact,
											permitted: e.target.checked
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nguồn được phép dùng và không phải thông tin nội gián." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "border border-accent px-4 py-3 text-sm text-fg",
									children: "Thêm sự kiện"
								})
							]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-accent",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: file.facts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-t border-line pt-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										item.source,
										" · ",
										item.tier,
										" · ",
										item.asOf,
										" · ",
										item.unit || "không ghi đơn vị"
									]
								})]
							}, item.id))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Chất lượng lợi nhuận"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Để ngỏ nghĩa là chưa xét. Chưa thấy vấn đề vẫn là suy luận, không phải sự thật rằng sổ sách sạch."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-6",
							children: qualityItems.map((q) => {
								const row = file.quality[q.id];
								const hot = /gian lận|fraud|thao túng/i.test(row.note);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "border-t border-line pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm",
											children: q.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: q.ask
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: inputClass,
												value: row.state,
												onChange: (e) => setQuality(file.id, q.id, { state: e.target.value }),
												children: states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.id,
													children: s.label
												}, s.id))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: `${areaClass} mt-3`,
											value: row.note,
											placeholder: "Ghi cái đã thấy, không ghi kết luận vượt nguồn.",
											onChange: (e) => setQuality(file.id, q.id, { note: e.target.value })
										}),
										row.state === "clear" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: `${inputClass} mt-3`,
											value: row.source,
											placeholder: "Nguồn của nhận định chưa thấy vấn đề",
											onChange: (e) => setQuality(file.id, q.id, { source: e.target.value })
										}) : null,
										hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-accent",
											children: "Chữ này vẫn là giả thuyết. Hệ thống không kết luận gian lận."
										}) : null
									]
								}, q.id);
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-t border-line pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl",
								children: "Nộp hồ sơ"
							}),
							file.status === "filed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Bản đang mở đã đóng. Muốn cập nhật, hãy sửa một chỗ. Hồ sơ sẽ thành nháp, rồi bạn nộp một bản mới. Bản cũ không mất."
							}) : issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Đủ cửa để nộp. Nộp là đóng một bản. Không phải định giá và không phải quyết định vốn."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: issues.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "border-t border-line py-2",
									children: item
								}, item))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 bg-accent px-4 py-3 text-sm text-ink",
								onClick: () => {
									const result = fileCompany(file.id);
									setError(result.ok ? "" : result.reason);
								},
								children: file.status === "filed" ? "Bản này đã đóng" : "Nộp và đóng bản này"
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-accent",
								children: error
							}) : null,
							companySeals.filter((s) => s.companyId === file.id).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm",
									children: "Các bản đã đóng"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2",
									children: companySeals.filter((s) => s.companyId === file.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "border border-line px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											s.name || "Chưa đặt tên",
											" · ",
											new Date(s.filedAt).toLocaleString("vi-VN"),
											" · ",
											s.facts.length,
											" sự kiện"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-muted",
											children: s.business
										})]
									}, s.id))
								})]
							}) : null
						]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { CompaniesPage as component };
