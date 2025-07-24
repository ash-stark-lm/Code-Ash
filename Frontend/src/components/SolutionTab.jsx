import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { ChevronDown, Code2 } from 'lucide-react'

const languages = ['c++', 'python', 'java', 'javascript', 'c']

export default function SolutionViewer({ referenceSolution }) {
  const [selectedLang, setSelectedLang] = useState('c++')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef()

  const selectedSolution = referenceSolution?.find(
    (ref) => ref.language === selectedLang
  )

  const selectedCode = selectedSolution
    ? [
        selectedSolution.header,
        selectedSolution.functionSignature,
        selectedSolution.main,
      ]
        .filter(Boolean)
        .join('\n')
        .trim()
    : null

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getMonacoLang = (lang) => {
    if (lang === 'c++') return 'cpp'
    if (lang === 'java') return 'java'
    if (lang === 'python') return 'python'
    if (lang === 'javascript') return 'javascript'
    if (lang === 'c') return 'c'
    return 'cpp'
  }

  return (
    <div className="space-y-4">
      {/* Language Selector Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Code2 size={16} />
          <span>Reference Solution</span>
        </div>

        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1F2123] text-white border border-[#2A2D2E] rounded-md hover:bg-[#2A2D2E] transition text-sm cursor-pointer"
          >
            {selectedLang}
            <ChevronDown className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#222] transition text-white ${
                    lang === selectedLang ? 'bg-[#222]' : ''
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monaco Code Viewer */}
      <div className="rounded-xl border border-[#2A2D2E] overflow-hidden">
        <Editor
          height="400px"
          language={getMonacoLang(selectedLang)}
          value={selectedCode || '// Solution not available'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          theme="vs-dark"
        />
      </div>
    </div>
  )
}
