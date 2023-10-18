"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_S_0002 = exports.USER_S_0001 = exports.USER_E_0002 = exports.USER_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.USER_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'USER_E_0001',
    isNotify: true,
    message: 'Failed to fetch user details',
    statusCode: 404,
};
exports.USER_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'USER_E_0002',
    isNotify: true,
    message: 'This Email is associated with other account',
    statusCode: 409,
};
exports.USER_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'USER_S_0001',
    isNotify: true,
    message: 'New user added successfully',
    statusCode: 200,
};
exports.USER_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'USER_S_0002',
    isNotify: true,
    message: 'User details fetched successfully',
    statusCode: 200,
};
