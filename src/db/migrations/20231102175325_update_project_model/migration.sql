/*
  Warnings:

  - Added the required column `downPayment` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emiAmt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ProjectImageType" ADD VALUE 'HAPPY_CUSTOMER';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "downPayment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "emiAmt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "totalAmt" DOUBLE PRECISION NOT NULL;
