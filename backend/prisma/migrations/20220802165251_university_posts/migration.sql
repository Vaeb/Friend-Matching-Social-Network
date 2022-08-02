-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "studentsOnly" BOOLEAN DEFAULT false,
ADD COLUMN     "universityId" INTEGER;

-- AlterTable
ALTER TABLE "universities" ADD COLUMN     "publicRestricted" INTEGER NOT NULL DEFAULT 0;
