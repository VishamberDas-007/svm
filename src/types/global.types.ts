import { Request } from 'express'

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

export type TListData<TList> = {
    list: TList[]
    meta: {
        totalCount: number
        page: number
        pageSize: number
        totalQueryCount: number
    }
}

export type TQueryRequest = Request & {
    query: {
        page: number
        pageSize: number
    }
}
