import { RESPONSE_TYPE } from '../../types/global.types'

export const REFERRAL_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'REFERRAL_E_0001',
    isNotify: false,
    message: 'This phone number is already referenced by another user',
    statusCode: 409,
}

export const REFERRAL_E_0002 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'REFERRAL_E_0002',
    isNotify: false,
    message: 'Failed to fetch referral',
    statusCode: 404,
}

export const REFERRAL_S_0001 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0001',
    isNotify: false,
    message: 'Referral created successfully',
    statusCode: 200,
}

export const REFERRAL_S_0002 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0002',
    isNotify: false,
    message: 'All referrals fetched successfully',
    statusCode: 200,
}

export const REFERRAL_S_0003 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0003',
    isNotify: false,
    message: 'Referral fetched successfully',
    statusCode: 200,
}

export const REFERRAL_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0004',
    isNotify: false,
    message: 'Referral updated successfully',
    statusCode: 200,
}
