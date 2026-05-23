---
name: llm-concepts-chapter-writer
description: >
  Generate, revise, outline, or review MDX-ready chapters for the llm-concepts
  learning site. Trigger on requests like "write Chapter N", "draft a lesson
  on agents", "outline the MCP chapter", "make a chapter about tokenizers",
  "review my chapter draft", "turn the BLUEPRINT outline for Chapter X into a
  draft", or "add a new lesson on skills/plugins/RAG/tools".
---

# LLM Concepts Chapter Writer

Use this skill to create consistent chapters for `llm-concepts`: a graphic-novel-style
learning site that teaches large language models, tools, agents, Model Context Protocol
(MCP), Skills, Plugins, orchestration, and safety.

## Source Of Truth

Read from the repository root before generating or revising:

- `BLUEPRINT.md` for audience, tone, chapter outlines, visual language, characters, and content conventions.
- `ARCHITECTURE.md` for MDX/frontmatter contracts, component names, milestone rules, and gating behavior.

Tie-breaker: `ARCHITECTURE.md` wins for technical/MDX questions; `BLUEPRINT.md` wins for content, tone, teaching flow, and visual direction.

## Stable Project Rules

### Milestones And Gating

- Milestone 1 Content MVP: only Chapters 1, 6, and 7 ship; all are free. Chapter 7 (MCP) is free during Content MVP.
- Milestone 2 SaaS v1: remaining chapters ship; Pro chapters use explicit `<FreePreview>` / `<ProOnly>` boundaries.
- Do not add `<ProOnly>` to Chapter 7 unless the user is explicitly preparing the SaaS v1 conversion.
- Chapters without `<ProOnly>` are implicitly free.

**Chapter tier map** (canonical, per BLUEPRINT decisions log):

| Chapter | Content MVP (M1) | SaaS v1 (M2) |
|---------|------------------|--------------|
| 1 Foundations | free | free |
| 2 Training | — | free |
| 3 Prompting | — | free |
| 4 Memory & RAG | — | free |
| 5 Tools | — | free |
| 6 Agents | free | pro |
| 7 MCP | free | pro (with 7-day grace email to prior readers) |
| 8 Skills | — | pro |
| 9 Plugins | — | pro |
| 10 Subagents | — | pro |
| 11 Patterns & Safety | — | pro |

- For Pro chapters, author the teaser deliberately:

```mdx
<FreePreview>
  {/* Comic hook, TL;DR, and enough value to make the chapter useful as a preview. */}
</FreePreview>

<ProOnly fallback={<Paywall reason="upgrade" chapterSlug="CHAPTER-SLUG" />}>
  {/* Paid sections, deep dives, exercises, or premium examples. */}
</ProOnly>
```

### Recurring Cast

- Tess the Token: a single token; friendly rounded glass square holding a text snippet.
- Vector the Embedding: vector-space guide; arrow-bodied character pointing across dimensions.
- Atlas the Agent: agent hero; glass tool-belt with hammer and magnifier.
- MCP-Mae: MCP server; switchboard operator with glowing patch cables.
- Skill-Sam: Skill folder; opens to reveal a `SKILL.md` page.
- Plug-Pip: Plugin bundle; three-prong plug carrying skills, MCP servers, and commands.
- The Orchestrator: multi-agent conductor; baton and specialist agents.
- Halu the Hallucination: safety foil; translucent uncertainty figure with question marks.

Preserve names and roles. Do not invent replacement mascots unless the user asks.

### Frontmatter Contract

Use this shape, adjusting values per chapter:

```yaml
---
slug: "01-foundations"
title: "Foundations: Tokens, Embeddings, Attention"
chapterNumber: 1
section: "foundations" # foundations | core | modern-stack | safety
difficulty: "beginner" # beginner | intermediate | advanced
estimatedMinutes: 12
tier: "free" # free | pro (per chapter tier map above)
prereqs: []
characters: ["Tess", "Vector"]
ogImageVariant: "foundations"
suggestedPrompts:
  - "Can you explain tokens with a concrete example?"
  - "How are embeddings different from token IDs?"
  - "Why does attention matter?"
updatedAt: "TODO: today's date in YYYY-MM-DD"
authors: ["murugadoss"]
summary: >
  One-sentence chapter summary for cards, metadata, and tutor context.
---
```

Pick `prereqs` from earlier chapter slugs, usually the immediately preceding 1-2 relevant chapters. Generate 3-5 `suggestedPrompts` a learner might ask the AI tutor. Set `updatedAt` to the current date in YYYY-MM-DD format.

## Workflow

1. Identify the target chapter number, title, difficulty, read time, promise, comic premise, concepts, diagrams, comparison table, deep dives, and remember-card bullets from `BLUEPRINT.md`.
2. Check the current milestone and chapter tier (see tier map) before adding `<FreePreview>` / `<ProOnly>`.
3. Generate frontmatter, including `suggestedPrompts` and sensible `prereqs`.
4. Draft the chapter in progressive layers: comic hook, core explanation, collapsed builder detail.
5. Add at least one forward-reference to a later chapter and one back-reference to an earlier chapter when applicable. Chapter 1 only needs forward-references.
6. Use component placeholders that look like MDX, not prose instructions.
7. End with a short draft self-review or, for review mode, severity-ranked findings.

## Required Chapter Structure

Generate chapter drafts in this order:

1. YAML frontmatter.
2. Chapter promise as the opening line.
3. TL;DR section with exactly 3 bullets.
4. Comic script with 2-4 panels; each panel includes character, setting, visual action, dialogue, and teaching point.
5. Concept sections. Each concept includes plain-English explanation, `<ELI5Card>`, a diagram/infographic brief when useful, and `<DeepDive>` when builder detail is appropriate.
6. One comparison table when the chapter outline calls for it.
7. Try-it prompt or interactive widget spec.
8. Remember card.
9. Where This Shows Up Later / Earlier cross-reference section.
10. Read More section with primary-source placeholders or verified URLs only.

## Component Placeholder Catalog

Prefer these shapes until real components are implemented:

```mdx
<ComicStrip>
  <ComicPanel character="Tess" title="Panel title">
    <SpeechBubble speaker="Tess">Dialogue text.</SpeechBubble>
    **Visual action:** Art direction.
    **Teaching point:** Learning point.
  </ComicPanel>
</ComicStrip>

<PersonaStrip characters={["Tess", "Vector"]} />

<ELI5Card title="Plain-English idea">
  Beginner-friendly explanation.
</ELI5Card>

<DeepDive title="Technical detail">
  Builder-focused explanation, math, code, or edge cases.
</DeepDive>

<Callout variant="tip" title="Useful distinction">
  Tip, warning, myth correction, or analogy limit.
</Callout>

<Infographic title="Diagram title">
  **Diagram brief:** Describe the eventual inline SVG, labels, arrows, and accessible text.
</Infographic>

<FlowDiagram title="Flow title">
  **Flow brief:** Nodes, arrows, labels, and interaction notes.
</FlowDiagram>

<CompareTable
  columns={["Concept", "What it means", "When to use it"]}
  rows={[]}
/>

<CodeTabs
  tabs={[
    { label: "TypeScript", language: "ts", code: `// TypeScript example` },
    { label: "Python", language: "py", code: `# Python example` }
  ]}
/>

<CodeBlock language="ts">
{`// Focused code example`}
</CodeBlock>

<Chip tone="accent">Beginner</Chip>

<RememberCard>
  - Three to five sticky takeaways.
</RememberCard>
```

Use TypeScript as the default code language. Use Python where the outline or ML topic makes it clearer. Use `CodeTabs` when showing both.

## Writing Rules

- Write for mixed audiences using progressive disclosure.
- Use conversational, precise, active voice with short sentences.
- Do not use the words "simply" or "just".
- Expand every acronym on first use in the chapter and wrap it in `<abbr title="Full phrase">ACRONYM</abbr>`.
- Define jargon before relying on it.
- Prefer one concrete example over three abstract examples.
- Every analogy must include a brief note on where it breaks down, usually in a `Callout` with `variant="myth"` or `variant="tip"`.
- Humor is welcome, never at the reader's expense.
- Keep content aligned with the planned difficulty and estimated read time.
- Diagrams need text equivalents in prose and accessible labels in the eventual SVG brief.
- Further reading should use primary sources, URLs only, no external embeds. If unverified, leave `TODO: verify source URL`.

## Minimal MDX Spine

```mdx
---
slug: "XX-slug"
title: "Chapter Title"
chapterNumber: 0
section: "core"
difficulty: "intermediate"
estimatedMinutes: 10
tier: "free"
prereqs: []
characters: ["Atlas"]
ogImageVariant: "default"
suggestedPrompts: []
updatedAt: "TODO: today's date"
authors: ["murugadoss"]
summary: >
  Summary.
---

Chapter promise.

## TL;DR

- One.
- Two.
- Three.

<ComicStrip>{/* panels */}</ComicStrip>

## 1. Concept

Core explanation.

<ELI5Card title="Idea">Beginner layer.</ELI5Card>

<DeepDive title="Builder detail">Technical layer.</DeepDive>

<RememberCard>{/* takeaways */}</RememberCard>
```

## Self-Review Checklist

Before finishing a generated or revised chapter, check and report:

- Banned-word scan for "simply" and "just" passes.
- Acronyms use `<abbr title="...">...</abbr>` on first use.
- Analogies include limits.
- Beginner and builder layers are both present.
- Frontmatter follows the contract, including `suggestedPrompts`.
- `prereqs`, `tier`, and gating match the current milestone and chapter tier map.
- Character names and roles match the roster.
- Cross-references include forward/back links where applicable.
- Component placeholders are MDX-shaped blocks.
- Further reading uses verified primary-source URLs or TODO placeholders.

## Output Modes

- Generate chapter: output the full MDX-ready draft.
- Outline chapter: output the same structure with concise bullets instead of full prose.
- Revise chapter: preserve existing structure unless the user asks for a rewrite.
- Review chapter: use this shape:
  - Findings first, ordered P0/P1/P2/P3 with file/line references when available.
  - Positive Notes.
  - Top Recommendation.
  - Targeted edit suggestions or patch plan.
