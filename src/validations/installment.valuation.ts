import Joi from 'joi'
import util from '../utils/helper'

export const createInstallmentValidator = Joi.object({
    amount: Joi.number().required(),
    name: Joi.string().required(),
    bookingId: util.uuid.required(),
    paymentType: Joi.valid('').required(),
    accountNumber: Joi.string().required(),
    bankName: Joi.string().required(),
    chequeNumber: Joi.string().required(),
    upiId: Joi.string().optional(),
})

export const installmentIdValidator = Joi.object({
    installmentId: util.uuid.required(),
})

export const updateInstallmentValidator = Joi.object({
    amount: Joi.number().required(),
    name: Joi.string().required(),
})
