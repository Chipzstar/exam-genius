# Reference upload: end-to-end flow

This describes what happens when a user uploads a reference PDF from `apps/dashboard-app/src/app/(dashboard)/references/page.tsx`, with emphasis on how **exam-genius-backend** processes it.

---

## 1. Dashboard (browser)

1. The user picks a **course** and **document kind** (`question_paper`, `mark_scheme`, or `examiner_report`).
2. `UploadButton` (endpoint `paperReference`) uploads the PDF via **UploadThing**.
3. UploadThing invokes the dashboard route handler in `apps/dashboard-app/src/app/api/uploadthing/core.ts` after the file is stored.

---

## 2. Dashboard (UploadThing callback → backend HTTP call)

In `onUploadComplete`:

1. **IDs**: Middleware generated `referenceId` (`genID('ref')`) and captured Clerk `userId` plus `courseId`, optional `paperCode`, and `kind`.
2. **Backend request**: The callback POSTs JSON to the Fastify backend:

   - **Method / path**: `POST {BACKEND_HOST}/server/references/extract`
   - **Body**: `reference_id`, `user_id`, `course_id`, `paper_code`, `kind`, `ut_key`, `ut_url`, `filename` (see `ExtractBody` in the backend controller).

3. **Auth**: Requests under `/server/*` are gated by a shared secret:

   - Dashboard sends header `x-exam-genius-secret: {BACKEND_SHARED_SECRET}` via `apps/dashboard-app/src/server/backend-headers.ts` (`backendApi` axios instance).
   - Backend registers a **`preHandler` hook** on all `/server` routes (`exam-genius-backend/src/app/modules/server-routes.ts`): if the header does not match `process.env.BACKEND_SHARED_SECRET`, the server responds **401** `{ error: 'Unauthorized' }`. If the secret is unset (non-production), every `/server` request is rejected the same way.

4. **After a successful HTTP response** from extract, the callback invalidates Prisma Accelerate cache tags for reference lists (user-wide and course-scoped) so `api.reference.list` refetches fresh rows.

The References page calls `refetch()` on upload completion; together with invalidation, the table should reflect new or updated `paperReference` rows once the backend round-trip finishes.

---

## 3. Backend: routing and handler entry

**Mounting** (`exam-genius-backend/src/main.ts`):

- `fastify.register(serverRoutes, { prefix: '/server' })`

**References routes** (`exam-genius-backend/src/app/modules/server-routes.ts`):

- Registers `referenceRoutes` with `{ prefix: '/references' }`.
- Route file (`reference/reference.route.ts`) exposes **`POST /extract`** relative to that prefix.

So the full path is:

```text
POST /server/references/extract
```

**Implementation**: `exam-genius-backend/src/app/modules/reference/reference.controller.ts` → `extractReference`.

---

## 4. Backend: `extractReference` logic (detailed)

All DB access uses `prisma` from `exam-genius-backend/src/app/utils/prisma.ts` (Accelerate URL from `DATABASE_URL`, standard Prisma Client).

### 4.1 Early exit — already processed

- Loads `paperReference` by `user_id` + `reference_id`.
- If a row exists with **`status === 'ready'`**, responds **200** `{ ok: true, deduped: true }`, logs `reference_extract` with `deduped: true`, and **does not** re-download or re-parse.

### 4.2 Upsert — mark as processing

- **`upsert`** on `reference_id`:

  - **create**: new row with `status: 'processing'`, empty `extracted_text` / `text_hash`, UploadThing fields (`ut_key`, `ut_url`, `filename`), `course_id`, `kind`, optional `paper_code`.
  - **update**: sets `status: 'processing'` and refreshes `ut_key`, `ut_url`, `filename` (re-upload of same `reference_id`).

At this point the row exists in the DB and list queries can show **`processing`** if they run after this step.

### 4.3 Download PDF

- `fetch(ut_url)`; non-OK response throws → caught by outer **catch** → **500** (see §4.7).

### 4.4 Extract text

- Uses **`pdf-parse`** on the downloaded buffer.
- On parser failure: logs a warning, leaves `text` empty → usually leads to §4.5 (`failed` + **422**).

### 4.5 Insufficient text

- If trimmed text length **&lt; 500** characters:

  - **`paperReference.update`**: `status: 'failed'`, stores whatever text was extracted, `text_hash: ''`, `token_count: 0`.
  - Logs `reference_extract` with `ok: false`, `error: 'insufficient_text'`.
  - Responds **422** with `{ error: 'Could not extract enough text from PDF (try a text-based PDF)' }`.

### 4.6 Successful extraction paths

1. **SHA-256** over full extracted text → `text_hash`.
2. **Duplicate detection**: Look for another **`ready`** row for the same `user_id` with the same `text_hash`.

   - If found **and** it is a **different** `reference_id`:

     - Updates **current** row to **`ready`**, copies `extracted_text` from the duplicate, sets `text_hash`, `token_count` ≈ `ceil(len(extracted_text) / 4)`.
     - Responds **200** `{ ok: true, deduped: true }`.

   - Otherwise:

     - Updates **current** row to **`ready`** with this extraction’s text and hash, `token_count` ≈ `ceil(len(text) / 4)`.
     - Responds **200** `{ ok: true }`.

Structured logging uses **`logAiStructured('reference_extract', …)`** with fields such as `reference_id`, `duration_ms`, `ok`, and optional `deduped` / `error`.

### 4.7 Errors (catch-all)

- Logs **`extractReference`** at error level and emits **`reference_extract`** with `ok: false`.
- If `reference_id` was present on the body, runs **`updateMany`** on that id → **`status: 'failed'`** (best-effort).
- Responds **500** `{ error: 'Extract failed', message: … }`.

---

## 5. Observed latency

- The extract handler runs **synchronously** for the HTTP request: download + PDF parsing + DB updates complete before the response returns.
- UploadThing’s callback **awaits** that POST, so the browser’s “upload complete” path is tied to backend duration (large PDFs or slow networks increase perceived delay).
- Rows appear as **`processing`** right after the upsert (§4.2); they become **`ready`** or **`failed`** after the rest of the pipeline finishes.

---

## 6. Dashboard list API and caching (short)

- `api.reference.list` reads `paperReference` with Accelerate **`cacheStrategy`** and **tags** keyed by user (and course when filtered).
- Mutations and the UploadThing callback call **`$accelerate.invalidate`** for those tags so list reads are not stuck on stale cache.

---

## 7. Troubleshooting

| Symptom | Where to look |
|--------|----------------|
| 401 on extract | `BACKEND_SHARED_SECRET` aligned between dashboard env and backend; header `x-exam-genius-secret`. |
| 422 insufficient text | PDF may be image-only or badly extracted; row should show **`failed`**. |
| 500 extract failed | Backend logs (`extractReference`), row may be **`failed`** via catch handler. |
| Row missing after upload | UploadThing callback errors (dashboard logs); backend never reached or DB write failed. |

**Related files**

- Dashboard upload + callback: `apps/dashboard-app/src/app/api/uploadthing/core.ts`
- Dashboard → backend client: `apps/dashboard-app/src/server/backend-headers.ts`
- Backend `/server` auth + route registration: `exam-genius-backend/src/app/modules/server-routes.ts`
- Backend extract handler: `exam-genius-backend/src/app/modules/reference/reference.controller.ts`
- Backend route wiring: `exam-genius-backend/src/app/modules/reference/reference.route.ts`, `exam-genius-backend/src/main.ts`
