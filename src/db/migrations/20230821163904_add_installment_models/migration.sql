-- CreateEnum
CREATE TYPE "IPaymentType" AS ENUM ('CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "IBankPayment" (
    "paymentId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IBankPayment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Installment" (
    "installmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentType" "IPaymentType" NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("installmentId")
);

-- CreateTable
CREATE TABLE "ICashPayment" (
    "paymentId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ICashPayment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "IChequePayment" (
    "paymentId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "chequeNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IChequePayment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "IUpiPayment" (
    "paymentId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "upiId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IUpiPayment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Installment_bookingId_installmentNo_key" ON "Installment"("bookingId", "installmentNo");

-- AddForeignKey
ALTER TABLE "IBankPayment" ADD CONSTRAINT "IBankPayment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("installmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICashPayment" ADD CONSTRAINT "ICashPayment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("installmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IChequePayment" ADD CONSTRAINT "IChequePayment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("installmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IUpiPayment" ADD CONSTRAINT "IUpiPayment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("installmentId") ON DELETE RESTRICT ON UPDATE CASCADE;
