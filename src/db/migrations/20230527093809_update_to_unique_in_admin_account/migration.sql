/*
  Warnings:

  - A unique constraint covering the columns `[accNo]` on the table `AdminAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_accNo_key" ON "AdminAccount"("accNo");
