import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { getInstallmentCount } from '../services/installment.service'
import prisma from '../db'
import { getBookingDetails } from '../services/booking.service'
import AppError from '../utils/AppError'
import {
    INSTALLMENT_E_0001,
    INSTALLMENT_E_0002,
    INSTALLMENT_E_0003,
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
    PaymentStatus,
} from '@prisma/client'
import validator from '../validations'
import * as validation from '../validations/installment.validator'
import * as generalValidation from '../validations/_general.validator'
// import { TRedisData } from './types/booking'
// import { getValueInRedis, setValueInRedis } from '../redis/config'

export const createInstallment = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.createInstallmentValidator, req.body)

        // proper upiId validation, correct account number validation
        const { amount, bookingId, data }: TCreateInstallment = req.body

        let installmentNo = await getInstallmentCount(bookingId)
        const bookingDetails = await getBookingDetails(bookingId)
        let newInstallment: Installment | undefined,
            paymentDetails:
                | IUpiPayment
                | ICashPayment
                | IChequePayment
                | IBankPayment
                | undefined
        let bookingUpdateData:
            | {
                  status: PaymentStatus
              }
            | undefined

        const bookingRemainAmt =
            bookingDetails.remainAmt - +(+amount * data.length)

        if (!bookingDetails.remainAmt) throw new AppError(INSTALLMENT_E_0001)
        else if (bookingRemainAmt < 0) throw new AppError(INSTALLMENT_E_0003)

        await prisma.$transaction(async (prisma) => {
            for await (const iterator of data) {
                newInstallment = await prisma.installment.create({
                    data: {
                        amount: +amount,
                        bookingId,
                        installmentNo,
                        paymentType: iterator.paymentType,
                        penalty: iterator.penalty,
                    },
                })

                ++installmentNo

                if (iterator.paymentType === 'BANK_TRANSFER') {
                    paymentDetails = await prisma.iBankPayment.create({
                        data: {
                            accountNumber: iterator.accountNumber || '',
                            amount,
                            bankName: iterator.bankName || '',
                            installmentId: newInstallment.installmentId,
                        },
                    })
                } else if (iterator.paymentType === 'CHEQUE') {
                    paymentDetails = await prisma.iChequePayment.create({
                        data: {
                            amount,
                            bankName: iterator.bankName || '',
                            chequeNumber: iterator.chequeNumber || '',
                            installmentId: newInstallment.installmentId,
                        },
                    })
                } else if (iterator.paymentType === 'UPI') {
                    paymentDetails = await prisma.iUpiPayment.create({
                        data: {
                            upiId: iterator.upiId || '',
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
            }

            if (!bookingRemainAmt) {
                bookingUpdateData = {
                    status: 'COMPLETED',
                }

                // need to check the transaction time if exceeded then need to place the redis outside the transaction

                // uncomment on remote redis

                /*                const date = bookingDetails.createdAt.getDate()

                const redisDetails: TRedisData[] = JSON.parse(
                    JSON.stringify((await getValueInRedis(`${date}`)) || [])
                )

                const bookingDataIndexToDelete = redisDetails.findIndex(
                    (obj) => obj.bookingId === bookingDetails.bookingId
                )

                redisDetails.splice(bookingDataIndexToDelete, 1)

                await setValueInRedis(date, JSON.stringify(redisDetails))*/
            }

            await prisma.booking.update({
                where: {
                    bookingId,
                },
                data: {
                    remainAmt: bookingDetails.remainAmt - +amount * data.length,
                    ...bookingUpdateData,
                },
            })
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

        const { amount, installmentNo }: Installment = req.body

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
                installmentNo: +installmentNo,
            },
        })

        return responseHandler(res, INSTALLMENT_S_0003, updateInstallment)
    }
)

export const fetchBookingInstallmentDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(generalValidation.bookingIdValidator, req.params)
        const { bookingId } = req.params

        const installmentNo = await getInstallmentCount(bookingId)
        const bookingDetails = await getBookingDetails(bookingId)

        return responseHandler(res, INSTALLMENT_S_0002, {
            customerName:
                bookingDetails.customer.firstName +
                ' ' +
                bookingDetails.customer.lastName,
            installmentAmt: bookingDetails.installmentAmt,
            pincode: bookingDetails.pincode,
            installmentNo,
            address1: bookingDetails.address1,
            address2: bookingDetails.address2,
        })
    }
)
