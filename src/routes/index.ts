import { Router } from 'express'
import { projectRouter } from './project.routes'
import { customerRouter } from './customer.routes'
import { referralRouter } from './referral.routes'
import { accountRouter } from './adminAccount.routes'
import { authRouter } from './authRouter.routes'
// import { adminMiddleware } from '../middlewares/auth.middleware'
import { bookingRouter } from './booking.routes'
import { appConfigRouter } from './appConfig.routes'
import { expenseRouter } from './expense.routes'
import { userRouter } from './user.routes'
import { roleRouter } from './role.routes'
import { installmentRouter } from './installment.routes'
const mainRouter = Router()

mainRouter.get('/test', (req, res) => {
    return res.json({
        name: 'svm backend',
        version: '1.0.0',
        message: 'Welcome to the svm backend',
        // server: APP_ENV,
    })
})

mainRouter.use('/installment', installmentRouter)

mainRouter.use('/role', roleRouter)

mainRouter.use('/user', userRouter)

mainRouter.use('/appConfig', appConfigRouter)

mainRouter.use('/booking', bookingRouter)

mainRouter.use('/project', projectRouter)

mainRouter.use('/expense', expenseRouter)

mainRouter.use('/customer', customerRouter)

mainRouter.use('/referral', referralRouter)

mainRouter.use('/account', accountRouter)

mainRouter.use('/auth', authRouter)

export { mainRouter }
