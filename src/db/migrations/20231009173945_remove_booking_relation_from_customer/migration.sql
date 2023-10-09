/*
  Warnings:

  - You are about to drop the column `bookingId` on the `CustomerImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerImage" DROP CONSTRAINT "CustomerImage_bookingId_fkey";

-- AlterTable
ALTER TABLE "CustomerImage" DROP COLUMN "bookingId";
