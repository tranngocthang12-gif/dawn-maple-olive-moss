import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useDesk } from "./router-C_Y-H-Ub.mjs";
import { a as Stamp, r as Note } from "./ui-DibgHC3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DUOEEJ5a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Desk() {
	const mandate = useDesk((s) => s.mandate);
	const world = useDesk((s) => s.world);
	const baseRates = useDesk((s) => s.baseRates);
	const companies = useDesk((s) => s.companies);
	const signals = useDesk((s) => s.signals);
	const theses = useDesk((s) => s.theses);
	const ledger = useDesk((s) => s.ledger);
	const decisions = useDesk((s) => s.decisions);
	const readyCount = theses.filter((t) => t.status === "ready").length;
	const pending = decisions.filter((d) => !d.voided && d.outcome === "pending").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-accent uppercase",
				children: "Hệ vận hành · chưa hiệu chỉnh · không phát lệnh"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-serif text-4xl leading-tight text-fg",
				children: "Bàn làm việc"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: "Lớp này ghi những thứ quyết định phải đứng trên: ủy thác, thế giới có nguồn, base rate, hồ sơ doanh nghiệp đã nộp, và tín hiệu viết trước khi đo. Không có số nào được điền sẵn. Định giá và dữ liệu thị trường vẫn chưa xây."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						tone: mandate.locked ? "solid" : "accent",
						children: mandate.locked ? "Ủy thác đã khóa" : "Ủy thác chưa khóa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Chưa hiệu chỉnh" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, { children: [readyCount, " hồ sơ sẵn sàng"] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Quan sát thế giới",
						v: world.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Base rate",
						v: baseRates.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Hồ sơ doanh nghiệp",
						v: companies.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Đã nộp",
						v: companies.filter((c) => c.status === "filed").length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Tín hiệu sống",
						v: signals.filter((s) => s.status === "alive").length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Tín hiệu đã chết",
						v: signals.filter((s) => s.status === "dead").length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Dòng xác suất",
						v: ledger.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Quyết định chờ kết cục",
						v: pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Đã phân giải",
						v: decisions.filter((d) => d.outcome.startsWith("process-")).length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-8 space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mandate",
							className: "text-fg",
							children: "1. Khóa ủy thác"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Tiền tệ, chân trời, vành trong, vành ngoài, đòn bẩy. Mở khóa sau này phải có lý do."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/world",
							className: "text-fg",
							children: "2. Ghi trạng thái thế giới"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Mức, tốc độ đổi, gia tốc. Thiếu nguồn tầng 1 hoặc 2 thì không vào sổ."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/baserates",
							className: "text-fg",
							children: "3. Ghi base rate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Một tỷ lệ không có mẫu, nơi, thời và giới hạn thì không được dùng."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/companies",
							className: "text-fg",
							children: "4. Nộp hồ sơ doanh nghiệp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Chuẩn kế toán, sự kiện có nguồn, chín chiều chất lượng. Không có số điền sẵn."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signals",
							className: "text-fg",
							children: "5. Viết tín hiệu rồi cho nó chết nếu cần"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Cơ chế, độ trễ, cách chết, quyền dữ liệu. Chưa có backtest và chưa có điểm số."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/protocol",
							className: "text-fg",
							children: "6. Mở hồ sơ luận điểm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Phải gắn một hồ sơ doanh nghiệp đã đóng. Ủy thác chưa khóa thì luận điểm ở lại bản nháp. Mã đã có quyết định cũ thì phải đọc lại trước."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/journal",
							className: "text-fg",
							children: "7. Ghi kết quả khi đã biết"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Thắng hay thua chưa ghi thì lần sau không có gì để học. Kết quả tốt không chứng minh cách làm đúng."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-line pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Hồ sơ đang mở"
					}),
					theses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Chưa có hồ sơ."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: theses.slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 border border-line px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.security.trim() || "Chưa đặt tên" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stamp, {
								tone: t.status === "ready" ? "solid" : "muted",
								children: [t.status === "ready" ? "Sẵn sàng" : t.status === "invalidated" ? "Đã hủy" : "Nháp", t.ring === "inner" ? " · trong" : t.ring === "outer" ? " · ngoài" : ""]
							})]
						}, t.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCopy, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Note, { children: [
					"Hiến chương và phản biện vẫn giữ nguyên. Bàn này không phân tích một mã và không đề xuất tỷ trọng.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/charter",
						className: "text-accent",
						children: "Đọc hiến chương"
					})
				] })]
			})
		]
	});
}
function BookCopy() {
	const exportDesk = useDesk((s) => s.exportDesk);
	const importDesk = useDesk((s) => s.importDesk);
	const [msg, setMsg] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 border border-line px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Giữ sổ trên máy bạn"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "Sổ đang nằm trong trình duyệt này. Xóa dữ liệu duyệt web là mất. Tải về một tệp khi bạn muốn giữ. Đưa tệp vào sẽ thay sổ đang mở, không gộp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "bg-accent px-4 py-3 text-sm text-ink",
					onClick: () => {
						const blob = new Blob([exportDesk()], { type: "application/json" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = "chinam-so.json";
						a.click();
						URL.revokeObjectURL(url);
						setMsg("Đã tải sổ về máy. Giữ tệp đó.");
					},
					children: "Tải sổ về máy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "cursor-pointer border border-line px-4 py-3 text-sm text-fg",
					children: ["Đưa sổ từ máy vào", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "application/json,.json",
						className: "sr-only",
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							const reader = new FileReader();
							reader.onload = () => {
								const text = typeof reader.result === "string" ? reader.result : "";
								if (!window.confirm("Đưa sổ này vào sẽ thay toàn bộ sổ đang mở. Nên tải bản hiện tại về máy trước.")) return;
								const result = importDesk(text);
								setMsg(result.ok ? "Đã đưa sổ vào. Bản này thay bản đang mở." : result.reason);
							};
							reader.readAsText(file);
						}
					})]
				})]
			}),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: msg
			}) : null
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-serif text-2xl tabular-nums",
			children: v
		})]
	});
}
//#endregion
export { Desk as component };
