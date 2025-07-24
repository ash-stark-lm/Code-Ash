// utils/languageUtils.js
import axios from 'axios'
import 'dotenv/config'
const languages = [
  { id: 105, name: 'c++' },
  { id: 103, name: 'c' },
  { id: 91, name: 'java' },
  { id: 102, name: 'javaScript' },
  { id: 100, name: 'python' },
]

const getLanguageId = (lang) => {
  if (!lang || typeof lang !== 'string') return null

  const result = languages.find(
    (language) => language.name.toLowerCase() === lang.toLowerCase()
  )
  return result ? result.id : null
}

//creating a batched submission
const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false',
    },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST,
      'Content-Type': 'application/json',
    },
    data: {
      submissions,
    },
  }

  try {
    const response = await axios.request(options)

    // Validate response structure
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response structure from Judge0')
    }

    return response.data
  } catch (error) {
    console.error('Judge0 submitBatch error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })
    throw new Error(`Failed to submit to Judge0: ${error.message}`)
  }
}

const waiting = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(','), //converted array to string comma seperated
      base64_encoded: 'false',
      fields: '*',
    },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST,
    },
  }

  async function fetchData() {
    try {
      const response = await axios.request(options)
      return response.data
    } catch (error) {
      // console.error(error)
    }
  }

  while (true) {
    const result = await fetchData()
    const isResultObtained = result.submissions.every(
      (item) => item.status_id > 2
    ) //returns true if all tokens have status >2
    if (isResultObtained) {
      return result.submissions
    }

    //wait for 1 seconds before checking again
    await waiting(1)
  }
}

export { getLanguageId, submitBatch, submitToken }
