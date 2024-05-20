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
    INSTALLMENT_E_0004,
    INSTALLMENT_S_0001,
    INSTALLMENT_S_0002,
    INSTALLMENT_S_0003,
    INSTALLMENT_S_0004,
    INSTALLMENT_S_0005,
} from '../config/responseCodes/installment'
import { TCreateInstallment, TUpdateInstallment } from './types/installment'
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
import { TListData } from '../types/global.types'
import util from '../utils/helper'
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
                        adminAccountId: iterator.adminAccountId,
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

export const fetchCurrentMonthInstallmentList = catchAsync(
    async (req: Request, res: Response) => {
        const bookingList = await prisma.booking.findMany({
            where: {
                paymentStatus: {
                    notIn: ['CANCEL', 'COMPLETED'],
                },
            },
            include: {
                customer: true,
            },
        })

        const currMonthTotalDays = util.currMonthDays()

        // conditions
        // if the month date is less than 31 then need to include 31 too and vice versa

        // await prisma.$transaction(async (prisma) => {})

        // get current date
        // fetch the booking list conditionally on status and date
        // filter the booking list as per the current month
        // append the list data into a db
        // send the list by fetching it from db by formatting the data
        // send the message in bulk manner to all the clients
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
                booking: {
                    include: {
                        customer: true,
                        project: true,
                    },
                },
            },
        })

        if (!getInstallmentDetails) throw new AppError(INSTALLMENT_E_0002)

        const result = {
            ...getInstallmentDetails,
            customer: getInstallmentDetails.booking.customer,
            plotNo: getInstallmentDetails.booking.plotNo,
            project: {
                address2: getInstallmentDetails.booking.project.address2,
                logo: getInstallmentDetails.booking.project.logoUrl,
            },
            booking: undefined,
        }
        return responseHandler(res, INSTALLMENT_S_0002, result)
    }
)

export const updateInstallmentDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.installmentIdValidator, req.params)
        await validator(validation.updateInstallmentValidator, req.body)

        const { installmentId } = req.params

        const {
            amount,
            bookingId,
            paymentType: updatePaymentType,
            accountNumber,
            bankName,
            chequeNumber,
            penalty,
            upiId,
            adminAccountId,
        }: TUpdateInstallment = req.body
        let paymentId: string | undefined, updateInstallment

        const installmentDetailExists = await prisma.installment.findFirst({
            where: { installmentId },
            include: {
                bankPayment: true,
                cashPayment: true,
                chequePayment: true,
                upiPayment: true,
            },
        })

        if (!installmentDetailExists) throw new AppError(INSTALLMENT_E_0002)

        const {
            bankPayment,
            cashPayment,
            chequePayment,
            upiPayment,
            paymentType: existPaymentType,
        } = installmentDetailExists

        await prisma.$transaction(async (prisma) => {
            if (existPaymentType !== updatePaymentType) {
                if (existPaymentType === 'BANK_TRANSFER') {
                    paymentId = bankPayment[0].paymentId

                    await prisma.iBankPayment.delete({
                        where: {
                            paymentId,
                        },
                    })
                } else if (existPaymentType === 'CASH') {
                    paymentId = cashPayment[0].paymentId

                    await prisma.iCashPayment.delete({
                        where: {
                            paymentId,
                        },
                    })
                } else if (existPaymentType === 'CHEQUE') {
                    paymentId = chequePayment[0].paymentId

                    await prisma.iChequePayment.delete({
                        where: {
                            paymentId,
                        },
                    })
                } else if (existPaymentType === 'UPI') {
                    paymentId = upiPayment[0].paymentId

                    await prisma.iUpiPayment.delete({
                        where: {
                            paymentId,
                        },
                    })
                }

                if (updatePaymentType === 'BANK_TRANSFER') {
                    await prisma.iBankPayment.create({
                        data: {
                            accountNumber,
                            amount,
                            bankName,
                            installmentId,
                        },
                    })
                } else if (updatePaymentType === 'CASH') {
                    await prisma.iCashPayment.create({
                        data: {
                            amount,
                            installmentId,
                        },
                    })
                } else if (updatePaymentType === 'CHEQUE') {
                    await prisma.iChequePayment.create({
                        data: {
                            amount,
                            bankName,
                            chequeNumber,
                            installmentId,
                        },
                    })
                } else if (updatePaymentType === 'UPI') {
                    await prisma.iUpiPayment.create({
                        data: {
                            amount,
                            upiId,
                            installmentId,
                        },
                    })
                }
            }

            updateInstallment = await prisma.installment.update({
                where: {
                    installmentId,
                },
                data: {
                    amount: +amount,
                    bookingId,
                    penalty,
                    paymentType: updatePaymentType,
                    adminAccountId,
                },
            })
        })
        return responseHandler(res, INSTALLMENT_S_0003, updateInstallment)
    }
)

export const fetchBookingInstallmentDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(generalValidation.bookingIdValidator, req.params)
        const { bookingId } = req.params

        const installmentNo = await getInstallmentCount(bookingId)

        const bookingDetails = await prisma.booking.findFirst({
            where: {
                bookingId,
            },
            include: {
                customer: true,
                project: true,
            },
        })

        if (!bookingDetails) throw new AppError(INSTALLMENT_E_0004)

        const formatCustomerData = bookingDetails.customer.map((customer) => ({
            name: customer.name,
            customerId: customer.customerId,
        }))

        // TODO: Add the address of project and plot no of the booking in response
        return responseHandler(res, INSTALLMENT_S_0002, {
            installmentAmt: bookingDetails.installmentAmt,
            installmentNo,
            address1: bookingDetails.project.address1 || '',
            address2: bookingDetails.project.address2 || '',
            plotNo: bookingDetails.plotNo,
            customer: formatCustomerData,
        })
    }
)

export const deleteInstallment = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.installmentIdValidator, req.params)

        const { installmentId } = req.params

        const installmentDetails = await prisma.installment.findFirst({
            where: {
                installmentId,
            },
        })

        if (!installmentDetails) throw new AppError(INSTALLMENT_E_0001)

        await prisma.installment.delete({
            where: {
                installmentId,
            },
        })

        return responseHandler(res, INSTALLMENT_S_0004)
    }
)

export const installmentList = catchAsync(
    async (req: Request, res: Response) => {
        const { page = 1, pageSize = 10, bookingId } = req.query
        let totalCount = 0,
            totalQueryCount = 0,
            whereClause = {}

        if (bookingId) {
            whereClause = {
                bookingId,
            }
        }

        const list = (
            await prisma.installment.findMany({
                where: whereClause,
                include: {
                    booking: {
                        include: {
                            customer: true,
                        },
                    },
                },
            })
        ).map((obj) => ({
            ...obj,
            customer: obj.booking.customer,
            booking: undefined,
        }))

        totalCount = await prisma.installment.count({
            where: whereClause,
        })

        totalQueryCount = await prisma.installment.count({
            where: whereClause,
        })

        const result: TListData<Installment> = {
            list: list,
            meta: {
                page: +page,
                pageSize: +pageSize,
                totalCount,
                totalQueryCount,
            },
        }

        return responseHandler(res, INSTALLMENT_S_0005, result)
    }
)
