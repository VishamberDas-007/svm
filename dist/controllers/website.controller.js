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
exports.fetchAllProjects = exports.fetchFestivalDetails = exports.addFestivalDetails = exports.fetchContactUsList = exports.saveContactUs = void 0;
const db_1 = __importDefault(require("../db"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const website_1 = require("../config/responseCodes/website");
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/website.validator"));
const nodeMailer_1 = require("../utils/nodeMailer");
const const_1 = require("../config/const");
const contactUsTemplate_1 = require("../config/contactUsTemplate");
exports.saveContactUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.saveContactUsValidator, req.body);
    const { email, name, message, number, subject } = req.body;
    yield db_1.default.contactUs.create({
        data: {
            message,
            name,
            number,
            subject,
            email,
        },
    });
    (0, responseHandler_1.default)(res, website_1.WEBSITE_S_0001);
    const html = `
    name : ${name},
    email : ${email ? email : 'N/A'}
    message : ${message},
    `;
    yield (0, nodeMailer_1.sendEmailToAdmin)(email || const_1.nodeMailerCredentials.TEMP_USER_EMAIL, subject, html);
    if (email) {
        const subject = 'Acknowledgment of Your Inquiry';
        yield (0, nodeMailer_1.sendEmailToCustomer)(email, subject, (0, contactUsTemplate_1.contactUstemplate)(name));
    }
}));
exports.fetchContactUsList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.statusValidator, req.query);
    const { status } = req.query;
    let whereClause = {};
    if (status === 'COMPLETED') {
        whereClause = {
            status: 'COMPLETED',
        };
    }
    else if (status === 'PENDING') {
        whereClause = {
            status: 'PENDING',
        };
    }
    const contactUsList = yield db_1.default.contactUs.findMany({
        where: whereClause,
        orderBy: {
            createdAt: 'desc',
        },
    });
    return (0, responseHandler_1.default)(res, website_1.WEBSITE_S_0002, contactUsList);
}));
exports.addFestivalDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.addFestivalValidator, req.body);
    const { description, thumbnailImg, title, url, isLatest } = req.body;
    let newFestivalDetails;
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        if (isLatest) {
            yield prisma.festival.updateMany({
                data: {
                    isLatest: false,
                },
            });
        }
        newFestivalDetails = yield prisma.festival.create({
            data: {
                description,
                thumbnailImg,
                title,
                url,
                isLatest,
            },
        });
    }));
    return (0, responseHandler_1.default)(res, website_1.WEBSITE_S_0003, newFestivalDetails);
}));
exports.fetchFestivalDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const festivalDetails = yield db_1.default.festival.findFirst({
        where: {
            isLatest: true,
        },
    });
    return (0, responseHandler_1.default)(res, website_1.WEBSITE_S_0005, festivalDetails);
}));
exports.fetchAllProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    const projectList = yield db_1.default.project.findMany({
        where: {
            status,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return (0, responseHandler_1.default)(res, website_1.WEBSITE_S_0004, projectList);
}));
