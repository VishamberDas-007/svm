import Joi from 'joi'
import { TCreateExpense, TUpdateExpense } from '../controllers/types/expense'

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
            name: Joi.string().required(),
            value: Joi.number().required(),
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
            name: Joi.string().required(),
            value: Joi.number().required(),
        })
        .optional(),
})
