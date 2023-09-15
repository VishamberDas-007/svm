import Joi from 'joi'
import util from '../utils/helper'

const projectStatus = ['ACTIVE', 'COMPLETED', 'UPCOMING']

export const createProjectValidator = Joi.object({
    address1: Joi.string().required(),
    area: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    ownerName: Joi.string().required(),
    pincode: Joi.string().required(),
    status: Joi.valid(...projectStatus).required(),
    unit: Joi.string().required(),
    address2: Joi.string().allow('', null).optional(),
    parentId: util.uuid.allow('', null).optional(),
    planningImages: Joi.any().optional(),
    siteImages: Joi.any().optional(),
})

export const updateProjectValidator = Joi.object({
    address1: Joi.string().optional(),
    area: Joi.number().optional(),
    name: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    ownerName: Joi.string().optional(),
    pincode: Joi.string().optional(),
    status: Joi.valid(...projectStatus).optional(),
    unit: Joi.string().optional(),
    address2: Joi.string().optional(),
    planningImages: Joi.any().optional(),
    siteImages: Joi.any().optional(),
})
