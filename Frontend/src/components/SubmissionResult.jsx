import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import LoadingOverlay from './LoadingOverlay'

const SubmissionResult = ({
  submitting,
  submissionResults,
  hasSubmissions,
}) => {
  if (submitting) return <LoadingOverlay />

  return (
    <div className="relative text-sm text-white">
      {!hasSubmissions && <p className="text-gray-400">No submissions yet.</p>}

      <AnimatePresence>
        {submissionResults && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Status */}
            <motion.div
              className="flex items-center gap-2 font-bold text-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {submissionResults.passed ? (
                <>
                  <CheckCircle className="text-green-400 w-5 h-5" />
                  <span className="text-green-400">Accepted</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400 w-5 h-5" />
                  <span className="text-red-400">Rejected</span>
                </>
              )}
            </motion.div>

            {/* Summary */}
            <motion.div
              className="bg-[#2A2D2E] p-4 rounded-md space-y-2 border border-[#3A3D3E]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p>
                🧪 Passed: {submissionResults.summary.passedTestCases} /{' '}
                {submissionResults.summary.totalTestCases}
              </p>
              <p>⚡ Runtime: {submissionResults.summary.runtime.toFixed(3)}s</p>
              <p>
                📦 Memory:{' '}
                {(submissionResults.summary.memory / 1024).toFixed(2)} KB
              </p>
            </motion.div>

            {/* Error */}
            {submissionResults.errMsg && (
              <motion.div
                className="bg-[#331C1C] border border-red-600 p-4 rounded-md text-red-400 whitespace-pre-wrap font-mono flex items-start gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="break-all">{submissionResults.errMsg}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SubmissionResult
