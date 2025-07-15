import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      lowercase: true,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },

    age: {
      type: Number,

      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'problems',
        },
      ],
      unique: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      maxlength: 70,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = function () {
  const token = jwt.sign(
    { _id: this._id, emailId: this.emailId, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '1h', //valid for 1hr
    }
  )
  return token
}

userSchema.methods.verifyPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

userSchema.statics.verifyJWT = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

const User = mongoose.model('users', userSchema)

export default User
