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
projectRouter.post('/create', s3_1.upload.fields([
    { name: 'planningImages', maxCount: 20 },
    { name: 'siteImages', maxCount: 5 },
    { name: 'logo', maxCount: 1 },
]), projectController.newProject);
projectRouter.get('/list', projectController.getAllProjects);
projectRouter.put('/update/:projectId', s3_1.upload.fields([
    { name: 'planningImages', maxCount: 20 },
    { name: 'siteImages', maxCount: 5 },
    { name: 'logo', maxCount: 1 },
]), projectController.updateProject);
projectRouter.get('/get/:projectId', projectController.getProject);
projectRouter.get('/basic-list', projectController.getProjectBasicList);
projectRouter.put('/upload/happy-customers/:projectId', s3_1.upload.array('customers', 10), projectController.uploadHappyCustomerImages);
