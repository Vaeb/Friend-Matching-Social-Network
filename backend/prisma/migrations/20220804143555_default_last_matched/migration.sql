/*
  Warnings:

  - Made the column `lastAutoMatched` on table `match_settings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET NOT NULL,
ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';
