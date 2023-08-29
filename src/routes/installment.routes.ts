import express from 'express'
import * as installmentController from '../controllers/installment.controller'

const installmentRouter = express.Router()

installmentRouter.post('/create', installmentController.createInstallment)

installmentRouter.get(
    '/get/:installmentId',
    installmentController.fetchInstallmentDetails
)

installmentRouter.get(
    '/get/booking/installment-details/:bookingId',
    installmentController.fetchBookingInstallmentDetails
)

installmentRouter.put(
    '/update/:installmentId',
    installmentController.updateInstallmentDetails
)

export { installmentRouter }
