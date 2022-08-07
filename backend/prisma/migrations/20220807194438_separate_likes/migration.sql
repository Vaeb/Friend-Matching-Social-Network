/*
  Warnings:

  - You are about to drop the `reaction_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reaction_users" DROP CONSTRAINT "reaction_users_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "reaction_users" DROP CONSTRAINT "reactions_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_commentId_fkey";

-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_postId_fkey";

-- DropTable
DROP TABLE "reaction_users";

-- DropTable
DROP TABLE "reactions";

-- CreateTable
CREATE TABLE "post_reactions" (
    "postId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "num" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("postId","type")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "commentId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "num" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("commentId","type")
);

-- CreateTable
CREATE TABLE "post_reactions_users" (
    "postId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_reactions_users_pkey" PRIMARY KEY ("postId","type","userId")
);

-- CreateTable
CREATE TABLE "comment_reactions_users" (
    "commentId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_reactions_users_pkey" PRIMARY KEY ("commentId","type","userId")
);

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions_users" ADD CONSTRAINT "post_reactions_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions_users" ADD CONSTRAINT "post_reactions_users_postId_type_fkey" FOREIGN KEY ("postId", "type") REFERENCES "post_reactions"("postId", "type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions_users" ADD CONSTRAINT "comment_reactions_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions_users" ADD CONSTRAINT "comment_reactions_users_commentId_type_fkey" FOREIGN KEY ("commentId", "type") REFERENCES "comment_reactions"("commentId", "type") ON DELETE RESTRICT ON UPDATE CASCADE;
