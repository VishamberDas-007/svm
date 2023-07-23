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
    AUTH_S_0002,
} from '../config/responseCodes/auth'
import bcrypt from 'bcrypt'
import { ADMIN, SALT_ROUND } from '../config/const'
import validator from '../validations'
import * as validation from '../validations/auth.validator'
import util from '../utils/helper'

export const register = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.registerValidator, req.body)

    const { email, password, phone, address, name }: TRegister = req.body

    const emailExists = await prisma.user.findFirst({
        where: {
            email,
        },
    })

    if (emailExists) {
        throw new AppError(AUTH_E_0002)
    } else {
        const encryptedPassword = bcrypt.hashSync(password, SALT_ROUND)

        const allPermission = (await prisma.permission.findMany())?.map(
            (permission) => ({
                permissionId: permission.permissionId,
            })
        )

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: encryptedPassword,
                phone,
                role: {
                    create: {
                        label: ADMIN,
                        value: ADMIN.toUpperCase(),
                        permission: { connect: allPermission },
                    },
                },
                address,
            },
        })

        const tokenObj = {
            email,
        }

        const accessToken = util.accessToken(tokenObj)
        // const refreshToken = util.refreshToken(tokenObj)

        res.cookie('token', accessToken, {
            expires: new Date(Date.now() + 5000),
            httpOnly: true,
            secure: true,
        })

        return responseHandler(res, AUTH_S_0001, {
            ...newUser,
            password: undefined,
        })
    }
})

export const login = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.loginValidator, req.body)

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
            const tokenObj = {
                email,
            }

            const accessToken = util.accessToken(tokenObj)
            // const refreshToken = util.refreshToken(tokenObj)

            res.cookie('token', accessToken, {
                expires: new Date(Date.now() + 5000),
                httpOnly: true,
                // secure: true,
                sameSite: 'none',
            })

            return responseHandler(res, AUTH_S_0002, {
                ...emailExists,
                password: undefined,
                accessToken,
                // refreshToken,
            })
        }
    }
})
