-- CreateEnum
CREATE TYPE "WhoLivesWith" AS ENUM ('familia', 'amigos', 'outras_pessoas', 'sozinho');

-- CreateEnum
CREATE TYPE "DifficultiesBasic" AS ENUM ('sim', 'as_vezes', 'nao');

-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('feliz', 'neutro', 'triste', 'raiva', 'ansioso', 'choroso');

-- CreateEnum
CREATE TYPE "DifficultiesSleeping" AS ENUM ('sim', 'as_vezes', 'nao');

-- CreateEnum
CREATE TYPE "DifficultiesEating" AS ENUM ('sim', 'as_vezes', 'nao');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FormAnamnesis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "whoLivesWith" "WhoLivesWith"[],
    "occupation" TEXT NOT NULL,
    "monthlyIncomeCents" BIGINT NOT NULL,
    "monthlyFamilyIncomeCents" BIGINT NOT NULL,
    "difficultiesBasic" "DifficultiesBasic" NOT NULL,
    "socialBenefits" TEXT,
    "emotionalState" "EmotionalState" NOT NULL,
    "difficultiesSleeping" "DifficultiesSleeping" NOT NULL,
    "difficultyEating" "DifficultiesEating" NOT NULL,
    "canNotDealWithProblems" TEXT,
    "selfDestructiveThoughts" TEXT,
    "haveSomeoneToTrust" TEXT,
    "haveEmotionalSupport" TEXT,
    "haveFinancialSupport" TEXT,
    "hasMedicalDiagnosis" TEXT,
    "currentlyUndergoingPsychTreatment" TEXT,
    "currentlyTakingMedication" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormAnamnesis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormAnamnesis" ADD CONSTRAINT "FormAnamnesis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
