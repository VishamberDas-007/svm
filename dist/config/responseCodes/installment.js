"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTALLMENT_S_0004 = exports.INSTALLMENT_S_0003 = exports.INSTALLMENT_S_0002 = exports.INSTALLMENT_S_0001 = exports.INSTALLMENT_E_0004 = exports.INSTALLMENT_E_0003 = exports.INSTALLMENT_E_0002 = exports.INSTALLMENT_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.INSTALLMENT_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0001',
    isNotify: true,
    message: 'The loan amount is already nil',
    statusCode: 400,
};
exports.INSTALLMENT_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0002',
    isNotify: true,
    message: 'Failed to fetch installment',
    statusCode: 404,
};
exports.INSTALLMENT_E_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0003',
    isNotify: true,
    message: 'The installment exceeds the actual amount',
    statusCode: 400,
};
exports.INSTALLMENT_E_0004 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_E_0004',
    isNotify: true,
    message: 'Failed to fetch booking',
    statusCode: 400,
};
exports.INSTALLMENT_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0001',
    isNotify: true,
    message: 'Installment recorded successfully',
    statusCode: 200,
};
exports.INSTALLMENT_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0002',
    isNotify: true,
    message: 'Installment details fetched successfully',
    statusCode: 200,
};
exports.INSTALLMENT_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0003',
    isNotify: true,
    message: 'Installment updated successfully',
    statusCode: 200,
};
exports.INSTALLMENT_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'INSTALLMENT_S_0004',
    isNotify: true,
    message: 'Installment deleted successfully',
    statusCode: 200,
};
