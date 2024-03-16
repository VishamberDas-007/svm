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
exports.projectRouter = void 0;
const express_1 = __importDefault(require("express"));
const projectController = __importStar(require("../controllers/project.controller"));
const s3_1 = require("../aws/s3");
const projectRouter = express_1.default.Router();
exports.projectRouter = projectRouter;
projectRouter.post('/create', 
// authMiddleware(['PROJECT_WRITE']),
// upload.single('logo'),
// authMiddleware(['PROJECT_WRITE']),
// upload.single('logo'),
projectController.newProject);
projectRouter.get('/list', 
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
projectController.getAllProjects);
projectRouter.put('/update/:projectId', 
// authMiddleware(['PROJECT_WRITE']),
// upload.fields([
//     { name: 'planningImages', maxCount: 20 },
//     { name: 'siteImages', maxCount: 5 },
//     { name: 'logo', maxCount: 1 },
// ]),
// authMiddleware(['PROJECT_WRITE']),
// upload.fields([
//     { name: 'planningImages', maxCount: 20 },
//     { name: 'siteImages', maxCount: 5 },
//     { name: 'logo', maxCount: 1 },
// ]),
projectController.updateProject);
projectRouter.get('/get-details/:projectId', 
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
projectController.getProjectDetails);
projectRouter.get('/get-images/:projectId', 
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
projectController.getProjectImages);
projectRouter.get('/basic-list', 
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
// authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
projectController.getProjectBasicList);
projectRouter.put('/upload/happy-customers/:projectId', 
// authMiddleware(['PROJECT_WRITE']),
// authMiddleware(['PROJECT_WRITE']),
s3_1.upload.array('customers', 10), projectController.uploadHappyCustomerImages);
projectRouter.patch('/upload/logo/:projectId', 
// authMiddleware(['PROJECT_WRITE']),
s3_1.upload.single('logo'), projectController.uploadLogoImage);
projectRouter.patch('/upload/project-images/:projectId', 
// authMiddleware(['PROJECT_WRITE']),
s3_1.upload.fields([
    { name: 'planningImages', maxCount: 20 },
    { name: 'siteImages', maxCount: 5 },
]), projectController.uploadProjectImages);
// projectRouter.delete(
//     '/delete/project-images/:projectId',
//     // authMiddleware(['PROJECT_WRITE']),
//     projectController.deleteProjectImages
// )
projectRouter.delete('/delete-image/:projectImageId', 
// authMiddleware(['PROJECT_WRITE']),
projectController.deleteProjectImage);
