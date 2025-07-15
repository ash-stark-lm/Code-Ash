import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'

import {
  ArrowRight,
  Cpu,
  List,
  Shuffle,
  Activity,
  Network,
  Waves,
  Search,
  Repeat,
  Layers,
  ChevronDownSquare,
  Undo2,
  FolderKanban,
  ArrowUpNarrowWide,
  ArrowDownUp,
  ArrowUp01,
  Palette,
} from 'lucide-react'

const dsaAlgorithms = {
  Sorting: [
    {
      name: 'Selection Sort',
      path: '/visualizer-selection-sort',
      icon: Shuffle,
    },
    {
      name: 'Bubble Sort',
      path: '/visualizer-bubble-sort',
      icon: ArrowDownUp,
    },
    {
      name: 'Insertion Sort',
      path: '/visualizer-insertion-sort',
      icon: ArrowUpNarrowWide,
    },
    {
      name: 'Merge Sort',
      path: '/visualizer-merge-sort',
      icon: ArrowUp01,
    },
  ],
  Searching: [
    {
      name: 'Binary Search',
      path: '/visualizer-binary-search',
      icon: Cpu,
    },
    {
      name: 'Linear Search',
      path: '/visualizer-linear-search',
      icon: Search,
    },
  ],

  'Linked List': [
    {
      name: 'Singly Linked List',
      path: '/visualizer-singly-linked-list',
      icon: ChevronDownSquare,
    },
    {
      name: 'Doubly Linked List',
      path: '/visualizer-doubly-linked-list',
      icon: Repeat,
    },
  ],

  Stack: [
    {
      name: 'Stack',
      path: '/visualizer-stack',
      icon: Layers,
    },
  ],

  Queue: [
    {
      name: 'Queue',
      path: '/visualizer-queue',
      icon: FolderKanban,
    },
  ],

  Heap: [
    {
      name: 'Max Heap',
      path: '/visualizer-maxheap',
      icon: Network,
    },
    {
      name: 'Min Heap',
      path: '/visualizer-minheap',
      icon: Network,
    },
  ],

  'Binary Tree': [
    {
      name: 'Preorder Traversal',
      path: '/visualizer-preorder',
      icon: Palette,
    },
    {
      name: 'Inorder Traversal',
      path: '/visualizer-inorder',
      icon: Palette,
    },
    {
      name: 'Postorder Traversal',
      path: '/visualizer-postorder',
      icon: Palette,
    },
  ],

  Graph: [
    {
      name: 'DFS',
      path: '/visualizer-dfs',
      icon: Activity,
    },
    {
      name: 'BFS',
      path: '/visualizer-bfs',
      icon: Waves,
    },
    {
      name: 'Flood-Fill',
      path: '/visualizer-flood-fill',
      icon: Waves,
    },
  ],
}

const welcomeMessages = [
  '👋 Welcome to the DSA Visualizer',
  'Choose an algorithm to get started...',
  'Let’s animate your logic! 🧠✨',
]

const DSAVisualizerPage = () => {
  const navigate = useNavigate()
  const [showCurtain, setShowCurtain] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const curtainTimeout = setTimeout(() => setShowCurtain(false), 2000)
    const welcomeTimeout = setTimeout(() => setShowWelcome(false), 4500)

    return () => {
      clearTimeout(curtainTimeout)
      clearTimeout(welcomeTimeout)
    }
  }, [])

  const handleNavigate = (path) => {
    setShowCurtain(true)
    setTimeout(() => navigate(path), 2000)
  }

  return (
    <div className="relative min-h-screen bg-black text-white py-12 px-6 overflow-hidden">
      {/* Curtain Animation */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#101010]"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Welcome Text Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 text-white font-mono"
          >
            {welcomeMessages.map((msg, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 1, duration: 0.8 }}
                className="text-lg text-[#0FA] mb-2"
              >
                {msg}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showCurtain && !showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold text-center mb-12">
            DSA Visualizer
          </h1>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(dsaAlgorithms).map(([section, algos]) => (
              <motion.div
                key={section}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_40px_#0FA] transition"
              >
                <h2 className="text-xl font-semibold mb-4 text-[#0FA]">
                  {section}
                </h2>
                <ul className="space-y-3">
                  {algos.map((algo) => (
                    <motion.li
                      key={algo.name}
                      onClick={() => handleNavigate(algo.path)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
                    >
                      <div className="flex items-center gap-2">
                        <algo.icon className="w-4 h-4 text-[#0FA]" />
                        <span>{algo.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DSAVisualizerPage
