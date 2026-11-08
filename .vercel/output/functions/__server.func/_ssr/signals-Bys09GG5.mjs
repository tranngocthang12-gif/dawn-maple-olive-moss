import { i as __toESM } from "../_runtime.mjs";
import { C as overfitChecks, F as signalScore, N as sensors, P as signalAliveIssues, _ as funnel, j as scorePenalties } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, i as PageHeader, n as Field, o as areaClass, r as Note, s as inputClass } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signals-Bys09GG5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignalsPage() {
	const signals = useDesk((s) => s.signals);
	const createSignal = useDesk((s) => s.createSignal);
	const patchSignal = useDesk((s) => s.patchSignal);
	const markAlive = useDesk((s) => s.markSignalAlive);
	const kill = useDesk((s) => s.killSignal);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const row = signals.find((s) => s.id === activeId) ?? signals[0] ?? null;
	const alive = signals.filter((s) => s.status === "alive").length;
	const dead = signals.filter((s) => s.status === "dead").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Sổ tín hiệu · chưa có backtest",
				title: "Viết cách nó chết trước khi cho nó sống.",
				lede: "Một tín hiệu vào sổ như giả thuyết. Nó chỉ được đánh dấu đang sống khi có cơ chế, độ trễ, cách chết, và quyền dữ liệu. Không có điểm số. Không có lệnh."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, { children: [signals.length, " dòng"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, {
						tone: alive ? "solid" : "muted",
						children: [alive, " đang sống"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, {
						tone: "accent",
						children: [dead, " đã chết"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Hồi sinh bị cấm. Muốn xét lại thì mở một dòng mới và viết lại cơ chế. Giữ vì đã tốn công không phải lý do khai tử." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 bg-accent px-4 py-3 text-sm text-ink",
				onClick: () => {
					const result = createSignal();
					if (!result.ok) setError(result.reason);
					else {
						setError("");
						setActiveId(result.id);
					}
				},
				children: "Mở một tín hiệu trống"
			}),
			signals.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex gap-2 overflow-x-auto",
				children: signals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `shrink-0 border px-3 py-2 text-sm ${(row?.id ?? "") === s.id ? "border-accent text-fg" : "border-line text-muted"}`,
					onClick: () => setActiveId(s.id),
					children: labelOf(s)
				}) }, s.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Sổ đang trống. Không có tín hiệu mẫu."
			}),
			row ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalEditor, {
				row,
				reason,
				error,
				onReason: setReason,
				onError: setError,
				patch: patchSignal,
				markAlive,
				kill
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doctrine, {})
		]
	});
}
function labelOf(s) {
	return `${sensors.find((x) => x.id === s.family)?.name ?? "Chưa chọn họ"} · ${s.status === "alive" ? "sống" : s.status === "dead" ? "chết" : "nháp"}`;
}
function SignalEditor({ row, reason, error, onReason, onError, patch, markAlive, kill }) {
	const locked = row.status !== "draft";
	const issues = signalAliveIssues(row);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					tone: row.status === "alive" ? "solid" : row.status === "dead" ? "accent" : "muted",
					children: row.status === "alive" ? "Đang sống" : row.status === "dead" ? "Đã chết" : "Nháp"
				}), locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Đã khóa nội dung" }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Họ cảm biến",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: inputClass,
					disabled: locked,
					value: row.family,
					onChange: (e) => patch(row.id, { family: e.target.value }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Chưa chọn"
					}), sensors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Giả thuyết",
				hint: "Điều gì sẽ sai nếu tín hiệu này sai.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					disabled: locked,
					value: row.hypothesis,
					onChange: (e) => patch(row.id, { hypothesis: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Cơ chế nhân quả",
				hint: "Tương quan không đủ.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					disabled: locked,
					value: row.mechanism,
					onChange: (e) => patch(row.id, { mechanism: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Độ trễ và cửa sổ còn giao dịch được không",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					disabled: locked,
					value: row.lag,
					onChange: (e) => patch(row.id, { lag: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Cách chết",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					disabled: locked,
					value: row.death,
					onChange: (e) => patch(row.id, { death: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Quyền dữ liệu",
				hint: "Cảm biến vật lý phải ghi vì sao việc thu thập là hợp pháp.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					disabled: locked,
					value: row.rights,
					onChange: (e) => patch(row.id, { rights: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1",
					disabled: locked,
					checked: row.rightsOk,
					onChange: (e) => patch(row.id, { rightsOk: e.target.checked })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dữ liệu được phép dùng và không phải thông tin nội gián." })]
			}),
			row.status === "draft" && issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: issues.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-t border-line py-2",
					children: item
				}, item))
			}) : null,
			row.status === "draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "bg-accent px-4 py-3 text-sm text-ink",
				onClick: () => {
					const result = markAlive(row.id);
					onError(result.ok ? "" : result.reason ?? "Không cho sống.");
				},
				children: "Cho sống — chưa phải alpha"
			}) : null,
			row.status !== "dead" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-line pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lý do khai tử",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: areaClass,
						value: reason,
						onChange: (e) => onReason(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 border border-accent px-4 py-3 text-sm",
					onClick: () => {
						const result = kill(row.id, reason);
						onError(result.ok ? "" : result.reason ?? "Không khai tử được.");
						if (result.ok) onReason("");
					},
					children: "Khai tử"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Đã chết ",
					row.diedAt.slice(0, 10),
					". Lý do: ",
					row.deathReason
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-accent",
				children: error
			}) : null
		]
	});
}
function Doctrine() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Luật còn giữ, engine chưa xây"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Không có backtest trong sổ này. Phễu dưới đây là minh họa, không phải hạn ngạch. Điểm C × L × I × R × U chưa có thang số."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 space-y-3",
				children: funnel.map((stage, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: ["Cửa ", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl",
							children: stage.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: stage.gate
						})
					]
				}, stage.gate))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Điểm chất lượng — chưa chấm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: signalScore.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border-t border-line pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm",
								children: [
									s.k,
									" · ",
									s.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: s.q
							})]
						}, s.k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: scorePenalties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, {
							tone: "accent",
							children: ["Trừ ", p]
						}, p))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Họ cảm biến"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: sensors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: s.watch
						})]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Chống overfitting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: overfitChecks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-t border-line py-2",
						children: item
					}, item))
				})]
			})
		]
	});
}
//#endregion
export { SignalsPage as component };
