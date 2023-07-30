import { RESPONSE_TYPE } from '../../types/global.types'
export const ROLE_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'ROLE_E_0001',
    isNotify: false,
    message: 'Failed to fetch role',
    statusCode: 404,
}

export const ROLE_S_0001 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0001',
    isNotify: false,
    message: 'New role created successfully',
    statusCode: 200,
}

export const ROLE_S_0002 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0002',
    isNotify: false,
    message: 'Role list fetched successfully',
    statusCode: 200,
}

export const ROLE_S_0003 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0003',
    isNotify: false,
    message: 'Role fetched successfully',
    statusCode: 200,
}

export const ROLE_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0004',
    isNotify: false,
    message: 'Role updated successfully',
    statusCode: 200,
}
