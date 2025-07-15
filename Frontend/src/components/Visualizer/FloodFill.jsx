import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Dropdown from '../DropDown'

const defaultSize = 5
const generateInitialGrid = (size) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 3))
  )

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

export default function FloodFillVisualizer() {
  const [size, setSize] = useState(defaultSize)
  const [grid, setGrid] = useState(generateInitialGrid(defaultSize))
  const [visited, setVisited] = useState([])
  const [sr, setSr] = useState(0)
  const [sc, setSc] = useState(0)
  const [color, setColor] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(300)
  const [language, setLanguage] = useState('cpp')

  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  const floodFill = async (sr, sc, newColor) => {
    const m = grid.length
    const n = grid[0].length
    const srccolor = grid[sr][sc]
    if (srccolor === newColor) return
    const visitedCopy = Array.from({ length: m }, () => Array(n).fill(false))
    const newGrid = grid.map((row) => [...row])

    async function dfs(i, j) {
      visitedCopy[i][j] = true
      newGrid[i][j] = newColor
      setVisited([...visitedCopy.map((r) => [...r])])
      setGrid([...newGrid.map((r) => [...r])])
      await delay(speed)
      for (const [dx, dy] of directions) {
        const x = i + dx
        const y = j + dy
        if (
          x >= 0 &&
          y >= 0 &&
          x < m &&
          y < n &&
          !visitedCopy[x][y] &&
          newGrid[x][y] === srccolor
        ) {
          await dfs(x, y)
        }
      }
    }

    setIsAnimating(true)
    await dfs(sr, sc)
    setIsAnimating(false)
  }

  const handleCellClick = (i, j) => {
    if (isAnimating) return
    setSr(i)
    setSc(j)
    floodFill(i, j, color)
  }

  const resetGrid = () => {
    setGrid(generateInitialGrid(size))
    setVisited([])
    setIsAnimating(false)
  }

  const codeSnippets = {
    cpp: `class Solution {
  vector<pair<int, int>> dirs = {{0,1},{0,-1},{1,0},{-1,0}};
  void dfs(int i, int j, vector<vector<int>>& image, vector<vector<int>>& vis, int color, int oldColor) {
    vis[i][j] = 1;
    image[i][j] = color;
    for (auto [dx, dy] : dirs) {
      int x = i + dx, y = j + dy;
      if (x >= 0 && x < image.size() && y >= 0 && y < image[0].size() &&
          !vis[x][y] && image[x][y] == oldColor) {
        dfs(x, y, image, vis, color, oldColor);
      }
    }
  }
public:
  vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    int oldColor = image[sr][sc];
    vector<vector<int>> vis(image.size(), vector<int>(image[0].size(), 0));
    dfs(sr, sc, image, vis, color, oldColor);
    return image;
  }
};`,
    python: `def flood_fill(image, sr, sc, color):
  old_color = image[sr][sc]
  if old_color == color:
    return image
  def dfs(i, j):
    if i < 0 or i >= len(image) or j < 0 or j >= len(image[0]) or image[i][j] != old_color:
      return
    image[i][j] = color
    for dx, dy in [(0,1),(0,-1),(1,0),(-1,0)]:
      dfs(i+dx, j+dy)
  dfs(sr, sc)
  return image`,
    java: `class Solution {
  int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
  public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int oldColor = image[sr][sc];
    if (oldColor == color) return image;
    dfs(image, sr, sc, oldColor, color);
    return image;
  }
  void dfs(int[][] image, int i, int j, int oldColor, int newColor) {
    if (i<0 || i>=image.length || j<0 || j>=image[0].length || image[i][j]!=oldColor) return;
    image[i][j] = newColor;
    for (int[] d : dirs) dfs(image, i+d[0], j+d[1], oldColor, newColor);
  }
}`,
  }

  return (
    <div className="p-6 bg-[#0d0d0d] min-h-screen text-white font-mono">
      <h1 className="text-2xl font-bold mb-4 text-[#0FA]">
        🌊 Flood Fill Visualizer
      </h1>

      <p className="text-sm text-gray-300 max-w-3xl mb-6">
        Flood Fill is an algorithm that changes the color of a region in a
        matrix. Starting from a pixel, it recursively (or iteratively) spreads
        in all four directions and fills the connected area with the new color,
        only replacing cells with the original color.
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="text-sm text-gray-300">Matrix Size:</label>
        <input
          type="number"
          min={3}
          max={10}
          value={size}
          onChange={(e) => {
            const newSize = Math.min(10, Math.max(3, parseInt(e.target.value)))
            setSize(newSize)
            setGrid(generateInitialGrid(newSize))
            setVisited([])
          }}
          className="px-2 py-1 rounded bg-[#111] border border-[#333] text-white w-20"
        />

        <label className="text-sm text-gray-300">🕒 Speed (ms):</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="accent-[#0FA]"
        />

        <button
          onClick={resetGrid}
          className="px-4 py-2 bg-[#222] text-white border border-white/20 rounded hover:bg-white/10"
        >
          Reset Grid
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(2rem, 1fr))` }}
        >
          {grid.map((row, i) =>
            row.map((val, j) => (
              <motion.div
                key={`${i}-${j}`}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm font-bold rounded-md border transition-all cursor-pointer ${
                  visited[i]?.[j] ? 'border-yellow-400' : 'border-gray-700'
                }`}
                style={{
                  backgroundColor:
                    val === 0
                      ? '#444'
                      : val === 1
                      ? '#3b82f6'
                      : val === 2
                      ? '#10b981'
                      : '#eab308',
                }}
                onClick={() => handleCellClick(i, j)}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                {val}
              </motion.div>
            ))
          )}
        </div>

        <div className="flex-1 bg-[#111] border border-[#333] left-80 rounded-xl p-4 w-full max-w-3xl">
          <h3 className="text-lg text-white font-semibold mb-2">
            📜 Flood Fill Code
          </h3>
          <Dropdown
            label="Lang:"
            options={['C++', 'Python', 'Java']}
            selected={language}
            setSelected={setLanguage}
          />
          <pre className="text-sm  text-green-400 whitespace-pre-wrap mt-3">
            {codeSnippets[language]}
          </pre>
        </div>
      </div>
    </div>
  )
}
