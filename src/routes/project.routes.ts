import express from 'express'
import * as projectController from '../controllers/project.controller'
import { upload } from '../aws/s3'
import { authMiddleware } from '../middlewares/auth.middleware'

const projectRouter = express.Router()

projectRouter.post(
    '/create',
    // authMiddleware(['PROJECT_WRITE']),
    // upload.single('logo'),
    // authMiddleware(['PROJECT_WRITE']),
    // upload.single('logo'),
    projectController.newProject
)

projectRouter.get(
    '/list',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getAllProjects
)

projectRouter.put(
    '/update/:projectId',
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
    projectController.updateProject
)

projectRouter.get(
    '/get-details/:projectId',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getProjectDetails
)

projectRouter.get(
    '/get-images/:projectId',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getProjectImages
)

projectRouter.get(
    '/basic-list',
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    // authMiddleware(['PROJECT_READ', 'PROJECT_WRITE']),
    projectController.getProjectBasicList
)

projectRouter.put(
    '/upload/happy-customers/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    // authMiddleware(['PROJECT_WRITE']),
    upload.array('customers', 10),
    projectController.uploadHappyCustomerImages
)

projectRouter.patch(
    '/upload/logo/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    upload.single('logo'),
    projectController.uploadLogoImage
)

projectRouter.patch(
    '/upload/project-images/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    upload.fields([
        { name: 'planningImages', maxCount: 20 },
        { name: 'siteImages', maxCount: 5 },
    ]),
    projectController.uploadProjectImages
)

projectRouter.delete(
    '/delete/project-images/:projectId',
    // authMiddleware(['PROJECT_WRITE']),
    projectController.deleteProjectImages
)

export { projectRouter }
