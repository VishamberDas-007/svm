import Joi from 'joi'

export const createRoleValidator = Joi.object({
    label: Joi.string().required(),
    permissionIds: Joi.array().items(Joi.number().required()).required(),
})
