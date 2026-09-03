-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "githubId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
