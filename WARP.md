# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ExamGenius is a Next.js-based educational platform built with Nx monorepo architecture. It consists of two main applications (dashboard and landing page) with shared UI and utility libraries. The project uses tRPC for type-safe APIs, Prisma with **Prisma Postgres** for data management, Clerk for authentication, and Stripe for payments.

## Common Commands

### Development

```bash
# Serve dashboard app (development)
npm run nx:serve:dashboard

# Serve dashboard with Doppler env vars (local config)
npm run nx:serve:dashboard:doppler

# Serve landing page
npm run nx:serve:landing

# View project dependency graph
npx nx graph
```

### Building

```bash
# Build dashboard (development)
npm run nx:build:dashboard

# Build dashboard (production)
npm run nx:build:dashboard:prod

# Build landing page (production)
npm run nx:build:landing:prod
```

### Testing

```bash
# Run tests for a specific project
npx nx test dashboard-app
npx nx test landing-page
npx nx test shared-ui
npx nx test shared-utils

# Run E2E tests
npx nx e2e dashboard-app-e2e
npx nx e2e landing-page-e2e
```

### Linting and Code Quality

```bash
# Lint dashboard
npm run nx:lint:dashboard

# Lint landing page
npm run nx:lint:landing

# Lint specific project
npx nx lint <project-name>

# Format with Prettier
npx prettier --write .
```

### Database Operations

```bash
# Merge Prisma schemas and generate client
npm run prisma:generate

# Sync database (merge schemas, generate client, push to DB)
npm run prisma:sync

# Push schema changes to database
npm run prisma:push

# Pull schema from database
npm run prisma:pull

# Open Prisma Studio
npm run prisma:studio
```

### Environment & Secrets Management

```bash
# Create env file for dashboard from Doppler
npm run create-env-file:dashboard

# Sync Doppler env to .env.doppler
npm run dopper:sync-env

# Run with Doppler (loc config, exam-genius project)
doppler run -c loc -p exam-genius -- <command>
```

### Stripe Webhooks (Local Development)

```bash
# Forward Stripe webhooks to local dev server
npm run stripe-local-webhook
```

### Nx Commands

```bash
# List all projects in workspace
npx nx show projects

# Run target for affected projects
npx nx affected --target=build
npx nx affected --target=test
npx nx affected --target=lint

# Clear Nx cache
npx nx reset
```

## Architecture

### Monorepo Structure

This is an Nx monorepo with the following structure:

- **apps/dashboard-app**: Main dashboard application (Next.js)
- **apps/landing-page**: Marketing landing page (Next.js)
- **apps/*-e2e**: Cypress E2E test projects
- **libs/shared/ui**: Shared UI components (imported as `@exam-genius/shared/ui`)
- **libs/shared/utils**: Shared utility functions (imported as `@exam-genius/shared/utils`)

### Dashboard App Architecture

The dashboard app (`apps/dashboard-app`) is the core application with the following structure:

#### Pages & Routing
- Uses Next.js Pages Router (not App Router)
- Main pages: `/` (home), `/course`, `/profile`, `/choose-subject`, `/exam-board`, `/faq`
- Auth pages: `/login`, `/signup`

#### API Layer
- **tRPC**: Type-safe API layer located in `server/routers/`
  - Routers: `user`, `stripe`, `course`, `paper`
  - Context provides: `auth` (Clerk), `prisma`, `stripe`, `req`, `res`
  - Procedures: `publicProcedure`, `protectedProcedure` (requires auth)
- **REST APIs**: Located in `pages/api/`
  - `/api/clerk/*`: Clerk webhook handlers
  - `/api/stripe/*`: Stripe webhook handlers
  - `/api/openai/*`: OpenAI integration endpoints
  - `/api/panel`: tRPC panel for debugging (development only)
  - `/api/trpc/[trpc]`: tRPC HTTP adapter

#### Authentication & Middleware
- **Clerk** is used for authentication
- `middleware.ts` protects all routes except: `/login`, `/signup`, and API webhooks
- Access auth in tRPC via `ctx.auth.userId`

#### Database
- **Prisma ORM** with **Prisma Postgres** (`pg` + `@prisma/adapter-pg` in the dashboard)
- Schemas are split into multiple files in `prisma/schemas/`:
  - `base.prisma`: Database config
  - `user.prisma`: User models
  - `course.prisma`: Course-related models
  - `paper.prisma`: Paper/exam models
- **IMPORTANT**: Use `prismerge` to combine schema files before running Prisma commands
  - Always run `npm run prisma:generate` or `npm run prisma:sync` instead of direct `prisma generate`
  - The merged schema is output to `prisma/schema.prisma`

#### Styling
- **Mantine v6** for UI components
- **TailwindCSS** for utility classes
- Custom Poppins font family loaded via `next/font/local`
- Brand color palette defined in `_app.tsx`

#### Third-Party Integrations
- **Clerk**: Authentication
- **Stripe**: Payment processing
- **OpenAI**: AI-powered features
- **Axiom (next-axiom)**: Logging and Web Vitals
- **Sentry**: Error tracking

### Landing Page App

Separate Next.js application for marketing purposes located in `apps/landing-page`.

### Shared Libraries

#### @exam-genius/shared/ui
Shared React components used across applications.

#### @exam-genius/shared/utils
Shared utility functions and helpers.

## Code Style

- **Formatter**: Prettier with custom config
  - Tabs (width: 4)
  - Single quotes
  - No trailing commas
  - 120 character line width
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js ESLint config with custom rules

## Environment Variables

Environment variables are managed through **Doppler**:
- Project: `exam-genius`
- Config: `loc` (local development)

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g. from Prisma Postgres)
- `DATABASE_URL_UNPOOLED`: Direct connection string
- `NGROK_AUTHTOKEN`: ngrok authentication token (for local webhook testing)
- Clerk auth variables (see Clerk dashboard)
- Stripe API keys
- OpenAI API key

## Development Workflow

1. **Starting development**: Run `npm run nx:serve:dashboard:doppler` to start with proper env vars
2. **Database changes**:
   - Edit schema files in `prisma/schemas/`
   - Run `npm run prisma:sync` to merge, generate client, and push changes
3. **Adding new API endpoints**:
   - For tRPC: Add procedures to existing routers or create new router in `server/routers/`
   - For REST: Add route handlers in `pages/api/`
4. **Testing webhooks locally**:
   - Stripe: Run `npm run stripe-local-webhook` in separate terminal
   - ngrok: Set up authtoken first (see `bin/ngrok.yml.example` for instructions)
   - Other webhooks: Use `webhookthing` via `npm run webhookthing`

## Important Notes

- Always use Nx commands for building/serving/testing to respect dependency graph
- Never run `prisma generate` directly; use `npm run prisma:generate` or `npm run prisma:sync`
- The dashboard uses Clerk middleware for auth; ensure routes are properly configured in `middleware.ts`
- Build commands for production include `--skip-nx-cache` flag
- Default branch is `master` (not `main`)
- tRPC uses SuperJSON for serialization (supports Dates, Maps, Sets, etc.)
