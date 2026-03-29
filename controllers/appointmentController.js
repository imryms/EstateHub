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

module.exports = {
  createAppointment
}
