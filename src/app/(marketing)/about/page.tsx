export default function AboutPage() {
  return (
    <div className="mx-auto w-[min(100%-2rem,var(--maxw-content))] px-4 py-12">
      <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
        About
      </h1>
      <p className="mt-4 leading-7" style={{ color: "var(--ink-soft)" }}>
        LLM → Agent is an interactive learning site — a graphic novel about how modern AI works,
        from tokens to multi-agent systems.
      </p>
    </div>
  );
}
