import express from 'express'
import * as authController from '../controllers/auth.controller'
import { adminMiddleware } from '../middlewares/auth.middleware'

const authRouter = express.Router()

authRouter.post('/register', authController.register)

authRouter.post('/login', authController.login)

authRouter.get('/forgot-password/:email', authController.resetRequestEmailOTP)

authRouter.post('/reset-password', authController.resetEmailOtpValidation)

authRouter.post('/change-password', authController.setNewPassword)

authRouter.post(
    '/access-token/validate',
    adminMiddleware,
    authController.validateAccessToken
)

export { authRouter }
