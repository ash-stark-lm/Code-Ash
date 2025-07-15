import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StackVisualizer = () => {
  const [stack, setStack] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [topValue, setTopValue] = useState(null)
  const [stackSizeDisplay, setStackSizeDisplay] = useState(null)

  const handlePush = () => {
    if (inputValue.trim() === '') return
    setStack((prev) => [...prev, inputValue.trim()])
    setInputValue('')
    setTopValue(null)
    setStackSizeDisplay(null)
  }

  const handlePop = () => {
    if (stack.length === 0) return
    setStack((prev) => prev.slice(0, -1))
    setTopValue(null)
    setStackSizeDisplay(null)
  }

  const handleTop = () => {
    if (stack.length === 0) {
      setTopValue(null)
      return
    }
    setTopValue(stack[stack.length - 1])
    setStackSizeDisplay(null)
  }

  const handleSize = () => {
    setStackSizeDisplay(stack.length)
    setTopValue(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0A0A0A] to-black text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Stack Visualizer</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-10">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none placeholder:text-white/50"
          placeholder="Enter value"
        />
        <button
          onClick={handlePush}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
        >
          Push
        </button>
        <button
          onClick={handlePop}
          className="bg-rose-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#f43f5e] transition cursor-pointer"
        >
          Pop
        </button>
        <button
          onClick={handleTop}
          className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#6366f1] transition cursor-pointer"
        >
          Top
        </button>
        <button
          onClick={handleSize}
          className="bg-amber-500 text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#f59e0b] transition cursor-pointer"
        >
          Size
        </button>
      </div>

      {/* Animated Top Display */}
      {topValue !== null && (
        <motion.div
          key={`top-${topValue}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="mb-4 text-lg font-mono text-white/80"
        >
          Top of Stack:{' '}
          <span className="text-indigo-400 font-bold">{topValue}</span>
        </motion.div>
      )}

      {/* Animated Size Display */}
      {stackSizeDisplay !== null && (
        <motion.div
          key={`size-${stackSizeDisplay}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="mb-4 text-lg font-mono text-white/80"
        >
          Stack Size:{' '}
          <span className="text-amber-400 font-bold">{stackSizeDisplay}</span>
        </motion.div>
      )}

      {/* Stack Container */}
      <div className="w-64 min-h-[400px] border border-white/20 rounded-xl bg-white/5 backdrop-blur-lg shadow-[0_0_30px_#0FA]/20 flex flex-col-reverse justify-start items-center overflow-hidden py-4 relative">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item + index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-48 bg-[#0FA] text-black rounded-md py-2 px-4 text-center mb-2 shadow-xl font-semibold"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Top label */}
        {stack.length > 0 && (
          <motion.div
            key={stack.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 left-3 text-xs text-white/60"
          >
            Top
          </motion.div>
        )}

        {/* Empty message */}
        {stack.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/30 absolute top-1/2 -translate-y-1/2"
          >
            Stack is empty
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default StackVisualizer
