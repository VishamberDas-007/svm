import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TCreateBooking, TUpdateBooking } from './types/booking'
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

export const newBooking = catchAsync(async (req: Request, res: Response) => {
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
    }: TCreateBooking = req.body

    const newBooking = await prisma.booking.create({
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

    return responseHandler(res, BOOKING_S_0001, newBooking)
})

export const getAllBookings = catchAsync(
    async (req: Request, res: Response) => {
        const bookingList = await prisma.booking.findMany({
            include: {
                project: true,
                customer: true,
            },
        })

        const result = bookingList.map((booking) => ({
            ...booking,
            projectName: booking.project.name,
            customerName: booking.customer.firstName.concat(
                ' ',
                booking.customer.lastName
            ),
            project: undefined,
            customer: undefined,
        }))

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
    })

    return responseHandler(res, BOOKING_S_0003, fetchBooking)
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
    }: TUpdateBooking = req.body

    const bookingExists = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
    })

    if (!bookingExists) throw new AppError(BOOKING_E_0001)
    else {
        const updatedBookingDetails = await prisma.booking.update({
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

        return responseHandler(res, BOOKING_S_0004, updatedBookingDetails)
    }
})
