/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_employeeId_key" ON "Profile"("employeeId");
