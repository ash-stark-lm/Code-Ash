import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

const actions = [
  {
    label: 'Create Problem',
    icon: <Plus className="w-6 h-6 text-green-400" />,
    route: '/admin/create-problem',
    bg: 'bg-green-950/50 hover:bg-green-900/60',
  },
  {
    label: 'Update Problem',
    icon: <Pencil className="w-6 h-6 text-yellow-400" />,
    route: '/admin/update-problem', // ✅ fixed
    bg: 'bg-yellow-900/50 hover:bg-yellow-800/60',
  },
  {
    label: 'Delete Problem',
    icon: <Trash2 className="w-6 h-6 text-red-400" />,
    route: '/admin/delete-problem', // ✅ fixed
    bg: 'bg-red-900/50 hover:bg-red-800/60',
  },
]

const AdminPanel = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-10">
        {/* Logo with Icon */}
        <div
          className="flex items-center gap-2 text-2xl font-semibold cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Terminal className="text-[#0FA] drop-shadow-lg" size={28} />
          <span>
            Code<span className="text-[#0FA]">Ash</span>
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-center">
          Welcome <span className="text-[#0FA]">Admin</span>
          <br />
          <span className="text-xl md:text-2xl font-medium flex items-center justify-center gap-2">
            Thanks for shaping the future of
            <span>
              Code<span className="text-[#0FA]">Ash</span>
            </span>
          </span>
        </h1>
      </motion.div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16 justify-center">
        {actions.map(({ label, icon, route, bg }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(route)}
            className={`cursor-pointer ${bg} backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl transition`}
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-center">{label}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AdminPanel
