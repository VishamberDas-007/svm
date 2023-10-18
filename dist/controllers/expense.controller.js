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
exports.updateProjectExpense = exports.getAllProjectExpense = exports.getProjectExpense = exports.addExpense = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const expense_1 = require("../config/responseCodes/expense");
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/expense.validator"));
const generalValidation = __importStar(require("../validations/_general.validator"));
const AppError_1 = __importDefault(require("../utils/AppError"));
exports.addExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createExpenseValidator, req.body);
    const { landPurchase, nonAgricultural, planningAndLayout, landDevelopment, brokerage, landVisitCharge, projectId, miscExpense, } = req.body;
    const expenseExists = yield db_1.default.expense.findFirst({
        where: {
            projectId,
        },
    });
    if (expenseExists)
        throw new AppError_1.default(expense_1.EXPENSE_E_0002);
    const createExpense = yield db_1.default.project.update({
        where: {
            projectId,
        },
        data: {
            expense: {
                create: {
                    landPurchase,
                    nonAgricultural,
                    planningAndLayout,
                    landDevelopment,
                    brokerage,
                    landVisitCharge,
                },
            },
            miscExpense: {
                createMany: {
                    data: miscExpense,
                },
            },
        },
    });
    return (0, responseHandler_1.default)(res, expense_1.EXPENSE_S_0001, createExpense);
}));
exports.getProjectExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    const fetchProjectExpense = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
        include: {
            expense: true,
            miscExpense: true,
        },
    });
    return (0, responseHandler_1.default)(res, expense_1.EXPENSE_S_0002, {
        projectName: (fetchProjectExpense === null || fetchProjectExpense === void 0 ? void 0 : fetchProjectExpense.name) || null,
        expense: (fetchProjectExpense === null || fetchProjectExpense === void 0 ? void 0 : fetchProjectExpense.expense) || null,
        miscExpense: (fetchProjectExpense === null || fetchProjectExpense === void 0 ? void 0 : fetchProjectExpense.miscExpense) || [],
    });
}));
exports.getAllProjectExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (+page - 1) * +pageSize;
    let expenseCount = 0;
    const expenseList = (_a = (yield db_1.default.expense.findMany({
        take: +pageSize,
        skip,
        include: {
            project: true,
        },
    }))) === null || _a === void 0 ? void 0 : _a.map((obj) => (Object.assign(Object.assign({}, obj), { projectName: obj.project.name, project: undefined })));
    expenseCount = yield db_1.default.expense.count();
    // totalQueryCount = await prisma.project.count()
    const result = {
        list: expenseList,
        meta: {
            page: +page,
            pageSize: +pageSize,
            totalCount: expenseCount,
            // totalQueryCount: 0,
        },
    };
    return (0, responseHandler_1.default)(res, expense_1.EXPENSE_S_0003, result);
}));
exports.updateProjectExpense = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.expenseIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateExpenseValidator, req.body);
    const { expenseId } = req.params;
    const { brokerage, landDevelopment, landPurchase, landVisitCharge, miscExpense, nonAgricultural, planningAndLayout, projectId, } = req.body;
    const fetchProjectExpense = yield db_1.default.expense.findFirst({
        where: {
            projectId,
            expenseId,
        },
    });
    if (!fetchProjectExpense) {
        throw new AppError_1.default(expense_1.EXPENSE_E_0001);
    }
    else {
        yield db_1.default.expense.update({
            where: {
                expenseId,
            },
            data: {
                brokerage,
                landDevelopment,
                landPurchase,
                landVisitCharge,
                nonAgricultural,
                planningAndLayout,
            },
        });
        if (miscExpense === null || miscExpense === void 0 ? void 0 : miscExpense.length) {
            yield db_1.default.miscExpense.deleteMany({
                where: {
                    projectId,
                },
            });
            yield db_1.default.miscExpense.createMany({
                data: miscExpense.map((expense) => (Object.assign(Object.assign({}, expense), { projectId }))),
            });
        }
    }
    return (0, responseHandler_1.default)(res, expense_1.EXPENSE_S_0004, Object.assign(Object.assign({}, fetchProjectExpense), { miscExpense,
        brokerage,
        landDevelopment,
        landPurchase,
        landVisitCharge,
        nonAgricultural,
        planningAndLayout }));
}));
