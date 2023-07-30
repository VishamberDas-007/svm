import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/role.validator'
import util from '../utils/helper'
import {
    ROLE_E_0001,
    ROLE_S_0001,
    ROLE_S_0002,
    ROLE_S_0003,
    ROLE_S_0004,
} from '../config/responseCodes/role'

export const newRole = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createRoleValidator, req.body)

    const { label, permissionIds }: { label: string; permissionIds: number[] } =
        req.body

    const newRole = await prisma.role.create({
        data: {
            label: label,
            value: util.formatLabelName(label),
            permission: {
                connect: permissionIds.map((permissionId) => {
                    return { permissionId }
                }),
            },
        },
    })

    return responseHandler(res, ROLE_S_0001, newRole)
})

export const roleAdvanceList = catchAsync(
    async (req: Request, res: Response) => {
        const fetchRoleList = await prisma.role.findMany({
            include: {
                permission: true,
            },
        })

        return responseHandler(res, ROLE_S_0002, fetchRoleList)
    }
)

export const roleBasicList = catchAsync(async (req: Request, res: Response) => {
    const result = (await prisma.role.findMany()).map((role) => ({
        roleId: role.roleId,
        label: role.label,
    }))

    return responseHandler(res, ROLE_S_0002, result)
})

export const fetchRoleDetails = catchAsync(
    async (req: Request, res: Response) => {
        const { roleId } = req.params

        const roleExists = await prisma.role.findFirst({
            where: {
                roleId: +roleId,
            },
            include: {
                permission: true,
            },
        })

        if (!roleExists) throw new AppError(ROLE_E_0001)
        else return responseHandler(res, ROLE_S_0003, roleExists)
    }
)

export const updateRoleDetails = catchAsync(
    async (req: Request, res: Response) => {
        const { roleId } = req.params

        const {
            label,
            permissionIds,
        }: { label: string; permissionIds: number[] } = req.body

        let data = {}

        const roleExists = await prisma.role.findFirst({
            where: {
                roleId: +roleId,
            },
            include: {
                permission: true,
            },
        })

        if (!roleExists) throw new AppError(ROLE_E_0001)
        else if (permissionIds.length) {
            data = {
                permission: {
                    disconnect: roleExists.permission?.map((permission) => {
                        return { permissionId: permission.permissionId }
                    }),
                    connect: permissionIds.map((permissionId) => {
                        return {
                            permissionId,
                        }
                    }),
                },
            }
        }

        data = {
            ...data,
            label,
            value: util.formatLabelName(label),
        }

        const updateRole = await prisma.role.update({
            where: {
                roleId: +roleId,
            },
            data: data,
            include: {
                permission: true,
            },
        })

        return responseHandler(res, ROLE_S_0004, updateRole)
    }
)
