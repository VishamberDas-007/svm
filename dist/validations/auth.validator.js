"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.emailOtpValidator = exports.loginValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.registerValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    password: helper_1.default.passwordValidator.required(),
    phone: helper_1.default.phoneValidator.required(),
    address: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
});
exports.loginValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    password: joi_1.default.string().required(),
});
exports.emailOtpValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    otp: helper_1.default.otpValidator.required(),
});
exports.changePasswordValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    password: helper_1.default.passwordValidator.required(),
    emailOtpToken: joi_1.default.string().required(),
});
