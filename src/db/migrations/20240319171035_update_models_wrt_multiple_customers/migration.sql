/*
  Warnings:

  - You are about to drop the column `customerId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "customerId";

-- CreateTable
CREATE TABLE "_BookingToCustomer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToCustomer_AB_unique" ON "_BookingToCustomer"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToCustomer_B_index" ON "_BookingToCustomer"("B");

-- AddForeignKey
ALTER TABLE "_BookingToCustomer" ADD CONSTRAINT "_BookingToCustomer_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("bookingId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToCustomer" ADD CONSTRAINT "_BookingToCustomer_B_fkey" FOREIGN KEY ("B") REFERENCES "Customer"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;
