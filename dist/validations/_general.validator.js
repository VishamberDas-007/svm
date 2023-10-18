"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailIdValidator = exports.bookingIdValidator = exports.projectIdValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.projectIdValidator = joi_1.default.object({
    projectId: helper_1.default.uuid.required(),
});
exports.bookingIdValidator = joi_1.default.object({
    bookingId: helper_1.default.uuid.required(),
});
exports.emailIdValidator = joi_1.default.object({
    emailId: helper_1.default.emailValidator.required(),
});
