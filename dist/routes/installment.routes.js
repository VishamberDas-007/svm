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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const installmentController = __importStar(require("../controllers/installment.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const installmentRouter = express_1.default.Router();
exports.installmentRouter = installmentRouter;
installmentRouter.post('/create', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE']), installmentController.createInstallment);
installmentRouter.post('/fetch-current-month/installment-list', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE']), installmentController.fetchCurrentMonthInstallmentList);
installmentRouter.get('/get/:installmentId', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE', 'INSTALLMENT_READ']), installmentController.fetchInstallmentDetails);
installmentRouter.get('/get/booking/installment-details/:bookingId', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE', 'INSTALLMENT_READ']), installmentController.fetchBookingInstallmentDetails);
installmentRouter.put('/update/:installmentId', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE']), installmentController.updateInstallmentDetails);
installmentRouter.delete('/delete/:installmentId', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_WRITE']), installmentController.deleteInstallment);
installmentRouter.get('/list', (0, auth_middleware_1.authMiddleware)(['INSTALLMENT_READ', 'INSTALLMENT_WRITE']), installmentController.installmentList);
