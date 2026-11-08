import { i as __toESM } from "../_runtime.mjs";
import { a as defaultScenarios, d as newId, h as thesisBlockers, n as checksDefault, o as emptyTexts } from "./logic-BANorj8p.mjs";
import { J as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, q as require_react, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C0ltKAi5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function touch(t, patch) {
	return {
		...t,
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var useDesk = create()(persist((set, get) => ({
	theses: [],
	decisions: [],
	ledger: [],
	signoff: {},
	activeThesisId: null,
	ready: false,
	setReady: (v) => set({ ready: v }),
	createThesis: () => {
		const id = newId();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const thesis = {
			id,
			createdAt: now,
			updatedAt: now,
			status: "draft",
			security: "",
			venue: "",
			currency: "",
			horizon: "",
			texts: emptyTexts(),
			claims: [],
			scenarios: defaultScenarios(),
			kills: [
				{
					id: newId(),
					text: "",
					threshold: ""
				},
				{
					id: newId(),
					text: "",
					threshold: ""
				},
				{
					id: newId(),
					text: "",
					threshold: ""
				}
			],
			checks: checksDefault(),
			ownerCapitalNote: ""
		};
		set((s) => ({
			theses: [thesis, ...s.theses].slice(0, 40),
			activeThesisId: id
		}));
		return id;
	},
	updateThesis: (id, patch) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, patch) : t) })),
	patchText: (id, key, value) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { texts: {
		...t.texts,
		[key]: value
	} }) : t) })),
	setActive: (id) => set({ activeThesisId: id }),
	addClaim: (id) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { claims: [...t.claims, {
		id: newId(),
		text: "",
		klass: "unverified",
		source: "",
		tier: "none",
		asOf: "",
		unit: "",
		permitted: false
	}] }) : t) })),
	updateClaim: (id, claimId, patch) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { claims: t.claims.map((c) => c.id === claimId ? {
		...c,
		...patch
	} : c) }) : t) })),
	removeClaim: (id, claimId) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { claims: t.claims.filter((c) => c.id !== claimId) }) : t) })),
	addKill: (id) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { kills: [...t.kills, {
		id: newId(),
		text: "",
		threshold: ""
	}] }) : t) })),
	updateKill: (id, killId, patch) => set((s) => ({ theses: s.theses.map((t) => t.id === id ? touch(t, { kills: t.kills.map((k) => k.id === killId ? {
		...k,
		...patch
	} : k) }) : t) })),
	removeKill: (id, killId) => set((s) => ({ theses: s.theses.map((t) => t.id === id && t.kills.length > 3 ? touch(t, { kills: t.kills.filter((k) => k.id !== killId) }) : t) })),
	refreshStatus: (id) => {
		const t = get().theses.find((x) => x.id === id);
		if (!t || t.status === "invalidated") return;
		const next = thesisBlockers(t).length === 0 ? "ready" : "draft";
		if (next !== t.status) get().updateThesis(id, { status: next });
	},
	addLedger: (row) => set((s) => ({ ledger: [{
		...row,
		id: newId(),
		at: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.ledger].slice(0, 200) })),
	addDecision: (input) => {
		const thesis = input.thesisId ? get().theses.find((t) => t.id === input.thesisId) ?? null : null;
		if (input.action === "paper" || input.action === "hold" || input.action === "kill") {
			if (!thesis) return {
				ok: false,
				reason: "Hành động này cần một thesis."
			};
			if (thesis.status !== "ready" && !input.override) return {
				ok: false,
				reason: "Thesis chưa sẵn sàng. Muốn ghi nhật ký vẫn phải bật ghi đè và nêu lý do."
			};
			if (input.override && input.overrideReason.trim().length < 12) return {
				ok: false,
				reason: "Ghi đè cần lý do cụ thể. Không ghi đè im lặng."
			};
		}
		const decision = {
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			security: input.security.trim(),
			priceNote: input.priceNote,
			action: input.action,
			thesisId: thesis?.id ?? null,
			thesisSnapshot: thesis ? structuredClone(thesis) : null,
			expectedReturn: input.expectedReturn,
			probabilityNote: input.probabilityNote,
			risk: input.risk,
			sizeNote: input.sizeNote,
			catalyst: input.catalyst,
			invalidation: input.invalidation,
			alternativeView: input.alternativeView,
			outcome: "pending",
			postMortemClass: "",
			postMortemNote: "",
			override: input.override,
			overrideReason: input.overrideReason,
			voided: false,
			voidReason: "",
			amendments: []
		};
		set((s) => ({ decisions: [decision, ...s.decisions].slice(0, 200) }));
		return { ok: true };
	},
	patchOutcome: (id, patch) => set((s) => ({ decisions: s.decisions.map((d) => d.id === id ? {
		...d,
		...patch
	} : d) })),
	amend: (id, note) => {
		const trimmed = note.trim();
		if (trimmed.length < 8) return;
		const amendment = {
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			note: trimmed
		};
		set((s) => ({ decisions: s.decisions.map((d) => d.id === id ? {
			...d,
			amendments: [...d.amendments, amendment]
		} : d) }));
	},
	voidDecision: (id, reason) => {
		if (reason.trim().length < 12) return;
		set((s) => ({ decisions: s.decisions.map((d) => d.id === id ? {
			...d,
			voided: true,
			voidReason: reason.trim()
		} : d) }));
	},
	toggleSignoff: (key) => set((s) => ({ signoff: {
		...s.signoff,
		[key]: !s.signoff[key]
	} }))
}), {
	name: "chinam-foundation-v1",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : window.localStorage),
	skipHydration: true,
	partialize: (s) => ({
		theses: s.theses,
		decisions: s.decisions,
		ledger: s.ledger,
		signoff: s.signoff,
		activeThesisId: s.activeThesisId
	})
}));
var nav = [
	{
		href: "/",
		label: "Hiến chương"
	},
	{
		href: "/review",
		label: "Phản biện"
	},
	{
		href: "/modules",
		label: "Module"
	},
	{
		href: "/evidence",
		label: "Bằng chứng"
	},
	{
		href: "/probability",
		label: "Xác suất"
	},
	{
		href: "/protocol",
		label: "Quy trình"
	},
	{
		href: "/library",
		label: "Thư viện"
	},
	{
		href: "/cases",
		label: "Án lệ"
	},
	{
		href: "/signals",
		label: "Tín hiệu"
	},
	{
		href: "/journal",
		label: "Nhật ký"
	},
	{
		href: "/gates",
		label: "Nghiệm thu"
	}
];
function Shell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const setReady = useDesk((s) => s.setReady);
	(0, import_react.useEffect)(() => {
		const pending = useDesk.persist.rehydrate();
		if (pending instanceof Promise) {
			pending.then(() => setReady(true));
			return;
		}
		setReady(true);
	}, [setReady]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4 px-4 pt-4 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-serif text-2xl tracking-tight text-fg",
						children: "CHỈNAM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Hệ điều hành tình báo tài chính"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-48 text-right text-xs leading-relaxed text-muted sm:max-w-none",
						children: ["Foundation V1", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: " · chưa hiệu chỉnh · không phát lệnh vốn"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-3 flex gap-1 overflow-x-auto px-4 pb-3 lg:px-8",
					"aria-label": "Chính",
					children: nav.map((item) => {
						const on = item.href === "/" ? path === "/" : path === item.href || path.startsWith(`${item.href}/`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.href,
							className: `shrink-0 border-b-2 px-3 py-2 text-sm ${on ? "border-accent text-fg" : "border-transparent text-muted"}`,
							children: item.label
						}, item.href);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-line px-4 py-2 text-xs text-muted lg:px-8",
				children: "Không dự báo giá ngày mai. Không bịa số. Không có lệnh mua, bán, hay tỷ trọng."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 py-8 lg:px-8",
				children
			})
		]
	});
}
var styles_default = "/assets/styles-4vIpg1Y8.css";
var APP_NAME = "CHỈNAM";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#14120e"
			},
			{
				name: "description",
				content: "CHỈNAM — hệ điều hành tình báo tài chính và đầu tư. Foundation V1: hiến chương, phản biện kiến trúc, dụng cụ bằng chứng và xác suất. Không phát lệnh vốn."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,560;0,6..72,650;1,6..72,400&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "vi",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-D3sQdyyP.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "CHỈNAM — Hiến chương" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./cases-CphLK3kc.mjs");
var Route$9 = createFileRoute("/cases")({
	head: () => ({ meta: [{ title: "CHỈNAM — Án lệ" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./evidence-1H1dM302.mjs");
var Route$8 = createFileRoute("/evidence")({
	head: () => ({ meta: [{ title: "CHỈNAM — Luật bằng chứng" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./gates-BzIkbm13.mjs");
var Route$7 = createFileRoute("/gates")({
	head: () => ({ meta: [{ title: "CHỈNAM — Nghiệm thu" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./journal-YkiJhuXz.mjs");
var Route$6 = createFileRoute("/journal")({
	head: () => ({ meta: [{ title: "CHỈNAM — Nhật ký quyết định" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./library-DVSi7IOi.mjs");
var Route$5 = createFileRoute("/library")({
	head: () => ({ meta: [{ title: "CHỈNAM — Thư viện" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./modules-BW17T1qr.mjs");
var Route$4 = createFileRoute("/modules")({
	head: () => ({ meta: [{ title: "CHỈNAM — Bản đồ module" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./probability-CeOl85sc.mjs");
var Route$3 = createFileRoute("/probability")({
	head: () => ({ meta: [{ title: "CHỈNAM — Xác suất" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./protocol-CQCMV18n.mjs");
var Route$2 = createFileRoute("/protocol")({
	head: () => ({ meta: [{ title: "CHỈNAM — Quy trình một mã" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./review-PQJZ3CVl.mjs");
var Route$1 = createFileRoute("/review")({
	head: () => ({ meta: [{ title: "CHỈNAM — Phản biện kiến trúc" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./signals-DEOZl9mU.mjs");
var Route = createFileRoute("/signals")({
	head: () => ({ meta: [{ title: "CHỈNAM — Tín hiệu" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	CasesRoute: Route$9.update({
		id: "/cases",
		path: "/cases",
		getParentRoute: () => Route$11
	}),
	EvidenceRoute: Route$8.update({
		id: "/evidence",
		path: "/evidence",
		getParentRoute: () => Route$11
	}),
	GatesRoute: Route$7.update({
		id: "/gates",
		path: "/gates",
		getParentRoute: () => Route$11
	}),
	JournalRoute: Route$6.update({
		id: "/journal",
		path: "/journal",
		getParentRoute: () => Route$11
	}),
	LibraryRoute: Route$5.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$11
	}),
	ModulesRoute: Route$4.update({
		id: "/modules",
		path: "/modules",
		getParentRoute: () => Route$11
	}),
	ProbabilityRoute: Route$3.update({
		id: "/probability",
		path: "/probability",
		getParentRoute: () => Route$11
	}),
	ProtocolRoute: Route$2.update({
		id: "/protocol",
		path: "/protocol",
		getParentRoute: () => Route$11
	}),
	ReviewRoute: Route$1.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$11
	}),
	SignalsRoute: Route.update({
		id: "/signals",
		path: "/signals",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useDesk as n, router_exports as t };
