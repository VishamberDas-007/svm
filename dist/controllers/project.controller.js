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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadHappyCustomerImages = exports.getProjectBasicList = exports.getProject = exports.updateProject = exports.getAllProjects = exports.newProject = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const project_1 = require("../config/responseCodes/project");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/project.validator"));
const generalValidation = __importStar(require("../validations/_general.validator"));
const project_service_1 = require("../services/project.service");
const s3_1 = require("../aws/s3");
exports.newProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createProjectValidator, req.body);
    const { parentId, address1, address2, area, description, name, ownerName, pincode, status, unit, downPayment, emiAmt, location, totalAmt, } = req.body;
    let newProject;
    if (parentId) {
        const project = yield (0, project_service_1.projectExists)(parentId);
        if (!project)
            throw new AppError_1.default(project_1.PROJECT_E_0002);
    }
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const logoUrl = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a['logo']) === null || _b === void 0 ? void 0 : _b[0].location;
        let data = [];
        newProject = yield prisma.project.create({
            data: {
                parentId,
                address1,
                address2,
                area: +area,
                description,
                name,
                ownerName,
                pincode,
                status,
                unit,
                logoUrl,
                downPayment: +downPayment,
                emiAmt: +emiAmt,
                location,
                totalAmt: +totalAmt,
            },
        });
        const planningImageUrls = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c['planningImages']) === null || _d === void 0 ? void 0 : _d.map((image) => ({
            url: image.location,
            type: 'PLANNING',
            projectId: newProject === null || newProject === void 0 ? void 0 : newProject.projectId,
        }));
        const siteImageUrls = (_f = (_e = req.files) === null || _e === void 0 ? void 0 : _e['siteImages']) === null || _f === void 0 ? void 0 : _f.map((image) => ({
            url: image.location,
            type: 'SITE',
            projectId: newProject === null || newProject === void 0 ? void 0 : newProject.projectId,
        }));
        if (planningImageUrls === null || planningImageUrls === void 0 ? void 0 : planningImageUrls.length) {
            data = [...planningImageUrls];
        }
        if (siteImageUrls === null || siteImageUrls === void 0 ? void 0 : siteImageUrls.length) {
            data = [...data, ...siteImageUrls];
        }
        yield prisma.projectImages.createMany({
            data,
        });
    }));
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0001, newProject);
}));
exports.getAllProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 20, area, status } = req.query;
    const searchString = req.query.searchString;
    const skip = (+page - 1) * +pageSize;
    let projectList = [], projectCount = 0, totalQueryCount = 0, whereClause = {};
    if (area && !isNaN(+area)) {
        whereClause = {
            area: {
                gte: +area,
                lt: +area,
            },
        };
    }
    if (status) {
        whereClause = Object.assign(Object.assign({}, whereClause), { status });
    }
    if (searchString) {
        whereClause = Object.assign(Object.assign({}, whereClause), { OR: [
                {
                    name: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    ownerName: {
                        startsWith: searchString,
                        mode: 'insensitive',
                    },
                },
                {
                    ownerName: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                },
            ] });
    }
    projectList = yield db_1.default.project.findMany({
        take: +pageSize,
        skip: skip,
        where: whereClause,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            projectImages: true,
        },
    });
    projectCount = yield db_1.default.project.count();
    totalQueryCount = yield db_1.default.project.count({ where: whereClause });
    const result = {
        list: projectList,
        meta: {
            totalCount: projectCount,
            page: +page,
            pageSize: +pageSize,
            totalQueryCount,
        },
    };
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0002, result);
}));
exports.updateProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateProjectValidator, req.body);
    const { projectId } = req.params;
    const { address1, area, name, description, ownerName, pincode, status, unit, address2, downPayment, emiAmt, location, totalAmt, } = req.body;
    let planningImageUrls = [], siteImageUrls = [], imageUpdate, deleteProjectImageFileNames = [], updateProject;
    planningImageUrls =
        ((_h = (_g = req.files) === null || _g === void 0 ? void 0 : _g['planningImages']) === null || _h === void 0 ? void 0 : _h.map((image) => ({
            url: image.location,
            type: 'PLANNING',
        }))) || [];
    siteImageUrls =
        ((_k = (_j = req.files) === null || _j === void 0 ? void 0 : _j['siteImages']) === null || _k === void 0 ? void 0 : _k.map((image) => ({
            url: image.location,
            type: 'SITE',
        }))) || [];
    const projectImages = yield db_1.default.projectImages.findMany({
        where: {
            projectId,
        },
    });
    deleteProjectImageFileNames = projectImages.length
        ? projectImages.map((project) => {
            var _a;
            const fileName = project.url.split('/')[((_a = project.url.split('/')) === null || _a === void 0 ? void 0 : _a.length) - 1];
            return fileName;
        })
        : [];
    if (siteImageUrls.length || planningImageUrls.length)
        imageUpdate = {
            projectImages: {
                createMany: {
                    data: [...siteImageUrls, ...planningImageUrls],
                    skipDuplicates: true,
                },
            },
        };
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _l, e_1, _m, _o;
        try {
            for (var _p = true, deleteProjectImageFileNames_1 = __asyncValues(deleteProjectImageFileNames), deleteProjectImageFileNames_1_1; deleteProjectImageFileNames_1_1 = yield deleteProjectImageFileNames_1.next(), _l = deleteProjectImageFileNames_1_1.done, !_l;) {
                _o = deleteProjectImageFileNames_1_1.value;
                _p = false;
                try {
                    const fileName = _o;
                    yield (0, s3_1.deleteImage)(fileName);
                }
                finally {
                    _p = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_p && !_l && (_m = deleteProjectImageFileNames_1.return)) yield _m.call(deleteProjectImageFileNames_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        yield prisma.projectImages.deleteMany({
            where: {
                projectId,
            },
        });
        updateProject = yield prisma.project.update({
            where: {
                projectId,
            },
            data: Object.assign(Object.assign({}, imageUpdate), { address1,
                address2, area: +area, description,
                name,
                ownerName,
                pincode,
                status,
                unit, downPayment: +downPayment, emiAmt: +emiAmt, location, totalAmt: +totalAmt }),
        });
    }));
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0004, updateProject);
}));
exports.getProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const projectId = req.params.projectId;
    const fetchProject = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
        include: {
            projectImages: true,
        },
    });
    if (!fetchProject)
        throw new AppError_1.default(project_1.PROJECT_E_0001);
    else
        return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0003, fetchProject);
}));
exports.getProjectBasicList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fetchProjects = yield db_1.default.project.findMany({
        select: {
            projectId: true,
            name: true,
            description: true,
        },
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0002, fetchProjects);
}));
exports.uploadHappyCustomerImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    const images = ((_r = (_q = req.files) === null || _q === void 0 ? void 0 : _q['customers']) === null || _r === void 0 ? void 0 : _r.map((image) => ({
        url: image.location,
        type: 'HAPPY_CUSTOMER',
        projectId,
    }))) || [];
    yield db_1.default.projectImages.createMany({
        data: images,
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0005);
}));
