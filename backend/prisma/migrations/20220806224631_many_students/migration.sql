/*
  Warnings:

  - You are about to drop the `_ConfirmedStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConfirmedStudents" DROP CONSTRAINT "_ConfirmedStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConfirmedStudents" DROP CONSTRAINT "_ConfirmedStudents_B_fkey";

-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- DropTable
DROP TABLE "_ConfirmedStudents";

-- CreateTable
CREATE TABLE "university_students" (
    "userId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "uniEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_students_pkey" PRIMARY KEY ("userId","universityId")
);

-- AddForeignKey
ALTER TABLE "university_students" ADD CONSTRAINT "university_students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_students" ADD CONSTRAINT "university_students_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
