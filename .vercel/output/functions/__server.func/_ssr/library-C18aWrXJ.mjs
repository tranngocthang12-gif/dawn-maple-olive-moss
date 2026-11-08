import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Stamp, i as PageHeader } from "./ui-DibgHC3d.mjs";
import { n as groups, t as books } from "./books-Cdv06LzQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-C18aWrXJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var classes = [
	"FOUNDATION",
	"ADVANCED",
	"COUNTERPOINT",
	"HISTORICAL"
];
function LibraryPage() {
	const [group, setGroup] = (0, import_react.useState)("all");
	const [klass, setKlass] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const shown = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return books.filter((b) => {
			if (group !== "all" && b.group !== group) return false;
			if (klass !== "all" && b.klass !== klass) return false;
			if (!query) return true;
			return `${b.title} ${b.authors}`.toLowerCase().includes(query);
		});
	}, [
		group,
		klass,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-3xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: `Kệ ${books.length} đầu · Phase 1 mới là thư mục`,
				title: "Sách không phải sự thật.",
				lede: "Mỗi đầu có lớp và một giới hạn sử dụng. Không có tóm tắt được gán cho tác giả. Không trường phái nào thành chân lý. Có kệ không có nghĩa là đã hiểu, và đã hiểu không có nghĩa là có lợi thế."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full max-w-md border border-line bg-bg px-3 py-2.5 text-sm",
					placeholder: "Tìm nhan đề hoặc tác giả",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: group === "all",
						click: () => setGroup("all"),
						label: "Mọi nhóm"
					}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: group === g.id,
						click: () => setGroup(g.id),
						label: g.name
					}, g.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: klass === "all",
						click: () => setKlass("all"),
						label: "Mọi lớp"
					}), classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: klass === c,
						click: () => setKlass(c),
						label: c
					}, c))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-sm tabular-nums text-muted",
			children: [shown.length, " đầu trong bộ lọc"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: shown.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							tone: b.klass === "COUNTERPOINT" ? "accent" : b.klass === "FOUNDATION" ? "solid" : "muted",
							children: b.klass
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: groups.find((g) => g.id === b.group)?.name })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-serif text-xl",
						children: b.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							b.authors,
							" · ",
							b.year
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: b.limit
					})
				]
			}, b.id))
		})
	] });
}
function Chip({ on, click, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: click,
		className: `shrink-0 border px-3 py-2 text-xs ${on ? "border-accent text-fg" : "border-line text-muted"}`,
		children: label
	});
}
//#endregion
export { LibraryPage as component };
