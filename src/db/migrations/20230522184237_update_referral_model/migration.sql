/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Referral_phone_key" ON "Referral"("phone");
