/*
  Warnings:

  - A unique constraint covering the columns `[availabilityId]` on the table `PatientAttendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[professionalId,availabilityId]` on the table `PatientAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PatientAttendance" ADD COLUMN     "availabilityId" TEXT;

-- CreateTable
CREATE TABLE "AvailabilityAttendance" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityAttendance_professionalId_startAt_endAt_key" ON "AvailabilityAttendance"("professionalId", "startAt", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAttendance_availabilityId_key" ON "PatientAttendance"("availabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAttendance_professionalId_availabilityId_key" ON "PatientAttendance"("professionalId", "availabilityId");

-- AddForeignKey
ALTER TABLE "AvailabilityAttendance" ADD CONSTRAINT "AvailabilityAttendance_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAttendance" ADD CONSTRAINT "PatientAttendance_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "AvailabilityAttendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
