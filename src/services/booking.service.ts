import { Booking } from '@prisma/client'
import { BOOKING_E_0001 } from '../config/responseCodes/booking'
import prisma from '../db'
import AppError from '../utils/AppError'

export const getBookingDetails = async (
    bookingId: string
): Promise<Booking> => {
    const bookingDetails = await prisma.booking.findFirst({
        where: {
            bookingId,
        },
    })

    if (!bookingDetails) throw new AppError(BOOKING_E_0001)
    else return bookingDetails
}
