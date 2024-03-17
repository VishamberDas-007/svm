/*
  Warnings:

  - You are about to drop the column `aadharNo` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone1]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_aadharNo_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "aadharNo";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone1_key" ON "Customer"("phone1");
