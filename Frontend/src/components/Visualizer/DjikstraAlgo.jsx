// DijkstraVisualizer.js
import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Code,
  Plus,
  Minus,
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
      const weight = Math.floor(Math.random() * 9) + 1
      edges.push([parent, i, weight])
    }
  }
  return { nodes, edges }
}

const DijkstraVisualizer = () => {
  const [nodeCount, setNodeCount] = useState(6)
  const [graphData, setGraphData] = useState(generateGraph(6))
  const [dist, setDist] = useState([])
  const [visited, setVisited] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [startNode, setStartNode] = useState(0)
  const [showCode, setShowCode] = useState(true)
  const [codeLang, setCodeLang] = useState('cpp')
  const playingRef = useRef(false)

  const INF = 1e9

  useEffect(() => {
    reset()
  }, [nodeCount, startNode])

  useEffect(() => {
    playingRef.current = playing

    if (playing) {
      let localStepIndex = stepIndex

      const interval = setInterval(() => {
        if (localStepIndex >= steps.length) {
          clearInterval(interval)
          setPlaying(false)
          return
        }

        const step = steps[localStepIndex]

        if (step.type === 'visit') {
          setVisited((v) => {
            const nv = [...v]
            nv[step.node] = true
            return nv
          })
          setCurrentNode(step.node)
          setDist(step.dist)
        } else if (step.type === 'update') {
          setDist(step.dist)
          setCurrentNode(step.to)
        }

        localStepIndex++
        setStepIndex(localStepIndex)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [playing])

  const reset = () => {
    const generated = generateGraph(nodeCount)
    setGraphData(generated)
    setDist(Array(nodeCount).fill(INF))
    setVisited(Array(nodeCount).fill(false))
    setCurrentNode(null)
    setPlaying(false)
    setStepIndex(0)

    const path = computeSteps(generated.nodes, generated.edges)
    setSteps(path)
  }

  const computeSteps = (nodes, edges) => {
    const graph = {}
    nodes.forEach((n) => (graph[n.id] = []))
    edges.forEach(([u, v, w]) => {
      graph[u].push([v, w])
      graph[v].push([u, w])
    })

    const steps = []
    const distance = Array(nodes.length).fill(INF)
    const vis = Array(nodes.length).fill(false)
    distance[startNode] = 0

    const pq = [[0, startNode]]

    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0])
      const [d, u] = pq.shift()
      if (vis[u]) continue
      vis[u] = true
      steps.push({ type: 'visit', node: u, dist: [...distance] })
      for (const [v, w] of graph[u]) {
        if (!vis[v] && distance[u] + w < distance[v]) {
          distance[v] = distance[u] + w
          pq.push([distance[v], v])
          steps.push({ type: 'update', from: u, to: v, dist: [...distance] })
        }
      }
    }

    return steps
  }

  const handleStep = () => {
    if (stepIndex >= steps.length) {
      setPlaying(false)
      return
    }
    const step = steps[stepIndex]

    if (step.type === 'visit') {
      setVisited((v) => {
        const nv = [...v]
        nv[step.node] = true
        return nv
      })
      setCurrentNode(step.node)
      setDist(step.dist)
    } else if (step.type === 'update') {
      setDist(step.dist)
      setCurrentNode(step.to)
    }
    setStepIndex((i) => i + 1)
  }

  const { nodes, edges } = graphData

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Dijkstra <span className="text-[#0FA]">Visualizer</span>
      </h1>

      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => setShowCode(!showCode)}
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

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            if (stepIndex < steps.length) setPlaying((p) => !p)
          }}
          className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
            stepIndex >= steps.length
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#0FA] text-black'
          }`}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleStep}
          className="border border-[#0FA] text-[#0FA] px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-[#0FA]/10"
        >
          <StepForward size={16} /> Step
        </button>
        <button
          onClick={reset}
          className="border border-red-500 text-red-500 px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-red-500/10"
        >
          <RotateCcw size={16} /> Reset
        </button>
        <select
          value={startNode}
          onChange={(e) => setStartNode(parseInt(e.target.value))}
          className="px-3 py-1 bg-[#111] border border-[#333] rounded-full text-sm text-white"
        >
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              Start from {n.id}
            </option>
          ))}
        </select>
      </div>

      {showCode && (
        <div className="absolute top-24 right-6 z-20 bg-[#111] p-4 rounded-xl border border-[#333] text-sm w-96 max-h-[70vh] overflow-auto">
          <h2 className="font-bold mb-2 text-lg">Dijkstra Code</h2>
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
            {codeLang === 'cpp' &&
              `
void dijkstra(int start, vector<vector<pair<int,int>>>& graph) {
  vector<int> dist(graph.size(), 1e9);
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  dist[start] = 0;
  pq.push({0, start});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    for (auto [v, w] : graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push({dist[v], v});
      }
    }
  }
}`}

            {codeLang === 'python' &&
              `
import heapq

def dijkstra(start, graph):
  dist = [float('inf')] * len(graph)
  dist[start] = 0
  pq = [(0, start)]
  while pq:
    d, u = heapq.heappop(pq)
    for v, w in graph[u]:
      if d + w < dist[v]:
        dist[v] = d + w
        heapq.heappush(pq, (dist[v], v))`}

            {codeLang === 'java' &&
              `
void dijkstra(int start, List<List<int[]>> graph) {
  int[] dist = new int[graph.size()];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[start] = 0;
  PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
  pq.offer(new int[]{0, start});
  while (!pq.isEmpty()) {
    int[] curr = pq.poll();
    int d = curr[0], u = curr[1];
    for (int[] edge : graph.get(u)) {
      int v = edge[0], w = edge[1];
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.offer(new int[]{dist[v], v});
      }
    }
  }
}`}
          </pre>
        </div>
      )}

      {/* Graph Edges */}
      <svg className="absolute top-0 left-0 w-full h-full z-0">
        {edges.map(([from, to, weight], i) => {
          const fromNode = nodes.find((n) => n.id === from)
          const toNode = nodes.find((n) => n.id === to)
          return (
            <g key={i}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#555"
                strokeWidth="2"
              />
              <text
                x={(fromNode.x + toNode.x) / 2}
                y={(fromNode.y + toNode.y) / 2}
                fill="#0FA"
                fontSize="12"
                textAnchor="middle"
              >
                {weight}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Graph Nodes */}
      <div className="absolute inset-0 z-10">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm
              ${
                visited[node.id]
                  ? 'bg-[#0FA] border-[#0FA] text-black'
                  : 'bg-[#111] border-[#444]'
              }`}
            style={{
              left: node.x,
              top: node.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: currentNode === node.id ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {node.id}
          </motion.div>
        ))}
      </div>

      {/* Distance Array */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-20">
        <p className="text-white mb-1 font-medium">Distance Array:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {dist.map((val, i) => (
            <motion.div
              key={i}
              className={`w-10 h-10 flex flex-col items-center justify-center border text-xs
                ${
                  val !== INF
                    ? 'bg-[#0FA]/20 border-[#0FA] text-[#0FA]'
                    : 'bg-[#222] border-[#444] text-white/50'
                }`}
              animate={{ scale: val !== INF ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[10px] text-white/40">{i}</span>
              <span>{val !== INF ? val : '-'}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DijkstraVisualizer
