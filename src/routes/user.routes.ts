import express from 'express'
import * as userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/create', userController.createUser)

userRouter.get('/get/:userId', userController.getUser)

userRouter.get('/list', userController.getAllUsers)

userRouter.put('/update/:userId', userController.updateUser)

export { userRouter }
