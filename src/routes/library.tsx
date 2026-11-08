import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Stamp } from "@/components/ui";
import { books, groups, type BookClass, type BookGroup } from "@/foundation/books";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "CHỈNAM — Thư viện" }] }),
  component: LibraryPage,
});

const classes: BookClass[] = ["FOUNDATION", "ADVANCED", "COUNTERPOINT", "HISTORICAL"];

function LibraryPage() {
  const [group, setGroup] = useState<BookGroup | "all">("all");
  const [klass, setKlass] = useState<BookClass | "all">("all");
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return books.filter((b) => {
      if (group !== "all" && b.group !== group) return false;
      if (klass !== "all" && b.klass !== klass) return false;
      if (!query) return true;
      return `${b.title} ${b.authors}`.toLowerCase().includes(query);
    });
  }, [group, klass, q]);

  return (
    <div>
      <div className="max-w-3xl">
        <PageHeader
          kicker={`Kệ ${books.length} đầu · Phase 1 mới là thư mục`}
          title="Sách không phải sự thật."
          lede="Mỗi đầu có lớp và một giới hạn sử dụng. Không có tóm tắt được gán cho tác giả. Không trường phái nào thành chân lý. Có kệ không có nghĩa là đã hiểu, và đã hiểu không có nghĩa là có lợi thế."
        />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <input
          className="w-full max-w-md border border-line bg-bg px-3 py-2.5 text-sm"
          placeholder="Tìm nhan đề hoặc tác giả"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto">
          <Chip on={group === "all"} click={() => setGroup("all")} label="Mọi nhóm" />
          {groups.map((g) => (
            <Chip key={g.id} on={group === g.id} click={() => setGroup(g.id)} label={g.name} />
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Chip on={klass === "all"} click={() => setKlass("all")} label="Mọi lớp" />
          {classes.map((c) => (
            <Chip key={c} on={klass === c} click={() => setKlass(c)} label={c} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm tabular-nums text-muted">{shown.length} đầu trong bộ lọc</p>
      <ul className="mt-4 grid gap-3 lg:grid-cols-2">
        {shown.map((b) => (
          <li key={b.id} className="border border-line p-4">
            <div className="flex flex-wrap gap-2">
              <Stamp tone={b.klass === "COUNTERPOINT" ? "accent" : b.klass === "FOUNDATION" ? "solid" : "muted"}>{b.klass}</Stamp>
              <Stamp>{groups.find((g) => g.id === b.group)?.name}</Stamp>
            </div>
            <h2 className="mt-3 font-serif text-xl">{b.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {b.authors} · {b.year}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{b.limit}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ on, click, label }: { on: boolean; click: () => void; label: string }) {
  return (
    <button type="button" onClick={click} className={`shrink-0 border px-3 py-2 text-xs ${on ? "border-accent text-fg" : "border-line text-muted"}`}>
      {label}
    </button>
  );
}
