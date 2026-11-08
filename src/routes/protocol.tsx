import { createFileRoute } from "@tanstack/react-router";
import { ThesisDesk } from "@/components/thesis-desk";
import { PageHeader, Note } from "@/components/ui";
import { adversarial } from "@/foundation/doctrine";

export const Route = createFileRoute("/protocol")({
  head: () => ({ meta: [{ title: "CHỈNAM — Quy trình một mã" }] }),
  component: ProtocolPage,
});

function ProtocolPage() {
  return (
    <div>
      <div className="max-w-3xl">
        <PageHeader
          kicker="Quy trình mặc định khi Owner đưa một mã"
          title="Khung trống. Không có mã mẫu. Không có số mẫu."
          lede="Hai mươi hai chiều của hiến chương nằm trong các màn hình. Sẵn sàng chỉ có nghĩa là các ô đã được điền đủ trung thực, kể cả bằng câu chưa đủ bằng chứng. Sẵn sàng không có nghĩa là mua."
        />
        <Note>
          Năm vai A đến E chưa được triển khai thành agent. Cùng một họ mô hình ngôn ngữ không được tính là năm nhà phân tích. Nếu làm phản biện bằng tay, phe bán viết xong bản riêng trước khi đọc kết luận phe mua.
        </Note>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {adversarial.map((role) => (
            <li key={role.id}>
              <span className="text-fg">{role.id} · {role.role}. </span>
              {role.job}
            </li>
          ))}
        </ul>
      </div>
      <ThesisDesk />
    </div>
  );
}
