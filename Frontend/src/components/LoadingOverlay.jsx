import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const LoadingOverlay = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Layered Glowing Core with Icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute w-72 h-72 rounded-full bg-[#0FA]/10 blur-[90px]" />
        <div className="absolute w-52 h-52 rounded-full bg-[#0FA]/20 blur-3xl animate-pulse" />

        {/* Spinning Rings */}
        <div className="absolute w-44 h-44 rounded-full border-t-4 border-[#0FA] opacity-60 animate-spin-slow" />
        <div className="absolute w-36 h-36 rounded-full border-b-2 border-[#0FA]/60 animate-spin-reverse-slower opacity-40" />

        {/* Center Lock Icon with Flicker + Pulse */}
        <motion.div
          className="z-10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-12 h-12 text-[#0FA] drop-shadow-[0_0_8px_#0FA]" />
        </motion.div>
      </div>

      {/* Glowing Bouncing Dots */}
      <div className="mt-20 flex space-x-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-[#0FA] shadow-[0_0_12px_#0FA]"
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Typewriter-like Terminal Text */}
      <motion.div className="mt-10 flex text-[#0FA] font-mono text-sm">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Connecting to CodeAsh
        </motion.span>
        <motion.span
          className="ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▍
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export default LoadingOverlay
