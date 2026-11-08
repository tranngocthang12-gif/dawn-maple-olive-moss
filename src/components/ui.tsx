import type { ReactNode } from "react";
import type { EvidenceClass } from "@/foundation/types";
import { evidenceLabel } from "@/foundation/logic";

export function PageHeader({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-medium tracking-widest text-accent uppercase">{kicker}</p>
      <h1 className="mt-2 font-serif text-3xl text-fg lg:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">{lede}</p>
    </header>
  );
}

export function Stamp({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" | "solid" }) {
  const toneClass =
    tone === "solid"
      ? "border-accent bg-accent text-ink"
      : tone === "accent"
        ? "border-accent text-accent"
        : "border-line text-muted";
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 text-xs tracking-wide uppercase ${toneClass}`}>
      {children}
    </span>
  );
}

export function klassTone(k: EvidenceClass | "fact" | "inference" | "hypothesis"): "muted" | "accent" | "solid" {
  if (k === "fact" || k === "data") return "solid";
  if (k === "hypothesis" || k === "forecast" || k === "insufficient") return "accent";
  return "muted";
}

export function EvidenceStamp({ k }: { k: EvidenceClass }) {
  return <Stamp tone={klassTone(k)}>{evidenceLabel(k)}</Stamp>;
}

export function Note({ children }: { children: ReactNode }) {
  return <aside className="border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">{children}</aside>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-fg">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-relaxed text-muted">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted focus:border-accent";

export const areaClass = `${inputClass} min-h-28 leading-relaxed`;
