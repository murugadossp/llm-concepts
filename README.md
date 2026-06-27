# LLM Concepts Platform

This repository is organized as a small monorepo for the LLM Concepts learning platform.

The current production app is the Next.js frontend in `apps/web`. A future Python backend can live beside it as `apps/api` when we add login, user progress, analytics, payments, admin APIs, or background AI workflows.

## Folder structure

```txt
.
├── apps/
│   └── web/              # Next.js public site, lessons, dashboard, future admin UI
├── docs/                 # Architecture, brand theme, and project documentation
├── .agents/              # Codex/authoring skills for lesson work
└── package.json          # Root convenience scripts for apps/web
```

Planned future structure:

```txt
.
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Future Python backend, likely FastAPI
├── packages/
│   ├── theme/            # Optional shared theme package if needed later
│   └── content/          # Optional shared content utilities if needed later
└── docs/
```

## Apps

### `apps/web`

The current frontend app. It includes:

- landing page
- learning paths
- native MDX LLM Concepts lessons
- served standalone LangGraph and architecture library pages
- shared light/dark brand theme
- dashboard/about/pricing placeholders
- future login, dashboard, and admin UI

The shared theme source is:

```txt
apps/web/public/theme/lesson-theme.css
```

The brand/theme guide is:

```txt
docs/BrandTheme.md
```

### Future `apps/api`

When needed, `apps/api` can hold a Python backend for:

- user accounts and profile APIs
- lesson progress
- analytics events
- admin data APIs
- payments/webhooks
- background jobs
- AI/LLM content workflows

## Common commands

From the repo root:

| Command | Description |
| --- | --- |
| `npm run web:dev` | Start the Next.js dev server |
| `npm run web:dev:stable` | Start the Next.js dev server without Turbopack |
| `npm run web:build` | Build the frontend |
| `npm run web:start` | Start the production frontend server |
| `npm run web:lint` | Run Biome checks for the frontend |
| `npm run web:typecheck` | Run TypeScript checks for the frontend |

Or work directly inside `apps/web`:

```bash
cd apps/web
npm install
npm run dev
```

## Deployment note

Frontend deployments should use:

```txt
Root directory: apps/web
Build command: npm run build
Start command: npm run start
```

If using the root package scripts in a CI system, use:

```txt
Build command: npm run web:build
```

## Source-of-truth rules

- Published frontend assets live under `apps/web/public`.
- Served standalone lesson pages live under `apps/web/public/library`.
- Shared theme lives under `apps/web/public/theme`.
- Project documentation lives under `docs`.
- Do not reintroduce duplicate root standalone folders such as `langgraph/`; keep original standalone backups outside this frontend/platform repo.

