import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/role.validator'
import util from '../utils/helper'
import { ROLE_S_0001, ROLE_S_0002 } from '../config/responseCodes/role'

export const newRole = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createRoleValidator, req.body)

    const { label, permissionIds } = req.body

    const newRole = await prisma.role.create({
        data: {
            label: label,
            value: util.formatLabelName(label),
            permission: {
                connect: permissionIds,
            },
        },
    })

    return responseHandler(res, ROLE_S_0001, newRole)
})

export const roleList = catchAsync(async (req: Request, res: Response) => {
    const fetchRoleList = await prisma.role.findMany({
        include: {
            permission: true,
        },
    })

    return responseHandler(res, ROLE_S_0002, fetchRoleList)
})
