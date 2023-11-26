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
        totalQueryCount?: number
    }
}

export type TQueryRequest = Request & {
    query: {
        page: number
        pageSize: number
    }
}

export type TAccessToken = {
    email: string
    role: string
    userId: string
    isAdmin: boolean
    permissions: string[]
}

export type permission =
    | 'PROJECT_READ'
    | 'PROJECT_WRITE'
    | 'AD_ACCOUNT_READ'
    | 'AD_ACCOUNT_WRITE'
    | 'BOOKING_READ'
    | 'BOOKING_WRITE'
    | 'CUSTOMER_READ'
    | 'CUSTOMER_WRITE'
    | 'EXPENSE_READ'
    | 'EXPENSE_WRITE'
    | 'REFERRAL_READ'
    | 'REFERRAL_WRITE'
    | 'ROLE_READ'
    | 'ROLE_WRITE'
    | 'USER_READ'
    | 'USER_WRITE'
    | 'INSTALLMENT_READ'
    | 'INSTALLMENT_WRITE'
    | 'WEBSITE_WRITE'
    | 'WEBSITE_READ'
