/*
  Warnings:

  - You are about to drop the `CourseClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseClassAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseClass" DROP CONSTRAINT "CourseClass_course_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseClassAssignment" DROP CONSTRAINT "CourseClassAssignment_class_id_fkey";

-- DropTable
DROP TABLE "CourseClass";

-- DropTable
DROP TABLE "CourseClassAssignment";

-- CreateTable
CREATE TABLE "course_class" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_class_assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "course_class_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_class_title_key" ON "course_class"("title");

-- AddForeignKey
ALTER TABLE "course_class" ADD CONSTRAINT "course_class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class_assignment" ADD CONSTRAINT "course_class_assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "course_class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
