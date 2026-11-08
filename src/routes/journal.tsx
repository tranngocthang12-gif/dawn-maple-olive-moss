import { createFileRoute } from "@tanstack/react-router";
import { JournalDesk } from "@/components/journal-desk";
import { PageHeader } from "@/components/ui";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "CHỈNAM — Nhật ký quyết định" }] }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <div>
      <div className="max-w-3xl">
        <PageHeader
          kicker="Trí nhớ chống hồi tố"
          title="Quyết định tốt hay chỉ may, chỉ hỏi được nếu bản lúc ấy còn nguyên."
          lede="Ngày, giá, thesis, kỳ vọng, xác suất, rủi ro, kích thước, chất xúc tác, điều kiện hủy, quan điểm khác. Sau khi khóa, lõi không sửa. Kết cục đến sau không được viết lại lý do."
        />
      </div>
      <JournalDesk />
    </div>
  );
}
