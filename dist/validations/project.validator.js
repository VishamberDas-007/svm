"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdValidator = exports.projectImageIdValidator = exports.projectImageIdsValidator = exports.updateProjectValidator = exports.createProjectValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const helper_1 = __importDefault(require("../utils/helper"));
const projectStatus = ['ACTIVE', 'COMPLETED', 'UPCOMING'];
exports.createProjectValidator = joi_1.default.object({
    address1: joi_1.default.string().required(),
    area: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow('', null).optional(),
    ownerName: joi_1.default.string().required(),
    pincode: joi_1.default.string().required(),
    status: joi_1.default.valid(...projectStatus).required(),
    unit: joi_1.default.string().required(),
    address2: joi_1.default.string().allow('', null).optional(),
    logo: joi_1.default.any().optional(),
    location: joi_1.default.string().required(),
});
exports.updateProjectValidator = joi_1.default.object({
    address1: joi_1.default.string().optional(),
    area: joi_1.default.number().optional(),
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().allow('', null).optional(),
    ownerName: joi_1.default.string().optional(),
    pincode: joi_1.default.string().optional(),
    status: joi_1.default.valid(...projectStatus).optional(),
    unit: joi_1.default.string().optional(),
    address2: joi_1.default.string().allow(null, '').optional(),
    // emiAmt: Joi.number().optional(),
    // downPayment: Joi.number().optional(),
    // totalAmt: Joi.number().optional(),
    location: joi_1.default.string().optional(),
});
exports.projectImageIdsValidator = joi_1.default.object({
    projectImageIds: joi_1.default.array().items(helper_1.default.uuid.required()).required(),
});
exports.projectImageIdValidator = joi_1.default.object({
    projectImageId: helper_1.default.uuid.required(),
});
exports.projectIdValidator = joi_1.default.object({
    projectId: helper_1.default.uuid.required(),
});
