import Joi from 'joi'
import util from '../utils/helper'
import { TLogin, TRegister, TSetNewPassword } from '../controllers/types/auth'

export const registerValidator = Joi.object<TRegister>({
    email: util.emailValidator.required(),
    password: util.passwordValidator.required(),
    phone: util.phoneValidator.required(),
    address: Joi.string().optional(),
    name: Joi.string().required(),
})

export const loginValidator = Joi.object<TLogin>({
    email: util.emailValidator.required(),
    password: Joi.string().required(),
})

export const emailOtpValidator = Joi.object({
    email: util.emailValidator.required(),
    otp: util.otpValidator.required(),
})

export const changePasswordValidator = Joi.object<TSetNewPassword>({
    email: util.emailValidator.required(),
    password: util.passwordValidator.required(),
    emailOtpToken: Joi.string().required(),
})
