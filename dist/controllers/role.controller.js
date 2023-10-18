"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllPermissions = exports.updateRoleDetails = exports.fetchRoleDetails = exports.roleBasicList = exports.roleAdvanceList = exports.newRole = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/role.validator"));
const helper_1 = __importDefault(require("../utils/helper"));
const role_1 = require("../config/responseCodes/role");
exports.newRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createRoleValidator, req.body);
    const { label, permissionIds } = req.body;
    const roleExists = yield db_1.default.role.findFirst({
        where: {
            value: helper_1.default.formatLabelName(label),
        },
    });
    if (roleExists)
        throw new AppError_1.default(role_1.ROLE_E_0002);
    const newRole = yield db_1.default.role.create({
        data: {
            label: label,
            value: helper_1.default.formatLabelName(label),
            permission: {
                connect: permissionIds.map((permissionId) => {
                    return { permissionId };
                }),
            },
        },
    });
    return (0, responseHandler_1.default)(res, role_1.ROLE_S_0001, newRole);
}));
exports.roleAdvanceList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fetchRoleList = yield db_1.default.role.findMany({
        include: {
            permission: true,
        },
    });
    return (0, responseHandler_1.default)(res, role_1.ROLE_S_0002, fetchRoleList);
}));
exports.roleBasicList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield db_1.default.role.findMany()).map((role) => ({
        roleId: role.roleId,
        label: role.label,
    }));
    return (0, responseHandler_1.default)(res, role_1.ROLE_S_0002, result);
}));
exports.fetchRoleDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.roleIdValidator, req.params);
    const { roleId } = req.params;
    const roleExists = yield db_1.default.role.findFirst({
        where: {
            roleId: +roleId,
        },
        include: {
            permission: true,
        },
    });
    const result = [];
    if (!roleExists)
        throw new AppError_1.default(role_1.ROLE_E_0001);
    else {
        roleExists.permission.forEach((element) => {
            const keyName = element.value.includes('READ')
                ? 'read'
                : 'write';
            const groupExists = result.findIndex((obj) => element.group === obj.group);
            if (groupExists !== -1) {
                result[groupExists] = Object.assign(Object.assign({}, result === null || result === void 0 ? void 0 : result[groupExists]), { [keyName]: element.permissionId });
            }
            else {
                result.push({
                    [keyName]: element.permissionId,
                    group: element.group,
                });
            }
        });
        return (0, responseHandler_1.default)(res, role_1.ROLE_S_0003, Object.assign(Object.assign({}, roleExists), { permission: result }));
    }
}));
exports.updateRoleDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, validations_1.default)(validation.roleIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateRoleValidator, req.body);
    const { roleId } = req.params;
    const { label, permissionIds, } = req.body;
    let data = {};
    const roleExists = yield db_1.default.role.findFirst({
        where: {
            roleId: +roleId,
        },
        include: {
            permission: true,
        },
    });
    if (!roleExists)
        throw new AppError_1.default(role_1.ROLE_E_0001);
    else if (permissionIds === null || permissionIds === void 0 ? void 0 : permissionIds.length) {
        data = {
            permission: {
                disconnect: (_a = roleExists.permission) === null || _a === void 0 ? void 0 : _a.map((permission) => {
                    return { permissionId: permission.permissionId };
                }),
                connect: permissionIds.map((permissionId) => {
                    return {
                        permissionId,
                    };
                }),
            },
        };
    }
    if (label) {
        const roleAlreadyExists = yield db_1.default.role.findFirst({
            where: {
                value: label && helper_1.default.formatLabelName(label),
                roleId: {
                    not: +roleId,
                },
            },
        });
        if (roleAlreadyExists)
            throw new AppError_1.default(role_1.ROLE_E_0002);
    }
    data = Object.assign(Object.assign({}, data), { label, value: label && helper_1.default.formatLabelName(label) });
    const updateRole = yield db_1.default.role.update({
        where: {
            roleId: +roleId,
        },
        data: data,
        include: {
            permission: true,
        },
    });
    return (0, responseHandler_1.default)(res, role_1.ROLE_S_0004, updateRole);
}));
exports.fetchAllPermissions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const permissionList = yield db_1.default.permission.findMany({
        orderBy: {
            permissionId: 'asc',
        },
    });
    permissionList.forEach((element) => {
        const keyName = element.value.includes('READ') ? 'read' : 'write';
        const groupExists = result.findIndex((obj) => element.group === obj.group);
        if (groupExists !== -1) {
            result[groupExists] = Object.assign(Object.assign({}, result === null || result === void 0 ? void 0 : result[groupExists]), { [keyName]: element.permissionId });
        }
        else {
            result.push({
                [keyName]: element.permissionId,
                group: element.group,
            });
        }
    });
    return (0, responseHandler_1.default)(res, role_1.ROLE_S_0005, result);
}));
