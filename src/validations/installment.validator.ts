import Joi from 'joi'
import util from '../utils/helper'
import { TCreateInstallment } from '../controllers/types/installment'

export const createInstallmentValidator = Joi.object<TCreateInstallment>({
    amount: Joi.number().required(),
    data: Joi.array()
        .items({
            paymentType: Joi.valid(
                'CHEQUE',
                'UPI',
                'CASH',
                'BANK_TRANSFER'
            ).required(),
            accountNumber: Joi.string().required(),
            bankName: Joi.string().optional(),
            chequeNumber: Joi.string().optional(),
            upiId: Joi.string().optional(),
            penalty: Joi.number().optional(),
            installmentNo: Joi.number().required(),
        })
        .required(),
    bookingId: util.uuid.required(),
})

export const installmentIdValidator = Joi.object({
    installmentId: util.uuid.required(),
})

export const updateInstallmentValidator = Joi.object({
    amount: Joi.number().required(),
    installmentNo: Joi.number().required(),
})
