// controllers/editorialController.js

import Editorial from '../models/editorial.js'
import User from '../models/users.js'
const addEditorial = async (req, res) => {
  try {
    const { problemId } = req.params
    const { content } = req.body
    const author = req.result._id // Assuming auth middleware sets

    const newEditorial = new Editorial({
      problemId,
      author,
      content,
    })

    await newEditorial.save()

    res.status(201).json({
      message: 'Editorial posted successfully',
      editorial: newEditorial,
    })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to post editorial', details: err.message })
  }
}

const getEditorialsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params

    const editorials = await Editorial.find({ problemId })
      .populate('author', 'firstName') // Or 'name', etc.
      .populate('replies.author', 'firstName') // <-- Add this
      .sort({ createdAt: -1 })

    res.status(200).json(editorials)
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch editorials', details: err.message })
  }
}
const toggleUpvoteEditorial = async (req, res) => {
  try {
    const { editorialId } = req.params
    const userId = req.result._id

    const editorial = await Editorial.findById(editorialId)

    if (!editorial) {
      return res.status(404).json({ error: 'Editorial not found' })
    }

    const alreadyUpvoted = editorial.upvotes.includes(userId)

    if (alreadyUpvoted) {
      editorial.upvotes.pull(userId)
    } else {
      editorial.upvotes.push(userId)
    }

    await editorial.save()

    res
      .status(200)
      .json({ upvoted: !alreadyUpvoted, upvoteCount: editorial.upvotes.length })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to toggle upvote', details: err.message })
  }
}

const replyToEditorial = async (req, res) => {
  try {
    const { editorialId } = req.params
    const userId = req.result._id
    const { content } = req.body

    const editorial = await Editorial.findById(editorialId)
    if (!editorial) {
      return res.status(404).json({ error: 'Editorial not found' })
    }

    editorial.replies.push({ content, author: userId })
    await editorial.save()

    res.status(200).json({ message: 'Reply added successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply', details: err.message })
  }
}

export const editorialController = {
  addEditorial,
  getEditorialsByProblem,
  toggleUpvoteEditorial,
  replyToEditorial,
}
