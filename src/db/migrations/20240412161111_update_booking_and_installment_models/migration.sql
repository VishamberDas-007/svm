/*
  Warnings:

  - Added the required column `installmentDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCEL';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_adminAccountId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "installmentDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "adminAccountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "isMarried" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Installment" ADD COLUMN     "adminAccountId" INTEGER;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("adminAccountId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("adminAccountId") ON DELETE SET NULL ON UPDATE CASCADE;
