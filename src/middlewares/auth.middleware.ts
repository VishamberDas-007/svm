import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/AppError'
import {
    GENERAL_E_0004,
    GENERAL_E_0007,
    GENERAL_E_0014,
    GENERAL_E_0015,
} from '../config/responseCodes/general'
import jwt from 'jsonwebtoken'
import { jwtAccessToken } from '../config/const'
import prisma from '../db'
import { TAccessToken, permission } from '../types/global.types'
import { userExists } from '../services/user.service'

export const adminMiddleware = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers as Record<string, string>

        const token = authorization?.split(' ')?.[1]

        if (!token) throw new AppError(GENERAL_E_0004)
        else {
            const { email, userId } = <{ email: string; userId: string }>(
                jwt.verify(token, jwtAccessToken.SECRET_KEY)
            )

            const emailExists = await prisma.user.findFirst({
                where: {
                    email,
                    userId,
                },
            })

            if (!emailExists) throw new AppError(GENERAL_E_0007)

            next()
        }
    }
)

export const authMiddleware = (requiredPermissions: permission[]) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers

        const token = authorization?.split(' ')?.[1]

        if (!token) {
            throw new AppError(GENERAL_E_0004)
        }

        const decodeTokenDetails = <TAccessToken>(
            jwt.verify(token, jwtAccessToken.SECRET_KEY)
        )

        if (!decodeTokenDetails) {
            throw new AppError(GENERAL_E_0014)
        }
        const userExist = await userExists(decodeTokenDetails.userId)

        if (!userExist) {
            throw new AppError(GENERAL_E_0007)
        }

        if (userExist.isAdmin) {
            req.user = decodeTokenDetails
            next()
        } else {
            const permissionExists = requiredPermissions.some((permission) =>
                decodeTokenDetails.permissions.includes(permission)
            )
            if (!permissionExists) {
                throw new AppError(GENERAL_E_0015)
            }
            req.user = decodeTokenDetails
            next()
        }
    })
