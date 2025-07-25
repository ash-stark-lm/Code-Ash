import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { User, Terminal, Settings, LogOut, UserPen } from 'lucide-react'
import { motion } from 'framer-motion'
import { logoutUser } from '../authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import LoadingOverlay from '../components/LoadingOverlay'

const TypingCodeBlock = lazy(() => import('../components/TypingCodeBlock'))
const HerbyShowcase = lazy(() => import('../components/HerbyShowcase'))
const HomePage = function () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [selectedLang, setSelectedLang] = useState('cpp')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef()
  console.log('re render')

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }
  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-5 border-b border-[#1f1f1f] bg-[#0e0e0e]/80 backdrop-blur">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Terminal className="text-[#0FA] drop-shadow-lg" size={28} />
          <span>
            Code<span className="text-[#0FA]">Ash</span>
          </span>
        </div>
        <div className="flex items-center gap-10 text-gray-300">
          <Link to="/problems" className="hover:text-white">
            Problems
          </Link>
          <Link to="/visualizer" className="hover:text-white">
            DSA Visualizer
          </Link>
        </div>

        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
            <User className="text-white" />
          </button>
          {user?.firstName && (
            <div className="mt-1 text-xs text-white/70">
              {user.firstName.toUpperCase()}
            </div>
          )}

          <div className="absolute right-0 mt-2 w-44 bg-[#111] border border-[#333] rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
            {user?.role === 'admin' && (
              <div className="relative group/admin">
                <button
                  onClick={() => {
                    navigate('/admin')
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#222] transition cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </button>
              </div>
            )}
            <button
              onClick={handleProfile}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#222] transition cursor-pointer"
            >
              <UserPen className="w-4 h-4 mr-2" />
              View Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#222] transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 overflow-hidden bg-[#0e0e0e]">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#0FA] rounded-full blur-3xl opacity-25 animate-pulse" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0FA]/30 rounded-full blur-2xl opacity-20 animate-pulse" />
        </div>

        <div className="flex flex-col gap-6 z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#0FA] rounded-md shadow-lg shadow-[#0FA]/50" />
            <span className="text-sm px-3 py-1 border border-[#0FA] text-[#0FA] rounded-full bg-white/5 backdrop-blur">
              Latest Updates
            </span>
            <span className="text-gray-400 text-sm">New algorithms added</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Master <span className="text-[#0FA]">Data</span>
            <br />
            Structures & <br />
            <span className="text-[#0FA]">Algorithms</span>
          </h1>

          <p className="text-gray-400 text-lg mt-2">
            Practice, visualize, and master coding challenges.
          </p>

          <ul className="text-sm text-gray-400 space-y-2 mt-4">
            <li>✅ Track your Progress</li>
            <li>
              ⚡ Visualize algorithms with step-by-step animations like never
              before
            </li>
            <li>🧠 Instant AI-powered hints & solutions</li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 1,
            opacity: { duration: 0.8 },
            y: { duration: 0.8 },
          }}
          className="relative w-full max-w bg-[#0e1a1a] border border-[#0FA]/20 rounded-xl shadow-lg overflow-hidden z-10 
             hover:shadow-[0_0_60px_#0FA] transition-all duration-400"
        >
          <div className="flex items-center gap-2 p-3 bg-[#122222] border-b border-[#0FA]/10">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <pre className="p-4 text-sm font-mono text-white leading-relaxed">
            <code>
              <span className="text-green-400"># Two Sum Problem</span>
              {'\n'}
              <span className="text-gray-400">
                # Given an array of integers, return indices of two numbers
              </span>
              {'\n\n'}
              <span className="text-yellow-400">def</span>{' '}
              <span className="text-cyan-400">twoSum</span>
              <span className="text-white">(nums, target):</span>
              {'\n    '}hashmap <span className="text-white">= </span>
              <span className="text-yellow-400">{}</span>
              {'\n    '}
              <span className="text-yellow-400">for</span> i, num{' '}
              <span className="text-yellow-400">in</span>{' '}
              <span className="text-cyan-400">enumerate</span>(nums):
              {'\n        '}complement <span className="text-white">=</span>{' '}
              target - num
              {'\n        '}
              <span className="text-yellow-400">if</span> complement{' '}
              <span className="text-yellow-400">in</span> hashmap:
              {'\n            '}return [hashmap[complement], i]
              {'\n        '}hashmap[num] = i{'\n\n'}
              <span className="text-green-400"># Test</span>
              {'\n'}
              nums = [2, 7, 11, 15], target = 9{'\n'}
              Output: [0, 1]
            </code>
          </pre>
        </motion.div>
      </section>

      <Suspense
        fallback={<div className="text-center py-10">Loading Herby...</div>}
      >
        <HerbyShowcase />
      </Suspense>

      <section className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-black/80 rounded-t-xl border-t border-[#1f1f1f] min-h-screen">
        <div className="bg-[#111] p-6 rounded-xl shadow-md border border-[#1f1f1f] h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">1. Two Sum</h2>
              <span className="text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full text-sm">
                Easy
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span>🕒 15 min</span>
              <span>🧠 O(n)</span>
              <span>⚡ O(n)</span>
            </div>

            <div className="text-sm text-gray-300 leading-relaxed space-y-4">
              <p>
                Given an array of integers <code className="px-1">nums</code>{' '}
                and an integer <code className="px-1">target</code>, return{' '}
                indices of the two numbers such that they add up to target .
              </p>

              <p>
                You may assume that each input would have{' '}
                <strong>exactly one solution</strong>, and you may not use the
                same element twice.
              </p>

              <div>
                <p className="font-semibold text-white mb-5">Example 1:</p>
                <pre className="bg-[#111] p-3 rounded text-sm text-gray-300 border border-[#333]">
                  {`Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9`}
                </pre>
              </div>

              <div>
                <p className="font-semibold mt-5 text-white">Constraints:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>2 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>-10⁹ ≤ target ≤ 10⁹</li>
                  <li>Only one valid answer exists.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl shadow-md border border-[#1f1f1f] h-full flex flex-col justify-between">
          <div className="flex justify-between mb-2 text-gray-400 text-sm ml-4">
            <span>
              {selectedLang === 'cpp'
                ? 'solution.cpp'
                : selectedLang === 'python'
                ? 'solution.py'
                : 'Solution.java'}
            </span>
          </div>
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="text-center py-4">
                  <LoadingOverlay />
                </div>
              }
            >
              <TypingCodeBlock lang={selectedLang} setLang={setSelectedLang} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-[#0e0e0e] text-white py-20 px-6 flex flex-col lg:flex-row items-center justify-between lg:space-x-16 max-w-7xl mx-auto">
        {/* Left Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-2xl -ml-20">
          {/* Glowing "Must Try" Badge */}
          <div className="bg-[#0FA] text-black text-sm font-bold px-4 py-1 rounded-full shadow-xl uppercase tracking-wide animate-bounce">
            🔥 Must Try Feature
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Visualize <span className="text-[#0FA]">DSA</span> Like Never Before
          </h2>

          <p className="text-gray-400 text-lg">
            Experience step-by-step algorithm visualizations designed to help
            you understand{' '}
            <span className="text-white font-medium">Arrays</span>,{' '}
            <span className="text-white font-medium">Graphs</span>,{' '}
            <span className="text-white font-medium">Trees</span> and more. Our
            visualizer brings complex logic to life with animations and
            interactivity.
          </p>

          <ul className="text-sm text-gray-400 space-y-2 w-full lg:w-auto">
            <li>🧩 See how arrays, stacks, and trees evolve in real-time</li>
            <li>📈 Control animation speed, pause/play each step</li>
            <li>💡 Integrated pseudocode with logic explanations</li>
            <li>🔍 Ideal for beginners and interview prep</li>
          </ul>

          <button
            onClick={() => navigate('/visualizer')}
            className="bg-[#0FA] text-black px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 hover:shadow-[0_0_20px_#0FA] transition cursor-pointer"
          >
            Launch Visualizer Now →
          </button>
        </div>

        {/* Spline Animation */}
        <div className="flex-1 max-w-lg w-full h-[500px] mt-12 lg:mt-0">
          <iframe
            src="https://my.spline.design/particleaibrain-SMMvQLAgQ7bTvzGKWUOjOvdD/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="rounded-xl"
          ></iframe>
        </div>
      </section>
    </div>
  )
}
export default React.memo(HomePage)
