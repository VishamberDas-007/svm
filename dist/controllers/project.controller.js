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
exports.deleteProjectImages = exports.uploadProjectImages = exports.uploadLogoImage = exports.uploadHappyCustomerImages = exports.getProjectBasicList = exports.getProject = exports.updateProject = exports.getAllProjects = exports.newProject = void 0;
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
// import { deleteImage } from '../aws/s3'
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
        // const logoUrl = req.file?.location
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
                // logoUrl,
                downPayment: +downPayment,
                emiAmt: +emiAmt,
                location,
                totalAmt: +totalAmt,
            },
        });
        // const planningImageUrls = req.files?.['planningImages']?.map(
        //     (image: TImageUpload) => ({
        //         url: image.location,
        //         type: 'PLANNING',
        //         projectId: newProject?.projectId,
        //     })
        // )
        // const siteImageUrls = req.files?.['siteImages']?.map(
        //     (image: TImageUpload) => ({
        //         url: image.location,
        //         type: 'SITE',
        //         projectId: newProject?.projectId,
        //     })
        // )
        // if (planningImageUrls?.length) {
        //     data = [...planningImageUrls]
        // }
        // if (siteImageUrls?.length) {
        //     data = [...data, ...siteImageUrls]
        // }
        // await prisma.projectImages.createMany({
        //     data,
        // })
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
    // let planningImageUrls: string[] = [],
    //     siteImageUrls: string[] = [],
    //     imageUpdate:
    //         | {
    //               projectImages: {
    //                   createMany: {
    //                       data: any[]
    //                       skipDuplicates: boolean
    //                   }
    //               }
    //           }
    //         | undefined,
    //     deleteProjectImageFileNames: string[] = [],
    //  updateProject: Project | undefined
    // planningImageUrls =
    //     req.files?.['planningImages']?.map((image: TImageUpload) => ({
    //         url: image.location,
    //         type: 'PLANNING',
    //     })) || []
    // siteImageUrls =
    //     req.files?.['siteImages']?.map((image: TImageUpload) => ({
    //         url: image.location,
    //         type: 'SITE',
    //     })) || []
    // const projectImages = await prisma.projectImages.findMany({
    //     where: {
    //         projectId,
    //     },
    // })
    // deleteProjectImageFileNames = projectImages.length
    //     ? projectImages.map((project) => {
    //           const fileName =
    //               project.url.split('/')[project.url.split('/')?.length - 1]
    //           return fileName
    //       })
    //     : []
    // if (siteImageUrls.length || planningImageUrls.length)
    //     imageUpdate = {
    //         projectImages: {
    //             createMany: {
    //                 data: [...siteImageUrls, ...planningImageUrls],
    //                 skipDuplicates: true,
    //             },
    //         },
    //     }
    // await prisma.$transaction(async (prisma) => {
    // for await (const fileName of deleteProjectImageFileNames) {
    //     await deleteImage(fileName)
    // }
    // await prisma.projectImages.deleteMany({
    //     where: {
    //         projectId,
    //     },
    // })
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
    // })
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
    const fileName = req.file.originalName;
    yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, s3_1.deleteImage)(fileName);
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
    var _d, _e, _f, _g;
    yield (0, validations_1.default)(generalValidation.projectIdValidator, req.params);
    const { projectId } = req.params;
    let data = [];
    const planningImageUrls = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d['planningImages']) === null || _e === void 0 ? void 0 : _e.map((image) => ({
        url: image.location,
        type: 'PLANNING',
        projectId: projectId,
    }));
    const siteImageUrls = (_g = (_f = req.files) === null || _f === void 0 ? void 0 : _f['siteImages']) === null || _g === void 0 ? void 0 : _g.map((image) => ({
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
    yield db_1.default.projectImages.createMany({
        data,
    });
    // })
    return (0, responseHandler_1.default)(res, project_1.PROJECT_S_0007);
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
        var _h, e_1, _j, _k;
        try {
            for (var _l = true, imagesFileNames_1 = __asyncValues(imagesFileNames), imagesFileNames_1_1; imagesFileNames_1_1 = yield imagesFileNames_1.next(), _h = imagesFileNames_1_1.done, !_h;) {
                _k = imagesFileNames_1_1.value;
                _l = false;
                try {
                    const iterator = _k;
                    yield (0, s3_1.deleteImage)(iterator);
                }
                finally {
                    _l = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_l && !_h && (_j = imagesFileNames_1.return)) yield _j.call(imagesFileNames_1);
            }
            finally { if (e_1) throw e_1.error; }
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
