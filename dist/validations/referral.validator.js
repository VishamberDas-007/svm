"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReferralValidator = exports.referralIdValidator = exports.createReferralValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.createReferralValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.required(),
    address: joi_1.default.string().optional(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    phone: helper_1.default.phoneValidator.required(),
});
exports.referralIdValidator = joi_1.default.object({
    referralId: helper_1.default.uuid.required(),
});
exports.updateReferralValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.optional(),
    address: joi_1.default.string().optional(),
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    phone: helper_1.default.phoneValidator.optional(),
});
