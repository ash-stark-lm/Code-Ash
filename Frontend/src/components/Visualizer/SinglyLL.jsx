import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dropdown from '../DropDown'

const speedMap = {
  Slow: 1000,
  Normal: 500,
  Fast: 200,
}

const operationInfo = {
  insertHead: {
    title: 'Insert at Head',
    code: `newNode = createNode(value)
newNode.next = head
head = newNode`,
    time: 'O(1)',
    space: 'O(1)',
  },
  insertTail: {
    title: 'Insert at Tail',
    code: `newNode = createNode(value)
if head == NULL:
  head = newNode
else:
  temp = head
  while temp.next != NULL:
    temp = temp.next
  temp.next = newNode`,
    time: 'O(n)',
    space: 'O(1)',
  },
  insertPosition: {
    title: 'Insert at Specific Position',
    code: `newNode = createNode(value)
if pos == 0:
  newNode.next = head
  head = newNode
else:
  temp = head
  for i in range(pos - 1):
    temp = temp.next
  newNode.next = temp.next
  temp.next = newNode`,
    time: 'O(n)',
    space: 'O(1)',
  },
  deleteHead: {
    title: 'Delete from Head',
    code: `if head != NULL:
  temp = head
  head = head.next
  delete temp`,
    time: 'O(1)',
    space: 'O(1)',
  },
  deleteTail: {
    title: 'Delete from Tail',
    code: `if head == NULL: return
if head.next == NULL:
  delete head
  head = NULL
else:
  temp = head
  while temp.next.next != NULL:
    temp = temp.next
  delete temp.next
  temp.next = NULL`,
    time: 'O(n)',
    space: 'O(1)',
  },
  search: {
    title: 'Search for Value',
    code: `temp = head
while temp:
  if temp.value == target: return true
  temp = temp.next
return false`,
    time: 'O(n)',
    space: 'O(1)',
  },
  traverse: {
    title: 'Traverse List',
    code: `temp = head
while temp:
  visit(temp)
  temp = temp.next`,
    time: 'O(n)',
    space: 'O(1)',
  },
}

const SinglyLinkedListVisualizer = () => {
  const [list, setList] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [positionValue, setPositionValue] = useState('')
  const [searchingIndex, setSearchingIndex] = useState(null)
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const [idCounter, setIdCounter] = useState(0)
  const [operation, setOperation] = useState('')
  const [explanation, setExplanation] = useState('')
  const [animationSpeed, setAnimationSpeed] = useState('Normal')

  const wait = () =>
    new Promise((res) => setTimeout(res, speedMap[animationSpeed]))

  const resetHighlight = () => {
    setSearchingIndex(null)
    setHighlightedIndex(null)
    setExplanation('')
  }

  const handleInsertHead = () => {
    if (!inputValue.trim()) return
    const newNode = { id: idCounter, value: inputValue.trim() }
    setList((prev) => [newNode, ...prev])
    setIdCounter((prev) => prev + 1)
    setInputValue('')
    setOperation('insertHead')
    resetHighlight()
  }

  const handleInsertTail = () => {
    if (!inputValue.trim()) return
    const newNode = { id: idCounter, value: inputValue.trim() }
    setList((prev) => [...prev, newNode])
    setIdCounter((prev) => prev + 1)
    setInputValue('')
    setOperation('insertTail')
    resetHighlight()
  }

  const handleInsertAtPosition = () => {
    const value = inputValue.trim()
    const pos = parseInt(positionValue)
    if (!value || isNaN(pos) || pos < 0 || pos > list.length) return

    const newNode = { id: idCounter, value }
    const updated = [...list]
    updated.splice(pos, 0, newNode)
    setList(updated)
    setIdCounter((prev) => prev + 1)
    setInputValue('')
    setPositionValue('')
    setOperation('insertPosition')
    resetHighlight()
  }

  const handleDeleteHead = () => {
    if (list.length === 0) return
    setList((prev) => prev.slice(1))
    setOperation('deleteHead')
    resetHighlight()
  }

  const handleDeleteTail = () => {
    if (list.length === 0) return
    setList((prev) => prev.slice(0, -1))
    setOperation('deleteTail')
    resetHighlight()
  }

  const handleSearch = async () => {
    resetHighlight()
    setOperation('search')
    for (let i = 0; i < list.length; i++) {
      setSearchingIndex(i)
      setExplanation(`temp is at node ${list[i].value}`)
      await wait()

      if (list[i].value === inputValue.trim()) {
        setHighlightedIndex(i)
        setExplanation(`Found node with value ${list[i].value}`)
        return
      } else {
        setExplanation(
          `Value ${list[i].value} ≠ ${inputValue.trim()}, moving temp`
        )
        await wait()
      }
    }
    setExplanation('Value not found in list.')
  }

  const handleTraverse = async () => {
    resetHighlight()
    setOperation('traverse')
    for (let i = 0; i < list.length; i++) {
      setSearchingIndex(i)
      setExplanation(`Visiting node ${list[i].value} with temp`)
      await wait()
    }
    setExplanation('Traversal complete.')
  }

  const currentOp = operationInfo[operation] || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Singly Linked List Visualizer</h1>
      <p className="text-white/70 text-sm max-w-3xl text-center mb-6">
        A singly linked list is a linear data structure where each node points
        to the next. It's used when dynamic memory allocation is needed.
      </p>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20 outline-none placeholder:text-white/40"
        />
        <input
          value={positionValue}
          onChange={(e) => setPositionValue(e.target.value)}
          placeholder="Position"
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20 outline-none placeholder:text-white/40 w-[90px]"
        />
        <button
          onClick={handleInsertHead}
          className="bg-[#0FA] text-black px-4 py-2 rounded font-semibold"
        >
          Insert Head
        </button>
        <button
          onClick={handleInsertTail}
          className="bg-[#0FA] text-black px-4 py-2 rounded font-semibold"
        >
          Insert Tail
        </button>
        <button
          onClick={handleInsertAtPosition}
          className="bg-[#0FA] text-black px-4 py-2 rounded font-semibold"
        >
          Insert at Pos
        </button>
        <button
          onClick={handleDeleteHead}
          className="bg-rose-500 px-4 py-2 rounded font-semibold"
        >
          Delete Head
        </button>
        <button
          onClick={handleDeleteTail}
          className="bg-rose-500 px-4 py-2 rounded font-semibold"
        >
          Delete Tail
        </button>
        <button
          onClick={handleSearch}
          className="bg-purple-500 px-4 py-2 rounded font-semibold"
        >
          Search
        </button>
        <button
          onClick={handleTraverse}
          className="bg-blue-500 px-4 py-2 rounded font-semibold"
        >
          Traverse
        </button>
        <Dropdown
          label="Speed:"
          options={['Slow', 'Normal', 'Fast']}
          selected={animationSpeed}
          setSelected={setAnimationSpeed}
        />
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10 items-start justify-center">
        <div className="flex items-center gap-6 overflow-x-auto px-4 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-lg min-h-[140px] h-60 custom-scrollbar w-full lg:w-3/5">
          <AnimatePresence>
            {list.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center"
              >
                {index === 0 && (
                  <div className="absolute -top-10 text-xs text-[#0FA] font-bold">
                    HEAD
                  </div>
                )}
                {index === list.length - 1 && (
                  <div className="absolute -bottom-6 text-xs text-[#0FA] font-bold">
                    TAIL
                  </div>
                )}
                {index === searchingIndex && (
                  <div className="absolute -top-5 text-[10px] font-bold text-yellow-400 animate-bounce">
                    temp
                  </div>
                )}
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-lg font-semibold shadow-lg text-black
                    ${
                      index === highlightedIndex
                        ? 'bg-green-500'
                        : index === searchingIndex
                        ? 'bg-yellow-400'
                        : 'bg-[#0FA]'
                    }`}
                >
                  {node.value}
                </div>
                {index !== list.length - 1 && (
                  <svg
                    className="absolute right-[-32px] top-1/2 -translate-y-1/2"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {list.length === 0 && (
            <p className="text-white/30 italic">List is empty</p>
          )}
        </div>

        <div className="w-full lg:w-2/5 border border-white/20 rounded-xl bg-white/5 backdrop-blur-lg p-4 min-h-[140px]">
          <h2 className="text-xl font-semibold mb-2 text-[#0FA]">
            {currentOp.title || 'Pseudocode'}
          </h2>
          <pre className="text-sm font-mono text-white whitespace-pre-wrap mb-3">
            {currentOp.code}
          </pre>
          {currentOp.time && (
            <div className="text-sm text-white/70 mb-1">
              ⏱ <b>Time Complexity:</b> {currentOp.time}
            </div>
          )}
          {currentOp.space && (
            <div className="text-sm text-white/70 mb-4">
              💾 <b>Space Complexity:</b> {currentOp.space}
            </div>
          )}
          {explanation && (
            <motion.div
              key={explanation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-white/80 font-medium"
            >
              💡 {explanation}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SinglyLinkedListVisualizer
