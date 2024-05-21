/*
  Warnings:

  - Added the required column `dastavejAmt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminderDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "dastavejAmt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reminderDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "BookingPenalty" (
    "penaltyId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingPenalty_pkey" PRIMARY KEY ("penaltyId")
);

-- AddForeignKey
ALTER TABLE "BookingPenalty" ADD CONSTRAINT "BookingPenalty_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;
