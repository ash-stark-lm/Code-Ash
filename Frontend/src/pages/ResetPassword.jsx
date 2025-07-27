import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import LoadingOverlay from '../components/LoadingOverlay'
import axiosClient from '../utils/axiosClient'
import GridGlow from '../components/GridGlow'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await axiosClient.post(`/auth/reset-password`, {
        token,
        newPassword: data.password,
      })

      if (res.data.success) {
        toast.success('Password reset successful! You can now login.')
        navigate('/login')
      } else {
        toast.error(res.data.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      {loading && <LoadingOverlay />}

      <GridGlow />
      <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-10 md:top-20 w-full text-center z-0 pointer-events-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Reset your password
            <br />
            <span className="text-xl md:text-2xl font-medium mt-2 block text-neutral-400">
              to continue using{' '}
              <span className="text-white">
                Code<span className="text-[#0FA]">Ash</span>
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Card - lowered with margin */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 shadow-[0_0_30px_#0FA3] rounded-2xl p-8 sm:p-10 w-full max-w-md mt-40"
        >
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="text-[#0FA]" />
            <h1 className="text-xl font-bold text-white">
              Code<span className="text-[#0FA]">Ash</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-neutral-400 mb-6">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="text-sm text-white block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pr-12 text-white focus:ring-2 focus:ring-[#0FA]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-white block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 pr-12 text-white focus:ring-2 focus:ring-[#0FA]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0FA] text-black font-semibold rounded-lg hover:bg-[#0c7] transition"
            >
              Reset Password
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword
