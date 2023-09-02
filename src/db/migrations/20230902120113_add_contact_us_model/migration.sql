-- CreateTable
CREATE TABLE "ContactUs" (
    "contactUsId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("contactUsId")
);
