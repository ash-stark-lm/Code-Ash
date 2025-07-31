import React, { useEffect, useState } from 'react'
import axiosClient from '../utils/axiosClient.js'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import SolvedProblems from '../components/SolvedProblem.jsx'
import Heatmap from '../components/HeatMap.jsx'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import StreakCard from '../components/StreakCard.jsx'
import DeleteAccountModal from '../components/DeleteAccountModal.jsx'
import { toast } from 'react-toastify'
import { deleteAccount } from '../authSlice.js'

const PIE_COLORS = ['#0FA', '#facc15', '#ef4444', '#334155']

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [solvedProblems, setSolvedProblems] = useState([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [formData, setFormData] = useState({ age: '', gender: '' })
  const [isEditingAge, setIsEditingAge] = useState(false)
  const [isEditingGender, setIsEditingGender] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.user?._id)

  useEffect(() => {
    if (!userId) return // wait until Redux has the userId
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await axiosClient.get('/auth/user/profile')
        const user = res.data

        const [solvedRes, acceptedSubmissionsRes, totalRes] = await Promise.all(
          [
            axiosClient.get('/problem/user'),
            axiosClient.get(`/problem/accepted-submissions/${userId}`),
            axiosClient.get('/problem?page=1&limit=1'),
          ]
        )

        const solved = solvedRes.data || []
        const accepted = acceptedSubmissionsRes.data || []
        setSolvedProblems(solved)
        setSubmissions(accepted)
        setTotalProblems(totalRes.data.totalProblems || 0)

        const calculateStreaks = (submissions) => {
          const dateSet = new Set()
          submissions.forEach((sub) => {
            const date = new Date(sub.solvedAt).toISOString().split('T')[0]
            dateSet.add(date)
          })

          const sortedDates = Array.from(dateSet)
            .map((d) => new Date(d))
            .sort((a, b) => a - b)

          let maxStreak = 0
          let currentStreak = 0
          let prevDate = null

          const today = new Date()
          const todayStr = today.toISOString().split('T')[0]

          for (let i = 0; i < sortedDates.length; i++) {
            const date = sortedDates[i]
            if (prevDate === null) {
              currentStreak = 1
            } else {
              const diff = (date - prevDate) / (1000 * 60 * 60 * 24)
              if (diff === 1) currentStreak++
              else if (diff === 0) continue
              else currentStreak = 1
            }
            maxStreak = Math.max(maxStreak, currentStreak)
            prevDate = date
          }

          const lastDateStr = sortedDates.at(-1)?.toISOString().split('T')[0]
          const yesterday = new Date()
          yesterday.setDate(today.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          const isActive =
            lastDateStr === todayStr || lastDateStr === yesterdayStr
          if (!isActive) currentStreak = 0

          return { currentStreak, maxStreak }
        }

        const { currentStreak, maxStreak } = calculateStreaks(accepted)

        setUser({
          _id: user._id,
          name: user.firstName,
          email: user.emailId,
          role: user.role,
          age: user.age,
          gender: user.gender,
          solved: solved.length,
          submissions: accepted.length,
          streak: currentStreak,
          maxStreak,
          solutionPosts: 0,
        })

        setFormData({ age: user.age || '', gender: user.gender || '' })
      } catch (err) {
        console.error(
          'Error fetching user:',
          err?.response?.data || err.message
        )
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const updateField = async (field) => {
    setLoading(true)
    try {
      await axiosClient.patch('/auth/user/update', { [field]: formData[field] })
      const userRes = await axiosClient.get('/auth/user/profile')
      const updatedUser = userRes.data
      setUser((prev) => ({ ...prev, [field]: updatedUser[field] }))
      setFormData((prev) => ({ ...prev, [field]: updatedUser[field] }))
      if (field === 'age') setIsEditingAge(false)
      if (field === 'gender') setIsEditingGender(false)
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await dispatch(deleteAccount()).unwrap()
      toast.success('Account deleted successfully')
      setTimeout(() => navigate('/signup', { replace: true }), 400)
    } catch (error) {
      toast.error(error || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <LoadingOverlay />

  const easy = solvedProblems.filter((p) => p.difficulty === 'easy').length
  const medium = solvedProblems.filter((p) => p.difficulty === 'medium').length
  const hard = solvedProblems.filter((p) => p.difficulty === 'hard').length
  const solvedTotal = easy + medium + hard
  const unsolvedCount = Math.max(totalProblems - solvedTotal, 0)

  const pieData = [
    { name: 'Solved (Easy)', value: easy },
    { name: 'Solved (Medium)', value: medium },
    { name: 'Solved (Hard)', value: hard },
    { name: 'Unsolved', value: unsolvedCount },
  ]

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-10 text-white bg-[#111] min-h-screen relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {loading && <LoadingOverlay />}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mx-auto mb-10 px-2 relative"
      >
        <button
          onClick={() => navigate(-1)}
          className=" hidden sm:block absolute right-2 top-2 sm:right-4 sm:top-4 bg-[#0FA] text-black px-3 py-1 sm:px-5 sm:py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug sm:leading-tight">
          Welcome,{' '}
          <span className="text-[#0FA]">
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          </span>
          <br />
          <span className="text-sm sm:text-base md:text-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
            Thanks for being an active user of{' '}
            <span>
              Code<span className="text-[#0FA]">Ash</span>
            </span>
          </span>
        </h1>
      </motion.div>

      <div className="bg-[#0a0a0a] text-white px-2 sm:px-6 pb-10 font-inter pt-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#2a2a2a] text-3xl sm:text-4xl md:text-5xl flex items-center justify-center font-bold border-2 border-[#333]">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </h1>
              <div className="text-[#b78bfa] text-sm sm:text-base capitalize">
                {user.role}
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-2 text-sm text-[#aaa] items-center sm:items-start">
                <div className="flex items-center gap-1">
                  👤 Age:
                  {isEditingAge ? (
                    <>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        className="bg-[#1a1a1a] text-white px-2 py-1 border border-[#333] rounded w-20 ml-1"
                      />
                      <button
                        type="button"
                        onClick={() => updateField('age')}
                        className="text-[#0FA] ml-1 hover:underline"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="ml-1">{user.age}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingAge(true)}
                        className="text-[#0FA] ml-1 hover:underline"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  ⚥ Gender:
                  {isEditingGender ? (
                    <>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="bg-[#1a1a1a] text-white px-2 py-1 border border-[#333] rounded ml-1"
                      >
                        <option value="">--</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => updateField('gender')}
                        className="text-[#0FA] ml-1 hover:underline"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="ml-1 capitalize">{user.gender}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingGender(true)}
                        className="text-[#0FA] ml-1 hover:underline"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#F00] transition w-full sm:w-auto"
            >
              Delete Account
            </button>
          </div>
        </div>

        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="bg-[#111] p-4 rounded-xl border border-[#222]"
          >
            <div className="text-[#0FA] font-semibold text-sm mb-1">
              Problems Solved
            </div>
            <div className="text-xl sm:text-2xl font-bold">{solvedTotal}</div>
            <div className="text-sm text-[#888] mb-4">
              Out of {totalProblems} total problems
            </div>
            <div className="overflow-x-auto">
              <PieChart width={260} height={220}>
                <Pie
                  dataKey="value"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                  }}
                />
              </PieChart>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] p-6 rounded-2xl border border-[#262626] shadow-lg"
          >
            <StreakCard streak={user.streak} maxStreak={user.maxStreak} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SolvedProblems
            problems={solvedProblems}
            onProblemClick={(id) => navigate(`/problem/${id}`)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Heatmap submissions={submissions} />
        </motion.div>
      </div>

      {showModal && (
        <DeleteAccountModal
          onClose={() => setShowModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </motion.div>
  )
}

export default ProfilePage
