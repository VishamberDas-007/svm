import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

export const redisClient = (async () => {
    const client = createClient({
        url: process.env.REDIS_URL,
    })

    client.on('error', (err) => console.log('Redis Client Error', err))

    await client.connect()

    // Send and retrieve some values
    await client.set('key', 'node redis')
    const value = await client.get('key')

    console.log('found value: ', value)
})()
