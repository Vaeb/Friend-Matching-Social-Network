-- AddForeignKey
ALTER TABLE "post_reactions_users" ADD CONSTRAINT "post_reactions_users_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions_users" ADD CONSTRAINT "comment_reactions_users_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
