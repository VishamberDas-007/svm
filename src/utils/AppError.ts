import { RESPONSE_TYPE, TResponseCode } from '../types/global.types'

export default class AppError extends Error {
    message: string
    type: RESPONSE_TYPE
    code: string
    result: unknown
    statusCode: number
    isNotify: boolean

    constructor(
        res: TResponseCode,
        message?: string,
        result?: unknown,
        isNotify?: boolean
    ) {
        super()

        this.statusCode = res.statusCode
        this.type = res.type
        this.code = res.code
        this.isNotify = isNotify || res.isNotify
        this.message = message || res.message
        this.result = result || null
    }
}
