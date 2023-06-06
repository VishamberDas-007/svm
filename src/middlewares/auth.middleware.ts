import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/AppError'
import { GENERAL_E_0004 } from '../config/responseCodes/general'
import jwt from 'jsonwebtoken'
import { jwtAccessToken } from '../config/const'

export const adminMiddleware = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const token: string = req.cookies.token

        if (!token) throw new AppError(GENERAL_E_0004)
        else {
            const decode = jwt.verify(token, jwtAccessToken.SECRET_KEY)
            console.log({ decode })
            next()
        }
    }
)
