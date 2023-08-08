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
    ROLE_E_0002,
    ROLE_S_0001,
    ROLE_S_0002,
    ROLE_S_0003,
    ROLE_S_0004,
    ROLE_S_0005,
} from '../config/responseCodes/role'

export const newRole = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createRoleValidator, req.body)

    const { label, permissionIds }: { label: string; permissionIds: number[] } =
        req.body

    const roleExists = await prisma.role.findFirst({
        where: {
            value: util.formatLabelName(label),
        },
    })

    if (roleExists) throw new AppError(ROLE_E_0002)

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
        await validator(validation.roleIdValidator, req.params)

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
        await validator(validation.roleIdValidator, req.params)
        await validator(validation.updateRoleValidator, req.body)

        const { roleId } = req.params

        const {
            label,
            permissionIds,
        }: { label?: string; permissionIds?: number[] } = req.body

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
        else if (permissionIds?.length) {
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

        if (label) {
            const roleAlreadyExists = await prisma.role.findFirst({
                where: {
                    value: label && util.formatLabelName(label),
                    roleId: {
                        not: +roleId,
                    },
                },
            })

            if (roleAlreadyExists) throw new AppError(ROLE_E_0002)
        }

        data = {
            ...data,
            label,
            value: label && util.formatLabelName(label),
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

export const fetchAllPermissions = catchAsync(
    async (req: Request, res: Response) => {
        const result: any[] = []

        const permissionList = await prisma.permission.findMany({
            orderBy: {
                permissionId: 'asc',
            },
        })

        permissionList.forEach((element) => {
            const keyName = element.value.includes('READ') ? 'read' : 'write'

            const groupExists = result.findIndex(
                (obj) => element.group === obj.group
            )

            if (groupExists !== -1) {
                result[groupExists] = {
                    ...result?.[groupExists],
                    [keyName]: element.permissionId,
                }
            } else {
                result.push({
                    [keyName]: element.permissionId,
                    group: element.group,
                })
            }
        })

        return responseHandler(res, ROLE_S_0005, result)
    }
)
