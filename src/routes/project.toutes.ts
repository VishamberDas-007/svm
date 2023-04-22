import express from 'express'
import * as projectController from '../controllers/project.controller'

const projectRouter = express.Router()

projectRouter.post('/create', projectController.newProject)

export { projectRouter }
