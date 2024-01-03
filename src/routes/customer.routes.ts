import express from 'express'
import * as customerController from '../controllers/customer.controller'
import { upload } from '../aws/s3'
import { authMiddleware } from '../middlewares/auth.middleware'

const customerRouter = express.Router()

customerRouter.post(
    '/create',
    authMiddleware(['CUSTOMER_WRITE']),
    // upload.fields([
    //     { name: 'aadharImages', maxCount: 2 },
    //     { name: 'panImages', maxCount: 1 },
    //     { name: 'customerImage', maxCount: 3 },
    // ]),
    customerController.newCustomer
)

customerRouter.patch(
    '/upload/pan-image/:customerId',
    authMiddleware(['CUSTOMER_WRITE']),
    upload.single('panImages'),
    customerController.uploadPanImage
)

customerRouter.patch(
    '/upload/aadhar-image/:customerId',
    authMiddleware(['CUSTOMER_WRITE']),
    upload.fields([{ name: 'aadharImages', maxCount: 2 }]),
    customerController.uploadAadharImage
)

customerRouter.patch(
    '/upload/customer-image/:customerId',
    authMiddleware(['CUSTOMER_WRITE']),
    upload.fields([{ name: 'customerImage', maxCount: 3 }]),
    customerController.uploadCustomerImage
)

customerRouter.get(
    '/basic-list',
    authMiddleware(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getBasicCustomerList
)

customerRouter.get(
    '/advance-list',
    authMiddleware(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getAdvanceCustomerList
)

customerRouter.put(
    '/update/:customerId',
    authMiddleware(['CUSTOMER_WRITE']),
    upload.fields([
        { name: 'aadharImages', maxCount: 2 },
        { name: 'panImages', maxCount: 1 },
        { name: 'customerImage', maxCount: 3 },
    ]),
    customerController.updateCustomer
)

customerRouter.get(
    '/get/:customerId',
    authMiddleware(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getCustomer
)

export { customerRouter }
