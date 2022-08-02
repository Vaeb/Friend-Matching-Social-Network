/*
  Warnings:

  - Made the column `studentsOnly` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `universityId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "studentsOnly" SET NOT NULL,
ALTER COLUMN "universityId" SET NOT NULL;
