import Joi from 'joi'
import util from '../utils/helper'
import { TCustomer } from '../controllers/types/customer'

export const createCustomerValidator = Joi.object<TCustomer>({
    name: Joi.string().required(),
    email: util.emailValidator.allow(null, '').optional(),
    phone1: util.phoneValidator.optional(),
    phone2: util.phoneValidator.allow('', null).optional(),
    city: Joi.string().allow('', null).optional(),
    pincode: Joi.string().length(6).optional(),
    state: Joi.string().allow('', null).optional(),
    address: Joi.string().allow('', null).optional(),
})

export const updateCustomerValidator = Joi.object<TCustomer>({
    name: Joi.string().optional(),
    email: util.emailValidator.allow('').optional(),
    phone1: util.phoneValidator.optional(),
    phone2: util.phoneValidator.allow('', null).optional(),
    city: Joi.string().allow('').optional(),
    pincode: Joi.string().length(6).allow('').optional(),
    state: Joi.string().allow('').optional(),
    address: Joi.string().allow('').optional(),
})

export const customerIdValidator = Joi.object({
    customerId: util.uuid.required(),
})

export const customerImageIdValidator = Joi.object({
    customerImageId: util.uuid.required(),
})
