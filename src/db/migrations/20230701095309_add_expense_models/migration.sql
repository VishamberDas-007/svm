-- CreateTable
CREATE TABLE "Expense" (
    "expenseId" TEXT NOT NULL,
    "landPurchase" INTEGER NOT NULL,
    "nonAgricultural" INTEGER NOT NULL,
    "planningAndLayout" INTEGER NOT NULL,
    "landDevelopment" INTEGER NOT NULL,
    "brokerage" INTEGER NOT NULL,
    "landVisitCharge" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenseId")
);

-- CreateTable
CREATE TABLE "MiscExpense" (
    "miscExpenseId" TEXT NOT NULL,
    "expenseName" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiscExpense_pkey" PRIMARY KEY ("miscExpenseId")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiscExpense" ADD CONSTRAINT "MiscExpense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
