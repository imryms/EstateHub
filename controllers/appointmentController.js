const User = require("../models/User")
const Appointment = require("../models/Appointment")
const Property = require("../models/Property")

// Create a new appointment (client only)

const createAppointment = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId)

    if(!property){
      return res.status(404).send("Property not found")
    }
    const appointmentData = {
      ... req.body,
      propertyId: req.params.propertyId
    }
    const appointment = await Appointment.create(appointmentData)
    res.send(appointment)


  } catch (error) {
    console.error("Error creating appointment:", error.message)
  }
}

// Show all appointments for the logged-in user
const myAppointment = async (req, res) => {
  try {
    let appointments

    if (req.session.user.role === "client"){
      appointments = await Appointment.find({ clientId: req.session.user._id}).populate("propertyId")
    }
  else {
      const ownerProperties = await Property.find({
        ownerId: req.session.user._id,
      })
      const propertyIds = ownerProperties.map((property) => property._id)

      appointments = await Appointment.find({
        propertyId: { $in: propertyIds },
      })
        .populate("propertyId")
        .populate("clientId", "name email phoneNumber")
    }

    res.send(appointments)

  } catch (error) {
    console.error("Error showing appointments:", error.message)
  }
}

module.exports = {
  createAppointment,
  myAppointment
}
