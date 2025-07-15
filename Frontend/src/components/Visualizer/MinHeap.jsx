import React, { useState } from 'react'
import { motion } from 'framer-motion'

const nodeStyle =
  'w-12 h-12 rounded-full bg-[#0FA] text-black font-bold flex items-center justify-center shadow-xl'

const MinHeapVisualizer = () => {
  const [heap, setHeap] = useState([])
  const [input, setInput] = useState('')
  const [swapping, setSwapping] = useState(null)
  const [topValue, setTopValue] = useState(null)

  const insert = async (val) => {
    const newHeap = [...heap, val]
    await heapifyUp(newHeap, newHeap.length - 1)
    setHeap([...newHeap])
  }

  const heapifyUp = async (arr, index) => {
    if (index === 0) return
    const parent = Math.floor((index - 1) / 2)
    if (arr[parent] > arr[index]) {
      setSwapping([parent, index])
      await new Promise((r) => setTimeout(r, 500))
      ;[arr[parent], arr[index]] = [arr[index], arr[parent]]
      await heapifyUp(arr, parent)
    }
  }

  const heapifyDown = async (arr, index) => {
    const left = 2 * index + 1
    const right = 2 * index + 2
    let smallest = index

    if (left < arr.length && arr[left] < arr[smallest]) smallest = left
    if (right < arr.length && arr[right] < arr[smallest]) smallest = right

    if (smallest !== index) {
      setSwapping([index, smallest])
      await new Promise((r) => setTimeout(r, 500))
      ;[arr[index], arr[smallest]] = [arr[smallest], arr[index]]
      await heapifyDown(arr, smallest)
    }
  }

  const handleInsert = async () => {
    if (!input.trim()) return
    await insert(Number(input.trim()))
    setInput('')
    setSwapping(null)
  }

  const handleDeleteMin = async () => {
    if (heap.length === 0) return
    const newHeap = [...heap]
    newHeap[0] = newHeap[newHeap.length - 1]
    newHeap.pop()
    await heapifyDown(newHeap, 0)
    setHeap([...newHeap])
    setSwapping(null)
  }

  const handleTop = () => {
    if (heap.length > 0) {
      setTopValue(heap[0])
      setTimeout(() => setTopValue(null), 3000)
    }
  }

  const renderTree = () => {
    const nodes = []
    const lines = []

    const levelGap = 90
    const nodeGap = 40

    heap.forEach((value, index) => {
      const level = Math.floor(Math.log2(index + 1))
      const nodesInLevel = 2 ** level
      const posInLevel = index - (2 ** level - 1)

      const x = (600 / nodesInLevel) * posInLevel + 600 / nodesInLevel / 2 - 30
      const y = level * levelGap

      const left = 2 * index + 1
      const right = 2 * index + 2

      if (left < heap.length) {
        const childLevel = Math.floor(Math.log2(left + 1))
        const childNodesInLevel = 2 ** childLevel
        const childPos = left - (2 ** childLevel - 1)
        const childX =
          (600 / childNodesInLevel) * childPos +
          600 / childNodesInLevel / 2 -
          30
        const childY = childLevel * levelGap

        lines.push(
          <line
            key={`line-${index}-${left}`}
            x1={x + 24}
            y1={y + 24}
            x2={childX + 24}
            y2={childY + 24}
            stroke="#555"
            strokeWidth="2"
          />
        )
      }

      if (right < heap.length) {
        const childLevel = Math.floor(Math.log2(right + 1))
        const childNodesInLevel = 2 ** childLevel
        const childPos = right - (2 ** childLevel - 1)
        const childX =
          (600 / childNodesInLevel) * childPos +
          600 / childNodesInLevel / 2 -
          30
        const childY = childLevel * levelGap

        lines.push(
          <line
            key={`line-${index}-${right}`}
            x1={x + 24}
            y1={y + 24}
            x2={childX + 24}
            y2={childY + 24}
            stroke="#555"
            strokeWidth="2"
          />
        )
      }

      nodes.push(
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`${nodeStyle} absolute`}
          style={{
            left: x,
            top: y,
            backgroundColor:
              swapping && swapping.includes(index) ? '#FACC15' : '#0FA',
          }}
        >
          {value}
        </motion.div>
      )
    })

    return (
      <div className="relative w-[600px] h-[400px] mx-auto border border-white/10 rounded-xl bg-white/5 mt-6">
        <svg className="absolute top-0 left-0 w-full h-full">{lines}</svg>
        {nodes}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 ">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Min Heap Visualizer
      </h1>
      <p className="text-sm text-center text-white/70 mb-6">
        Min Heap represented as a binary tree. Each parent is smaller than its
        children.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded outline-none"
          placeholder="Enter value"
        />
        <button
          onClick={handleInsert}
          className="bg-[#0FA] text-black px-4 py-2 rounded font-semibold cursor-pointer hover:shadow-[0_0_20px_#0FA] transition"
        >
          Insert & Heapify (pq.push)
        </button>
        <button
          onClick={handleDeleteMin}
          className="bg-red-500 text-white px-4 py-2 rounded font-semibold cursor-pointer hover:shadow-[0_0_20px_#f43f5e] transition"
        >
          Delete Min (pq.pop)
        </button>
        <button
          onClick={handleTop}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold cursor-pointer hover:shadow-[0_0_20px_#f59e0b] transition"
        >
          Show Top (pq.top)
        </button>
      </div>

      <div className="flex justify-center items-start gap-12 mt-6 flex-wrap">
        <div>{renderTree()}</div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-48 h-[400px] overflow-auto">
            <h3 className="text-center text-sm font-semibold text-[#0FA] mb-2">
              Priority Queue
            </h3>
            <ul className="space-y-2">
              {[...heap]
                .sort((a, b) => a - b)
                .map((val, idx) => (
                  <li
                    key={idx}
                    className="bg-[#0FA] text-black font-bold text-center py-2 rounded-md shadow-md"
                  >
                    {val}
                  </li>
                ))}
            </ul>
          </div>

          {topValue !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/10 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
            >
              🔝 Top of Priority Queue:{' '}
              <span className="text-[#0FA]">{topValue}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MinHeapVisualizer
