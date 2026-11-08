import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Note, PageHeader, Stamp, areaClass, inputClass } from "@/components/ui";
import { recordUsable } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { SourceTier } from "@/foundation/types";

export const Route = createFileRoute("/baserates")({
  head: () => ({ meta: [{ title: "CHỈNAM — Base rate" }] }),
  component: RatesPage,
});

const empty = {
  name: "",
  event: "",
  rateNote: "",
  geography: "",
  period: "",
  source: "",
  tier: "t1" as SourceTier,
  asOf: "",
  permitted: false,
  caveat: "",
  supersedes: "",
};

function RatesPage() {
  const rates = useDesk((s) => s.baseRates);
  const add = useDesk((s) => s.addBaseRate);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Sổ base rate"
        title="Một tỷ lệ không có mẫu thì không phải base rate."
        lede="Prior của thị trường Mỹ không được ghi như prior của nơi khác. Nếu nguồn chỉ là tầng 3, dòng bị từ chối cho đến khi có tầng 1 hoặc 2. Học thuật một mình chưa đủ để đưa vào hồ sơ sẵn sàng."
      />
      <div className="mt-4">
        <Note>Không có tỷ lệ mẫu nào được cài sẵn. Điền khi bạn đang cầm tài liệu. Giới hạn sử dụng là bắt buộc.</Note>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = add(form);
          setError(result.ok ? "" : result.reason);
          if (result.ok) setForm(empty);
        }}
      >
        <Field label="Tên">
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Sự kiện được đếm" hint="Cái gì được tính là một lần xảy ra. Không định nghĩa thì tỷ lệ vô nghĩa.">
          <textarea className={areaClass} value={form.event} onChange={(e) => set("event", e.target.value)} />
        </Field>
        <Field label="Tỷ lệ và cỡ mẫu" hint="Viết cả tử, mẫu, và đơn vị. Đừng chỉ viết một phần trăm.">
          <input className={inputClass} value={form.rateNote} onChange={(e) => set("rateNote", e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nơi">
            <input className={inputClass} value={form.geography} onChange={(e) => set("geography", e.target.value)} />
          </Field>
          <Field label="Khoảng thời gian của mẫu">
            <input className={inputClass} value={form.period} onChange={(e) => set("period", e.target.value)} />
          </Field>
          <Field label="Ngày biết">
            <input className={inputClass} type="date" value={form.asOf} onChange={(e) => set("asOf", e.target.value)} />
          </Field>
          <Field label="Tầng">
            <select className={inputClass} value={form.tier} onChange={(e) => set("tier", e.target.value as SourceTier)}>
              <option value="t1">Tầng 1</option>
              <option value="t2">Tầng 2</option>
              <option value="t3">Tầng 3 — sẽ bị từ chối</option>
            </select>
          </Field>
        </div>
        <Field label="Nguồn">
          <input className={inputClass} value={form.source} onChange={(e) => set("source", e.target.value)} />
        </Field>
        <Field label="Giới hạn" hint="Nơi nào không được ngoại suy. Thời nào làm mẫu gãy.">
          <textarea className={areaClass} value={form.caveat} onChange={(e) => set("caveat", e.target.value)} />
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={form.permitted} onChange={(e) => set("permitted", e.target.checked)} />
          Nguồn được phép dùng.
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button type="submit" className="bg-accent px-4 py-3 text-sm text-ink">
          Ghi base rate
        </button>
      </form>
      <ul className="mt-8 space-y-3">
        {rates.length === 0 ? <li className="text-sm text-muted">Sổ trống. Chưa có prior nội bộ.</li> : null}
        {rates.map((row) => (
          <li key={row.id} className="border border-line p-3">
            <Stamp tone={recordUsable(row) ? "solid" : "accent"}>{recordUsable(row) ? "Dùng được" : "Không dùng được"}</Stamp>
            <h2 className="mt-2 font-serif text-xl">{row.name}</h2>
            <p className="mt-2 text-sm">{row.rateNote}</p>
            <p className="mt-2 text-sm text-muted">{row.event}</p>
            <p className="mt-2 text-xs text-muted">
              {row.geography} · {row.period} · {row.source} · {row.asOf}
            </p>
            <p className="mt-2 text-sm text-accent">{row.caveat}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
