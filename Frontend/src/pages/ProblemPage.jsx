import React, { useState, useRef, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import Editor from '@monaco-editor/react'
import axiosClient from '../utils/axiosClient'
import { useParams } from 'react-router'
import SubmissionResult from '../components/SubmissionResult'
import LoadingOverlay from '../components/LoadingOverlay'
import SubmissionHistory from '../components/SubmissionHistory'
import SolutionsTab from '../components/SolutionTab'
import RunResultPanel from '../components/RunResultPanel'
import ChatWithAI from '../components/ChatWithAI'

export default function ProblemPage() {
  // Add this check at the start of your component

  const [problem, setProblem] = useState(null)
  const [selectedLang, setSelectedLang] = useState('c++')
  const [code, setCode] = useState('')
  const [fontSize, setFontSize] = useState(14)
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [selectedTestcase, setSelectedTestcase] = useState(0)
  const [activeTab, setActiveTab] = useState('Description')
  const [submissionResults, setSubmissionResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissionsList, setSubmissionsList] = useState([])
  const [runResults, setRunResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [viewingSubmission, setViewingSubmission] = useState(null) // { code, passed }

  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)

  const dropdownRef = useRef()
  const { id } = useParams()

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/${id}`)
        setProblem(res.data)

        const starter = res.data.starterCode.find(
          (s) => s.language === selectedLang
        )
        setCode(starter?.boilerPlateCode || '')
      } catch (err) {
        console.error('Error fetching problem:', err)
      }
    }

    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true)
      try {
        const res = await axiosClient.get(`/problem/submissions/${id}`)
        setSubmissionsList(res.data.reverse()) // Reverse to show newest first
      } catch (err) {
        console.error('Error fetching submissions:', err)
        setSubmissionsList([]) // Set to empty array on error
      } finally {
        setIsLoadingSubmissions(false)
      }
    }

    fetchProblem()
    fetchSubmissions()
  }, [id, selectedLang])

  useEffect(() => {
    setSelectedTestcase(0)
  }, [problem])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFontDropdownOpen(false)
        setLangDropdownOpen(false)
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

  const resetBoilerplate = () => {
    const starter = problem?.starterCode.find(
      (s) => s.language === selectedLang
    )
    setCode(starter?.boilerPlateCode || '')
  }

  const handleSubmitCode = async () => {
    console.log('Submitting code:', code)

    try {
      setSubmitting(true)
      setSubmissionResults(null)

      const res = await axiosClient.post(`/submission/${id}`, {
        code,
        language: selectedLang,
      })

      // ✅ Destructure correctly from res.data
      const {
        accepted,
        totalTestCases,
        passedTestCases,
        runtime,
        memory,
        errMsg,
      } = res.data

      setSubmissionResults({
        passed: accepted,
        summary: {
          totalTestCases,
          passedTestCases,
          runtime,
          memory,
        },
        errMsg: errMsg || null,
      })

      setActiveTab('Submissions')
    } catch (error) {
      setSubmissionResults({
        passed: false,
        summary: {
          totalTestCases: 0,
          passedTestCases: 0,
          runtime: 0,
          memory: 0,
        },
        errMsg:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.',
      })
      setActiveTab('Submissions')
    } finally {
      setSubmitting(false)
    }
  }
  const handleRunCode = async () => {
    try {
      setRunning(true)
      setRunResults(null)

      const res = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language: selectedLang,
      })

      // Set entire runResults response
      setRunResults(res.data)

      setActiveTab('Run')
    } catch (error) {
      console.error('Run failed:', error)
      setRunResults({
        passed: false,
        totalTestCases: 0,
        passedTestCases: 0,
        errMsg: error?.response?.data?.message || error.message || 'Run failed',
      })
    } finally {
      setRunning(false)
    }
  }

  if (!problem) {
    return <LoadingOverlay />
  }

  return (
    <div className="min-h-screen bg-[#1a1c1e] text-white font-sans px-6 py-4">
      {submitting && <LoadingOverlay />}

      {/* Submit & Run Buttons */}
      {activeTab === 'Herby' && problem && (
        <div className="fixed inset-0 z-50 bg-[#0d0d0d]">
          <ChatWithAI problem={problem} />
          <button
            onClick={() => setActiveTab('Description')}
            className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold bg-white text-black rounded-md hover:bg-gray-200 z-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleRunCode}
          title="Shortcut: Ctrl + '"
          className="bg-white/10 border border-white/20 text-sm px-6 py-2 rounded-md hover:bg-white/20 transition flex items-center justify-center w-[90px] cursor-pointer"
        >
          {running ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Run'
          )}
        </button>

        <button
          onClick={handleSubmitCode}
          className="bg-[#0FA] text-black text-sm px-6 py-2 rounded-md hover:bg-[#0FA]/90 transition cursor-pointer"
        >
          Submit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Problem Section */}
        <div className="lg:col-span-5 bg-[#1F2123] rounded-xl p-6 border border-[#2A2D2E] space-y-4">
          {/* Tabs */}
          <div className="flex gap-3 border-b border-[#2A2D2E] pb-2 mb-4">
            {[
              'Description',
              'Editorial',
              'Solutions',
              'Submissions',
              'Herby',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#2A2D2E] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'Description' && (
            <>
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <p className="text-sm text-gray-400">
                {problem.difficulty.charAt(0).toUpperCase() +
                  problem.difficulty.slice(1)}{' '}
                • {problem.tags.join(', ')}
              </p>
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {problem.description}
              </p>
              {problem.visibleTestCases.length > 0 && (
                <div className="bg-[#26282A] p-4 rounded-lg border border-[#2f3234]">
                  <p className="text-white font-medium mb-2">Example:</p>
                  {problem.visibleTestCases.map((test, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="text-sm text-gray-300">
                        Input: {test.input}
                      </p>
                      <p className="text-sm text-gray-300">
                        Output: {test.output}
                      </p>
                      {test.explanation && (
                        <p className="text-sm text-gray-300">
                          Explanation: {test.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'Submissions' && (
            <>
              <SubmissionResult
                submitting={submitting}
                submissionResults={submissionResults}
                hasSubmissions={submissionsList.length > 0}
              />
              <div className="mt-6 border-t border-[#333] pt-4">
                <h2 className="text-white font-semibold mb-2 text-sm">
                  Previous Submissions
                </h2>
                <SubmissionHistory
                  submissions={submissionsList}
                  isLoading={isLoadingSubmissions}
                  onSelect={(submission) =>
                    setViewingSubmission({
                      code: submission.code,
                      passed: submission.status === 'accepted',
                    })
                  }
                />
              </div>
            </>
          )}
          {activeTab === 'Run' && (
            <RunResultPanel runResults={runResults} running={running} />
          )}

          {activeTab === 'Editorial' && (
            <p className="text-sm text-gray-400 italic">
              Editorial not available yet.
            </p>
          )}
          {activeTab === 'Solutions' && (
            <SolutionsTab
              referenceSolution={problem.referenceSolution}
              selectedLang={selectedLang}
            />
          )}
        </div>

        {/* RIGHT: Editor */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#1F2123] rounded-xl border border-[#2A2D2E] flex flex-col flex-grow">
            <div
              className="flex items-center gap-2 px-4 py-2 border-b border-[#2A2D2E]"
              ref={dropdownRef}
            >
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <button
                onClick={resetBoilerplate}
                className="ml-2 text-white hover:text-red-500 cursor-pointer "
              >
                <RotateCcw size={18} />
              </button>

              <div className="ml-auto flex items-center gap-3 relative">
                {/* Font Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setFontDropdownOpen(!fontDropdownOpen)
                      setLangDropdownOpen(false)
                    }}
                    className="text-sm text-gray-400 bg-[#1F2123] px-3 py-1 rounded-md border border-[#2A2D2E] cursor-pointer"
                  >
                    Font Size: {fontSize}px
                  </button>
                  {fontDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50">
                      {[14, 16, 18, 20, 22].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setFontSize(size)
                            setFontDropdownOpen(false)
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#222] cursor-pointer"
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setLangDropdownOpen(!langDropdownOpen)
                      setFontDropdownOpen(false)
                    }}
                    className="text-sm text-gray-400 bg-[#1F2123] px-3 py-1 rounded-md border border-[#2A2D2E] cursor-pointer"
                  >
                    Lang: {selectedLang.toLowerCase()}
                  </button>
                  {langDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50">
                      {['c++', 'python', 'java', 'javascript', 'c'].map(
                        (lang) => (
                          <button
                            key={lang}
                            onClick={() => setSelectedLang(lang)}
                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#222] cursor-pointer"
                          >
                            {lang.toLowerCase()}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`relative rounded-xl overflow-hidden border ${
                viewingSubmission
                  ? viewingSubmission.passed
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-[#2A2D2E]'
              }`}
            >
              {/* Exit View Button */}
              {viewingSubmission && (
                <div className="absolute top-3 right-7 mt-5 flex items-center gap-2 z-10">
                  {/* Status Badge */}
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      viewingSubmission.passed
                        ? 'bg-green-500 text-black'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {viewingSubmission.passed ? 'Accepted' : 'Rejected'}
                  </span>

                  {/* Exit Button */}
                  <button
                    onClick={() => setViewingSubmission(null)}
                    className="bg-[#0FA] text-black px-3 py-1.5 rounded-md text-xs font-semibold hover:scale-105 hover:shadow-[0_0_12px_#0FA] transition cursor-pointer"
                  >
                    Exit View
                  </button>
                </div>
              )}

              <Editor
                height="420px"
                language={getMonacoLang(selectedLang)}
                value={viewingSubmission ? viewingSubmission.code : code}
                onChange={(value) => {
                  if (!viewingSubmission) setCode(value || '')
                }}
                options={{
                  readOnly: !!viewingSubmission,
                  scrollBeyondLastLine: true,
                  automaticLayout: true,
                  scrollbar: { vertical: 'visible', horizontal: 'visible' },
                  minimap: { enabled: false },
                  fontSize: fontSize,
                }}
                theme="vs-dark"
              />
            </div>
          </div>
          {runResults && (
            <div className="text-sm text-white bg-[#2A2D2E] p-4 rounded-lg border border-[#3A3D3E]">
              <p>
                🧪 Passed {runResults.passed} / {runResults.total} test cases
              </p>
              {runResults.error && (
                <p className="text-red-400 mt-2">❌ {runResults.error}</p>
              )}
            </div>
          )}

          {/* Testcases */}
          <div className="bg-[#1F2123] rounded-xl border border-[#2A2D2E]">
            <div className="px-4 py-3 border-b border-[#2A2D2E] flex items-center gap-4">
              <p className="text-white font-semibold text-base">Testcases</p>
              <div className="flex gap-2 overflow-x-auto">
                {problem.visibleTestCases.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTestcase(idx)}
                    className={`px-3 py-1 text-sm rounded-md border cursor-pointer ${
                      selectedTestcase === idx
                        ? 'bg-white text-black border-white'
                        : 'text-gray-400 border-[#2A2D2E] hover:bg-[#2A2D2E]'
                    } transition whitespace-nowrap`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-1">
                  Input
                </p>
                <div className="bg-[#2A2D2E] p-3 rounded-md text-sm text-white font-mono whitespace-pre-wrap">
                  {problem.visibleTestCases[selectedTestcase].input}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-1">
                  Expected Output
                </p>
                <div className="bg-[#2A2D2E] p-3 rounded-md text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {problem.visibleTestCases[selectedTestcase].output}
                </div>
              </div>
              {problem.visibleTestCases[selectedTestcase].explanation && (
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-1">
                    Explanation
                  </p>
                  <div className="bg-[#2A2D2E] p-3 rounded-md text-sm text-gray-200 font-mono whitespace-pre-wrap">
                    {problem.visibleTestCases[selectedTestcase].explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
