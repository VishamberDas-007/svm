"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidator = exports.userIdValidator = exports.userCreateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.userCreateValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    phone: helper_1.default.phoneValidator.required(),
    address: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    roleId: joi_1.default.number().required(),
});
exports.userIdValidator = joi_1.default.object({
    userId: helper_1.default.uuid.optional(),
});
exports.userUpdateValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.optional(),
    phone: helper_1.default.phoneValidator.optional(),
    address: joi_1.default.string().optional(),
    name: joi_1.default.string().optional(),
    roleId: joi_1.default.string().optional(),
});
