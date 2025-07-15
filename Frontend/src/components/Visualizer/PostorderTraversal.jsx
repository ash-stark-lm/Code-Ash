import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Plus,
  Minus,
  Code,
} from 'lucide-react'

const generateBinaryTree = (count) => {
  const nodes = []
  const edges = []
  if (count === 0) return { nodes, edges }
  const levels = Math.ceil(Math.log2(count + 1))
  const horizontalSpacing = 80
  const verticalSpacing = 100
  for (let i = 0; i < count; i++) {
    const level = Math.floor(Math.log2(i + 1))
    const nodesInLevel = Math.pow(2, level)
    const positionInLevel = i - (Math.pow(2, level) - 1)
    const horizontalOffset =
      (positionInLevel - (nodesInLevel - 1) / 2) *
      (horizontalSpacing * Math.pow(2, levels - level - 1))
    const x = window.innerWidth / 2 + horizontalOffset
    const y = level * verticalSpacing + 100
    nodes.push({ id: i, x, y })
    if (i > 0) {
      edges.push([Math.floor((i - 1) / 2), i])
    }
  }
  return { nodes, edges }
}

const computePostorderSteps = (count) => {
  const steps = []
  const dfs = (node) => {
    if (node >= count) return
    const left = 2 * node + 1
    const right = 2 * node + 2
    if (left < count) {
      steps.push({ type: 'edge', from: node, to: left, direction: 'forward' })
      dfs(left)
      steps.push({ type: 'edge', from: left, to: node, direction: 'backward' })
    }
    if (right < count) {
      steps.push({ type: 'edge', from: node, to: right, direction: 'forward' })
      dfs(right)
      steps.push({ type: 'edge', from: right, to: node, direction: 'backward' })
    }
    steps.push({ type: 'visit', node })
  }
  dfs(0)
  return steps
}

export default function PostorderTraversal() {
  const [count, setCount] = useState(7)
  const [graph, setGraph] = useState(generateBinaryTree(7))
  const [steps, setSteps] = useState(computePostorderSteps(7))
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [visited, setVisited] = useState([])
  const [activeEdges, setActiveEdges] = useState([])
  const [showCode, setShowCode] = useState(true)
  const [codeLang, setCodeLang] = useState('cpp')

  useEffect(() => {
    setGraph(generateBinaryTree(count))
    setSteps(computePostorderSteps(count))
    reset()
  }, [count])

  useEffect(() => {
    let interval
    if (playing) {
      interval = setInterval(() => handleStep(), 800)
    }
    return () => clearInterval(interval)
  }, [playing, stepIndex])

  const handleStep = () => {
    if (stepIndex >= steps.length) {
      setPlaying(false)
      return
    }
    const step = steps[stepIndex]
    if (step.type === 'visit') {
      setVisited((v) => [...v, step.node])
    } else if (step.type === 'edge') {
      setActiveEdges([
        { from: step.from, to: step.to, direction: step.direction },
      ])
    }
    setStepIndex((i) => i + 1)
  }

  const reset = () => {
    setStepIndex(0)
    setVisited([])
    setActiveEdges([])
    setPlaying(false)
  }

  const codeSnippets = {
    cpp: `void postorder(int node, vector<vector<int>>& tree) {
  if (node == -1) return;
  postorder(leftChild(node));
  postorder(rightChild(node));
  visit(node);
}`,
    java: `void postorder(int node, TreeNode[] tree) {
  if (node == -1) return;
  postorder(leftChild(node));
  postorder(rightChild(node));
  visit(node);
}`,
    python: `def postorder(node, tree):
  if node == -1:
    return
  postorder(left_child(node))
  postorder(right_child(node))
  visit(node)`,
  }

  const getEdgeColor = (u, v) => {
    const activeEdge = activeEdges.find(
      (edge) =>
        (edge.from === u && edge.to === v) || (edge.from === v && edge.to === u)
    )
    if (activeEdge) {
      return activeEdge.direction === 'forward' ? '#0FA' : '#f43f5e'
    }
    return '#444'
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6 relative overflow-x-hidden">
      <h1 className="text-2xl font-bold text-[#0FA] mb-4 text-center">
        🔁 Postorder Traversal Visualizer
      </h1>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-white/80">
          In postorder traversal, we recursively visit the left subtree, then
          the right subtree, and finally the root node.
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setShowCode((s) => !s)}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => setCount((n) => Math.max(3, n - 1))}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => setCount((n) => Math.min(15, n + 1))}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={() => setPlaying((prev) => !prev)}
          className="bg-[#0FA] text-black px-5 py-2 rounded-full font-semibold flex items-center gap-2"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}{' '}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleStep}
          className="border border-[#0FA] text-[#0FA] px-5 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-[#0FA]/10"
        >
          <StepForward size={16} /> Step
        </button>
        <button
          onClick={reset}
          className="border border-red-500 text-red-500 px-5 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-red-500/10"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {showCode && (
        <div className="absolute top-30 right-10 z-20 bg-[#111] p-4 rounded-xl border border-[#333] text-sm w-96 max-h-[70vh] overflow-auto">
          <h2 className="font-bold mb-2 text-lg">Postorder Code</h2>
          <select
            value={codeLang}
            onChange={(e) => setCodeLang(e.target.value)}
            className="mb-4 px-3 py-1 bg-[#111] border border-[#333] rounded-full text-sm text-white"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <pre className="text-[#0FA] whitespace-pre-wrap">
            {codeSnippets[codeLang]}
          </pre>
        </div>
      )}

      <svg className="absolute top-20 left-0 w-full h-full z-0">
        {graph.edges.map(([u, v], i) => {
          const from = graph.nodes[u]
          const to = graph.nodes[v]
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={getEdgeColor(u, v)}
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ stroke: '#000', opacity: 0 }}
              animate={{ stroke: getEdgeColor(u, v), opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )
        })}
      </svg>

      <div className="absolute top-20 inset-0 z-10">
        {graph.nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
              visited.includes(node.id)
                ? 'bg-[#0FA] text-black border-[#0FA]'
                : 'bg-[#111] border-[#444]'
            }`}
            style={{
              left: node.x,
              top: node.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: visited.includes(node.id) ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {node.id}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-gray-300 text-sm z-20">
        <p className="mb-1 font-medium text-white">Traversal Order:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {visited.map((val, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 flex flex-col justify-center items-center border text-xs bg-[#0FA]/20 border-[#0FA] text-[#0FA]"
            >
              <span className="text-[10px] text-white/40">{i}</span>
              <span>{val}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
