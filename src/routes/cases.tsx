import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Stamp } from "@/components/ui";
import { cases, type CaseKind } from "@/foundation/cases";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "CHỈNAM — Án lệ" }] }),
  component: CasesPage,
});

const filters: { id: CaseKind | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "system", label: "Hệ thống còn sống" },
  { id: "failure", label: "Đổ" },
  { id: "pattern", label: "Mẫu hình" },
];

function CasesPage() {
  const [kind, setKind] = useState<CaseKind | "all">("all");
  const shown = cases.filter((c) => kind === "all" || c.kind === kind);
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Án lệ"
        title="Không thần tượng hóa cái sống. Không lấy một vụ đổ để khai tử cả một phương pháp."
        lede="Mỗi án có năm ngăn: cái được, cái gãy, vì sao, cái mang sang được, cái không được chép. Suất sinh lời của quỹ không được nhập khi chưa có nguồn sơ cấp trong dòng dõi."
      />
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setKind(f.id)}
            className={`shrink-0 border px-3 py-2 text-sm ${kind === f.id ? "border-accent text-fg" : "border-line text-muted"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-8">
        {shown.map((item) => (
          <article key={item.id} className="border-t border-line pt-6">
            <div className="flex flex-wrap gap-2">
              <Stamp tone={item.kind === "failure" ? "accent" : "muted"}>
                {item.kind === "system" ? "Hệ thống" : item.kind === "failure" ? "Thất bại" : "Mẫu hình"}
              </Stamp>
              <Stamp>{item.when}</Stamp>
            </div>
            <h2 className="mt-3 font-serif text-2xl">{item.title}</h2>
            <Block k="Cái được" items={item.worked} />
            <Block k="Cái gãy" items={item.failed} />
            <Block k="Vì sao" items={item.why} />
            <Block k="Mang sang được" items={item.transfer} />
            <Block k="Không được chép" items={item.notCopy} />
            <p className="mt-4 text-sm leading-relaxed text-accent">{item.evidence}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Block({ k, items }: { k: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-xs tracking-wide text-muted uppercase">{k}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
