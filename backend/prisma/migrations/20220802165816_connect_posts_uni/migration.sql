-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
