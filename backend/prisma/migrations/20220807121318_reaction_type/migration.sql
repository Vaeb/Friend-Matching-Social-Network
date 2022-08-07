/*
  Warnings:

  - You are about to drop the column `reaction` on the `reactions` table. All the data in the column will be lost.
  - Added the required column `type` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "reaction",
ADD COLUMN     "type" TEXT NOT NULL;
