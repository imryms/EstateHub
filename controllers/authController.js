const bcrypt = require('bcrypt')

const User = require('../models/User.js')

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })

    if (userInDatabase) {
    return res.status(400).send('Email already registered!')
   }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("Passwords must match")
    }

    if (!["owner", "client"].includes(req.body.role)) {
      return res.status(400).send("Invalid role")
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword,
      role: req.body.role
    })
    res.send(`Thanks for signing up!`)
  } catch (error) {
    console.error('An error has occurred registering a user!', error.message)
  }
}



module.exports = {
  registerUser
}
