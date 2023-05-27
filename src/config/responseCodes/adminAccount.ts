import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const AD_ACCOUNT_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AD_ACCOUNT_E_0001',
    isNotify: true,
    message: 'Failed to fetch Bank account',
    statusCode: 404,
}

export const AD_ACCOUNT_E_0002: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AD_ACCOUNT_E_0002',
    isNotify: true,
    message: 'Bank account already exists',
    statusCode: 409,
}

export const AD_ACCOUNT_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0001',
    isNotify: true,
    message: 'New bank account created successfully',
    statusCode: 200,
}

export const AD_ACCOUNT_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0002',
    isNotify: true,
    message: 'Bank account fetched successfully',
    statusCode: 200,
}

export const AD_ACCOUNT_S_0003: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0003',
    isNotify: true,
    message: 'Bank account list fetched successfully',
    statusCode: 200,
}
