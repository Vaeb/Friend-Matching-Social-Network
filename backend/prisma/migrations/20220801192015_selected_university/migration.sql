/*
  Warnings:

  - You are about to drop the `_UniversityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UniversityToUser" DROP CONSTRAINT "_UniversityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_UniversityToUser" DROP CONSTRAINT "_UniversityToUser_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "universityId" INTEGER;

-- DropTable
DROP TABLE "_UniversityToUser";

-- CreateTable
CREATE TABLE "_ConfirmedUnis" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConfirmedUnis_AB_unique" ON "_ConfirmedUnis"("A", "B");

-- CreateIndex
CREATE INDEX "_ConfirmedUnis_B_index" ON "_ConfirmedUnis"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmedUnis" ADD CONSTRAINT "_ConfirmedUnis_A_fkey" FOREIGN KEY ("A") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmedUnis" ADD CONSTRAINT "_ConfirmedUnis_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
