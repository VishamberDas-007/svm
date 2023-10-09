/*
  Warnings:

  - Added the required column `type` to the `CustomerImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerImageType" AS ENUM ('AADHAR', 'PAN');

-- AlterTable
ALTER TABLE "CustomerImage" ADD COLUMN     "type" "CustomerImageType" NOT NULL;
