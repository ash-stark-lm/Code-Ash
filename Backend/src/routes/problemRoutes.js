import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import userAuthMiddleware from '../middleware/userAuthMiddleware.js'
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  allSolvedProblemsByUser,
  submittedSolutions,
  getAcceptedSubmissions,
} from '../controllers/problemController.js'
const problemRouter = express.Router()

//CREATE, FETCH, UPDATE, DELETE
//These 3 will require admin access =>admin middleware
problemRouter.post('/create', adminMiddleware, createProblem)
problemRouter.put('/update/:id', adminMiddleware, updateProblem)
problemRouter.delete('/:id', deleteProblem)

//Anyone admin/user can access these

problemRouter.get('/', userAuthMiddleware, getAllProblems)
problemRouter.get('/user', userAuthMiddleware, allSolvedProblemsByUser)
problemRouter.get('/:id', userAuthMiddleware, getProblemById)
//now so many users therefore it will take too much time to find so we will do compund indexing
//Do indexing of the fields on whom queries are being used very much

problemRouter.get('/submissions/:pid', userAuthMiddleware, submittedSolutions)
problemRouter.get(
  '/accepted-submissions/:userId',
  userAuthMiddleware,
  getAcceptedSubmissions
)

export default problemRouter
