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
exports.validateAccessToken = exports.setNewPassword = exports.resetEmailOtpValidation = exports.resetRequestEmailOTP = exports.login = exports.register = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const auth_1 = require("../config/responseCodes/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const const_1 = require("../config/const");
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/auth.validator"));
const generalValidation = __importStar(require("../validations/_general.validator"));
const helper_1 = __importDefault(require("../utils/helper"));
const auth_service_1 = require("../services/auth.service");
const nodeMailer_1 = require("../utils/nodeMailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const general_1 = require("../config/responseCodes/general");
exports.register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, validations_1.default)(validation.registerValidator, req.body);
    const { email, password, phone, address, name } = req.body;
    const emailExists = yield db_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (emailExists) {
        throw new AppError_1.default(auth_1.AUTH_E_0002);
    }
    else {
        const encryptedPassword = bcrypt_1.default.hashSync(password, +const_1.SALT_ROUND);
        const allPermission = (_a = (yield db_1.default.permission.findMany())) === null || _a === void 0 ? void 0 : _a.map((permission) => ({
            permissionId: permission.permissionId,
        }));
        const newUser = yield db_1.default.user.create({
            data: {
                name,
                email,
                password: encryptedPassword,
                phone,
                role: {
                    create: {
                        label: const_1.ADMIN,
                        value: const_1.ADMIN.toUpperCase(),
                        permission: { connect: allPermission },
                    },
                },
                address,
            },
        });
        return (0, responseHandler_1.default)(res, auth_1.AUTH_S_0001, Object.assign(Object.assign({}, newUser), { password: undefined }));
    }
}));
exports.login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.loginValidator, req.body);
    const { email, password } = req.body;
    const userExists = yield db_1.default.user.findFirst({
        where: {
            email,
        },
        include: {
            role: {
                include: {
                    permission: true,
                },
            },
        },
    });
    if (!userExists) {
        throw new AppError_1.default(auth_1.AUTH_E_0001);
    }
    else {
        const passwordIsValid = bcrypt_1.default.compareSync(password, userExists.password);
        if (!passwordIsValid) {
            throw new AppError_1.default(auth_1.AUTH_E_0001);
        }
        else {
            const tokenObj = {
                email,
                userId: userExists.userId,
                isAdmin: userExists.isAdmin,
                role: userExists.role.label,
                permissions: userExists.role.permission.map((p) => p.value),
            };
            const accessToken = helper_1.default.accessToken(tokenObj);
            return (0, responseHandler_1.default)(res, auth_1.AUTH_S_0002, Object.assign(Object.assign({}, userExists), { password: undefined, permissions: userExists.role.permission.map((p) => p.value), role: userExists.role.label, accessToken }));
        }
    }
}));
exports.resetRequestEmailOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.emailIdValidator, req.params);
    const email = req.params.email.toLowerCase();
    const userExists = yield db_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!userExists) {
        throw new AppError_1.default(auth_1.AUTH_E_0003);
    }
    else {
        yield (0, auth_service_1.emailOtpRequest)(email);
        const otp = helper_1.default.otpGenerator();
        yield db_1.default.otp.create({
            data: {
                otp,
                email,
                expiryTime: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        const mailtmp = `Your otp is <strong>${otp}</strong>`;
        (0, responseHandler_1.default)(res, auth_1.AUTH_S_0003, {
            isOtpSent: true,
        });
        yield (0, nodeMailer_1.sendEmailToCustomer)(email, const_1.emailConfig.OTP_SUBJECT, mailtmp);
    }
}));
exports.resetEmailOtpValidation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.emailOtpValidator, req.body);
    const { email, otp } = req.body;
    const emailLowerCase = email.toLowerCase();
    yield (0, auth_service_1.emailOtpValidate)(emailLowerCase, otp);
    const accessToken = helper_1.default.accessToken({
        email: emailLowerCase,
    });
    return (0, responseHandler_1.default)(res, auth_1.AUTH_S_0004, {
        emailOtpToken: accessToken,
        email: emailLowerCase,
    });
}));
exports.setNewPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.changePasswordValidator, req.body);
    const { email, password, emailOtpToken } = req.body;
    const emailLowerCase = email.toLowerCase();
    const { email: decodedEmail } = (jsonwebtoken_1.default.verify(emailOtpToken, const_1.jwtAccessToken.SECRET_KEY));
    if (decodedEmail !== emailLowerCase) {
        throw new AppError_1.default(auth_1.AUTH_E_0001);
    }
    const userExists = yield db_1.default.user.findFirst({
        where: { email: emailLowerCase },
    });
    if (!userExists) {
        throw new AppError_1.default(auth_1.AUTH_E_0007);
    }
    else {
        // password encryption using bcrypt
        const salt = bcrypt_1.default.genSaltSync(+const_1.SALT_ROUND);
        const encryptedPassword = bcrypt_1.default.hashSync(password, salt);
        const isUpdated = yield db_1.default.user.update({
            where: {
                userId: userExists.userId,
            },
            data: {
                password: encryptedPassword,
            },
        });
        if (!isUpdated) {
            throw new AppError_1.default(auth_1.AUTH_E_0008);
        }
        return (0, responseHandler_1.default)(res, auth_1.AUTH_S_0005, { email });
    }
}));
exports.validateAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(general_1.GENERAL_E_0007);
    }
    const userTokenDetails = req.user;
    const userDetails = yield db_1.default.user.findFirst({
        where: {
            userId: userTokenDetails.userId,
        },
        include: {
            role: {
                include: {
                    permission: true,
                },
            },
        },
    });
    if (!userDetails)
        throw new AppError_1.default(general_1.GENERAL_E_0010);
    const tokenPayload = {
        email: userTokenDetails.email,
        isAdmin: userDetails.isAdmin,
        role: userDetails.role.label,
        userId: userTokenDetails.userId,
        permissions: userDetails.role.permission.map((permission) => permission.value),
    };
    const newAccessToken = helper_1.default.accessToken(tokenPayload);
    return (0, responseHandler_1.default)(res, auth_1.AUTH_S_0006, Object.assign(Object.assign({}, userDetails), { accessToken: newAccessToken }));
}));
