import Joi from 'joi'
import util from '../utils/helper'
import { TBooking, TBookingUpdate } from '../controllers/types/booking'
const paymentStatus = ['PENDING', 'PARTIAL', 'COMPLETED']

const paymentType = ['CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER']

export const createBookingValidator = Joi.object<TBooking>({
    area: Joi.number().required(),
    customerIds: Joi.array().items(Joi.string().required()).required(),
    installmentAmt: Joi.number().required(),
    installmentCount: Joi.number().required(),
    paidAmt: Joi.number().required(),
    paymentStatus: Joi.valid(...paymentStatus).required(),
    paymentType: Joi.valid(...paymentType).required(),
    installmentDate: Joi.date().required(),
    adminAccountId: Joi.number().when('paymentType', {
        is: Joi.valid('CASH'),
        then: Joi.number().allow(null, '').optional(),
        otherwise: Joi.number().required(),
    }),
    plotNo: Joi.string().required(),
    projectId: Joi.string().required(),
    remainAmt: Joi.number().required(),
    totalAmt: Joi.number().required(),
    referralId: util.uuid.allow('', null).optional(),
    accountNo: Joi.string().when('paymentType', {
        is: 'BANK_TRANSFER',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    bankName: Joi.string().when('paymentType', {
        is: 'BANK_TRANSFER' || 'CHEQUE',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    chequeNo: Joi.string().when('paymentType', {
        is: 'CHEQUE',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    upiId: Joi.string().when('paymentType', {
        is: 'UPI',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
})

export const bookingIdValidator = Joi.object<{ bookingId: string }>({
    bookingId: util.uuid.required(),
})

export const updateBookingValidator = Joi.object<TBookingUpdate>({
    area: Joi.number().optional(),
    customerIds: Joi.array().items(Joi.string().required()).optional(),
    installmentAmt: Joi.number().optional(),
    installmentCount: Joi.number().optional(),
    paidAmt: Joi.number().optional(),
    paymentStatus: Joi.valid(...paymentStatus).optional(),
    installmentDate: Joi.string().optional(),
    paymentType: Joi.string().optional(),
    adminAccountId: Joi.number().when('paymentType', {
        is: Joi.valid('CASH'),
        then: Joi.number().allow(null, '').optional(),
        otherwise: Joi.number().optional(),
    }),
    plotNo: Joi.string().optional(),
    projectId: Joi.string().optional(),
    remainAmt: Joi.number().optional(),
    totalAmt: Joi.number().optional(),
    referralId: util.uuid.allow(null).optional(),
    accountNo: Joi.string().when('paymentType', {
        is: 'BANK_TRANSFER',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    bankName: Joi.string().when('paymentType', {
        is: 'BANK_TRANSFER' || 'CHEQUE',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    chequeNo: Joi.string().when('paymentType', {
        is: 'CHEQUE',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    upiId: Joi.string().when('paymentType', {
        is: 'UPI',
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
    paymentId: Joi.string().when('paymentType', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.allow('', null).optional(),
    }),
})
