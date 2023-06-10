import Joi from 'joi'
import { TCreateBooking, TUpdateBooking } from '../controllers/types/booking'
const paymentStatus = ['CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER']

export const createBookingValidator = Joi.object<TCreateBooking>({
    address1: Joi.string().required(),
    address2: Joi.string().allow('', null).optional(),
    adminAccountId: Joi.number().required(),
    area: Joi.number().required(),
    customerId: Joi.string().required(),
    installmentAmt: Joi.number().required(),
    installmentCount: Joi.number().required(),
    paidAmt: Joi.number().required(),
    paymentStatus: Joi.valid(...paymentStatus).required(),
    paymentType: Joi.string().required(),
    pincode: Joi.string().required(),
    projectId: Joi.string().required(),
    remainAmt: Joi.string().required(),
    totalAmt: Joi.string().required(),
})

export const bookingIdValidator = Joi.object<{ bookingId: string }>({
    bookingId: Joi.string().required(),
})

export const updateBookingValidator = Joi.object<TUpdateBooking>({
    address1: Joi.string().optional(),
    address2: Joi.string().optional(),
    adminAccountId: Joi.number().optional(),
    area: Joi.number().optional(),
    customerId: Joi.string().optional(),
    installmentAmt: Joi.number().optional(),
    installmentCount: Joi.number().optional(),
    paidAmt: Joi.number().optional(),
    paymentStatus: Joi.valid(...paymentStatus).optional(),
    paymentType: Joi.string().optional(),
    pincode: Joi.string().optional(),
    projectId: Joi.string().optional(),
    remainAmt: Joi.string().optional(),
    totalAmt: Joi.string().optional(),
})
