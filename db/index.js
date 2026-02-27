const mongoose = require('mongoose')

const connect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI)

    mongoose.connection.on("connected", () => {
      console.log(`😍 Successfully connected to MongoDB database . . . `)
    })
  } catch (error) {
    console.log("😒 Error connecting to MongoDB . . . ")
    console.log(error)
  }
}

connect()

module.exports = mongoose
