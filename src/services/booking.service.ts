import { Booking, Customer, Project } from '@prisma/client'
import { BOOKING_E_0001 } from '../config/responseCodes/booking'
import prisma from '../db'
import AppError from '../utils/AppError'

export const getBookingDetails = async (
    bookingId: string
): Promise<Booking & { customer: Customer }> => {
    const bookingDetails = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
        include: {
            customer: true,
        },
    })

    if (!bookingDetails) throw new AppError(BOOKING_E_0001)
    else return bookingDetails
}

export const checkIfProjectAreaExists = (
    projectData: Project & { booking: Booking[] | null },
    currentArea: number
) => {
    let totalArea = 0
    projectData.booking?.forEach((obj) => {
        totalArea += obj.area
    })

    if (totalArea + currentArea > projectData.area) return false

    return true
}
