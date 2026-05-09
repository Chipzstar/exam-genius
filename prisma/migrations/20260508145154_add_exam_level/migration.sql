-- CreateEnum
CREATE TYPE "ExamLevel" AS ENUM ('a_level', 'as_level');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "exam_level" "ExamLevel" NOT NULL DEFAULT 'a_level';
