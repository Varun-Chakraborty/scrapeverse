-- Track the version of each legal document a user consented to, keeping a
-- full history (one row per consent/version).
-- DropIndex
DROP INDEX "UserConsent_userId_consentType_key";

-- AlterTable
-- Backfill existing consent rows with the first released version so the
-- required column can be added even when the table is not empty.
ALTER TABLE "UserConsent" ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';

-- CreateIndex
CREATE INDEX "UserConsent_userId_consentType_createdAt_idx" ON "UserConsent"("userId", "consentType", "createdAt");
