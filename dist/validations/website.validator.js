"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFestivalValidator = exports.statusValidator = exports.saveContactUsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
exports.saveContactUsValidator = joi_1.default.object({
    email: helper_1.default.emailValidator.optional(),
    subject: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    message: joi_1.default.string().required(),
    number: joi_1.default.string().required(),
});
exports.statusValidator = joi_1.default.object({
    status: joi_1.default.valid('PENDING', 'COMPLETED').required(),
});
exports.addFestivalValidator = joi_1.default.object({
    description: joi_1.default.string().required(),
    thumbnailImg: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    url: joi_1.default.string().required(),
    isLatest: joi_1.default.boolean().required(),
});
