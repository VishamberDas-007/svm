"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerIdValidator = exports.updateCustomerValidator = exports.createCustomerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.createCustomerValidator = joi_1.default.object({
    aadharNo: joi_1.default.string().length(12).required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: helper_1.default.emailValidator.allow(null, '').optional(),
    phone: helper_1.default.phoneValidator.required(),
});
exports.updateCustomerValidator = joi_1.default.object({
    aadharNo: joi_1.default.string().length(12).optional(),
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    email: helper_1.default.emailValidator.optional(),
    phone: helper_1.default.phoneValidator.optional(),
});
exports.customerIdValidator = joi_1.default.object({
    customerId: helper_1.default.uuid.required(),
});
