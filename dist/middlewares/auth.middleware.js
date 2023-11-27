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
exports.authMiddleware = exports.adminMiddleware = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const general_1 = require("../config/responseCodes/general");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const const_1 = require("../config/const");
const db_1 = __importDefault(require("../db"));
const user_service_1 = require("../services/user.service");
exports.adminMiddleware = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { authorization } = req.headers;
    const token = (_a = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')) === null || _a === void 0 ? void 0 : _a[1];
    if (!token)
        throw new AppError_1.default(general_1.GENERAL_E_0004);
    else {
        const { email, userId } = (jsonwebtoken_1.default.verify(token, const_1.jwtAccessToken.SECRET_KEY));
        const emailExists = yield db_1.default.user.findFirst({
            where: {
                email,
                userId,
            },
        });
        if (!emailExists)
            throw new AppError_1.default(general_1.GENERAL_E_0007);
        next();
    }
}));
const authMiddleware = (requiredPermissions) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { authorization } = req.headers;
    const token = (_b = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')) === null || _b === void 0 ? void 0 : _b[1];
    if (!token) {
        throw new AppError_1.default(general_1.GENERAL_E_0004);
    }
    const decodeTokenDetails = (jsonwebtoken_1.default.verify(token, const_1.jwtAccessToken.SECRET_KEY));
    if (!decodeTokenDetails) {
        throw new AppError_1.default(general_1.GENERAL_E_0014);
    }
    const userExist = yield (0, user_service_1.userExists)(decodeTokenDetails.userId);
    if (!userExist) {
        throw new AppError_1.default(general_1.GENERAL_E_0007);
    }
    if (userExist.isAdmin) {
        req.user = decodeTokenDetails;
        next();
    }
    else {
        const permissionExists = requiredPermissions.some((permission) => decodeTokenDetails.permissions.includes(permission));
        if (!permissionExists) {
            throw new AppError_1.default(general_1.GENERAL_E_0015);
        }
        req.user = decodeTokenDetails;
        next();
    }
}));
exports.authMiddleware = authMiddleware;
