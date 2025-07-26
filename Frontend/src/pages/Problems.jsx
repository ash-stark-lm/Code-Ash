import React, { useEffect, useRef, useState } from 'react'
import axiosClient from '../utils/axiosClient'
import { useNavigate } from 'react-router'
import LoadingOverlay from '../components/LoadingOverlay'
import { Book, CheckCircle, ArrowLeft } from 'lucide-react'

const PAGE_SIZE = 10

export default function Problems() {
  const [allProblems, setAllProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [allTags, setAllTags] = useState([])
  const [solvedProblemIds, setSolvedProblemIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

      const tagSet = new Set()
      fetched.forEach((p) => {
        p.tags.forEach((tag) => tagSet.add(tag.trim()))
      })
      setAllTags(Array.from(tagSet))
      setAllProblems(fetched)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const res = await axiosClient.get('/problem/user')
        const ids = res.data.map((prob) => prob._id)
        setSolvedProblemIds(ids)
      } catch (err) {
        console.error('Failed to fetch solved problems', err)
      }
    }

    fetchSolvedProblems()
  }, [])

  useEffect(() => {
    fetchProblems()
  }, [page, selectedDifficulty, selectedTag])

  // Client-side filtering for difficulty, tag, and search
  useEffect(() => {
    let filtered = allProblems

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      )
    }

    if (selectedTag !== 'All') {
      filtered = filtered.filter((p) =>
        p.tags.some((tag) => tag.trim() === selectedTag)
      )
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProblems(filtered)
  }, [allProblems, selectedDifficulty, selectedTag, searchQuery])

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
      <div className="flex items-center justify-between mb-10 border-b border-[#1f1f1f] pb-4">
        {/* Left: Heading with Icon */}
        <h1 className="text-4xl font-bold text-[#0FA] flex items-center gap-2">
          <Book size={28} /> Explore Problems
        </h1>

        {/* Right: Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition cursor-pointer text-sm text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-6">
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
            <div className="absolute mt-2 w-40 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50">
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

        {/* 🔍 Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-[#2d2d2d] placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA]"
          />
        </div>
      </div>

      {/* Problem List */}
      {loading ? (
        <LoadingOverlay />
      ) : (
        <div className="space-y-6">
          {filteredProblems.map((problem, idx) => (
            <div
              key={problem._id}
              onClick={() => handleProblemClick(problem._id)}
              className="cursor-pointer bg-[#0e1a1a] border border-[#1f1f1f] p-6 rounded-xl hover:border-[#0FA] transition-all"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {idx + 1 + (page - 1) * PAGE_SIZE}. {problem.title}
                  {solvedProblemIds.includes(problem._id) && (
                    <CheckCircle size={18} className="text-green-400" />
                  )}
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
      <div className="mt-6 flex justify-center gap-4 items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-5 py-2 rounded-lg font-semibold transition cursor-pointer
          ${
            page === 1
              ? 'bg-white/10 text-gray-500 cursor-not-allowed'
              : 'bg-[#0FA] text-black hover:scale-105 hover:shadow-[0_0_20px_#0FA]'
          }`}
        >
          ← Prev
        </button>

        <span className="text-gray-400 text-sm flex items-center">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-5 py-2 rounded-lg font-semibold transition cursor-pointer
          ${
            page === totalPages
              ? 'bg-white/10 text-gray-500 cursor-not-allowed'
              : 'bg-[#0FA] text-black hover:scale-105 hover:shadow-[0_0_20px_#0FA]'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
