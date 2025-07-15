import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [infoDisplay, setInfoDisplay] = useState({ type: '', value: null })
  const [idCounter, setIdCounter] = useState(0)

  const handlePush = () => {
    if (inputValue.trim() === '') return

    const newItem = {
      id: idCounter,
      value: inputValue.trim(),
    }

    setQueue((prev) => [...prev, newItem])
    setIdCounter((prev) => prev + 1)
    setInputValue('')
    setInfoDisplay({ type: '', value: null })
  }

  const handlePop = () => {
    if (queue.length === 0) return
    setQueue((prev) => prev.slice(1))
    setInfoDisplay({ type: '', value: null })
  }

  const handleFront = () => {
    if (queue.length === 0) return
    setInfoDisplay({ type: 'Front', value: queue[0].value })
  }

  const handleBack = () => {
    if (queue.length === 0) return
    setInfoDisplay({ type: 'Back', value: queue[queue.length - 1].value })
  }

  const handleSize = () => {
    setInfoDisplay({ type: 'Size', value: queue.length })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Queue Visualizer</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none placeholder:text-white/50"
          placeholder="Enter value"
        />
        <button
          onClick={handlePush}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition"
        >
          Push
        </button>
        <button
          onClick={handlePop}
          className="bg-rose-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#f43f5e] transition"
        >
          Pop
        </button>
        <button
          onClick={handleFront}
          className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#6366f1] transition"
        >
          Front
        </button>
        <button
          onClick={handleBack}
          className="bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#a855f7] transition"
        >
          Back
        </button>
        <button
          onClick={handleSize}
          className="bg-amber-500 text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#f59e0b] transition"
        >
          Size
        </button>
      </div>

      {/* Info Display */}
      {infoDisplay.value !== null && (
        <motion.div
          key={infoDisplay.type + infoDisplay.value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="mb-6 text-lg font-mono text-white/80"
        >
          {infoDisplay.type}:{' '}
          <span className="text-[#0FA] font-bold">{infoDisplay.value}</span>
        </motion.div>
      )}

      {/* Queue Display */}
      <div className="w-full max-w-5xl min-h-[120px] border border-white/20 rounded-xl bg-white/5 backdrop-blur-lg shadow-[0_0_30px_#0FA]/20 flex items-center justify-start px-4 py-6 gap-4 overflow-x-auto custom-scrollbar">
        <AnimatePresence>
          {queue.map((item) => (
            <motion.div
              key={item.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-w-[70px] h-16 bg-[#0FA] text-black rounded-md flex items-center justify-center shadow-md font-semibold text-lg"
            >
              {item.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {queue.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/30"
          >
            Queue is empty
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default QueueVisualizer
