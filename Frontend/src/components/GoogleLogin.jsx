// components/GoogleLoginButton.jsx
import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'

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
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-full shadow hover:opacity-90 transition"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </motion.button>
  )
}

export default GoogleLoginButton
