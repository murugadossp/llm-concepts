export default function PricingPage() {
  return (
    <div className="site-container py-16">
      <span className="eyebrow-pill">
        <span className="eyebrow-dot" />
        Simple for the content MVP
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        Learn freely now. Go deeper later.
      </h1>
      <p className="mt-5 max-w-[64ch] text-lg leading-8" style={{ color: "var(--ink-soft)" }}>
        Milestone 1 is free. The Pro tier ships only after the learning experience proves useful.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="lesson-card p-7">
          <span className="lesson-chip">Available now</span>
          <h2 className="editorial-title mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            Free
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
            Flagship chapters and interactive lessons during the Content MVP.
          </p>
        </div>
        <div className="lesson-card p-7">
          <span className="lesson-chip">Coming later</span>
          <h2 className="editorial-title mt-4 text-3xl" style={{ color: "var(--ink)" }}>
            Pro
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
            All chapters, saved learning tools, and AI tutor credits in Milestone 2.
          </p>
        </div>
      </div>
    </div>
  );
}
