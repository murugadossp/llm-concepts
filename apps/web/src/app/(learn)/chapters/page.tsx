import { CollectionCard } from "@/components/library/CollectionCard";
import { getAllChapters } from "@/lib/chapters";
import { langGraphLessons } from "@/lib/standalone-library";
import { BookOpen, ExternalLink, Network } from "lucide-react";

export default function LearningPathsPage() {
  const llmLessonCount = getAllChapters().length;

  return (
    <div className="site-container py-16">
      <span className="eyebrow-pill">
        <span className="eyebrow-dot" />
        Learning paths
      </span>
      <h1 className="editorial-title mt-5 text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>
        Choose where to begin.
      </h1>
      <p className="mt-5 max-w-[68ch] text-lg leading-8" style={{ color: "var(--ink-soft)" }}>
        Start with how large language models work, or move into graph-based workflows and
        multi-agent coordination. Each path can grow independently without crowding this hub.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <CollectionCard
          href="/chapters/llm-concepts"
          eyebrow="Core learning path"
          title="LLM Concepts"
          description="Build the mental model from tokens, embeddings, and attention toward retrieval, tools, agents, Model Context Protocol, skills, plugins, and safety."
          meta={[`${llmLessonCount} lessons`, "Beginner onward", "Native MDX"]}
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
        />
        <CollectionCard
          href="/chapters/langgraph"
          eyebrow="Workflow learning path"
          title="LangGraph"
          description="Learn stateful graphs through worked workflows, coordination patterns, interactive quizzes, simulations, and system-design case studies."
          meta={[`${langGraphLessons.length} chapters`, "Interactive", "Case studies included"]}
          icon={<Network className="h-6 w-6" aria-hidden />}
        />
      </div>

      <section className="pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="editorial-title text-4xl" style={{ color: "var(--ink)" }}>
            Project architecture &amp; references
          </h2>
          <span className="text-[13px]" style={{ color: "var(--ink-mute)" }}>
            About this learning platform
          </span>
        </div>
        <a
          href="/library/architecture.html"
          className="glass mt-6 block p-6 transition hover:border-[var(--accent)]"
        >
          <span className="lesson-chip">Interactive reference</span>
          <h3 className="mt-4 text-xl font-semibold" style={{ color: "var(--ink)" }}>
            LLM → Agent Platform Architecture
          </h3>
          <p className="mt-2 max-w-[76ch] text-sm leading-7" style={{ color: "var(--ink-soft)" }}>
            Explore the product stack, content system, design tokens, data model, authentication,
            entitlements, payments, AI tutor, rollout phases, and architecture decisions.
          </p>
          <span
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Open architecture reference <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </span>
        </a>
      </section>
    </div>
  );
}
