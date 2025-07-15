import React, { useEffect, useRef, useState } from 'react'
import axiosClient from '../utils/axiosClient'
import { useNavigate } from 'react-router'
import LoadingOverlay from '../components/LoadingOverlay'
import { Book } from 'lucide-react'

const PAGE_SIZE = 10

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [allTags, setAllTags] = useState([])

  const difficultyRef = useRef()
  const tagRef = useRef()
  const navigate = useNavigate()

  const fetchProblems = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get(
        `/problem?page=${page}&limit=${PAGE_SIZE}`
      )
      let fetched = res.data.problems

      // Step 1: Build full unique tags from original fetched problems (before filtering)
      const tagSet = new Set()
      res.data.problems.forEach((p) => {
        p.tags.forEach((tag) => tagSet.add(tag.trim()))
      })
      setAllTags(Array.from(tagSet))

      // Step 2: Apply local filters
      if (selectedDifficulty !== 'All') {
        fetched = fetched.filter(
          (p) => p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
        )
      }
      if (selectedTag !== 'All') {
        fetched = fetched.filter((p) =>
          p.tags.some((tag) => tag.trim() === selectedTag)
        )
      }

      setProblems(fetched)

      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [page, selectedDifficulty, selectedTag])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (difficultyRef.current && !difficultyRef.current.contains(e.target)) {
        setShowDifficultyDropdown(false)
      }
      if (tagRef.current && !tagRef.current.contains(e.target)) {
        setShowTagDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const handleProblemClick = (id) => {
    navigate(`/problem/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 py-10 font-sans">
      <h1 className="text-4xl font-bold mb-10 text-[#0FA] border-b border-[#1f1f1f] pb-4">
        <div className="flex items-center gap-2">
          <Book size={28} /> Explore Problems
        </div>
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-10">
        {/* Difficulty Filter Dropdown */}
        <div className="relative" ref={difficultyRef}>
          <button
            onClick={() => setShowDifficultyDropdown((prev) => !prev)}
            className="px-4 py-2 bg-[#111] border border-[#2d2d2d] rounded-lg text-white hover:bg-[#1a1a1a] transition cursor-pointer"
          >
            Difficulty: {selectedDifficulty}
          </button>
          {showDifficultyDropdown && (
            <div className="absolute mt-2 w-40 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDifficulty(d)
                    setShowDifficultyDropdown(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#222] transition cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tag Filter Dropdown */}
        <div className="relative" ref={tagRef}>
          <button
            onClick={() => setShowTagDropdown((prev) => !prev)}
            className="px-4 py-2 bg-[#111] border border-[#2d2d2d] rounded-lg text-white hover:bg-[#1a1a1a] transition cursor-pointer"
          >
            Tag: {selectedTag}
          </button>
          {showTagDropdown && (
            <div className="absolute mt-2 w-40 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50 ">
              <button
                onClick={() => {
                  setSelectedTag('All')
                  setShowTagDropdown(false)
                }}
                className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#222] transition cursor-pointer"
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag)
                    setShowTagDropdown(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#222] transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Problem List */}
      {loading ? (
        <LoadingOverlay />
      ) : (
        <div className="space-y-6">
          {problems.map((problem, idx) => (
            <div
              key={problem._id}
              onClick={() => handleProblemClick(problem._id)}
              className="cursor-pointer bg-[#0e1a1a] border border-[#1f1f1f] p-6 rounded-xl hover:border-[#0FA] transition-all"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {idx + 1 + (page - 1) * PAGE_SIZE}. {problem.title}
                </h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                    problem.difficulty.toLowerCase() === 'easy'
                      ? 'text-green-400 bg-green-900/30'
                      : problem.difficulty.toLowerCase() === 'medium'
                      ? 'text-yellow-400 bg-yellow-900/30'
                      : 'text-red-400 bg-red-900/30'
                  }`}
                >
                  {problem.difficulty.charAt(0).toUpperCase() +
                    problem.difficulty.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-300">
                {problem.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 border border-[#2d2d2d] bg-[#111]/50 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
        >
          ← Prev
        </button>
        <span className="text-gray-400 text-sm flex items-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
