-- CreateTable
CREATE TABLE "PatientAttendance" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateAt" TIMESTAMP(3),
    "note" TEXT,
    "durationMinutes" INTEGER,
    "professionalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientAttendance" ADD CONSTRAINT "PatientAttendance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAttendance" ADD CONSTRAINT "PatientAttendance_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
