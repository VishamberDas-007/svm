import express from 'express'
import * as roleController from '../controllers/role.controller'

const roleRouter = express.Router()

roleRouter.post('/create', roleController.newRole)

roleRouter.get('/list', roleController.roleList)

export { roleRouter }
