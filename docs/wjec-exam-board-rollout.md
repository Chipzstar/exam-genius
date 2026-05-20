# WJEC Wales (`wjec`) rollout checklist

1. **Database:** Deploy Prisma migration `20260520153737_0007_add_wjec_exam_board` (adds enum value `wjec` on `ExamBoard`).
2. **Stripe:** Create six course Price objects (one per subject) with metadata `exam_board=wjec` and `subject=<subject>`. Copy IDs into `WJEC_*_COURSE_PRICE_ID` in Doppler (`exam-genius`, each environment used for builds).
3. **Dashboard env:** Mirror all six `WJEC_*` keys in `.env.local` / CI secrets so builds pass schema validation (`apps/dashboard-app/src/env.js`).
4. **PostHog:** Create boolean feature flag `enable_wjec_exam_board` (default off). Roll out to internal testers, then widen.
5. **QA smoke:** Dashboard board picker with flag on → course checkout (test mode) → open a WJEC unit → generate paper. Backend accepts `exam_board: "wjec"` in paper generation payloads.

Eduqas and Welsh-medium (`*N*`) codes are intentionally out of scope for v1; see repo root `CONTEXT.md`.
