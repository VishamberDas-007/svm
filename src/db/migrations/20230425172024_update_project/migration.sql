-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "Booking" (
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("bookingId")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Project"("projectId") ON DELETE SET NULL ON UPDATE CASCADE;
