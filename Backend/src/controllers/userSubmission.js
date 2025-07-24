//submit the code in database
import Problem from '../models/problems.js'
import Submission from '../models/submission.js'

import {
  getLanguageId,
  submitBatch,
  submitToken,
} from '../utils/problemsUtils.js'
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id

    const problemId = req.params.id
    const { userCode, language } = req.body
    if (!userId || !problemId || !userCode || !language) {
      return res.status(400).send('Missing required fields')
    }
    //Fetch the problem from database
    const problem = await Problem.findById(problemId)
    //Now we can have hiddenTestCases
    //store the code in db first->pending then send to judge 0 so that even if judge0 not worked we still have the code

    const ref = problem.referenceSolution.find((r) => r.language === language)

    if (!ref || !ref.header || !ref.main) {
      return res.status(400).send('Missing reference solution parts')
    }

    const code = `${ref.header}${userCode}${ref.main}`.trim()

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesTotal: problem.hiddenTestCases.length,
      status: 'pending',
    })

    //Submit Code to Judge0

    const languageId = getLanguageId(language)

    const submissions = problem.hiddenTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }))

    const submitResult = await submitBatch(submissions)

    const resultToken = submitResult.map((s) => s.token)

    const testResult = await submitToken(resultToken)

    let testCasesPassed = 0
    let runTime = 0
    let memory = 0
    let status = 'accepted'
    let errMsg = null
    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++
        runTime = runTime + parseFloat(test.time)
        memory = Math.max(memory, test.memory)
      } else {
        if (test.status_id == 4) {
          status = 'Wrong Answer'
          errMsg = test.stderr
          break
        } else {
          status = 'error'
          errMsg = test.stderr
          break
        }
      }
    }

    //store the result in database

    submittedResult.testCasesPassed = testCasesPassed
    submittedResult.runTime = runTime
    submittedResult.memory = memory
    submittedResult.status = status
    submittedResult.errMsg = errMsg
    await submittedResult.save() //save the result to database

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId)
      await req.result.save()
    }
    const accepted = status == 'accepted'

    res.status(201).json({
      accepted,
      totalTestCases: problem.hiddenTestCases.length,
      passedTestCases: testCasesPassed,
      runtime: runTime,
      memory,
      errMsg,
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    })
  }
}

//No need to save in database
const runCode = async (req, res) => {
  try {
    const userId = req.result._id
    const problemId = req.params.id
    const { userCode, language } = req.body

    if (!userId || !problemId || !userCode || !language) {
      return res.status(400).send('Missing required fields')
    }

    const problem = await Problem.findById(problemId)
    const languageId = getLanguageId(language)

    const ref = problem.referenceSolution.find((r) => r.language === language)

    if (!ref || !ref.header || !ref.main) {
      return res.status(400).send('Missing reference solution parts')
    }

    const code = `${ref.header}${userCode}${ref.main}`.trim()

    const submissions = problem.visibleTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }))

    const submitResult = await submitBatch(submissions)
    const resultToken = submitResult.map((s) => s.token)
    const testResult = await submitToken(resultToken)

    let passedTestCases = 0
    let runtime = 0
    let memory = 0
    let errMsg = null
    let firstFailedCase = null

    for (let i = 0; i < testResult.length; i++) {
      const test = testResult[i]
      if (test.status_id === 3) {
        passedTestCases++
        runtime += parseFloat(test.time || 0)
        memory = Math.max(memory, test.memory || 0)
      } else {
        errMsg =
          test.stderr || test.compile_output || test.message || 'Error occurred'

        firstFailedCase = {
          index: i + 1,
          input: problem.visibleTestCases[i].input,
          expected: problem.visibleTestCases[i].output,
          actual: test.stdout || '',
          status: test.status?.description || 'Failed',
          message: errMsg,
        }

        break // stop at first failed case
      }
    }

    const totalTestCases = problem.visibleTestCases.length
    const passed = passedTestCases === totalTestCases

    res.status(200).json({
      passed,
      totalTestCases,
      passedTestCases,
      runtime,
      memory,
      errMsg,
      failedCase: firstFailedCase, // include this
    })
  } catch (error) {
    res.status(500).json({
      passed: false,
      totalTestCases: 0,
      passedTestCases: 0,
      runtime: 0,
      memory: 0,
      errMsg: error.message || 'Unknown error',
    })
  }
}

export { submitCode, runCode }
