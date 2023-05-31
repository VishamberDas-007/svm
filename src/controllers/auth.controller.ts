import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TLogin, TRegister } from './types/auth'
import prisma from '../db'
import AppError from '../utils/AppError'
import responseHandler from '../utils/responseHandler'
import {
    AUTH_E_0001,
    AUTH_E_0002,
    AUTH_S_0001,
} from '../config/responseCodes/auth'
import bcrypt from 'bcrypt'
import { JWT } from '../config/const'

export const register = catchAsync(async (req: Request, res: Response) => {
    const { email, password, phone, address }: TRegister = req.body

    const emailExists = await prisma.user.findFirst({
        where: {
            email,
        },
    })

    if (emailExists) {
        throw new AppError(AUTH_E_0002)
    } else {
        const encryptedPassword = bcrypt.hashSync(password, JWT.SECRET_KEY)

        const newUser = await prisma.user.update({
            where: {
                email,
            },
            data: {
                email,
                password: encryptedPassword,
                phone,
                address,
            },
        })

        return responseHandler(res, AUTH_S_0001, {
            ...newUser,
            password: undefined,
        })
    }
})

export const login = catchAsync(async (req: Request, res: Response) => {
    // await validator(validation.createProjectValidator, req.body)

    const { email, password }: TLogin = req.body

    const emailExists = await prisma.user.findFirst({
        where: {
            email,
        },
    })

    if (!emailExists) {
        throw new AppError(AUTH_E_0001)
    } else {
        const passwordIsValid = bcrypt.compareSync(
            password,
            emailExists.password
        )

        if (!passwordIsValid) {
            throw new AppError(AUTH_E_0001)
        } else {
            return responseHandler(res, AUTH_S_0001, emailExists)
        }
    }
})
