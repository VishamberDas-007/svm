"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(res, message, result, isNotify) {
        super();
        this.statusCode = res.statusCode;
        this.type = res.type;
        this.code = res.code;
        this.isNotify = isNotify || res.isNotify;
        this.message = message || res.message;
        this.result = result || null;
    }
}
exports.default = AppError;
