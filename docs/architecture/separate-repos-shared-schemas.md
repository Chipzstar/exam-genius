# Separate repositories and schema drift

## Context

Exam Genius is implemented across two codebases:

- **Dashboard / frontend (Turborepo):**  
  `/Users/chiso/Projects/Omnicentra/Exam Genius/exam-genius`  
  Example: question body validation for AI edits lives in `apps/dashboard-app/src/server/question-edit-logic.ts`.

- **Backend (Nx / Fastify):**  
  `/Users/chiso/Projects/Omnicentra/Exam Genius/exam-genius-backend`  
  Example: canonical question / paper JSON shapes for generation and persistence live in `src/app/modules/paper/schema.ts`.

## Architectural issue

Because these are **separate Git repositories** rather than one unified monorepo (or a shared package both repos depend on), there is **no single source of truth** for shared domain types and Zod (or other) schemas.

The same concepts—such as a question `body` array and its discriminated `kind` variants—must be **re-declared** (or copied) in each repo. When one side evolves (for example the backend adds a `figure` block type for diagram generation) and the other lags, you get **mismatches and integration bugs** that only surface at runtime (failed validation, failed API flows, or bad persistence) even though the database and backend remain consistent with the richer model.

This is not a failure of any one feature; it is a **structural cost** of duplicating contracts across repo boundaries without automated sharing or generation.

## Direction

We intend to reduce this risk in the future by **re-evaluating repository layout**. Options include:

- A **monorepo** that contains both the Next.js dashboard and the Fastify backend, with shared libraries for domain types and Zod schemas; or
- **Another approach** that preserves two repos but introduces a **published or git-submodule shared package** so schemas and types are defined once and consumed by both services.

Until then, any change to cross-cutting JSON shapes (question bodies, mark schemes, paper payloads) should be treated as **two-repo work**: update the backend schema and the dashboard (or client) validators together, and add tests or contract checks where practical.

## Example drift (fixed)

AI question edit previously validated only `text | math | table | image_placeholder` in the dashboard while the backend persisted `figure` blocks. That mismatch was resolved by aligning `blockSchema` in `question-edit-logic.ts` with `figureBlockSchema` in the backend `schema.ts`. The underlying issue—duplicate definitions—remains until shared ownership of those types exists.
