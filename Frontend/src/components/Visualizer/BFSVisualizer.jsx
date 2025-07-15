// BFSGraphVisualizer.js
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Plus,
  Minus,
  Code,
} from 'lucide-react'

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

const BFSVisualizer = () => {
  const [nodeCount, setNodeCount] = useState(8)
  const [graphData, setGraphData] = useState(generateGraph(8))
  const [visitedArray, setVisitedArray] = useState(Array(8).fill(-1))
  const [visitedSet, setVisitedSet] = useState(new Set())
  const [current, setCurrent] = useState(null)
  const [activeEdge, setActiveEdge] = useState(null)
  const [queueState, setQueueState] = useState([])
  const [poppedNode, setPoppedNode] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [customEdges, setCustomEdges] = useState([])
  const [addingEdge, setAddingEdge] = useState(null)
  const [startNode, setStartNode] = useState(0)
  const [showCode, setShowCode] = useState(true)
  const [codeLang, setCodeLang] = useState('cpp')

  const levelColors = [
    '#0FA',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ec4899',
    '#a855f7',
    '#f87171',
  ]

  useEffect(() => {
    reset()
  }, [nodeCount, customEdges, startNode])

  const { nodes, edges } = graphData
  const graph = buildGraph()
  const steps = computeBFSPath()

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

  function computeBFSPath() {
    const visited = new Set()
    const steps = []
    const queue = [[startNode, 0]]
    visited.add(startNode)
    steps.push({
      type: 'visit',
      node: startNode,
      edge: null,
      level: 0,
      queue: [...queue],
    })

    while (queue.length > 0) {
      const [u, level] = queue.shift()
      steps.push({ type: 'pop', popped: u, queue: [...queue] })
      for (const v of graph[u]) {
        if (!visited.has(v)) {
          visited.add(v)
          queue.push([v, level + 1])
          steps.push({
            type: 'visit',
            node: v,
            edge: [u, v],
            level: level + 1,
            queue: [...queue],
          })
        }
      }
    }
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
        newArr[step.node] = step.level
        return newArr
      })
      setCurrent(step.node)
      setActiveEdge(step.edge)
      setQueueState(step.queue.map(([n]) => n))
      setPoppedNode(null)
    } else if (step.type === 'pop') {
      setQueueState(step.queue.map(([n]) => n))
      setPoppedNode(step.popped)
    }

    setStepIndex((i) => i + 1)
  }

  const reset = () => {
    setGraphData(generateGraph(nodeCount))
    setVisitedArray(Array(nodeCount).fill(-1))
    setVisitedSet(new Set())
    setCurrent(null)
    setActiveEdge(null)
    setQueueState([])
    setPlaying(false)
    setStepIndex(0)
    setPoppedNode(null)
  }

  const getNodeColor = (id) => {
    if (current === id) return 'bg-[#0FA] border-[#0FA] text-black'
    if (visitedArray[id] !== -1) {
      const level = visitedArray[id]
      return `bg-[${
        levelColors[level % levelColors.length]
      }] border-white text-white`
    }
    return 'bg-[#111]  border-[#444]'
  }

  const getEdgeColor = (u, v) => {
    if (!activeEdge) return '#444'
    if (
      (activeEdge[0] === u && activeEdge[1] === v) ||
      (activeEdge[0] === v && activeEdge[1] === u)
    ) {
      const lvlU = visitedArray[u]
      const lvlV = visitedArray[v]
      const activeLevel = Math.max(lvlU, lvlV)
      if (activeLevel !== -1) {
        return levelColors[activeLevel % levelColors.length]
      }
      return '#0FA'
    }
    if (visitedSet.has(u) && visitedSet.has(v)) {
      const lvlU = visitedArray[u],
        lvlV = visitedArray[v]
      if (lvlU !== -1 && lvlV !== -1 && lvlU !== lvlV)
        return levelColors[Math.min(lvlU, lvlV) % levelColors.length]
      return '#0FA3'
    }
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

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-white overflow-hidden">
      <h1 className="text-center text-3xl font-bold py-6">
        BFS <span className="text-[#0FA]">Visualizer</span>
      </h1>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setShowCode((s) => !s)}
          className="p-2 border rounded-full hover:bg-white/10"
        >
          <Code size={16} />
        </button>
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
        <select
          value={startNode}
          onChange={(e) => setStartNode(parseInt(e.target.value))}
          className="px-3 py-1 bg-[#111] border border-[#333] rounded-full text-sm text-white"
        >
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              Start from {node.id}
            </option>
          ))}
        </select>
      </div>

      {showCode && (
        <div className="absolute top-20  right-50 z-20 bg-[#111] p-4 rounded-xl border border-[#333] text-sm w-96 max-h-[70vh] overflow-auto">
          <h2 className="font-bold mb-2 text-lg">BFS Code</h2>
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
            {codeLang === 'python' &&
              `from collections import deque

def bfs(start, graph):
    visited = [False] * len(graph)
    level = [0] * len(graph)
    queue = deque([(start, 0)])
    visited[start] = True

    while queue:
        node, lvl = queue.popleft()
        for neighbor in graph[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                level[neighbor] = lvl + 1
                queue.append((neighbor, lvl + 1))`}

            {codeLang === 'cpp' &&
              `void bfs(int start, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    vector<int> level(graph.size(), 0);
    queue<pair<int, int>> q;
    q.push({start, 0});
    visited[start] = true;

    while (!q.empty()) {
        auto [node, lvl] = q.front();
        q.pop();
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                level[neighbor] = lvl + 1;
                q.push({neighbor, lvl + 1});
            }
        }
    }
}`}

            {codeLang === 'java' &&
              `void bfs(int start, List<List<Integer>> graph) {
    boolean[] visited = new boolean[graph.size()];
    int[] level = new int[graph.size()];
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{start, 0});
    visited[start] = true;

    while (!queue.isEmpty()) {
        int[] pair = queue.poll();
        int node = pair[0], lvl = pair[1];
        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                level[neighbor] = lvl + 1;
                queue.offer(new int[]{neighbor, lvl + 1});
            }
        }
    }
}`}
          </pre>
        </div>
      )}

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
              initial={{ stroke: '#000', opacity: 0 }}
              animate={{ stroke: getEdgeColor(from, to), opacity: 1 }}
              transition={{ duration: 0.5 }}
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
      <div className="absolute top-1/2 left-[620px] -translate-y-1/2 bg-[#111] border border-[#333] p-3 rounded-xl text-sm z-20">
        <h3 className="font-bold mb-2 text-white text-center">Queue</h3>
        <div className="flex gap-2">
          <AnimatePresence>
            {queueState.map((id) => (
              <motion.div
                key={id}
                className={`w-8 h-8 flex items-center justify-center text-xs font-semibold border ${
                  id === poppedNode
                    ? 'bg-red-500/20 text-red-500 border-red-500'
                    : 'bg-[#0FA]/20 text-[#0FA] border-[#0FA]'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring' }}
              >
                {id}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Visited Array */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-gray-300 text-sm z-20">
        <p className="mb-1 font-medium text-white">Visited Array:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {visitedArray.map((val, i) => (
            <motion.div
              key={i}
              className={`w-10 h-10 flex flex-col justify-center items-center border text-xs ${
                val !== -1
                  ? 'bg-[#0FA]/20 border-[#0FA] text-[#0FA]'
                  : 'bg-[#222] border-[#444] text-white/50'
              }`}
              animate={{ scale: val !== -1 ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[10px] text-white/40">{i}</span>
              <span>{val !== -1 ? val : '-'}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BFSVisualizer
