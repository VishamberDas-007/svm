import express from 'express'
import * as customerController from '../controllers/customer.controller'
import { upload } from '../aws/s3'

const customerRouter = express.Router()

customerRouter.post(
    '/create',
    upload.fields([
        { name: 'aadharImages', maxCount: 2 },
        { name: 'panImages', maxCount: 1 },
    ]),
    customerController.newCustomer
)

customerRouter.get('/basic-list', customerController.getBasicCustomerList)

customerRouter.get('/advance-list', customerController.getAdvanceCustomerList)

customerRouter.put('/update/:customerId', customerController.updateCustomer)

customerRouter.get('/get/:customerId', customerController.getCustomer)

export { customerRouter }
