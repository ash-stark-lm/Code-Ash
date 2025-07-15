import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function* linearSearchSteps(array, target) {
  for (let i = 0; i < array.length; i++) {
    yield {
      index: i,
      explanation: `arr[${i}] = ${array[i]} ${
        array[i] === target ? '==' : '≠'
      } target = ${target}`,
      action:
        array[i] === target
          ? '✅ Found at index ' + i
          : '🔍 Continue searching...',
      found: array[i] === target,
    }
    if (array[i] === target) return
  }

  yield {
    index: null,
    explanation: `🔴 Element not found.`,
    action: '❌ Search complete. Target does not exist in array.',
    notFound: true,
  }
}

const LinearSearchVisualizer = () => {
  const [array] = useState([4, 11, 8, 19, 2, 5, 14, 23, 9])
  const [target, setTarget] = useState(14)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)

  const intervalRef = useRef(null)

  const generateSteps = () => {
    const gen = linearSearchSteps(array, target)
    const s = []
    for (let step of gen) s.push(step)
    setSteps(s)
    setCurrentStep(0)
  }

  const play = () => {
    if (!steps.length) generateSteps()
    setPlaying(true)
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          pause()
          return prev
        }
        return prev + 1
      })
    }, speed)
  }

  const pause = () => {
    setPlaying(false)
    clearInterval(intervalRef.current)
  }

  const reset = () => {
    pause()
    setSteps([])
    setCurrentStep(0)
  }

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((i) => i + 1)
  }

  const prev = () => {
    if (currentStep > 0) setCurrentStep((i) => i - 1)
  }

  const current = steps[currentStep]

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="p-6 min-h-screen bg-[#0d0d0d] text-white font-mono">
      <h2 className="text-2xl font-bold mb-4 text-[#0FA]">
        🔎 Linear Search Visualizer
      </h2>

      {/* Label Row */}
      <div className="flex justify-center gap-3 mb-1">
        {array.map((_, index) => {
          const isCurrent = index === current?.index
          return (
            <div
              key={index}
              className="w-14 h-14 relative flex items-end justify-center"
            >
              <div className="absolute top-0 flex flex-col items-center space-y-0.5 min-h-[32px]">
                {isCurrent && (
                  <div className="text-xs font-semibold text-yellow-400">
                    check({index})
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Array Row */}
      <motion.div
        layout
        className="flex flex-wrap justify-center gap-3 p-4 bg-[#111] border border-[#222] rounded-xl"
      >
        {array.map((value, index) => {
          const isCurrent = index === current?.index
          const isFound = current?.found && isCurrent
          const bgColor = isFound
            ? '#116611'
            : isCurrent
            ? '#1f1f00'
            : '#1a1a1a'
          const borderColor = isFound
            ? 'limegreen'
            : isCurrent
            ? 'yellow'
            : '#333'

          return (
            <motion.div
              key={index}
              layout
              className="w-14 h-14 flex items-center justify-center text-white text-sm font-mono rounded-md border-2 transition-all"
              style={{ backgroundColor: bgColor, borderColor }}
            >
              {value}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Explanation */}
      <div className="mt-6 bg-[#101c1c] border border-[#0FA]/40 px-4 py-3 rounded-lg text-[#0FA] text-sm text-center min-h-[60px]">
        <p>{current?.explanation || 'Press Play or Step to Start'}</p>
        {current?.action && (
          <p className="text-white mt-1 text-xs">{current.action}</p>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center flex-wrap gap-4">
        <button
          onClick={prev}
          className="px-3 py-2 bg-[#222] border border-[#444] rounded text-white flex items-center gap-2 hover:bg-[#333]"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        {playing ? (
          <button
            onClick={pause}
            className="px-4 py-2 bg-[#0FA]/10 text-[#0FA] border border-[#0FA] rounded hover:bg-[#0FA]/20"
          >
            <Pause size={16} />
          </button>
        ) : (
          <button
            onClick={play}
            className="px-4 py-2 bg-[#0FA]/10 text-[#0FA] border border-[#0FA] rounded hover:bg-[#0FA]/20"
          >
            <Play size={16} />
          </button>
        )}
        <button
          onClick={next}
          className="px-3 py-2 bg-[#222] border border-[#444] rounded text-white flex items-center gap-2 hover:bg-[#333]"
        >
          Next <ChevronRight size={16} />
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Speed Control */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <label className="text-sm text-gray-400">
          🕒 Animation Speed: {speed} ms
        </label>
        <input
          type="range"
          min="300"
          max="3000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-64 accent-[#0FA]"
        />
      </div>

      {/* Target Input */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <label className="text-sm text-white">🎯 Target:</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="bg-[#1a1a1a] text-white px-3 py-1 rounded border border-[#333] outline-none focus:ring-2 focus:ring-[#0FA]/40"
        />
      </div>
    </div>
  )
}

export default LinearSearchVisualizer
