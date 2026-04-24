-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('free', 'plus', 'pro');

-- CreateEnum
CREATE TYPE "MarkSchemeStatus" AS ENUM ('none', 'pending', 'success', 'failed');

-- CreateEnum
CREATE TYPE "ReferenceKind" AS ENUM ('question_paper', 'mark_scheme', 'examiner_report');

-- CreateEnum
CREATE TYPE "ReferenceStatus" AS ENUM ('pending', 'processing', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "AttemptMode" AS ENUM ('mock', 'study');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('in_progress', 'submitted', 'marking', 'marked', 'failed');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('maths', 'biology', 'chemistry', 'economics', 'physics', 'psychology');

-- CreateEnum
CREATE TYPE "ExamBoard" AS ENUM ('edexcel', 'aqa', 'ocr');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('failed', 'pending', 'success');

-- CreateEnum
CREATE TYPE "StripeSubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "question_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "topic" TEXT,
    "body" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionRevision" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "body" JSONB NOT NULL,
    "marks" INTEGER NOT NULL,

    CONSTRAINT "QuestionRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkScheme" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mark_scheme_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "status" "MarkSchemeStatus" NOT NULL DEFAULT 'pending',
    "model_answer" JSONB,
    "points" JSONB,
    "prompt_version" TEXT,
    "raw_content" TEXT,

    CONSTRAINT "MarkScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperReference" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reference_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "paper_code" TEXT,
    "kind" "ReferenceKind" NOT NULL,
    "ut_key" TEXT NOT NULL,
    "ut_url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "extracted_text" TEXT NOT NULL,
    "text_hash" TEXT NOT NULL,
    "token_count" INTEGER NOT NULL DEFAULT 0,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "PaperReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperRating" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paper_id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "dimensions" JSONB,

    CONSTRAINT "PaperRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionFeedback" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sentiment" INTEGER NOT NULL,
    "reason_tags" TEXT[],
    "note" TEXT,

    CONSTRAINT "QuestionFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" SERIAL NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mode" "AttemptMode" NOT NULL DEFAULT 'mock',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "time_limit_sec" INTEGER,
    "total_score" INTEGER,
    "total_max" INTEGER,
    "grade_band" TEXT,
    "marking_summary" TEXT,
    "status" "AttemptStatus" NOT NULL DEFAULT 'in_progress',

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptAnswer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "score" INTEGER,
    "max_score" INTEGER NOT NULL,
    "examiner_note" TEXT,
    "model_answer_snapshot" TEXT,
    "prompt_version" TEXT,

    CONSTRAINT "AttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "course_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "code" TEXT,
    "user_id" TEXT NOT NULL,
    "exam_board" "ExamBoard" NOT NULL,
    "product_id" TEXT,
    "year_level" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paper_id" TEXT NOT NULL,
    "paper_code" TEXT NOT NULL,
    "paper_number" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "exam_board" "ExamBoard" NOT NULL,
    "unit_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "prompt_version" TEXT,
    "model" TEXT,
    "generator_version" INTEGER NOT NULL DEFAULT 1,
    "structured_at" TIMESTAMP(3),
    "mark_scheme_status" "MarkSchemeStatus" NOT NULL DEFAULT 'none',

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "year" TEXT,
    "role" TEXT,
    "plan" "UserPlan" NOT NULL DEFAULT 'free',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_subscription_status" "StripeSubscriptionStatus",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_key" ON "Question"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_id_key" ON "Question"("question_id");

-- CreateIndex
CREATE INDEX "Question_paper_id_idx" ON "Question"("paper_id");

-- CreateIndex
CREATE INDEX "Question_parent_id_idx" ON "Question"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionRevision_id_key" ON "QuestionRevision"("id");

-- CreateIndex
CREATE INDEX "QuestionRevision_question_id_idx" ON "QuestionRevision"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "MarkScheme_id_key" ON "MarkScheme"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MarkScheme_mark_scheme_id_key" ON "MarkScheme"("mark_scheme_id");

-- CreateIndex
CREATE UNIQUE INDEX "MarkScheme_paper_id_key" ON "MarkScheme"("paper_id");

-- CreateIndex
CREATE UNIQUE INDEX "PaperReference_id_key" ON "PaperReference"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaperReference_reference_id_key" ON "PaperReference"("reference_id");

-- CreateIndex
CREATE INDEX "PaperReference_user_id_course_id_paper_code_idx" ON "PaperReference"("user_id", "course_id", "paper_code");

-- CreateIndex
CREATE INDEX "PaperReference_user_id_text_hash_idx" ON "PaperReference"("user_id", "text_hash");

-- CreateIndex
CREATE UNIQUE INDEX "PaperRating_id_key" ON "PaperRating"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaperRating_paper_id_key" ON "PaperRating"("paper_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionFeedback_id_key" ON "QuestionFeedback"("id");

-- CreateIndex
CREATE INDEX "QuestionFeedback_question_id_idx" ON "QuestionFeedback"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionFeedback_user_id_question_id_key" ON "QuestionFeedback"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Attempt_id_key" ON "Attempt"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Attempt_attempt_id_key" ON "Attempt"("attempt_id");

-- CreateIndex
CREATE INDEX "Attempt_user_id_paper_id_idx" ON "Attempt"("user_id", "paper_id");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptAnswer_id_key" ON "AttemptAnswer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptAnswer_attempt_id_question_id_key" ON "AttemptAnswer"("attempt_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_course_id_key" ON "Course"("course_id");

-- CreateIndex
CREATE INDEX "Course_user_id_idx" ON "Course"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_id_key" ON "Paper"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_paper_id_key" ON "Paper"("paper_id");

-- CreateIndex
CREATE INDEX "Paper_user_id_course_id_idx" ON "Paper"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper"("paper_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionRevision" ADD CONSTRAINT "QuestionRevision_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkScheme" ADD CONSTRAINT "MarkScheme_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper"("paper_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperReference" ADD CONSTRAINT "PaperReference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperRating" ADD CONSTRAINT "PaperRating_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper"("paper_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionFeedback" ADD CONSTRAINT "QuestionFeedback_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper"("paper_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "Attempt"("attempt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
