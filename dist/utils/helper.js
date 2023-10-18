"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const const_1 = require("../config/const");
const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
const emailValidator = joi_1.default.string()
    .email()
    .messages({ 'string.email': 'Invalid email type' });
const otpValidator = joi_1.default.number().min(100000).max(999999).messages({
    'number.min': 'Otp length must be 6 digits',
    'number.max': 'Otp length must be 6 digits',
});
const panNumber = joi_1.default.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .messages({
    'string.pattern.base': 'Please enter valid pan number type.',
});
const aadharValidator = joi_1.default.string()
    // .regex(/^[0-]{5}[0-9]{4}[A-Z]{1}$/)
    .regex(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/)
    .messages({
    'string.pattern.base': 'Please enter valid aadhar number type.',
});
const passwordValidator = joi_1.default.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,24}$/)
    .messages({
    'string.pattern.base': 'Password must contain a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
});
const phoneValidator = joi_1.default.string()
    .regex(/^[6-9]\d{9}$/)
    // .regex(/^(?:\s*\d\s*){10}$/)
    .messages({
    'string.pattern.base': 'Phone number must have 10 digits and should start with [6-9].',
});
const uuid = joi_1.default.string().guid({ version: 'uuidv4' });
const calculateTotalPages = (totalCount, pageSize) => {
    return totalCount ? Math.ceil(totalCount / pageSize) : 0;
};
const formatLabelName = (label) => {
    return label.toUpperCase().split(' ').join('_');
};
const passwordGenerator = () => {
    const string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    const len = string.length;
    for (let i = 0; i < 8; i++) {
        password += string[Math.floor(Math.random() * len)];
    }
    return password;
};
const accessToken = (userDetails, expiresIn = null) => jsonwebtoken_1.default.sign(userDetails, const_1.jwtAccessToken.SECRET_KEY, {
    expiresIn: expiresIn || const_1.jwtAccessToken.EXPIRE,
});
const refreshToken = (userDetails, expiresIn) => jsonwebtoken_1.default.sign(userDetails, const_1.jwtRefreshToken.SECRET_KEY, {
    expiresIn: expiresIn || const_1.jwtRefreshToken.EXPIRE,
});
exports.default = {
    otpGenerator,
    emailValidator,
    otpValidator,
    aadharValidator,
    uuid,
    panNumber,
    passwordValidator,
    phoneValidator,
    calculateTotalPages,
    formatLabelName,
    passwordGenerator,
    accessToken,
    refreshToken,
};
