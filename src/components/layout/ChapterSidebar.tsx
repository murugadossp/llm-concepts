import { getAllChapters } from "@/lib/chapters";
import Link from "next/link";

export function ChapterSidebar({ activeSlug }: { activeSlug: string }) {
  const chapters = getAllChapters();

  return (
    <aside className="glass hidden w-64 shrink-0 p-4 lg:block">
      <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-mute)" }}>
        Learning path
      </h2>
      <ol className="mt-4 space-y-2">
        {chapters.map((chapter) => {
          const active = chapter.slug === activeSlug;
          return (
            <li key={chapter.slug}>
              <Link
                href={`/chapters/${chapter.slug}`}
                className="block rounded-[var(--r-sm)] px-2 py-1.5 text-sm"
                style={{
                  background: active ? "var(--surface-strong)" : "transparent",
                  color: active ? "var(--accent)" : "var(--ink-soft)",
                }}
              >
                {chapter.chapterNumber}. {chapter.title.split(":")[0]}
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
