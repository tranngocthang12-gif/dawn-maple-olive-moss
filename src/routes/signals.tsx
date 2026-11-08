import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Note, PageHeader, Stamp, areaClass, inputClass } from "@/components/ui";
import { funnel, overfitChecks, scorePenalties, sensors, signalScore } from "@/foundation/doctrine";
import { signalAliveIssues } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { Signal } from "@/foundation/types";

export const Route = createFileRoute("/signals")({
  head: () => ({ meta: [{ title: "CHỈNAM — Tín hiệu" }] }),
  component: SignalsPage,
});

function SignalsPage() {
  const signals = useDesk((s) => s.signals);
  const createSignal = useDesk((s) => s.createSignal);
  const patchSignal = useDesk((s) => s.patchSignal);
  const markAlive = useDesk((s) => s.markSignalAlive);
  const kill = useDesk((s) => s.killSignal);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const row = signals.find((s) => s.id === activeId) ?? signals[0] ?? null;
  const alive = signals.filter((s) => s.status === "alive").length;
  const dead = signals.filter((s) => s.status === "dead").length;

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Sổ tín hiệu · chưa có backtest"
        title="Viết cách nó chết trước khi cho nó sống."
        lede="Một tín hiệu vào sổ như giả thuyết. Nó chỉ được đánh dấu đang sống khi có cơ chế, độ trễ, cách chết, và quyền dữ liệu. Không có điểm số. Không có lệnh."
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Stamp>{signals.length} dòng</Stamp>
        <Stamp tone={alive ? "solid" : "muted"}>{alive} đang sống</Stamp>
        <Stamp tone="accent">{dead} đã chết</Stamp>
      </div>
      <div className="mt-4">
        <Note>Hồi sinh bị cấm. Muốn xét lại thì mở một dòng mới và viết lại cơ chế. Giữ vì đã tốn công không phải lý do khai tử.</Note>
      </div>
      <button
        type="button"
        className="mt-4 bg-accent px-4 py-3 text-sm text-ink"
        onClick={() => {
          const result = createSignal();
          if (!result.ok) setError(result.reason);
          else {
            setError("");
            setActiveId(result.id);
          }
        }}
      >
        Mở một tín hiệu trống
      </button>

      {signals.length > 0 ? (
        <ul className="mt-6 flex gap-2 overflow-x-auto">
          {signals.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`shrink-0 border px-3 py-2 text-sm ${(row?.id ?? "") === s.id ? "border-accent text-fg" : "border-line text-muted"}`}
                onClick={() => setActiveId(s.id)}
              >
                {labelOf(s)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted">Sổ đang trống. Không có tín hiệu mẫu.</p>
      )}

      {row ? <SignalEditor row={row} reason={reason} error={error} onReason={setReason} onError={setError} patch={patchSignal} markAlive={markAlive} kill={kill} /> : null}

      <Doctrine />
    </div>
  );
}

function labelOf(s: Signal) {
  const family = sensors.find((x) => x.id === s.family)?.name ?? "Chưa chọn họ";
  const state = s.status === "alive" ? "sống" : s.status === "dead" ? "chết" : "nháp";
  return `${family} · ${state}`;
}

function SignalEditor({
  row,
  reason,
  error,
  onReason,
  onError,
  patch,
  markAlive,
  kill,
}: {
  row: Signal;
  reason: string;
  error: string;
  onReason: (v: string) => void;
  onError: (v: string) => void;
  patch: (
    id: string,
    patch: Partial<Pick<Signal, "family" | "hypothesis" | "mechanism" | "lag" | "death" | "rights" | "rightsOk">>,
  ) => void;
  markAlive: (id: string) => { ok: boolean; reason?: string };
  kill: (id: string, reason: string) => { ok: boolean; reason?: string };
}) {
  const locked = row.status !== "draft";
  const issues = signalAliveIssues(row);
  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Stamp tone={row.status === "alive" ? "solid" : row.status === "dead" ? "accent" : "muted"}>
          {row.status === "alive" ? "Đang sống" : row.status === "dead" ? "Đã chết" : "Nháp"}
        </Stamp>
        {locked ? <Stamp>Đã khóa nội dung</Stamp> : null}
      </div>
      <Field label="Họ cảm biến">
        <select className={inputClass} disabled={locked} value={row.family} onChange={(e) => patch(row.id, { family: e.target.value })}>
          <option value="">Chưa chọn</option>
          {sensors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Giả thuyết" hint="Điều gì sẽ sai nếu tín hiệu này sai.">
        <textarea className={areaClass} disabled={locked} value={row.hypothesis} onChange={(e) => patch(row.id, { hypothesis: e.target.value })} />
      </Field>
      <Field label="Cơ chế nhân quả" hint="Tương quan không đủ.">
        <textarea className={areaClass} disabled={locked} value={row.mechanism} onChange={(e) => patch(row.id, { mechanism: e.target.value })} />
      </Field>
      <Field label="Độ trễ và cửa sổ còn giao dịch được không">
        <textarea className={areaClass} disabled={locked} value={row.lag} onChange={(e) => patch(row.id, { lag: e.target.value })} />
      </Field>
      <Field label="Cách chết">
        <textarea className={areaClass} disabled={locked} value={row.death} onChange={(e) => patch(row.id, { death: e.target.value })} />
      </Field>
      <Field label="Quyền dữ liệu" hint="Cảm biến vật lý phải ghi vì sao việc thu thập là hợp pháp.">
        <textarea className={areaClass} disabled={locked} value={row.rights} onChange={(e) => patch(row.id, { rights: e.target.value })} />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          disabled={locked}
          checked={row.rightsOk}
          onChange={(e) => patch(row.id, { rightsOk: e.target.checked })}
        />
        <span>Dữ liệu được phép dùng và không phải thông tin nội gián.</span>
      </label>
      {row.status === "draft" && issues.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {issues.map((item) => (
            <li key={item} className="border-t border-line py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {row.status === "draft" ? (
        <button
          type="button"
          className="bg-accent px-4 py-3 text-sm text-ink"
          onClick={() => {
            const result = markAlive(row.id);
            onError(result.ok ? "" : (result.reason ?? "Không cho sống."));
          }}
        >
          Cho sống — chưa phải alpha
        </button>
      ) : null}
      {row.status !== "dead" ? (
        <div className="border-t border-line pt-4">
          <Field label="Lý do khai tử">
            <textarea className={areaClass} value={reason} onChange={(e) => onReason(e.target.value)} />
          </Field>
          <button
            type="button"
            className="mt-3 border border-accent px-4 py-3 text-sm"
            onClick={() => {
              const result = kill(row.id, reason);
              onError(result.ok ? "" : (result.reason ?? "Không khai tử được."));
              if (result.ok) onReason("");
            }}
          >
            Khai tử
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">Đã chết {row.diedAt.slice(0, 10)}. Lý do: {row.deathReason}</p>
      )}
      {error ? <p className="text-sm text-accent">{error}</p> : null}
    </div>
  );
}

function Doctrine() {
  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl">Luật còn giữ, engine chưa xây</h2>
      <p className="mt-3 text-sm text-muted">
        Không có backtest trong sổ này. Phễu dưới đây là minh họa, không phải hạn ngạch. Điểm C × L × I × R × U chưa có thang số.
      </p>
      <ol className="mt-6 space-y-3">
        {funnel.map((stage, i) => (
          <li key={stage.gate} className="border-t border-line pt-3">
            <p className="text-xs text-muted">Cửa {i + 1}</p>
            <p className="font-serif text-xl">{stage.n}</p>
            <p className="text-sm text-muted">{stage.gate}</p>
          </li>
        ))}
      </ol>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Điểm chất lượng — chưa chấm</h2>
        <div className="mt-4 space-y-3">
          {signalScore.map((s) => (
            <article key={s.k} className="border-t border-line pt-3">
              <h3 className="text-sm">
                {s.k} · {s.name}
              </h3>
              <p className="text-sm text-muted">{s.q}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {scorePenalties.map((p) => (
            <Stamp key={p} tone="accent">
              Trừ {p}
            </Stamp>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Họ cảm biến</h2>
        <div className="mt-4 space-y-3">
          {sensors.map((s) => (
            <article key={s.id} className="border-t border-line pt-3">
              <h3 className="text-sm">{s.name}</h3>
              <p className="text-sm text-muted">{s.watch}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Chống overfitting</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {overfitChecks.map((item) => (
            <li key={item} className="border-t border-line py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
