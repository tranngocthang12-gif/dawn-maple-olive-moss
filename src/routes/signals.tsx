import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Note, Stamp } from "@/components/ui";
import { funnel, overfitChecks, scorePenalties, sensors, signalScore } from "@/foundation/doctrine";

export const Route = createFileRoute("/signals")({
  head: () => ({ meta: [{ title: "CHỈNAM — Tín hiệu" }] }),
  component: SignalsPage,
});

function SignalsPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Học thuyết tín hiệu · engine chưa xây"
        title="Đa số tín hiệu phải được phép chết."
        lede="Chưa có backtest nào trong Foundation. Trang này khóa quy tắc nghiên cứu để khi Phase 5 mở, không ai được luyện mô hình trên tập kiểm rồi kể là đã phát hiện."
      />
      <Note>
        Các con số 10.000 xuống còn 10–20 trong hiến chương là hình minh họa, không phải hạn ngạch. Đề xuất P9 đang chờ nếu Owner muốn giữ chúng thành luật. Hiện chúng không phải luật.
      </Note>
      <ol className="mt-6 space-y-3">
        {funnel.map((stage, i) => (
          <li key={stage.gate} className="border-t border-line pt-3">
            <p className="text-xs text-muted">Cửa {i + 1}</p>
            <p className="font-serif text-xl">{stage.n}</p>
            <p className="text-sm text-muted">{stage.gate}</p>
          </li>
        ))}
      </ol>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Viết trước khi đo</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>Giả thuyết.</li>
          <li>Cơ chế nhân quả. Tương quan không đủ.</li>
          <li>Độ trễ kỳ vọng, và cửa sổ đó còn giao dịch được không.</li>
          <li>Cách chết. Cái gì sẽ làm tín hiệu này bị khai tử.</li>
        </ol>
        <p className="mt-4 text-sm text-muted">Sau đó mới đến luyện, kiểm, ngoài mẫu, walk-forward, giấy, vốn nhỏ, rồi sản xuất. Không chỉnh vô hạn trên tập đã thấy.</p>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Điểm chất lượng</h2>
        <p className="mt-3 text-sm text-muted">C × L × I × R × U, rồi trừ các khoản phạt. Chưa có thang điểm số vì chưa có tín hiệu sống. Câu hỏi mới là cổng.</p>
        <div className="mt-4 space-y-3">
          {signalScore.map((s) => (
            <article key={s.k} className="border-t border-line pt-3">
              <h3 className="text-sm">
                {s.k} · {s.name}
              </h3>
              <p className="text-sm text-muted">{s.q}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {scorePenalties.map((p) => (
            <Stamp key={p} tone="accent">
              Trừ {p}
            </Stamp>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Họ cảm biến</h2>
        <p className="mt-3 text-sm text-muted">
          Mười họ của hiến chương. Chúng không phải mười nguồn sự thật. Đề xuất P3 là một sổ đăng ký. Chưa gộp thành engine vì Phase 5 chưa mở. Tín hiệu vật lý chỉ được xét khi hợp pháp và có đường tới lợi nhuận.
        </p>
        <div className="mt-4 space-y-3">
          {sensors.map((s) => (
            <article key={s.id} className="border-t border-line pt-3">
              <h3 className="text-sm">{s.name}</h3>
              <p className="text-sm text-muted">{s.watch}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Chống overfitting</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {overfitChecks.map((item) => (
            <li key={item} className="border-t border-line py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
