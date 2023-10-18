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
exports.getPincodeList = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const pincode_1 = require("../pincode");
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const appConfig_1 = require("../config/responseCodes/appConfig");
exports.getPincodeList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.query.zip;
    if (!pincode) {
        return (0, responseHandler_1.default)(res, appConfig_1.APP_CONFIG_S_0001, Object.values(pincode_1.pincodeList).slice(0, 30));
    }
    else {
        const pincodeCity = [];
        const list = Object.values(pincode_1.pincodeList);
        let counter = 0;
        for (let index = 0; index < list.length; index++) {
            const a = list[index].District.toLowerCase().startsWith(pincode);
            const b = list[index].State.toLowerCase().startsWith(pincode);
            const c = list[index].Pincode.toString().startsWith(pincode);
            const d = list[index].Division.toLowerCase().startsWith(pincode);
            if (a || b || c || d) {
                const value = list[index];
                ++counter;
                pincodeCity.push(value);
            }
            if (counter >= 30) {
                break;
            }
        }
        return (0, responseHandler_1.default)(res, appConfig_1.APP_CONFIG_S_0001, pincodeCity);
    }
}));
