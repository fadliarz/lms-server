/*
  Warnings:

  - The values [OWNER] on the enum `course_enrollment_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `course_enrollment` MODIFY `role` ENUM('INSTRUCTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT';
