import bcrypt from 'bcrypt'
async function Hashing(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)
  return hashedPass
}

export default Hashing
