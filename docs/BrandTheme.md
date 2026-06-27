# Brand Theme

This project uses one shared lesson theme for the Next.js app and the standalone HTML library pages. The goal is simple: every LLM Concepts, LangGraph, architecture, and future generated lesson should feel like it belongs to the same learning product.

The canonical implementation lives at:

- `apps/web/public/theme/lesson-theme.css`

The Next.js app imports the same file from:

- `apps/web/src/app/globals.css`

The LangGraph standalone runtime imports it from:

- `apps/web/public/library/langgraph/multi-agent-series.css`

## Visual direction

The look is a calm editorial learning interface:

- soft mesh background
- solid readable cards
- subtle borders and shadows
- rounded surfaces
- serif editorial headings
- clean sans-serif body text
- compact mono code styling
- light and dark themes with the same structure

Avoid making pages feel like a generic dashboard. This is a learning site: readable, spacious, visual, and slightly playful.

## Fonts

Use these font roles consistently:

| Role | Font | Usage |
| --- | --- | --- |
| Display | `Instrument Serif` | Hero titles, large section titles, editorial headings |
| Body | `Inter` | Paragraphs, navigation, cards, controls |
| Code | `JetBrains Mono` | Code blocks, token IDs, technical labels |
| Handwritten accent | `Caveat` | Small playful notes or character-style accents |

Standalone HTML pages should load the same Google Fonts link unless the app shell already provides fonts.

## Theme tokens

Use CSS variables instead of hardcoded colors. The main tokens are:

| Token | Purpose |
| --- | --- |
| `--bg-base` | Page background base |
| `--bg-mesh-1`, `--bg-mesh-2`, `--bg-mesh-3` | Mesh background colors |
| `--surface` | Default card/page surface |
| `--surface-strong` | Stronger panels, headers, elevated areas |
| `--surface-muted` | Soft inner panels, chips, code-inline backgrounds |
| `--surface-hover` | Hover background |
| `--border` | Default subtle border |
| `--border-strong` | Stronger border |
| `--ring` | Focus ring and soft accent shadow |
| `--ink` | Primary text |
| `--ink-soft` | Body text |
| `--ink-mute` | Muted labels |
| `--accent` | Primary brand accent |
| `--accent-2` | Secondary teal accent |
| `--warn` | Warning/error accent |
| `--sun` | Warm highlight |
| `--shadow-card` | Normal card shadow |
| `--shadow-elevated` | Hover/elevated card shadow |
| `--code-bg`, `--code-ink`, `--code-mute` | Code block palette |

## Light theme

The light theme is called Daybreak.

Key values:

| Token | Value |
| --- | --- |
| `--bg-base` | `#f4f6fb` |
| `--bg-mesh-1` | `#e0dcff` |
| `--bg-mesh-2` | `#d1f0ec` |
| `--bg-mesh-3` | `#ffe4d6` |
| `--surface` | `#ffffff` |
| `--surface-muted` | `#f7f8fc` |
| `--ink` | `#0f1226` |
| `--ink-soft` | `#3d3f62` |
| `--ink-mute` | `#6b6e8e` |
| `--accent` | `#5b3fff` |
| `--accent-2` | `#1fb5a8` |

## Dark theme

The dark theme is called Midnight.

Key values:

| Token | Value |
| --- | --- |
| `--bg-base` | `#0a0b1a` |
| `--bg-mesh-1` | `#3b2a78` |
| `--bg-mesh-2` | `#0f4d49` |
| `--bg-mesh-3` | `#6b2a2a` |
| `--surface` | `#111326` |
| `--surface-strong` | `#16192d` |
| `--surface-muted` | `#1d2138` |
| `--ink` | `#f2f3fb` |
| `--ink-soft` | `#c2c5dc` |
| `--ink-mute` | `#8b8fad` |
| `--accent` | `#8d79ff` |
| `--accent-2` | `#4ddbcb` |

## Radius and layout tokens

Use the shared radius and width tokens:

| Token | Value | Usage |
| --- | --- | --- |
| `--r-sm` | `10px` | Small controls, inline code, compact elements |
| `--r-md` | `16px` | Cards, callouts, diagrams |
| `--r-lg` | `24px` | Large cards, hero panels |
| `--r-pill` | `999px` | Chips, badges, segmented controls |
| `--maxw-content` | `920px` | Lesson prose |
| `--maxw-wide` | `1100px` | Hubs, landing sections, diagrams |
| `--space-section` | `84px` default | Standalone lesson section spacing |

## Shared primitives

Use these classes when possible:

| Class | Usage |
| --- | --- |
| `.mesh` | Fixed mesh background behind all content |
| `.glass` | Standard solid card surface |
| `.glass-strong` | Strong/elevated card surface |
| `.site-container` | Wide app container |
| `.site-container-narrow` | Narrow prose container |
| `.editorial-title` | Serif editorial title style |
| `.eyebrow-pill` | Small pill label above hero/sections |
| `.lesson-card` | Clickable lesson/collection card |
| `.lesson-chip` | Metadata chips |
| `.lesson-button` | Secondary action button |
| `.lesson-button-primary` | Primary action button |

## Standalone HTML rule

Future generated standalone HTML should not embed a full copy of the theme tokens. It should link the shared theme:

```html
<link rel="stylesheet" href="/theme/lesson-theme.css" />
```

For LangGraph pages that use shared diagrams and interaction styles, also include:

```html
<link rel="stylesheet" href="/library/langgraph/multi-agent-series.css" />
<script src="/library/langgraph/multi-agent-series.js"></script>
```

If the HTML file lives inside `apps/web/public/library/langgraph/`, relative paths are also acceptable:

```html
<link rel="stylesheet" href="multi-agent-series.css" />
<script src="multi-agent-series.js"></script>
```

## Theme behavior

Theme is controlled by the `data-theme` attribute on `<html>`:

```html
<html data-theme="light">
```

Supported resolved values:

- `light`
- `dark`

Theme preference may be stored as:

- `light`
- `dark`
- `system`

Standalone pages should set the resolved theme before first paint to avoid flashing.

## What to avoid

Avoid:

- hardcoding color hex values in new pages
- copying full token blocks into standalone HTML
- creating page-specific versions of the mesh background
- creating new radius/shadow systems
- changing interactive diagram visuals without checking light and dark mode
- editing served standalone artifacts and original source archives at the same time

## Current source-of-truth rule

For this monorepo:

- Published frontend assets live under `apps/web/public/library/...`
- Shared brand/theme lives under `apps/web/public/theme/...`
- Original standalone backups should live outside this frontend/platform repo

Do not reintroduce a duplicate root `langgraph/` folder into this repo. It creates confusion about which copy is published.

## Validation checklist

Before merging theme changes, verify:

- landing page
- `/chapters`
- `/chapters/llm-concepts`
- `/chapters/langgraph`
- at least one native MDX lesson
- `/library/langgraph/index.html`
- one rich LangGraph page, such as `langgraph-contract-review.html`
- one interactive page, such as `langgraph-fundamentals-quiz.html`
- `/library/architecture.html`
- light theme
- dark theme
- mobile width
- production build
