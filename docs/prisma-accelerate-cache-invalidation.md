# Prisma Accelerate cache invalidation (disabled on Starter plan)

**Status:** Temporarily disabled — not a bug. Re-enable when the Prisma Accelerate plan supports cache tag invalidation.

## Context

Exam Genius uses Prisma Accelerate **read caching** via `cacheStrategy` (SWR + TTL) and **cache tags** on several dashboard queries. After mutations, we were calling `$accelerate.invalidate({ tags: [...] })` so cached reads did not serve stale data.

**Prisma Accelerate cache tag invalidation is not available on the Starter plan.** Those `invalidate` calls were commented out to avoid runtime errors or unsupported API usage.

Read-side caching (`cacheStrategy` with optional `tags`) may still be active. Without invalidation, cached rows can lag behind writes until TTL/SWR expires.

## When to revisit

- After upgrading Prisma Accelerate beyond Starter (confirm invalidation is included in the new plan).
- If users report stale question lists, reference lists, or feedback after edits/uploads.
- Before re-enabling, verify in [Prisma Accelerate docs](https://www.prisma.io/docs/accelerate) that `$accelerate.invalidate` is supported on your plan.

## Re-enable checklist

1. Uncomment every block marked with:
   `// Prisma Accelerate cache invalidation is not supported on the Starter plan, so we're disabling it for now`
2. Restore imports from `~/server/accelerate-cache-tags` where removed:
   - `questionsForPaperListTag`
   - `referencesListTag`
3. Smoke-test:
   - Edit a question → `question.listForPaper` reflects changes without waiting for TTL.
   - Upload/remove a reference → `reference.list` updates promptly.
   - Regenerate figures → question list updates after reset.
   - Submit question feedback → sentiment appears on refresh.

## Affected files

| File | Mutation / hook | Tag(s) |
|------|-----------------|--------|
| `apps/dashboard-app/src/server/api/routers/paper.ts` | `regenerateFigures` | `questionsForPaperListTag(paperId)` |
| `apps/dashboard-app/src/server/api/routers/question.ts` | `editWithAi`, `revertToRevision` | `questionsForPaperListTag(paperId)` |
| `apps/dashboard-app/src/server/api/routers/rating.ts` | `submitQuestion` | `questionsForPaperListTag(paperId)` |
| `apps/dashboard-app/src/server/api/routers/reference.ts` | `remove` | `referencesListTag(userId)`, course-scoped tag |
| `apps/dashboard-app/src/app/api/uploadthing/core.ts` | `onUploadComplete` (after extract) | user + course reference list tags |

## Related reads (still cached)

| Query | Router | Tag helper |
|-------|--------|------------|
| `question.listForPaper` | `question.ts` | `questionsForPaperListTag` |
| `reference.list` | `reference.ts` | `referencesListTag` |

Tag helpers live in `apps/dashboard-app/src/server/accelerate-cache-tags.ts`.

## See also

- `docs/reference-upload-process.md` — reference upload flow and list caching
- Linear: search for "Accelerate cache invalidation" in ExamGenius backlog
