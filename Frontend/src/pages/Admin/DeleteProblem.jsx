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

const DeleteProblem = () => {
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
        navigate('/admin')
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id, navigate])

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${title}"?`
    )
    if (!confirm) return

    setLoading(true)
    try {
      await axiosClient.delete(`/problem/${id}`)
      toast.success(`🗑️ "${title}" deleted successfully!`)
      navigate('/admin')
    } catch (err) {
      toast.error(
        `❌ Delete failed: ${err?.response?.data?.message || 'Server error'}`
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
          <h1 className="text-3xl font-bold text-red-500">Delete Problem</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-red-500 font-semibold text-sm flex items-center gap-2 hover:underline hover:text-red-600 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <TitleInput value={title} onChange={() => {}} disabled />
        <DescriptionInput value={description} onChange={() => {}} disabled />
        <DifficultySelector value={difficulty} onChange={() => {}} disabled />
        <TagSelector value={tags} onChange={() => {}} disabled />
        <TestCaseSection
          visible={visibleTestCases}
          hidden={hiddenTestCases}
          setVisible={() => {}}
          setHidden={() => {}}
          disabled
        />
        <StarterCodeSection codes={starterCode} setCodes={() => {}} disabled />
        <ReferenceSolutionSection
          solutions={referenceSolution}
          setSolutions={() => {}}
          disabled
        />

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#F00] transition cursor-pointer"
        >
          Delete Problem
        </button>
      </div>
    </div>
  )
}

export default DeleteProblem
