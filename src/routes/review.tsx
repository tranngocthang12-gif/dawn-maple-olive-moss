import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stamp } from "@/components/ui";
import {
  assumptions,
  dupes,
  falseConfidence,
  gaps,
  hallucinations,
  keptOnPurpose,
  overfit,
  proposals,
  risks,
  type Finding,
  type FindingKlass,
} from "@/foundation/review";

export const Route = createFileRoute("/review")({
  head: () => ({ meta: [{ title: "CHỈNAM — Phản biện kiến trúc" }] }),
  component: ReviewPage,
});

const klassLabel: Record<FindingKlass, string> = {
  fact: "Sự thật về văn bản",
  inference: "Suy luận",
  hypothesis: "Giả thuyết",
};

function ReviewPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        kicker="Phản biện trước khi xây tiếp"
        title="Kiến trúc này chưa hoàn hảo."
        lede="Đây là suy luận của Foundation V1 về chính hiến chương. Nó không phải một kiểm toán độc lập, và không phải lý do để cắt nguyên tắc cho dễ làm. Chín đề xuất ở cuối đang chờ Owner."
      />
      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Mục phản biện">
        <a className="border border-line px-3 py-2" href="#gaps">Thiếu</a>
        <a className="border border-line px-3 py-2" href="#dupes">Trùng</a>
        <a className="border border-line px-3 py-2" href="#risks">Rủi ro</a>
        <a className="border border-line px-3 py-2" href="#assumptions">Giả định</a>
        <a className="border border-line px-3 py-2" href="#overfit">Overfitting</a>
        <a className="border border-line px-3 py-2" href="#hallucinations">Ảo giác</a>
        <a className="border border-line px-3 py-2" href="#confidence">Tự tin giả</a>
        <a className="border border-line px-3 py-2" href="#proposals">Đề xuất</a>
      </nav>

      <Block id="gaps" title="Thiếu sót" items={gaps} />
      <Block id="dupes" title="Trùng" items={dupes} />
      <Block id="risks" title="Rủi ro" items={risks} />
      <Block id="assumptions" title="Giả định ẩn" items={assumptions} />
      <Block id="overfit" title="Cửa overfitting" items={overfit} />
      <Block id="hallucinations" title="Cửa ảo giác" items={hallucinations} />
      <Block id="confidence" title="Cửa tự tin giả" items={falseConfidence} />

      <section id="kept" className="mt-12 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">Không bị cắt</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          {keptOnPurpose.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="proposals" className="mt-12 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">Đề xuất đang chờ</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Mỗi đề xuất có lý do, phản biện, và so sánh. Khuyến nghị là suy luận của kiến trúc sư, không phải quyết định. Owner chưa gật thì đề xuất chưa thành luật, trừ những chỗ đã ghi là dụng cụ thi hành nguyên tắc cũ.
        </p>
        <div className="mt-6 space-y-6">
          {proposals.map((p) => (
            <article key={p.id} className="border border-line p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Stamp tone="accent">{p.id}</Stamp>
                <Stamp>{p.status}</Stamp>
              </div>
              <h3 className="mt-3 font-serif text-xl">{p.title}</h3>
              <Prop k="Đề xuất" v={p.proposal} />
              <Prop k="Vì sao" v={p.why} />
              <Prop k="Phản biện" v={p.counter} />
              <Prop k="So sánh" v={p.compare} />
              <Prop k="Khuyến nghị, loại suy luận" v={p.recommend} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Block({ id, title, items }: { id: string; title: string; items: Finding[] }) {
  return (
    <section id={id} className="mt-12 border-t border-line pt-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-4 space-y-5">
        {items.map((item) => (
          <article key={item.id}>
            <Stamp tone={item.klass === "fact" ? "solid" : item.klass === "hypothesis" ? "accent" : "muted"}>{klassLabel[item.klass]}</Stamp>
            <h3 className="mt-2 text-base text-fg">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Prop({ k, v }: { k: string; v: string }) {
  return (
    <p className="mt-3 text-sm leading-relaxed">
      <span className="text-muted">{k}. </span>
      {v}
    </p>
  );
}
