/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_category_id_fkey";

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "course_enrollment" ADD COLUMN     "class_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "user_nim_key" ON "user"("nim");

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "course_class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
