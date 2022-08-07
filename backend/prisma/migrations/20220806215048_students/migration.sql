/*
  Warnings:

  - You are about to drop the `_ConfirmedUnis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConfirmedUnis" DROP CONSTRAINT "_ConfirmedUnis_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConfirmedUnis" DROP CONSTRAINT "_ConfirmedUnis_B_fkey";

-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- DropTable
DROP TABLE "_ConfirmedUnis";

-- CreateTable
CREATE TABLE "_ConfirmedStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConfirmedStudents_AB_unique" ON "_ConfirmedStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_ConfirmedStudents_B_index" ON "_ConfirmedStudents"("B");

-- AddForeignKey
ALTER TABLE "_ConfirmedStudents" ADD CONSTRAINT "_ConfirmedStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmedStudents" ADD CONSTRAINT "_ConfirmedStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
