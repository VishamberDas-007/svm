import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/AppError'
import { GENERAL_E_0004, GENERAL_E_0007 } from '../config/responseCodes/general'
import jwt from 'jsonwebtoken'
import { jwtAccessToken } from '../config/const'
import prisma from '../db'

export const adminMiddleware = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const token: string = req.cookies.token

        console.dir(req.cookies, { depth: null })

        if (!token) throw new AppError(GENERAL_E_0004)
        else {
            const { email } = <{ email: string }>(
                jwt.verify(token, jwtAccessToken.SECRET_KEY)
            )

            const emailExists = await prisma.user.findFirst({
                where: {
                    email,
                },
            })

            if (!emailExists) throw new AppError(GENERAL_E_0007)

            next()
        }
    }
)
