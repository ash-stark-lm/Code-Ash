//Authenticate user like verify jwt token and check if user is blocked or not

import redisClient from '../config/redis.js'
import User from '../models/users.js'

//admin can create both another admin or another user

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).send({ message: 'Invalid Token' })
    }
    const payload = User.verifyJWT(token)
    const { _id } = payload
    if (!_id) {
      return res.status(401).send({ message: 'Invalid Token' })
    }
    const isBlocked = await redisClient.get(`token: ${token}`)

    if (isBlocked) {
      return res.status(401).send({ message: 'Unauthorized' })
    }
    if (payload.role !== 'admin') {
      throw new Error('Cannot access this route')
    }
    const admin = await User.findById(_id)
    if (!admin) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    req.result = admin

    next()
  } catch (error) {
    console.log('Auth Error:', error)
    return res.status(403).send({
      success: false,
      message: error.message || 'Authentication failed. Please login again.',
    })
  }
}

export default adminMiddleware
