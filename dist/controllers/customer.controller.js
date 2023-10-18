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
exports.updateCustomer = exports.getCustomer = exports.getAdvanceCustomerList = exports.getBasicCustomerList = exports.newCustomer = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/customer.validator"));
const customer_1 = require("../config/responseCodes/customer");
exports.newCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    yield (0, validations_1.default)(validation.createCustomerValidator, req.body);
    const { aadharNo, firstName, email, lastName, phone } = req.body;
    const aadharExists = yield db_1.default.customer.findFirst({
        where: {
            aadharNo,
        },
    });
    if (aadharExists)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0002);
    else {
        const aadharImageUrls = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a['aadharImages']) === null || _b === void 0 ? void 0 : _b.map((image) => ({
            imageUrl: image.location,
            type: 'AADHAR',
        }));
        const panImageUrls = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c['panImage']) === null || _d === void 0 ? void 0 : _d.map((image) => ({
            imageUrl: image.location,
            type: 'PAN',
        }));
        const createCustomer = yield db_1.default.customer.create({
            data: {
                aadharNo,
                firstName,
                lastName,
                phone,
                email,
                customerImage: {
                    createMany: {
                        data: [...aadharImageUrls, panImageUrls],
                    },
                },
            },
        });
        return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0001, createCustomer);
    }
}));
exports.getBasicCustomerList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const searchString = req.query.searchString;
    let whereClause;
    if (searchString) {
        whereClause = {
            OR: [
                {
                    aadharNo: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    aadharNo: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
    const fetchCustomerList = (_e = (yield db_1.default.customer.findMany({
        where: whereClause,
    }))) === null || _e === void 0 ? void 0 : _e.map((customer) => {
        return {
            customerId: customer.customerId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            aadharNo: customer.aadharNo,
        };
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0001, fetchCustomerList);
}));
exports.getAdvanceCustomerList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 20, searchString, } = req.query;
    const skip = (+page - 1) * +pageSize;
    let fetchCustomerList = [], totalCount = 0, whereClause = {}, totalQueryCount = 0;
    if (searchString) {
        whereClause = {
            OR: [
                {
                    aadharNo: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    aadharNo: {
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
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    phone: {
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
        fetchCustomerList = yield prisma.customer.findMany({
            take: +pageSize,
            skip,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        });
        totalCount = yield prisma.customer.count();
        totalQueryCount = yield prisma.customer.count({
            where: whereClause,
        });
    }));
    const result = {
        list: fetchCustomerList,
        meta: {
            totalCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0003, result);
}));
exports.getCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const customerId = req.params.customerId;
    const fetchCustomer = yield db_1.default.customer.findFirst({
        where: {
            customerId,
        },
    });
    if (!fetchCustomer)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    else {
        return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0002, fetchCustomer);
    }
}));
exports.updateCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateCustomerValidator, req.body);
    const customerId = req.params.customerId;
    const { aadharNo, firstName, email, lastName, phone } = req.body;
    const fetchCustomer = yield db_1.default.customer.findUnique({
        where: {
            customerId,
        },
    });
    if (!fetchCustomer)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    else {
        const aadharExists = yield db_1.default.customer.findFirst({
            where: {
                aadharNo,
                NOT: {
                    customerId,
                },
            },
        });
        if (aadharExists) {
            throw new AppError_1.default(customer_1.CUSTOMER_E_0002);
        }
        else {
            const updatedCustomer = yield db_1.default.customer.update({
                where: {
                    customerId,
                },
                data: {
                    aadharNo,
                    firstName,
                    email,
                    lastName,
                    phone,
                },
            });
            return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0004, updatedCustomer);
        }
    }
}));
