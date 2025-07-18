// components/GoogleLoginButton.jsx
import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'

const GoogleLoginButton = ({ onSuccess }) => {
  const handleSuccess = (credentialResponse) => {
    if (onSuccess) onSuccess(credentialResponse)
  }

  return (
    <motion.div
      className="w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error('Google Sign‑In failed')}
        theme="filled_black"
        shape="pill"
        text="continue_with"
        size="large"
        logo_alignment="left"
      />
    </motion.div>
  )
}

export default GoogleLoginButton
