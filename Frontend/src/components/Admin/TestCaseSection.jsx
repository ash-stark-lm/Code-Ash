import React from 'react'
import { Plus } from 'lucide-react'

const TestCaseSection = ({ visible, hidden, setVisible, setHidden }) => {
  const handleAddVisible = () => {
    setVisible([...(visible || []), { input: '', output: '', explanation: '' }])
  }

  const handleAddHidden = () => {
    setHidden([...(hidden || []), { input: '', output: '' }])
  }

  return (
    <div className="space-y-6">
      {/* ✅ Visible Test Cases */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-[#0FA]">
            Visible Test Cases
          </h2>
          <button
            onClick={handleAddVisible}
            className="text-[#0FA] p-1 rounded hover:bg-[#0fa]/10 transition cursor-pointer"
            title="Add visible test case"
          >
            <Plus size={18} />
          </button>
        </div>

        {(visible || []).map((tc, index) => (
          <div key={index} className="space-y-2 mb-4">
            <input
              type="text"
              className="w-full bg-[#111] text-white border border-[#2a2a2a] px-3 py-2 rounded-md"
              placeholder="Input"
              value={tc.input}
              onChange={(e) => {
                const updated = [...visible]
                updated[index].input = e.target.value
                setVisible(updated)
              }}
            />
            <input
              type="text"
              className="w-full bg-[#111] text-white border border-[#2a2a2a] px-3 py-2 rounded-md"
              placeholder="Output"
              value={tc.output}
              onChange={(e) => {
                const updated = [...visible]
                updated[index].output = e.target.value
                setVisible(updated)
              }}
            />
            <input
              type="text"
              className="w-full bg-[#111] text-white border border-[#2a2a2a] px-3 py-2 rounded-md"
              placeholder="Explanation"
              value={tc.explanation}
              onChange={(e) => {
                const updated = [...visible]
                updated[index].explanation = e.target.value
                setVisible(updated)
              }}
            />
          </div>
        ))}
      </div>

      {/* ✅ Hidden Test Cases */}
      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-[#0FA]">
            Hidden Test Cases
          </h2>
          <button
            onClick={handleAddHidden}
            className="text-[#0FA] p-1 rounded hover:bg-[#0fa]/10 transition cursor-pointer"
            title="Add hidden test case"
          >
            <Plus size={18} />
          </button>
        </div>

        {(hidden || []).map((tc, index) => (
          <div key={index} className="space-y-2 mb-4">
            <input
              type="text"
              className="w-full bg-[#111] text-white border border-[#2a2a2a] px-3 py-2 rounded-md"
              placeholder="Input"
              value={tc.input}
              onChange={(e) => {
                const updated = [...hidden]
                updated[index].input = e.target.value
                setHidden(updated)
              }}
            />
            <input
              type="text"
              className="w-full bg-[#111] text-white border border-[#2a2a2a] px-3 py-2 rounded-md"
              placeholder="Output"
              value={tc.output}
              onChange={(e) => {
                const updated = [...hidden]
                updated[index].output = e.target.value
                setHidden(updated)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestCaseSection
