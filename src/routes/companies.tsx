import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Note, PageHeader, Stamp, areaClass, inputClass } from "@/components/ui";
import { companyFileIssues, qualityItems } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { QualityId, QualityState, ReportingStandard, SourceTier } from "@/foundation/types";

export const Route = createFileRoute("/companies")({
  head: () => ({ meta: [{ title: "CHỈNAM — Doanh nghiệp" }] }),
  component: CompaniesPage,
});

const standards: { id: ReportingStandard; label: string }[] = [
  { id: "", label: "Chưa chọn" },
  { id: "VAS", label: "VAS" },
  { id: "IFRS", label: "IFRS" },
  { id: "US-GAAP", label: "US GAAP" },
  { id: "other", label: "Khác — phải ghi tên chuẩn" },
];

const states: { id: QualityState; label: string }[] = [
  { id: "open", label: "Để ngỏ" },
  { id: "clear", label: "Chưa thấy vấn đề — vẫn là suy luận" },
  { id: "question", label: "Câu hỏi mở" },
  { id: "flag", label: "Cờ đỏ — giả thuyết" },
];

const emptyFact = {
  text: "",
  source: "",
  tier: "t1" as SourceTier,
  asOf: "",
  unit: "",
  permitted: false,
};

function CompaniesPage() {
  const companies = useDesk((s) => s.companies);
  const createCompany = useDesk((s) => s.createCompany);
  const patchCompany = useDesk((s) => s.patchCompany);
  const addFact = useDesk((s) => s.addCompanyFact);
  const setQuality = useDesk((s) => s.setQuality);
  const fileCompany = useDesk((s) => s.fileCompany);
  const companySeals = useDesk((s) => s.companySeals);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fact, setFact] = useState(emptyFact);
  const [error, setError] = useState("");
  const file = companies.find((c) => c.id === activeId) ?? companies[0] ?? null;
  const issues = file ? companyFileIssues(file) : [];

  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Phase 2 · hồ sơ do Owner nộp"
        title="Không có báo cáo nào được điền hộ."
        lede="Một hồ sơ doanh nghiệp giữ danh tính, chuẩn kế toán, sự kiện có nguồn, và chín chiều chất lượng lợi nhuận. Cờ đỏ là giả thuyết. Nó không phải kết luận gian lận, và nó không phải lệnh."
      />
      <div className="mt-4">
        <Note>Nộp xong, bản đó được đóng và không sửa được. Bạn gõ tiếp thì đang viết bản nháp mới. Bản đã đóng vẫn còn, để nhật ký sau này không bị viết lại. VAS, IFRS và US GAAP không được ghi như cùng một ngôn ngữ.</Note>
      </div>
      <button
        type="button"
        className="mt-4 bg-accent px-4 py-3 text-sm text-ink"
        onClick={() => {
          const result = createCompany();
          if (!result.ok) setError(result.reason);
          else {
            setError("");
            setActiveId(result.id);
          }
        }}
      >
        Mở hồ sơ trống
      </button>
      {error && companies.length === 0 ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      {companies.length === 0 ? <p className="mt-6 text-sm text-muted">Chưa có doanh nghiệp. Không có mẫu nào được cài sẵn.</p> : null}

      {companies.length > 0 ? (
        <ul className="mt-6 flex gap-2 overflow-x-auto">
          {companies.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`shrink-0 border px-3 py-2 text-sm ${(file?.id ?? "") === c.id ? "border-accent text-fg" : "border-line text-muted"}`}
                onClick={() => setActiveId(c.id)}
              >
                {c.name.trim() || "Chưa đặt tên"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {file ? (
        <div className="mt-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            <Stamp tone={file.status === "filed" ? "solid" : "muted"}>{file.status === "filed" ? "Đã đóng" : "Nháp"}</Stamp>
            <Stamp>{file.standard || "Chưa chọn chuẩn"}</Stamp>
          </div>
          <Field label="Tên doanh nghiệp">
            <input className={inputClass} value={file.name} onChange={(e) => patchCompany(file.id, { name: e.target.value })} />
          </Field>
          <Field label="Sàn hoặc nơi báo cáo">
            <input className={inputClass} value={file.venue} onChange={(e) => patchCompany(file.id, { venue: e.target.value })} />
          </Field>
          <Field label="Chuẩn báo cáo">
            <select
              className={inputClass}
              value={file.standard}
              onChange={(e) => patchCompany(file.id, { standard: e.target.value as ReportingStandard })}
            >
              {standards.map((s) => (
                <option key={s.id || "none"} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Chuẩn này không so được với cái gì" hint="Bắt buộc. Một câu ‘báo cáo tài chính’ là không đủ.">
            <textarea className={areaClass} value={file.standardNote} onChange={(e) => patchCompany(file.id, { standardNote: e.target.value })} />
          </Field>
          <Field label="Bán gì, cho ai">
            <textarea className={areaClass} value={file.business} onChange={(e) => patchCompany(file.id, { business: e.target.value })} />
          </Field>
          <Field label="Nếu chưa đủ bằng chứng" hint="Ghi đúng cụm CHƯA ĐỦ BẰNG CHỨNG khi chưa có số. Cụm này không thay một số bịa.">
            <textarea className={areaClass} value={file.missingNote} onChange={(e) => patchCompany(file.id, { missingNote: e.target.value })} />
          </Field>

          <section>
            <h2 className="font-serif text-2xl">Sự kiện có nguồn</h2>
            <p className="mt-2 text-sm text-muted">Chỉ tầng 1 hoặc 2, có ngày, và được phép dùng. Không xóa. Muốn sửa thì thêm một sự kiện mới.</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const result = addFact(file.id, fact);
                setError(result.ok ? "" : result.reason);
                if (result.ok) setFact(emptyFact);
              }}
            >
              <Field label="Sự kiện">
                <input className={inputClass} value={fact.text} onChange={(e) => setFact({ ...fact, text: e.target.value })} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nguồn">
                  <input className={inputClass} value={fact.source} onChange={(e) => setFact({ ...fact, source: e.target.value })} />
                </Field>
                <Field label="Đơn vị">
                  <input className={inputClass} value={fact.unit} onChange={(e) => setFact({ ...fact, unit: e.target.value })} />
                </Field>
                <Field label="Ngày biết">
                  <input className={inputClass} type="date" value={fact.asOf} onChange={(e) => setFact({ ...fact, asOf: e.target.value })} />
                </Field>
                <Field label="Tầng">
                  <select className={inputClass} value={fact.tier} onChange={(e) => setFact({ ...fact, tier: e.target.value as SourceTier })}>
                    <option value="t1">Tầng 1</option>
                    <option value="t2">Tầng 2</option>
                    <option value="t3">Tầng 3 — sẽ bị từ chối</option>
                  </select>
                </Field>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={fact.permitted} onChange={(e) => setFact({ ...fact, permitted: e.target.checked })} />
                <span>Nguồn được phép dùng và không phải thông tin nội gián.</span>
              </label>
              <button type="submit" className="border border-accent px-4 py-3 text-sm text-fg">
                Thêm sự kiện
              </button>
            </form>
            {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
            <ul className="mt-4 space-y-3">
              {file.facts.map((item) => (
                <li key={item.id} className="border-t border-line pt-3 text-sm">
                  <p>{item.text}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.source} · {item.tier} · {item.asOf} · {item.unit || "không ghi đơn vị"}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl">Chất lượng lợi nhuận</h2>
            <p className="mt-2 text-sm text-muted">Để ngỏ nghĩa là chưa xét. Chưa thấy vấn đề vẫn là suy luận, không phải sự thật rằng sổ sách sạch.</p>
            <div className="mt-4 space-y-6">
              {qualityItems.map((q) => {
                const row = file.quality[q.id];
                const hot = /gian lận|fraud|thao túng/i.test(row.note);
                return (
                  <article key={q.id} className="border-t border-line pt-4">
                    <h3 className="text-sm">{q.label}</h3>
                    <p className="mt-1 text-xs text-muted">{q.ask}</p>
                    <div className="mt-3">
                      <select
                        className={inputClass}
                        value={row.state}
                        onChange={(e) => setQuality(file.id, q.id as QualityId, { state: e.target.value as QualityState })}
                      >
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className={`${areaClass} mt-3`}
                      value={row.note}
                      placeholder="Ghi cái đã thấy, không ghi kết luận vượt nguồn."
                      onChange={(e) => setQuality(file.id, q.id, { note: e.target.value })}
                    />
                    {row.state === "clear" ? (
                      <input
                        className={`${inputClass} mt-3`}
                        value={row.source}
                        placeholder="Nguồn của nhận định chưa thấy vấn đề"
                        onChange={(e) => setQuality(file.id, q.id, { source: e.target.value })}
                      />
                    ) : null}
                    {hot ? (
                      <p className="mt-2 text-xs text-accent">Chữ này vẫn là giả thuyết. Hệ thống không kết luận gian lận.</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Nộp hồ sơ</h2>
            {file.status === "filed" ? (
              <p className="mt-2 text-sm text-muted">Bản đang mở đã đóng. Muốn cập nhật, hãy sửa một chỗ. Hồ sơ sẽ thành nháp, rồi bạn nộp một bản mới. Bản cũ không mất.</p>
            ) : issues.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Đủ cửa để nộp. Nộp là đóng một bản. Không phải định giá và không phải quyết định vốn.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {issues.map((item) => (
                  <li key={item} className="border-t border-line py-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="mt-4 bg-accent px-4 py-3 text-sm text-ink"
              onClick={() => {
                const result = fileCompany(file.id);
                setError(result.ok ? "" : result.reason);
              }}
            >
              {file.status === "filed" ? "Bản này đã đóng" : "Nộp và đóng bản này"}
            </button>
            {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
            {companySeals.filter((s) => s.companyId === file.id).length > 0 ? (
              <div className="mt-6">
                <h3 className="text-sm">Các bản đã đóng</h3>
                <ul className="mt-2 space-y-2">
                  {companySeals
                    .filter((s) => s.companyId === file.id)
                    .map((s) => (
                      <li key={s.id} className="border border-line px-3 py-2 text-sm">
                        <p>
                          {s.name || "Chưa đặt tên"} · {new Date(s.filedAt).toLocaleString("vi-VN")} · {s.facts.length} sự kiện
                        </p>
                        <p className="mt-1 text-muted">{s.business}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
