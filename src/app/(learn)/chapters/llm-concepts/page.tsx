import { getChapterTree } from "@/lib/chapters";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LlmConceptsCollectionPage() {
  const chapters = getChapterTree();

  return (
    <div className="site-container py-16">
      <Link href="/chapters" className="lesson-button">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All learning paths
      </Link>
      <span className="eyebrow-pill mt-8">
        <span className="eyebrow-dot" />
        LLM Concepts
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        From text fragments to capable agents.
      </h1>
      <p className="mt-5 max-w-[70ch] text-lg leading-8" style={{ color: "var(--ink-soft)" }}>
        Follow the sequence for a complete mental model, or open the lesson that answers the
        question in front of you.
      </p>

      <ul className="mt-12 grid gap-5">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/chapters/${chapter.slug}`}
              className="lesson-card block p-6 sm:p-7"
              style={{ color: "var(--ink)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className="rounded-[var(--r-pill)] px-2.5 py-1 font-mono text-xs font-semibold"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  Chapter {String(chapter.chapterNumber).padStart(2, "0")}
                </span>
                <span
                  className="rounded-[var(--r-pill)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{
                    background: "color-mix(in srgb, var(--accent-2) 14%, transparent)",
                    color: "var(--accent-2)",
                  }}
                >
                  ● Live
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold" style={{ color: "var(--ink)" }}>
                {chapter.title}
              </h2>
              <p
                className="mt-2 max-w-[78ch] text-sm leading-6"
                style={{ color: "var(--ink-soft)" }}
              >
                {chapter.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="lesson-chip">{chapter.difficulty}</span>
                <span className="lesson-chip">~{chapter.estimatedMinutes} min overview</span>
                <span className="lesson-chip">{chapter.lessons.length} lessons</span>
              </div>
              <span
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Open chapter <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>

            {chapter.lessons.length > 0 ? (
              <ol className="mt-3 grid gap-2 md:grid-cols-2">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/chapters/${lesson.slug}`}
                      className="glass flex h-full items-center justify-between gap-4 px-4 py-3 text-sm transition hover:border-[var(--accent)]"
                      style={{ color: "var(--ink)" }}
                    >
                      <span>
                        <span className="mr-2 font-mono text-xs" style={{ color: "var(--accent)" }}>
                          {chapter.chapterNumber}.{lesson.lessonNumber}
                        </span>
                        {lesson.navTitle ?? lesson.title}
                      </span>
                      <span className="shrink-0 text-xs" style={{ color: "var(--ink-mute)" }}>
                        ~{lesson.estimatedMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
