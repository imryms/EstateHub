const User = require("../models/User")
const Property = require("../models/Property")
const Appointment = require("../models/Appointment")

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).send("User not found")
    }

    let data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    if (user.role === "owner") {
      const properties = await Property.find({ ownerId: user._id })
      data.properties = properties
    }

    if (user.role === "client") {
      const appointments = await Appointment.find({ clientId: user._id }).populate("propertyId")

      data.appointments = appointments
    }

    return res.send(data)

  } catch (error) {
    console.error("Error finding user:", error.message)
    return res.status(500).send("Something went wrong")
  }
}

module.exports = {
  getUserById
}
