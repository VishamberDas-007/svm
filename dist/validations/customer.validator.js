"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerImageIdValidator = exports.customerIdValidator = exports.updateCustomerValidator = exports.createCustomerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.createCustomerValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: helper_1.default.emailValidator.allow(null, '').optional(),
    phone1: helper_1.default.phoneValidator.optional(),
    phone2: helper_1.default.phoneValidator.allow('', null).optional(),
    city: joi_1.default.string().allow('', null).optional(),
    pincode: joi_1.default.string().length(6).optional(),
    dob: joi_1.default.string().optional(),
    isMarried: joi_1.default.boolean().required(),
    state: joi_1.default.string().allow('', null).optional(),
    address: joi_1.default.string().allow('', null).optional(),
});
exports.updateCustomerValidator = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: helper_1.default.emailValidator.allow('').optional(),
    phone1: helper_1.default.phoneValidator.optional(),
    phone2: helper_1.default.phoneValidator.allow('', null).optional(),
    city: joi_1.default.string().allow('').optional(),
    pincode: joi_1.default.string().length(6).allow('').optional(),
    dob: joi_1.default.string().optional(),
    isMarried: joi_1.default.boolean().optional(),
    state: joi_1.default.string().allow('').optional(),
    address: joi_1.default.string().allow('').optional(),
});
exports.customerIdValidator = joi_1.default.object({
    customerId: helper_1.default.uuid.required(),
});
exports.customerImageIdValidator = joi_1.default.object({
    customerImageId: helper_1.default.uuid.required(),
});
