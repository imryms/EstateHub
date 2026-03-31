const Appointment = require("../models/Appointment")
const Property = require("../models/Property")

// Create a new appointment (client only)
const createAppointment = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId)

    if (!property) {
      return res.send("Property not found")
    }

    await Appointment.create({
      propertyId: req.params.propertyId,
      clientId: req.session.user._id,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      note: req.body.note,
    })

    res.redirect("/appointments/myAppointments")
  } catch (error) {
    console.error("Error creating appointment:", error.message)
    res.send("Error creating appointment")
  }
}

// Show all appointments for the logged-in user
const myAppointment = async (req, res) => {
  try {
    let appointments

    if (req.session.user.role === "client") {
      appointments = await Appointment.find({
        clientId: req.session.user._id,
      }).populate("propertyId")
    } else if (req.session.user.role === "owner") {
      const properties = await Property.find({
        ownerId: req.session.user._id,
      })

      const propertyIds = properties.map((property) => property._id)

      appointments = await Appointment.find({
        propertyId: { $in: propertyIds },
      })
        .populate("propertyId")
        .populate("clientId")
    }

    res.render("appointments/index", {
      appointments,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error getting appointments:", error.message)
  }
}

// Show single appointment
const showAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("propertyId")
      .populate("clientId")

    if (!appointment) {
      return res.send("Appointment not found")
    }

    if (req.session.user.role === "client") {
      if (appointment.clientId._id.toString() !== req.session.user._id.toString()) {
        return res.send("Not allowed")
      }
    }

    if (req.session.user.role === "owner") {
      if (appointment.propertyId.ownerId.toString() !== req.session.user._id.toString()) {
        return res.send("Not allowed")
      }
    }

    res.render("appointments/show", {
      appointment,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error showing appointment details:", error.message)
    res.send("Error loading appointment details")
  }
}

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.send("Appointment not found")
    }

    if (req.session.user.role === "client") {
      if (appointment.clientId.toString() !== req.session.user._id.toString()) {
        return res.send("Not allowed")
      }
    }

    await Appointment.findByIdAndDelete(req.params.id)

    res.redirect("/appointments/myAppointments")
  } catch (error) {
    console.error("Error deleting appointment:", error.message)
    res.send("Error deleting appointment")
  }
}

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("propertyId")

    if (!appointment) {
      return res.send("Appointment not found")
    }

    if (req.session.user.role === "owner") {
      if (appointment.propertyId.ownerId.toString() !== req.session.user._id.toString()) {
        return res.send("Not allowed")
      }

      appointment.status = req.body.status
      await appointment.save()

      return res.redirect("/appointments/myAppointments")
    }

    if (req.session.user.role === "client") {
      if (appointment.clientId.toString() !== req.session.user._id.toString()) {
        return res.send("Not allowed")
      }

      appointment.startDateTime = req.body.startDateTime
      appointment.endDateTime = req.body.endDateTime
      appointment.note = req.body.note

      await appointment.save()

      return res.redirect("/appointments/myAppointments")
    }

    res.send("Something went wrong")
  } catch (error) {
    console.error("Error updating appointment:", error.message)
    res.send("Error updating appointment")
  }
}

const getNewAppointmentPage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId)

    if (!property) {
      return res.send("Property not found")
    }

    res.render("appointments/new", {
      property,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error loading new appointment page:", error.message)
    res.send("Error loading page")
  }
}

const getEditAppointmentPage = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("propertyId")

    if (!appointment) {
      return res.send("Appointment not found")
    }

    if (appointment.clientId.toString() !== req.session.user._id.toString()) {
      return res.send("Not allowed")
    }

    res.render("appointments/edit", {
      appointment,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error loading edit appointment page:", error.message)
    res.send("Error loading page")
  }
}

module.exports = {
  createAppointment,
  myAppointment,
  showAppointmentDetails,
  deleteAppointment,
  updateAppointment,
  getNewAppointmentPage,
  getEditAppointmentPage
}
