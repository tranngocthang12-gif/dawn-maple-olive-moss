import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stamp } from "@/components/ui";
import { phases } from "@/foundation/doctrine";
import { useDesk } from "@/foundation/store";

export const Route = createFileRoute("/gates")({
  head: () => ({ meta: [{ title: "CHỈNAM — Nghiệm thu" }] }),
  component: GatesPage,
});

const stateLabel = {
  open: "Đang mở",
  shelf: "Mới là kệ",
  closed: "Đóng",
} as const;

function GatesPage() {
  const signoff = useDesk((s) => s.signoff);
  const toggle = useDesk((s) => s.toggleSignoff);
  const phase0 = phases[0];
  const signed = phase0 ? phase0.acceptance.filter((_, i) => signoff[`p0-${i}`]).length : 0;

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Cổng"
        title="Không phase nào mở vì tài liệu đã dài."
        lede="Phase 0 có thể được Owner đánh dấu đã đọc. Việc đánh dấu là chữ ký của người, không phải của hệ thống. Các phase sau vẫn đóng. Vốn thật không có cửa ở phiên bản này."
      />
      {phase0 ? (
        <p className="mt-4 text-sm tabular-nums text-muted">
          Owner đã đánh dấu {signed}/{phase0.acceptance.length} mục Phase 0. Hệ thống không tự ký.
        </p>
      ) : null}
      <div className="mt-8 space-y-8">
        {phases.map((phase) => (
          <article key={phase.id} className="border-t border-line pt-6">
            <div className="flex flex-wrap gap-2">
              <Stamp tone={phase.state === "closed" ? "muted" : phase.state === "open" ? "solid" : "accent"}>{stateLabel[phase.state]}</Stamp>
            </div>
            <h2 className="mt-3 font-serif text-2xl">{phase.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{phase.intent}</p>
            <ul className="mt-4 space-y-3">
              {phase.acceptance.map((item, i) => {
                const key = `${phase.id}-${i}`;
                const on = Boolean(signoff[key]);
                return (
                  <li key={key}>
                    <label className="flex items-start gap-3 text-sm leading-relaxed">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={on}
                        disabled={phase.state === "closed"}
                        onChange={() => toggle(key)}
                      />
                      <span className={phase.state === "closed" ? "text-muted" : ""}>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Điều kiện trước vốn thật vẫn là: ngoài mẫu, walk-forward, chi phí, thanh khoản, regime, đuôi, giấy, hiệu chỉnh, và phản biện độc lập. Một backtest đẹp không nằm trong danh sách đủ.
      </p>
    </div>
  );
}
