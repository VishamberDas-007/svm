"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_S_0005 = exports.AUTH_S_0004 = exports.AUTH_S_0003 = exports.AUTH_S_0002 = exports.AUTH_S_0001 = exports.AUTH_E_0008 = exports.AUTH_E_0007 = exports.AUTH_E_0006 = exports.AUTH_E_0005 = exports.AUTH_E_0004 = exports.AUTH_E_0003 = exports.AUTH_E_0002 = exports.AUTH_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.AUTH_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0001',
    isNotify: true,
    message: 'Invalid credentials',
    statusCode: 404,
};
exports.AUTH_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0002',
    isNotify: true,
    message: 'Email already exists',
    statusCode: 409,
};
exports.AUTH_E_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0003',
    isNotify: true,
    message: 'No such email exists',
    statusCode: 400,
};
exports.AUTH_E_0004 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0004',
    isNotify: true,
    message: `Couldn't find your SVM account`,
    statusCode: 403,
};
exports.AUTH_E_0005 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0005',
    isNotify: false,
    message: 'Otp expired, please request again',
    statusCode: 401,
};
exports.AUTH_E_0006 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0006',
    isNotify: true,
    message: 'Invalid OTP',
    statusCode: 403,
};
exports.AUTH_E_0007 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0007',
    isNotify: false,
    message: "User doesn't exist",
    statusCode: 403,
};
exports.AUTH_E_0008 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'AUTH_E_0008',
    isNotify: false,
    message: 'Update was failed',
    statusCode: 500,
};
exports.AUTH_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0001',
    isNotify: true,
    message: 'Registered successfully',
    statusCode: 200,
};
exports.AUTH_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0002',
    isNotify: true,
    message: 'Logged-in successfully',
    statusCode: 200,
};
exports.AUTH_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0003',
    isNotify: true,
    message: 'Email sent successfully',
    statusCode: 200,
};
exports.AUTH_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0004',
    isNotify: false,
    message: 'Email verified successfully',
    statusCode: 200,
};
exports.AUTH_S_0005 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'AUTH_S_0005',
    isNotify: false,
    message: 'Password changed successfully',
    statusCode: 200,
};
