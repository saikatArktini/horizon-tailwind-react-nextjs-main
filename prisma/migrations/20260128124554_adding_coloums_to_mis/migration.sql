/*
  Warnings:

  - Added the required column `maturityAmount` to the `MISAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maturityDate` to the `MISAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalInterest` to the `MISAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MISAccount" ADD COLUMN     "maturityAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maturityDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalInterest" DOUBLE PRECISION NOT NULL;
