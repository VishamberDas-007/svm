-- CreateTable
CREATE TABLE "MonthlyExpense" (
    "expenseId" TEXT NOT NULL,
    "expenseName" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyExpense_pkey" PRIMARY KEY ("expenseId")
);
