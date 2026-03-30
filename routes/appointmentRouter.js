const express = require("express")
const router = express.Router()

const { isLoggedIn, isClient } = require('../middleware/index')

const appointmentController = require('../controllers/appointmentController')


router.post("/:propertyId", isLoggedIn, isClient, appointmentController.createAppointment)
router.get("/myAppointments",isLoggedIn, appointmentController.myAppointment)
router.get("/:id", isLoggedIn, appointmentController.showAppointmentDetails)
router.put("/:id", isLoggedIn, isClient, appointmentController.updateAppointment)
router.put("/:id", isLoggedIn, isClient, appointmentController.updateAppointment)
router.delete("/:id", isLoggedIn, appointmentController.deleteAppointment)


module.exports = router
