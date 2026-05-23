export default function PricingPage() {
  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-wide))] px-4 py-12">
      <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
        Pricing
      </h1>
      <p className="mt-4" style={{ color: "var(--ink-soft)" }}>
        Milestone 1 is free. Pro tier ($19/mo) ships with Milestone 2 after the engagement gate.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="glass p-6">
          <h2 className="font-semibold" style={{ color: "var(--ink)" }}>
            Free
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            Flagship chapters during Content MVP.
          </p>
        </div>
        <div className="glass-strong p-6">
          <h2 className="font-semibold" style={{ color: "var(--ink)" }}>
            Pro
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            All chapters + AI tutor credits — coming in Milestone 2.
          </p>
        </div>
      </div>
    </div>
  );
}
