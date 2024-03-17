-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Installment" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;
