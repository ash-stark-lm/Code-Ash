import React from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingOverlay from './LoadingOverlay'

const SubmissionHistory = ({ submissions, onSelect, isLoading }) => {
  // Directly use submissions if it's an array, otherwise use empty array
  const submissionsArray = Array.isArray(submissions) ? submissions : []

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#333]">
      <AnimatePresence>
        {submissionsArray.map((s, idx) => (
          <motion.div
            key={s._id || idx}
            onClick={() => onSelect?.(s)}
            className="bg-[#2A2D2E] border border-[#3A3D3E] rounded-md p-3 text-sm text-white space-y-1 cursor-pointer hover:border-[#0FA]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="flex items-center gap-2 font-medium">
              {s.status === 'accepted' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : s.status === 'Wrong Answer' ? (
                <XCircle className="w-4 h-4 text-red-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              )}
              <span
                className={
                  s.status === 'accepted'
                    ? 'text-green-400'
                    : s.status === 'Wrong Answer'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }
              >
                {s.status}
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {new Date(s.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="text-gray-300">
              🧪 {s.testCasesPassed} / {s.testCasesTotal} passed
            </div>
            <div className="text-gray-300">
              ⚡ Runtime: {s.runTime?.toFixed(3)}s | 📦 Memory:{' '}
              {(s.memory / 1024).toFixed(2)} KB
            </div>
            {s.errorMessage && (
              <div className="bg-[#3a1c1c] mt-2 text-red-300 text-xs p-2 rounded font-mono whitespace-pre-wrap">
                {s.errorMessage}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default SubmissionHistory
