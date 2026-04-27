/*
  Warnings:

  - Added the required column `compoundingFreq` to the `FixedDepositAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestEarned` to the `FixedDepositAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FixedDepositAccount" ADD COLUMN     "compoundingFreq" TEXT NOT NULL,
ADD COLUMN     "interestEarned" DOUBLE PRECISION NOT NULL;
