import express from 'express'
import * as accountController from '../controllers/adminAccount.controller'

const accountRouter = express.Router()

accountRouter.post('/create', accountController.newAccount)

accountRouter.get('/get/:accountId', accountController.getAccountDetails)

accountRouter.get('/advance-list', accountController.getAdvanceAccountList)

accountRouter.put('/update/:accountId', accountController.updateAccountDetails)

accountRouter.get('/basic-list', accountController.getAccountBasicList)

export { accountRouter }
