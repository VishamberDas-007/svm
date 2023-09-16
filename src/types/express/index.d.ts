import { TAccessToken } from '../global.types'

declare global {
    namespace Express {
        export interface Request {
            user?: TAccessToken
        }
    }
}
