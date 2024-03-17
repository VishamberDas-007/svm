import express from 'express'
import * as installmentController from '../controllers/installment.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const installmentRouter = express.Router()

installmentRouter.post(
    '/create',
    // authMiddleware(['INSTALLMENT_WRITE']),
    installmentController.createInstallment
)

installmentRouter.get(
    '/get/:installmentId',
    authMiddleware(['INSTALLMENT_WRITE', 'INSTALLMENT_READ']),
    installmentController.fetchInstallmentDetails
)

installmentRouter.get(
    '/get/booking/installment-details/:bookingId',
    // authMiddleware(['INSTALLMENT_WRITE', 'INSTALLMENT_READ']),
    installmentController.fetchBookingInstallmentDetails
)

installmentRouter.put(
    '/update/:installmentId',
    authMiddleware(['INSTALLMENT_WRITE']),
    installmentController.updateInstallmentDetails
)

installmentRouter.delete(
    '/delete/:installmentId',
    installmentController.deleteInstallment
)

export { installmentRouter }
