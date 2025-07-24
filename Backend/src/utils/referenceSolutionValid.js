import { getLanguageId, submitBatch, submitToken } from './problemsUtils.js'

const validReferenceSolution = async (
  referenceSolution,
  visibleTestCases = [],
  hiddenTestCases = []
) => {
  try {
    const allTestCases = [...visibleTestCases, ...hiddenTestCases]

    for (const solution of referenceSolution) {
      const { language, header, functionSignature, main } = solution
      const languageId = getLanguageId(language)

      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`)
      }

      // Construct complete code (remove extra whitespace)

      let source_code = ''

      if (header && header.trim() !== '') {
        source_code = `${header}\n${functionSignature}\n${main}`.trim()
      } else {
        source_code = `${functionSignature}\n${main}`.trim()
      }
      // Prepare submissions
      const submissions = allTestCases.map(({ input, output }) => ({
        source_code,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }))

      // Submit to Judge0 with error handling
      const submitResult = await submitBatch(submissions)

      if (!submitResult || !Array.isArray(submitResult)) {
        //console.error('Invalid submitBatch response:', submitResult)
        throw new Error('Judge0 submission failed')
      }

      // Extract tokens safely
      const tokens = submitResult.map((s) => s?.token).filter(Boolean)
      if (tokens.length !== submitResult.length) {
        //console.error('Missing tokens in response:', submitResult)
        throw new Error('Invalid tokens received')
      }

      // Get test results
      const testResults = await submitToken(tokens)

      // Validate all test cases passed
      const allPassed = testResults.every((test) => {
        if (test.status?.id !== 3) {
          // 3 = accepted
          /* console.error('Test failed:', {
            status: test.status,
            stderr: test.stderr,
            compile_output: test.compile_output,
          })*/
          return false
        }
        return true
      })

      if (!allPassed) return false
    }

    return true
  } catch (error) {
    //console.error('Validation failed:', error.message)
    throw error // Re-throw for the controller to handle
  }
}

export default validReferenceSolution
