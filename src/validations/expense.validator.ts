import Joi from 'joi'
import { TCreateExpense } from '../controllers/types/expense'

export const createExpenseValidator = Joi.object<TCreateExpense>({
    brokerage: Joi.number().required(),
    landDevelopment: Joi.number().required(),
    landPurchase: Joi.number().required(),
    landVisitCharge: Joi.number().required(),
    nonAgricultural: Joi.number().required(),
    planningAndLayout: Joi.number().required(),
    projectId: Joi.string().required(),
})
