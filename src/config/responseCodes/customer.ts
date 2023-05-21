import { RESPONSE_TYPE } from '../../types/global.types'

export const CUSTOMER_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0001',
    isNotify: false,
    message: 'Failed to fetch customer',
    statusCode: 404,
}

export const CUSTOMER_E_0002 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0002',
    isNotify: false,
    message: 'This Aadhar number is already associated with another customer',
    statusCode: 409,
}

export const CUSTOMER_S_0001 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0001',
    isNotify: false,
    message: 'Customer created successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0002 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0002',
    isNotify: false,
    message: 'Customer fetched successfully',
    statusCode: 200,
}
