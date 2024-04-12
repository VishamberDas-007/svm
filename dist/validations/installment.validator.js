"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstallmentValidator = exports.installmentIdValidator = exports.createInstallmentValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
const PAYMENT_TYPE = ['CHEQUE', 'UPI', 'CASH', 'BANK_TRANSFER'];
exports.createInstallmentValidator = joi_1.default.object({
    amount: joi_1.default.number().required(),
    data: joi_1.default.array()
        .items({
        paymentType: joi_1.default.valid(...PAYMENT_TYPE).required(),
        accountNumber: joi_1.default.string().allow('', null).optional(),
        adminAccountId: joi_1.default.number().when('paymentType', {
            is: joi_1.default.valid('CASH'),
            then: joi_1.default.number().allow(null, '').optional(),
            otherwise: joi_1.default.number().optional(),
        }),
        bankName: joi_1.default.string().allow('', null).optional(),
        chequeNumber: joi_1.default.string().allow('', null).optional(),
        upiId: joi_1.default.string().allow('', null).optional(),
        penalty: joi_1.default.number().allow('', null).optional(),
        // installmentNo: Joi.number().required(),
    })
        .required(),
    bookingId: helper_1.default.uuid.required(),
});
exports.installmentIdValidator = joi_1.default.object({
    installmentId: helper_1.default.uuid.required(),
});
exports.updateInstallmentValidator = joi_1.default.object({
    amount: joi_1.default.number().required(),
    paymentType: joi_1.default.valid(...PAYMENT_TYPE).required(),
    adminAccountId: joi_1.default.number().when('paymentType', {
        is: joi_1.default.valid('CASH'),
        then: joi_1.default.number().allow(null, '').optional(),
        otherwise: joi_1.default.number().optional(),
    }),
    accountNumber: joi_1.default.string().allow('', null).optional(),
    bankName: joi_1.default.string().allow('', null).optional(),
    chequeNumber: joi_1.default.string().allow('', null).optional(),
    upiId: joi_1.default.string().allow('', null).optional(),
    penalty: joi_1.default.number().allow('', null).optional(),
    // installmentNo: Joi.number().required(),
    bookingId: helper_1.default.uuid.required(),
});
