import { langGraphLessons, standaloneReferences } from "@/lib/standalone-library";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const langGraphResources = standaloneReferences.filter(
  (item) => item.href !== "/library/architecture.html",
);

export default function LangGraphCollectionPage() {
  return (
    <div className="site-container py-16">
      <Link href="/chapters" className="lesson-button">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All learning paths
      </Link>
      <span className="eyebrow-pill mt-8">
        <span className="eyebrow-dot" />
        LangGraph
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        Build workflows that remember, route, and recover.
      </h1>
      <p className="mt-5 max-w-[72ch] text-lg leading-8" style={{ color: "var(--ink-soft)" }}>
        Work through stateful graphs, routing, resilience, multi-agent coordination, and pattern
        selection. The original interactive simulations and quizzes remain intact.
      </p>

      <section className="pt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="editorial-title text-4xl" style={{ color: "var(--ink)" }}>
            Chapters
          </h2>
          <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
            {langGraphLessons.length} interactive chapters
          </span>
        </div>
        <ol className="mt-6 grid gap-5 md:grid-cols-2">
          {langGraphLessons.map((lesson) => (
            <li key={lesson.href}>
              <a href={lesson.href} className="lesson-card block h-full p-6">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="rounded-[var(--r-pill)] px-2.5 py-1 font-mono text-xs font-semibold"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    Chapter {lesson.number}
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: "var(--accent-2)" }}
                  >
                    ● Interactive
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: "var(--ink)" }}>
                  {lesson.title}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
                  {lesson.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span key={tag} className="lesson-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <span
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Open interactive chapter <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="editorial-title text-4xl" style={{ color: "var(--ink)" }}>
            Case studies
          </h2>
          <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
            Apply the patterns to system design
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {langGraphResources.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="glass block p-5 transition hover:border-[var(--accent)]"
            >
              <span className="lesson-chip">{item.number}</span>
              <h3 className="mt-3 text-lg font-semibold" style={{ color: "var(--ink)" }}>
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
                {item.summary}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Open resource <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
