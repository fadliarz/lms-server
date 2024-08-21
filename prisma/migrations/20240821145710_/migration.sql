/*
  Warnings:

  - You are about to drop the column `division_id` on the `department_program` table. All the data in the column will be lost.
  - Added the required column `department_id` to the `department_program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "department_program" DROP CONSTRAINT "department_program_division_id_fkey";

-- AlterTable
ALTER TABLE "department_program" DROP COLUMN "division_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "department_program" ADD CONSTRAINT "department_program_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
