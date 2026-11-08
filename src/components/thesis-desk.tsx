import { useMemo, useState } from "react";
import { EvidenceStamp, Field, Note, Stamp, areaClass, inputClass } from "@/components/ui";
import { confidenceGaps, confidenceOf, expectedReturn, priorDecisions, scenarioSum, scenarioWarnings, thesisBlockers, thesisReadiness, independentSourceCount, claimIssues } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { Decision, EvidenceClass, ScenarioName, SourceTier, ThesisTexts } from "@/foundation/types";

const screens = [
  { id: "id", title: "Danh tính" },
  { id: "biz", title: "Kinh doanh" },
  { id: "fin", title: "Tài chính" },
  { id: "ctx", title: "Bối cảnh" },
  { id: "net", title: "Mạng" },
  { id: "exp", title: "Kỳ vọng" },
  { id: "ev", title: "Bằng chứng" },
  { id: "sc", title: "Kịch bản" },
  { id: "kill", title: "Hủy bỏ" },
  { id: "out", title: "Bản đọc" },
] as const;

const scenarioLabel: Record<ScenarioName, string> = {
  bull: "Tăng",
  base: "Cơ sở",
  bear: "Giảm",
  tail: "Đuôi",
};

const classes: EvidenceClass[] = ["fact", "data", "inference", "hypothesis", "forecast", "unverified", "insufficient"];
const className: Record<EvidenceClass, string> = {
  fact: "Sự thật",
  data: "Dữ liệu",
  inference: "Suy luận",
  hypothesis: "Giả thuyết",
  forecast: "Dự báo",
  unverified: "Chưa xác minh",
  insufficient: "Chưa đủ bằng chứng",
};

function num(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function ThesisDesk() {
  const theses = useDesk((s) => s.theses);
  const activeId = useDesk((s) => s.activeThesisId);
  const createThesis = useDesk((s) => s.createThesis);
  const setActive = useDesk((s) => s.setActive);
  const updateThesis = useDesk((s) => s.updateThesis);
  const patchText = useDesk((s) => s.patchText);
  const addClaim = useDesk((s) => s.addClaim);
  const updateClaim = useDesk((s) => s.updateClaim);
  const removeClaim = useDesk((s) => s.removeClaim);
  const addKill = useDesk((s) => s.addKill);
  const updateKill = useDesk((s) => s.updateKill);
  const removeKill = useDesk((s) => s.removeKill);
  const invalidateThesis = useDesk((s) => s.invalidateThesis);
  const createSuccessor = useDesk((s) => s.createSuccessor);
  const mandate = useDesk((s) => s.mandate);
  const world = useDesk((s) => s.world);
  const baseRates = useDesk((s) => s.baseRates);
  const companies = useDesk((s) => s.companies);
  const decisions = useDesk((s) => s.decisions);
  const [screen, setScreen] = useState<(typeof screens)[number]["id"]>("id");
  const [bookError, setBookError] = useState("");
  const [invalidationReason, setInvalidationReason] = useState("");
  const [invalidationError, setInvalidationError] = useState("");

  const openThesis = () => {
    const result = createThesis();
    if (!result.ok) setBookError(result.reason);
    else setBookError("");
  };

  const thesis = theses.find((t) => t.id === activeId) ?? theses[0] ?? null;
  const ctx = { mandate, world, baseRates, companies, decisions };

  const blockers = useMemo(() => (thesis ? thesisBlockers(thesis, ctx) : []), [thesis, mandate, world, baseRates, companies, decisions]);
  const readiness = thesis ? thesisReadiness(thesis, ctx) : "draft";
  const invalidated = readiness === "invalidated";
  const confidence = thesis ? confidenceOf(thesis, ctx) : null;
  const gaps = thesis ? confidenceGaps(thesis, ctx) : [];
  const ev = thesis ? expectedReturn(thesis.scenarios) : null;
  const sum = thesis ? scenarioSum(thesis.scenarios) : null;
  const warnings = thesis ? scenarioWarnings(thesis.scenarios) : [];

  if (!thesis) {
    return (
      <div className="mt-8 max-w-2xl">
        <Note>
          Chưa có hồ sơ. Quy trình này là một khung trống. Nó không điền tên công ty, không điền số, và không kết luận giúp Owner.
        </Note>
        <button type="button" className="mt-4 bg-accent px-4 py-3 text-sm text-ink" onClick={openThesis}>
          Mở một hồ sơ trống
        </button>
        {bookError ? <p className="mt-3 text-sm text-accent">{bookError}</p> : null}
      </div>
    );
  }

  const text = (key: keyof ThesisTexts, label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      <textarea className={areaClass} value={thesis.texts[key]} onChange={(e) => patchText(thesis.id, key, e.target.value)} />
    </Field>
  );

  return (
    <div className="mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <div className="min-w-0">
        <div className="flex gap-2 overflow-x-auto pb-3 lg:block lg:overflow-visible">
          {theses.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`shrink-0 border px-3 py-2 text-left text-sm lg:mb-2 lg:block lg:w-full ${t.id === thesis.id ? "border-accent text-fg" : "border-line text-muted"}`}
            >
              {t.security.trim() || "Chưa đặt tên"}
            </button>
          ))}
        </div>
        <button type="button" className="mt-2 border border-line px-3 py-2 text-sm text-fg" onClick={openThesis}>
          Hồ sơ mới
        </button>
        {bookError ? <p className="mt-2 text-sm text-accent">{bookError}</p> : null}
        <ol className="mt-6 hidden space-y-1 lg:block">
          {screens.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`w-full px-2 py-1.5 text-left text-sm ${screen === s.id ? "text-accent" : "text-muted"}`}
                onClick={() => setScreen(s.id)}
              >
                {i + 1}. {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-w-0 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Stamp tone={readiness === "ready" ? "solid" : readiness === "draft" ? "muted" : "accent"}>
            {readiness === "ready" ? "Sẵn sàng để Owner đọc" : readiness === "thin-ready" ? "Sẵn sàng mỏng" : invalidated ? "Đã hủy" : "Bản nháp"}
          </Stamp>
          <Stamp>{confidence?.level ?? "LOW"}</Stamp>
          <Stamp tone="accent">HIGH đang khóa</Stamp>
          <Stamp>Chưa hiệu chỉnh</Stamp>
        </div>
        {gaps.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 text-sm text-muted">
          {invalidated ? "Thesis đã hủy: bản này chỉ đọc, không được mở lại." : blockers.length === 0 ? "Đủ ô để đọc. Vẫn không phải lệnh." : `${blockers.length} việc còn chặn trạng thái sẵn sàng.`}
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
          {screens.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`shrink-0 border px-3 py-2 text-sm ${screen === s.id ? "border-accent text-fg" : "border-line text-muted"}`}
              onClick={() => setScreen(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>

        <fieldset disabled={invalidated} className="mt-6 min-w-0 space-y-5">
          {screen === "id" ? (
            <>
              <Note>
                {mandate.locked
                  ? `Ủy thác đã khóa: ${mandate.currency}, chân trời ${mandate.horizon}. Vành trong: ${mandate.universeInner}`
                  : "Ủy thác chưa khóa. Hồ sơ có thể nháp, nhưng không thể sẵn sàng."}
              </Note>
              <Field label="Vành">
                <select
                  className={inputClass}
                  value={thesis.ring ?? ""}
                  onChange={(e) => updateThesis(thesis.id, { ring: e.target.value as "" | "inner" | "outer" })}
                >
                  <option value="">Chưa chọn</option>
                  <option value="inner">Trong — được xét như ý định vốn, sau này</option>
                  <option value="outer">Ngoài — chỉ theo dõi cơ chế</option>
                </select>
              </Field>
              <Field label="Hồ sơ doanh nghiệp" hint="Hồ sơ luận điểm không sẵn sàng nếu doanh nghiệp chưa được nộp. CHƯA ĐỦ BẰNG CHỨNG là được. Bỏ trống thì không.">
                <select className={inputClass} value={thesis.companyId ?? ""} onChange={(e) => updateThesis(thesis.id, { companyId: e.target.value })}>
                  <option value="">Chưa gắn</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {(c.name.trim() || "Chưa đặt tên") + (c.status === "filed" ? " · đã đóng" : " · nháp")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Chứng khoán">
                <input className={inputClass} value={thesis.security} onChange={(e) => updateThesis(thesis.id, { security: e.target.value })} />
              </Field>
              <PriorCalls security={thesis.security} seen={thesis.priorSeenIds ?? []} decisions={decisions} onSeen={(ids) => updateThesis(thesis.id, { priorSeenIds: ids })} />
              <Field label="Sàn hoặc thị trường">
                <input className={inputClass} value={thesis.venue} onChange={(e) => updateThesis(thesis.id, { venue: e.target.value })} />
              </Field>
              <Field label="Tiền tệ của luận điểm">
                <input className={inputClass} value={thesis.currency} onChange={(e) => updateThesis(thesis.id, { currency: e.target.value })} />
              </Field>
              <Field label="Chân trời của riêng hồ sơ này" hint="Phải nằm trong chân trời ủy thác. Hệ thống không tự đối chiếu hộ.">
                <input className={inputClass} value={thesis.horizon} onChange={(e) => updateThesis(thesis.id, { horizon: e.target.value })} />
              </Field>
              <Field label="Base rate gắn vào hồ sơ">
                <select className={inputClass} value={thesis.baseRateId ?? ""} onChange={(e) => updateThesis(thesis.id, { baseRateId: e.target.value })}>
                  <option value="">Không gắn — khi đó phải xác nhận là chưa có base rate</option>
                  {baseRates.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset>
                <legend className="text-sm">Quan sát thế giới dùng trong hồ sơ</legend>
                {world.length === 0 ? <p className="mt-2 text-sm text-muted">Sổ thế giới đang trống.</p> : null}
                <ul className="mt-2 space-y-2">
                  {world.map((w) => {
                    const ids = thesis.worldIds ?? [];
                    const on = ids.includes(w.id);
                    return (
                      <li key={w.id}>
                        <label className="flex items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={on}
                            onChange={() =>
                              updateThesis(thesis.id, {
                                worldIds: on ? ids.filter((id) => id !== w.id) : [...ids, w.id],
                              })
                            }
                          />
                          <span>
                            {w.name} · {w.geography}
                            <span className="block text-xs text-muted">
                              mức {w.level || "—"} · đổi {w.delta || "—"} · gia tốc {w.acceleration || "—"}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          ) : null}

          {screen === "biz" ? (
            <>
              {text("business", "Mô hình kinh doanh", "Sản phẩm, khách hàng, giá, hào. Nếu chưa biết, ghi CHƯA ĐỦ BẰNG CHỨNG.")}
              {text("industry", "Ngành")}
              {text("position", "Vị thế cạnh tranh")}
              {text("management", "Ban lãnh đạo", "Năng lực, nhất quán, sở hữu, giao dịch nội bộ, đổi CFO hoặc kiểm toán.")}
            </>
          ) : null}

          {screen === "fin" ? (
            <>
              {text("financialQuality", "Chất lượng lợi nhuận", "Phải thu, tồn kho, dồn tích, vốn hóa, bên liên quan, pha loãng, ngoài bảng.")}
              {text("balanceSheet", "Bảng cân đối")}
              {text("cashFlow", "Dòng tiền")}
              {text("capitalAllocation", "Phân bổ vốn")}
            </>
          ) : null}

          {screen === "ctx" ? (
            <>
              {text("growth", "Động lực tăng trưởng")}
              {text("risks", "Rủi ro")}
              {text("macro", "Phơi nhiễm vĩ mô")}
            </>
          ) : null}

          {screen === "net" ? (
            <>
              <Note>Mọi đối tác không có nguồn là chưa xác minh. Đừng để một đoạn văn trôi chảy tạo ra một nhà cung cấp.</Note>
              {text("graph", "Đồ thị kinh tế")}
              {text("suppliers", "Tín hiệu nhà cung cấp")}
              {text("customers", "Tín hiệu khách hàng")}
              {text("weakSignals", "Tín hiệu yếu", "Chỉ ghi nếu có cơ chế tới lợi nhuận. Không có thì ghi chưa có.")}
            </>
          ) : null}

          {screen === "exp" ? (
            <>
              {text("marketBelieves", "Thị trường đang tin gì")}
              {text("difference", "Ta tin khác ở đâu", "Nếu không khác gì, hãy viết là không có khoảng kỳ vọng.")}
              {text("valuation", "Định giá", "Ghi các cách định giá đang mâu thuẫn. Ô này không tính một giá mục tiêu.")}
              {text("portfolioImpact", "Nếu luận điểm đúng, danh mục chịu gì", "Tương quan, tập trung, thanh khoản. Không điền tỷ trọng.")}
            </>
          ) : null}

          {screen === "ev" ? (
            <>
              <Note>Sự thật và dữ liệu cần nguồn, tầng 1 hoặc 2, ngày thị trường có thể biết, và xác nhận được phép dùng.</Note>
              {thesis.claims.map((c) => {
                const issues = claimIssues(c);
                return (
                  <div key={c.id} className="border border-line p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <EvidenceStamp k={c.klass} />
                      <button type="button" className="text-xs text-muted" onClick={() => removeClaim(thesis.id, c.id)}>
                        Bỏ claim
                      </button>
                    </div>
                    <textarea className={areaClass} value={c.text} onChange={(e) => updateClaim(thesis.id, c.id, { text: e.target.value })} />
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <select
                        className={inputClass}
                        value={c.klass}
                        onChange={(e) => updateClaim(thesis.id, c.id, { klass: e.target.value as EvidenceClass })}
                      >
                        {classes.map((k) => (
                          <option key={k} value={k}>
                            {className[k]}
                          </option>
                        ))}
                      </select>
                      <select
                        className={inputClass}
                        value={c.tier}
                        onChange={(e) => updateClaim(thesis.id, c.id, { tier: e.target.value as SourceTier })}
                      >
                        <option value="none">Chưa có tầng</option>
                        <option value="t1">Tầng 1</option>
                        <option value="t2">Tầng 2</option>
                        <option value="t3">Tầng 3</option>
                        <option value="t4">Tầng 4</option>
                        <option value="t5">Tầng 5</option>
                      </select>
                      <input className={inputClass} placeholder="Nguồn" value={c.source} onChange={(e) => updateClaim(thesis.id, c.id, { source: e.target.value })} />
                      <input className={inputClass} type="date" value={c.asOf} onChange={(e) => updateClaim(thesis.id, c.id, { asOf: e.target.value })} />
                      <input className={inputClass} placeholder="Đơn vị" value={c.unit} onChange={(e) => updateClaim(thesis.id, c.id, { unit: e.target.value })} />
                    </div>
                    <label className="mt-3 flex items-start gap-2 text-sm text-muted">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={c.permitted}
                        onChange={(e) => updateClaim(thesis.id, c.id, { permitted: e.target.checked })}
                      />
                      Nguồn được phép dùng và không phải thông tin nội gián, theo hiểu biết của Owner.
                    </label>
                    {issues.length > 0 ? <p className="mt-2 text-sm text-accent">{issues[0]}</p> : null}
                  </div>
                );
              })}
              <button type="button" className="border border-line px-4 py-3 text-sm" onClick={() => addClaim(thesis.id)}>
                Thêm claim
              </button>
            </>
          ) : null}

          {screen === "sc" ? (
            <>
              <Note>
                Lợi nhuận kỳ vọng = tổng xác suất nhân mức lời. Tổng phải bằng 100. Hệ thống không gợi ý các con số.
                {sum === null ? " Chưa đủ xác suất." : ` Tổng hiện tại ${sum}%.`}
                {ev === null ? "" : ` Kỳ vọng ${ev}%.`} Con số này chưa hiệu chỉnh.
              </Note>
              {warnings.map((w) => (
                <p key={w} className="text-sm text-accent">
                  {w}
                </p>
              ))}
              {thesis.scenarios.map((s) => (
                <fieldset key={s.name} className="border border-line p-4">
                  <legend className="px-2 font-serif text-lg">{scenarioLabel[s.name]}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Xác suất %">
                      <input
                        className={`${inputClass} tabular-nums`}
                        inputMode="decimal"
                        value={s.probability ?? ""}
                        onChange={(e) =>
                          updateThesis(thesis.id, {
                            scenarios: thesis.scenarios.map((x) => (x.name === s.name ? { ...x, probability: num(e.target.value) } : x)),
                          })
                        }
                      />
                    </Field>
                    <Field label="Lợi nhuận %">
                      <input
                        className={`${inputClass} tabular-nums`}
                        inputMode="decimal"
                        value={s.returnPct ?? ""}
                        onChange={(e) =>
                          updateThesis(thesis.id, {
                            scenarios: thesis.scenarios.map((x) => (x.name === s.name ? { ...x, returnPct: num(e.target.value) } : x)),
                          })
                        }
                      />
                    </Field>
                  </div>
                  <div className="mt-3 space-y-3">
                    {(
                      [
                        ["narrative", "Diễn giải"],
                        ["catalyst", "Chất xúc tác"],
                        ["revenue", "Doanh thu"],
                        ["margin", "Biên"],
                        ["multiple", "Hệ số"],
                        ["fairValue", "Giá trị trong kịch bản này"],
                        ["risk", "Rủi ro của kịch bản"],
                      ] as const
                    ).map(([key, label]) => (
                      <Field key={key} label={label}>
                        <textarea
                          className={areaClass}
                          value={s[key]}
                          onChange={(e) =>
                            updateThesis(thesis.id, {
                              scenarios: thesis.scenarios.map((x) => (x.name === s.name ? { ...x, [key]: e.target.value } : x)),
                            })
                          }
                        />
                      </Field>
                    ))}
                  </div>
                </fieldset>
              ))}
            </>
          ) : null}

          {screen === "kill" ? (
            <>
              {text("bear", "Luận điểm phe bán viết riêng", "Viết như thể nhiệm vụ là chứng minh luận điểm chính sai.")}
              {text("contrary", "Bằng chứng đang chống lại")}
              {text("missing", "Thông tin còn thiếu")}
              {text("invalidation", "Điều kiện hủy, bằng lời")}
              <div className="space-y-3">
                {thesis.kills.map((k, i) => (
                  <div key={k.id} className="grid gap-3 border border-line p-3 sm:grid-cols-2">
                    <Field label={`Tiêu chí hủy ${i + 1}`}>
                      <input className={inputClass} value={k.text} onChange={(e) => updateKill(thesis.id, k.id, { text: e.target.value })} />
                    </Field>
                    <Field label="Ngưỡng">
                      <input className={inputClass} value={k.threshold} onChange={(e) => updateKill(thesis.id, k.id, { threshold: e.target.value })} />
                    </Field>
                    {thesis.kills.length > 3 ? (
                      <button type="button" className="text-left text-xs text-muted" onClick={() => removeKill(thesis.id, k.id)}>
                        Bỏ tiêu chí này
                      </button>
                    ) : null}
                  </div>
                ))}
                <button type="button" className="border border-line px-4 py-3 text-sm" onClick={() => addKill(thesis.id)}>
                  Thêm tiêu chí
                </button>
              </div>
              <p className="text-sm text-muted">Nguồn độc lập hợp lệ (do mã đếm): {independentSourceCount(thesis)}. MEDIUM yêu cầu ít nhất 2 nguồn Sự thật/Dữ liệu tầng 1–2, có ngày và được phép dùng.</p>
              <Field label="Ghi chú tìm base rate (nếu chưa gắn dòng dùng được)" hint="Nêu đã tìm ở đâu và chưa thấy; tối thiểu 30 ký tự. Ô tích V1 không còn được tính.">
                <textarea className={areaClass} value={thesis.baseRateSearchNote ?? ""} onChange={(e) => updateThesis(thesis.id, { baseRateSearchNote: e.target.value })} />
              </Field>
              <p className="text-sm text-muted">Bằng chứng trái chiều và độ tin cậy được xét bằng nội dung và nguồn, không bằng ô tự xác nhận.</p>
              <Field label="Ghi chú vốn của Owner" hint="Hệ thống không điền ô này và không biến nó thành lệnh.">
                <textarea
                  className={areaClass}
                  value={thesis.ownerCapitalNote}
                  onChange={(e) => updateThesis(thesis.id, { ownerCapitalNote: e.target.value })}
                />
              </Field>

            </>
          ) : null}

          {screen === "out" ? (
            <article className="space-y-6">
              <Note>
                Bản đọc lắp từ các ô Owner đã viết. Ô ngắn hiện là chưa đủ bằng chứng. Không có câu nào ở đây được mô hình thêm vào.
                Lợi nhuận kỳ vọng {ev === null ? "chưa tính được" : `${ev}%`}. Độ tin cậy {confidence?.level}. HIGH không mở.
              </Note>
              {confidence?.reasons.map((r) => (
                <p key={r} className="text-sm text-muted">
                  {r}
                </p>
              ))}
              <Section title="Tóm tắt điều hành" body={`${thesis.security || "Chưa đặt tên"} · ${thesis.venue || "chưa có sàn"} · ${thesis.horizon || "chưa có chân trời"}`} />
              <Section title="Thị trường đang tin" body={thesis.texts.marketBelieves} />
              <Section title="Ta tin khác" body={thesis.texts.difference} />
              <div>
                <h2 className="font-serif text-xl">Bằng chứng</h2>
                {thesis.claims.length === 0 ? <p className="mt-2 text-sm text-muted">CHƯA ĐỦ BẰNG CHỨNG</p> : null}
                <ul className="mt-3 space-y-3">
                  {thesis.claims.map((c) => (
                    <li key={c.id} className="border-t border-line pt-3">
                      <EvidenceStamp k={c.klass} />
                      <p className="mt-2 text-sm leading-relaxed">{c.text || "Trống"}</p>
                      <p className="mt-1 text-xs text-muted">
                        {c.source || "chưa có nguồn"} · {c.tier} · {c.asOf || "chưa có ngày"} {c.unit ? `· ${c.unit}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <Section title="Chất lượng cơ bản" body={[thesis.texts.financialQuality, thesis.texts.balanceSheet, thesis.texts.cashFlow, thesis.texts.capitalAllocation].filter((x) => x.trim()).join("\n\n")} />
              <Section title="Định giá" body={thesis.texts.valuation} />
              <Section title="Bốn kịch bản" body={thesis.scenarios.map((s) => `${scenarioLabel[s.name]}: ${s.probability ?? "—"}% → ${s.returnPct ?? "—"}%. ${s.narrative}`).join("\n\n")} />
              <Section title="Phía dưới và phe bán" body={`${thesis.texts.bear}\n\n${thesis.texts.contrary}`} />
              <Section title="Điều kiện hủy" body={[thesis.texts.invalidation, ...thesis.kills.map((k) => `${k.text} — ngưỡng: ${k.threshold}`)].join("\n")} />
              <Section title="Còn thiếu" body={thesis.texts.missing} />
              <Section title="Ghi chú vốn của Owner" body={thesis.ownerCapitalNote || "Owner chưa ghi. Hệ thống không đề xuất tỷ trọng."} />
            </article>
          ) : null}
        </fieldset>

        {invalidated ? (
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm text-muted">Thesis này đã hủy và chỉ đọc. Mọi tu chính trước khi hủy vẫn được giữ.</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {(thesis.amendments ?? []).map((a) => <li key={a.id}>{new Date(a.at).toLocaleString("vi-VN")}: {a.note}</li>)}
            </ul>
            <button type="button" className="mt-4 border border-accent px-4 py-3 text-sm text-accent" onClick={() => {
              const result = createSuccessor(thesis.id);
              if (!result.ok) setBookError(result.reason);
              else { setBookError(""); setScreen("id"); setInvalidationReason(""); }
            }}>Tạo thesis kế tiếp</button>
            {bookError ? <p className="mt-2 text-sm text-accent">{bookError}</p> : null}
          </div>
        ) : screen === "kill" ? (
          <div className="mt-6 space-y-3 border-t border-line pt-4">
            <Field label="Lý do đánh dấu đã hủy (ít nhất 12 ký tự)">
              <textarea className={areaClass} value={invalidationReason} onChange={(e) => setInvalidationReason(e.target.value)} />
            </Field>
            <button type="button" className="border border-accent px-4 py-3 text-sm text-accent" onClick={() => {
              const result = invalidateThesis(thesis.id, invalidationReason);
              setInvalidationError(result.ok ? "" : result.reason);
              if (result.ok) setInvalidationReason("");
            }}>Đánh dấu đã hủy</button>
            {invalidationError ? <p className="text-sm text-accent">{invalidationError}</p> : null}
          </div>
        ) : null}

        {blockers.length > 0 && screen !== "out" && !invalidated ? (
          <div className="mt-8 border-t border-line pt-4">
            <h2 className="text-sm text-fg">Còn chặn</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {blockers.slice(0, 6).map((b) => (
                <li key={b}>{b}</li>
              ))}
              {blockers.length > 6 ? <li>Và {blockers.length - 6} mục nữa.</li> : null}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const callLabel: Record<Decision["action"], string> = {
  observe: "Chỉ quan sát",
  pass: "Bỏ qua",
  paper: "Ghi trên giấy",
  hold: "Giữ luận điểm",
  kill: "Hủy luận điểm",
};

const resultLabel: Record<Decision["outcome"], string> = {
  pending: "Chưa có kết quả",
  "": "Chưa có kết quả",
  "process-good-outcome-good": "Cách làm đủ, kết quả tốt — chưa chứng minh cách làm luôn đúng",
  "process-good-outcome-bad": "Cách làm đủ, kết quả xấu",
  "process-bad-outcome-good": "Cách làm thiếu, kết quả tốt — có thể là may",
  "process-bad-outcome-bad": "Cách làm thiếu, kết quả xấu",
};

function PriorCalls({
  security,
  seen,
  decisions,
  onSeen,
}: {
  security: string;
  seen: string[];
  decisions: Decision[];
  onSeen: (ids: string[]) => void;
}) {
  const prior = priorDecisions(security, decisions);
  if (security.trim().length < 2) return null;
  if (prior.length === 0) {
    return <p className="text-sm text-muted">Mã này chưa có quyết định cũ. Chưa có thắng hay thua để học.</p>;
  }
  const seenSet = new Set(seen);
  const unseen = prior.filter((d) => !seenSet.has(d.id));
  return (
    <div className="border border-line p-3">
      <p className="text-sm">Mã này đã có quyết định. Cuộc trò chuyện mới không được kể từ đầu.</p>
      <ul className="mt-3 space-y-2">
        {prior.map((d) => (
          <li key={d.id} className="border-t border-line pt-2 text-sm">
            <p>
              {new Date(d.at).toLocaleString("vi-VN")} · {callLabel[d.action]} · {resultLabel[d.outcome] ?? "Chưa có kết quả"}
            </p>
            <p className="text-muted">{d.invalidation.trim() || "Chưa ghi điều kiện hủy."}</p>
          </li>
        ))}
      </ul>
      {unseen.length > 0 ? (
        <button type="button" className="mt-3 border border-accent px-4 py-3 text-sm" onClick={() => onSeen(prior.map((d) => d.id))}>
          Tôi đã đọc các quyết định cũ của mã này
        </button>
      ) : (
        <p className="mt-3 text-sm text-muted">Đã đọc đủ các dòng hiện có. Có quyết định mới thì phải đọc lại.</p>
      )}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  const clean = body.trim();
  return (
    <section>
      <h2 className="font-serif text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted">{clean.length >= 12 ? clean : "CHƯA ĐỦ BẰNG CHỨNG"}</p>
    </section>
  );
}
