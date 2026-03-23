/*
  Warnings:

  - A unique constraint covering the columns `[memberId]` on the table `ClubMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ClubMembership_clubId_memberId_key";

-- AlterTable
ALTER TABLE "ClubMembership" ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "assignedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ClubMembership_memberId_key" ON "ClubMembership"("memberId");
