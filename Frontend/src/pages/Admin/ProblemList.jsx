// src/pages/Admin/ProblemListForUpdate.jsx
import React, { useEffect, useState } from 'react'
import axiosClient from '../../utils/axiosClient'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ProblemList = ({ mode = 'update' }) => {
  const [problems, setProblems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()

  // Determine mode from URL if not passed as prop
  const currentMode =
    mode || (location.pathname.includes('delete') ? 'delete' : 'update')

  useEffect(() => {
    fetchProblems()
  }, [page])

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

      <div className="space-y-4">
        {problems.map((problem) => (
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
              className={`btn btn-sm ${
                currentMode === 'delete' ? 'btn-error' : 'btn-success'
              } cursor-pointer`}
              onClick={() => handleClick(problem._id)}
            >
              {currentMode === 'delete' ? 'Delete' : 'Update'}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="btn btn-sm btn-outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="text-sm text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-sm btn-outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ProblemList
