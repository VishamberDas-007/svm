import Joi from 'joi'
import util from '../utils/helper'
import { TCreateUser, TUpdateUser } from '../controllers/types/user'

export const userCreateValidator = Joi.object<TCreateUser>({
    email: util.emailValidator.required(),
    phone: util.phoneValidator.required(),
    address: Joi.string().optional(),
    name: Joi.string().required(),
    roleId: Joi.string().optional(),
})

export const userIdValidator = Joi.object({
    userId: Joi.string().optional(),
})

export const userUpdateValidator = Joi.object<TUpdateUser>({
    email: util.emailValidator.optional(),
    phone: util.phoneValidator.optional(),
    address: Joi.string().optional(),
    name: Joi.string().optional(),
    roleId: Joi.string().optional(),
})
