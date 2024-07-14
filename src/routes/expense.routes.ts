import express from 'express'
import * as expenseController from '../controllers/expense.controller'

const expenseRouter = express.Router()

expenseRouter.post('/create', expenseController.addExpense)

expenseRouter.get('/get/:projectId', expenseController.getProjectExpense)

expenseRouter.get('/list', expenseController.getAllProjectExpense)

expenseRouter.put('/update/:expenseId', expenseController.updateProjectExpense)

// monthly expense routes [TABLE: MonthlyExpense]

expenseRouter.post('/monthly/create', expenseController.createMonthlyExpense)

expenseRouter.put(
    '/monthly/update/:expenseId',
    expenseController.updateMonthlyExpense
)

expenseRouter.get(
    '/monthly/:monthYear',
    expenseController.getParticularMonthExpense
)

expenseRouter.get('/monthly-list', expenseController.getAllMonthlyExpense)

export { expenseRouter }
