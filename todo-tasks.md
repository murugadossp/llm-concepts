# Todo / decisions log

## Repo context (discovered 2026-06-26)

This worktree (`llm-concepts-frontend`) shares the `llm-concepts` repo. The branch
`codex/unify-lesson-theme-runtime` (current upstream of this work) already has
**uncommitted deletions** of everything under `langgraph/` (HTML chapters, problem
sets, design docs) sitting in the working tree. That looks like in-flight WIP for
unifying the lesson/theme runtime between the native MDX chapters and the standalone
langgraph HTML pages — not something to discard casually. This branch
(`feat/chapter1-revamp`) was cut from that state; the deletions are left untouched
and are not part of any commit made from this branch. Whoever owns that refactor
should reconcile it before merging.

## Deferred: LangGraph sidebar / cross-chapter navigation parity

**Status:** deferred, not started. Revisit after the Chapter 1 (LLM Concepts) revamp below.

**Problem:** LangGraph has 10 chapters plus case studies/reference docs
(`src/lib/standalone-library.ts`), more than LLM Concepts currently has. But they're
static `.html` files in `public/library/langgraph/`, not Next.js routes. Moving
between them means going back out to the `/chapters/langgraph` hub card grid each
time — no prev/next, no sense of position in the 10-chapter sequence. The hub even
marks them "Open interactive chapter ↗" with an external-link icon, which visually
tells the learner they're leaving the app.

**Why it hasn't broken anything yet:** the langgraph HTML pages already share the
exact same CSS variable tokens (`--accent`, `--surface`, `--ink`, etc., same hex
values, light+dark) as `src/styles/tokens.css`, so visually they look native even
though structurally they're outside the React app. The seam is functional
(navigation), not visual.

**Two ways to close the gap, when we pick this up:**

1. **Lightweight** — keep the 10 files as static HTML; inject a shared
   prev/next + chapter-list nav into each page via the existing
   `multi-agent-series.css`/`.js`. Cheap, ships fast. Stays a second, parallel nav
   system outside React permanently.
2. **Real fix** — migrate the 10 langgraph chapters into native Next.js/MDX routes
   under `(learn)/chapters/langgraph/[slug]`, feeding the same `chapters.ts` /
   `ChapterSidebar` pipeline LLM Concepts uses. LangGraph becomes a first-class
   course: same sidebar, theme toggle, quiz component, metadata schema. Bigger lift —
   each page's JS (quiz logic is simple to port; the contract-review simulator and
   ticket-routing pages haven't been inspected yet and may carry more interactive
   logic) needs porting to React.

Recommendation when this is picked up: option 2, for the same reason the sidebar is
worth keeping for LLM Concepts — once you have 10+ chapters, persistent navigation
isn't optional, and a second permanent nav system (option 1) just duplicates
maintenance work later.

## Active: LLM Concepts Chapter 1 revamp (this branch)

Triggered by a content/UX review: Chapter 1 (Tokens → Embeddings → Attention →
Context Windows → Sampling) has real gaps for a true beginner, and only the Tokens
lesson has any interactivity (a mock regex "tokenizer"). Plan:

- [x] Real BPE tokenizer in `TokenizerDemo` (was a regex mock) + live token-count →
      cost estimate.
- [x] `Quiz` MDX component, mechanics ported from `langgraph-fundamentals-quiz.html`
      (click-to-lock options, correct/wrong highlight, running score, reset),
      themed with the existing CSS vars so it matches both light and dark
      automatically.
- [x] One scored quiz added to the end of each existing lesson.
- [x] **Lesson 0 — "What Is an LLM, Really?"**: new intro lesson before tokens.
      Core idea: next-token prediction over a trained model, no jargon yet.
      Interactive: "predict the next word" mini-game — user guesses, then sees the
      model's real top-5 next-token probabilities.
- [x] **Embeddings visualizer**: small preloaded 2D word-map (king/queen/man/woman/
      dog/cat, etc.) — type two words, see a live similarity score, points light up.
      Currently the embeddings lesson has zero interactivity.
- [x] **Attention heatmap visualizer**: canned attention weights for 2–3 example
      sentences — click a token, see which other tokens light up and by how much.
      Currently the attention lesson has zero interactivity.
- [x] **Context-window budget bar**: fixed-width bar representing token budget;
      drag in system prompt / history / retrieved-doc chunks, watch it fill and
      overflow. Currently the context-windows lesson has zero interactivity.
- [x] **Sampling slider**: temperature / top-p / top-k sliders driving a live bar
      chart of next-token probabilities, "regenerate" button. Currently the
      sampling lesson has zero interactivity.
- [x] **Capstone lesson — "Putting It Together"**: animated step-through pipeline
      diagram (tokens → embeddings → attention ×N → logits → sampling → next token
      → loop) + a 5-question scored quiz closing the module.
- [ ] Reusable visual primitives worth extracting once 2+ of the above exist
      (pipeline diagram, heatmap, scatter plot, budget bar) so later chapters
      (RAG, agents) can reuse them instead of one-off components per lesson.
- [ ] Sidebar: `ChapterSidebarShell` hardcodes "Continue" → `/chapters/01-foundations`
      and a static "Current module: Chapter 1 foundations" label. Fine with one
      chapter; will be visibly wrong once chapter 2 exists. Fix by persisting
      `lastVisitedSlug` to `localStorage` (same pattern already used for the
      collapsed/expanded state) before adding chapter 2.
