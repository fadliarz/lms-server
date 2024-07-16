/*
  Warnings:

  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_course_id_fkey";

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "CourseClass" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseClassAssignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subsmission" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "CourseClassAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseClass_title_key" ON "CourseClass"("title");

-- AddForeignKey
ALTER TABLE "CourseClass" ADD CONSTRAINT "CourseClass_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseClassAssignment" ADD CONSTRAINT "CourseClassAssignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "CourseClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
