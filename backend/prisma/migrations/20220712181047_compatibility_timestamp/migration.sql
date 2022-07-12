-- AlterTable
ALTER TABLE "user_relations" ADD COLUMN     "updatedCompatibility" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updatedInterests" TIMESTAMP(3);
