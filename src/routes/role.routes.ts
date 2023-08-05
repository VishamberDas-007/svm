import express from 'express'
import * as roleController from '../controllers/role.controller'

const roleRouter = express.Router()

roleRouter.post('/create', roleController.newRole)

roleRouter.get('/advance-list', roleController.roleAdvanceList)

roleRouter.get('/basic-list', roleController.roleBasicList)

roleRouter.get('/get/:roleId', roleController.fetchRoleDetails)

roleRouter.put('/update/:roleId', roleController.updateRoleDetails)

roleRouter.get('/permissions', roleController.fetchAllPermissions)

export { roleRouter }
