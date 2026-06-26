import type { ChapterMeta } from "@/lib/chapters";
import Link from "next/link";

export function ChapterNav({
  chapter,
  prev,
  next,
}: {
  chapter: ChapterMeta;
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
}) {
  const chapterLabel =
    chapter.lessonNumber && chapter.lessonNumber > 0
      ? `Chapter ${chapter.chapterNumber}.${chapter.lessonNumber}`
      : `Chapter ${chapter.chapterNumber}`;

  return (
    <nav
      className="sticky top-[73px] z-40 -mx-1 mb-4 flex flex-wrap items-center justify-between gap-3 border-b px-2 py-3 text-[13px]"
      style={{ background: "var(--bg-base)", borderColor: "var(--border)" }}
      aria-label="Chapter navigation"
    >
      <Link
        href="/chapters"
        className="rounded-lg px-2 py-1 hover:bg-[var(--surface-hover)]"
        style={{ color: "var(--ink-soft)" }}
      >
        ← All chapters
      </Link>
      <span className="hidden sm:inline" style={{ color: "var(--ink-mute)" }}>
        {chapterLabel}
      </span>
      <div className="flex gap-1">
        {prev ? (
          <Link
            href={`/chapters/${prev.slug}`}
            className="rounded-lg px-2 py-1 hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--accent)" }}
          >
            ← <span className="hidden md:inline">{prev.title.split(":")[0]}</span>
          </Link>
        ) : (
          <span style={{ color: "var(--ink-mute)" }}>← Start</span>
        )}
        {next ? (
          <Link
            href={`/chapters/${next.slug}`}
            className="rounded-lg px-2 py-1 hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--accent)" }}
          >
            <span className="hidden md:inline">{next.title.split(":")[0]}</span> →
          </Link>
        ) : (
          <span style={{ color: "var(--ink-mute)" }}>End →</span>
        )}
      </div>
    </nav>
  );
}
