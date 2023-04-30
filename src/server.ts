import { Application, Request, Response, json, urlencoded } from 'express'
import cors from 'cors'
import { mainRouter } from './routes'
import morgan from 'morgan'

import errorHandler from './utils/errorHandler'
export default class Server {
    constructor(app: Application) {
        this.config(app)
    }

    public config(app: Application): void {
        app.use(urlencoded({ extended: true }))
        app.use(morgan('dev'))

        app.use(json())

        app.use(cors())
        // test()

        app.use('/api', mainRouter)
        app.use('/*', (req: Request, res: Response) => {
            return res.status(404).send({
                message: 'Route not found',
            })
        })

        app.use(errorHandler)
    }
}
