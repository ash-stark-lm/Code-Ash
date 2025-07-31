import React, { useState } from 'react'

const SolvedProblems = ({ problems, onProblemClick }) => {
  const [search, setSearch] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const problemsPerPage = 30

  const difficultyMap = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  }

  const grouped = {
    Easy: [],
    Medium: [],
    Hard: [],
  }

  if (!problems || problems.length === 0) {
    return <div className="text-[#888] mt-6">No solved problems yet.</div>
  }

  problems.forEach((p) => {
    const normalized = difficultyMap[p.difficulty?.toLowerCase()] || 'Medium'
    grouped[normalized].push(p)
  })

  const allFiltered = Object.entries(grouped)
    .filter(
      ([difficulty]) =>
        selectedDifficulty === 'All' || difficulty === selectedDifficulty
    )
    .flatMap(([_, list]) =>
      list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    )

  const total = allFiltered.length
  const paginated = allFiltered.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  )

  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-[#222] mt-6 relative">
      <div className="text-[#0FA] font-semibold text-sm mb-2">
        Problems Solved
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 relative">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1 px-3 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded focus:outline-none"
        />

        {/* Difficulty Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDifficultyDropdown((prev) => !prev)}
            className="px-3 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded text-left w-40 cursor-pointer"
          >
            {selectedDifficulty}
          </button>

          {showDifficultyDropdown && (
            <div className="absolute mt-2 w-40 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50 cursor-pointer">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDifficulty(d)
                    setShowDifficultyDropdown(false)
                    setCurrentPage(1)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-[#222] cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="text-[#888]">No matching problems found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginated.map((problem) => (
            <div
              key={problem._id}
              onClick={() => onProblemClick(problem._id)}
              className="p-3 bg-[#1a1a1a] border border-[#333] hover:bg-[#222] rounded-lg cursor-pointer text-white text-sm"
            >
              {problem.title}
              <div className="text-xs text-[#777] mt-1">
                {difficultyMap[problem.difficulty?.toLowerCase()] || 'Medium'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > problemsPerPage && (
        <div className="flex justify-between mt-4 text-sm text-white">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-[#0FA] hover:underline disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-[#888]">Page {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((p) => (p * problemsPerPage >= total ? p : p + 1))
            }
            disabled={currentPage * problemsPerPage >= total}
            className="text-[#0FA] hover:underline disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  )
}

export default SolvedProblems
