import Joi from 'joi'
import util from '../utils/helper'

export const projectIdValidator = Joi.object({
    projectId: util.uuid.required(),
})

export const bookingIdValidator = Joi.object({
    bookingId: util.uuid.required(),
})

export const emailIdValidator = Joi.object({
    emailId: util.emailValidator.required(),
})
