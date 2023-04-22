import { Router } from 'express'
import { projectRouter } from './project.toutes'
const mainRouter = Router()

mainRouter.get('/test', (req, res) => {
    return res.json({
        name: 'valuenaire backend',
        version: '1.0.0',
        message: 'Welcome to the valuenaire backend',
        // server: APP_ENV,
    })
})

mainRouter.use('/project', projectRouter)

export { mainRouter }
