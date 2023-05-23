import { Router } from 'express'
import { projectRouter } from './project.routes'
import { customerRouter } from './customer.routes'
import { referralRouter } from './referral.routes'
const mainRouter = Router()

mainRouter.get('/test', (req, res) => {
    return res.json({
        name: 'svm backend',
        version: '1.0.0',
        message: 'Welcome to the svm backend',
        // server: APP_ENV,
    })
})

mainRouter.use('/project', projectRouter)

mainRouter.use('/customer', customerRouter)

mainRouter.use('/referral', referralRouter)

export { mainRouter }
