import { i as __toESM } from "../_runtime.mjs";
import { I as thesisBlockers, M as sealFromCompany, O as recordUsable, P as signalAliveIssues, a as checksDefault, d as emptyQuality, f as emptyTexts, g as fullBook, i as caps, s as companyFileIssues, u as defaultScenarios, x as newId } from "./logic-DyFXhBq6.mjs";
import { J as require_react, S as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C_Y-H-Ub.js
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
function emptyMandate() {
	return {
		locked: false,
		lockedAt: "",
		currency: "",
		horizon: "",
		universeInner: "",
		universeOuter: "",
		leverage: "none",
		leverageNote: "",
		taxNote: "",
		liquidityNote: "",
		amendments: []
	};
}
function normalizePersisted(p) {
	const theses = (p.theses ?? []).map((t) => ({
		...t,
		ring: t.ring ?? "",
		baseRateId: t.baseRateId ?? "",
		worldIds: t.worldIds ?? [],
		companyId: t.companyId ?? "",
		priorSeenIds: t.priorSeenIds ?? []
	}));
	let seals = (p.companySeals ?? []).map((s) => ({
		...s,
		sealed: s.sealed !== false,
		facts: s.facts ?? [],
		quality: {
			...emptyQuality(),
			...s.quality ?? {}
		}
	}));
	const companies = (p.companies ?? []).map((c) => {
		const file = {
			...c,
			facts: c.facts ?? [],
			missingNote: c.missingNote ?? "",
			status: c.status ?? "draft",
			sealId: c.sealId ?? "",
			quality: {
				...emptyQuality(),
				...c.quality ?? {}
			}
		};
		if (file.status === "filed" && !seals.some((s) => s.id === file.sealId && s.companyId === file.id)) {
			const seal = sealFromCompany(file, file.updatedAt || (/* @__PURE__ */ new Date()).toISOString(), newId(), true);
			seals = [seal, ...seals];
			file.sealId = seal.id;
		}
		return file;
	});
	return {
		theses,
		decisions: (p.decisions ?? []).map((d) => ({
			...d,
			companySeal: d.companySeal ?? null,
			worldSnapshot: d.worldSnapshot ?? [],
			baseRateSnapshot: d.baseRateSnapshot ?? null,
			amendments: d.amendments ?? []
		})),
		ledger: p.ledger ?? [],
		signoff: p.signoff ?? {},
		activeThesisId: p.activeThesisId ?? null,
		mandate: {
			...emptyMandate(),
			...p.mandate ?? {}
		},
		world: p.world ?? [],
		baseRates: p.baseRates ?? [],
		companies,
		companySeals: seals,
		signals: p.signals ?? []
	};
}
function tooBig(p) {
	if (p.theses.length > caps.theses) return "Tệp có quá nhiều hồ sơ luận điểm.";
	if (p.decisions.length > caps.decisions) return "Tệp có quá nhiều quyết định.";
	if (p.ledger.length > caps.ledger) return "Tệp có quá nhiều dòng xác suất.";
	if (p.world.length > caps.world) return "Tệp có quá nhiều quan sát thế giới.";
	if (p.baseRates.length > caps.baseRates) return "Tệp có quá nhiều tỷ lệ quá khứ.";
	if (p.companies.length > caps.companies) return "Tệp có quá nhiều hồ sơ doanh nghiệp.";
	if (p.companySeals.length > caps.seals) return "Tệp có quá nhiều bản hồ sơ đã đóng.";
	if (p.signals.length > caps.signals) return "Tệp có quá nhiều tín hiệu.";
	if (p.companies.some((c) => c.facts.length > caps.facts)) return "Một hồ sơ doanh nghiệp trong tệp có quá nhiều sự kiện.";
	return null;
}
var useDesk = create()(persist((set, get) => ({
	theses: [],
	decisions: [],
	ledger: [],
	signoff: {},
	activeThesisId: null,
	mandate: emptyMandate(),
	world: [],
	baseRates: [],
	companies: [],
	companySeals: [],
	signals: [],
	ready: false,
	setReady: (v) => set({ ready: v }),
	createThesis: () => {
		if (get().theses.length >= caps.theses) return {
			ok: false,
			reason: fullBook
		};
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
			ownerCapitalNote: "",
			ring: "",
			baseRateId: "",
			worldIds: [],
			companyId: "",
			priorSeenIds: []
		};
		set((s) => ({
			theses: [thesis, ...s.theses],
			activeThesisId: id
		}));
		return {
			ok: true,
			id
		};
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
		const next = thesisBlockers(t, {
			mandate: get().mandate,
			world: get().world,
			baseRates: get().baseRates,
			companies: get().companies,
			decisions: get().decisions
		}).length === 0 ? "ready" : "draft";
		if (next !== t.status) get().updateThesis(id, { status: next });
	},
	addLedger: (row) => {
		if (get().ledger.length >= caps.ledger) return {
			ok: false,
			reason: fullBook
		};
		set((s) => ({ ledger: [{
			...row,
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString()
		}, ...s.ledger] }));
		return { ok: true };
	},
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
		if (get().decisions.length >= caps.decisions) return {
			ok: false,
			reason: fullBook
		};
		const company = thesis?.companyId ? get().companies.find((c) => c.id === thesis.companyId) ?? null : null;
		const companySeal = company ? company.status === "filed" ? structuredClone(get().companySeals.find((s) => s.id === company.sealId && s.companyId === company.id) ?? sealFromCompany(company, company.updatedAt, newId(), true)) : sealFromCompany(company, (/* @__PURE__ */ new Date()).toISOString(), newId(), false) : null;
		const worldSnapshot = thesis ? get().world.filter((w) => (thesis.worldIds ?? []).includes(w.id)).map((w) => structuredClone(w)) : [];
		const baseRateSnapshot = thesis?.baseRateId ? structuredClone(get().baseRates.find((r) => r.id === thesis.baseRateId) ?? null) : null;
		const decision = {
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			security: input.security.trim(),
			priceNote: input.priceNote,
			action: input.action,
			thesisId: thesis?.id ?? null,
			thesisSnapshot: thesis ? structuredClone(thesis) : null,
			companySeal,
			worldSnapshot,
			baseRateSnapshot,
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
		set((s) => ({ decisions: [decision, ...s.decisions] }));
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
	} })),
	patchMandate: (patch) => set((s) => {
		if (s.mandate.locked) return s;
		return { mandate: {
			...s.mandate,
			...patch,
			locked: false,
			amendments: s.mandate.amendments
		} };
	}),
	lockMandate: () => {
		const m = get().mandate;
		if (m.locked) return {
			ok: false,
			reason: "Ủy thác đã khóa."
		};
		if (m.currency.trim().length < 2 || m.horizon.trim().length < 2) return {
			ok: false,
			reason: "Cần tiền tệ tiêu dùng và chân trời."
		};
		if (m.universeInner.trim().length < 12) return {
			ok: false,
			reason: "Vành trong cần một mô tả cụ thể, không phải một chữ."
		};
		if (m.leverage === "capped" && m.leverageNote.trim().length < 8) return {
			ok: false,
			reason: "Đòn bẩy có trần thì phải ghi trần đó."
		};
		set((s) => ({ mandate: {
			...s.mandate,
			locked: true,
			lockedAt: (/* @__PURE__ */ new Date()).toISOString()
		} }));
		return { ok: true };
	},
	unlockMandate: (reason) => {
		if (reason.trim().length < 12) return {
			ok: false,
			reason: "Mở khóa cần lý do. Đây là ghi đè."
		};
		const note = {
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			note: `Mở khóa: ${reason.trim()}`
		};
		set((s) => ({ mandate: {
			...s.mandate,
			locked: false,
			amendments: [...s.mandate.amendments, note]
		} }));
		return { ok: true };
	},
	addWorld: (row) => {
		if (row.name.trim().length < 2 || row.geography.trim().length < 2) return {
			ok: false,
			reason: "Cần tên chỉ tiêu và địa lý."
		};
		if (![
			row.level,
			row.delta,
			row.acceleration
		].some((x) => x.trim())) return {
			ok: false,
			reason: "Cần ít nhất một trong ba: mức, tốc độ đổi, gia tốc."
		};
		if (!recordUsable(row)) return {
			ok: false,
			reason: "Quan sát thế giới chỉ vào sổ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng."
		};
		if (get().world.length >= caps.world) return {
			ok: false,
			reason: fullBook
		};
		const obs = {
			...row,
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ world: [obs, ...s.world] }));
		return { ok: true };
	},
	addBaseRate: (row) => {
		if (row.name.trim().length < 2 || row.event.trim().length < 12 || row.rateNote.trim().length < 2) return {
			ok: false,
			reason: "Cần tên, định nghĩa sự kiện, và con số kèm mẫu."
		};
		if (row.caveat.trim().length < 12) return {
			ok: false,
			reason: "Base rate phải ghi giới hạn: nơi, thời, và cái nó không nói."
		};
		if (!recordUsable(row)) return {
			ok: false,
			reason: "Base rate cần nguồn tầng 1 hoặc 2, ngày, và được phép dùng."
		};
		if (get().baseRates.length >= caps.baseRates) return {
			ok: false,
			reason: fullBook
		};
		const rate = {
			...row,
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ baseRates: [rate, ...s.baseRates] }));
		return { ok: true };
	},
	createCompany: () => {
		if (get().companies.length >= caps.companies) return {
			ok: false,
			reason: fullBook
		};
		const id = newId();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const file = {
			id,
			createdAt: now,
			updatedAt: now,
			status: "draft",
			name: "",
			venue: "",
			standard: "",
			standardNote: "",
			business: "",
			missingNote: "",
			facts: [],
			quality: emptyQuality(),
			sealId: ""
		};
		set((s) => ({ companies: [file, ...s.companies] }));
		return {
			ok: true,
			id
		};
	},
	patchCompany: (id, patch) => set((s) => ({ companies: s.companies.map((c) => c.id === id ? {
		...c,
		...patch,
		status: "draft",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : c) })),
	addCompanyFact: (id, row) => {
		if (row.text.trim().length < 2) return {
			ok: false,
			reason: "Sự kiện trống."
		};
		if (!recordUsable(row)) return {
			ok: false,
			reason: "Sự kiện doanh nghiệp chỉ vào hồ sơ khi có nguồn tầng 1 hoặc 2, ngày, và được phép dùng."
		};
		const file = get().companies.find((c) => c.id === id);
		if (!file) return {
			ok: false,
			reason: "Không thấy hồ sơ doanh nghiệp."
		};
		if (file.facts.length >= caps.facts) return {
			ok: false,
			reason: fullBook
		};
		const fact = {
			...row,
			id: newId(),
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ companies: s.companies.map((c) => c.id === id ? {
			...c,
			facts: [fact, ...c.facts],
			status: "draft",
			updatedAt: fact.at
		} : c) }));
		return { ok: true };
	},
	setQuality: (id, key, patch) => set((s) => ({ companies: s.companies.map((c) => c.id === id ? {
		...c,
		status: "draft",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		quality: {
			...c.quality,
			[key]: {
				...c.quality[key],
				...patch
			}
		}
	} : c) })),
	fileCompany: (id) => {
		const file = get().companies.find((c) => c.id === id);
		if (!file) return {
			ok: false,
			reason: "Không thấy hồ sơ doanh nghiệp."
		};
		const issues = companyFileIssues(file);
		if (issues.length) return {
			ok: false,
			reason: issues[0]
		};
		if (file.status === "filed") return {
			ok: false,
			reason: "Bản này đã đóng. Gõ sửa nếu bạn muốn viết bản nháp mới, rồi nộp lại."
		};
		if (get().companySeals.length >= caps.seals) return {
			ok: false,
			reason: fullBook
		};
		const filedAt = (/* @__PURE__ */ new Date()).toISOString();
		const seal = sealFromCompany({
			...file,
			updatedAt: filedAt
		}, filedAt, newId(), true);
		set((s) => ({
			companySeals: [seal, ...s.companySeals],
			companies: s.companies.map((c) => c.id === id ? {
				...c,
				status: "filed",
				sealId: seal.id,
				updatedAt: filedAt
			} : c)
		}));
		return { ok: true };
	},
	createSignal: () => {
		if (get().signals.length >= caps.signals) return {
			ok: false,
			reason: fullBook
		};
		const id = newId();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = {
			id,
			at: now,
			updatedAt: now,
			family: "",
			hypothesis: "",
			mechanism: "",
			lag: "",
			death: "",
			rights: "",
			rightsOk: false,
			status: "draft",
			diedAt: "",
			deathReason: ""
		};
		set((s) => ({ signals: [row, ...s.signals] }));
		return {
			ok: true,
			id
		};
	},
	patchSignal: (id, patch) => set((s) => ({ signals: s.signals.map((row) => row.id === id && row.status === "draft" ? {
		...row,
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : row) })),
	markSignalAlive: (id) => {
		const row = get().signals.find((s) => s.id === id);
		if (!row) return {
			ok: false,
			reason: "Không thấy tín hiệu."
		};
		if (row.status === "dead") return {
			ok: false,
			reason: "Tín hiệu đã chết không được hồi sinh. Mở một dòng mới."
		};
		if (row.status === "alive") return {
			ok: false,
			reason: "Tín hiệu này đang sống."
		};
		const issues = signalAliveIssues(row);
		if (issues.length) return {
			ok: false,
			reason: issues[0]
		};
		set((s) => ({ signals: s.signals.map((item) => item.id === id ? {
			...item,
			status: "alive",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : item) }));
		return { ok: true };
	},
	killSignal: (id, reason) => {
		const row = get().signals.find((s) => s.id === id);
		if (!row) return {
			ok: false,
			reason: "Không thấy tín hiệu."
		};
		if (row.status === "dead") return {
			ok: false,
			reason: "Tín hiệu này đã chết."
		};
		if (reason.trim().length < 12) return {
			ok: false,
			reason: "Khai tử cần lý do. Giữ vì đã tốn công không phải lý do."
		};
		const at = (/* @__PURE__ */ new Date()).toISOString();
		set((s) => ({ signals: s.signals.map((item) => item.id === id ? {
			...item,
			status: "dead",
			diedAt: at,
			deathReason: reason.trim(),
			updatedAt: at
		} : item) }));
		return { ok: true };
	},
	exportDesk: () => JSON.stringify(normalizePersisted(get()), null, 2),
	importDesk: (raw) => {
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch {
			return {
				ok: false,
				reason: "Tệp này không đọc được."
			};
		}
		if (!parsed || typeof parsed !== "object") return {
			ok: false,
			reason: "Tệp này không phải sổ của bàn làm việc."
		};
		const body = parsed;
		if (![
			"theses",
			"decisions",
			"ledger",
			"mandate",
			"world",
			"baseRates",
			"companies",
			"companySeals",
			"signals",
			"signoff"
		].some((key) => key in body)) return {
			ok: false,
			reason: "Tệp này không phải sổ CHỈNAM."
		};
		const next = normalizePersisted(body);
		const problem = tooBig(next);
		if (problem) return {
			ok: false,
			reason: problem
		};
		set(next);
		return { ok: true };
	}
}), {
	name: "chinam-foundation-v1",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : window.localStorage),
	skipHydration: true,
	partialize: (s) => ({
		theses: s.theses,
		decisions: s.decisions,
		ledger: s.ledger,
		signoff: s.signoff,
		activeThesisId: s.activeThesisId,
		mandate: s.mandate,
		world: s.world,
		baseRates: s.baseRates,
		companies: s.companies,
		companySeals: s.companySeals,
		signals: s.signals
	}),
	merge: (persisted, current) => ({
		...current,
		...normalizePersisted(persisted ?? {})
	})
}));
var nav = [
	{
		href: "/",
		label: "Bàn"
	},
	{
		href: "/mandate",
		label: "Ủy thác"
	},
	{
		href: "/world",
		label: "Thế giới"
	},
	{
		href: "/baserates",
		label: "Base rate"
	},
	{
		href: "/companies",
		label: "Doanh nghiệp"
	},
	{
		href: "/signals",
		label: "Tín hiệu"
	},
	{
		href: "/protocol",
		label: "Quy trình"
	},
	{
		href: "/probability",
		label: "Xác suất"
	},
	{
		href: "/journal",
		label: "Nhật ký"
	},
	{
		href: "/charter",
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
		href: "/library",
		label: "Thư viện"
	},
	{
		href: "/cases",
		label: "Án lệ"
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
var styles_default = "/assets/styles-DdyPgE1h.css";
var APP_NAME = "CHỈNAM";
var Route$16 = createRootRoute({
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
var $$splitComponentImporter$15 = () => import("./routes-DUOEEJ5a.mjs");
var Route$15 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "CHỈNAM — Bàn vận hành" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./baserates-CH4RxuMS.mjs");
var Route$14 = createFileRoute("/baserates")({
	head: () => ({ meta: [{ title: "CHỈNAM — Base rate" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./cases-BnnWICDl.mjs");
var Route$13 = createFileRoute("/cases")({
	head: () => ({ meta: [{ title: "CHỈNAM — Án lệ" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./charter-BEQtmQWL.mjs");
var Route$12 = createFileRoute("/charter")({
	head: () => ({ meta: [{ title: "CHỈNAM — Hiến chương" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./companies-CnwBOcP_.mjs");
var Route$11 = createFileRoute("/companies")({
	head: () => ({ meta: [{ title: "CHỈNAM — Doanh nghiệp" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./evidence-CryJMzLA.mjs");
var Route$10 = createFileRoute("/evidence")({
	head: () => ({ meta: [{ title: "CHỈNAM — Luật bằng chứng" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./gates-CxtRhmFR.mjs");
var Route$9 = createFileRoute("/gates")({
	head: () => ({ meta: [{ title: "CHỈNAM — Nghiệm thu" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./journal-wI467Hp-.mjs");
var Route$8 = createFileRoute("/journal")({
	head: () => ({ meta: [{ title: "CHỈNAM — Nhật ký quyết định" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./library-C18aWrXJ.mjs");
var Route$7 = createFileRoute("/library")({
	head: () => ({ meta: [{ title: "CHỈNAM — Thư viện" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./mandate-BoFTBv7u.mjs");
var Route$6 = createFileRoute("/mandate")({
	head: () => ({ meta: [{ title: "CHỈNAM — Ủy thác" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./modules-vZwCwyt7.mjs");
var Route$5 = createFileRoute("/modules")({
	head: () => ({ meta: [{ title: "CHỈNAM — Bản đồ module" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./probability-DuOFv36j.mjs");
var Route$4 = createFileRoute("/probability")({
	head: () => ({ meta: [{ title: "CHỈNAM — Xác suất" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./protocol-yRdw6nMa.mjs");
var Route$3 = createFileRoute("/protocol")({
	head: () => ({ meta: [{ title: "CHỈNAM — Quy trình một mã" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./review-BGzxEFzs.mjs");
var Route$2 = createFileRoute("/review")({
	head: () => ({ meta: [{ title: "CHỈNAM — Phản biện kiến trúc" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./signals-Bys09GG5.mjs");
var Route$1 = createFileRoute("/signals")({
	head: () => ({ meta: [{ title: "CHỈNAM — Tín hiệu" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./world-DYIUcrdW.mjs");
var Route = createFileRoute("/world")({
	head: () => ({ meta: [{ title: "CHỈNAM — Trạng thái thế giới" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$15.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$16
	}),
	BaseratesRoute: Route$14.update({
		id: "/baserates",
		path: "/baserates",
		getParentRoute: () => Route$16
	}),
	CasesRoute: Route$13.update({
		id: "/cases",
		path: "/cases",
		getParentRoute: () => Route$16
	}),
	CharterRoute: Route$12.update({
		id: "/charter",
		path: "/charter",
		getParentRoute: () => Route$16
	}),
	CompaniesRoute: Route$11.update({
		id: "/companies",
		path: "/companies",
		getParentRoute: () => Route$16
	}),
	EvidenceRoute: Route$10.update({
		id: "/evidence",
		path: "/evidence",
		getParentRoute: () => Route$16
	}),
	GatesRoute: Route$9.update({
		id: "/gates",
		path: "/gates",
		getParentRoute: () => Route$16
	}),
	JournalRoute: Route$8.update({
		id: "/journal",
		path: "/journal",
		getParentRoute: () => Route$16
	}),
	LibraryRoute: Route$7.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$16
	}),
	MandateRoute: Route$6.update({
		id: "/mandate",
		path: "/mandate",
		getParentRoute: () => Route$16
	}),
	ModulesRoute: Route$5.update({
		id: "/modules",
		path: "/modules",
		getParentRoute: () => Route$16
	}),
	ProbabilityRoute: Route$4.update({
		id: "/probability",
		path: "/probability",
		getParentRoute: () => Route$16
	}),
	ProtocolRoute: Route$3.update({
		id: "/protocol",
		path: "/protocol",
		getParentRoute: () => Route$16
	}),
	ReviewRoute: Route$2.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$16
	}),
	SignalsRoute: Route$1.update({
		id: "/signals",
		path: "/signals",
		getParentRoute: () => Route$16
	}),
	WorldRoute: Route.update({
		id: "/world",
		path: "/world",
		getParentRoute: () => Route$16
	})
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
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
