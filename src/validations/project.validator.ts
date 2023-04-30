import Joi from 'joi'
import util from '../utils/helper'

export const createProjectValidator = Joi.object({
    // details: Joi.object({
    address1: Joi.string().required(),
    area: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    ownerName: Joi.string().required(),
    pincode: Joi.string().required(),
    status: Joi.valid('ACTIVE', 'COMPLETED', 'UPCOMING').required(),
    unit: Joi.string().required(),
    address2: Joi.string().allow('', null).optional(),
    parentId: util.uuid.allow('', null).optional(),
    // }).required(),
    // planningImages: Joi.array().required(),
    // siteImages: Joi.array().optional(),
})

export const updateProjectValidator = Joi.object({
    address1: Joi.string().optional(),
    area: Joi.number().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    ownerName: Joi.string().optional(),
    pincode: Joi.string().optional(),
    status: Joi.valid('ACTIVE', 'COMPLETED', 'UPCOMING').optional(),
    unit: Joi.string().optional(),
    address2: Joi.string().optional(),
})
