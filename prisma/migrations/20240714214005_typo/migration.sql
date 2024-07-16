/*
  Warnings:

  - You are about to drop the column `subsmission` on the `CourseClassAssignment` table. All the data in the column will be lost.
  - Added the required column `submission` to the `CourseClassAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseClassAssignment" DROP COLUMN "subsmission",
ADD COLUMN     "submission" TEXT NOT NULL;
