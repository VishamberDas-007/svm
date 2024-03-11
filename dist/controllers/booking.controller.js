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
exports.updateBooking = exports.getBooking = exports.getAllBookings = exports.createBooking = void 0;
const db_1 = __importDefault(require("../db"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/booking.validator"));
const booking_1 = require("../config/responseCodes/booking");
const AppError_1 = __importDefault(require("../utils/AppError"));
// import { getValueInRedis, setValueInRedis } from '../redis/config'
const _general_service_1 = require("../services/_general.service");
const booking_service_1 = require("../services/booking.service");
exports.createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createBookingValidator, req.body);
    const { address1, address2, adminAccountId, area, customerId, installmentAmt, installmentCount, paidAmt, paymentStatus, paymentType, pincode, projectId, remainAmt, totalAmt, accountNo, bankName, chequeNo, upiId, referralId, } = req.body;
    const projectData = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
        include: {
            booking: true,
        },
    });
    if (!projectData)
        throw new AppError_1.default(booking_1.BOOKING_E_0002);
    const areaExists = (0, booking_service_1.checkIfProjectAreaExists)(projectData, area);
    if (!areaExists)
        throw new AppError_1.default(booking_1.BOOKING_E_0003);
    let newBooking, paymentDetails;
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        newBooking = yield prisma.booking.create({
            data: {
                projectId,
                address1,
                address2,
                pincode,
                area: +area,
                totalAmt: +totalAmt,
                paidAmt: +paidAmt,
                remainAmt: +remainAmt,
                installmentAmt: +installmentAmt,
                paymentType,
                paymentStatus,
                customerId,
                adminAccountId,
                installmentCount: +installmentCount,
                referralId,
            },
        });
        if (paymentType === 'CHEQUE') {
            paymentDetails = yield prisma.chequePayment.create({
                data: {
                    amount: paidAmt,
                    bookingId: newBooking.bookingId,
                    bankName,
                    chequeNumber: chequeNo,
                },
            });
        }
        else if (paymentType === 'UPI') {
            paymentDetails = yield prisma.upiPayment.create({
                data: {
                    bookingId: newBooking.bookingId,
                    amount: paidAmt,
                    upiId,
                },
            });
        }
        else if (paymentType === 'BANK_TRANSFER') {
            paymentDetails = yield prisma.bankPayment.create({
                data: {
                    accountNumber: accountNo,
                    amount: paidAmt,
                    bankName,
                    bookingId: newBooking.bookingId,
                },
            });
        }
        else {
            paymentDetails = yield prisma.cashPayment.create({
                data: {
                    amount: paidAmt,
                    bookingId: newBooking.bookingId,
                },
            });
        }
    }));
    if (newBooking) {
        const customerDetails = yield (0, _general_service_1.fetchCustomerDetails)(customerId);
        const date = newBooking.createdAt.getDate();
        // uncomment on remote redis
        // let redisDetails: TRedisData[] = JSON.parse(
        //     JSON.stringify((await getValueInRedis(`${date}`)) || [])
        // )
        // redisDetails = [
        //     ...redisDetails,
        //     {
        //         bookingId: newBooking.bookingId,
        //         amount: installmentAmt,
        //         email: customerDetails?.email || '',
        //         name:
        //             customerDetails?.firstName +
        //             ' ' +
        //             customerDetails?.lastName,
        //         phone: customerDetails?.phone || '',
        //     },
        // ]
        // await setValueInRedis(date, JSON.stringify(redisDetails))
    }
    return (0, responseHandler_1.default)(res, booking_1.BOOKING_S_0001, Object.assign(Object.assign({}, newBooking), { accountNo,
        bankName,
        chequeNo,
        upiId, paymentId: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.paymentId }));
}));
exports.getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const { page = 1, pageSize = 20, searchString, paymentStatus, paymentType, projectIds, } = req.query;
    const result = [];
    let whereClause = {};
    if (searchString) {
        whereClause = {
            OR: [
                {
                    customer: {
                        firstName: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    customer: {
                        firstName: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    customer: {
                        lastName: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    address2: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
    if (paymentStatus) {
        const array = paymentStatus.split(',');
        whereClause = Object.assign(Object.assign({}, whereClause), { paymentStatus: {
                in: array,
            } });
    }
    if (paymentType) {
        const array = paymentStatus.split(',');
        whereClause = Object.assign(Object.assign({}, whereClause), { paymentType: {
                in: array,
            } });
    }
    if (projectIds) {
        const array = projectIds.split(',');
        whereClause = Object.assign(Object.assign({}, whereClause), { projectId: {
                in: array,
            } });
    }
    const skip = (+page - 1) * +pageSize;
    let totalCount = 0, totalQueryCount = 0, bookingList = [];
    bookingList = yield db_1.default.booking.findMany({
        take: +pageSize,
        skip,
        where: whereClause,
        include: {
            project: true,
            customer: true,
            adminAccount: true,
        },
        // TODO: pass where clause in the below query
        // where:,
        orderBy: {
            createdAt: 'desc',
        },
    });
    totalCount = yield db_1.default.booking.count();
    totalQueryCount = yield db_1.default.booking.count({
        where: whereClause,
    });
    try {
        for (var _d = true, bookingList_1 = __asyncValues(bookingList), bookingList_1_1; bookingList_1_1 = yield bookingList_1.next(), _a = bookingList_1_1.done, !_a;) {
            _c = bookingList_1_1.value;
            _d = false;
            try {
                const booking = _c;
                let paymentDetails;
                if (booking.paymentType === 'BANK_TRANSFER')
                    paymentDetails = yield db_1.default.bankPayment.findFirst({
                        where: {
                            bookingId: booking.bookingId,
                        },
                    });
                else if (booking.paymentType === 'CASH')
                    paymentDetails = yield db_1.default.cashPayment.findFirst({
                        where: {
                            bookingId: booking.bookingId,
                        },
                    });
                else if (booking.paymentType === 'UPI')
                    paymentDetails = yield db_1.default.upiPayment.findFirst({
                        where: {
                            bookingId: booking.bookingId,
                        },
                    });
                else if (booking.paymentType === 'CHEQUE')
                    paymentDetails = yield db_1.default.chequePayment.findFirst({
                        where: {
                            bookingId: booking.bookingId,
                        },
                    });
                result.push(Object.assign(Object.assign(Object.assign(Object.assign({}, booking), { projectName: booking.project.name, customerName: booking.customer.firstName.concat(' ', booking.customer.lastName), adminBankName: booking.adminAccount.bankName }), paymentDetails), { adminAccount: undefined, project: undefined, customer: undefined, amount: undefined }));
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = bookingList_1.return)) yield _b.call(bookingList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const response = {
        list: result,
        meta: {
            page: +page,
            pageSize: +pageSize,
            totalCount,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, booking_1.BOOKING_S_0002, response);
}));
exports.getBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.bookingIdValidator, req.params);
    const bookingId = req.params.bookingId;
    const fetchBooking = yield db_1.default.booking.findFirst({
        where: {
            bookingId,
        },
        include: {
            adminAccount: true,
            project: true,
            customer: {
                include: {
                    customerImage: true,
                },
            },
        },
    });
    if (!fetchBooking)
        throw new AppError_1.default(booking_1.BOOKING_E_0001);
    let paymentDetails;
    if (fetchBooking.paymentType === 'BANK_TRANSFER')
        paymentDetails = yield db_1.default.bankPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        });
    else if (fetchBooking.paymentType === 'CASH')
        paymentDetails = yield db_1.default.cashPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        });
    else if (fetchBooking.paymentType === 'UPI')
        paymentDetails = yield db_1.default.upiPayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        });
    else if (fetchBooking.paymentType === 'CHEQUE')
        paymentDetails = yield db_1.default.chequePayment.findFirst({
            where: {
                bookingId: fetchBooking.bookingId,
            },
        });
    return (0, responseHandler_1.default)(res, booking_1.BOOKING_S_0003, Object.assign(Object.assign(Object.assign(Object.assign({}, fetchBooking), { adminBankName: fetchBooking.adminAccount.bankName, projectName: fetchBooking.project.name, customerName: fetchBooking.customer.firstName.concat(' ', fetchBooking.customer.lastName), customerImage: fetchBooking.customer.customerImage, phone: fetchBooking.customer.phone }), paymentDetails), { adminAccount: undefined, project: undefined, customer: undefined }));
}));
exports.updateBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.bookingIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateBookingValidator, req.body);
    const { bookingId } = req.params;
    const { address1, address2, adminAccountId, area, customerId, installmentAmt, installmentCount, paymentStatus, paymentType, pincode, projectId, remainAmt, totalAmt, accountNo, bankName, chequeNo, upiId, paymentId, referralId, } = req.body;
    let { paidAmt } = req.body;
    paidAmt = !isNaN(+paidAmt) ? +paidAmt : undefined;
    let updatedBookingDetails;
    const bookingExists = yield db_1.default.booking.findFirst({
        where: {
            bookingId,
        },
    });
    if (!bookingExists)
        throw new AppError_1.default(booking_1.BOOKING_E_0001);
    else {
        let paymentDetails = {};
        yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            if (paymentType === bookingExists.paymentType) {
                if (paymentType === 'BANK_TRANSFER') {
                    paymentDetails = {
                        bankPayment: {
                            update: {
                                where: {
                                    paymentId,
                                },
                                data: {
                                    accountNumber: accountNo,
                                    amount: paidAmt,
                                    bankName,
                                },
                            },
                        },
                    };
                }
                else if (paymentType === 'CASH') {
                    paymentDetails = {
                        cashPayment: {
                            update: {
                                where: { paymentId },
                                data: { amount: paidAmt },
                            },
                        },
                    };
                }
                else if (paymentType === 'CHEQUE') {
                    paymentDetails = {
                        chequePayment: {
                            update: {
                                where: {
                                    paymentId,
                                },
                                data: {
                                    amount: paidAmt,
                                    bankName,
                                    chequeNumber: chequeNo,
                                },
                            },
                        },
                    };
                }
                else {
                    paymentDetails = {
                        where: {
                            paymentId,
                        },
                        data: {
                            amount: paidAmt,
                            upiId,
                        },
                    };
                }
            }
            else {
                if (bookingExists.paymentType === 'BANK_TRANSFER') {
                    paymentDetails = {
                        bankPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    };
                }
                else if (bookingExists.paymentType === 'CASH') {
                    paymentDetails = {
                        cashPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    };
                }
                else if (bookingExists.paymentType === 'CHEQUE') {
                    paymentDetails = {
                        chequePayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    };
                }
                else {
                    paymentDetails = {
                        upiPayment: {
                            delete: {
                                paymentId,
                            },
                        },
                    };
                }
            }
            updatedBookingDetails = yield prisma.booking.update({
                where: {
                    bookingId,
                },
                data: Object.assign({ address1,
                    address2,
                    adminAccountId, area: +area, customerId, installmentAmt: +installmentAmt, installmentCount: +installmentCount, paidAmt: paidAmt, paymentStatus,
                    paymentType,
                    pincode,
                    projectId, remainAmt: +remainAmt, totalAmt: +totalAmt, referralId }, paymentDetails),
            });
            if (paymentType) {
                if (paymentType === 'CHEQUE') {
                    yield prisma.chequePayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                            bankName,
                            chequeNumber: chequeNo,
                        },
                    });
                }
                else if (paymentType === 'UPI') {
                    yield prisma.upiPayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                            upiId,
                        },
                    });
                }
                else if (paymentType === 'BANK_TRANSFER') {
                    yield prisma.bankPayment.create({
                        data: {
                            bookingId,
                            accountNumber: accountNo,
                            amount: paidAmt,
                            bankName,
                        },
                    });
                }
                else {
                    yield prisma.cashPayment.create({
                        data: {
                            bookingId,
                            amount: paidAmt,
                        },
                    });
                }
            }
        }));
        return (0, responseHandler_1.default)(res, booking_1.BOOKING_S_0004, updatedBookingDetails);
    }
}));
