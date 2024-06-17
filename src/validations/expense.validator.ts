import Joi from 'joi'
import {
    TCreateExpense,
    TMonthlyExpenseCreate,
    TUpdateExpense,
} from '../controllers/types/expense'

export const createExpenseValidator = Joi.object<TCreateExpense>({
    brokerage: Joi.number().required(),
    landDevelopment: Joi.number().required(),
    landPurchase: Joi.number().required(),
    landVisitCharge: Joi.number().required(),
    nonAgricultural: Joi.number().required(),
    planningAndLayout: Joi.number().required(),
    projectId: Joi.string().required(),
    miscExpense: Joi.array()
        .items({
            expenseName: Joi.string().required(),
            cost: Joi.number().required(),
        })
        .optional(),
})

export const expenseIdValidator = Joi.object({
    expenseId: Joi.string().required(),
})

export const updateExpenseValidator = Joi.object<TUpdateExpense>({
    brokerage: Joi.number().optional(),
    landDevelopment: Joi.number().optional(),
    landPurchase: Joi.number().optional(),
    landVisitCharge: Joi.number().optional(),
    nonAgricultural: Joi.number().optional(),
    planningAndLayout: Joi.number().optional(),
    projectId: Joi.string().optional(),
    miscExpense: Joi.array()
        .items({
            expenseName: Joi.string().required(),
            cost: Joi.number().required(),
        })
        .optional(),
})

export const createMonthlyExpense = Joi.object<{ data: TMonthlyExpenseCreate }>(
    {
        data: Joi.array().items({
            cost: Joi.number().required(),
            expenseName: Joi.string().required(),
            createdAt: Joi.date().required(),
        }),
    }
)

export const updateMonthlyExpense = Joi.object<TMonthlyExpenseCreate>({
    cost: Joi.number().required(),
    expenseName: Joi.string().required(),
    createdAt: Joi.date().required(),
})
