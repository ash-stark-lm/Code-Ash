import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const codeSnippets = {
  cpp: `void bubbleSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}`,
  python: `def bubble_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    for j in range(n - i - 1):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
  java: `public static void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
}

function* bubbleSortSteps(array) {
  const arr = [...array]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        explanation: `Compare arr[${j}] (${arr[j]}) and arr[${j + 1}] (${
          arr[j + 1]
        })`,
      }

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        yield {
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          explanation: `Swapped arr[${j}] and arr[${j + 1}]`,
        }
      }
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    explanation: '✅ Array is sorted.',
  }
}

const BubbleSortVisualizer = () => {
  const [array, setArray] = useState([4, 1, 5, 3, 2])
  const [inputText, setInputText] = useState('4 1 5 3 2')
  const [size, setSize] = useState(5)
  const [language, setLanguage] = useState('cpp')
  const [stateHistory, setStateHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const intervalRef = useRef(null)
  const current = stateHistory[currentIndex]

  const generateSteps = () => {
    const gen = bubbleSortSteps(array)
    const steps = []
    for (let step of gen) steps.push(step)
    setStateHistory(steps)
    setCurrentIndex(0)
  }

  const play = () => {
    if (!stateHistory.length) {
      generateSteps()
      return
    }
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

  const handleArrayInput = (text) => {
    setInputText(text)
    const newArray = text
      .split(' ')
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v))
    setArray(newArray)
    reset()
  }

  const handleSizeChange = (newSize) => {
    const arr = Array.from({ length: newSize }, () =>
      Math.floor(Math.random() * 100)
    )
    setArray(arr)
    setInputText(arr.join(' '))
    setSize(newSize)
    reset()
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="p-6 min-h-screen bg-[#0d0d0d] text-white font-mono">
      <h2 className="text-2xl font-bold mb-4 text-[#0FA]">
        🫧 Bubble Sort Visualizer
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div>
          <label className="text-sm text-gray-400">
            🔢 Array (space separated):
          </label>
          <input
            type="text"
            className="px-3 py-1 rounded bg-[#111] border border-[#333] text-white w-64"
            value={inputText}
            onChange={(e) => handleArrayInput(e.target.value)}
            placeholder="e.g. 5 1 4 2 8"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">🔧 Array Size:</label>
          <input
            type="number"
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="px-3 py-1 w-20 rounded bg-[#111] border border-[#333] text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">🌐 Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 rounded bg-[#111] border border-[#333] text-white"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      <motion.div
        layout
        className="flex flex-wrap justify-center gap-3 p-4 bg-[#111] border border-[#222] rounded-xl"
      >
        {current?.array?.map((value, index) => {
          const isComparing = current?.comparing?.includes(index)
          const isSwapped = current?.swapped?.includes(index)
          return (
            <div className="flex flex-col items-center" key={index}>
              <motion.div
                layout
                className={`w-14 h-14 flex items-center justify-center text-sm font-mono rounded-md border-2 transition-all text-white ${
                  isSwapped
                    ? 'border-purple-400'
                    : isComparing
                    ? 'border-yellow-400'
                    : 'border-[#333]'
                }`}
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {value}
              </motion.div>
              <span className="text-xs text-gray-400 mt-1">{index}</span>
            </div>
          )
        })}
      </motion.div>

      <div className="mt-6 bg-[#101c1c] border border-[#0FA]/40 px-4 py-3 rounded-lg text-[#0FA] text-sm text-center min-h-[60px]">
        <p>{current?.explanation || 'Press Play or Step to Start'}</p>
      </div>

      <div className="mt-6 flex justify-center flex-wrap gap-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
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
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, stateHistory.length - 1))
          }
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

      <div className="mt-8 bg-[#111] border border-[#333] rounded-xl p-4 flex flex-col md:flex-row gap-4">
        {/* Left: Explanation Section */}
        <div className="flex-1">
          <h1 className="text-lg text-white font-semibold mb-2">
            What is Bubble Sort?
          </h1>
          <p className="text-sm text-gray-300 mb-2">
            Bubble Sort is a simple comparison-based sorting algorithm where
            adjacent elements are compared and swapped if they are in the wrong
            order. It repeats the process until the array is sorted.
          </p>

          <h2 className="text-md text-white font-semibold mb-1">
            🔍 Core Logic:
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Start from the beginning of the array.</li>
            <li>Compare each pair of adjacent elements.</li>
            <li>Swap them if they are in the wrong order.</li>
            <li>Repeat until the array is sorted.</li>
          </ul>
          <p className="mt-2">🧠 Time Complexity: O(n²)</p>
          <p>💾 Space Complexity: O(1)</p>
        </div>

        {/* Right: Code Section */}
        <div className="flex-1 bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
          <h3 className="text-lg text-white font-semibold mb-2">
            📜 {language.toUpperCase()} Code
          </h3>
          <pre className="text-sm text-green-400 whitespace-pre-wrap">
            {codeSnippets[language]}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default BubbleSortVisualizer
