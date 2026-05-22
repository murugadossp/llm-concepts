# Architecture — LLM → Agent learning site + SaaS

**Companion to:** `BLUEPRINT.md` (product / content / visual vision)
**Owner:** Murugadoss
**Status:** Pre-build technical spec — locked
**Last updated:** 2026-05-22

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
2. **Glassmorphism design system** — light + dark themes, system-preference detection, persisted choice.
3. **MDX-driven authoring** — drop a `.mdx` file in `/src/content/chapters/`, lesson appears in nav.
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

Gated entirely on inbound demand: **≥3 unsolicited team inquiries** within a quarter. Until then the data abstraction is in place, but no team UI, no seats, no invoicing, no SSO — per ADR-014 / reviewer P2.8.

### Non-goals (all milestones)

- Native mobile app (web is mobile-responsive).
- Live model demos requiring user-supplied API keys.
- Translations / i18n.
- User-generated courses (UGC instructor mode).
- Built-in live chat / community (Discord covers community needs).
- Self-hosted / on-prem.

---

## 2. Stack & target versions

Versions are pinned to **target major** per ADR-013. At scaffold time, take the latest patch of the named major; lockfile pins exact versions per checkout.

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
- **Tailwind 4 over CSS modules / styled-components:** CSS-first config aligns naturally with the BLUEPRINT design token tables. Class-based glassmorphism utilities are clean.
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
│   │       ├── 01-foundations.mdx
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
│   │   └── glass.css              ← reusable glass utility classes
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

The site implements true **glassmorphism** with a robust light + dark theming pipeline. Tokens live in `src/styles/tokens.css` as CSS custom properties; the `<ThemeProvider>` toggles a `data-theme` attribute on `<html>`; choice is persisted to `localStorage` and synced to `prefers-color-scheme` on first load.

### 4.1 Tokens (CSS custom properties)

```css
:root[data-theme="light"] {
  --bg-base: #F4F6FB;
  --bg-mesh-1: #E0DCFF;     /* violet */
  --bg-mesh-2: #D1F0EC;     /* teal */
  --bg-mesh-3: #FFE4D6;     /* coral */
  --surface: rgba(255, 255, 255, 0.55);
  --surface-strong: rgba(255, 255, 255, 0.75);
  --border: rgba(255, 255, 255, 0.65);
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
  --surface: rgba(255, 255, 255, 0.06);
  --surface-strong: rgba(255, 255, 255, 0.10);
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
  --blur-soft: 16px;
  --blur-strong: 28px;
  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-pill: 999px;
  --maxw-content: 760px;
  --maxw-wide: 1100px;
}
```

### 4.2 Glass utility class

```css
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  backdrop-filter: blur(var(--blur-soft)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--blur-soft)) saturate(140%);
  box-shadow: var(--shadow-card);
  border-radius: var(--r-md);
}

.glass-strong {
  background: var(--surface-strong);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(var(--blur-strong)) saturate(140%);
  box-shadow: var(--shadow-elevated);
  border-radius: var(--r-lg);
}
```

### 4.3 Gradient mesh background

A single fixed `<div class="mesh">` behind everything renders three radial gradients animated extremely slowly (or static when `prefers-reduced-motion: reduce`). The mesh colors swap automatically with the theme via tokens.

### 4.4 ThemeProvider behavior

- **First load:** read `localStorage.theme`. If absent, fall back to `matchMedia('(prefers-color-scheme: dark)')`.
- **Render:** set `<html data-theme="…">` *before* paint to avoid flash-of-wrong-theme. This means inlining a tiny blocking script in `<head>` (Next.js supports this in `<Script strategy="beforeInteractive">`).
- **Toggle:** update state → update DOM attribute → persist to `localStorage`.
- **Server-side:** prerender both themes; CSS handles switching client-side. No JS-required to *see* either theme on first paint.

### 4.5 Accessibility

- Contrast ≥ 4.5:1 for body text in both themes (verified in tokens — see `tokens.css` comments).
- Focus ring uses `--ring` color, 2px outline, 2px offset, never removed.
- `prefers-reduced-motion: reduce` → freezes mesh animation, disables view transitions, makes hover effects instant.

---

## 5. Lesson schema

Every chapter is one `.mdx` file in `src/content/chapters/`. The filename's leading number defines order; the rest is the slug.

### 5.1 Frontmatter contract

Validated with Zod at build time in `lib/chapters.ts`.

```yaml
---
slug: "07-mcp"
title: "Model Context Protocol"
chapterNumber: 7
section: "modern-stack"           # foundations | core | modern-stack | safety
difficulty: "intermediate"        # beginner | intermediate | advanced
estimatedMinutes: 12
tier: "pro"                        # free | pro
prereqs: ["05-tools", "06-agents"] # array of slugs
characters: ["Atlas", "MCPMae"]    # which character SVGs to preload
ogImageVariant: "mcp"             # which preset OG card to render
updatedAt: "2026-05-22"
authors: ["murugadoss"]
summary: >
  The USB-C of AI tools — why every agent now speaks MCP. Architecture, transport, and a 30-line server.
---
```

### 5.2 Lesson index build

`lib/chapters.ts` reads every MDX file at build (via `fs` + `gray-matter`), validates frontmatter, sorts by `chapterNumber`, and exports a typed `chapters: ChapterMeta[]` for use in nav, sidebar, OG generation, and sitemap.

### 5.3 Gating

The `[slug]/page.tsx` route handler:

1. Loads chapter metadata.
2. If `tier === 'free'` → render directly.
3. If `tier === 'pro'` → check `getEntitlement(userId, 'chapters:pro')`.
   - If entitled → render directly.
   - If not entitled → render the **first 25% of content** (the comic hook + TL;DR), then a `<Paywall>` component.

This is implemented at the route level so the rest of the rendering pipeline (MDX → React) doesn't need to know about tiers.

### 5.4 Adding a new lesson

The "easy to add new lessons" goal reduces to:

1. Create `src/content/chapters/12-rag-deep-dive.mdx`.
2. Write frontmatter + prose + components.
3. Commit. Vercel preview deploys it. Lesson appears in the chapter index, sitemap, sidebar, and OG cards automatically.

No code changes. No registry to update.

---

## 6. Data model

Drizzle schemas in `src/db/schema.ts`. PostgreSQL via Neon. Designed for multi-tenant from day one (every row except `users` and global lookup tables has an `orgId` nullable; null = personal account).

### 6.1 Tables

```
users
  id (uuid, pk)             -- mirrors Clerk userId
  email (text, unique)
  displayName (text)
  createdAt, updatedAt

orgs
  id (uuid, pk)             -- mirrors Clerk orgId
  name (text)
  slug (text, unique)
  plan (enum: free, pro, team)
  seatsPurchased (int)
  createdAt, updatedAt

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
  tokensIn (int), tokensOut (int)
  createdAt
  index (conversationId, createdAt)

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

A Clerk webhook (`/api/webhooks/clerk/route.ts`) syncs:

- `user.created` → insert into `users`, create personal org, insert membership.
- `user.updated` → upsert `users`.
- `organization.created` → insert into `orgs`.
- `organizationMembership.created/deleted` → upsert/delete `memberships`.

Webhook signatures verified via Clerk's `Webhook` helper.

### 7.4 Team admin

`/teams/members` lists current members and pending invites. Owners and admins can invite, change roles, remove. Seats are enforced at invite time (block if `memberships.count >= seatsPurchased`).

`/teams/billing` shows current plan, seats, next invoice date, and a "Manage subscription" button that opens Lemon Squeezy's customer portal.

---

## 8. Payments & entitlements

### 8.1 Plans

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Chapters 1–5, 10 AI tutor messages/day |
| Pro | $19/mo or $190/yr | All chapters, 200 AI tutor messages/day, unlimited bookmarks/notes |
| Team | $15/seat/mo (min 3 seats) | Everything in Pro, admin dashboard, SSO (Phase 5+), invoiced billing on annual |

Pricing is set in Lemon Squeezy; the app reads plan metadata via webhook.

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

## 9. AI tutor

### 9.1 Architecture

```
[Client]                    [Edge / Server Action]                 [Anthropic API]
TutorChat.tsx  ─── POST ───▶  /api/tutor (route handler)  ─── stream ──▶  claude-sonnet-X
   ▲                              │                                          │
   │                              │   load chapter context                    │
   │                              ▼                                          │
   │                          Postgres: tutorConversations,                  │
   │◀── SSE stream ───────────  tutorMessages, rate-limit,                   │
                                entitlement check                            │
```

### 9.2 Request shape

```ts
POST /api/tutor
{
  conversationId?: string,
  chapterSlug: string,
  userMessage: string,
}
→ 200 text/event-stream
data: { type: "delta", content: "..." }
data: { type: "done", conversationId, messageId, tokensIn, tokensOut }
```

### 9.3 Server flow

1. `auth.protect()` — must be signed in.
2. Check rate limit (Upstash Redis, sliding window per user). Limits by tier: Free 10/day, Pro 200/day, Team unlimited.
3. Check `tutor:pro` entitlement if tier requires it.
4. Load (or create) conversation row.
5. Load last N user/assistant messages for context (cap at ~6k tokens).
6. Load chapter MDX content; strip components; truncate to ~4k tokens of plain text.
7. Build the prompt:
   - **System:** "You're a tutor helping a reader understand Chapter N: {title}. Stay grounded in the chapter content. If asked about something outside scope, briefly answer and gently redirect."
   - **Context:** chapter plain text.
   - **History:** prior messages.
   - **User:** new message.
8. Stream from Anthropic SDK, forward as SSE.
9. On completion, persist `tutorMessages` (both user and assistant), update conversation `updatedAt`, emit `usageEvents`.
10. On error, log to Sentry, emit `data: { type: "error", message: "..." }` and close.

### 9.4 Client (TutorChat.tsx)

- Sticky right-side panel on desktop, full-screen sheet on mobile.
- Lists prior conversations for this chapter (sidebar).
- Streams assistant tokens into a virtualized message list.
- Suggests starter prompts pulled from chapter frontmatter (`suggestedPrompts: []`).
- "New conversation" button.

### 9.5 Abuse protection

- Rate limit (above).
- Anthropic-side `max_tokens` cap to bound cost.
- Reject messages > 4k characters (prompt injection vector).
- Server-side block patterns for known jailbreak attempts (re-checked daily — soft block, surfaced to user).

### 9.6 Cost model

Average tutor exchange ≈ 8k input tokens (chapter context + history) + 800 output tokens. At Sonnet 4.x pricing (~$3/M in, $15/M out): ≈ $0.036 per message. A heavy Pro user hitting their 200/day = ~$7.20/day = ~$216/mo. We will monitor and adjust limits if real users hit theoretical caps; in practice almost no one will.

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

## 12. Phased build

Each phase has an explicit **exit criteria** — the phase ships when all items pass, not before.

### Phase 1 — Free content site (weeks 1–3)

**Scope:** Next.js scaffold, Tailwind 4, theme system (light + dark), shadcn/ui setup, MDX pipeline, all component primitives (`ComicPanel`, `ELI5`, `DeepDive`, etc.), Chapter 1 + Chapter 6 + Chapter 7 written, hub page, sitemap, RSS, OG cards, Plausible-or-PostHog analytics, deploy to Vercel.

**Exit criteria:**
- Three chapters render correctly in both themes on desktop + mobile.
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95 on marketing pages.
- Sitemap + RSS validate.
- OG card renders for every chapter.
- Vercel preview deploy on every PR; `main` deploys to prod.

### Phase 2 — Accounts & progress (weeks 4–5)

**Scope:** Clerk integration, Neon + Drizzle setup, schemas + migrations for `users`, `orgs`, `memberships`, `chapterProgress`, `bookmarks`, `notes`. Clerk webhook → DB sync. `/dashboard`, `/bookmarks`, `/notes`, `/settings` shell pages.

**Exit criteria:**
- Sign up via email + Google + GitHub all work.
- Personal org auto-created on signup.
- Reading a chapter updates `chapterProgress` (with 80% scroll = complete heuristic).
- Bookmark + note CRUD works; data persists across logins.
- E2E test: signup → read → bookmark → log out → log in → see bookmark.

### Phase 3 — Payments & gated content (weeks 6–8)

**Scope:** Lemon Squeezy integration, webhook handler, `subscriptions` + `entitlements` + `webhook_events` tables, `<Paywall>` component, gating in chapter routes, `/pricing` page, customer portal link.

**Exit criteria:**
- Test-mode checkout completes end-to-end; entitlement granted within 60s.
- Pro chapters render the paywall for unentitled users (showing first 25% of content).
- Cancellation → access continues to period end → expires correctly.
- Payment failure → 3-day grace → entitlement expires.
- One real $1 test purchase in production succeeds.

### Phase 4 — AI tutor (weeks 9–10)

**Scope:** `/api/tutor` streaming route, `<TutorChat>` component, conversation persistence, rate limiting (Upstash Redis), abuse protections, tier-based daily limits.

**Exit criteria:**
- Streaming chat works smoothly on desktop + mobile.
- Conversation history persists per chapter.
- Free user hitting daily limit gets a clean upgrade prompt.
- Rate limit verified via load test (10 concurrent users, no errors).
- Average cost per Pro user tracked; alert if > $5/day per user.

### Phase 5 — Multi-tenant / teams (weeks 11–14)

**Scope:** Clerk Organizations exposed in UI, `/teams/*` pages, seat enforcement, invoiced billing variant in LS, optional SSO via Clerk's enterprise plan, admin analytics.

**Exit criteria:**
- Owner can purchase Team plan with N seats and invite N users.
- Admins can change member roles and remove members.
- Seat overflow blocked at invite time with clear UX.
- Org-level entitlements correctly inherited by members.
- One real team customer (or internal team) successfully onboarded.

### Phase 6+ (post-launch, driven by data)

Quizzes with certificates, in-product comments per chapter section, instructor course builder (UGC), affiliate program, Stripe migration if LS limits hit, mobile app (PWA first, native later).

---

## 13. Cost model

Approximate monthly run-rate at four scale points. Excludes Murugadoss's time.

| Scale | Active users | Pro users | Tutor msgs/mo | Monthly cost |
|-------|--------------|-----------|---------------|--------------|
| 0 | 0 | 0 | 0 | **~$0** (all free tiers) |
| 100 | 100 | 5 | ~2,000 | **~$50** (Vercel $20, Neon $0, Clerk $0, LS fees on revenue, Sentry $0, PostHog $0, Anthropic ~$30) |
| 1,000 | 1,000 | 50 | ~30,000 | **~$300** (Vercel $20, Neon $20, Clerk $25, Sentry $26, PostHog $0–50, Anthropic ~$150, Resend $0–20, Upstash $10) |
| 10,000 | 10,000 | 500 | ~300,000 | **~$2,500–3,500** (Vercel $80, Neon $69+, Clerk $100+, Sentry $80+, PostHog $100+, Anthropic ~$1,500, Resend $20+, Upstash $40+, R2 $5) |

Revenue at 1k users / 50 Pro = ~$950/mo gross → ~$700 after LS fees → ~$400 net of infra. Breakeven well below 100 Pro users. Real upside opens at Team plan adoption.

---

## 14. Risks & ADRs

Architecture Decision Records — brief, dated, reversible-when-noted.

| # | Decision | Rationale | Reversible? |
|---|----------|-----------|-------------|
| ADR-001 | **Next.js 15 + MDX** over Astro | Need SaaS layer within 6 months (paid courses, multi-tenant, auth, AI tutor). Single codebase keeps content + app cohesive. | Hard to reverse later. |
| ADR-002 | **Glassmorphism (light + dark)** over comic-only aesthetic | Modern aesthetic; pairs better with paid-product expectations; theme switching is table-stakes. Characters retained, restyled. | Easy. |
| ADR-003 | **Clerk** over NextAuth / Supabase Auth | Organizations built in (multi-tenant), free up to 10k MAU, best Next integration. | Medium effort to migrate. |
| ADR-004 | **Neon** over Supabase / PlanetScale | Postgres + serverless + branchable; per-PR DBs are huge for safety. | Medium effort. |
| ADR-005 | **Drizzle** over Prisma | TypeScript-native, edge-friendly, simpler migrations. | Medium effort. |
| ADR-006 | **Lemon Squeezy** over Stripe | Merchant of record handles global tax. Trade ~2% extra fee for ~2 weeks of compliance work saved. | Medium effort; entitlement abstraction makes it tolerable. |
| ADR-007 | **Single domain, single codebase** over Astro+Next split | Easy lesson authoring across free + paid is the dominant requirement. Operational overhead of two stacks not justified at this scale. | Reversible at scale (extract `(marketing)` route group to its own Astro site if SEO demands it). |
| ADR-008 | **Entitlements table abstraction** over direct subscription checks | Decouples access control from billing provider; lets us add grants, trials, bundles, lifetime, switch billing provider, etc. without touching access-check code. | N/A — this is the abstraction. |
| ADR-009 | **Glass-compatible character restyle** over pure aesthetic / dropping characters | Characters are a memorability asset (BLUEPRINT §4.4). Restyling preserves the asset while modernizing visual language. | Reversible per-character. |
| ADR-010 | **Pagefind** over Algolia | Free, static, zero infra. Algolia is overkill until content > 100 pages. | Easy. |

### Known risks

- **AI tutor cost runaway** if a heavy user finds a prompt that spikes context. Mitigated by rate limits + max_tokens caps + per-user $ alerting in PostHog.
- **Lemon Squeezy fee drag** at scale eventually argues for Stripe migration. ADR-006 is reversible thanks to ADR-008.
- **Backdrop-filter perf** on low-end mobile. We test on a 2018-era Android; if FPS drops, fall back to flat surfaces for `prefers-reduced-motion` *or* low-end-device detection.
- **Clerk lock-in.** Pricing escalates above 10k MAU. We watch the run rate; the auth-helper abstraction (`lib/auth.ts`) makes a future swap merely tedious.

---

## 15. What to build next

1. Apply BLUEPRINT.md edits (in this same turn) → both docs aligned.
2. Generate `architecture.html` — interactive glassmorphism visualization of this document.
3. Scaffold the Next.js project per §3 layout. Tag commit `v0.0.1-scaffold`.
4. Implement theme system per §4. Tag `v0.0.2-theme`. Demo to Murugadoss.
5. Implement component primitives. Tag `v0.0.3-components`.
6. Author Chapter 1 in MDX as the template. Tag `v0.0.4-chapter-01`.
7. Hub page + sitemap + RSS + OG. Phase 1 ships.

Each tag is a checkpoint — easy rollback, easy progress reporting.
