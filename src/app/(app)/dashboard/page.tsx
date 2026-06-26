export default function DashboardPage() {
  return (
    <div className="site-container py-16">
      <span className="eyebrow-pill">
        <span className="eyebrow-dot" />
        Learning workspace
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        Your path, when accounts arrive.
      </h1>
      <div className="glass mt-8 grid gap-6 p-6 md:grid-cols-[1.4fr_.6fr]">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
            Chapter 1 · Foundations
          </p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
            Authenticated progress, bookmarks, and notes ship in Milestone 2.
          </p>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full"
            style={{ background: "var(--surface-muted)" }}
          >
            <div
              className="h-full w-1/5 rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
            />
          </div>
        </div>
        <div
          className="rounded-[var(--r-md)] border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--ink-mute)" }}
          >
            Next lesson
          </p>
          <p className="mt-2 font-semibold" style={{ color: "var(--ink)" }}>
            What Is a Token?
          </p>
        </div>
      </div>
    </div>
  );
}
