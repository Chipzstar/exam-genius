# ExamGenius

AI-powered exam preparation for A-Level students. ExamGenius analyzes past papers across AQA, Edexcel, and OCR to predict likely questions and deliver personalised study materials—helping students study smarter and reduce exam stress.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Monorepo** | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) workspaces |
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript (strict) |
| **API** | [tRPC](https://trpc.io) — end-to-end type-safe APIs |
| **Database** | [PostgreSQL](https://www.postgresql.org) via [Prisma](https://www.prisma.io) (merged schemas with [prismerge](https://github.com/nicksrandall/prismerge)) |
| **Auth** | [Clerk](https://clerk.com) (SSO, webhooks) |
| **Payments** | [Stripe](https://stripe.com) (Checkout, webhooks, idempotency) |
| **AI** | [OpenAI](https://platform.openai.com) for content generation |
| **UI** | [Mantine](https://mantine.dev), [Tailwind CSS](https://tailwindcss.com), [Emotion](https://emotion.sh) |
| **Data & state** | [TanStack Query](https://tanstack.com/query) (React Query) |
| **Validation** | [Zod](https://zod.dev), [@t3-oss/env-nextjs](https://github.com/t3-oss/env-nextjs) for env validation |
| **Observability** | [Sentry](https://sentry.io), [Axiom](https://axiom.co), [Vercel Analytics](https://vercel.com/analytics) |

---

## Monorepo Structure

```
exam-genius/
├── apps/
│   ├── dashboard-app/     # Next.js app — courses, papers, payments, AI generation
│   └── landing-page/      # Next.js app — marketing site, pricing, sign-up
├── libs/
│   └── shared/
│       ├── ui/            # Shared React components
│       ├── utils/         # Shared utilities
│       └── prisma/        # Generated Prisma client (single source of truth)
├── prisma/                # Schema (prismerge input)
├── turbo.json             # Turborepo task pipeline & caching
├── pnpm-workspace.yaml    # pnpm workspace definition
└── package.json           # Root scripts & dependencies
```

- **Shared code**: TypeScript path aliases (`@exam-genius/shared/ui`, `@exam-genius/shared/utils`, `@exam-genius/shared/prisma`) so apps and libs stay DRY and type-safe.
- **Build orchestration**: Turborepo runs `build` / `dev` / `lint` / `test` with correct dependency order and caching.

---

## Getting Started

### Prerequisites

- **Node.js** 22.x
- **pnpm** 9.x (or `corepack enable` with `packageManager` in root `package.json`)

### Install

```bash
pnpm install
```

### Environment

1. Copy `env.example` to `.env.local` (and/or use [Doppler](https://doppler.com) for secrets).
2. Configure at least: `DATABASE_URL`, Clerk keys, Stripe keys, `OPENAI_API_KEY`, and any `NEXT_PUBLIC_*` / Stripe price IDs your flows need. See `env.example` for the full list.

### Development

```bash
# Run both apps (dashboard on 3000, landing on 4201)
pnpm dev

# Run a single app
pnpm dev:dashboard
pnpm dev:landing

# With Doppler for env (if used)
pnpm dev:dashboard:doppler
```

### Build & production

```bash
# Build all apps (respects Turborepo cache)
pnpm build

# Build a single app (dashboard includes Prisma generate)
pnpm build:dashboard
pnpm build:landing

# Run production builds locally
pnpm start:dashboard
pnpm start:landing
```

### Database

```bash
pnpm prisma:generate   # Generate client after schema changes
pnpm prisma:sync        # Merge schemas, generate, then db push
pnpm prisma:studio      # Open Prisma Studio
```

### Linting & tests

```bash
pnpm lint              # Lint all packages
pnpm lint:dashboard
pnpm lint:landing
pnpm test              # Run tests across the monorepo
```

---

## Key Scripts (root)

| Script | Description |
|--------|-------------|
| `dev` | Run all apps in dev mode |
| `dev:dashboard` / `dev:landing` | Run one app |
| `build` | Build all apps (Turbo cache) |
| `build:dashboard` | Prisma generate + build dashboard |
| `lint` / `lint:dashboard` / `lint:landing` | ESLint via Turbo |
| `test` | Jest across workspaces |
| `prisma:sync` | Merge schemas → generate → db push |
| `prisma:studio` | Prisma Studio UI |
| `stripe-local-webhook` | Stripe CLI → local webhook |
| `create-env-file:dashboard` | Doppler → `.env` for dashboard (optional) |

---

## Architecture Highlights

- **Type-safe full stack**: tRPC routers (course, user, paper, stripe) with shared types; no hand-written API contracts.
- **Monorepo**: Turborepo + pnpm; shared libs, single Prisma client, and clear app boundaries.
- **Payments**: Stripe Checkout and webhooks with idempotency and event handling (e.g. subscriptions, one-time purchases).
- **Auth**: Clerk for sign-in/sign-up and webhooks to keep user data in sync with the app database.
- **AI**: OpenAI used for generated content (e.g. predicted papers); called from API routes and wired into dashboard flows.
- **Env safety**: Zod + `@t3-oss/env-nextjs` so missing or invalid env vars fail at build/start, not at runtime.
- **Observability**: Sentry (errors), Axiom (logs), Vercel Analytics; structured for production debugging and metrics.

---

## Deploying (e.g. Vercel)

- **Root directory**: leave empty (repo root) so `pnpm install` and Turbo run from the monorepo root.
- **Build command**: `pnpm run build:dashboard` (or the app you deploy).
- **Output directory**: `apps/dashboard-app/.next` for the dashboard app.
- **Install command**: `pnpm install` (or rely on Vercel’s detection via `packageManager`).
- Set all required env vars in the Vercel project (see `env.example` and your app’s env validation).

---

## License

MIT
