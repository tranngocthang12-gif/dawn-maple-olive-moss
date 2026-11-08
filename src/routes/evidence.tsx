import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stamp } from "@/components/ui";
import { bindingPrinciples, evidenceClasses, mandatoryQuestions, outputSections, tiers } from "@/foundation/doctrine";

export const Route = createFileRoute("/evidence")({
  head: () => ({ meta: [{ title: "CHỈNAM — Luật bằng chứng" }] }),
  component: EvidencePage,
});

function EvidencePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Luật bằng chứng"
        title="Suy luận không được mặc áo sự thật."
        lede="Nếu thiếu bằng chứng, câu đúng là chưa đủ bằng chứng. Một nguồn tầng 5 không trở thành tầng 1 vì được nhắc lại nhiều lần."
      />
      <section className="mt-8 space-y-4">
        {evidenceClasses.map((item) => (
          <article key={item.id} className="border-t border-line pt-4">
            <Stamp tone={item.id === "fact" || item.id === "data" ? "solid" : item.id === "insufficient" ? "accent" : "muted"}>{item.name}</Stamp>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.rule}</p>
          </article>
        ))}
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Tầng nguồn</h2>
        <div className="mt-4 space-y-4">
          {tiers.map((t) => (
            <article key={t.id} className="border-t border-line pt-3">
              <h3 className="text-sm text-fg">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{t.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Dòng dõi của một số</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Nguồn, và tầng của nguồn.</li>
          <li>Thời điểm thị trường có thể đã biết. Không dùng được cho quá khứ trước thời điểm đó.</li>
          <li>Đơn vị và phương pháp. Một tỷ lệ không tên mẫu là chưa đủ.</li>
          <li>Liệu nguồn có được phép dùng, và có phải thông tin nội gián hay không.</li>
          <li>Phiên bản, nếu số đã bị sửa. Sửa thì ghi dòng mới, không viết đè im lặng.</li>
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Giá trị của thông tin</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Trước khi đi lấy thêm một số, hỏi: nếu biết số này, quyết định có đổi không? Nếu không, nó không được ưu tiên. Thu thập vì thu thập được là trình diễn.
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Câu hỏi phản biện bắt buộc</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {mandatoryQuestions.map((q) => (
            <li key={q} className="border-t border-line py-2">
              {q}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Mười lăm mục của bản đọc</h2>
        <p className="mt-3 text-sm text-muted">Đủ mục không phải quyết định tốt. Mục trống phải hiện là chưa đủ bằng chứng, không được mô hình viết tiếp.</p>
        <ol className="mt-4 space-y-1 text-sm">
          {outputSections.map((s, i) => (
            <li key={s}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Nguyên tắc còn ràng buộc</h2>
        <div className="mt-4 space-y-4">
          {bindingPrinciples.map((p) => (
            <article key={p.id}>
              <h3 className="text-sm">{p.title}</h3>
              <p className="text-sm text-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
