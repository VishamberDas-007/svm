"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingValidator = exports.bookingIdValidator = exports.createBookingValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
const paymentStatus = ['PENDING', 'PARTIAL', 'COMPLETED'];
const paymentType = ['CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER'];
exports.createBookingValidator = joi_1.default.object({
    address1: joi_1.default.string().required(),
    address2: joi_1.default.string().allow('', null).optional(),
    adminAccountId: joi_1.default.number().required(),
    area: joi_1.default.number().required(),
    customerId: joi_1.default.string().required(),
    installmentAmt: joi_1.default.number().required(),
    installmentCount: joi_1.default.number().required(),
    paidAmt: joi_1.default.number().required(),
    paymentStatus: joi_1.default.valid(...paymentStatus).required(),
    paymentType: joi_1.default.valid(...paymentType).required(),
    pincode: joi_1.default.string().required(),
    projectId: joi_1.default.string().required(),
    remainAmt: joi_1.default.number().required(),
    totalAmt: joi_1.default.number().required(),
    referralId: helper_1.default.uuid.allow('', null).optional(),
    accountNo: joi_1.default.string().when('paymentType', {
        is: 'BANK_TRANSFER',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    bankName: joi_1.default.string().when('paymentType', {
        is: 'BANK_TRANSFER' || 'CHEQUE',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    chequeNo: joi_1.default.string().when('paymentType', {
        is: 'CHEQUE',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    upiId: joi_1.default.string().when('paymentType', {
        is: 'UPI',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
});
exports.bookingIdValidator = joi_1.default.object({
    bookingId: helper_1.default.uuid.required(),
});
exports.updateBookingValidator = joi_1.default.object({
    address1: joi_1.default.string().optional(),
    address2: joi_1.default.string().optional(),
    adminAccountId: joi_1.default.number().optional(),
    area: joi_1.default.number().optional(),
    customerId: joi_1.default.string().optional(),
    installmentAmt: joi_1.default.number().optional(),
    installmentCount: joi_1.default.number().optional(),
    paidAmt: joi_1.default.number().optional(),
    paymentStatus: joi_1.default.valid(...paymentStatus).optional(),
    paymentType: joi_1.default.string().optional(),
    pincode: joi_1.default.string().optional(),
    projectId: joi_1.default.string().optional(),
    remainAmt: joi_1.default.string().optional(),
    totalAmt: joi_1.default.string().optional(),
    referralId: helper_1.default.uuid.allow('', null).optional(),
    accountNo: joi_1.default.string().when('paymentType', {
        is: 'BANK_TRANSFER',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    bankName: joi_1.default.string().when('paymentType', {
        is: 'BANK_TRANSFER' || 'CHEQUE',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    chequeNo: joi_1.default.string().when('paymentType', {
        is: 'CHEQUE',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    upiId: joi_1.default.string().when('paymentType', {
        is: 'UPI',
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
    paymentId: joi_1.default.string().when('paymentType', {
        is: joi_1.default.exist(),
        then: joi_1.default.required(),
        otherwise: joi_1.default.allow('', null).optional(),
    }),
});
