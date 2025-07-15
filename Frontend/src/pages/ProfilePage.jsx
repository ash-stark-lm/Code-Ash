import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import axiosClient from '../utils/axiosClient'
import { ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'

const COLORS = ['#0FA', '#555']

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({ age: '', gender: '' })
  const [solvedCount, setSolvedCount] = useState(0)
  const [totalProblems, setTotalProblems] = useState(0)
  const [isEditingAge, setIsEditingAge] = useState(false)
  const [isEditingGender, setIsEditingGender] = useState(false)
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosClient.get('/auth/user/profile')
        const totalRes = await axiosClient.get('/problem?page=1&limit=1')
        const solvedCount = userRes.data.problemSolved?.length || 0

        setCurrentUser(userRes.data)
        setSolvedCount(solvedCount)
        setTotalProblems(totalRes.data.totalProblems || 0)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosClient.patch('/auth/user/update', formData)
      const userRes = await axiosClient.get('/auth/user/profile')
      setCurrentUser(userRes.data)
      setIsEditingAge(false)
      setIsEditingGender(false)
    } catch (err) {
      console.error(err)
    }
  }

  const pieData = [
    { name: 'Solved', value: solvedCount },
    { name: 'Remaining', value: Math.max(totalProblems - solvedCount, 0) },
  ]

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white py-10 px-6">
      {loading || !currentUser ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0FA]"></div>
        </div>
      ) : (
        <>
          {/* Welcome Header with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-10 relative"
          >
            <button
              onClick={() => window.history.back()}
              className="absolute right-0 top-0 bg-[#0FA] text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-center">
              Welcome,{' '}
              <span className="text-[#0FA]">
                {currentUser?.firstName.charAt(0).toUpperCase() +
                  currentUser?.firstName.slice(1)}
              </span>
              <br />
              <span className="text-xl md:text-2xl font-medium flex items-center justify-center gap-2 mt-2">
                Thanks for being an active user of{' '}
                <span>
                  Code<span className="text-[#0FA]">Ash</span>
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Main Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* USER DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              <div className="space-y-2 text-gray-300 text-base">
                <p>
                  <span className="text-gray-500">Name:</span>{' '}
                  {currentUser?.firstName
                    ? currentUser.firstName.charAt(0).toUpperCase() +
                      currentUser.firstName.slice(1)
                    : ''}
                  {currentUser?.lastName
                    ? ' ' +
                      currentUser.lastName.charAt(0).toUpperCase() +
                      currentUser.lastName.slice(1)
                    : ''}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  {currentUser?.emailId}
                </p>

                {/* AGE */}
                {isEditingAge ? (
                  <form
                    onSubmit={handleUpdate}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter Age"
                      value={formData.age}
                      onChange={handleChange}
                      className="bg-[#222] border border-[#333] px-2 py-1 text-white rounded "
                    />
                    <button
                      type="submit"
                      className="text-sm text-black bg-[#0FA] px-3 py-1 rounded hover:bg-[#0c8] cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAge(false)}
                      className="text-sm px-2 text-red-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <p>
                    <span className="text-gray-500">Age:</span>{' '}
                    {currentUser?.age ?? 'Not Set'}{' '}
                    <button
                      className="text-sm text-blue-400 ml-2 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, age: currentUser.age || '' })
                        setIsEditingAge(true)
                      }}
                    >
                      Edit
                    </button>
                  </p>
                )}

                {/* GENDER */}
                {isEditingGender ? (
                  <form
                    onSubmit={handleUpdate}
                    className="flex gap-2 items-center mt-2"
                  >
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="bg-[#222] border border-[#333] px-2 py-1 text-white rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      type="submit"
                      className="text-sm text-black bg-[#0FA] px-3 py-1 rounded hover:bg-[#0c8] cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingGender(false)}
                      className="text-sm px-2 text-red-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <p>
                    <span className="text-gray-500">Gender:</span>{' '}
                    {currentUser?.gender ?? 'Not Set'}{' '}
                    <button
                      className="text-sm text-blue-400 ml-2 cursor-pointer"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          gender: currentUser.gender || '',
                        })
                        setIsEditingGender(true)
                      }}
                    >
                      Edit
                    </button>
                  </p>
                )}

                <p>
                  <span className="text-gray-500">Role:</span>{' '}
                  {currentUser?.role === 'admin' ? 'Admin 👑' : 'User'}
                </p>
              </div>
            </motion.div>

            {/* PIE CHART */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                Problem Solving Progress
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#0FA"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center mt-4 text-sm text-gray-300">
                {solvedCount}/{totalProblems} Problems Solved
              </p>
            </motion.div>
          </div>

          {/* SOLVED PROBLEMS LIST */}
          {currentUser?.problemSolved?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-lg max-w-4xl mx-auto mt-10"
            >
              <h2 className="text-xl font-semibold mb-4">Solved Problems</h2>
              <ul className="space-y-2 list-disc pl-6 text-green-400 text-sm">
                {currentUser.problemSolved.map((problem) => (
                  <li key={problem._id}>
                    <a
                      href={`/problem/${problem._id}`}
                      className="hover:underline hover:text-[#0FA] transition"
                    >
                      {problem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default ProfilePage
