const Appointment = require("../models/Appointment")
const Property = require("../models/Property")

// Create a new appointment (client only)
const createAppointment = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId)

    if(!property){
      return res.status(404).send("Property not found")
    }

    const { startDateTime, endDateTime, note } = req.body

    const appointment = await Appointment.create({
      propertyId: req.params.propertyId,
      clientId: req.session.user._id,
      startDateTime,
      endDateTime,
      note
    })

    res.send(appointment)

  } catch (error) {
    console.error("Error creating appointment:", error.message)
    res.status(500).send("Something went wrong")
  }
}

// Show all appointments for the logged-in user
const myAppointment = async (req, res) => {
  try {
    let appointments = []

    if (req.session.user.role === "client"){
      appointments = await Appointment.find({ clientId: req.session.user._id}).populate("propertyId")
    }

    else if (req.session.user.role === "owner") {
      const ownerProperties = await Property.find({
        ownerId: req.session.user._id,
      }).select("_id")
      const propertyIds = ownerProperties.map((property) => property._id)

      appointments = await Appointment.find({
        propertyId: { $in: propertyIds },
      })
        .populate("propertyId")
        .populate("clientId", "name email phoneNumber")
    }
    else {
      return res.status(403).send("Access denied")
    }
    res.send(appointments)
  } catch (error) {
    console.error("Error showing appointments:", error.message)
    res.status(500).send("Something went wrong")
  }
}

// Show single appointment
const showAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("propertyId")
      .populate("clientId", "name email phoneNumber")

    if (!appointment) {
      return res.status(404).send("Appointment not found")
    }

    const clientAppointment =
      appointment.clientId._id.toString() === req.session.user._id.toString()

    const ownerAppointment =
      appointment.propertyId.ownerId.toString() ===
      req.session.user._id.toString()

    if (!clientAppointment && !ownerAppointment) {
      return res.status(403).send("Access denied")
    }

    res.send(appointment)

  } catch (error) {
    console.error("Error showing appointment:", error.message)
    res.status(500).send("Something went wrong")
  }
}

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("propertyId")

    if (!appointment) {
      return res.status(404).send("Appointment not found")
    }

    if (appointment.propertyId.ownerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Access denied")
    }

    const allowedStatus = ["confirmed", "cancelled", "completed"]

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).send("Invalid status")
    }

    appointment.status = req.body.status

    await appointment.save()

    res.send(appointment)

  } catch (error) {
    console.error("Error updating appointment status:", error.message)
    res.status(500).send("Something went wrong")
  }
}

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("propertyId")

    if (!appointment) {
      return res.status(404).send("Appointment not found")
    }

    const isClient = appointment.clientId.toString() === req.session.user._id.toString()
    const isOwner = appointment.propertyId.ownerId.toString() === req.session.user._id.toString()

    if (!isClient && !isOwner) {
      return res.status(403).send("Access denied")
    }

    await Appointment.findByIdAndDelete(req.params.id)

    res.send("Appointment deleted successfully")
  } catch (error) {
    console.error("Error deleting appointment:", error.message)
    res.status(500).send("Something went wrong")
  }
}

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).send("Appointment not found")
    }

    if (appointment.clientId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Access denied")
    }

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res.status(400).send("Cannot edit a cancelled or completed appointment")
    }

    const { startDateTime, endDateTime, note } = req.body

    appointment.startDateTime = startDateTime || appointment.startDateTime
    appointment.endDateTime = endDateTime || appointment.endDateTime
    appointment.note = note || appointment.note
    appointment.status = "pending"


    await appointment.save()

    res.send(appointment)
  } catch (error) {
    console.error("Error updating appointment:", error.message)
    res.status(500).send("Something went wrong")
  }
}

module.exports = {
  createAppointment,
  myAppointment,
  showAppointmentDetails,
  updateAppointmentStatus,
  deleteAppointment,
  updateAppointment
}
