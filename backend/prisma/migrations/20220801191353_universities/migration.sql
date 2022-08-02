/*
  Warnings:

  - You are about to drop the column `universityId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_universityId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "universityId";

-- CreateTable
CREATE TABLE "_UniversityToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UniversityToUser_AB_unique" ON "_UniversityToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_UniversityToUser_B_index" ON "_UniversityToUser"("B");

-- AddForeignKey
ALTER TABLE "_UniversityToUser" ADD CONSTRAINT "_UniversityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UniversityToUser" ADD CONSTRAINT "_UniversityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
