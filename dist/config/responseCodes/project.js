"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_S_0005 = exports.PROJECT_S_0004 = exports.PROJECT_S_0003 = exports.PROJECT_S_0002 = exports.PROJECT_S_0001 = exports.PROJECT_E_0002 = exports.PROJECT_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.PROJECT_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'PROJECT_E_0001',
    isNotify: false,
    message: 'Failed to fetch project details',
    statusCode: 404,
};
exports.PROJECT_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'PROJECT_E_0002',
    isNotify: false,
    message: 'No such parent project exists',
    statusCode: 404,
};
exports.PROJECT_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0001',
    isNotify: false,
    message: 'Project created successfully',
    statusCode: 200,
};
exports.PROJECT_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0002',
    isNotify: false,
    message: 'Projects fetched successfully',
    statusCode: 200,
};
exports.PROJECT_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0003',
    isNotify: false,
    message: 'Project details fetched',
    statusCode: 200,
};
exports.PROJECT_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0004',
    isNotify: false,
    message: 'Project updated successfully',
    statusCode: 200,
};
exports.PROJECT_S_0005 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0005',
    isNotify: false,
    message: 'Happy customer images uploaded successfully',
    statusCode: 200,
};
