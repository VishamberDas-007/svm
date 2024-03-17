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
exports.checkIfProjectAreaExists = exports.getBookingDetails = void 0;
const booking_1 = require("../config/responseCodes/booking");
const db_1 = __importDefault(require("../db"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getBookingDetails = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield db_1.default.booking.findFirst({
        where: {
            bookingId,
            isDelete: false,
        },
        include: {
            customer: true,
        },
    });
    if (!bookingDetails)
        throw new AppError_1.default(booking_1.BOOKING_E_0001);
    else
        return bookingDetails;
});
exports.getBookingDetails = getBookingDetails;
const checkIfProjectAreaExists = (projectData, currentArea) => {
    var _a;
    let totalArea = 0;
    (_a = projectData.booking) === null || _a === void 0 ? void 0 : _a.forEach((obj) => {
        totalArea += obj.area;
    });
    if (totalArea + currentArea > projectData.area)
        return false;
    return true;
};
exports.checkIfProjectAreaExists = checkIfProjectAreaExists;
