import { useState } from "react";
import { Field, Note, Stamp, inputClass } from "@/components/ui";
import { bayesPosterior, kellyReference, monteCarlo, type McResult } from "@/foundation/logic";
import { useDesk } from "@/foundation/store";
import type { EvidenceClass } from "@/foundation/types";

export function ProbabilityBench() {
  const ledger = useDesk((s) => s.ledger);
  const addLedger = useDesk((s) => s.addLedger);
  const [statement, setStatement] = useState("");
  const [prior, setPrior] = useState("");
  const [lr, setLr] = useState("");
  const [note, setNote] = useState("");
  const [klass, setKlass] = useState<EvidenceClass>("hypothesis");
  const [corrects, setCorrects] = useState("");
  const [message, setMessage] = useState("");

  const [win, setWin] = useState("55");
  const [b, setB] = useState("1");
  const [base, setBase] = useState("50");
  const [uncertainty, setUncertainty] = useState(0.5);

  const [eps, setEps] = useState("1");
  const [years, setYears] = useState("5");
  const [gMean, setGMean] = useState("8");
  const [gSd, setGSd] = useState("4");
  const [mMean, setMMean] = useState("12");
  const [mSd, setMSd] = useState("2");
  const [mBase, setMBase] = useState("12");
  const [peMean, setPeMean] = useState("12");
  const [peSd, setPeSd] = useState("3");
  const [price, setPrice] = useState("15");
  const [seed, setSeed] = useState("7");
  const [mc, setMc] = useState<McResult | null>(null);
  const [mcError, setMcError] = useState("");

  const priorN = Number(prior);
  const lrN = lr.trim() === "" ? null : Number(lr);
  const preview = lrN !== null && Number.isFinite(lrN) ? bayesPosterior(priorN, lrN) : null;
  const kelly = kellyReference(Number(win), Number(b), uncertainty, Number(base));

  function saveLedger() {
    if (statement.trim().length < 8) {
      setMessage("Mệnh đề quá ngắn.");
      return;
    }
    if (!Number.isFinite(priorN) || priorN <= 0 || priorN >= 100) {
      setMessage("Tiên nghiệm phải nằm trong khoảng mở (0, 100). 0 và 100 không cập nhật được.");
      return;
    }
    if (lr.trim() !== "" && (!Number.isFinite(lrN) || (lrN ?? 0) <= 0)) {
      setMessage("Tỷ số hợp lý nếu có thì phải dương. Bỏ trống nếu chưa biết.");
      return;
    }
    const posterior = lrN === null ? null : bayesPosterior(priorN, lrN);
    if (lr.trim() !== "" && posterior === null) {
      setMessage("Không tính được hậu nghiệm từ cặp số này.");
      return;
    }
    const saved = addLedger({
      statement: statement.trim(),
      priorPct: priorN,
      lr: lr.trim() === "" ? null : lrN,
      posteriorPct: posterior,
      evidenceNote: note.trim(),
      klass,
      corrects: corrects.trim(),
    });
    if (!saved.ok) {
      setMessage(saved.reason);
      return;
    }
    setStatement("");
    setNote("");
    setCorrects("");
    setMessage(posterior === null ? "Đã ghi. Không có hậu nghiệm vì tỷ số hợp lý chưa biết." : "Đã ghi một dòng không sửa được.");
  }

  const maxBin = mc ? Math.max(...mc.bins.map((bin) => bin.count), 1) : 1;

  return (
    <div className="mt-8 space-y-10">
      <section className="max-w-3xl space-y-4">
        <h2 className="font-serif text-2xl">Sổ cái</h2>
        <Note>
          Hậu nghiệm chỉ xuất hiện khi có tỷ số hợp lý. Nếu chưa biết, dòng vẫn ghi được và hậu nghiệm để trống. Dòng không sửa, không xóa. Đính chính bằng một dòng mới trỏ tới dòng cũ. Mọi số ở đây chưa hiệu chỉnh.
        </Note>
        <Field label="Mệnh đề">
          <input className={inputClass} value={statement} onChange={(e) => setStatement(e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tiên nghiệm %">
            <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={prior} onChange={(e) => setPrior(e.target.value)} />
          </Field>
          <Field label="Tỷ số hợp lý" hint="Bỏ trống nếu chưa biết. Đừng bịa cho có số.">
            <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={lr} onChange={(e) => setLr(e.target.value)} />
          </Field>
        </div>
        <p className="text-sm tabular-nums text-muted">
          {lr.trim() === "" ? "Hậu nghiệm: không cập nhật." : preview === null ? "Hậu nghiệm: không tính được." : `Hậu nghiệm có điều kiện: ${preview}%.`}
        </p>
        <Field label="Bằng chứng, loại và nguồn">
          <textarea className={`${inputClass} min-h-24`} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Loại bằng chứng">
            <select className={inputClass} value={klass} onChange={(e) => setKlass(e.target.value as EvidenceClass)}>
              <option value="fact">Sự thật</option>
              <option value="data">Dữ liệu</option>
              <option value="inference">Suy luận</option>
              <option value="hypothesis">Giả thuyết</option>
              <option value="forecast">Dự báo</option>
              <option value="unverified">Chưa xác minh</option>
              <option value="insufficient">Chưa đủ bằng chứng</option>
            </select>
          </Field>
          <Field label="Đính chính dòng" hint="Dán mã dòng cũ nếu đây là sửa sai. Không xóa dòng cũ.">
            <input className={inputClass} value={corrects} onChange={(e) => setCorrects(e.target.value)} />
          </Field>
        </div>
        {message ? <p className="text-sm text-accent">{message}</p> : null}
        <button type="button" className="bg-accent px-4 py-3 text-sm text-ink" onClick={saveLedger}>
          Ghi vào sổ
        </button>
        <ul className="space-y-3">
          {ledger.length === 0 ? <li className="text-sm text-muted">Sổ trống. Chưa có dự báo nào để hiệu chỉnh.</li> : null}
          {ledger.map((row) => (
            <li key={row.id} className="border border-line p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Stamp>{row.klass}</Stamp>
                <Stamp tone="accent">Chưa hiệu chỉnh</Stamp>
              </div>
              <p className="mt-2 text-sm">{row.statement}</p>
              <p className="mt-2 text-sm tabular-nums text-muted">
                Tiên nghiệm {row.priorPct}% · LR {row.lr === null ? "chưa biết" : row.lr} · Hậu nghiệm {row.posteriorPct === null ? "không cập nhật" : `${row.posteriorPct}%`}
              </p>
              {row.evidenceNote ? <p className="mt-1 text-xs text-muted">{row.evidenceNote}</p> : null}
              <p className="mt-1 text-xs text-muted">
                {row.id} · {new Date(row.at).toLocaleString("vi-VN")}
                {row.corrects ? ` · đính chính ${row.corrects}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-3xl space-y-4 border-t border-line pt-8">
        <h2 className="font-serif text-2xl">Kelly chỉ để nhìn, không để đặt</h2>
        <Note>
          Full Kelly bị cấm dùng như lệnh. Số được đưa lên trước là một phần tư Kelly sau khi kéo xác suất về base rate theo mức bất định. Nó vẫn không phải tỷ trọng. Module kích thước chưa xây.
        </Note>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="p thắng %">
            <input className={`${inputClass} tabular-nums`} value={win} onChange={(e) => setWin(e.target.value)} />
          </Field>
          <Field label="b, lời ròng trên 1 đơn vị rủi ro">
            <input className={`${inputClass} tabular-nums`} value={b} onChange={(e) => setB(e.target.value)} />
          </Field>
          <Field label="Base rate %">
            <input className={`${inputClass} tabular-nums`} value={base} onChange={(e) => setBase(e.target.value)} />
          </Field>
        </div>
        <Field label={`Mức bất định về chính p: ${uncertainty.toFixed(2)}`}>
          <input className="w-full accent-accent" type="range" min={0} max={1} step={0.05} value={uncertainty} onChange={(e) => setUncertainty(Number(e.target.value))} />
        </Field>
        {kelly.ok ? (
          <div className="border border-line p-4">
            <p className="text-sm text-muted line-through">Full Kelly {kelly.full}% — không dùng</p>
            <p className="mt-1 text-sm text-muted">Half {kelly.half}% · Quarter trước haircut {kelly.quarter}%</p>
            <p className="mt-3 font-serif text-2xl tabular-nums">
              {kelly.negative ? "Trần tham chiếu không dương. Không đặt." : `Trần tham chiếu ${kelly.adjustedQuarter}%`}
            </p>
            <p className="mt-2 text-sm text-accent">Không phải lệnh. Không phải tỷ trọng. Owner tự quyết, hệ thống không triển khai.</p>
          </div>
        ) : (
          <p className="text-sm text-muted">{kelly.reason}</p>
        )}
      </section>

      <section className="max-w-3xl space-y-4 border-t border-line pt-8">
        <h2 className="font-serif text-2xl">Minh họa Monte Carlo có điều kiện</h2>
        <Note>
          Đây không phải module M12. Công thức đồ chơi: lợi nhuận tương lai bằng lợi nhuận hôm nay nhân tăng trưởng, nhân tỷ lệ biên, rồi nhân hệ số cuối. Ba cú kéo là độc lập nên đuôi bị làm mỏng. Kết quả có điều kiện trên các ô bên dưới, không phải xác suất thị trường, không phải giá mục tiêu.
        </Note>
        <div className="grid gap-3 sm:grid-cols-3">
          <Num label="Lợi nhuận gốc (đơn vị giá)" value={eps} set={setEps} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Số năm (năm)" value={years} set={setYears} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Giá để so sánh (cùng đơn vị)" value={price} set={setPrice} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Tăng trưởng trung bình (%)" value={gMean} set={setGMean} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Độ lệch tăng trưởng (điểm %)" value={gSd} set={setGSd} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Biên trung bình (%)" value={mMean} set={setMMean} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Độ lệch biên (điểm %)" value={mSd} set={setMSd} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Biên gốc (%)" value={mBase} set={setMBase} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Hệ số trung bình (lần)" value={peMean} set={setPeMean} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Độ lệch hệ số (lần)" value={peSd} set={setPeSd} onEdit={() => { setMc(null); setMcError(""); }} />
          <Num label="Hạt giống (số nguyên)" value={seed} set={setSeed} onEdit={() => { setMc(null); setMcError(""); }} />
        </div>
        <button
          type="button"
          className="bg-accent px-4 py-3 text-sm text-ink"
          onClick={() => {
            setMc(null);
            const inputs = [eps, years, gMean, gSd, mMean, mSd, mBase, peMean, peSd, price, seed];
            const nums = inputs.map((value) => value.trim() === "" ? NaN : Number(value));
            if (nums.some((value) => !Number.isFinite(value))) {
              setMcError("Ô nhập không phải số hoặc đang trống — không thể tính.");
              return;
            }
            const [earning, duration, growth, growthSd, margin, marginSd, baseMargin, pe, peSdValue, comparison, randomSeed] = nums as number[];
            if (growth < -80 || growth > 200 || margin < 0 || margin > 80 || baseMargin < 0 || baseMargin > 80 ||
                pe < 0.1 || pe > 80 || growthSd < 0 || marginSd < 0 || peSdValue < 0 ||
                earning <= 0 || duration <= 0 || !Number.isInteger(duration) || comparison < 0 || !Number.isSafeInteger(randomSeed)) {
              setMcError("Đầu vào ngoài khoảng, kết quả không dùng được");
              return;
            }
            setMcError("");
            setMc(monteCarlo({
              eps: earning, years: duration, gMean: growth / 100, gSd: growthSd / 100,
              marginMean: margin / 100, marginSd: marginSd / 100, marginBase: baseMargin / 100,
              peMean: pe, peSd: peSdValue, price: comparison, seed: randomSeed || 1, n: 3000,
            }));
          }}
        >
          Chạy 3.000 đường, có hạt giống
        </button>
        {mcError ? <p role="alert" className="text-sm text-red-600">{mcError}</p> : null}
        {mc ? (
          <div className="border border-line p-4">
            <p className="mb-3 text-sm text-muted">Kết quả phụ thuộc hoàn toàn vào phân phối tự nhập, chưa hiệu chỉnh</p>
            {mc.clippedPct > 5 ? <p role="alert" className="mb-3 text-sm text-red-600">Cảnh báo: {mc.clippedPct}% đường mô phỏng bị kẹp vào giới hạn.</p> : null}
            {mc.degenerate ? <p className="mb-3 text-sm text-accent">Độ lệch bằng không. Đây là một điểm, không phải một phân phối.</p> : null}
            <dl className="grid grid-cols-2 gap-3 text-sm tabular-nums sm:grid-cols-5">
              <Stat k="P5" v={mc.p5} />
              <Stat k="P25" v={mc.p25} />
              <Stat k="Trung vị" v={mc.p50} />
              <Stat k="P75" v={mc.p75} />
              <Stat k="P95" v={mc.p95} />
            </dl>
            <p className="mt-4 text-sm">
              Phần đường có giá trị trên mức so sánh: <span className="tabular-nums">{mc.shareAbove}%</span>. Có điều kiện trên đầu vào và trên giả định độc lập.
            </p>
            <div className="mt-4 flex h-24 items-end gap-1" aria-hidden="true">
              {mc.bins.map((bin, i) => (
                <div key={`${bin.x}-${i}`} className="flex-1 bg-accent" style={{ height: `${Math.max(4, (bin.count / maxBin) * 100)}%` }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Histogram của các đường mô phỏng. Không phải lịch sử giá.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Num({ label, value, set, onEdit }: { label: string; value: string; set: (v: string) => void; onEdit: () => void }) {
  return (
    <Field label={label}>
      <input className={`${inputClass} tabular-nums`} value={value} onChange={(e) => { set(e.target.value); onEdit(); }} />
    </Field>
  );
}

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-serif text-xl">{v}</dd>
    </div>
  );
}
