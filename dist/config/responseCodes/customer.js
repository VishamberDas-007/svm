"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOMER_S_0009 = exports.CUSTOMER_S_0008 = exports.CUSTOMER_S_0007 = exports.CUSTOMER_S_0006 = exports.CUSTOMER_S_0005 = exports.CUSTOMER_S_0004 = exports.CUSTOMER_S_0003 = exports.CUSTOMER_S_0002 = exports.CUSTOMER_S_0001 = exports.CUSTOMER_E_0003 = exports.CUSTOMER_E_0002 = exports.CUSTOMER_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.CUSTOMER_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0001',
    isNotify: false,
    message: 'Failed to fetch customer',
    statusCode: 404,
};
exports.CUSTOMER_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0002',
    isNotify: false,
    message: 'This Phone number is already associated with another customer',
    statusCode: 409,
};
exports.CUSTOMER_E_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'CUSTOMER_E_0003',
    isNotify: false,
    message: 'No such image exists',
    statusCode: 400,
};
exports.CUSTOMER_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0001',
    isNotify: false,
    message: 'Customer created successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0002',
    isNotify: false,
    message: 'Customer fetched successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0003',
    isNotify: false,
    message: 'Customer list fetched successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0004',
    isNotify: false,
    message: 'Customer updated successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0005 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0005',
    isNotify: false,
    message: 'Customer PAN uploaded successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0006 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0006',
    isNotify: false,
    message: 'Customer Aadhar uploaded successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0007 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0007',
    isNotify: false,
    message: 'Customer images uploaded successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0008 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0008',
    isNotify: false,
    message: 'Customer images deleted successfully',
    statusCode: 200,
};
exports.CUSTOMER_S_0009 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'CUSTOMER_S_0009',
    isNotify: false,
    message: 'Customer deleted successfully',
    statusCode: 200,
};
