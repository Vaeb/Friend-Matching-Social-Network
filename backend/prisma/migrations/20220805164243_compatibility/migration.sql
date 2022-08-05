/*
  Warnings:

  - You are about to alter the column `compatibility` on the `user_relations` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `compatibility` on table `user_relations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "user_relations" ALTER COLUMN "compatibility" SET NOT NULL,
ALTER COLUMN "compatibility" SET DEFAULT 0,
ALTER COLUMN "compatibility" SET DATA TYPE INTEGER;
