import express from 'express'
import * as installmentController from '../controllers/installment.controller'

const installmentRouter = express.Router()

installmentRouter.post('/create', installmentController.createInstallment)

export { installmentRouter }
