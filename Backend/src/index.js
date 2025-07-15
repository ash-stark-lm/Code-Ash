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
const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookies / headers
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/problem', problemRouter)
app.use('/submission', submitRouter)
app.use('/herby', aiRouter)

const initializeConnection = async () => {
  try {
    await Promise.all([redisClient.connect(), dbConnection()])
    console.log('Connected to redis and mongoDB')

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
initializeConnection()
