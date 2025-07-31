import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EyeIcon, EyeOffIcon, LogIn, Terminal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../authSlice.js'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import GoogleLoginButton from '../components/GoogleLogin.jsx'
import { googleLogin } from '../authSlice.js'
import GridGlow from '../components/GridGlow.jsx'
import { toast } from 'react-toastify'

// Schema Validation
const loginSchema = z.object({
  emailId: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword((prev) => !prev)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap()
    } catch (err) {
      toast.error(err || 'Invalid email or password')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200 },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8 relative">
      <AnimatePresence>{loading && <LoadingOverlay />}</AnimatePresence>
      <GridGlow />
      <motion.div
        className="w-full max-w-6xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Left Form */}
        <div className="p-6 sm:p-10 md:p-12">
          <motion.div
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
              <Terminal className="text-[#0FA] drop-shadow-lg" size={24} />
              <span>
                Code<span className="text-[#0FA]">Ash</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Ready to continue where you left off?
            </p>
          </motion.div>

          <motion.form
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit(onSubmit)}
          >
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-neutral-300 mb-1 block">
                Email
              </label>
              <input
                {...register('emailId')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-white"
              />
              {errors.emailId && (
                <p className="text-red-500 text-sm">{errors.emailId.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-neutral-300 mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pr-12 text-white focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.div variants={itemVariants} className="pt-2 space-y-4">
                <motion.button
                  type="submit"
                  className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:opacity-90 transition cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  Log In
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-neutral-900 px-2 text-neutral-500">
                      or
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <GoogleLoginButton
                    onSuccess={({ credential }) => {
                      dispatch(googleLogin(credential))
                        .unwrap()
                        .then(() => navigate('/'))
                        .catch((err) => {
                          console.error('Google login failed:', err)
                        })
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.form>

          <motion.div
            className="mt-8 text-center text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side Visuals */}
        <div className="hidden lg:flex relative bg-neutral-900 overflow-hidden items-center justify-center p-6">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl opacity-20 z-0" />
          <div className="absolute z-0 grid grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <TypeAnimation
              sequence={['Welcome Back', 2000, '', 1000]}
              wrapper="h3"
              speed={20}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
              repeat={Infinity}
            />
            <p className="text-neutral-400 text-base sm:text-lg mt-2">
              Dive back into code mastery!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
