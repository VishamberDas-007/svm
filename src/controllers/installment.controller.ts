import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { getInstallmentCount } from '../services/installment.service'
import prisma from '../db'
import { getBookingDetails } from '../services/booking.service'
import AppError from '../utils/AppError'
import {
    INSTALLMENT_E_0001,
    INSTALLMENT_E_0002,
    INSTALLMENT_S_0001,
    INSTALLMENT_S_0002,
    INSTALLMENT_S_0003,
} from '../config/responseCodes/installment'
import { TCreateInstallment } from './types/installment'
import responseHandler from '../utils/responseHandler'
import {
    IBankPayment,
    ICashPayment,
    IChequePayment,
    IUpiPayment,
    Installment,
} from '@prisma/client'
import validator from '../validations'
import * as validation from '../validations/installment.valuation'

export const createInstallment = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.createInstallmentValidator, req.body)

        // proper upiId validation, correct account number validation
        const {
            amount,
            bookingId,
            name,
            paymentType,
            accountNumber,
            bankName,
            chequeNumber,
            upiId,
        }: TCreateInstallment = req.body

        const installmentNo = await getInstallmentCount(bookingId)
        const bookingDetails = await getBookingDetails(bookingId)
        let newInstallment: Installment | undefined,
            paymentDetails:
                | IUpiPayment
                | ICashPayment
                | IChequePayment
                | IBankPayment
                | undefined

        if (!bookingDetails.remainAmt) throw new AppError(INSTALLMENT_E_0001)

        await prisma.$transaction(async (prisma) => {
            newInstallment = await prisma.installment.create({
                data: {
                    amount: +amount,
                    installmentNo,
                    name,
                    paymentType,
                    bookingId,
                },
            })

            // add penalty if already missed the due date

            await prisma.booking.update({
                where: {
                    bookingId,
                },
                data: {
                    remainAmt: bookingDetails.remainAmt - +amount,
                },
            })

            if (paymentType === 'BANK_TRANSFER') {
                paymentDetails = await prisma.iBankPayment.create({
                    data: {
                        accountNumber,
                        amount,
                        bankName,
                        installmentId: newInstallment.installmentId,
                    },
                })
            } else if (paymentType === 'CHEQUE') {
                paymentDetails = await prisma.iChequePayment.create({
                    data: {
                        amount,
                        bankName,
                        chequeNumber,
                        installmentId: newInstallment.installmentId,
                    },
                })
            } else if (paymentType === 'UPI') {
                paymentDetails = await prisma.iUpiPayment.create({
                    data: {
                        upiId,
                        amount,
                        installmentId: newInstallment.installmentId,
                    },
                })
            } else {
                paymentDetails = await prisma.iCashPayment.create({
                    data: {
                        amount,
                        installmentId: newInstallment.installmentId,
                    },
                })
            }
        })

        return responseHandler(res, INSTALLMENT_S_0001, {
            ...newInstallment,
            ...paymentDetails,
        })
    }
)

export const fetchInstallmentDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.installmentIdValidator, req.params)

        const { installmentId } = req.params

        const getInstallmentDetails = await prisma.installment.findFirst({
            where: { installmentId },
            include: {
                bankPayment: true,
                cashPayment: true,
                chequePayment: true,
                upiPayment: true,
            },
        })

        if (!getInstallmentDetails) throw new AppError(INSTALLMENT_E_0002)
        else
            return responseHandler(
                res,
                INSTALLMENT_S_0002,
                getInstallmentDetails
            )
    }
)

export const updateInstallmentDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.installmentIdValidator, req.params)
        await validator(validation.updateInstallmentValidator, req.body)

        const { installmentId } = req.params

        const { amount, name, installmentNo }: Installment = req.body

        const installmentDetailExists = await prisma.installment.findFirst({
            where: { installmentId },
        })

        if (!installmentDetailExists) throw new AppError(INSTALLMENT_E_0002)

        const updateInstallment = await prisma.installment.update({
            where: {
                installmentId,
            },
            data: {
                amount: +amount,
                name,
                installmentNo: +installmentNo,
            },
        })

        return responseHandler(res, INSTALLMENT_S_0003, updateInstallment)
    }
)
