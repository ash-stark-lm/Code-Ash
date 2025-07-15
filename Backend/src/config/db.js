import mongoose from 'mongoose'
import 'dotenv/config'

async function dbConnection() {
  try {
    const URL = process.env.DB_CONNECT_KEY
    await mongoose.connect(URL)
    //console.log('Connected to DB')
  } catch (error) {
    //console.log('Db connection Error: ' + error)
  }
}

export default dbConnection
