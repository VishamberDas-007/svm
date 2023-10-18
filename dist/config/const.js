"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = exports.nodeMailerCredentials = exports.awsConfig = exports.SALT_ROUND = exports.ADMIN = exports.jwtRefreshToken = exports.jwtAccessToken = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || '';
exports.jwtAccessToken = {
    SECRET_KEY: process.env.AT_SECRET_KEY || 'Das@123',
    EXPIRE: process.env.AT_EXPIRE || '1d',
};
exports.jwtRefreshToken = {
    SECRET_KEY: process.env.RT_SECRET_KEY || 'Das@132!3(7',
    EXPIRE: process.env.RT_EXPIRE || '10d',
};
exports.ADMIN = 'Admin';
exports.SALT_ROUND = process.env.SALT_ROUND || '10';
exports.awsConfig = {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
};
exports.nodeMailerCredentials = {
    USER_EMAIL: 'developerssvm18@gmail.com',
    APP_PASSWORD: process.env.APP_PASSWORD || 'wkfjbzktzsiyibon',
    TEMP_USER_EMAIL: 'sanjayofficial755@gmail.com',
};
exports.emailConfig = {
    SUBJECT: 'SVM (Credentials)',
    OTP_SUBJECT: 'SVM (OTP)',
};
