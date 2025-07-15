import { getLanguageId, submitBatch, submitToken } from './problemsUtils.js'

const validReferenceSolution = async (referenceSolution, visibleTestCases) => {
  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageId(language)

    if (!languageId) {
      throw new Error(
        'Language not supported. Choose from [c++, c, java, python, javaScript]'
      )
    }

    // Prepare submissions for this language
    const submissions = visibleTestCases.map(({ input, output }) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }))

    // Submit to Judge0
    const submitResult = await submitBatch(submissions)
    const tokens = submitResult.map((s) => s.token)
    const testResults = await submitToken(tokens)

    for (const test of testResults) {
      if (test.status?.id !== 3) {
        // console.log('Test failed:', test)
        return false
      }
    }
  }

  return true
}

export default validReferenceSolution
