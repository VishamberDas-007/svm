"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERRAL_S_0004 = exports.REFERRAL_S_0003 = exports.REFERRAL_S_0002 = exports.REFERRAL_S_0001 = exports.REFERRAL_E_0002 = exports.REFERRAL_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.REFERRAL_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'REFERRAL_E_0001',
    isNotify: false,
    message: 'This phone number is already referenced by another user',
    statusCode: 409,
};
exports.REFERRAL_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'REFERRAL_E_0002',
    isNotify: false,
    message: 'Failed to fetch referral',
    statusCode: 404,
};
exports.REFERRAL_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0001',
    isNotify: false,
    message: 'Referral created successfully',
    statusCode: 200,
};
exports.REFERRAL_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0002',
    isNotify: false,
    message: 'All referrals fetched successfully',
    statusCode: 200,
};
exports.REFERRAL_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0003',
    isNotify: false,
    message: 'Referral fetched successfully',
    statusCode: 200,
};
exports.REFERRAL_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'REFERRAL_S_0004',
    isNotify: false,
    message: 'Referral updated successfully',
    statusCode: 200,
};
