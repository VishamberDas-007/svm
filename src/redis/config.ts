import redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()
// const renderURL = process.env.REDIS_URL

const renderRedis = new redis()

renderRedis.on('connect', () => {
    console.log('Connected to Redis')
})

export const setValueInRedis = async (obj: any) => {
    await renderRedis.set('apple', 10)
}

export const getValueInRedis = async (key: string) => {
    await renderRedis.get(key)
}

export { renderRedis }
