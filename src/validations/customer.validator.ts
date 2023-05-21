import Joi from 'joi'
import util from '../utils/helper'
import { TCustomer } from '../controllers/types/customer'

export const createCustomerValidator = Joi.object<TCustomer>({
    aadharNo: util.aadharValidator.required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: util.emailValidator.required(),
    phone: util.phoneValidator.required(),
})

export const updateCustomerValidator = Joi.object<TCustomer>({
    aadharNo: util.aadharValidator.optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: util.emailValidator.optional(),
    phone: util.phoneValidator.optional(),
})

export const customerIdValidator = Joi.object({
    customerId: util.uuid.required(),
})
