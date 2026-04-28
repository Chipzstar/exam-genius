-- One-off: grant legacy one-time regeneration for papers created before 2026-04-24 (before structured AI rollout).
-- Preview impacted rows:
--   SELECT "paper_id", "created_at", "status" FROM "Paper"
--   WHERE "created_at" < '2026-04-24T00:00:00.000Z'::timestamp AND "status" = 'success' AND "legacy_one_time_regenerate_available" = false;

UPDATE "Paper"
SET "legacy_one_time_regenerate_available" = true
WHERE "created_at" < '2026-04-24T00:00:00.000Z'::timestamp
  AND "status" = 'success'
  AND "legacy_one_time_regenerate_available" = false;
