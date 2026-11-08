import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Note, PageHeader, Stamp, areaClass, inputClass } from "@/components/ui";
import { useDesk } from "@/foundation/store";

export const Route = createFileRoute("/mandate")({
  head: () => ({ meta: [{ title: "CHỈNAM — Ủy thác" }] }),
  component: MandatePage,
});

function MandatePage() {
  const mandate = useDesk((s) => s.mandate);
  const patch = useDesk((s) => s.patchMandate);
  const lock = useDesk((s) => s.lockMandate);
  const unlock = useDesk((s) => s.unlockMandate);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="P1 · dụng cụ của Owner"
        title="Không có ủy thác thì không có hồ sơ sẵn sàng."
        lede="Hệ thống không chọn vũ trụ hộ. Khóa xong thì các ô đóng. Muốn đổi phải mở khóa và ghi lý do. Đây chưa phải giấy phép dùng vốn thật."
      />
      <div className="mt-4">
        <Stamp tone={mandate.locked ? "solid" : "accent"}>{mandate.locked ? `Đã khóa ${mandate.lockedAt.slice(0, 10)}` : "Chưa khóa"}</Stamp>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = lock();
          setError(result.ok ? "" : result.reason);
        }}
      >
        <Field label="Tiền tệ tiêu dùng">
          <input className={inputClass} disabled={mandate.locked} value={mandate.currency} onChange={(e) => patch({ currency: e.target.value })} />
        </Field>
        <Field label="Chân trời mặc định" hint="Ví dụ: 3 đến 7 năm. Không phải ngày mai.">
          <input className={inputClass} disabled={mandate.locked} value={mandate.horizon} onChange={(e) => patch({ horizon: e.target.value })} />
        </Field>
        <Field label="Vành trong" hint="Những gì sau này được phép đưa vào nhật ký như ý định vốn.">
          <textarea className={areaClass} disabled={mandate.locked} value={mandate.universeInner} onChange={(e) => patch({ universeInner: e.target.value })} />
        </Field>
        <Field label="Vành ngoài" hint="Chỉ theo dõi cơ chế. Không phải ứng viên vốn.">
          <textarea className={areaClass} disabled={mandate.locked} value={mandate.universeOuter} onChange={(e) => patch({ universeOuter: e.target.value })} />
        </Field>
        <Field label="Đòn bẩy">
          <select
            className={inputClass}
            disabled={mandate.locked}
            value={mandate.leverage}
            onChange={(e) => patch({ leverage: e.target.value as "none" | "capped" })}
          >
            <option value="none">Không dùng</option>
            <option value="capped">Có trần — phải ghi trần</option>
          </select>
        </Field>
        <Field label="Trần đòn bẩy, thuế, thanh khoản">
          <textarea className={areaClass} disabled={mandate.locked} value={mandate.leverageNote} onChange={(e) => patch({ leverageNote: e.target.value })} />
        </Field>
        <Field label="Ghi chú thuế">
          <textarea className={areaClass} disabled={mandate.locked} value={mandate.taxNote} onChange={(e) => patch({ taxNote: e.target.value })} />
        </Field>
        <Field label="Nhu cầu thanh khoản">
          <textarea className={areaClass} disabled={mandate.locked} value={mandate.liquidityNote} onChange={(e) => patch({ liquidityNote: e.target.value })} />
        </Field>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        {!mandate.locked ? (
          <button type="submit" className="bg-accent px-4 py-3 text-sm text-ink">
            Khóa ủy thác
          </button>
        ) : null}
      </form>
      {mandate.locked ? (
        <div className="mt-6 space-y-3 border-t border-line pt-4">
          <Note>Mở khóa không xóa nội dung. Nó ghi một dòng rằng Owner đã đổi luật chơi.</Note>
          <Field label="Lý do mở khóa">
            <textarea className={areaClass} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <button
            type="button"
            className="border border-accent px-4 py-3 text-sm text-accent"
            onClick={() => {
              const result = unlock(reason);
              setError(result.ok ? "" : result.reason);
              if (result.ok) setReason("");
            }}
          >
            Mở khóa
          </button>
        </div>
      ) : null}
      {mandate.amendments.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {mandate.amendments.map((a) => (
            <li key={a.id}>
              {a.at.slice(0, 16).replace("T", " ")} — {a.note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
