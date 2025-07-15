import React from 'react'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RunResultPanel = ({ runResults, running }) => {
  if (running) {
    return (
      <div className="flex items-center gap-2 text-white text-sm mt-4">
        <Loader2 className="animate-spin w-4 h-4 text-white" />
        <span>Running code...</span>
      </div>
    )
  }

  if (!runResults) {
    return (
      <p className="text-gray-400 mt-4 text-sm">
        No run yet. Run your code to see results.
      </p>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        key="run-result"
        className="mt-4 text-sm text-white bg-[#2A2D2E] p-4 rounded-lg border border-[#3A3D3E] space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 font-semibold">
          {runResults.passed ? (
            <>
              <CheckCircle className="text-green-400 w-4 h-4" />
              <span className="text-green-400">
                Passed all {runResults.totalTestCases} test case(s)
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="text-yellow-400 w-4 h-4" />
              <span className="text-yellow-400">
                Passed {runResults.passedTestCases} /{' '}
                {runResults.totalTestCases}
              </span>
            </>
          )}
        </div>

        {!runResults.passed && runResults.failedCase && (
          <div>
            <p className="text-red-400 font-semibold">
              ❌ Failed Test Case #{runResults.failedCase.index}
            </p>
            <p className="text-gray-400 mt-2">📥 Input:</p>
            <pre className="bg-[#2A2D2E] p-2 rounded-md">
              {runResults.failedCase.input}
            </pre>

            <p className="text-gray-400 mt-2">✅ Expected:</p>
            <pre className="bg-[#2A2D2E] p-2 rounded-md text-green-400">
              {runResults.failedCase.expected}
            </pre>

            <p className="text-gray-400 mt-2">🧾 Your Output:</p>
            <pre className="bg-[#2A2D2E] p-2 rounded-md text-red-400">
              {runResults.failedCase.actual || 'No output'}
            </pre>

            {runResults.failedCase.message && (
              <>
                <p className="text-gray-400 mt-2">⚠️ Error:</p>
                <pre className="bg-[#2A2D2E] p-2 rounded-md text-orange-400">
                  {runResults.failedCase.message}
                </pre>
              </>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default RunResultPanel
