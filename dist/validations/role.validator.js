"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleValidator = exports.roleIdValidator = exports.createRoleValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRoleValidator = joi_1.default.object({
    label: joi_1.default.string().required(),
    permissionIds: joi_1.default.array().items(joi_1.default.number().required()).required(),
});
exports.roleIdValidator = joi_1.default.object({
    roleId: joi_1.default.number().required(),
});
exports.updateRoleValidator = joi_1.default.object({
    label: joi_1.default.string().optional(),
    permissionIds: joi_1.default.array().items(joi_1.default.number().required()).optional(),
});
