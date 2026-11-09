import { ensureHashes } from "./hash.ts";
import type { CompanySeal, Decision } from "./types.ts";
import { preflightBook, migrateBook } from "./schema.ts";

export const LEGACY_KEY = "chinam-foundation-v1";
export const DESK_KEY = "chinam-foundation-v2";
export const FALLBACK_KEY = "chinam-foundation-v2-fallback";
export const DB_NAME = "chinam";
export const DB_STORE = "desk";

export type StorageMode = "loading" | "indexeddb" | "fallback" | "unavailable";
export type StorageStatus = {
  ready: boolean;
  mode: StorageMode;
  loadError: string;
  saveError: boolean;
  bytes: number;
  quota: number | null;
};
let status: StorageStatus = { ready: false, mode: "loading", loadError: "", saveError: false, bytes: 0, quota: null };
const listeners = new Set<() => void>();
export const storageSnapshot = (): StorageStatus => status;
export function watchStorage(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish(patch: Partial<StorageStatus>) {
  status = { ...status, ...patch };
  for (const listener of listeners) listener();
}
export function storageErrorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

type StorageBackend = {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
};
let backend: StorageBackend | null = null;
let boot: Promise<string | null> | null = null;
let writesUnlocked = false;
let lastWrite: Promise<void> = Promise.resolve();
let activeMode: StorageMode = "loading";
let hashSink: ((book: { decisions: Decision[]; companySeals: CompanySeal[] }) => void) | null = null;
export function registerHashSink(callback: (book: { decisions: Decision[]; companySeals: CompanySeal[] }) => void) {
  hashSink = callback;
}

function requireLocal(): Storage {
  if (typeof window === "undefined" || !window.localStorage) throw new Error("localStorage không khả dụng.");
  return window.localStorage;
}
async function idbOpen(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") throw new Error("IndexedDB không khả dụng.");
  return new Promise<IDBDatabase>((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try { request = indexedDB.open(DB_NAME, 1); }
    catch (error) { reject(error); return; }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) request.result.createObjectStore(DB_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Không mở được IndexedDB."));
    request.onblocked = () => reject(new Error("IndexedDB bị khóa bởi phiên khác."));
  });
}
function idbRead(db: IDBDatabase, key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(DB_STORE, "readonly");
      const request = tx.objectStore(DB_STORE).get(key);
      request.onsuccess = () => resolve(typeof request.result === "string" ? request.result : null);
      request.onerror = () => reject(request.error ?? new Error("Không đọc được IndexedDB."));
      tx.onerror = () => reject(tx.error ?? new Error("Không đọc được transaction."));
    } catch (error) { reject(error); }
  });
}
function idbWrite(db: IDBDatabase, key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Không ghi được IndexedDB."));
      tx.onabort = () => reject(tx.error ?? new Error("Transaction lưu trữ bị hủy."));
    } catch (error) { reject(error); }
  });
}
function checkEnvelope(raw: string): void {
  let value: unknown;
  try { value = JSON.parse(raw); }
  catch { throw new Error("Sổ đang lưu không phải JSON hợp lệ; giữ nguyên dữ liệu và dừng nạp."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Sổ đang lưu có cấu trúc không hợp lệ.");
  }
  const envelope = value as { state?: unknown };
  if (!envelope.state || typeof envelope.state !== "object" || Array.isArray(envelope.state)) {
    throw new Error("Sổ đang lưu thiếu đối tượng state.");
  }
  const invalid = preflightBook(envelope.state);
  if (invalid) throw new Error("Sổ đã lưu có trường không hợp lệ: " + invalid);
  // Reject malformed legacy fields before copying even one byte to IndexedDB.
  // Validation never mutates the original localStorage payload.
  const checked = migrateBook(envelope.state);
  if (!checked.ok) throw new Error("Sổ đã lưu không hợp lệ tại " + checked.field + ": " + checked.reason);
}
async function estimate() {
  try {
    if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
      const result = await navigator.storage.estimate();
      publish({ quota: typeof result.quota === "number" ? result.quota : null });
    }
  } catch { /* Estimation is optional; never block loading. */ }
}
async function initialize(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  let mode: StorageMode = "indexeddb";
  let db: IDBDatabase | null = null;
  try { db = await idbOpen(); }
  catch { mode = "fallback"; }
  if (mode === "fallback") {
    const local = requireLocal();
    backend = {
      read: async (key) => local.getItem(key),
      write: async (key, value) => { local.setItem(key, value); },
    };
    activeMode = "fallback";
    publish({ mode: "fallback" });
    const current = local.getItem(FALLBACK_KEY);
    const legacy = local.getItem(LEGACY_KEY);
    const raw = current ?? legacy;
    if (raw !== null) checkEnvelope(raw);
    publish({ bytes: raw === null ? 0 : new TextEncoder().encode(raw).byteLength });
    await estimate();
    return raw;
  }
  if (!db) throw new Error("Không thể khởi tạo lưu trữ.");
  const connection = db;
  backend = { read: (key) => idbRead(connection, key), write: (key, value) => idbWrite(connection, key, value) };
  activeMode = "indexeddb";
  publish({ mode: "indexeddb" });
  let raw = await idbRead(connection, DESK_KEY);
  const local = requireLocal();
  // A newer fallback may exist after a previous session had IndexedDB disabled.
  // Never silently prefer the older V1 localStorage key over the V2 fallback.
  const fallback = local.getItem(FALLBACK_KEY);
  if (raw === null) {
    const candidate = fallback ?? local.getItem(LEGACY_KEY);
    if (candidate !== null) {
      checkEnvelope(candidate);
      await idbWrite(connection, DESK_KEY, candidate);
      const verified = await idbRead(connection, DESK_KEY);
      if (verified !== candidate) throw new Error("Chép sổ sang IndexedDB không khớp khi đọc lại.");
      raw = verified;
      if (fallback !== null) local.removeItem(FALLBACK_KEY);
    }
  } else {
    checkEnvelope(raw);
    if (fallback !== null) {
      checkEnvelope(fallback);
      if (fallback !== raw) throw new Error("IndexedDB và sổ dự phòng khác nhau. Không tự ghi đè; hãy sao lưu và đối chiếu hai bản.");
      local.removeItem(FALLBACK_KEY);
    }
  }
  if (raw !== null) checkEnvelope(raw);
  publish({ bytes: raw === null ? 0 : new TextEncoder().encode(raw).byteLength });
  await estimate();
  return raw;
}

/**
 * Async Zustand storage. Writes are *always* forbidden before hydrate success.
 * Never return a rejected persistence Promise to callers; reflect errors in a
 * fixed UI banner and preserve the in-memory book for backup.
 */
export const durableStorage = {
  async getItem(_key: string): Promise<string | null> {
    if (!boot) boot = initialize().catch((error) => {
      publish({ mode: "unavailable", loadError: storageErrorText(error), ready: false });
      throw error;
    });
    return boot;
  },
  async setItem(_key: string, raw: string): Promise<void> {
    if (!writesUnlocked || !status.ready || !backend) return; // fail closed before hydration
    lastWrite = lastWrite.catch(() => {}).then(async () => {
      try {
        const envelope = JSON.parse(raw) as { state: { companySeals: unknown[]; decisions: unknown[] }; version?: number };
        const withHashes = await ensureHashes(envelope.state as never, "created");
        const prepared = JSON.stringify({ ...envelope, state: withHashes });
        const dest = activeMode === "fallback" ? FALLBACK_KEY : DESK_KEY;
        await backend!.write(dest, prepared);
        const reread = await backend!.read(dest);
        if (reread !== prepared) throw new Error("Bản ghi đọc lại không khớp.");
        publish({ saveError: false, bytes: new TextEncoder().encode(prepared).byteLength });
        hashSink?.(withHashes as { decisions: Decision[]; companySeals: CompanySeal[] });
      } catch {
        publish({ saveError: true });
      }
    });
    await lastWrite;
  },
  async removeItem(_key: string): Promise<void> {
    // Never automatically delete either the old or new book.
    publish({ saveError: true });
  },
};
export function allowWritesAfterHydration(): void {
  writesUnlocked = true;
  publish({ ready: true, loadError: "" });
}
export function reportLoadFailure(error: unknown): void {
  writesUnlocked = false;
  publish({ ready: false, loadError: "Không thể mở sổ: " + storageErrorText(error) });
}
export function resetStorageForTest(): void {
  backend = null; boot = null; writesUnlocked = false; activeMode = "loading";
  lastWrite = Promise.resolve();
  publish({ ready: false, mode: "loading", loadError: "", saveError: false, bytes: 0, quota: null });
}
export async function waitForDurableWrites(): Promise<void> {
  await lastWrite;
}
