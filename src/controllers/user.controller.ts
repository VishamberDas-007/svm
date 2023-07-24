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
    USER_S_0001,
    USER_S_0002,
} from '../config/responseCodes/user'
import AppError from '../utils/AppError'

export const createUser = catchAsync(async (req: Request, res: Response) => {
    const { address, email, name, phone, roleId }: TCreateUser = req.body

    const password = util.passwordGenerator()

    const encryptPassword = bcrypt.hashSync(password, SALT_ROUND)

    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: encryptPassword,
            phone,
            address,
            roleId,
        },
    })

    return responseHandler(res, USER_S_0001, newUser)
})

export const getUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params

    const userDetails = await prisma.user.findFirst({
        where: {
            userId,
        },
    })

    if (!userDetails) {
        throw new AppError(USER_E_0001)
    }

    return responseHandler(res, USER_S_0002, userDetails)
})

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const userList = await prisma.user.findMany({
        where: {
            isAdmin: false,
        },
    })

    return responseHandler(res, USER_S_0002, userList)
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
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

    const updateUser = await prisma.user.update({
        where: {
            userId,
        },
        data: {
            address,
            email,
            name,
            phone,
            roleId,
        },
    })

    return responseHandler(res, USER_S_0002, updateUser)
})
