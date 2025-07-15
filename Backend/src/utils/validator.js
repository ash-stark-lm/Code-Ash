import validator from 'validator'

const validateUser = (data) => {
  const mandatoryFields = ['firstName', 'emailId', 'password']

  const allPresent = mandatoryFields.every((key) =>
    Object.keys(data).includes(key)
  )
  if (!allPresent) {
    throw new Error('Mandatory fields are missing')
  }

  if (!validator.isEmail(data.emailId)) {
    throw new Error('Email is not valid')
  }

  if (data.firstName.length < 3 || data.firstName.length > 20) {
    throw new Error('First name should be between 3 and 20 characters')
  }

  const passwordOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }

  if (!validator.isStrongPassword(data.password, passwordOptions)) {
    throw new Error(
      'Password should be at least 8 characters and include at least one lowercase letter, one uppercase letter, and one symbol'
    )
  }

  return true
}

export default validateUser
