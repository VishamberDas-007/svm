import Joi from 'joi'
import util from '../utils/helper'

export const projectIdValidator = Joi.object({
    projectId: util.uuid.required(),
})
