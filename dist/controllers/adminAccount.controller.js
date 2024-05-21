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
exports.deleteAccount = exports.getAccountBasicList = exports.updateAccountDetails = exports.getAdvanceAccountList = exports.getAccountDetails = exports.newAccount = void 0;
const db_1 = __importDefault(require("../db"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/adminAccount.validator"));
const adminAccount_1 = require("../config/responseCodes/adminAccount");
const AppError_1 = __importDefault(require("../utils/AppError"));
exports.newAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createAccountValidator, req.body);
    const { bankName, name, accNo } = req.body;
    const accountEcists = yield db_1.default.adminAccount.findFirst({
        where: {
            accNo,
        },
    });
    if (accountEcists)
        throw new AppError_1.default(adminAccount_1.AD_ACCOUNT_E_0002);
    else {
        const newAccount = yield db_1.default.adminAccount.create({
            data: {
                bankName,
                name,
                balance: 0,
                accNo,
            },
        });
        return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0001, newAccount);
    }
}));
exports.getAccountDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.accountIdValidator, req.params);
    const { accountId } = req.params;
    const fetchAccount = yield db_1.default.adminAccount.findFirst({
        where: {
            adminAccountId: +accountId,
        },
    });
    if (!fetchAccount)
        throw new AppError_1.default(adminAccount_1.AD_ACCOUNT_E_0001);
    else
        return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0002, fetchAccount);
}));
exports.getAdvanceAccountList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 20, searchString, } = req.query;
    const skip = (+page - 1) * +pageSize;
    let fetchAccountList = [], totalCount = 0, whereClause = {}, totalQueryCount = 0;
    if (searchString) {
        whereClause = {
            OR: [
                {
                    bankName: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    bankName: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
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
            ],
        };
    }
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        fetchAccountList = yield prisma.adminAccount.findMany({
            take: +pageSize,
            skip,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        });
        totalCount = yield prisma.adminAccount.count({ where: whereClause });
        totalQueryCount = yield prisma.adminAccount.count();
    }));
    const result = {
        list: fetchAccountList,
        meta: {
            totalCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0003, result);
}));
exports.updateAccountDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const { accNo, bankName, name } = req.body;
    const fetchAccount = yield db_1.default.adminAccount.findFirst({
        where: {
            adminAccountId: +accountId,
        },
    });
    if (!fetchAccount)
        throw new AppError_1.default(adminAccount_1.AD_ACCOUNT_E_0001);
    else {
        const updateDetails = yield db_1.default.adminAccount.update({
            where: {
                adminAccountId: +accountId,
            },
            data: {
                accNo,
                bankName,
                name,
            },
        });
        return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0004, updateDetails);
    }
}));
exports.getAccountBasicList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fetchAccountList = (_a = (yield db_1.default.adminAccount.findMany())) === null || _a === void 0 ? void 0 : _a.map((obj) => {
        return Object.assign(Object.assign({}, obj), { balance: undefined, createdAt: undefined, updatedAt: undefined });
    });
    return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0003, fetchAccountList);
}));
exports.deleteAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.accountIdValidator, req.params);
    const { accountId } = req.params;
    const fetchAccount = yield db_1.default.adminAccount.findFirst({
        where: {
            adminAccountId: +accountId,
        },
    });
    if (!fetchAccount)
        throw new AppError_1.default(adminAccount_1.AD_ACCOUNT_E_0001);
    yield db_1.default.adminAccount.update({
        where: {
            adminAccountId: +accountId,
        },
        data: {
            isDelete: true,
        },
    });
    return (0, responseHandler_1.default)(res, adminAccount_1.AD_ACCOUNT_S_0005);
}));
