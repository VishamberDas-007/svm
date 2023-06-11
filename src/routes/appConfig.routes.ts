import express from 'express'
import * as appConfigController from '../controllers/appConfig.controller'

const appConfigRouter = express.Router()

appConfigRouter.get('/pincode', appConfigController.getPincodeList)

export { appConfigRouter }
