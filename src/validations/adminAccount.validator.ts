import Joi from 'joi'
import { TAccountDetails } from '../controllers/types/adminAccount'

export const createAccountValidator = Joi.object<TAccountDetails>({
    accNo: Joi.string().required(),
    bankName: Joi.string().required(),
    name: Joi.string().required(),
})

export const updateAccountValidator = Joi.object<TAccountDetails>({
    accNo: Joi.string().optional(),
    bankName: Joi.string().optional(),
    name: Joi.string().optional(),
})

export const accountIdValidator = Joi.object({
    accountId: Joi.number().required(),
})
