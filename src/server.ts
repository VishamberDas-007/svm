import { Application, Request, Response, json, urlencoded } from 'express'
import cors from 'cors'
import { mainRouter } from './routes'
import morgan from 'morgan'
// import cookieParser from 'cookie-parser'

import errorHandler from './utils/errorHandler'
export default class Server {
    constructor(app: Application) {
        this.config(app)
    }

    public config(app: Application): void {
        app.use(urlencoded({ extended: true }))
        app.use(morgan('dev'))

        app.use(json())

        // app.use(cookieParser())

        app.use(cors())
        // test()

        app.use('/s@#$%^&*((/api', mainRouter)
        app.use('/*', (req: Request, res: Response) => {
            return res.status(404).send({
                message: 'Route not found',
            })
        })

        app.use(errorHandler)
    }
}
