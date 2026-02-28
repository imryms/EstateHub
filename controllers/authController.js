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

const logInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.send(
        'No user has been registered with that email. Please sign up!'
      )
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!validPassword) {
      return res.send('Incorrect password! Please try again.')
    }

    req.session.user = {
      email: user.email,
      _id: user._id,
      role: user.role
    }

    req.session.save(() => {
      res.send(`Thanks for signing in, ${user.name}!`)
    })

  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

module.exports = {
  registerUser,
  logInUser
}
