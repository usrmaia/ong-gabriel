/*
  Warnings:

  - You are about to drop the column `emailVerifiedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerifiedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifiedAt",
DROP COLUMN "phoneVerifiedAt",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "phoneVerified" TIMESTAMP(3);
