const express = require("express")
const User = require("../models/User.js")
const Property = require("../models/Property.js")
const router = express.Router()

const { isLoggedIn, isOwner } = require("../middleware/index")

const propertyController = require("../controllers/propertyController.js")

router.get("/", propertyController.getAllProperties)
router.post("/", propertyController.createProperty)

router.get("/all", (req, res) => {
  res.render("./property/all")
})

router.get("/edit", (req, res) => {
  res.render("./property/edit")
})

router.get("/new", (req, res) => {
  res.render("./property/new")
})

router.get("/show", (req, res) => {
  res.render("./property/show")
})
router.put("/:id", propertyController.updatePropertyById)
router.delete("/:id", propertyController.deletePropertyById)
router.get("/:id", propertyController.getPropertyById)
module.exports = router
