const User = require("../models/User")
const Property = require("../models/Property")
const Appointment = require("../models/Appointment")


const getMyProfile = async(req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId).select("-password")

    if(!user){
      return res.status(404).send("User not found")
    }

    let properties = []
    let appointments = []

    if (user.role === "owner") {
      properties = await Property.find({ ownerId: user._id })
    }

    if (user.role === "client") {
      appointments = await Appointment.find({ clientId: user._id }).populate("propertyId")
    }

    res.render("users/profile", {
      user,
      properties,
      appointments,
    })


  } catch (error) {
    console.error("Error loading profile:", error.message)
    res.status(500).send("Something went wrong")
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (req.params.id !== req.session.user._id.toString()) {
      return res.status(403).send("Access denied")
    }

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
  properties = await Property.find({ ownerId: user._id })

  const ownerPropertyIds = properties.map((property) => property._id)

  appointments = await Appointment.find({
    propertyId: { $in: ownerPropertyIds }
  })
    .populate("propertyId")
    .populate("clientId")
  }

  if (user.role === "client") {
    appointments = await Appointment.find({ clientId: user._id }).populate("propertyId")
  }

    return res.send(data)

  } catch (error) {
    console.error("Error finding user:", error.message)
    return res.status(500).send("Something went wrong")
  }
}

module.exports = {
  getMyProfile,
  getUserById
}
