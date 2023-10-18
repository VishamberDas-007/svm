"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = require("joi");
const responseHandler_1 = __importDefault(require("./responseHandler"));
const general_1 = require("../config/responseCodes/general");
const AppError_1 = __importDefault(require("./AppError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const library_1 = require("@prisma/client/runtime/library");
const db_1 = require("../config/responseCodes/db");
const axios_1 = require("axios");
exports.default = (err, req, res, next) => {
    var _a, _b;
    console.log({ err });
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': {
                return (0, responseHandler_1.default)(res, db_1.DB_E_0001);
            }
            case 'P2003': {
                return (0, responseHandler_1.default)(res, db_1.DB_E_0002);
            }
            case 'P2025': {
                return (0, responseHandler_1.default)(res, db_1.DB_E_0002);
            }
            default: {
                return (0, responseHandler_1.default)(res, db_1.DB_E_0003);
            }
        }
    }
    if (err instanceof library_1.PrismaClientRustPanicError) {
        return (0, responseHandler_1.default)(res, db_1.DB_E_0002);
    }
    if (err instanceof joi_1.ValidationError) {
        return (0, responseHandler_1.default)(res, general_1.GENERAL_E_0001, null, err.message);
    }
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return (0, responseHandler_1.default)(res, general_1.GENERAL_E_0013);
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        return (0, responseHandler_1.default)(res, general_1.GENERAL_E_0014);
    }
    if (err instanceof AppError_1.default) {
        if (((_a = err === null || err === void 0 ? void 0 : err.code) === null || _a === void 0 ? void 0 : _a.split('_')[0]) === 'TOKEN' && err.type === 'ERROR') {
            return (0, responseHandler_1.default)(res, err);
        }
        if ((err === null || err === void 0 ? void 0 : err.code) === 'LIMIT_FILE_SIZE') {
            return (0, responseHandler_1.default)(res, general_1.GENERAL_E_0004);
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return (0, responseHandler_1.default)(res, general_1.GENERAL_E_0005);
        }
        return (0, responseHandler_1.default)(res, err, err === null || err === void 0 ? void 0 : err.result);
    }
    if (err instanceof axios_1.AxiosError) {
        console.log((_b = err.response) === null || _b === void 0 ? void 0 : _b.data);
    }
    (0, responseHandler_1.default)(res, general_1.GENERAL_E_0002);
    return next();
};
