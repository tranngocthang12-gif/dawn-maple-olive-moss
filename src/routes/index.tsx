import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Note, Stamp } from "@/components/ui";
import { useDesk } from "@/foundation/store";
import { thesisReadiness } from "@/foundation/logic";
import { storageSnapshot, watchStorage } from "@/foundation/storage";

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
  const companySeals = useDesk((s) => s.companySeals);
  const verifyIntegrity = useDesk((s) => s.verifyIntegrity);
  const storage = useSyncExternalStore(watchStorage, storageSnapshot, storageSnapshot);
  const [integrity, setIntegrity] = useState({ matched: 0, mismatched: 0, missing: 0 });
  useEffect(() => {
    let active = true;
    void verifyIntegrity().then((counts) => { if (active) setIntegrity(counts); }).catch(() => {
      if (active) setIntegrity({ matched: 0, mismatched: 0, missing: companySeals.length + decisions.length });
    });
    return () => { active = false; };
  }, [verifyIntegrity, companySeals, decisions]);
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
        <Stat k="Bản niêm phong và ảnh chụp khớp băm" v={integrity.matched} />
        <Stat k="Mã băm không khớp" v={integrity.mismatched} />
        <Stat k="Chưa có mã băm" v={integrity.missing} />
        <Stat k="Băm sau, từ bản cũ" v={
          companySeals.filter((s) => s.sha256Origin === "legacy-backfill").length +
          decisions.filter((d) => d.snapshotHashOrigin === "legacy-backfill").length
        } />
      </dl>

      <p className="mt-4 text-sm text-muted">
        Dung lượng sổ đang dùng: {formatBytes(storage.bytes)}.
        {storage.quota !== null ? " Hạn mức trình duyệt ước tính: " + formatBytes(storage.quota) + "." : " Trình duyệt chưa cung cấp hạn mức."}
      </p>

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

function formatBytes(n: number): string {
  if (n < 1024) return n.toLocaleString("vi-VN") + " byte";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(2) + " MB";
}

function downloadBook(text: string, filename: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function backupFilename(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return "chinam-sao-luu-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
    "-" + pad(d.getHours()) + pad(d.getMinutes()) + ".json";
}

function BookCopy() {
  const exportDesk = useDesk((s) => s.exportDesk);
  const importDesk = useDesk((s) => s.importDesk);
  const approvals = useDesk((s) => s.tamperImportApprovals);
  const [msg, setMsg] = useState("");
  const [working, setWorking] = useState(false);

  const download = async () => {
    try {
      const raw = await exportDesk();
      downloadBook(raw, "chinam-so.json");
      setMsg("Đã bắt đầu tải bản sao sổ.");
    } catch (error) {
      setMsg("Không xuất được sổ: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const importFile = async (file: File) => {
    if (working) return;
    setWorking(true);
    try {
      if (!window.confirm("Sổ từ máy sẽ thay toàn bộ sổ đang mở. Ứng dụng sẽ tự tải bản sao lưu trước khi nhập. Tiếp tục?")) return;
      // Backup is a required gate, not an optional UI prompt.
      const backup = await exportDesk();
      downloadBook(backup, backupFilename());
      setMsg("Đã khởi động tải bản sao lưu.");
      if (!window.confirm("Hãy kiểm tra tệp sao lưu đã lưu xong trên máy trước khi nhập. Xác nhận đã có tệp sao lưu?")) return;
      setMsg("Đã xác nhận bản sao lưu. Đang kiểm tra file nhập.");
      const raw = await file.text();
      let acceptLegacy = false;
      let acceptTamper = false;
      let result = await importDesk(raw, acceptLegacy, acceptTamper);
      if (!result.ok && result.reason.startsWith("legacy-unverified:") &&
        window.confirm("File bản cũ không có mã băm, không kiểm được có bị sửa hay không — vẫn nhập?")) {
        acceptLegacy = true;
        result = await importDesk(raw, acceptLegacy, acceptTamper);
      }
      if (!result.ok && result.reason.includes("sha256:") &&
        window.confirm("Mã băm tổng hoặc mã băm ảnh chụp không khớp. Vẫn nhập dù file đã bị sửa?")) {
        acceptTamper = true;
        result = await importDesk(raw, acceptLegacy, acceptTamper);
      }
      setMsg(result.ok ? "Đã nhập và đã lưu" : result.reason);
    } catch (error) {
      setMsg("Không thể sao lưu/nhập sổ: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className="mb-8 border border-line px-4 py-4">
      <h2 className="font-serif text-2xl">Giữ sổ trên máy bạn</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Sổ chính nằm trong IndexedDB. Khóa localStorage V1 được giữ nguyên trong giai đoạn này.
        Trước khi nhập file, ứng dụng tự tải bản sao lưu sổ hiện tại.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={working} className="bg-accent px-4 py-3 text-sm text-ink"
          onClick={() => { void download(); }}>Tải sổ về máy</button>
        <label className="cursor-pointer border border-line px-4 py-3 text-sm text-fg">
          Đưa sổ từ máy vào
          <input type="file" accept="application/json,.json" className="sr-only" disabled={working}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void importFile(file);
            }} />
        </label>
      </div>
      {msg ? <p role="status" className="mt-3 text-sm text-muted">{msg}</p> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <section>
          <h3 className="font-semibold">Xác nhận thực hiện trên máy này</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {approvals.filter((row) => row.source !== "imported").map((row, index) => (
              <li key={index}>{row.at}: {row.note}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="font-semibold">Nhật ký từ file nhập (không phải xác nhận trên máy)</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {approvals.filter((row) => row.source === "imported").map((row, index) => (
              <li key={index}>từ file nhập — {row.at}: {row.note}</li>
            ))}
          </ul>
        </section>
      </div>
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
