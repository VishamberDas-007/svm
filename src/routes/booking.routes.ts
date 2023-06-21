import express from 'express'
import * as bookingController from '../controllers/booking.controller'

const bookingRouter = express.Router()

bookingRouter.post('/create', bookingController.createBooking)

bookingRouter.get('/list', bookingController.getAllBookings)

bookingRouter.get('/get/:bookingId', bookingController.getBooking)

bookingRouter.put('/update/:bookingId', bookingController.updateBooking)

export { bookingRouter }
