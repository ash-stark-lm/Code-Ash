import React, { useEffect, useState } from 'react'
import axiosClient from '../../utils/axiosClient'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ProblemList = ({ mode = 'update' }) => {
  const [problems, setProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()

  const currentMode =
    mode || (location.pathname.includes('delete') ? 'delete' : 'update')

  useEffect(() => {
    fetchProblems()
  }, [page])

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      setFilteredProblems(
        problems.filter((p) => p.title.toLowerCase().includes(lowerQuery))
      )
    } else {
      setFilteredProblems(problems)
    }
  }, [searchQuery, problems])

  const fetchProblems = async () => {
    try {
      const res = await axiosClient.get(`/problem?page=${page}&limit=10`)
      setProblems(res.data.problems)
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      console.error('Failed to fetch problems', err)
    }
  }

  const handleClick = (id) => {
    if (currentMode === 'delete') {
      navigate(`/admin/delete-problem/${id}`)
    } else {
      navigate(`/admin/update-problem/${id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0FA]">
          {currentMode === 'delete' ? 'Delete Problems' : 'Edit Problems'}
        </h1>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Admin Panel</span>
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0FA] shadow-[0_0_10px_#0FA40] transition"
        />
      </div>

      {/* Problem Cards */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div
            key={problem._id}
            className="flex justify-between items-center bg-[#1a1a1a] border border-[#333] p-4 rounded-lg"
          >
            <div>
              <h2 className="text-lg font-semibold">{problem.title}</h2>
              <p className="text-sm text-gray-400">{problem.difficulty}</p>
              <div className="text-sm text-gray-400">
                {problem.tags?.join(', ')}
              </div>
            </div>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer
    ${
      currentMode === 'delete'
        ? 'bg-[#ff4c4c] text-black hover:brightness-110 hover:shadow-[0_0_12px_#ff4c4c]'
        : 'bg-[#0FA] text-black hover:brightness-110 hover:shadow-[0_0_15px_#0FA]'
    }`}
              onClick={() => handleClick(problem._id)}
            >
              {currentMode === 'delete' ? 'Delete' : 'Update'}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4">
        {/* Prev Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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

        {/* Page Info (now vertically aligned) */}
        <span className="text-sm text-gray-300">
          Page {page} of {totalPages}
        </span>

        {/* Next Button */}
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

export default ProblemList
