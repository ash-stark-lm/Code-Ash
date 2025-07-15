import express from 'express'
import userAuthMiddleware from '../middleware/userAuthMiddleware.js'
import { submitCode, runCode } from '../controllers/userSubmission.js'
const submitRouter = express.Router()

submitRouter.post('/:id', userAuthMiddleware, submitCode)
submitRouter.post('/run/:id', userAuthMiddleware, runCode) //user id problem id required

export default submitRouter
