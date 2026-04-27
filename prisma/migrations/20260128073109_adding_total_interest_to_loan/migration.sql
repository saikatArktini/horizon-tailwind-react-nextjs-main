/*
  Warnings:

  - Added the required column `totalInterest` to the `LoanAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoanAccount" ADD COLUMN     "totalInterest" DOUBLE PRECISION NOT NULL;
