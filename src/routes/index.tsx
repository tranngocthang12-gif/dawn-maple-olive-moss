import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Note, Stamp } from "@/components/ui";
import { useDesk } from "@/foundation/store";
import { thesisReadiness } from "@/foundation/logic";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "CHỈNAM — Bàn vận hành" }] }),
  component: Desk,
});

function Desk() {
  const mandate = useDesk((s) => s.mandate);
  const world = useDesk((s) => s.world);
  const baseRates = useDesk((s) => s.baseRates);
  const companies = useDesk((s) => s.companies);
  const signals = useDesk((s) => s.signals);
  const theses = useDesk((s) => s.theses);
  const ledger = useDesk((s) => s.ledger);
  const decisions = useDesk((s) => s.decisions);
  const ctx = { mandate, world, baseRates, companies, decisions };
  const readyCount = theses.filter((t) => thesisReadiness(t, ctx) === "ready").length;
  const thinReadyCount = theses.filter((t) => thesisReadiness(t, ctx) === "thin-ready").length;
  const pending = decisions.filter((d) => !d.voided && d.outcome === "pending").length;

  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium tracking-widest text-accent uppercase">Hệ vận hành · chưa hiệu chỉnh · không phát lệnh</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-fg">Bàn làm việc</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Lớp này ghi những thứ quyết định phải đứng trên: ủy thác, thế giới có nguồn, base rate, hồ sơ doanh nghiệp đã nộp, và tín hiệu viết trước khi đo. Không có số nào được điền sẵn. Định giá và dữ liệu thị trường vẫn chưa xây.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Stamp tone={mandate.locked ? "solid" : "accent"}>{mandate.locked ? "Ủy thác đã khóa" : "Ủy thác chưa khóa"}</Stamp>
        <Stamp>Chưa hiệu chỉnh</Stamp>
        <Stamp>{readyCount} hồ sơ sẵn sàng</Stamp>
        <Stamp tone="accent">{thinReadyCount} hồ sơ sẵn sàng mỏng</Stamp>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat k="Quan sát thế giới" v={world.length} />
        <Stat k="Base rate" v={baseRates.length} />
        <Stat k="Hồ sơ doanh nghiệp" v={companies.length} />
        <Stat k="Đã nộp" v={companies.filter((c) => c.status === "filed").length} />
        <Stat k="Tín hiệu sống" v={signals.filter((s) => s.status === "alive").length} />
        <Stat k="Tín hiệu đã chết" v={signals.filter((s) => s.status === "dead").length} />
        <Stat k="Dòng xác suất" v={ledger.length} />
        <Stat k="Quyết định chờ kết cục" v={pending} />
        <Stat k="Đã phân giải" v={decisions.filter((d) => d.outcome.startsWith("process-")).length} />
      </dl>

      <ol className="mt-8 space-y-3 text-sm">
        <li className="border-t border-line pt-3">
          <Link to="/mandate" className="text-fg">
            1. Khóa ủy thác
          </Link>
          <p className="text-muted">Tiền tệ, chân trời, vành trong, vành ngoài, đòn bẩy. Mở khóa sau này phải có lý do.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/world" className="text-fg">
            2. Ghi trạng thái thế giới
          </Link>
          <p className="text-muted">Mức, tốc độ đổi, gia tốc. Thiếu nguồn tầng 1 hoặc 2 thì không vào sổ.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/baserates" className="text-fg">
            3. Ghi base rate
          </Link>
          <p className="text-muted">Một tỷ lệ không có mẫu, nơi, thời và giới hạn thì không được dùng.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/companies" className="text-fg">
            4. Nộp hồ sơ doanh nghiệp
          </Link>
          <p className="text-muted">Chuẩn kế toán, sự kiện có nguồn, chín chiều chất lượng. Không có số điền sẵn.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/signals" className="text-fg">
            5. Viết tín hiệu rồi cho nó chết nếu cần
          </Link>
          <p className="text-muted">Cơ chế, độ trễ, cách chết, quyền dữ liệu. Chưa có backtest và chưa có điểm số.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/protocol" className="text-fg">
            6. Mở hồ sơ luận điểm
          </Link>
          <p className="text-muted">Phải gắn một hồ sơ doanh nghiệp đã đóng. Ủy thác chưa khóa thì luận điểm ở lại bản nháp. Mã đã có quyết định cũ thì phải đọc lại trước.</p>
        </li>
        <li className="border-t border-line pt-3">
          <Link to="/journal" className="text-fg">
            7. Ghi kết quả khi đã biết
          </Link>
          <p className="text-muted">Thắng hay thua chưa ghi thì lần sau không có gì để học. Kết quả tốt không chứng minh cách làm đúng.</p>
        </li>
      </ol>

      <section className="mt-8 border-t border-line pt-4">
        <h2 className="font-serif text-2xl">Hồ sơ đang mở</h2>
        {theses.length === 0 ? <p className="mt-3 text-sm text-muted">Chưa có hồ sơ.</p> : null}
        <ul className="mt-3 space-y-2">
          {theses.slice(0, 8).map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 border border-line px-3 py-2 text-sm">
              <span>{t.security.trim() || "Chưa đặt tên"}</span>
              <Stamp tone={thesisReadiness(t, ctx) === "ready" ? "solid" : thesisReadiness(t, ctx) === "thin-ready" || thesisReadiness(t, ctx) === "invalidated" ? "accent" : "muted"}>
                {thesisReadiness(t, ctx) === "ready" ? "Sẵn sàng" : thesisReadiness(t, ctx) === "thin-ready" ? "Sẵn sàng mỏng" : thesisReadiness(t, ctx) === "invalidated" ? "Đã hủy" : "Nháp"}
                {t.ring === "inner" ? " · trong" : t.ring === "outer" ? " · ngoài" : ""}
              </Stamp>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8">
        <BookCopy />
        <Note>
          Hiến chương và phản biện vẫn giữ nguyên. Bàn này không phân tích một mã và không đề xuất tỷ trọng.{" "}
          <Link to="/charter" className="text-accent">
            Đọc hiến chương
          </Link>
        </Note>
      </div>
    </div>
  );
}

function BookCopy() {
  const exportDesk = useDesk((s) => s.exportDesk);
  const importDesk = useDesk((s) => s.importDesk);
  const [msg, setMsg] = useState("");

  return (
    <section className="mb-8 border border-line px-4 py-4">
      <h2 className="font-serif text-2xl">Giữ sổ trên máy bạn</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Sổ đang nằm trong trình duyệt này. Xóa dữ liệu duyệt web là mất. Tải về một tệp khi bạn muốn giữ. Đưa tệp vào sẽ thay sổ đang mở, không gộp.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="bg-accent px-4 py-3 text-sm text-ink"
          onClick={() => {
            const blob = new Blob([exportDesk()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "chinam-so.json";
            a.click();
            URL.revokeObjectURL(url);
            setMsg("Đã tải sổ về máy. Giữ tệp đó.");
          }}
        >
          Tải sổ về máy
        </button>
        <label className="cursor-pointer border border-line px-4 py-3 text-sm text-fg">
          Đưa sổ từ máy vào
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const text = typeof reader.result === "string" ? reader.result : "";
                if (!window.confirm("Đưa sổ này vào sẽ thay toàn bộ sổ đang mở. Nên tải bản hiện tại về máy trước.")) return;
                const result = importDesk(text);
                setMsg(result.ok ? "Đã đưa sổ vào. Bản này thay bản đang mở." : result.reason);
              };
              reader.readAsText(file);
            }}
          />
        </label>
      </div>
      {msg ? <p className="mt-3 text-sm text-muted">{msg}</p> : null}
    </section>
  );
}

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="border border-line px-3 py-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-1 font-serif text-2xl tabular-nums">{v}</dd>
    </div>
  );
}
