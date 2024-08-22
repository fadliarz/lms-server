/*
  Warnings:

  - The values [OWNER,INSTRUCTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `author_id` on the `course` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Privilege" ADD VALUE 'EVENT';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'STUDENT');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_author_id_fkey";

-- DropIndex
DROP INDEX "course_author_id_idx";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "author_id";
