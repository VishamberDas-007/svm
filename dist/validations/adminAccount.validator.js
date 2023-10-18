"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountIdValidator = exports.updateAccountValidator = exports.createAccountValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAccountValidator = joi_1.default.object({
    accNo: joi_1.default.string().required(),
    bankName: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
});
exports.updateAccountValidator = joi_1.default.object({
    accNo: joi_1.default.string().optional(),
    bankName: joi_1.default.string().optional(),
    name: joi_1.default.string().optional(),
});
exports.accountIdValidator = joi_1.default.object({
    accountId: joi_1.default.number().required(),
});
