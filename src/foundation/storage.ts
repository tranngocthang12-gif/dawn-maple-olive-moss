import { ensureHashes, hashJson, countIntegrity } from "./hash.ts";
import type { CompanySeal, Decision } from "./types.ts";
import { preflightBook, migrateBook } from "./schema.ts";

export const LEGACY_KEY = "chinam-foundation-v1";
export const DESK_KEY = "chinam-foundation-v2";
export const FALLBACK_KEY = "chinam-foundation-v2-fallback";
export const DB_NAME = "chinam";
export const DB_STORE = "desk";

/** Quarantine entries never overwrite the active book or the legacy V1 key. */
export const QUARANTINE_PREFIX = "chinam-recovery-quarantine-";
export type RawRecoveryCopy = { source: string; raw: string };
export async function readRawRecoveryCopies(): Promise<RawRecoveryCopy[]> {
  if (typeof window === "undefined") throw new Error("Không có bộ nhớ trình duyệt.");
  const copies: RawRecoveryCopy[] = [];
  try {
    const db = await idbOpen();
    try {
      const raw = await idbRead(db, DESK_KEY);
      if (raw !== null) copies.push({ source: "indexeddb:" + DESK_KEY, raw });
    } finally { db.close?.(); }
  } catch (error) {
    // Export remains available when localStorage is readable. Represent the
    // IndexedDB failure explicitly; never invent missing IndexedDB bytes.
    copies.push({ source: "indexeddb: KHÔNG ĐỌC ĐƯỢC — " + storageErrorText(error), raw: "" });
  }
  const local = requireLocal();
  for (const key of [LEGACY_KEY, FALLBACK_KEY]) {
    const raw = local.getItem(key);
    if (raw !== null) copies.push({ source: "localStorage:" + key, raw });
  }
  return copies;
}
/** Quarantine all active raw copies before permitting any recovery write. */
export async function quarantineRawRecoveryCopies(): Promise<RawRecoveryCopy[]> {
  const copies = await readRawRecoveryCopies();
  if (copies.length === 0) return copies;
  // A partial export is permitted, but recovery must remain strictly
  // fail-closed if the active IndexedDB record could not be read.
  const unreadable = copies.find((copy) => copy.source.startsWith("indexeddb: KHÔNG ĐỌC ĐƯỢC"));
  if (unreadable) throw new Error("Không thể đọc dữ liệu thô IndexedDB: " + unreadable.source);
  // Require a recoverable IndexedDB source: a legacy-only copy must not
  // authorize overwriting an unreadable active IndexedDB book.
  if (!copies.some((copy) => copy.source === "indexeddb:" + DESK_KEY)) {
    throw new Error("Không đọc được bản IndexedDB gốc để cách ly; từ chối phục hồi.");
  }
  const local = requireLocal();
  const key = QUARANTINE_PREFIX + new Date().toISOString() + "-" + Math.random().toString(36).slice(2);
  const serialized = JSON.stringify(copies);
  try {
    local.setItem(key, serialized);
    if (local.getItem(key) !== serialized) throw new Error("Không xác minh được bản cách ly.");
  } catch (error) {
    throw new Error("Không cách ly được dữ liệu gốc; từ chối phục hồi: " + storageErrorText(error));
  }
  return copies;
}


/**
 * Recovery is intentionally stricter than normal import: a verified V2 backup
 * only, no unverified legacy or tamper waiver while the active book is broken.
 * The active copy is never written before a verified quarantine exists.
 */
export async function recoverVerifiedBackup(raw: string): Promise<void> {
  if (status.ready || writesUnlocked) throw new Error("Chỉ phục hồi qua màn hình sổ lỗi.");
  let parsed: unknown;
  try { parsed = JSON.parse(raw); }
  catch { throw new Error("Backup không phải JSON hợp lệ."); }
  const migrated = migrateBook(parsed);
  if (!migrated.ok) throw new Error("Backup không hợp lệ: " + migrated.field + " — " + migrated.reason);
  if (migrated.legacy) throw new Error("Backup V1 chưa kiểm không được phục hồi tự động.");
  const book = migrated.book;
  if (!book.sha256 || await hashJson(book) !== book.sha256) throw new Error("sha256: Backup không khớp mã băm tổng.");
  const integrity = await countIntegrity(book.companySeals, book.decisions);
  if (integrity.missing || integrity.mismatched) throw new Error("sha256: Backup có bản niêm phong hoặc ảnh chụp chưa xác minh.");
  // Quarantine must be durable and read back successfully BEFORE any write.
  const quarantined = await quarantineRawRecoveryCopies();
  if (quarantined.length === 0) throw new Error("Không có dữ liệu gốc để cách ly; từ chối ghi phục hồi.");
  const indexed = quarantined.find((copy) => copy.source === "indexeddb:" + DESK_KEY);
  if (!indexed) throw new Error("Bản IndexedDB gốc không được cách ly.");
  // Damaged JSON has no trustworthy version. Mark this an exceptional recovery
  // generation; never overwrite another tab's newer bytes after quarantine.
  let previousVersion = 0;
  try { previousVersion = versionOf(indexed.raw); }
  catch { /* Integrity of the old version is unknown; raw evidence is retained. */ }
  const nextVersion = previousVersion + 1;
  if (!Number.isSafeInteger(nextVersion)) throw new Error("Phiên bản phục hồi vượt giới hạn an toàn.");
  const envelope = JSON.stringify({ state: book, version: 0, bookVersion: nextVersion });
  const db = await idbOpen();
  try {
    if (!await idbReplaceIfCurrent(db, DESK_KEY, indexed.raw, envelope)) {
      throw new Error("Xung đột khi phục hồi: tab khác đã thay đổi sổ; không ghi đè.");
    }
    if (await idbRead(db, DESK_KEY) !== envelope) throw new Error("Không xác minh được dữ liệu phục hồi.");
  } finally { db.close?.(); }
  // Keep writes locked; a full page reload must hydrate the recovered book.
}
export type StorageMode = "loading" | "indexeddb" | "fallback" | "unavailable";
export type StorageStatus = {
  ready: boolean;
  mode: StorageMode;
  loadError: string;
  saveError: boolean;
  conflict: boolean;
  readOnly: boolean;
  bytes: number;
  quota: number | null;
};
let status: StorageStatus = { ready: false, mode: "loading", loadError: "", saveError: false, conflict: false, readOnly: false, bytes: 0, quota: null };
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
let expectedDiskRaw: string | null = null;
let diskVersion = 0;
let conflictLocked = false;
function versionOf(raw: string | null): number {
  if (raw === null) return 0;
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Phiên bản sổ không hợp lệ.");
  const v = (parsed as { bookVersion?: unknown }).bookVersion;
  if (v === undefined) return 0;
  if (!Number.isSafeInteger(v) || (v as number) < 0) throw new Error("Phiên bản sổ không hợp lệ.");
  return v as number;
}
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
      request.onsuccess = () => {
        if (request.result !== undefined && request.result !== null && typeof request.result !== "string") {
          reject(new Error("IndexedDB chứa bản sổ không phải chuỗi; giữ nguyên và dừng đọc."));
          return;
        }
        resolve(typeof request.result === "string" ? request.result : null);
      };
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
/**
 * Generic byte-exact compare-and-swap. This is also used for installing the
 * byte-identical legacy seed and for quarantine-gated recovery; neither path
 * may blindly overwrite a book that another tab has changed.
 */
function idbReplaceIfCurrent(
  db: IDBDatabase, key: string, expectedRaw: string | null, replacementRaw: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let matched = false;
    try {
      const tx = db.transaction(DB_STORE, "readwrite");
      const store = tx.objectStore(DB_STORE);
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result !== undefined && request.result !== null && typeof request.result !== "string") {
          tx.abort();
          reject(new Error("IndexedDB chứa dữ liệu không phải chuỗi; từ chối ghi đè."));
          return;
        }
        const current = typeof request.result === "string" ? request.result : null;
        if (current !== expectedRaw) return;
        matched = true;
        store.put(replacementRaw, key);
      };
      request.onerror = () => reject(request.error ?? new Error("Không đọc được CAS."));
      tx.oncomplete = () => resolve(matched);
      tx.onerror = () => reject(tx.error ?? new Error("CAS transaction lỗi."));
      tx.onabort = () => reject(tx.error ?? new Error("CAS transaction bị hủy."));
    } catch (error) { reject(error); }
  });
}

/** Standard writes require a strictly monotonic bookVersion in the same transaction. */
export function idbCompareAndSwap(
  db: IDBDatabase, key: string, expectedRaw: string | null, replacementRaw: string,
): Promise<boolean> {
  try {
    if (versionOf(replacementRaw) !== versionOf(expectedRaw) + 1) {
      return Promise.reject(new Error("CAS yêu cầu bookVersion tăng đúng một bước."));
    }
  } catch (error) { return Promise.reject(error); }
  return idbReplaceIfCurrent(db, key, expectedRaw, replacementRaw);
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
    expectedDiskRaw = raw;
    diskVersion = versionOf(raw);
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
      const installed = await idbReplaceIfCurrent(connection, DESK_KEY, null, candidate);
      const verified = await idbRead(connection, DESK_KEY);
      if (!installed && verified !== candidate) {
        throw new Error("Sổ đã được tab khác tạo trong khi chuyển dữ liệu; không tự ghi đè.");
      }
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
  expectedDiskRaw = raw;
  diskVersion = versionOf(raw);
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
    if (!writesUnlocked || !status.ready || !backend || conflictLocked) return; // fail closed
    lastWrite = lastWrite.catch(() => {}).then(async () => {
      if (!writesUnlocked || !status.ready || conflictLocked) return; // queued write after a conflict
      try {
        const envelope = JSON.parse(raw) as { state: { companySeals: unknown[]; decisions: unknown[] }; version?: number };
        const withHashes = await ensureHashes(envelope.state as never, "created");
        const nextVersion = diskVersion + 1;
        if (!Number.isSafeInteger(nextVersion)) throw new Error("Phiên bản sổ vượt giới hạn an toàn.");
        const prepared = JSON.stringify({ ...envelope, state: withHashes, bookVersion: nextVersion });
        const dest = activeMode === "fallback" ? FALLBACK_KEY : DESK_KEY;
        if (activeMode === "indexeddb") {
          const db = await idbOpen();
          try {
            if (!await idbCompareAndSwap(db, dest, expectedDiskRaw, prepared)) {
              conflictLocked = true;
              writesUnlocked = false;
              publish({ ready: false, saveError: true, conflict: true });
              return;
            }
          } finally { db.close?.(); }
        } else {
          // Without IndexedDB transactional CAS, writes are never safe across tabs.
          writesUnlocked = false;
          publish({ ready: false, readOnly: true, saveError: true });
          return;
        }
        // A successful readwrite transaction is a completed commit.
        // Another tab can win a *later* transaction before this separate
        // verification read; in that case this tab must lock immediately.
        expectedDiskRaw = prepared;
        diskVersion = nextVersion;
        let reread: string | null;
        try {
          reread = await backend!.read(dest);
        } catch {
          writesUnlocked = false;
          publish({ ready: false, readOnly: true, saveError: true });
          return;
        }
        if (reread !== prepared) {
          conflictLocked = true;
          writesUnlocked = false;
          publish({ ready: false, conflict: true, saveError: true });
          return;
        }
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
  if (conflictLocked) return;
  if (activeMode === "fallback") {
    writesUnlocked = false;
    publish({ ready: false, readOnly: true, loadError: "" });
    return;
  }
  writesUnlocked = true;
  publish({ ready: true, readOnly: false, loadError: "" });
}
export function reportLoadFailure(error: unknown): void {
  writesUnlocked = false;
  publish({ ready: false, loadError: "Không thể mở sổ: " + storageErrorText(error) });
}
export function resetStorageForTest(): void {
  backend = null; boot = null; writesUnlocked = false; activeMode = "loading";
  expectedDiskRaw = null; diskVersion = 0; conflictLocked = false;
  lastWrite = Promise.resolve();
  publish({ ready: false, mode: "loading", loadError: "", saveError: false, conflict: false, readOnly: false, bytes: 0, quota: null });
}
export async function waitForDurableWrites(): Promise<void> {
  await lastWrite;
}
