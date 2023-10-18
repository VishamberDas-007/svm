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
exports.updateUser = exports.getAllUsers = exports.getUser = exports.createUser = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const db_1 = __importDefault(require("../db"));
const helper_1 = __importDefault(require("../utils/helper"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const const_1 = require("../config/const");
const user_1 = require("../config/responseCodes/user");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/user.validator"));
const nodeMailer_1 = require("../utils/nodeMailer");
exports.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.userCreateValidator, req.body);
    const { address, email, name, phone, roleId } = req.body;
    const password = helper_1.default.passwordGenerator();
    const encryptPassword = bcrypt_1.default.hashSync(password, +const_1.SALT_ROUND);
    const emailExists = yield db_1.default.user.findFirst({
        where: {
            email: email.toLowerCase(),
        },
    });
    if (emailExists)
        throw new AppError_1.default(user_1.USER_E_0002, undefined, null, true);
    const newUser = yield db_1.default.user.create({
        data: {
            email: email.toLowerCase(),
            name,
            password: encryptPassword,
            phone,
            address,
            roleId,
        },
    });
    const html = `email : ${newUser.email}, password : ${password} `;
    (0, responseHandler_1.default)(res, user_1.USER_S_0001, Object.assign(Object.assign({}, newUser), { password: undefined }));
    yield (0, nodeMailer_1.sendEmailToCustomer)(newUser.email, const_1.emailConfig.SUBJECT, html);
}));
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.userIdValidator, req.params);
    const { userId } = req.params;
    const userDetails = yield db_1.default.user.findFirst({
        where: {
            userId,
        },
        include: {
            role: true,
        },
    });
    if (!userDetails) {
        throw new AppError_1.default(user_1.USER_E_0001);
    }
    return (0, responseHandler_1.default)(res, user_1.USER_S_0002, Object.assign(Object.assign({}, userDetails), { password: undefined, role: userDetails.role.label }));
}));
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 20, searchString, } = req.query;
    let whereClause = {};
    if (searchString) {
        whereClause = {
            OR: [
                {
                    name: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
    const skip = (+page - 1) * +pageSize;
    const userList = (yield db_1.default.user.findMany({
        take: +pageSize,
        skip,
        where: Object.assign({ isAdmin: false }, whereClause),
        include: {
            role: true,
        },
    })).map((obj) => (Object.assign(Object.assign({}, obj), { role: obj.role.label })));
    const userCount = yield db_1.default.user.count({ where: whereClause });
    const totalQueryCount = yield db_1.default.user.count();
    const result = {
        list: userList,
        meta: {
            totalCount: userCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, user_1.USER_S_0002, result);
}));
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.userIdValidator, req.params);
    yield (0, validations_1.default)(validation.userUpdateValidator, req.body);
    const { userId } = req.params;
    const { address, email, name, phone, roleId } = req.body;
    const userDetails = yield db_1.default.user.findFirst({
        where: {
            userId,
        },
    });
    let flag = 0, password, encryptPassword;
    if (!userDetails) {
        throw new AppError_1.default(user_1.USER_E_0001);
    }
    if (email) {
        const emailExists = yield db_1.default.user.findFirst({
            where: {
                email: email.toLowerCase(),
                userId: {
                    not: userId,
                },
            },
        });
        if (emailExists)
            throw new AppError_1.default(user_1.USER_E_0002, undefined, null, true);
        flag = 1;
        password = helper_1.default.passwordGenerator();
        encryptPassword = bcrypt_1.default.hashSync(password, const_1.SALT_ROUND);
    }
    const updateUser = yield db_1.default.user.update({
        where: {
            userId,
        },
        data: {
            address,
            email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
            name,
            phone,
            roleId,
            password: encryptPassword,
        },
    });
    (0, responseHandler_1.default)(res, user_1.USER_S_0002, Object.assign(Object.assign({}, updateUser), { password: undefined }));
    if (flag === 1) {
        const html = `email : ${updateUser.email}, password : ${password} `;
        yield (0, nodeMailer_1.sendEmailToCustomer)(updateUser.email, const_1.emailConfig.SUBJECT, html);
    }
}));
