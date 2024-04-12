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
exports.getCustomerImages = exports.deleteCustomer = exports.updateCustomer = exports.getCustomer = exports.getAdvanceCustomerList = exports.getBasicCustomerList = exports.uploadCustomerImage = exports.uploadAadharImage = exports.uploadPanImage = exports.newCustomer = void 0;
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
    const { name, email, phone1, phone2, city, pincode, isMarried, dob, state, address, } = req.body;
    const phoneExists = yield db_1.default.customer.findFirst({
        where: {
            phone1,
        },
    });
    if (phoneExists)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0002);
    else {
        const createCustomer = yield db_1.default.customer.create({
            data: {
                address,
                city: city || '',
                pincode: pincode || '',
                state: state || '',
                name,
                phone1,
                phone2,
                dob,
                isMarried,
                email,
            },
        });
        return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0001, createCustomer);
    }
}));
exports.uploadPanImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    let panImage;
    const fetchPanImage = yield db_1.default.customerImage.findFirst({
        where: {
            customerId,
            type: 'PAN',
        },
    });
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        if (fetchPanImage) {
            const key = fetchPanImage.imageUrl.split('/').pop() || '';
            yield (0, s3_1.deleteImage)(key);
            yield prisma.customerImage.deleteMany({
                where: {
                    customerId,
                    type: 'PAN',
                },
            });
        }
        panImage = yield prisma.customerImage.create({
            data: {
                type: 'PAN',
                imageUrl,
                customerId,
            },
        });
    }));
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0005, panImage);
}));
exports.uploadAadharImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const aadharFrontImageUrl = ((_c = (_b = req.files) === null || _b === void 0 ? void 0 : _b['aadharImageFront']) === null || _c === void 0 ? void 0 : _c.map((image) => ({
        imageUrl: image.location,
        type: 'AADHAR_FRONT',
        customerId,
    }))) || [];
    const aadharRearImageUrl = ((_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d['aadharImageRear']) === null || _e === void 0 ? void 0 : _e.map((image) => ({
        imageUrl: image.location,
        type: 'AADHAR_REAR',
        customerId,
    }))) || [];
    const aadharImages = yield db_1.default.customerImage.findMany({
        where: {
            customerId,
            type: {
                in: ['AADHAR_REAR', 'AADHAR_FRONT'],
            },
        },
    });
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _f, _g;
        const deleteWhereClause = {
            customerId: '',
            type: {
                in: [],
            },
        };
        if (aadharFrontImageUrl === null || aadharFrontImageUrl === void 0 ? void 0 : aadharFrontImageUrl.length) {
            const aadharFront = aadharImages.find((obj) => obj.type === 'AADHAR_FRONT');
            if (aadharFront) {
                const key = aadharFront.imageUrl.split('/').pop() || '';
                yield (0, s3_1.deleteImage)(key);
                deleteWhereClause.customerId = customerId;
                (_f = deleteWhereClause.type) === null || _f === void 0 ? void 0 : _f.in.push('AADHAR_FRONT');
            }
        }
        if (aadharRearImageUrl === null || aadharRearImageUrl === void 0 ? void 0 : aadharRearImageUrl.length) {
            const aadharRear = aadharImages.find((obj) => obj.type === 'AADHAR_REAR');
            if (aadharRear) {
                const key = aadharRear.imageUrl.split('/').pop() || '';
                yield (0, s3_1.deleteImage)(key);
                deleteWhereClause.customerId = customerId;
                (_g = deleteWhereClause.type) === null || _g === void 0 ? void 0 : _g.in.push('AADHAR_REAR');
            }
        }
        if (deleteWhereClause.customerId) {
            yield prisma.customerImage.deleteMany({
                where: deleteWhereClause,
            });
        }
        yield prisma.customerImage.createMany({
            data: [...aadharFrontImageUrl, ...aadharRearImageUrl],
        });
    }));
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0006, [
        ...aadharFrontImageUrl,
        ...aadharRearImageUrl,
    ]);
}));
exports.uploadCustomerImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    let customerImages;
    const customerImage = (_k = (_j = (_h = req.files) === null || _h === void 0 ? void 0 : _h['customerImage']) === null || _j === void 0 ? void 0 : _j.map((image) => ({
        imageUrl: image.location,
        type: 'PHOTO',
        customerId,
    }))) === null || _k === void 0 ? void 0 : _k[0];
    const fetchCustomerImages = yield db_1.default.customerImage.findFirst({
        where: {
            customerId,
            type: 'PHOTO',
        },
    });
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        if (fetchCustomerImages) {
            const key = fetchCustomerImages.imageUrl.split('/').pop() || '';
            yield (0, s3_1.deleteImage)(key);
            yield prisma.customerImage.deleteMany({
                where: {
                    customerId,
                    type: 'PHOTO',
                },
            });
        }
        customerImages = yield prisma.customerImage.create({
            data: customerImage,
        });
    }));
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0007, customerImages);
}));
exports.getBasicCustomerList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const searchString = req.query.searchString;
    let whereClause;
    if (searchString) {
        whereClause = {
            OR: [
                {
                    phone1: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    phone1: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
    const fetchCustomerList = (_l = (yield db_1.default.customer.findMany({
        where: Object.assign(Object.assign({}, whereClause), { isDelete: false }),
    }))) === null || _l === void 0 ? void 0 : _l.map((customer) => {
        return {
            customerId: customer.customerId,
            name: customer.name,
            phone1: customer.phone1,
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
                    phone1: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    phone1: {
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
            where: Object.assign(Object.assign({}, whereClause), { isDelete: false }),
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
            isDelete: false,
        },
        include: {
            customerImage: true,
        },
    });
    if (!fetchCustomer)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0002, fetchCustomer);
}));
exports.updateCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateCustomerValidator, req.body);
    const customerId = req.params.customerId;
    const { name, email, phone1, address, isMarried, dob, city, phone2, pincode, state, } = req.body;
    const fetchCustomer = yield db_1.default.customer.findFirst({
        where: {
            customerId,
            isDelete: false,
        },
        include: {
            customerImage: true,
        },
    });
    if (!fetchCustomer)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    else {
        const phoneExists = yield db_1.default.customer.findFirst({
            where: {
                phone1,
                NOT: {
                    customerId,
                },
            },
        });
        if (phoneExists) {
            throw new AppError_1.default(customer_1.CUSTOMER_E_0002);
        }
        else {
            const updatedCustomer = yield db_1.default.customer.update({
                where: {
                    customerId,
                },
                data: {
                    address,
                    city,
                    name,
                    phone1,
                    phone2,
                    pincode,
                    state,
                    email,
                    dob,
                    isMarried,
                },
                include: {
                    customerImage: true,
                },
            });
            return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0004, updatedCustomer);
        }
    }
}));
exports.deleteCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const customerData = yield db_1.default.customer.findFirst({
        where: {
            customerId,
            isDelete: false,
        },
    });
    if (!customerData)
        throw new AppError_1.default(customer_1.CUSTOMER_E_0001);
    yield db_1.default.customer.update({
        where: {
            customerId,
        },
        data: {
            isDelete: true,
        },
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0009);
}));
exports.getCustomerImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.customerIdValidator, req.params);
    const { customerId } = req.params;
    const customerImages = yield db_1.default.customerImage.findMany({
        where: {
            customerId,
        },
    });
    return (0, responseHandler_1.default)(res, customer_1.CUSTOMER_S_0010, customerImages);
}));
