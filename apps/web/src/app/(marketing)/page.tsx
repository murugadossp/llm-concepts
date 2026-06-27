import { ArrowRight, BookOpen, BrainCircuit, Route } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Understand",
    body: "Build a plain-English model before touching the machinery.",
  },
  {
    icon: BrainCircuit,
    title: "Connect",
    body: "See how tokens, vectors, attention, tools, and agents fit together.",
  },
  {
    icon: Route,
    title: "Apply",
    body: "Use interactive examples to turn recognition into working intuition.",
  },
];

export default function HomePage() {
  return (
    <div className="pb-8">
      <section className="site-container pt-[72px]">
        <span className="eyebrow-pill">
          <span className="eyebrow-dot" />
          Interactive learning path · foundations now live
        </span>
        <h1
          className="editorial-title mt-5 max-w-4xl text-[clamp(3rem,7vw,5rem)]"
          style={{ color: "var(--ink)" }}
        >
          From a single <em style={{ color: "var(--accent)" }}>token</em>
          <br />
          to an army of agents.
        </h1>
        <p
          className="mt-5 max-w-[66ch] text-[clamp(1.05rem,2.2vw,1.25rem)] leading-8"
          style={{ color: "var(--ink-soft)" }}
        >
          A visual, hands-on journey through modern AI. Learn the concepts, inspect the diagrams,
          and build a mental model that survives contact with real systems.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/chapters/01-1-tokens" className="lesson-button lesson-button-primary">
            Start with tokens <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/chapters" className="lesson-button">
            Browse chapters
          </Link>
        </div>
      </section>

      <section className="site-container pt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="editorial-title text-3xl sm:text-4xl" style={{ color: "var(--ink)" }}>
            The thread running through it
          </h2>
          <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
            One idea builds into the next
          </span>
        </div>
        <div className="glass grid gap-5 p-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
                style={{
                  background: "color-mix(in srgb, var(--accent) 13%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                  {title}
                </h3>
                <p className="mt-1 text-[13px] leading-6" style={{ color: "var(--ink-soft)" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
