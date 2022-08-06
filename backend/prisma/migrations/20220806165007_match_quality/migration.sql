/*
  Warnings:

  - You are about to drop the column `matchPrecision` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "matchPrecision",
ADD COLUMN     "matchQuality" INTEGER NOT NULL DEFAULT 0;
