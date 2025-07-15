import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axiosClient from '../../utils/axiosClient'
import { toast } from 'react-toastify'
import LoadingOverlay from '../../components/LoadingOverlay'
import {
  TitleInput,
  DescriptionInput,
  DifficultySelector,
  TagSelector,
  TestCaseSection,
  StarterCodeSection,
  ReferenceSolutionSection,
} from '../../components/Admin/index'

const LANGUAGES = ['c++', 'c', 'java', 'python', 'javascript']

const CreateProblem = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [tags, setTags] = useState([])
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: '', output: '', explanation: '' },
  ])
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', output: '' },
  ])
  const [starterCode, setStarterCode] = useState([])
  const [referenceSolution, setReferenceSolution] = useState([])
  const [loading, setLoading] = useState(false) // ✅ Add loading state

  useEffect(() => {
    const initLangObjects = (type) =>
      LANGUAGES.map((lang) => ({
        language: lang,
        ...(type === 'starter'
          ? { boilerPlateCode: '' }
          : { completeCode: '' }),
      }))

    setStarterCode(initLangObjects('starter'))
    setReferenceSolution(initLangObjects('solution'))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    const problem = {
      title,
      description,
      difficulty,
      tags: tags.map((t) => t.value),
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution,
    }

    try {
      await axiosClient.post('/problem/create', problem)
      toast.success(`✅ "${title}" created successfully!`)
    } catch (err) {
      toast.error(
        `❌ Failed to create problem: ${
          err?.response?.data?.message || 'Server error'
        }`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-10 bg-[#0e0e0e] text-white font-sans relative">
      {loading && <LoadingOverlay />}

      <div className="max-w-5xl mx-auto bg-[#111] p-8 rounded-xl border border-[#1f1f1f] shadow-md space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0FA]">Create Problem</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#0FA] font-semibold text-sm flex items-center gap-2 hover:underline hover:text-[#0fcfa0] transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <TitleInput value={title} onChange={setTitle} />
        <DescriptionInput value={description} onChange={setDescription} />
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
        <TagSelector value={tags} onChange={setTags} />
        <TestCaseSection
          visible={visibleTestCases}
          hidden={hiddenTestCases}
          setVisible={setVisibleTestCases}
          setHidden={setHiddenTestCases}
        />
        <StarterCodeSection codes={starterCode} setCodes={setStarterCode} />
        <ReferenceSolutionSection
          solutions={referenceSolution}
          setSolutions={setReferenceSolution}
        />
        <button
          onClick={handleSubmit}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
        >
          Submit Problem
        </button>
      </div>
    </div>
  )
}

export default CreateProblem
