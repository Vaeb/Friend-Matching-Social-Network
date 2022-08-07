/*
  Warnings:

  - You are about to drop the column `userId` on the `reactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_creatorId_fkey";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "userId",
ADD COLUMN     "num" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "reaction_users" (
    "id" SERIAL NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reaction_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reaction_users" ADD CONSTRAINT "reactions_creatorId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_users" ADD CONSTRAINT "reaction_users_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "reactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
