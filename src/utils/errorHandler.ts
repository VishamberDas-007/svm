import { ValidationError } from 'joi'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import responseHandler from './responseHandler'
import {
    GENERAL_E_0001,
    GENERAL_E_0002,
    GENERAL_E_0004,
    GENERAL_E_0005,
    GENERAL_E_0013,
    GENERAL_E_0014,
} from '../config/responseCodes/general'
import AppError from './AppError'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import {
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
} from '@prisma/client/runtime/library'
import { DB_E_0001, DB_E_0002, DB_E_0003 } from '../config/responseCodes/db'
import { AxiosError } from 'axios'

export default (
    err: ErrorRequestHandler | AppError | ValidationError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': {
                return responseHandler(res, DB_E_0001)
            }
            case 'P2025': {
                return responseHandler(res, DB_E_0002)
            }
            default: {
                return responseHandler(res, DB_E_0003)
            }
        }
    }
    if (err instanceof PrismaClientRustPanicError) {
        return responseHandler(res, DB_E_0002)
    }

    if (err instanceof ValidationError) {
        return responseHandler(res, GENERAL_E_0001, null, err.message)
    }

    if (err instanceof TokenExpiredError) {
        return responseHandler(res, GENERAL_E_0013)
    }

    if (err instanceof JsonWebTokenError) {
        return responseHandler(res, GENERAL_E_0014)
    }

    if (err instanceof AppError) {
        if (err?.code?.split('_')[0] === 'TOKEN' && err.type === 'ERROR') {
            return responseHandler(res, err)
        }

        if (err?.code === 'LIMIT_FILE_SIZE') {
            return responseHandler(res, GENERAL_E_0004)
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return responseHandler(res, GENERAL_E_0005)
        }

        return responseHandler(res, err, err?.result)
    }
    if (err instanceof AxiosError) {
        console.log(err.response?.data)
    }

    responseHandler(res, GENERAL_E_0002)
    return next()
}
