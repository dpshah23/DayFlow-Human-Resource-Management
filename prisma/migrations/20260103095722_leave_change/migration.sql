/*
  Warnings:

  - You are about to drop the column `from` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Leave` table. All the data in the column will be lost.
  - Made the column `reason` on table `Leave` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Leave" DROP CONSTRAINT "Leave_userId_fkey";

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "from",
DROP COLUMN "to",
DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leaveType" "LeaveType" NOT NULL DEFAULT 'PAID',
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "reason" SET NOT NULL,
ALTER COLUMN "reason" SET DEFAULT 'No reason provided';

-- CreateIndex
CREATE INDEX "Leave_userId_idx" ON "Leave"("userId");

-- CreateIndex
CREATE INDEX "Leave_status_idx" ON "Leave"("status");

-- CreateIndex
CREATE INDEX "Leave_startDate_idx" ON "Leave"("startDate");

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
