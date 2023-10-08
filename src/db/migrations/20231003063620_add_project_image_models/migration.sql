-- CreateEnum
CREATE TYPE "ProjectImageType" AS ENUM ('PLANNING', 'SITE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "logoUrl" TEXT,
ALTER COLUMN "area" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "ProjectImages" (
    "projectImageId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectImageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectImages_pkey" PRIMARY KEY ("projectImageId")
);

-- AddForeignKey
ALTER TABLE "ProjectImages" ADD CONSTRAINT "ProjectImages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
