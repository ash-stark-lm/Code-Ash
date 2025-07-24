// models/Editorial.js

import mongoose from 'mongoose'
import { Schema } from 'mongoose'

// models/Editorial.js

const editorialSchema = new Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'problems',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    replies: [
      {
        content: { type: String, required: true },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

const Editorial = mongoose.model('Editorial', editorialSchema)
export default Editorial
