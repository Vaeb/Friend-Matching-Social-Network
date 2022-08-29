-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments" USING HASH ("postId");

-- CreateIndex
CREATE INDEX "friend_requests_receiverId_idx" ON "friend_requests" USING HASH ("receiverId");

-- CreateIndex
CREATE INDEX "messages_fromId_idx" ON "messages" USING HASH ("fromId");

-- CreateIndex
CREATE INDEX "messages_toId_idx" ON "messages" USING HASH ("toId");

-- CreateIndex
CREATE INDEX "post_reactions_postId_idx" ON "post_reactions" USING HASH ("postId");

-- CreateIndex
CREATE INDEX "posts_universityId_idx" ON "posts" USING HASH ("universityId");

-- CreateIndex
CREATE INDEX "posts_authorId_universityId_idx" ON "posts"("authorId", "universityId");

-- CreateIndex
CREATE INDEX "user_interests_userId_idx" ON "user_interests" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "user_relations_compatibility_haveMatched_areFriends_idx" ON "user_relations"("compatibility", "haveMatched", "areFriends");
