import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Note, PageHeader, Stamp, inputClass } from "@/components/ui";
import { recordUsable } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { SourceTier } from "@/foundation/types";

export const Route = createFileRoute("/world")({
  head: () => ({ meta: [{ title: "CHỈNAM — Trạng thái thế giới" }] }),
  component: WorldPage,
});

const domains = ["Lãi suất", "Lạm phát", "Tăng trưởng", "Việc làm", "Tín dụng", "Thanh khoản", "Tỷ giá", "Hàng hóa", "Địa chính trị", "Chính sách"];

const empty = {
  domain: "Lãi suất",
  name: "",
  geography: "",
  level: "",
  delta: "",
  acceleration: "",
  unit: "",
  source: "",
  tier: "t1" as SourceTier,
  asOf: "",
  permitted: false,
  supersedes: "",
};

function WorldPage() {
  const world = useDesk((s) => s.world);
  const addWorld = useDesk((s) => s.addWorld);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Một bản ghi · nhiều người đọc"
        title="Thế giới chỉ tồn tại khi có nguồn và ngày."
        lede="Mỗi dòng phải có mức, hoặc tốc độ đổi, hoặc gia tốc. Không có dòng thì chưa có trạng thái thế giới. Hệ thống không tải số vĩ mô."
      />
      <div className="mt-4">
        <Note>Tầng 4 và tầng 5 bị từ chối. Một bài báo không trở thành trạng thái thế giới. Đính chính bằng dòng mới, không xóa dòng cũ.</Note>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = addWorld(form);
          setError(result.ok ? "" : result.reason);
          if (result.ok) setForm(empty);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Miền">
            <select className={inputClass} value={form.domain} onChange={(e) => set("domain", e.target.value)}>
              {domains.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Chỉ tiêu">
            <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Địa lý">
            <input className={inputClass} value={form.geography} onChange={(e) => set("geography", e.target.value)} />
          </Field>
          <Field label="Đơn vị">
            <input className={inputClass} value={form.unit} onChange={(e) => set("unit", e.target.value)} />
          </Field>
          <Field label="Mức">
            <input className={inputClass} value={form.level} onChange={(e) => set("level", e.target.value)} />
          </Field>
          <Field label="Tốc độ đổi">
            <input className={inputClass} value={form.delta} onChange={(e) => set("delta", e.target.value)} />
          </Field>
          <Field label="Gia tốc">
            <input className={inputClass} value={form.acceleration} onChange={(e) => set("acceleration", e.target.value)} />
          </Field>
          <Field label="Ngày thị trường có thể biết">
            <input className={inputClass} type="date" value={form.asOf} onChange={(e) => set("asOf", e.target.value)} />
          </Field>
        </div>
        <Field label="Nguồn">
          <input className={inputClass} value={form.source} onChange={(e) => set("source", e.target.value)} />
        </Field>
        <Field label="Tầng">
          <select className={inputClass} value={form.tier} onChange={(e) => set("tier", e.target.value as SourceTier)}>
            <option value="t1">Tầng 1</option>
            <option value="t2">Tầng 2</option>
            <option value="t3">Tầng 3 — sẽ bị từ chối</option>
            <option value="t4">Tầng 4 — sẽ bị từ chối</option>
            <option value="t5">Tầng 5 — sẽ bị từ chối</option>
          </select>
        </Field>
        <Field label="Đính chính dòng cũ, nếu có">
          <input className={inputClass} value={form.supersedes} onChange={(e) => set("supersedes", e.target.value)} />
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={form.permitted} onChange={(e) => set("permitted", e.target.checked)} />
          Nguồn được phép dùng và không phải thông tin nội gián.
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button type="submit" className="bg-accent px-4 py-3 text-sm text-ink">
          Ghi quan sát
        </button>
      </form>
      <ul className="mt-8 space-y-3">
        {world.length === 0 ? <li className="text-sm text-muted">Sổ trống.</li> : null}
        {world.map((row) => (
          <li key={row.id} className="border border-line p-3">
            <div className="flex flex-wrap gap-2">
              <Stamp>{row.domain}</Stamp>
              <Stamp tone={recordUsable(row) ? "solid" : "accent"}>{recordUsable(row) ? "Dùng được" : "Không dùng được"}</Stamp>
            </div>
            <h2 className="mt-2 font-serif text-xl">
              {row.name} · {row.geography}
            </h2>
            <p className="mt-2 text-sm tabular-nums text-muted">
              Mức {row.level || "—"} {row.unit} · đổi {row.delta || "—"} · gia tốc {row.acceleration || "—"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {row.source} · {row.tier} · biết lúc {row.asOf}
              {row.supersedes ? ` · đính chính ${row.supersedes}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
