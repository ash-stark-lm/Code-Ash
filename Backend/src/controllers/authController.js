import User from '../models/users.js'
import Hashing from '../utils/hashPassword.js'
import validateUser from '../utils/validator.js'
import partialValidUser from '../utils/partialValidateUser.js'
import jwt from 'jsonwebtoken'
import redisClient from '../config/redis.js'
import Submission from '../models/submission.js'
import { OAuth2Client } from 'google-auth-library'

const registerUser = async (req, res) => {
  //first validate the data sent by user
  try {
    validateUser(req.body)
    //hash the password using bcrypt
    req.body.password = await Hashing(req.body.password) //now password is hashed
    //can't give anyone to become admin even if the user sends role as admin
    req.body.role = 'user'
    const user = await User.create(req.body)

    //jwt token
    const token = await user.getJWT()
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    }

    res.status(201).json({
      user: reply,
      success: true,
      message: 'User registered In Successfully',
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

//only an admin can register the admin and he can register user also

const registerAdmin = async (req, res) => {
  try {
    validateUser(req.body)
    req.body.password = await Hashing(req.body.password)
    const user = await User.create(req.body)

    const token = await user.getJWT()
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    }

    res.status(201).json({
      user: reply,
      success: true,
      message: `${user.role} registered  Successfully`,
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const login = async (req, res) => {
  console.log('Inside login')
  try {
    console.log('Login attempt with body:', req.body)
    //first  emailId ->lowercase
    const { emailId, password } = req.body
    const normalizedEmail = emailId.toLowerCase()
    //validate it too
    if (!emailId || !password)
      throw new Error('Email and Password are required')
    partialValidUser(req.body)
    const user = await User.findOne({ emailId: normalizedEmail })
    if (!user) throw new Error('User not found')
    if (user.emailId !== emailId) {
      throw new Error('Invalid Credentials')
    }
    //for password
    const isMatch = await user.verifyPassword(password)
    if (!isMatch) {
      throw new Error('Invalid Credentials')
    }

    //give user a new jwt token
    const token = await user.getJWT()
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,

      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    }

    res.status(201).json({
      user: reply,
      success: true,
      message: 'User Logged In Successfully',
    })
  } catch (error) {
    console.log('Login error:', error.message)
    res.status(401).send({
      error: error.message,
    })
  }
}

//google login
// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleLogin = async (req, res) => {
  const { token } = req.body

  try {
    if (!token) throw new Error('No token provided')

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, name, sub } = payload

    let user = await User.findOne({ emailId: email.toLowerCase() })
    const hashed_password = await Hashing('GOOGLE_AUTH_PASSWORD') // Placeholder password for Google Auth

    // Create new user if not exists
    if (!user) {
      user = await User.create({
        firstName: name,
        emailId: email.toLowerCase(),
        password: hashed_password,
        role: 'user',
        googleId: sub,
      })
    }

    // Generate JWT
    const jwtToken = await user.getJWT()

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    }

    res.status(200).json({
      user: reply,
      success: true,
      message: 'Google Login Successful',
    })
  } catch (error) {
    console.error('Google login error:', error.message)
    res.status(401).json({ error: 'Google Login Failed' })
  }
}

const logout = async (req, res) => {
  //we need to block their jwt

  const { token } = req.cookies

  const payload = jwt.decode(token)

  await redisClient.set(`token: ${token}`, 'blocked')
  //await redisClient.expire(`token: ${token}`) //after 30 min token gets deleted from db
  await redisClient.expireAt(`token: ${token}`, payload.exp)
  res.clearCookie('token')
  res.send('Logged Out Successfully')
}

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id
    //userSchema se delete
    await User.findByIdAndDelete(userId)
    //delete from submission model too
    Submission.deleteMany({ user: userId }) //delete all submission of that user from db
    res.status(200).send('Profile Deleted Successfully')
  } catch (error) {
    res.status(500).send(error.message)
  }
}
const updateProfile = async (req, res) => {
  try {
    const userId = req.result._id

    await User.findByIdAndUpdate(userId, req.body, { runValidators: true })

    res.status(200).send('Profile Updated Successfully')
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const getProfile = async (req, res) => {
  try {
    const userId = req.result._id // ✅ from auth middleware
    const user = await User.findById(userId).populate({
      path: 'problemSolved',
      select: 'title', // only fetch problem title
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const reply = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      role: user.role,
      age: user.age ?? null,
      gender: user.gender ?? null,
      problemSolved: user.problemSolved ?? [],
    }

    return res.status(200).json(reply)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error while fetching profile' })
  }
}

const checkAuth = async (req, res) => {
  try {
    if (!req.result) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const reply = {
      firstName: req.result.firstName,
      emailId: req.result.emailId,
      _id: req.result._id,
      role: req.result.role,
    }

    res.status(200).json({
      user: reply,
      success: true,
      message: 'Valid User',
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export const userAuthController = {
  registerUser,
  login,
  logout,
  registerAdmin,
  deleteProfile,
  checkAuth,
  updateProfile,
  getProfile,
  googleLogin,
}
