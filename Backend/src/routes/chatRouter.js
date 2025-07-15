import express from 'express'

import userAuthMiddleware from '../middleware/userAuthMiddleware.js'
import solveDoubt from '../controllers/solveDoubt.js'

const aiRouter = express.Router()
aiRouter.use('/chat', userAuthMiddleware, solveDoubt)

export default aiRouter
