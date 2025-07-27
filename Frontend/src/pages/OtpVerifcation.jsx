import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { verifyOTP } from '../authSlice.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import { motion } from 'framer-motion'
import axiosClient from '../utils/axiosClient.js'
import GridGlow from '../components/GridGlow.jsx'

const otpSchema = z.object({
  emailId: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const OtpVerification = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, user } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('') // Changed from username
  const [password, setPassword] = useState('')
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const [cooldown, setCooldown] = useState(0) // Track remaining cooldown time

  useEffect(() => {
    if (location?.state?.emailId) {
      setEmail(location.state.emailId)
      setFirstName(location.state.firstName || '') // Changed from username
      setPassword(location.state.password || '')
    } else if (user?.emailId) {
      setEmail(user.emailId)
    } else {
      toast.error('No email found for verification!')
      navigate('/signup')
    }
  }, [location, user, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      emailId: email,
      otp: '',
    },
  })

  useEffect(() => {
    setValue('emailId', email)
  }, [email, setValue])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return // only digits

    const newOtp = [...otpArray]
    newOtp[index] = value
    setOtpArray(newOtp)

    // Move to next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    setValue('otp', newOtp.join(''))
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onSubmit = async () => {
    const otp = otpArray.join('')

    try {
      const res = await dispatch(
        verifyOTP({
          emailId: email,
          otp,
          firstName, // Changed from username
          password,
        })
      ).unwrap()

      if (res?._id) {
        toast.success('OTP Verified. Logged in!')
        navigate('/')
      }
    } catch (error) {
      toast.error(error || 'OTP verification failed')
    }
  }
  // Function to handle resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await axiosClient.post('/auth/resend-otp', {
        emailId: email,
      })
      if (response.data.success) {
        toast.success('New OTP sent!')
        setCooldown(30) // Start 30-second cooldown
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
      if (error.response?.data?.message.includes('wait')) {
        setCooldown(Math.ceil(error.response.data.message.match(/\d+/)[0]))
      }
    }
  }

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden">
      {loading && <LoadingOverlay />}

      {/* Background Grid Glow */}
      <GridGlow />

      {/* OTP Form */}
      <motion.div
        className="bg-[#111] p-10 rounded-2xl shadow-lg z-10 w-full max-w-md space-y-6 border border-[#1f1f1f]"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <h2 className="text-3xl font-bold text-[#0FA] text-center">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...register('emailId')} value={email} />
          <input type="hidden" {...register('otp')} value={otpArray.join('')} />

          <div className="text-center text-sm text-gray-400 mb-2">
            OTP sent to <span className="text-white">{email}</span>
          </div>

          <div className="flex justify-center gap-3">
            {otpArray.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-2xl bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#0FA]"
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-red-500 text-sm mt-1 text-center">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#0FA] hover:bg-[#0c5] text-black font-semibold py-2 rounded-lg transition duration-200"
          >
            Verify OTP
          </button>

          {/* Resend OTP Button with Cooldown */}
          <div className="text-center pt-2">
            <motion.button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0}
              className={`text-sm ${
                cooldown > 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-[#0FA] hover:underline cursor-pointer'
              }`}
              whileTap={cooldown > 0 ? {} : { scale: 0.95 }}
            >
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Didn't receive code? Resend OTP"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default OtpVerification
