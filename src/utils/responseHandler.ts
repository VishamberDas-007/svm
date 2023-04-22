import { Response } from 'express'
import { TResponseCode } from '../types/global.types'

export default (
    res: Response,
    resCode: TResponseCode,
    result?: unknown,
    message?: string,
    isNotify?: boolean
) => {
    const response = {
        type: resCode.type,
        code: resCode.code,
        isNotify: isNotify || resCode.isNotify,
        message: message || resCode.message,
        result: result || null,
    }

    return res.status(resCode?.statusCode || 500).json(response)
}
