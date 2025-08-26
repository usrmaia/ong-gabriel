-- CreateEnum
CREATE TYPE "PsychStatus" AS ENUM ('APPROVED', 'FAILED', 'PENDING', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "Psych" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proofAddressId" TEXT NOT NULL,
    "curriculumVitaeId" TEXT NOT NULL,
    "CRP" TEXT NOT NULL,
    "note" TEXT,
    "hasXpSuicidePrevention" BOOLEAN NOT NULL,
    "pendingNote" TEXT,
    "interviewed" BOOLEAN NOT NULL DEFAULT false,
    "status" "PsychStatus" NOT NULL DEFAULT 'PENDING',
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "evaluatedAt" TIMESTAMP(3),

    CONSTRAINT "Psych_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Psych_userId_key" ON "Psych"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Psych_proofAddressId_key" ON "Psych"("proofAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Psych_curriculumVitaeId_key" ON "Psych"("curriculumVitaeId");

-- AddForeignKey
ALTER TABLE "Psych" ADD CONSTRAINT "Psych_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Psych" ADD CONSTRAINT "Psych_proofAddressId_fkey" FOREIGN KEY ("proofAddressId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Psych" ADD CONSTRAINT "Psych_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
