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
exports.updateReferral = exports.getReferral = exports.getAllReferral = exports.newReferral = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const referral_1 = require("../config/responseCodes/referral");
const validation = __importStar(require("../validations/referral.validator"));
exports.newReferral = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createReferralValidator, req.body);
    const { address, email, firstName, lastName, phone } = req.body;
    const phoneExists = yield db_1.default.referral.findFirst({
        where: {
            phone,
        },
    });
    if (phoneExists) {
        throw new AppError_1.default(referral_1.REFERRAL_E_0001);
    }
    else {
        const newReferral = yield db_1.default.referral.create({
            data: {
                address,
                email,
                firstName,
                lastName,
                phone,
            },
        });
        return (0, responseHandler_1.default)(res, referral_1.REFERRAL_S_0001, newReferral);
    }
}));
exports.getAllReferral = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 20, searchString, } = req.query;
    const skip = (+page - 1) * +pageSize;
    let fetchAllReferral = [], totalCount = 0, whereClause = {}, totalQueryCount = 0;
    if (searchString) {
        whereClause = {
            OR: [
                {
                    address: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    address: {
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
                {
                    firstName: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    firstName: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    lastName: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    phone: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        fetchAllReferral = yield prisma.referral.findMany({
            take: +pageSize,
            skip,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        });
        totalCount = yield prisma.referral.count();
        totalQueryCount = yield prisma.referral.count({
            where: whereClause,
        });
    }));
    const result = {
        list: fetchAllReferral,
        meta: {
            totalCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, referral_1.REFERRAL_S_0002, result);
}));
exports.getReferral = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.referralIdValidator, req.params);
    const referralId = req.params.referralId;
    const fetchReferral = yield db_1.default.referral.findFirst({
        where: {
            referralId,
        },
    });
    if (!fetchReferral) {
        throw new AppError_1.default(referral_1.REFERRAL_E_0002);
    }
    else {
        return (0, responseHandler_1.default)(res, referral_1.REFERRAL_S_0003, fetchReferral);
    }
}));
exports.updateReferral = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.updateReferralValidator, req.body);
    const referralId = req.params.referralId;
    const { address, email, firstName, lastName, phone } = req.body;
    const fetchReferral = yield db_1.default.referral.findFirst({
        where: {
            referralId,
        },
    });
    if (!fetchReferral) {
        throw new AppError_1.default(referral_1.REFERRAL_E_0002);
    }
    else {
        if (phone) {
            const phoneExists = yield db_1.default.referral.findFirst({
                where: {
                    phone,
                    referralId: {
                        not: referralId,
                    },
                },
            });
            if (phoneExists)
                throw new AppError_1.default(referral_1.REFERRAL_E_0001);
        }
        const updateReferral = yield db_1.default.referral.update({
            where: {
                referralId,
            },
            data: {
                address,
                email,
                firstName,
                lastName,
                phone,
            },
        });
        return (0, responseHandler_1.default)(res, referral_1.REFERRAL_S_0004, updateReferral);
    }
}));
