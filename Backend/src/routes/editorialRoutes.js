import express from 'express'
import userAuthMiddleware from '../middleware/userAuthMiddleware.js'
import { editorialController } from '../controllers/editorialController.js'

const {
  addEditorial,
  getEditorialsByProblem,
  toggleUpvoteEditorial,
  replyToEditorial,
} = editorialController

const editorialRouter = express.Router()

editorialRouter.post('/:problemId', userAuthMiddleware, addEditorial)
editorialRouter.get('/:problemId', userAuthMiddleware, getEditorialsByProblem)
editorialRouter.post(
  '/upvote/:editorialId',
  userAuthMiddleware,
  toggleUpvoteEditorial
)
editorialRouter.post(
  '/reply/:editorialId',
  userAuthMiddleware,
  replyToEditorial
)

export default editorialRouter
