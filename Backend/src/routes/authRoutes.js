import express from 'express'
import { userAuthController } from '../controllers/authController.js'
import userAuthMiddleware from '../middleware/userAuthMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const authRouter = express.Router()

//register, login , logout, getprofile
const {
  registerUser,
  login,
  logout,
  registerAdmin,
  checkAuth,
  updateProfile,
  getProfile,
  googleLogin,
  verifyOtp,
  resendOtp,
  resetPassword,
  forgotPassword,
  deleteProfile,
} = userAuthController

authRouter.post('/user/register', registerUser)
authRouter.post('/admin/register', adminMiddleware, registerAdmin)
authRouter.post('/login', login)
authRouter.post('/google-login', googleLogin)
authRouter.post('/logout', userAuthMiddleware, logout)

//authRouter.post('/deleteProfile', userAuthMiddleware, logout)
authRouter.get('/check-auth', userAuthMiddleware, checkAuth)
authRouter.patch('/user/update', userAuthMiddleware, updateProfile)
authRouter.get('/user/profile', userAuthMiddleware, getProfile)
authRouter.post('/user/delete-account', userAuthMiddleware, deleteProfile)

// ✅ OTP Verification Routes
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/resend-otp', resendOtp)

// ✅ Reset Password Route
authRouter.post('/reset-password', resetPassword)
authRouter.post('/forgot-password', forgotPassword)
export default authRouter
