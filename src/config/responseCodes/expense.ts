import { RESPONSE_TYPE } from '../../types/global.types'

export const EXPENSE_S_0001 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0001',
    isNotify: false,
    message: 'Expense added successfully',
    statusCode: 200,
}

export const EXPENSE_S_0002 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0002',
    isNotify: false,
    message: 'Expense fetched successfully',
    statusCode: 200,
}

export const EXPENSE_S_0003 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0003',
    isNotify: false,
    message: 'Expense list fetched successfully',
    statusCode: 200,
}

export const EXPENSE_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0004',
    isNotify: false,
    message: 'Expense list updated successfully',
    statusCode: 200,
}

export const EXPENSE_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'EXPENSE_E_0001',
    isNotify: false,
    message: 'Failed to fetch expense',
    statusCode: 404,
}
