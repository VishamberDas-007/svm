import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TCreateUser, TUpdateUser } from './types/user'
import prisma from '../db'
import util from '../utils/helper'
import bcrypt from 'bcrypt'
import { SALT_ROUND } from '../config/const'
import {
    USER_E_0001,
    USER_E_0002,
    USER_S_0001,
    USER_S_0002,
} from '../config/responseCodes/user'
import AppError from '../utils/AppError'
import { User } from '@prisma/client'
import { TListData } from '../types/global.types'
import validator from '../validations'
import * as validation from '../validations/user.validator'

export const createUser = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.userCreateValidator, req.body)

    const { address, email, name, phone, roleId }: TCreateUser = req.body

    const password = util.passwordGenerator()

    const encryptPassword = bcrypt.hashSync(password, SALT_ROUND)

    const emailExists = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase(),
        },
    })

    if (emailExists) throw new AppError(USER_E_0002, undefined, null, true)

    const newUser = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            name,
            password: encryptPassword,
            phone,
            address,
            roleId,
        },
    })

    return responseHandler(res, USER_S_0001, {
        ...newUser,
        password: undefined,
    })
})

export const getUser = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.userIdValidator, req.params)

    const { userId } = req.params

    const userDetails = await prisma.user.findFirst({
        where: {
            userId,
        },
    })

    if (!userDetails) {
        throw new AppError(USER_E_0001)
    }

    return responseHandler(res, USER_S_0002, {
        ...userDetails,
        password: undefined,
    })
})

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const {
        page = 1,
        pageSize = 20,
        searchString,
    } = req.query as Record<string, string>

    let whereClause = {}

    if (searchString) {
        whereClause = {
            OR: [
                {
                    name: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        }
    }

    const skip = (+page - 1) * +pageSize

    const userList = await prisma.user.findMany({
        take: +pageSize,
        skip,
        where: {
            isAdmin: false,
            ...whereClause,
        },
    })

    const userCount = await prisma.user.count({ where: whereClause })

    const totalQueryCount = await prisma.user.count()

    const result: TListData<User> = {
        list: userList,
        meta: {
            totalCount: userCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    }

    return responseHandler(res, USER_S_0002, result)
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.userIdValidator, req.params)
    await validator(validation.userUpdateValidator, req.body)

    const { userId } = req.params

    const { address, email, name, phone, roleId }: TUpdateUser = req.body

    const userDetails = await prisma.user.findFirst({
        where: {
            userId,
        },
    })

    if (!userDetails) {
        throw new AppError(USER_E_0001)
    }

    if (email) {
        const emailExists = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
                userId: {
                    not: userId,
                },
            },
        })

        if (emailExists) throw new AppError(USER_E_0002, undefined, null, true)
    }

    const updateUser = await prisma.user.update({
        where: {
            userId,
        },
        data: {
            address,
            email: email?.toLowerCase(),
            name,
            phone,
            roleId,
        },
    })

    return responseHandler(res, USER_S_0002, {
        ...updateUser,
        password: undefined,
    })
})
