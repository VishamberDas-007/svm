"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_ACCOUNT_S_0004 = exports.AD_ACCOUNT_S_0003 = exports.AD_ACCOUNT_S_0002 = exports.AD_ACCOUNT_S_0001 = exports.AD_ACCOUNT_E_0002 = exports.AD_ACCOUNT_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.AD_ACCOUNT_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AD_ACCOUNT_E_0001',
    isNotify: true,
    message: 'Failed to fetch Bank account',
    statusCode: 404,
};
exports.AD_ACCOUNT_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AD_ACCOUNT_E_0002',
    isNotify: true,
    message: 'Bank account already exists',
    statusCode: 409,
};
exports.AD_ACCOUNT_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0001',
    isNotify: true,
    message: 'New bank account created successfully',
    statusCode: 200,
};
exports.AD_ACCOUNT_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0002',
    isNotify: true,
    message: 'Bank account fetched successfully',
    statusCode: 200,
};
exports.AD_ACCOUNT_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0003',
    isNotify: true,
    message: 'Bank account list fetched successfully',
    statusCode: 200,
};
exports.AD_ACCOUNT_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AD_ACCOUNT_S_0004',
    isNotify: true,
    message: 'Bank account updated successfully',
    statusCode: 200,
};
