"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseValidator = exports.expenseIdValidator = exports.createExpenseValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createExpenseValidator = joi_1.default.object({
    brokerage: joi_1.default.number().required(),
    landDevelopment: joi_1.default.number().required(),
    landPurchase: joi_1.default.number().required(),
    landVisitCharge: joi_1.default.number().required(),
    nonAgricultural: joi_1.default.number().required(),
    planningAndLayout: joi_1.default.number().required(),
    projectId: joi_1.default.string().required(),
    miscExpense: joi_1.default.array()
        .items({
        expenseName: joi_1.default.string().required(),
        cost: joi_1.default.number().required(),
    })
        .optional(),
});
exports.expenseIdValidator = joi_1.default.object({
    expenseId: joi_1.default.string().required(),
});
exports.updateExpenseValidator = joi_1.default.object({
    brokerage: joi_1.default.number().optional(),
    landDevelopment: joi_1.default.number().optional(),
    landPurchase: joi_1.default.number().optional(),
    landVisitCharge: joi_1.default.number().optional(),
    nonAgricultural: joi_1.default.number().optional(),
    planningAndLayout: joi_1.default.number().optional(),
    projectId: joi_1.default.string().optional(),
    miscExpense: joi_1.default.array()
        .items({
        expenseName: joi_1.default.string().required(),
        cost: joi_1.default.number().required(),
    })
        .optional(),
});
