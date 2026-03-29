const express = require("express")
const router = express.Router()

const { isLoggedIn, isClient } = require('../middleware/index')

const appointmentController = require('../controllers/appointmentController')


router.post("/:propertyId", isLoggedIn, isClient, appointmentController.createAppointment)
router.get("/myAppointments",isLoggedIn, appointmentController.myAppointment)
router.get("/:id", isLoggedIn, appointmentController.showAppointmentDetails)


module.exports = router
