import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import LoadingOverlay from '../components/LoadingOverlay'
import { Terminal } from 'lucide-react'
import axiosClient from '../utils/axiosClient'
import GridGlow from '../components/GridGlow'

const forgotSchema = z.object({
  emailId: z.string().email('Enter a valid email'),
})

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await axiosClient.post('/auth/forgot-password', {
        emailId: data.emailId,
      })

      if (res.data.success) {
        toast.success('Reset link sent! Check your email.')
      } else {
        toast.error(res.data.message || 'Failed to send link.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative flex flex-col items-center justify-center px-4 text-white overflow-hidden">
      {loading && <LoadingOverlay />}
      <GridGlow />

      {/* Top animated welcome message */}
      <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-10 md:top-20 w-full text-center z-0 pointer-events-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Forgot your password?
            <br />
            <span className="text-xl md:text-2xl font-medium mt-2 block">
              Receive a reset link and regain access to{' '}
              <span>
                Code<span className="text-[#0FA]">Ash</span>
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Form card */}
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

          <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
          <p className="text-neutral-400 mb-6">
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm block mb-1">Email address</label>
              <input
                type="email"
                {...register('emailId')}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#0FA]"
                placeholder="you@example.com"
              />
              {errors.emailId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0FA] text-black font-semibold rounded-lg hover:bg-[#0c7] transition cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-sm text-center text-neutral-400 mt-6">
            Remembered it?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Go to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
