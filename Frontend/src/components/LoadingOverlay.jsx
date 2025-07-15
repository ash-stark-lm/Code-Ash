import { motion } from 'framer-motion'
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

export default LoadingOverlay
