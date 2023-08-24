import express from 'express'
import * as installmentController from '../controllers/installment.controller'

const installmentRouter = express.Router()

installmentRouter.post('/create', installmentController.createInstallment)

installmentRouter.get(
    '/get/:installmentId',
    installmentController.fetchInstallmentDetails
)

installmentRouter.put(
    '/update/:installmentId',
    installmentController.updateInstallmentDetails
)

export { installmentRouter }
