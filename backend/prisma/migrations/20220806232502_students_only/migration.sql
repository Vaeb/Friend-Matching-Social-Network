/*
  Warnings:

  - You are about to drop the column `matchStudents` on the `match_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_settings" DROP COLUMN "matchStudents",
ADD COLUMN     "studentsOnly" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';
