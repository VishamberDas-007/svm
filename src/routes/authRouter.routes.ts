import express from 'express'
import * as authController from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/register', authController.register)

authRouter.post('/login', authController.login)

authRouter.get('/forgot-password/:email', authController.resetRequestEmailOTP)

authRouter.post('/reset-password', authController.resetEmailOtpValidation)

authRouter.post('/change-password', authController.setNewPassword)

export { authRouter }
