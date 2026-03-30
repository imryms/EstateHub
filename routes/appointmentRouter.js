const express = require("express")
const router = express.Router()

const { isLoggedIn, isClient } = require("../middleware/index")
const appointmentController = require("../controllers/appointmentController")

router.get("/myAppointments", isLoggedIn, appointmentController.myAppointment)
router.get("/:propertyId/new", isLoggedIn, isClient, appointmentController.getNewAppointmentPage)
router.get("/:id/edit", isLoggedIn, isClient, appointmentController.getEditAppointmentPage)

router.post("/:propertyId", isLoggedIn, isClient, appointmentController.createAppointment)
router.get("/:id", isLoggedIn, appointmentController.showAppointmentDetails)
router.put("/:id", isLoggedIn, appointmentController.updateAppointment)
router.delete("/:id", isLoggedIn, appointmentController.deleteAppointment)

module.exports = router
