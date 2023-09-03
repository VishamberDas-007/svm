-- CreateTable
CREATE TABLE "Festival" (
    "festivalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailImg" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("festivalId")
);
