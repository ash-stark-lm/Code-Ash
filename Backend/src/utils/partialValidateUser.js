import validator from 'validator'

function partialValidUser(data) {
  // Email (if provided)
  if (
    data.emailId &&
    (typeof data.emailId !== 'string' || !validator.isEmail(data.emailId))
  ) {
    throw new Error('Email is not valid')
  }

  // First name (if provided)
  if (
    data.firstName &&
    (typeof data.firstName !== 'string' ||
      data.firstName.length < 3 ||
      data.firstName.length > 20)
  ) {
    throw new Error('First name should be between 3 and 20 characters')
  }

  // Last name (if provided)
  if (
    data.lastName &&
    (typeof data.lastName !== 'string' ||
      data.lastName.length < 3 ||
      data.lastName.length > 20)
  ) {
    throw new Error('Last name should be between 3 and 20 characters')
  }

  // Age (if provided)
  if (
    data.age !== undefined &&
    (typeof data.age !== 'number' || data.age < 14 || data.age > 100)
  ) {
    throw new Error('Age should be between 14 and 100')
  }

  // Gender (if provided)
  if (
    data.gender &&
    (typeof data.gender !== 'string' ||
      !['male', 'female', 'other'].includes(data.gender))
  ) {
    throw new Error('Gender should be male, female or other')
  }

  // Password (if provided)
  if (data.password) {
    if (typeof data.password !== 'string') {
      throw new Error('Password must be a string')
    }

    const passwordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    }

    if (!validator.isStrongPassword(data.password, passwordOptions)) {
      throw new Error(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character.'
      )
    }
  }

  return true
}

export default partialValidUser
