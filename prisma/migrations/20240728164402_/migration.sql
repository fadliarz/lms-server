/*
  Warnings:

  - Added the required column `code` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blood_type` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergency_number` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "course_video" ADD COLUMN     "attachment" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "blood_type" TEXT NOT NULL,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emergency_number" TEXT NOT NULL,
ADD COLUMN     "hmm" TEXT[],
ADD COLUMN     "hobbies" TEXT[],
ADD COLUMN     "line_id" TEXT NOT NULL,
ADD COLUMN     "medical_histories" TEXT[],
ADD COLUMN     "ukm" TEXT[];
