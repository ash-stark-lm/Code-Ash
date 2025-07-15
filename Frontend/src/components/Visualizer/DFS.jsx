// DFSGraphVisualizer.js
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, StepForward, RotateCcw, Plus, Minus } from 'lucide-react'
import Dropdown from '../DropDown'

const generateGraph = (nodeCount) => {
  const nodes = []
  const edges = []
  const angleStep = (2 * Math.PI) / nodeCount
  const radius = 200

  for (let i = 0; i < nodeCount; i++) {
    const angle = i * angleStep
    nodes.push({
      id: i,
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    })
    if (i > 0) {
      const parent = Math.floor(Math.random() * i)
      edges.push([parent, i])
    }
  }
  return { nodes, edges }
}

const DFSVisualizer = () => {
  const [nodeCount, setNodeCount] = useState(8)
  const [graphData, setGraphData] = useState(generateGraph(8))
  const [visitedArray, setVisitedArray] = useState(Array(8).fill(0))
  const [visitedSet, setVisitedSet] = useState(new Set())
  const [current, setCurrent] = useState(null)
  const [activeEdge, setActiveEdge] = useState(null)
  const [backtrackEdges, setBacktrackEdges] = useState([])
  const [playing, setPlaying] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [customEdges, setCustomEdges] = useState([])
  const [addingEdge, setAddingEdge] = useState(null)
  const [startNode, setStartNode] = useState(0)
  const [codeLang, setCodeLang] = useState('C++')

  useEffect(() => {
    reset()
  }, [nodeCount, customEdges, startNode])

  const { nodes, edges } = graphData
  const graph = buildGraph()
  const steps = computeDFSPath()

  function buildGraph() {
    const g = {}
    nodes.forEach((n) => (g[n.id] = []))
    const allEdges = [...edges, ...customEdges]
    allEdges.forEach(([u, v]) => {
      g[u].push(v)
      g[v].push(u)
    })
    return g
  }

  function computeDFSPath() {
    const visited = new Set()
    const steps = []

    const dfs = (u, parent = null) => {
      visited.add(u)
      steps.push({
        type: 'visit',
        node: u,
        edge: parent !== null ? [parent, u] : null,
      })
      for (const v of graph[u]) {
        if (!visited.has(v)) {
          dfs(v, u)
          steps.push({ type: 'backtrack', edge: [v, u] })
        }
      }
    }

    dfs(startNode)
    return steps
  }

  useEffect(() => {
    let interval
    if (playing) {
      interval = setInterval(() => {
        handleStep()
      }, 1000)
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
      setVisitedSet((prev) => new Set(prev).add(step.node))
      setVisitedArray((arr) => {
        const newArr = [...arr]
        newArr[step.node] = 1
        return newArr
      })
      setCurrent(step.node)
      setActiveEdge(step.edge)
    } else if (step.type === 'backtrack') {
      setBacktrackEdges((prev) => [...prev, step.edge])
      setActiveEdge(step.edge)
    }
    setStepIndex((i) => i + 1)
  }

  const reset = () => {
    setGraphData(generateGraph(nodeCount))
    setVisitedArray(Array(nodeCount).fill(0))
    setVisitedSet(new Set())
    setCurrent(null)
    setActiveEdge(null)
    setBacktrackEdges([])
    setPlaying(false)
    setStepIndex(0)
  }

  const getNodeColor = (id) => {
    if (current === id) return 'bg-[#0FA] border-[#0FA] text-black'
    if (visitedSet.has(id)) return 'bg-[#0FA]/30 border-[#0FA]/50 text-[#0FA]'
    return 'bg-[#111] border-[#444]'
  }

  const getEdgeColor = (u, v) => {
    if (!activeEdge) return '#444'
    if (
      (activeEdge[0] === u && activeEdge[1] === v) ||
      (activeEdge[0] === v && activeEdge[1] === u)
    )
      return '#0FA'
    if (
      backtrackEdges.some(
        ([a, b]) => (a === u && b === v) || (a === v && b === u)
      )
    )
      return '#ff4444'
    if (visitedSet.has(u) && visitedSet.has(v)) return '#0FA3'
    return '#444'
  }

  const handleNodeClick = (id) => {
    if (addingEdge === null) {
      setAddingEdge(id)
    } else {
      if (addingEdge !== id) {
        setCustomEdges((prev) => [...prev, [addingEdge, id]])
      }
      setAddingEdge(null)
    }
  }

  const dfsCodeByLang = {
    'C++': `void dfs(int u, vector<vector<int>>& graph, vector<bool>& visited) {
    visited[u] = true;
    for (int v : graph[u]) {
        if (!visited[v]) {
            dfs(v, graph, visited);
        }
    }
}`,
    Python: `def dfs(u, graph, visited):
    visited[u] = True
    for v in graph[u]:
        if not visited[v]:
            dfs(v, graph, visited)`,
    Java: `void dfs(int u, List<List<Integer>> graph, boolean[] visited) {
    visited[u] = true;
    for (int v : graph.get(u)) {
        if (!visited[v]) {
            dfs(v, graph, visited);
        }
    }
}`,
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-white overflow-hidden">
      <h1 className="text-center text-3xl font-bold py-6">
        DFS <span className="text-[#0FA]">Visualizer</span>
      </h1>

      <div className="absolute top-4 right-4 z-20 flex gap-2 mr-40 ">
        <select
          value={startNode}
          onChange={(e) => setStartNode(parseInt(e.target.value))}
          className="px-3 py-1 bg-[#111] border border-[#333] rounded-full text-sm text-white"
        >
          {nodes.map((node) => (
            <option
              key={node.id}
              value={node.id}
              className="bg-[#111] text-white"
            >
              Start from {node.id}
            </option>
          ))}
        </select>

        <Dropdown
          label="Lang:"
          options={['C++', 'Python', 'Java']}
          selected={codeLang}
          setSelected={setCodeLang}
        />

        <button
          onClick={() => setNodeCount((n) => Math.max(3, n - 1))}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => setNodeCount((n) => Math.min(12, n + 1))}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="absolute top-50 right-30  z-20 mr-40 bg-[#111] p-4 rounded-xl border border-[#333] text-sm w-96 max-h-[70vh] overflow-auto">
        <h2 className="font-bold mb-2 text-lg">DFS Code - {codeLang}</h2>
        <pre className="text-[#0FA] whitespace-pre-wrap">
          {dfsCodeByLang[codeLang]}
        </pre>
      </div>

      <svg className="absolute top-0 left-0 w-full h-full z-0">
        {[...edges, ...customEdges].map(([from, to], i) => {
          const fromNode = nodes.find((n) => n.id === from)
          const toNode = nodes.find((n) => n.id === to)
          return (
            <motion.line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={getEdgeColor(from, to)}
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 z-10">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${getNodeColor(
              node.id
            )} ${addingEdge === node.id ? 'ring-2 ring-yellow-400' : ''}`}
            style={{
              left: node.x,
              top: node.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: current === node.id ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => handleNodeClick(node.id)}
          >
            {node.id}
          </motion.div>
        ))}
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-gray-300 text-sm z-20">
        <p className="mb-1 font-medium text-white">Visited Array:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {visitedArray.map((val, i) => (
            <motion.span
              key={i}
              className={`px-3 py-1 rounded-full text-xs border ${
                val
                  ? 'bg-[#0FA]/20 border-[#0FA] text-[#0FA]'
                  : 'bg-[#222] border-[#444] text-white/50'
              }`}
              animate={{ scale: val ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {val}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DFSVisualizer
