import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Terminal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../authSlice'
import GoogleLoginButton from '../components/GoogleLogin.jsx'
import { googleLogin } from '../authSlice.js'
import { toast } from 'react-toastify'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

const signupSchema = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters'),
    emailId: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must include one uppercase letter, one lowercase letter, and one symbol'
      ),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePassword = () => setShowPassword((prev) => !prev)
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(
        registerUser({
          firstName: data.firstName,
          emailId: data.emailId,
          password: data.password,
        })
      ).unwrap()

      if (res.success) {
        toast.success('OTP sent! Please check your email.')
        navigate('/verifyOTP', {
          state: {
            emailId: data.emailId,
            firstName: data.firstName, // Changed from username
            password: data.password,
          },
        })
      }
    } catch (error) {
      toast.error(error?.message || 'Registration failed')
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

  const LoadingOverlay = () => (
    <motion.div
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex space-x-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
              repeat: Infinity,
              repeatType: 'loop',
            },
          },
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-white rounded-full"
            variants={{
              hidden: { scale: 0, opacity: 0.3 },
              visible: {
                scale: [1, 1.4, 1],
                opacity: [0.3, 1, 0.3],
                transition: {
                  duration: 0.8,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                },
              },
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 overflow-hidden relative">
      <AnimatePresence>{loading && <LoadingOverlay />}</AnimatePresence>
      <motion.div
        className="w-full max-w-5xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="p-8 sm:p-10 md:p-12">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <Terminal className="text-[#0FA] drop-shadow-lg" size={28} />
              <span>
                Code<span className="text-[#0FA]">Ash</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-100 mb-2">
              Create Your Account
            </h2>
            <p className="text-neutral-400">Join our community of coders</p>
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
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                placeholder="John"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-white"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </motion.div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-neutral-300 mb-1 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pr-12 text-white focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:opacity-90 transition cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                Create Account
              </motion.button>

              <div className="relative mt-2 mb-2">
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
          </motion.form>

          <motion.div
            className="mt-8 text-center text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

        <div className="hidden lg:flex relative bg-neutral-900 overflow-hidden items-center justify-center">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl opacity-20 z-0"></div>
          <div className="absolute z-0 grid grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner"
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
              sequence={['Hello, there', 2000, '', 1000]}
              wrapper="h3"
              speed={20}
              className="text-4xl font-bold text-white mb-4"
              repeat={Infinity}
            />
            <p className="text-neutral-400 text-lg mt-2">
              Be a part of our community
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
