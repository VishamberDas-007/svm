import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const USER_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'USER_E_0001',
    isNotify: true,
    message: 'Failed to fetch user details',
    statusCode: 404,
}

export const USER_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'USER_S_0001',
    isNotify: true,
    message: 'New user added successfully',
    statusCode: 200,
}

export const USER_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'USER_S_0002',
    isNotify: true,
    message: 'User details fetched successfully',
    statusCode: 200,
}
