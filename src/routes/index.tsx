import { Link, createFileRoute } from "@tanstack/react-router";
import { Note, Stamp } from "@/components/ui";
import { useDesk } from "@/foundation/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "CHỈNAM — Bàn vận hành" }] }),
  component: Desk,
});

function Desk() {
  const mandate = useDesk((s) => s.mandate);
  const world = useDesk((s) => s.world);
  const baseRates = useDesk((s) => s.baseRates);
  const theses = useDesk((s) => s.theses);
  const ledger = useDesk((s) => s.ledger);
  const decisions = useDesk((s) => s.decisions);
  const readyCount = theses.filter((t) => t.status === "ready").length;
  const pending = decisions.filter((d) => !d.voided && d.outcome === "pending").length;

  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium tracking-widest text-accent uppercase">Hệ vận hành · chưa hiệu chỉnh · không phát lệnh</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-fg">Bàn làm việc</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Lớp này ghi những thứ quyết định phải đứng trên: ủy thác, quan sát thế giới có nguồn, và base rate có mẫu. Không có số nào được điền sẵn. Engine định giá và dữ liệu thị trường vẫn chưa xây.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Stamp tone={mandate.locked ? "solid" : "accent"}>{mandate.locked ? "Ủy thác đã khóa" : "Ủy thác chưa khóa"}</Stamp>
        <Stamp>Chưa hiệu chỉnh</Stamp>
        <Stamp>{readyCount} hồ sơ sẵn sàng</Stamp>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat k="Quan sát thế giới" v={world.length} />
        <Stat k="Base rate" v={baseRates.length} />
        <Stat k="Hồ sơ" v={theses.length} />
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
          <Link to="/protocol" className="text-fg">
            4. Mở hồ sơ
          </Link>
          <p className="text-muted">Chưa khóa ủy thác thì hồ sơ ở lại bản nháp, dù các ô khác đã đầy.</p>
        </li>
      </ol>

      <section className="mt-8 border-t border-line pt-4">
        <h2 className="font-serif text-2xl">Hồ sơ đang mở</h2>
        {theses.length === 0 ? <p className="mt-3 text-sm text-muted">Chưa có hồ sơ.</p> : null}
        <ul className="mt-3 space-y-2">
          {theses.slice(0, 8).map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 border border-line px-3 py-2 text-sm">
              <span>{t.security.trim() || "Chưa đặt tên"}</span>
              <Stamp tone={t.status === "ready" ? "solid" : "muted"}>
                {t.status === "ready" ? "Sẵn sàng" : t.status === "invalidated" ? "Đã hủy" : "Nháp"}
                {t.ring === "inner" ? " · trong" : t.ring === "outer" ? " · ngoài" : ""}
              </Stamp>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8">
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

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="border border-line px-3 py-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-1 font-serif text-2xl tabular-nums">{v}</dd>
    </div>
  );
}
