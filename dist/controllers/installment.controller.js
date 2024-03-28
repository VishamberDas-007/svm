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
exports.installmentList = exports.deleteInstallment = exports.fetchBookingInstallmentDetails = exports.updateInstallmentDetails = exports.fetchInstallmentDetails = exports.createInstallment = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const installment_service_1 = require("../services/installment.service");
const db_1 = __importDefault(require("../db"));
const booking_service_1 = require("../services/booking.service");
const AppError_1 = __importDefault(require("../utils/AppError"));
const installment_1 = require("../config/responseCodes/installment");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/installment.validator"));
const generalValidation = __importStar(require("../validations/_general.validator"));
// import { TRedisData } from './types/booking'
// import { getValueInRedis, setValueInRedis } from '../redis/config'
exports.createInstallment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createInstallmentValidator, req.body);
    // proper upiId validation, correct account number validation
    const { amount, bookingId, data } = req.body;
    let installmentNo = yield (0, installment_service_1.getInstallmentCount)(bookingId);
    const bookingDetails = yield (0, booking_service_1.getBookingDetails)(bookingId);
    let newInstallment, paymentDetails;
    let bookingUpdateData;
    const bookingRemainAmt = bookingDetails.remainAmt - +(+amount * data.length);
    if (!bookingDetails.remainAmt)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0001);
    else if (bookingRemainAmt < 0)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0003);
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            for (var _d = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _a = data_1_1.done, !_a;) {
                _c = data_1_1.value;
                _d = false;
                try {
                    const iterator = _c;
                    newInstallment = yield prisma.installment.create({
                        data: {
                            amount: +amount,
                            bookingId,
                            installmentNo,
                            paymentType: iterator.paymentType,
                            penalty: iterator.penalty,
                        },
                    });
                    ++installmentNo;
                    if (iterator.paymentType === 'BANK_TRANSFER') {
                        paymentDetails = yield prisma.iBankPayment.create({
                            data: {
                                accountNumber: iterator.accountNumber || '',
                                amount,
                                bankName: iterator.bankName || '',
                                installmentId: newInstallment.installmentId,
                            },
                        });
                    }
                    else if (iterator.paymentType === 'CHEQUE') {
                        paymentDetails = yield prisma.iChequePayment.create({
                            data: {
                                amount,
                                bankName: iterator.bankName || '',
                                chequeNumber: iterator.chequeNumber || '',
                                installmentId: newInstallment.installmentId,
                            },
                        });
                    }
                    else if (iterator.paymentType === 'UPI') {
                        paymentDetails = yield prisma.iUpiPayment.create({
                            data: {
                                upiId: iterator.upiId || '',
                                amount,
                                installmentId: newInstallment.installmentId,
                            },
                        });
                    }
                    else {
                        paymentDetails = yield prisma.iCashPayment.create({
                            data: {
                                amount,
                                installmentId: newInstallment.installmentId,
                            },
                        });
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = data_1.return)) yield _b.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!bookingRemainAmt) {
            bookingUpdateData = {
                status: 'COMPLETED',
            };
            // need to check the transaction time if exceeded then need to place the redis outside the transaction
            // uncomment on remote redis
            /*                const date = bookingDetails.createdAt.getDate()

            const redisDetails: TRedisData[] = JSON.parse(
                JSON.stringify((await getValueInRedis(`${date}`)) || [])
            )

            const bookingDataIndexToDelete = redisDetails.findIndex(
                (obj) => obj.bookingId === bookingDetails.bookingId
            )

            redisDetails.splice(bookingDataIndexToDelete, 1)

            await setValueInRedis(date, JSON.stringify(redisDetails))*/
        }
        yield prisma.booking.update({
            where: {
                bookingId,
            },
            data: Object.assign({ remainAmt: bookingDetails.remainAmt - +amount * data.length }, bookingUpdateData),
        });
    }));
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0001, Object.assign(Object.assign({}, newInstallment), paymentDetails));
}));
exports.fetchInstallmentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.installmentIdValidator, req.params);
    const { installmentId } = req.params;
    const getInstallmentDetails = yield db_1.default.installment.findFirst({
        where: { installmentId, isDelete: false },
        include: {
            bankPayment: true,
            cashPayment: true,
            chequePayment: true,
            upiPayment: true,
            booking: {
                include: {
                    customer: true,
                    project: true,
                },
            },
        },
    });
    if (!getInstallmentDetails)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0002);
    const result = Object.assign(Object.assign({}, getInstallmentDetails), { customer: getInstallmentDetails.booking.customer, plotNo: getInstallmentDetails.booking.plotNo, projectLogo: getInstallmentDetails.booking.project.logoUrl, booking: undefined });
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0002, result);
}));
exports.updateInstallmentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.installmentIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateInstallmentValidator, req.body);
    const { installmentId } = req.params;
    const { amount, bookingId, paymentType: updatePaymentType, accountNumber, bankName, chequeNumber, penalty, upiId, } = req.body;
    let paymentId, updateInstallment;
    const installmentDetailExists = yield db_1.default.installment.findFirst({
        where: { installmentId, isDelete: false },
        include: {
            bankPayment: true,
            cashPayment: true,
            chequePayment: true,
            upiPayment: true,
        },
    });
    if (!installmentDetailExists)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0002);
    const { bankPayment, cashPayment, chequePayment, upiPayment, paymentType: existPaymentType, } = installmentDetailExists;
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        if (existPaymentType !== updatePaymentType) {
            if (existPaymentType === 'BANK_TRANSFER') {
                paymentId = bankPayment[0].paymentId;
                yield prisma.iBankPayment.delete({
                    where: {
                        paymentId,
                    },
                });
            }
            else if (existPaymentType === 'CASH') {
                paymentId = cashPayment[0].paymentId;
                yield prisma.iCashPayment.delete({
                    where: {
                        paymentId,
                    },
                });
            }
            else if (existPaymentType === 'CHEQUE') {
                paymentId = chequePayment[0].paymentId;
                yield prisma.iChequePayment.delete({
                    where: {
                        paymentId,
                    },
                });
            }
            else if (existPaymentType === 'UPI') {
                paymentId = upiPayment[0].paymentId;
                yield prisma.iUpiPayment.delete({
                    where: {
                        paymentId,
                    },
                });
            }
            if (updatePaymentType === 'BANK_TRANSFER') {
                yield prisma.iBankPayment.create({
                    data: {
                        accountNumber,
                        amount,
                        bankName,
                        installmentId,
                    },
                });
            }
            else if (updatePaymentType === 'CASH') {
                yield prisma.iCashPayment.create({
                    data: {
                        amount,
                        installmentId,
                    },
                });
            }
            else if (updatePaymentType === 'CHEQUE') {
                yield prisma.iChequePayment.create({
                    data: {
                        amount,
                        bankName,
                        chequeNumber,
                        installmentId,
                    },
                });
            }
            else if (updatePaymentType === 'UPI') {
                yield prisma.iUpiPayment.create({
                    data: {
                        amount,
                        upiId,
                        installmentId,
                    },
                });
            }
        }
        updateInstallment = yield prisma.installment.update({
            where: {
                installmentId,
            },
            data: {
                amount: +amount,
                bookingId,
                penalty,
                paymentType: updatePaymentType,
            },
        });
    }));
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0003, updateInstallment);
}));
exports.fetchBookingInstallmentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.bookingIdValidator, req.params);
    const { bookingId } = req.params;
    const installmentNo = yield (0, installment_service_1.getInstallmentCount)(bookingId);
    const bookingDetails = yield db_1.default.booking.findFirst({
        where: {
            bookingId,
            isDelete: false,
        },
        include: {
            customer: true,
            project: true,
        },
    });
    if (!bookingDetails)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0004);
    const formatCustomerData = bookingDetails.customer.map((customer) => ({
        name: customer.name,
        customerId: customer.customerId,
    }));
    // TODO: Add the address of project and plot no of the booking in response
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0002, {
        installmentAmt: bookingDetails.installmentAmt,
        installmentNo,
        address1: bookingDetails.project.address1 || '',
        address2: bookingDetails.project.address2 || '',
        plotNo: bookingDetails.plotNo,
        customer: formatCustomerData,
    });
}));
exports.deleteInstallment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.installmentIdValidator, req.params);
    const { installmentId } = req.params;
    const installmentDetails = yield db_1.default.installment.findFirst({
        where: {
            installmentId,
            isDelete: false,
        },
    });
    if (!installmentDetails)
        throw new AppError_1.default(installment_1.INSTALLMENT_E_0001);
    yield db_1.default.installment.update({
        where: {
            installmentId,
        },
        data: {
            isDelete: true,
        },
    });
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0004);
}));
exports.installmentList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 10 } = req.query;
    let totalCount = 0, totalQueryCount = 0;
    const list = (yield db_1.default.installment.findMany({
        include: {
            booking: {
                include: {
                    customer: true,
                },
            },
        },
    })).map((obj) => (Object.assign(Object.assign({}, obj), { customer: obj.booking.customer, booking: undefined })));
    totalCount = yield db_1.default.installment.count();
    totalQueryCount = yield db_1.default.installment.count();
    const result = {
        list: list,
        meta: {
            page: +page,
            pageSize: +pageSize,
            totalCount,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, installment_1.INSTALLMENT_S_0005, result);
}));
