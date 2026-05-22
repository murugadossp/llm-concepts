# LLM → Agent: A-to-Z Interactive Learning Site

**Project codename:** `llm-concepts`
**Author:** Murugadoss
**Status:** Design doc / pre-build blueprint
**Last updated:** 2026-05-22

---

## 1. North Star

A self-contained, browser-openable mini-site that takes a curious reader from "what is a token?" all the way to "how do I orchestrate multi-agent systems with MCP, Skills, and Plugins?" — using **comic-book illustrations, infographics, tables, and progressive-disclosure deep-dives** so it sticks in memory.

The site should feel like a *graphic novel about how modern AI works*, not a textbook.

### Success criteria

A reader who scrolls through every chapter walks away able to:

1. Explain in plain English what an LLM is, how it's trained, and how it generates text.
2. Draw the difference between *prompting*, *RAG*, *tool use*, and *agentic loops*.
3. Sketch the MCP client/server architecture from memory.
4. Explain what a Skill is, what a Plugin is, and how they're different.
5. Pick the right agent pattern (single, orchestrator-worker, router, evaluator) for a given problem.
6. Spot a hallucination risk and name at least three guardrails.

If a non-technical PM and a senior ML engineer can *both* read the same page and each walk away with something, we win.

---

## 2. Audience & Tone

**Primary:** "Mixed — progressive disclosure."

Every chapter has three layers, stacked top-to-bottom:

| Layer | Who it's for | Format |
|-------|--------------|--------|
| **Comic / hook** | Everyone, including non-technical readers | Illustrated SVG panel, 2–4 frames, opens with a relatable analogy |
| **Core explanation** | Curious devs, PMs, designers | Plain prose + infographic + 1 table. No jargon without a definition. |
| **Deep dive** *(collapsed by default)* | ML engineers, builders | Technical detail, code snippets, references, edge cases |

**Tone rules:**

- Conversational but precise. Active voice. Short sentences.
- Never say "simply" or "just" — what's simple to us isn't to the reader.
- Every acronym is expanded on first use *in that chapter*.
- Every analogy is *grounded* — we say "this analogy breaks down because…" so readers don't carry a flawed mental model forward.
- Humor is welcome but never at the reader's expense.

---

## 3. Information architecture

> **Technical file layout (Next.js 15 + MDX) lives in [ARCHITECTURE.md §3](./ARCHITECTURE.md).** This section defines *content-level* architecture — what the hub does, what every chapter page contains, how navigation flows.

**Hub (the landing page at `/`):**

- Hero panel: stylized "From a single token to an army of agents" headline on a frosted-glass card floating over a gradient mesh, with a restyled SVG of the learning journey (Tess the Token → Atlas the Agent).
- "Learning path" visualization: a snaking glass-road with 11 numbered milestones, each clickable, with checkmark badges for chapters the signed-in user has completed.
- Chapter grid: 11 glass cards. Each card has a restyled character icon, title, one-line teaser, estimated read time, difficulty badge (Beginner / Intermediate / Advanced), and a tier chip (Free / Pro).
- Theme toggle in the header (light / dark / system).
- Header CTAs: "Sign in" + "Upgrade to Pro" (the latter swaps for "Dashboard" once signed in).
- Footer: "How to use this site" (linear vs. lookup), credits, last-updated date, status page link.

**Per-chapter page skeleton:**

1. **Sticky top nav** — back to hub, prev/next chapter, progress dot indicator.
2. **Chapter hero** — chapter number, title, one-sentence promise, hand-drawn SVG hero illustration.
3. **TL;DR card** — 3 bullets, what you'll learn.
4. **Comic strip** — 2–4 panels introducing the core concept via analogy.
5. **Concept sections** — each concept has: heading, ELI5 speech bubble, core explanation, infographic/diagram, deep-dive `<details>`.
6. **Comparison table** — when the chapter introduces multiple related concepts.
7. **Remember card** — visual cheat-sheet of the chapter's takeaways.
8. **Try-it prompt** — a small interactive widget OR a "try this prompt yourself" callout.
9. **Bottom nav** — prev/next chapter, return to hub.

---

## 4. Visual design system

The site uses **modern glassmorphism** — frosted surfaces, gradient mesh backgrounds, subtle shadows, ample whitespace — in both **light** and **dark** themes, toggleable per user, with system-preference detection on first load.

The recurring cast of characters (§4.4) is preserved as a memorability asset — they're restyled with cleaner vector lines, soft gradients, and a glass-compatible palette so they sit naturally on frosted surfaces in either theme.

> **The technical implementation** (CSS variable tokens, `<ThemeProvider>`, switcher, persistence, server-side hydration) lives in [ARCHITECTURE.md §4](./ARCHITECTURE.md). This section defines the *visual language* and *component contracts* that the implementation must deliver.

### 4.1 Palette

**Light theme — "Daybreak"**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#F4F6FB` | Page background (mesh on top) |
| `--bg-mesh-1/2/3` | `#E0DCFF` / `#D1F0EC` / `#FFE4D6` | Gradient mesh blobs (violet / teal / coral) |
| `--surface` | `rgba(255,255,255,0.55)` | Frosted glass card |
| `--surface-strong` | `rgba(255,255,255,0.75)` | Raised glass card |
| `--border` | `rgba(255,255,255,0.65)` | Glass border (1px) |
| `--ink` / `--ink-soft` / `--ink-mute` | `#0F1226` / `#3D3F62` / `#6B6E8E` | Text hierarchy |
| `--accent` / `--accent-2` | `#5B3FFF` / `#1FB5A8` | Primary / secondary accents |
| `--warn` / `--sun` | `#E5484D` / `#F5B945` | Warning / highlight |

**Dark theme — "Midnight"**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0A0B1A` | Page background |
| `--bg-mesh-1/2/3` | `#3B2A78` / `#0F4D49` / `#6B2A2A` | Gradient mesh blobs (jewel-tone) |
| `--surface` | `rgba(255,255,255,0.06)` | Frosted glass card |
| `--surface-strong` | `rgba(255,255,255,0.10)` | Raised glass card |
| `--border` | `rgba(255,255,255,0.12)` | Glass border |
| `--ink` / `--ink-soft` / `--ink-mute` | `#F2F3FB` / `#C2C5DC` / `#8B8FAD` | Text hierarchy |
| `--accent` / `--accent-2` | `#8D79FF` / `#4DDBCB` | Lifted for dark-mode contrast |
| `--warn` / `--sun` | `#FF6B6B` / `#FFD56B` | Warning / highlight |

**Shared scales**

- Blur: `--blur-soft: 16px`, `--blur-strong: 28px`
- Radius: `--r-sm: 10px`, `--r-md: 16px`, `--r-lg: 24px`, `--r-pill: 999px`
- Shadows: `--shadow-card`, `--shadow-elevated` (theme-aware)

Both palettes are verified for contrast ≥ 4.5:1 on body text.

### 4.2 Typography

- **Display / headings:** `"Instrument Serif"` or `"Fraunces"` 800 — elegant editorial serif, used sparingly for chapter titles and hero
- **Body:** `"Inter"`, system-ui — weights 400 / 500 / 600
- **Mono / code:** `"JetBrains Mono"`, ui-monospace
- **Comic dialogue:** `"Caveat"` or `"Patrick Hand"` — hand-drawn font *preserved* but scoped to speech bubbles inside comic panels only

Fonts loaded via Google Fonts with `display=swap` in the Next.js root layout.

### 4.3 Component library

Implemented as React components in `/src/components` (see ARCHITECTURE.md §3). The visual contracts:

| Component | Look in glassmorphism |
|-----------|----------------------|
| `ComicPanel` | Frosted glass card with translucent border, restyled character SVG inside, soft drop-shadow |
| `ComicStrip` | Row of 2–4 panels; horizontal snap-scroll on mobile |
| `SpeechBubble` | Glass bubble with tail, hand-drawn dialogue font |
| `ELI5Card` | Glass card with violet glow accent + 🧒 chip |
| `DeepDive` | `<details>` styled as a collapsible glass panel; accent border-glow when open |
| `Infographic` | Centered SVG, glass background, captions below |
| `CompareTable` | Glass surface, zebra rows via alternating alpha, sticky header |
| `RememberCard` | Glass card with sun-yellow border-glow + 💡 chip |
| `FlowDiagram` | SVG with translucent connectors, glowing nodes |
| `CodeBlock` | Semantic dark glass in both themes; JetBrains Mono; copy button |
| `CodeTabs` | Tabbed TS / Python variants |
| `Chip` | Pill, tinted glass, color by category |
| `Callout` | Glass left-border accent; variants `warn` / `tip` / `myth` |
| `PersonaStrip` | Row of small character avatars on a glass bar |
| `Paywall` | Premium frosted gradient card with upgrade CTA (Pro tier) |
| `ThemeToggle` | Header pill with light / dark / system options |

### 4.4 Recurring characters (restyled for glass)

The cast is **unchanged** — Tess the Token, Vector the Embedding, Atlas the Agent, MCP-Mae, Skill-Sam, Plug-Pip, the Orchestrator, Halu the Hallucination. Their roles, personalities, and chapter appearances stay exactly as below.

**Restyle brief:**

- Cleaner vector outlines (1.5–2px instead of 3px)
- Soft gradient fills instead of flat color blocks
- Theme-aware: warm pastel gradients in light mode, jewel-tone gradients in dark mode
- Drop shadow as soft blur, not a hard offset
- Faces and props preserved (Atlas's tool-belt, Skill-Sam's folder, MCP-Mae's switchboard, etc.)

| Character | Role | Restyled look |
|-----------|------|---------------|
| **Tess the Token** | Personifies a single token | Rounded glass square with friendly face, gradient fill, holding a text snippet |
| **Vector the Embedding** | Personifies vector space | Arrow-bodied character with gradient tail, pointing across N dimensions |
| **Atlas the Agent** | Personifies an agent | Hero-sized, glass tool-belt with 🔨 hammer + 🔍 magnifier |
| **MCP-Mae** | Personifies the MCP server | Switchboard operator with glowing patch cables, glass headset |
| **Skill-Sam** | Personifies a Skill | Folder with a hat; opens to reveal SKILL.md page with soft glow |
| **Plug-Pip** | Personifies a Plugin | 3-prong plug; each prong glows a different accent color |
| **The Orchestrator** | Lead agent in multi-agent | Conductor with glowing baton; mini-agents in orchestra |
| **Halu the Hallucination** | The "villain" | Wispy translucent ghost with question marks; warm-coral glow |

All character SVGs live in `/src/characters/*.tsx` as React components; theme-aware via `currentColor` and CSS variable fills.

### 4.5 Diagrams — house rules

- Always inline SVG, never raster
- Strokes use `currentColor` so they adapt to theme automatically
- Fills use CSS variable tokens — never raw hex inside SVGs
- Label every node and every arrow
- Default `viewBox="0 0 800 400"`; scales fluidly on mobile
- Animations subtle and on-interaction only; respect `prefers-reduced-motion`
- "Active flow" connectors get a soft glow filter; idle connectors stay translucent

---

## 5. Chapter outlines

Each chapter outline below lists: **promise**, **comic premise**, **concepts to cover**, **key diagrams**, **table**, **deep dives**, **remember card**.

---

### Chapter 1 — Foundations: Tokens, Embeddings, Attention

**Promise:** "By the end of this chapter you'll know what a token is, why embeddings are the soul of an LLM, and how attention lets a model 'see' the whole sentence at once."

**Difficulty:** Beginner. Read time: ~12 min.

**Comic premise:** Tess the Token gets chopped out of a sentence. She wanders into "Embedding Space" — a hand-drawn map of meaning — and meets Vector the Embedding, who shows her that "king − man + woman = queen."

**Concepts:**
- What is a token? (sub-word units, BPE, why "happily" might be one or two tokens)
- Tokenizer playground (visual: type a sentence, see it chunked)
- Embeddings: turning tokens into vectors
- Vector space intuition (semantic similarity = geometric closeness)
- The Transformer in one diagram (input → embedding → N × (attention + MLP) → output logits → sampling)
- Self-attention as "everyone-asks-everyone" — Q, K, V in plain English
- Context window: what it means, why it costs $$, why models forget earlier turns
- Temperature, top-p, top-k: the "creativity dials"

**Key diagrams:**
1. A sentence being tokenized → array of integers → array of vectors.
2. 2D projection of embedding space with "king/queen/man/woman" cluster.
3. Transformer block as a stack of lego pieces.
4. Attention heatmap on the sentence "The cat sat on the mat because it was tired."
5. Temperature dial — three sampled outputs at T=0, T=0.7, T=1.5 side-by-side.

**Comparison table:** Tokenizers (BPE vs WordPiece vs SentencePiece — what each is, who uses it).

**Deep dives (collapsed):**
- Softmax math behind attention.
- Why positional encoding exists and how RoPE works.
- KV-cache and why it makes inference fast.

**Remember card:**
- Token = chunk of text the model sees.
- Embedding = token's coordinates in meaning-space.
- Attention = each token deciding which other tokens matter to it.
- Temperature = randomness dial during sampling.

---

### Chapter 2 — Training: From Random Weights to Helpful Assistant

**Promise:** "Pre-training, fine-tuning, RLHF, and distillation, demystified."

**Difficulty:** Beginner → Intermediate. Read time: ~10 min.

**Comic premise:** Newborn-LLM is a blank notebook. Comic shows three life stages: (1) "Eats the internet" (pre-training), (2) "Learns manners" (SFT), (3) "Gets feedback from humans" (RLHF). Final panel: "Now I'm helpful, harmless, and honest."

**Concepts:**
- Pre-training: next-token prediction at planet scale
- The loss function in one analogy (autocomplete with a grade)
- Supervised fine-tuning (SFT): teaching a format
- RLHF: humans rank pairs, reward model learns, policy is nudged
- Constitutional AI / RLAIF (brief)
- Distillation: small model learns from big model
- Why a fine-tuned 7B can sometimes beat a vanilla 70B on a narrow task

**Key diagrams:**
1. Three-stage timeline (pre-training → SFT → RLHF) as a comic strip.
2. RLHF triad: preference data → reward model → policy optimization.
3. Distillation: big teacher → small student.

**Comparison table:** Pre-training vs SFT vs RLHF vs RAG vs prompting (when to reach for which).

**Deep dives:**
- Compute scaling laws (Chinchilla in one paragraph).
- PPO vs DPO — what's actually different.
- LoRA / QLoRA / adapters in 60 seconds.

**Remember card:**
- Pre-training = "read everything."
- SFT = "answer in this format."
- RLHF = "prefer the helpful answer."
- Fine-tuning ≠ giving the model new facts at runtime — that's RAG's job (next chapters).

---

### Chapter 3 — Prompting & Reasoning

**Promise:** "How a sentence becomes a steering wheel for a model that has read the internet."

**Difficulty:** Beginner. Read time: ~10 min.

**Comic premise:** Atlas the Agent stands in front of an enormous control panel with knobs labeled "system prompt", "user prompt", "examples". Each knob he turns reshapes the output sentence in real time.

**Concepts:**
- Anatomy of a prompt: system / user / assistant turns
- Zero-shot vs few-shot
- Chain-of-thought (CoT) — "think step by step"
- Self-consistency, tree-of-thought (briefly)
- Role prompting and persona priming
- Prompt caching — how it works and when it saves money
- Common antipatterns (vague asks, conflicting instructions, no examples)

**Key diagrams:**
1. Prompt structure as a layered cake (system / user / assistant).
2. CoT vs no-CoT on the same math problem, side-by-side.
3. Prompt caching: which prefix is reused across requests.

**Comparison table:** Zero-shot vs Few-shot vs CoT vs Self-Consistency — when to use each, cost, reliability.

**Deep dives:**
- Why "think step by step" actually works (training data + sampling dynamics).
- How prompt caching is implemented (KV-cache reuse across requests).
- Structured output: JSON mode vs schema-guided sampling.

**Remember card:**
- Good prompts have: role, task, constraints, examples, output format.
- CoT trades tokens for reliability.
- Cache long stable prefixes — instructions, schemas, manuals.

---

### Chapter 4 — Memory & RAG

**Promise:** "How models 'know' things they were never trained on — and how to stop them hallucinating about your data."

**Difficulty:** Intermediate. Read time: ~12 min.

**Comic premise:** Atlas needs to answer a question about *yesterday's* sales numbers. He can't — he stopped reading the internet in May. He walks over to a library (vector DB), asks the librarian (retriever) for the relevant book pages, brings them back to his desk, and *now* he can answer.

**Concepts:**
- Knowledge cutoff — why models go stale
- RAG (Retrieval-Augmented Generation) end-to-end
- Embedding-based retrieval (re-using chapter 1's idea)
- Chunking strategy (fixed-size, semantic, parent-child)
- Vector DBs: what they store, what they don't
- Hybrid search (BM25 + vectors)
- Re-ranking
- Long-context vs RAG — when to just stuff it in the prompt
- Memory: short-term (context), long-term (DB), episodic (per-user)

**Key diagrams:**
1. RAG pipeline: query → embed → search → top-k → prompt → generate.
2. Chunking strategies side-by-side.
3. Hybrid search Venn diagram.

**Comparison table:** Long-context (1M tokens) vs RAG — cost, latency, accuracy, recency.

**Deep dives:**
- Cosine vs dot-product vs L2 — what your DB actually computes.
- HNSW & IVF index types in one paragraph each.
- Re-rankers (cross-encoders, ColBERT, listwise LLM rerank).

**Remember card:**
- Pre-training = baked-in knowledge. RAG = looked-up-at-runtime knowledge.
- Bad chunking = bad RAG. No amount of model size fixes it.
- If context is small *and* expensive lookups aren't worth it — just stuff the prompt.

---

### Chapter 5 — Tools & Function Calling

**Promise:** "How a text generator learns to *do* things — call APIs, read files, send emails."

**Difficulty:** Intermediate. Read time: ~10 min.

**Comic premise:** Atlas the Agent is wearing his tool-belt for the first time. Each tool has a JSON-schema label: 🔨 `send_email`, 🔍 `search_web`, 📅 `calendar_create`. He pulls one out, swings it, sees the result, decides what to do next.

**Concepts:**
- Function calling = LLM outputs a structured tool-call instead of prose
- Tool schemas (name, description, JSON-schema parameters)
- The tool-use loop: LLM → tool call → tool result → LLM → …
- Parallel tool calls
- Structured outputs / JSON mode
- Why descriptions matter more than names (the model picks tools by reading)
- Common pitfalls: ambiguous schemas, too many tools, no usage examples

**Key diagrams:**
1. Tool-use loop as a flywheel.
2. A JSON schema annotated with comic-style labels.
3. Parallel tool call: 3 web-searches fan out, results fan in.

**Comparison table:** Plain prompting vs Tool use vs RAG vs Agentic loop.

**Deep dives:**
- How models are trained to emit tool calls (special tokens, fine-tuning).
- Forced tool choice / `tool_choice: required`.
- Why huge tool catalogs hurt accuracy (and how routing helps).

**Remember card:**
- A "tool" is just a function the LLM is told it can call.
- Descriptions sell tools — write them like you're convincing a junior dev.
- One round of tool use ≠ an agent. An agent is *many* rounds in a loop.

---

### Chapter 6 — The Agent Era

**Promise:** "From single-shot generations to autonomous loops that plan, act, and adapt."

**Difficulty:** Intermediate → Advanced. Read time: ~14 min.

**Comic premise:** Atlas gets handed a goal: "Book me a flight to Tokyo under $800 next Friday." He thinks (💭), acts (🛠️ check_flights), observes (✈️ 4 results), thinks again (💭 "cheapest is $720"), acts (🛠️ book_flight), observes (✅ confirmation). The comic reveals a *loop*.

**Concepts:**
- What makes a system "agentic"? (autonomy + tools + iteration toward a goal)
- The ReAct pattern: Reason → Act → Observe → repeat
- Planning vs reactive agents
- Stopping conditions (budget, max-steps, goal-check, user-confirm)
- Agent harness: what the SDK actually runs
- State / scratchpad / working memory
- Where things go wrong (loops, drift, premature stop)

**Key diagrams:**
1. ReAct loop as a clock face.
2. Agent harness architecture: model + tools + memory + stopping rules.
3. "Where agents fail" comic strip (the four classic failure modes).

**Comparison table:** Workflow vs Agent (Anthropic's distinction): predefined steps vs LLM-decided path.

**Deep dives:**
- Why long-horizon agents drift, and how compaction / summarization helps.
- The Anthropic Agent SDK — what `Read`, `Write`, `Edit`, `Bash`, `Task` give you.
- Computer use & browser agents — what's different about acting on a UI.

**Remember card:**
- Agent = LLM + tools + loop + goal.
- Use a workflow when steps are known. Use an agent when they aren't.
- Always cap something (steps, tokens, time, $).

---

### Chapter 7 — MCP: Model Context Protocol

**Promise:** "The USB-C of AI tools. Why every agent now speaks MCP."

**Difficulty:** Intermediate. Read time: ~12 min.

**Comic premise:** Before MCP — Atlas has a tangle of custom adapters trying to talk to Slack, GitHub, Postgres, Google Drive. After MCP — he plugs in a single cable; MCP-Mae the switchboard operator routes the call to whichever server he needs. Two-panel "before/after" comic.

**Concepts:**
- The problem MCP solves: every app + every model = N×M integration explosion
- MCP architecture: client (the agent), server (the app/tool), protocol (JSON-RPC over stdio or SSE)
- What MCP servers expose: **tools** (functions), **resources** (data), **prompts** (templates)
- Transports: stdio, HTTP/SSE, WebSocket
- Local vs remote MCP servers
- Authentication & permissions
- The MCP registry / marketplace
- Writing your own MCP server in ~30 lines

**Key diagrams:**
1. The N×M integration problem → MCP turns it into N+M.
2. MCP three-layer architecture: client / protocol / server.
3. Sequence diagram of `tools/list` → `tools/call` → response.
4. What an MCP server exposes (tools / resources / prompts) as a labeled box.

**Comparison table:** Function calling vs MCP vs Plugins — what each is, who owns it.

**Deep dives:**
- The JSON-RPC handshake (initialize, tools/list, tools/call).
- Why stdio is the default and when SSE/HTTP makes sense.
- Security model: scopes, capability negotiation, user consent.
- Writing a minimal MCP server (Python + `mcp` SDK).

**Remember card:**
- MCP = a *standard* way for any model to talk to any tool.
- A server exposes tools, resources, and prompts.
- Before MCP: bespoke integrations everywhere. After: pluggable everything.

---

### Chapter 8 — Skills

**Promise:** "Composable, on-demand instruction packs that teach a model new tricks without re-training."

**Difficulty:** Intermediate. Read time: ~10 min.

**Comic premise:** Skill-Sam is a folder wearing a hat. Inside the folder: a SKILL.md, some scripts, some references. When Atlas needs to make a `.pptx`, Sam pops open his folder, hands Atlas exactly the pages he needs ("here's how to build slides"), and Atlas gets to work. Other Skills sit in their folders until called.

**Concepts:**
- What a Skill is: a directory with a `SKILL.md` + optional scripts + assets
- Progressive disclosure: only the *description* is always in context; the body loads on demand
- How a Skill is triggered (matching against the description by the model)
- Anatomy of a SKILL.md (frontmatter with `name` + `description`, then body)
- When to write a Skill vs a Plugin vs an MCP server
- Skills vs system prompts (skills are *modular*, system prompts are global)
- Composing multiple Skills

**Key diagrams:**
1. Skill directory tree (SKILL.md, scripts/, references/).
2. Progressive disclosure illustration: thousands of skills in the catalog → only descriptions in context → one body loaded when triggered.
3. The trigger flow: user request → model scans descriptions → loads matching skill body.

**Comparison table:** Skill vs System Prompt vs MCP Server vs Plugin.

**Deep dives:**
- The SKILL.md frontmatter spec.
- Writing a great `description` — the unsung art (trigger phrases, scope, when-not-to-use).
- Skill scripts: when to ship code with your skill.
- Versioning and updating skills.

**Remember card:**
- A Skill is a folder the model opens on demand.
- The description is the door — the body is what's inside the room.
- Skills are how you teach Claude a *workflow*; MCP is how you give it *tools*.

---

### Chapter 9 — Plugins & Marketplaces

**Promise:** "Bundles. The way Skills, MCPs, and slash-commands ship together."

**Difficulty:** Intermediate. Read time: ~8 min.

**Comic premise:** Plug-Pip is a 3-prong electrical plug. Each prong carries a different cable: one labeled "Skills", one "MCP Servers", one "Commands". A user clicks "Install Plugin: Legal Toolkit" and Pip plugs in — suddenly the agent has 7 new skills, 2 new MCP servers, and 4 new slash-commands. All from one install.

**Concepts:**
- What a Plugin is: a manifested bundle of skills + MCP servers + commands
- Why bundle? (cohesion, install-once, versioning)
- Marketplaces — discovery, ranking, trust
- Plugin manifest: name, description, listed skills, listed servers, commands
- Install flow: discover → install → authenticate any required servers → use
- Updating, disabling, uninstalling
- Who builds plugins (vendors, internal teams, community)

**Key diagrams:**
1. "What's in a Plugin" — exploded view: skills + MCP servers + commands.
2. Marketplace browser mock (one screenshot-style infographic).
3. Install lifecycle as a flow.

**Comparison table:** Single Skill vs Single MCP vs Plugin (when each is the right packaging).

**Deep dives:**
- Plugin manifest spec.
- How auth/OAuth flows tie to plugin install.
- Distributing a plugin: marketplace listing, signing, telemetry, support.

**Remember card:**
- Plugin = Skills + MCPs + Commands bundled and versioned.
- Marketplaces are the App Store for agents.
- One install → many capabilities.

---

### Chapter 10 — Subagents & Multi-Agent Orchestration

**Promise:** "When one agent isn't enough — patterns for delegating work to specialists."

**Difficulty:** Advanced. Read time: ~12 min.

**Comic premise:** The Orchestrator stands on a podium with a baton. Three smaller agents sit in front of music stands: Researcher, Coder, Reviewer. The Orchestrator gives each a piece of the score. They play in parallel. The Orchestrator weaves their outputs together.

**Concepts:**
- Why delegate? (context isolation, parallelism, specialization)
- Why *not* delegate? (cold-start, context loss, coordination overhead)
- Subagent = a fresh LLM call with its own context window, its own tools, and a focused task
- Orchestrator-worker pattern
- Router pattern
- Parallel fan-out / fan-in
- Evaluator-optimizer (one agent writes, another grades, loop)
- Returning *information* up the chain, not micromanagement
- How to brief a subagent (full context, constraints, expected output format)

**Key diagrams:**
1. Orchestrator-worker as an org chart.
2. Router pattern as a switchboard.
3. Parallel fan-out / fan-in as a butterfly diagram.
4. Evaluator-optimizer loop.

**Comparison table:** Patterns side-by-side — when each shines, when each hurts.

**Deep dives:**
- Cost & latency model for multi-agent (you're paying N times).
- How the Agent SDK exposes subagent spawning.
- Anti-patterns: spawning when you should just call a tool; spawning for trivial tasks; "telephone game" context loss.

**Remember card:**
- Each subagent starts cold. Brief like a smart colleague who just walked in.
- Delegate for *isolation* or *parallelism* — not for novelty.
- Always specify the expected return format.

---

### Chapter 11 — Patterns, Pitfalls & Safety

**Promise:** "The grown-up chapter. How agents fail, and how to make them fail less."

**Difficulty:** Advanced. Read time: ~14 min.

**Comic premise:** Halu the Hallucination — a wispy ghost with question marks — drifts through panels causing havoc. By the last panel, Atlas has built a fence (guardrails), hired a fact-checker (evals), and Halu is being shown the door.

**Concepts:**
- Hallucination — what it actually is (overconfident sampling), when it spikes (long horizons, unfamiliar domains, low-context tasks)
- Jailbreaks & prompt injection (especially from tool outputs and retrieved documents — *indirect* injection)
- Evals — offline benchmarks vs production telemetry vs human review
- Guardrails — input filtering, output filtering, tool-permission scopes, refusal patterns
- The full agent pattern catalog reprise (router / orchestrator-worker / evaluator-optimizer / reactive / planning)
- Cost & latency governance: budgets, stop conditions, caching
- Observability: traces, replays, redaction

**Key diagrams:**
1. Pattern picker: "If your problem looks like X, reach for Y."
2. Threat model: where injections enter (user, tool outputs, retrieved docs, system).
3. The eval pyramid (unit → component → end-to-end → human review).
4. Guardrail layers as an onion (input → tool perms → output → human review).

**Comparison table:** Pattern catalog cheat-sheet (router, orchestrator-worker, evaluator-optimizer, reactive, planning, multi-step workflow).

**Deep dives:**
- Prompt injection: real-world examples and defenses.
- How to design evals that catch silent regressions.
- Writing system prompts that resist jailbreaks (without becoming paranoid and unhelpful).
- Why "let the LLM judge the LLM" works *sometimes*.

**Remember card:**
- Hallucination ≠ lying. It's overconfident pattern completion.
- The dangerous injections come from data, not users.
- Evals are the only honest progress metric.
- Always cap something.

---

## 6. Cross-chapter conventions

- **Linkage:** every chapter's bottom nav also shows "where this concept is used later" (e.g., embeddings link forward to RAG, tools link forward to MCP).
- **Glossary popovers:** acronyms get a `<abbr>` tag with a tooltip definition, styled like a comic speech-bubble.
- **Search:** deferred until ≥6 chapters are published. The hub is the search until then. Once added, uses Pagefind (static index, zero infra) — see ARCHITECTURE.md §2.
- **Reading time:** estimated and shown on each card; based on ~200 wpm + diagram pauses.
- **Citations & further reading:** each chapter ends with a "Read more" list — Anthropic docs, papers, blog posts. URLs only; no external embeds.

---

## 7. Content conventions

> **Technical conventions** (Next.js layout, build, deploy, accessibility implementation, performance budgets, frameworks, tooling) live in [ARCHITECTURE.md](./ARCHITECTURE.md). This section owns the *content and authoring* conventions only.

- **Tone:** active voice, short sentences, conversational. Never "simply" / "just".
- **Acronyms:** expanded on first use *per chapter*; wrapped in `<abbr>` with hover definition (styled as a glass tooltip).
- **Examples:** prefer one concrete example over three abstract ones.
- **Inclusive defaults:** all diagrams have text equivalents in the prose; all interactive widgets work keyboard-only; all character SVGs have `<title>` and `<desc>` accessible labels.
- **Cross-references:** when a concept is revisited in a later chapter, link forward ("we'll meet this again in Ch7 → MCP"). When recalling an earlier concept, link back.
- **Citations:** each chapter ends with a "Read more" list — primary sources (Anthropic docs, papers, canonical blog posts) only. URLs as plain text; no external embeds.
- **Authoring:** one `.mdx` file per chapter in `src/content/chapters/`. Frontmatter contract validated by Zod at build (see ARCHITECTURE.md §5).

---

## 8. Content build order

> **Engineering phases** (scaffold → theme → components → DB → auth → payments → AI tutor → multi-tenant) are defined in [ARCHITECTURE.md §12](./ARCHITECTURE.md). This section owns the *content* build order only.

1. **Chapter 1 — Foundations.** Sets the MDX template every other chapter follows.
2. **Chapter 6 — The Agent Era.** Validates the comic + diagram patterns on a richer topic.
3. **Chapter 7 — MCP.** The marquee modern topic; first paid-tier chapter.
4. **Chapters 8, 9, 10, 11** — the rest of the "modern stack" + safety.
5. **Chapters 2, 3, 4, 5** — fill in the LLM fundamentals between Foundations and Agents.
6. **Verification pass** — read every chapter end-to-end in both themes, click every link, run Lighthouse, validate all interactive widgets.

Each chapter is ~600–1200 lines of MDX (prose + inline SVG + component instances). Plan ~3–4 hours per chapter for prose-and-art, plus ~30 minutes leveraging the shared component library.

---

## 9. Scope

The project ships in **two distinct milestones**, with an explicit engagement gate between them. This prevents conflating "validate the content" with "validate the business." Full milestone definitions in [ARCHITECTURE.md §1 & §12](./ARCHITECTURE.md).

### Milestone 1 — Content MVP (weeks 1–4)

- 3 flagship chapters published free (Foundations, Agents, MCP)
- Glassmorphism design system (light + dark + system)
- MDX-driven authoring pipeline
- Email capture / newsletter signup
- Analytics (scroll depth, completion, time on page)
- SEO foundations (sitemap, RSS, OG cards, schema.org)

### Milestone 2 — SaaS v1 (weeks 5–14)

- Remaining 8 chapters (free + Pro mix)
- Authentication, accounts, progress, bookmarks, notes
- Paid Pro tier with gated chapters
- In-page AI tutor (credits-metered)
- Search via Pagefind (added when ≥6 chapters live)
- Entitlement abstraction (multi-tenant-ready data model, single-tenant UI)

### Milestone 3 — Teams (demand-driven)

- Team seats, admin dashboard, invoicing, SSO
- **Gated entirely on inbound demand** (≥3 unsolicited team inquiries). No team UI ships speculatively.

### Out of scope (v1 — Milestones 1 + 2)

- Translations / i18n (English only)
- Native mobile app (web is mobile-responsive)
- Live model demos requiring user-supplied API keys
- Print-only stylesheet (PDF export per chapter covers print needs)
- User-generated courses / instructor mode
- Built-in live chat or forum (Discord covers community needs)
- A "Chapter 0 — History of NLP"
- Multi-tenant UI / team admin / SSO (deferred to Milestone 3)

---

## 10. Decisions log

Captures decisions made during the design phase. Each is dated; reversibility noted in ARCHITECTURE.md §14 (ADRs).

| Question | Decision | Date |
|----------|----------|------|
| Stack | **Next.js 15 + MDX**, single codebase, single domain. Marketing + Learn + App under one roof. | 2026-05-22 |
| Hosting | **Vercel** (production) + preview deploys per PR. Cloudflare R2 for media. | 2026-05-22 |
| Visual style | **Glassmorphism** with light + dark themes, system-preference detection. Comic characters restyled for glass; cast unchanged. | 2026-05-22 |
| Chapter count | **11 chapters** as outlined in §5. No merges. | 2026-05-22 |
| Code-sample language | **TypeScript** primary (matches stack). **Python** aside where ML semantics matter (training, RLHF math). Both rendered via `<CodeTabs>`. | 2026-05-22 |
| Interactive widgets | **Yes** — tokenizer playground (Ch1), attention heatmap (Ch1), agent-loop animator (Ch6), MCP playground (Ch7), AI tutor in every chapter (post-Phase-4). | 2026-05-22 |
| Brand / byline | "by Murugadoss" on the hub footer + per-chapter author line. Final copy TBD. | 2026-05-22 |
| Monetization | Free chapters 1–5 + Ch7 during Content MVP. **Pro tier** ($19/mo or $190/yr) unlocks chapters 6–11 + 500 tutor credits/mo. **Team tier** ($15/seat/mo, 2,000 credits/seat) deferred to demand-driven Milestone 3. Billing via Lemon Squeezy. | 2026-05-22 |
| Milestone structure | **Two milestones with engagement gate** — Content MVP (3 flagship chapters, free, email capture) → engagement-based gate (≥500 signups OR ≥50% completion OR clear demand) → SaaS v1 (remaining chapters, auth, payments, tutor). Teams milestone gated on inbound demand. | 2026-05-26 |
| AI tutor metering | **Credits model with Haiku default + Sonnet escalation.** 500 credits/mo Pro, 2,000/mo per Team seat. Haiku message = 1 credit, Sonnet escalation = 4 credits. Prompt caching on chapter context. Conversation auto-summarized after 6 turns. Hard $20/user/mo ceiling triggers manual review. | 2026-05-26 |
| Chapter 7 (MCP) disposition | **Free during Content MVP** as the marquee front-door draw. Converts to Pro tier at SaaS v1 launch with a 7-day grace window for prior readers. | 2026-05-26 |
| Search | **Deferred to ≥6 chapters published.** Pagefind added at that point. Hub is the search until then. | 2026-05-26 |
| Multi-tenant scope | **Data model multi-tenant from day one** (every scoped row has nullable `orgId`; entitlements check user OR org). **Team UI, seats, invoicing, SSO all deferred to Milestone 3** (demand-driven). Schema migrations on a live product are expensive; the abstraction is nearly free upfront. | 2026-05-26 |

**Open questions remaining (non-blocking):**

- Final production domain (`llmtoagent.com` is a candidate — needs DNS check + trademark sanity check).
- Newsletter provider (Resend supports broadcast; ConvertKit / Buttondown are alternatives).
- When to seed the Discord vs wait for organic demand (likely after Phase 3 ships).
