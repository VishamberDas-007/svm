import Joi from 'joi'
import util from '../utils/helper'
import { TContactUs } from '../controllers/types/website'
import { Festival } from '@prisma/client'

export const saveContactUsValidator = Joi.object<TContactUs>({
    email: util.emailValidator.optional(),
    subject: Joi.string().required(),
    name: Joi.string().required(),
    message: Joi.string().required(),
    number: Joi.string().required(),
})

export const statusValidator = Joi.object({
    status: Joi.valid('PENDING', 'COMPLETED').required(),
})

export const addFestivalValidator = Joi.object<Festival>({
    description: Joi.string().required(),
    thumbnailImg: Joi.string().required(),
    title: Joi.string().required(),
    url: Joi.string().required(),
    isLatest: Joi.boolean().required(),
})
