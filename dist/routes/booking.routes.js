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
exports.bookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const bookingController = __importStar(require("../controllers/booking.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const bookingRouter = express_1.default.Router();
exports.bookingRouter = bookingRouter;
bookingRouter.post('/create', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.createBooking);
bookingRouter.get('/list', (0, auth_middleware_1.authMiddleware)(['BOOKING_READ', 'BOOKING_WRITE']), bookingController.getAllBookings);
bookingRouter.get('/cancel-list', (0, auth_middleware_1.authMiddleware)(['BOOKING_READ', 'BOOKING_WRITE']), bookingController.getAllCancelledBookings);
bookingRouter.get('/get/:bookingId', (0, auth_middleware_1.authMiddleware)(['BOOKING_READ', 'BOOKING_WRITE']), bookingController.getBooking);
bookingRouter.put('/update/:bookingId', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.updateBooking);
bookingRouter.patch('/cancel/:bookingId', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.cancelBooking);
bookingRouter.delete('/delete/:bookingId', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.deleteBooking);
bookingRouter.post('/add-penalty', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.addPenalty);
bookingRouter.patch('/update-penalty/:penaltyId', (0, auth_middleware_1.authMiddleware)(['BOOKING_WRITE']), bookingController.updatePenalty);
bookingRouter.get('/penalty-list/:bookingId', (0, auth_middleware_1.authMiddleware)(['BOOKING_READ', 'BOOKING_WRITE']), bookingController.getPenaltyList);
