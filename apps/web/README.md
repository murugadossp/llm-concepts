# LLM → Agent

An interactive learning site that explains how large language models work, from tokens to agents. Built with Next.js 15, React 19, and MDX.

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | Biome lint |
| `npm run lint:fix` | Biome lint with auto-fix |
| `npm run format` | Biome format |

## Authoring chapters

Chapters live in `src/content/chapters/` as MDX files. Each file needs YAML frontmatter validated by the Zod schema in `src/lib/chapters.ts`.

Naming convention: `{chapterNumber}-{lessonNumber}-{slug}.mdx` (e.g. `01-2-embeddings.mdx`). Section index pages use `{chapterNumber}-{slug}.mdx` with `lessonNumber: 0`.

The chapter-writer skill in `../../.agents/skills/llm-concepts-chapter-writer/SKILL.md` documents the required structure, component catalog, and self-review checklist.

## Characters

SVG character components live in `src/characters/`. Reference them in chapter frontmatter via the `characters` array; the chapter page renders the first listed character automatically.

Current cast: `Tess` (token), `Vector` (embedding), `Atlas` (retrieval), `MCPMae` (MCP/tools).

## Tech stack

- **Next.js 15** — App Router, static generation
- **next-mdx-remote** — MDX compilation with remark-gfm, rehype-slug, rehype-autolink-headings
- **Tailwind CSS v4** — utility styling
- **Biome** — linting and formatting (replaces ESLint/Prettier)
- **Zod** — frontmatter validation at build time
