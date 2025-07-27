import User from '../models/users.js'
import Hashing from '../utils/hashPassword.js'
import validateUser from '../utils/validator.js'
import partialValidUser from '../utils/partialValidateUser.js'
import jwt from 'jsonwebtoken'
import redisClient from '../config/redis.js'
import Submission from '../models/submission.js'
import { OAuth2Client } from 'google-auth-library'
import Otp from '../models/otp.js'
import { sendOtpEmail } from '../utils/sendEmail.js'
import { PendingUser } from '../models/pendingUser.js'
import 'dotenv/config'
import { sendResetPasswordEmail } from '../utils/sendEmail.js'

const sendOtp = async (req, res) => {
  try {
    const { emailId, firstName, password } = req.body // Changed username to firstName

    if (!emailId || !firstName || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Already registered?
    const existing = await User.findOne({ emailId })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Save pending user (overwrite if already exists)
    const hashedPassword = await Hashing(password)
    await PendingUser.findOneAndUpdate(
      { emailId },
      { firstName, emailId, password: hashedPassword }, // Changed username to firstName
      { upsert: true, new: true }
    )

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

    await Otp.findOneAndDelete({ email: emailId }) // Remove old OTPs
    await Otp.create({ email: emailId, otp, expiresAt })

    await sendOtpEmail(emailId, otp)

    return res.status(200).json({
      success: true,
      message: 'OTP sent. Please verify to complete registration.',
      emailId,
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || 'Failed to send OTP' })
  }
}

const registerUser = async (req, res) => {
  try {
    validateUser(req.body)
    const { emailId, firstName, password } = req.body // Changed username to firstName

    if (!emailId || !firstName || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existing = await User.findOne({ emailId })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Just forward request to sendOtp
    await sendOtp(req, res) // Let sendOtp handle pending user + otp + email
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const verifyOtp = async (req, res) => {
  // console.log('Received payload:', req.body) // Add this
  try {
    const { emailId, otp } = req.body

    if (!emailId || !otp) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const otpEntry = await Otp.findOne({ email: emailId })
    if (!otpEntry) {
      return res
        .status(400)
        .json({ message: 'OTP not found. Please request again.' })
    }

    if (Date.now() > new Date(otpEntry.expiresAt).getTime()) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' })
    }

    // Check pending user
    const pendingUser = await PendingUser.findOne({ emailId })
    if (!pendingUser) {
      return res.status(400).json({ message: 'No user found for verification' })
    }

    // Create actual user with all fields
    const user = await User.create({
      firstName: pendingUser.firstName, // Changed username to firstName
      emailId: pendingUser.emailId,
      password: pendingUser.password,
      isVerified: true,
      role: 'user',
    })

    // Clean up
    await PendingUser.deleteOne({ emailId })
    await Otp.deleteMany({ email: emailId })

    const token = user.getJWT()
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    return res.status(201).json({
      success: true,
      message: 'Email verified and account created.',
      user: {
        _id: user._id,
        emailId: user.emailId,
        role: user.role,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
// authController.js
const resendOtp = async (req, res) => {
  try {
    const { emailId } = req.body

    // Check if OTP was recently sent (cooldown)
    const lastOtp = await Otp.findOne({ email: emailId }).sort({
      createdAt: -1,
    })

    if (lastOtp) {
      const cooldownTime = 30 * 1000 // 30 seconds cooldown
      const timeSinceLastOtp =
        Date.now() - new Date(lastOtp.createdAt).getTime()

      if (timeSinceLastOtp < cooldownTime) {
        const remainingTime = Math.ceil(
          (cooldownTime - timeSinceLastOtp) / 1000
        )
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
        })
      }
    }

    // Check if pending user exists
    const pendingUser = await PendingUser.findOne({ emailId })
    if (!pendingUser) {
      return res.status(400).json({ message: 'No pending registration found.' })
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins expiry

    // Delete old OTPs and save new one
    await Otp.findOneAndDelete({ email: emailId })
    await Otp.create({ email: emailId, otp, expiresAt })

    // Resend OTP email
    await sendOtpEmail(emailId, otp)

    return res.status(200).json({
      success: true,
      message: 'New OTP sent successfully.',
    })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to resend OTP.' })
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
  try {
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
      _id: userId,
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

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password required' })
    }

    // ✅ Manual password strength validation
    const hasMinLength = newPassword.length >= 8
    const hasLowercase = /[a-z]/.test(newPassword)
    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasSymbol = /[^A-Za-z0-9]/.test(newPassword)

    if (!hasMinLength || !hasLowercase || !hasUppercase || !hasSymbol) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one symbol.',
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const hashedPassword = await Hashing(newPassword)
    user.password = hashedPassword
    await user.save()

    return res.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body

    if (!emailId) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ emailId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create reset token with 15 min expiry
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '15m',
    })

    // Use environment-specific frontend URL
    const resetLink = `${process.env.CORS_ORIGIN_TEST}/reset-password/${token}`

    // Send HTML email
    await sendResetPasswordEmail(emailId, resetLink)

    res.status(200).json({ success: true, message: 'Reset email sent' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ message: 'Internal server error' })
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
  verifyOtp,
  resendOtp,
  resetPassword,
  forgotPassword,
}
