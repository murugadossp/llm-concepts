---
name: llm-concepts-chapter-writer
description: >
  Generate, revise, outline, or review MDX-ready chapters for the llm-concepts
  learning site. Use this skill for requests about writing chapter drafts,
  turning BLUEPRINT.md outlines into chapter content, creating comic scripts,
  producing lesson sections, shaping deep dives, or checking chapter drafts
  against the project's tone, structure, and MDX conventions.
---

# LLM Concepts Chapter Writer

Use this skill to create consistent chapter drafts for the `llm-concepts` project.
The goal is a polished, MDX-ready learning chapter that feels like a graphic novel
about modern AI, while still giving builders enough precision in the deep dives.

## Source Of Truth

Before generating or revising a chapter, read the project docs from the repository root:

- `BLUEPRINT.md` for audience, tone, chapter outlines, visual language, character roles, and content conventions.
- `ARCHITECTURE.md` for frontmatter, MDX/component contracts, route assumptions, and technical constraints.

Do not duplicate large sections of those docs in the output. Use them to make chapter-specific decisions.

If the docs disagree, follow this rule from the project:

- `ARCHITECTURE.md` wins for technical and MDX implementation questions.
- `BLUEPRINT.md` wins for content, tone, teaching flow, and visual direction.

## Workflow

1. Identify the target chapter number, title, difficulty, read time, promise, comic premise, concepts, diagrams, table, deep dives, and remember-card bullets from `BLUEPRINT.md`.
2. Check `ARCHITECTURE.md` for the current frontmatter contract and component names.
3. Produce an MDX-ready draft using the required chapter structure below.
4. Use component placeholders for repeated learning patterns; do not wait for final component implementations.
5. End with a short self-review noting any assumptions, TODOs, or source links that still need verification.

## Required Chapter Structure

Generate chapter drafts in this order:

1. YAML frontmatter matching the current contract in `ARCHITECTURE.md`.
2. Chapter promise as the opening line.
3. TL;DR section with exactly 3 bullets.
4. Comic script section with 2-4 panels, including characters, setting, dialogue, visual action, and the teaching point of each panel.
5. Concept sections. Each concept should include:
   - Heading
   - Plain-English explanation
   - An `<ELI5Card>` placeholder
   - A diagram or infographic brief when useful
   - A collapsed `<DeepDive>` placeholder when technical detail is appropriate
6. One comparison table when the chapter outline calls for it.
7. Try-it prompt or interactive widget spec.
8. Remember card with concise takeaways.
9. Further reading placeholders with source categories or known canonical sources to verify later.

## Component Placeholder Style

Prefer readable placeholders that are easy to replace with real components later:

```mdx
<ComicStrip>
  {/* Panel scripts go here until final SVG art is produced. */}
</ComicStrip>

<ELI5Card title="Plain-English idea">
  Short explanation for non-technical readers.
</ELI5Card>

<DeepDive title="Technical detail">
  Builder-focused explanation, math, code, or edge cases.
</DeepDive>

<CompareTable
  columns={["Concept", "What it means", "When to use it"]}
  rows={[]}
/>

<RememberCard>
  Three to five sticky takeaways.
</RememberCard>
```

Use placeholders for diagram briefs too. Final inline SVGs can come in a later visual pass.

## Writing Rules

- Write for mixed audiences using progressive disclosure: comic hook, core explanation, then collapsed builder detail.
- Use conversational, precise, active voice with short sentences.
- Do not use the words "simply" or "just".
- Expand every acronym on first use within the chapter.
- Define jargon before relying on it.
- Prefer one concrete example over three abstract examples.
- Every analogy must include a brief note on where the analogy breaks down.
- Humor is welcome, but never at the reader's expense.
- Keep chapter content aligned with the planned difficulty and estimated read time.
- Preserve the recurring cast and their roles from `BLUEPRINT.md`.
- Use TypeScript as the default code sample language; use Python only where the outline or topic makes Python clearer.

## Self-Review Checklist

Before finishing, check and report:

- No "simply" or "just".
- Acronyms are expanded on first use.
- Analogies include limits.
- Beginner layer and builder layer are both present.
- Frontmatter follows `ARCHITECTURE.md`.
- The chapter matches the `BLUEPRINT.md` outline and planned difficulty.
- Component placeholders are valid MDX-shaped blocks, not prose-only descriptions.
- Any factual claims that need current-source verification are marked as TODO rather than invented.

## Output Modes

- For "generate chapter" requests, output the full MDX-ready draft.
- For "outline chapter" requests, output the same structure with concise bullets instead of full prose.
- For "revise chapter" requests, preserve existing structure unless the user asks for a rewrite.
- For "review chapter" requests, lead with issues ordered by severity, then give targeted edits.
