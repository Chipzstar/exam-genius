-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "marking_started_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Attempt_status_marking_started_at_idx" ON "Attempt"("status", "marking_started_at");
