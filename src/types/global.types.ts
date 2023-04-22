export enum RESPONSE_TYPE {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    INFO = 'INFO',
}

export type TResponseCode = {
    code: string
    message: string
    isNotify: boolean
    type: RESPONSE_TYPE
    statusCode: number
}
