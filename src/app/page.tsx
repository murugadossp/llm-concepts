import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-wide))] px-4 py-12">
      <section className="glass-strong mx-auto max-w-3xl px-8 py-12 text-center">
        <p className="text-sm font-medium uppercase tracking-widest" style={{ color: "var(--accent-2)" }}>
          Milestone 1 — Content MVP
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--ink)" }}>
          From a single token to an army of agents
        </h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Learn how modern LLMs work through glassmorphism chapters, comics, and interactive widgets.
          Theme system is live — toggle light, dark, or system in the header.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chapters"
            className="glass-strong inline-flex rounded-[var(--r-pill)] px-6 py-3 text-sm font-semibold"
            style={{ color: "var(--ink)" }}
          >
            Browse chapters
          </Link>
          <Link
            href="/chapters/01-foundations"
            className="inline-flex rounded-[var(--r-pill)] px-6 py-3 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Start Chapter 1
          </Link>
        </div>
      </section>
    </div>
  );
}
