# Architecture — LLM → Agent learning site + SaaS

**Companion to:** `BLUEPRINT.md` (product / content / visual vision)
**Owner:** Murugadoss
**Status:** Pre-build technical spec — locked
**Last updated:** 2026-05-23

> **BLUEPRINT.md** = *what we're building and how it should feel.*
> **ARCHITECTURE.md** = *how we build it and what it runs on.*
>
> When the two disagree, ARCHITECTURE wins for technical questions, BLUEPRINT wins for content and visual questions.

---

## 1. Goals & non-goals

The project ships in **two distinct milestones** with an explicit engagement gate between them, plus a demand-driven third milestone. This prevents conflating "validate the content lands" with "validate the business works." Per ADR-011.

### Milestone 1 — Content MVP (weeks 1–4)

**Goal:** prove the learning experience.

1. Ship **3 flagship chapters** — Chapter 1 (Foundations), Chapter 6 (Agents), Chapter 7 (MCP) — as a free, public site.
2. **Solid learning-app design system** — light + dark themes, system-preference detection, persisted choice, opaque surfaces, subdued mesh background.
3. **MDX-driven authoring** — drop a `.mdx` file in `/src/content/chapters/`, chapter or sub-lesson appears in nav.
4. **Email capture** — newsletter signup with single CTA throughout site.
5. **Analytics** — scroll depth, completion rate, time-on-page (PostHog).
6. **SEO foundations** — sitemap, RSS, per-chapter OG cards, schema.org Article markup.
7. **Interactive widgets** for the flagship chapters only (tokenizer demo in Ch1, agent-loop animator in Ch6, MCP playground in Ch7).

**Exit criteria to Milestone 2** (any one triggers the gate):

- ≥500 newsletter signups, OR
- ≥50% scroll-completion rate on at least one flagship chapter, OR
- Clear qualitative demand (replies asking for more chapters / asking to pay).

If none of these hit within ~6 weeks of Content MVP shipping, **pause and iterate on content** before adding SaaS scope.

### Milestone 2 — SaaS v1 (weeks 5–14, after gate passes)

**Goal:** convert validated learning experience into a sustainable product.

1. Remaining 8 chapters published (free + Pro mix per the gating table below).
2. **Authenticated accounts** — per-chapter progress, bookmarks, notes.
3. **Paid Pro tier** — gated chapters + AI tutor credits.
4. **In-page AI tutor** — Claude streaming, chapter-aware context, credits-metered (per ADR-012).
5. **Search** added via Pagefind static index when ≥6 chapters are live.
6. **Entitlement abstraction** as the single source of truth for "can user X access feature Y" (per ADR-008).
7. **Multi-tenant-ready data model** — `orgId` nullable on every scoped row, entitlements check user OR org. UI stays single-tenant.

### Milestone 3 — Teams (demand-driven, post-launch)

**Goal:** open B2B revenue, only when team demand is real.

Gated entirely on inbound demand: **≥3 unsolicited team inquiries** within a quarter. Until then the data abstraction is in place, but no team UI, no seats, no invoicing, no SSO — per reviewer P2.8.

### Non-goals (all milestones)

- Native mobile app (web is mobile-responsive).
- Live model demos requiring user-supplied API keys.
- Translations / i18n.
- User-generated courses (UGC instructor mode).
- Built-in live chat / community (Discord covers community needs).
- Self-hosted / on-prem.

---

## 2. Stack & target versions

Versions are pinned to **target major** per ADR-015. At scaffold time, take the latest patch of the named major; lockfile pins exact versions per checkout.

| Layer | Choice | Target | Notes |
|-------|--------|--------|-------|
| Runtime | Node.js | 22 LTS | App Router + RSC need modern Node |
| Package manager | pnpm | ^9.0 | Faster, content-addressed, monorepo-friendly later |
| Framework | Next.js | ^15.4 | App Router, RSC, server actions, Partial Prerendering |
| UI runtime | React | ^19.0 | Required by Next 15 |
| Content | MDX | `@next/mdx` ^15.4 + `next-mdx-remote` ^5.0 | MDX 3, GitHub Flavored Markdown |
| Styling | Tailwind CSS | ^4.0 | CSS-first config; aligns to BLUEPRINT tokens |
| Components | shadcn/ui | tracking main | Copy-paste, owned in repo |
| Icons | lucide-react | ^0.460 | Tree-shakeable |
| Auth | Clerk | `@clerk/nextjs` ^6.0 | Organizations for multi-tenant (deferred to M3) |
| Database | Neon Postgres | 16.x server | Serverless, branchable, scales to zero |
| DB driver | `@neondatabase/serverless` | ^0.10 | HTTP + WebSocket Postgres for edge |
| ORM | Drizzle ORM | ^0.36 | TypeScript-first, edge-friendly |
| Migrations | drizzle-kit | ^0.27 | Generated migrations in `/drizzle` |
| Payments (M2) | `@lemonsqueezy/lemonsqueezy.js` | ^4.0 | Merchant of record; handles global tax |
| Email | Resend + React Email | resend ^4.0, react-email ^3.0 | Modern API, React templates |
| AI (M2) | `@anthropic-ai/sdk` | ^0.30 | Claude streaming for tutor |
| Object storage | Cloudflare R2 | — | S3-compatible via `@aws-sdk/client-s3` ^3.0 |
| Search (added ≥6 chapters) | Pagefind | ^1.1 | Static-index search, runs at build |
| Rate limiting (M2) | `@upstash/ratelimit` + `@upstash/redis` | ^2.0 / ^1.34 | Sliding window |
| Hosting | Vercel | — | Preview deploys per PR |
| Analytics | PostHog Cloud | `posthog-js` ^1.180 | Product analytics + feature flags |
| Errors | Sentry | `@sentry/nextjs` ^8.40 | Source-mapped, alerts to email/Slack |
| Uptime (M2) | BetterStack | — | Heartbeats + public status page |
| Lint / format | Biome | ^1.9 | Faster than ESLint+Prettier; one tool |
| Type-check | TypeScript | ^5.6 | strict + noUncheckedIndexedAccess |
| Tests | Vitest + Playwright | ^2.1 / ^1.49 | Unit + integration + E2E |
| Validation | Zod | ^3.23 | Env + frontmatter + API boundaries |
| CI | GitHub Actions | — | Test, lint, type-check, preview deploy |

Items marked **(M2)** are not installed during Content MVP — keeps the Milestone 1 surface small.

### Why these specifically

- **Clerk over NextAuth/Supabase Auth:** Organizations (multi-tenant) is built in. Free up to 10k MAU. Best Next.js integration on the market.
- **Neon over Supabase/PlanetScale:** scales to zero (cheap when quiet), branchable databases per preview deploy, Postgres (not MySQL — better JSON, full-text search, extensions).
- **Drizzle over Prisma:** TypeScript-native schemas, smaller bundle, faster at edge, simpler migration story.
- **Lemon Squeezy over Stripe:** merchant of record handles EU VAT and US sales tax globally — saves ~2 weeks of compliance for a solo founder. Trade-off: ~5% + $0.50 per transaction vs Stripe's 2.9% + $0.30. Worth it at small scale.
- **Tailwind 4 over CSS modules / styled-components:** CSS-first config aligns naturally with the BLUEPRINT design token tables and theme-aware utility classes.
- **Biome over ESLint+Prettier:** one tool, ~10× faster, removes a long-standing pain point.

---

## 3. Repo layout

```
llm-concepts/
├── BLUEPRINT.md
├── ARCHITECTURE.md
├── architecture.html              ← interactive visualization (this doc, illustrated)
├── README.md
├── package.json
├── pnpm-lock.yaml
├── biome.json
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml                 ← lint + type-check + unit + E2E
│       └── deploy.yml             ← Vercel preview + prod
├── drizzle/
│   └── *.sql                      ← generated migrations
├── public/
│   ├── favicon.svg
│   └── og/                        ← per-chapter OG cards
├── src/
│   ├── app/
│   │   ├── (marketing)/           ← root route group: landing, pricing, about
│   │   │   ├── page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── about/page.tsx
│   │   ├── (learn)/               ← chapter rendering, free + gated
│   │   │   ├── chapters/
│   │   │   │   ├── page.tsx       ← chapter index (hub)
│   │   │   │   └── [slug]/page.tsx ← dynamic per-chapter route
│   │   │   └── glossary/page.tsx
│   │   ├── (app)/                 ← authenticated app
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── bookmarks/page.tsx
│   │   │   ├── notes/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── teams/             ← organization admin
│   │   │       ├── page.tsx
│   │   │       ├── members/page.tsx
│   │   │       └── billing/page.tsx
│   │   ├── (api)/api/             ← server endpoints
│   │   │   ├── tutor/
│   │   │   │   └── route.ts       ← AI tutor streaming POST
│   │   │   ├── progress/
│   │   │   │   └── route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── lemon-squeezy/route.ts
│   │   │   │   └── clerk/route.ts
│   │   │   └── og/[slug]/route.ts ← dynamic OG image generation
│   │   ├── layout.tsx             ← root layout: theme provider, fonts, clerk
│   │   ├── globals.css            ← Tailwind directives + base
│   │   └── not-found.tsx
│   ├── content/
│   │   └── chapters/
│   │       ├── 01-foundations.mdx    ← module overview
│   │       ├── 01-1-tokens.mdx       ← sub-lesson
│   │       ├── 01-2-embeddings.mdx   ← sub-lesson
│   │       ├── 02-training.mdx
│   │       └── ...                ← per BLUEPRINT chapter outlines
│   ├── components/
│   │   ├── comic/
│   │   │   ├── ComicPanel.tsx
│   │   │   ├── ComicStrip.tsx
│   │   │   ├── SpeechBubble.tsx
│   │   │   └── PersonaStrip.tsx
│   │   ├── learn/
│   │   │   ├── ELI5Card.tsx
│   │   │   ├── DeepDive.tsx
│   │   │   ├── RememberCard.tsx
│   │   │   ├── CompareTable.tsx
│   │   │   ├── FlowDiagram.tsx
│   │   │   ├── Callout.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   └── CodeTabs.tsx       ← TS / Python tabs
│   │   ├── interactive/           ← client components ("islands")
│   │   │   ├── TokenizerDemo.tsx
│   │   │   ├── AttentionHeatmap.tsx
│   │   │   ├── AgentLoopAnimator.tsx
│   │   │   ├── MCPPlayground.tsx
│   │   │   └── TutorChat.tsx
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── ChapterNav.tsx
│   │   │   ├── ChapterSidebar.tsx
│   │   │   ├── Paywall.tsx
│   │   │   └── ProgressDots.tsx
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── ui/                    ← shadcn/ui primitives (button, card, dialog, …)
│   ├── characters/
│   │   ├── Tess.tsx               ← inline SVG components
│   │   ├── Atlas.tsx
│   │   ├── MCPMae.tsx
│   │   ├── SkillSam.tsx
│   │   ├── PlugPip.tsx
│   │   ├── Orchestrator.tsx
│   │   ├── Vector.tsx
│   │   └── Halu.tsx
│   ├── db/
│   │   ├── client.ts              ← Drizzle + Neon
│   │   ├── schema.ts              ← all tables
│   │   └── queries/               ← typed query helpers per domain
│   │       ├── progress.ts
│   │       ├── bookmarks.ts
│   │       ├── entitlements.ts
│   │       └── tutor.ts
│   ├── lib/
│   │   ├── auth.ts                ← Clerk helpers
│   │   ├── entitlements.ts        ← tier-check helpers
│   │   ├── chapters.ts            ← lesson index from MDX
│   │   ├── mdx-components.tsx     ← MDX component mapping
│   │   ├── tutor.ts               ← Claude streaming helpers
│   │   ├── rate-limit.ts          ← Upstash Redis-backed
│   │   └── analytics.ts           ← PostHog wrapper
│   ├── styles/
│   │   ├── tokens.css             ← CSS variable tokens (light + dark)
│   │   └── glass.css              ← reusable solid surface utility classes
│   └── env.ts                     ← Zod-validated env at startup
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

### Why route groups

`(marketing)`, `(learn)`, `(app)`, `(api)` are Next.js **route groups** — they organize files without affecting URLs. This keeps the marketing site, the learning surface, and the authenticated app cleanly separated *in code* while sharing a single domain, a single design system, and a single auth boundary at runtime.

---

## 4. Theme system

The site implements a **solid learning-app UI** with a robust light + dark theming pipeline. Tokens live in `src/styles/tokens.css` as CSS custom properties; the `<ThemeProvider>` toggles a `data-theme` attribute on `<html>`; choice is persisted to `localStorage` when available and synced to `prefers-color-scheme` on first load. Content surfaces are intentionally opaque so the sidebar, top nav, hero, and article content do not visually bleed through each other.

### 4.1 Tokens (CSS custom properties)

```css
:root[data-theme="light"] {
  --bg-base: #F4F6FB;
  --bg-mesh-1: #E0DCFF;     /* violet */
  --bg-mesh-2: #D1F0EC;     /* teal */
  --bg-mesh-3: #FFE4D6;     /* coral */
  --surface: #FFFFFF;
  --surface-strong: #FFFFFF;
  --surface-muted: #F7F8FC;
  --surface-hover: #EEF1FB;
  --border: rgba(15, 18, 38, 0.08);
  --border-strong: rgba(15, 18, 38, 0.10);
  --ring: rgba(91, 63, 255, 0.35);
  --ink: #0F1226;
  --ink-soft: #3D3F62;
  --ink-mute: #6B6E8E;
  --accent: #5B3FFF;
  --accent-2: #1FB5A8;
  --warn: #E5484D;
  --sun: #F5B945;
  --shadow-card: 0 8px 24px rgba(15, 18, 38, 0.06), 0 1px 2px rgba(15, 18, 38, 0.04);
  --shadow-elevated: 0 24px 48px rgba(15, 18, 38, 0.12);
}

:root[data-theme="dark"] {
  --bg-base: #0A0B1A;
  --bg-mesh-1: #3B2A78;
  --bg-mesh-2: #0F4D49;
  --bg-mesh-3: #6B2A2A;
  --surface: #111326;
  --surface-strong: #16192D;
  --surface-muted: #1D2138;
  --surface-hover: #252A45;
  --border: rgba(255, 255, 255, 0.12);
  --border-strong: rgba(255, 255, 255, 0.18);
  --ring: rgba(141, 121, 255, 0.55);
  --ink: #F2F3FB;
  --ink-soft: #C2C5DC;
  --ink-mute: #8B8FAD;
  --accent: #8D79FF;
  --accent-2: #4DDBCB;
  --warn: #FF6B6B;
  --sun: #FFD56B;
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-elevated: 0 24px 48px rgba(0, 0, 0, 0.55);
}

:root {
  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-pill: 999px;
  --maxw-content: 920px;
  --maxw-wide: 1100px;
}
```

### 4.2 Solid surface utility classes

```css
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  border-radius: var(--r-md);
}

.glass-strong {
  background: var(--surface-strong);
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow-elevated);
  border-radius: var(--r-lg);
}
```

### 4.3 Gradient mesh background

A single fixed `<div class="mesh">` behind everything renders three radial gradients at low opacity (or static when `prefers-reduced-motion: reduce`). The mesh colors swap automatically with the theme via tokens, but it must stay subtle enough that it never interferes with text or stacked navigation surfaces.

### 4.4 ThemeProvider behavior

- **First load:** read `localStorage.theme` when storage is available. If absent or blocked, fall back to `matchMedia('(prefers-color-scheme: dark)')`.
- **Render:** set `<html data-theme="…">` *before* paint to avoid flash-of-wrong-theme. This means inlining a tiny blocking script in `<head>` (Next.js supports this in `<Script strategy="beforeInteractive">`).
- **Toggle:** update state → update DOM attribute → persist to `localStorage` when available. Theme switching still works when storage is unavailable.
- **Server-side:** prerender both themes; CSS handles switching client-side. No JS-required to *see* either theme on first paint.

### 4.5 Accessibility

- Contrast ≥ 4.5:1 for body text in both themes (verified in tokens — see `tokens.css` comments).
- Focus ring uses `--ring` color, 2px outline, 2px offset, never removed.
- `prefers-reduced-motion: reduce` → freezes mesh animation, disables view transitions, makes hover effects instant.

---

## 5. Lesson schema

Every chapter or sub-lesson is one `.mdx` file in `src/content/chapters/`. A root chapter has no `parentSlug`; a lesson belongs to a root chapter via `parentSlug` and uses `lessonNumber` for nested ordering.

### 5.1 Frontmatter contract

Validated with Zod at build time in `lib/chapters.ts`.

```yaml
---
slug: "07-mcp"
title: "Model Context Protocol"
navTitle: "MCP"
chapterNumber: 7
lessonNumber: 0
section: "modern-stack"           # foundations | core | modern-stack | safety
difficulty: "intermediate"        # beginner | intermediate | advanced
estimatedMinutes: 12
tier: "pro"                        # free | pro
prereqs: ["05-tools", "06-agents"] # array of slugs
characters: ["Atlas", "MCPMae"]    # which character SVGs to preload
ogImageVariant: "mcp"             # which preset OG card to render
suggestedPrompts:                 # 3-5 starter prompts for the AI tutor (M2.D+)
  - "Why does MCP exist when we already have function calling?"
  - "Walk me through what an MCP server actually exposes."
  - "What's the difference between a tool and a resource in MCP?"
updatedAt: "2026-05-22"
authors: ["murugadoss"]
summary: >
  The USB-C of AI tools — why every agent now speaks MCP. Architecture, transport, and a 30-line server.
---
```

Sub-lessons add `parentSlug` and a positive `lessonNumber`:

```yaml
---
slug: "01-1-tokens"
title: "What Is a Token?"
navTitle: "Tokens"
chapterNumber: 1
lessonNumber: 1
parentSlug: "01-foundations"
section: "foundations"
difficulty: "beginner"
estimatedMinutes: 8
tier: "free"
prereqs: []
characters: ["Tess"]
ogImageVariant: "foundations"
updatedAt: "2026-05-23"
authors: ["murugadoss"]
summary: >
  Tokens are the chunks of text an LLM reads before anything becomes model input.
---
```

### 5.2 Lesson index build

`lib/chapters.ts` reads every MDX file at build (via `fs` + `gray-matter`), validates frontmatter, sorts by `chapterNumber` then `lessonNumber`, and exports typed chapter metadata for use in nav, sidebar, OG generation, and sitemap. `getChapterTree()` groups root chapters with their sub-lessons for the collapsible sidebar.

### 5.3 Gating — explicit boundary components, not percentages (per ADR-014)

The percentage-of-content approach (showing the first 25% of an MDX file) was rejected per reviewer P2.5: MDX is component-heavy, so a percentage cut can split components mid-render, leak deep-dive content, or produce awkward previews. Instead, authors mark the boundary explicitly with two MDX components:

```mdx
# Chapter 7 — MCP

<FreePreview>
  Comic hook, TL;DR, first concept section.
  Everything inside this wrapper is shown to everyone (signed-in or not).
</FreePreview>

<ProOnly fallback={<Paywall reason="upgrade" chapterSlug="07-mcp" />}>
  Remaining deep-dive sections, advanced patterns, comparison tables.
</ProOnly>
```

How it works:

- `<FreePreview>` is a passthrough — always renders children.
- `<ProOnly>` accepts a `fallback` prop. Server-side it checks `hasEntitlement(ctx, 'chapters:pro')` and renders either children (entitled) or fallback (not entitled).
- The route handler is dumb: it just renders the MDX. Tier-awareness lives in the components themselves.
- Authors have **full control** over what the teaser looks like — no surprises, no broken layouts.

Chapters without `<ProOnly>` are implicitly free. Pro chapters use the explicit boundary.

### 5.4 Adding a new lesson

The "easy to add new lessons" goal reduces to:

1. Create `src/content/chapters/12-rag-deep-dive.mdx` for a root chapter or `src/content/chapters/12-1-rag-basics.mdx` for a sub-lesson.
2. Write frontmatter + prose + components.
3. Commit. Vercel preview deploys it. The chapter or lesson appears in the chapter index, sitemap, sidebar, and OG cards automatically.

No code changes. No registry to update.

---

## 6. Data model

Drizzle schemas in `src/db/schema.ts`. PostgreSQL via Neon. Designed for multi-tenant from day one (every row except `users` and global lookup tables has an `orgId` nullable; null = personal account).

### 6.1 Tables

```
users
  id (uuid, pk, default random())   -- internal ID (decoupled from auth provider per ADR-013)
  clerkUserId (text, unique)        -- Clerk's "user_..." string ID
  email (text, unique)
  displayName (text)
  createdAt, updatedAt
  index (clerkUserId)

orgs
  id (uuid, pk, default random())   -- internal ID
  clerkOrgId (text, unique)         -- Clerk's "org_..." string ID
  name (text)
  slug (text, unique)
  plan (enum: free, pro, team)
  seatsPurchased (int)
  createdAt, updatedAt
  index (clerkOrgId)

memberships
  userId (fk users)
  orgId (fk orgs)
  role (enum: owner, admin, member)
  joinedAt
  primary key (userId, orgId)

subscriptions
  id (uuid, pk)
  orgId (fk orgs)           -- subscriptions are always org-scoped (personal = personal org)
  lsSubscriptionId (text, unique)   -- Lemon Squeezy id
  status (enum: active, past_due, canceled, expired)
  plan (enum: pro, team)
  currentPeriodEnd (timestamp)
  createdAt, updatedAt

entitlements
  id (uuid, pk)
  userId (fk users)         -- nullable; either userId or orgId is set
  orgId (fk orgs)           -- nullable
  feature (text)            -- e.g. "chapters:pro", "tutor:pro", "tutor:unlimited"
  source (text)             -- "subscription:<id>" | "grant:<reason>"
  expiresAt (timestamp, nullable)
  createdAt
  index (userId, feature), index (orgId, feature)

chapterProgress
  id (uuid, pk)
  userId (fk users)
  chapterSlug (text)
  percentComplete (int 0..100)
  lastReadAt (timestamp)
  completedAt (timestamp, nullable)
  unique (userId, chapterSlug)

bookmarks
  id (uuid, pk)
  userId (fk users)
  chapterSlug (text)
  anchor (text)             -- section id within chapter
  label (text)
  createdAt

notes
  id (uuid, pk)
  userId (fk users)
  chapterSlug (text)
  anchor (text, nullable)
  body (text)               -- markdown
  isPrivate (bool, default true)
  createdAt, updatedAt

tutorConversations
  id (uuid, pk)
  userId (fk users)
  chapterSlug (text)
  title (text)              -- auto-generated from first message
  createdAt, updatedAt

tutorMessages
  id (uuid, pk)
  conversationId (fk tutorConversations)
  role (enum: user, assistant, system)
  content (text)            -- markdown
  model (text)              -- "claude-haiku-X" | "claude-sonnet-X"
  mode (enum: haiku, sonnet)
  tokensIn (int), tokensOut (int)
  tokensCached (int)        -- cached prefix tokens (Anthropic cache hits)
  costUsd (numeric(10,6))   -- computed at write time
  createdAt
  index (conversationId, createdAt)

tutorCredits             -- per ADR-012: credits-based metering
  id (uuid, pk)
  userId (fk users)
  orgId (fk orgs, nullable)   -- nullable; org credits are pooled across team seats
  creditsGranted (int)        -- e.g. 500 for Pro
  creditsRemaining (int)
  periodStart (timestamp)
  periodEnd (timestamp)
  createdAt
  index (userId, periodEnd), index (orgId, periodEnd)

webhook_events           -- idempotency for Clerk + Lemon Squeezy webhooks
  id (text, pk)            -- Svix message ID or LS event ID
  source (enum: clerk, lemon_squeezy)
  receivedAt (timestamp)
  processedAt (timestamp, nullable)

usageEvents             -- for analytics + abuse detection
  id (uuid, pk)
  userId (fk users)
  orgId (fk orgs, nullable)
  kind (text)             -- "tutor.message", "chapter.read", "chapter.completed"
  metadata (jsonb)
  createdAt
  index (userId, kind, createdAt), index (orgId, kind, createdAt)

inviteCodes
  id (uuid, pk)
  orgId (fk orgs)
  code (text, unique)
  role (enum: admin, member)
  usesRemaining (int)
  expiresAt (timestamp)
  createdAt
```

### 6.2 Entitlement check

The `entitlements` table is the single source of truth for "can this user access this feature?". Code never asks "does this user have a Pro subscription?" — it asks "does this user have the `chapters:pro` entitlement?". Subscriptions write entitlements via webhook; manual grants and team-seat grants also write entitlements. This decoupling means we can later add bundles, promo codes, lifetime grants, or trials without changing access-check code.

```ts
// lib/entitlements.ts
export async function hasEntitlement(
  ctx: { userId: string; orgId?: string },
  feature: string,
): Promise<boolean> {
  // Check user-level grants OR org-level grants the user inherits via membership.
  const now = new Date();
  const rows = await db.select().from(entitlements).where(
    and(
      eq(entitlements.feature, feature),
      or(
        eq(entitlements.userId, ctx.userId),
        ctx.orgId ? eq(entitlements.orgId, ctx.orgId) : sql`false`,
      ),
      or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
    ),
  ).limit(1);
  return rows.length > 0;
}
```

---

## 7. Auth & multi-tenant

### 7.1 Clerk setup

- Single Clerk application.
- Organizations enabled.
- Sign-in methods: email + magic link (default), Google OAuth, GitHub OAuth.
- Default role on org creation: `owner`. Invite codes via Clerk's built-in invite API.
- User-side default: every user gets a personal "Organization" auto-provisioned via a Clerk webhook → makes the multi-tenant code path uniform (every user always has an `orgId`).

### 7.2 Route protection

Server Components check the session via `auth()` from Clerk. Patterns:

```ts
// (app) routes — must be signed in
import { auth } from "@clerk/nextjs/server";
export default async function DashboardPage() {
  const { userId, orgId } = await auth.protect(); // redirects to /sign-in if absent
  // …
}

// (learn) routes — public, but pro chapters check entitlements
export default async function ChapterPage({ params }) {
  const { userId, orgId } = await auth(); // does not throw
  const chapter = await getChapter(params.slug);
  if (chapter.tier === "pro") {
    if (!userId) return <Paywall reason="signin" />;
    const ok = await hasEntitlement({ userId, orgId }, "chapters:pro");
    if (!ok) return <Paywall reason="upgrade" />;
  }
  return <ChapterRenderer chapter={chapter} userId={userId} />;
}
```

### 7.3 Clerk → DB sync

A Clerk webhook (`/api/webhooks/clerk/route.ts`) syncs Clerk's string IDs to our internal UUID-keyed rows (per ADR-013):

- `user.created` → insert into `users` with new internal UUID + `clerkUserId = data.id`, create personal org, insert membership.
- `user.updated` → upsert `users` keyed on `clerkUserId`.
- `organization.created` → insert into `orgs` with new internal UUID + `clerkOrgId = data.id`.
- `organizationMembership.created/deleted` → upsert/delete `memberships` after resolving Clerk IDs to internal UUIDs.

Throughout the app, **never store Clerk's string IDs in domain tables** — always resolve to internal UUIDs at the boundary. The `lib/auth.ts` helper handles this:

```ts
export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;
  return db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
}
```

Webhook signatures verified via Clerk's `Webhook` helper (Svix-backed). Idempotency via the `webhook_events` table keyed by Svix message ID — every event is recorded; reprocessed events skip the body.

### 7.4 Team admin

`/teams/members` lists current members and pending invites. Owners and admins can invite, change roles, remove. Seats are enforced at invite time (block if `memberships.count >= seatsPurchased`).

`/teams/billing` shows current plan, seats, next invoice date, and a "Manage subscription" button that opens Lemon Squeezy's customer portal.

---

## 8. Payments & entitlements

### 8.1 Plans (per ADR-012 — credits-based tutor metering)

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Chapters 1–5 + Ch7 (during Content MVP only), **20 tutor credits/mo** (~20 Haiku msgs or 5 Sonnet escalations) |
| Pro | $19/mo or $190/yr | All chapters, **500 tutor credits/mo**, unlimited bookmarks/notes, priority support |
| Team (Milestone 3) | $15/seat/mo, min 3 seats | Pro per seat + **2,000 credits/seat/mo** (poolable across team), admin dashboard, SSO, invoiced billing on annual |

**Credit economics:**

- 1 credit = 1 Haiku message (chapter-aware, prompt-cached, history-summarized) ≈ $0.005 actual cost
- 4 credits = 1 Sonnet escalation (user opts in via "Need a deeper answer?" button) ≈ $0.025 actual cost
- A Pro user fully burning 500 credits on the cheapest mix (all Haiku) ≈ $2.50/mo cost.
- A Pro user fully burning 500 credits on the priciest mix (all Sonnet at 4×) = 125 messages × $0.025 ≈ $3.13/mo cost.
- **Either way: < $4 cost on a $19 sub → sustainable margin.** Compare to the prior plan's theoretical $216/mo blowout.

Pricing is set in Lemon Squeezy. The app reads plan metadata via webhook and writes corresponding entitlements + credit grants. Credits reset on subscription renewal and **do not roll over** (keeps the cost ceiling predictable).

### 8.2 Checkout flow

1. Authenticated user clicks "Upgrade" → `/pricing` → server action calls `lemonSqueezy.createCheckout()` with `custom_data: { userId, orgId }`.
2. User completes checkout on Lemon Squeezy's hosted page (handles 3DS, tax, etc.).
3. Lemon Squeezy redirects back to `/dashboard?upgraded=1`.
4. **Lemon Squeezy webhook** (`/api/webhooks/lemon-squeezy/route.ts`) fires `subscription_created`:
   - Verify signature (`X-Signature` HMAC).
   - Upsert `subscriptions` row (lsSubscriptionId, status, plan, currentPeriodEnd).
   - Upsert `entitlements`: `chapters:pro`, `tutor:pro` for the user (or org if team plan).
   - Emit `usageEvents` for analytics.
5. Subsequent webhooks (`subscription_updated`, `subscription_payment_failed`, `subscription_cancelled`, `subscription_expired`) keep entitlements in sync.

### 8.3 Idempotency

Every webhook stores the LS event id in a `webhook_events` table (not shown above for brevity) and skips processing if already seen. Critical: LS retries failed webhooks; we must not double-grant.

### 8.4 Grace period

On `payment_failed`, entitlements stay active for 3 days while LS retries. After 3 days the entitlement's `expiresAt` is set to `now`; user becomes Free again until they fix billing.

### 8.5 Refunds & cancellations

- Cancel at period end → entitlement `expiresAt` = `currentPeriodEnd`. User retains access until then.
- Immediate refund → entitlement `expiresAt` = `now`. We email the user.

---

## 9. AI tutor (per ADR-012)

The reviewer flagged (P1.3) that "200 messages/day at $19/mo Pro" risked ~$216/mo cost for a heavy user — unsustainable. The redesign applies **five compounding cost controls as defense-in-depth**, so failure of any one doesn't blow up the economics.

1. **Haiku is the default model**, not Sonnet. ~5× cheaper, adequate for ~90% of teaching questions.
2. **Sonnet escalation is user-initiated** ("Need a deeper answer?" button) and costs 4× credits — user is fully aware.
3. **Prompt caching** on chapter context — Anthropic's cache hits cost ~10% of input price. Chapter text is identical across messages in a conversation.
4. **Conversation summarization** after 6 turns — context stops growing linearly.
5. **Credits + hard $ ceiling** — 500 credits/mo Pro; backstop kill switch at $20/user/mo of tutor cost (PostHog alert → manual review).

### 9.1 Architecture

```
[Client]                    [Server route]                          [Anthropic API]
TutorChat.tsx  ─── POST ───▶  /api/tutor                   ─── stream ──▶  Haiku (default)
   ▲                              │                                    │   Sonnet (escalation)
   │                              │   1. auth.protect()                │
   │                              │   2. credit check + decrement      │
   │                              │   3. rate limit (Upstash sliding)  │
   │                              │   4. cost-ceiling kill switch      │
   │                              │   5. load chapter (cached prompt)  │
   │                              │   6. summarize history if >6 turns │
   │◀── SSE stream ──────────────  7. stream from Anthropic            │
                                Postgres: tutorConversations,
                                tutorMessages, tutorCredits, usageEvents
```

### 9.2 Request shape

```ts
POST /api/tutor
{
  conversationId?: string,
  chapterSlug: string,
  userMessage: string,
  mode: "haiku" | "sonnet",     // defaults to "haiku"; "sonnet" costs 4 credits
}
→ 200 text/event-stream
data: { type: "delta", content: "..." }
data: { type: "done", conversationId, messageId, creditsCharged, creditsRemaining, model }
data: { type: "error", code: "credits_exhausted" | "rate_limit" | "cost_ceiling" | "upstream_error", message }
```

### 9.3 Server flow

1. `auth.protect()` — must be signed in.
2. **Credit check.** Read `tutorCredits` for current period. Cost = 1 (Haiku) or 4 (Sonnet). Return `credits_exhausted` if insufficient.
3. **Rate limit.** Upstash sliding window: 30 messages/hour regardless of credits (DoS protection).
4. **Cost-ceiling check.** Sum the last 30 days of `tutorMessages.costUsd` for this user. If > $20 → return `cost_ceiling` and flag for manual review.
5. **Load chapter** as plain text (strip components). Submit to Anthropic with `cache_control: { type: "ephemeral" }` on the chapter block — repeat calls within ~5 min hit the cache at ~10% input price.
6. **Summarize history** if conversation has >6 turns. One-shot Haiku call compresses turns 1..N-6 into a 200-token summary; keep the last 6 turns verbatim. Cache the summary on the conversation row.
7. **Build prompt:**
   - **System (cached):** "You're a tutor for Chapter {N}: {title}. Stay grounded in the chapter content. If asked outside scope, answer briefly and gently redirect."
   - **Context (cached):** chapter plain text, ~3–4k tokens.
   - **History:** summary (if any) + last 6 turns.
   - **User:** new message.
8. **Stream** from Anthropic SDK, forward as SSE.
9. **On completion:** decrement credits, persist `tutorMessages` (user + assistant) with `model`, `mode`, `tokensIn/Out/Cached`, `costUsd`. Update `conversation.updatedAt`. Emit `usageEvents`.
10. **On error:** log to Sentry, refund the credit (so failed calls aren't charged), emit `data: { type: "error", ... }`.

### 9.4 Client (TutorChat.tsx)

- Sticky right-side panel on desktop; full-screen sheet on mobile.
- **Credits meter** in the header ("237 of 500 credits this month").
- **Sonnet escalation** as a "Need a deeper answer?" pill next to the input — single-click swap to `mode: "sonnet"` for the next message only (clearly indicates 4-credit cost).
- Prior conversations for the current chapter in a collapsible sidebar.
- Streams assistant tokens into a virtualized message list.
- Starter prompts pulled from chapter frontmatter (`suggestedPrompts: []`).
- `credits_exhausted` → upgrade prompt + link to billing.
- `cost_ceiling` → "We're reviewing your account" message + support link (manual review by operator).

### 9.5 Abuse protection

- Rate limit (above).
- `max_tokens` cap: 800 default, 1600 for Sonnet mode.
- Reject messages > 4k characters (prompt-injection vector).
- Server-side block patterns for known jailbreak attempts (soft block, surfaced to user, logged).

### 9.6 Cost model — revised

| Mode | Input (cached) | Output | Cost per msg | Credits |
|------|----------------|--------|--------------|---------|
| Haiku default | ~4k @ $0.08/M (cached) | 800 @ $4/M | ~$0.005 | 1 |
| Sonnet escalation | ~4k @ $0.30/M (cached) | 1600 @ $15/M | ~$0.026 | 4 |

**Worst-case heavy Pro user** burning 500 credits/mo entirely on Sonnet (125 messages): ~$3.25/mo cost on a $19/mo subscription. Healthy margin even with the most expensive mix. The cost ceiling at $20/mo is ~6× the worst case — generous backstop for outliers.

---

## 10. Environments & secrets

### 10.1 Environments

| Env | Branch | Domain | DB | Clerk | LS | Anthropic |
|-----|--------|--------|----|----|----|-----------|
| Local | any | `http://localhost:3000` | Neon dev branch (per dev) | Clerk dev instance | LS test mode | Test API key, low daily cap |
| Preview | PR branch | Vercel preview URL | Neon preview branch (auto-created per PR) | Clerk dev instance | LS test mode | Test API key |
| Production | `main` | `llmtoagent.com` (TBD) | Neon prod | Clerk prod instance | LS live mode | Prod API key, full caps |

Neon's branching makes per-PR isolated DBs trivial — preview deploys never touch prod data.

### 10.2 .env contract (validated by `src/env.ts`)

```
# Public
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Server
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
DATABASE_URL
ANTHROPIC_API_KEY
LEMON_SQUEEZY_API_KEY
LEMON_SQUEEZY_STORE_ID
LEMON_SQUEEZY_WEBHOOK_SECRET
RESEND_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
SENTRY_DSN
SENTRY_AUTH_TOKEN
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
```

`src/env.ts` uses Zod to validate every var at boot. Missing or malformed = build/start fails loud, not silently.

### 10.3 Secrets management

- Local: `.env.local` (gitignored). `.env.example` checked in.
- Preview & prod: Vercel project env vars, per environment.
- Rotation: quarterly for Clerk, LS, Anthropic. Documented in a runbook.

---

## 11. Observability

| Concern | Tool | Notes |
|---------|------|-------|
| Errors (client + server) | Sentry | Source-mapped via Sentry Vercel integration. Alerts to email + Slack (later). |
| Product analytics | PostHog Cloud | Events: `chapter.read`, `chapter.completed`, `tutor.message_sent`, `subscription.upgraded`, `paywall.shown`, `paywall.clicked`. Session replay on for paying users with consent. |
| Uptime | BetterStack | HTTPS heartbeats every minute for `/`, `/chapters`, `/api/health`. Public status page at `status.llmtoagent.com`. |
| Logs | Vercel Log Drains → Axiom (later) | Structured logs (Pino). PII redacted. |
| Performance | Vercel Web Analytics + Lighthouse CI | Core Web Vitals tracked per route. CI fails if LCP > 2.5s for marketing pages. |
| Cost | Vercel + Neon + LS dashboards | Weekly manual review until automated alerting added. |

`api/health` returns `{ ok: true, db: "ok", time: ... }` after pinging the DB — proves the route handler *and* the DB are up.

---

## 12. Build plan — three milestones, engagement-gated (per ADR-011)

Each phase has explicit **exit criteria** — the phase ships when all items pass, not before. Milestones are gated on validation, not calendar.

### Milestone 1 — Content MVP (weeks 1–4)

**Theme:** prove the learning experience before any monetization.

**Phase 1.A — Foundation (week 1).** Next.js scaffold, Tailwind 4, theme system (light + dark + system, flash-free), shadcn/ui setup, MDX pipeline, all visual component primitives (`ComicPanel`, `ELI5`, `DeepDive`, `RememberCard`, `Callout`, `Chip`, `CodeBlock`, `CodeTabs`, `Infographic`, `FlowDiagram`, `CompareTable`, `PersonaStrip`, `SpeechBubble`), site layout (`SiteHeader`, `SiteFooter`, `ThemeToggle`).

**Phase 1.B — Flagship chapters (weeks 2–3).** Chapter 1 (Foundations) + Chapter 6 (Agents) + Chapter 7 (MCP) authored in MDX with hero comics, all in-chapter components, interactive widgets (tokenizer demo Ch1, agent-loop animator Ch6, MCP playground Ch7). Hub page rendering chapter cards.

**Phase 1.C — Acquisition surface (week 4).** Email capture (Resend audience or ConvertKit list), newsletter signup CTAs in header + footer + after-chapter prompts. SEO foundations: sitemap, RSS, per-chapter OG cards (Vercel OG), schema.org Article markup. PostHog analytics (scroll depth, completion %, time-on-page).

**Milestone 1 exit criteria:**

- Three flagship chapters render correctly in both themes on desktop + mobile.
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95 on all pages.
- Sitemap + RSS validate.
- OG card renders for every chapter.
- Newsletter signup works end-to-end (signup → confirmation email → list membership).
- Vercel preview deploy on every PR; `main` auto-deploys to prod.

**Engagement gate to Milestone 2** — any one triggers the gate:

- ≥500 newsletter signups
- ≥50% scroll-completion on at least one flagship chapter
- Clear qualitative demand (replies asking for more / paid)

If none of these hit within ~6 weeks of shipping, **pause and iterate on content** before adding SaaS scope.

---

### Milestone 2 — SaaS v1 (weeks 5–14, after gate)

**Theme:** convert validated learning experience into a sustainable product.

**Phase 2.A — Accounts & progress (weeks 5–6).** Clerk integration (sign-in: email magic link + Google + GitHub), Neon + Drizzle setup, schemas + migrations for `users`, `orgs`, `memberships`, `chapterProgress`, `bookmarks`, `notes`, `webhook_events`. Clerk webhook → DB sync using `clerkUserId` text columns (per ADR-013). `/dashboard`, `/bookmarks`, `/notes`, `/settings` pages.

*Exit:* signup → read → bookmark → log out → log in → see bookmark (E2E). Reading chapter updates progress with 80% scroll heuristic. Personal org auto-created on signup.

**Phase 2.B — Remaining chapters (weeks 7–8).** Chapters 2, 3, 4, 5, 8, 9, 10, 11 authored. `<FreePreview>` / `<ProOnly>` boundary components in chapters that will be Pro (per ADR-014) — boundaries exist but gating is dormant until 2.C. Search via Pagefind enabled once ≥6 chapters live.

*Exit:* all 11 chapters published. Pagefind index builds. Free/Pro boundaries visible in MDX source.

**Phase 2.C — Payments & gating (weeks 9–10).** Lemon Squeezy integration, webhook handler with idempotency (`webhook_events`), `subscriptions` + `entitlements` + `tutorCredits` tables, `<Paywall>` component activated, `<ProOnly>` gating live, `/pricing` page, customer portal link. **Chapter 7 reclassified as Pro** with 7-day grace email to prior readers (per BLUEPRINT decision).

*Exit:* test-mode checkout end-to-end; entitlement granted in <60s. Pro chapters show paywall to unentitled users via `<ProOnly>`. Cancellation → access continues to period end → expires correctly. Payment failure → 3-day grace → entitlement expires. One real $1 test purchase in production succeeds.

**Phase 2.D — AI tutor (weeks 11–13).** `/api/tutor` streaming route with **all five cost controls** (Haiku default, Sonnet escalation, prompt caching, conversation summarization, credits + $20/user/mo cost ceiling — per ADR-012). `<TutorChat>` component with credits meter UI. Rate limiting via Upstash. Per-tier credit grants on subscription webhook events.

*Exit:* streaming chat works on desktop + mobile. Conversation history persists. Credits decrement correctly. Free user hitting 20 credits → upgrade prompt. Pro user hitting 500 credits → wait-till-renewal prompt. Cost-ceiling kill switch verified via load test. Average cost per Pro user tracked in PostHog — target < $5/user/mo.

**Phase 2.E — Hardening (week 14).** Sentry coverage on all routes, BetterStack uptime monitor, structured logs (Pino) with PII redaction, Lighthouse CI gates deploys. Privacy policy, ToS, refund policy live (drafted via Termly/Iubenda). Customer support inbox + basic help center.

*Exit:* all M2 routes covered by Sentry. Uptime monitor live with status page. Lighthouse CI blocks regressions. All legal pages live.

---

### Milestone 3 — Teams (demand-driven, post-launch)

**Theme:** open B2B revenue, only when team demand is real.

**Gate to start:** ≥3 unsolicited team inquiries within a quarter (per ADR-011 / reviewer P2.8).

**Scope (only when gate passes):** Clerk Organizations exposed in UI, `/teams/*` pages (members, billing, settings), seat enforcement at invite time, invoiced billing variant in Lemon Squeezy, optional SSO via Clerk enterprise plan, admin analytics dashboard, **team credit pools** (2,000 credits/seat poolable across all members of the org).

**Exit:** one real paying team customer onboarded.

---

### Milestone 4+ — Post-launch, data-driven

Quizzes with certificates, in-product comments per chapter section, instructor course builder (UGC), affiliate program, Stripe migration if Lemon Squeezy fees become material, native PWA, mobile app.

---

## 13. Cost model — revised after ADR-012

Approximate monthly run-rate at four scale points. Excludes operator time. Tutor cost recomputed using ADR-012 mitigations (Haiku default at ~$0.005/msg, ~15% Sonnet escalation at ~$0.025/msg → weighted average ~$0.008/msg).

| Scale | Active users | Pro users | Tutor msgs/mo | Monthly cost |
|-------|--------------|-----------|---------------|--------------|
| Milestone 1 (Content MVP) | up to ~500 | 0 | 0 | **~$0** (Vercel free tier covers this; PostHog free; Resend free up to 3k emails/mo) |
| Milestone 2 launch | ~100 | ~5 | ~2,000 | **~$35** (Vercel $20, Neon $0 dev branch, Clerk $0, Sentry $0, PostHog $0, Anthropic ~$16, Resend $0) |
| Mid-scale | ~1,000 | ~50 | ~30,000 | **~$300** (Vercel $20, Neon $20, Clerk $25, Sentry $26, PostHog $0–50, Anthropic ~$240, Resend $20, Upstash $10) |
| Healthy product | ~10,000 | ~500 | ~300,000 | **~$3,000** (Vercel $80, Neon $69+, Clerk $100+, Sentry $80+, PostHog $100+, Anthropic ~$2,400, Resend $20+, Upstash $40+, R2 $5) |

**Revenue side** at 1k users / 50 Pro = 50 × $19 ≈ $950 gross / mo → ~$700 net of LS fees → **~$400 net of infra**. Breakeven sits well below 100 Pro users. Team plan unlocks per-seat economics that compound favorably.

**Worst-case tutor blowout** is now bounded by the $20/user/mo cost ceiling × concurrent heavy users — verifiable from PostHog before it becomes a P1 incident. The prior plan had no such ceiling.

---

## 14. Risks & ADRs

Architecture Decision Records — brief, dated, reversible-when-noted.

| # | Decision | Rationale | Reversible? |
|---|----------|-----------|-------------|
| ADR-001 | **Next.js 15 + MDX** over Astro | Need SaaS layer within 6 months (paid courses, multi-tenant, auth, AI tutor). Single codebase keeps content + app cohesive. | Hard to reverse later. |
| ADR-002 | **Solid learning-app UI (light + dark)** over comic-only aesthetic | Modern aesthetic; pairs better with paid-product expectations; theme switching is table-stakes. Opaque surfaces preserve hierarchy and readability better than transparent glass for long-form lessons. Characters retained, restyled. | Easy. |
| ADR-003 | **Clerk** over NextAuth / Supabase Auth | Organizations built in (multi-tenant), free up to 10k MAU, best Next integration. | Medium effort to migrate. |
| ADR-004 | **Neon** over Supabase / PlanetScale | Postgres + serverless + branchable; per-PR DBs are huge for safety. | Medium effort. |
| ADR-005 | **Drizzle** over Prisma | TypeScript-native, edge-friendly, simpler migrations. | Medium effort. |
| ADR-006 | **Lemon Squeezy** over Stripe | Merchant of record handles global tax. Trade ~2% extra fee for ~2 weeks of compliance work saved. | Medium effort; entitlement abstraction makes it tolerable. |
| ADR-007 | **Single domain, single codebase** over Astro+Next split | Easy lesson authoring across free + paid is the dominant requirement. Operational overhead of two stacks not justified at this scale. | Reversible at scale (extract `(marketing)` route group to its own Astro site if SEO demands it). |
| ADR-008 | **Entitlements table abstraction** over direct subscription checks | Decouples access control from billing provider; lets us add grants, trials, bundles, lifetime, switch billing provider, etc. without touching access-check code. | N/A — this is the abstraction. |
| ADR-009 | **Theme-aware character restyle** over pure aesthetic / dropping characters | Characters are a memorability asset (BLUEPRINT §4.4). Restyling preserves the asset while modernizing visual language. | Reversible per-character. |
| ADR-010 | **Pagefind** over Algolia | Free, static, zero infra. Algolia is overkill until content > 100 pages. Activated only when ≥6 chapters live (per reviewer P2.4). | Easy. |
| ADR-011 | **Two-milestone build with engagement gate** (Content MVP → SaaS v1) + demand-driven Teams milestone | Per reviewer P1.1 — separates "did the content land?" from "did the business work?". Avoids carrying launch / monetization / team sales / AI tutor / content production all at once. Validates the learning experience before the SaaS layer is paid for in code. | Easy to reverse if user demand swamps Content MVP and you want to fast-forward to M2 — but the gate is there precisely so you don't have to guess. |
| ADR-012 | **Tutor cost controls** — credits + Haiku default + Sonnet escalation + prompt caching + summarization + $20/user/mo ceiling | Per reviewer P1.3 — "almost no one will" was not a cost control. Five layered mitigations cap worst case at ~$3.25/user/mo on Sonnet-only burn vs $216 prior. Credits are transparent to user; cost ceiling is invisible backstop. | Easy — adjust credit grants in Lemon Squeezy plan metadata. |
| ADR-013 | **Internal UUIDs + clerkUserId / clerkOrgId text columns** instead of UUID columns storing Clerk's string IDs | Per reviewer P1.2 — Clerk IDs are `user_...` / `org_...` strings, not UUIDs. UUID columns would break sync. Also future-proofs against Clerk migration (just rewrite the boundary mapping). | N/A — this is the right shape from day one. |
| ADR-014 | **`<FreePreview>` / `<ProOnly>` MDX boundary components** instead of percentage-of-content gating | Per reviewer P2.5 — MDX is component-heavy, so a percentage cut splits components and leaks content. Author marks boundary explicitly; renderer obeys. Authors keep full control of the teaser. | Easy — components are thin wrappers, replaceable. |
| ADR-015 | **Target major versions** ("^15.4") instead of `latest` | Per reviewer P2.7 — `latest` drifts. Major-pinning gives reproducibility at scaffold time while allowing patch updates via lockfile. | N/A — operational. |

### Known risks

- **AI tutor cost runaway** if a heavy user finds a prompt that spikes context. Mitigated by rate limits + max_tokens caps + per-user $ alerting in PostHog.
- **Lemon Squeezy fee drag** at scale eventually argues for Stripe migration. ADR-006 is reversible thanks to ADR-008.
- **Visual hierarchy regression** if transparent effects creep back into the learning shell. Keep the sidebar, top nav, chapter hero, and article panels on opaque theme surfaces; reserve transparency only for non-critical decoration.
- **Clerk lock-in.** Pricing escalates above 10k MAU. We watch the run rate; the auth-helper abstraction (`lib/auth.ts`) makes a future swap merely tedious.

---

## 15. What to build next — Milestone 1 only

The plan covers M1 + M2 + M3, but **only M1 is committed**. Don't pre-build M2 work; the engagement gate exists for a reason.

1. Scaffold the Next.js project per §3 layout. Tag `v0.1.0-scaffold`.
2. Implement the theme system per §4 (tokens, ThemeProvider, flash-free switch). Tag `v0.2.0-theme`. **Demo before continuing.**
3. Implement the visual component primitives (`ComicPanel`, `ELI5`, `DeepDive`, etc.). Tag `v0.3.0-components`.
4. Author Chapter 1 in MDX as the template. Validate the visual language. Tag `v0.4.0-chapter-01`.
5. Add Chapter 6 + Chapter 7 in MDX. Interactive widgets. Tag `v0.5.0-flagships`.
6. Hub page + sitemap + RSS + per-chapter OG cards. Tag `v0.6.0-seo`.
7. Newsletter signup + PostHog analytics. Tag `v0.7.0-acquisition`.
8. **Ship Milestone 1.** Watch engagement metrics.
9. Wait for the gate. If gate doesn't trigger in ~6 weeks → iterate on content, do not start M2.
10. Only after the gate passes: begin Phase 2.A (accounts).

Each tag is a checkpoint — easy rollback, easy progress reporting, easy to share with anyone you want feedback from.
