"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_S_0005 = exports.ROLE_S_0004 = exports.ROLE_S_0003 = exports.ROLE_S_0002 = exports.ROLE_S_0001 = exports.ROLE_E_0002 = exports.ROLE_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.ROLE_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'ROLE_E_0001',
    isNotify: false,
    message: 'Failed to fetch role',
    statusCode: 404,
};
exports.ROLE_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'ROLE_E_0002',
    isNotify: false,
    message: 'Role already exists',
    statusCode: 409,
};
exports.ROLE_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0001',
    isNotify: false,
    message: 'New role created successfully',
    statusCode: 200,
};
exports.ROLE_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0002',
    isNotify: false,
    message: 'Role list fetched successfully',
    statusCode: 200,
};
exports.ROLE_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0003',
    isNotify: false,
    message: 'Role fetched successfully',
    statusCode: 200,
};
exports.ROLE_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0004',
    isNotify: false,
    message: 'Role updated successfully',
    statusCode: 200,
};
exports.ROLE_S_0005 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'ROLE_S_0005',
    isNotify: false,
    message: 'All permissions fetched successfully',
    statusCode: 200,
};
