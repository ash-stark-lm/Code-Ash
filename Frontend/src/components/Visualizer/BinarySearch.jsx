import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function* binarySearchSteps(array, target) {
  let left = 0
  let right = array.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    yield {
      array,
      left,
      mid,
      right,
      explanation: `arr[${mid}] = ${array[mid]} ${
        array[mid] === target ? '==' : array[mid] < target ? '<' : '>'
      } target = ${target}`,
      action:
        array[mid] === target
          ? '✅ Element found at index ' + mid
          : array[mid] < target
          ? '➡ Move left to mid + 1'
          : '⬅ Move right to mid - 1',
    }

    if (array[mid] === target) return

    if (array[mid] < target) left = mid + 1
    else right = mid - 1
  }

  yield {
    left: null,
    mid: null,
    right: null,
    explanation: `Left > Right — target not found.`,
    action: '❌ Element not present in array.',
    notFound: true,
  }
}

const BinarySearchVisualizer = () => {
  const [array] = useState([2, 5, 7, 9, 12, 16, 23, 31, 37, 44])
  const [target, setTarget] = useState(23)
  const [stateHistory, setStateHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1500)

  const intervalRef = useRef(null)

  const start = () => {
    const gen = binarySearchSteps(array, target)
    const steps = []
    for (let step of gen) steps.push(step)
    setStateHistory(steps)
    setCurrentIndex(0)
  }

  const play = () => {
    if (!stateHistory.length) start()
    setPlaying(true)
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= stateHistory.length - 1) {
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
    setStateHistory([])
    setCurrentIndex(0)
  }

  const next = () => {
    if (currentIndex < stateHistory.length - 1) setCurrentIndex((i) => i + 1)
  }

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const current = stateHistory[currentIndex]

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="p-6 min-h-screen bg-[#0d0d0d] text-white font-mono">
      <h2 className="text-2xl font-bold mb-4 text-[#0FA]">
        🔍 Binary Search Visualizer
      </h2>

      {/* Label row */}
      <div className="flex justify-center gap-3 mb-1">
        {array.map((_, index) => {
          const labels = []
          if (current?.left === index) labels.push('left(' + index + ')')
          if (current?.mid === index) labels.push('mid(' + index + ')')
          if (current?.right === index) labels.push('right(' + index + ')')

          return (
            <div
              key={index}
              className="w-14 h-14 relative flex items-end justify-center"
            >
              <div className="absolute top-0 flex flex-col items-center space-y-0.5 min-h-[48px]">
                {labels.map((label, i) => (
                  <div
                    key={i}
                    className={`text-xs font-semibold ${
                      label.startsWith('left')
                        ? 'text-green-400'
                        : label.startsWith('mid')
                        ? 'text-orange-400'
                        : 'text-red-400'
                    }`}
                  >
                    {label}
                  </div>
                ))}
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
          const isLeft = index === current?.left
          const isMid = index === current?.mid
          const isRight = index === current?.right

          const borderColor = isMid
            ? 'orange'
            : isLeft
            ? 'limegreen'
            : isRight
            ? 'red'
            : '#333'

          return (
            <motion.div
              key={index}
              layout
              className="w-14 h-14 flex items-center justify-center text-white text-sm font-mono rounded-md border-2 transition-all"
              style={{
                borderColor,
                backgroundColor: '#1a1a1a',
              }}
            >
              {value}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Explanation (fixed, no animation) */}
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

export default BinarySearchVisualizer
