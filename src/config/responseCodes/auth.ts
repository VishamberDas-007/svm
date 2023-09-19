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

export const AUTH_E_0003: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0003',
    isNotify: true,
    message: 'No such email exists',
    statusCode: 400,
}

export const AUTH_E_0004 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0004',
    isNotify: true,
    message: `Couldn't find your SVM account`,
    statusCode: 403,
}

export const AUTH_E_0005 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0005',
    isNotify: false,
    message: 'Otp expired, please request again',
    statusCode: 401,
}

export const AUTH_E_0006 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0006',
    isNotify: true,
    message: 'Invalid OTP',
    statusCode: 403,
}

export const AUTH_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0001',
    isNotify: true,
    message: 'Registered successfully',
    statusCode: 200,
}

export const AUTH_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0002',
    isNotify: true,
    message: 'Logged-in successfully',
    statusCode: 200,
}

export const AUTH_S_0003: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0003',
    isNotify: true,
    message: 'Email sent successfully',
    statusCode: 200,
}

export const AUTH_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0004',
    isNotify: false,
    message: 'Email verified successfully',
    statusCode: 200,
}
