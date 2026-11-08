import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Stamp } from "@/components/ui";
import { layers, modules, type ModuleStatus } from "@/foundation/modules";

export const Route = createFileRoute("/modules")({
  head: () => ({ meta: [{ title: "CHỈNAM — Bản đồ module" }] }),
  component: ModulesPage,
});

const statusLabel: Record<ModuleStatus, string> = {
  instrument: "Dụng cụ",
  doctrine: "Chưa xây engine",
  proposed: "Chờ Owner",
};

function ModulesPage() {
  const [id, setId] = useState(modules[0]?.id ?? "charter");
  const [layer, setLayer] = useState<string>("all");
  const selected = modules.find((m) => m.id === id) ?? modules[0];
  const visible = modules.filter((m) => layer === "all" || m.layer === layer);

  return (
    <div>
      <PageHeader
        kicker="Bản đồ"
        title="Mỗi module có đầu vào, đầu ra, và một việc nó không được làm."
        lede="Quan hệ ghi bằng mã module nó đọc và việc nó được phép ghi. Trạng thái chưa xây là trạng thái thật. Đừng đọc bản đồ như thể các engine đang chạy."
      />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Filter on={layer === "all"} label="Tất cả" click={() => setLayer("all")} />
        {layers.map((item) => (
          <Filter key={item} on={layer === item} label={item} click={() => setLayer(item)} />
        ))}
      </div>
      <div className="mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <ul className="max-h-80 space-y-1 overflow-auto lg:max-h-none">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setId(m.id)}
                className={`w-full border px-3 py-2 text-left ${m.id === selected?.id ? "border-accent" : "border-line"}`}
              >
                <span className="text-xs text-muted">{m.code}</span>
                <span className="mt-0.5 block text-sm">{m.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <article className="mt-6 min-w-0 border border-line p-4 lg:mt-0">
            <div className="flex flex-wrap gap-2">
              <Stamp>{selected.code}</Stamp>
              <Stamp tone={selected.status === "doctrine" ? "accent" : selected.status === "proposed" ? "accent" : "solid"}>
                {statusLabel[selected.status]}
              </Stamp>
              <Stamp>Phase {selected.phase}</Stamp>
            </div>
            <h2 className="mt-3 font-serif text-2xl">{selected.name}</h2>
            <p className="mt-2 text-sm text-muted">{selected.layer}</p>
            <p className="mt-4 text-sm leading-relaxed">{selected.purpose}</p>
            {selected.note ? <p className="mt-3 text-sm text-accent">{selected.note}</p> : null}
            <Meta k="Sở hữu sự thật về" items={[selected.owns]} />
            <Meta k="Đầu vào" items={selected.inputs} />
            <Meta k="Đầu ra" items={selected.outputs} />
            <Meta k="Đọc" items={selected.reads.length ? selected.reads : ["Không phụ thuộc module khác"]} />
            <Meta k="Được ghi" items={selected.writes} />
            <Meta k="Cấm" items={selected.forbids} />
            <Meta k="Nghiệm thu" items={selected.acceptance} />
          </article>
        ) : null}
      </div>
    </div>
  );
}

function Filter({ on, label, click }: { on: boolean; label: string; click: () => void }) {
  return (
    <button type="button" onClick={click} className={`shrink-0 border px-3 py-2 text-xs ${on ? "border-accent text-fg" : "border-line text-muted"}`}>
      {label}
    </button>
  );
}

function Meta({ k, items }: { k: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs tracking-wide text-muted uppercase">{k}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
