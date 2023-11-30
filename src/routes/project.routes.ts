import express from 'express'
import * as projectController from '../controllers/project.controller'
import { upload } from '../aws/s3'
import { authMiddleware } from '../middlewares/auth.middleware'

const projectRouter = express.Router()

projectRouter.post(
    '/create',
    // authMiddleware(['PROJECT_WRITE']),
    upload.fields([
        { name: 'planningImages', maxCount: 20 },
        { name: 'siteImages', maxCount: 5 },
        { name: 'logo', maxCount: 1 },
    ]),
    projectController.newProject
)

projectRouter.get(
    '/list',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getAllProjects
)

projectRouter.put(
    '/update/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    upload.fields([
        { name: 'planningImages', maxCount: 20 },
        { name: 'siteImages', maxCount: 5 },
        { name: 'logo', maxCount: 1 },
    ]),
    projectController.updateProject
)

projectRouter.get(
    '/get/:projectId',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getProject
)

projectRouter.get(
    '/basic-list',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getProjectBasicList
)

projectRouter.put(
    '/upload/happy-customers/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    upload.array('customers', 10),
    projectController.uploadHappyCustomerImages
)

export { projectRouter }
