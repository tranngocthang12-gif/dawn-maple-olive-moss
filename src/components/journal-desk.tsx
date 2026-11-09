import { useState } from "react";
import { Note, Stamp, Field, areaClass, inputClass } from "@/components/ui";
import { expectedReturn, processScore, thesisReadiness } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { DecisionAction, PostMortemClass } from "@/foundation/types";

const actions: { id: DecisionAction; label: string }[] = [
  { id: "observe", label: "Chỉ quan sát" },
  { id: "pass", label: "Bỏ qua" },
  { id: "paper", label: "Ghi ý định giấy — không phải lệnh" },
  { id: "hold", label: "Giữ luận điểm đã có" },
  { id: "kill", label: "Hủy luận điểm" },
];

const causes: { id: PostMortemClass; label: string }[] = [
  { id: "", label: "Chưa phân loại" },
  { id: "bad-data", label: "Dữ liệu xấu" },
  { id: "bad-model", label: "Mô hình xấu" },
  { id: "bad-assumptions", label: "Giả định xấu" },
  { id: "bad-execution", label: "Thực thi xấu" },
  { id: "bad-sizing", label: "Kích thước xấu" },
  { id: "bad-luck", label: "May rủi" },
  { id: "mixed", label: "Trộn nhiều cửa" },
];

const empty = {
  security: "",
  priceNote: "",
  action: "observe" as DecisionAction,
  thesisId: "",
  expectedReturn: "",
  probabilityNote: "",
  risk: "",
  sizeNote: "",
  catalyst: "",
  invalidation: "",
  alternativeView: "",
  override: false,
  overrideReason: "",
};

export function JournalDesk() {
  const theses = useDesk((s) => s.theses);
  const decisions = useDesk((s) => s.decisions);
  const mandate = useDesk((s) => s.mandate);
  const world = useDesk((s) => s.world);
  const baseRates = useDesk((s) => s.baseRates);
  const companies = useDesk((s) => s.companies);
  const ctx = { mandate, world, baseRates, companies, decisions };
  const addDecision = useDesk((s) => s.addDecision);
  const patchOutcome = useDesk((s) => s.patchOutcome);
  const amend = useDesk((s) => s.amend);
  const voidDecision = useDesk((s) => s.voidDecision);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [voids, setVoids] = useState<Record<string, string>>({});
  const [voidFor, setVoidFor] = useState<string | null>(null);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function chooseThesis(id: string) {
    const t = theses.find((x) => x.id === id);
    const ev = t ? expectedReturn(t.scenarios) : null;
    setForm((f) => ({
      ...f,
      thesisId: id,
      security: t?.security || f.security,
      expectedReturn: ev === null ? f.expectedReturn : String(ev),
      invalidation: t?.texts.invalidation || f.invalidation,
    }));
  }

  return (
    <div className="mt-8 max-w-3xl space-y-6">
      <Note>
        Nhật ký lưu trên trình duyệt này. Quyết định đã ghi không sửa lõi và không xóa. Muốn đính chính thì thêm tu chính. Ý định giấy không đi ra thị trường.
      </Note>
      <button type="button" className="bg-accent px-4 py-3 text-sm text-ink" onClick={() => setOpen((v) => !v)}>
        {open ? "Đóng biểu mẫu" : "Ghi một quyết định"}
      </button>
      {open ? (
        <form
          className="space-y-4 border border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const result = addDecision({
              ...form,
              thesisId: form.thesisId || null,
            });
            if (!result.ok) {
              setError(result.reason);
              return;
            }
            setError("");
            setForm(empty);
            setOpen(false);
          }}
        >
          <Field label="Gắn thesis">
            <select className={inputClass} value={form.thesisId} onChange={(e) => chooseThesis(e.target.value)}>
              <option value="">Không gắn</option>
              {theses.map((t) => (
                <option key={t.id} value={t.id}>
                  {(t.security || "Chưa đặt tên") + ({
                    ready: " · sẵn sàng", "thin-ready": " · sẵn sàng mỏng", draft: " · nháp",
                    invalidated: " · đã hủy",
                  }[thesisReadiness(t, ctx)])}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hành động">
            <select className={inputClass} value={form.action} onChange={(e) => set("action", e.target.value as DecisionAction)}>
              {actions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tên" hint="Bản chụp sẽ giữ tên này.">
            <input className={inputClass} value={form.security} onChange={(e) => set("security", e.target.value)} />
          </Field>
          <Field label="Giá và thời điểm" hint="Tự ghi. Hệ thống không lấy giá. Nếu chưa có, viết là chưa có giá.">
            <input className={inputClass} value={form.priceNote} onChange={(e) => set("priceNote", e.target.value)} />
          </Field>
          <Field label="Lợi nhuận kỳ vọng" hint="Một số không nguồn là chưa đủ. Ghi đơn vị và nói nó đến từ kịch bản nào.">
            <input className={inputClass} value={form.expectedReturn} onChange={(e) => set("expectedReturn", e.target.value)} />
          </Field>
          <Field label="Xác suất">
            <textarea className={areaClass} value={form.probabilityNote} onChange={(e) => set("probabilityNote", e.target.value)} />
          </Field>
          <Field label="Rủi ro">
            <textarea className={areaClass} value={form.risk} onChange={(e) => set("risk", e.target.value)} />
          </Field>
          <Field label="Kích thước" hint="Đây là ghi chú của Owner. Không trở thành lệnh.">
            <textarea className={areaClass} value={form.sizeNote} onChange={(e) => set("sizeNote", e.target.value)} />
          </Field>
          <Field label="Chất xúc tác">
            <textarea className={areaClass} value={form.catalyst} onChange={(e) => set("catalyst", e.target.value)} />
          </Field>
          <Field label="Điều kiện hủy">
            <textarea className={areaClass} value={form.invalidation} onChange={(e) => set("invalidation", e.target.value)} />
          </Field>
          <Field label="Quan điểm đối lập">
            <textarea className={areaClass} value={form.alternativeView} onChange={(e) => set("alternativeView", e.target.value)} />
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={form.override} onChange={(e) => set("override", e.target.checked)} />
            Ghi đè cổng sẵn sàng. Cần lý do. Việc ghi đè được lưu cùng quyết định.
          </label>
          {form.override ? (
            <Field label="Lý do ghi đè">
              <textarea className={areaClass} value={form.overrideReason} onChange={(e) => set("overrideReason", e.target.value)} />
            </Field>
          ) : null}
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button type="submit" className="bg-accent px-4 py-3 text-sm text-ink">
            Khóa bản chụp
          </button>
        </form>
      ) : null}

      {decisions.length === 0 ? <p className="text-sm text-muted">Chưa có quyết định. Đó là trạng thái đúng của Phase 0.</p> : null}

      <ul className="space-y-4">
        {decisions.map((d) => {
          const score = processScore(d);
          return (
            <li key={d.id} className={`border border-line p-4 ${d.voided ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl">{d.security || "Không tên"}</h2>
                <Stamp>{actions.find((a) => a.id === d.action)?.label ?? d.action}</Stamp>
                {d.override ? <Stamp tone="accent">Ghi đè</Stamp> : null}
                {d.voided ? <Stamp tone="accent">Đã void</Stamp> : null}
                {d.snapshotHashOrigin === "legacy-backfill" ? <Stamp tone="accent">Băm sau, từ bản cũ</Stamp> : null}
                <Stamp>Quy trình {score.score}</Stamp>
              </div>
              <p className="mt-1 text-xs text-muted">{new Date(d.at).toLocaleString("vi-VN")} · điểm quy trình không phải xác suất đúng</p>
              <dl className="mt-4 space-y-2 text-sm">
                <Row k="Giá" v={d.priceNote} />
                <Row k="Kỳ vọng" v={d.expectedReturn} />
                <Row k="Xác suất" v={d.probabilityNote} />
                <Row k="Rủi ro" v={d.risk} />
                <Row k="Kích thước" v={d.sizeNote} />
                <Row k="Xúc tác" v={d.catalyst} />
                <Row k="Hủy" v={d.invalidation} />
                <Row k="Đối lập" v={d.alternativeView} />
                {d.override ? <Row k="Lý do ghi đè" v={d.overrideReason} /> : null}
                {d.voided ? <Row k="Lý do void" v={d.voidReason} /> : null}
              </dl>
              <p className="mt-3 text-xs text-muted">{d.thesisSnapshot ? "Có bản chụp luận điểm tại lúc ghi. Sửa luận điểm sau này không viết lại bản này." : "Không có bản chụp luận điểm."}</p>
              {d.companySeal ? (
                <details className="mt-3 border-t border-line pt-3">
                  <summary className="cursor-pointer text-sm">
                    {d.companySeal.sealed
                      ? `Hồ sơ doanh nghiệp đã đóng ngày ${new Date(d.companySeal.filedAt).toLocaleString("vi-VN")}: ${d.companySeal.name || "Chưa đặt tên"}`
                      : `Lúc ghi, hồ sơ doanh nghiệp còn là nháp: ${d.companySeal.name || "Chưa đặt tên"}`}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed">{d.companySeal.business}</p>
                  <p className="mt-1 text-xs text-muted">{d.companySeal.facts.length} sự kiện trong bản này. Sửa hồ sơ sau không đổi đoạn chữ này.</p>
                </details>
              ) : (
                <p className="mt-3 text-xs text-muted">Quyết định này không gắn bản hồ sơ doanh nghiệp.</p>
              )}
              <ul className="mt-3 space-y-1">
                {score.parts.map((p) => (
                  <li key={p.label} className="text-xs text-muted">
                    {p.got ? "Đủ" : "Thiếu"} — {p.label}
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Kết cục, khi đã biết">
                  <select
                    className={inputClass}
                    value={d.outcome}
                    onChange={(e) => patchOutcome(d.id, { outcome: e.target.value as typeof d.outcome, postMortemClass: d.postMortemClass, postMortemNote: d.postMortemNote })}
                  >
                    <option value="pending">Chưa phân giải</option>
                    <option value="process-good-outcome-good">Quy trình đủ, kết quả tốt</option>
                    <option value="process-good-outcome-bad">Quy trình đủ, kết quả xấu</option>
                    <option value="process-bad-outcome-good">Quy trình thiếu, kết quả tốt</option>
                    <option value="process-bad-outcome-bad">Quy trình thiếu, kết quả xấu</option>
                  </select>
                </Field>
                <Field label="Cửa sai của hệ thống">
                  <select
                    className={inputClass}
                    value={d.postMortemClass}
                    onChange={(e) => patchOutcome(d.id, { outcome: d.outcome, postMortemClass: e.target.value as PostMortemClass, postMortemNote: d.postMortemNote })}
                  >
                    {causes.map((c) => (
                      <option key={c.id || "none"} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Ghi chú mổ">
                <textarea
                  className={areaClass}
                  value={d.postMortemNote}
                  onChange={(e) => patchOutcome(d.id, { outcome: d.outcome, postMortemClass: d.postMortemClass, postMortemNote: e.target.value })}
                />
              </Field>
              <details className="mt-3 border-t border-line pt-3">
                <summary className="cursor-pointer text-sm">Lịch sử kết quả và hậu kiểm ({d.outcomeLog?.length ?? 0} dòng)</summary>
                <ol className="mt-2 space-y-2 text-xs text-muted">
                  {(d.outcomeLog ?? []).map((entry, index) => (
                    <li key={index} className="border-l border-line pl-3">
                      <time>{new Date(entry.at).toLocaleString("vi-VN")}</time>
                      <div>Kết quả: {entry.outcome || "Chưa có"} · Cửa sai: {entry.postMortemClass || "Chưa phân loại"}</div>
                      <p className="whitespace-pre-wrap">{entry.postMortemNote || "Chưa ghi chú"}</p>
                      {entry.legacyNote ? <span>({entry.legacyNote})</span> : null}
                    </li>
                  ))}
                </ol>
              </details>
              {d.amendments.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {d.amendments.map((a) => (
                    <li key={a.id} className="text-sm text-muted">
                      Tu chính {new Date(a.at).toLocaleString("vi-VN")}: {a.note}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputClass}
                  placeholder="Tu chính, không sửa bản gốc"
                  value={notes[d.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [d.id]: e.target.value }))}
                />
                <button
                  type="button"
                  className="shrink-0 border border-line px-3 py-2 text-sm"
                  onClick={() => {
                    amend(d.id, notes[d.id] ?? "");
                    setNotes((n) => ({ ...n, [d.id]: "" }));
                  }}
                >
                  Thêm tu chính
                </button>
              </div>
              {!d.voided ? (
                voidFor === d.id ? (
                  <div className="mt-3 space-y-2">
                    <input
                      className={inputClass}
                      placeholder="Lý do void. Dòng quyết định vẫn còn."
                      value={voids[d.id] ?? ""}
                      onChange={(e) => setVoids((n) => ({ ...n, [d.id]: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="border border-accent px-3 py-2 text-sm text-accent"
                      onClick={() => {
                        voidDecision(d.id, voids[d.id] ?? "");
                        setVoidFor(null);
                      }}
                    >
                      Khóa void
                    </button>
                  </div>
                ) : (
                  <button type="button" className="mt-3 text-sm text-accent" onClick={() => setVoidFor(d.id)}>
                    Void quyết định này
                  </button>
                )
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="whitespace-pre-wrap">{v || "—"}</dd>
    </div>
  );
}
