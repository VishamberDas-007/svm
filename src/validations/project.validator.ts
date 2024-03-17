import Joi from 'joi'
import { Project } from '@prisma/client'
import util from '../utils/helper'

const projectStatus = ['ACTIVE', 'COMPLETED', 'UPCOMING']

export const createProjectValidator = Joi.object<Project & { logo: any }>({
    address1: Joi.string().required(),
    area: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    ownerName: Joi.string().required(),
    pincode: Joi.string().required(),
    status: Joi.valid(...projectStatus).required(),
    unit: Joi.string().required(),
    address2: Joi.string().allow('', null).optional(),
    logo: Joi.any().optional(),
    location: Joi.string().required(),
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
    address2: Joi.string().allow(null, '').optional(),
    emiAmt: Joi.number().optional(),
    downPayment: Joi.number().optional(),
    totalAmt: Joi.number().optional(),
    location: Joi.string().optional(),
})

export const projectImageIdsValidator = Joi.object({
    projectImageIds: Joi.array().items(util.uuid.required()).required(),
})

export const projectImageIdValidator = Joi.object({
    projectImageId: util.uuid.required(),
})

export const projectIdValidator = Joi.object({
    projectId: util.uuid.required(),
})
