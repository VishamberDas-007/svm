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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.getCustomer = exports.getAdvanceCustomerList = exports.getBasicCustomerList = exports.uploadCustomerImage = exports.uploadAadharImage = exports.uploadPanImage = exports.newCustomer = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/customer.validator"));
const customer_1 = require("../config/responseCodes/customer");
const s3_1 = require("../aws/s3");
exports.newCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // const aadharImageUrls = req.files?.['aadharImages']?.map(
        //     (image: TImageUpload) => ({
        //         imageUrl: image.location,
        //         type: 'AADHAR',
        //     })
        // )
        // const panImageUrls = req.files?.['panImages']?.map(
        //     (image: TImageUpload) => ({
        //         imageUrl: image.location,
        //         type: 'PAN',
        //     })
        // )
        // const customerImageUrl = req.files?.['customerImage']?.map(
        //     (image: TImageUpload) => ({
        //         imageUrl: image.location,
        //         type: 'PHOTO',
        //     })
        // )
        const createCustomer = yield db_1.default.customer.create({
            data: {
                aadharNo,
                firstName,
                lastName,
                phone,
                email,
                // customerImage: {
                //     createMany: {
                //         data: [
                //             ...aadharImageUrls,
                //             ...panImageUrls,
                //             ...customerImageUrl,
                //         ],
                //     },
                // },
            },
            // include: {
            //     customerImage: true,
            // },
        });
        return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0001, createCustomer);
    }
}));
exports.uploadPanImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    const panImage = yield db_1.default.customerImage.create({
        data: {
            type: 'PAN',
            imageUrl,
            customerId,
        },
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0005, panImage);
}));
exports.uploadAadharImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const aadharImageUrls = (_c = (_b = req.files) === null || _b === void 0 ? void 0 : _b['aadharImages']) === null || _c === void 0 ? void 0 : _c.map((image) => ({
        imageUrl: image.location,
        type: 'AADHAR',
        customerId,
    }));
    const aadharImages = yield db_1.default.customerImage.createMany({
        data: aadharImageUrls,
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0006, aadharImages);
}));
exports.uploadCustomerImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const customerImageUrls = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d['customerImage']) === null || _e === void 0 ? void 0 : _e.map((image) => ({
        imageUrl: image.location,
        type: 'PHOTO',
        customerId,
    }));
    const customerImages = yield db_1.default.customerImage.createMany({
        data: customerImageUrls,
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0007, customerImages);
}));
exports.getBasicCustomerList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
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
    const fetchCustomerList = (_f = (yield db_1.default.customer.findMany({
        where: whereClause,
    }))) === null || _f === void 0 ? void 0 : _f.map((customer) => {
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
        include: {
            customerImage: true,
        },
    });
    if (!fetchCustomer)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    else {
        return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0002, fetchCustomer);
    }
}));
exports.updateCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, e_1, _h, _j;
    var _k, _l, _m, _o, _p, _q;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateCustomerValidator, req.body);
    const customerId = req.params.customerId;
    let aadharImageUrls = [], panImageUrls = [], customerImageUrl = [];
    const { aadharNo, firstName, email, lastName, phone } = req.body;
    const fetchCustomer = yield db_1.default.customer.findUnique({
        where: {
            customerId,
        },
        include: {
            customerImage: true,
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
            if (req.files) {
                aadharImageUrls = (_l = (_k = req.files) === null || _k === void 0 ? void 0 : _k['aadharImages']) === null || _l === void 0 ? void 0 : _l.map((image) => ({
                    imageUrl: image.location,
                    type: 'AADHAR',
                }));
                panImageUrls = (_o = (_m = req.files) === null || _m === void 0 ? void 0 : _m['panImages']) === null || _o === void 0 ? void 0 : _o.map((image) => ({
                    imageUrl: image.location,
                    type: 'PAN',
                }));
                customerImageUrl = (_q = (_p = req.files) === null || _p === void 0 ? void 0 : _p['customerImage']) === null || _q === void 0 ? void 0 : _q.map((image) => ({
                    imageUrl: image.location,
                    type: 'PHOTO',
                }));
                try {
                    for (var _r = true, _s = __asyncValues(fetchCustomer.customerImage), _t; _t = yield _s.next(), _g = _t.done, !_g;) {
                        _j = _t.value;
                        _r = false;
                        try {
                            const image = _j;
                            const fileName = image.imageUrl.split('/').pop();
                            fileName && (yield (0, s3_1.deleteImage)(fileName));
                        }
                        finally {
                            _r = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_r && !_g && (_h = _s.return)) yield _h.call(_s);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
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
                    customerImage: {
                        deleteMany: {
                            customerId,
                        },
                        createMany: {
                            data: [
                                ...aadharImageUrls,
                                ...panImageUrls,
                                ...customerImageUrl,
                            ],
                        },
                    },
                },
                include: {
                    customerImage: true,
                },
            });
            return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0004, updatedCustomer);
        }
    }
}));
