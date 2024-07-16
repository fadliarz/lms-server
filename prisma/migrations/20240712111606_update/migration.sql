/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Class_title_key" ON "Class"("title");
