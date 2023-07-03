-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "referralId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("referralId") ON DELETE SET NULL ON UPDATE CASCADE;
