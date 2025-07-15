import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'problems',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['c++', 'c', 'java', 'python', 'javascript'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong answer', 'error'],
      default: 'pending',
    },
    runTime: {
      type: Number, // milliseconds
      default: 0,
    },
    memory: {
      type: Number, // kB
      default: 0,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      // Recommended addition
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)
//1-> ascending order and -1-> descending
//userId in sorted form -> we can do query on it too in optimized way 

submissionSchema.index({ userId: 1, problemId: 1 }, { unique: true })

const Submission = mongoose.model('submission', submissionSchema)

export default Submission
