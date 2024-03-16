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

export const CUSTOMER_E_0003 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0003',
    isNotify: false,
    message: 'No such image exists',
    statusCode: 400,
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

export const CUSTOMER_S_0003 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0003',
    isNotify: false,
    message: 'Customer list fetched successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0004',
    isNotify: false,
    message: 'Customer updated successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0005 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0005',
    isNotify: false,
    message: 'Customer PAN uploaded successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0006 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0006',
    isNotify: false,
    message: 'Customer Aadhar uploaded successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0007 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0007',
    isNotify: false,
    message: 'Customer images uploaded successfully',
    statusCode: 200,
}

export const CUSTOMER_S_0008 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0008',
    isNotify: false,
    message: 'Customer images deleted successfully',
    statusCode: 200,
}
