import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || ''

export const jwtAccessToken = {
    SECRET_KEY: process.env.AT_SECRET_KEY || 'Das@123',
    EXPIRE: process.env.AT_EXPIRE || '1d',
}

export const jwtRefreshToken = {
    SECRET_KEY: process.env.RT_SECRET_KEY || 'Das@132!3(7',
    EXPIRE: process.env.RT_EXPIRE || '10d',
}

export const ADMIN = 'Admin'

export const SALT_ROUND = process.env.SALT_ROUND || 10

export const awsConfig = {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
}

export const nodeMailerCredentials = {
    USER_NAME: 'vishdas111@gmail.com',
    APP_PASSWORD: process.env.APP_PASSWORD || 'vvBB1@2000',
}

export const emailConfig = {
    SUBJECT: 'SVM (Credentials)',
}
