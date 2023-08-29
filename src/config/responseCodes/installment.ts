import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const INSTALLMENT_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0001',
    isNotify: true,
    message: 'The loan amount is already nil',
    statusCode: 400,
}

export const INSTALLMENT_E_0002: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0002',
    isNotify: true,
    message: 'Failed to fetch installment',
    statusCode: 404,
}

export const INSTALLMENT_E_0003: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0003',
    isNotify: true,
    message: 'The installment exceeds the actual amount',
    statusCode: 400,
}

export const INSTALLMENT_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0001',
    isNotify: true,
    message: 'Installment recorded successfully',
    statusCode: 200,
}

export const INSTALLMENT_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0002',
    isNotify: true,
    message: 'Installment details fetched successfully',
    statusCode: 200,
}

export const INSTALLMENT_S_0003: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0003',
    isNotify: true,
    message: 'Installment updated successfully',
    statusCode: 200,
}
