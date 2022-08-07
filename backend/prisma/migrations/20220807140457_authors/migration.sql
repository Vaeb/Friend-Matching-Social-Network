/*
  Warnings:

  - You are about to drop the column `creatorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `reactions` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
ALTER TABLE "posts" RENAME "creatorId" TO "authorId";
ALTER TABLE "comments" RENAME "creatorId" TO "authorId";
ALTER TABLE "reactions" RENAME "creatorId" TO "userId";

-- DropForeignKey
-- ALTER TABLE "comments" DROP CONSTRAINT "comments_creatorId_fkey";

-- DropForeignKey
-- ALTER TABLE "posts" DROP CONSTRAINT "posts_creatorId_fkey";

-- DropForeignKey
-- ALTER TABLE "reactions" DROP CONSTRAINT "reactions_creatorId_fkey";

-- AlterTable
-- ALTER TABLE "comments" DROP COLUMN "creatorId",
-- ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "match_settings" ALTER COLUMN "lastAutoMatched" SET DEFAULT '1970-01-01 00:00:00';

-- AlterTable
-- ALTER TABLE "posts" DROP COLUMN "creatorId",
-- ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
-- ALTER TABLE "reactions" DROP COLUMN "creatorId",
-- ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
-- ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
