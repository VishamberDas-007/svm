import Joi from 'joi'
import util from '../utils/helper'
import { TCreateInstallment } from '../controllers/types/installment'
const PAYMENT_TYPE = ['CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER']
export const createInstallmentValidator = Joi.object<TCreateInstallment>({
    amount: Joi.number().required(),
    data: Joi.array()
        .items({
            paymentType: Joi.valid(...PAYMENT_TYPE).required(),
            accountNumber: Joi.string().allow('', null).optional(),
            adminAccountId: Joi.number().when('paymentType', {
                is: Joi.valid('CASH'),
                then: Joi.number().allow(null, '').optional(),
                otherwise: Joi.number().optional(),
            }),
            bankName: Joi.string().allow('', null).optional(),
            chequeNumber: Joi.string().allow('', null).optional(),
            upiId: Joi.string().allow('', null).optional(),
            penalty: Joi.number().allow('', null).optional(),
            // installmentNo: Joi.number().required(),
        })
        .required(),
    bookingId: util.uuid.required(),
})

export const installmentIdValidator = Joi.object({
    installmentId: util.uuid.required(),
})

export const updateInstallmentValidator = Joi.object({
    amount: Joi.number().required(),
    paymentType: Joi.valid(...PAYMENT_TYPE).required(),
    adminAccountId: Joi.number().when('paymentType', {
        is: Joi.valid('CASH'),
        then: Joi.number().allow(null, '').optional(),
        otherwise: Joi.number().optional(),
    }),
    accountNumber: Joi.string().allow('', null).optional(),
    bankName: Joi.string().allow('', null).optional(),
    chequeNumber: Joi.string().allow('', null).optional(),
    upiId: Joi.string().allow('', null).optional(),
    penalty: Joi.number().allow('', null).optional(),
    // installmentNo: Joi.number().required(),
    bookingId: util.uuid.required(),
})
