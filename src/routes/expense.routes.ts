import express from 'express'
import * as expenseController from '../controllers/expense.controller'

const expenseRouter = express.Router()

expenseRouter.post('/create', expenseController.addExpense)

expenseRouter.get('/get/:projectId', expenseController.getProjectExpense)

expenseRouter.get('/list', expenseController.getAllProjectExpense)

expenseRouter.put('/update/:projectId', expenseController.updateProjectExpense)

export { expenseRouter }
