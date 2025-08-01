import express from 'express'
import 'dotenv/config'
import dbConnection from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'
import redisClient from './config/redis.js'
import problemRouter from './routes/problemRoutes.js'
import submitRouter from './routes/submitRoutes.js'
import cors from 'cors'
import aiRouter from './routes/chatRouter.js'

import editorialRouter from './routes/editorialRoutes.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      process.env.CORS_ORIGIN_TEST,
      process.env.CORS_ORIGIN_TEST2,
    ].filter(Boolean),
    credentials: true, // allow cookies / headers
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/problem', problemRouter)
app.use('/submission', submitRouter)
app.use('/herby', aiRouter)
app.use('/editorial', editorialRouter)

const initializeConnection = async () => {
  try {
    await Promise.all([redisClient.connect(), dbConnection()])
    console.log('Connected to redis and mongoDB')

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
initializeConnection()
