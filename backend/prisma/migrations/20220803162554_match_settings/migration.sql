-- AlterTable
ALTER TABLE "users" ADD COLUMN     "matchingEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "match_settings" (
    "userId" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "manualEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastAutoMatched" TIMESTAMP(3),
    "autoFreq" INTEGER NOT NULL DEFAULT 0,
    "snoozedUntil" TIMESTAMP(3),
    "matchStudents" BOOLEAN NOT NULL DEFAULT false,
    "nextManualMatchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_settings_pkey" PRIMARY KEY ("userId","universityId")
);

-- AddForeignKey
ALTER TABLE "match_settings" ADD CONSTRAINT "match_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_settings" ADD CONSTRAINT "match_settings_nextManualMatchId_fkey" FOREIGN KEY ("nextManualMatchId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_settings" ADD CONSTRAINT "match_settings_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
