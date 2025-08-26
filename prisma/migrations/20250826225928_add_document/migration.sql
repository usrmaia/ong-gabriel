-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('APPLICATION_PDF');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('PROOF_ADDRESS', 'CURRICULUM_VITAE');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" "MimeType" NOT NULL,
    "category" "DocumentCategory",
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
