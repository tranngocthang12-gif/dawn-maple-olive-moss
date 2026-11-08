import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useDesk } from "@/foundation/store";

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

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const setReady = useDesk((s) => s.setReady);

  useEffect(() => {
    const pending = useDesk.persist.rehydrate();
    if (pending instanceof Promise) {
      void pending.then(() => setReady(true));
      return;
    }
    setReady(true);
  }, [setReady]);

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
      <main className="px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
