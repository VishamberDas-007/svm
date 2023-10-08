import express from 'express'
import * as projectController from '../controllers/project.controller'
import { upload } from '../aws/s3'

const projectRouter = express.Router()

projectRouter.post(
    '/create',
    upload.fields([
        { name: 'planningImages', maxCount: 10 },
        { name: 'siteImages', maxCount: 5 },
    ]),
    projectController.newProject
)

projectRouter.get('/list', projectController.getAllProjects)

projectRouter.put(
    '/update/:projectId',
    upload.array('planningImages'),
    // upload.array('siteImages'),
    projectController.updateProject
)

projectRouter.get('/get/:projectId', projectController.getProject)

projectRouter.get('/basic-list', projectController.getProjectBasicList)

export { projectRouter }
