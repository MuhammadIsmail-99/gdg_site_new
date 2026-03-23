-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "locationType" TEXT NOT NULL DEFAULT 'In-person';

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "phoneNumber" TEXT;
