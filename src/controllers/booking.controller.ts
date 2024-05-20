import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import {
    TBooking,
    TBookingList,
    TBookingUpdate,
    TPenalty,
    TRedisData,
} from './types/booking'
import validator from '../validations'
import * as validation from '../validations/booking.validator'
import {
    BOOKING_E_0001,
    BOOKING_E_0002,
    BOOKING_E_0003,
    BOOKING_E_0004,
    BOOKING_S_0001,
    BOOKING_S_0002,
    BOOKING_S_0003,
    BOOKING_S_0004,
    BOOKING_S_0005,
    BOOKING_S_0006,
    BOOKING_S_0007,
} from '../config/responseCodes/booking'
import AppError from '../utils/AppError'
import {
    AdminAccount,
    BankPayment,
    Booking,
    CashPayment,
    ChequePayment,
    Customer,
    Installment,
    Project,
    UpiPayment,
} from '@prisma/client'
import { TListData } from '../types/global.types'
// import { getValueInRedis, setValueInRedis } from '../redis/config'
import { checkIfProjectAreaExists } from '../services/booking.service'

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createBookingValidator, req.body)

    const {
        adminAccountId,
        area,
        customerIds,
        installmentAmt,
        installmentCount,
        paidAmt,
        paymentStatus,
        paymentType,
        plotNo,
        projectId,
        remainAmt,
        installmentDate,
        totalAmt,
        accountNo,
        bankName,
        chequeNo,
        upiId,
        referralId,
        reminderDate,
        dastavejAmt,
    }: TBooking = req.body

    const projectData = await prisma.project.findFirst({
        where: {
            projectId,
        },
        include: {
            booking: true,
        },
    })

    if (!projectData) throw new AppError(BOOKING_E_0002)

    const areaExists = checkIfProjectAreaExists(projectData, area)

    if (!areaExists) throw new AppError(BOOKING_E_0003)

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
                plotNo,
                area: +area,
                totalAmt: +totalAmt,
                dastavejAmt,
                installmentDate,
                paidAmt: +paidAmt,
                reminderDate,
                remainAmt: +remainAmt,
                installmentAmt: +installmentAmt,
                paymentType,
                paymentStatus,
                customer: {
                    connect: customerIds.map((customerId) => ({ customerId })),
                },
                adminAccountId,
                installmentCount: +installmentCount,
                referralId,
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

    if (newBooking) {
        // const customerDetails = await fetchCustomerDetails(customerId)

        const date = newBooking.createdAt.getDate()

        // uncomment on remote redis

        // let redisDetails: TRedisData[] = JSON.parse(
        //     JSON.stringify((await getValueInRedis(`${date}`)) || [])
        // )

        // redisDetails = [
        //     ...redisDetails,
        //     {
        //         bookingId: newBooking.bookingId,
        //         amount: installmentAmt,
        //         email: customerDetails?.email || '',
        //         name:
        //             customerDetails?.firstName +
        //             ' ' +
        //             customerDetails?.lastName,
        //         phone: customerDetails?.phone || '',
        //     },
        // ]

        // await setValueInRedis(date, JSON.stringify(redisDetails))
    }

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
    async (req: TBookingList, res: Response) => {
        const {
            page = 1,
            pageSize = 20,
            searchString,
            paymentStatus,
            paymentType,
            projectIds,
        } = req.query

        const result: any[] = []
        let whereClause = {},
            totalAmt = 0,
            paidAmt = 0

        if (searchString) {
            whereClause = {
                OR: [
                    {
                        customer: {
                            some: {
                                name: {
                                    startsWith: searchString,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                    {
                        customer: {
                            some: {
                                name: {
                                    contains: searchString,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                    {
                        customer: {
                            some: {
                                address: {
                                    contains: searchString,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            }
        }

        if (paymentStatus) {
            const array = paymentStatus.split(',')
            whereClause = {
                ...whereClause,
                paymentStatus: {
                    in: array,
                },
            }
        }

        if (paymentType) {
            const array = paymentStatus.split(',')
            whereClause = {
                ...whereClause,
                paymentType: {
                    in: array,
                },
            }
        }

        if (projectIds) {
            const array = projectIds.split(',')
            whereClause = {
                ...whereClause,
                projectId: {
                    in: array,
                },
            }
        }

        const skip = (+page - 1) * +pageSize
        let totalCount = 0,
            totalQueryCount = 0,
            bookingList: (Booking & {
                project: Project
                customer: Customer[]
                adminAccount: AdminAccount | null
                installment: Installment[] | null
            })[] = []

        bookingList = await prisma.booking.findMany({
            take: +pageSize,
            skip,
            where: {
                ...whereClause,
            },
            include: {
                project: true,
                customer: true,
                adminAccount: true,
                installment: true,
            },
            // TODO: pass where clause in the below query
            // where:,
            orderBy: {
                createdAt: 'desc',
            },
        })

        totalCount = await prisma.booking.count()

        totalQueryCount = await prisma.booking.count({
            where: whereClause,
        })

        for await (const booking of bookingList) {
            totalAmt = booking.totalAmt
            paidAmt =
                booking.paidAmt +
                (booking.installment?.reduce((prev, curr) => {
                    return curr.isDelete ? prev : prev + curr.amount
                }, 0) || 0)

            result.push({
                area: booking.area,
                projectName: booking.project.name,
                customerName: booking.customer.map((customer) => customer.name),
                adminBankName: booking.adminAccount?.bankName || null,
                totalAmt,
                paidAmt,
                remainAmt: booking.remainAmt,
                installment: undefined,
                adminAccount: undefined,
                project: undefined,
                customer: undefined,
                amount: undefined,
            })
        }

        const response: TListData<any> = {
            list: result,
            meta: {
                page: +page,
                pageSize: +pageSize,
                totalCount,
                totalQueryCount,
            },
        }

        return responseHandler(res, BOOKING_S_0002, response)
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
            customer: {
                include: {
                    customerImage: true,
                },
            },
        },
    })

    if (!fetchBooking) throw new AppError(BOOKING_E_0001)

    let paymentDetails:
        | ChequePayment
        | UpiPayment
        | BankPayment
        | CashPayment
        | null
        | undefined

    if (fetchBooking.paymentType === 'BANK_TRANSFER')
        paymentDetails = await prisma.bankPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        })
    else if (fetchBooking.paymentType === 'CASH')
        paymentDetails = await prisma.cashPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        })
    else if (fetchBooking.paymentType === 'UPI')
        paymentDetails = await prisma.upiPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        })
    else if (fetchBooking.paymentType === 'CHEQUE')
        paymentDetails = await prisma.chequePayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        })

    const formatCustomerData = fetchBooking.customer.map((obj) => ({
        customerId: obj.customerId,
        name: obj.name,
        phone1: obj.phone1,
        phone2: obj.phone2,
        images: obj.customerImage,
        address: obj.address,
        dob: obj.dob,
        isMarried: obj.isMarried,
        pincode: obj.pincode,
        state: obj.state,
        city: obj.city,
    }))

    return responseHandler(res, BOOKING_S_0003, {
        ...fetchBooking,
        adminBankName: fetchBooking.adminAccount?.bankName || null,
        customer: formatCustomerData,
        ...paymentDetails,
        project: {
            name: fetchBooking.project.name,
            description: fetchBooking.project.description,
            logo: fetchBooking.project.logoUrl,
            address1: fetchBooking.project.address1,
            address2: fetchBooking.project.address2,
        },
        adminAccount: undefined,
    })
})

export const updateBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.bookingIdValidator, req.params)
    await validator(validation.updateBookingValidator, req.body)
    const { bookingId } = req.params

    const {
        adminAccountId,
        area,
        customerIds,
        installmentAmt,
        installmentCount,
        paymentStatus,
        paymentType,
        projectId,
        plotNo,
        dastavejAmt,
        remainAmt,
        totalAmt,
        accountNo,
        bankName,
        chequeNo,
        installmentDate,
        upiId,
        reminderDate,
        paymentId,
        referralId,
    }: TBookingUpdate = req.body

    let { paidAmt } = req.body
    paidAmt = !isNaN(+paidAmt) ? +paidAmt : undefined

    let updatedBookingDetails: Booking | undefined

    const bookingExists = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
        include: {
            customer: true,
        },
    })

    if (!bookingExists) throw new AppError(BOOKING_E_0001)
    else {
        if (area) {
            const projectData = await prisma.project.findFirst({
                where: {
                    projectId,
                },
                include: {
                    booking: true,
                },
            })

            if (!projectData) throw new AppError(BOOKING_E_0002)

            const areaExists = checkIfProjectAreaExists(projectData, area)

            if (!areaExists) throw new AppError(BOOKING_E_0003)
        }

        let paymentDetails = {}
        await prisma.$transaction(async (prisma) => {
            if (paymentType === bookingExists.paymentType) {
                if (paymentType === 'BANK_TRANSFER') {
                    paymentDetails = {
                        bankPayment: {
                            update: {
                                where: {
                                    paymentId,
                                },
                                data: {
                                    accountNumber: accountNo,
                                    amount: paidAmt,
                                    bankName,
                                },
                            },
                        },
                    }
                } else if (paymentType === 'CASH') {
                    paymentDetails = {
                        cashPayment: {
                            update: {
                                where: { paymentId },
                                data: { amount: paidAmt },
                            },
                        },
                    }
                } else if (paymentType === 'CHEQUE') {
                    paymentDetails = {
                        chequePayment: {
                            update: {
                                where: {
                                    paymentId,
                                },
                                data: {
                                    amount: paidAmt,
                                    bankName,
                                    chequeNumber: chequeNo,
                                },
                            },
                        },
                    }
                } else {
                    paymentDetails = {
                        where: {
                            paymentId,
                        },
                        data: {
                            amount: paidAmt,
                            upiId,
                        },
                    }
                }
            } else {
                if (bookingExists.paymentType === 'BANK_TRANSFER') {
                    paymentDetails = {
                        bankPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    }
                } else if (bookingExists.paymentType === 'CASH') {
                    paymentDetails = {
                        cashPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    }
                } else if (bookingExists.paymentType === 'CHEQUE') {
                    paymentDetails = {
                        chequePayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    }
                } else {
                    paymentDetails = {
                        upiPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    }
                }
            }

            if (customerIds.length) {
                await prisma.booking.update({
                    where: {
                        bookingId,
                    },
                    data: {
                        customer: {
                            disconnect: bookingExists.customer.map(
                                (customer) => ({
                                    customerId: customer.customerId,
                                })
                            ),
                        },
                    },
                })
            }

            updatedBookingDetails = await prisma.booking.update({
                where: {
                    bookingId,
                },
                data: {
                    adminAccountId,
                    area: +area,
                    reminderDate,
                    dastavejAmt,
                    customer: {
                        connect: customerIds.map((customerId) => ({
                            customerId,
                        })),
                    },
                    installmentAmt: +installmentAmt,
                    installmentCount: +installmentCount,
                    paidAmt: paidAmt,
                    installmentDate,
                    paymentStatus,
                    paymentType,
                    plotNo,
                    projectId,
                    remainAmt: +remainAmt,
                    totalAmt: +totalAmt,
                    referralId,
                    ...paymentDetails,
                },
            })

            if (paymentType) {
                if (paymentType === 'CHEQUE') {
                    await prisma.chequePayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                            bankName,
                            chequeNumber: chequeNo,
                        },
                    })
                } else if (paymentType === 'UPI') {
                    await prisma.upiPayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                            upiId,
                        },
                    })
                } else if (paymentType === 'BANK_TRANSFER') {
                    await prisma.bankPayment.create({
                        data: {
                            bookingId,
                            accountNumber: accountNo,
                            amount: paidAmt,
                            bankName,
                        },
                    })
                } else {
                    await prisma.cashPayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                        },
                    })
                }
            }
        })

        return responseHandler(res, BOOKING_S_0004, updatedBookingDetails)
    }
})

export const deleteBooking = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.bookingIdValidator, req.params)

    const { bookingId } = req.params

    const bookingData = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
    })

    if (!bookingData) throw new AppError(BOOKING_E_0001)

    await prisma.booking.delete({
        where: {
            bookingId,
        },
    })

    return responseHandler(res, BOOKING_S_0005)
})

export const addPenalty = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.addPenaltyValidator, req.body)

    const { amount, bookingId, description, isComplete }: TPenalty = req.body

    const penaltyData = await prisma.bookingPenalty.create({
        data: {
            amount,
            description,
            bookingId,
            isComplete,
        },
    })

    return responseHandler(res, BOOKING_S_0006, penaltyData)
})

export const updatePenalty = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.updatePenaltyValidator, req.body)
    await validator(validation.penaltyIdValidator, req.params)

    const { penaltyId } = req.params

    const { amount, description, isComplete }: TPenalty = req.body

    const penaltyData = await prisma.bookingPenalty.update({
        where: {
            penaltyId,
        },
        data: {
            amount,
            description,
            isComplete,
        },
    })

    if (!penaltyData) throw new AppError(BOOKING_E_0004)

    return responseHandler(res, BOOKING_S_0007, penaltyData)
})
