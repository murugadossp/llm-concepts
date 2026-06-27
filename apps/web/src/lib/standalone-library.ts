export type StandaloneLesson = {
  number: string;
  title: string;
  summary: string;
  href: string;
  tags: string[];
  kind: "chapter" | "case-study" | "reference";
};

export const langGraphLessons: StandaloneLesson[] = [
  {
    number: "01",
    title: "Contract Review Workflow",
    summary:
      "Build graph architecture, state and persistence, transparency, and workflow control around an interactive contract-review simulator.",
    href: "/library/langgraph/langgraph-contract-review.html",
    tags: ["nodes and edges", "checkpointing", "human-in-the-loop"],
    kind: "chapter",
  },
  {
    number: "02",
    title: "Fundamentals & Quiz",
    summary:
      "Learn state schemas, nodes, edges, conditional routing, visibility, and scalability, then test the mental model.",
    href: "/library/langgraph/langgraph-fundamentals-quiz.html",
    tags: ["state schema", "conditional routing", "quiz"],
    kind: "chapter",
  },
  {
    number: "03",
    title: "Support Ticket Routing",
    summary:
      "Classify incoming tickets, assess urgency, branch into review when confidence is low, and route to a specialist team.",
    href: "/library/langgraph/langgraph-ticket-routing.html",
    tags: ["worked example", "routing", "sample runs"],
    kind: "chapter",
  },
  {
    number: "04",
    title: "Resilient Workflows",
    summary:
      "Keep a legal-document workflow useful through API failures, bad input, and timeouts with fallbacks and observability.",
    href: "/library/langgraph/langgraph-resilient-workflows.html",
    tags: ["error handling", "fallbacks", "observability"],
    kind: "chapter",
  },
  {
    number: "05",
    title: "Multi-Agent Patterns Intro",
    summary:
      "A beginner-friendly map of coordinators, specialist teams, and event-driven collaboration through one refund workflow.",
    href: "/library/langgraph/langgraph-multi-agent-intro.html",
    tags: ["multi-agent", "patterns", "mental model"],
    kind: "chapter",
  },
  {
    number: "06",
    title: "Coordinator Pattern",
    summary:
      "Use one coordinator to keep the full workflow in view, manage dependencies, and route work to specialist agents.",
    href: "/library/langgraph/langgraph-coordinator-pattern.html",
    tags: ["orchestration", "conditional edges", "quiz"],
    kind: "chapter",
  },
  {
    number: "07",
    title: "Specialist Team Pattern",
    summary:
      "Group agents into focused teams with internal coordination and clean interfaces back to the parent graph.",
    href: "/library/langgraph/langgraph-specialist-team-pattern.html",
    tags: ["subgraphs", "team interfaces", "scenarios"],
    kind: "chapter",
  },
  {
    number: "08",
    title: "Event-Driven Collaboration",
    summary:
      "Let events and triggers wake the right agents, fan work out, and coordinate responders without one central sequence.",
    href: "/library/langgraph/langgraph-event-driven-collaboration.html",
    tags: ["events", "fan-out", "subscribers"],
    kind: "chapter",
  },
  {
    number: "09",
    title: "Advanced Multi-Agent Coordination",
    summary:
      "Explore shared understanding, collaborative state, dynamic roles, and adaptive workflow generation.",
    href: "/library/langgraph/langgraph-advanced-coordination.html",
    tags: ["shared state", "dynamic roles", "adaptive planning"],
    kind: "chapter",
  },
  {
    number: "10",
    title: "Pattern Selection Strategy",
    summary:
      "Choose between coordinators, specialist teams, events, and hybrid designs using explicit trade-offs.",
    href: "/library/langgraph/langgraph-pattern-selection.html",
    tags: ["selection strategy", "trade-offs", "production"],
    kind: "chapter",
  },
];

export const standaloneReferences: StandaloneLesson[] = [
  {
    number: "Guide",
    title: "LangGraph Chapter Library",
    summary:
      "The original standalone LangGraph hub with its full sequence, chapter summaries, and case-study entry points.",
    href: "/library/langgraph/index.html",
    tags: ["library index", "standalone"],
    kind: "reference",
  },
  {
    number: "Case Studies",
    title: "System Design Case Studies",
    summary:
      "A dedicated hub for applying LangGraph concepts to larger architecture and system-design exercises.",
    href: "/library/langgraph/case-studies.html",
    tags: ["system design", "practice"],
    kind: "reference",
  },
  {
    number: "Case 01",
    title: "Multi-Agent Market Research",
    summary:
      "Choose the architecture, assemble shared state, inspect agent contracts, route research questions, and design recovery loops.",
    href: "/library/langgraph/case-study-multi-agent-research.html",
    tags: ["interactive decisions", "shared state", "recovery"],
    kind: "case-study",
  },
  {
    number: "Reference",
    title: "LLM → Agent Platform Architecture",
    summary:
      "The interactive technical architecture covering the product stack, content system, data model, authentication, payments, and AI tutor.",
    href: "/library/architecture.html",
    tags: ["Next.js", "MDX", "architecture"],
    kind: "reference",
  },
];

export const standaloneLibraryUrls = [
  ...langGraphLessons.map((lesson) => lesson.href),
  ...standaloneReferences.map((lesson) => lesson.href),
];
