// components/GoogleLoginButton.jsx
import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'
import GoogleIcon from '../assets/google-icon.svg'
const GoogleLoginButton = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (onSuccess) onSuccess(tokenResponse)
    },
    onError: () => console.error('Google Sign‑In failed'),
    flow: 'implicit', // or 'auth-code' if you’re exchanging on the backend
  })

  return (
    <motion.button
      onClick={login}
      className="w-full flex items-center justify-center gap-3 bg-neutral-800 border border-neutral-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-neutral-700 transition duration-150 ease-in-out cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={GoogleIcon} alt="Google icon" className="w-5 h-5" />
      <span>Continue with Google</span>
    </motion.button>
  )
}

export default GoogleLoginButton
