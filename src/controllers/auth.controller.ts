import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import {
    TLogin,
    TRegister,
    TSetNewPassword,
    TValidateEmailOtp,
} from './types/auth'
import prisma from '../db'
import AppError from '../utils/AppError'
import responseHandler from '../utils/responseHandler'
import {
    AUTH_E_0001,
    AUTH_E_0002,
    AUTH_E_0003,
    AUTH_E_0007,
    AUTH_E_0008,
    AUTH_S_0001,
    AUTH_S_0002,
    AUTH_S_0003,
    AUTH_S_0004,
    AUTH_S_0005,
    AUTH_S_0006,
} from '../config/responseCodes/auth'
import bcrypt from 'bcrypt'
import { ADMIN, SALT_ROUND, emailConfig, jwtAccessToken } from '../config/const'
import validator from '../validations'
import * as validation from '../validations/auth.validator'
import * as generalValidation from '../validations/_general.validator'
import util from '../utils/helper'
import { TAccessToken } from '../types/global.types'
import { emailOtpRequest, emailOtpValidate } from '../services/auth.service'
import { sendEmailToCustomer } from '../utils/nodeMailer'
import jwt from 'jsonwebtoken'
import { GENERAL_E_0007, GENERAL_E_0010 } from '../config/responseCodes/general'

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
        const encryptedPassword = bcrypt.hashSync(password, +SALT_ROUND)

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
                isAdmin: true,
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

        return responseHandler(res, AUTH_S_0001, {
            ...newUser,
            password: undefined,
        })
    }
})

export const login = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.loginValidator, req.body)

    const { email, password }: TLogin = req.body

    const userExists = await prisma.user.findFirst({
        where: {
            email,
        },
        include: {
            role: {
                include: {
                    permission: true,
                },
            },
        },
    })

    if (!userExists) {
        throw new AppError(AUTH_E_0001)
    } else {
        const passwordIsValid = bcrypt.compareSync(
            password,
            userExists.password
        )

        if (!passwordIsValid) {
            throw new AppError(AUTH_E_0001)
        } else {
            const tokenObj: TAccessToken = {
                email,
                userId: userExists.userId,
                isAdmin: userExists.isAdmin,
                role: userExists.role.label,
                permissions: userExists.role.permission.map((p) => p.value),
            }

            const accessToken = util.accessToken(tokenObj)

            return responseHandler(res, AUTH_S_0002, {
                ...userExists,
                password: undefined,
                permissions: userExists.role.permission.map((p) => p.value),
                role: userExists.role.label,
                accessToken,
                // refreshToken,
            })
        }
    }
})

export const resetRequestEmailOTP = catchAsync(
    async (req: Request, res: Response) => {
        await validator(generalValidation.emailIdValidator, req.params)

        const email = req.params.email.toLowerCase()
        const userExists = await prisma.user.findFirst({
            where: {
                email,
            },
        })
        if (!userExists) {
            throw new AppError(AUTH_E_0003)
        } else {
            await emailOtpRequest(email)

            const otp = util.otpGenerator()

            await prisma.otp.create({
                data: {
                    otp,
                    email,
                    expiryTime: new Date(Date.now() + 5 * 60 * 1000),
                },
            })

            const mailtmp = `Your otp is <strong>${otp}</strong>`

            responseHandler(res, AUTH_S_0003, {
                isOtpSent: true,
            })

            await sendEmailToCustomer(email, emailConfig.OTP_SUBJECT, mailtmp)
        }
    }
)

export const resetEmailOtpValidation = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.emailOtpValidator, req.body)

        const { email, otp }: TValidateEmailOtp = req.body

        const emailLowerCase = email.toLowerCase()

        await emailOtpValidate(emailLowerCase, otp)

        const accessToken = util.accessToken({
            email: emailLowerCase,
        })

        return responseHandler(res, AUTH_S_0004, {
            emailOtpToken: accessToken,
            email: emailLowerCase,
        })
    }
)

export const setNewPassword = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.changePasswordValidator, req.body)

        const { email, password, emailOtpToken }: TSetNewPassword = req.body
        const emailLowerCase = email.toLowerCase()

        const { email: decodedEmail } = <{ email: string }>(
            jwt.verify(emailOtpToken, jwtAccessToken.SECRET_KEY)
        )

        if (decodedEmail !== emailLowerCase) {
            throw new AppError(AUTH_E_0001)
        }

        const userExists = await prisma.user.findFirst({
            where: { email: emailLowerCase },
        })

        if (!userExists) {
            throw new AppError(AUTH_E_0007)
        } else {
            // password encryption using bcrypt
            const salt = bcrypt.genSaltSync(+SALT_ROUND)
            const encryptedPassword = bcrypt.hashSync(password, salt)

            const isUpdated = await prisma.user.update({
                where: {
                    userId: userExists.userId,
                },
                data: {
                    password: encryptedPassword,
                },
            })

            if (!isUpdated) {
                throw new AppError(AUTH_E_0008)
            }

            return responseHandler(res, AUTH_S_0005, { email })
        }
    }
)

export const validateAccessToken = catchAsync(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(GENERAL_E_0007)
        }

        const userTokenDetails = req.user

        const userDetails = await prisma.user.findFirst({
            where: {
                userId: userTokenDetails.userId,
            },
            include: {
                role: {
                    include: {
                        permission: true,
                    },
                },
            },
        })

        if (!userDetails) throw new AppError(GENERAL_E_0010)

        const tokenPayload: TAccessToken = {
            email: userTokenDetails.email,
            isAdmin: userDetails.isAdmin,
            role: userDetails.role.label,
            userId: userTokenDetails.userId,
            permissions: userDetails.role.permission.map(
                (permission) => permission.value
            ),
        }

        const newAccessToken = util.accessToken(tokenPayload)

        return responseHandler(res, AUTH_S_0006, {
            ...userDetails,
            accessToken: newAccessToken,
        })
    }
)
