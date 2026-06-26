export default function AboutPage() {
  return (
    <div className="site-container-narrow py-16">
      <span className="eyebrow-pill">
        <span className="eyebrow-dot" />
        About the project
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        A graphic novel for modern AI.
      </h1>
      <p className="mt-6 max-w-[68ch] text-lg leading-8" style={{ color: "var(--ink-soft)" }}>
        LLM → Agent is an interactive learning site about how modern AI works, from tokens to
        multi-agent systems.
      </p>
      <div className="glass mt-8 p-6">
        <p className="m-0 leading-7" style={{ color: "var(--ink-soft)" }}>
          Each lesson starts with intuition, adds precise technical detail, and marks where the
          analogy stops being useful. The goal is not memorization. It is a mental model you can use
          while building.
        </p>
      </div>
    </div>
  );
}
