'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              var desc = Object.getOwnPropertyDescriptor(m, k)
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k]
                      },
                  }
              }
              Object.defineProperty(o, k2, desc)
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.customerRouter = void 0
const express_1 = __importDefault(require('express'))
const customerController = __importStar(
    require('../controllers/customer.controller')
)
const s3_1 = require('../aws/s3')
const auth_middleware_1 = require('../middlewares/auth.middleware')
const customerRouter = express_1.default.Router()
exports.customerRouter = customerRouter
customerRouter.post(
    '/create',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_WRITE']),
    // upload.fields([
    //     { name: 'aadharImages', maxCount: 2 },
    //     { name: 'panImages', maxCount: 1 },
    //     { name: 'customerImage', maxCount: 3 },
    // ]),
    customerController.newCustomer
)
customerRouter.patch(
    '/upload/pan-image/:customerId',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_WRITE']),
    s3_1.upload.single('panImages'),
    customerController.uploadPanImage
)
customerRouter.patch(
    '/upload/aadhar-image/:customerId',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_WRITE']),
    s3_1.upload.fields([{ name: 'aadharImages', maxCount: 2 }]),
    customerController.uploadAadharImage
)
customerRouter.patch(
    '/upload/customer-image/:customerId',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_WRITE']),
    s3_1.upload.fields([{ name: 'customerImage', maxCount: 3 }]),
    customerController.uploadCustomerImage
)
customerRouter.get(
    '/basic-list',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getBasicCustomerList
)
customerRouter.get(
    '/advance-list',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getAdvanceCustomerList
)
customerRouter.put(
    '/update/:customerId',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_WRITE']),
    s3_1.upload.fields([
        { name: 'aadharImages', maxCount: 2 },
        { name: 'panImages', maxCount: 1 },
        { name: 'customerImage', maxCount: 3 },
    ]),
    customerController.updateCustomer
)
customerRouter.get(
    '/get/:customerId',
    (0, auth_middleware_1.authMiddleware)(['CUSTOMER_READ', 'CUSTOMER_WRITE']),
    customerController.getCustomer
)
