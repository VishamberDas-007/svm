"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, resCode, result, message, isNotify) => {
    const response = {
        type: resCode.type,
        code: resCode.code,
        isNotify: isNotify || resCode.isNotify,
        message: message || resCode.message,
        result: result || null,
    };
    return res.status((resCode === null || resCode === void 0 ? void 0 : resCode.statusCode) || 500).json(response);
};
