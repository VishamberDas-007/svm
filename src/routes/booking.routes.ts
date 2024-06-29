import express from 'express'
import * as bookingController from '../controllers/booking.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const bookingRouter = express.Router()

bookingRouter.post(
    '/create',
    authMiddleware(['BOOKING_WRITE']),
    bookingController.createBooking
)

bookingRouter.get(
    '/list',
    authMiddleware(['BOOKING_READ', 'BOOKING_WRITE']),
    bookingController.getAllBookings
)

bookingRouter.get(
    '/get/:bookingId',
    authMiddleware(['BOOKING_READ', 'BOOKING_WRITE']),
    bookingController.getBooking
)

bookingRouter.put(
    '/update/:bookingId',
    authMiddleware(['BOOKING_WRITE']),
    bookingController.updateBooking
)

bookingRouter.delete(
    '/delete/:bookingId',
    authMiddleware(['BOOKING_WRITE']),
    bookingController.deleteBooking
)

bookingRouter.post(
    '/add-penalty',
    authMiddleware(['BOOKING_WRITE']),
    bookingController.addPenalty
)

bookingRouter.patch(
    '/update-penalty/:penaltyId',
    authMiddleware(['BOOKING_WRITE']),
    bookingController.updatePenalty
)

bookingRouter.get(
    '/penalty-list/:bookingId',
    authMiddleware(['BOOKING_READ', 'BOOKING_WRITE']),
    bookingController.getPenaltyList
)

export { bookingRouter }
