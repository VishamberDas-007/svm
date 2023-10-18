"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectValidator = exports.createProjectValidator = void 0;
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
    parentId: helper_1.default.uuid.allow('', null).optional(),
    planningImages: joi_1.default.any().optional(),
    siteImages: joi_1.default.any().optional(),
    logo: joi_1.default.any().required(),
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
    address2: joi_1.default.string().optional(),
    planningImages: joi_1.default.any().optional(),
    siteImages: joi_1.default.any().optional(),
    logo: joi_1.default.any().optional(),
});
