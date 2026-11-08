import { i as __toESM } from "../_runtime.mjs";
import { b as monteCarlo, n as bayesPosterior, v as kellyReference } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/probability-DuOFv36j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProbabilityBench() {
	const ledger = useDesk((s) => s.ledger);
	const addLedger = useDesk((s) => s.addLedger);
	const [statement, setStatement] = (0, import_react.useState)("");
	const [prior, setPrior] = (0, import_react.useState)("");
	const [lr, setLr] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [klass, setKlass] = (0, import_react.useState)("hypothesis");
	const [corrects, setCorrects] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [win, setWin] = (0, import_react.useState)("55");
	const [b, setB] = (0, import_react.useState)("1");
	const [base, setBase] = (0, import_react.useState)("50");
	const [uncertainty, setUncertainty] = (0, import_react.useState)(.5);
	const [eps, setEps] = (0, import_react.useState)("1");
	const [years, setYears] = (0, import_react.useState)("5");
	const [gMean, setGMean] = (0, import_react.useState)("0.08");
	const [gSd, setGSd] = (0, import_react.useState)("0.04");
	const [mMean, setMMean] = (0, import_react.useState)("0.12");
	const [mSd, setMSd] = (0, import_react.useState)("0.02");
	const [mBase, setMBase] = (0, import_react.useState)("0.12");
	const [peMean, setPeMean] = (0, import_react.useState)("12");
	const [peSd, setPeSd] = (0, import_react.useState)("3");
	const [price, setPrice] = (0, import_react.useState)("15");
	const [seed, setSeed] = (0, import_react.useState)("7");
	const [mc, setMc] = (0, import_react.useState)(null);
	const priorN = Number(prior);
	const lrN = lr.trim() === "" ? null : Number(lr);
	const preview = lrN !== null && Number.isFinite(lrN) ? bayesPosterior(priorN, lrN) : null;
	const kelly = kellyReference(Number(win), Number(b), uncertainty, Number(base));
	function saveLedger() {
		if (statement.trim().length < 8) {
			setMessage("Mệnh đề quá ngắn.");
			return;
		}
		if (!Number.isFinite(priorN) || priorN <= 0 || priorN >= 100) {
			setMessage("Tiên nghiệm phải nằm trong khoảng mở (0, 100). 0 và 100 không cập nhật được.");
			return;
		}
		if (lr.trim() !== "" && (!Number.isFinite(lrN) || (lrN ?? 0) <= 0)) {
			setMessage("Tỷ số hợp lý nếu có thì phải dương. Bỏ trống nếu chưa biết.");
			return;
		}
		const posterior = lrN === null ? null : bayesPosterior(priorN, lrN);
		if (lr.trim() !== "" && posterior === null) {
			setMessage("Không tính được hậu nghiệm từ cặp số này.");
			return;
		}
		const saved = addLedger({
			statement: statement.trim(),
			priorPct: priorN,
			lr: lr.trim() === "" ? null : lrN,
			posteriorPct: posterior,
			evidenceNote: note.trim(),
			klass,
			corrects: corrects.trim()
		});
		if (!saved.ok) {
			setMessage(saved.reason);
			return;
		}
		setStatement("");
		setNote("");
		setCorrects("");
		setMessage(posterior === null ? "Đã ghi. Không có hậu nghiệm vì tỷ số hợp lý chưa biết." : "Đã ghi một dòng không sửa được.");
	}
	const maxBin = mc ? Math.max(...mc.bins.map((bin) => bin.count), 1) : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-3xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Sổ cái"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Hậu nghiệm chỉ xuất hiện khi có tỷ số hợp lý. Nếu chưa biết, dòng vẫn ghi được và hậu nghiệm để trống. Dòng không sửa, không xóa. Đính chính bằng một dòng mới trỏ tới dòng cũ. Mọi số ở đây chưa hiệu chỉnh." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mệnh đề",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: statement,
							onChange: (e) => setStatement(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tiên nghiệm %",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${inputClass} tabular-nums`,
								inputMode: "decimal",
								value: prior,
								onChange: (e) => setPrior(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tỷ số hợp lý",
							hint: "Bỏ trống nếu chưa biết. Đừng bịa cho có số.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: `${inputClass} tabular-nums`,
								inputMode: "decimal",
								value: lr,
								onChange: (e) => setLr(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tabular-nums text-muted",
						children: lr.trim() === "" ? "Hậu nghiệm: không cập nhật." : preview === null ? "Hậu nghiệm: không tính được." : `Hậu nghiệm có điều kiện: ${preview}%.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bằng chứng, loại và nguồn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: `${inputClass} min-h-24`,
							value: note,
							onChange: (e) => setNote(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Loại bằng chứng",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: inputClass,
								value: klass,
								onChange: (e) => setKlass(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fact",
										children: "Sự thật"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "data",
										children: "Dữ liệu"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inference",
										children: "Suy luận"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hypothesis",
										children: "Giả thuyết"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "forecast",
										children: "Dự báo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "unverified",
										children: "Chưa xác minh"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "insufficient",
										children: "Chưa đủ bằng chứng"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Đính chính dòng",
							hint: "Dán mã dòng cũ nếu đây là sửa sai. Không xóa dòng cũ.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: corrects,
								onChange: (e) => setCorrects(e.target.value)
							})
						})]
					}),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						onClick: saveLedger,
						children: "Ghi vào sổ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-3",
						children: [ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "Sổ trống. Chưa có dự báo nào để hiệu chỉnh."
						}) : null, ledger.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border border-line p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: row.klass }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: "accent",
										children: "Chưa hiệu chỉnh"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: row.statement
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm tabular-nums text-muted",
									children: [
										"Tiên nghiệm ",
										row.priorPct,
										"% · LR ",
										row.lr === null ? "chưa biết" : row.lr,
										" · Hậu nghiệm ",
										row.posteriorPct === null ? "không cập nhật" : `${row.posteriorPct}%`
									]
								}),
								row.evidenceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: row.evidenceNote
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										row.id,
										" · ",
										new Date(row.at).toLocaleString("vi-VN"),
										row.corrects ? ` · đính chính ${row.corrects}` : ""
									]
								})
							]
						}, row.id))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-3xl space-y-4 border-t border-line pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Kelly chỉ để nhìn, không để đặt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Full Kelly bị cấm dùng như lệnh. Số được đưa lên trước là một phần tư Kelly sau khi kéo xác suất về base rate theo mức bất định. Nó vẫn không phải tỷ trọng. Module kích thước chưa xây." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "p thắng %",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${inputClass} tabular-nums`,
									value: win,
									onChange: (e) => setWin(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "b, lời ròng trên 1 đơn vị rủi ro",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${inputClass} tabular-nums`,
									value: b,
									onChange: (e) => setB(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Base rate %",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: `${inputClass} tabular-nums`,
									value: base,
									onChange: (e) => setBase(e.target.value)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Mức bất định về chính p: ${uncertainty.toFixed(2)}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full accent-accent",
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: uncertainty,
							onChange: (e) => setUncertainty(Number(e.target.value))
						})
					}),
					kelly.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-line p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted line-through",
								children: [
									"Full Kelly ",
									kelly.full,
									"% — không dùng"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									"Half ",
									kelly.half,
									"% · Quarter trước haircut ",
									kelly.quarter,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-serif text-2xl tabular-nums",
								children: kelly.negative ? "Trần tham chiếu không dương. Không đặt." : `Trần tham chiếu ${kelly.adjustedQuarter}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-accent",
								children: "Không phải lệnh. Không phải tỷ trọng. Owner tự quyết, hệ thống không triển khai."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: kelly.reason
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-3xl space-y-4 border-t border-line pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Minh họa Monte Carlo có điều kiện"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Đây không phải module M12. Công thức đồ chơi: lợi nhuận tương lai bằng lợi nhuận hôm nay nhân tăng trưởng, nhân tỷ lệ biên, rồi nhân hệ số cuối. Ba cú kéo là độc lập nên đuôi bị làm mỏng. Kết quả có điều kiện trên các ô bên dưới, không phải xác suất thị trường, không phải giá mục tiêu." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Lợi nhuận gốc",
								value: eps,
								set: setEps
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Số năm",
								value: years,
								set: setYears
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Giá để so sánh",
								value: price,
								set: setPrice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Tăng trưởng trung bình",
								value: gMean,
								set: setGMean
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Độ lệch tăng trưởng",
								value: gSd,
								set: setGSd
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Biên trung bình",
								value: mMean,
								set: setMMean
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Độ lệch biên",
								value: mSd,
								set: setMSd
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Biên gốc",
								value: mBase,
								set: setMBase
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Hệ số trung bình",
								value: peMean,
								set: setPeMean
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Độ lệch hệ số",
								value: peSd,
								set: setPeSd
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Hạt giống",
								value: seed,
								set: setSeed
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "bg-accent px-4 py-3 text-sm text-ink",
						onClick: () => {
							const nums = [
								eps,
								years,
								gMean,
								gSd,
								mMean,
								mSd,
								mBase,
								peMean,
								peSd,
								price,
								seed
							].map(Number);
							if (nums.some((n) => !Number.isFinite(n))) return;
							setMc(monteCarlo({
								eps: nums[0] ?? 0,
								years: nums[1] ?? 1,
								gMean: nums[2] ?? 0,
								gSd: nums[3] ?? 0,
								marginMean: nums[4] ?? 0,
								marginSd: nums[5] ?? 0,
								marginBase: nums[6] ?? 1,
								peMean: nums[7] ?? 1,
								peSd: nums[8] ?? 0,
								price: nums[9] ?? 0,
								seed: nums[10] || 1,
								n: 3e3
							}));
						},
						children: "Chạy 3.000 đường, có hạt giống"
					}),
					mc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-line p-4",
						children: [
							mc.degenerate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm text-accent",
								children: "Độ lệch bằng không. Đây là một điểm, không phải một phân phối."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-3 text-sm tabular-nums sm:grid-cols-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										k: "P5",
										v: mc.p5
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										k: "P25",
										v: mc.p25
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										k: "Trung vị",
										v: mc.p50
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										k: "P75",
										v: mc.p75
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										k: "P95",
										v: mc.p95
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-sm",
								children: [
									"Phần đường có giá trị trên mức so sánh: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [mc.shareAbove, "%"]
									}),
									". Có điều kiện trên đầu vào và trên giả định độc lập."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex h-24 items-end gap-1",
								"aria-hidden": "true",
								children: mc.bins.map((bin, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 bg-accent",
									style: { height: `${Math.max(4, bin.count / maxBin * 100)}%` }
								}, `${bin.x}-${i}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "Histogram của các đường mô phỏng. Không phải lịch sử giá."
							})
						]
					}) : null
				]
			})
		]
	});
}
function Num({ label, value, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${inputClass} tabular-nums`,
			value,
			onChange: (e) => set(e.target.value)
		})
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-serif text-xl",
		children: v
	})] });
}
function ProbabilityPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-3xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Khung xác suất · chưa hiệu chỉnh",
			title: "Không nói tin này tốt. Nói bằng chứng đổi tiên nghiệm như thế nào, hoặc nói là chưa biết.",
			lede: "Sổ cái là dụng cụ Phase 0 của động cơ xác suất. Nó không phải động cơ đã xây xong. Máy Monte Carlo phía dưới là một minh họa có điều kiện, cố ý khai báo giả định độc lập để khỏi bị đọc thành định giá."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProbabilityBench, {})] });
}
//#endregion
export { ProbabilityPage as component };
