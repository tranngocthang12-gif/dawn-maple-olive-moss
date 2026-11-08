import { Link, createFileRoute } from "@tanstack/react-router";
import { Note, Stamp } from "@/components/ui";
import { books } from "@/foundation/books";
import { cases } from "@/foundation/cases";
import { bindingPrinciples } from "@/foundation/doctrine";
import { modules } from "@/foundation/modules";
import { falseConfidence, gaps, hallucinations, overfit, proposals } from "@/foundation/review";

export const Route = createFileRoute("/charter")({
  head: () => ({ meta: [{ title: "CHỈNAM — Hiến chương" }] }),
  component: Home,
});

function Home() {
  const instruments = modules.filter((m) => m.status === "instrument").length;
  const doctrine = modules.filter((m) => m.status === "doctrine").length;
  const proposed = modules.filter((m) => m.status === "proposed").length;

  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium tracking-widest text-accent uppercase">Foundation V1 · Phase 0 đang mở</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-fg lg:text-5xl">
        Biết cái mình biết. Biết cái mình chưa biết. Biết xác suất mình sai.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted">
        CHỈNAM là nền của một hệ điều hành tình báo đầu tư. Phiên bản này giữ hiến chương, phản biện kiến trúc, và các dụng cụ buộc phải phân loại bằng chứng. Nó không phân tích cổ phiếu, không lập danh mục, và không triển khai vốn.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Stamp tone="solid">Chưa hiệu chỉnh</Stamp>
        <Stamp>0 dự báo đã phân giải</Stamp>
        <Stamp tone="accent">Không phát lệnh</Stamp>
      </div>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">Không xây</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed">
          <li>Một chatbot trả lời nên mua mã nào.</li>
          <li>Một máy dự báo giá ngày mai, hay một giọng chắc chắn tăng.</li>
          <li>Một quyết định mà đầu vào chỉ là ý kiến của mô hình ngôn ngữ.</li>
        </ul>
      </section>

      <figure className="mt-8 border border-line bg-surface px-5 py-6">
        <figcaption className="text-xs tracking-wide text-muted uppercase">Công thức được phép</figcaption>
        <p className="mt-3 font-serif text-xl leading-relaxed">
          Decision = f(World, Macro, Industry, Company, Management, Fundamentals, Valuation, Expectations, Market, Probability, Risk, Portfolio)
        </p>
        <p className="mt-4 text-sm text-muted">Không được phép: Decision = f(ý kiến của AI).</p>
      </figure>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Rà soát kiến trúc, trước khi mở rộng</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Hiến chương không bị cắt. Phần dưới là các lỗ của chính nó. Mỗi mục trong trang phản biện mang nhãn sự thật về văn bản, suy luận, hoặc giả thuyết.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Count k="Thiếu sót" v={gaps.length} />
          <Count k="Chỗ trùng" v={6} />
          <Count k="Overfitting" v={overfit.length} />
          <Count k="Ảo giác" v={hallucinations.length} />
          <Count k="Tự tin giả" v={falseConfidence.length} />
          <Count k="Đề xuất chờ" v={proposals.length} />
          <Count k="Sách trên kệ" v={books.length} />
          <Count k="Án lệ" v={cases.length} />
        </dl>
        <Link to="/review" className="mt-4 inline-block bg-accent px-4 py-3 text-sm text-ink">
          Đọc phản biện
        </Link>
      </section>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">Việc nên làm trước</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed">
          <li>1. Đọc phản biện và chín đề xuất. Các đề xuất chưa được tự ý biến thành nguyên tắc mới, trừ những dụng cụ đã ghi rõ là cách thi hành hiến chương.</li>
          <li>2. Chưa mở một mã thật nếu chưa muốn luyện quy trình. Hồ sơ trống cố ý không có số.</li>
          <li>3. Nếu ghi một xác suất, ghi vào sổ cái. Không ghi một phần trăm trong đầu rồi coi là đã cập nhật.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Trạng thái bản đồ</h2>
        <p className="mt-3 text-sm text-muted">
          {instruments} dụng cụ đang dùng được. {doctrine} engine mới có học thuyết. {proposed} module đang chờ Owner. Một sơ đồ không phải một hệ thống đang chạy.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/modules" className="border border-line px-3 py-2">
            Bản đồ module
          </Link>
          <Link to="/protocol" className="border border-line px-3 py-2">
            Quy trình một mã
          </Link>
          <Link to="/probability" className="border border-line px-3 py-2">
            Sổ xác suất
          </Link>
          <Link to="/gates" className="border border-line px-3 py-2">
            Cổng nghiệm thu
          </Link>
        </div>
      </section>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">Nguyên tắc đang giữ</h2>
        <ul className="mt-4 space-y-3">
          {bindingPrinciples.slice(0, 6).map((p) => (
            <li key={p.id}>
              <p className="text-sm text-fg">{p.title}</p>
              <p className="text-sm text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
        <Link to="/evidence" className="mt-4 inline-block text-sm text-accent">
          Đủ luật bằng chứng
        </Link>
      </section>

      <div className="mt-10">
        <Note>
          Mục tiêu của phiên bản này không phải nhanh. Mục tiêu là xây đúng nền, rồi mới mở rộng. Vốn thật vẫn đóng ở Phase 9.
        </Note>
      </div>
    </div>
  );
}

function Count({ k, v }: { k: string; v: number }) {
  return (
    <div className="border border-line px-3 py-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-1 font-serif text-2xl tabular-nums">{v}</dd>
    </div>
  );
}
