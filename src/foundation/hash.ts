import type { CompanySeal, Decision } from "./types.ts";

/**
 * Stable JSON: all object keys sorted by Unicode code unit order, no whitespace.
 * JSON values only; reject cyclic or non-JSON values instead of inventing a hash.
 */
export function canonicalJson(value: unknown): string {
  const seen = new WeakSet<object>();
  const walk = (item: unknown, inArray: boolean): string => {
    if (item === null) return "null";
    if (typeof item === "string" || typeof item === "boolean") return JSON.stringify(item);
    if (typeof item === "number") {
      if (!Number.isFinite(item)) throw new Error("Không thể băm số không hữu hạn.");
      return JSON.stringify(item);
    }
    if (typeof item !== "object") {
      if (inArray && (item === undefined || typeof item === "function")) return "null";
      throw new Error("Dữ liệu không phải JSON hợp lệ để băm.");
    }
    if (seen.has(item)) throw new Error("Dữ liệu có vòng tham chiếu, không thể băm.");
    seen.add(item);
    let result: string;
    if (Array.isArray(item)) {
      result = "[" + item.map((v) => walk(v, true)).join(",") + "]";
    } else {
      const object = item as Record<string, unknown>;
      result = "{" + Object.keys(object).filter((k) => object[k] !== undefined)
        .sort().map((k) => JSON.stringify(k) + ":" + walk(object[k], false)).join(",") + "}";
    }
    seen.delete(item);
    return result;
  };
  return walk(value, false);
}

export async function sha256Hex(raw: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto SHA-256 không khả dụng; không ghi sổ khi chưa băm được.");
  const bytes = new TextEncoder().encode(raw);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** sha256 is removed only from the root object being hashed, not from its children. */
export async function hashJson(value: Record<string, unknown>): Promise<string> {
  const { sha256: _hash, ...body } = value;
  return sha256Hex(canonicalJson(body));
}

export async function verifyJsonHash(value: { sha256?: string } & Record<string, unknown>): Promise<boolean> {
  return typeof value.sha256 === "string" && /^[a-f0-9]{64}$/u.test(value.sha256)
    && (await hashJson(value)) === value.sha256;
}

export type HashOrigin = "created" | "legacy-backfill";
type HasHash = { sha256?: string; sha256Origin?: HashOrigin };

export async function sealHash<T extends object & HasHash>(record: T, origin: HashOrigin): Promise<T> {
  if (record.sha256) return record; // Never silently repair a mismatched stored hash.
  const candidate = { ...record, sha256Origin: record.sha256Origin ?? origin };
  return { ...candidate, sha256: await hashJson(candidate) } as T;
}

export function snapshotOf(decision: Pick<Decision, "thesisSnapshot" | "companySeal" | "worldSnapshot" | "baseRateSnapshot">) {
  return {
    thesisSnapshot: decision.thesisSnapshot,
    companySeal: decision.companySeal,
    worldSnapshot: decision.worldSnapshot,
    baseRateSnapshot: decision.baseRateSnapshot,
  };
}

export async function hashDecisionSnapshot(
  decision: Pick<Decision, "thesisSnapshot" | "companySeal" | "worldSnapshot" | "baseRateSnapshot">,
  origin: HashOrigin,
): Promise<{ snapshotSha256: string; snapshotHashOrigin: HashOrigin }> {
  // Origin lives outside the snapshot hash so a legacy-backfill mark does not change old evidence.
  return { snapshotSha256: await sha256Hex(canonicalJson(snapshotOf(decision))), snapshotHashOrigin: origin };
}

export async function verifySnapshot(decision: Decision): Promise<boolean> {
  return !!decision.snapshotSha256 && /^[0-9a-f]{64}$/u.test(decision.snapshotSha256)
    && (await sha256Hex(canonicalJson(snapshotOf(decision)))) === decision.snapshotSha256;
}

export type Integrity = { matched: number; mismatched: number; missing: number };

export async function countIntegrity(seals: CompanySeal[], decisions: Decision[]): Promise<Integrity> {
  const result: Integrity = { matched: 0, mismatched: 0, missing: 0 };
  for (const seal of seals) {
    if (!seal.sha256) result.missing++;
    else if (await verifyJsonHash(seal)) result.matched++;
    else result.mismatched++;
  }
  for (const decision of decisions) {
    if (decision.companySeal) {
      if (!decision.companySeal.sha256) result.missing++;
      else if (await verifyJsonHash(decision.companySeal)) result.matched++;
      else result.mismatched++;
    }
    if (!decision.snapshotSha256) result.missing++;
    else if (await verifySnapshot(decision)) result.matched++;
    else result.mismatched++;
  }
  return result;
}

/** Fill only missing hashes; an existing mismatch is evidence and stays a mismatch. */
export async function ensureHashes<T extends {
  companySeals: CompanySeal[];
  decisions: Decision[];
}>(state: T, origin: HashOrigin): Promise<T> {
  const companySeals = await Promise.all(state.companySeals.map((s) => sealHash(s, origin)));
  const decisions = await Promise.all(state.decisions.map(async (d) => {
    const companySeal = d.companySeal ? await sealHash(d.companySeal, origin) : null;
    const candidate: Decision = { ...d, companySeal };
    if (candidate.snapshotSha256) return candidate;
    return { ...candidate, ...(await hashDecisionSnapshot(candidate, candidate.snapshotHashOrigin ?? origin)) };
  }));
  return { ...state, companySeals, decisions };
}
