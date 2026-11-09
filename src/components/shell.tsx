import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useDesk } from "@/foundation/store";
import { allowWritesAfterHydration, readRawRecoveryCopies, recoverVerifiedBackup, reportLoadFailure, storageSnapshot, watchStorage } from "@/foundation/storage";

const nav = [
  { href: "/", label: "Bàn" },
  { href: "/mandate", label: "Ủy thác" },
  { href: "/world", label: "Thế giới" },
  { href: "/baserates", label: "Base rate" },
  { href: "/companies", label: "Doanh nghiệp" },
  { href: "/signals", label: "Tín hiệu" },
  { href: "/protocol", label: "Quy trình" },
  { href: "/probability", label: "Xác suất" },
  { href: "/journal", label: "Nhật ký" },
  { href: "/charter", label: "Hiến chương" },
  { href: "/review", label: "Phản biện" },
  { href: "/modules", label: "Module" },
  { href: "/evidence", label: "Bằng chứng" },
  { href: "/library", label: "Thư viện" },
  { href: "/cases", label: "Án lệ" },
  { href: "/gates", label: "Nghiệm thu" },
] as const;

let loadingOnce: Promise<void> | null = null;

async function hydrateBook(): Promise<void> {
  try {
    await useDesk.persist.rehydrate();
    if (storageSnapshot().loadError) return;
    allowWritesAfterHydration();
    useDesk.getState().setReady(true);
  } catch (error) {
    reportLoadFailure(error);
  }
}

function RecoveryPanel({ error }: { error: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const downloadRaw = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const copies = await readRawRecoveryCopies();
      if (!copies.length) throw new Error("Không tìm thấy bản dữ liệu thô để tải.");
      // Encode each raw string losslessly in JSON; never parse or normalize damaged payloads.
      const blob = new Blob([JSON.stringify({ format: "chinam-raw-recovery-v1", copies })], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chinam-du-lieu-tho-" + Date.now() + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setMessage("Đã bắt đầu tải dữ liệu thô. Kiểm tra tệp trên máy trước khi phục hồi.");
    } catch (cause) {
      setMessage("Không thể tải dữ liệu thô: " + (cause instanceof Error ? cause.message : String(cause)));
    } finally { setBusy(false); }
  };
  const restore = async (file: File) => {
    if (busy) return;
    setBusy(true);
    try {
      if (!window.confirm("Chỉ phục hồi bằng backup V2 có mã băm hợp lệ. Dữ liệu lỗi sẽ được cách ly trước khi ghi. Tiếp tục?")) return;
      await recoverVerifiedBackup(await file.text());
      setMessage("Backup đã được kiểm tra và lưu. Hãy tải lại trang để mở sổ đã phục hồi.");
    } catch (cause) {
      setMessage("Không thể phục hồi: " + (cause instanceof Error ? cause.message : String(cause)));
    } finally { setBusy(false); }
  };
  return (
    <section role="alert" className="border border-red-700 p-5 text-red-700">
      <p>Không mở được sổ: {error}. Không tạo sổ trống để thay dữ liệu thật.</p>
      <button type="button" disabled={busy} onClick={() => { void downloadRaw(); }}
        className="mt-4 border border-red-700 px-4 py-2 text-sm">
        Tải dữ liệu thô đang lưu (IndexedDB và khóa cũ)
      </button>
      <label className="ml-3 inline-block cursor-pointer border border-red-700 px-4 py-2 text-sm">
        Phục hồi từ backup V2 đã xác minh
        <input type="file" accept="application/json,.json" disabled={busy} className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void restore(file);
          }} />
      </label>
      <p className="mt-3 text-sm">Backup phải có mã băm hợp lệ. Nếu không cách ly được dữ liệu gốc, phục hồi sẽ bị từ chối.</p>
      {message ? <p role="status" className="mt-3 text-sm">{message}</p> : null}
    </section>
  );
}

function LockedBookPanel({ conflict }: { conflict: boolean }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const exportUnsaved = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const raw = await useDesk.getState().exportDesk();
      const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "chinam-ban-tab-chua-luu-" + Date.now() + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setMessage("Đã bắt đầu tải bản sao trong bộ nhớ. Hãy kiểm tra tệp trước khi tải lại trang.");
    } catch (error) {
      setMessage("Xuất bản sao thất bại: " + (error instanceof Error ? error.message : String(error)));
    } finally { setBusy(false); }
  };
  return (
    <section role="alert" className="border-2 border-red-700 p-5 text-red-700">
      <p className="font-bold">{conflict
        ? "XUNG ĐỘT HAI TAB: Sổ trên đĩa đã thay đổi. Tab này đã bị khóa ghi để tránh mất dữ liệu."
        : "CHẾ ĐỘ CHỈ ĐỌC: IndexedDB không hoạt động, không thể bảo đảm ghi an toàn giữa các tab."}</p>
      <p className="mt-2 text-sm">Hãy tải bản sao trong bộ nhớ nếu cần, kiểm tra bản lưu mới nhất trước khi mở lại. Không tự động hợp nhất dữ liệu.</p>
      <button type="button" onClick={() => { void exportUnsaved(); }} disabled={busy}
        className="mt-4 border border-red-700 px-4 py-2 text-sm">Tải bản sao trong bộ nhớ</button>
      {message ? <p role="status" className="mt-2 text-sm">{message}</p> : null}
    </section>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const storeReady = useDesk((s) => s.ready);
  const storage = useSyncExternalStore(watchStorage, storageSnapshot, storageSnapshot);

  useEffect(() => {
    if (!loadingOnce) loadingOnce = hydrateBook();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-line">
        <div className="flex items-end justify-between gap-4 px-4 pt-4 lg:px-8">
          <div>
            <Link to="/" className="font-serif text-2xl tracking-tight text-fg">
              CHỈNAM
            </Link>
            <p className="mt-1 text-xs text-muted">Hệ điều hành tình báo tài chính</p>
          </div>
          <p className="max-w-48 text-right text-xs leading-relaxed text-muted sm:max-w-none">
            Foundation V1
            <span className="hidden sm:inline"> · chưa hiệu chỉnh · không phát lệnh vốn</span>
          </p>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto px-4 pb-3 lg:px-8" aria-label="Chính">
          {nav.map((item) => {
            const on = item.href === "/" ? path === "/" : path === item.href || path.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`shrink-0 border-b-2 px-3 py-2 text-sm ${on ? "border-accent text-fg" : "border-transparent text-muted"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="border-b border-line px-4 py-2 text-xs text-muted lg:px-8">
        Không dự báo giá ngày mai. Không bịa số. Không có lệnh mua, bán, hay tỷ trọng.
      </div>
      {storage.mode === "fallback" ? (
        <aside role="status" className="border-b border-yellow-700 bg-yellow-100 px-4 py-3 text-sm text-yellow-950">
          IndexedDB không khả dụng. Chế độ dự phòng chỉ đọc, không ghi sổ khi chưa có CAS.
        </aside>
      ) : null}
      {storage.saveError ? (
        <aside role="alert" className="fixed bottom-0 left-0 right-0 z-50 bg-red-800 px-4 py-4 text-sm font-bold text-white">
          Sổ chưa được lưu. Đừng đóng trang; hãy tải bản sao về máy.
        </aside>
      ) : null}
      <main className="px-4 py-8 lg:px-8">
        {storage.conflict || storage.readOnly
          ? <LockedBookPanel conflict={storage.conflict} />
          : storage.loadError
          ? <RecoveryPanel error={storage.loadError} />
          : !storeReady || !storage.ready
            ? <p role="status" className="py-12 text-center text-lg">Đang mở sổ…</p>
            : children}
      </main>
    </div>
  );
}
