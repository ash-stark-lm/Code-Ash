import validateProblem from '../utils/validator.js'
import Problem from '../models/problems.js'
import validReferenceSolution from '../utils/referenceSolutionValid.js'
import { get } from 'mongoose'
import User from '../models/users.js'
import Submission from '../models/submission.js'

//only admin can create problem->adminMiddleware used
const createProblem = async (req, res) => {
  //validateProblem(req.body)
  try {
    //validate the data

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      problemCreator,
      starterCode,
      referenceSolution,
    } = req.body
    //should i directly store these in database->No
    //first check referenceSolution if its valid or not

    //check on visibleTestCases and hiddenTestCases->judge0
    const isValid = await validReferenceSolution(
      referenceSolution,
      visibleTestCases
    )

    if (!isValid) {
      return res.status(400).send('Invalid Reference Solution')
    }
    //Now we know that referenceSolution is valid save it in Database

    await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    })
    res.status(201).send('Problem Created Successfully')
  } catch (error) {
    res.status(500).send(error.message)
  }
}

//admin can updaet the problem whatever he wants
//updated problem should be valid
const updateProblem = async (req, res) => {
  const { id } = req.params
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    problemCreator,
    starterCode,
    referenceSolution,
  } = req.body
  try {
    if (!id) {
      return res.status(400).send('Missing Id')
    }
    const dsaProblem = await Problem.findById(id)
    if (!dsaProblem) {
      return res.status(404).send('Problem not found')
    }
    const isValid = await validReferenceSolution(
      referenceSolution,
      visibleTestCases
    )

    if (!isValid) {
      return res.status(400).send('Invalid Reference Solution')
    }
    // If referenceSolution is being updated, validate it using visibleTestCases
    await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    )
    res.status(200).send('Problem Updated Successfully')
  } catch (error) {
    console.error('Update Error:', error)
    res.status(400).send(error.message)
  }
}

const deleteProblem = async (req, res) => {
  const { id } = req.params
  try {
    if (!id) {
      return res.status(400).send('Missing Id')
    }
    const deletedProblem = await Problem.findByIdAndDelete(id)
    if (!deletedProblem) {
      return res.status(404).send('Problem not found')
    }
    res.status(200).send('Problem Deleted Successfully')
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const getProblemById = async (req, res) => {
  const { id } = req.params
  try {
    if (!id) {
      return res.status(400).send('Missing Id')
    }
    const getProblem = await Problem.findById(id).select(
      '_id title description difficulty tags visibleTestCases   starterCode referenceSolution'
    )
    if (!getProblem) {
      return res.status(404).send('Problem not found')
    }
    res.status(200).send(getProblem)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// const getAllProblems = async (req, res) => {
//   try {
//     //fetch 20 problems at once-> pagination good practice
//     //const getProblem = await Problem.find().skip(skip).limit(10)

//     const getProblem = await Problem.find({}).select(
//       '_id title  difficulty tags '
//     )
//     if (getProblem.length == 0) {
//       return res.status(404).send('Problems not found')
//     }
//     res.status(200).send(getProblem)
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error.message)
//   }
// }

const getAllProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 // default: page 1
    const limit = parseInt(req.query.limit) || 10 // default: 20 problems per page
    const skip = (page - 1) * limit

    const total = await Problem.countDocuments() // total number of problems
    const problems = await Problem.find({})
      .select('_id title difficulty tags')
      .skip(skip)
      .limit(limit)

    if (problems.length === 0) {
      return res.status(404).json({ message: 'No problems found' })
    }

    res.status(200).json({
      problems,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProblems: total,
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const allSolvedProblemsByUser = async (req, res) => {
  //i want to have all the problems also tags title description difficulty
  //i have reference of problem
  const userId = req.result._id
  //use populate method
  const user = await User.findById(userId).populate({
    path: 'problemSolved',
    select: '_id title  difficulty tags ',
  })
  return res.status(200).send(user.problemSolved)
}

const submittedSolutions = async (req, res) => {
  try {
    const userId = req.result._id
    const problemId = req.params.pid

    const ans = await Submission.find({ userId, problemId })
    if (ans.length == 0) res.status(200).send('No submission found')
    else res.status(200).send(ans)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  allSolvedProblemsByUser,
  submittedSolutions,
}
