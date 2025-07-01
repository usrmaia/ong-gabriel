/*
  Warnings:

  - Added the required column `monthlyFamilyIncomeCents` to the `FormAnamnesis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormAnamnesis" ADD COLUMN     "monthlyFamilyIncomeCents" BIGINT NOT NULL;
