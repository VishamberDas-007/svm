"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_E_0003 = exports.DB_E_0002 = exports.DB_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.DB_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'DB_E_0001',
    isNotify: false,
    message: 'Unique constraint failed on the {constraint}',
    statusCode: 500,
};
exports.DB_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'DB_E_0002',
    isNotify: false,
    message: 'Record not found!!',
    statusCode: 404,
};
exports.DB_E_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'DB_E_0003',
    isNotify: false,
    message: 'Database error',
    statusCode: 500,
};
