import express from 'express'
import * as bookingController from '../controllers/booking.controller'

const bookingRouter = express.Router()

bookingRouter.post('/create', bookingController.newBooking)

bookingRouter.get('/list', bookingController.getAllBookings)

bookingRouter.get('/get/:bookingId', bookingController.getBooking)

export { bookingRouter }
