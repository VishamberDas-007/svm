import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TBooking, TBookingUpdate } from './types/booking'
import validator from '../validations'
import * as validation from '../validations/booking.validator'
import {
    BOOKING_E_0001,
    BOOKING_S_0001,
    BOOKING_S_0002,
    BOOKING_S_0003,
    BOOKING_S_0004,
} from '../config/responseCodes/booking'
import AppError from '../utils/AppError'
import {
    BankPayment,
    Booking,
    CashPayment,
    ChequePayment,
    UpiPayment,
} from '@prisma/client'

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createBookingValidator, req.body)

    const {
        address1,
        address2,
        adminAccountId,
        area,
        customerId,
        installmentAmt,
        installmentCount,
        paidAmt,
        paymentStatus,
        paymentType,
        pincode,
        projectId,
        remainAmt,
        totalAmt,
        accountNo,
        bankName,
        chequeNo,
        upiId,
    }: TBooking = req.body

    let newBooking: Booking | undefined,
        paymentDetails:
            | ChequePayment
            | UpiPayment
            | BankPayment
            | CashPayment
            | undefined

    await prisma.$transaction(async (prisma) => {
        newBooking = await prisma.booking.create({
            data: {
                projectId,
                address1,
                address2,
                pincode,
                area: +area,
                totalAmt: +totalAmt,
                paidAmt: +paidAmt,
                remainAmt: +remainAmt,
                installmentAmt: +installmentAmt,
                paymentType,
                paymentStatus,
                customerId,
                adminAccountId,
                installmentCount: +installmentCount,
            },
        })

        if (paymentType === 'CHEQUE') {
            paymentDetails = await prisma.chequePayment.create({
                data: {
                    amount: paidAmt,
                    bookingId: newBooking.bookingId,
                    bankName,
                    chequeNumber: chequeNo,
                },
            })
        } else if (paymentType === 'UPI') {
            paymentDetails = await prisma.upiPayment.create({
                data: {
                    bookingId: newBooking.bookingId,
                    amount: paidAmt,
                    upiId,
                },
            })
        } else if (paymentType === 'BANK_TRANSFER') {
            paymentDetails = await prisma.bankPayment.create({
                data: {
                    accountNumber: accountNo,
                    amount: paidAmt,
                    bankName,
                    bookingId: newBooking.bookingId,
                },
            })
        } else {
            paymentDetails = await prisma.cashPayment.create({
                data: {
                    amount: paidAmt,
                    bookingId: newBooking.bookingId,
                },
            })
        }
    })
    return responseHandler(res, BOOKING_S_0001, {
        ...newBooking,
        accountNo,
        bankName,
        chequeNo,
        upiId,
        paymentId: paymentDetails?.paymentId,
    })
})

export const getAllBookings = catchAsync(
    async (req: Request, res: Response) => {
        const result: any[] = []

        const bookingList = await prisma.booking.findMany({
            include: {
                project: true,
                customer: true,
                adminAccount: true,
            },
        })

        for await (const booking of bookingList) {
            let paymentDetails:
                | ChequePayment
                | UpiPayment
                | BankPayment
                | CashPayment
                | null
                | undefined

            if (booking.paymentType === 'BANK_TRANSFER')
                paymentDetails = await prisma.bankPayment.findFirst({
                    where: {
                        bookingId: booking.bookingId,
                    },
                })
            else if (booking.paymentType === 'CASH')
                paymentDetails = await prisma.cashPayment.findFirst({
                    where: {
                        bookingId: booking.bookingId,
                    },
                })
            else if (booking.paymentType === 'UPI')
                paymentDetails = await prisma.upiPayment.findFirst({
                    where: {
                        bookingId: booking.bookingId,
                    },
                })
            else if (booking.paymentType === 'CHEQUE')
                paymentDetails = await prisma.chequePayment.findFirst({
                    where: {
                        bookingId: booking.bookingId,
                    },
                })

            result.push({
                ...booking,
                projectName: booking.project.name,
                customerName: booking.customer.firstName.concat(
                    ' ',
                    booking.customer.lastName
                ),
                adminBankName: booking.adminAccount.bankName,
                ...paymentDetails,
                adminAccount: undefined,
                project: undefined,
                customer: undefined,
                amount: undefined,
            })
        }

        // const result = bookingList.map((booking) => ({
        //     ...booking,
        //     projectName: booking.project.name,
        //     customerName: booking.customer.firstName.concat(
        //         ' ',
        //         booking.customer.lastName
        //     ),
        //     adminBankName: booking.adminAccount.bankName,
        //     adminAccount: undefined,
        //     project: undefined,
        //     customer: undefined,
        // }))

        return responseHandler(res, BOOKING_S_0002, result)
    }
)

export const getBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.bookingIdValidator, req.params)

    const bookingId = req.params.bookingId

    const fetchBooking = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
        include: {
            adminAccount: true,
            project: true,
            customer: true,
        },
    })

    if (!fetchBooking) throw new AppError(BOOKING_E_0001)

    return responseHandler(res, BOOKING_S_0003, {
        ...fetchBooking,
        adminBankName: fetchBooking.adminAccount.bankName,
        projectName: fetchBooking.project.name,
        customerName: fetchBooking.customer.firstName.concat(
            ' ',
            fetchBooking.customer.lastName
        ),
        adminAccount: undefined,
        project: undefined,
        customer: undefined,
    })
})

export const updateBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.bookingIdValidator, req.params)
    await validator(validation.updateBookingValidator, req.body)
    const bookingId = req.params.booking

    const {
        address1,
        address2,
        adminAccountId,
        area,
        customerId,
        installmentAmt,
        installmentCount,
        paidAmt,
        paymentStatus,
        paymentType,
        pincode,
        projectId,
        remainAmt,
        totalAmt,
        accountNo,
        bankName,
        chequeNo,
        upiId,
        paymentId,
    }: TBookingUpdate = req.body

    let updatedBookingDetails: Booking | undefined

    const bookingExists = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
    })

    if (!bookingExists) throw new AppError(BOOKING_E_0001)
    else {
        await prisma.$transaction(async (prisma) => {
            updatedBookingDetails = await prisma.booking.update({
                where: {
                    bookingId,
                },
                data: {
                    address1,
                    address2,
                    adminAccountId,
                    area,
                    customerId,
                    installmentAmt,
                    installmentCount,
                    paidAmt,
                    paymentStatus,
                    paymentType,
                    pincode,
                    projectId,
                    remainAmt,
                    totalAmt,
                },
            })

            if (paymentType) {
                if (paymentType === 'CHEQUE') {
                    await prisma.chequePayment.update({
                        where: {
                            paymentId,
                        },
                        data: {
                            amount: paidAmt,
                            bankName,
                            chequeNumber: chequeNo,
                        },
                    })
                } else if (paymentType === 'UPI') {
                    await prisma.upiPayment.update({
                        where: {
                            paymentId,
                        },
                        data: {
                            amount: paidAmt,
                            upiId,
                        },
                    })
                } else if (paymentType === 'BANK_TRANSFER') {
                    await prisma.bankPayment.update({
                        where: {
                            paymentId,
                        },
                        data: {
                            accountNumber: accountNo,
                            amount: paidAmt,
                            bankName,
                        },
                    })
                } else {
                    await prisma.cashPayment.update({
                        where: {
                            paymentId,
                        },
                        data: {
                            amount: paidAmt,
                        },
                    })
                }
            }
        })

        return responseHandler(res, BOOKING_S_0004, updatedBookingDetails)
    }
})
