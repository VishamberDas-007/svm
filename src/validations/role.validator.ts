import Joi from 'joi'

export const createRoleValidator = Joi.object({
    label: Joi.string().required(),
    permissionIds: Joi.array().items(Joi.number().required()).required(),
})

export const roleIdValidator = Joi.object({
    roleId: Joi.number().required(),
})

export const updateRoleValidator = Joi.object({
    label: Joi.string().optional(),
    permissionIds: Joi.array().items(Joi.number().required()).optional(),
})
