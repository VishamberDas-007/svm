"use strict";
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
exports.emailOtpValidate = exports.emailOtpRequest = void 0;
const auth_1 = require("../config/responseCodes/auth");
const db_1 = __importDefault(require("../db"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const emailOtpRequest = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExists = yield db_1.default.otp.findFirst({
        where: {
            email: email,
        },
    });
    if (emailExists) {
        yield db_1.default.otp.delete({
            where: {
                otpId: emailExists.otpId,
            },
        });
    }
});
exports.emailOtpRequest = emailOtpRequest;
const emailOtpValidate = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExists = yield db_1.default.otp.findFirst({
        where: {
            email: email,
        },
    });
    if (!emailExists) {
        throw new AppError_1.default(auth_1.AUTH_E_0004);
    }
    if (emailExists && new Date() > new Date(emailExists.expiryTime)) {
        throw new AppError_1.default(auth_1.AUTH_E_0005, undefined, {
            isOtpExpired: true,
        }, true);
    }
    else if (emailExists.otp !== otp) {
        throw new AppError_1.default(auth_1.AUTH_E_0006, undefined, undefined, true);
    }
    yield db_1.default.otp.delete({
        where: {
            otpId: emailExists.otpId,
        },
    });
});
exports.emailOtpValidate = emailOtpValidate;
