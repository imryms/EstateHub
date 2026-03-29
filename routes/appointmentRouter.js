const express = require("express")
const router = express.Router()

const { isLoggedIn, isClient } = require('../middleware/index')

const appointmentController = require('../controllers/appointmentController')


router.post("/:propertyId", isLoggedIn, isClient, appointmentController.createAppointment)

module.exports = router
