import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || ''

export const JWT = {
    SECRET_KEY: 'Das',
}
