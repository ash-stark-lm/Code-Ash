import { createClient } from 'redis'
import 'dotenv/config'

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_CONNECT_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
})

export default redisClient
