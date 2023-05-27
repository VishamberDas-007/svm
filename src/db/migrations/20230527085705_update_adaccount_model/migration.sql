/*
  Warnings:

  - Added the required column `accNo` to the `AdminAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "accNo" TEXT NOT NULL;
