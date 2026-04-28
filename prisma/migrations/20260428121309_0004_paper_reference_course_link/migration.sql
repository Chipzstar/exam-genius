-- AddForeignKey
ALTER TABLE "PaperReference" ADD CONSTRAINT "PaperReference_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
