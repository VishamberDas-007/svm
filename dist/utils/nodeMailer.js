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
exports.sendEmailToAdmin = exports.sendEmailToCustomer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const const_1 = require("../config/const");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: const_1.nodeMailerCredentials.USER_EMAIL,
        pass: const_1.nodeMailerCredentials.APP_PASSWORD,
    },
});
const sendEmailToCustomer = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: const_1.nodeMailerCredentials.USER_EMAIL,
        to: to,
        subject: subject,
        html: html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmailToCustomer = sendEmailToCustomer;
const sendEmailToAdmin = (from, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from,
        to: const_1.nodeMailerCredentials.USER_EMAIL,
        subject: subject,
        html: html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmailToAdmin = sendEmailToAdmin;
