import express from 'express'
import * as customerController from '../controllers/customer.controller'

const customerRouter = express.Router()

customerRouter.post('/create', customerController.newCustomer)

customerRouter.get('/basic-list', customerController.getBasicCustomerList)

customerRouter.get('/advance-list', customerController.getAdvanceCustomerList)

customerRouter.put('/update/:customerId', customerController.updateCustomer)

customerRouter.get('/get/:customerId', customerController.getCustomer)

export { customerRouter }
