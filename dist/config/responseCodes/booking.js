"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_S_0008 = exports.BOOKING_S_0007 = exports.BOOKING_S_0006 = exports.BOOKING_S_0005 = exports.BOOKING_S_0004 = exports.BOOKING_S_0003 = exports.BOOKING_S_0002 = exports.BOOKING_S_0001 = exports.BOOKING_E_0004 = exports.BOOKING_E_0003 = exports.BOOKING_E_0002 = exports.BOOKING_E_0001 = void 0;
const global_types_1 = require("../../types/global.types");
exports.BOOKING_E_0001 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0001',
    isNotify: true,
    message: 'Failed to fetch Booking',
    statusCode: 404,
};
exports.BOOKING_E_0002 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0002',
    isNotify: true,
    message: 'Failed to fetch Project Details',
    statusCode: 404,
};
exports.BOOKING_E_0003 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0003',
    isNotify: true,
    message: 'Area Unavailability: It exceeds the total project area',
    statusCode: 400,
};
exports.BOOKING_E_0004 = {
    type: global_types_1.RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0004',
    isNotify: true,
    message: 'Failed to update the penalty data',
    statusCode: 400,
};
exports.BOOKING_S_0001 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0001',
    isNotify: true,
    message: 'Booking created successfully',
    statusCode: 200,
};
exports.BOOKING_S_0002 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0002',
    isNotify: true,
    message: 'Fetched all bookings successfully',
    statusCode: 200,
};
exports.BOOKING_S_0003 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0003',
    isNotify: true,
    message: 'Booking fetched successfully',
    statusCode: 200,
};
exports.BOOKING_S_0004 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0004',
    isNotify: true,
    message: 'Booking updated successfully',
    statusCode: 200,
};
exports.BOOKING_S_0005 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0005',
    isNotify: true,
    message: 'Booking deleted successfully',
    statusCode: 200,
};
exports.BOOKING_S_0006 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0006',
    isNotify: true,
    message: 'Penalty added successfully',
    statusCode: 200,
};
exports.BOOKING_S_0007 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0007',
    isNotify: true,
    message: 'Penalty updated successfully',
    statusCode: 200,
};
exports.BOOKING_S_0008 = {
    type: global_types_1.RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0008',
    isNotify: true,
    message: 'Penalty list fetched successfully',
    statusCode: 200,
};
