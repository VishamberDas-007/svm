"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPENSE_E_0002 = exports.EXPENSE_E_0001 = exports.EXPENSE_S_0004 = exports.EXPENSE_S_0003 = exports.EXPENSE_S_0002 = exports.EXPENSE_S_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.EXPENSE_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0001',
    isNotify: false,
    message: 'Expense added successfully',
    statusCode: 200,
};
exports.EXPENSE_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0002',
    isNotify: false,
    message: 'Expense fetched successfully',
    statusCode: 200,
};
exports.EXPENSE_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0003',
    isNotify: false,
    message: 'Expense list fetched successfully',
    statusCode: 200,
};
exports.EXPENSE_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'EXPENSE_S_0004',
    isNotify: false,
    message: 'Expense list updated successfully',
    statusCode: 200,
};
exports.EXPENSE_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'EXPENSE_E_0001',
    isNotify: false,
    message: 'Failed to fetch expense',
    statusCode: 404,
};
exports.EXPENSE_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'EXPENSE_E_0002',
    isNotify: false,
    message: 'Expense already exists',
    statusCode: 409,
};
