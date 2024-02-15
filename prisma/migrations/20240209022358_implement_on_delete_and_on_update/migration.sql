-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_author_id_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_category_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollment" DROP CONSTRAINT "course_enrollment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollment" DROP CONSTRAINT "course_enrollment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course_lesson" DROP CONSTRAINT "course_lesson_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_like" DROP CONSTRAINT "course_like_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_like" DROP CONSTRAINT "course_like_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course_video" DROP CONSTRAINT "course_video_lesson_id_fkey";

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_category"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "course_lesson" ADD CONSTRAINT "course_lesson_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_video" ADD CONSTRAINT "course_video_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "course_lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_like" ADD CONSTRAINT "course_like_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_like" ADD CONSTRAINT "course_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
