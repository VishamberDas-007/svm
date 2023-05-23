import Joi from 'joi'
import util from '../utils/helper'
import { TReferral } from '../controllers/types/referral'

export const createReferralValidator = Joi.object<TReferral>({
    email: util.emailValidator.required(),
    address: Joi.string().optional(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: util.phoneValidator.required(),
})

export const referralIdValidator = Joi.object({
    referralId: util.uuid.required(),
})

export const updateReferralValidator = Joi.object<TReferral>({
    email: util.emailValidator.optional(),
    address: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phone: util.phoneValidator.optional(),
})
