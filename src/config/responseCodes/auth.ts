import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const AUTH_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0001',
    isNotify: true,
    message: 'Invalid credentials',
    statusCode: 404,
}

export const AUTH_E_0002: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0002',
    isNotify: true,
    message: 'Email already exists',
    statusCode: 409,
}

export const AUTH_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0001',
    isNotify: true,
    message: 'Logged-in successfully',
    statusCode: 200,
}
