import { RESPONSE_TYPE } from '../../types/global.types'

export const GENERAL_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0001',
    isNotify: false,
    message: 'Validation error',
    statusCode: 500,
}

export const GENERAL_E_0002 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0002',
    isNotify: false,
    message: 'Something went wrong',
    statusCode: 500,
}

export const GENERAL_E_0003 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0003',
    isNotify: false,
    message: 'File Upload Failed to S3',
    statusCode: 415,
}

export const GENERAL_E_0004 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0004',
    isNotify: false,
    message: 'File Size exceed, Max 20mb supported',
    statusCode: 500,
}

export const GENERAL_E_0005 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0005',
    isNotify: false,
    message: 'Files limit exceed',
    statusCode: 500,
}

export const GENERAL_E_0006 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0006',
    isNotify: false,
    message: 'Route not found',
    statusCode: 404,
}

export const GENERAL_E_0007 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0007',
    isNotify: false,
    message: 'User not found!!',
    statusCode: 404,
}

export const GENERAL_E_0008 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0008',
    isNotify: false,
    message: 'No such company exists!!',
    statusCode: 404,
}

export const GENERAL_E_0009 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0009',
    isNotify: false,
    message: 'Company info already exists!!',
    statusCode: 401,
}

export const GENERAL_E_0010 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0010',
    isNotify: false,
    message: 'Access Forbidden!!',
    statusCode: 403,
}

export const GENERAL_E_0011 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0011',
    isNotify: false,
    message: 'No information to update!! Enter some..',
    statusCode: 400,
}

export const GENERAL_E_0012 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0012',
    isNotify: false,
    message: 'Work in progress!!',
    statusCode: 404,
}

export const GENERAL_E_0013 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0013',
    isNotify: false,
    message: 'token is expired',
    statusCode: 401,
}

export const GENERAL_E_0014 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'GENERAL_E_0014',
    isNotify: false,
    message: 'Invalid token',
    statusCode: 401,
}
