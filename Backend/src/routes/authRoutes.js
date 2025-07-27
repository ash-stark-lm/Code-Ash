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

// ✅ OTP Verification Routes
authRouter.post('/verify-otp', verifyOtp)
export default authRouter
