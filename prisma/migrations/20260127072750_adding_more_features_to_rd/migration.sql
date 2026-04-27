/*
  Warnings:

  - Added the required column `interestEarned` to the `RecurringDepositAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maturityDate` to the `RecurringDepositAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecurringDepositAccount" ADD COLUMN     "interestEarned" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maturityDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nomineeName" TEXT,
ADD COLUMN     "nomineeRelation" TEXT;
