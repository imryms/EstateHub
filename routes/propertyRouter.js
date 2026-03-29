const express = require("express")
const User = require("../models/User.js")
const Property = require("../models/Property.js")
const router = express.Router()

const { isLoggedIn, isOwner } = require("../middleware/index")

const propertyController = require("../controllers/propertyController.js")

router.get("/", propertyController.getAllProperties)
router.get("/:id", propertyController.getPropertyById)
router.post("/", propertyController.createProperty)
router.put("/:id", propertyController.updatePropertyById)
router.delete("/:id", propertyController.deletePropertyById)
module.exports = router
