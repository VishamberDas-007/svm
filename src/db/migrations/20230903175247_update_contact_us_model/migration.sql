-- CreateEnum
CREATE TYPE "ContactUsStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "ContactUs" ADD COLUMN     "status" "ContactUsStatus" NOT NULL DEFAULT 'PENDING';
