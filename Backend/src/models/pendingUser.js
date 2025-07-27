import mongoose from 'mongoose'

const pendingUserSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // auto-delete after 5 mins
    },
  },
  { timestamps: true }
)

export const PendingUser = mongoose.model('PendingUser', pendingUserSchema)
