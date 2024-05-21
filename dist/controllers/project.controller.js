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
exports.deleteProject = exports.deleteProjectImage = exports.deleteProjectImages = exports.uploadProjectImages = exports.uploadLogoImage = exports.uploadHappyCustomerImages = exports.getProjectBasicList = exports.getProjectImages = exports.getProjectDetails = exports.updateProject = exports.getAllProjects = exports.newProject = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const db_1 = __importDefault(require("../db"));
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const project_1 = require("../config/responseCodes/project");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validations_1 = __importDefault(require("../validations"));
const validation = __importStar(require("../validations/project.validator"));
const generalValidation = __importStar(require("../validations/_general.validator"));
const s3_1 = require("../aws/s3");
// import { deleteImage } from '../aws/s3'
// import { deleteImage } from '../aws/s3'
exports.newProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.createProjectValidator, req.body);
    const { address1, address2, area, description, name, ownerName, pincode, status, unit, location, } = req.body;
    let newProject;
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // const logoUrl = req.file?.location
        // const logoUrl = req.file?.location
        newProject = yield prisma.project.create({
            data: {
                address1,
                address2,
                area: +area,
                description,
                name,
                ownerName,
                pincode,
                status,
                unit,
                location,
            },
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
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    yield (0, validations_1.default)(validation.updateProjectValidator, req.body);
    const { projectId } = req.params;
    const { address1, area, name, description, ownerName, pincode, status, unit, address2, downPayment, emiAmt, location, totalAmt, } = req.body;
    const projectData = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
    });
    if (!projectData)
        throw new AppError_1.default(project_1.PROJECT_E_0001);
    const updateProject = yield db_1.default.project.update({
        where: {
            projectId,
        },
        data: {
            address1,
            address2,
            area: +area,
            description,
            name,
            ownerName,
            pincode,
            status,
            unit,
            downPayment: +downPayment,
            emiAmt: +emiAmt,
            location,
            totalAmt: +totalAmt,
        },
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0004, updateProject);
}));
exports.getProjectDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const projectId = req.params.projectId;
    const fetchProject = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
    });
    if (!fetchProject)
        throw new AppError_1.default(project_1.PROJECT_E_0001);
    else
        return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0003, fetchProject);
}));
exports.getProjectImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const projectId = req.params.projectId;
    const planningImages = [], siteImages = [];
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
    fetchProject.projectImages.forEach((image) => {
        if (image.type === 'PLANNING')
            planningImages.push({
                projectImageId: image.projectImageId,
                type: image.type,
                url: image.url,
            });
        else if (image.type === 'SITE') {
            siteImages.push({
                projectImageId: image.projectImageId,
                type: image.type,
                url: image.url,
            });
        }
    });
    const result = {
        planningImages,
        siteImages,
        logoUrl: fetchProject.logoUrl,
    };
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0009, result);
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
    var _a, _b;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    const images = ((_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a['customers']) === null || _b === void 0 ? void 0 : _b.map((image) => ({
        url: image.location,
        type: 'HAPPY_CUSTOMER',
        projectId,
    }))) || [];
    yield db_1.default.projectImages.createMany({
        data: images,
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0005);
}));
exports.uploadLogoImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    const logoUrl = (_c = req.file) === null || _c === void 0 ? void 0 : _c.location;
    // const fileName = req.file.originalName
    const projectData = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
    });
    if (!projectData)
        throw new AppError_1.default(project_1.PROJECT_E_0001);
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        yield (0, s3_1.deleteImage)(((_e = (_d = projectData.logoUrl) === null || _d === void 0 ? void 0 : _d.split('/')) === null || _e === void 0 ? void 0 : _e.pop()) || '');
        yield prisma.project.update({
            where: {
                projectId,
            },
            data: {
                logoUrl,
            },
        });
    }));
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0006, { logoUrl });
}));
exports.uploadProjectImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, e_1, _g, _h;
    var _j, _k, _l, _m;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    let data = [];
    const result = [];
    const planningImageUrls = (_k = (_j = req.files) === null || _j === void 0 ? void 0 : _j['planningImages']) === null || _k === void 0 ? void 0 : _k.map((image) => ({
        url: image.location,
        type: 'PLANNING',
        projectId: projectId,
    }));
    const siteImageUrls = (_m = (_l = req.files) === null || _l === void 0 ? void 0 : _l['siteImages']) === null || _m === void 0 ? void 0 : _m.map((image) => ({
        url: image.location,
        type: 'SITE',
        projectId: projectId,
    }));
    if (planningImageUrls === null || planningImageUrls === void 0 ? void 0 : planningImageUrls.length) {
        data = [...planningImageUrls];
    }
    if (siteImageUrls === null || siteImageUrls === void 0 ? void 0 : siteImageUrls.length) {
        data = [...data, ...siteImageUrls];
    }
    try {
        for (var _o = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _f = data_1_1.done, !_f;) {
            _h = data_1_1.value;
            _o = false;
            try {
                const obj = _h;
                const addImage = yield db_1.default.projectImages.create({
                    data: obj,
                });
                result.push({
                    projectImageId: addImage.projectImageId,
                    type: addImage.type,
                    url: addImage.url,
                });
            }
            finally {
                _o = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_o && !_f && (_g = data_1.return)) yield _g.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0007, result);
}));
exports.deleteProjectImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    yield (0, validations_1.default)(validation.projectImageIdsValidator, req.body);
    const { projectId } = req.params;
    const { projectImageIds } = req.body;
    const imagesFileNames = (yield db_1.default.projectImages.findMany({
        where: {
            projectId,
            projectImageId: {
                in: projectImageIds,
            },
        },
    })).map((image) => {
        const array = image.url.split('/');
        return array[array.length - 1];
    });
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        var _p, e_2, _q, _r;
        try {
            for (var _s = true, imagesFileNames_1 = __asyncValues(imagesFileNames), imagesFileNames_1_1; imagesFileNames_1_1 = yield imagesFileNames_1.next(), _p = imagesFileNames_1_1.done, !_p;) {
                _r = imagesFileNames_1_1.value;
                _s = false;
                try {
                    const iterator = _r;
                    yield (0, s3_1.deleteImage)(iterator);
                }
                finally {
                    _s = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_s && !_p && (_q = imagesFileNames_1.return)) yield _q.call(imagesFileNames_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        yield prisma.projectImages.deleteMany({
            where: {
                projectId,
                projectImageId: {
                    in: projectImageIds,
                },
            },
        });
    }));
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0008);
}));
exports.deleteProjectImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u;
    yield (0, validations_1.default)(validation.projectImageIdValidator, req.params);
    const { projectImageId } = req.params;
    const imageExists = yield db_1.default.projectImages.findFirst({
        where: {
            projectImageId,
        },
    });
    if (!imageExists)
        throw new AppError_1.default(project_1.PROJECT_E_0003);
    yield (0, s3_1.deleteImage)(((_u = (_t = imageExists.url) === null || _t === void 0 ? void 0 : _t.split('/')) === null || _u === void 0 ? void 0 : _u.pop()) || '');
    yield db_1.default.projectImages.delete({
        where: {
            projectImageId,
        },
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0010);
}));
exports.deleteProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.default)(validation.projectIdValidator, req.params);
    const { projectId } = req.params;
    const projectData = yield db_1.default.project.findFirst({
        where: {
            projectId,
        },
    });
    if (!projectData)
        throw new AppError_1.default(project_1.PROJECT_E_0001);
    yield db_1.default.project.update({
        where: {
            projectId,
        },
        data: {
            isDelete: true,
        },
    });
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0011);
}));
