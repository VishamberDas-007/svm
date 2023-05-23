import express from 'express'
import * as referralController from '../controllers/referral.controller'

const referralRouter = express.Router()

referralRouter.post('/create', referralController.newReferral)

referralRouter.get('/list', referralController.getAllReferral)

referralRouter.put('/update/:referralId', referralController.updateReferral)

referralRouter.get('/get/:referralId', referralController.getReferral)

export { referralRouter }
