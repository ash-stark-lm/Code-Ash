import React from 'react'

const ReferenceSolutionSection = ({ solutions, setSolutions }) => {
  const updateSolution = (idx, value) => {
    setSolutions((prev) =>
      prev.map((sol, i) => (i === idx ? { ...sol, main: value } : sol))
    )
  }

  const combineCode = ({ header = '', functionSignature = '', main = '' }) =>
    [header, functionSignature, main].filter(Boolean).join('\n').trim()

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#0FA] mb-2">
        Reference Solutions
      </h2>
      {solutions.map((sol, idx) => (
        <div key={idx} className="space-y-2 mb-4">
          <label className="text-sm">{sol.language.toUpperCase()}</label>
          <textarea
            className="w-full bg-black border border-[#333] p-2 rounded text-white min-h-[100px]"
            placeholder={`Complete solution for ${sol.language}`}
            value={combineCode(sol)}
            onChange={(e) => updateSolution(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

export default ReferenceSolutionSection
