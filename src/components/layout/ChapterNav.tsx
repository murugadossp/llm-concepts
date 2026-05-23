import Link from "next/link";
import type { ChapterMeta } from "@/lib/chapters";

export function ChapterNav({
  chapter,
  prev,
  next,
}: {
  chapter: ChapterMeta;
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
}) {
  return (
    <nav
      className="glass sticky top-[5.5rem] z-40 mb-8 flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
      aria-label="Chapter navigation"
    >
      <Link href="/chapters" style={{ color: "var(--ink-soft)" }}>
        ← All chapters
      </Link>
      <span style={{ color: "var(--ink-mute)" }}>
        Chapter {chapter.chapterNumber}
      </span>
      <div className="flex gap-3">
        {prev ? (
          <Link href={`/chapters/${prev.slug}`} className="hover:underline" style={{ color: "var(--accent)" }}>
            ← {prev.title.split(":")[0]}
          </Link>
        ) : (
          <span style={{ color: "var(--ink-mute)" }}>← Start</span>
        )}
        {next ? (
          <Link href={`/chapters/${next.slug}`} className="hover:underline" style={{ color: "var(--accent)" }}>
            {next.title.split(":")[0]} →
          </Link>
        ) : (
          <span style={{ color: "var(--ink-mute)" }}>End →</span>
        )}
      </div>
    </nav>
  );
}
