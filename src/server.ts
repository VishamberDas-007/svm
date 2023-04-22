import { Application, json, urlencoded } from 'express'
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

        app.use(errorHandler)
    }
}
