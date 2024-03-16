/*
  Warnings:

  - The values [AADHAR] on the enum `CustomerImageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address1` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `plotNo` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone1` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CustomerImageType_new" AS ENUM ('AADHAR_FRONT', 'AADHAR_REAR', 'PAN', 'PHOTO');
ALTER TABLE "CustomerImage" ALTER COLUMN "type" TYPE "CustomerImageType_new" USING ("type"::text::"CustomerImageType_new");
ALTER TYPE "CustomerImageType" RENAME TO "CustomerImageType_old";
ALTER TYPE "CustomerImageType_new" RENAME TO "CustomerImageType";
DROP TYPE "CustomerImageType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "pincode",
ADD COLUMN     "plotNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone1" TEXT NOT NULL,
ADD COLUMN     "phone2" TEXT,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
