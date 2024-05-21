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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const array = [
    'findFirst',
    'findUnique',
    'delete',
    'findMany',
    'count',
    'deleteMany',
];
const createWhereIsDeleteFalse = (params) => {
    var _a;
    return Object.assign(Object.assign({}, (_a = params.args) === null || _a === void 0 ? void 0 : _a['where']), { isDelete: false });
};
const createWhereIsDeleteTrue = (params) => {
    var _a;
    return Object.assign(Object.assign({}, (_a = params.args) === null || _a === void 0 ? void 0 : _a['where']), { isDelete: true });
};
prisma.$use((params, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    if (params.model === 'Role' ||
        params.model === 'Booking' ||
        params.model === 'Project' ||
        params.model === 'AdminAccount' ||
        params.model === 'Installment' ||
        params.model === 'Customer') {
        if (!((_a = params.args) === null || _a === void 0 ? void 0 : _a.where) && array.includes(params.action)) {
            params.args = {
                where: {},
            };
        }
        if (params.action === 'findFirst' || params.action === 'findUnique')
            params.args.where = createWhereIsDeleteFalse(params);
        else if (params.action === 'findMany') {
            ((_c = (_b = params.args) === null || _b === void 0 ? void 0 : _b.where) === null || _c === void 0 ? void 0 : _c.isDelete) === undefined || false
                ? (params.args.where = createWhereIsDeleteFalse(params))
                : (params.args['where'] = createWhereIsDeleteTrue(params));
        }
        else if (params.action === 'delete') {
            params.action = 'update';
            params.args['data'] = { isDelete: true };
        }
        else if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany';
            if (((_d = params.args) === null || _d === void 0 ? void 0 : _d.data) != undefined) {
                params.args.data['isDelete'] = true;
            }
            else {
                params.args['data'] = { isDelete: true };
            }
        }
        else if (params.action === 'count') {
            ((_f = (_e = params.args) === null || _e === void 0 ? void 0 : _e.where) === null || _f === void 0 ? void 0 : _f.isDelete) === undefined || false
                ? (params.args['where'] = createWhereIsDeleteFalse(params))
                : (params.args['where'] = createWhereIsDeleteTrue(params));
        }
    }
    return next(params);
}));
prisma
    .$connect()
    .then(() => {
    console.log('Connected to database');
})
    .catch((err) => {
    console.log(err);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
exports.default = prisma;
