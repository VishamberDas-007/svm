import express from 'express'
import * as projectController from '../controllers/project.controller'
import { upload } from '../services/project.service'

const projectRouter = express.Router()

projectRouter.post(
    '/create',
    upload.array('planningImages'),
    projectController.newProject
)

projectRouter.get('/list', projectController.getAllProjects)

projectRouter.put('/update/:projectId', projectController.updateProject)

projectRouter.get('/get/:projectId', projectController.getProject)

projectRouter.get('/basic-list', projectController.getProjectBasicList)

export { projectRouter }
