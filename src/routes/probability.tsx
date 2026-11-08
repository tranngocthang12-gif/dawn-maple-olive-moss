import { createFileRoute } from "@tanstack/react-router";
import { ProbabilityBench } from "@/components/probability-bench";
import { PageHeader } from "@/components/ui";

export const Route = createFileRoute("/probability")({
  head: () => ({ meta: [{ title: "CHỈNAM — Xác suất" }] }),
  component: ProbabilityPage,
});

function ProbabilityPage() {
  return (
    <div>
      <div className="max-w-3xl">
        <PageHeader
          kicker="Khung xác suất · chưa hiệu chỉnh"
          title="Không nói tin này tốt. Nói bằng chứng đổi tiên nghiệm như thế nào, hoặc nói là chưa biết."
          lede="Sổ cái là dụng cụ Phase 0 của động cơ xác suất. Nó không phải động cơ đã xây xong. Máy Monte Carlo phía dưới là một minh họa có điều kiện, cố ý khai báo giả định độc lập để khỏi bị đọc thành định giá."
        />
      </div>
      <ProbabilityBench />
    </div>
  );
}
