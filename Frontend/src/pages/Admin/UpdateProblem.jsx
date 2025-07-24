// src/pages/Admin/UpdateProblem.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
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
} from '../../components/Admin'

const LANGUAGES = ['c++', 'c', 'java', 'python', 'javascript']

const UpdateProblem = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [tags, setTags] = useState([])
  const [visibleTestCases, setVisibleTestCases] = useState([])
  const [hiddenTestCases, setHiddenTestCases] = useState([])
  const [starterCode, setStarterCode] = useState([])
  const [referenceSolution, setReferenceSolution] = useState([])

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/${id}`)
        const p = res.data
        setTitle(p.title)
        setDescription(p.description)
        setDifficulty(p.difficulty)
        setTags(p.tags.map((t) => ({ label: t, value: t })))
        setVisibleTestCases(p.visibleTestCases)
        setHiddenTestCases(p.hiddenTestCases)
        setStarterCode(p.starterCode)
        setReferenceSolution(p.referenceSolution)
      } catch (err) {
        toast.error('Failed to load problem.')
        navigate('/admin/problems')
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id, navigate])

  const handleUpdate = async () => {
    setLoading(true)
    const sanitizedReferenceSolutions = referenceSolution.map((sol) => ({
      language: sol.language,
      header: sol.header || '',
      functionSignature: sol.functionSignature,
      main: sol.main,
    }))
    const updatedProblem = {
      title,
      description,
      difficulty,
      tags: tags.map((t) => t.value),
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution: sanitizedReferenceSolutions,
    }

    try {
      await axiosClient.put(`/problem/update/${id}`, updatedProblem)
      toast.success(`✅ "${title}" updated successfully!`)
      navigate('/admin/update-problem')
    } catch (err) {
      toast.error(
        `❌ Update failed: ${err?.response?.data?.message || 'Server error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-10 bg-[#0e0e0e] text-white font-sans relative">
      {loading && <LoadingOverlay message="Loading..." />}

      <div className="max-w-5xl mx-auto bg-[#111] p-8 rounded-xl border border-[#1f1f1f] shadow-md space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0FA]">Update Problem</h1>
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
          onClick={handleUpdate}
          className="bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default UpdateProblem
